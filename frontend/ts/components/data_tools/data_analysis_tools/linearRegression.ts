import StockStore from '../../../stores/stockStore';
import StockDataFetcher from '../../../stockDataFetcher';
import { RegressionAnalysisResponse, RegressionAnalysisRender } from '../../../types';
import { DashStyleValue } from 'highcharts';

export default class LinearRegression {
    private button: HTMLElement | null;
    private stockDataFetcher: StockDataFetcher;
    private data: any;
    
    constructor(stockDataFetcher: StockDataFetcher) {
        this.button = document.getElementById('linearRegression');
        this.stockDataFetcher = stockDataFetcher;

        // S'abonner aux mises à jour de StockStore
        StockStore.onUpdate((stockData: any) => {
            this.data = stockData.data; 
        });

        if (this.button) {
            this.button.addEventListener('click', () => {
                this.handleRegression();
            });
        }
    }

    async handleRegression(): Promise<void> {
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

    private async fetchLinearRegression(data: any): Promise<RegressionAnalysisResponse> {
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

        return await response.json() as RegressionAnalysisResponse;
    }

    private displayResults(data: RegressionAnalysisResponse): void {
        const chart = this.stockDataFetcher.getChart();
        if (!chart) return;

        // Fonction pour ajouter une série au graphique avec l'option de suivi de la souris
        const addSeriesToChart = (
            id: string,
            name: string,
            data: [number, number][],
            color: string,
            dashStyle: DashStyleValue,
            enableMouseTracking = true
        ) => {
            chart.addSeries({
                id,
                type: 'line',
                name,
                data,
                color,
                dashStyle,
                marker: { enabled: false },
                tooltip: {pointFormatter: () => null as any},
                enableMouseTracking
            }, true);
        };

    
        // Convertir les timestamps en format utilisable par Highcharts
        const convertToTimestampData = (dataArray: [string | number, number][]): [number, number][] => {
            return dataArray.map(item => [new Date(item[0]).getTime(), item[1]]);
        };
    
        // Ajouter la régression linéaire principale
        addSeriesToChart(
            'regressionSeries',
            'Régression linéaire',
            convertToTimestampData(data.regression),
            '#ff9800',
            'Dash'
        );
    
        // Définir les bornes avec leurs noms, couleurs, et styles de ligne
        const boundsConfig: RegressionAnalysisRender[] = [
        { key: "upper_bound_1", name: "Borne supérieure 1 écart-type", color: "#f44336", dashStyle: "Dot" },
        { key: "lower_bound_1", name: "Borne inférieure 1 écart-type", color: "#f44336", dashStyle: "Dot" },
        { key: "upper_bound_2", name: "Borne supérieure 2 écarts-types", color: "#f44336", dashStyle: "Dot" },
        { key: "lower_bound_2", name: "Borne inférieure 2 écarts-types", color: "#f44336", dashStyle: "Dot" },
        ];
    
        // Ajouter les séries des bornes supérieures et inférieures
        boundsConfig.forEach(config => {
            const boundData = convertToTimestampData(data[config.key]);
            addSeriesToChart(config.key, config.name, boundData, config.color, config.dashStyle, false);  // Désactiver le suivi de la souris
        });
    }
    
}
