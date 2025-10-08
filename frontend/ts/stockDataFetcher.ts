import StockStore from "./stores/stockStore";
import Highcharts, { Chart } from "highcharts/highstock";
import AccessibilityModule from "highcharts/modules/accessibility";
import { StockEvent, StockData } from "./types";

AccessibilityModule(Highcharts);

export default class StockDataFetcher {
    static chart: Chart | null = null;

    private symbol: string | null;
    private timeSpan: string | null;
    
    constructor(defaultSymbol?: string) {
        this.symbol = defaultSymbol || null;
        this.timeSpan = null;
        StockStore.onUpdate((stock: StockEvent) => {
            if (this.symbol === stock.symbol && this.timeSpan === StockStore.getTimeSpan()) return;
            this.symbol = stock.symbol;
            this.timeSpan = StockStore.getTimeSpan();
            console.log("Mise à jour détectée :", stock);
            this.LoadChart(stock);
        });
    }

    setChart(newChart: Chart) {
        StockDataFetcher.chart = newChart;
    }

    getChart(): Chart | null {
        return StockDataFetcher.chart;
    }

    async LoadChart(stock: StockEvent): Promise<void>  {
        const apiUri = StockStore.getApiUri();
        const symbolParam = (apiUri.includes("?") ? "&" : "?") + "symbol=" + stock.symbol;

        try {
            const response = await fetch("/api" + apiUri + symbolParam, {
                method: "GET",
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("Erreur réseau : " + response.status);
            }

            const data = await response.json();

            if (data.shortName !== stock.shortName) {
                //Le nom a déjà été poussé et va trigger la récupération des données qui retriger la notification
                StockStore.setStock(data.symbol, data.shortName, data.history);
            }

            const chart = this.RenderChart(data);
            this.setChart(chart);

        } catch (err) {
            console.error("Erreur de chargement du graphique :", err);
        }
    }

    RenderChart(data: StockData): Chart {
        const darkTheme = {
            background: '#1e1e1e',
            text: '#ffffff',
            grid: '#444',
            primary: '#4caf50'
        };

        // Transformer les données en format [timestamp, price]
        const priceData: [number, number][] = data.history.map(item => [
            Date.parse(item.Datetime),
            item.Close
        ]);

        // Calculer le min et le max des prix
        const prices = priceData.map(item => item[1]);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Définir l'intervalle de l'axe Y en fonction de la période
        let yAxisMin: number, yAxisMax: number;
        if (this.timeSpan === '5d') {
            yAxisMin = Math.max(minPrice - (maxPrice - minPrice) * 0.05, 0);
            yAxisMax = maxPrice + (maxPrice - minPrice) * 0.05;
        } else {
            yAxisMin = Math.max(minPrice - (maxPrice - minPrice) * 0.1, 0);
            yAxisMax = maxPrice + (maxPrice - minPrice) * 0.1;
        }

        const priceFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
        const title = `${data.shortName} (${data.symbol}) - ${priceFormatter.format(data.price)}`
        
        const container = document.getElementById('chart_container');
        if (!container) throw new Error("Chart container not found");

        // Créer le graphique en s'inspirant de l'exemple Highcharts
        const chart = Highcharts.stockChart({
            chart: {
                renderTo: container,
                height: window.innerHeight * 0.9,
                backgroundColor: darkTheme.background,
                style: { color: darkTheme.text },
            },
            credits: {
                enabled: false
            },
            title: {
                text: title,
                style: { color: darkTheme.text }
            },
            rangeSelector: {
                enabled: false  // Désactivation des boutons de sélection de plage si non nécessaires
            },
            xAxis: {
                type: 'datetime',
                ordinal: true,
                gapGridLineWidth: 0, // Supprime les lignes de grille sur les gaps
                labels: {
                    style: { color: darkTheme.text },
                    formatter: function() {
                        // Format de date personnalisé (ex. "Jan 2")
                        return Highcharts.dateFormat('%b %e', this.value as number);
                    }
                },
                gridLineColor: darkTheme.grid
                // Si tu souhaites forcer l'exclusion d'intervalles spécifiques, tu peux ajouter l'option "breaks"
                // breaks: [{
                //     from: Date.UTC(2023, 0, 4),
                //     to: Date.UTC(2023, 0, 6),
                //     breakSize: 0
                // }]
            },
            yAxis: {
                title: { text: '', style: { color: darkTheme.text } },
                gridLineColor: darkTheme.grid,
                min: yAxisMin,
                max: yAxisMax
            },
            legend: {
                itemStyle: { color: darkTheme.text }
            },
            plotOptions: {
                series: {
                    label: { connectorAllowed: false }
                },
                area: { fillOpacity: 0.4 }
            },
            series: [{
                type: 'area',
                color: darkTheme.primary,
                name: 'Price',
                data: priceData,
                gapSize: 5, // Permet de gérer les gaps en cas d'absence de données
                tooltip: { valueDecimals: 2 },
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, Highcharts.getOptions().colors![0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors![0]).setOpacity(0).get('rgba')]
                    ]
                },
                threshold: null
            }],
            responsive: {
                rules: [{
                    condition: { maxWidth: 640 },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }
        } as Highcharts.Options);
        return chart;
    }
}