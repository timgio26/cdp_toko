from flask import Blueprint,jsonify,request,send_file
from cdp_toko.extension import db
from cdp_toko.models.models import UserCdp,Customer,Address,Service,AddressMerge
from cdp_toko.models.dtos import SignInDTO
from werkzeug.security import generate_password_hash,check_password_hash
from flask_jwt_extended import create_access_token,jwt_required,get_jwt_identity
from uuid import UUID
from sqlalchemy import or_,func
from sqlalchemy.orm import joinedload
import pandas as pd
from io import BytesIO
from sqlalchemy import text
from datetime import date

main_bp = Blueprint('main', __name__)

@main_bp.get('/api/users')
@jwt_required()
def list_users():
    data:list[UserCdp] = UserCdp.query.all()
    return jsonify([i.to_dict() for i in data]),200

@main_bp.delete('/api/users/<id>')
@jwt_required()
def delete_user(id):
    jwt_identity = get_jwt_identity()
    user:UserCdp = UserCdp.query.get(id)
    if user.username == jwt_identity:
        db.session.delete(user)
        db.session.commit()
        return '',204

@main_bp.post('/api/signup')
def create_user():
    new_user = UserCdp(**request.json)
    new_user.password= generate_password_hash(new_user.password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created'}), 201

@main_bp.post('/api/signin')
def authenticate_user():
    data = SignInDTO(**request.json)
    user:UserCdp = UserCdp.query.filter_by(username=data.username).one_or_404()
    if check_password_hash(user.password,data.password):
        token = create_access_token(identity=user.username,expires_delta=False)
        return jsonify({"access_token":token}),200
    
@main_bp.post('/api/customers')
@jwt_required()
def create_customer():
    new_user = Customer(**request.json)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Customer created','id':new_user.id}), 201

@main_bp.get('/api/customers')
@jwt_required()
def get_all_customer():
    # Get pagination parameters from query string
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))  # default 20 items per page
    search = str(request.args.get('search'))

    # Calculate offset
    offset = (page - 1) * per_page
    query = Customer.query.options(joinedload(Customer.addresses))

    # Apply filtering only if search is provided
    if len(search)>0:
        query = query.outerjoin(Address).filter(
            or_(
                Customer.name.contains(f"%{search}%"),
                Customer.phone.contains(f"%{search}%"),
                Address.address.contains(f"%{search}%")
            )
        )

    total = query.count()
    customers = query.offset(offset).limit(per_page).all()
    # customers = Customer.query.offset(offset).limit(per_page).all()
    # customer:list[Customer] = Customer.query.all()
    return {
        "data": [i.to_dict(include_child=True) for i in customers],
        "page": page,
        "per_page": per_page,
        "total": total,
        "total_pages": (total + per_page - 1) // per_page #floor division operator
    }, 200

@main_bp.get('/api/customers/<id>')
@jwt_required()
def get_customer(id):
    customer:Customer = Customer.query.get_or_404(UUID(id))
    return customer.to_dict(include_child=True), 200

@main_bp.put('/api/customers/<id>')
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

@main_bp.delete('/api/customers/<id>')
@jwt_required()
def delete_customer(id):
    customer:Customer = Customer.query.get_or_404(UUID(id))
    db.session.delete(customer)
    db.session.commit()
    return '',204

@main_bp.post('/api/addresses')
@jwt_required()
def create_address():
    data = request.json.copy()
    data['customer_id'] = UUID(data['customer_id'])
    
    new_address = Address(**data)
    db.session.add(new_address)
    db.session.commit()
    return jsonify({'message': 'Address created','id':new_address.id}), 201

@main_bp.get('/api/addresses/<id>')
@jwt_required()
def get_address(id):
    address:Address = Address.query.get_or_404(UUID(id))
    return address.to_dict(), 200

@main_bp.get("/api/addresses/<id>/services")
@jwt_required()
def list_address_services(id):
    address = Address.query.get_or_404(UUID(id))

    page = max(
        request.args.get("page", 1, type=int),
        1,
    )

    per_page = min(
        max(
            request.args.get("per_page", 10, type=int),
            1,
        ),
        100,
    )

    pagination = Service.query.filter(
        Service.address_id == address.id
    ).order_by(
        Service.service_date.desc()
    ).paginate(
        page=page,
        per_page=per_page,
        error_out=False,
    )

    return jsonify({
        "items": [
            service.to_dict()
            for service in pagination.items
        ],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev,
        },
    }), 200

@main_bp.put('/api/addresses/<id>')
@jwt_required()
def update_address(id):
    address:Address = Address.query.get_or_404(UUID(id))
    update_data = Address(**request.json)
    address.address = update_data.address
    address.latitude = update_data.latitude
    address.longitude = update_data.longitude
    address.phone = update_data.phone
    address.kategori = update_data.kategori
    db.session.add(address)
    db.session.commit()
    return address.to_dict(),200

@main_bp.delete('/api/addresses/<id>')
@jwt_required()
def delete_address(id):
    address:Address = Address.query.get_or_404(UUID(id))
    db.session.delete(address)
    db.session.commit()
    return '',204

@main_bp.post('/api/addresses/merge')
@jwt_required()
def merge_address():
    data = AddressMerge(**request.json)
    updated = []
    unused_customer = []
    for i in data.unused_customer_list:
        unused_customer.append(UUID(i))

    for i in data.address_list:
        address:Address = Address.query.get_or_404(UUID(i))
        address.customer_id = UUID(data.customer_id)
        updated.append(address)
    
    db.session.bulk_save_objects(updated)

    delete_customer = Customer.query.filter(Customer.id.in_(unused_customer)).all()

    for customer in delete_customer:
        db.session.delete(customer)

    db.session.commit()
    return jsonify({"status": "success", "updated": len(updated)}), 200

@main_bp.post('/api/services')
@jwt_required()
def create_service():
    data = request.json.copy()
    data['address_id'] = UUID(data['address_id'])
    new_service = Service(**data)
    db.session.add(new_service)
    db.session.commit()
    return jsonify({'message': 'Service created'}), 201

@main_bp.get('/api/services/<id>')
@jwt_required()
def get_service(id):
    service:Service = Service.query.get_or_404(UUID(id))
    return service.to_dict(), 200

@main_bp.put('/api/services/<id>')
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

@main_bp.delete('/api/services/<id>')
@jwt_required()
def delete_service(id):
    service:Service = Service.query.get(UUID(id))
    db.session.delete(service)
    db.session.commit()
    return '',204  

@main_bp.get('/api/download')
@jwt_required()
def download_data():
    # Raw SQL query
    query = """
        SELECT
          customer.id AS customer_id,
          customer.name,
          customer.phone,
          customer.joined_date,
          address.id AS address_id,
          address.address,
          address.kategori,
          address.phone AS address_phone,
          service.id AS service_id,
          service.service_date,
          service.complaint,
          service.action_taken,
          service.result
        FROM customer
        LEFT JOIN address ON customer.id = address.customer_id
        LEFT JOIN service ON address.id = service.address_id;
    """

    # Run query using SQLAlchemy engine
    df = pd.read_sql_query(text(query), db.engine)

    # Write to Excel in memory
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Customers')

    output.seek(0)

    # Return as downloadable file
    return send_file(
        output,
        download_name="customers.xlsx",
        as_attachment=True,
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

@main_bp.get('/api/dashboard')
def get_dashboard():

    # =====================================================
    # BASIC STATS
    # =====================================================

    total_customers = Customer.query.count()
    total_addresses = Address.query.count()
    total_services = Service.query.count()

    # =====================================================
    # DATE HELPERS
    # =====================================================

    today = date.today()
    first_day_of_month = today.replace(day=1)

    # =====================================================
    # SERVICES THIS MONTH
    # =====================================================

    services_this_month = (
        Service.query
        .filter(
            Service.service_date >= first_day_of_month,
            Service.service_date <= today
        )
        .count()
    )

    # =====================================================
    # NEW CUSTOMERS THIS MONTH
    # =====================================================

    new_customers_this_month = (
        Customer.query
        .filter(
            Customer.joined_date >= first_day_of_month,
            Customer.joined_date <= today
        )
        .count()
    )

    # =====================================================
    # MONTHLY SERVICE
    # =====================================================
    today = date.today()

    # First day of the month 11 months ago
    month_number = today.month - 11
    year = today.year

    while month_number <= 0:
        month_number += 12
        year -= 1

    first_day_12_months = date(year, month_number, 1)

    monthly_service_rows = (
        db.session.query(
            func.date_format(
                Service.service_date,
                "%Y-%m"
            ).label("month"),
            func.count(Service.id).label("count")
        )
        .filter(
            Service.service_date >= first_day_12_months,
            Service.service_date <= today
        )
        .group_by(
            func.date_format(
                Service.service_date,
                "%Y-%m"
            )
        )
        .order_by(
            func.date_format(
                Service.service_date,
                "%Y-%m"
            )
        )
        .all()
        )

    services_by_month = [
        {
            "month": month,
            "count": count
        }
        for month, count in monthly_service_rows
    ]

    # =====================================================
    # ADDRESS CATEGORIES
    # =====================================================

    category_rows = (
        db.session.query(
            Address.kategori,
            func.count(Address.id)
        )
        .group_by(Address.kategori)
        .all()
    )

    categories = [
        {
            "name": kategori,
            "count": count
        }
        for kategori, count in category_rows
    ]

    # =====================================================
    # SERVICE RESULTS
    # =====================================================

    result_rows = (
        db.session.query(
            Service.result,
            func.count(Service.id)
        )
        .group_by(Service.result)
        .all()
    )

    service_results = [
        {
            "result": result,
            "count": count
        }
        for result, count in result_rows
    ]

    # =====================================================
    # CUSTOMERS WITHOUT SERVICES
    # =====================================================

    customers_without_services = (
        db.session.query(Customer.id)
        .outerjoin(Address, Address.customer_id == Customer.id)
        .outerjoin(Service, Service.address_id == Address.id)
        .group_by(Customer.id)
        .having(func.count(Service.id) == 0)
        .count()
    )

    # =====================================================
    # ADDRESSES WITHOUT SERVICES
    # =====================================================

    addresses_without_services = (
        db.session.query(Address)
        .outerjoin(Service, Service.address_id == Address.id)
        .filter(Service.id.is_(None))
        .count()
    )

    # =====================================================
    # RECENT SERVICES
    # =====================================================

    recent_services = (
        db.session.query(Service, Address, Customer)
        .join(Address, Service.address_id == Address.id)
        .join(Customer, Address.customer_id == Customer.id)
        .order_by(Service.service_date.desc())
        .limit(5)
        .all()
    )

    recent_services_data = [
        {
            "id": str(service.id),
            "customer": customer.name,
            "address": address.address,
            "date": str(service.service_date),
            "result": service.result
        }
        for service, address, customer in recent_services
    ]

    # =====================================================
    # MOST ACTIVE CUSTOMERS
    # =====================================================

    top_customer_rows = (
        db.session.query(
            Customer.id,
            Customer.name,
            func.count(Service.id).label("service_count")
        )
        .join(Address, Address.customer_id == Customer.id)
        .join(Service, Service.address_id == Address.id)
        .group_by(Customer.id, Customer.name)
        .order_by(func.count(Service.id).desc())
        .limit(5)
        .all()
    )

    top_customers = [
        {
            "id": str(customer_id),
            "name": name,
            "services": service_count
        }
        for customer_id, name, service_count in top_customer_rows
    ]

    # =====================================================
    # RESPONSE
    # =====================================================

    return jsonify({
        "stats": {
            "customers": total_customers,
            "addresses": total_addresses,
            "services": total_services,
            "services_this_month": services_this_month,
            "new_customers_this_month": new_customers_this_month,
        },

        "categories": categories,

        # "service_results": service_results,

        "attention": {
            "customers_without_services": customers_without_services,
            "addresses_without_services": addresses_without_services,
        },

        "recent_services": recent_services_data,

        "top_customers": top_customers,
        "services_by_month": services_by_month
    })