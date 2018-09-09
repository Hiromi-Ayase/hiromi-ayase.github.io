jQuery.preloadImages = function(){
    for(var i = 0; i<arguments.length; i++){
        jQuery("<img>").attr("src", "nixie/" + arguments[i]);
    }
};

$(function() {
    if ($("#nixie")) {
        Nixie("nixie");
    }
});


function Nixie(name){
    name = "#" + name;
    $.preloadImages(
         "0.png", "1.png", "2.png", "3.png", "4.png",
         "5.png", "6.png", "7.png", "8.png", "9.png");

    NixieMain = $(name);
    NixieMain.append("<div class=\"nixie1 nixie-element\"></div>");
    NixieMain.append("<div class=\"nixie2 nixie-element\"></div>");
    NixieMain.append("<div class=\"nixie3 nixie-element\"></div>");
    NixieMain.append("<div class=\"nixie4 nixie-element\"></div>");
    NixieMain.append("<div class=\"nixie5 nixie-element\"></div>");
    NixieMain.append("<div class=\"nixie6 nixie-element\"></div>");

    NixieMain.append("<div class=\"clr\"></div>");

    NixieMain.append("<div class=\"nixie-sub1 nixie-sub-element\"></div>");
    NixieMain.append("<div class=\"nixie-sub2 nixie-sub-element\"></div>");
    NixieMain.append("<div class=\"nixie-sub3 nixie-sub-element\"></div>");
    NixieMain.append("<div class=\"nixie-sub4 nixie-sub-element\"></div>");
    NixieMain.append("<div class=\"nixie-sub5 nixie-sub-element\"></div>");
    NixieMain.append("<div class=\"nixie-sub6 nixie-sub-element\"></div>");

    NixieMain.append("<div class=\"clr\"></div>");

    NixieMain.append("<div class=\"left-lamp\"></div>");
    NixieMain.append("<div class=\"right-lamp\"></div>");

    var NixieElement = $(name + " .nixie-element");
    var Nixie1 = $(name + " .nixie1");
    var Nixie2 = $(name + " .nixie2");
    var Nixie3 = $(name + " .nixie3");
    var Nixie4 = $(name + " .nixie4");
    var Nixie5 = $(name + " .nixie5");
    var Nixie6 = $(name + " .nixie6");

    var NixieSubElement = $(name + " .nixie-sub-element");
    var NixieSub1 = $(name + " .nixie-sub1");
    var NixieSub2 = $(name + " .nixie-sub2");
    var NixieSub3 = $(name + " .nixie-sub3");
    var NixieSub4 = $(name + " .nixie-sub4");
    var NixieSub5 = $(name + " .nixie-sub5");
    var NixieSub6 = $(name + " .nixie-sub6");

    var LeftLamp = $(name + " .left-lamp");
    var RightLamp = $(name + " .right-lamp");

    $(name + " .clr").css({clear:"both"});

    NixieMain.css({
        background:"url(nixie/background.png)",
        width:"480px",
        height:"214px",
        position:"relative",
    });
    
    NixieElement.css({
        width:"55px",
        height:"105px",
        position:"absolute",
        top:"32px",
    });

    Nixie1.css({
        background:"url(nixie/0.png)",
        left:"2px",
    });
    
    Nixie2.css({
        background:"url(nixie/0.png)",
        left:"69px",
    });
    
    Nixie3.css({
        background:"url(nixie/0.png)",
        left:"146px",
    });

    Nixie4.css({
        background:"url(nixie/0.png)",
        left:"216px",
    });

    Nixie5.css({
        background:"url(nixie/0.png)",
        left:"294px",
    });
    Nixie6.css({
        background:"url(nixie/0.png)",
        left:"364px",
    });
    
    NixieSubElement.css({
        width:"55px",
        height:"105px",
        position:"absolute",
        top:"32px",
    });
    NixieSub1.css({
        left:"2px",
    });
    
    NixieSub2.css({
        left:"69px",
    });
    
    NixieSub3.css({
        left:"146px",
    });
    
    NixieSub4.css({
        left:"216px",
    });
    
    NixieSub5.css({
        left:"294px",
    });
    
    NixieSub6.css({
        left:"364px",
    });
    
    LeftLamp.css({
        width:"18px",
        height:"47px",
        position:"absolute",
        top:"107px",
        left:"128px",
        background:"url(nixie/leftLamp.png)",
    });

    RightLamp.css({
        width:"18px",
        height:"47px",
        position:"absolute",
        top:"107px",
        marginLeft:"276px",
        background:"url(nixie/rightLamp.png)",
    });

    var lastSec = -1;
    var timer = setInterval(function() {
        var now = new Date();
        var hour = now.getHours();
        var min  = now.getMinutes();
        var sec  = now.getSeconds();
        if (lastSec != sec) {
            lastSec = sec;
            if (sec >= 50 && sec <= 55) {
                var year  = now.getFullYear() % 100;
                var month = now.getMonth() + 1;
                var day   = now.getDate();
                
                set1(month);
                set2(day);
                set3(year);
                RightLamp.fadeOut("fast");
                LeftLamp.fadeOut("fast");
            } else {
                set1(hour);
                set2(min);
                set3(sec);
                RightLamp.fadeOut("fast", function() {
                    RightLamp.fadeIn("normal");
                });
                LeftLamp.fadeOut("fast", function() {
                    LeftLamp.fadeIn("normal");
                });
            }
        }
	}, 100);
    
    function set1(n) {
        set(Nixie1, NixieSub1, Math.floor(n / 10));
        set(Nixie2, NixieSub2, Math.floor(n % 10));
    }
    
    function set2(n) {
        set(Nixie3, NixieSub3, Math.floor(n / 10));
        set(Nixie4, NixieSub4, Math.floor(n % 10));
    }
    
    function set3(n) {
        set(Nixie5, NixieSub5, Math.floor(n / 10));
        set(Nixie6, NixieSub6, Math.floor(n % 10));
    }
    
    function set(elem, subElem, n) {
        subElem.css({
            background:"url(nixie/" + n + ".png)",
        });
        var speed = Math.random();
        var s = "normal";
        if (speed < 0.5) {
            s = "fast";
        }
        subElem.fadeIn(s, function() {
            elem.css({background:"url(nixie/" + n + ".png)"});
            subElem.hide();
        });
    }
}

