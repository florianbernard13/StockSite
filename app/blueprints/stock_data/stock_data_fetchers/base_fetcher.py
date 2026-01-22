from abc import abstractmethod
import logging
from app.extensions import quote_repository
from app.services.quote_query_service import QuoteQueryService

logger = logging.getLogger(__name__)

class BaseFetcher:
    def __init__(self):
        self.stock_cache = {}
        self.quote_repository = quote_repository

    @abstractmethod
    def fetch_stock_data(self, symbol: str):
        """
        Chaque fetcher concret doit implémenter cette méthode
        pour récupérer les données d'un symbole et remplir le cache.
        """
        raise NotImplementedError
    
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
            "history": sliced_series.to_json(),
        }