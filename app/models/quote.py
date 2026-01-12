from price_series import PriceSeries
from dataclasses import dataclass

@dataclass(frozen=True)
class Quote:
    def __init__(self, symbol: str):
        self.symbol = symbol
        self.name: str | None = None
        self.prices = PriceSeries()

    @property
    def current_price(self) -> float | None:
        return self.prices.latest()
    
    def add_price(self, date, price: float) -> Quote:
        new_prices = self.prices.add(date, price)
        return Quote(self.symbol, self.name, new_prices)