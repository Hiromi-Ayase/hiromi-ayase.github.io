/*global ROT, tm, window*/
var game = game || {};

// ゲームUI
(function (ns) {
    ns.UI = {};
    /**
     * ゲージ描画
     * @param {Canvas} canvas  Canvas
     * @param {Number} x       x
     * @param {Number} y       y
     * @param {Number} radius1 Radius1
     * @param {Number} radius2 Radius2
     * @param {Number} ratio   Value(0 to 1)
     * @param {String} style   Fill Style
     */
    ns.UI.Guage = function (canvas, x, y, radius1, radius2, ratio, style) {
        var color1 = Math.floor(255 * (1 - ratio));
        var color2 = Math.floor(255 * ratio);

        var rad = Math.degToRad(ratio * 360);
        canvas.save();
        canvas.translate(x, y);
        canvas.fillStyle = style.format({
            color1: color1,
            color2: color2
        });
        canvas.rotate(Math.degToRad(-90));
        canvas.beginPath();
        canvas.moveTo(radius1, 0);
        canvas.arc(0, 0, radius1, 0, -rad, true);
        canvas.rotate(-rad);

        canvas.lineTo(radius2, 0);
        canvas.arc(0, 0, radius2, 0, rad, false);
        canvas.rotate(rad);
        canvas.lineTo(radius1, 0);
        canvas.closePath();
        canvas.fill();
        canvas.restore();
    };

    // 数字
    ns.UI.Digit = tm.define("game.ui.Digit", {
        superClass: "tm.display.Sprite",
        init: function (x, y) {
            this.digitWidth = 90;
            this.digitHeight = 132;
            this.superInit("digital");
            this.setFrameIndex(0, this.digitWidth, this.digitHeight);
            this.setSize(this.digitWidth, this.digitHeight);

            this.setPosition(x, y);
        },
        set: function (num) {
            this.setFrameIndex(num, this.digitWidth, this.digitHeight);
        }
    });

    // ステータスゲージ
    ns.UI.Status = tm.define("game.ui.Status", {
        superClass: "tm.display.Shape",
        init: function () {
            this.superInit();
            this.setSize(300, 250);
            this.radius = 95;
            this.magical = ns.Effect.Magical(-30, 0).addChildTo(this);
            this.alpha = 0.7;
        },
        set: function (maxHp, hp, maxUtsu, utsu, special) {
            var ratio = hp / maxHp;

            var canvas = this.canvas;
            canvas.save();
            canvas.setTransformCenter();
            canvas.clear(-this.width / 2, -this.height / 2, this.width, this.height);

            // HPグラフの表示
            ns.UI.Guage(canvas, this.magical.x, this.magical.y, 95, 80, hp / maxHp, "rgb({color1}, {color2}, 0)");
            // 鬱グラフの表示
            ns.UI.Guage(canvas, this.magical.x, this.magical.y, 80, 63, utsu / maxUtsu, "rgb({color1}, 0, {color2})");

            canvas.fillStyle = "rgba(0, 0, 0, 0/5)";
            canvas.beginPath();
            canvas.moveTo(33, 76);
            canvas.lineTo(130, 76);
            canvas.lineTo(130, 109);
            canvas.lineTo(33, 109);
            canvas.closePath();
            canvas.fill();

            canvas.textAlign = "left";
            canvas.context.font = "16px Century Gothic";
            canvas.fillStyle = "rgb(128, 255, 255)";
            canvas.fillText("HP: {hp} / {max}".format({
                hp: hp,
                max: maxHp
            }), 35, 90);
            canvas.fillText("UT: {utsu} / {max}".format({
                utsu: utsu,
                max: maxUtsu
            }), 35, 107);

            // 特殊ステータス表示
            canvas.beginPath();
            canvas.fillStyle = "rgb(0, 0, 0)";
            canvas.arc(this.magical.x, this.magical.y, 45, 0, Math.PI * 2, false);
            canvas.fill();

            if (special) {
                canvas.fillStyle = "rgb(255, 64, 64)";
            } else {
                canvas.fillStyle = "rgb(64, 255, 255)";
                special = "Fine !";
            }
            canvas.context.font = "bold 20px Century Gothic";
            canvas.textAlign = "center";
            canvas.fillText(special, this.magical.x, this.magical.y + 6);
            canvas.restore();
        },
        update: function () {}
    });

    // 時計
    ns.UI.Clock = tm.define("game.ui.Clock", {
        superClass: "tm.display.Shape",
        init: function (time) {
            this.superInit();
            this.time = time;
            var digitWidth = 90;
            var digitHeight = 132;
            var margin = 10;
            this.setScale(0.5, 0.5);
            this.setSize(digitWidth * 7, digitHeight);
            this.setPosition(ns.Setting.screenWidth - this.width * this.scaleX / 2 - margin, this.height * this.scaleY / 2 + margin);
            this.digit = [];
            this.digit[0] = ns.UI.Digit(-this.width / 2 + digitWidth * 0.5, 0).addChildTo(this);
            this.digit[1] = ns.UI.Digit(-this.width / 2 + digitWidth * 1.5, 0).addChildTo(this);
            this.digit[2] = ns.UI.Digit(-this.width / 2 + digitWidth * 3, 0).addChildTo(this);
            this.digit[3] = ns.UI.Digit(-this.width / 2 + digitWidth * 4, 0).addChildTo(this);
            this.digit[4] = ns.UI.Digit(-this.width / 2 + digitWidth * 5.5, 0).addChildTo(this);
            this.digit[5] = ns.UI.Digit(-this.width / 2 + digitWidth * 6.5, 0).addChildTo(this);

            this.colon = false;
            this.renderBackground();
            this.renderColon();
            this.update();
        },
        setTime: function (time) {
            this.time = time;
        },
        renderBackground: function () {
            this.canvas.setTransformCenter();
            this.canvas.fillStyle = "rgba(62, 62, 62, 0.5)";
            this.canvas.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        },
        renderColon: function () {
            var canvas = this.canvas;
            if (!this.colon) {
                var digitWidth = this.digit[0].width;
                canvas.save();
                canvas.fillStyle = "rgb(255, 255, 255)";

                canvas.beginPath();
                canvas.arc(-this.width / 2 + digitWidth * 2.25, -this.height * 0.25, 5, 0, Math.PI * 2, false);
                canvas.fill();
                canvas.beginPath();
                canvas.arc(-this.width / 2 + digitWidth * 2.25, this.height * 0.25, 5, 0, Math.PI * 2, false);
                canvas.fill();
                canvas.beginPath();
                canvas.arc(-this.width / 2 + digitWidth * 4.75, -this.height * 0.25, 5, 0, Math.PI * 2, false);
                canvas.fill();
                canvas.beginPath();
                canvas.arc(-this.width / 2 + digitWidth * 4.75, this.height * 0.25, 5, 0, Math.PI * 2, false);
                canvas.fill();
                canvas.restore();
                this.colon = true;
            } else {
                canvas.clear(-this.width / 2, -this.height / 2, this.width, this.height);
                this.renderBackground();
                this.colon = false;
            }
        },
        update: function () {
            for (var i = 0; i < 6; i++) {
                var char = this.time.charAt(i);
                if (!isNaN(char)) {
                    this.digit[i].set(Number(char));
                }
            }
            if (ns.Frame % (ns.Setting.fps / 2) === 0) {
                this.renderColon();
            }
        }
    });

    // メッセージエリア
    ns.UI.MessageArea = tm.define("game.ui.MessageArea", {
        superClass: "tm.display.Sprite",
        init: function (param) {

            param = param || {};
            param.wait = param.wait || ns.Setting.message.wait;
            param.displayWait = param.displayWait || ns.Setting.message.displayWait;
            this.superInit("messageWindow");
            this.fromJSON({
                wait: param.wait,
                notErase: param.notErase,
                displayWait: param.displayWait,
                x: ns.Setting.screenCenterX,
                y: ns.Setting.screenCenterY,
                width: ns.Setting.screenWidth,
                height: ns.Setting.screenHeight,
                messages: [],
                index: 0,
                tween: tm.anim.Tween(),
                nextCount: 0,
                display: 0,
                contents: tm.display.Shape(),
                label: tm.display.Label(),
                staticLabel: tm.display.Label(),
                icons: {
                    A0: tm.display.Sprite("faceicon_A0"),
                    A1: tm.display.Sprite("faceicon_A1"),
                    A2: tm.display.Sprite("faceicon_A2"),
                    B0: tm.display.Sprite("faceicon_B0"),
                    B1: tm.display.Sprite("faceicon_B1"),
                    C0: tm.display.Sprite("faceicon_C0"),
                    C1: tm.display.Sprite("faceicon_C1"),
                    D0: tm.display.Sprite("faceicon_D0"),
                    D1: tm.display.Sprite("faceicon_D1"),
                    D2: tm.display.Sprite("faceicon_D2"),
                    E0: tm.display.Sprite("faceicon_E0"),
                    E1: tm.display.Sprite("faceicon_E1"),
                    E2: tm.display.Sprite("faceicon_E2"),
                    F0: tm.display.Sprite("faceicon_F0"),
                    F1: tm.display.Sprite("faceicon_F1"),
                    F2: tm.display.Sprite("faceicon_F2"),
                    G0: tm.display.Sprite("faceicon_G0"),
                    G1: tm.display.Sprite("faceicon_G1"),
                    G2: tm.display.Sprite("faceicon_G2"),
                    H0: tm.display.Sprite("faceicon_H0"),
                    H1: tm.display.Sprite("faceicon_H1"),
                    H2: tm.display.Sprite("faceicon_H2"),
                },
                status: ns.UI.Status(),
            });

            // コンテンツエリア
            this.contents.fromJSON({
                width: ns.Setting.message.width,
                height: ns.Setting.message.height,
                x: ns.Setting.message.left,
                y: ns.Setting.message.top,
                clipping: true,
            }).addChildTo(this);

            // メッセージ本文
            this.label.fromJSON({
                fontSize: 24,
                align: "left",
                baseline: "top",
                width: ns.Setting.message.width,
            }).addChildTo(this.contents);

            // メッセージ本文
            this.staticLabel.fromJSON({
                x: ns.Setting.message.left / 2,
                y: ns.Setting.message.top,
                fontSize: 24,
                align: "left",
                baseline: "top",
            }).addChildTo(this);

            // アイコン
            for (var key in this.icons) {
                var icon = this.icons[key];
                icon.fromJSON({
                    scaleX: -1,
                    x: ns.Setting.screenCenterX - icon.width / 2,
                    y: ns.Setting.screenCenterY - icon.height / 2,
                    visible: false,
                }).addChildTo(this);
            }

            // ステータスゲージ
            this.status.fromJSON({
                x: -ns.Setting.screenCenterX + this.status.width / 2,
                y: ns.Setting.screenCenterY - this.status.height / 2,
            }).addChildTo(this);
            ns.Log = this.show.bind(this);
            ns.StaticLog = this.showStatic.bind(this);
            ns.PastLog = [];
        },

        /**
         * 顔アイコンをセット
         * @param {String} type Icon type
         */
        setFace: function (type) {
            if (type !== this.iconType) {
                for (var key in this.icons) {
                    var icon = this.icons[key];
                    icon.visible = false;
                }
                this.icons[type].visible = true;
                this.iconType = type;
            }
        },

        /**
         * メッセージの表示
         * @param {String} message メッセージ
         */
        show: function (id, param) {
            var message = ns.Message[id];
            if (typeof message === "function") {
                message = message(param);
            }
            if (message) {
                for (var key in param) {
                    if (param[key] && param[key].gameObject) {
                        param[key] = param[key].displayName;
                    }
                }
                message = message.format(param);
            } else {
                message = id;
            }
            if (message !== undefined && message !== "none") {
                this.messages.push(message);
                ns.PastLog.push(message);
                if (ns.PastLog.length > ns.Setting.message.maxLog) {
                    ns.PastLog.shift();
                }
            }
        },

        /**
         * 静的表示
         * @param {String} message メッセージ
         */
        showStatic: function (message) {
            if (message) {
                this.clear();
                this.notErase = true;
                this.messages.push(message);
            } else {
                this.clear();
            }
        },
        /**
         * メッセージがすべて出力し終わっているか
         * @returns {Boolean} True:終わっている
         */
        finished: function (num) {
            return this.messages.length <= this.index;
        },
        clear: function () {
            this.notErase = false;
            this.label.text = "";
            this.index = 0;
            this.label.y = 0;
            this.messages = [];
        },
        update: function () {
            if (this.messages.length > this.index && this.nextCount <= ns.Frame) {
                var lineHeight = 24;
                var digitList = this.messages.slice(Math.max(0, this.index - 5), this.index + 1);
                digitList.reverse();
                this.label.text = digitList.join("\n");
                this.label.setPosition(-ns.Setting.message.width / 2, -(lineHeight + 6) * 2);

                this.tween.by(this.label, {
                    y: lineHeight
                }, 199);
                this.tween.start();
                this.index++;
                this.nextCount = ns.Frame + ns.Setting.fps * this.wait;
                this.display = ns.Frame + ns.Setting.fps * this.displayWait;
            }

            if (this.display <= ns.Frame && !this.notErase) {
                this.clear();
            }
        }
    });

    ns.UI.MiniMap = tm.define("game.ui.MiniMap", {
        superClass: "tm.display.Shape",
        init: function (view, width, height) {
            this.superInit();
            var size = ns.Setting.minimap.size;
            this.fromJSON({
                name: "MiniMap",
                mapWidth: width,
                mapHeight: height,
                width: width * size,
                height: height * size,
                blocks: [],
                x: ns.Setting.minimap.left,
                y: ns.Setting.minimap.top,
            });

            var x, y;
            for (x = 0; x < width; x++) {
                for (y = 0; y < height; y++) {
                    this.blocks[x + y * width] = -1;
                }
            }
            this.updateView(view);
        },
        updateMap: function () {
            var canvas = this.canvas;
            var size = ns.Setting.minimap.size;
            var width = this.mapWidth;
            var height = this.mapHeight;
            canvas.clear(0, 0, this.width, this.height);

            var line = function (x, y, dx, dy, fromX, fromY, toX, toY) {
                x += dx;
                y += dy;
                if (0 <= x && x < width && 0 <= y && y < height && this.blocks[x + y * width] === 0) {
                    canvas.beginPath();
                    canvas.moveTo((x + fromX) * size, (y + fromY) * size);
                    canvas.lineTo((x + toX) * size, (y + toY) * size);
                    canvas.stroke();
                }
            }.bind(this);

            canvas.strokeStyle = "rgba(255, 255, 255, 0.5)";
            for (var x = 0; x < width; x++) {
                for (var y = 0; y < height; y++) {
                    if (this.blocks[x + y * width] <= 0) {
                        canvas.fillStyle = "rgba(255, 255, 255, 0)";
                        canvas.fillRect(x * size, y * size, size, size);
                    } else {
                        canvas.fillStyle = "rgba(64, 64, 255, 0.5)";
                        canvas.fillRect(x * size, y * size, size, size);

                        line(x, y, 1, 0, 0, 0, 0, 1);
                        line(x, y, -1, 0, 1, 0, 1, 1);
                        line(x, y, 0, 1, 0, 0, 1, 0);
                        line(x, y, 0, -1, 0, 1, 1, 1);
                    }
                }
            }
        },
        updateView: function (view) {
            for (var hash in view.list) {
                var coord = ns.Hash2Coord(hash);
                var index = coord.x + coord.y * this.mapWidth;
                if (view.list[hash] !== ns.BLOCK.WALL) {
                    this.blocks[index] = 1;
                } else {
                    this.blocks[index] = 0;
                }
            }
            this.updateMap();
            var size = ns.Setting.minimap.size;
            var list = view.getViewObjects();
            if (!view.getStairs() && this.stairs) {
                list.push(this.stairs);
            }
            list.forEach(function (obj) {
                if (!obj.visible) {
                    return;
                }
                var style;
                var radius;
                var canvas = this.canvas;
                if (obj.objectType === ns.Setting.object.type.character) {
                    radius = size / 3;
                    if (obj.name === "shizimily") {
                        style = "rgb(255, 255, 0)";
                    } else {
                        style = "rgb(255, 0, 0)";
                    }
                    canvas.fillStyle = style;
                    canvas.fillCircle(obj.coord.x * size + size / 2, obj.coord.y * size + size / 2, radius);
                } else {
                    radius = size / 3 * 2;
                    var margin = size / 6;
                    style = "rgb(255, 255, 255)";
                    var a = obj.coord.x * size + margin;
                    var b = obj.coord.y * size + margin;
                    if (obj.objectType === ns.Setting.object.type.stairs) {
                        this.stairs = obj;
                        canvas.fillStyle = style;
                        canvas.fillRect(a, b, radius, radius);
                        style = "rgb(64, 64, 64)";
                        radius = radius / 3 * 2;
                        canvas.fillStyle = style;
                        canvas.fillRect(a + margin / 4, b + margin / 4, radius, radius);
                    } else if (obj.objectType === ns.Setting.object.type.trap) {
                        canvas.strokeStyle = style;
                        canvas.beginPath();
                        canvas.moveTo(a, b);
                        canvas.lineTo(a + radius, b + radius);
                        canvas.stroke();
                        canvas.beginPath();
                        canvas.moveTo(a + radius, b);
                        canvas.lineTo(a, b + radius);
                        canvas.stroke();
                    } else {
                        canvas.fillStyle = style;
                        canvas.fillRect(a, b, radius, radius);
                    }
                }
            }, this);
        }
    });

    // 階数表示
    ns.UI.FloorDigit = tm.define("game.ui.FloorDigit", {
        superClass: "tm.display.Shape",
        init: function (floor, name) {
            this.superInit();
            var digitWidth = 90;
            var digitHeight = 132;
            var margin = 10;
            this.setScale(0.5, 0.5);
            this.setSize(digitWidth * 3 + 100, digitHeight + 80);
            this.setPosition(this.width * this.scaleX / 2 + margin, this.height * this.scaleY / 2 + margin);
            this.digit = [];
            this.digit[0] = ns.UI.Digit(-this.width / 2 + digitWidth * 0.5, -40).addChildTo(this);
            this.digit[1] = ns.UI.Digit(-this.width / 2 + digitWidth * 1.5, -40).addChildTo(this);

            this.renderBackground();
            this.renderName(name);
            this.setFloor(String(floor));
        },
        setFloor: function (floor) {
            if (floor < 10) {
                floor = "0" + floor;
            }
            for (var i = 0; i < 2; i++) {
                var char = floor.charAt(i);
                if (!isNaN(char)) {
                    this.digit[i].set(Number(char));
                }
            }
        },
        renderName: function (name) {
            var canvas = this.canvas;
            canvas.strokeStyle = "rgb(255, 255, 255)";
            canvas.fillStyle = "rgb(255, 255, 255)";
            canvas.context.font = "50px Century Gothic";
            canvas.textAlign = "center";
            canvas.fillText(name, 0, 85);
        },
        renderBackground: function () {
            var canvas = this.canvas;
            canvas.setTransformCenter();
            canvas.fillStyle = "rgba(62, 62, 62, 0.5)";
            canvas.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

            canvas.strokeStyle = "rgb(255, 255, 255)";
            canvas.fillStyle = "rgb(255, 255, 255)";
            canvas.context.font = "100px Century Gothic";
            canvas.fillText("F", 60, 20);
        },
    });

    ns.UI.Debug = tm.define("game.ui.DebugLabel", {
        superClass: "tm.display.Shape",
        init: function (obj, text) {
            if (ns.Debug) {
                this.superInit();
                text = text || obj.displayName;
                this.label = tm.display.Label(text).fromJSON({
                    fillStyle: "white",
                    fontSize: 16
                }).addChildTo(this);
                this.addChildTo(obj);
            }
        },
        update: function () {
            this.fromJSON({
                width: this.label.textSize * this.label.text.length,
                height: 20,
            });
            var canvas = this.canvas;
            canvas.clearColor("rgba(0, 0, 0, 0.5)");
        }
    });

    ns.UI.Controller = function (scene) {
        if (ns.Controller) {
            var alpha = 0.4;
            ns.Controller.pad.fromJSON({
                x: ns.Setting.screenWidth - 110,
                y: ns.Setting.screenHeight / 2,
                alpha: alpha,
            }).addChildTo(scene);

            ["z", "x"].forEach(function (c, index) {
                ns.Controller[c].fromJSON({
                    x: 60 + 110 * index,
                    y: ns.Setting.screenHeight / 2 + 60,
                    alpha: alpha
                }).addChildTo(scene);
            });
            ["c", "v"].forEach(function (c, index) {
                ns.Controller[c].fromJSON({
                    x: 60 + 110 * index,
                    y: ns.Setting.screenHeight / 2 - 60,
                    alpha: alpha
                }).addChildTo(scene);
            });
        }
    };

    ns.UI.Twitter = function (scene, stage, shizimily) {
        var time = ns.Util.turn2date(shizimily.turn); 
        
        var text, title, fillStyle;
        if (!shizimily.dead) {
            title = "Twitterで帰宅報告をする";
            text = "しじみりちゃんは{stage}から{hour}:{min}:{sec}に帰れました！ (社畜力:{atk} 残業回避力:{def})";
            fillStyle = "rgb(0, 0, 0)";
        } else {
            title = "Twitterで残業報告をする";
            text = "しじみりちゃんは{stage}から帰れませんでした・・・(社畜力:{atk} 残業回避力:{def})";
            fillStyle = "rgb(64, 64, 64)";
        }

        text = text.format({
            stage: stage.displayName,
            hour: time.substring(0, 2),
            min: time.substring(2, 4),
            sec: time.substring(4, 6),
            atk: shizimily.getAtk(),
            def: shizimily.getDef(),
        });
        var twitterURL = tm.social.Twitter.createURL({
            type    : "tweet",
            text    : text,
            url     : ns.Setting.url,
            hashtags: "ShizimilyRogue",
        });
        var button = tm.ui.FlatButton({
            width: 270,
            height: 60,
            text: title,
            fillStyle: fillStyle,
            fontSize: 20,
        }).addChildTo(scene).fromJSON({
            x: 150,
            y: 40,
            alpha: 0.5,
        });
        button.onclick = function() {
            window.open(twitterURL, 'share window', 'width=600, height=300');
        };
    };
}(game));