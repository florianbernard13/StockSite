from blueprints.stock_data.stock_data_fetcher.shared_fetcher import shared_stock_data_fetcher
from blueprints.data_tools.linear_regression.services import LinearRegressionService
from blueprints.stock_data.configs.cac40 import CAC40_COMPANIES

class BatchStockAnalyzer:

    def __init__(self, stocks_list=None, period="6m"):
        if stocks_list is None:
            stocks_list = CAC40_COMPANIES
        self.stock_data_fetcher = shared_stock_data_fetcher
        self.stocks_list = stocks_list
        self.period = period

    def analyze_all(self, period="6m"):
        results = []
        for stock in self.stocks_list:
            symbol = stock["ticker"]
            name = stock["name"]
            data = self.stock_data_fetcher.get_stock_data_for_period(symbol, period)
            if not data:
                results.append({
                    "symbol": symbol,
                    "name": name,
                    "analysis": {"error": "no_data_returned"}
                })
                continue
            if "history" not in data:
                results.append({
                    "symbol": symbol,
                    "name": name,
                    "analysis": {"error": "history_missing"}
                })
                continue

            lr = LinearRegressionService(data["history"])
            analysis = lr.get_last_point_analysis()
            if "error" in analysis:
                results.append({
                    "symbol": symbol,
                    "name": name,
                    "analysis": analysis
                })
                continue

            print({
                "symbol": symbol,
                "name": name,
                "analysis": analysis
            })
            results.append({
                "symbol": symbol,
                "name": name,
                "analysis": analysis
            })

        # Trier par écart % décroissant (valeur nulle traitée comme 0)
        results.sort(key=lambda x: x["analysis"].get("pct_diff_to_-2σ") or 0, reverse=True)
        return results
