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

		/// Graph time!
		buildEventPieChart(messages);
		buildEventLineChart(messages);
	});
});






function buildEventPieChart(messages) {
	var getData = function() {
		var acc = messages.reduce(function(acc, m) {
			if(!acc[m.event]) {
				acc[m.event] = {
					value: 0,
					label: m.event,
					color: 'black',
					labelColor: 'white'
				};
			}

			acc[m.event].value += 1;

			return acc;
		}, {});


		return Object.values(acc);
	};

	var ctx = document.getElementById("event-pie-chart").getContext("2d");
	var chartOptions = {
		animateRotate : false,
	};
	new Chart(ctx).Pie(getData(), chartOptions);
}

function buildEventLineChart(messages) {
	var getData = function() {
		var acc = messages.reduce(function(acc, m) {
			var date = m.sent.getFullYear() + "-" + m.sent.getMonth() + "-" + m.sent.getDate();
			if(!acc[date]) {
				acc[date] = {
					value: 0,
					date: date,
					timestamp: m.sent.getTime()
				};
			}

			acc[date].value += 1;

			return acc;
		}, {});

		// var data = {
		// 	labels : ["January","February","March","April","May","June","July"],
		// 	datasets : [
		// 		{
		// 			fillColor : "rgba(151,187,205,0.5)",
		// 			strokeColor : "rgba(151,187,205,1)",
		// 			pointColor : "rgba(151,187,205,1)",
		// 			pointStrokeColor : "#fff",
		// 			data : [28,48,40,19,96,27,100]
		// 		}
		// 	]
		// };
		// return data;

		console.log(acc);
		acc = Object.values(acc);
		acc.sort(function(a, b) {
			return a.timestamp > b.timestamp;
		});

		return acc;
	};

	var ctx = document.getElementById("event-line-chart").getContext("2d");
	var chartOptions = {
	};
	new Chart(ctx).Line(getData(), chartOptions);
}


/**
 * Python backport
 */
Object.values = function(obj) {
	return Object.keys(obj).map(function (key) {
		return obj[key];
    });
};
