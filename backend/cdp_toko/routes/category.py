from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from cdp_toko.extension import db
from cdp_toko.models.inventory import Category
from uuid import UUID

categories_bp = Blueprint("categories", __name__, url_prefix="/api/categories")


@categories_bp.post('/')
@jwt_required()
def create_category():
    data = request.json
    category = Category(name=data['name'])
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201


@categories_bp.get('/')
@jwt_required()
def list_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories]), 200


@categories_bp.put('/<uuid:id>')
@jwt_required()
def update_category(id):
    category = Category.query.get_or_404(id)
    data = request.json

    # Update only provided fields
    category.name = data.get('name', category.name)

    db.session.commit()
    return jsonify(category.to_dict()), 200


@categories_bp.delete('/<uuid:id>')
@jwt_required()
def delete_category(id):
    category = Category.query.get_or_404(id)

    # Optional: prevent deletion if category has products
    if category.products and len(category.products) > 0:
        return jsonify({
            "error": "Category cannot be deleted because it has products."
        }), 400

    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Category deleted"}), 200
