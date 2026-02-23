import StockStore from "./stores/stockStore";
import Highcharts, { Chart } from "highcharts/highstock";
import AccessibilityModule from "highcharts/modules/accessibility";
import { StockEvent, StockData } from "./types";

AccessibilityModule(Highcharts);

Highcharts.setOptions({
  time: {
    useUTC: false
  }
});

export default class StockDataFetcher {
    static chart: Chart | null = null;

    private symbol: string | null;
    private timeSpan: string | null;
    
    constructor(defaultSymbol?: string) {
        this.symbol = defaultSymbol || null;
        this.timeSpan = null;
        StockStore.onUpdate((stock: StockEvent) => {
            if (this.symbol === stock.symbol && this.timeSpan === StockStore.getTimeSpan()) return;
            if(StockStore.getTimeSpan() === "REALTIME"){
                this.timeSpan = StockStore.getTimeSpan();
                return;
            }
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

    private buildPriceData(data: StockData): [number, number][] {
        return data.history.map(item => [
            Date.parse(item.Datetime),
            item.Close
        ]);
    }

    private calculateYAxisExtremes(priceData: [number, number][], timeSpan: string | null) {
        if (!priceData.length) return { min: 0, max: 0 };

        const prices = priceData.map(p => p[1]);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        const range = maxPrice - minPrice || 0;
        const padding = (timeSpan === '5d' || timeSpan === 'REALTIME') ? 0.05 : 0.1;

        const yMin = Math.max(minPrice - range * padding, 0);
        const yMax = maxPrice + range * padding;

        return { min: yMin, max: yMax };
    }

    private resetXAxis() {
        const chart = this.getChart();
        if (!chart) return;

        (chart.xAxis[0] as any).setExtremes(undefined, undefined, false);
    }

    private updateRealtimeOpenLine(openPrice: number) {
        const chart = this.getChart();
        if (!chart) return;

        const yAxis = chart.yAxis[0];

        yAxis.removePlotLine("open-line");

        yAxis.addPlotLine({
            id: "open-line",
            value: openPrice,
            color: "red",
            width: 1,
            dashStyle: "Dash",
            zIndex: 5,
            label: {
                text: "OPEN",
                align: "right",
                style: { color: "red" }
            }
        });
    }

    private createChart(data: StockData, priceData: [number, number][], yAxisMin: number, yAxisMax: number): Chart {
        const darkTheme = {
            background: '#1e1e1e',
            text: '#ffffff',
            grid: '#444',
            primary: '#4caf50'
        };

        const title = this.buildTitle(data);

        const container = document.getElementById('chart_container');
        if (!container) throw new Error("Chart container not found");

        const chart = Highcharts.stockChart({
            chart: {
                renderTo: container,
                height: window.innerHeight * 0.88,
                backgroundColor: darkTheme.background,
                style: { color: darkTheme.text },
            },
            credits: { enabled: false },
            title: { text: title, style: { color: darkTheme.text } },
            rangeSelector: { enabled: false },
            xAxis: {
                type: 'datetime',
                ordinal: true,
                gapGridLineWidth: 0,
                labels: {
                    style: { color: darkTheme.text },
                    formatter: function() {
                        return Highcharts.dateFormat('%b %e', this.value as number);
                    }
                },
                gridLineColor: darkTheme.grid
            },
            yAxis: {
                title: { text: '', style: { color: darkTheme.text } },
                gridLineColor: darkTheme.grid,
                min: yAxisMin,
                max: yAxisMax
            },
            legend: { itemStyle: { color: darkTheme.text } },
            plotOptions: {
                series: { label: { connectorAllowed: false } },
                area: { fillOpacity: 0.4 }
            },
            series: [{
                type: 'area',
                color: darkTheme.primary,
                name: 'Price',
                data: priceData,
                gapSize: 5,
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
                        legend: { layout: 'horizontal', align: 'center', verticalAlign: 'bottom' }
                    }
                }]
            }
        } as Highcharts.Options);

        return chart;
    }

    private buildTitle(data: StockData): string {
        const priceFormatter = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        });

        return `${data.shortName} (${data.symbol}) - ${priceFormatter.format(data.price)}`;
    }

    private updateTitle(data: StockData) {
        const chart = this.getChart();
        if (!chart) return;

        chart.setTitle({ text: this.buildTitle(data) });
    }

    private updateChartData(priceData: [number, number][], timeSpan: string | null) {
        const chart = this.getChart();
        if (!chart) return;

        const existingSeries = chart.series && chart.series[0];
        if (existingSeries) {
            (existingSeries as any).setData(priceData, false);
        } else {
            chart.addSeries({
                type: 'area',
                name: 'Price',
                data: priceData,
                gapSize: 5,
                threshold: null 
            } as Highcharts.SeriesOptionsType, false);
        }

        const { min, max } = this.calculateYAxisExtremes(priceData, timeSpan);
        (chart.yAxis[0] as any).setExtremes(min, max, false);

        chart.redraw();
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

            const priceData = this.buildPriceData(data);
            const { min, max } = this.calculateYAxisExtremes(priceData, this.timeSpan);

            if (!this.getChart()) {
                const chart = this.createChart(data, priceData, min, max);
                this.setChart(chart);
            } else {
                this.updateChartData(priceData, this.timeSpan);
                this.updateTitle(data)
                this.resetXAxis();
            }
        } catch (err) {
            console.error("Erreur de chargement du graphique :", err);
        }
    }

    async fetchRealTimeData(): Promise<void> {
        if (!this.symbol) return;

        try {
            const response = await fetch(`/api/stock_data/realtime?symbol=${this.symbol}`, {
                method: "GET",
                cache: "no-store"
            });
        
        if (!response.ok) {
            throw new Error("Erreur réseau : " + response.status);
        }

        const data : StockData = await response.json();

        const priceData: [number, number][] = this.buildPriceData(data);

        if (!this.getChart()) {
            const { min, max } = this.calculateYAxisExtremes(priceData, this.timeSpan);
            const chart = this.createChart(data, priceData, min, max);
            this.setChart(chart);
        } else {
            this.updateChartData(priceData, this.timeSpan);
        }

        const openPrice = data.history[0].Close;
        this.updateRealtimeOpenLine(openPrice);

        console.log("Graphique temps réel mis à jour avec toutes les données :", priceData.length);

        } catch (err) {
            console.error("Erreur lors de la récupération des données temps réel :", err);
        }
    }
}