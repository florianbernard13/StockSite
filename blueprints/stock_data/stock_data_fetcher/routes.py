from flask import request, jsonify
from .services import StockDataFetcher
from .shared_fetcher import shared_stock_data_fetcher
from . import stock_data_fetcher_bp

stock_service = shared_stock_data_fetcher


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

@stock_data_fetcher_bp.route("/stock_data/last/<string:period>")
def get_stock_data_last_period(period):
    """
    Récupère les données pour les derniers X jours, mois ou années.
    Exemples de period : "10d" (jours), "5m" (mois), "1y" (année).
    """
    symbol = request.args.get("symbol", "AAPL")

    # Vérification simple de la période
    if not period or len(period) < 2:
        return jsonify({"error": "Période invalide"}), 400

    unit = period[-1].lower()

    if unit not in ['d', 'm', 'y']:
        return jsonify({"error": "Unité de période invalide (d, m, y)"}), 400

    # Appelle ta méthode de récupération des données (à adapter)
    data = stock_service.get_stock_data_for_period(symbol, period)

    if not data:
        return jsonify({"error": "Données non disponibles"}), 404

    return jsonify(data)