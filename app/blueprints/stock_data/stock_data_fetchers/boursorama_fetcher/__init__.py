from flask import Blueprint

boursorama_fetcher_bp = Blueprint('boursorama_fetcher', __name__)

from . import routes