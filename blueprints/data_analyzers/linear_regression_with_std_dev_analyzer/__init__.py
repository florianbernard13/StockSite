from flask import Blueprint

linear_regression_with_std_dev_analyzer_bp = Blueprint('linear_regression_with_std_dev_analyzer', __name__)

from . import routes