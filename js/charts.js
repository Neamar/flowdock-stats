/**
 * Python backport
 */
Object.values = function(obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
};


var chartsDefinition = {
  'event-pie-chart': {
    chartType: 'Pie',
    chartOptions: {
      animateRotate : false,
    },
    chartData: function(messages) {
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
    }
  },
  'user-pie-chart': {
    chartType: 'Pie',
    chartOptions: {
      animateRotate : false,
    },
    chartData: function(messages) {
      var acc = messages.reduce(function(acc, m) {
        // Skip "0" user
        if(m.user === 0) {
          return acc;
        }

        if(!acc[m.user]) {
          acc[m.user] = {
            value: 0,
            label: m.user,
            color: 'black',
            labelColor: 'white'
          };
        }

        acc[m.user].value += 1;

        return acc;
      }, {});


      return Object.values(acc);
    }
  },
  'event-line-chart': {
    chartType: 'Line',
    chartData: function(messages) {
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

      acc = Object.values(acc);
      acc.sort(function(a, b) {
        return a.timestamp > b.timestamp;
      });

      var labels = acc.map(function(m) {
        return m.date;
      });
      var values = acc.map(function(m) {
        return m.value;
      });

      var data = {
          labels: labels,
          datasets: [
            {
              fillColor : "rgba(151,187,205,0.5)",
              strokeColor : "rgba(151,187,205,1)",
              pointColor : "rgba(151,187,205,1)",
              pointStrokeColor : "#fff",
              data : values
            }
          ]
      };

      return data;
    }
  }
};
