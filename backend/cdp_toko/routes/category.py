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


@categories_bp.get("/")
@jwt_required()
def list_categories():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    pagination = Category.query.order_by(
        Category.name.asc()
    ).paginate(
        page=page,
        per_page=per_page,
        error_out=False,
    )

    return jsonify({
        "items": [
            category.to_dict()
            for category in pagination.items
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
