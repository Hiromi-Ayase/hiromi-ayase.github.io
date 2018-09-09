var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (_View) {
        /** セルのWidth */
        var OBJECT_WIDTH = 64;

        /** セルのHeight */
        var OBJECT_HEIGHT = 64;

        /** メニュータイプ */
        (function (MenuType) {
            MenuType[MenuType["Main"] = 0] = "Main";
            MenuType[MenuType["Item"] = 1] = "Item";
            MenuType[MenuType["Use"] = 2] = "Use";
        })(_View.MenuType || (_View.MenuType = {}));
        var MenuType = _View.MenuType;

        /**
        * ゲーム画面用データ
        */
        var GameSceneData = (function () {
            /**
            * @constructor
            */
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

        /**
        * ゲーム画面
        */
        var GameScene = (function (_super) {
            __extends(GameScene, _super);
            /**
            * @constructor
            * @param {GameSceneData} data ゲームシーン用データ
            * @param {Common.IFOVData} fov 視界情報
            */
            function GameScene(data, fov) {
                _super.call(this);
                this.data = data;

                this.message = new Message();
                this.pathShadow = GameScene.getPathShadow();
                this.view = new View(data, fov);
                this.playerHp = new PlayerHp();
                this.clock = new Clock();
                this.menuGroup = new enchant.Group();
                this.miniMap = new MiniMap(fov.width, fov.height);
                this.actualFps = new ActualFPS();
                this.focus = 0 /* Field */;

                this.addChild(this.view);
                this.addChild(this.pathShadow);
                this.addChild(this.playerHp);
                this.addChild(this.clock);
                this.addChild(this.message);
                this.addChild(this.miniMap);
                this.addChild(this.menuGroup);
                this.addChild(this.actualFps);

                this.addMenuKeyHandler();
            }
            /**
            * メニューの表示
            * @param {MenuType} type ゲームシーン用データ
            * @param {string[]} data メニューアイテム
            * @param {(n: number) => void} selectHandler メニュー選択時のハンドラ
            * @param {boolean} multiple 複数選択(Default:false)
            */
            GameScene.prototype.showMenu = function (type, data, selectHandler, multiple) {
                if (typeof multiple === "undefined") { multiple = false; }
                //Scene.keyLock = true;
                this.focus = 1 /* Menu */;
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

            /**
            * メニューを閉じる
            */
            GameScene.prototype.closeMenu = function () {
                while (true) {
                    this.menuGroup.removeChild(this.menuGroup.lastChild);
                    if (this.menuGroup.childNodes.length == 0) {
                        break;
                    }
                }
                this.tl.delay(ShizimilyRogue.Common.Config.KEY_LOCK_RELEASE).then(function () {
                    return _View.Scene.keyLock = false;
                });
                this.focus = 0 /* Field */;
            };

            /**
            * アクションごとのアップデート
            * @param {Common.IFOVData} fov 視界情報
            * @param {Common.Action} action アクション
            * @param {number} speed スピード
            */
            GameScene.prototype.updateAction = function (fov, action, speed) {
                var player = this.data.player;

                // 視界の表示
                this.pathShadow.visible = fov.getCell(player.cell.coord).isPath();

                this.playerHp.show(player.hp, player.maxHp, player.stomach);
                this.view.updateAction(fov, action, speed);
                this.miniMap.update(fov);
                this.clock.show(player.turn);
                this.message.show(action, speed);
            };

            /**
            * フレームごとのアップデート
            * @param {Common.IFOVData} fov 視界情報
            * @param {number} speed スピード
            */
            GameScene.prototype.updateFrame = function (speed) {
                //Scene.ASSETS.BGM_MAIN.DATA.play();
                this.view.updateFrame(speed);
                this.actualFps.update();
            };

            /*private addMenuKeyHandler(): void {
            Scene.game.addEventListener(enchant.Event.UP_BUTTON_UP, event => {
            if (this.menuGroup.childNodes.length > 0) {
            var menu = <Menu>this.menuGroup.lastChild;
            menu.up();
            }
            });
            Scene.game.addEventListener(enchant.Event.DOWN_BUTTON_UP, event => {
            if (this.menuGroup.childNodes.length > 0) {
            var menu = <Menu>this.menuGroup.lastChild;
            menu.down();
            }
            });
            Scene.game.addEventListener(enchant.Event.A_BUTTON_DOWN, event => {
            if (this.menuGroup.childNodes.length > 0) {
            var menu = <Menu>this.menuGroup.lastChild;
            menu.select();
            }
            });
            Scene.game.addEventListener(enchant.Event.B_BUTTON_DOWN, event => {
            if (this.menuGroup.childNodes.length > 0) {
            this.menuGroup.removeChild(this.menuGroup.lastChild);
            if (this.menuGroup.childNodes.length == 0)
            this.tl.delay(Common.Config.KEY_LOCK_RELEASE).then(() => Scene.keyLock = false);
            }
            });
            }*/
            /**
            * フォーカスがフィールドにあればTrue
            */
            GameScene.prototype.hasFieldFocus = function () {
                return this.focus == 0 /* Field */;
            };

            GameScene.prototype.addMenuKeyHandler = function () {
                var _this = this;
                _View.Scene.game.addEventListener(enchant.Event.ENTER_FRAME, function (e) {
                    if (_View.Input.BtnUp.count == 1 && _this.focus == 1 /* Menu */) {
                        if (_this.menuGroup.childNodes.length > 0) {
                            var menu = _this.menuGroup.lastChild;
                            menu.up();
                        }
                    }
                    if (_View.Input.BtnDown.count == 1) {
                        if (_this.menuGroup.childNodes.length > 0) {
                            var menu = _this.menuGroup.lastChild;
                            menu.down();
                        }
                    }
                    if (_View.Input.BtnA.count == 1) {
                        if (_this.menuGroup.childNodes.length > 0) {
                            var menu = _this.menuGroup.lastChild;
                            menu.select();
                        }
                    }
                    if (_View.Input.BtnB.count == 1) {
                        if (_this.menuGroup.childNodes.length > 0) {
                            _this.menuGroup.removeChild(_this.menuGroup.lastChild);
                            if (_this.menuGroup.childNodes.length == 0) {
                                _this.tl.delay(ShizimilyRogue.Common.Config.KEY_LOCK_RELEASE).then(function () {
                                    return _View.Scene.keyLock = false;
                                });
                                _this.focus = 0 /* Field */;
                            }
                        }
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
            return GameScene;
        })(_View.Scene);
        _View.GameScene = GameScene;

        /**
        * ミニマップ
        */
        var MiniMap = (function (_super) {
            __extends(MiniMap, _super);
            /**
            * ミニマップのコンストラクタ
            * @param {number} w Width
            * @param {number} h Height
            * @constructor
            */
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
                this.groundMap.image = _View.Scene.ASSETS.MINI_MAP.DATA;
                this.floorMap.image = _View.Scene.ASSETS.MINI_MAP.DATA;
                this.groundMap.opacity = MiniMap.ALPHA;
                this.floorMap.opacity = MiniMap.ALPHA;
                this.addChild(this.floorMap);
                this.addChild(this.groundMap);
            }
            /**
            * ミニマップのアップデート
            * @param {Common.IFOVData} fov 視界情報
            */
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
                    } else if (obj.isExit()) {
                        _this.groundData[coord.y][coord.x] = MiniMap.BLOCK_EXIT;
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
            MiniMap.BLOCK_EXIT = 20;
            MiniMap.BLOCK_ITEM = 18;
            MiniMap.BLOCK_OHTER = 15;
            MiniMap.X = 200;
            MiniMap.Y = 100;
            MiniMap.ALPHA = 0.7;
            MiniMap.SIZE = 8;
            MiniMap.FLOOR_TABLE = [6, 5, 11, 10, 7, 4, 12, 13, 1, 0, 3, 8, 2, 15, 9];
            return MiniMap;
        })(enchant.Group);

        /**
        * 下部のメッセージ
        */
        var Message = (function (_super) {
            __extends(Message, _super);
            /**
            * @constructor
            */
            function Message() {
                _super.call(this);
                this.messages = [];
                this.groupTl = null;
                this.count = 0;
                this.messageArea = new enchant.Sprite(_View.VIEW_WIDTH, _View.VIEW_HEIGHT);
                this.messageArea.image = _View.Scene.ASSETS.MESSAGE_WINDOW.DATA;
                this.messageArea.opacity = Message.MESSAGE_AREA_OPACITY;
                this.icon = new enchant.Sprite(_View.VIEW_WIDTH, _View.VIEW_HEIGHT);
                this.icon.image = _View.Scene.ASSETS.MESSAGE_ICON.DATA;

                this.messageGroup = new enchant.Group();
                this.messageGroup.x = Message.MESSAGE_LEFT;
                this.messageGroup.y = Message.MESSAGE_TOP;

                this.addChild(this.messageArea);
                this.addChild(this.icon);
                this.addChild(this.messageGroup);

                this.visible = false;
            }
            /**
            * メッセージの表示
            * @param {Common.Action} action メッセージを表示するアクション
            * @param {number} speed スピード
            */
            Message.prototype.show = function (action, speed) {
                var m = _View.Data.Message[action.type];
                if (m != null) {
                    this.visible = true;
                    if (this.groupTl == null) {
                        this.resetMessageGroup();
                    }

                    var str = m(action);
                    this.messages.push(str);
                    this.setMessage(speed);
                }
            };

            Object.defineProperty(Message.prototype, "visible", {
                /**
                * 表示の切替
                * @param {boolean} flg True/False
                */
                set: function (flg) {
                    this.messageArea.visible = flg;
                    this.icon.visible = flg;

                    if (!flg) {
                        this.removeChild(this.messageGroup);
                        this.groupTl = null;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Message.prototype.resetMessageGroup = function () {
                this.removeChild(this.messageGroup);
                this.messageGroup = new enchant.Group();
                this.messageGroup.x = Message.MESSAGE_LEFT;
                this.messageGroup.y = Message.MESSAGE_TOP;
                this.addChild(this.messageGroup);
                this.groupTl = this.messageGroup.tl;
            };

            Message.prototype.setMessage = function (speed) {
                var _this = this;
                var upSpeed = speed * ShizimilyRogue.Common.Config.MESSAGE_SPEED;
                if (this.messages.length > 0) {
                    var label = new enchant.Label();
                    label = new enchant.Label();
                    label.font = "16px cursive";
                    label.color = "white";
                    label.width = Message.MESSAGE_WIDTH;
                    label.text = this.messages.shift();
                    label.visible = false;
                    label.y = this.messageGroup.lastChild == null ? 0 : this.messageGroup.lastChild.y + Message.MESSAGE_HEIGHT;
                    this.messageGroup.addChild(label);

                    if (this.messageGroup.childNodes.length > Message.MESSAGE_LINE) {
                        this.groupTl = this.groupTl.delay(upSpeed).then(function () {
                            _this.messageGroup.removeChild(_this.messageGroup.firstChild);
                        }).moveBy(0, -Message.MESSAGE_HEIGHT, upSpeed).then(function (e) {
                            _this.messageGroup.childNodes[Message.MESSAGE_LINE - 1].visible = true;
                            _this.count++;
                            _this.tl.delay(speed * ShizimilyRogue.Common.Config.MESSAGE_FADEOUT).then(function () {
                                _this.count--;
                                if (_this.count == 0) {
                                    _this.visible = false;
                                }
                            });
                        }).delay(upSpeed).then(function () {
                            _this.setMessage(speed);
                        });
                    } else {
                        label.visible = true;
                        this.count++;
                        this.setMessage(speed);
                        this.tl.delay(speed * ShizimilyRogue.Common.Config.MESSAGE_FADEOUT).then(function () {
                            _this.count--;
                            if (_this.count == 0) {
                                _this.visible = false;
                            }
                        });
                    }
                }
            };
            Message.MESSAGE_TOP = 408;
            Message.MESSAGE_LEFT = 20;
            Message.MESSAGE_WIDTH = _View.VIEW_WIDTH - Message.MESSAGE_LEFT;
            Message.MESSAGE_HEIGHT = 20;
            Message.MESSAGE_AREA_OPACITY = 0.8;
            Message.MESSAGE_LINE = 3;
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

        /**
        * 時計
        */
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

        /**
        * FPS表示
        */
        var ActualFPS = (function (_super) {
            __extends(ActualFPS, _super);
            function ActualFPS() {
                _super.call(this);
                this.elapsedFrame = 0;
                this.fpsText = new enchant.Label();
                this.fpsText.x = ActualFPS.FPSDISP_LEFT;
                this.fpsText.y = ActualFPS.FPSDISP_TOP;
                this.fpsText.font = "16px cursive";
                this.fpsText.color = "#00ff00";

                this.addChild(this.fpsText);

                this.lastTime = this.time;
            }
            ActualFPS.prototype.update = function () {
                this.elapsedFrame++;
                var time = this.time;
                if (time - this.lastTime > ActualFPS.LAP) {
                    this.fpsText.text = "fps " + (this.elapsedFrame * 1000 / (time - this.lastTime)).toFixed(3);
                    this.lastTime = time;
                    this.elapsedFrame = 0;
                }
            };

            Object.defineProperty(ActualFPS.prototype, "time", {
                get: function () {
                    var date = new Date();
                    return date.getTime();
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ActualFPS.prototype, "visible", {
                set: function (flg) {
                    this.fpsText.visible = flg;
                },
                enumerable: true,
                configurable: true
            });
            ActualFPS.FPSDISP_TOP = 460;
            ActualFPS.FPSDISP_LEFT = 570;
            ActualFPS.LAP = 1000;
            return ActualFPS;
        })(enchant.Group);

        /** ゲーム画面本体 */
        var View = (function (_super) {
            __extends(View, _super);
            /**
            * @constructor
            */
            function View(data, fov) {
                _super.call(this);
                this.data = data;
                this.objects = {};
                this.lastFov = null;
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
            }
            /**
            * Actionが来るごとにUpdate
            * @param {Common.IFOVData} fov 視界情報
            * @param {Common.Action} action アクション
            * @param {number} speed 速度
            */
            View.prototype.updateAction = function (fov, action, speed) {
                this.updateShadow(fov);
                this.updateObjects(fov, action, speed);
                this.moveCamera(speed);
                this.lastFov = fov;
            };

            /**
            * フレームごとにUpdate
            * @param {number} speed 速度
            */
            View.prototype.updateFrame = function (speed) {
                if (this.lastFov != null) {
                    this.updateVisible(this.lastFov, speed);
                    this.lastFov = null;
                }
                for (var id in this.objects) {
                    if (this.objects[id] instanceof ViewObject) {
                        this.objects[id].updateFrame();
                    }
                }
            };

            /**
            * ユニットの見える見えないのアップデート
            * @param {Common.IFOVData} fov 視界情報
            * @param {number} speed 速度
            */
            View.prototype.updateVisible = function (fov, speed) {
                for (var id in this.objects) {
                    if (fov.isVisible(id)) {
                        this.objects[id].show(speed);
                    } else {
                        this.objects[id].hide(speed);
                    }
                }
            };

            View.prototype.updateObjects = function (fov, action, speed) {
                var _this = this;
                // ユニットに行動を起こさせる
                if (action.isSystem()) {
                    var target = action.targets[0];
                    if (action.isMove()) {
                        this.objects[action.sender.id].move(action.sender.cell.coord, speed);
                    } else if (action.isDrop()) {
                        if (this.objects[target.id] == null) {
                            var u = ViewObjectFactory.getInstance(target);
                            this.objects[u.id] = u;
                            this.layer[u.layer].addChild(u);

                            if (fov.isVisible(u.id)) {
                                u.show(speed);
                            }
                        }
                    } else if (action.isDelete()) {
                        var u = this.objects[target.id];
                        u.hide(speed).then(function () {
                            _this.layer[u.layer].removeChild(u);
                        });
                        delete this.objects[target.id];
                    }
                }

                if (action.isFly()) {
                    var u = ViewObjectFactory.getInstance(action.sender);
                    u.move(action.coord, 0);
                    u.show(0);
                    this.layer[u.layer].addChild(u);
                    u.move(action.targets[0].cell.coord, speed).then(function () {
                        _this.layer[u.layer].removeChild(u);
                    });
                }

                if (action.sender != null && this.objects[action.sender.id] != null) {
                    this.objects[action.sender.id].updateAction(action, speed);
                }

                for (var id in this.objects) {
                    if (this.objects[id] instanceof ViewObject) {
                        this.objects[id].updateFrame();
                    }
                }
            };

            // 視点移動
            View.prototype.moveCamera = function (speed) {
                var coord = this.data.objects[ShizimilyRogue.Common.PLAYER_ID].cell.coord;
                if (this.lastCoord != coord) {
                    var x = _View.VIEW_WIDTH / 2 - coord.x * OBJECT_WIDTH;
                    var y = _View.VIEW_HEIGHT / 2 - coord.y * OBJECT_HEIGHT;
                    _View.Scene.addAnimating();
                    this.tl.moveTo(x, y, speed).then(function () {
                        _View.Scene.decAnimating();
                    });
                    this.lastCoord = coord;
                }
            };

            // 部屋にいる時の影
            View.prototype.updateShadow = function (fov) {
                var objs = fov.getCell(fov.me.cell.coord);
                if (fov.getCell(fov.me.cell.coord).isRoom()) {
                    this.roomShadow.visible = true;
                    this.roomShadow.update(fov.area);
                } else {
                    this.roomShadow.visible = false;
                }
            };
            return View;
        })(enchant.Group);

        /**
        * メニュー
        */
        var Menu = (function (_super) {
            __extends(Menu, _super);
            /**
            * @constructor
            */
            function Menu(data, selectHandler, multiple, background, left, top, width, height) {
                _super.call(this);
                this.selectHandler = selectHandler;
                this.multiple = multiple;
                this.elements = null;
                this.cursorIndex = 0;
                this.size = 3;
                this.menuArea = Menu.getBackground(width, height, background);
                this.menuArea.image = background;

                var imgCursor = _View.Scene.ASSETS.MENU_CURSOR.DATA;
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
            /**
            * メインメニュー
            * @param {string[]} data メニューのアイテムリスト
            * @param {(n: number) => void} selectHandler 選択時のハンドラ
            * @param {boolean} multiple 複数選択か否か(Default:false)
            * @return {Menu} メニュー
            */
            Menu.Main = function (data, selectHandler, multiple) {
                if (typeof multiple === "undefined") { multiple = false; }
                return new Menu(data, selectHandler, multiple, _View.Scene.ASSETS.MENU_WINDOW.DATA, 10, 10, 5, 3);
            };

            /**
            * アイテムメニュー
            * @param {string[]} data メニューのアイテムリスト
            * @param {(n: number) => void} selectHandler 選択時のハンドラ
            * @param {boolean} multiple 複数選択か否か(Default:false)
            * @return {Menu} メニュー
            */
            Menu.Item = function (data, selectHandler, multiple) {
                if (typeof multiple === "undefined") { multiple = false; }
                return new Menu(data, selectHandler, multiple, _View.Scene.ASSETS.MENU_WINDOW.DATA, 10, 10, 5, 7);
            };

            /**
            * アイテムの使用メニュー
            * @param {string[]} data メニューのアイテムリスト
            * @param {(n: number) => void} selectHandler 選択時のハンドラ
            * @param {boolean} multiple 複数選択か否か(Default:false)
            * @return {Menu} メニュー
            */
            Menu.Use = function (data, selectHandler, multiple) {
                if (typeof multiple === "undefined") { multiple = false; }
                return new Menu(data, selectHandler, multiple, _View.Scene.ASSETS.MENU_WINDOW.DATA, 400, 10, 4, 4);
            };

            /**
            * カーソルを上へ
            */
            Menu.prototype.up = function () {
                if (this.cursorIndex > 0)
                    this.cursorIndex--;
                this.show();
            };

            /**
            * カーソルを下へ
            */
            Menu.prototype.down = function () {
                if (this.cursorIndex < this.elements.childNodes.length - 1)
                    this.cursorIndex++;
                this.show();
            };

            /**
            * 選択
            */
            Menu.prototype.select = function () {
                if (this.cursor.visible)
                    this.selectHandler(this.cursorIndex);
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
                    label.x = Menu.LEFT_MARGIN + _View.Scene.ASSETS.MENU_CURSOR.DATA.width;
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

            Menu.getBackground = function (width, height, image) {
                var map = new enchant.Map(Menu.BACKGROUND_TILE_WIDTH, Menu.BACKGROUND_TILE_HEIGHT);
                map.image = image;
                var table = new Array(height);

                for (var y = 0; y < height; y++) {
                    table[y] = new Array(width);
                    for (var x = 0; x < width; x++) {
                        var e = 0;
                        if (x == 0)
                            e += 1;
                        if (x == width - 1)
                            e += 2;
                        if (y == 0)
                            e += 3;
                        if (y == height - 1)
                            e += 6;
                        table[y][x] = Menu.BAKCGROUND_TILE[e];
                    }
                }
                map.loadData(table);
                return map;
            };
            Menu.BACKGROUND_TILE_WIDTH = 64;
            Menu.BACKGROUND_TILE_HEIGHT = 64;
            Menu.BAKCGROUND_TILE = [4, 3, 5, 1, 0, 2, 7, 6, 8];
            Menu.TOP_MARGIN = 36;
            Menu.LEFT_MARGIN = 36;
            Menu.LINE_SIZE = 36;
            return Menu;
        })(enchant.Group);

        /**
        * 部屋内にいる時の視界外の影
        */
        var Shadow = (function (_super) {
            __extends(Shadow, _super);
            /**
            * @constructor
            */
            function Shadow(w, h) {
                _super.call(this, OBJECT_WIDTH, OBJECT_HEIGHT);
                this.w = w;
                this.h = h;
                this.image = _View.Scene.ASSETS.SHADOW.DATA;
            }
            /**
            * フレームごとにUpdate
            * @param {Common.Coord[]} area 全視界の座標
            */
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

        /**
        * マップ上のオブジェクトのFactory
        */
        var ViewObjectFactory = (function () {
            function ViewObjectFactory() {
            }
            /**
            * オブジェクトの取得
            * @param {Common.IObject} object オブジェクト
            * @return {enchant.Timeline} View用のオブジェクト
            */
            ViewObjectFactory.getInstance = function (object) {
                if (object.isPlayer())
                    return ViewObjectFactory.getPlayerInstance(object);
                else if (object.isUnit())
                    return ViewObjectFactory.getUnitInstance(object);
                else if (object.isItem())
                    return ViewObjectFactory.getItemInstance(object);
                else if (object.isStairs())
                    return ViewObjectFactory.getStairsInstance(object);
                else
                    return ViewObjectFactory.getObjectInstance(object);
            };

            ViewObjectFactory.getPlayerInstance = function (obj) {
                var lastDir = obj.dir;
                var frameLock = false;
                var frameNum = 0;
                var idleAnimation = function (sprite) {
                    if (obj.isNormal()) {
                        var delay = 7;
                        var x = [
                            [0, 1, 2, 3],
                            [0, 1, 2, 3],
                            [0, 1, 2, 3],
                            [0, 1, 2, 3],
                            [0, 1, 2, 3],
                            [8, 9, 10, 11],
                            [4, 5, 6, 7],
                            [0, 1, 2, 3]
                        ];

                        /*var allFrame: number[][];
                        for (var dir = 0; dir < 8; dir++) {
                        for (var flameNum = 0; flameNum < x[dir].length; flameNum++) {
                        for (var i = 0; i < delay; i++) {
                        allFrame[dir].push(x[dir][flameNum]);
                        }
                        }
                        }*/
                        sprite.frame = x[obj.dir][frameNum];
                        if (_View.Scene.game.frame % delay == 0)
                            frameNum++;
                        if (frameNum >= x[obj.dir].length)
                            frameNum = 0;
                    }
                };

                var actionAnimation = function (sprite, action, speed) {
                    if (action.isAttack()) {
                        sprite.tl.moveBy(20, 0, 3).moveBy(-20, 0, 3);
                    } else if (action.isStatus() && action.subType == 0 /* Damage */) {
                        var x = [
                            [12],
                            [13, null],
                            [13, null],
                            [13, null],
                            [12, null],
                            [13, null],
                            [13, null],
                            [13, null]
                        ];
                        sprite.frame = x[obj.dir];
                        sprite.tl.moveBy(20, 0, 3).moveBy(-20, 0, 3).delay(5);
                    }
                };
                return new ViewObject(obj, _View.Scene.ASSETS.SHIZIMILY.DATA, idleAnimation, actionAnimation, -0.5, -1, 128, 96);
            };

            ViewObjectFactory.getUnitInstance = function (obj) {
                return new ViewObject(obj, _View.Scene.ASSETS.UNIT.DATA, function (sprite) {
                    return sprite.frame = 1;
                }, function () {
                }, 0, -0.5);
            };

            ViewObjectFactory.getStairsInstance = function (obj) {
                return new ViewObject(obj, _View.Scene.ASSETS.STAIRS.DATA, function (sprite) {
                    sprite.frame = 0;
                }, function () {
                });
            };

            ViewObjectFactory.getObjectInstance = function (obj) {
                return new ViewObject(obj, _View.Scene.ASSETS.SWEET.DATA, function (sprite) {
                    sprite.frame = obj.category;
                }, function () {
                });
            };

            ViewObjectFactory.getItemInstance = function (obj) {
                var image;
                switch (obj.category) {
                    case 6 /* Case */:
                        image = _View.Scene.ASSETS.PC_CASE.DATA;
                        break;
                    case 0 /* CPU */:
                        image = _View.Scene.ASSETS.CPU.DATA;
                        break;
                    case 1 /* GraphicBoard */:
                        image = _View.Scene.ASSETS.GRAPHIC_BOARD.DATA;
                        break;
                    case 5 /* DVD */:
                        image = _View.Scene.ASSETS.DVD.DATA;
                        break;
                    case 3 /* Memory */:
                        image = _View.Scene.ASSETS.MEMORY.DATA;
                        break;
                    case 2 /* HDD */:
                        image = _View.Scene.ASSETS.HDD.DATA;
                        break;
                    case 4 /* Sweet */:
                        image = _View.Scene.ASSETS.SWEET.DATA;
                        break;
                    case 7 /* SDCard */:
                        image = _View.Scene.ASSETS.SD_CARD.DATA;
                        break;
                }
                return new ViewObject(obj, image, function (sprite) {
                    sprite.frame = 0;
                }, function () {
                });
            };
            return ViewObjectFactory;
        })();

        /**
        * マップ上のオブジェクト
        */
        var ViewObject = (function (_super) {
            __extends(ViewObject, _super);
            /**
            * @constructor
            */
            function ViewObject(data, image, _updateFrame, _updateAction, marginX, marginY, width, height) {
                if (typeof marginX === "undefined") { marginX = 0; }
                if (typeof marginY === "undefined") { marginY = 0; }
                if (typeof width === "undefined") { width = OBJECT_WIDTH; }
                if (typeof height === "undefined") { height = OBJECT_HEIGHT; }
                _super.call(this);
                this.data = data;
                this._updateFrame = _updateFrame;
                this._updateAction = _updateAction;
                this.marginX = marginX;
                this.marginY = marginY;
                this.frameUpdateLock = false;

                this.sprite = new enchant.Sprite(width, height);
                this.sprite.image = image;
                var coord = this.data.cell.coord;
                this.sprite.opacity = 0;
                this.moveTo((coord.x + this.marginX) * OBJECT_WIDTH, (coord.y + this.marginY) * OBJECT_HEIGHT);
                this.addChild(this.sprite);

                if (ShizimilyRogue.Common.DEBUG) {
                    this.info = new enchant.Label();
                    this.addChild(this.info);
                }
                this.lastDir = data.dir;
            }
            /**
            * フレームごとにUpdate
            * @param {Common.IFOVData} fov 視界情報
            * @param {number} speed 速度
            */
            ViewObject.prototype.updateFrame = function () {
                if (!this.frameUpdateLock) {
                    this._updateFrame(this.sprite);
                }
            };

            /**
            * Actionの送信側Update
            * @param {Common.Action} action アクション
            * @param {number} speed 速度
            */
            ViewObject.prototype.updateAction = function (action, speed) {
                var _this = this;
                this.frameUpdateLock = true;
                _View.Scene.addAnimating();
                if (ShizimilyRogue.Common.DEBUG) {
                    if (action.sender.isUnit()) {
                        var unit = action.sender;
                        this.info.text = "[(" + unit.cell.coord.x + "," + unit.cell.coord.y + ")" + "dir:" + unit.dir + "]";
                    }
                }
                this._updateAction(this.sprite, action, speed);
                this.sprite.tl.then(function () {
                    _this.frameUpdateLock = false;
                    _View.Scene.decAnimating();
                });
            };

            /**
            * オブジェクトの移動
            * @param {Common.Coord} coord 移動先座標
            * @param {number} speed 速度
            * @return {enchant.Timeline} スプライトのTL
            */
            ViewObject.prototype.move = function (coord, speed) {
                _View.Scene.addAnimating();
                return this.tl.moveTo((coord.x + this.marginX) * OBJECT_WIDTH, (coord.y + this.marginY) * OBJECT_HEIGHT, speed).then(function () {
                    _View.Scene.decAnimating();
                });
            };

            /**
            * オブジェクトを消す
            * @param {number} speed スピード
            * @return {enchant.Timeline} スプライトのTL
            */
            ViewObject.prototype.hide = function (speed) {
                var tl = this.sprite.tl;
                if (this.sprite.opacity == 1) {
                    tl = tl.fadeOut(speed);
                }
                return tl;
            };

            /**
            * オブジェクトを表示
            * @param {number} speed スピード
            * @return {enchant.Timeline} スプライトのTL
            */
            ViewObject.prototype.show = function (speed) {
                var tl = this.sprite.tl;
                if (this.sprite.opacity == 0) {
                    tl = tl.fadeIn(speed);
                }
                return tl;
            };

            Object.defineProperty(ViewObject.prototype, "id", {
                /**
                * オブジェクトのID
                * @return {number} ID
                */
                get: function () {
                    return this.data.id;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ViewObject.prototype, "layer", {
                /**
                * オブジェクトのレイヤー
                * @return {Common.Layer} レイヤー
                */
                get: function () {
                    return this.data.layer;
                },
                enumerable: true,
                configurable: true
            });
            return ViewObject;
        })(enchant.Group);

        /**
        * マップ(Ground, Floorレイヤー)
        */
        var Map = (function (_super) {
            __extends(Map, _super);
            /**
            * @constructor
            */
            function Map(getTable, image) {
                _super.call(this, OBJECT_WIDTH, OBJECT_HEIGHT);
                this.getTable = getTable;
                this.image = image;
                this.update();
            }
            /**
            * Ground Layerのマップを取得
            * @param {number} width Width
            * @param {number} height Height
            * @param {(x: number, y: number) => Common.ICell} getTable 座標からCellを求める関数
            * @return {Map} マップ
            */
            Map.ground = function (width, height, getTable) {
                var table = function (x, y) {
                    return getTable(x, y).ground;
                };
                var getViewTable = function () {
                    return Map.getGroundViewTable(width, height, table);
                };
                return new Map(getViewTable, _View.Scene.ASSETS.WALL00.DATA);
            };

            /**
            * Floor Layerのマップを取得
            * @param {number} width Width
            * @param {number} height Height
            * @param {(x: number, y: number) => Common.ICell} getTable 座標からCellを求める関数
            * @return {Map} マップ
            */
            Map.floor = function (width, height, getTable) {
                var table = function (x, y) {
                    return getTable(x, y).floor;
                };
                var getViewTable = function () {
                    return Map.getFloorViewTable(width, height, table);
                };
                return new Map(getViewTable, _View.Scene.ASSETS.FLOOR.DATA);
            };

            /**
            * マップのアップデート
            */
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

            Map.getGroundViewTable2 = function (w, h, table) {
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
                    6, 6, 8, 8, 27, 27, 8, 8,
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

            Map.getGroundViewTable = function (w, h, table) {
                var blockTable = [
                    17, 15, 13, 6, 9, 12, 0, 3,
                    14, 8, 7, 7, 2, 5, 1, 1
                ];
                var map = [];

                for (var y = 0; y < h; y++) {
                    map.push(new Array(w));
                    for (var x = 0; x < w; x++) {
                        if (table(x, y).isWall()) {
                            var blockId = 0;
                            blockId |= (y == 0 || table(x, y - 1).isWall()) ? 1 : 0;
                            blockId |= (x == w - 1 || table(x + 1, y).isWall()) ? 2 : 0;
                            blockId |= (y == h - 1 || table(x, y + 1).isWall()) ? 4 : 0;
                            blockId |= (x == 0 || table(x - 1, y).isWall()) ? 8 : 0;

                            var mapId = blockTable[blockId];
                            if (mapId == 1) {
                                if (y < h - 1 && x > 0 && !table(x - 1, y + 1).isWall()) {
                                    if (y < h - 1 && x < w - 1 && !table(x + 1, y + 1).isWall()) {
                                        mapId = 18;
                                    } else {
                                        mapId = 20;
                                    }
                                } else if (y < h - 1 && x < w - 1 && !table(x + 1, y + 1).isWall()) {
                                    mapId = 19;
                                }
                            } else if (mapId == 0) {
                                if (y < h - 1 && x < w - 1 && !table(x + 1, y + 1).isWall()) {
                                    mapId = 10;
                                }
                            } else if (mapId == 2) {
                                if (y < h - 1 && x > 0 && !table(x - 1, y + 1).isWall()) {
                                    mapId = 11;
                                }
                            } else if (mapId == 3) {
                                if (y < h - 1 && x < w - 1 && !table(x + 1, y + 1).isWall()) {
                                    mapId = 16;
                                }
                            } else if (mapId == 5) {
                                if (y < h - 1 && x > 0 && !table(x - 1, y + 1).isWall()) {
                                    mapId = 17;
                                }
                            }
                            map[y][x] = mapId;
                        } else {
                            map[y][x] = 4;
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
