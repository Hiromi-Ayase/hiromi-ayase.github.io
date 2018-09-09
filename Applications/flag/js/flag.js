
var setting = {
    map: {
        marginX:15,
        marginY:15,
        border:2,
    },
    block: {
        border: { size:3, color:"black" },
        type: {
            level1: { name:"1", level:1, color:"rgb(255, 204, 102)" },
            level2: { name:"2", level:2, color:"rgb(255, 153, 0)" },
            start: { name:"S", level:0, color:"rgb(255, 255, 0)" },
            flag: { name:"F", level:0, color:"rgb(255, 0, 0)" },
        },
        string: { color:"black" },
    },
    group: {
        red:{
            color:"rgb(255, 0, 0)",
            size:10,
            lineWidth:3,
            string: { color1:"rgb(255, 255, 255)", color2:"rgb(64, 64, 255)" },
            grad: { color1:"rgba(255, 200, 200, 0.5)", color2:"rgba(255, 200, 200, 0.2)", length1:0, length2:500 },
            angle: [0, 120],
            img:"player-red"
        },
        blue:{
            color:"rgb(0, 0, 255)",
            size:10,
            lineWidth:3,
            string: { color1:"rgb(255, 255, 255)", color2:"rgb(64, 64, 255)" },
            grad: { color1:"rgba(200, 200, 255, 0.5)", color2:"rgba(200, 200, 255, 0.2)", length1:0, length2:500 },
            angle: [180, 120],
            img:"player-blue"
        },
    },
    ui: {
        wheel: { resolution:50 },
        ambiguity: 1,
    },
};


var TacticsBoard = function(c, d, l) {
    var data = d;
    var canvas = c;
    var canvasLeft = canvas.getBoundingClientRect().left;
    var canvasTop = canvas.getBoundingClientRect().top;
    canvas.height = canvas.width * (data.sizeY / data.sizeX);

    var listener = l;
    var ctx = canvas.getContext("2d");
    
    var unitX;
    var unitY;
    var level = 2;
    var symmetry = true;
    var wallList = [];
    var filter = {};
    for (var name in setting.group) {
        filter[name] = true;
    }
    refresh();

    addEvents();
    redraw();

    // External APIs start
    this.getRawData = function() {
        return data;
    };

    this.getData = function() {
        var csv = data.sizeX + "," + data.sizeY + "\n";
        for (var i = 0; i < data.block.length; i ++) {
            var block = data.block[i];
            csv += "block," + block.x + "," + block.y + "," + block.type + "\n";
        }
        for (var i = 0; i < data.view.length; i ++) {
            var view = data.view[i];
            csv += "view," + view.name + "," + view.group + "," + view.x + "," + view.y + "," + view.angle[0] + "," + view.angle[1] + "\n";
        }
        return csv;
    };

    this.setData = function(csv) {
        try {
            var d = {
                sizeX:0,
                sizeY:0,
                block: [],
                view:[]
            };
            var lines = csv.split("\n");
            var elem = lines[0].split(",");
            d.sizeX = elem[0];
            d.sizeY = elem[1];
            for (var i = 1; i < lines.length; i ++) {
                var elem = lines[i].split(",");
                if (elem[0] == "block") {
                    d.block.push({x:Number(elem[1]), y:Number(elem[2]), type:elem[3]});
                } else if (elem[0] == "view") {
                    d.view.push({name:elem[1], x:Number(elem[3]), y:Number(elem[4]), angle:[Number(elem[5]), Number(elem[6])], group:elem[2]});
                }
            }
            data = d;
            refresh();
            redraw();
            listener(data, "size-changed");
        } catch (exception) {
            alert("Failed to load CSV - " + exception);
        }
    };

    this.addView = function(name, x, y, group) {
        var x = (x - canvasLeft - setting.map.marginX) / unitX;
        var y = (y - canvasTop - setting.map.marginY) / unitY;
        if (x >= 0 && x <= data.sizeX && y >= 0 && y <= data.sizeY) {
            var defaultAngle = setting.group[group].angle;
            data.view.push({"name":name, "x":x, "y":y, "angle":[defaultAngle[0], defaultAngle[1]], "group":group});
            refresh();
            redraw();
            return true;
        } else {
            return false;
        }
    };

    this.setAngle = function(angle) {
        for (var i = 0; i < data.view.length; i ++) {
            data.view[i].angle[1] = angle;
        }
        refresh();
        redraw();
    };

    this.setLevel = function(l) {
        level = l;
        refresh();
        redraw();
    };

    this.setSymmetry = function(s) {
        symmetry = s;
        if (symmetry == true) {
            var blockList = [];
            for (var i = 0; i < data.block.length; i ++) {
                var block = data.block[i];
                if (block.x < data.sizeX / 2) {
                    blockList.push(block);
                    blockList.push( {x:(data.sizeX - block.x - 1), y:(data.sizeY - block.y - 1), type:block.type} );
                } else if (block.x == data.sizeX / 2 - 1) {
                    blockList.push(block);
                }
            }
            data.block = blockList;
        }
        refresh();
        redraw();
    };

    this.setFilter = function(list) {
        filter = {};
        for (var name in setting.group) {
            if (list[name] == true) {
                filter[name] = true;
            } else {
                filter[name] = false;
            }
        }
        refresh();
        redraw();
    };
    
    this.setSize = function(width, height) {
        data.sizeX = width;
        data.sizeY = height;
        refresh();
        redraw();
    };

    this.refresh = function() {
        refresh();
        redraw();
    };

    this.getImageUrl = function() {
        return canvas.toDataURL();
    }
    // External APIs end
    
    function getSelectedObject(x, y) {
        var minLen = 1000000;
        var minIndex = -1;
        for (var i = 0; i < data.view.length; i ++) {
            var view = data.view[i];
            var w = view.x - x;
            var h = view.y - y;
            var len = w * w + h * h;
            if (len < minLen) {
                minLen = len;
                minIndex = i;
            }
        }
        
        if (minLen < setting.ui.ambiguity) {
            return {type:"view", index:minIndex};
        }

        for (var i = 0; i < data.block.length; i ++) {
            var block = data.block[i];
            if (Math.floor(x) == block.x && Math.floor(y) == block.y) {
                return {type:"block", index:i};
            }
        }
        return {type:"none"};
    }

    function addEvents() {
        function addTouchEvents() {
            var index = -1;
            var angle = [0, 0];
            var pinch = 0;
            var start = [0, 0];
            canvas.ontouchstart = function(e) {
                var ret;
                if (e.touches.length == 1) {
                    var touch = e.touches[0];
                    var x = (touch.pageX - canvasLeft - setting.map.marginX) / unitX;
                    var y = (touch.pageY - canvasTop - setting.map.marginY) / unitY;
                    ret = getSelectedObject(x, y);
                } else if (e.touches.length == 2) {
                    var x1 = e.touches[0].pageX;
                    var x2 = e.touches[1].pageX;
                    var y1 = e.touches[0].pageY;
                    var y2 = e.touches[1].pageY;
                    var x = (x1 - canvasLeft - setting.map.marginX) / unitX;
                    var y = (y1 - canvasTop - setting.map.marginY) / unitY;
                    ret = getSelectedObject(x, y);
                }
                
                if (ret != undefined && ret.type == "view") {
                    e.preventDefault();
                    index = ret.index;
                    var view = data.view[ret.index];

                    var a = Math.atan2(x2 - x1, y2 - y1) / Math.PI * 360;
                    angle = [view.angle[0] + a, view.angle[1] + a];
                    pinch = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
                    start = [0, 0];
                }
            }
            
            canvas.ontouchend = function(e) {
                index = -1;
            }

            canvas.ontouchmove = function(e) {
                if (index >= 0) {
                    e.preventDefault();
                    var x, y, a, p;
                    var view = data.view[index];
                    if (e.touches.length == 1) {
                        var touch = e.touches[0];
                        x = (touch.pageX - canvasLeft - setting.map.marginX) / unitX;
                        y = (touch.pageY - canvasTop - setting.map.marginY) / unitY;
                    } else if (e.touches.length == 2) {
                        var x1 = e.touches[0].pageX;
                        var x2 = e.touches[1].pageX;
                        var y1 = e.touches[0].pageY;
                        var y2 = e.touches[1].pageY;
                        x = (x1 - canvasLeft - setting.map.marginX) / unitX;
                        y = (y1 - canvasTop - setting.map.marginY) / unitY;
                        a = Math.atan2(x2 - x1, y2 - y1) / Math.PI * 360;
                    }

                    if (x < 0 || x >= data.sizeX || y < 0 || y >= data.sizeY) {
                        var deleted = data.view.splice(index, 1);
                        listener(data, "delete-view", deleted[0]);
                        refresh();
                        redraw();
                        return false;
                    }

                    view.x = x;
                    view.y = y;
                    view.area = searchCrossPoints(view);
                    
                    if (e.touches.length == 2) {
                        var newAngle0 = (angle[0] - a) % 360;
                        view.angle[0] = newAngle0;
                    }
                    redraw();
                }
             };

        }

        function addMouseEvents() {
            var view = null;
            canvas.onmousemove = function(e) {
                if (view != null) {
                    view.x = (e.pageX - canvasLeft - setting.map.marginX) / unitX;
                    view.y = (e.pageY - canvasTop - setting.map.marginY) / unitY;
                    view.area = searchCrossPoints(view);
                    redraw();
                }
            }

            canvas.onmousewheel = function(e) {
                var x = (e.pageX - canvasLeft - setting.map.marginX) / unitX;
                var y = (e.pageY - canvasTop - setting.map.marginY) / unitY;
                var ret = getSelectedObject(x, y);
                if (ret.type == "view") {
                    e.preventDefault();
                    var shift = typeof e.modifiers == 'undefined' ? e.shiftKey : e.modifiers & Event.SHIFT_MASK; 
                    var view = data.view[ret.index];
                    var delta = e.wheelDelta / setting.ui.wheel.resolution;
                    if (!shift) {
                        view.angle[0] = (view.angle[0] + delta) % 360;
                    } else if(view.angle[1] + delta >= 0 && view.angle[1] + delta <= 360) {
                        view.angle[1] += delta;
                    }
                    view.area = searchCrossPoints(view);
                    redraw();
                }
            }

            canvas.onmousedown = function(e) {
                var x = (e.pageX - canvasLeft - setting.map.marginX) / unitX;
                var y = (e.pageY - canvasTop - setting.map.marginY) / unitY;
                var ret = getSelectedObject(x, y);
                if (ret.type == "view") {
                    if (e.which == 1) {
                        view = data.view[ret.index];
                    } else if (e.which == 3) {
                        var deleted = data.view.splice(ret.index, 1);
                        listener(data, "delete-view", deleted[0]);
                        refresh();
                        redraw();
                        return false;
                    }
                } else {
                    var left = Math.floor(x);
                    var top = Math.floor(y);
                    if (symmetry == true && left > data.sizeX / 2) {
                        return;
                    }
                    var type;
                    if (ret.type == "block") {
                        var t = data.block[ret.index].type
                        if (t == "level1") {
                            type = "level2";
                        } else if (t == "level2" || t == "start" || t == "flag") {
                            type = undefined;
                        }
                    } else if (ret.type == "none") {
                        if (event.shiftKey == true) {
                            type = "start";
                        } else if (event.ctrlKey == true) {
                            type = "flag";
                        } else {
                            type = "level1";
                        }
                    }
                    setBlock(left, top, type);
                    refresh();
                    redraw();
                }
            }
            
            canvas.onmouseup = function(e) {
                view = null;
            }
            
            canvas.oncontextmenu= function(e) {
                return false;
            };
        }
        addMouseEvents();
        addTouchEvents();
        window.onresize = function() {
            canvasLeft = canvas.getBoundingClientRect().left;
            canvasTop = canvas.getBoundingClientRect().top;
        }
    }

    function getSymmetryBlock(x, y) {
        for (var i = 0; i < data.block.length; i ++) {
            var block = data.block[i];
            if (x == data.sizeX - block.x - 1 && y == data.sizeY - block.y - 1) {
                if (x == (data.sizeX - 1) / 2 && y == (data.sizeY - 1) / 2) {
                    return -1;
                } else {
                    return i;
                }
            }
        }
        return -1;
    }

    function setBlock(x, y, t) {
        if (x < 0 || y < 0 || x >= data.sizeX || y >= data.sizeY) {
            return 1;
        }
        var index = -1
        for (var i = 0; i < data.block.length; i ++) {
            if (data.block[i].x == x && data.block[i].y == y) {
                index = i;
                break;
            }
        }

        if (t == undefined) {
            data.block.splice(index, 1);
        } else if (index < 0) {
            data.block.push({x:x, y:y, type:t});
        } else {
            data.block[index].type = t
        }

        if (symmetry) {
            if (x != (data.sizeX - 1) / 2 || y != (data.sizeY - 1) / 2) {
                index = getSymmetryBlock(x, y);
                if (t == undefined) {
                    data.block.splice(index, 1);
                } else if (index < 0) {
                    data.block.push({x:(data.sizeX - x - 1), y:(data.sizeY - y - 1), type:t});
                } else {
                    data.block[index].type = t
                }
            }
        }
    }

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillRect(setting.map.marginX - setting.map.border, setting.map.marginY - setting.map.border, canvas.width - setting.map.marginX * 2 + setting.map.border * 2, canvas.height - setting.map.marginY * 2 + setting.map.border * 2);
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(setting.map.marginX, setting.map.marginY, canvas.width - setting.map.marginX * 2, canvas.height - setting.map.marginY * 2);
        if (symmetry) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(canvas.width / 2, setting.map.marginY, canvas.width / 2 - setting.map.marginX, canvas.height - setting.map.marginY * 2);
        }
        drawCoordinates();
        drawBlock();
        drawView();
        drawInformation();
    }

    function refresh() {
        canvas.height = canvas.width * (data.sizeY / data.sizeX);
        ctx.font = "12px '‚l‚r ƒSƒVƒbƒN'";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        wallList = new Array();
        wallList.push([0, 0, data.sizeX, 0]);
        wallList.push([0, 0, 0, data.sizeY]);
        wallList.push([data.sizeX, 0, data.sizeX, data.sizeY]);
        wallList.push([0, data.sizeY, data.sizeX, data.sizeY]);

        for (var i = 0; i < data.view.length; i ++) {
            data.view[i].area = searchCrossPoints(data.view[i]);
        }
        unitX = (canvas.width - setting.map.marginX * 2) / data.sizeX;
        unitY = (canvas.height - setting.map.marginY * 2) / data.sizeY;
    }

    function drawCoordinates() {
        ctx.fillStyle = "rgb(128, 128, 128)";
        for (var x = 0; x <= data.sizeX; x ++) {
            for (var y = 0; y <= data.sizeY; y ++) {
                ctx.beginPath();
                ctx.arc(setting.map.marginX + x * unitX, setting.map.marginY + y * unitY, 1, Math.PI * 2, false);
                ctx.fill();
                if (y == 0) {
                    ctx.fillText(x, setting.map.marginX - 3 + x * unitX, 0);
                } if (x == 0) {
                    var digitY = y < 10 ? (" " + y) : y;
                    ctx.fillText(digitY, 0, setting.map.marginY + y * unitY - 3);
                }
            }
        }
    }

    function searchCrossPoints(view) {
        var result = [];
        var resolution = 1000;
        for (var i = (view.angle[0] - view.angle[1] / 2) / 360 * resolution; i < (view.angle[0] + view.angle[1] / 2) / 360 * resolution; i ++) {
            var distX = 1000 * Math.cos(i / resolution * Math.PI * 2);
            var distY = 1000 * Math.sin(i / resolution * Math.PI * 2);

            var minLen = 100000000;
            var minCross;
            var calc = function(edge) {
                var x1 = edge[0] - view.x;
                var y1 = edge[1] - view.y;
                var x2 = edge[2] - view.x;
                var y2 = edge[3] - view.y;
                var cross1 = (distX * y1 - distY * x1) * (distX * y2 - distY * x2);
                var cross2 = (y2 * x1 - x2 * y1) * ((y2 * x1 - x2 * y1) - ((x1 - x2) * distY - (y1 - y2) * distX));
                if (cross1 <= 0 && cross2 <= 0) {
                    var x = ((y1 - y2) * x1 - (x1 - x2) * y1) / ((y1 - y2) * distX - (x1 - x2) * distY) * distX;
                    var y = ((y1 - y2) * x1 - (x1 - x2) * y1) / ((y1 - y2) * distX - (x1 - x2) * distY) * distY;
                    var len = x * x + y * y;
                    if (len > 0 && len < minLen) {
                        minLen = len;
                        minCross = [x + view.x, y + view.y];
                    }
                }
            };

            for (var j = 0; j < data.block.length; j ++) {
                var block = data.block[j];
                if (setting.block.type[block.type].level < level) {
                    continue;
                }
                calc([block.x, block.y, block.x + 1, block.y]);
                calc([block.x, block.y, block.x, block.y + 1]);
                calc([block.x + 1, block.y, block.x + 1, block.y + 1]);
                calc([block.x, block.y + 1, block.x + 1, block.y + 1]);
            }
            for (var j = 0; j < wallList.length; j ++) {
                calc(wallList[j]);
            }

            if (minCross != undefined) {
                result.push(minCross);
            }
        }
        return result;
    }

    function drawBlock() {
        for (var i = 0; i < data.block.length; i ++) {
            var x = data.block[i].x;
            var y = data.block[i].y;
            ctx.beginPath();
            ctx.fillStyle = setting.block.border.color;
            ctx.fillRect(setting.map.marginX + x * unitX, setting.map.marginY + y * unitY, unitX, unitY);
            
            ctx.fillStyle = setting.block.type[data.block[i].type].color;
            ctx.fillRect(setting.map.marginX + x * unitX + setting.block.border.size, setting.map.marginY + y * unitY + setting.block.border.size, unitX - setting.block.border.size * 2, unitY - setting.block.border.size * 2);

            ctx.fillStyle = setting.block.string.color;
            ctx.fillText(setting.block.type[data.block[i].type].name, setting.map.marginX + setting.block.border.size + x * unitX + 2, setting.map.marginY + setting.block.border.size + y * unitY + 2);
        }
 
 
    }
    function drawInformation() {
        var block = new Array();
        var blockTotal = 0;
        for (var i = 0; i < data.sizeX; i ++) {
            block[i] = 0;
        }
        for (var i = 0; i < data.block.length; i ++) {
            block[data.block[i].x] += setting.block.type[data.block[i].type].level;
            blockTotal += setting.block.type[data.block[i].type].level;
        }
        ctx.fillStyle = "rgb(192, 192, 192)";
        for (var i = 0; i < data.sizeX; i ++) {
            ctx.fillText(block[i], setting.map.marginX + unitX * (i + 0.2) , setting.map.marginY + unitY * data.sizeY + 3);
        }
        var diagonals = Math.floor(Math.sqrt(data.sizeX * data.sizeX + data.sizeY * data.sizeY) * 100) / 100;

        ctx.fillText("Diagonal = " + diagonals, setting.map.marginX + unitX * data.sizeX - 90 + 1 , setting.map.marginY + unitY * data.sizeY - 15 + 1);
        ctx.fillText("Banker = " + blockTotal, setting.map.marginX + unitX * data.sizeX - 90 + 1 , setting.map.marginY + unitY * data.sizeY - 30 + 1);

        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.fillText("Diagonal = " + diagonals, setting.map.marginX + unitX * data.sizeX - 90 , setting.map.marginY + unitY * data.sizeY - 15);
        ctx.fillText("Banker = " + blockTotal, setting.map.marginX + unitX * data.sizeX - 90 , setting.map.marginY + unitY * data.sizeY - 30);
    }

    function drawView() {
        for (var i = 0; i < data.view.length; i ++) {
            var view = data.view[i];
            if (filter[view.group] != true) {
                continue;
            }
            var x = setting.map.marginX + view.x * unitX;
            var y = setting.map.marginY + view.y * unitY
            ctx.beginPath();

            var group = setting.group[view.group];
            var grad  = ctx.createRadialGradient(x, y, group.grad.length1, x, y, group.grad.length2);
            grad.addColorStop(0, group.grad.color1);
            grad.addColorStop(1, group.grad.color2);
            ctx.fillStyle = grad;

            ctx.moveTo(setting.map.marginX + view.x * unitX, setting.map.marginY + view.y * unitY);
            for (var j = 0; j < view.area.length; j ++) {
                var x = view.area[j][0];
                var y = view.area[j][1];
                ctx.lineTo(setting.map.marginX + x * unitX, setting.map.marginY + y * unitY);
            }
            ctx.closePath();
            ctx.fill();
        }
        for (var i = 0; i < data.view.length; i ++) {
            var view = data.view[i];
            var x = setting.map.marginX + view.x * unitX;
            var y = setting.map.marginY + view.y * unitY

            var group = setting.group[view.group];
            ctx.strokeStyle = group.color;
            ctx.lineWidth = group.lineWidth;

            ctx.beginPath();
            ctx.arc(x, y, group.size, 0, Math.PI * 2);
            ctx.stroke();

            var a = view.angle[0] / 180 * Math.PI;
            var toX = group.size * Math.cos(a);
            var toY = group.size * Math.sin(a);
            ctx.beginPath();
            ctx.moveTo(x + toX, y + toY);
            ctx.lineTo(x + toX * 2, y + toY * 2);
            ctx.stroke();
            
            ctx.fillStyle = group.string.color1;
            ctx.fillText(view.name, x, y - group.size - 13);

            ctx.fillStyle = group.string.color2;
            ctx.fillText(view.name, x - 1, y - group.size - 14);
        }
    }
};

