from blueprints.stock_data.configs.cac40 import CAC40_COMPANIES

class StockSearchService:

    def __init__(self, stock_name):
        self.stock_name = stock_name

    @staticmethod
    def autocomplete(query):
        if not query:
            return []

        return [
            stock for stock in CAC40_COMPANIES
            if query in stock["name"].lower() or query in stock["ticker"].lower()
        ]