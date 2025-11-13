from cdp_toko.extension import db
from sqlalchemy.orm import Mapped,mapped_column,relationship
from uuid import uuid4,UUID
from datetime import date



class UserCdp(db.Model):
    id:Mapped[UUID] = mapped_column(default=uuid4(), primary_key=True)
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
    id:Mapped[UUID] = mapped_column(default=uuid4, primary_key=True)
    name:Mapped[str] = mapped_column(db.String(60))
    phone:Mapped[str] = mapped_column(db.String(15),nullable=True)
    email:Mapped[str] = mapped_column(db.Text,nullable=True)
    joined_date:Mapped[date] = mapped_column(db.Date)
    addresses:Mapped[list[Address]] = relationship(back_populates="customer")
    def to_dict(self,include_child:bool=False):
        if(include_child):
            return {
                'id': self.id,
                'name': self.name,
                'phone':self.phone,
                'email':self.email,
                'joined_date': str(self.joined_date),
                'addresses':[i.to_dict() for i in self.addresses]
            }
        else:
            return {
                'id': self.id,
                'name': self.name,
                'phone':self.phone,
                'email':self.email,
                'joined_date': str(self.joined_date)
            }
    
class Address(db.Model):
    id:Mapped[UUID] =  mapped_column(default=uuid4, primary_key=True)
    address:Mapped[str] = mapped_column(db.String(60))
    kategori:Mapped[str] = mapped_column(db.String(60))
    longitude:Mapped[float] = mapped_column(db.Float,nullable=True)
    latitude:Mapped[float] = mapped_column(db.Float,nullable=True)
    phone:Mapped[str] = mapped_column(db.String(15),nullable=True)
    customer_id:Mapped[UUID] = mapped_column(db.ForeignKey(Customer.id))
    services:Mapped[list[Service]] = relationship(back_populates="address")
    def to_dict(self,include_child:bool=False):
        if(include_child):
            return {
                "id":self.id,
                "address":self.address,
                "kategori":self.kategori,
                "phone":self.phone,
                "latitude":self.latitude,
                "longtitude":self.longitude,
                "services":[i.to_dict() for i in self.services]
            }
        else:
            return {
                "id":self.id,
                "address":self.address,
                "kategori":self.kategori,
                "phone":self.phone,
                "latitude":self.latitude,
                "longtitude":self.longitude
            }
        
class Service(db.Model):
    id:Mapped[UUID] = mapped_column(default=uuid4, primary_key=True)
    service_date:Mapped[date] = mapped_column(db.Date)
    complaint:Mapped[str] = mapped_column(db.Text)
    action_taken:Mapped[str] = mapped_column(db.Text)
    result:Mapped[str] = mapped_column(db.Text)
    documentation:Mapped[str] = mapped_column(db.Text,nullable=True)
    address_id:Mapped[UUID] = mapped_column(db.ForeignKey(Address.id))
    def to_dict(self):
        return {
            "id":self.id,
            "service_date":str(self.service_date),
            "complaint":self.complaint,
            "action_taken":self.action_taken,
            "result":self.result,
            "documentation":self.documentation
        }
    

        








# class Product(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(64))
#     price = db.Column(db.Integer)
#     discount_price = db.Column(db.Integer)
#     image_url = db.Column(db.String(64))
#     description = db.Column(db.Text)

# class TrialApi(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(120))
#     city = db.Column(db.String(120))

# class MyCart(db.Model):
    # id = db.Column(db.Integer, primary_key=True)
    # username = db.Column(db.String(60))
    # item_id = db.Column(db.Integer)
    # item_qty = db.Column(db.Integer)