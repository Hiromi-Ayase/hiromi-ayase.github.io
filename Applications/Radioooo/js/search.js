function search(query) {
    var url;
    $.ajax({
        type:"GET",
        url:'http://gdata.youtube.com/feeds/videos',
        data: {
        'vq':query,
        'start-index':'1',
        'max-results':1,
        'alt':'json-in-script',
        'format':'1'
    },
    async:false,
    dataType: 'jsonp',
    success: function(data) {
        var e = data.feed.entry[0];
        var group = e.media$group;
        url = group.media$player[0].url;
    },
    error: function(xOptions, textStatus){
        url = ""
    }
    });
    return url;
}
