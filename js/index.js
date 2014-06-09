$(function() {
	var baseUrl = "https://api.flowdock.com/flows/boostinlyon/anyfetch/messages?limit=100";

	downloadFlowDockMessages(function(err, messages) {
		if(err) {
			throw err;
		}

		// Graphing time!
		Object.keys(chartsDefinition).forEach(function(chartName) {
			var options = chartsDefinition[chartName];
			var data = options.chartData(messages);
			var chartOptions = options.chartOptions || {};
			var ctx = document.getElementById(chartName).getContext("2d");
			new Chart(ctx)[options.chartType](data, chartOptions);
		});

		$('#loader').hide();
		$('#charts').show();
		$('#title').text("anyFetch stats");
	});
});
