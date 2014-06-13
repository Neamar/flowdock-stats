/**
 * Download all Flowdock flows, and send them into done
 */
function downloadFlowDockFlows(authorizationHeader, done) {
  $.ajax({
    url: "https://api.flowdock.com/flows",
    headers: {
      "Authorization": authorizationHeader
    },
    type: "GET",
    crossDomain: true,
    success: function(flows) {
      var options = '';
      flows.forEach(function(flow) {
        var parameterized = flow.organization.parameterized_name + '/' + flow.parameterized_name;

        options += "<option value='" + parameterized + "'>" + flow.organization.name + " : " + flow.name + "</option>\n";
      });

      $('#flow').html(options);

      done(null, flows);
    },
    error: function(xhr) {
      if(xhr.status === 401) {
        alert("Unauthorized. Please check your credentials, then retry.");
      }

      console.warn("FAILURE to load Flowdock flows:", xhr);
      done(new Error("Unable to load"));
    }
  });
}
