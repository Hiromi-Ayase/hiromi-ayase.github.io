
var INIT_DATA = { "data": [
  {"transform": {"x":0, "y":0, "r":0}, "color": 0},
  {"transform": {"x":0, "y":0, "r":0}, "color": 1},
  {"transform": {"x":0, "y":0, "r":0}, "color": 2},
  {"transform": {"x":0, "y":0, "r":0}, "color": 3},
  {"transform": {"x":0, "y":0, "r":0}, "color": 4},
  {"transform": {"x":0, "y":0, "r":0}, "color": 5},
  {"transform": {"x":0, "y":0, "r":0}, "color": 6},
  {"transform": {"x":0, "y":0, "r":0}, "color": 7},
  {"transform": {"x":0, "y":0, "r":0}, "color": 8},
  {"transform": {"x":0, "y":0, "r":0}, "color": 9},
  {"transform": {"x":0, "y":0, "r":0}, "color": 10},
  {"transform": {"x":0, "y":0, "r":0}, "color": 11},
  {"transform": {"x":0, "y":0, "r":0}, "color": 12},
  {"transform": {"x":0, "y":0, "r":0}, "color": 13},
  {"transform": {"x":0, "y":0, "r":0}, "color": 14},
  {"transform": {"x":0, "y":0, "r":0}, "color": 15},
  {"transform": {"x":0, "y":0, "r":0}, "color": 16},
  {"transform": {"x":0, "y":0, "r":0}, "color": 17},
  {"transform": {"x":0, "y":0, "r":0}, "color": 18},
  {"transform": {"x":0, "y":0, "r":0}, "color": 19},
  {"transform": {"x":0, "y":0, "r":0}, "color": 20}
]};

var CONST = {
  SIZE: 60,
  LENGTH: 50,
  ROOT3: Math.sqrt(3),
  ROTATE_SPEED: 30,
};

//RED, GREEN, BLUE, YELLOW
var COLOR = [
  ['red', 'red', 'red'],
  ['red', 'red', 'blue'],
  ['red', 'red', 'green'],
  ['red', 'red', 'yellow'],
  ['green', 'green', 'red'],
  ['green', 'green', 'green'],
  ['green', 'green', 'blue'],
  ['green', 'green', 'yellow'],
  ['blue', 'blue', 'red'],
  ['blue', 'blue', 'green'],
  ['blue', 'blue', 'blue'],
  ['blue', 'blue', 'yellow'],
  ['yellow', 'yellow', 'red'],
  ['yellow', 'yellow', 'green'],
  ['yellow', 'yellow', 'blue'],
  ['yellow', 'yellow', 'yellow'],
  ['red', 'green', 'blue'],
  ['red', 'green', 'yellow'],
  ['red', 'yellow', 'blue'],
  ['yellow', 'green', 'blue'],
  ['white', 'white', 'white'],
];

var sendTimer = null;
var lastSent = null;
function sync() {
  if (sendTimer != null) {
    window.clearTimeout(sendTimer);
    sendTimer = null;
  }
  var sendData = $("#data").val();
  if (lastSent === sendData) {
    return;
  }
  sendTimer = setTimeout(function() {
  }, 3000);
}

function draw() {
  var json = JSON.parse($("#data").val());
  var data = json.data;
  var handler = function (d, i) {
    var se
    var trans = d.transform;
    if (d3.event.sourceEvent.wheelDelta !== undefined) {
      trans.r += (d3.event.sourceEvent.wheelDelta < 0 ? 1 : -1) * CONST.ROTATE_SPEED;
    }
    if (d3.event.dx !== undefined && d3.event.dy !== undefined) {
      trans.x += d3.event.dx;
      trans.y += d3.event.dy;
    }
    $("#data").val(JSON.stringify(json));

    d3.select(this).attr("transform", function (d, i) {
      return "translate(" + [trans.x, trans.y] + "),rotate(" + trans.r + ")";
    });
  };

  var drawPiece = function(svg) {
    svg.selectAll('polygon').remove();
    var center = CONST.SIZE / 2;
    var piece = [];
    for (var i = 0; i < 3; i++) {
      var now = center + "," + center + " ";
      for (var j = i; j < i + 2; j++) {
        var x = center + CONST.LENGTH / CONST.ROOT3 * Math.sin(2 * j * Math.PI / 3)
        var y = center - CONST.LENGTH / CONST.ROOT3 * Math.cos(2 * j * Math.PI / 3)
        now += x + "," + y + " ";
      }
      now += center + "," + center;
  
      piece.push({ points: now });
    }
    for (var i = 0; i < piece.length; i++) {
      svg.append('polygon').attr('points', piece[i].points).attr('fill', function (d) {
        return COLOR[d.color % COLOR.length][i];
      });
    }
  };

  var drag = d3.behavior.drag().on("drag", handler);
  var zoom = d3.behavior.zoom().on('zoom', handler);



  d3.select('#viewer').selectAll('span').remove();  
  var span = d3.select('#viewer').selectAll('.piece').data(data).enter().append('span');
  var svg = span.append('svg').call(drag).call(zoom);
  drawPiece(svg);

  svg.attr({
    width: function (d) {
      return CONST.SIZE;
    },
    height: function (d) {
      return CONST.SIZE;
    },
    transform: function (d) {
      return "translate(" + [d.transform.x, d.transform.y] + "),rotate(" + d.transform.r + ")";
    }
  });
}


$(function () {
  $("#data").val(JSON.stringify(INIT_DATA));
  
  draw();
  $("#btn").bind("click", function (d) {
    draw();
  });
  $("#data").change(function (d) {
    draw();
  });
});
