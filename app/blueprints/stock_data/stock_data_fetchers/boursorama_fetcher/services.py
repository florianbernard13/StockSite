from app.blueprints.stock_data.stock_data_fetchers.base_fetcher import BaseFetcher
from app.models.price_series import PriceSeries
from . import config    
from curl_cffi import requests
from datetime import datetime, timedelta

class BoursoramaFetcher(BaseFetcher):
    def __init__(self):
        super().__init__()
        self.session = requests.Session()
        pass

    def real_time(self, symbol):
        response = self.initial_fetch()
        real_time_price_series = self.parse(response)
        quote = self.quote_repository.get(symbol)
        quote.add_price_many(real_time_price_series)
        print(quote.list_all_prices)
    
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
        response.raise_for_status()
        return response.json()

    def refresh_fetch(self):
        pass

    def parse(self, raw: dict) -> PriceSeries:
        series = PriceSeries.empty()

        quote_tab = raw.get("d", {}).get("QuoteTab", [])
        for point in quote_tab:
            dt, price = self.parse_price_point(point)
            series = series.add(dt, price)

        return series

    @staticmethod
    def parse_price_point(raw: dict) -> tuple[datetime, float]:
        d = str(raw["d"])

        date_part = d[:6]            # YYMMDD
        minutes_in_day = int(d[6:])  # minutes depuis minuit

        date = datetime.strptime(date_part, "%y%m%d")
        dt = date + timedelta(minutes=minutes_in_day)

        price = raw["c"]

        return dt, price 
