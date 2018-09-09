var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (Model) {
        var DungeonObject = (function () {
            function DungeonObject() {
                this.category = 0;
                this.cell = null;
                this.type = null;
                this.layer = null;
                this.dir = 0;
                this.name = null;
                this.id = DungeonObject.currentId;
                DungeonObject.currentId++;
            }
            DungeonObject.prototype.event = function (action) {
                return [];
            };

            DungeonObject.prototype.isPlayer = function () {
                return this.id == ShizimilyRogue.Common.PLAYER_ID;
            };
            DungeonObject.prototype.isUnit = function () {
                return this.type == 4 /* Unit */;
            };
            DungeonObject.prototype.isWall = function () {
                return this.type == 1 /* Wall */;
            };
            DungeonObject.prototype.isRoom = function () {
                return this.type == 3 /* Room */;
            };
            DungeonObject.prototype.isPath = function () {
                return this.type == 2 /* Path */;
            };
            DungeonObject.prototype.isItem = function () {
                return this.type == 5 /* Item */;
            };
            DungeonObject.prototype.isNull = function () {
                return this.type == 0 /* Null */;
            };
            DungeonObject.prototype.isStairs = function () {
                return this.type == 6 /* Stairs */;
            };
            DungeonObject.prototype.isTrap = function () {
                return this.type == 7 /* Trap */;
            };
            DungeonObject.currentId = 1;
            return DungeonObject;
        })();
        Model.DungeonObject = DungeonObject;

        var DungeonManager = (function () {
            function DungeonManager(w, h) {
                this._currentUnit = null;
                this._objects = [];
                this.scheduler = new ROT.Scheduler.Speed();
                this._endState = 0 /* None */;
                this.actionQueue = [];
                this.map = new Map(w, h);
            }
            DungeonManager.prototype.init = function () {
                var actions = [];

                // Player作成
                var player = new Player("しじみりちゃん");
                actions.unshift(this.addObject(player));

                // 出口作成
                var exit = new Stairs();
                actions.unshift(this.addObject(exit));
                for (var i = 0; i < 5; i++) {
                    var ignore = new Model.Data.Ignore;
                    actions.unshift(this.addObject(ignore));
                }
                for (var i = 0; i < 10; i++) {
                    var sweet = Model.Data.ItemFactory.getItem();
                    actions.unshift(this.addObject(sweet));
                }

                // 配置
                this.addInput(actions);
                while (this.hasNext()) {
                    this.update();
                }
                ;
                return actions;
            };

            DungeonManager.prototype.addObject = function (data, coord) {
                if (typeof coord === "undefined") { coord = null; }
                if (coord == null) {
                    coord = this.map.getRandomPoint(data.layer);
                }
                return ShizimilyRogue.Common.Action.Drop(data, coord);
            };

            DungeonManager.prototype.setObject = function (obj, coord) {
                var _this = this;
                if (this.map.setObject(obj, coord)) {
                    this._objects.push(obj);
                    if (obj.isUnit()) {
                        var unit = obj;
                        unit.getFov = function () {
                            return _this.getFOV(unit);
                        };
                        this.scheduler.add(obj, true);
                    }
                    return true;
                } else {
                    return false;
                }
            };
            DungeonManager.prototype.deleteObject = function (obj) {
                if (this.map.deleteObject(obj)) {
                    for (var i = 0; i < this._objects.length; i++) {
                        if (this._objects[i].id == obj.id) {
                            this._objects.splice(i, 1);
                            break;
                        }
                    }
                    if (obj.isUnit()) {
                        var unit = obj;
                        unit.getFov = null;
                        this.scheduler.remove(obj);
                    }
                    return true;
                } else {
                    return false;
                }
            };

            DungeonManager.prototype.dropObject = function (obj, coord) {
                coord = this.map.drop(obj, coord);
                if (coord != null) {
                    return this.setObject(obj, coord);
                } else {
                    return false;
                }
            };

            DungeonManager.prototype.getRandomPoint = function (layer) {
                return this.map.getRandomPoint(layer);
            };

            DungeonManager.prototype.moveObject = function (obj, dir) {
                return this.map.moveObject(obj, dir);
            };

            Object.defineProperty(DungeonManager.prototype, "currentTurn", {
                get: function () {
                    return this.hasNext() ? null : this._currentUnit;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DungeonManager.prototype, "endState", {
                get: function () {
                    return this._endState;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DungeonManager.prototype, "objects", {
                get: function () {
                    return this._objects;
                },
                enumerable: true,
                configurable: true
            });

            DungeonManager.prototype.getCell = function (x, y) {
                return this.map.getCell(x, y);
            };

            DungeonManager.prototype.getObject = function (coord, layer) {
                return this.map.getObject(coord, layer);
            };

            DungeonManager.prototype.getFOV = function (unit) {
                return this.map.getFOV(unit);
            };

            DungeonManager.prototype.addInput = function (actions, sender) {
                if (typeof sender === "undefined") { sender = this._currentUnit; }
                for (var i = 0; i < actions.length; i++) {
                    var action = actions[i];
                    this.process(sender, action);
                    if (ShizimilyRogue.Common.DEBUG) {
                        ShizimilyRogue.Common.Debug.result(action);
                    }
                    this.actionQueue.unshift(action);
                }
            };

            DungeonManager.prototype.hasNext = function () {
                return this.actionQueue.length > 0;
            };

            /**
            * 次の行動を行う
            * @return {Common.Action} 行動したAction
            */
            DungeonManager.prototype.update = function () {
                var action = this.actionQueue[0];
                try  {
                    if (action.end != 0 /* None */) {
                        this._endState = action.end;
                        return action;
                    }

                    action.targetIndex++;
                    var receiver = action.target;
                    if (action.targetIndex == action.targets.length - 1) {
                        // 現在のキューのターゲットが空になったので次のキューへ
                        this.actionQueue.shift();
                    }

                    if (action.isSystem()) {
                        this.addInput(DungeonManager.systemAction(this, action));
                    }
                    this.addInput(receiver.event(action), receiver);

                    // キューが0になったら
                    if (this.actionQueue.length == 0) {
                        // 次に行動するユニットのアクションを取り出す
                        this._currentUnit = this.scheduler.next();
                        var fov = this.getFOV(this._currentUnit);
                        this.addInput(this._currentUnit.phase());
                    }
                } catch (e) {
                    if (ShizimilyRogue.Common.DEBUG) {
                        ShizimilyRogue.Common.Debug.message(e.message);
                    }
                } finally {
                    if (this.actionQueue.length == 0) {
                        if (ShizimilyRogue.Common.DEBUG) {
                            ShizimilyRogue.Common.Debug.message("------- Turn End --------");
                        }
                    }
                }
                return action;
            };

            /**
            * Actionに必要な情報を付加して完全な形にする
            * @param {Common.IObject} sender Actionの送信元
            * @param {Common.Action} action 元となるAction
            */
            DungeonManager.prototype.process = function (sender, action) {
                var _this = this;
                var targets = [];
                var obj;
                switch (action.type) {
                    case 0 /* Attack */:
                        if (sender.isUnit()) {
                            var unit = sender;
                            action.param = unit.atk;
                            if (unit.weapon != null) {
                                unit.weapon.onAttack(action);
                            }
                        }
                        break;
                }

                switch (action.targetType) {
                    case 0 /* Me */:
                        targets = [sender];
                        break;
                    case 1 /* Next */:
                        var coord = DungeonManager.getDst(sender, sender.dir);
                        targets = [this.map.getObject(coord, sender.layer)];
                        break;
                    case 2 /* Line */:
                        obj = DungeonManager.getLine(function (x, y) {
                            return _this.getCell(x, y);
                        }, sender, sender.dir, 10);
                        targets = [obj];
                        break;
                    case 3 /* FarLine */:
                        obj = DungeonManager.getLine(function (x, y) {
                            return _this.getCell(x, y);
                        }, sender, sender.dir, 100);
                        targets = [obj];
                        break;
                    case 4 /* Target */:
                        targets = action.targets;
                        break;
                    case 6 /* System */:
                        targets = action.targets;
                        if (action.isMove()) {
                            targets = [sender];
                        }
                        break;
                    case 5 /* Item */:
                        targets = [action.item];
                        break;
                    case 9 /* RoomUnit */:
                        var fov = this.getFOV(sender);
                        targets = [];
                        if (action.sender != null) {
                            sender = action.sender;
                        }
                        fov.objects.forEach(function (v) {
                            if (v.isUnit() && v.id != sender.id) {
                                targets.push(v);
                            }
                        });
                        break;
                    case 7 /* Ground */:
                        targets = [this.getCell(sender.cell.coord.x, sender.cell.coord.y).ground];
                        break;
                    case 8 /* Unit */:
                        targets = [this.getCell(sender.cell.coord.x, sender.cell.coord.y).unit];
                        break;
                }
                action.sender = sender;
                action.targets = targets;
            };

            /**
            * システムアクション(マップの移動など)
            * @param {MapController} map マップコントローラクラス
            * @param {Common.Action} action Action本体
            * @return {Common.Action[]} 次のアクション
            */
            DungeonManager.systemAction = function (map, action) {
                var actions = [];
                if (action.isMove()) {
                    map.moveObject(action.sender, action.sender.dir);
                } else if (action.isDrop()) {
                    var object = action.targets[0];
                    map.dropObject(object, action.coord);
                } else if (action.isSet()) {
                    var object = action.targets[0];
                    map.setObject(object, action.coord);
                } else if (action.isDelete()) {
                    var object = action.targets[0];
                    map.deleteObject(object);
                } else if (action.isSwap()) {
                    var coord0 = action.targets[0].cell.coord;
                    var coord1 = action.targets[1].cell.coord;
                    map.deleteObject(action.targets[0]);
                    map.deleteObject(action.targets[1]);
                    map.setObject(action.targets[0], coord1);
                    map.setObject(action.targets[1], coord0);
                }
                return actions;
            };

            DungeonManager.getLine = function (table, obj, dir, distance) {
                var x = obj.cell.coord.x;
                var y = obj.cell.coord.y;
                for (var i = 0; i < distance; i++) {
                    x += ROT.DIRS[8][dir][0];
                    y += ROT.DIRS[8][dir][1];
                    if (table(x, y).isUnit()) {
                        return table(x, y).unit;
                    } else if (table(x + ROT.DIRS[8][dir][0], y + ROT.DIRS[8][dir][1]).isWall()) {
                        return table(x, y).unit;
                    }
                }
                return table(x, y).unit;
            };

            DungeonManager.getDst = function (obj, dir) {
                var x = obj.cell.coord.x + ROT.DIRS[8][dir][0];
                var y = obj.cell.coord.y + ROT.DIRS[8][dir][1];
                return new ShizimilyRogue.Common.Coord(x, y);
            };
            return DungeonManager;
        })();
        Model.DungeonManager = DungeonManager;

        var FOVData = (function () {
            function FOVData(me, width, height, getCell, getCellByCoord, area, movable, objects, attackable) {
                var _this = this;
                this.me = me;
                this.width = width;
                this.height = height;
                this.getCell = getCell;
                this.getCellByCoord = getCellByCoord;
                this.area = area;
                this.movable = movable;
                this.objects = objects;
                this.attackable = attackable;
                this.visible = {};
                this.id2index = {};
                var index = 0;
                objects.forEach(function (obj) {
                    _this.visible[obj.id] = true;
                    _this.id2index[obj.id] = index;
                    index++;
                });
                this.visible[me.id] = true;
            }
            FOVData.prototype.isVisible = function (id) {
                return this.visible[id] == true;
            };
            FOVData.prototype.isAttackable = function (id) {
                return this.attackable[id] == true;
            };
            FOVData.prototype.getObjectById = function (id) {
                return this.objects[this.id2index[id]];
            };
            return FOVData;
        })();

        var Stairs = (function (_super) {
            __extends(Stairs, _super);
            function Stairs() {
                _super.apply(this, arguments);
                this.category = 2;
                this.type = 6 /* Stairs */;
                this.layer = 1 /* Ground */;
                this.name = "Stairs";
            }
            return Stairs;
        })(DungeonObject);

        var Wall = (function (_super) {
            __extends(Wall, _super);
            function Wall() {
                _super.apply(this, arguments);
                this.type = 1 /* Wall */;
                this.layer = 1 /* Ground */;
                this.name = "Wall";
            }
            return Wall;
        })(DungeonObject);

        var Room = (function (_super) {
            __extends(Room, _super);
            function Room() {
                _super.apply(this, arguments);
                this.type = 3 /* Room */;
                this.layer = 0 /* Floor */;
                this.name = "Room";
            }
            return Room;
        })(DungeonObject);

        var Path = (function (_super) {
            __extends(Path, _super);
            function Path() {
                _super.apply(this, arguments);
                this.type = 2 /* Path */;
                this.layer = 0 /* Floor */;
                this.name = "Pass";
            }
            return Path;
        })(DungeonObject);

        var Null = (function (_super) {
            __extends(Null, _super);
            function Null() {
                _super.apply(this, arguments);
                this.type = 0 /* Null */;
                this.id = -1;
                this.name = "Null";
            }
            Null.prototype.event = function (action) {
                if (action.isFly()) {
                    return [ShizimilyRogue.Common.Action.Drop(action.sender, this.cell.coord)];
                }
                return [];
            };
            return Null;
        })(DungeonObject);

        /**
        * アイテムデータ
        */
        var Item = (function (_super) {
            __extends(Item, _super);
            /**
            * @constructor
            */
            function Item(category, name) {
                _super.call(this);
                this.category = category;
                this.name = name;
                this.type = 5 /* Item */;
                this.status = 0 /* Normal */;
                this.unknownName = null;
                this.layer = 1 /* Ground */;
            }
            /**
            * コマンドリストの取得
            * @param {Common.IFOVData} fov 司会情報
            * @return {string[]} コマンドリスト
            */
            Item.prototype.commands = function () {
                var list = ["使う", "投げる"];
                if (!this.cell.ground.isItem()) {
                    list.push("置く");
                }
                return list;
            };

            /**
            *
            * @param {number} n 選択番号
            */
            Item.prototype.select = function (n, items) {
                switch (n) {
                    case 0:
                        return ShizimilyRogue.Common.Action.Use(this);
                    case 1:
                        return ShizimilyRogue.Common.Action.Throw(this);
                    case 2:
                        return ShizimilyRogue.Common.Action.Place(this);
                }
            };

            Item.prototype.event = function (action) {
                var unit = action.sender;
                if (action.isPick()) {
                    unit.inventory.push(this);
                    return [ShizimilyRogue.Common.Action.Delete(this)];
                } else if (action.isPlace()) {
                    unit.takeInventory(this);
                    return [ShizimilyRogue.Common.Action.Drop(this, unit.cell.coord)];
                } else if (action.isUse()) {
                    return this.use(action, unit);
                } else if (action.isThrow()) {
                    unit.takeInventory(this);
                    this.dir = unit.dir;
                    this.cell = unit.cell;
                    var action = ShizimilyRogue.Common.Action.Fly(unit.cell.coord);
                    return [action];
                }
                return [];
            };

            Item.prototype.use = function (action, unit) {
                return [];
            };
            return Item;
        })(DungeonObject);
        Model.Item = Item;

        /**
        * PCケース
        */
        var Case = (function (_super) {
            __extends(Case, _super);
            function Case(baseName) {
                _super.call(this, 6 /* Case */, baseName);
                this.baseName = baseName;
                this.maxItems = Math.floor(ROT.RNG.getUniform() * 6);
                this.innerItems = [];
            }
            Case.prototype.commands = function () {
                var list = ["見る", "入れる", "投げる"];
                if (!this.cell.ground.isItem()) {
                    list.push("置く");
                }
                return list;
            };

            Object.defineProperty(Case.prototype, "name", {
                get: function () {
                    return this.baseName + " [" + (this.maxItems - this.innerItems.length) + "]";
                },
                enumerable: true,
                configurable: true
            });

            Case.prototype.select = function (n, items) {
                switch (n) {
                    case 0:
                        return ShizimilyRogue.Common.Action.Use(this, items);
                    case 1:
                        return ShizimilyRogue.Common.Action.Use(this, items);
                    case 2:
                        return ShizimilyRogue.Common.Action.Throw(this);
                    case 3:
                        return ShizimilyRogue.Common.Action.Place(this);
                }
            };

            Case.prototype.use = function (action, unit) {
                var _this = this;
                var targetItems = action.targetItems;
                var type = action.subType;
                if (this.isInserted(targetItems[0])) {
                    if (this.innerItems.length + targetItems.length <= this.maxItems) {
                        targetItems.forEach(function (item) {
                            _this.takeItem(item);
                            unit.addInventory(item);
                        });
                    } else {
                        return [ShizimilyRogue.Common.Action.Fail(0 /* CaseOver */)];
                    }
                } else {
                    if (this.innerItems.length + targetItems.length <= this.maxItems) {
                        targetItems.forEach(function (item) {
                            if (item != _this) {
                                unit.takeInventory(item);
                                _this.addItem(item);
                            }
                        });
                    } else {
                        return [ShizimilyRogue.Common.Action.Fail(0 /* CaseOver */)];
                    }
                }
                return [];
            };

            Case.prototype.addItem = function (item) {
                if (this.innerItems.length < this.maxItems && item.category != 6 /* Case */) {
                    this.innerItems.push(item);
                    return true;
                } else {
                    return false;
                }
            };

            Case.prototype.takeItem = function (item) {
                for (var i = 0; i < this.innerItems.length; i++) {
                    if (this.innerItems[i].id == item.id) {
                        this.innerItems.splice(i, 1);
                        return true;
                    }
                }
                return false;
            };

            Case.prototype.isInserted = function (item) {
                for (var i = 0; i < this.innerItems.length; i++) {
                    if (this.innerItems[i].id == item.id) {
                        return true;
                    }
                }
                return false;
            };
            return Case;
        })(Item);
        Model.Case = Case;

        /**
        * DVD
        */
        var DVD = (function (_super) {
            __extends(DVD, _super);
            function DVD(name) {
                _super.call(this, 5 /* DVD */, name);
            }
            DVD.prototype.use = function (action, unit) {
                unit.takeInventory(this);
                return [action];
            };
            return DVD;
        })(Item);
        Model.DVD = DVD;

        /**
        * SDCard
        */
        var SDCard = (function (_super) {
            __extends(SDCard, _super);
            function SDCard(name) {
                _super.call(this, 5 /* DVD */, name);
                this.num = Math.floor(ROT.RNG.getUniform() * 5) + 2;
            }
            SDCard.prototype.use = function (action, unit) {
                this.num--;
                return [action];
            };
            return SDCard;
        })(Item);
        Model.SDCard = SDCard;

        /**
        * 装備品
        */
        var Equip = (function (_super) {
            __extends(Equip, _super);
            function Equip() {
                _super.apply(this, arguments);
                this.plus = Math.floor(ROT.RNG.getUniform() * 4) - 1;
            }
            //mark: Common.Mark[] = [];
            /**
            * コマンドリストの取得
            * @param {Common.IFOVData} fov 司会情報
            * @return {string[]} コマンドリスト
            */
            Equip.prototype.commands = function () {
                var list = ["装備", "投げる"];
                if (!this.cell.ground.isItem()) {
                    list.push("置く");
                }
                return list;
            };

            /**
            *
            * @param {number} n 選択番号
            */
            Equip.prototype.select = function (n, items) {
                switch (n) {
                    case 0:
                        return ShizimilyRogue.Common.Action.Use(this);
                    case 1:
                        return ShizimilyRogue.Common.Action.Throw(this);
                    case 2:
                        return ShizimilyRogue.Common.Action.Place(this);
                }
            };
            return Equip;
        })(Item);
        Model.Equip = Equip;

        /**
        * Weapon
        */
        var Weapon = (function (_super) {
            __extends(Weapon, _super);
            function Weapon() {
                _super.call(this, 0 /* CPU */, "Weapon");
                this.isHeavy = false;
            }
            Object.defineProperty(Weapon.prototype, "atk", {
                get: function () {
                    return ShizimilyRogue.Common.GuardDef(this.baseParam, this.plus);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Weapon.prototype, "name", {
                get: function () {
                    return this.baseName + " " + (this.plus * 100) + "MHz";
                },
                enumerable: true,
                configurable: true
            });

            Weapon.prototype.use = function (action, unit) {
                var player = action.sender;
                if (player.weapon == this) {
                    player.weapon = null;
                } else {
                    player.weapon = this;
                }
                return [];
            };

            /**
            * 攻撃時processで呼ばれる
            */
            Weapon.prototype.onAttack = function (action) {
            };
            return Weapon;
        })(Equip);
        Model.Weapon = Weapon;

        /**
        * Guard
        */
        var Guard = (function (_super) {
            __extends(Guard, _super);
            function Guard() {
                _super.call(this, 1 /* GraphicBoard */, "Guard");
                this.isHeavy = false;
            }
            Object.defineProperty(Guard.prototype, "def", {
                get: function () {
                    return ShizimilyRogue.Common.GuardDef(this.baseParam, this.plus);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Guard.prototype, "utsuDef", {
                get: function () {
                    return ShizimilyRogue.Common.GuardUtsuDef(this.utsuParam, this.plus);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Guard.prototype, "name", {
                get: function () {
                    return this.baseName + " Rev." + (this.plus);
                },
                enumerable: true,
                configurable: true
            });

            Guard.prototype.use = function (action, unit) {
                var player = action.sender;
                if (player.guard == this) {
                    player.guard = null;
                } else {
                    player.guard = this;
                }
                return [];
            };

            /**
            * ステータス変更時eventで呼ばれる
            */
            Guard.prototype.onStatus = function (action) {
                return [];
            };
            return Guard;
        })(Equip);
        Model.Guard = Guard;

        /**
        * Accessory
        */
        var Accessory = (function (_super) {
            __extends(Accessory, _super);
            function Accessory() {
                _super.call(this, 6 /* Case */, "Accessory");
            }
            Accessory.prototype.use = function (action, unit) {
                var player = action.sender;
                player.accessory = this;
                return [];
            };

            /**
            * ステータス変更時eventで呼ばれる
            */
            Accessory.prototype.onEvent = function (action) {
                return [];
            };
            return Accessory;
        })(Equip);
        Model.Accessory = Accessory;

        /**
        * ユニット
        */
        var Unit = (function (_super) {
            __extends(Unit, _super);
            function Unit(name) {
                _super.call(this);
                this.name = name;
                this.lv = 1;
                this.weapon = null;
                this.guard = null;
                this.accessory = null;
                this.layer = 2 /* Unit */;
                this.type = 4 /* Unit */;
                this.category = 0;
                this.dir = 0;
                this.maxHp = 100;
                this.maxUtsu = 100;
                this.hp = this.maxHp;
                this.utsu = this.maxUtsu;
                this.speed = 100 /* NORMAL */;
                this.turn = 0;
                this.inventory = [];
                this.maxInventory = 10;
                this.currentExp = 0;
                this.stomach = 100;
                this.maxStomach = 100;
                // 状態異常系
                this.sleepTurn = -1;
                this.confuseTurn = -1;
                this.senselessTurn = -1;
            }
            Object.defineProperty(Unit.prototype, "atk", {
                get: function () {
                    return this.weapon == null ? ShizimilyRogue.Common.Parameter.Atk : this.weapon.atk;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Unit.prototype, "def", {
                get: function () {
                    return this.guard == null ? ShizimilyRogue.Common.Parameter.Atk : this.guard.def;
                },
                enumerable: true,
                configurable: true
            });

            Unit.prototype.isSleep = function () {
                return this.sleepTurn >= this.turn;
            };
            Unit.prototype.isConfuse = function () {
                return this.confuseTurn >= this.turn;
            };
            Unit.prototype.isSenseless = function () {
                return this.senselessTurn >= this.turn;
            };
            Unit.prototype.isNormal = function () {
                return !this.isSleep() && !this.isSenseless() && !this.isConfuse();
            };
            Unit.prototype.setSleep = function (turn) {
                this.sleepTurn = this.turn + turn;
            };
            Unit.prototype.setConfuse = function (turn) {
                this.confuseTurn = this.turn + turn;
            };
            Unit.prototype.setSenseless = function (turn) {
                this.senselessTurn = this.turn + turn;
            };

            Unit.prototype.getSpeed = function () {
                return this.speed;
            };

            Unit.prototype.setDir = function (dir) {
                this.dir = dir;
            };

            Unit.prototype.phase = function () {
                return [];
            };

            Unit.prototype.event = function (action) {
                var ret = [];
                if (this.accessory != null) {
                    ret = ret.concat(this.accessory.onEvent(action));
                }

                if (action.isAttack()) {
                    if (action.sender.isUnit()) {
                        var damage = ShizimilyRogue.Common.Damage(action.param, this.def);
                        ret.push(ShizimilyRogue.Common.Action.Status(this, 0 /* Damage */, damage));
                    }
                } else if (action.isSkill()) {
                    if (action.sender.isUnit()) {
                        if (action.subType == 1 /* Confuse */) {
                            ret.push(ShizimilyRogue.Common.Action.Status(this, 7 /* Confuse */, ShizimilyRogue.Common.Parameter.ConfuseTurn));
                        } else if (action.subType == 0 /* Sleep */) {
                            ret.push(ShizimilyRogue.Common.Action.Status(this, 6 /* Sleep */, ShizimilyRogue.Common.Parameter.SleepTurn));
                        } else if (action.subType == 2 /* Senseless */) {
                            ret.push(ShizimilyRogue.Common.Action.Status(this, 8 /* Senseless */, ShizimilyRogue.Common.Parameter.SenselessTurn));
                        }
                    }
                } else if (action.isFly()) {
                    if (action.sender.isItem()) {
                        ret.push(ShizimilyRogue.Common.Action.Use(action.sender));
                    }
                } else if (action.isStatus()) {
                    if (this.guard != null) {
                        ret = ret.concat(this.guard.onStatus(action));
                    }
                    ret = ret.concat(this.statusChange(action));
                } else if (action.isDie()) {
                    var nextAction = ShizimilyRogue.Common.Action.Delete(this);
                    if (action.sender.isPlayer()) {
                        nextAction.end = 3 /* GameOver */;
                    }
                    ret.push(nextAction);
                }
                return ret;
            };

            Unit.prototype.statusChange = function (action) {
                var amount = action.param;
                if (action.subType == 0 /* Damage */) {
                    return this.damage(amount);
                } else if (action.subType == 1 /* Heal */) {
                    this.hp += (this.hp + amount) > this.maxHp ? (this.maxHp - this.hp) : amount;
                } else if (action.subType == 2 /* Hunger */) {
                    if (amount > this.stomach) {
                        this.stomach = 0;
                        var damage = ShizimilyRogue.Common.HungerDamage(this.maxHp);
                        return this.damage(damage);
                    } else {
                        this.stomach -= amount;
                    }
                } else if (action.subType == 3 /* Full */) {
                    var full = action.param;
                    this.stomach += (this.stomach + full) > this.maxStomach ? (this.maxStomach - this.stomach) : full;
                } else if (action.subType == 6 /* Sleep */) {
                    this.setSleep(action.param);
                } else if (action.subType == 7 /* Confuse */) {
                    this.setConfuse(action.param);
                } else if (action.subType == 8 /* Senseless */) {
                    this.setSenseless(action.param);
                }
                return [];
            };

            Unit.prototype.addInventory = function (item) {
                if (this.inventory.length < this.maxInventory) {
                    this.inventory.push(item);
                    return true;
                } else {
                    return false;
                }
            };

            Unit.prototype.takeInventory = function (item) {
                for (var i = 0; i < this.inventory.length; i++) {
                    if (this.inventory[i].id == item.id) {
                        this.inventory.splice(i, 1);
                        return true;
                    }
                }
                return false;
            };

            Unit.prototype.damage = function (amount) {
                this.hp -= amount > this.hp ? this.hp : amount;
                if (this.hp <= 0) {
                    var action = ShizimilyRogue.Common.Action.Die();
                    return [action];
                }
                return [];
            };

            Unit.prototype.getRandomWalk = function (fov) {
                var dirs = [];
                fov.movable.map(function (value, index, array) {
                    if (value)
                        dirs.push(index);
                });
                this.dir = Math.floor(dirs.length * ROT.RNG.getUniform());
                var action = ShizimilyRogue.Common.Action.Move();
                return action;
            };

            Unit.prototype.heal = function (amount) {
            };
            return Unit;
        })(DungeonObject);
        Model.Unit = Unit;

        var Player = (function (_super) {
            __extends(Player, _super);
            function Player(name) {
                _super.call(this, name);
                this.id = ShizimilyRogue.Common.PLAYER_ID;
                this.maxHp = 1000;
                this.hp = 1000;
            }
            Player.prototype.event = function (action) {
                var ret = _super.prototype.event.call(this, action);
                if (action.isMove()) {
                    if (this.cell.isItem()) {
                        return [ShizimilyRogue.Common.Action.Pick()];
                    }
                }
                return ret;
            };

            Player.prototype.phase = function () {
                this.turn++;
                if (this.turn % ShizimilyRogue.Common.Parameter.StomachDecrease == 0) {
                    this.stomach--;
                }
                if (this.isSenseless() || this.isSleep()) {
                    //睡眠または気絶中
                    return [ShizimilyRogue.Common.Action.None()];
                } else if (this.isConfuse()) {
                    var fov = this.getFov();
                    var action = this.getRandomWalk(fov);

                    //混乱中
                    return [action];
                }
                return [];
            };
            return Player;
        })(Unit);

        var Enemy = (function (_super) {
            __extends(Enemy, _super);
            function Enemy() {
                _super.apply(this, arguments);
                this.category = 0;
                this.exp = 100;
                this.dropProbability = 10;
                this.awakeProbabilityWhenAppear = 100;
                this.awakeProbabilityWhenEnterRoom = 100;
                this.awakeProbabilityWhenNeighbor = 100;
                this.hp = this.maxHp;
                this.lastMe = null;
                this.lastPlayer = null;
            }
            Enemy.prototype.phase = function () {
                this.turn++;
                var fov = this.getFov();
                if (this.isSenseless() || this.isSleep()) {
                    //睡眠または気絶中
                    return [ShizimilyRogue.Common.Action.None()];
                } else if (this.isConfuse()) {
                    var action = this.getRandomWalk(fov);

                    //混乱中
                    return [action];
                }

                var me = fov.me.cell.coord;
                var player = null;
                var action = null;
                for (var i = 0; i < fov.objects.length; i++) {
                    if (fov.objects[i].isPlayer()) {
                        player = fov.objects[i].cell.coord;
                        break;
                    }
                }

                if (player != null) {
                    // 視界内にプレイヤーがいた
                    if (fov.isAttackable(ShizimilyRogue.Common.PLAYER_ID)) {
                        this.dir = Enemy.getAttackDir(this.cell.coord, player);
                        action = ShizimilyRogue.Common.Action.Attack();
                    } else {
                        var dir = Enemy.move(me, player, this.lastMe, fov);
                        if (dir != null) {
                            this.dir = dir;
                            action = ShizimilyRogue.Common.Action.Move();
                        }
                    }
                } else {
                    var dir = Enemy.move(me, this.lastPlayer, this.lastMe, fov);
                    if (dir != null) {
                        this.dir = dir;
                        action = ShizimilyRogue.Common.Action.Move();
                    }
                }

                if (action == null) {
                    action = this.getRandomWalk(fov);
                }
                this.lastPlayer = player;
                this.lastMe = me;
                return [action];
            };

            Enemy.prototype.event = function (action) {
                var _this = this;
                var ret = _super.prototype.event.call(this, action);
                var fov = this.getFov();
                fov.objects.forEach(function (obj) {
                    if (obj.isPlayer()) {
                        _this.lastPlayer = obj.cell.coord;
                    }
                });
                return ret;
            };

            Enemy.getAttackDir = function (src, dst, neighbor) {
                if (typeof neighbor === "undefined") { neighbor = true; }
                var diffX = dst.x - src.x;
                var diffY = dst.y - src.y;

                if (diffX == 0 && diffY > 0) {
                    return 4 /* DOWN */;
                } else if (diffX == 0 && diffY < 0) {
                    return 0 /* UP */;
                } else if (diffX > 0 && diffY == 0) {
                    return 2 /* RIGHT */;
                } else if (diffX < 0 && diffY == 0) {
                    return 6 /* LEFT */;
                } else if (diffX > 0 && diffY > 0) {
                    return 3 /* DOWN_RIGHT */;
                } else if (diffX > 0 && diffY < 0) {
                    return 1 /* UP_RIGHT */;
                } else if (diffX < 0 && diffY > 0) {
                    return 5 /* DOWN_LEFT */;
                } else if (diffX < 0 && diffY < 0) {
                    return 7 /* UP_LEFT */;
                }
                return null;
            };

            Enemy.move = function (me, player, lastMe, fov) {
                // 移動AI
                var dir = null;
                var inRoom = fov.getCell(me).isRoom();

                if (!inRoom) {
                    // 通路の時
                    if (player != null) {
                        //プレイヤーを探す
                        dir = Enemy.getDir(me, player, fov.movable);
                    } else if (lastMe != null) {
                        // そのまま進む
                        dir = Enemy.getDir(lastMe, me, fov.movable);
                    }
                } else {
                    // 部屋の時
                    if (player != null) {
                        // プレイヤーを探す
                        dir = Enemy.getDir(me, player, fov.movable);
                    } else {
                        var enter = [];

                        for (var i = 0; i < fov.area.length; i++) {
                            var place = fov.area[i];
                            if (fov.getCell(place).isPath()) {
                                enter.push(place);
                            }
                        }
                        if (enter.length > 0) {
                            var id = Math.floor(enter.length * ROT.RNG.getUniform());
                            dir = Enemy.getDir(me, enter[id], fov.movable);
                        }
                    }
                }
                return dir;
            };

            Enemy.getDir = function (me, target, movable) {
                var vecX = target.x - me.x;
                var vecY = target.y - me.y;

                var cand;
                if (vecX == 0 && vecY > 0) {
                    cand = Enemy.CANDIDATE[4 /* DOWN */];
                } else if (vecX > 0 && vecY > 0) {
                    cand = Enemy.CANDIDATE[3 /* DOWN_RIGHT */];
                } else if (vecX > 0 && vecY == 0) {
                    cand = Enemy.CANDIDATE[2 /* RIGHT */];
                } else if (vecX > 0 && vecY < 0) {
                    cand = Enemy.CANDIDATE[1 /* UP_RIGHT */];
                } else if (vecX == 0 && vecY < 0) {
                    cand = Enemy.CANDIDATE[0 /* UP */];
                } else if (vecX < 0 && vecY < 0) {
                    cand = Enemy.CANDIDATE[7 /* UP_LEFT */];
                } else if (vecX < 0 && vecY == 0) {
                    cand = Enemy.CANDIDATE[6 /* LEFT */];
                } else if (vecX < 0 && vecY > 0) {
                    cand = Enemy.CANDIDATE[5 /* DOWN_LEFT */];
                } else if (vecX == 0 && vecY == 0) {
                    return null;
                }

                for (var i = 0; i < cand.length; i++) {
                    if (movable[cand[i]]) {
                        return cand[i];
                    }
                }
            };
            Enemy.CANDIDATE = [
                [0 /* UP */, 1 /* UP_RIGHT */, 7 /* UP_LEFT */, 2 /* RIGHT */, 6 /* LEFT */],
                [1 /* UP_RIGHT */, 2 /* RIGHT */, 0 /* UP */, 3 /* DOWN_RIGHT */, 7 /* UP_LEFT */],
                [2 /* RIGHT */, 3 /* DOWN_RIGHT */, 1 /* UP_RIGHT */, 4 /* DOWN */, 0 /* UP */],
                [3 /* DOWN_RIGHT */, 4 /* DOWN */, 2 /* RIGHT */, 5 /* DOWN_LEFT */, 1 /* UP_RIGHT */],
                [4 /* DOWN */, 5 /* DOWN_LEFT */, 3 /* DOWN_RIGHT */, 6 /* LEFT */, 2 /* RIGHT */],
                [5 /* DOWN_LEFT */, 6 /* LEFT */, 4 /* DOWN */, 7 /* UP_LEFT */, 3 /* DOWN_RIGHT */],
                [6 /* LEFT */, 7 /* UP_LEFT */, 5 /* DOWN_LEFT */, 0 /* UP */, 4 /* DOWN */],
                [7 /* UP_LEFT */, 0 /* UP */, 6 /* LEFT */, 1 /* UP_RIGHT */, 5 /* DOWN_LEFT */]
            ];
            return Enemy;
        })(Unit);
        Model.Enemy = Enemy;

        var Cell = (function () {
            function Cell(coord) {
                this._objects = new Array(5 /* MAX */);
                this._coord = coord;
                for (var layer = 0; layer < 5 /* MAX */; layer++)
                    this.del(layer);
            }
            Cell.prototype.del = function (layer) {
                this._objects[layer] = new Null();
                this._objects[layer].cell = this;
            };

            Object.defineProperty(Cell.prototype, "object", {
                set: function (obj) {
                    this._objects[obj.layer] = obj;
                    obj.cell = this;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Cell.prototype, "objects", {
                get: function () {
                    return this._objects;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Cell.prototype, "coord", {
                get: function () {
                    return this._coord;
                },
                enumerable: true,
                configurable: true
            });

            Cell.prototype.isPlayer = function () {
                return this._objects[2 /* Unit */].isPlayer();
            };
            Cell.prototype.isUnit = function () {
                return this._objects[2 /* Unit */].isUnit();
            };
            Cell.prototype.isItem = function () {
                return this._objects[1 /* Ground */].isItem();
            };
            Cell.prototype.isTrap = function () {
                return this._objects[1 /* Ground */].isTrap();
            };
            Cell.prototype.isExit = function () {
                return this._objects[1 /* Ground */].isStairs();
            };
            Cell.prototype.isWall = function () {
                return this._objects[1 /* Ground */].isWall();
            };
            Cell.prototype.isRoom = function () {
                return this._objects[0 /* Floor */].isRoom();
            };
            Cell.prototype.isPath = function () {
                return this._objects[0 /* Floor */].isPath();
            };
            Cell.prototype.isNull = function (layer) {
                return this._objects[layer].isNull();
            };

            Object.defineProperty(Cell.prototype, "unit", {
                get: function () {
                    return this._objects[2 /* Unit */];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Cell.prototype, "item", {
                get: function () {
                    return this._objects[1 /* Ground */];
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Cell.prototype, "floor", {
                get: function () {
                    return this._objects[0 /* Floor */];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Cell.prototype, "ground", {
                get: function () {
                    return this._objects[1 /* Ground */];
                },
                enumerable: true,
                configurable: true
            });
            return Cell;
        })();

        var Map = (function () {
            function Map(w, h) {
                var _this = this;
                this.width = w;
                this.height = h;
                this.map = new Array(h);
                for (var y = 0; y < h; y++) {
                    this.map[y] = new Array(w);
                    for (var x = 0; x < w; x++) {
                        var coord = new ShizimilyRogue.Common.Coord(x, y);
                        this.map[y][x] = new Cell(coord);
                    }
                }

                // Generate Map
                var rotMap = new ROT.Map.Digger(w, h);
                rotMap.create(function (x, y, value) {
                    _this.map[y][x].object = value ? new Wall() : new Path();
                });

                // 通路と部屋を分ける
                if (typeof rotMap.getRooms !== "undefined") {
                    rotMap.getRooms().forEach(function (room) {
                        for (var x = room.getLeft(); x <= room.getRight(); x++) {
                            for (var y = room.getTop(); y <= room.getBottom(); y++) {
                                _this.map[y][x].object = new Room();
                            }
                        }
                    });
                }
            }
            // Field of viewを取得
            Map.prototype.getFOV = function (unit) {
                var _this = this;
                var lightPasses = function (x, y) {
                    if (x < 0 || y < 0 || x >= _this.width || y >= _this.height) {
                        return false;
                    }
                    var cell = _this.map[y][x];
                    if (cell.isRoom()) {
                        return true;
                    }
                    return false;
                };

                var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
                var coord = unit.cell.coord;
                var area = [];
                fov.compute(coord.x, coord.y, 10, function (x, y, r, visibility) {
                    area.push(_this.map[y][x].coord);
                });
                var getCell = function (coord) {
                    return _this.map[coord.y][coord.x];
                };
                var getCellByCoord = function (x, y) {
                    return _this.map[y][x];
                };
                if (area.length == 1) {
                    area.push(this.map[coord.y + 1][coord.x - 1].coord);
                    area.push(this.map[coord.y + 1][coord.x].coord);
                    area.push(this.map[coord.y + 1][coord.x + 1].coord);
                    area.push(this.map[coord.y][coord.x - 1].coord);
                    area.push(this.map[coord.y][coord.x + 1].coord);
                    area.push(this.map[coord.y - 1][coord.x - 1].coord);
                    area.push(this.map[coord.y - 1][coord.x].coord);
                    area.push(this.map[coord.y - 1][coord.x + 1].coord);
                }
                var objects = [];
                var attackable = {};
                area.forEach(function (coord) {
                    for (var layer = 1 /* Ground */; layer < 5 /* MAX */; layer++) {
                        var obj = _this.map[coord.y][coord.x].objects[layer];
                        if (!obj.isNull() && obj.id != unit.id) {
                            objects.push(obj);
                            attackable[obj.id] = _this.isAttackable(unit, obj);
                        }
                    }
                });

                var movable = [];
                for (var dir = 0; dir < ROT.DIRS[8].length; dir++) {
                    movable.push(this.isMovable(unit, dir));
                }

                var result = new FOVData(unit, this.width, this.height, getCell, getCellByCoord, area, movable, objects, attackable);
                return result;
            };

            // 攻撃できるかどうか
            Map.prototype.isAttackable = function (obj, target) {
                var dirX = target.cell.coord.x - obj.cell.coord.x;
                var dirY = target.cell.coord.y - obj.cell.coord.y;

                if (Math.abs(dirX) > 1 || Math.abs(dirY) > 1) {
                    return false;
                }

                var coord = obj.cell.coord;
                var newCell = this.map[coord.y + dirY][coord.x + dirX];

                if (!newCell.isWall()) {
                    if (dirX == 0 || dirY == 0) {
                        return true;
                    } else {
                        var cornerCell1 = this.map[coord.y][coord.x + dirX];
                        var cornerCell2 = this.map[coord.y + dirY][coord.x];
                        if (!cornerCell1.isWall() && !cornerCell2.isWall()) {
                            return true;
                        }
                    }
                }
                return false;
            };

            // 移動できるかどうか
            Map.prototype.isMovable = function (obj, dir) {
                var dirX = ROT.DIRS[8][dir][0];
                var dirY = ROT.DIRS[8][dir][1];
                var coord = obj.cell.coord;
                var newCell = this.map[coord.y + dirY][coord.x + dirX];

                if (newCell.isNull(obj.layer) && !newCell.isWall()) {
                    if (dirX == 0 || dirY == 0) {
                        return true;
                    } else {
                        var cornerCell1 = this.map[coord.y][coord.x + dirX];
                        var cornerCell2 = this.map[coord.y + dirY][coord.x];
                        if (!cornerCell1.isWall() && !cornerCell2.isWall()) {
                            return true;
                        }
                    }
                }
                return false;
            };

            // すでに存在するオブジェクトを移動する。成功したらTrue
            Map.prototype.moveObject = function (obj, dir) {
                if (this.isMovable(obj, dir)) {
                    var coord = obj.cell.coord;
                    var oldCell = this.map[coord.y][coord.x];
                    var newCell = this.map[coord.y + ROT.DIRS[8][dir][1]][coord.x + ROT.DIRS[8][dir][0]];
                    this.deleteObject(obj);
                    newCell.object = obj;
                    return true;
                } else {
                    return false;
                }
            };

            // すでに存在するオブジェクトを削除する。成功したらTrue
            Map.prototype.deleteObject = function (obj) {
                var coord = obj.cell.coord;
                if (obj.cell.coord != null) {
                    var cell = this.map[coord.y][coord.x];
                    cell.del(obj.layer);
                    return true;
                }
                return false;
            };

            // オブジェクトの追加
            Map.prototype.setObject = function (obj, coord, force) {
                if (typeof force === "undefined") { force = true; }
                var cell = this.map[coord.y][coord.x];
                if (cell.isNull(obj.layer)) {
                    if (force) {
                        this.deleteObject(cell.objects[obj.layer]);
                    } else {
                        return false;
                    }
                }
                cell.object = obj;
                return true;
            };

            Map.prototype.drop = function (obj, coord) {
                for (var i = 0; i < ShizimilyRogue.Common.Drop.length; i++) {
                    var cell = this.map[coord.y + ShizimilyRogue.Common.Drop[i][0]][coord.x + ShizimilyRogue.Common.Drop[i][1]];
                    if (cell.isNull(obj.layer) && !cell.isWall()) {
                        return cell.coord;
                    }
                }
                return null;
            };

            // あるレイヤのランダムな場所を取得
            Map.prototype.getRandomPoint = function (layer) {
                var currentFreeCells = [];
                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                        var cell = this.map[y][x];
                        if (cell.isNull(layer) && cell.isRoom()) {
                            currentFreeCells.push(cell);
                        }
                    }
                }
                var index = Math.floor(ROT.RNG.getUniform() * currentFreeCells.length);
                return currentFreeCells[index].coord;
            };

            // あるレイヤの[オブジェクトタイプ,オブジェクトID]を取得
            Map.prototype.getCell = function (x, y) {
                return this.map[y][x];
            };

            // あるレイヤの[オブジェクトタイプ,オブジェクトID]を取得
            Map.prototype.getObject = function (coord, layer) {
                return this.map[coord.y][coord.x].objects[layer];
            };
            Map.WALL_HEIGHT = 3;
            return Map;
        })();
    })(ShizimilyRogue.Model || (ShizimilyRogue.Model = {}));
    var Model = ShizimilyRogue.Model;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=dungeon.js.map
