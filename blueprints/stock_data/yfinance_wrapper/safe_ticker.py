# stock_data/yfinance_wrapper/safe_ticker.py

import time
import yfinance as yf
import requests
from .config import YFINANCE_DELAY
import ssl
from blueprints.stock_data.yfinance_wrapper.http_adapter import TLSHttpAdapter

def create_tls_context():
    ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
    ctx.options |= ssl.OP_NO_TLSv1 | ssl.OP_NO_TLSv1_1           # désactive TLS<1.2
    ctx.set_ciphers('ECDHE+AESGCM:!aNULL:!eNULL')                 # ciphers modernes
    ctx.set_alpn_protocols(['http/1.1'])                         # ALPN pour HTTP/1.1
    ctx.load_default_certs()                                     # certs système
    return ctx

class SafeTicker:
    """
    Wrapper autour de yfinance.Ticker qui throttler (ralentit)
    chaque appel à .history() en respectant YFINANCE_DELAY.
    """
    def __init__(self, symbol: str):
        session = requests.Session()
        adapter = TLSHttpAdapter(ssl_context=create_tls_context())
        session.mount("https://", adapter)
        self._ticker = yf.Ticker(symbol, session=session)

    @property
    def info(self):
        time.sleep(YFINANCE_DELAY)
        return self._ticker.info

    def history(self, *args, **kwargs):
        time.sleep(YFINANCE_DELAY)
        return self._ticker.history(*args, **kwargs)