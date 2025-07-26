from flask import Blueprint

analysis_dispatcher_bp = Blueprint(
    'analysis_dispatcher',
    __name__,
    url_prefix='/analysis_dispatcher'
)

from . import routes