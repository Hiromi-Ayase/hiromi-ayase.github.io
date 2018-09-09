var accessToken;
var accessTokenSecret;
var loginName;

var lat;
var long;
var isGeo = false;

$(function() {
  var v = getUrlVars();
  if (v["token"]) {
    localStorage["accessToken"] = v["token"];
    localStorage["accessTokenSecret"] = v["tokenSecret"];
    localStorage["loginName"] = v["name"];
    
    var url = location.href;
    url = url.replace(/\?.*/g, "")
    location.href = url;
    return false;
  }
  
  accessToken       = localStorage["accessToken"];
  accessTokenSecret = localStorage["accessTokenSecret"];
  loginName         = localStorage["loginName"];
  
  if (accessToken == null || accessTokenSecret == null || loginName == null) {
    $('#text').attr("disabled", "disabled");
    $('#hash').attr("disabled", "disabled");
    $('#bitly').attr("disabled", "disabled");
    $('#loc').attr("disabled", "disabled");
    $('#x').attr("disabled", "disabled");
    $("#text").val("(Tweetボタンを押して認証してね)");
  }
  
  $('#tweet').click(function() {
    if (loginName == null) {
        location.href="http://hiromi-ayase.appspot.com/twitterauth?pass=peer&client=1";
    } else {
        tweet($("#text").val());
    }
    return false;
  });
  $('#hash').click(function() {
    var text = $("#text").val();
    $("#text").val(text + " #きたくえいる");
    return false;
  });
  $('#loc').click(function() {
    if (isGeo == true) {
        isGeo = false;
        updateTitle();
    } else {
        geoLocate();
    }
    return false;
  });
  $("#text").keyup(function(e) {
    updateTitle();
  });
  $("#x").click(function(e) {
    $("#text").val("");
    updateTitle();
    return false;
  });
  $("#id").click(function(e) {
    location.href="http://hiromi-ayase.appspot.com/twitterauth?pass=peer&client=1";
    return false;
  });
});

function updateTitle() {
    var title = "QueiPhone(" + $("#text").val().length + ")"
    if (isGeo == true) {
        title += " - (" + lat + ", " + long + ")";
    }
    $("#title").text(title);
}

function geoLocate(){
    var geo = navigator.geolocation;
    if(geo){
        geo.getCurrentPosition(
            function(p){
                lat = p.coords.latitude;
                long = p.coords.longitude;
                var accuracy = p.coords.accuracy;
                isGeo = true;
                updateTitle();
            },
            function() {
                alert('現在地を取得できませんでした。');
                isGeo = false;
            },
            {
              timeout: 10000,
              maximumAge: 20000,
              enableHighAccuracy: true
            }
        );
    } else {
        alert('現在地を取得できませんでした。');
        isGeo = false;
    }
}

function getUrlVars()
{ 
    var vars = [], hash; 
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&'); 
    for(var i = 0; i < hashes.length; i++) { 
        hash = hashes[i].split('='); 
        vars.push(hash[0]); 
        vars[hash[0]] = hash[1]; 
    } 
    return vars; 
}

function tweet(text) {
    var content;
    if (isGeo == true) {
        content = [["status", text], ["lat", lat], ["long", long]];
    } else {
        content = [["status", text]];
    }
    isGeo = false;
    $("#text").val("");
    updateTitle();
    postTwitter( content, null);
}

function postTwitter(content, callback) {
    var form = $("#twitter-form");
    form.empty();
    var accessor = {
      consumerSecret: "ddzt6weEgJrMDQtYWS3dtG2F6FlnzbehPOeoqgnVooM", 
      tokenSecret: accessTokenSecret
    };
    
    var message = {
      method: "post", 
      action: form.attr("action"), 
      parameters: [ 
        ["oauth_signature_method", "HMAC-SHA1"], 
        ["oauth_consumer_key", "rXUyIEuSOs43E5ySpoyE8g"], 
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

