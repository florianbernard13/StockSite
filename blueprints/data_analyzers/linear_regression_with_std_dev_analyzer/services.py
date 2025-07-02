from blueprints.stock_data.stock_data_fetcher.shared_fetcher import shared_stock_data_fetcher
from blueprints.data_tools.linear_regression.services import LinearRegressionService

class BatchStockAnalyzer:
    CAC40_COMPANIES = [
        # {"name": "Air Liquide", "ticker": "AI.PA"},
        # {"name": "Airbus", "ticker": "AIR.PA"},
        # {"name": "Alstom", "ticker": "ALO.PA"},
        # {"name": "ArcelorMittal", "ticker": "MT.AS"},
        # {"name": "Axa", "ticker": "CS.PA"},
        # {"name": "BNP Paribas", "ticker": "BNP.PA"},
        # {"name": "Bouygues", "ticker": "EN.PA"},
        # {"name": "Capgemini", "ticker": "CAP.PA"},
        # {"name": "Carrefour", "ticker": "CA.PA"},
        # {"name": "Dassault Systèmes", "ticker": "DSY.PA"},
        # {"name": "Engie", "ticker": "ENGI.PA"},
        # {"name": "EssilorLuxottica", "ticker": "EL.PA"},
        # {"name": "Hermès", "ticker": "RMS.PA"},
        # {"name": "Kering", "ticker": "KER.PA"},
        # {"name": "Legrand", "ticker": "LR.PA"},
        # {"name": "L'Oréal", "ticker": "OR.PA"},
        # {"name": "LVMH", "ticker": "MC.PA"},
        # {"name": "Michelin", "ticker": "ML.PA"},
        # {"name": "Orange", "ticker": "ORA.PA"},
        # {"name": "Pernod Ricard", "ticker": "RI.PA"},
        # {"name": "Publicis", "ticker": "PUB.PA"},
        # {"name": "Renault", "ticker": "RNO.PA"},
        # {"name": "Safran", "ticker": "SAF.PA"},
        # {"name": "Saint-Gobain", "ticker": "SGO.PA"},
        # {"name": "Sanofi", "ticker": "SAN.PA"},
        # {"name": "Schneider Electric", "ticker": "SU.PA"},
        # {"name": "Société Générale", "ticker": "GLE.PA"},
        {"name": "STMicroelectronics", "ticker": "STM.PA"},
        {"name": "Téléperformance", "ticker": "TEP.PA"},
        {"name": "Thales", "ticker": "HO.PA"},
        {"name": "TotalEnergies", "ticker": "TTE.PA"},
        {"name": "Unibail-Rodamco-Westfield", "ticker": "URW.AS"},
        {"name": "Veolia", "ticker": "VIE.PA"},
        {"name": "Vinci", "ticker": "DG.PA"},
        {"name": "Vivendi", "ticker": "VIV.PA"},
        {"name": "Worldline", "ticker": "WLN.PA"},
        {"name": "Eurofins Scientific", "ticker": "ERF.PA"},
        {"name": "Dassault Aviation", "ticker": "AM.PA"},
        {"name": "Edenred", "ticker": "EDEN.PA"},
    ]

    def __init__(self, stocks_list=None, period="6m"):
        if stocks_list is None:
            stocks_list = self.CAC40_COMPANIES
        self.stock_data_fetcher = shared_stock_data_fetcher
        self.stocks_list = stocks_list
        self.period = period

    def analyze_all(self, period="6m"):
        results = []
        for stock in self.stocks_list:
            symbol = stock["ticker"]
            data = self.stock_data_fetcher.get_stock_data_for_period(symbol, period)
            if not data or "history" not in data:
                continue

            lr = LinearRegressionService(data["history"])
            analysis = lr.get_last_point_analysis()
            if "error" in analysis:
                continue

            print({
                "symbol": symbol,
                "name": stock["name"],
                "analysis": analysis
            })
            results.append({
                "symbol": symbol,
                "name": stock["name"],
                "analysis": analysis
            })

        # Trier par écart % décroissant (valeur nulle traitée comme 0)
        results.sort(key=lambda x: x["analysis"].get("pct_diff_to_-2σ") or 0, reverse=True)
        return results
