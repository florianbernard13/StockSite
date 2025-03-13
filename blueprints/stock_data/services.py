import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

# Dictionnaire en mémoire pour stocker les données (clé = symbole)
stock_cache = {}

def fetch_stock_data(symbol):
    """
    Récupère et met en cache les données boursières d'un symbole donné.
    """
    try:
        stock = yf.Ticker(symbol)
        stock_info = stock.info
        short_name = stock_info.get("shortName", "N/A")
        price = stock_info.get("ask", stock_info.get("previousClose"))

        # Récupérer l'historique sous forme brute
        last_days_history = stock.history(period="5d", interval="1m")
        medium_history = stock.history(period="1mo", interval="60m")
        late_history = stock.history(period="max", interval="1d")

        #Récupérer les dates présentes dans last_days_history (les plus précises)
        last_days_dates = set(last_days_history.index.date)

        #Filtrer medium_history pour supprimer les jours déjà présents dans last_days_history
        filtered_medium_history = medium_history[[d not in last_days_dates for d in medium_history.index.date]]

        #Récupérer les nouvelles dates après filtrage de medium_history
        precise_dates = last_days_dates.union(set(filtered_medium_history.index.date))

        #Filtrer late_history pour supprimer les jours déjà présents dans precise_dates
        filtered_late_history = late_history[[d not in precise_dates for d in late_history.index.date]]

        #Concaténer les données en donnant la priorité aux données plus précises
        history = pd.concat([filtered_late_history, filtered_medium_history, last_days_history])

        # Stockage de l'historique brut dans le cache
        stock_cache[symbol] = {
            "symbol": symbol,
            "shortName": short_name,
            "price": price,
            "history_raw": history  # On garde les données sous forme de DataFrame ici
        }

        return get_stock_data(symbol)  # Retourner les données transformées

    except Exception as e:
        print(f"Erreur lors de la récupération des données de {symbol} : {e}")
        return None

def get_stock_data(symbol):
    """
    Transforme les données du cache en format JSON.
    """
    if symbol not in stock_cache:
        return None

    stock = stock_cache[symbol]
    history = stock["history_raw"].copy()

    # Transformation des dates
    history["Datetime"] = history.index
    history_data = history[["Datetime", "Close"]].copy()
    history_data["Datetime"] = history_data["Datetime"].dt.tz_localize(None)  # Supprime le fuseau horaire
    history_data["Datetime"] = history_data["Datetime"].dt.strftime('%Y-%m-%d %H:%M:%S')

    return {
        "symbol": stock["symbol"],
        "shortName": stock["shortName"],
        "price": stock["price"],
        "history": history_data.to_dict(orient="records")  # Conversion finale
    }

def get_last_days_stock_data(symbol, days=5):
    """
    Retourne uniquement les X derniers jours de l'historique.
    """
    if symbol not in stock_cache:
        fetch_stock_data(symbol)

    history = stock_cache[symbol]["history_raw"].copy()
    cutoff_date = datetime.now() - timedelta(days=days)

    # Filtrer les données avant conversion
    history = history[history.index.tz_localize(None) >= cutoff_date]

    # Appliquer la transformation JSON
    stock_cache[symbol]["history_raw"] = history  # On garde en cache
    return get_stock_data(symbol)
