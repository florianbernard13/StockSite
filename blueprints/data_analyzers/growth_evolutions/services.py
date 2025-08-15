from blueprints.data_analyzers.interfaces.base_analyzer import BaseAnalyzer
from blueprints.data_tools.growth_evolution.services import GrowthEvolutionService
from blueprints.data_analyzers.analyzer_registry import register_analyzer

@register_analyzer
class GrowthEvolutionAnalyzer(BaseAnalyzer):
    analyzer_name = "growth_evolution"
    period = "2w"

    def analyze(self, history: list[dict]) -> dict:
        try:
            service = GrowthEvolutionService(history)
            return service.get_results()
        except Exception as e:
            return {"error": str(e)}
