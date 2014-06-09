$(function() {
	var baseUrl = "https://api.flowdock.com/flows/boostinlyon/anyfetch/messages?limit=100";

	function downloadMessages(cb) {
		$.ajax({
			url: baseUrl,
			headers: {
				"Authorization": "Basic " + flowdockCredentials
			},
			type: "GET",
			crossDomain: true,
			success: function(r) {
				cb(null, r);
			},
			error: function(xhr) {
				cb(new Error("Unable to load"));
				console.warn("FAILURE", xhr);
			}
		});
	}

	var messages = [];
	downloadMessages(function(err, newMessages) {
		if(err) {
			throw err;
		}

		newMessages = newMessages.map(function(message) {
			// Discard heavy informations
			return {
				event: message.event,
				user: message.user,
				sent: new Date(message.sent)
			};
		});

		messages = messages.concat(newMessages);

		// Graphing time!
		Object.keys(chartsDefinition).forEach(function(chartName) {
			var options = chartsDefinition[chartName];
			var data = options.chartData(messages);
			var chartOptions = options.chartOptions || {};
			var ctx = document.getElementById(chartName).getContext("2d");
			new Chart(ctx)[options.chartType](data, chartOptions);
		});
	});
});





/**
 * Python backport
 */
Object.values = function(obj) {
	return Object.keys(obj).map(function (key) {
		return obj[key];
    });
};
