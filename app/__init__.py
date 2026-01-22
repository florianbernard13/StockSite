from flask import Flask, request, render_template, jsonify
import yfinance as yf
from app.config import DevelopmentConfig
from app.blueprints.stock_data import stock_data_bp
from app.blueprints.data_tools import data_tools_bp
from app.blueprints.data_analyzers import data_analyzers_bp
from app.assets import vite_asset, include_module_style
from app.blueprints.main import main_bp
from app.logger import setup_logging
from app.extensions import quote_repository

setup_logging()

def create_app():
    app = Flask(__name__, static_folder="static")
    app.config.from_object(DevelopmentConfig)

    # expose vite_asset to templates
    app.jinja_env.globals['vite_asset'] = vite_asset
    app.jinja_env.globals["include_module_style"] = include_module_style

    # Auto-reload templates
    app.jinja_env.cache = {}
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.jinja_env.auto_reload = True

    # Enregistrement des blueprints
    app.register_blueprint(data_tools_bp, url_prefix='/data_tools')
    app.register_blueprint(stock_data_bp, url_prefix="/api")
    app.register_blueprint(data_analyzers_bp, url_prefix="/data_analyzers")

    app.register_blueprint(main_bp)

    return app