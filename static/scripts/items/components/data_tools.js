//TODO make an object for linear regression
linear_regression_series = []

function linear_regression_draw(){
	subline_style = {
	type: 'line',
	color: 'black',
	dashStyle: 'Dash',
	lineWidth: 0.5,
	}
    $.ajax({
		url: "/data_tools/linear_regression?data=" + site.data,
		method: "GET",
		cache: false
	}).done(function(data) {
		cleared_data = JSON.parse(data)[0];
		standard_dev = JSON.parse(data)[1];
		linear_regression_series.push(site.chart.addSeries({
			type: 'line',
			color: 'black',
			name: 'regression line',
			data: cleared_data,
			lineWidth: 1,
		}, false))
		linear_regression_series.push(site.chart.addSeries(Object.assign({}, subline_style,{
			name: 'sub1 reg line',
			data: cleared_data.map(element => element - standard_dev)}),false))
		linear_regression_series.push(site.chart.addSeries(Object.assign({}, subline_style,{
			name: 'sub2 reg line',
			data: cleared_data.map(element => element - 2*standard_dev)}),false))
		linear_regression_series.push(site.chart.addSeries(Object.assign({}, subline_style,{
			name: 'upper1 reg line',
			data: cleared_data.map(element => element + standard_dev)}),false))
		linear_regression_series.push(site.chart.addSeries(Object.assign({}, subline_style,{
			name: 'upper2 reg line',
			data: cleared_data.map(element => element + 2*standard_dev)}),false))
		site.chart.redraw()
	});
}

function linear_regression_rmv(){
	linear_regression_series.forEach((element) => element.remove());
	linear_regression_series = []
}

function linear_regression_toggle(){
	if(linear_regression_series.length != 0){
		linear_regression_rmv()
	} else {
		linear_regression_draw()
	}
}

