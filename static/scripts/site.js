import StockDataFetcher from "./StockDataFetcher.js";
import SelectWithButtonInside from "./items/components/SelectWithButtonInside.js";
// class Site {
//     constructor() {
//         this.symbol = "VU.PA";
//         this.title = null;
//         this.data = null;
//         this.chart = null;
//     }

//     Init() {
//         this.GetQuote();
//         $("#symbol").on("click", function() {
//             $(this).val("");
//         });
//     }

//     GetQuote() {
//         // store the site context.
//         const that = this;

//         // pull the HTTP request
//         $.ajax({
//             url: "/quote?symbol=" + that.symbol,
//             method: "GET",
//             cache: false
//         }).done(function(data) {
//             // set up a data context for just what we need.
//             const context = {};
//             that.title = context.shortName = data.shortName;
//             context.symbol = data.symbol;
//             context.price = data.ask;

//             if (data.quoteType === "MUTUALFUND") {
//                 context.price = data.previousClose;
//             }

//             // call the request to load the chart and pass the data context with it.
//             that.LoadChart(context);

//             if (swbi) {
//                 swbi.cpnt_swbi_save_value_to_list(that);
//             }
//         });
//     }

//     SubmitForm() {
//         this.symbol = $("#symbol").val();
//         this.GetQuote();
//     }

//     SubmitSelect() {
//         this.symbol = $("#symbolSelect").val();
//         this.GetQuote();
//     }

//     LoadChart(quote) {
//         const that = this;
//         $.ajax({
//             url: "/history?symbol=" + that.symbol,
//             method: "GET",
//             cache: false
//         }).done(function(data) {
//             that.data = data;
//             that.RenderChart(JSON.parse(data), quote);
//         });
//     }

//     RenderChart(data, quote) {
//         const priceData = [];
//         const dates = [];

//         const title = `${quote.shortName} (${quote.symbol}) - ${numeral(quote.price).format('$0,0.00')}`;

//         for (let i in data.Close) {
//             const dt = i.slice(0, i.length - 3);
//             const dateString = moment.unix(dt).format("MM/YY");
//             const close = data.Close[i];

//             if (close !== null) {
//                 priceData.push(close);
//                 dates.push(dateString);
//             }
//         }

//         this.chart = Highcharts.chart('chart_container', {
//             title: {
//                 text: title
//             },
//             yAxis: {
//                 title: {
//                     text: ''
//                 }
//             },
//             xAxis: {
//                 categories: dates,
//             },
//             legend: {
//                 layout: 'vertical',
//                 align: 'right',
//                 verticalAlign: 'middle'
//             },
//             plotOptions: {
//                 series: {
//                     label: {
//                         connectorAllowed: false
//                     }
//                 },
//                 area: {}
//             },
//             series: [{
//                 type: 'area',
//                 color: '#85bb65',
//                 name: 'Price',
//                 data: priceData
//             }],
//             responsive: {
//                 rules: [{
//                     condition: {
//                         maxWidth: 640
//                     },
//                     chartOptions: {
//                         legend: {
//                             layout: 'horizontal',
//                             align: 'center',
//                             verticalAlign: 'bottom'
//                         }
//                     }
//                 }]
//             }
//         });
//     }
// }

$(document).ready(() => {
    const defaultSymbol = "VU.PA"
    // site.Init();
	let stockDataFetcher = new StockDataFetcher(defaultSymbol);
	stockDataFetcher.LoadChart();
    let rightSideBar = new SelectWithButtonInside;
    rightSideBar.init()
});
