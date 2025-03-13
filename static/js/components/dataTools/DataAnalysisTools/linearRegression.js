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

    handleRegression() {
        if (!this.data) {
            console.error("Pas de données disponibles pour la régression.");
            return;
        }

        this.fetchLinearRegression(this.data).done((regressionData) => {
            if (regressionData) {
                console.log("Régression reçue:", regressionData);
                this.displayResults(regressionData);
            } else {
                console.error("Erreur dans les données reçues.");
            }
        }).fail((error) => {
            console.error("Erreur dans le traitement de la régression:", error);
        });
    }

    fetchLinearRegression(data) {
        const encodedData = JSON.stringify(data);
        console.log("Données encodées:", encodedData);
        
        const apiUri = "/data_tools/linear_regression/";

        return $.ajax({
            url: apiUri,
            method: "POST",
            contentType: "application/json",
            data: encodedData,
            cache: false
        });
    }

    // Fonction pour afficher les résultats (exemple simple, peut être personnalisé)
    displayResults(data) {
        const chart = this.stockDataFetcher.getChart();
        console.log(this.stockDataFetcher);
    
        if (!chart) return;
    
        // Convertir les timestamps en format utilisable par Highcharts
        const regressionData = data.regression.map(item => [
            new Date(item[0]).getTime(),  // Convertir la date en timestamp UNIX
            item[1]  // Valeur Y
        ]);
    
        chart.addSeries({
            id: 'regressionSeries',
            type: 'line',
            name: 'Régression linéaire',
            data: regressionData,
            color: '#ff9800',
            dashStyle: 'Dash',
            marker: { enabled: false },
            tooltip: { valueDecimals: 2 }
        }, true);
    }
}
