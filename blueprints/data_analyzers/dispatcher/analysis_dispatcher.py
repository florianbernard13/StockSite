from blueprints.stock_data.stock_data_fetcher.shared_fetcher import shared_stock_data_fetcher
from blueprints.data_analyzers.linear_regressions.standard_deviation.services import LinearRegressionWithStdDeviationAnalyzer
from blueprints.data_analyzers.growth_evolutions.services import GrowthEvolutionAnalyzer
from blueprints.data_analyzers.interfaces.base_analyzer import BaseAnalyzer
from blueprints.stock_data.configs.cac40 import CAC40_COMPANIES
from blueprints.data_analyzers.analyzer_registry import ANALYZERS_REGISTRY
import logging

logger = logging.getLogger(__name__)

class AnalysisDispatcher:
    def __init__(self, analyses_names: list[str] = None, stocks_list=None):
        self.stock_data_fetcher = shared_stock_data_fetcher
        self.stocks_list = stocks_list if stocks_list else CAC40_COMPANIES
        
        self.analyzers = []
        if analyses_names:
            for analysis_name in analyses_names:
                analyzer_cls = ANALYZERS_REGISTRY.get(analysis_name)
                if analyzer_cls:
                    self.analyzers.append(analyzer_cls())

    def analyze_all(self) -> list[dict]:
        results = []

        logger.info(f"Analyse lancée sur {len(self.stocks_list)} actions.")

        for stock in self.stocks_list:
            symbol = stock["ticker"]
            name = stock["name"]

            logger.info(f"Analyse de {symbol} - {name}...")

            analysis_result = {}

            for analyzer in self.analyzers:
                data = self.stock_data_fetcher.get_stock_data_for_period(symbol, analyzer.period)

                if not data or "history" not in data:
                    analysis_result[analyzer.analyzer_name] = {"error": "no_valid_history"}
                    continue

                analysis = analyzer.analyze(data["history"])
                analysis_result[analyzer.analyzer_name] = analysis

            results.append({
                "symbol": symbol,
                "name": name,
                "analysis": analysis_result
            })

            logger.info(f"✔️  Analyse terminée pour {symbol}")

        return results

