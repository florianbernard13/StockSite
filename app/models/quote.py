import array
from datetime import datetime
from .price_series import PriceSeries
from dataclasses import dataclass

@dataclass(frozen=True)
class Quote:
    symbol: str
    name: str | None
    price_series: PriceSeries

    @property
    def current_price(self) -> float | None:
        return self.price_series.latest()

    @property
    def list_all_prices(self) -> list[tuple[datetime, float]]:
        return self.price_series.all_prices
    
    def add_price(self, date: datetime, price: float) -> Quote:
        return Quote(
            self.symbol,
            self.name,
            self.price_series.add(date, price)
        )
    
    def add_price_many(self, prices: PriceSeries) -> Quote:
        return Quote(
            symbol=self.symbol,
            name=self.name,
            prices=self.price_series.merge(prices)
        )
    
    def get_prices_between(self, start: datetime | None = None, end: datetime | None = None) -> PriceSeries:
        return self.price_series.slice(start=start, end=end)