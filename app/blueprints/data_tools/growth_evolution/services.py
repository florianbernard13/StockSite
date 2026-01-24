import numpy as np
from app.models.price_series import PricePoint

class GrowthEvolutionService:
    def __init__(self, data: list[PricePoint]):
        """
        data: list of {"Datetime": ..., "Close": ...} ou dict avec clés "Datetime" et "Close"
        """
        self.data = data
        self.x_labels, self.y = self.extract_data()
        self.n = len(self.y)
        self.deltas = None
        self.deltas_pct = None
        self.total_delta_pct = None
        self.volatility = None
        self.volatility_pct = None
        self.amplitude = None
        self.instability = None

    def extract_data(self):
        """Extrait les dates et les valeurs de clôture depuis une liste de PricePoint."""
        if not self.data:
            raise ValueError("Aucune donnée disponible pour extraire les valeurs.")

        x_labels = [dt for dt, _ in self.data]
        y = [price for _, price in self.data]

        return x_labels, np.array(y, dtype=float)

    def compute_metrics(self):
        """Calcule deltas, volatilité, amplitude et instabilité."""
        if self.n < 2:
            return {"error": "Pas assez de données pour analyse (min 2 points)."}

        # Deltas (absolus)
        self.deltas = np.diff(self.y)  # y[t] - y[t-1]

        # Deltas en pourcentage (relatif au point précédent)
        prev = self.y[:-1]
        with np.errstate(divide='ignore', invalid='ignore'):
            self.deltas_pct = np.where(prev != 0, (self.deltas / prev) * 100.0, np.nan)
            factors = 1 + np.nan_to_num(self.deltas_pct / 100)  # convertit NaN en 0
            total_factor = np.prod(factors)
            self.total_delta_pct = (total_factor - 1) * 100

        # Volatilité : écart-type des deltas (et volatilité en %)
        self.volatility = float(np.std(self.deltas, ddof=0))  # population std
        # Utiliser nanstd pour éviter NaN dans pct s'il y a divisions par 0
        self.volatility_pct = float(np.nanstd(self.deltas_pct, ddof=0))

        # Amplitude
        self.amplitude = float(np.max(self.y) - np.min(self.y))

        # Instabilité : nombre de changements de signe des deltas (ignorer zeros)
        signs = np.sign(self.deltas)
        non_zero_signs = signs[signs != 0]
        if len(non_zero_signs) < 2:
            self.instability = 0
        else:
            # compte des changements (sign différent du précédent)
            self.instability = int(np.sum(non_zero_signs[1:] != non_zero_signs[:-1]))

        return {
            "deltas": list(np.round(self.deltas, 6)),
            "deltas_pct": list(np.round(self.deltas_pct, 6)),
            "total_delta_pct": round(self.total_delta_pct, 6),
            "volatility": round(self.volatility, 6),
            "volatility_pct": round(self.volatility_pct, 6),
            "amplitude": round(self.amplitude, 6),
            "instability": self.instability
        }

    def get_results(self):
        """Wrapper pour obtenir les résultats (contrôle d'erreurs)."""
        if self.n < 2:
            return {"error": "Pas assez de données pour analyse (min 2 points)."}
        return self.compute_metrics()