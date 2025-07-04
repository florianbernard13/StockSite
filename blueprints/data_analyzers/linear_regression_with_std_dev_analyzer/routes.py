from flask import request, jsonify
from .services import BatchStockAnalyzer
from . import linear_regression_with_std_dev_analyzer_bp

@linear_regression_with_std_dev_analyzer_bp.route("/linear_regression_with_std_dev_batch")
def analyze_batch_stocks():
    period = request.args.get("period", "6m")
    service = BatchStockAnalyzer(period=period)
    results = service.analyze_all()
    
    return jsonify(results)

