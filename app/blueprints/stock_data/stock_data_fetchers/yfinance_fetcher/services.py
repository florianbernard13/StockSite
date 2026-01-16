from shlex import quote
import pandas as pd
import re
from app.blueprints.stock_data.stock_data_fetchers.base_fetcher import BaseFetcher
from app.blueprints.stock_data.yfinance_wrapper.safe_ticker import SafeTicker
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
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

    def parse_period(self, period_str):
        """
        Parse une chaîne indiquant une période dans un format international simple,
        et retourne un tuple (amount, unit).

        Formats supportés :
        - '10d', '10day', '10days' pour 10 jours
        - '1w', '1week', '1weeks' pour 1 semaine (convertie en jours)
        - '2m', '2month', '2months' pour 2 mois
        - '1y', '1year', '1years' pour 1 an

        Unités retournées :
        - 'd' pour jours (les semaines sont converties en jours)
        - 'm' pour mois
        - 'y' pour années

        Exemple d’utilisation :
        parse_period("15d")  -> (15, 'd')
        parse_period("3m")  -> (3, 'm')
        parse_period("1year") -> (1, 'y')

        Retour :
        - Tuple (int, str) = (nombre, unité normalisée)
        - None si format invalide ou unité non supportée
        """
        period_str = period_str.strip().lower()
        match = re.match(r"(\d+)\s*([a-z]+)", period_str)
        if not match:
            print(f"Format de période invalide: {period_str}")
            return None

        num = int(match.group(1))
        unit = match.group(2)

        # Normaliser l’unité aux codes courts d, m, y
        if unit in ['d', 'day', 'days']:
            unit = 'd'
        elif unit in ['w', 'week', 'weeks']:
            # Convertir semaine en jours directement ?
            # Soit on refuse et on force à utiliser 'd', soit on accepte en 'd' ici
            unit = 'd'
            num = num * 7
        elif unit in ['m', 'month', 'months']:
            unit = 'm'
        elif unit in ['y', 'year', 'years']:
            unit = 'y'
        else:
            print(f"Unité de temps non supportée: {unit}")
            return None

        return num, unit


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
    def get_cutoff_date(amount, unit):
        now = datetime.now()
        mapping = {
            'd': timedelta(days=amount),
            'm': relativedelta(months=amount),
            'y': relativedelta(years=amount),
        }
        delta = mapping.get(unit)
        return now - delta if delta else None

    def get_stock_data_for_period(self, symbol: str, period_str: str):
        meta = self.fetch_stock_data(symbol)
        if meta is None:
            logger.warning("Unable to fetch stock data for symbol=%r", symbol)
            return None

        quote = self.quote_repository.get(symbol)   
        if quote is None:
            logger.warning("Quote not found for symbol=%r", symbol)
            return None

        price_series = quote.price_series

        if not price_series or not price_series.prices:
            logger.warning("No price series available for symbol=%r", symbol)
            return None

        # Détermination de la période
        if period_str == "max":
            sliced_series = price_series
            logger.debug("Using full price series for symbol=%r", symbol)
        else:
            parsed = self.parse_period(period_str)
            if parsed is None:
                logger.warning(
                    "Invalid period format %r for symbol=%r",
                    period_str,
                    symbol,
                )
                return None

            amount, unit = parsed
            cutoff_date = self.get_cutoff_date(amount, unit)

            if cutoff_date is None:
                logger.warning(
                    "Unable to compute cutoff date (amount=%s, unit=%s) for symbol=%r",
                    amount,
                    unit,
                    symbol,
                )
                return None

            logger.debug(
                "Slicing price series for symbol=%r from cutoff_date=%s",
                symbol,
                cutoff_date,
            )

            sliced_series = price_series.slice(start=cutoff_date)

            if not sliced_series.prices:
                logger.warning(
                    "No price data after cutoff_date=%s for symbol=%r",
                    cutoff_date,
                    symbol,
                )
                return None

        return {
            "symbol": quote.symbol,
            "shortName": quote.name,
            "price": quote.current_price,
            "history": sliced_series.to_json(),
        }
    
    @staticmethod
    def convert_and_add_price_many(yfinance_dataframe: pd.DataFrame, quote_builder: QuoteBuilder):
        converted_yfinance_dataframe = PriceSeriesAdapter.from_yfinance(yfinance_dataframe)
        quote_builder.add_price_many(converted_yfinance_dataframe)
