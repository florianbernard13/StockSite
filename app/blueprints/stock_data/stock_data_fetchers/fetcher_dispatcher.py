import logging
from app.blueprints.stock_data.stock_data_fetchers.base_fetcher import BaseFetcher
from app.blueprints.stock_data.stock_data_fetchers.boursorama_fetcher.services import BoursoramaFetcher
from app.blueprints.stock_data.stock_data_fetchers.yfinance_fetcher.services import YfinanceFetcher
from app.repositories import quote_repository
from app.services.quote_query_service import QuoteQueryService

logger = logging.getLogger(__name__)


class fetcherDispatcher (BaseFetcher):
    def __init__(self):
        super().__init__()

    def fetch_stock_data(self, symbol: str):
        yfinance_fetcher = YfinanceFetcher()
        return yfinance_fetcher.fetch_stock_data(symbol)

    def real_time(self, symbol: str):
        boursorama_fetcher = BoursoramaFetcher()
        boursorama_fetcher.real_time(symbol)
        return self.quote_repository.get(symbol)
    
    def stream_realtime():
        pass

    def get_stock_data_for_period(self, symbol: str, period_str: str):
    # S'assure que le fetcher a rempli le cache
        meta = self.fetch_stock_data(symbol)
        if meta is None:
            logger.warning("Unable to fetch stock data for symbol=%r", symbol)
            return None

        sliced_series = QuoteQueryService.get_price_series_for_period(symbol, period_str)
        if sliced_series is None:
            return None

        quote = self.quote_repository.get(symbol)

        return {
            "symbol": quote.symbol,
            "shortName": quote.name,
            "price": quote.current_price,
            "history": sliced_series,
        }