import ssl
import requests
from requests.adapters import HTTPAdapter
from urllib3.poolmanager import PoolManager

class TLSHttpAdapter(HTTPAdapter):
    def __init__(self, ssl_context=None, **kwargs):
        self.ssl_context = ssl_context
        super().__init__(**kwargs)

    def init_poolmanager(self, connections, maxsize, block=False, **pool_kwargs):
        # On injecte le contexte TLS personnalisé dans le poolmanager urllib3
        if self.ssl_context is not None:
            pool_kwargs['ssl_context'] = self.ssl_context
        super().init_poolmanager(connections, maxsize, block=block, **pool_kwargs)