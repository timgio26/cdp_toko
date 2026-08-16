from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from cdp_toko.extension import db
from cdp_toko.models.inventory import Supplier


suppliers_bp = Blueprint(
    "suppliers",
    __name__,
    url_prefix="/api/suppliers"
)


@suppliers_bp.post("/")
@jwt_required()
def create_supplier():
    data = request.get_json() or {}

    name = data.get("name", "").strip()
    contact_person = data.get("contact_person")
    phone = data.get("phone")
    email = data.get("email")

    # Required field
    if not name:
        return jsonify({
            "error": "Supplier name is required."
        }), 400

    # Check duplicate supplier
    existing = Supplier.query.filter_by(name=name).first()

    if existing:
        return jsonify({
            "error": "A supplier with this name already exists."
        }), 409

    supplier = Supplier(
        name=name,
        contact_person=contact_person.strip() if contact_person else None,
        phone=phone.strip() if phone else None,
        email=email.strip() if email else None,
    )

    db.session.add(supplier)
    db.session.commit()

    return jsonify(supplier.to_dict()), 201


@suppliers_bp.get("/")
@jwt_required()
def list_suppliers():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = Supplier.query.order_by(
        Supplier.name.asc()
    ).paginate(
        page=page,
        per_page=per_page,
        error_out=False,
    )

    return jsonify({
        "items": [
            supplier.to_dict()
            for supplier in pagination.items
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


@suppliers_bp.put("/<uuid:id>")
@jwt_required()
def update_supplier(id):
    supplier = Supplier.query.get_or_404(id)

    data = request.get_json() or {}

    # Name
    if "name" in data:
        name = data.get("name", "").strip()

        if not name:
            return jsonify({
                "error": "Supplier name cannot be empty."
            }), 400

        # Don't allow duplicate names
        existing = Supplier.query.filter(
            Supplier.name == name,
            Supplier.id != supplier.id
        ).first()

        if existing:
            return jsonify({
                "error": "A supplier with this name already exists."
            }), 409

        supplier.name = name

    # Optional fields
    if "contact_person" in data:
        contact_person = data.get("contact_person")
        supplier.contact_person = (
            contact_person.strip()
            if contact_person
            else None
        )

    if "phone" in data:
        phone = data.get("phone")
        supplier.phone = (
            phone.strip()
            if phone
            else None
        )

    if "email" in data:
        email = data.get("email")
        supplier.email = (
            email.strip()
            if email
            else None
        )

    db.session.commit()

    return jsonify(supplier.to_dict()), 200


@suppliers_bp.delete("/<uuid:id>")
@jwt_required()
def delete_supplier(id):
    supplier = Supplier.query.get_or_404(id)

    products_count = len(supplier.products)

    if products_count > 0:
        return jsonify({
            "error": (
                "Supplier cannot be deleted because "
                f"it is assigned to {products_count} product(s)."
            )
        }), 400

    db.session.delete(supplier)
    db.session.commit()

    return jsonify({
        "message": "Supplier deleted"
    }), 200