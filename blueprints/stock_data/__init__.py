from flask import Blueprint
from .stock_search import stock_search_bp

stock_data_bp = Blueprint("stock_data", __name__)
stock_data_bp.register_blueprint(stock_search_bp, url_prefix='/stock_search')

from . import routes

