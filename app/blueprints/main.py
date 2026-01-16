from flask import Blueprint, request, render_template, jsonify
import yfinance as yf

main_bp = Blueprint("main", __name__)

@main_bp.route("/")
def home():
    return render_template("homepage.html.jinja")
@main_bp.route("/quote")
def display_quote():
    symbol = request.args.get('symbol', "AAPL")
    return jsonify(yf.Ticker(symbol).info)

@main_bp.route("/history")
def display_history():
    symbol = request.args.get('symbol', "AAPL")
    period = request.args.get('period', "1y")
    interval = request.args.get('interval', "1d")
    hist = yf.Ticker(symbol).history(period=period, interval=interval)
    return hist.to_json()
