from flask import request, jsonify
from ..shared_fetcher import shared_stock_data_fetcher
from . import yfinance_fetcher_bp

stock_service = shared_stock_data_fetcher


@yfinance_fetcher_bp.route("/stock_data")
def get_stock_data():
    """
    Récupère les données boursières pour la période maximale possible (historique complet).
    """
    symbol = request.args.get("symbol")

    if not symbol:
        return jsonify({"error": "Missing required parameter 'symbol'"}), 404

    # Appel de la méthode pour récupérer les données avec la période maximale
    data = stock_service.get_stock_data_for_period(symbol, "max")

    if not data:
        return jsonify({"error": "Données non disponibles"}), 404

    return jsonify({
        "symbol": data["symbol"],
        "shortName": data["shortName"],
        "price": data["price"],
        "history": data["history"].to_json(),
    })

@yfinance_fetcher_bp.route("/stock_data/last/<string:period>")
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

    return jsonify({
        "symbol": data["symbol"],
        "shortName": data["shortName"],
        "price": data["price"],
        "history": data["history"].to_json(),
    })

@yfinance_fetcher_bp.route("/stock_data/realtime")
def get_realtime_stock_data():
    """
    Récupère les informations temps réel d'une action (nom, symbole, dernier prix).
    Ex : /stock_data/realtime?symbol=AAPL
    """
    symbol = request.args.get("symbol", "AAPL").upper()

    data = stock_service.fetch_stock_data(symbol)
    if not data:
        return jsonify({"error": f"Impossible de récupérer les données pour {symbol}"}), 404
    realtime_info = {
        "symbol": data["symbol"],
        "shortName": data["shortName"],
        "price": data["price"],
    }

    return jsonify(realtime_info), 200
