import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta;

def fetch_stock_data(symbol):
    """
    Récupère les données boursières d'un symbole donné.
    Retourne un dictionnaire contenant le nom, le symbole, le prix actuel
    et l'historique des prix à l'heure.
    """
    try:
        stock = yf.Ticker(symbol)

        stock_info = stock.info
        short_name = stock_info.get("shortName", "N/A")
        price = stock_info.get("ask", stock_info.get("previousClose"))

        last_days_history = stock.history(period="5d", interval="1m")
        medium_history = stock.history(period="1mo", interval="60m")
        late_history = stock.history(period="max", interval="1d")

        # Concaténer les différents historiques
        history = pd.concat([late_history, medium_history, last_days_history])

        # Supprimer les doublons basés sur l'index (les dates)
        history = history.loc[~history.index.duplicated(keep='last')]

        history["Datetime"] = history.index
        history_data = history[["Datetime", "Close"]].copy()

        history_data["Datetime"] = history_data["Datetime"].dt.tz_localize(None)  # Supprime le fuseau horaire
        history_data["Datetime"] = history_data["Datetime"].dt.strftime('%Y-%m-%d %H:%M:%S')

        # Convertir en dictionnaire
        history_data = history_data.to_dict(orient="records")

        return {
            "symbol": symbol,
            "shortName": short_name,
            "price": price,
            "history": history_data
        }

    except Exception as e:
        print(f"Erreur lors de la récupération des données de {symbol} : {e}")
        return None
