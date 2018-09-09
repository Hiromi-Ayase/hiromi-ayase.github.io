var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (Model) {
        (function (DataType) {
            DataType[DataType["Unit"] = 0] = "Unit";
            DataType[DataType["Item"] = 1] = "Item";
        })(Model.DataType || (Model.DataType = {}));
        var DataType = Model.DataType;

        var Result = (function () {
            function Result(object, action, targets) {
                this.object = object;
                this.action = action;
                this.targets = targets;
            }
            return Result;
        })();
        Model.Result = Result;

        var DungeonObject = (function () {
            function DungeonObject() {
                this.category = 0;
                this.coord = null;
                this.type = null;
                this.layer = null;
                this.dir = 0;
                this.name = null;
                this.id = DungeonObject.currentId;
                DungeonObject.currentId++;
            }
            DungeonObject.prototype.event = function (map, result) {
                return null;
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
            DungeonObject.currentId = 1;
            return DungeonObject;
        })();

        var DungeonManager = (function () {
            function DungeonManager(w, h) {
                this._objects = [];
                this.scheduler = new ROT.Scheduler.Speed();
                this._endState = 0 /* None */;
                this.map = new Map(w, h);

                // Playerを配置
                var player = new Player(new Model.Data.PlayerData("しじみりちゃん"), this);
                this.setObject(player, this.getRandomPoint(player.layer));

                // 敵を配置
                this.addObject(new Model.Data.Ignore);
                this.addObject(new Model.Data.Ignore);
                this.addObject(new Model.Data.Ignore);
                this.addObject(new Model.Data.Ignore);

                // アイテムを配置
                this.addObject(new Model.Data.Sweet);
                this.addObject(new Model.Data.Sweet);
                this.addObject(new Model.Data.Sweet);
                this.addObject(new Model.Data.Sweet);
                this.addObject(new Model.Data.Sweet);

                // 一番最初のターンはプレイヤー
                this._currentUnit = this.scheduler.next();
                this._currentObject = this._currentUnit;
            }
            DungeonManager.prototype.addObject = function (data, coord) {
                if (typeof coord === "undefined") { coord = null; }
                var object;
                switch (data.type) {
                    case 0 /* Unit */:
                        object = new Unit(data, this);
                        break;
                    case 1 /* Item */:
                        object = new Item(data);
                        break;
                }
                if (coord == null) {
                    coord = this.map.getRandomPoint(object.layer);
                }
                this.setObject(object, coord);
                return object;
            };

            DungeonManager.prototype.setObject = function (obj, coord) {
                if (this.map.setObject(obj, coord)) {
                    this._objects.push(obj);
                    if (obj.isUnit())
                        this.scheduler.add(obj, true);
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
                    if (obj.isUnit())
                        this.scheduler.remove(obj);
                    return true;
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

            Object.defineProperty(DungeonManager.prototype, "currentObject", {
                get: function () {
                    return this._currentObject;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DungeonManager.prototype, "currentTurn", {
                get: function () {
                    return this._currentUnit;
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

            DungeonManager.prototype.next = function (input, callback) {
                var allResults = [];
                var action = input;
                while (action != null) {
                    // 行動
                    this._endState = this.update(this._currentObject, action, callback);
                    if (this._endState != 0 /* None */) {
                        break;
                    }

                    // 次に行動するユニットのアクションを取り出す
                    this._currentUnit = this.scheduler.next();
                    this._currentObject = this._currentUnit;
                    action = this._currentUnit.phase();
                }
            };

            DungeonManager.prototype.update = function (object, action, callback) {
                var result = this.process(object, action);
                if (action.end != 0 /* None */)
                    return action.end;
                if (result != null) {
                    for (var i = 0; i < result.targets.length; i++) {
                        this._currentObject = result.targets[i];
                        var newAction = this._currentObject.event(this, result);
                        callback(result);
                        if (newAction != null) {
                            var endState = this.update(this._currentObject, newAction, callback);
                            if (endState != 0 /* None */)
                                return endState;
                        }
                    }
                }
                return 0 /* None */;
            };

            DungeonManager.prototype.process = function (object, action) {
                var _this = this;
                var targets = [];
                switch (action.target) {
                    case 0 /* Me */:
                        targets = [object];
                        break;
                    case 1 /* Next */:
                        var coord = DungeonManager.getDst(object, object.dir);
                        targets = [this.map.getObject(coord, object.layer)];
                        break;
                    case 2 /* Line */:
                        var obj = DungeonManager.getLine(function (x, y) {
                            return _this.getCell(x, y);
                        }, object, object.dir, 10);
                        targets = [obj];
                        break;
                }
                var result = new Result(object, action, targets);
                return result;
            };

            DungeonManager.getLine = function (table, obj, dir, distance) {
                var x = obj.coord.x;
                var y = obj.coord.y;
                for (var i = 0; i < distance; i++) {
                    x += ROT.DIRS[8][dir][0];
                    y += ROT.DIRS[8][dir][1];
                    if (table(x, y).isUnit()) {
                        return table(x, y).unit;
                    } else if (table(x + ROT.DIRS[8][dir][0], y + ROT.DIRS[8][dir][1]).isWall()) {
                        return table(x, y).ground;
                    }
                }
                return table(x, y).ground;
            };

            DungeonManager.getDst = function (obj, dir) {
                var x = obj.coord.x + ROT.DIRS[8][dir][0];
                var y = obj.coord.y + ROT.DIRS[8][dir][1];
                return new ShizimilyRogue.Common.Coord(x, y);
            };
            return DungeonManager;
        })();
        Model.DungeonManager = DungeonManager;

        var Item = (function (_super) {
            __extends(Item, _super);
            function Item(data) {
                _super.call(this);
                this.data = data;
                this.layer = 1 /* Ground */;
                this.type = 5 /* Item */;
            }
            Object.defineProperty(Item.prototype, "name", {
                get: function () {
                    return this.data.name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "num", {
                get: function () {
                    return this.data.num;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "category", {
                get: function () {
                    return this.data.category;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Item.prototype, "commands", {
                get: function () {
                    return this.data.commands;
                },
                enumerable: true,
                configurable: true
            });
            Item.prototype.use = function (action) {
                return this.data.use(action);
            };
            return Item;
        })(DungeonObject);

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
                objects.forEach(function (obj) {
                    return _this.visible[obj.id] = true;
                });
                this.visible[me.id] = true;
            }
            FOVData.prototype.isVisible = function (object) {
                return this.visible[object.id] == true;
            };
            return FOVData;
        })();

        var Unit = (function (_super) {
            __extends(Unit, _super);
            function Unit(data, map) {
                _super.call(this);
                this.data = data;
                this.map = map;
                this.layer = 2 /* Unit */;
                this.type = 4 /* Unit */;
            }
            Unit.prototype.getSpeed = function () {
                return this.data.speed;
            };

            Object.defineProperty(Unit.prototype, "atk", {
                get: function () {
                    return this.data.atk;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Unit.prototype, "def", {
                get: function () {
                    return this.data.def;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Unit.prototype, "lv", {
                get: function () {
                    return this.data.lv;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Unit.prototype, "hp", {
                get: function () {
                    return this.data.hp;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Unit.prototype, "maxHp", {
                get: function () {
                    return this.data.maxHp;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Unit.prototype, "turn", {
                get: function () {
                    return this.data.turn;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Unit.prototype, "dir", {
                get: function () {
                    return this.data.dir;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Unit.prototype, "inventory", {
                get: function () {
                    return this.data.inventory;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Unit.prototype, "state", {
                get: function () {
                    return this.data.state;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Unit.prototype, "name", {
                get: function () {
                    return this.data.name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Unit.prototype, "currentExp", {
                get: function () {
                    return this.data.currentExp;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Unit.prototype, "maxStomach", {
                get: function () {
                    return this.data.maxStomach;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Unit.prototype, "stomach", {
                get: function () {
                    return this.data.stomach;
                },
                enumerable: true,
                configurable: true
            });

            Unit.prototype.setDir = function (dir) {
                this.data.dir = dir;
            };

            Unit.prototype.getFOV = function () {
                return this.map.getFOV(this);
            };

            Unit.prototype.phase = function () {
                this.data.turn++;
                return this.data.phase(this.map.getFOV(this));
            };
            Unit.prototype.event = function (map, result) {
                return this.data.event(this, map, result);
            };
            return Unit;
        })(DungeonObject);

        var Player = (function (_super) {
            __extends(Player, _super);
            function Player(playerData, map) {
                _super.call(this, playerData, map);
                this.playerData = playerData;
                this.id = ShizimilyRogue.Common.PLAYER_ID;
            }
            return Player;
        })(Unit);

        var Enemy = (function (_super) {
            __extends(Enemy, _super);
            function Enemy(enemyData, map) {
                _super.call(this, enemyData, map);
                this.enemyData = enemyData;
            }
            Object.defineProperty(Enemy.prototype, "exp", {
                get: function () {
                    return this.enemyData.exp;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Enemy.prototype, "dropProbability", {
                get: function () {
                    return this.enemyData.dropProbability;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Enemy.prototype, "awakeProbabilityWhenAppear", {
                get: function () {
                    return this.enemyData.awakeProbabilityWhenAppear;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Enemy.prototype, "awakeProbabilityWhenEnterRoom", {
                get: function () {
                    return this.enemyData.awakeProbabilityWhenEnterRoom;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Enemy.prototype, "awakeProbabilityWhenNeighbor", {
                get: function () {
                    return this.enemyData.awakeProbabilityWhenNeighbor;
                },
                enumerable: true,
                configurable: true
            });
            return Enemy;
        })(Unit);

        var Wall = (function (_super) {
            __extends(Wall, _super);
            function Wall() {
                _super.apply(this, arguments);
                this.type = 1 /* Wall */;
                this.layer = 1 /* Ground */;
            }
            return Wall;
        })(DungeonObject);

        var Room = (function (_super) {
            __extends(Room, _super);
            function Room() {
                _super.apply(this, arguments);
                this.type = 3 /* Room */;
                this.layer = 0 /* Floor */;
            }
            return Room;
        })(DungeonObject);

        var Path = (function (_super) {
            __extends(Path, _super);
            function Path() {
                _super.apply(this, arguments);
                this.type = 2 /* Path */;
                this.layer = 0 /* Floor */;
            }
            return Path;
        })(DungeonObject);

        var Null = (function (_super) {
            __extends(Null, _super);
            function Null() {
                _super.apply(this, arguments);
                this.type = 0 /* Null */;
                this.id = -1;
            }
            Null.prototype.event = function (map, result) {
                var obj = result.action.objects[0];
                if (result.action.type == 10 /* Fly */) {
                    map.setObject(obj, this.coord);
                }
                return null;
            };
            return Null;
        })(DungeonObject);

        var Cell = (function () {
            function Cell(coord) {
                this._objects = new Array(5 /* MAX */);
                this._coord = coord;
                for (var layer = 0; layer < 5 /* MAX */; layer++)
                    this.del(layer);
            }
            Cell.prototype.del = function (layer) {
                this._objects[layer] = new Null();
                this._objects[layer].coord = this._coord;
            };

            Object.defineProperty(Cell.prototype, "object", {
                set: function (obj) {
                    this._objects[obj.layer] = obj;
                    obj.coord = this._coord;
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
                return this._objects[2 /* Unit */].id == ShizimilyRogue.Common.PLAYER_ID;
            };
            Cell.prototype.isUnit = function () {
                return this._objects[2 /* Unit */].isUnit();
            };
            Cell.prototype.isItem = function () {
                return this._objects[1 /* Ground */].isItem();
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
                var coord = unit.coord;
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
                var dirX = target.coord.x - obj.coord.x;
                var dirY = target.coord.y - obj.coord.y;

                if (Math.abs(dirX) > 1 || Math.abs(dirY) > 1) {
                    return false;
                }

                var coord = obj.coord;
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
                var coord = obj.coord;
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
                    var coord = obj.coord;
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
                var coord = obj.coord;
                if (obj.coord != null) {
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
