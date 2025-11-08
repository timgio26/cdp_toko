from cdp_toko.extension import db

class UserCdp(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60))
    username = db.Column(db.String(60), unique=True)
    password = db.Column(db.String(60))

# class MyCart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(60))
    item_id = db.Column(db.Integer)
    item_qty = db.Column(db.Integer)

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60))
    address = db.Column(db.String(60))
    phone = db.Column(db.String(15))
    joined_date = db.Column(db.Date)

class ServiceRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer)
    service_date = db.Column(db.Date)
    complaint = db.Column(db.Text)
    action_taken = db.Column(db.Text)
    result = db.Column(db.Text)
    documentation = db.Column(db.String(120))

# class Product(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(64))
#     price = db.Column(db.Integer)
#     discount_price = db.Column(db.Integer)
#     image_url = db.Column(db.String(64))
#     description = db.Column(db.Text)

# class TrialApi(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    city = db.Column(db.String(120))