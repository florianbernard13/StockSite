from flask import Blueprint

linear_regression_bp = Blueprint('linear_regression', __name__)

from . import routes