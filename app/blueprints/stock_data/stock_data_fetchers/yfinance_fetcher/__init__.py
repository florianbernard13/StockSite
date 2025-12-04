from flask import Blueprint

yfinance_fetcher_bp = Blueprint('yfinance_fetcher', __name__)

from . import routes