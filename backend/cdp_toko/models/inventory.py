from cdp_toko.extension import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import uuid4, UUID
from datetime import datetime


product_suppliers = db.Table(
    "product_suppliers",
    db.Column(
        "product_id",
        db.ForeignKey("product.id"),
        primary_key=True,
    ),
    db.Column(
        "supplier_id",
        db.ForeignKey("supplier.id"),
        primary_key=True,
    ),
)


class Product(db.Model):
    id: Mapped[UUID] = mapped_column(
        default=uuid4,
        primary_key=True,
    )

    name: Mapped[str] = mapped_column(
        db.String(120),
        nullable=False,
    )

    sku: Mapped[str] = mapped_column(
        db.String(60),
        unique=True,
        nullable=False,
    )

    unit: Mapped[str] = mapped_column(
        db.String(30),
        nullable=False,
    )

    price_per_unit: Mapped[float] = mapped_column(
        db.Numeric(12, 2),
        nullable=False,
        default=0,
    )

    selling_price_per_unit: Mapped[float] = mapped_column(
        db.Numeric(12, 2),
        nullable=False,
        default=0,
    )

    category_id: Mapped[UUID] = mapped_column(
        db.ForeignKey("category.id"),
        nullable=False,
    )

    category: Mapped["Category"] = relationship(
        back_populates="products",
    )

    suppliers: Mapped[list["Supplier"]] = relationship(
        secondary=product_suppliers,
        back_populates="products",
    )

    stock_movements: Mapped[list["StockMovement"]] = relationship(
        back_populates="product",
        order_by="StockMovement.created_at",
        cascade="all, delete-orphan",
    )

    @property
    def quantity(self) -> int:
        """Current stock quantity."""
        if not self.stock_movements:
            return 0

        return self.stock_movements[-1].quantity_after

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "sku": self.sku,
            "quantity": self.quantity,
            "unit": self.unit,
            "price_per_unit": float(self.price_per_unit),
            "selling_price_per_unit": float(self.selling_price_per_unit),
            "category_id": str(self.category_id),
            "category_name": (
                self.category.name
                if self.category
                else None
            ),
            "suppliers": [
                {
                    "id": str(supplier.id),
                    "name": supplier.name,
                }
                for supplier in self.suppliers
            ],
        }


class Category(db.Model):
    id: Mapped[UUID] = mapped_column(
        default=uuid4,
        primary_key=True,
    )

    name: Mapped[str] = mapped_column(
        db.String(60),
        unique=True,
        nullable=False,
    )

    products: Mapped[list["Product"]] = relationship(
        back_populates="category",
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "product_count": len(self.products),
        }


class Supplier(db.Model):
    id: Mapped[UUID] = mapped_column(
        default=uuid4,
        primary_key=True,
    )

    name: Mapped[str] = mapped_column(
        db.String(120),
        nullable=False,
        unique=True,
    )

    contact_person: Mapped[str] = mapped_column(
        db.String(120),
        nullable=True,
    )

    phone: Mapped[str] = mapped_column(
        db.String(40),
        nullable=True,
    )

    email: Mapped[str] = mapped_column(
        db.String(120),
        nullable=True,
    )

    products: Mapped[list["Product"]] = relationship(
        secondary=product_suppliers,
        back_populates="suppliers",
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "contact_person": self.contact_person,
            "phone": self.phone,
            "email": self.email,
            "product_count": len(self.products),
        }


from sqlalchemy import Boolean,false

class StockMovement(db.Model):
    id: Mapped[UUID] = mapped_column(
        default=uuid4,
        primary_key=True,
    )

    product_id: Mapped[UUID] = mapped_column(
        db.ForeignKey("product.id"),
        nullable=False,
        index=True,
    )

    quantity_before: Mapped[int] = mapped_column(
        nullable=False,
    )

    quantity_change: Mapped[int] = mapped_column(
        nullable=False,
    )

    quantity_after: Mapped[int] = mapped_column(
        nullable=False,
    )

    reason: Mapped[str] = mapped_column(
        db.String(120),
        nullable=False,
    )

    from_sales: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default=false(),
    )

    created_at: Mapped[datetime] = mapped_column(
        nullable=False,
        index=True,
    )

    product: Mapped["Product"] = relationship(
        back_populates="stock_movements",
    )

    def to_dict(self):
        latest_movement = (
            StockMovement.query
            .filter_by(product_id=self.product_id)
            .order_by(
                StockMovement.created_at.desc(),
                StockMovement.id.desc(),
            )
            .first()
        )

        is_latest = bool(
            latest_movement
            and self.id == latest_movement.id
        )

        can_modify = is_latest and not self.from_sales

        return {
            "id": str(self.id),
            "product_id": str(self.product_id),
            "product_name": self.product.name,
            "product_sku": self.product.sku,
            "quantity_before": self.quantity_before,
            "quantity_change": self.quantity_change,
            "quantity_after": self.quantity_after,
            "reason": self.reason,
            "from_sales": self.from_sales,
            "created_at": self.created_at.isoformat(),
            "can_edit": can_modify,
            "can_delete": can_modify,
        }