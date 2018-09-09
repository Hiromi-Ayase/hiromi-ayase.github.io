var FILL_SIZE = 0.4;
var ANGLE_MARGIN = 0.1;
var DISTANCE_MARGIN = 50;
var PI = 3.14159265358979;
var CLUSTER_NAME = "pieceCluster";
var PUZZLE_NAME = "puzzle";
var PIECE_SIZE = 50;
var PIECE_DISTANCE = 50;
var PUZZLE_SIZE = 1.5;
var MAX_IMAGE_SIZE = 1000;

var workCanvas = document.createElement("canvas");

$(function() {
	window.addEventListener('dragover', function(event) {
		event.preventDefault();
	}, false);

	window.addEventListener('drop', function(event) {
		event.preventDefault();
		var file = event.dataTransfer.files[0];
		if (!file.type.match(/image\/\w+/)) {
			alert('画像ファイル以外は利用できません');
			return;
		}

		$("#message").text("よみこみ中...");
		$("." + CLUSTER_NAME).remove();

		var reader = new FileReader();
		var img = new Image();
		reader.onload = function() {
			img.src = reader.result;
		};
		img.onload = function() {

			var clusterArray = new Array();
			var width = 0;
			var height = 0;
			var ratio = 1;
			if (img.width > img.height) {
				if (img.height > MAX_IMAGE_SIZE) {
					ratio = MAX_IMAGE_SIZE / img.width;
					PIECE_SIZE = 100;
				} else {
					PIECE_SIZE = Math.floor(100 * img.width / MAX_IMAGE_SIZE);
				}
			} else {
				if (img.height > MAX_IMAGE_SIZE) {
					ratio = MAX_IMAGE_SIZE / img.height;
					PIECE_SIZE = 100;
				} else {
					PIECE_SIZE = Math.floor(100 * img.height / MAX_IMAGE_SIZE);
				}
			}
			PIECE_DISTANCE = Math.floor(PIECE_SIZE * 1.4);
			if (ratio < 0.5) {
				alert("画象が大きすぎます");
				$("#message").text("");
				return;
			}
			width = img.width * ratio;
			height = img.height * ratio;
			workCanvas.width = width;
			workCanvas.height = height;
			
			$("#" + PUZZLE_NAME).css("width", width * PUZZLE_SIZE);
			$("#" + PUZZLE_NAME).css("height", height * PUZZLE_SIZE);

			for (var m = 1; PIECE_SIZE + m * PIECE_DISTANCE < width; m ++) {
				for (var n = 1; PIECE_SIZE + n * PIECE_DISTANCE < height; n ++) {
					var array = new Array();
					array.push(new piece(m, n));
					var x = Math.floor(Math.random() * width) - m * PIECE_DISTANCE + PIECE_SIZE + $("#" + PUZZLE_NAME).offset().left;
					var y = Math.floor(Math.random() * height) - n * PIECE_DISTANCE + PIECE_SIZE + $("#" + PUZZLE_NAME).offset().top;
					var angle = PI / 6 * Math.floor(Math.random() * 6);
					var cluster = new pieceCluster(array, x, y, angle, img);
					clusterArray.push(cluster);
				}
			}
			clusterManager(clusterArray, width, height);
			$("#message").text("");
		};
		reader.onerror = function(e) {
			alert("読み込み失敗ですう");
		};
		reader.readAsDataURL(file);
	}, false);
	
});

function clusterManager(clusterList, width, height) {
	var clusterHash = {};
	var imageHash = {};
	var idList = new Array();
	var size = 0;
	var dragging = false;

	for ( var i = 0; i < clusterList.length; i++) {
		setCluster(clusterList[i]);
	}

	function setCluster(cluster) {
		var id = cluster.id;
		var image = new Image();
		clusterHash[id] = cluster;
		image.id = id;
		image.className = CLUSTER_NAME;
		$("#" + PUZZLE_NAME).append(image);
		imageHash[id] = image;
		$("#" + id).css("left", cluster.x);
		$("#" + id).css("top", cluster.y);
		idList.push(id);
		size ++;

		$("#" + id).draggable({
			start : function(e) {
				var image = $(e.target);
				image.css("z-index", 100);
				var cluster = clusterHash[image.attr("id")];
				if (cluster.isClickable(e.pageX, e.pageY)) {
					dragging = true;
					return true;
				}
				return false;
			},
			drag : function(e) {
				var image = $(e.target);
				var cluster = clusterHash[image.attr("id")];
				cluster.move(image.context.offsetLeft, image.context.offsetTop);
			},
			stop : function(e) {
				dragging = false;
				var image = $(e.target);
				var id = image.attr("id");
				var cluster = clusterHash[id];
				var cX = cluster.centerX + cluster.x - $("#" + PUZZLE_NAME).offset().left;
				var cY = cluster.centerY + cluster.y - $("#" + PUZZLE_NAME).offset().top;
				var autoMove = false;
				if (cX <= 0) {
					image.css("left", (-cluster.centerX + $("#" + PUZZLE_NAME).offset().left + 10) + "px");
					autoMove = true;
				}
				if (cX >= width * PUZZLE_SIZE) {
					image.css("left", (width * PUZZLE_SIZE + $("#" + PUZZLE_NAME).offset().left - cluster.centerX - 10) + "px");
					autoMove = true;
				}
				if (cY <= 0) {
					image.css("top", (-cluster.centerY + $("#" + PUZZLE_NAME).offset().top + 10) + "px");
					autoMove = true;
				}
				if (cY >= height * PUZZLE_SIZE) {
					image.css("top", (height * PUZZLE_SIZE - cluster.centerY + $("#" + PUZZLE_NAME).offset().top - 10) + "px");
					autoMove = true;
				}
				cluster.move(image.context.offsetLeft, image.context.offsetTop);

				if (autoMove == false) {
					var id2 = checkJoinable(id);
					if (id2 != null) {
						refresh(id2);
					}
				}
			}
		});
		$("#" + id).mousemove(function(e) {
			if (!dragging) {
				var id = $(e.target).attr("id");
				var cluster = clusterHash[id];
				if (cluster.isClickable(e.pageX, e.pageY)) {
					return;
				} else {
					for ( var i = 0; i < size; i++) {
						if (clusterHash[idList[i]].isClickable(e.pageX, e.pageY)) {
							$("#" + idList[i]).css("z-index", 100);
							$("#" + id).css("z-index", 0);
							break;
						}
					}
				}
			}
		}).mousewheel(function(e, delta) {
			var id = $(e.target).attr("id");
			var cluster = clusterHash[id];
			if (cluster.isClickable(e.pageX, e.pageY)) {
				if (delta > 0)
					cluster.rotate(-PI / 6);
				else if (delta < 0)
					cluster.rotate(PI / 6);
				refresh(id);
				return false;
			}
		});
	}

	function removeCluster(id) {
		$("#" + id).remove();
		delete clusterHash[id];
		delete imageHash[id];
		for (i = 0; i < size; i++) {
			if (idList[i] == id) {
				idList.splice(i, 1);
			}
		}
		size --;
	}

	function checkJoinable(id) {
		var cluster = clusterHash[id];
		var ret = null;
		for ( var i = 0; i < size; i++) {
			var id2 = idList[i];
			if (id2 == id) {
				continue;
			}
			var c = clusterHash[id2];
			if (cluster.isJoinable(c)) {
				var newCluster = cluster.join(c);
				removeCluster(id);
				removeCluster(id2);
				setCluster(newCluster);
				ret = newCluster.id;
				break;
			}
		}
		if (idList.length == 1) {
			$("#message").text("Congraturation!");
		}
		return ret;
	}

	function refresh(id) {
		var context = workCanvas.getContext("2d");
		context.putImageData(clusterHash[id].imageData, 0, 0);
		imageHash[id].src = workCanvas.toDataURL();
	}
	for ( var i = 0; i < size; i++) {
		refresh(idList[i]);
	}
}

function pieceCluster(pieceList, x, y, angle, image) {
	this.pieceList = pieceList;
	this.image = image;

	var centerPos = getCenter(pieceList);
	var centerX = centerPos[0];
	var centerY = centerPos[1];

	this.centerX = centerX;
	this.centerY = centerY;

	this.angle = angle;
	this.x = x;
	this.y = y;
	this.imageData = getImageData(this.pieceList, this.image, this.angle);
	this.id = getId();

	function getId() {
		function G() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16)
					.substring(1);
		}
		var guid = (G() + G() + "-" + G() + "-" + G() + "-" + G() + "-" + G()
				+ G() + G()).toUpperCase();
		return guid;
	}

	this.move = function(x, y) {
		this.x = x;
		this.y = y;
	};

	this.rotate = function(diffAngle) {
		if (this.pieceList.length >= 2) {
			return;
		}
		this.angle += diffAngle;
		if (this.angle >= 2 * PI) {
			this.angle -= 2 * PI;
		}
		this.imageData = getImageData(this.pieceList, this.image, this.angle);
	};

	function getCenter(pieceList) {
		var centerX = 0;
		var centerY = 0;
		for ( var i = 0; i < pieceList.length; i++) {
			centerX += pieceList[i].x;
			centerY += pieceList[i].y;
		}
		centerX /= pieceList.length;
		centerY /= pieceList.length;
		return [ centerX, centerY ];
	}

	function getImageData(pieceList, image, angle) {
		var context = workCanvas.getContext("2d");
		context.save();
		context.translate(centerX, centerY);
		context.rotate(angle);
		context.translate(-centerX, -centerY);
		var ratio = 1;
		if (image.width > image.height) {
			if (image.width > MAX_IMAGE_SIZE) {
				ratio = MAX_IMAGE_SIZE / image.width;
			}
		} else {
			if (image.height > MAX_IMAGE_SIZE) {
				ratio = MAX_IMAGE_SIZE / image.height;
			}
		}
		context.drawImage(image, 0, 0, image.width * ratio, image.height * ratio);
		context.restore();

		var imageData = context.getImageData(0, 0, image.width, image.height);

		// initialize alpha
		for ( var i = 3; i < imageData.data.length; i += 4) {
			imageData.data[i] = 0;
		}

		// point image
		for ( var i = 0; i < pieceList.length; i++) {
			var piece = pieceList[i];
			var x = piece.x - centerX;
			var y = piece.y - centerY;
			var relativeX = Math.floor(x * Math.cos(angle) + -y
					* Math.sin(angle) + centerX);
			var relativeY = Math.floor(x * Math.sin(angle) + y
					* Math.cos(angle) + centerY);
			for ( var y = relativeY - PIECE_SIZE; y < relativeY + PIECE_SIZE; y++) {
				for ( var x = relativeX - PIECE_SIZE; x < relativeX
						+ PIECE_SIZE; x++) {
					var len = getDistance(relativeX, relativeY, x, y);
					setAlpha(imageData, x, y, len);
				}
			}
		}
		return imageData;
	}
	;

	this.join = function(cluster) {
		var list = new Array();
		for ( var i = 0; i < this.pieceList.length; i++) {
			list[i] = this.pieceList[i];
		}
		var len = list.length;
		for ( var i = 0; i < cluster.pieceList.length; i++) {
			list[len + i] = cluster.pieceList[i];
		}
		var newCluster = new pieceCluster(list, this.x, this.y, 0,
				this.image);
		return newCluster;
	};

	this.isClickable = function(x, y) {
		x -= this.centerX + this.x;
		y -= this.centerY + this.y;
		var relativeX = x * Math.cos(this.angle) + y * Math.sin(this.angle)
				+ this.centerX;
		var relativeY = -x * Math.sin(this.angle) + y * Math.cos(this.angle)
				+ this.centerY;

		// from point
		for ( var i = 0; i < this.pieceList.length; i++) {
			var px = this.pieceList[i].x;
			var py = this.pieceList[i].y;
			if (getDistance(relativeX, relativeY, px, py) < PIECE_SIZE) {
				return true;
			}
		}

		return false;
	};

	this.isJoinable = function(cluster) {
		// check angle
		if (Math.abs(this.angle - cluster.angle) > ANGLE_MARGIN
				&& Math.abs(this.angle - cluster.angle) < 2 * PI - ANGLE_MARGIN) {
			return false;
		}
		// check next piece
		var diffM = [ 1, -1, 0, 0 ];
		var diffN = [ 0, 0, 1, -1 ];
		var diffX = [ Math.cos(this.angle), -Math.cos(this.angle),
				-Math.sin(this.angle), Math.sin(this.angle) ];
		var diffY = [ Math.sin(this.angle), -Math.sin(this.angle),
				Math.cos(this.angle), -Math.cos(this.angle) ];

		for ( var i = 0; i < this.pieceList.length; i++) {
			var piece1 = this.pieceList[i];
			for ( var j = 0; j < cluster.pieceList.length; j++) {
				var piece2 = cluster.pieceList[j];

				for ( var k = 0; k < 4; k++) {
					if (piece2.m == piece1.m + diffM[k]
							&& piece2.n == piece1.n + diffN[k]) {
						var x1 = (piece1.x - this.centerX)
								* Math.cos(this.angle)
								- (piece1.y - this.centerY)
								* Math.sin(this.angle) + this.centerX + this.x;
						var y1 = (piece1.x - this.centerX)
								* Math.sin(this.angle)
								+ (piece1.y - this.centerY)
								* Math.cos(this.angle) + this.centerY + this.y;
						var x2 = (piece2.x - cluster.centerX)
								* Math.cos(this.angle)
								- (piece2.y - cluster.centerY)
								* Math.sin(this.angle) + cluster.centerX + cluster.x;
						var y2 = (piece2.x - cluster.centerX)
								* Math.sin(this.angle)
								+ (piece2.y - cluster.centerY)
								* Math.cos(this.angle) + cluster.centerY + cluster.y;

						var vX = x1 + diffX[k] * PIECE_DISTANCE;
						var vY = y1 + diffY[k] * PIECE_DISTANCE;
						if (getDistance(vX, vY, x2, y2) < DISTANCE_MARGIN) {
							return true;
						}
					}
				}
			}
		}
		return false;
	};

	function setAlpha(imageData, x, y, len) {
		var width = imageData.width;
		var i = (y * width + x) * 4 + 3;
		var lengthRate = 1 - len / PIECE_SIZE;
		lengthRate = lengthRate < FILL_SIZE ? lengthRate / FILL_SIZE : 1;
		var newAlpha = lengthRate < 0 ? 0 : lengthRate * 256;
		imageData.data[i] += newAlpha;
	}
}

/**
 * Piece prototype
 * 
 * @param m
 *            horizontal index
 * @param n
 *            vertical index
 * @returns {piece}
 */
function piece(m, n) {
	this.m = m;
	this.n = n;
	this.x = PIECE_DISTANCE * m;
	this.y = PIECE_DISTANCE * n;
}

/**
 * Calculate the distance between 2 point
 * 
 * @param x1
 *            point1 x
 * @param y1
 *            point1 y
 * @param x2
 *            point2 x
 * @param y2
 *            point2 y
 * @returns distance
 */
function getDistance(x1, y1, x2, y2) {
	return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
