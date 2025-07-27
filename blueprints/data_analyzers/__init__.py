from flask import Blueprint
from .linear_regressions.standard_deviation import standard_deviation_bp
from .dispatcher import analysis_dispatcher_bp

data_analyzers_bp = Blueprint("data_analyzers", __name__)

data_analyzers_bp.register_blueprint(standard_deviation_bp, url_prefix='/lr_with_std_dev_analyzer')
data_analyzers_bp.register_blueprint(analysis_dispatcher_bp)