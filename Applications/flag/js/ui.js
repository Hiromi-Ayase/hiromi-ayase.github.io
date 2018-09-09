var defaultAngle = 120;
var width = 34;
var height = 24;
var expires = 60 * 60 * 24 * 1000 * 180;

var board;
var tacticalBoardModule = angular.module('tactical-board', ['ui.bootstrap']);
tacticalBoardModule.directive('player', function($document) {
    return function(scope, element, attr) {
        var startX = 0, startY = 0;
        element.css({
            position: 'relative',
            cursor: 'pointer',
            width:'20px',
            height:'20px',
        });
        var num = attr['id']
        element.html('<img src="img/player-' + attr['player'] + '.png" title="' + attr['id'] + '"/>');

        element.on('mousedown', function(event) {
            // Prevent default dragging of selected content
            event.preventDefault();
            startX = event.screenX;
            startY = event.screenY;
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        });

        element.on('touchstart', function(event) {
            if (element.css("visibility") != "hidden") {
                event.preventDefault();
                var touch = event.touches[0];
                startX = touch.screenX;
                startY = touch.screenY;
                $document.on('touchmove', touchmove);
                $document.on('touchend', touchend);
            }
        });

        var touchX = -1;
        var touchY = -1;
        function touchmove(event) {
            if (element.css("visibility") != "hidden") {
                event.preventDefault();
                var touch = event.touches[0];
                var x = touch.screenX - startX;
                var y = touch.screenY - startY;
                element.css({
                    top: y + 'px',
                    left:  x + 'px'
                });
                touchX = touch.screenX;
                touchY = touch.screenY;
            }
        }

        function touchend(event) {
            if (element.css("visibility") != "hidden" && touchX >= 0) {
                event.preventDefault();
                $document.unbind('touchmove', touchmove);
                $document.unbind('touchstart', touchend);
                var x = touchX;
                var y = touchY;
                touchX = -1;
                touchY = -1;

                var ret = board.addView(attr['id'], x, y, attr['player']);
                if (ret == false) {
                    element.css({
                        position: 'relative',
                        top: 'auto',
                        left: 'auto'
                    });
                    
                } else {
                    element.css({
                        visibility: 'hidden',
                        position: 'relative',
                        top: 'auto',
                        left: 'auto'
                    });
                }
            }
        }

        function mousemove(event) {
            var x = event.screenX - startX;
            var y = event.screenY - startY;
            element.css({
                top: y + 'px',
                left:  x + 'px'
            });
        }

        function mouseup(event) {
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);

            var ret = board.addView(attr['id'], event.pageX, event.pageY, attr['player']);
            if (ret == false) {
                element.css({
                    position: 'relative',
                    top: 'auto',
                    left: 'auto'
                });
                
            } else {
                element.css({
                    visibility: 'hidden',
                    position: 'relative',
                    top: 'auto',
                    left: 'auto'
                });
            }
        }
    }
});

onload = function() {
    var listener = function(data, event, param) {
        if (event == "delete-view") {
            var item = document.getElementById(param.name);
            item.style.visibility = 'visible';
        } else if (event == "size-changed") {
            document.getElementById("width").value = Number(data.sizeX);
            document.getElementById("height").value = Number(data.sizeY);
        }
    };
    var canvas = document.getElementById("canvas");
    var data = {
        sizeX:width,
        sizeY:height,
        block: [
        ],
        view: [
        ],
    };

    board = new TacticsBoard(canvas, data, listener);
};

function MainController($scope, $modal, $log) {

    $scope.angle = defaultAngle;
    $scope.level = 2;
    $scope.width = width;
    $scope.height = height;
    $scope.visibleRed = true;
    $scope.visibleBlue = true;
    $scope.symmetry = true;

    $scope.changeAngle = function() {
        defaultAngle = $scope.angle;
        board.setAngle($scope.angle);
    };

    $scope.changeSize = function() {
        board.setSize($scope.width, $scope.height);
    };

    $scope.changeLevel = function() {
        board.setLevel($scope.level);
    };

    $scope.changeVisible = function() {
        board.setFilter({red:$scope.visibleRed, blue:$scope.visibleBlue});
    };

    $scope.exportToCSV = function() {
        $scope.csv = board.getData();
    };

    $scope.loadFromCSV = function() {
        if (window.confirm('Load data from the following CSV')) {
            board.setData($scope.csv);
        }
    };

    $scope.save = function() {
        if (window.confirm('Save data in your machine')) {
            var exp = new Date(new Date().getTime() + expires).toGMTString();
            document.cookie = "data=" + escape(board.getData()) + "; expires=" + exp;
        }
    };

    $scope.load = function() {
        if (window.confirm('Load data from your machine')) {
            var COOKIE = new Object();
            if (document.cookie) {
                var cookies = document.cookie.split("; ");
                for (var i = 0; i < cookies.length; i++) {
                    var str = cookies[i].split("=");
                    COOKIE[str[0]] = unescape(str[1]);
                }
                board.setData(COOKIE["data"]);
            }
        }
    };

    $scope.clear = function() {
        if (window.confirm('Clear the board\n(Or click the right button to remove each view)')) {
            var data = board.getRawData();
            for (var i = 0; i < data.view.length; i ++) {
                var item = document.getElementById(data.view[i].name);
                item.style.visibility = 'visible';
            }
            $scope.width = width;
            $scope.height = height;

            data.block = [];
            data.view = [];
            data.sizeX = width;
            data.sizeY = height;
            board.refresh();
        }
    };
    
    $scope.setSymmetryBlocks = function() {
        board.setSymmetry($scope.symmetry);
    };
    
    $scope.image = function () {
        var imageSrc = board.getImageUrl();
        var modalInstance = $modal.open({
            templateUrl: 'exportImageModal.html',
            controller: function($scope, $modalInstance) {
                $scope.imagePath = imageSrc;
                $scope.ok = function () {
                    $modalInstance.close();
                };
            }, resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        
        modalInstance.onShow = function() {
        };
    };
};




