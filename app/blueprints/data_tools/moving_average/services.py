import json

def calculate_moving_average(data_json, window_size=3):
    """
    Calcule la moyenne mobile sur un ensemble de données JSON.
    """
    data = json.loads(data_json)['Close']
    values = list(data.values())

    if len(values) < window_size:
        return {"error": "Pas assez de données pour la fenêtre spécifiée"}

    moving_averages = []
    for i in range(len(values) - window_size + 1):
        window = values[i:i+window_size]
        moving_averages.append(sum(window) / window_size)

    return {"moving_average": moving_averages}
