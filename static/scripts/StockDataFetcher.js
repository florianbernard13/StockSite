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
        const darkTheme = {
            background: '#1e1e1e',
            text: '#ffffff',
            grid: '#444',
            primary: '#4caf50'
        };        

        const priceData = data.history.map(item => [Date.parse(item.Datetime), item.Close]);

        const title = `${data.shortName} (${data.symbol}) - ${numeral(data.price).format('$0,0.00')}`;

        // data.history.forEach(item => {
        //     priceData.push(item.Close)
        //     dates.push(Date.parse(item.Datetime))
        // });

        this.chart = Highcharts.chart('chart_container', {
            chart: {
                backgroundColor: darkTheme.background,
                style: {
                    color: darkTheme.text
                }
            },
            title: {
                text: title,
                style: {
                    color: darkTheme.text
                }
            },
            yAxis: {
                title: {
                    text: '',
                    style: {
                        color: darkTheme.text
                    }
                },
                gridLineColor: darkTheme.grid
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date',
                    style: {
                        color: darkTheme.text
                    }
                },
                labels: {
                    style: {
                        color: darkTheme.text
                    }
                },
                gridLineColor: darkTheme.grid
            },
            legend: {
                itemStyle: {
                    color: darkTheme.text
                }
            },
            plotOptions: {
                series: {
                    label: {
                        connectorAllowed: false
                    }
                },
                area: {
                    fillOpacity: 0.4
                }
            },
            series: [{
                type: 'area',
                color: darkTheme.primary,
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