from flask import Blueprint
from .linear_regression import linear_regression_bp
from .moving_average import moving_average_bp

data_tools_bp = Blueprint("data_tools", __name__)

data_tools_bp.register_blueprint(linear_regression_bp, url_prefix='/linear_regression')
data_tools_bp.register_blueprint(moving_average_bp, url_prefix='/moving_average')