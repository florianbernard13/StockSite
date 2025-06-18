from flask import request, jsonify
from .services import StockDataFetcher;
from . import stock_data_fetcher_bp

stock_service = StockDataFetcher()

@stock_data_fetcher_bp.route("/stock_data")
def get_stock_data():
    """
    Récupère les données boursières pour la période maximale possible (historique complet).
    """
    symbol = request.args.get("symbol", "AAPL")  # Par défaut, Apple
    period_str = "max"  # Période maximale

    # Appel de la méthode pour récupérer les données avec la période maximale
    data = stock_service.get_stock_data_for_period(symbol, period_str)

    if not data:
        return jsonify({"error": "Données non disponibles"}), 404

    return jsonify(data)

@stock_data_fetcher_bp.route("/stock_data/last_days/<int:days>")
def get_last_days(days):
    """
    Retourne les données des X derniers jours stockées en cache.
    """
    symbol = request.args.get("symbol", "AAPL")  # Récupérer le symbole via le paramètre de la requête
    period_str = f"{days}d"  # Crée la chaîne de période, ex : "10d" pour 10 jours

    # Appel de la méthode pour récupérer les données des derniers X jours
    data = stock_service.get_stock_data_for_period(symbol, period_str)

    if not data:
        return jsonify({"error": "Données non disponibles"}), 404

    return jsonify(data)