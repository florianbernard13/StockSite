from app.models.quote import Quote
from app.models.price_series import PriceSeries

class QuoteBuilder:
    def __init__(
        self,
        symbol: str,
        *,
        name: str | None = None,
        prices: PriceSeries | None = None
    ):
        self._symbol = symbol
        self._name = name
        self._prices = prices or PriceSeries.empty()

    @classmethod
    def from_quote(cls, quote: Quote) -> QuoteBuilder:
        return cls(
            symbol=quote.symbol,
            name=quote.name,
            prices=quote.price_series
        )

    def with_name(self, name: str) -> QuoteBuilder:
        self._name = name
        return self

    def add_price_many(self, prices: PriceSeries) -> QuoteBuilder:
        self._prices = self._prices.merge(prices)
        return self

    def add_price(self, date, price: float) -> QuoteBuilder:
        self._prices = self._prices.add(date, price)
        return self

    def build(self) -> Quote:
        return Quote(
            symbol=self._symbol,
            name=self._name,
            price_series=self._prices
        )
