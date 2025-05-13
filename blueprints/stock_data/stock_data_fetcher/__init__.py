from flask import Blueprint

stock_data_fetcher_bp = Blueprint('stock_data_fetcher', __name__)

from . import routes