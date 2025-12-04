from flask import Blueprint

stock_search_bp = Blueprint('stock_search', __name__)

from . import routes