from flask import Blueprint

stock_data_bp = Blueprint("stock_data", __name__)

from . import routes
