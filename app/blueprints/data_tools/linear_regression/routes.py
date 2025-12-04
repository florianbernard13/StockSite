from flask import request, jsonify
from .services import LinearRegressionService
from . import linear_regression_bp

@linear_regression_bp.route("/", methods=["POST"])
def linear_regression():
    try:
        payload = request.get_json()

        if not payload:
            return jsonify({"error": "Aucun payload JSON fourni."}), 400
        
        data = payload.get("data")
        time_span = payload.get("timeSpan")

        if not data:
            return jsonify({"error": "Aucune donnée boursière valide fournie."}), 400

        if not isinstance(data, list):
            return jsonify({"error": "Les données doivent être une liste."}), 400

        for item in data:
            if not isinstance(item, dict):
                return jsonify({"error": "Chaque élément des données doit être un dictionnaire."}), 400
            if "Close" not in item:
                return jsonify({"error": "Chaque élément des données doit contenir la clé 'Close'."}), 400
            if "Datetime" not in item:
                return jsonify({"error": "Chaque élément des données doit contenir la clé 'Datetime'."}), 400

        result = LinearRegressionService(data, time_span).get_results()  # Passer directement le dict
        return jsonify(result)  # jsonify() gère la conversion en JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500

