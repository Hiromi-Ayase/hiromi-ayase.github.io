var accessToken;
var accessTokenSecret;
var loginName;

$(function() {
  // === Interval ===
  
  // 60sec
  setInterval(function(){
    // get Timeline
    getTimeline();
    // get UserCount
    //getUserCount();
  }, 60000);
  
  var accessToe
  var v = getUrlVars();
  if (v["token"]) {
    $.cookie("accessToken", v["token"]);
    $.cookie("accessTokenSecret", v["tokenSecret"]);
    $.cookie("loginName", v["name"]);
    location.href = "?";
  }
  accessToken = $.cookie("accessToken");
  accessTokenSecret = $.cookie("accessTokenSecret");
  loginName = $.cookie("loginName");
  
  // === Initialize ===
  
  // get Timeline
  getTimeline();
  
  // load Player
  setTimeout(_run, 1000);
  
  // get UserCount
  //getUserCount();
  
  // bookmarklet
  var blink = $("a#bookmarklet");
  blink.attr("href", 
    "javascript:tag='" + channel_name + 
    "';window.open('http://twitter.com/home/?status=@home%20'+"+ 
    "escape((location.href.match(/v=([^&=]{11})/)||[,0])[1])+'%20%2523'+tag);"+
    "undefined;"
  );
  blink.html("request for #" + channel_name);
});

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
