from uuid import UUID

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import select

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
    movements = db.session.execute(
        select(StockMovement)
        .order_by(StockMovement.created_at.desc())
    ).scalars().all()

    return jsonify({
        "data": [
            movement.to_dict()
            for movement in movements
        ]
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
    movement = db.session.get(
        StockMovement,
        movement_id,
    )

    if not movement:
        return jsonify({
            "error": "Stock movement not found."
        }), 404

    data = request.get_json() or {}

    old_change = movement.change
    old_product_id = movement.product_id

    # =====================================================
    # PRODUCT
    # =====================================================

    if "product_id" in data:
        try:
            new_product_id = UUID(
                str(data["product_id"])
            )
        except (ValueError, TypeError, AttributeError):
            return jsonify({
                "error": "Product ID must be a valid UUID."
            }), 400

        new_product = db.session.get(
            Product,
            new_product_id,
        )

        if not new_product:
            return jsonify({
                "error": "Product not found."
            }), 404
    else:
        new_product_id = old_product_id
        new_product = db.session.get(
            Product,
            old_product_id,
        )

    # =====================================================
    # CHANGE
    # =====================================================

    if "change" in data:
        new_change = data["change"]

        if isinstance(new_change, bool):
            return jsonify({
                "error": "Change must be a valid integer."
            }), 400

        try:
            new_change = int(new_change)
        except (TypeError, ValueError):
            return jsonify({
                "error": "Change must be a valid integer."
            }), 400

        if new_change == 0:
            return jsonify({
                "error": "Change cannot be zero."
            }), 400
    else:
        new_change = old_change

    # =====================================================
    # REASON
    # =====================================================

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

        if len(reason) > 120:
            return jsonify({
                "error": "Reason cannot exceed 120 characters."
            }), 400
    else:
        reason = movement.reason

    # =====================================================
    # UPDATE QUANTITIES
    # =====================================================

    if new_product_id == old_product_id:
        # Same product:
        #
        # Remove the old movement effect
        # and apply the new movement effect.

        quantity_after_update = (
            new_product.quantity
            - old_change
            + new_change
        )

        if quantity_after_update < 0:
            return jsonify({
                "error": "Stock quantity cannot become negative.",
                "current_quantity": new_product.quantity,
                "old_change": old_change,
                "new_change": new_change,
            }), 400

        new_product.quantity = quantity_after_update

    else:
        # Movement is being moved to another product.
        #
        # First undo the movement on the old product.
        # Then apply it to the new product.

        old_product = db.session.get(
            Product,
            old_product_id,
        )

        old_product_quantity = (
            old_product.quantity - old_change
        )

        if old_product_quantity < 0:
            return jsonify({
                "error": "The old product quantity would become negative."
            }), 400

        if new_product.quantity + new_change < 0:
            return jsonify({
                "error": "The new product quantity cannot become negative.",
                "current_quantity": new_product.quantity,
                "requested_change": new_change,
            }), 400

        old_product.quantity = old_product_quantity
        new_product.quantity += new_change

    # =====================================================
    # UPDATE MOVEMENT
    # =====================================================

    movement.product_id = new_product_id
    movement.change = new_change
    movement.reason = reason

    db.session.commit()

    return jsonify({
        "message": "Stock movement updated.",
        "data": movement.to_dict(),
        "product_quantity": new_product.quantity,
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