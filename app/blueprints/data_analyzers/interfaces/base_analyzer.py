# data_analyzers/interfaces/base_analyzer.py

from abc import ABC, abstractmethod

class BaseAnalyzer(ABC):
    analyzer_name: str
    period: str

    @abstractmethod
    def analyze(self, history: list[dict]) -> dict:
        """Analyse une série de données boursières."""
        pass