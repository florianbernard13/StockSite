from datetime import datetime
from dataclasses import dataclass
from pyrsistent import pvector

@dataclass(frozen=True)
class PriceSeries:
    prices: "pvector[tuple[datetime, float]]"

    @classmethod
    def empty(cls) -> PriceSeries:
        return cls(pvector())

    def add(self, date, price: float) -> PriceSeries:
        return type(self)(self.prices.append((date, price)))
    
    def latest(self) -> float | None:
        return self.prices[-1][1] if self.prices else None