$(function() {
  var authorizationHeader;

  $('#credentials-form').submit(function() {
    authorizationHeader = "Basic " + btoa($('#token').val() + ":flowdock-stats");
    downloadFlowDockFlows(authorizationHeader, function(err, flows) {
      if(err) {
        $('#credentials').show();
        $('#flows').hide();

        return;
      }

      console.log(flows);
    });

    $('#credentials').hide();
    $('#flows').show();

    return false;
  });

  $('#flows-form').submit(function() {
    $('#flows').hide();
    $('#loader').show();

    var baseUrl = "https://api.flowdock.com/flows/" + $('#flow').val() + '/messages?limit=100';

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
      $('#title').text($('#flow').val() + " stats");

      messages = null;
    });

    return false;
  });
});
