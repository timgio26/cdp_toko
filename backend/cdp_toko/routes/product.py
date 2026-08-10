from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from cdp_toko.extension import db
from cdp_toko.models.inventory import Product

products_bp = Blueprint("products", __name__, url_prefix="/api/products")

@products_bp.get("/")
@jwt_required()
def list_products():
    products = Product.query.all()
    return jsonify([p.to_dict() for p in products]), 200

@products_bp.post('/')
@jwt_required()
def create_product():
    data = request.json
    product = Product(
        name=data['name'],
        sku=data['sku'],
        quantity=data.get('quantity', 0),
        category_id=data.get('category_id'),
        supplier_id=data.get('supplier_id')
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201

@products_bp.put('/<uuid:id>')
@jwt_required()
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.json

    product.name = data.get('name', product.name)
    product.sku = data.get('sku', product.sku)
    product.quantity = data.get('quantity', product.quantity)
    product.category_id = data.get('category_id', product.category_id)
    product.supplier_id = data.get('supplier_id', product.supplier_id)

    db.session.commit()
    return jsonify(product.to_dict()), 200

@products_bp.delete('/api/products/<uuid:id>')
@jwt_required()
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "deleted"}), 200




