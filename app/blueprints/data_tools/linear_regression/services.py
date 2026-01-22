import numpy as np
from datetime import datetime, timedelta
from app.services.price_series_slicer import PriceSeriesSlicer

class LinearRegressionService:
    def __init__(self, data, time_span=None):
        self.data = data
        self.time_span = time_span
        self.data = self._filter_by_time_span(data, time_span) if time_span else data

        self.x_labels, self.y = self.extract_data()
        self.n = len(self.y)
        self.x = np.arange(self.n)
        self.slope = None
        self.intercept = None
        self.predictions = None
        self.std_dev = None
        self.r_squared = None

    def _filter_by_time_span(self, data, time_span):
        """
        Filtre les données selon le time_span fourni (ex: '1m', '10d', '1y').
        Utilise la méthode parse_period() du StockDataFetcher pour l’interprétation.
        """
        price_series_slicer = PriceSeriesSlicer()
        parsed = price_series_slicer.parse_period(time_span)
        if not parsed:
            print(f"[WARN] TimeSpan invalide: {time_span}")
            return data

        amount, unit = parsed
        now = datetime.now()

        # Calcule la date de coupure
        if unit == "d":
            cutoff_date = now - timedelta(days=amount)
        elif unit == "m":
            cutoff_date = now - timedelta(days=amount * 30)
        elif unit == "y":
            cutoff_date = now - timedelta(days=amount * 365)
        else:
            return data

        # Filtrage basé sur la date
        filtered = []
        for entry in data:
            try:
                dt = datetime.fromisoformat(entry["Datetime"])
                if dt >= cutoff_date:
                    filtered.append(entry)
            except Exception as e:
                print(f"[WARN] Ligne ignorée ({e}): {entry}")
                continue

        print(f"[LinearRegressionService] Filtrage '{time_span}': {len(data)} → {len(filtered)} points")
        return filtered or data  # fallback si trop peu de données

    def extract_data(self):
        if not self.data:
            raise ValueError("Aucune donnée fournie pour la régression linéaire.")
        try:
            x_labels, y = zip(*self.data)
        except (TypeError, ValueError):
            raise ValueError(
                "Les données doivent être une liste de tuples (datetime, float)."
            )

        return list(x_labels), np.asarray(y, dtype=float)

    def compute_regression(self):
        """Calcule la régression linéaire et les statistiques associées."""
        self.slope, self.intercept = np.polyfit(self.x, self.y, 1)
        self.predictions = self.slope * self.x + self.intercept
        residuals = self.y - self.predictions
        self.std_dev = np.std(residuals)
        ss_total = np.sum((self.y - np.mean(self.y))**2)
        ss_res = np.sum(residuals**2)
        self.r_squared = 1 - (ss_res / ss_total)

    def build_series(self):
        """Construit les 5 séries pour Highcharts."""
        regression_series = [[self.x_labels[i], round(self.predictions[i], 6)] for i in range(self.n)]
        upper_bound_1 = [[self.x_labels[i], round(self.predictions[i] + self.std_dev, 6)] for i in range(self.n)]
        lower_bound_1 = [[self.x_labels[i], round(self.predictions[i] - self.std_dev, 6)] for i in range(self.n)]
        upper_bound_2 = [[self.x_labels[i], round(self.predictions[i] + 2 * self.std_dev, 6)] for i in range(self.n)]
        lower_bound_2 = [[self.x_labels[i], round(self.predictions[i] - 2 * self.std_dev, 6)] for i in range(self.n)]

        return {
            "regression": regression_series,
            "upper_bound_1": upper_bound_1,
            "lower_bound_1": lower_bound_1,
            "upper_bound_2": upper_bound_2,
            "lower_bound_2": lower_bound_2
        }

    def get_results(self):
        """Effectue la régression et retourne les résultats sous forme d'un dictionnaire."""
        if self.n < 2:
            return {"error": "Pas assez de données pour une régression linéaire."}
        
        self.compute_regression()
        series = self.build_series()

        return {
            "regression": series["regression"],
            "upper_bound_1": series["upper_bound_1"],
            "lower_bound_1": series["lower_bound_1"],
            "upper_bound_2": series["upper_bound_2"],
            "lower_bound_2": series["lower_bound_2"],
            "parameters": {
                "slope": round(self.slope, 6),
                "intercept": round(self.intercept, 6),
                "r_squared": round(self.r_squared, 6)
            }
        }

    def get_last_point_analysis(self):
        if self.n < 2:
            return {"error": "Pas assez de données pour une régression linéaire."}
        self.compute_regression()
        return self.analyze_last_point()

    def analyze_last_point(self):
        """
        Détermine la position du dernier point par rapport aux bandes ±1σ et ±2σ,
        et calcule le % d'écart si en dessous de -2σ.
        """
        last_idx = self.n - 1
        actual = self.y[last_idx]
        pred = self.predictions[last_idx]
        sd = self.std_dev

        # Bornes
        bnds = {
            "+2σ": pred + 2*sd,
            "+1σ": pred + 1*sd,
            "-1σ": pred - 1*sd,
            "-2σ": pred - 2*sd,
        }

        # Détection de la bande
        if actual > bnds["+2σ"]:
            band = "above +2σ"
        elif actual > bnds["+1σ"]:
            band = "between +1σ and +2σ"
        elif actual >= bnds["-1σ"]:
            band = "between -1σ and +1σ"
        elif actual >= bnds["-2σ"]:
            band = "between -2σ and -1σ"
        else:
            band = "below -2σ"

        # Pourcentage d'écart à –2σ si en dessous
        pct_diff_to_2sd = None
        if actual < bnds["-2σ"]:
            pct_diff_to_2sd = ( (bnds["-2σ"] - actual) / bnds["-2σ"] ) * 100

        return {
            "last_date": self.x_labels[last_idx],
            "actual": round(actual, 6),
            "predicted": round(pred, 6),
            "band": band,
            "pct_diff_to_-2σ": round(pct_diff_to_2sd, 2) if pct_diff_to_2sd is not None else None
        }
