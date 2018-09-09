var youtubeRequestRegex = /\s?([A-Za-z0-9\-_]{11})\s?/;
var searchRequestRegex = /(.+)聞きたい/;
var tweetList = [];

function getTimeline() {
  $.ajax({
    url: "http://search.twitter.com/search.json",
    dataType: 'jsonp',
    data: {
      q: "%23"+channel_name,
      rpp: 30,
      since_id: twitterMaxID,
      lang: "all"
    },
    success: function(json) {
      if (json.results) {
        twitterMaxID = json.max_id_str;
        addRequests(json.results)
      }
    },
  });
}

function addRequests(res) {
  $("#marquee").empty();
  for(var i = 1; i <= res.length; i++) {
    var x = res[res.length-i];
    var ret = cleanCode(x, function(j, videoID) {
        if (videoID) {
          new_playlist.push({
            song: videoID,
            user: j.from_user,
            icon: j.profile_image_url,
            date: new Date(j.created_at),
          });
        }
    });
    if (!ret) {
        var text = x.text.replace(/\s*#[a-zA-Z0-9_\-]+\s*/g, "");
        text = text.replace(/\n/g, " ");
        $("#marquee").append("<li>" + x.from_user + ": " + text + "</li>");
     }
  }
  $("#marquee").marquee();
}

function search(j, query, callback) {
    $.ajax({
        type:"GET",
        url:'http://gdata.youtube.com/feeds/videos',
        data: {
        'vq':query,
        'start-index':'1',
        'max-results':1,
        'alt':'json-in-script',
        'format':'5'
    },
    async:false,
    dataType: 'jsonp',
    success: function(data) {
        var e = data.feed.entry[0];
        var group = e.media$group;
        var url = group.media$player[0].url;
        var m;
        if (m = url.match(/\?v=([A-Za-z0-9\-_]{11})/)) {
            callback(j, m[1]);
        }
    },
    error: function(xOptions, textStatus){
        url = null
    }
    });
}

function cleanCode(j, callback){
  var text = j.text.replace(/\s*[@#][a-zA-Z0-9_\-]+\s*/g, "");
  var res;
  if (res = text.match(youtubeRequestRegex)) {
    callback(j, res[1]);
    return true;
  } else if (res = text.match(searchRequestRegex)) {
    var url = search(j, res[1], callback);
    return true;
  }
  return false;
}

function tweet(text) {
    if (loginName == null) {
        location.href="http://hiromi-ayase.appspot.com/twitterauth?pass=peer";
        return;
    }
    var content = [["status", text]];
    postTwitter( content, null);
}

function auth() {
    location.href="http://hiromi-ayase.appspot.com/twitterauth?pass=peer";
}

function postTwitter(content, callback) {
    var form = $("#twitter-form");
    form.empty();
    var accessor = {
      consumerSecret: "L4hmoboxL4AnhT54KMp3cJq1vgglfhDU45tOhjDz3M", 
      tokenSecret: accessTokenSecret
    };
    
    var message = {
      method: "post", 
      action: form.attr("action"), 
      parameters: [ 
        ["oauth_signature_method", "HMAC-SHA1"], 
        ["oauth_consumer_key", "2eYAeOs0jIZl2QlPM88gg"], 
        ["oauth_token", accessToken]
      ]
    };
    for (var i = 0; i < content.length; i ++) {
        var p = content[i];
        message.parameters.push(p);
    }

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var parameterMap = OAuth.getParameterMap(message.parameters);
    for (var i = 0; i < message.parameters.length; i ++) {
        var p = message.parameters[i];
        if (p[0].substring(0, 6) == "oauth_")
        {
            form.append('<input id="' + p[0] + '" name = "' + p[0] + '" type="hidden" value="' + p[1] + '" />')
        }
    }
    for (var i = 0; i < content.length; i ++) {
        var p = content[i];
        form.append('<input id="' + p[0] + '" name = "' + p[0] + '" type="hidden" value="' + p[1] + '" />')
    }
    form.submit();
}

function sendMessage(text) {
    text = text + " #" + channel_name;
    tweet(text);
    $('#tweet-box').val("");
}

new_playlist = new Array();
all_playlist = new Array();
twitterMaxID = "0";
