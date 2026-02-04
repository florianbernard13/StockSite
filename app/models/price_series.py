from datetime import datetime
from dataclasses import dataclass
from pyrsistent import pvector
from typing import TypeAlias, Union

PricePoint: TypeAlias = tuple[datetime, float]
TimestampLike = Union[datetime, str]

@dataclass(frozen=True)
class PriceSeries:
    prices: "pvector[PricePoint]"
    
    @classmethod
    def empty(cls) -> PriceSeries:
        return cls(pvector())

    def add(self, date: str, price: float) -> PriceSeries:
        if self.prices:
            last_date, _ = self.prices[-1]
            if date < last_date:
                raise ValueError("PriceSeries.add expects non-decreasing dates")
            if date == last_date:
                return PriceSeries(
                    self.prices[:-1].append((date, price))
                )
        return PriceSeries(self.prices.append((date, price)))
    
    def latest(self) -> float | None:
        return self.prices[-1][1] if self.prices else None
    
    @property
    def all_prices(self) -> list[PricePoint]:
        return list(self.prices)
    
    def merge(self, other: "PriceSeries") -> "PriceSeries":
        if not self.prices:
            return other
        if not other.prices:
            return self

        merged = []
        i, j = 0, 0
        n, m = len(self.prices), len(other.prices)

        while i < n and j < m:
            self_ts, self_price = self.prices[i]
            other_ts, other_price = other.prices[j]

            if self_ts < other_ts:
                merged.append((self_ts, self_price))
                i += 1
            elif self_ts > other_ts:
                merged.append((other_ts, other_price))
                j += 1
            else:
                # égalité de timestamps : on prend 'other'
                merged.append((other_ts, other_price))
                i += 1
                j += 1

        # ajouter le reste
        while i < n:
            merged.append(self.prices[i])
            i += 1
        while j < m:
            merged.append(other.prices[j])
            j += 1

        return PriceSeries(pvector(merged))
    
    def slice(self, start: str | None = None, end: str | None = None) -> PriceSeries:
        filtered = [
            (date, price)
            for date, price in self.prices
            if (start is None or date >= start) and (end is None or date <= end)
        ]
        return PriceSeries(pvector(filtered))
    
    def to_json(self):
        return [{"Datetime": ts, "Close": price} for ts, price in self.prices]
