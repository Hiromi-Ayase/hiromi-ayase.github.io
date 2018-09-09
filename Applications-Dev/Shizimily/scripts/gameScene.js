var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (_View) {
        // セルのサイズ
        var OBJECT_WIDTH = 64;
        var OBJECT_HEIGHT = 64;

        // メニューオープン時のキーロック開放処理フレーム数
        var KEY_LOCK_RELEASE = 10;

        (function (MenuType) {
            MenuType[MenuType["Main"] = 0] = "Main";
            MenuType[MenuType["Item"] = 1] = "Item";
            MenuType[MenuType["Use"] = 2] = "Use";
        })(_View.MenuType || (_View.MenuType = {}));
        var MenuType = _View.MenuType;

        var GameSceneData = (function () {
            function GameSceneData(player, width, height, objects, getTable) {
                this.player = player;
                this.width = width;
                this.height = height;
                this.objects = objects;
                this.getTable = getTable;
            }
            return GameSceneData;
        })();
        _View.GameSceneData = GameSceneData;

        var GameScene = (function (_super) {
            __extends(GameScene, _super);
            function GameScene(data, fov) {
                _super.call(this);
                this.data = data;
                this.animateSpeed = 10;

                this.message = new Message();
                this.pathShadow = GameScene.getPathShadow();
                this.view = new View(data, fov);
                this.playerHp = new PlayerHp();
                this.clock = new Clock();
                this.menuGroup = new enchant.Group();
                this.miniMap = new MiniMap(fov.width, fov.height);

                this.addChild(this.view);
                this.addChild(this.pathShadow);
                this.addChild(this.playerHp);
                this.addChild(this.clock);
                this.addChild(this.message);
                this.addChild(this.miniMap);
                this.addChild(this.menuGroup);

                this.addMenuKeyHandler();
                this.update(fov, [], 0);
            }
            GameScene.prototype.addMenuKeyHandler = function () {
                var _this = this;
                _View.Scene.game.addEventListener(enchant.Event.UP_BUTTON_UP, function (event) {
                    if (_this.menuGroup.childNodes.length > 0) {
                        var menu = _this.menuGroup.lastChild;
                        menu.up();
                    }
                });
                _View.Scene.game.addEventListener(enchant.Event.DOWN_BUTTON_UP, function (event) {
                    if (_this.menuGroup.childNodes.length > 0) {
                        var menu = _this.menuGroup.lastChild;
                        menu.down();
                    }
                });
                _View.Scene.game.addEventListener(enchant.Event.A_BUTTON_DOWN, function (event) {
                    if (_this.menuGroup.childNodes.length > 0) {
                        var menu = _this.menuGroup.lastChild;
                        menu.select();
                    }
                });
                _View.Scene.game.addEventListener(enchant.Event.B_BUTTON_DOWN, function (event) {
                    if (_this.menuGroup.childNodes.length > 0) {
                        _this.menuGroup.removeChild(_this.menuGroup.lastChild);
                        if (_this.menuGroup.childNodes.length == 0)
                            _this.tl.delay(KEY_LOCK_RELEASE).then(function () {
                                return _View.Scene.keyLock = false;
                            });
                    }
                });
            };

            GameScene.getPathShadow = function () {
                var map = [];

                var x = Math.floor(_View.VIEW_WIDTH / OBJECT_WIDTH / 2);
                var y = Math.floor(_View.VIEW_HEIGHT / OBJECT_HEIGHT / 2) + 1;
                map.push(new ShizimilyRogue.Common.Coord(x + 1, y - 1));
                map.push(new ShizimilyRogue.Common.Coord(x + 1, y));
                map.push(new ShizimilyRogue.Common.Coord(x + 1, y + 1));
                map.push(new ShizimilyRogue.Common.Coord(x, y - 1));
                map.push(new ShizimilyRogue.Common.Coord(x, y));
                map.push(new ShizimilyRogue.Common.Coord(x, y + 1));
                map.push(new ShizimilyRogue.Common.Coord(x - 1, y - 1));
                map.push(new ShizimilyRogue.Common.Coord(x - 1, y));
                map.push(new ShizimilyRogue.Common.Coord(x - 1, y + 1));
                var pathShadow = new Shadow(_View.VIEW_WIDTH / OBJECT_WIDTH + 2, _View.VIEW_HEIGHT / OBJECT_HEIGHT + 2);

                pathShadow.x = 0;
                pathShadow.y = -OBJECT_HEIGHT / 3;

                pathShadow.update(map);
                return pathShadow;
            };

            GameScene.prototype.showMenu = function (type, data, selectHandler, multiple) {
                if (typeof multiple === "undefined") { multiple = false; }
                _View.Scene.keyLock = true;
                if (type == 0 /* Main */) {
                    var menu = Menu.Main(data, selectHandler, multiple);
                    this.menuGroup.addChild(menu);
                } else if (type == 1 /* Item */) {
                    var menu = Menu.Item(data, selectHandler, multiple);
                    this.menuGroup.addChild(menu);
                } else if (type == 2 /* Use */) {
                    var menu = Menu.Use(data, selectHandler, multiple);
                    this.menuGroup.addChild(menu);
                }
            };

            GameScene.prototype.closeMenu = function () {
                while (true) {
                    this.menuGroup.removeChild(this.menuGroup.lastChild);
                    if (this.menuGroup.childNodes.length == 0) {
                        break;
                    }
                    this.tl.delay(KEY_LOCK_RELEASE).then(function () {
                        return _View.Scene.keyLock = false;
                    });
                }
            };

            GameScene.prototype.update = function (fov, results, speed) {
                var player = this.data.player;

                // 視界の表示
                this.pathShadow.visible = fov.getCell(player.coord).isPath();

                // プレイヤーHPの表示
                this.playerHp.show(player.hp, player.maxHp, player.stomach);

                // 時間の表示
                this.clock.show(player.turn);
                this.message.show(results, speed);
                this.view.update(fov, results, speed);
                this.miniMap.update(fov);
            };
            return GameScene;
        })(_View.Scene);
        _View.GameScene = GameScene;

        var MiniMap = (function (_super) {
            __extends(MiniMap, _super);
            function MiniMap(w, h) {
                _super.call(this);
                this.w = w;
                this.h = h;
                this.groundMap = new enchant.Map(MiniMap.SIZE, MiniMap.SIZE);
                this.floorMap = new enchant.Map(MiniMap.SIZE, MiniMap.SIZE);
                this.floorData = new Array(h);
                this.groundData = new Array(h);
                for (var y = 0; y < h; y++) {
                    this.floorData[y] = new Array(w);
                    this.groundData[y] = new Array(w);
                    for (var x = 0; x < w; x++) {
                        this.floorData[y][x] = MiniMap.BLOCK_OHTER;
                        this.groundData[y][x] = MiniMap.BLOCK_OHTER;
                    }
                }
                this.x = MiniMap.X;
                this.y = MiniMap.Y;
                this.groundMap.image = _View.Scene.IMAGE.MINI_MAP.DATA;
                this.floorMap.image = _View.Scene.IMAGE.MINI_MAP.DATA;
                this.groundMap.opacity = MiniMap.ALPHA;
                this.floorMap.opacity = MiniMap.ALPHA;
                this.addChild(this.floorMap);
                this.addChild(this.groundMap);
            }
            MiniMap.prototype.update = function (fov) {
                var _this = this;
                for (var y = 0; y < this.h; y++) {
                    for (var x = 0; x < this.w; x++) {
                        this.groundData[y][x] = MiniMap.BLOCK_OHTER;
                    }
                }

                fov.area.forEach(function (coord) {
                    var obj = fov.getCell(coord);
                    if (obj.isPlayer()) {
                        _this.groundData[coord.y][coord.x] = MiniMap.BLOCK_PLAYER;
                    } else if (obj.isUnit()) {
                        _this.groundData[coord.y][coord.x] = MiniMap.BLOCK_UNIT;
                    } else if (obj.isItem()) {
                        _this.groundData[coord.y][coord.x] = MiniMap.BLOCK_ITEM;
                    }
                    if (!obj.isWall()) {
                        var x = coord.x;
                        var y = coord.y;

                        var p = 0;
                        p |= fov.getCellByCoord(x - 1, y).isWall() ? (1 << 0) : 0;
                        p |= fov.getCellByCoord(x, y + 1).isWall() ? (1 << 1) : 0;
                        p |= fov.getCellByCoord(x + 1, y).isWall() ? (1 << 2) : 0;
                        p |= fov.getCellByCoord(x, y - 1).isWall() ? (1 << 3) : 0;
                        _this.floorData[coord.y][coord.x] = MiniMap.FLOOR_TABLE[p];
                    }
                });
                this.floorMap.loadData(this.floorData);
                this.groundMap.loadData(this.groundData);
            };
            MiniMap.BLOCK_UNIT = 16;
            MiniMap.BLOCK_PLAYER = 19;
            MiniMap.BLOCK_ITEM = 18;
            MiniMap.BLOCK_OHTER = 15;
            MiniMap.X = 200;
            MiniMap.Y = 100;
            MiniMap.ALPHA = 0.7;
            MiniMap.SIZE = 8;
            MiniMap.FLOOR_TABLE = [6, 5, 11, 10, 7, 4, 12, 13, 1, 0, 3, 8, 2, 15, 9];
            return MiniMap;
        })(enchant.Group);

        var Message = (function (_super) {
            __extends(Message, _super);
            function Message() {
                _super.call(this);
                this.messageArea = new enchant.Sprite(_View.VIEW_WIDTH, _View.VIEW_HEIGHT);
                this.messageArea.image = _View.Scene.IMAGE.MESSAGE.DATA;
                this.messageArea.opacity = Message.MESSAGE_AREA_OPACITY;
                this.icon = new enchant.Sprite(_View.VIEW_WIDTH, _View.VIEW_HEIGHT);
                this.icon.image = _View.Scene.IMAGE.MESSAGE_ICON.DATA;

                this.messageGroup = new enchant.Group();
                this.addChild(this.messageArea);
                this.addChild(this.icon);
                this.addChild(this.messageGroup);
            }
            Message.prototype.show = function (results, speed) {
                var messages = [];
                results.forEach(function (result) {
                    var m = _View.Data.Message[result.action.type];
                    if (m != undefined) {
                        var str = m(result);
                        str = str.replace(/\{([^\}]+)\}/g, function (tag, key, offset, s) {
                            var x = result;
                            key.split(".").forEach(function (elem) {
                                var index = -1;
                                if (elem.match(/(.*)\[([^\]])+\]$/)) {
                                    elem = RegExp.$1;
                                    index = Number(RegExp.$2);
                                }
                                x = elem in x ? x[elem] : "";
                                if (index >= 0) {
                                    x = x instanceof Array && index < x.length ? x[index] : "";
                                }
                                if (x == "") {
                                    return x;
                                }
                            });
                            return x;
                        });
                        messages.push(str);
                    }
                });
                this.setMessage(messages, speed);
            };

            Message.prototype.setMessage = function (messageList, speed) {
                this.removeChild(this.messageGroup);
                var messageGroup = new enchant.Group();
                messageGroup.x = Message.MESSAGE_LEFT;
                messageGroup.y = Message.MESSAGE_TOP;
                this.messageGroup = messageGroup;
                var tl = this.messageGroup.tl;

                var firstWait = speed * 3;
                var upSpeed = speed * 0.8;

                for (var i = 0; i < messageList.length; i++) {
                    var label = new enchant.Label();
                    label = new enchant.Label();
                    label.y = i * Message.MESSAGE_HEIGHT;
                    label.font = "16px cursive";
                    label.color = "white";
                    label.width = Message.MESSAGE_WIDTH;
                    label.text = " " + messageList[i];
                    label.visible = false;
                    messageGroup.addChild(label);

                    if (i > 2) {
                        tl = tl.delay(i == 3 ? firstWait : upSpeed).then(function () {
                            messageGroup.removeChild(messageGroup.firstChild);
                        }).moveBy(0, -Message.MESSAGE_HEIGHT, upSpeed).then(function (e) {
                            messageGroup.childNodes[2].visible = true;
                        }).delay(upSpeed).then(function () {
                        });
                    } else {
                        label.visible = true;
                    }
                }
                this.addChild(this.messageGroup);
            };

            Object.defineProperty(Message.prototype, "visible", {
                set: function (flg) {
                    this.messageArea.visible = flg;
                    this.icon.visible = flg;
                    this.messageGroup.childNodes.forEach(function (node) {
                        return node.visible = flg;
                    });
                },
                enumerable: true,
                configurable: true
            });
            Message.MESSAGE_TOP = 405;
            Message.MESSAGE_LEFT = 255;
            Message.MESSAGE_WIDTH = _View.VIEW_WIDTH - Message.MESSAGE_LEFT;
            Message.MESSAGE_HEIGHT = 20;
            Message.MESSAGE_AREA_OPACITY = 0.8;
            return Message;
        })(enchant.Group);

        var PlayerHp = (function (_super) {
            __extends(PlayerHp, _super);
            function PlayerHp() {
                _super.call(this);
                this.hpText = new enchant.Label();
                this.hpText.x = PlayerHp.PLAYERHP_LEFT;
                this.hpText.y = PlayerHp.PLAYERHP_TOP;
                this.hpText.font = "24px cursive";
                this.hpText.color = "red";

                //this.hpText.width = PlayerHp.PLAYERHP_WIDTH;
                //this.hpText.height = PlayerHp.PLAYERHP_HEIGHT;
                this.addChild(this.hpText);
            }
            PlayerHp.prototype.show = function (hp, maxHp, stomach) {
                this.hpText.text = hp + " / " + maxHp + " (" + stomach + ")";
            };

            Object.defineProperty(PlayerHp.prototype, "visible", {
                set: function (flg) {
                    this.hpText.visible = flg;
                },
                enumerable: true,
                configurable: true
            });
            PlayerHp.PLAYERHP_TOP = 10;
            PlayerHp.PLAYERHP_LEFT = 255;
            return PlayerHp;
        })(enchant.Group);

        var Clock = (function (_super) {
            __extends(Clock, _super);
            function Clock() {
                _super.call(this);
                this.clockText = new enchant.Label();
                this.clockText.x = Clock.CLOCK_LEFT;
                this.clockText.y = Clock.CLOCK_TOP;
                this.clockText.font = "24px cursive";
                this.clockText.color = "red";

                this.addChild(this.clockText);
            }
            Clock.prototype.show = function (turn) {
                var second = turn % 60;
                var hour = (turn - second) / 60 + 17;
                this.clockText.text = hour + " : " + (second < 10 ? "0" + String(second) : String(second));
            };

            Object.defineProperty(Clock.prototype, "visible", {
                set: function (flg) {
                    this.clockText.visible = flg;
                },
                enumerable: true,
                configurable: true
            });
            Clock.CLOCK_TOP = 10;
            Clock.CLOCK_LEFT = 550;
            return Clock;
        })(enchant.Group);

        var View = (function (_super) {
            __extends(View, _super);
            function View(data, fov) {
                _super.call(this);
                this.data = data;
                this.objects = [];
                this.roomShadow = new Shadow(data.width, data.height);
                this.floorMap = Map.floor(data.width, data.height, data.getTable);
                this.groundMap = Map.ground(data.width, data.height, data.getTable);
                this.layer = new Array(5 /* MAX */);

                this.addChild(this.floorMap);
                this.addChild(this.groundMap);
                for (var i = 1 /* Ground */; i < 5 /* MAX */; i++) {
                    this.layer[i] = new enchant.Group();
                    this.addChild(this.layer[i]);
                }
                this.addChild(this.roomShadow);

                this.update(fov, [], 0);
            }
            View.prototype.update = function (fov, results, speed) {
                this.updateShadow(fov);
                this.updateObjects(fov, results, speed);
                this.moveCamera(speed);
            };

            View.prototype.updateObjects = function (fov, results, speed) {
                var _this = this;
                // 見えているIDを取得
                var visible = {};
                var index = {};
                fov.objects.forEach(function (unit) {
                    visible[unit.id] = true;
                });
                visible[fov.me.id] = true;

                this.objects.forEach(function (viewUnit) {
                    var ret = _this.data.objects.filter(function (unit) {
                        return viewUnit.id == unit.id;
                    });
                    if (ret.length == 0 && viewUnit.id != ShizimilyRogue.Common.PLAYER_ID) {
                        // Dataの情報としてないが、Viewにはある＝消えたユニット
                        var layer = _this.layer[viewUnit.layer];
                        layer.tl.delay(speed).then(function () {
                            return layer.removeChild(viewUnit);
                        });
                    }
                });

                // ユニットが新規作成された
                var i = 0;
                this.objects = this.data.objects.map(function (unit) {
                    index[unit.id] = i++;
                    var ret = _this.objects.filter(function (viewUnit) {
                        return viewUnit.id == unit.id;
                    });
                    var u;
                    if (ret.length == 0) {
                        // Viewの情報としてないが、Dataにはある＝新規ユニット
                        u = ViewObjectFactory.getInstance(unit);
                        _this.layer[u.layer].addChild(u);
                    } else {
                        // 元からある
                        u = ret[0];
                    }

                    // ついでに見えてるかどうかを入れておく
                    if (u.visible && !visible[unit.id]) {
                        u.fadeOut(speed);
                    } else if (!u.visible && visible[unit.id]) {
                        u.fadeIn(speed);
                    }

                    if (u.visible) {
                        u.update();
                    }
                    return u;
                });

                // ユニットに行動を起こさせる
                results.forEach(function (result) {
                    var id = result.object.id;
                    var unit = _this.objects[index[id]];

                    // FOVにあるものだけを表示
                    unit.action(result, speed);
                });
            };

            // 視点移動
            View.prototype.moveCamera = function (speed) {
                var coord = this.data.objects[ShizimilyRogue.Common.PLAYER_ID].coord;
                var x = _View.VIEW_WIDTH / 2 - coord.x * OBJECT_WIDTH;
                var y = _View.VIEW_HEIGHT / 2 - coord.y * OBJECT_HEIGHT;
                _View.Scene.addAnimating();
                this.tl.moveTo(x, y, speed).then(function () {
                    _View.Scene.decAnimating();
                });
            };

            // 部屋にいる時の影
            View.prototype.updateShadow = function (fov) {
                var objs = fov.getCell(fov.me.coord);
                if (fov.getCell(fov.me.coord).isRoom()) {
                    this.roomShadow.visible = true;
                    this.roomShadow.update(fov.area);
                } else {
                    this.roomShadow.visible = false;
                }
            };
            return View;
        })(enchant.Group);

        var Menu = (function (_super) {
            __extends(Menu, _super);
            function Menu(data, selectHandler, multiple, background, left, top, size) {
                _super.call(this);
                this.selectHandler = selectHandler;
                this.multiple = multiple;
                this.size = size;
                this.elements = null;
                this.cursorIndex = 0;
                this.menuArea = new enchant.Sprite(background.width, background.height);
                this.menuArea.image = background;
                var imgCursor = _View.Scene.IMAGE.CURSOR.DATA;
                this.cursor = new enchant.Sprite(imgCursor.width, imgCursor.height);
                this.cursor.image = imgCursor;
                this.cursor.x = Menu.LEFT_MARGIN;
                this.x = left;
                this.y = top;

                this.addChild(this.menuArea);
                this.setMenuElement(data);
                this.addChild(this.cursor);
                this.show();
            }
            Menu.Main = function (data, selectHandler, multiple) {
                if (typeof multiple === "undefined") { multiple = false; }
                return new Menu(data, selectHandler, multiple, _View.Scene.IMAGE.MEMU_MAIN.DATA, 10, 10, 3);
            };

            Menu.Item = function (data, selectHandler, multiple) {
                if (typeof multiple === "undefined") { multiple = false; }
                return new Menu(data, selectHandler, multiple, _View.Scene.IMAGE.ITEM_WINDOW.DATA, 10, 10, 10);
            };

            Menu.Use = function (data, selectHandler, multiple) {
                if (typeof multiple === "undefined") { multiple = false; }
                return new Menu(data, selectHandler, multiple, _View.Scene.IMAGE.USE_MENU.DATA, 400, 10, 4);
            };

            Menu.prototype.setMenuElement = function (data) {
                var _this = this;
                var count = 0;
                if (this.elements != null) {
                    this.removeChild(this.elements);
                }
                this.elements = new enchant.Group();
                data.forEach(function (d) {
                    var label = new enchant.Label();
                    label.text = d;
                    label.height = Menu.LINE_SIZE;
                    label.font = "32px cursive";
                    label.color = "white";
                    label.y = (count % _this.size) * Menu.LINE_SIZE + Menu.TOP_MARGIN;
                    label.x = Menu.LEFT_MARGIN + _View.Scene.IMAGE.CURSOR.DATA.width;
                    _this.elements.addChild(label);
                    count++;
                });
                this.cursor.visible = data.length > 0;
                this.addChild(this.elements);
            };

            Menu.prototype.show = function () {
                var page = Math.floor(this.cursorIndex / this.size);
                for (var i = 0; i < this.elements.childNodes.length; i++) {
                    this.elements.childNodes[i].visible = i >= page * this.size && i < (page + 1) * this.size;
                }
                this.cursor.y = (this.cursorIndex % this.size) * Menu.LINE_SIZE + Menu.TOP_MARGIN;
            };

            Menu.prototype.up = function () {
                if (this.cursorIndex > 0)
                    this.cursorIndex--;
                this.show();
            };

            Menu.prototype.down = function () {
                if (this.cursorIndex < this.elements.childNodes.length - 1)
                    this.cursorIndex++;
                this.show();
            };

            Menu.prototype.select = function () {
                if (this.cursor.visible)
                    this.selectHandler(this.cursorIndex);
            };
            Menu.TOP_MARGIN = 36;
            Menu.LEFT_MARGIN = 36;
            Menu.LINE_SIZE = 36;
            return Menu;
        })(enchant.Group);

        var Shadow = (function (_super) {
            __extends(Shadow, _super);
            function Shadow(w, h) {
                _super.call(this, OBJECT_WIDTH, OBJECT_HEIGHT);
                this.w = w;
                this.h = h;
                this.image = _View.Scene.IMAGE.SHADOW.DATA;
            }
            Shadow.prototype.update = function (area) {
                var map = [];
                for (var y = 0; y < this.h; y++) {
                    map.push(new Array(this.w));
                    for (var x = 0; x < this.w; x++) {
                        map[y][x] = 0;
                    }
                }
                area.forEach(function (a) {
                    map[a.y][a.x] = 1;
                });
                this.loadData(map);
            };
            return Shadow;
        })(enchant.Map);

        var ViewObjectFactory = (function () {
            function ViewObjectFactory() {
            }
            ViewObjectFactory.getInstance = function (object) {
                if (object.isPlayer())
                    return ViewObjectFactory.getPlayerInstance(object);
                else if (object.isUnit())
                    return ViewObjectFactory.getUnitInstance(object);
                else if (object.isItem())
                    return ViewObjectFactory.getItemInstance(object);
            };

            ViewObjectFactory.getPlayerInstance = function (obj) {
                var frame = function () {
                    var x = [
                        [0],
                        [0],
                        [0],
                        [0],
                        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3],
                        [8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11],
                        [4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7],
                        [0]
                    ];
                    var ret = x[obj.dir];
                    return ret;
                };
                return new ViewObject(obj, _View.Scene.IMAGE.SHIZIMILY.DATA, frame, -0.5, -1, 128, 96);
            };

            ViewObjectFactory.getUnitInstance = function (obj) {
                return new ViewObject(obj, _View.Scene.IMAGE.UNIT.DATA, function () {
                    return [1];
                }, 0, -0.5);
            };

            ViewObjectFactory.getItemInstance = function (obj) {
                return new ViewObject(obj, _View.Scene.IMAGE.ITEM.DATA, function () {
                    return [1];
                });
            };
            return ViewObjectFactory;
        })();

        var ViewObject = (function (_super) {
            __extends(ViewObject, _super);
            function ViewObject(data, image, frame, marginX, marginY, width, height) {
                if (typeof marginX === "undefined") { marginX = 0; }
                if (typeof marginY === "undefined") { marginY = 0; }
                if (typeof width === "undefined") { width = OBJECT_WIDTH; }
                if (typeof height === "undefined") { height = OBJECT_HEIGHT; }
                _super.call(this);
                this.data = data;
                this.frame = frame;
                this.marginX = marginX;
                this.marginY = marginY;
                this.visible = false;

                this.sprite = new enchant.Sprite(width, height);
                this.sprite.image = image;
                this.sprite.frame = frame();
                this.sprite.opacity = 0;
                var coord = this.data.coord;
                this.moveTo((coord.x + this.marginX) * OBJECT_WIDTH, (coord.y + this.marginY) * OBJECT_HEIGHT);
                this.addChild(this.sprite);

                if (ShizimilyRogue.Common.DEBUG) {
                    this.info = new enchant.Label();
                    this.addChild(this.info);
                }
            }
            ViewObject.prototype.update = function () {
                this.sprite.frame = this.frame();
            };

            ViewObject.prototype.action = function (result, speed) {
                if (ShizimilyRogue.Common.DEBUG) {
                    if (result.object.isUnit()) {
                        var unit = result.object;
                        this.info.text = "[dir:" + unit.dir + "]";
                    }
                }
                if (this.visible == false) {
                    var coord = this.data.coord;
                    this.moveTo((coord.x + this.marginX) * OBJECT_WIDTH, (coord.y + this.marginY) * OBJECT_HEIGHT);
                    return;
                }
                if (result.action.type == 0 /* Move */) {
                    var coord = this.data.coord;
                    _View.Scene.addAnimating();
                    this.tl.moveTo((coord.x + this.marginX) * OBJECT_WIDTH, (coord.y + this.marginY) * OBJECT_HEIGHT, speed).then(function () {
                        _View.Scene.decAnimating();
                    });
                } else if (result.action.type == 10 /* Fly */) {
                    //var src = result.action.coords[0];
                    //var dst = result.object.coord;
                    //this.x = src.x;
                    //this.y = src.y;
                    //this.tl.moveBy(dst.x, dst.y, speed);
                }
            };

            ViewObject.prototype.fadeOut = function (speed) {
                var _this = this;
                this.sprite.tl.fadeOut(speed).then(function () {
                    return _this.visible = false;
                });
            };

            ViewObject.prototype.fadeIn = function (speed) {
                this.visible = true;
                this.sprite.tl.fadeIn(speed);
            };

            Object.defineProperty(ViewObject.prototype, "id", {
                get: function () {
                    return this.data.id;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ViewObject.prototype, "layer", {
                get: function () {
                    return this.data.layer;
                },
                enumerable: true,
                configurable: true
            });
            return ViewObject;
        })(enchant.Group);

        var Map = (function (_super) {
            __extends(Map, _super);
            function Map(getTable, image) {
                _super.call(this, OBJECT_WIDTH, OBJECT_HEIGHT);
                this.getTable = getTable;
                this.image = image;
                this.update();
            }
            Map.ground = function (width, height, getTable) {
                var table = function (x, y) {
                    return getTable(x, y).ground;
                };
                var getViewTable = function () {
                    return Map.getGroundViewTable(width, height, table);
                };
                return new Map(getViewTable, _View.Scene.IMAGE.WALL.DATA);
            };

            Map.floor = function (width, height, getTable) {
                var table = function (x, y) {
                    return getTable(x, y).floor;
                };
                var getViewTable = function () {
                    return Map.getFloorViewTable(width, height, table);
                };
                return new Map(getViewTable, _View.Scene.IMAGE.FLOOR.DATA);
            };

            Map.prototype.update = function () {
                var viewTable = this.getTable();
                this.loadData(viewTable);
            };

            Map.getFloorViewTable = function (w, h, table) {
                var map = [];
                var flg = true;

                for (var y = 0; y < h; y++) {
                    map.push(new Array(w));
                    for (var x = 0; x < w; x++) {
                        flg = !flg;
                        map[y][x] = flg ? 0 : 1;
                    }
                }
                return map;
            };

            Map.getGroundViewTable = function (w, h, table) {
                var blockTable = [
                    0, 17, 4, 4, 16, 36, 4, 4,
                    7, 26, 9, 9, 7, 26, 9, 9,
                    18, 32, 21, 21, 39, 40, 21, 21,
                    7, 26, 9, 9, 7, 26, 9, 9,
                    5, 22, 1, 1, 23, 45, 1, 1,
                    11, 30, 15, 15, 11, 30, 15, 15,
                    5, 22, 1, 1, 23, 45, 1, 1,
                    11, 30, 15, 15, 11, 30, 15, 15,
                    19, 38, 20, 20, 33, 41, 20, 20,
                    24, 46, 28, 28, 24, 46, 28, 28,
                    37, 43, 44, 44, 42, 34, 44, 44,
                    24, 46, 28, 28, 24, 46, 28, 28,
                    5, 22, 1, 1, 23, 45, 1, 1,
                    11, 30, 15, 15, 11, 30, 15, 15,
                    5, 22, 1, 1, 23, 45, 1, 1,
                    11, 30, 15, 15, 11, 30, 15, 15,
                    6, 6, 29, 29, 27, 27, 8, 8,
                    2, 2, 12, 12, 2, 2, 12, 12,
                    25, 25, 29, 29, 47, 47, 29, 29,
                    2, 2, 12, 12, 2, 2, 12, 12,
                    10, 10, 14, 14, 31, 31, 14, 14,
                    13, 13, 3, 3, 13, 13, 3, 3,
                    10, 10, 14, 14, 31, 31, 14, 14,
                    25, 25, 29, 29, 47, 47, 29, 29,
                    6, 6, 29, 29, 27, 27, 8, 8,
                    2, 2, 12, 12, 2, 2, 12, 12,
                    25, 25, 29, 29, 47, 47, 29, 29,
                    2, 2, 12, 12, 2, 2, 12, 12,
                    10, 10, 14, 14, 31, 31, 14, 14,
                    13, 13, 3, 3, 13, 13, 3, 3,
                    10, 10, 14, 14, 31, 31, 14, 14,
                    13, 13, 3, 3, 13, 13, 3, 3
                ];
                var map = [];

                for (var y = 0; y < h; y++) {
                    map.push(new Array(w));
                    for (var x = 0; x < w; x++) {
                        if (table(x, y).isWall()) {
                            var blockId = 0;
                            blockId |= (x == 0 || y == 0 || table(x - 1, y - 1).isWall()) ? 0 : 1;
                            blockId |= (y == 0 || table(x, y - 1).isWall()) ? 0 : 2;
                            blockId |= (x == w - 1 || y == 0 || table(x + 1, y - 1).isWall()) ? 0 : 4;
                            blockId |= (x == w - 1 || table(x + 1, y).isWall()) ? 0 : 8;
                            blockId |= (x == w - 1 || y == h - 1 || table(x + 1, y + 1).isWall()) ? 0 : 16;
                            blockId |= (y == h - 1 || table(x, y + 1).isWall()) ? 0 : 32;
                            blockId |= (x == 0 || y == h - 1 || table(x - 1, y + 1).isWall()) ? 0 : 64;
                            blockId |= (x == 0 || table(x - 1, y).isWall()) ? 0 : 128;

                            var mapId = blockTable[blockId];
                            map[y][x] = mapId;
                        } else {
                            map[y][x] = 35;
                        }
                    }
                }
                return map;
            };
            return Map;
        })(enchant.Map);
    })(ShizimilyRogue.View || (ShizimilyRogue.View = {}));
    var View = ShizimilyRogue.View;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=gameScene.js.map
