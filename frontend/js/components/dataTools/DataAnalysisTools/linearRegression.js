import StockStore from '../../../stores/stockStore.js';

export default class LinearRegression {
    constructor(stockDataFetcher) {
        // Sélectionner le bouton via son ID et ajouter un listener
        this.button = document.getElementById('linearRegression');
        this.stockDataFetcher = stockDataFetcher;
        
        // S'abonner aux mises à jour de StockStore
        StockStore.onUpdate((stockData) => {
            this.data = stockData.data;  // Mettre à jour les données dans LinearRegression
        });

        if (this.button) {
            this.button.addEventListener('click', () => {
                this.handleRegression();
            });
        }
    }

    async handleRegression() {
        if (!this.data) {
            console.error("Pas de données disponibles pour la régression.");
            return;
        }

        try {
            const regressionData = await this.fetchLinearRegression(this.data);
            if (regressionData) {
                console.log("Régression reçue:", regressionData);
                this.displayResults(regressionData);
            } else {
                console.error("Erreur dans les données reçues.");
            }
        } catch (error) {
            console.error("Erreur dans le traitement de la régression:", error);
        }
    }

    async fetchLinearRegression(data) {
        const encodedData = JSON.stringify(data);
        console.log("Données encodées:", encodedData);

        const apiUri = "/data_tools/linear_regression/";

        const response = await fetch(apiUri, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: encodedData,
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}`);
        }

        return await response.json();
    }

    displayResults(data) {
        const chart = this.stockDataFetcher.getChart();
        console.log(this.stockDataFetcher);
    
        if (!chart) return;
    
        // Fonction pour ajouter une série au graphique avec l'option de suivi de la souris
        const addSeriesToChart = (id, name, data, color, dashStyle, enableMouseTracking = true) => {
            chart.addSeries({
                id: id,
                type: 'line',
                name: name,
                data: data,
                color: color,
                dashStyle: dashStyle,
                marker: { enabled: false },
                tooltip: false,
                enableMouseTracking: enableMouseTracking,  // Ajouter l'option de suivi de la souris
            }, true);
        };
    
        // Convertir les timestamps en format utilisable par Highcharts
        const convertToTimestampData = (dataArray) => {
            return dataArray.map(item => [
                new Date(item[0]).getTime(),  // Convertir la date en timestamp UNIX
                item[1]  // Valeur Y
            ]);
        };
    
        // Ajouter la régression linéaire principale
        const regressionData = convertToTimestampData(data.regression);
        addSeriesToChart('regressionSeries', 'Régression linéaire', regressionData, '#ff9800', 'Dash', true);
    
        // Définir les bornes avec leurs noms, couleurs, et styles de ligne
        const boundsConfig = [
            { key: 'upper_bound_1', name: 'Borne supérieure 1 écart-type', color: '#f44336', dashStyle: 'Dot' },
            { key: 'lower_bound_1', name: 'Borne inférieure 1 écart-type', color: '#f44336', dashStyle: 'Dot' },
            { key: 'upper_bound_2', name: 'Borne supérieure 2 écarts-types', color: '#f44336', dashStyle: 'Dot' },
            { key: 'lower_bound_2', name: 'Borne inférieure 2 écarts-types', color: '#f44336', dashStyle: 'Dot' }
        ];
    
        // Ajouter les séries des bornes supérieures et inférieures
        boundsConfig.forEach(config => {
            const boundData = convertToTimestampData(data[config.key]);
            addSeriesToChart(config.key, config.name, boundData, config.color, config.dashStyle, false);  // Désactiver le suivi de la souris
        });
    }
    
}
