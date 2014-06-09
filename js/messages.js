var baseUrl = "https://api.flowdock.com/flows/boostinlyon/anyfetch/messages?limit=100";

function downloadFlowDockMessages(done) {
  var messages = [];
  function downloadMoreMessages(sinceId, cb) {
    $.ajax({
      url: baseUrl + "&since_id=" + sinceId + "&sort=asc",
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

  function withMessages(err, newMessages) {
    if(err) {
      return done(err);
    }

    // No new messages for this round, we're done!
    if(newMessages.length === 0) {
      return done(null, messages);
    }

    var lastId = newMessages[newMessages.length - 1].id;

    newMessages = newMessages.map(function(message) {
      // Discard heavy informations
      return {
        event: message.event,
        user: message.user,
        sent: new Date(message.sent)
      };
    });

    messages = messages.concat(newMessages);

    // Update counter
    $('#messages-count').text(messages.length);

    // Again !
    return done(null, messages);

    setTimeout(function() {
      downloadMoreMessages(lastId, withMessages);
    }, 0);
  }


  downloadMoreMessages(0, withMessages);

}
