import yfinance as yf

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

        history = stock.history(period="5d", interval="1m")

        history_data = history[["Close"]].reset_index().to_dict(orient="records")

        return {
            "symbol": symbol,
            "shortName": short_name,
            "price": price,
            "history": history_data
        }

    except Exception as e:
        print(f"Erreur lors de la récupération des données de {symbol} : {e}")
        return None
