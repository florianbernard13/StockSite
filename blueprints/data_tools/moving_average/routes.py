from flask import request, jsonify
from .services import calculate_moving_average
from . import moving_average_bp

@moving_average_bp.route("/")
def moving_average():
    try:
        data = request.args.get('data')
        window_size = int(request.args.get('window', 3))

        if not data:
            return jsonify({"error": "Aucune donnée fournie"}), 400

        result = calculate_moving_average(data, window_size)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
