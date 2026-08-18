from uuid import UUID

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import select,or_
from datetime import datetime, timedelta

from cdp_toko.extension import db
from cdp_toko.models.inventory import Product, StockMovement


stock_movements_bp = Blueprint(
    "stock_movements",
    __name__,
    url_prefix="/api/stock-movements",
)


# =========================================================
# CREATE STOCK MOVEMENT
# =========================================================

@stock_movements_bp.post("/")
@jwt_required()
def create_stock_movement():
    data = request.get_json() or {}

    product_id = data.get("product_id")
    quantity_change = data.get("quantity_change")
    reason = data.get("reason")
    created_at = data.get("created_at")

    # -------------------------
    # Product ID
    # -------------------------

    if not product_id:
        return jsonify({
            "error": "product_id is required."
        }), 400

    try:
        product_uuid = UUID(str(product_id))
    except (ValueError, TypeError, AttributeError):
        return jsonify({
            "error": "Product ID must be a valid UUID."
        }), 400

    product = db.session.get(Product, product_uuid)

    if not product:
        return jsonify({
            "error": "Product not found."
        }), 404

    # -------------------------
    # Quantity change
    # -------------------------

    if quantity_change is None:
        return jsonify({
            "error": "quantity_change is required."
        }), 400

    if isinstance(quantity_change, bool):
        return jsonify({
            "error": "quantity_change must be a valid integer."
        }), 400

    try:
        quantity_change = int(quantity_change)
    except (TypeError, ValueError):
        return jsonify({
            "error": "quantity_change must be a valid integer."
        }), 400

    if quantity_change == 0:
        return jsonify({
            "error": "quantity_change cannot be zero."
        }), 400

    # -------------------------
    # Reason
    # -------------------------

    if not isinstance(reason, str):
        return jsonify({
            "error": "Reason must be a string."
        }), 400

    reason = reason.strip()

    if not reason:
        return jsonify({
            "error": "Reason cannot be empty."
        }), 400

    if len(reason) > 120:
        return jsonify({
            "error": "Reason cannot exceed 120 characters."
        }), 400

    # -------------------------
    # Movement date
    # -------------------------

    if not created_at:
        return jsonify({
            "error": "created_at is required."
        }), 400

    if not isinstance(created_at, str):
        return jsonify({
            "error": "created_at must be a valid ISO 8601 datetime."
        }), 400

    try:
        created_at = datetime.fromisoformat(created_at)
    except ValueError:
        return jsonify({
            "error": "created_at must be a valid ISO 8601 datetime."
        }), 400

    # -------------------------
    # Get current stock
    # -------------------------

    latest_movement = (
        StockMovement.query
        .filter_by(product_id=product.id)
        .order_by(
            StockMovement.created_at.desc(),
            StockMovement.id.desc(),
        )
        .first()
    )

    if latest_movement:
        if created_at < latest_movement.created_at:
            return jsonify({
                "error": "Movement date cannot be earlier than the latest stock movement.",
                "latest_movement_date": latest_movement.created_at.isoformat(),
            }), 400

    quantity_before = (
        latest_movement.quantity_after
        if latest_movement
        else 0
    )

    # -------------------------
    # Calculate new quantity
    # -------------------------

    quantity_after = quantity_before + quantity_change

    if quantity_after < 0:
        return jsonify({
            "error": "Stock quantity cannot become negative.",
            "current_quantity": quantity_before,
            "quantity_change": quantity_change,
        }), 400

    # -------------------------
    # Create movement
    # -------------------------

    movement = StockMovement(
        product_id=product.id,
        quantity_before=quantity_before,
        quantity_change=quantity_change,
        quantity_after=quantity_after,
        reason=reason,
        created_at=created_at,
    )

    db.session.add(movement)
    db.session.commit()

    return jsonify({
        "message": "Stock movement created.",
        "data": movement.to_dict(),
        "product_quantity": quantity_after,
    }), 201

# =========================================================
# GET ALL STOCK MOVEMENTS
# =========================================================


@stock_movements_bp.get("/")
@jwt_required()
def get_stock_movements():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)

    search = request.args.get("search", "").strip()
    product_id = request.args.get("product_id")
    movement_type = request.args.get("movement_type", "").strip().lower()
    date_from = request.args.get("date_from", "").strip()
    date_to = request.args.get("date_to", "").strip()

    # ---------------------------------------------
    # PAGINATION
    # ---------------------------------------------

    page = max(page, 1)
    per_page = min(max(per_page, 1), 100)

    query = (
        db.select(StockMovement)
        .join(StockMovement.product)
        .order_by(
            StockMovement.created_at.desc(),
            StockMovement.id.desc(),
        )
    )

    # ---------------------------------------------
    # SEARCH
    # ---------------------------------------------

    if search:
        pattern = f"%{search}%"

        query = query.where(
            or_(
                Product.name.ilike(pattern),
                Product.sku.ilike(pattern),
                StockMovement.reason.ilike(pattern),
            )
        )

    # ---------------------------------------------
    # PRODUCT FILTER
    # ---------------------------------------------

    if product_id:
        try:
            product_uuid = UUID(product_id)
        except (ValueError, TypeError, AttributeError):
            return jsonify({
                "error": "Product ID must be a valid UUID."
            }), 400

        query = query.where(
            StockMovement.product_id == product_uuid
        )

    # ---------------------------------------------
    # MOVEMENT TYPE
    # ---------------------------------------------

    if movement_type:
        if movement_type == "inbound":
            query = query.where(
                StockMovement.quantity_change > 0
            )
        elif movement_type == "outbound":
            query = query.where(
                StockMovement.quantity_change < 0
            )
        else:
            return jsonify({
                "error": "Movement type must be inbound or outbound."
            }), 400

    # ---------------------------------------------
    # DATE FROM
    # ---------------------------------------------

    if date_from:
        try:
            parsed_date_from = datetime.fromisoformat(date_from)
        except ValueError:
            return jsonify({
                "error": "date_from must be a valid ISO date or datetime."
            }), 400

        query = query.where(
            StockMovement.created_at >= parsed_date_from
        )

    # ---------------------------------------------
    # DATE TO
    # ---------------------------------------------

    if date_to:
        try:
            parsed_date_to = datetime.fromisoformat(date_to)

            # If only a date was supplied, include the whole day.
            if "T" not in date_to:
                parsed_date_to += timedelta(days=1)
        except ValueError:
            return jsonify({
                "error": "date_to must be a valid ISO date or datetime."
            }), 400

        query = query.where(
            StockMovement.created_at < parsed_date_to
        )

    # ---------------------------------------------
    # EXECUTE PAGINATION
    # ---------------------------------------------

    pagination = db.paginate(
        query,
        page=page,
        per_page=per_page,
        error_out=False,
    )

    return jsonify({
        "data": [
            movement.to_dict()
            for movement in pagination.items
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


# =========================================================
# GET STOCK MOVEMENT
# =========================================================

@stock_movements_bp.get("/<uuid:movement_id>")
@jwt_required()
def get_stock_movement(movement_id):
    movement = db.session.get(
        StockMovement,
        movement_id,
    )

    if not movement:
        return jsonify({
            "error": "Stock movement not found."
        }), 404

    return jsonify({
        "data": movement.to_dict()
    }), 200


# =========================================================
# GET MOVEMENTS FOR PRODUCT
# =========================================================

@stock_movements_bp.get("/product/<uuid:product_id>")
@jwt_required()
def get_product_stock_movements(product_id):
    product = db.session.get(
        Product,
        product_id,
    )

    if not product:
        return jsonify({
            "error": "Product not found."
        }), 404

    movements = db.session.execute(
        select(StockMovement)
        .where(
            StockMovement.product_id == product_id
        )
        .order_by(
            StockMovement.created_at.desc()
        )
    ).scalars().all()

    return jsonify({
        "product_id": str(product.id),
        "product_quantity": product.quantity,
        "data": [
            movement.to_dict()
            for movement in movements
        ]
    }), 200


# =========================================================
# UPDATE STOCK MOVEMENT
# =========================================================

@stock_movements_bp.put("/<uuid:movement_id>")
@jwt_required()
def update_stock_movement(movement_id):
    movement = db.session.get(StockMovement, movement_id)

    if not movement:
        return jsonify({
            "error": "Stock movement not found."
        }), 404

    product = db.session.get(Product, movement.product_id)

    if not product:
        return jsonify({
            "error": "Product not found."
        }), 404

    data = request.get_json() or {}

    # QUANTITY CHANGE
    if "quantity_change" in data:
        quantity_change = data["quantity_change"]

        if isinstance(quantity_change, bool):
            return jsonify({
                "error": "Quantity change must be a valid integer."
            }), 400

        try:
            quantity_change = int(quantity_change)
        except (TypeError, ValueError):
            return jsonify({
                "error": "Quantity change must be a valid integer."
            }), 400

        if quantity_change == 0:
            return jsonify({
                "error": "Quantity change cannot be zero."
            }), 400
    else:
        quantity_change = movement.change

    # REASON
    if "reason" in data:
        reason = data["reason"]

        if not isinstance(reason, str):
            return jsonify({
                "error": "Reason must be a string."
            }), 400

        reason = reason.strip()

        if not reason:
            return jsonify({
                "error": "Reason cannot be empty."
            }), 400

        if len(reason) > 255:
            return jsonify({
                "error": "Reason cannot exceed 255 characters."
            }), 400
    else:
        reason = movement.reason

    # Reverse the old movement and apply the new movement.
    new_quantity = movement.quantity_before + quantity_change

    if new_quantity < 0:
        return jsonify({
            "error": "Stock quantity cannot become negative.",
            "current_quantity": product.quantity,
            "old_change": movement.change,
            "new_change": quantity_change,
        }), 400

    # product.quantity = new_quantity
    movement.quantity_change = quantity_change
    movement.quantity_after = new_quantity
    movement.reason = reason

    db.session.commit()

    return jsonify({
        "message": "Stock movement updated.",
        "data": movement.to_dict(),
        # "product_quantity": product.quantity,
    }), 200

# =========================================================
# DELETE STOCK MOVEMENT
# =========================================================


@stock_movements_bp.delete("/<uuid:movement_id>")
@jwt_required()
def delete_stock_movement(movement_id):
    movement = db.session.get(
        StockMovement,
        movement_id,
    )

    if not movement:
        return jsonify({
            "error": "Stock movement not found."
        }), 404

    # Find the latest movement for this product
    latest_movement = db.session.execute(
        select(StockMovement)
        .where(
            StockMovement.product_id == movement.product_id
        )
        .order_by(
            StockMovement.created_at.desc(),
            StockMovement.id.desc(),
        )
        .limit(1)
    ).scalar_one_or_none()

    # Only the latest movement can be deleted
    if latest_movement and latest_movement.id != movement.id:
        return jsonify({
            "error": (
                "Only the latest stock movement can be deleted."
            )
        }), 400

    db.session.delete(movement)
    db.session.commit()

    return jsonify({
        "message": "Stock movement deleted."
    }), 200