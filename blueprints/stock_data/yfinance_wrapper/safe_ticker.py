# stock_data/yfinance_wrapper/safe_ticker.py

import time
import yfinance as yf
from .config import YFINANCE_DELAY

class SafeTicker:
    """
    Wrapper autour de yfinance.Ticker qui throttler (ralentit)
    chaque appel à .history() en respectant YFINANCE_DELAY.
    """
    def __init__(self, symbol: str):
        self._ticker = yf.Ticker(symbol)

    @property
    def info(self):
        return self._ticker.info

    def history(self, *args, **kwargs):
        time.sleep(YFINANCE_DELAY)
        return self._ticker.history(*args, **kwargs)
