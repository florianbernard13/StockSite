# data_analyzers/linear_regressions/standard_deviation/services.py

from app.blueprints.data_analyzers.interfaces.base_analyzer import BaseAnalyzer
from app.blueprints.data_tools.linear_regression.services import LinearRegressionService
from app.blueprints.data_analyzers.analyzer_registry import register_analyzer
from app.models.price_series import PriceSeries
import logging

logger = logging.getLogger(__name__)

@register_analyzer
class LinearRegressionWithStdDeviationAnalyzer(BaseAnalyzer):
    analyzer_name = "linear_regression"
    period = "6m"

    def analyze(self, series: PriceSeries) -> dict:
        try:
            service = LinearRegressionService(series.all_prices)
            return service.get_last_point_analysis()

        except Exception as e:
            logger.exception(
                "Erreur lors de l'analyse par régression linéaire",
                extra={
                    "analyzer": self.analyzer_name,
                    "history_length": len(series) if series else 0,
                }
            )
            return {"error": "linear_regression_failed"}
