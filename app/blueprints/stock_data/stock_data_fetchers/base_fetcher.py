from abc import abstractmethod
import logging
from app.extensions import quote_repository

logger = logging.getLogger(__name__)

class BaseFetcher:
    def __init__(self):
        self.stock_cache = {}
        self.quote_repository = quote_repository