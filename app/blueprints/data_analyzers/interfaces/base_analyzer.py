# data_analyzers/interfaces/base_analyzer.py

from app.models.price_series import PriceSeries
from abc import ABC, abstractmethod
from typing import Generic

class BaseAnalyzer(ABC):
    analyzer_name: str
    period: str

    @abstractmethod
    def analyze(self, series: PriceSeries) -> dict:
        """Analyse une série de données boursières."""
        pass