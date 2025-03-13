import numpy as np

class LinearRegressionService:
    def __init__(self, data):
        self.data = data
        self.x_labels, self.y = self.extract_data()
        self.n = len(self.y)
        self.x = np.arange(self.n)
        self.slope = None
        self.intercept = None
        self.predictions = None
        self.std_dev = None
        self.r_squared = None

    def extract_data(self):
        """Extrait les dates et les valeurs de clôture."""
        if isinstance(self.data, list):
            x_labels = [d["Datetime"] for d in self.data]
            y = [d["Close"] for d in self.data]
        elif isinstance(self.data, dict):
            x_labels = self.data.get("Datetime")
            y = self.data.get("Close")
        else:
            raise ValueError("Format de données non supporté.")
        return x_labels, np.array(y)

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
