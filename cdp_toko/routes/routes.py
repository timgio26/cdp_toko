# routes/main.py
from flask import Blueprint

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def home():
    return "Welcome to the home page!"

@main_bp.route('/about')
def about():
    return "About this app"