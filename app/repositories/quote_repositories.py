from models.quote import Quote
from models.price_series import PriceSeries

class QuoteRepositories:
    def __init__(self):
        self._cache: dict[str, Quote] = {}

    def get(self, symbol: str) -> Quote:
        return self._cache.get(symbol)

    def create(self, symbol: str) -> Quote:
        quote = Quote(symbol, None, PriceSeries.empty())
        self._cache[symbol] = quote
        return quote

    def with_name(self, symbol: str, name: str) -> Quote:
        old = self._cache[symbol]
        new = Quote(old.symbol, name, old.prices)
        self._cache[symbol] = new
        return new

    def add_price(self, symbol: str, date, price: float) -> Quote:
        old_quote = self._cache[symbol]
        new_quote = old_quote.add_price(date, price)
        self._cache[symbol] = new_quote
        return new_quote