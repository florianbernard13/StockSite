from flask import Blueprint

moving_average_bp = Blueprint('moving_average', __name__)

from . import routes