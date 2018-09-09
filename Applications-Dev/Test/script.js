var statusList = ["HP", "ATK", "DEF", "DEX", "AGI", "LUK"];
var operator = {"<=": -1, "==": 0, ">=": 1};

function setRnadom() {
    
}

function setStatus(s) {
    for (var i = 0; i < statusList.length; i ++) {
        $("#" + statusList[i]).text(s[i]);
    }
}

function setUp(s) {
    for (var i = 0; i < statusList.length; i ++) {
        var x = $("#" + statusList[i] + "-UP");
        x.text(s[i]);
    }
}

function parseStatusCondition(s, n) {
    var ret = [[], [], [], [], [], []];

    var elem = s.split(",");
    if (s == null || s.trim() == "")
        return ret;

    var total = 0;
    for (var i = 0; i < elem.length; i ++) {
        var opFound = false;
        for (var op in operator) {
            var x = elem[i].split(op);
            if (x.length == 2) {
                opFound = true;
                var key = x[0].trim();
                var value = x[1].trim();
                if (isNaN(value) || value > n || value < 0) {
                    throw "Illegal Value: 右辺は0から" + n + "の範囲で指定してください: " + value + " (Ex:AGI == 0, HP <= 3)";
                }
                value = Number(value);
                var statusFound = false;
                for (var j = 0; j < statusList.length; j ++) {
                    if (key == statusList[j]) {
                        if (operator[op] == 0) {
                            ret[j].push(value);
                        } else {
                            if (operator[op] > 0) {
                                total += value;
                            }
                            if (total > n) {
                                throw "Illegal Value: 合計値は" + n + "以下にしてください: " + total;
                            }
                            for (var k = value; k >= 0 && k <= n; k += operator[op]) {
                                ret[j].push(k);
                            }
                        }
                        statusFound = true;
                        break;
                    }
                }
                if (!statusFound) {
                    throw "Syntax Error: 左辺は HP, ATK, DEF, DEX, AGI, LUKのいずれかを指定してください: " + key + " (Ex:AGI == 0, HP <= 3)";
                }
                break;
            }
        }
        if (!opFound) {
            throw "Syntax Error: 演算子は <=, ==, >= のいずれかを指定してください (Ex:AGI == 0, HP <= 3)";
        }
    }
    return ret;
}

function getConditionDesc(cond, n) {
    var s = "";
    var found = false;
    for (var i = 0; i < statusList.length; i ++) {
        if (cond[i].length == 0) {
        } else if (cond[i].length == 1) {
            found = true;
            s += statusList[i] + "が" + cond[i][0] + ", ";
        } else {
            found = true;
            s += statusList[i] + "が" + cond[i][0];
            if (cond[i][0] > cond[i][1]) {
                s += "以下, ";
            } else {
                s += "以上, ";
            }
        }
    }
    if (found) {
        s += "合計が" + n;
        return s;
    } else {
        return "合計が" + n;
    }
}

function isMatch(cond, up, n) {
    var total = 0;
    for (var i = 0; i < statusList.length; i ++) {
        if(cond[i].length > 0) {
            if (cond[i].indexOf(up[i]) == -1) {
                return false;
            }
        }
        total += up[i];
    }
    return total == n;
}

function getRandomUp(n) {
    var s = [0, 0, 0, 0, 0, 0];
    if (Math.random() < 0.5) {
        n --;
    }

    for (var i = 0; i < n; i ++) {
        var x = Math.floor(Math.random() * statusList.length);
        s[x] ++;
    }
    return s;
}

$(function() {
    setStatus([100, 100, 100, 100, 100, 100]);
    setUp([0, 0, 0, 0, 0, 0]);

    var maxUp = 5;

    var timer;
    $('#button').on('click', function() {
        clearInterval(timer);
        $("#result").text("");
        var count = 0;
        var cond = $("#status-condition").val();
        try {
            cond = parseStatusCondition(cond, maxUp);
            $("#message").text(getConditionDesc(cond, maxUp));
            
            timer = setInterval(function() {
                count ++;
                var up  = getRandomUp(maxUp);
                setUp(up);
                if (isMatch(cond, up, maxUp)) {
                    $("#result").text("" + count + "回目: OK!");
                    clearInterval(timer);
                } else {
                    $("#result").text("" + count + "回目: NG 次に進みます");
                }
            }, 20);
        } catch(e) {
            $("#message").text(e);
        }
    });
    
    $("#status-condition").keyup(function (e) {
        var cond = $("#status-condition").val();
        if (e.which == 13) {
            $('#button').click();
            return false;
        } else {
            try {
                var cond = parseStatusCondition(cond, maxUp);
                $("#message").text(getConditionDesc(cond, maxUp));
            } catch (e) {
                $("#message").text(e);
            }
        }
    });
});
