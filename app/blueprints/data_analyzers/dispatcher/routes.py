from flask import request, jsonify
from .analysis_dispatcher import AnalysisDispatcher
from . import analysis_dispatcher_bp
import logging

logger = logging.getLogger(__name__)

@analysis_dispatcher_bp.route("/analysis_dispatcher", methods=['POST'])
def handle_batch_analysis():
    data = request.get_json() or {}
    tickers = data.get('tickers', [])
    analyses = data.get('analyses', [])

    if not analyses:
        logger.warning("Aucun analyseur sélectionné → renvoi d’un 400")
        return jsonify({'error': 'No analyzers selected'}), 400

    try:
        dispatcher = AnalysisDispatcher(analyses_names=analyses, stocks_list=tickers)
        if not dispatcher.analyzers:
            logger.warning(f"Aucun analyseur valide trouvé pour {analyses}")
            return jsonify({'error': 'No valid analyzers found'}), 400

        results = dispatcher.analyze_all()
        logger.info("Analyse terminée avec succès.")
        return jsonify(results), 200

    except Exception as e:
        logger.exception("Erreur inattendue lors de l'analyse")
        return jsonify({'error': str(e)}), 500
