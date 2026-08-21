from collections import defaultdict
from datetime import datetime, timedelta

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func, select,desc
from sqlalchemy.orm import joinedload, selectinload
from cdp_toko.models.inventory import Product, StockMovement
from cdp_toko.models.sales import Sale,SaleItem
from cdp_toko.extension import db
from decimal import Decimal
dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/api/dashboard",
)

@dashboard_bp.get("/inventory")
@jwt_required()
def get_dashboard_inventory():
    now = datetime.utcnow()
    period_start = now - timedelta(days=30)

    # =====================================================
    # LATEST STOCK QUANTITY PER PRODUCT
    # =====================================================

    latest_quantity = (
        select(StockMovement.quantity_after)
        .where(
            StockMovement.product_id == Product.id
        )
        .order_by(
            StockMovement.created_at.desc(),
            StockMovement.id.desc(),
        )
        .limit(1)
        .scalar_subquery()
    )

    # =====================================================
    # PRODUCTS
    # =====================================================

    products = db.session.scalars(
        select(Product)
        .options(
            joinedload(Product.category),
            selectinload(Product.suppliers),
        )
    ).all()

    product_data = []

    for product in products:
        quantity = db.session.scalar(
            select(latest_quantity)
            .where(Product.id == product.id)
        )

        quantity = quantity or 0

        inventory_value = (
            quantity * float(product.price_per_unit)
        )

        product_data.append({
            "id": str(product.id),
            "name": product.name,
            "sku": product.sku,
            "quantity": quantity,
            "unit": product.unit,
            "price_per_unit": float(product.price_per_unit),
            "inventory_value": inventory_value,
            "category_id": str(product.category_id),
            "category_name": (
                product.category.name
                if product.category
                else None
            ),
            "supplier_count": len(product.suppliers),
        })

    # =====================================================
    # PRODUCT SUMMARY
    # =====================================================

    total_products = len(product_data)

    total_stock_units = sum(
        product["quantity"]
        for product in product_data
    )

    inventory_value = sum(
        product["inventory_value"]
        for product in product_data
    )

    out_of_stock = [
        product
        for product in product_data
        if product["quantity"] == 0
    ]

    products_without_supplier = [
        product
        for product in product_data
        if product["supplier_count"] == 0
    ]

    # =====================================================
    # CATEGORY VALUE
    # =====================================================

    category_map = defaultdict(
        lambda: {
            "product_count": 0,
            "quantity": 0,
            "inventory_value": 0,
        }
    )

    for product in product_data:
        category_name = (
            product["category_name"]
            or "Uncategorized"
        )

        category = category_map[category_name]

        category["product_count"] += 1
        category["quantity"] += product["quantity"]
        category["inventory_value"] += product["inventory_value"]

    category_value = [
        {
            "category": category_name,
            **values,
        }
        for category_name, values
        in category_map.items()
    ]

    category_value.sort(
        key=lambda item: item["inventory_value"],
        reverse=True,
    )

    # =====================================================
    # TOP PRODUCTS BY INVENTORY VALUE
    # =====================================================

    top_products = sorted(
        product_data,
        key=lambda product: product["inventory_value"],
        reverse=True,
    )[:5]

    # Keep response smaller.
    top_products = [
        {
            "id": product["id"],
            "name": product["name"],
            "sku": product["sku"],
            "quantity": product["quantity"],
            "inventory_value": product["inventory_value"],
        }
        for product in top_products
    ]

    # =====================================================
    # STOCK MOVEMENTS — LAST 30 DAYS
    # =====================================================

    movements = db.session.scalars(
        select(StockMovement)
        .options(
            joinedload(StockMovement.product),
        )
        .where(
            StockMovement.created_at >= period_start
        )
        .order_by(
            StockMovement.created_at.asc()
        )
    ).all()

    inbound_units = 0
    outbound_units = 0

    daily_activity = defaultdict(
        lambda: {
            "inbound": 0,
            "outbound": 0,
        }
    )

    product_activity = defaultdict(
        lambda: {
            "product_id": None,
            "product_name": None,
            "product_sku": None,
            "movements": 0,
            "inbound": 0,
            "outbound": 0,
        }
    )

    for movement in movements:
        change = movement.quantity_change
        date_key = movement.created_at.strftime("%Y-%m-%d")

        # Daily activity
        if change > 0:
            inbound_units += change
            daily_activity[date_key]["inbound"] += change
        else:
            amount = abs(change)
            outbound_units += amount
            daily_activity[date_key]["outbound"] += amount

        # Product activity
        activity = product_activity[movement.product_id]

        activity["product_id"] = str(
            movement.product_id
        )
        activity["product_name"] = movement.product.name
        activity["product_sku"] = movement.product.sku
        activity["movements"] += 1

        if change > 0:
            activity["inbound"] += change
        else:
            activity["outbound"] += abs(change)

    daily_activity = [
        {
            "date": date,
            **values,
        }
        for date, values in sorted(
            daily_activity.items()
        )
    ]

    most_active_products = sorted(
        product_activity.values(),
        key=lambda item: item["movements"],
        reverse=True,
    )[:5]

    # =====================================================
    # RECENT MOVEMENTS
    # =====================================================

    recent_movements = db.session.scalars(
        select(StockMovement)
        .options(
            joinedload(StockMovement.product),
        )
        .order_by(
            StockMovement.created_at.desc(),
            StockMovement.id.desc(),
        )
        .limit(8)
    ).all()

    # =====================================================
    # RESPONSE
    # =====================================================

    return jsonify({
        "data": {
            "summary": {
                "total_products": total_products,
                "total_stock_units": total_stock_units,
                "inventory_value": inventory_value,
                "out_of_stock": len(out_of_stock),
                "products_without_supplier": len(
                    products_without_supplier
                ),
            },

            "movement_summary": {
                "period_days": 30,
                "inbound_units": inbound_units,
                "outbound_units": outbound_units,
                "net_change": (
                    inbound_units - outbound_units
                ),
                "movement_count": len(movements),
            },

            "daily_activity": daily_activity,

            "category_value": category_value,

            "top_products": top_products,

            "most_active_products": most_active_products,

            "attention": {
                "out_of_stock": out_of_stock,
                "products_without_supplier": (
                    products_without_supplier
                ),
            },

            "recent_movements": [
                movement.to_dict()
                for movement in recent_movements
            ],
        }
    }), 200



@dashboard_bp.get("/sales")
@jwt_required()
def get_dashboard_sales():
    now = datetime.utcnow()
    today = now.date()
    month_start = today.replace(day=1)

    # -------------------------
    # Today's sales
    # -------------------------

    today_start = datetime.combine(today, datetime.min.time())
    tomorrow_start = today_start + timedelta(days=1)

    today_sales = (
        db.session.query(
            func.count(Sale.id),
            func.coalesce(func.sum(Sale.total), 0),
        )
        .filter(
            Sale.created_at >= today_start,
            Sale.created_at < tomorrow_start,
            Sale.status == "completed",
        )
        .one()
    )

    today_orders = today_sales[0]
    today_revenue = Decimal(str(today_sales[1] or 0))

    # -------------------------
    # This month's sales
    # -------------------------

    month_start_dt = datetime.combine(
        month_start,
        datetime.min.time(),
    )

    month_sales = (
        db.session.query(
            func.count(Sale.id),
            func.coalesce(func.sum(Sale.total), 0),
        )
        .filter(
            Sale.created_at >= month_start_dt,
            Sale.status == "completed",
        )
        .one()
    )

    month_orders = month_sales[0]
    month_revenue = Decimal(str(month_sales[1] or 0))

    # -------------------------
    # Average order value
    # -------------------------

    average_order_value = (
        month_revenue / month_orders
        if month_orders
        else Decimal("0")
    )

    # -------------------------
    # Payment methods
    # -------------------------

    payment_rows = (
        db.session.query(
            Sale.payment_method,
            func.count(Sale.id).label("orders"),
            func.coalesce(func.sum(Sale.total), 0).label("revenue"),
        )
        .filter(
            Sale.created_at >= month_start_dt,
            Sale.status == "completed",
        )
        .group_by(Sale.payment_method)
        .order_by(desc("revenue"))
        .all()
    )

    payment_methods = [
        {
            "method": row.payment_method,
            "orders": row.orders,
            "revenue": str(row.revenue),
        }
        for row in payment_rows
    ]

    # -------------------------
    # Top selling products
    # -------------------------

    top_product_rows = (
        db.session.query(
            SaleItem.product_id,
            SaleItem.product_name,
            SaleItem.product_sku,
            func.sum(SaleItem.quantity).label("quantity"),
            func.coalesce(
                func.sum(
                    SaleItem.unit_price * SaleItem.quantity
                    - SaleItem.discount_amount
                ),
                0,
            ).label("revenue"),
        )
        .join(Sale, Sale.id == SaleItem.sale_id)
        .filter(
            Sale.created_at >= month_start_dt,
            Sale.status == "completed",
        )
        .group_by(
            SaleItem.product_id,
            SaleItem.product_name,
            SaleItem.product_sku,
        )
        .order_by(desc("quantity"))
        .limit(10)
        .all()
    )

    top_products = [
        {
            "product_id": (
                str(row.product_id)
                if row.product_id
                else None
            ),
            "name": row.product_name,
            "sku": row.product_sku,
            "quantity": row.quantity,
            "revenue": str(row.revenue),
        }
        for row in top_product_rows
    ]

    # -------------------------
    # Daily revenue - last 7 days
    # -------------------------

    seven_days_ago = today_start - timedelta(days=6)

    daily_rows = (
        db.session.query(
            func.date(Sale.created_at).label("date"),
            func.count(Sale.id).label("orders"),
            func.coalesce(func.sum(Sale.total), 0).label("revenue"),
        )
        .filter(
            Sale.created_at >= seven_days_ago,
            Sale.status == "completed",
        )
        .group_by(func.date(Sale.created_at))
        .order_by(func.date(Sale.created_at))
        .all()
    )

    daily_sales = [
        {
            "date": str(row.date),
            "orders": row.orders,
            "revenue": str(row.revenue),
        }
        for row in daily_rows
    ]

    # -------------------------
    # Recent sales
    # -------------------------

    recent_sales = (
        Sale.query
        .filter(Sale.status == "completed")
        .order_by(Sale.created_at.desc())
        .limit(10)
        .all()
    )

    return jsonify({
        "summary": {
            "today": {
                "orders": today_orders,
                "revenue": str(today_revenue),
            },
            "month": {
                "orders": month_orders,
                "revenue": str(month_revenue),
                "average_order_value": str(average_order_value),
            },
        },

        "payment_methods": payment_methods,

        "top_products": top_products,

        "daily_sales": daily_sales,

        "recent_sales": [
            {
                "id": str(sale.id),
                "invoice_number": sale.invoice_number,
                "customer_name": sale.customer_name,
                "total": str(sale.total),
                "payment_method": sale.payment_method,
                "created_at": (
                    sale.created_at.isoformat()
                    if sale.created_at
                    else None
                ),
            }
            for sale in recent_sales
        ],
    })