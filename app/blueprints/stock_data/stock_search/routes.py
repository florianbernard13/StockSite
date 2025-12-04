from flask import request, jsonify
from .services import StockSearchService
from . import stock_search_bp

@stock_search_bp.route("/autocomplete")
def stock_search_autocomplete():
    try:
        query = request.args.get("q", "").lower().strip()
        results = StockSearchService.autocomplete(query)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500