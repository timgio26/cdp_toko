from cdp_toko.extension import db
from sqlalchemy.orm import Mapped,mapped_column,relationship
from uuid import uuid4,UUID
from datetime import datetime

class Product(db.Model):
    id: Mapped[UUID] = mapped_column(default=uuid4, primary_key=True)
    name: Mapped[str] = mapped_column(db.String(120), nullable=False)
    sku: Mapped[str] = mapped_column(db.String(60), unique=True, nullable=False)
    quantity: Mapped[int] = mapped_column(default=0)
    category_id: Mapped[UUID] = mapped_column(db.ForeignKey('category.id'))
    supplier_id: Mapped[UUID] = mapped_column(db.ForeignKey('supplier.id'), nullable=True)

    category: Mapped["Category"] = relationship(back_populates="products")
    supplier: Mapped["Supplier"] = relationship()

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "sku": self.sku,
            "quantity": self.quantity,
            "category_id": self.category_id,
            "supplier_id": self.supplier_id,
        }


class Category(db.Model):
    id: Mapped[UUID] = mapped_column(default=uuid4, primary_key=True)
    name: Mapped[str] = mapped_column(db.String(60), unique=True)

    products: Mapped[list["Product"]] = relationship(back_populates="category")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
        }


class Supplier(db.Model):
    id: Mapped[UUID] = mapped_column(default=uuid4, primary_key=True)
    name: Mapped[str] = mapped_column(db.String(120), nullable=False)
    contact_person: Mapped[str] = mapped_column(db.String(120), nullable=True)
    phone: Mapped[str] = mapped_column(db.String(40), nullable=True)
    email: Mapped[str] = mapped_column(db.String(120), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "contact_person": self.contact_person,
            "phone": self.phone,
            "email": self.email,
        }


class StockMovement(db.Model):
    id: Mapped[UUID] = mapped_column(default=uuid4, primary_key=True)
    product_id: Mapped[UUID] = mapped_column(db.ForeignKey('product.id'))
    change: Mapped[int] = mapped_column()  # + or -
    reason: Mapped[str] = mapped_column(db.String(120))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    product: Mapped["Product"] = relationship()

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "change": self.change,
            "reason": self.reason,
            "created_at": self.created_at.isoformat(),
        }
