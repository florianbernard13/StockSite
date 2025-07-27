# data_analyzers/linear_regressions/standard_deviation/services.py

from blueprints.data_analyzers.interfaces.base_analyzer import BaseAnalyzer
from blueprints.data_tools.linear_regression.services import LinearRegressionService
from blueprints.data_analyzers.analyzer_registry import register_analyzer

@register_analyzer
class LinearRegressionWithStdDeviationAnalyzer(BaseAnalyzer):
    name = "linear_regression_std"
    period = "6m"

    def analyze(self, history: list[dict]) -> dict:
        try:
            service = LinearRegressionService(history)
            return service.get_last_point_analysis()
        except Exception as e:
            return {"error": str(e)}
