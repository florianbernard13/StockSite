from flask import Flask, request, render_template, jsonify
import yfinance as yf
from config import DevelopmentConfig
from blueprints.stock_data import stock_data_bp
from blueprints.data_tools import data_tools_bp
from blueprints.data_analyzers import data_analyzers_bp
from assets import vite_asset
import logging

# Création de l'application Flask
app = Flask(__name__, static_folder="static")
app.config.from_object(DevelopmentConfig)

# expose vite_asset to templates
app.jinja_env.globals['vite_asset'] = vite_asset

# Auto-reload templates
app.jinja_env.cache = {}
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.jinja_env.auto_reload = True

# Configuration globale du logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# Enregistrement des blueprints
app.register_blueprint(data_tools_bp, url_prefix='/data_tools')
app.register_blueprint(stock_data_bp, url_prefix="/api")
app.register_blueprint(data_analyzers_bp, url_prefix="/data_analyzers")

# Routes
@app.route("/quote")
def display_quote():
    symbol = request.args.get('symbol', default="AAPL")
    quote = yf.Ticker(symbol)
    return jsonify(quote.info)

@app.route("/history")
def display_history():
    symbol = request.args.get('symbol', default="AAPL")
    period = request.args.get('period', default="1y")
    interval = request.args.get('interval', default="1d")
    quote = yf.Ticker(symbol)	
    hist = quote.history(period=period, interval=interval)
    return hist.to_json()

@app.route("/")
def home():
    return render_template("homepage.html")

# Lancer Flask
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
