import os
from dotenv import load_dotenv

load_dotenv()

# basedir = os.path.abspath(os.path.dirname(__file__))
# SQLALCHEMY_DATABASE_URI= 'sqlite:///' + os.path.join(basedir, 'data.sqlite')
SQLALCHEMY_DATABASE_URI=os.getenv("SQLALCHEMY_DATABASE_URI")
# SQLALCHEMY_TRACK_MODIFICATIONS = False
# SQLALCHEMY_ENGINE_OPTIONS ={'pool_pre_ping': True}
# SQLALCHEMY_POOL_RECYCLE=299
# SECRET_KEY='bumimarinaemas'
# UPLOAD_FOLDER='static/upload'
# DEBUG=True
# ROW_PER_PAGE=15
