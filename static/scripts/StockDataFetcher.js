export default class StockDataFetcher{
    constructor(){
        this.symbol = "VU.PA";
        this.title = null;
        this.data = null;
        this.chart = null;
    }

    LoadChart() {
        $.ajax({
            url: "/api/stock_data?symbol=" + this.symbol,
            method: "GET",
            cache: false
        }).done((data) => {
            this.RenderChart(data);
        });
    }

    RenderChart(data) {
        const priceData = [];
        const dates = [];

        const title = `${data.shortName} (${data.symbol}) - ${numeral(data.price).format('$0,0.00')}`;

        data.history.forEach(item => {
            priceData.push(item.Close)
            dates.push(item.Datetime)
        });

        this.chart = Highcharts.chart('chart_container', {
            title: {
                text: title
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            xAxis: {
                categories: dates,
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    }
                },
                area: {}
            },
            series: [{
                type: 'area',
                color: '#85bb65',
                name: 'Price',
                data: priceData
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 640
                    },
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