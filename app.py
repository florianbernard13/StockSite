from flask import Flask, request, render_template, jsonify
import yfinance as yf
from config import DevelopmentConfig
from blueprints.stock_data import stock_data_bp
from blueprints.data_tools import data_tools_bp
from blueprints.data_analyzers import data_analyzers_bp

# Création de l'application Flask
app = Flask(__name__)
app.config['DEBUG'] = True
app.jinja_env.cache = {}
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.jinja_env.auto_reload = True

# Chargement de la configuration
app.config.from_object(DevelopmentConfig)

# Enregistrement des blueprints
app.register_blueprint(data_tools_bp, url_prefix='/data_tools')
app.register_blueprint(stock_data_bp, url_prefix="/api")
app.register_blueprint(data_analyzers_bp, url_prefix="/data_analyzers")

# API Route for pulling the stock quote
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
	data = hist.to_json()
	return data

# This is the / route, or the main landing page route.
@app.route("/")
def home():
	# we will use Flask's render_template method to render a website template.
    return render_template("homepage.html")

# run the flask app.
if __name__ == "__main__":
	app.run(debug=True)