from cdp_toko.extension import db
from sqlalchemy.orm import Mapped,mapped_column,relationship
from uuid import uuid4,UUID
from datetime import date

class UserCdp(db.Model):
    id:Mapped[UUID] = mapped_column(default=uuid4, primary_key=True)
    name:Mapped[str] = mapped_column(db.String(60))
    username:Mapped[str] = mapped_column(db.String(60), unique=True)
    password:Mapped[str] = mapped_column(db.String(162))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'username': self.username,
        }
    
class Customer(db.Model):
    id: Mapped[UUID] = mapped_column(
        default=uuid4,
        primary_key=True,
    )

    name: Mapped[str] = mapped_column(
        db.String(60),
        nullable=False,
    )

    phone: Mapped[str] = mapped_column(
        db.String(15),
        nullable=True,
    )

    email: Mapped[str] = mapped_column(
        db.Text,
        nullable=True,
    )

    joined_date: Mapped[date] = mapped_column(
        db.Date,
        nullable=False,
    )

    addresses: Mapped[list["Address"]] = relationship(
        back_populates="customer",
        cascade="all, delete-orphan",
    )

    def to_dict(self, include_child: bool = False):
        data = {
            "id": str(self.id),
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "joined_date": str(self.joined_date),
        }

        if include_child:
            data["addresses"] = [
                address.to_dict()
                for address in self.addresses
            ]

        return data


class Address(db.Model):
    id: Mapped[UUID] = mapped_column(
        default=uuid4,
        primary_key=True,
    )

    address: Mapped[str] = mapped_column(
        db.String(60),
        nullable=False,
    )

    kategori: Mapped[str] = mapped_column(
        db.String(60),
        nullable=False,
    )

    longitude: Mapped[float] = mapped_column(
        db.Float,
        nullable=True,
    )

    latitude: Mapped[float] = mapped_column(
        db.Float,
        nullable=True,
    )

    phone: Mapped[str] = mapped_column(
        db.String(15),
        nullable=True,
    )

    customer_id: Mapped[UUID] = mapped_column(
        db.ForeignKey("customer.id"),
        nullable=False,
        index=True,
    )

    customer: Mapped["Customer"] = relationship(
        back_populates="addresses",
    )

    services: Mapped[list["Service"]] = relationship(
        back_populates="address",
        cascade="all, delete-orphan",
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "address": self.address,
            "kategori": self.kategori,
            "phone": self.phone,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "customer_id": str(self.customer_id),
        }


class Service(db.Model):
    id: Mapped[UUID] = mapped_column(
        default=uuid4,
        primary_key=True,
    )

    service_date: Mapped[date] = mapped_column(
        db.Date,
        nullable=False,
    )

    complaint: Mapped[str] = mapped_column(
        db.Text,
        nullable=True,
    )

    action_taken: Mapped[str] = mapped_column(
        db.Text,
        nullable=False,
    )

    result: Mapped[str] = mapped_column(
        db.Text,
        nullable=True,
    )

    documentation: Mapped[str] = mapped_column(
        db.Text,
        nullable=True,
    )

    address_id: Mapped[UUID] = mapped_column(
        db.ForeignKey("address.id"),
        nullable=False,
        index=True,
    )

    address: Mapped["Address"] = relationship(
        back_populates="services",
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "service_date": str(self.service_date),
            "complaint": self.complaint,
            "action_taken": self.action_taken,
            "result": self.result,
            "documentation": self.documentation,
        }

class AddressMerge():
    def __init__(self,customer_id:str,address_list:list[str],unused_customer_list:list[str]):
        self.customer_id = customer_id
        self.address_list = address_list
        self.unused_customer_list=unused_customer_list

