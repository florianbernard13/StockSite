import pandas as pd
import re
from blueprints.stock_data.yfinance_wrapper.safe_ticker import SafeTicker
from datetime import datetime, timedelta
import time

class StockDataFetcher:
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

    def fetch_stock_data(self, symbol):
        """
        Récupère les données depuis Yahoo Finance pour un symbole donné et les stocke dans le cache.
        Si les données existent déjà, elles sont retournées directement.
        """
        if symbol in self.stock_cache:
            return self.stock_cache[symbol]
        
        try:
            stock = SafeTicker(symbol)
            print('essai3')
            stock_info = stock.info
            print('essai2')
            short_name = stock_info.get("shortName", "N/A")
            print('essai1')
            price = stock_info.get("ask", stock_info.get("previousClose"))

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
        Parse une chaîne indiquant une période dans un format international.
        Formats supportés :
          - '10d' ou '10day(s)' pour 10 jours
          - '1w' ou '1week(s)' pour 1 semaine (7 jours)
          - '2mo' ou '2month(s)' pour 2 mois (1 mois = 30 jours)
          - '1y' ou '1year(s)' pour 1 an (1 an = 365 jours)
        Retourne un timedelta correspondant.
        """
        period_str = period_str.strip().lower()
        match = re.match(r"(\d+)\s*([a-z]+)", period_str)
        if not match:
            print(f"Format de période invalide: {period_str}")
            return None

        num = int(match.group(1))
        unit = match.group(2)
        print(unit)

        if unit in ['d', 'day', 'days']:
            return timedelta(days=num)
        elif unit in ['w', 'week', 'weeks']:
            return timedelta(days=7 * num)
        elif unit in ['mo', 'month', 'months']:
            return timedelta(days=30 * num)
        elif unit in ['y', 'year', 'years']:
            return timedelta(days=365 * num)
        else:
            print(f"Unité de temps non supportée: {unit}")
            return None

    def format_history_json(self, df):
        """
        Transforme un DataFrame indexé par datetime en une liste de dictionnaires.
        Chaque dictionnaire contient "Datetime" (format 'YYYY-MM-DD HH:MM:SS') et "Close".
        """
        df = df.copy()
        # Supprimer le fuseau horaire
        df.index = df.index.tz_localize(None)
        df["Datetime"] = df.index
        df["Datetime"] = df["Datetime"].dt.strftime('%Y-%m-%d %H:%M:%S')
        return df[["Datetime", "Close"]].to_dict(orient="records")

    def get_stock_data_for_period(self, symbol, period_str):
        """
        Retourne les données boursières pour un symbole, tronquées selon la période demandée.
        
        La granularité utilisée est la suivante :
        - période <= 5 jours : utilise last_days_history (1m)
        - 5 jours < période <= 1 mois : utilise medium_history (60m)
        - période > 1 mois : utilise late_history (1d)
        - 'max' : utilise la granularité complète (historique complet)
        Les données sont filtrées pour ne conserver que celles dont la date est supérieure à (now - période)
        et renvoyées sous format JSON.
        """
        # Récupération (ou fetch) des données
        data = self.fetch_stock_data(symbol)
        if not data:
            return None

        # Cas spécial pour 'max'
        if period_str == "max":
            df = data["late_history"].copy()
        else:
            period_delta = self.parse_period(period_str)
            if period_delta is None:
                return None

            now = datetime.now()
            cutoff_date = now - period_delta

            # Choix de la granularité en fonction du délai demandé
            if period_delta <= timedelta(days=5):
                df = data["last_days_history"].copy()
            elif period_delta <= timedelta(days=30):
                df = data["medium_history"].copy()
            else:
                df = data["late_history"].copy()

            # Filtrer le DataFrame pour ne garder que les enregistrements après cutoff_date
            df.index = df.index.tz_localize(None)
            df = df[df.index >= cutoff_date]

        history_data = self.format_history_json(df)

        return {
            "symbol": data["symbol"],
            "shortName": data["shortName"],
            "price": data["price"],
            "history": history_data
        }
