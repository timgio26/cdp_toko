from flask import Flask
from cdp_toko.extension import migrate,db
from cdp_toko.models.models import UserCdp,  Customer, ServiceRecord
from cdp_toko.routes.routes import main_bp

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('config.py')
    db.init_app(app)
    migrate.init_app(app, db)
    app.register_blueprint(main_bp)
    return app