import StockStore from "./stores/stockStore.js";

export default class StockDataFetcher {
    
    constructor(defaultSymbol) {
        this.symbol = defaultSymbol || null;
        this.timeSpan = null;
        StockStore.onUpdate((stock) => {
            if (this.symbol === stock.symbol && this.timeSpan === StockStore.getTimeSpan()) return;
            this.symbol = stock.symbol;
            this.timeSpan = StockStore.getTimeSpan();
            console.log("Mise à jour détectée :", stock);
            this.LoadChart(stock);
        });
    }

    LoadChart(stock) {
        const apiUri = StockStore.getApiUri();
        $.ajax({
            url: "/api" + apiUri + "?symbol=" + stock.symbol,
            method: "GET",
            cache: false
        }).done((data) => {
            if (data.shortName !== stock.shortName) {
                StockStore.setStock(data.symbol, data.shortName, null);
            }
            this.RenderChart(data);
        });
    }

    RenderChart(data) {
        const darkTheme = {
            background: '#1e1e1e',
            text: '#ffffff',
            grid: '#444',
            primary: '#4caf50'
        };

        // Transformer les données en format [timestamp, price]
        const priceData = data.history.map(item => [Date.parse(item.Datetime), item.Close]);

        // Calculer le min et le max des prix
        const prices = priceData.map(item => item[1]);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Définir l'intervalle de l'axe Y en fonction de la période
        let yAxisMin, yAxisMax;
        if (this.timeSpan === '5d') {
            yAxisMin = Math.max(minPrice - (maxPrice - minPrice) * 0.05, 0);
            yAxisMax = maxPrice + (maxPrice - minPrice) * 0.05;
        } else {
            yAxisMin = Math.max(minPrice - (maxPrice - minPrice) * 0.1, 0);
            yAxisMax = maxPrice + (maxPrice - minPrice) * 0.1;
        }

        const title = `${data.shortName} (${data.symbol}) - ${numeral(data.price).format('$0,0.00')}`;

        // Créer le graphique en s'inspirant de l'exemple Highcharts
        this.chart = Highcharts.stockChart('chart_container', {
            chart: {
                backgroundColor: darkTheme.background,
                style: { color: darkTheme.text }
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
                        return Highcharts.dateFormat('%b %e', this.value);
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
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
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
        });
    }
}