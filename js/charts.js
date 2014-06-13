/**
 * Python backport
 */
Object.values = function(obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
};

Date.prototype.getWeek = function() {
  // Copy date so don't modify original
  d = new Date(+this);
  d.setHours(0,0,0);
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setDate(d.getDate() + 4 - (d.getDay()||7));
  // Get first day of year
  var yearStart = new Date(d.getFullYear(),0,1);
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1) / 7);
  // Return array of year and week number
  return [d.getFullYear(), weekNo];
};

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(+d);
  d.setHours(0,0,0);
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setDate(d.getDate() + 4 - (d.getDay()||7));
  // Get first day of year
  var yearStart = new Date(d.getFullYear(),0,1);
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1) / 7);
  // Return array of year and week number
  return [d.getFullYear(), weekNo];
}

var chartsDefinition = {
  'event-pie-chart': {
    chartType: 'Pie',
    chartOptions: {
      animation : false,
    },
    chartData: function(messages) {
      var acc = messages.reduce(function(acc, m) {
        if(!acc[m.event]) {
          acc[m.event] = {
            value: 0,
            label: m.event,
            color: "#97BBCD",
            labelColor: 'black'
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
      animation : false,
    },
    chartData: function(messages) {
      var acc = messages.reduce(function(acc, m) {
        // Skip "0" user
        if(m.user === "0") {
          return acc;
        }

        if(!acc[m.user]) {
          acc[m.user] = {
            value: 0,
            label: m.user,
            color: "#97BBCD",
            labelColor: 'black'
          };
        }

        acc[m.user].value += 1;

        return acc;
      }, {});


      return Object.values(acc);
    }
  },
  'day-line-chart': {
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
  },
  'week-line-chart': {
    chartType: 'Line',
    chartData: function(messages) {
      var acc = messages.reduce(function(acc, m) {
        var date = m.sent.getWeek();
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
  },
  'hour-line-chart': {
    chartType: 'Bar',
    chartData: function(messages) {
      var acc = messages.reduce(function(acc, m) {
        var hour = m.sent.getHours();
        if(!acc[hour]) {
          acc[hour] = {
            value: 0,
            hour: hour,
          };
        }

        acc[hour].value += 1;

        return acc;
      }, {});

      acc = Object.values(acc);
      acc.sort(function(a, b) {
        return a.hour > b.hour;
      });

      var labels = acc.map(function(m) {
        return m.hour;
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
  },
  'dayofweek-line-chart': {
    chartType: 'Bar',
    chartData: function(messages) {
      var acc = messages.reduce(function(acc, m) {
        var day = m.sent.getDay();
        if(!acc[day]) {
          acc[day] = {
            value: 0,
            day: day,
          };
        }

        acc[day].value += 1;

        return acc;
      }, {});

      acc = Object.values(acc);
      acc.sort(function(a, b) {
        return a.day > b.day;
      });

      var labels = acc.map(function(m) {
        return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][m.day];
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
