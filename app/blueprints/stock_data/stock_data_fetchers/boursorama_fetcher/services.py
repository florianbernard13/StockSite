from . import config    
from curl_cffi import requests

class BoursoramaFetcher:
    def __init__(self):
        self.session = requests.Session()
        pass

    def real_time(self, symbol):
        response = self.initial_fetch()
        print(self.generate_boursorama_symbol(symbol), flush=True)
        return response
    
    @staticmethod
    def generate_boursorama_symbol(symbol: str) -> str:
        return "1rP" + symbol.split(".",1)[0]

    def initial_fetch(self)->dict:
        params = {
            "symbol": "1rPAL2SI",
            "length": 1
        }
        response = self.session.get(
            config.Scheme + config.Host + config.baseFetcherUri,
            params=params
        )
        return response

    def refresh_fetch(self):
        pass

    def parse(self, raw: dict):
        pass
