from cdp_toko.extension import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import uuid4, UUID
from datetime import datetime
from decimal import Decimal
from .inventory import Product


class Sale(db.Model):
    id: Mapped[UUID] = mapped_column(
        default=uuid4,
        primary_key=True,
    )

    invoice_number: Mapped[str] = mapped_column(
        db.String(50),
        index=True,
        unique=True,
        nullable=False,
    )

    customer_id: Mapped[UUID | None] = mapped_column(
        db.ForeignKey("customer.id"),
        nullable=True,
    )

    # Customer snapshot
    customer_name: Mapped[str | None] = mapped_column(
        db.String(60),
        nullable=True,
    )

    customer_phone: Mapped[str | None] = mapped_column(
        db.String(15),
        nullable=True,
    )

    customer_email: Mapped[str | None] = mapped_column(
        db.Text,
        nullable=True,
    )

    # -------------------------
    # Pricing snapshot
    # -------------------------

    subtotal: Mapped[Decimal] = mapped_column(
        db.Numeric(12, 2),
        nullable=False,
    )

    item_discount: Mapped[Decimal] = mapped_column(
        db.Numeric(12, 2),
        nullable=False,
        default=0,
    )

    order_discount: Mapped[Decimal] = mapped_column(
        db.Numeric(12, 2),
        nullable=False,
        default=0,
    )

    tax_amount: Mapped[Decimal] = mapped_column(
        db.Numeric(12, 2),
        nullable=False,
        default=0,
    )

    shipping_fee: Mapped[Decimal] = mapped_column(
        db.Numeric(12, 2),
        nullable=False,
        default=0,
    )

    service_fee: Mapped[Decimal] = mapped_column(
        db.Numeric(12, 2),
        nullable=False,
        default=0,
    )

    total: Mapped[Decimal] = mapped_column(
        db.Numeric(12, 2),
        nullable=False,
    )

    payment_method: Mapped[str] = mapped_column(
        db.String(30),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        db.String(20),
        nullable=False,
        default="completed",
    )

    created_at: Mapped[datetime] = mapped_column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    items: Mapped[list["SaleItem"]] = relationship(
        back_populates="sale",
        cascade="all, delete-orphan",
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "invoice_number": self.invoice_number,

            "customer_id": (
                str(self.customer_id)
                if self.customer_id
                else None
            ),
            "customer_name": self.customer_name,
            "customer_phone": self.customer_phone,
            "customer_email": self.customer_email,

            "subtotal": str(self.subtotal),
            "item_discount": str(self.item_discount),
            "order_discount": str(self.order_discount),
            "tax_amount": str(self.tax_amount),
            "shipping_fee": str(self.shipping_fee),
            "service_fee": str(self.service_fee),
            "total": str(self.total),

            "payment_method": self.payment_method,
            "status": self.status,

            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            ),

            "items": [
                item.to_dict()
                for item in self.items
            ],
        }


class SaleItem(db.Model):
    id: Mapped[UUID] = mapped_column(
        default=uuid4,
        primary_key=True,
    )

    sale_id: Mapped[UUID] = mapped_column(
        db.ForeignKey("sale.id"),
        nullable=False,
        index=True,
    )

    product_id: Mapped[UUID | None] = mapped_column(
        db.ForeignKey("product.id"),
        nullable=True,
        index=True,
    )

    # Product snapshot
    product_name: Mapped[str] = mapped_column(
        db.String(120),
        nullable=False,
    )

    product_sku: Mapped[str] = mapped_column(
        db.String(60),
        nullable=False,
    )

    product_unit: Mapped[str] = mapped_column(
        db.String(30),
        nullable=False,
    )

    quantity: Mapped[int] = mapped_column(
        db.Integer,
        nullable=False,
    )

    unit_price: Mapped[Decimal] = mapped_column(
        db.Numeric(12, 2),
        nullable=False,
    )

    discount_amount: Mapped[Decimal] = mapped_column(
        db.Numeric(12, 2),
        nullable=False,
        default=0,
    )

    sale: Mapped["Sale"] = relationship(
        back_populates="items",
    )

    product: Mapped["Product | None"] = relationship()

    @property
    def gross_total(self) -> Decimal:
        return self.unit_price * self.quantity

    @property
    def total(self) -> Decimal:
        return self.gross_total - self.discount_amount

    def to_dict(self):
        return {
            "id": str(self.id),
            "product_id": (
                str(self.product_id)
                if self.product_id
                else None
            ),
            "product_name": self.product_name,
            "product_sku": self.product_sku,
            "product_unit": self.product_unit,
            "quantity": self.quantity,
            "unit_price": str(self.unit_price),
            "discount_amount": str(self.discount_amount),
            "gross_total": str(self.gross_total),
            "total": str(self.total),
        }

class InvoiceCounter(db.Model):
    __tablename__ = "invoice_counters"

    year = db.Column(
        db.Integer,
        primary_key=True,
    )

    last_number = db.Column(
        db.Integer,
        nullable=False,
        default=0,
    )