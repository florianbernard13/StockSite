import logging
from app.extensions import quote_repository
from app.services.price_series_slicer import PriceSeriesSlicer

logger = logging.getLogger(__name__)


class QuoteQueryService:

    @staticmethod
    def get_price_series_for_period(symbol: str, period: str):
        quote = quote_repository.get(symbol)
        if quote is None:
            logger.warning("Quote not found for symbol=%r", symbol)
            return None

        return PriceSeriesSlicer.slice_quote_for_period(quote, period)
