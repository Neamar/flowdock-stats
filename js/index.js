$(function() {

	$('#credentials-form').submit(function() {
		$('#credentials').hide();
		$('#loader').show();

		var authorizationHeader = "Basic " + btoa($('#token').val() + ':flowdock-stats');
		var baseUrl = "https://api.flowdock.com/flows/" + $('#organization').val() + '/' + $('#flowname').val() + '/messages?limit=100';

		downloadFlowDockMessages(baseUrl, authorizationHeader, function(err, messages) {
			if(err) {
				$('#credentials').show();
				$('#loader').hide();

				return;
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
			$('#title').text($('#organization').val() + '/' + $('#flowname').val() + " stats");
		});

		return false;
	});
});
