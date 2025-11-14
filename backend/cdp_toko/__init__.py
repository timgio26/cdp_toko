from flask import Flask
from cdp_toko.extension import migrate,db,jwt
from cdp_toko.models.models import UserCdp,  Customer, Service ##need to be migrated ?
from cdp_toko.routes.routes import main_bp
from cdp_toko.routes.error_handler import error_bp

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')
    app.register_blueprint(main_bp)
    app.register_blueprint(error_bp)
    jwt.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)
    return app