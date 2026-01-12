from . import boursorama_fetcher_bp
from .services import  BoursoramaFetcher
from flask import jsonify

@boursorama_fetcher_bp.route("/boursorama-fetcher-bp")
def getRealTimeDate():
    obj = BoursoramaFetcher()
    print(obj.real_time("AL2SI.PA"), flush=True)
    return '{"success": true}'