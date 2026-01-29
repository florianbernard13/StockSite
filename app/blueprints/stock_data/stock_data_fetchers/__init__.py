from flask import Blueprint
from .yfinance_fetcher import yfinance_fetcher_bp
from .boursorama_fetcher import boursorama_fetcher_bp

stock_data_fetchers_bp = Blueprint('stock_data_fetchers', __name__)

stock_data_fetchers_bp.register_blueprint(yfinance_fetcher_bp)
stock_data_fetchers_bp.register_blueprint(boursorama_fetcher_bp, url_prefix='/boursorama_fetcher')

from . import routes