import StockStore from '../../../stores/stockStore';
import StockDataFetcher from '../../../stockDataFetcher';
import { RegressionAnalysisResponse, RegressionAnalysisRender, StockEvent } from '../../../types';
import { DashStyleValue } from 'highcharts';
import AbstractButton from '../../buttons/abstractButton';

export default class LinearRegressionButton extends AbstractButton{
    private symbol: string | null;
    private stockDataFetcher: StockDataFetcher;
    private data: any;
    private timeSpan: string | null;
    private linearRegressionDisplay: boolean;
    private seriesIds: string[] = [];

    
    constructor(stockDataFetcher: StockDataFetcher) {
        const key = `linearRegression-btn`;
        super(key, {});
        this.stockDataFetcher = stockDataFetcher;
        this.symbol = null;
        this.timeSpan = null;
        this.linearRegressionDisplay = false;

        StockStore.onUpdate((stock: StockEvent) => {
            console.log("StockStore.onUpdate");
            console.log(stock)
            if (this.symbol === stock.symbol && this.timeSpan === StockStore.getTimeSpan() && this.data.length != 0) return;
            this.symbol = stock.symbol;
            this.timeSpan = StockStore.getTimeSpan();
            this.data = stock.history;

            if(!this.linearRegressionDisplay || !this.data.length) return;
            console.log("handleRegression");
            this.handleRegression();
        });
    }

    protected onActivate(): void {
        console.log("onActivate");
        this.linearRegressionDisplay = true;
        this.handleRegression();
    }

    protected onDeactivate(): void {
        this.linearRegressionDisplay = false;
        this.removeRegressionSeries();
    }

    private removeRegressionSeries(): void {
        const chart = this.stockDataFetcher.getChart();
        if (!chart) return;

        this.seriesIds.forEach(id => {
            const series = chart.get(id);
            if (series) series.remove();
        });

        this.seriesIds = [];
    }

    async handleRegression(): Promise<void> {
        try {
            const regressionData = await this.fetchLinearRegression();

            if (!regressionData) {
                console.error("Erreur dans les données reçues.");
                return;
            }

            console.log("Régression reçue:", regressionData);
            this.displayResults(regressionData);

        } catch (error) {
            console.error("Erreur dans le traitement de la régression:", error);
        }
    }

    private async fetchLinearRegression(): Promise<RegressionAnalysisResponse> {
        if (!this.symbol) throw new Error("Pas de symbole sélectionné.");

        const payload = {
            symbol: this.symbol,
            period: StockStore.getTimeSpan() || "max"
        };

        console.log("Données encodées:", payload);

        const apiUri = "/data_tools/linear_regression/";

        const response = await fetch(apiUri, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
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
                enableMouseTracking
            }, true);

            this.seriesIds.push(id);
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
