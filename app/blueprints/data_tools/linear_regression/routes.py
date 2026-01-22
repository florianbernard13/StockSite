from flask import request, jsonify

from app.extensions import quote_repository
from .services import LinearRegressionService
from app.services.quote_query_service import QuoteQueryService
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
        
        symbol = payload.get("symbol")
        period = payload.get("period")

        if not symbol:
            logger.warning("Aucun symbole fourni dans le payload.")
            return jsonify({"error": "Le symbole est obligatoire."}), 400
        if not period:
            logger.warning("Aucune période fournie dans le payload.")
            return jsonify({"error": "La période est obligatoire."}), 400
        
        stock_data = quote_repository.get(symbol)
        if not stock_data:
            logger.warning("Aucune donnée boursière disponible pour %r sur la période %r.", symbol, period)
            return jsonify({"error": "Aucune donnée boursière disponible."}), 404
        
        sliced_series = QuoteQueryService.get_price_series_for_period(symbol, period)
        if sliced_series is None:
            return None

        price_series_list = sliced_series.all_prices
        result = LinearRegressionService(price_series_list, period).get_results()

        logger.info(
            "✔️ Analyse linéaire terminée pour %d points sur %r (%s).",
            len(price_series_list),
            symbol,
            period
        )
        return jsonify(result)
    except Exception as e:
        logger.error("Erreur lors de l'analyse linéaire : %s", e, exc_info=True)
        return jsonify({"error": str(e)}), 500

