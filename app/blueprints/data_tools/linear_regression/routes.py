from flask import request, jsonify
from .services import LinearRegressionService
from . import linear_regression_bp
import logging

logger = logging.getLogger(__name__)

@linear_regression_bp.route("/", methods=["POST"])
def linear_regression():
    try:
        payload = request.get_json()

        if not payload:
            logger.warning("Aucun payload JSON fourni dans la requête.")
            return jsonify({"error": "Aucun payload JSON fourni."}), 400
        
        data = payload.get("data")
        time_span = payload.get("timeSpan")

        if not data:
            logger.warning("Aucune donnée boursière valide fournie dans le payload.")
            return jsonify({"error": "Aucune donnée boursière valide fournie."}), 400

        if not isinstance(data, list):
            logger.warning("Les données fournies ne sont pas une liste.")
            return jsonify({"error": "Les données doivent être une liste."}), 400

        for i, item in enumerate(data):
            if not isinstance(item, dict):
                logger.warning("Élément %d des données n'est pas un dictionnaire.", i)
                return jsonify({"error": "Chaque élément des données doit être un dictionnaire."}), 400
            if "Close" not in item:
                logger.warning("Élément %d manque la clé 'Close'.", i)
                return jsonify({"error": "Chaque élément des données doit contenir la clé 'Close'."}), 400
            if "Datetime" not in item:
                logger.warning("Élément %d manque la clé 'Datetime'.", i)
                return jsonify({"error": "Chaque élément des données doit contenir la clé 'Datetime'."}), 400

        result = LinearRegressionService(data, time_span).get_results()
        logger.info(
            "✔️ Analyse linéaire terminée pour %d points sur un intervalle '%s'.",
            len(data),
            time_span
        )
        return jsonify(result)  # jsonify() gère la conversion en JSON
    except Exception as e:
        logger.error("Erreur lors de l'analyse linéaire : %s", e, exc_info=True)
        return jsonify({"error": str(e)}), 500

