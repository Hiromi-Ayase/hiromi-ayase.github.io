var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (Model) {
        (function (Data) {
            var UnitData = (function () {
                function UnitData(name) {
                    this.name = name;
                    this.type = 0 /* Unit */;
                    this.category = 0;
                    this.dir = 0;
                    this.lv = 1;
                    this.state = 0 /* Normal */;
                    this.maxHp = 100;
                    this.atk = 100;
                    this.def = 100;
                    this.hp = this.maxHp;
                    this.speed = 100 /* NORMAL */;
                    this.turn = 0;
                    this.inventory = [];
                    this.currentExp = 0;
                    this.stomach = 100;
                    this.maxStomach = 100;
                }
                UnitData.prototype.phase = function (fov) {
                    return null;
                };

                UnitData.prototype.event = function (me, map, result) {
                    if (result.action.type == 1 /* Attack */) {
                        if (result.object.isUnit()) {
                            var attacker = result.object;
                            var damage = ShizimilyRogue.Common.Damage(result.action.params[0], this.def);
                            this.hp -= damage;
                            return ShizimilyRogue.Common.Action.Damage(damage);
                        }
                    } else if (result.action.type == 6 /* Damage */) {
                        if (this.hp <= 0) {
                            var action = ShizimilyRogue.Common.Action.Die();
                            if (result.object.id == ShizimilyRogue.Common.PLAYER_ID) {
                                action.end = 3 /* GameOver */;
                            } else {
                                map.deleteObject(result.object);
                            }
                            return action;
                        }
                    } else if (result.action.type == 4 /* Pick */) {
                        var item = result.action.objects[0];
                        this.inventory.push(item);
                        map.deleteObject(item);
                    } else if (result.action.type == 0 /* Move */) {
                        map.moveObject(map.currentObject, this.dir);
                    } else if (result.action.type == 2 /* Use */) {
                        var item = result.action.objects[0];
                        this.inventory = this.inventory.filter(function (value, index, array) {
                            return value != item;
                        });
                        var action = item.use(result.action);
                        return action;
                    } else if (result.action.type == 7 /* Heal */) {
                        this.hp += result.action.params[0];
                    } else if (result.action.type == 10 /* Fly */) {
                        var item = result.action.objects[0];
                        var action = item.use(result.action);
                        return action;
                    } else if (result.action.type == 3 /* Throw */) {
                        var item = result.action.objects[0];
                        var action = ShizimilyRogue.Common.Action.Fly(item, this.dir, me.coord);
                        this.inventory = this.inventory.filter(function (value, index, array) {
                            return value != item;
                        });
                        return action;
                    }
                    return null;
                };
                return UnitData;
            })();
            Data.UnitData = UnitData;

            var PlayerData = (function (_super) {
                __extends(PlayerData, _super);
                function PlayerData(name) {
                    _super.call(this, name);
                    this.name = name;
                    this.atk = 10;
                    this.maxHp = 10000;
                    this.hp = 10000;
                }
                PlayerData.prototype.event = function (me, map, result) {
                    var ret = _super.prototype.event.call(this, me, map, result);
                    if (result.action.type == 0 /* Move */) {
                        var coord = map.currentObject.coord;
                        var obj = map.getObject(coord, 1 /* Ground */);
                        if (obj.isItem()) {
                            var item = obj;
                            return ShizimilyRogue.Common.Action.Pick(item);
                        }
                    }
                    return ret;
                };
                return PlayerData;
            })(UnitData);
            Data.PlayerData = PlayerData;

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
                Enemy.prototype.phase = function (fov) {
                    var me = fov.me.coord;
                    var player = null;
                    var action = null;
                    for (var i = 0; i < fov.objects.length; i++) {
                        if (fov.objects[i].id == ShizimilyRogue.Common.PLAYER_ID) {
                            player = fov.objects[i].coord;
                            break;
                        }
                    }

                    if (player != null) {
                        // 視界内にプレイヤーがいた
                        if (fov.attackable[ShizimilyRogue.Common.PLAYER_ID]) {
                            this.dir = Enemy.getAttackDir(fov.me.coord, player);
                            action = ShizimilyRogue.Common.Action.Attack(this.atk);
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
                        // 何もできない場合はランダムに移動
                        var dirs = [];
                        fov.movable.map(function (value, index, array) {
                            if (value)
                                dirs.push(index);
                        });
                        this.dir = Math.floor(dirs.length * ROT.RNG.getUniform());
                        action = ShizimilyRogue.Common.Action.Move();
                    }
                    this.lastPlayer = player;
                    this.lastMe = me;
                    return action;
                };

                Enemy.prototype.event = function (me, map, result) {
                    var _this = this;
                    var ret = _super.prototype.event.call(this, me, map, result);
                    var fov = me.getFOV();
                    fov.objects.forEach(function (obj) {
                        if (obj.id == ShizimilyRogue.Common.PLAYER_ID) {
                            _this.lastPlayer = obj.coord;
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
            })(UnitData);
            Data.Enemy = Enemy;

            var Ignore = (function (_super) {
                __extends(Ignore, _super);
                function Ignore() {
                    _super.call(this, "いぐー");
                    this.category = 1;
                }
                return Ignore;
            })(Enemy);
            Data.Ignore = Ignore;
        })(Model.Data || (Model.Data = {}));
        var Data = Model.Data;
    })(ShizimilyRogue.Model || (ShizimilyRogue.Model = {}));
    var Model = ShizimilyRogue.Model;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=units.js.map
