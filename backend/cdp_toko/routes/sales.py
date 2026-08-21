from flask import Blueprint, jsonify, request,send_file
from flask_jwt_extended import jwt_required
from cdp_toko.extension import db
from uuid import UUID
from decimal import Decimal, InvalidOperation
from cdp_toko.models.sales import Sale, SaleItem,InvoiceCounter
from cdp_toko.models.inventory import Product
from .stock_movement import create_stock_movement_record
import pandas as pd
from io import BytesIO


sales = Blueprint("sales", __name__, url_prefix="/api/sales")


def parse_uuid(value, field_name):
    """Validate and return a UUID."""
    if value is None:
        return None

    try:
        return UUID(str(value))
    except (ValueError, TypeError, AttributeError):
        raise ValueError(f"{field_name} must be a valid UUID")


def parse_decimal(value, field_name, default="0.00"):
    """Validate and return a Decimal with no negative values."""
    if value is None:
        value = default

    try:
        value = Decimal(str(value))
    except (InvalidOperation, ValueError, TypeError):
        raise ValueError(f"{field_name} must be a valid number")

    if value < 0:
        raise ValueError(f"{field_name} cannot be negative")

    return value

from datetime import datetime,timezone,date


def generate_invoice_number():
    year = datetime.now(timezone.utc).year

    counter = db.session.execute(
        db.select(InvoiceCounter)
        .where(InvoiceCounter.year == year)
        .with_for_update()
    ).scalar_one_or_none()

    if counter is None:
        counter = InvoiceCounter(
            year=year,
            last_number=1,
        )

        db.session.add(counter)

        sequence = 1

    else:
        counter.last_number += 1
        sequence = counter.last_number

    return f"INV-{year}-{sequence:06d}"

@sales.post("/")
@jwt_required()
def create_sale():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Request body must be a JSON object"
        }), 400

    # --------------------------------------------------
    # Required fields
    # --------------------------------------------------

    # invoice_number = data.get("invoice_number")
    payment_method = data.get("payment_method")
    items = data.get("items")

    if not payment_method:
        return jsonify({
            "error": "payment_method is required"
        }), 400

    if not isinstance(payment_method, str):
        return jsonify({
            "error": "payment_method must be a string"
        }), 400

    payment_method = payment_method.strip()

    if not payment_method:
        return jsonify({
            "error": "payment_method cannot be empty"
        }), 400

    if len(payment_method) > 30:
        return jsonify({
            "error": "payment_method cannot exceed 30 characters"
        }), 400

    if not isinstance(items, list) or not items:
        return jsonify({
            "error": "items must be a non-empty list"
        }), 400


    try:
        customer_id = parse_uuid(
            data.get("customer_id"),
            "customer_id"
        )

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    customer_name = data.get("customer_name")
    customer_phone = data.get("customer_phone")
    customer_email = data.get("customer_email")

    if customer_name is not None:
        if not isinstance(customer_name, str):
            return jsonify({
                "error": "customer_name must be a string"
            }), 400

        customer_name = customer_name.strip()

        if len(customer_name) > 60:
            return jsonify({
                "error": "customer_name cannot exceed 60 characters"
            }), 400

    if customer_phone is not None:
        if not isinstance(customer_phone, str):
            return jsonify({
                "error": "customer_phone must be a string"
            }), 400

        customer_phone = customer_phone.strip()

        if len(customer_phone) > 15:
            return jsonify({
                "error": "customer_phone cannot exceed 15 characters"
            }), 400

    if customer_email is not None:
        if not isinstance(customer_email, str):
            return jsonify({
                "error": "customer_email must be a string"
            }), 400

        customer_email = customer_email.strip()

        if len(customer_email) > 255:
            return jsonify({
                "error": "customer_email cannot exceed 255 characters"
            }), 400

    # --------------------------------------------------
    # Pricing
    # --------------------------------------------------

    try:
        order_discount = parse_decimal(
            data.get("order_discount"),
            "order_discount"
        )

        tax_amount = parse_decimal(
            data.get("tax_amount"),
            "tax_amount"
        )

        shipping_fee = parse_decimal(
            data.get("shipping_fee"),
            "shipping_fee"
        )

        service_fee = parse_decimal(
            data.get("service_fee"),
            "service_fee"
        )

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    # --------------------------------------------------
    # Items
    # --------------------------------------------------

    subtotal = Decimal("0.00")
    item_discount = Decimal("0.00")

    sale_items = []

    # Prevent the same product being accidentally added
    # multiple times.
    product_ids = set()

    try:
        for index, item in enumerate(items):

            if not isinstance(item, dict):
                return jsonify({
                    "error": f"items[{index}] must be an object"
                }), 400

            # ------------------------------------------
            # Product ID
            # ------------------------------------------

            product_id = item.get("product_id")

            if not product_id:
                return jsonify({
                    "error": f"items[{index}].product_id is required"
                }), 400

            try:
                product_id = parse_uuid(
                    product_id,
                    f"items[{index}].product_id"
                )
            except ValueError as e:
                return jsonify({"error": str(e)}), 400

            if product_id in product_ids:
                return jsonify({
                    "error": (
                        f"Product {product_id} appears more than once"
                    )
                }), 400

            product_ids.add(product_id)

            # ------------------------------------------
            # Quantity
            # ------------------------------------------

            quantity = item.get("quantity")

            if quantity is None:
                return jsonify({
                    "error": f"items[{index}].quantity is required"
                }), 400

            if isinstance(quantity, bool) or not isinstance(quantity, int):
                return jsonify({
                    "error": (
                        f"items[{index}].quantity "
                        "must be an integer"
                    )
                }), 400

            if quantity <= 0:
                return jsonify({
                    "error": (
                        f"items[{index}].quantity "
                        "must be greater than zero"
                    )
                }), 400

            # Optional safety limit
            if quantity > 1_000_000:
                return jsonify({
                    "error": (
                        f"items[{index}].quantity is too large"
                    )
                }), 400

            # ------------------------------------------
            # Unit price
            # ------------------------------------------

            try:
                unit_price = parse_decimal(
                    item.get("unit_price"),
                    f"items[{index}].unit_price",
                    default=None,
                )
            except ValueError as e:
                return jsonify({"error": str(e)}), 400

            if unit_price is None:
                return jsonify({
                    "error": (
                        f"items[{index}].unit_price "
                        "is required"
                    )
                }), 400

            if unit_price == 0:
                return jsonify({
                    "error": (
                        f"items[{index}].unit_price "
                        "must be greater than zero"
                    )
                }), 400

            # ------------------------------------------
            # Item discount
            # ------------------------------------------

            try:
                discount_amount = parse_decimal(
                    item.get("discount_amount"),
                    f"items[{index}].discount_amount",
                )
            except ValueError as e:
                return jsonify({"error": str(e)}), 400

            gross_total = unit_price * quantity

            if discount_amount > gross_total:
                return jsonify({
                    "error": (
                        f"items[{index}].discount_amount "
                        "cannot exceed item total"
                    )
                }), 400

            # ------------------------------------------
            # Get product from database
            # ------------------------------------------

            product = db.session.get(Product, product_id)

            if not product:
                return jsonify({
                    "error": (
                        f"Product {product_id} "
                        "was not found"
                    )
                }), 404

            # ------------------------------------------
            # Create snapshot
            # ------------------------------------------

            sale_item = SaleItem(
                product_id=product.id,
                product_name=product.name,
                product_sku=product.sku,
                product_unit=product.unit,
                quantity=quantity,
                unit_price=unit_price,
                discount_amount=discount_amount,
            )

            sale_items.append(sale_item)

            subtotal += gross_total
            item_discount += discount_amount

    except Exception:
        db.session.rollback()
        raise

    # --------------------------------------------------
    # Validate order discount
    # --------------------------------------------------

    amount_after_item_discounts = subtotal - item_discount

    if order_discount > amount_after_item_discounts:
        return jsonify({
            "error": (
                "order_discount cannot exceed "
                "the amount remaining after item discounts"
            )
        }), 400

    # --------------------------------------------------
    # Calculate final total
    # --------------------------------------------------

    total = (
        subtotal
        - item_discount
        - order_discount
        + tax_amount
        + shipping_fee
        + service_fee
    )

    if total < 0:
        return jsonify({
            "error": "Sale total cannot be negative"
        }), 400

    # --------------------------------------------------
    # Create Sale
    # --------------------------------------------------
    invoice_number = generate_invoice_number()
    sale = Sale(
        invoice_number=invoice_number,

        customer_id=customer_id,
        customer_name=customer_name,
        customer_phone=customer_phone,
        customer_email=customer_email,

        subtotal=subtotal,
        item_discount=item_discount,
        order_discount=order_discount,

        tax_amount=tax_amount,
        shipping_fee=shipping_fee,
        service_fee=service_fee,

        total=total,

        payment_method=payment_method,
        status="completed",

        items=sale_items,
    )

    # --------------------------------------------------
    # Save transaction
    # --------------------------------------------------

    try:
        
        db.session.add(sale)
        db.session.flush()
        for item in sale_items:
            create_stock_movement_record(
                product_id=item.product_id,
                quantity_change=-item.quantity,
                reason=f"Sale {sale.invoice_number}",
                created_at=sale.created_at,
                from_sales=True
            )
        # Commit everything together
        db.session.commit()

    except ValueError as e:
        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 400

    return jsonify({
        "message": "Sale created successfully",
        "sale": {
            "id": str(sale.id),
            "invoice_number": sale.invoice_number,

            "customer_id": (
                str(sale.customer_id)
                if sale.customer_id
                else None
            ),

            "subtotal": str(sale.subtotal),
            "item_discount": str(sale.item_discount),
            "order_discount": str(sale.order_discount),

            "tax_amount": str(sale.tax_amount),
            "shipping_fee": str(sale.shipping_fee),
            "service_fee": str(sale.service_fee),

            "total": str(sale.total),

            "payment_method": sale.payment_method,
            "status": sale.status,

            "items": [
                {
                    "id": str(item.id),
                    "product_id": (
                        str(item.product_id)
                        if item.product_id
                        else None
                    ),
                    "product_name": item.product_name,
                    "product_sku": item.product_sku,
                    "product_unit": item.product_unit,
                    "quantity": item.quantity,
                    "unit_price": str(item.unit_price),
                    "discount_amount": str(
                        item.discount_amount
                    ),
                    "gross_total": str(
                        item.gross_total
                    ),
                    "total": str(item.total),
                }
                for item in sale.items
            ],
        },
    }), 201

from sqlalchemy import or_
from datetime import time
# from sqlalchemy.orm import joinedload





@sales.get("/")
@jwt_required()
def get_sales():
    # --------------------------------------------------
    # Query params
    # --------------------------------------------------

    search = request.args.get("search", "").strip()
    status = request.args.get("status", "").strip()
    payment_method = request.args.get("payment_method", "").strip()

    date_from = request.args.get("date_from", "").strip()
    date_to = request.args.get("date_to", "").strip()

    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 20))
    except (ValueError, TypeError):
        return jsonify({
            "error": "page and per_page must be integers"
        }), 400

    if page < 1:
        return jsonify({
            "error": "page must be greater than zero"
        }), 400

    if per_page < 1 or per_page > 100:
        return jsonify({
            "error": "per_page must be between 1 and 100"
        }), 400

    # --------------------------------------------------
    # Base query
    # --------------------------------------------------

    stmt = db.select(Sale)

    # --------------------------------------------------
    # Search
    # --------------------------------------------------

    if search:
        search_pattern = f"%{search}%"

        stmt = stmt.where(
            or_(
                Sale.invoice_number.ilike(search_pattern),
                Sale.customer_name.ilike(search_pattern),
                Sale.customer_phone.ilike(search_pattern),
                Sale.customer_email.ilike(search_pattern),
            )
        )

    # --------------------------------------------------
    # Status
    # --------------------------------------------------

    if status:
        stmt = stmt.where(Sale.status == status)

    # --------------------------------------------------
    # Payment method
    # --------------------------------------------------

    if payment_method:
        stmt = stmt.where(
            Sale.payment_method == payment_method
        )

    # --------------------------------------------------
    # Date range
    # --------------------------------------------------

    if date_from:
        try:
            start_date = datetime.strptime(
                date_from,
                "%Y-%m-%d"
            )

            stmt = stmt.where(
                Sale.created_at >= start_date
            )

        except ValueError:
            return jsonify({
                "error": "date_from must be YYYY-MM-DD"
            }), 400

    if date_to:
        try:
            end_date = datetime.strptime(
                date_to,
                "%Y-%m-%d"
            )

            # Include the entire end date
            end_date = datetime.combine(
                end_date.date(),
                time.max
            )

            stmt = stmt.where(
                Sale.created_at <= end_date
            )

        except ValueError:
            return jsonify({
                "error": "date_to must be YYYY-MM-DD"
            }), 400

    # --------------------------------------------------
    # Pagination
    # --------------------------------------------------

    stmt = stmt.order_by(
        Sale.created_at.desc()
    )

    pagination = db.paginate(
        stmt,
        page=page,
        per_page=per_page,
        error_out=False,
    )

    # --------------------------------------------------
    # Response
    # --------------------------------------------------

    return jsonify({
        "sales": [
            sale.to_dict()
            for sale in pagination.items
        ],

        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_previous": pagination.has_prev,
        }
    }), 200

@sales.get("/<uuid:sale_id>/invoice")
@jwt_required()
def get_sale_invoice(sale_id):
    sale = Sale.query.get(sale_id)

    if not sale:
        return jsonify({
            "error": "Sale not found"
        }), 404

    return jsonify(sale.to_dict()), 200

@sales.delete("/<uuid:sale_id>")
@jwt_required()
def cancel_sale(sale_id):
    sale = Sale.query.get(sale_id)

    if not sale:
        return jsonify({
            "error": "Sale not found"
        }), 404

    if sale.status == "cancelled":
        return jsonify({
            "error": "Sale is already cancelled"
        }), 400

    try:
        # Cancel the invoice
        sale.status = "cancelled"

        db.session.flush()

        # Reverse stock movement for every sold item
        for item in sale.items:
            create_stock_movement_record(
                product_id=item.product_id,
                quantity_change=item.quantity,
                reason=f"Cancelled Sale {sale.invoice_number}",
                created_at=datetime.utcnow(),
                from_sales=True
            )

        db.session.commit()

        return jsonify({
            "message": "Sale cancelled successfully",
            "sale": sale.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Failed to cancel sale",
            "details": str(e)
        }), 500



@sales.get("/export")
@jwt_required()
def export_sales():
    sales = (
        db.session.query(Sale)
        .order_by(Sale.created_at.desc())
        .all()
    )

    rows = []

    for sale in sales:
        for item in sale.items:
            rows.append({
                "Invoice": sale.invoice_number,
                "Date": sale.created_at,
                "Customer": sale.customer_name,
                "Phone": sale.customer_phone,
                "Email": sale.customer_email,

                "Product": item.product_name,
                "SKU": item.product_sku,
                "Unit": item.product_unit,
                "Quantity": item.quantity,

                "Unit Price": item.unit_price,
                "Item Discount": item.discount_amount,
                "Item Total": item.total,

                "Subtotal": sale.subtotal,
                "Order Discount": sale.order_discount,
                "Tax": sale.tax_amount,
                "Shipping": sale.shipping_fee,
                "Service Fee": sale.service_fee,
                "Total": sale.total,

                "Payment Method": sale.payment_method,
                "Status": sale.status,
            })

    df = pd.DataFrame(rows)

    output = BytesIO()

    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(
            writer,
            index=False,
            sheet_name="Sales",
        )

    output.seek(0)

    return send_file(
        output,
        as_attachment=True,
        download_name="sales.xlsx",
        mimetype=(
            "application/vnd.openxmlformats-officedocument."
            "spreadsheetml.sheet"
        ),
    )