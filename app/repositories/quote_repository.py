from app.models.quote import Quote
from app.models.price_series import PriceSeries

class QuoteRepository:
    def __init__(self):
        self._cache: dict[str, Quote] = {}

    def get(self, symbol: str) -> Quote | None:
        return self._cache.get(symbol)

    def save(self, quote: Quote) -> None:
        self._cache[quote.symbol] = quote

    def get_or_create(self, symbol: str) -> Quote:
        if symbol not in self._cache:
            self._cache[symbol] = Quote(
                symbol=symbol,
                name=None,
                price_series=PriceSeries.empty()
            )
        return self._cache[symbol]