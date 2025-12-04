from flask import Blueprint

analysis_dispatcher_bp = Blueprint('analysis_dispatcher', __name__)

from . import routes