/**
 * Download all Flowdock messages from the URL, then calls done node-js style.
 */
function downloadFlowDockMessages(baseUrl, authorizationHeader, done) {
  var messages = [];
  function downloadMoreMessages(sinceId, cb) {
    $.ajax({
      url: baseUrl + "&since_id=" + sinceId + "&sort=asc",
      headers: {
        "Authorization": authorizationHeader
      },
      type: "GET",
      crossDomain: true,
      success: function(r) {
        cb(null, r);
      },
      error: function(xhr) {
        if(xhr.status === 401) {
          alert("Unauthorized. Please check your credentials, then retry.");
        }
        else if(xhr.status === 404) {
          alert("This flow does not exist. Check your organization, flow name and verify you have access to the flow. Note flow names are case sensitive");
        }
        else {
          alert("Unable to load flow messages. More details can be found in the developer console.");
        }
        console.warn("FAILURE to load Flowdock messages:", xhr);
        cb(new Error("Unable to load"));
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
    // if(messages.length > 300) {
    //   return done(null, messages);
    // }

    setTimeout(function() {
      downloadMoreMessages(lastId, withMessages);
    }, 0);
  }


  downloadMoreMessages(0, withMessages);
}
