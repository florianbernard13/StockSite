from flask import request, jsonify
from . import analysis_dispatcher_bp
from .services import dispatch_analysis

@analysis_dispatcher_bp.route('', methods=['POST'])
def handle_batch_analysis():
    data = request.get_json()
    tickers = data.get('tickers', [])
    analyses = data.get('analyses', [])

    try:
        results = dispatch_analysis(tickers, analyses)
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500