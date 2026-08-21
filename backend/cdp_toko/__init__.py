from flask import Flask
from cdp_toko.extension import migrate,db,jwt
# from cdp_toko.models.models import UserCdp,  Customer, Service ##need to be migrated ?
from cdp_toko.routes.api import main_bp
from cdp_toko.routes.frontend import frontend_bp
from cdp_toko.routes.category import categories_bp
from cdp_toko.routes.supplier import suppliers_bp
from cdp_toko.routes.product import products_bp
from cdp_toko.routes.stock_movement import stock_movements_bp
from cdp_toko.routes.dashboard import dashboard_bp
from cdp_toko.routes.sales import sales


def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')
    app.register_blueprint(frontend_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(suppliers_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(stock_movements_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(sales)
    jwt.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    return app