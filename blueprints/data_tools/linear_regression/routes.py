from flask import request, jsonify
from .services import perform_linear_regression
from . import linear_regression_bp

@linear_regression_bp.route("/")
def linear_regression():
    try:
        data = request.args.get('data')
        if not data:
            return jsonify({"error": "Aucune donnée fournie"}), 400

        result = perform_linear_regression(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
