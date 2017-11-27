
var INIT_DATA = { "data": [
  {"id": 0, "transform": {"x":0, "y":10, "r":0}, "color": 0},
  {"id": 1, "transform": {"x":55, "y":10, "r":0}, "color": 1},
  {"id": 2, "transform": {"x":110, "y":10, "r":0}, "color": 2},
  {"id": 3, "transform": {"x":165, "y":10, "r":0}, "color": 3},
  {"id": 4, "transform": {"x":220, "y":10, "r":0}, "color": 4},
  {"id": 5, "transform": {"x":275, "y":10, "r":0}, "color": 5},
  {"id": 6, "transform": {"x":330, "y":10, "r":0}, "color": 6},
  {"id": 7, "transform": {"x":385, "y":10, "r":0}, "color": 7},
  {"id": 8, "transform": {"x":440, "y":10, "r":0}, "color": 8},
  {"id": 9, "transform": {"x":495, "y":10, "r":0}, "color": 9},
  {"id": 10, "transform": {"x":550, "y":10, "r":0}, "color": 10},
  {"id": 11, "transform": {"x":605, "y":10, "r":0}, "color": 11},
  {"id": 12, "transform": {"x":660, "y":10, "r":0}, "color": 12},
  {"id": 13, "transform": {"x":715, "y":10, "r":0}, "color": 13},
  {"id": 14, "transform": {"x":770, "y":10, "r":0}, "color": 14},
  {"id": 15, "transform": {"x":0, "y":65, "r":0}, "color": 15},
  {"id": 16, "transform": {"x":55, "y":65, "r":0}, "color": 16},
  {"id": 17, "transform": {"x":110, "y":65, "r":0}, "color": 17},
  {"id": 18, "transform": {"x":165, "y":65, "r":0}, "color": 18},
  {"id": 19, "transform": {"x":220, "y":65, "r":0}, "color": 19},
  {"id": 20, "transform": {"x":275, "y":65, "r":0}, "color": 20}
]};

var CONST = {
  SIZE: 55,
  LENGTH: 50,
  ROOT3: Math.sqrt(3),
  ROTATE_SPEED: 30,
  SNAP: [25, 25 / 2 * Math.sqrt(3)] 
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
  ['gray', 'gray', 'gray'],
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

    var x = trans.x;
    var y = trans.y;
    if (140 <= x && x <= 620 && 270 <= y && y <= 750) {
      x = Math.floor(trans.x / CONST.SNAP[0]) * CONST.SNAP[0];
      y = Math.floor(trans.y / CONST.SNAP[1]) * CONST.SNAP[1] + Math.cos(trans.r / 60 * Math.PI) * CONST.LENGTH / 6.9;
    }
    
    $("#data").val(JSON.stringify(json));

    d3.select(this).attr("transform", function (d, i) {
      return "translate(" + [x, y] + "),rotate(" + trans.r + ",0, " + (CONST.SIZE * 0.25 / 2) + ")";
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
      return CONST.SIZE - CONST.SIZE * 0.25;
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
