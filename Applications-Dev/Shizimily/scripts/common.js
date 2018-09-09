var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (Common) {
        Common.DEBUG = false;
        Common.PLAYER_ID = 0;
        Common.NULL_ID = -1;

        // 投げられる距離
        Common.THROW_DISTANCE = 5;

        // ダメージ計算式
        Common.Damage = function (atk, def) {
            var damage = Math.floor(1 + atk * (0.875 + ROT.RNG.getUniform() * 1.20) - def);
            return damage < 0 ? 1 : damage;
        };

        // 4:Effect レイヤ
        // 3:Flying レイヤ Flying Player
        // 2:Unit レイヤ  Player Mob
        // 1:Ground レイヤ  ITEM ENTRANCE
        // 0:Floor レイヤ   PATH ROOM WALL
        (function (Layer) {
            Layer[Layer["Floor"] = 0] = "Floor";
            Layer[Layer["Ground"] = 1] = "Ground";
            Layer[Layer["Unit"] = 2] = "Unit";
            Layer[Layer["Flying"] = 3] = "Flying";
            Layer[Layer["Effect"] = 4] = "Effect";
            Layer[Layer["MAX"] = 5] = "MAX";
        })(Common.Layer || (Common.Layer = {}));
        var Layer = Common.Layer;

        (function (DIR) {
            DIR[DIR["UP"] = 0] = "UP";
            DIR[DIR["UP_RIGHT"] = 1] = "UP_RIGHT";
            DIR[DIR["RIGHT"] = 2] = "RIGHT";
            DIR[DIR["DOWN_RIGHT"] = 3] = "DOWN_RIGHT";
            DIR[DIR["DOWN"] = 4] = "DOWN";
            DIR[DIR["DOWN_LEFT"] = 5] = "DOWN_LEFT";
            DIR[DIR["LEFT"] = 6] = "LEFT";
            DIR[DIR["UP_LEFT"] = 7] = "UP_LEFT";
        })(Common.DIR || (Common.DIR = {}));
        var DIR = Common.DIR;

        (function (ItemType) {
            ItemType[ItemType["Food"] = 0] = "Food";
            ItemType[ItemType["CPU"] = 1] = "CPU";
        })(Common.ItemType || (Common.ItemType = {}));
        var ItemType = Common.ItemType;

        (function (DungeonObjectType) {
            DungeonObjectType[DungeonObjectType["Null"] = 0] = "Null";
            DungeonObjectType[DungeonObjectType["Wall"] = 1] = "Wall";
            DungeonObjectType[DungeonObjectType["Path"] = 2] = "Path";
            DungeonObjectType[DungeonObjectType["Room"] = 3] = "Room";
            DungeonObjectType[DungeonObjectType["Unit"] = 4] = "Unit";
            DungeonObjectType[DungeonObjectType["Item"] = 5] = "Item";
        })(Common.DungeonObjectType || (Common.DungeonObjectType = {}));
        var DungeonObjectType = Common.DungeonObjectType;

        (function (ActionType) {
            ActionType[ActionType["Move"] = 0] = "Move";
            ActionType[ActionType["Attack"] = 1] = "Attack";
            ActionType[ActionType["Use"] = 2] = "Use";
            ActionType[ActionType["Throw"] = 3] = "Throw";
            ActionType[ActionType["Pick"] = 4] = "Pick";
            ActionType[ActionType["Die"] = 5] = "Die";
            ActionType[ActionType["Damage"] = 6] = "Damage";
            ActionType[ActionType["Heal"] = 7] = "Heal";
            ActionType[ActionType["Swap"] = 8] = "Swap";
            ActionType[ActionType["Blown"] = 9] = "Blown";
            ActionType[ActionType["Fly"] = 10] = "Fly";
            ActionType[ActionType["None"] = 11] = "None";
        })(Common.ActionType || (Common.ActionType = {}));
        var ActionType = Common.ActionType;

        (function (DungeonUnitState) {
            DungeonUnitState[DungeonUnitState["Normal"] = 0] = "Normal";
        })(Common.DungeonUnitState || (Common.DungeonUnitState = {}));
        var DungeonUnitState = Common.DungeonUnitState;

        (function (EndState) {
            EndState[EndState["None"] = 0] = "None";
            EndState[EndState["Clear"] = 1] = "Clear";
            EndState[EndState["Up"] = 2] = "Up";
            EndState[EndState["GameOver"] = 3] = "GameOver";
        })(Common.EndState || (Common.EndState = {}));
        var EndState = Common.EndState;

        (function (Speed) {
            Speed[Speed["HALF"] = 50] = "HALF";
            Speed[Speed["NORMAL"] = 100] = "NORMAL";
            Speed[Speed["DOUBLE"] = 200] = "DOUBLE";
            Speed[Speed["TRIPLE"] = 300] = "TRIPLE";
        })(Common.Speed || (Common.Speed = {}));
        var Speed = Common.Speed;

        //export enum ObjectType
        var Coord = (function () {
            function Coord(x, y) {
                this._x = x;
                this._y = y;
            }
            Object.defineProperty(Coord.prototype, "x", {
                get: function () {
                    return this._x;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Coord.prototype, "y", {
                get: function () {
                    return this._y;
                },
                enumerable: true,
                configurable: true
            });
            return Coord;
        })();
        Common.Coord = Coord;

        (function (Target) {
            Target[Target["Me"] = 0] = "Me";
            Target[Target["Next"] = 1] = "Next";
            Target[Target["Line"] = 2] = "Line";
            Target[Target["Item"] = 3] = "Item";
        })(Common.Target || (Common.Target = {}));
        var Target = Common.Target;

        var Action = (function () {
            function Action(type, target, params, objects, coords) {
                if (typeof params === "undefined") { params = []; }
                if (typeof objects === "undefined") { objects = []; }
                if (typeof coords === "undefined") { coords = []; }
                this.type = type;
                this.target = target;
                this.params = params;
                this.objects = objects;
                this.coords = coords;
                this.end = 0 /* None */;
            }
            Action.Move = function () {
                return new Action(0 /* Move */, 0 /* Me */);
            };

            Action.Attack = function (atk) {
                return new Action(1 /* Attack */, 1 /* Next */, [atk]);
            };

            Action.Damage = function (amount) {
                return new Action(6 /* Damage */, 0 /* Me */, [amount]);
            };

            Action.Heal = function (amount) {
                return new Action(7 /* Heal */, 0 /* Me */, [amount]);
            };

            Action.Die = function () {
                return new Action(5 /* Die */, 0 /* Me */, []);
            };

            Action.Use = function (item) {
                return new Action(2 /* Use */, 0 /* Me */, [], [item]);
            };

            Action.Throw = function (item) {
                return new Action(3 /* Throw */, 0 /* Me */, [], [item]);
            };

            Action.Fly = function (item, dir, src) {
                return new Action(10 /* Fly */, 2 /* Line */, [dir], [item], [src]);
            };

            Action.Pick = function (item) {
                return new Action(4 /* Pick */, 0 /* Me */, [], [item]);
            };
            return Action;
        })();
        Common.Action = Action;
    })(ShizimilyRogue.Common || (ShizimilyRogue.Common = {}));
    var Common = ShizimilyRogue.Common;
})(ShizimilyRogue || (ShizimilyRogue = {}));

var ShizimilyRogue;
(function (ShizimilyRogue) {
    function start() {
        window.onload = function (e) {
            window.focus();
            var game = new ShizimilyRogue.Controller.Game();
            game.start();
        };
    }
    ShizimilyRogue.start = start;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=common.js.map
