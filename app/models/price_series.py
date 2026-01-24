from datetime import datetime
from dataclasses import dataclass
from pyrsistent import pvector
from typing import TypeAlias

PricePoint: TypeAlias = tuple[datetime, float]

@dataclass(frozen=True)
class PriceSeries:
    prices: "pvector[tuple[datetime, float]]"

    @classmethod
    def empty(cls) -> PriceSeries:
        return cls(pvector())

    def add(self, date: datetime, price: float) -> PriceSeries:
        if self.prices:
            last_date = self.prices[-1][0]
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
    
    def merge(self, other: PriceSeries) -> PriceSeries:
        if not self.prices:
            return other
        if not other.prices:
            return self

        # dates de début / fin
        self_start, self_end = self.prices[0][0], self.prices[-1][0]
        other_start, other_end = other.prices[0][0], other.prices[-1][0]

        # Cas prepend total (other entirely before self)
        if other_end < self_start:
            return PriceSeries(other.prices.extend(self.prices))

        # Cas append total (other entirely after self)
        if other_start > self_end:
            return PriceSeries(self.prices.extend(other.prices))

        # Cas chevauchement partiel / overwrite
        # garder self avant le début de other
        cut_index = 0
        for i, (date, _) in enumerate(self.prices):
            if date >= other_start:
                cut_index = i
                break

        merged = self.prices[:cut_index].extend(other.prices)
        return PriceSeries(merged)
    
    def slice(self, start: datetime | None = None, end: datetime | None = None) -> PriceSeries:
        # rendre start et end naïfs
        if start is not None:
            start = start.replace(tzinfo=None)
        if end is not None:
            end = end.replace(tzinfo=None)

        filtered = [
            (d.replace(tzinfo=None), p)  # rendre chaque date naïve
            for d, p in self.prices
            if (start is None or d.replace(tzinfo=None) >= start) and
            (end is None or d.replace(tzinfo=None) <= end)
        ]
        return PriceSeries(pvector(filtered))
    
    def to_json(self):
        return [
            {"Datetime": dt.replace(tzinfo=None).strftime("%Y-%m-%d %H:%M:%S"), "Close": price}
            for dt, price in self.prices
        ]
