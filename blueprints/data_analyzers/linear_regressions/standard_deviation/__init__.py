from flask import Blueprint

standard_deviation_bp = Blueprint('linear_regression_with_std_dev_analyzer', __name__)

from . import routes