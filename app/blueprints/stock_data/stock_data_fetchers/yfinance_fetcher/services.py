import pandas as pd
import re
from app.blueprints.stock_data.yfinance_wrapper.safe_ticker import SafeTicker
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

class YfinanceFetcher:
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
        self.stock_cache = {}

    def fetch_stock_info(self, symbol):
        if symbol in self.stock_cache:
            return self.stock_cache[symbol]

    def fetch_stock_data(self, symbol):
        """
        Récupère les données depuis Yahoo Finance pour un symbole donné et les stocke dans le cache.
        Si les données existent déjà, elles sont retournées directement.
        """
        if symbol in self.stock_cache:
            return self.stock_cache[symbol]
        
        try:
            stock = SafeTicker(symbol)
            stock_info = stock.info
            print(stock_info)
            short_name = stock_info.get("shortName", "N/A")
            price = stock_info.get("ask", stock_info.get("currentPrice"))

            # Récupération des historiques aux différentes granularités
            last_days_history = stock.history(period="5d", interval="1m")
            medium_history   = stock.history(period="1mo", interval="60m")
            late_history     = stock.history(period="max", interval="1d")

            self.stock_cache[symbol] = {
                "symbol": symbol,
                "shortName": short_name,
                "price": price,
                "last_days_history": last_days_history,
                "medium_history": medium_history,
                "late_history": late_history
            }
            
            return self.stock_cache[symbol]
        except Exception as e:
            print(f"Erreur lors de la récupération des données de {symbol} : {e}")
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

    def get_stock_data_for_period(self, symbol, period_str):
        data = self.fetch_stock_data(symbol)
        if not data:
            return None

        histories = (
            data.get("last_days_history"),
            data.get("medium_history"),
            data.get("late_history"),
        )
        if all(hasattr(df, "empty") and df.empty for df in histories):
            print(f"[WARN] No price history at all for {symbol!r}; ignoring this symbol.")
            return None

        if period_str == "max":
            df = data["late_history"].copy()
        else:
            parsed = self.parse_period(period_str)  # Ex : (5, 'd') ou (2, 'm') ou (1, 'y')
            if parsed is None:
                return None

            amount, unit = parsed
            cutoff_date = self.get_cutoff_date(amount, unit)

            # Choix granularité selon la durée en jours approximative
            approx_days = amount
            if unit == 'm':
                approx_days = amount * 30
            elif unit == 'y':
                approx_days = amount * 365

            if approx_days <= 5:
                df = data["last_days_history"].copy()
            elif approx_days <= 30:
                df = data["medium_history"].copy()
            else:
                df = data["late_history"].copy()

            if df.empty:
                return None
            df.index = df.index.tz_localize(None)
            df = df[df.index >= cutoff_date]

        history_data = self.format_history_json(df)

        return {
            "symbol": data["symbol"],
            "shortName": data["shortName"],
            "price": data["price"],
            "history": history_data
        }
