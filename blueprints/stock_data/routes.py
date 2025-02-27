from flask import Blueprint, request, jsonify
from .services import fetch_stock_data
from . import stock_data_bp

@stock_data_bp.route("/stock_data")
def get_stock_data():
    """
    Récupère toutes les données de bourse (nom, historique, etc.)
    avec une granularité à l'heure.
    """
    symbol = request.args.get("symbol", "AAPL")  # Par défaut, Apple
    data = fetch_stock_data(symbol)  # Appel au service

    if not data:
        return jsonify({"error": "Données non disponibles"}), 404

    return jsonify(data)
