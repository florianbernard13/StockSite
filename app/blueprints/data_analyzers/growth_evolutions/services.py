from app.blueprints.data_analyzers.interfaces.base_analyzer import BaseAnalyzer
from app.blueprints.data_tools.growth_evolution.services import GrowthEvolutionService
from app.blueprints.data_analyzers.analyzer_registry import register_analyzer
from app.models.price_series import PriceSeries

@register_analyzer
class GrowthEvolutionAnalyzer(BaseAnalyzer):
    analyzer_name = "growth_evolution"
    period = "2w"

    def analyze(self, series: PriceSeries) -> dict:
        try:
            service = GrowthEvolutionService(series.all_prices)
            return service.get_results()
        except Exception as e:
            return {"error": str(e)}
