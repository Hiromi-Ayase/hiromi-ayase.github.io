

function refresh() {
    $.ajax({
        url: "json/data.json",
        dataType: "json",
        beforeSend : function(xhr){
            xhr.setRequestHeader("If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT");
        },
        success: function(json) {
            $("#stock-container").empty();
            for (var id in json.stock) {
                var containerId = "stock-" + id;
                var chartId = "chart-" + id;
                var boardId = "board-" + id;
                $("#stock-container").append('<div class="stock row" id="' + containerId + '"><div class="chart span7" id="' + chartId + '"></div><div class="board span3" id="' + boardId + '"></div></div>');
                var stock = json.stock[id];
                var containerId = "stock-" + id;
                createGraph(chartId, stock);
                createBoard(boardId, stock);
            }

            $("#trader-container").empty();
            createTrader("trader-container", json.trader);
        }
    });
}

function createGraph(id, stock) {
    var options = {
        title: stock.name,
        hAxis: {title: '取引ターン'},
        vAxis: {title: '価格(円)'},
        legend: 'none'
    };
    var data = google.visualization.arrayToDataTable(stock.boxChart);
    var chart = new google.visualization.CandlestickChart(document.getElementById(id));
    chart.draw(data, options);
}


function createBoard(id, stock) {
    var table = '<table class="table table-striped table-bordered table-condensed board">';
    table += "<thead>";
    table += '<tr><th><div class="board-element">売り</div></th><th><div class="board-element">価格</div></th><th><div class="board-element">買い</div></th></tr>';
    table += "</thead><tbody>";
    for (var i = 0; i < stock.board.length; i ++) {
        var elem = stock.board[i];
        if (elem[0] == null) { elem[0] = ""; }
        if (elem[2] == null) { elem[2] = ""; }
        table += '<tr><td><div class="board-element">' + elem[0] + '</div></td><td class="board-center"><div class="board-element">' +  elem[1] + '</div></td><td class="board-left"><div class="board-element">' + elem[2] + '</div></td></tr>';
    }
    table += "</tbody>";
    table += "</table>";
    $("#" + id).append(table);
}

function createTrader(id, traderList) {
    var table = '<table class="table table-striped table-bordered table-condensed board">';
    table += "<thead>";
    table += '<tr><th><div class="board-element">名前</div></th><th><div class="board-element">総資産(円)</div></th><th><div class="board-element">損益(円)</div></th></tr>';
    table += "</thead><tbody>";
    for (var traderId in traderList) {
        var trader = traderList[traderId];
        if (trader.profit > 0) {
            trader.profit = "+" + trader.profit;
        }
        table += '<tr><td><div class="board-element">' + trader.name + '</div></td><td class="board-center"><div class="board-element">' +  trader.estimate + '</div></td><td class="board-left"><div class="board-element">' + trader.profit + '</div></td></tr>';
    }
    table += "</tbody>";
    table += "</table>";
    $("#" + id).append(table);
}

