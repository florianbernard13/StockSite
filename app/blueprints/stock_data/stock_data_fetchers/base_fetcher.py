from app.repositories.quote_repository import QuoteRepository

class BaseFetcher:
    def __init__(self):
        self.stock_cache = {}
        self.quote_repository = QuoteRepository()