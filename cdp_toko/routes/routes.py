from flask import Blueprint,jsonify,request
from cdp_toko.extension import db
from cdp_toko.models.models import UserCdp,Customer,Address,Service
from cdp_toko.models.dtos import SignInDTO
from werkzeug.security import generate_password_hash,check_password_hash
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
from uuid import UUID

main_bp = Blueprint('main', __name__)

@main_bp.route('/version')
def version():
    return "0.0.1",200

@main_bp.get('/users')
@jwt_required()
def list_users():
    data:list[UserCdp] = UserCdp.query.all()
    return jsonify([i.to_dict() for i in data]),200

@main_bp.delete('/users/<id>')
@jwt_required()
def delete_user(id):
    jwt_identity = get_jwt_identity()
    user:UserCdp = UserCdp.query.get(id)
    if user.username == jwt_identity:
        db.session.delete(user)
        db.session.commit()
        return '',204

@main_bp.post('/signup')
def create_user():
    new_user = UserCdp(**request.json)
    new_user.password= generate_password_hash(new_user.password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created'}), 201

@main_bp.post('/signin')
def authenticate_user():
    data = SignInDTO(**request.json)
    user:UserCdp = UserCdp.query.filter_by(username=data.username).one_or_404()
    if check_password_hash(user.password,data.password):
        token = create_access_token(identity=user.username)
        return jsonify({"access_token":token}),200
    
@main_bp.post('/customers')
@jwt_required()
def create_customer():
    new_user = Customer(**request.json)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Customer created'}), 201

@main_bp.get('/customers')
@jwt_required()
def get_all_customer():
    customer:list[Customer] = Customer.query.all()
    return [i.to_dict(include_child=True) for i in customer], 200

@main_bp.get('/customers/<id>')
@jwt_required()
def get_customer(id):
    customer:Customer = Customer.query.get_or_404(UUID(id))
    return customer.to_dict(include_child=True), 200

@main_bp.put('/customers/<id>')
@jwt_required()
def update_customer(id):
    customer:Customer = Customer.query.get_or_404(UUID(id))
    update_data = Customer(**request.json)
    customer.name = update_data.name
    customer.phone = update_data.phone
    customer.email = update_data.email
    customer.joined_date = update_data.joined_date
    db.session.add(customer)
    db.session.commit()
    return customer.to_dict(),200

@main_bp.delete('/customers/<id>')
@jwt_required()
def delete_customer(id):
    customer:Customer = Customer.query.get_or_404(UUID(id))
    db.session.delete(customer)
    db.session.commit()
    return '',204

@main_bp.post('/addresses')
@jwt_required()
def create_address():
    data = request.json.copy()
    data['customer_id'] = UUID(data['customer_id'])
    
    new_address = Address(**data)
    db.session.add(new_address)
    db.session.commit()
    return jsonify({'message': 'Address created'}), 201

@main_bp.get('/addresses/<id>')
@jwt_required()
def get_address(id):
    address:Address = Address.query.get_or_404(UUID(id))
    return address.to_dict(), 200

@main_bp.put('/addresses/<id>')
@jwt_required()
def update_address(id):
    address:Address = Address.query.get_or_404(UUID(id))
    update_data = Address(**request.json)
    address.address = update_data.address
    address.latitude = update_data.latitude
    address.longitude = update_data.longitude
    address.phone = update_data.phone
    db.session.add(address)
    db.session.commit()
    return address.to_dict(),200


@main_bp.delete('/addresses/<id>')
@jwt_required()
def delete_address(id):
    address:Address = Address.query.get_or_404(UUID(id))
    db.session.delete(address)
    db.session.commit()
    return '',204


@main_bp.post('/services')
@jwt_required()
def create_service():
    data = request.json.copy()
    data['address_id'] = UUID(data['address_id'])
    
    new_service = Service(**data)
    db.session.add(new_service)
    db.session.commit()
    return jsonify({'message': 'Service created'}), 201

@main_bp.get('/services/<id>')
@jwt_required()
def get_service(id):
    service:Service = Service.query.get_or_404(UUID(id))
    return service.to_dict(), 200

@main_bp.put('/services/<id>')
@jwt_required()
def update_service(id):
    service:Service = Service.query.get_or_404(UUID(id))
    update_data = Service(**request.json)
    service.complaint = update_data.complaint
    service.action_taken = update_data.action_taken
    service.result = update_data.result
    service.service_date = update_data.service_date
    service.documentation =update_data.documentation
    db.session.add(service)
    db.session.commit()
    return service.to_dict(),200


@main_bp.delete('/services/<id>')
@jwt_required()
def delete_service(id):
    service:Service = Service.query.get(UUID(id))
    db.session.delete(service)
    db.session.commit()
    return '',204







    

