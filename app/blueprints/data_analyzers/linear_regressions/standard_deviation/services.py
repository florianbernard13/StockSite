# data_analyzers/linear_regressions/standard_deviation/services.py

from app.blueprints.data_analyzers.interfaces.base_analyzer import BaseAnalyzer
from app.blueprints.data_tools.linear_regression.services import LinearRegressionService
from app.blueprints.data_analyzers.analyzer_registry import register_analyzer

@register_analyzer
class LinearRegressionWithStdDeviationAnalyzer(BaseAnalyzer):
    analyzer_name = "linear_regression"
    period = "6m"

    def analyze(self, history: list[dict]) -> dict:
        try:
            service = LinearRegressionService(history)
            return service.get_last_point_analysis()
        except Exception as e:
            return {"error": str(e)}
