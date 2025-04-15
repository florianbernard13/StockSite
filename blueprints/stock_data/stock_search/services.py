class StockSearchService:
    CAC40_COMPANIES = [
        {"name": "Air Liquide", "ticker": "AI.PA"},
        {"name": "Airbus", "ticker": "AIR.PA"},
        {"name": "Alstom", "ticker": "ALO.PA"},
        {"name": "ArcelorMittal", "ticker": "MT.AS"},
        {"name": "Axa", "ticker": "CS.PA"},
        {"name": "BNP Paribas", "ticker": "BNP.PA"},
        {"name": "Bouygues", "ticker": "EN.PA"},
        {"name": "Capgemini", "ticker": "CAP.PA"},
        {"name": "Carrefour", "ticker": "CA.PA"},
        {"name": "Dassault Systèmes", "ticker": "DSY.PA"},
        {"name": "Engie", "ticker": "ENGI.PA"},
        {"name": "EssilorLuxottica", "ticker": "EL.PA"},
        {"name": "Hermès", "ticker": "RMS.PA"},
        {"name": "Kering", "ticker": "KER.PA"},
        {"name": "Legrand", "ticker": "LR.PA"},
        {"name": "L'Oréal", "ticker": "OR.PA"},
        {"name": "LVMH", "ticker": "MC.PA"},
        {"name": "Michelin", "ticker": "ML.PA"},
        {"name": "Orange", "ticker": "ORA.PA"},
        {"name": "Pernod Ricard", "ticker": "RI.PA"},
        {"name": "Publicis", "ticker": "PUB.PA"},
        {"name": "Renault", "ticker": "RNO.PA"},
        {"name": "Safran", "ticker": "SAF.PA"},
        {"name": "Saint-Gobain", "ticker": "SGO.PA"},
        {"name": "Sanofi", "ticker": "SAN.PA"},
        {"name": "Schneider Electric", "ticker": "SU.PA"},
        {"name": "Société Générale", "ticker": "GLE.PA"},
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

    def __init__(self, stock_name):
        self.stock_name = stock_name

    @staticmethod
    def autocomplete(query):
        if not query:
            return []

        return [
            stock for stock in StockSearchService.CAC40_COMPANIES
            if query in stock["name"].lower() or query in stock["ticker"].lower()
        ]