import json
import numpy as np
import math

def perform_linear_regression(data_json):
    """
    Effectue une régression linéaire sur un ensemble de données JSON.
    Utilise numpy pour des calculs plus efficaces et ajoute un calcul du coefficient de détermination R².
    """
    try:
        # Charger les données JSON
        data = json.loads(data_json)['Close']
        n = len(data)
        
        # Si les données sont vides ou trop petites
        if n < 2:
            raise ValueError("Pas assez de données pour effectuer une régression linéaire.")
        
        x = np.array(range(1, n+1))  # Crée une liste des indices (1, 2, ..., n)
        y = np.array(list(data.values()))
        
        # Calcul des coefficients a et b
        coeff_b, coeff_a = np.polyfit(x, y, 1)
        
        # Calcul des prédictions
        predictions = coeff_a + coeff_b * x
        
        # Calcul de l'écart-type
        standard_dev = np.std(y - predictions)
        
        # Calcul du coefficient de détermination (R²)
        ss_total = np.sum((y - np.mean(y)) ** 2)
        ss_residual = np.sum((y - predictions) ** 2)
        r_squared = 1 - (ss_residual / ss_total)

        # Retourner les résultats
        return {
            "regression": predictions.tolist(),
            "standard_deviation": standard_dev,
            "r_squared": r_squared
        }

    except (json.JSONDecodeError, ValueError) as e:
        return {"error": f"Erreur dans les données: {str(e)}"}
