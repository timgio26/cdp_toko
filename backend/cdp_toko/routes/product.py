from decimal import Decimal, InvalidOperation
from uuid import UUID

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import or_

from cdp_toko.extension import db
from cdp_toko.models.inventory import (
    Product,
    Category,
    Supplier,
)


products_bp = Blueprint(
    "products",
    __name__,
    url_prefix="/api/products"
)


# =========================================================
# CREATE PRODUCT
# =========================================================

@products_bp.post("/")
@jwt_required()
def create_product():
    data = request.get_json() or {}

    name = data.get("name", "").strip()
    sku = data.get("sku", "").strip()
    unit = data.get("unit", "").strip()
    # quantity = data.get("quantity", 0)
    price_per_unit = data.get("price_per_unit", 0)
    category_id = data.get("category_id")
    supplier_ids = data.get("supplier_ids", [])

    # -------------------------
    # Required fields
    # -------------------------

    if not name:
        return jsonify({
            "error": "Product name is required."
        }), 400

    if not sku:
        return jsonify({
            "error": "SKU is required."
        }), 400

    if not unit:
        return jsonify({
            "error": "Unit is required."
        }), 400

    if not category_id:
        return jsonify({
            "error": "Category is required."
        }), 400

    # -------------------------
    # Validate SKU
    # -------------------------

    existing_product = Product.query.filter_by(
        sku=sku
    ).first()

    if existing_product:
        return jsonify({
            "error": "A product with this SKU already exists."
        }), 409

    # -------------------------
    # Validate category
    # -------------------------

    try:
        category_id = UUID(category_id)
    except (ValueError, TypeError, AttributeError):
        return jsonify({
            "error": "Category ID must be a valid UUID."
        }), 400

    # -------------------------
    # Validate quantity
    # -------------------------

    # try:
    #     quantity = int(quantity)
    # except (TypeError, ValueError):
    #     return jsonify({
    #         "error": "Quantity must be a valid number."
    #     }), 400

    # if quantity < 0:
    #     return jsonify({
    #         "error": "Quantity cannot be negative."
    #     }), 400

    # -------------------------
    # Validate price
    # -------------------------

    try:
        price_per_unit = Decimal(str(price_per_unit))
    except (InvalidOperation, TypeError, ValueError):
        return jsonify({
            "error": "Price per unit must be a valid number."
        }), 400

    if price_per_unit < 0:
        return jsonify({
            "error": "Price per unit cannot be negative."
        }), 400

    # -------------------------
    # Validate suppliers
    # -------------------------

    if not isinstance(supplier_ids, list):
        return jsonify({
            "error": "supplier_ids must be an array."
        }), 400

    supplier_uuids = []

    for supplier_id in supplier_ids: 
        try: 
            supplier_uuid = UUID(str(supplier_id)) 
        except (ValueError, TypeError, AttributeError): 
            return jsonify({ "error": "One or more supplier IDs must be valid UUIDs." }), 400 

        supplier_uuids.append(supplier_uuid) 
    suppliers = [] 
    if supplier_uuids: 
        suppliers = Supplier.query.filter( Supplier.id.in_(supplier_uuids) ).all() 
        if len(suppliers) != len(set(supplier_uuids)): 
            return jsonify({ "error": "One or more suppliers were not found." }), 404

    # -------------------------
    # Create product
    # -------------------------

    product = Product(
        name=name,
        sku=sku,
        # quantity=quantity,
        unit=unit,
        price_per_unit=price_per_unit,
        category_id=category_id,
        suppliers=suppliers,
    )

    db.session.add(product)
    db.session.commit()

    return jsonify(product.to_dict()), 201


# =========================================================
# LIST PRODUCTS
# =========================================================

@products_bp.get("/")
@jwt_required()
def list_products():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    search = request.args.get("search", "", type=str).strip()

    query = Product.query

    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.sku.ilike(f"%{search}%"),
            )
        )

    pagination = query.order_by(
        Product.name.asc()
    ).paginate(
        page=page,
        per_page=per_page,
        error_out=False,
    )

    return jsonify({
        "items": [
            product.to_dict()
            for product in pagination.items
        ],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "pages": pagination.pages,
            "total": pagination.total,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev,
        },
    }), 200


# =========================================================
# GET SINGLE PRODUCT
# =========================================================

@products_bp.get("/<uuid:id>")
@jwt_required()
def get_product(id):
    product = Product.query.get_or_404(id)

    return jsonify(
        product.to_dict()
    ), 200


# =========================================================
# UPDATE PRODUCT
# =========================================================

@products_bp.put("/<uuid:id>")
@jwt_required()
def update_product(id):
    product = Product.query.get_or_404(id)

    data = request.get_json() or {}

    # -------------------------
    # Name
    # -------------------------

    if "name" in data:
        name = data.get("name", "").strip()

        if not name:
            return jsonify({
                "error": "Product name cannot be empty."
            }), 400

        product.name = name

    # -------------------------
    # SKU
    # -------------------------

    if "sku" in data:
        sku = data.get("sku", "").strip()

        if not sku:
            return jsonify({
                "error": "SKU cannot be empty."
            }), 400

        existing_product = Product.query.filter(
            Product.sku == sku,
            Product.id != product.id
        ).first()

        if existing_product:
            return jsonify({
                "error": "A product with this SKU already exists."
            }), 409

        product.sku = sku

    # -------------------------
    # Quantity
    # -------------------------

    # if "quantity" in data:
    #     try:
    #         quantity = int(data["quantity"])
    #     except (TypeError, ValueError):
    #         return jsonify({
    #             "error": "Quantity must be a valid number."
    #         }), 400

    #     if quantity < 0:
    #         return jsonify({
    #             "error": "Quantity cannot be negative."
    #         }), 400

    #     product.quantity = quantity

    # -------------------------
    # Unit
    # -------------------------

    if "unit" in data:
        unit = data.get("unit", "").strip()

        if not unit:
            return jsonify({
                "error": "Unit cannot be empty."
            }), 400

        product.unit = unit

    # -------------------------
    # Price
    # -------------------------

    if "price_per_unit" in data:
        try:
            price_per_unit = Decimal(
                str(data["price_per_unit"])
            )
        except (InvalidOperation, TypeError, ValueError):
            return jsonify({
                "error": "Price per unit must be a valid number."
            }), 400

        if price_per_unit < 0:
            return jsonify({
                "error": "Price per unit cannot be negative."
            }), 400

        product.price_per_unit = price_per_unit

    # -------------------------
    # Category
    # -------------------------

    category_id = data.get("category_id")

    try:
        category_uuid = UUID(str(category_id))
    except (ValueError, TypeError, AttributeError):
        return jsonify({
            "error": "Category ID must be a valid UUID."
        }), 400

    category = Category.query.get(category_uuid)

    # -------------------------
    # Suppliers
    # -------------------------


    if "supplier_ids" in data:
        supplier_ids = data.get("supplier_ids")

        if not isinstance(supplier_ids, list):
            return jsonify({
                "error": "supplier_ids must be an array."
            }), 400

        supplier_uuids = []

        for supplier_id in supplier_ids:
            try:
                supplier_uuid = UUID(str(supplier_id))
            except (ValueError, TypeError, AttributeError):
                return jsonify({
                    "error": "One or more supplier IDs must be valid UUIDs."
                }), 400

            supplier_uuids.append(supplier_uuid)

        suppliers = []

        if supplier_uuids:
            suppliers = Supplier.query.filter(
                Supplier.id.in_(supplier_uuids)
            ).all()

            if len(suppliers) != len(set(supplier_uuids)):
                return jsonify({
                    "error": "One or more suppliers were not found."
                }), 404

        # Replace existing supplier relationships
        product.suppliers = suppliers



    db.session.commit()

    return jsonify(
        product.to_dict()
    ), 200


# =========================================================
# DELETE PRODUCT
# =========================================================

@products_bp.delete("/<uuid:id>")
@jwt_required()
def delete_product(id):
    product = Product.query.get_or_404(id)

    db.session.delete(product)
    db.session.commit()

    return jsonify({
        "message": "Product deleted"
    }), 200