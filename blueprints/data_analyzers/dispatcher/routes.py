from flask import request, jsonify
from .analysis_dispatcher import AnalysisDispatcher
from . import analysis_dispatcher_bp

@analysis_dispatcher_bp.route("/analysis_dispatcher", methods=['POST'])
def handle_batch_analysis():
    data = request.get_json() or {}
    tickers = data.get('tickers', [])
    analyses = data.get('analyses', [])

    if not analyses:
        return jsonify({'error': 'No analyzers selected'}), 400

    try:
        dispatcher = AnalysisDispatcher(analyses_names=analyses, stocks_list=tickers)
        if not dispatcher.analyzers:
            return jsonify({'error': 'No valid analyzers found'}), 400

        results = dispatcher.analyze_all()
        return jsonify(results), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
