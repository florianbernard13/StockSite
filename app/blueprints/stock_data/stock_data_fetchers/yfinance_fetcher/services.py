import pandas as pd
from app.blueprints.stock_data.stock_data_fetchers.base_fetcher import BaseFetcher
from app.blueprints.stock_data.yfinance_wrapper.safe_ticker import SafeTicker
from app.builders.quote_builder import QuoteBuilder
from app.adapters.price_series_adapter import PriceSeriesAdapter
import logging

logger = logging.getLogger(__name__)

class YfinanceFetcher(BaseFetcher):
    """
    Classe pour récupérer et mettre en cache les données boursières depuis Yahoo Finance.
    Elle gère trois granularités :
      - last_days_history : 5 derniers jours (intervalle 1 minute)
      - medium_history   : 1 mois (intervalle 60 minutes)
      - late_history     : historique complet (intervalle 1 jour)
    Et fournit une méthode pour retourner, selon une période donnée au format international,
    les données adaptées, filtrées et formatées en JSON.
    """
    
    def __init__(self):
        # Dictionnaire de cache pour stocker les données par symbole
        super().__init__()

    def fetch_stock_data(self, symbol):
        """
        Récupère les données depuis Yahoo Finance pour un symbole donné,
        hydrate le Quote et met en cache les métadonnées.
        """
        if symbol in self.stock_cache:
            logger.debug("Stock data cache hit for symbol=%r", symbol)
            return self.stock_cache[symbol]
        
        logger.info("Fetching stock data for symbol=%r", symbol)
        
        try:
            quote = self.quote_repository.get_or_create(symbol)
            quote_builder = QuoteBuilder.from_quote(quote)

            stock = SafeTicker(symbol)
            stock_info = stock.info or {}

            short_name = stock_info.get("shortName", "N/A")
            price = stock_info.get("ask", stock_info.get("currentPrice"))

            quote_builder.with_name(short_name)

            # Historiques Yahoo (brut)
            last_days_history = stock.history(period="5d", interval="1m")
            medium_history = stock.history(period="1mo", interval="60m")
            late_history = stock.history(period="max", interval="1d")
            
            # Conversion → modèle
            self.convert_and_add_price_many(last_days_history, quote_builder)
            self.convert_and_add_price_many(medium_history, quote_builder)
            self.convert_and_add_price_many(late_history, quote_builder)

            quote = quote_builder.build()
            self.quote_repository.save(quote)
            print(self.quote_repository)

            self.stock_cache[symbol] = {
                "symbol": symbol,
                "shortName": short_name,
                "price": price,
            }

            logger.info("Stock data successfully fetched for symbol=%r", symbol)
            return self.stock_cache[symbol]
            
        except Exception:
            logger.exception("Failed to fetch stock data for symbol=%r", symbol)
            return None

    def format_history_json(self, df):
        """
        Transforme un DataFrame indexé par datetime en une liste de dictionnaires.
        Chaque dictionnaire contient "Datetime" (format 'YYYY-MM-DD HH:MM:SS') et "Close".
        """
        df = df.copy()
        # Supprimer le fuseau horaire
        df.index = df.index.tz_localize(None)
        df.loc[:, "Datetime"] = df.index
        df.loc[:, "Datetime"] = df["Datetime"].dt.strftime('%Y-%m-%d %H:%M:%S')
        return df.loc[:, ["Datetime", "Close"]].to_dict(orient="records")
    
    @staticmethod
    def convert_and_add_price_many(yfinance_dataframe: pd.DataFrame, quote_builder: QuoteBuilder):
        converted_yfinance_dataframe = PriceSeriesAdapter.from_yfinance(yfinance_dataframe)
        quote_builder.add_price_many(converted_yfinance_dataframe)

    
