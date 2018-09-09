var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (Common) {
        /** デバッグモード切り替え */
        Common.DEBUG = false

        /** プレイヤーのID */
        Common.PLAYER_ID = 0;

        /** 各種パラメタ */
        Common.Parameter = {
            /** 投げられる最大距離 */
            ThrowDistance: 10,
            /** 何ターンに1お腹がへるか */
            StomachDecrease: 10,
            /** ユニットの初期攻撃力 */
            Atk: 100,
            /** ユニットの初期防御力 */
            Def: 100,
            /** 睡眠ターン */
            SleepTurn: 10,
            /** 気絶ターン */
            SenselessTurn: 50,
            /** 混乱ターン数 */
            ConfuseTurn: 15
        };

        /** コンフィグ */
        Common.Config = {
            /** メニューオープン時のキーロック開放処理フレーム数 */
            KEY_LOCK_RELEASE: 10,
            /** メッセージの表示スピード */
            MESSAGE_SPEED: 0.3,
            /** メッセージの自動非表示時間 */
            MESSAGE_FADEOUT: 5
        };

        /** GameSceneのフォーカス */
        (function (GameSceneFocus) {
            GameSceneFocus[GameSceneFocus["Field"] = 0] = "Field";
            GameSceneFocus[GameSceneFocus["Menu"] = 1] = "Menu";
        })(Common.GameSceneFocus || (Common.GameSceneFocus = {}));
        var GameSceneFocus = Common.GameSceneFocus;

        /** ドロップ位置の優先順位 */
        Common.Drop = [
            [0, 0], [1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [-1, -1], [1, -1],
            [2, 0], [0, 2], [-2, 0], [0, -2], [2, 1], [1, 2], [-2, 1], [1, -2], [-1, 2], [2, -1], [-1, -2], [-2, -1],
            [2, 2], [2, -2], [-2, 2], [-2, -2]
        ];

        /** ダメージ計算式 */
        Common.Damage = function (atk, def) {
            var damage = Math.floor(1 + atk * (0.875 + ROT.RNG.getUniform() * 1.20) - def);
            return damage < 0 ? 1 : damage;
        };

        /** お腹すいた時のダメージ量 */
        Common.HungerDamage = function (maxHp) {
            return Math.floor(maxHp * 0.1);
        };

        /** 武器攻撃力計算式 */
        Common.WeaponAtk = function (base, plus) {
            return (base + plus);
        };

        /** 防具防御力計算式 */
        Common.GuardDef = function (base, plus) {
            return (base + plus);
        };

        /** 防具鬱防御力計算式 */
        Common.GuardUtsuDef = function (base, plus) {
            return (base + plus);
        };

        /** レイヤー */
        (function (Layer) {
            Layer[Layer["Floor"] = 0] = "Floor";
            Layer[Layer["Ground"] = 1] = "Ground";
            Layer[Layer["Unit"] = 2] = "Unit";
            Layer[Layer["Flying"] = 3] = "Flying";
            Layer[Layer["Effect"] = 4] = "Effect";
            Layer[Layer["MAX"] = 5] = "MAX";
        })(Common.Layer || (Common.Layer = {}));
        var Layer = Common.Layer;

        /** 方向 */
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

        /** アイテム種別 */
        (function (ItemType) {
            ItemType[ItemType["CPU"] = 0] = "CPU";
            ItemType[ItemType["GraphicBoard"] = 1] = "GraphicBoard";
            ItemType[ItemType["HDD"] = 2] = "HDD";
            ItemType[ItemType["Memory"] = 3] = "Memory";
            ItemType[ItemType["Sweet"] = 4] = "Sweet";
            ItemType[ItemType["DVD"] = 5] = "DVD";
            ItemType[ItemType["Case"] = 6] = "Case";
            ItemType[ItemType["SDCard"] = 7] = "SDCard";
        })(Common.ItemType || (Common.ItemType = {}));
        var ItemType = Common.ItemType;

        /** ダンジョンのオブジェクトのタイプ */
        (function (DungeonObjectType) {
            DungeonObjectType[DungeonObjectType["Null"] = 0] = "Null";
            DungeonObjectType[DungeonObjectType["Wall"] = 1] = "Wall";
            DungeonObjectType[DungeonObjectType["Path"] = 2] = "Path";
            DungeonObjectType[DungeonObjectType["Room"] = 3] = "Room";
            DungeonObjectType[DungeonObjectType["Unit"] = 4] = "Unit";
            DungeonObjectType[DungeonObjectType["Item"] = 5] = "Item";
            DungeonObjectType[DungeonObjectType["Stairs"] = 6] = "Stairs";
            DungeonObjectType[DungeonObjectType["Trap"] = 7] = "Trap";
        })(Common.DungeonObjectType || (Common.DungeonObjectType = {}));
        var DungeonObjectType = Common.DungeonObjectType;

        /** Actionの通知範囲 */
        (function (Target) {
            Target[Target["Me"] = 0] = "Me";
            Target[Target["Next"] = 1] = "Next";
            Target[Target["Line"] = 2] = "Line";
            Target[Target["FarLine"] = 3] = "FarLine";
            Target[Target["Target"] = 4] = "Target";
            Target[Target["Item"] = 5] = "Item";
            Target[Target["System"] = 6] = "System";
            Target[Target["Ground"] = 7] = "Ground";
            Target[Target["Unit"] = 8] = "Unit";
            Target[Target["RoomUnit"] = 9] = "RoomUnit";
        })(Common.Target || (Common.Target = {}));
        var Target = Common.Target;

        /** Actionの種別 */
        (function (ActionType) {
            ActionType[ActionType["Attack"] = 0] = "Attack";
            ActionType[ActionType["Use"] = 1] = "Use";
            ActionType[ActionType["Throw"] = 2] = "Throw";
            ActionType[ActionType["Pick"] = 3] = "Pick";
            ActionType[ActionType["Place"] = 4] = "Place";
            ActionType[ActionType["Die"] = 5] = "Die";
            ActionType[ActionType["Status"] = 6] = "Status";
            ActionType[ActionType["Fly"] = 7] = "Fly";
            ActionType[ActionType["Move"] = 8] = "Move";
            ActionType[ActionType["Delete"] = 9] = "Delete";
            ActionType[ActionType["Swap"] = 10] = "Swap";
            ActionType[ActionType["Drop"] = 11] = "Drop";
            ActionType[ActionType["Set"] = 12] = "Set";
            ActionType[ActionType["Fail"] = 13] = "Fail";
            ActionType[ActionType["Skill"] = 14] = "Skill";
            ActionType[ActionType["None"] = 15] = "None";
        })(Common.ActionType || (Common.ActionType = {}));
        var ActionType = Common.ActionType;

        /** ステータス変更Action種別 */
        (function (StatusActionType) {
            StatusActionType[StatusActionType["Damage"] = 0] = "Damage";
            StatusActionType[StatusActionType["Heal"] = 1] = "Heal";
            StatusActionType[StatusActionType["Hunger"] = 2] = "Hunger";
            StatusActionType[StatusActionType["Full"] = 3] = "Full";
            StatusActionType[StatusActionType["Utsu"] = 4] = "Utsu";
            StatusActionType[StatusActionType["Comfort"] = 5] = "Comfort";
            StatusActionType[StatusActionType["Sleep"] = 6] = "Sleep";
            StatusActionType[StatusActionType["Confuse"] = 7] = "Confuse";
            StatusActionType[StatusActionType["Senseless"] = 8] = "Senseless";
        })(Common.StatusActionType || (Common.StatusActionType = {}));
        var StatusActionType = Common.StatusActionType;

        /** スキル種別 */
        (function (SkillType) {
            SkillType[SkillType["Sleep"] = 0] = "Sleep";
            SkillType[SkillType["Confuse"] = 1] = "Confuse";
            SkillType[SkillType["Senseless"] = 2] = "Senseless";
            SkillType[SkillType["Blast"] = 3] = "Blast";
        })(Common.SkillType || (Common.SkillType = {}));
        var SkillType = Common.SkillType;

        /** 失敗Action種別 */
        (function (FailActionType) {
            FailActionType[FailActionType["CaseOver"] = 0] = "CaseOver";
        })(Common.FailActionType || (Common.FailActionType = {}));
        var FailActionType = Common.FailActionType;

        /** ユニットの状態 */
        (function (ItemState) {
            ItemState[ItemState["Normal"] = 0] = "Normal";
        })(Common.ItemState || (Common.ItemState = {}));
        var ItemState = Common.ItemState;

        /** 終了ステータス */
        (function (EndState) {
            EndState[EndState["None"] = 0] = "None";
            EndState[EndState["Clear"] = 1] = "Clear";
            EndState[EndState["Up"] = 2] = "Up";
            EndState[EndState["GameOver"] = 3] = "GameOver";
        })(Common.EndState || (Common.EndState = {}));
        var EndState = Common.EndState;

        /** ユニットのスピード */
        (function (Speed) {
            Speed[Speed["NORMAL"] = 100] = "NORMAL";
            Speed[Speed["DOUBLE"] = 200] = "DOUBLE";
            Speed[Speed["TRIPLE"] = 300] = "TRIPLE";
        })(Common.Speed || (Common.Speed = {}));
        var Speed = Common.Speed;

        /** 座標 */
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

        /**
        * アクション
        */
        var Action = (function () {
            /**
            * @constructor
            */
            function Action(type, targetType) {
                this.type = type;
                this.targetType = targetType;
                /** 終了ステータス None以外の場合終了 */
                this.end = 0 /* None */;
                /** 数値パラメタ */
                this.param = 0;
                /** アイテムパラメタ */
                this.targetItems = [];
                /** 座標パラメタ */
                this.coord = null;
                /** サブタイプ */
                this.subType = 0;
                /** アイテム */
                this.item = null;
                /** Actionの送信先 targetTypeがTarget以外の時は自動設定される */
                this.targets = [];
                /** このアクションを起こす契機になったアクション */
                this.lastAction = null;
                /** このアクションの呼び出し元 自動設定される */
                this.sender = null;
                /** 現在のターゲット番号 */
                this.targetIndex = -1;
                this.id = Action.currentId++;
            }
            Action.prototype.isAttack = function () {
                return this.type == 0 /* Attack */;
            };
            Action.prototype.isUse = function () {
                return this.type == 1 /* Use */;
            };
            Action.prototype.isThrow = function () {
                return this.type == 2 /* Throw */;
            };
            Action.prototype.isPick = function () {
                return this.type == 3 /* Pick */;
            };
            Action.prototype.isPlace = function () {
                return this.type == 4 /* Place */;
            };
            Action.prototype.isDie = function () {
                return this.type == 5 /* Die */;
            };
            Action.prototype.isStatus = function () {
                return this.type == 6 /* Status */;
            };
            Action.prototype.isFly = function () {
                return this.type == 7 /* Fly */;
            };
            Action.prototype.isSkill = function () {
                return this.type == 14 /* Skill */;
            };
            Action.prototype.isMove = function () {
                return this.type == 8 /* Move */;
            };
            Action.prototype.isDelete = function () {
                return this.type == 9 /* Delete */;
            };
            Action.prototype.isSwap = function () {
                return this.type == 10 /* Swap */;
            };
            Action.prototype.isDrop = function () {
                return this.type == 11 /* Drop */;
            };
            Action.prototype.isNone = function () {
                return this.type == 15 /* None */;
            };
            Action.prototype.isSet = function () {
                return this.type == 12 /* Set */;
            };
            Action.prototype.isSystem = function () {
                return this.targetType == 6 /* System */;
            };

            Object.defineProperty(Action.prototype, "target", {
                /**
                * @return {Common.IObject} 現在のターゲット
                */
                get: function () {
                    return this.targets[this.targetIndex];
                },
                enumerable: true,
                configurable: true
            });

            /**
            * 移動アクション
            * <ul>
            * <li>現在の方向に向かって移動する
            * <li>システムアクション
            * </ul>
            * @return {Common.Action} アクション
            */
            Action.Move = function () {
                return new Action(8 /* Move */, 6 /* System */);
            };

            /**
            * 攻撃アクション
            * <ul>
            * <li>現在の方向に向かって指定した攻撃力で攻撃
            * <li>隣接アクション
            * </ul>
            * @param {number} atk 攻撃力 paramに格納
            * @return {Common.Action} アクション
            */
            Action.Attack = function () {
                var action = new Action(0 /* Attack */, 1 /* Next */);
                return action;
            };

            /**
            * スキルアクション
            * <ul>
            * <li>DVD等によるスキル発動
            * </ul>
            * @param {targetType} 効果範囲
            * @param {skillType} スキル種別
            * @return {Common.Action} アクション
            */
            Action.Skill = function (targetType, skillType) {
                var action = new Action(14 /* Skill */, targetType);
                action.subType = skillType;
                return action;
            };

            /**
            * ステータス変更アクション
            * <ul>
            * <li>指定したステータスを変更
            * <li>ターゲット指定アクション
            * </ul>
            * @param {Common.IObject} target 変更対象 targetsに格納
            * @param {StatusActionType} type 変更するステータス subTypeに格納
            * @param {number} amount 変化量 paramに格納
            * @return {Common.Action} アクション
            */
            Action.Status = function (target, type, amount) {
                var action = new Action(6 /* Status */, 4 /* Target */);
                action.targets = [target];
                action.subType = type;
                action.param = amount;
                return action;
            };

            /**
            * 死亡アクション
            * <ul>
            * <li>自分アクション
            * </ul>
            * @return {Common.Action} アクション
            */
            Action.Die = function () {
                var action = new Action(5 /* Die */, 0 /* Me */);
                return action;
            };

            /**
            * アイテム使用アクション
            * <ul>
            * <li>アイテムアクション
            * </ul>
            * @param {IItem} item 使用するアイテム itemに格納
            * @param {IItem[]} targetItems 合成等のアイテム(Default:[]) targetItemsに格納
            * @return {Common.Action} アクション
            */
            Action.Use = function (item, targetItems) {
                if (typeof targetItems === "undefined") { targetItems = []; }
                var action = new Action(1 /* Use */, 5 /* Item */);
                action.item = item;
                action.targetItems = targetItems;
                return action;
            };

            /**
            * 投げるアクション
            * <ul>
            * <li>アイテムアクション
            * </ul>
            * @param {IItem} item 使用するアイテム itemに格納
            * @return {Common.Action} アクション
            */
            Action.Throw = function (item) {
                var action = new Action(2 /* Throw */, 5 /* Item */);
                action.item = item;
                return action;
            };

            /**
            * 飛ぶアクション
            * <ul>
            * <li>ライン上アクション
            * </ul>
            * @param {Common.Coord} src 初期地点 coordに格納
            * @return {Common.Action} アクション
            */
            Action.Fly = function (src) {
                var action = new Action(7 /* Fly */, 2 /* Line */);
                action.coord = src;
                return action;
            };

            /**
            * 拾うアクション
            * <ul>
            * <li>Groundレイヤアクション
            * </ul>
            * @return {Common.Action} アクション
            */
            Action.Pick = function () {
                var action = new Action(3 /* Pick */, 7 /* Ground */);
                return action;
            };

            /**
            * オブジェクトの削除アクション
            * <ul>
            * <li>システムアクション
            * </ul>
            * @param {IObject} target 削除対象 targetsに格納
            * @return {Common.Action} アクション
            */
            Action.Delete = function (target) {
                var action = new Action(9 /* Delete */, 6 /* System */);
                action.targets = [target];
                return action;
            };

            /**
            * オブジェクトのドロップアクション
            * <ul>
            * <li>システムアクション
            * </ul>
            * @param {IObject} target ドロップするオブジェクト targetsに格納
            * @param {Common.Coord} coord ドロップ地点 coordに格納
            * @return {Common.Action} アクション
            */
            Action.Drop = function (target, coord) {
                var action = new Action(11 /* Drop */, 6 /* System */);
                action.targets = [target];
                action.coord = coord;
                return action;
            };

            /**
            * オブジェクトをセットするアクション
            * <ul>
            * <li>システムアクション
            * </ul>
            * @param {IObject} target セット対象 targetsに格納
            * @param {Common.Coord} coord セット地点 coordに格納
            * @return {Common.Action} アクション
            */
            Action.Set = function (target, coord) {
                var action = new Action(12 /* Set */, 6 /* System */);
                action.targets = [target];
                action.coord = coord;
                return action;
            };

            /**
            * アイテムを置くアクション
            * <ul>
            * <li>アイテムアクション
            * </ul>
            * @param {IItem} item 置くアイテム itemに格納
            * @return {Common.Action} アクション
            */
            Action.Place = function (item) {
                var action = new Action(4 /* Place */, 5 /* Item */);
                action.item = item;
                return action;
            };

            /**
            * 場所の交換アクション
            * <ul>
            * <li>システムアクション
            * </ul>
            * @param {IObject} target0 交換対象1 targetsに格納
            * @param {IObject} target1 交換対象2 targetsに格納
            * @return {Common.Action} アクション
            */
            Action.Swap = function (target0, target1) {
                var action = new Action(10 /* Swap */, 6 /* System */);
                action.targets = [target0, target1];
                return action;
            };

            /**
            * 何もしないアクション
            * <ul>
            * <li>自分アクション
            * </ul>
            * @return {Common.Action} アクション
            */
            Action.None = function () {
                return new Action(15 /* None */, 0 /* Me */);
            };

            /**
            * 失敗アクション
            * <ul>
            * <li>アイテムアクション
            * </ul>
            * @param {Common.FailActionType} type 失敗タイプ subTypeに格納
            * @return {Common.Action} アクション
            */
            Action.Fail = function (type) {
                var action = new Action(13 /* Fail */, 6 /* System */);
                action.subType = type;
                return action;
            };
            Action.currentId = 1;
            return Action;
        })();
        Common.Action = Action;

        

        

        

        

        
    })(ShizimilyRogue.Common || (ShizimilyRogue.Common = {}));
    var Common = ShizimilyRogue.Common;
})(ShizimilyRogue || (ShizimilyRogue = {}));

var ShizimilyRogue;
(function (ShizimilyRogue) {
    /**
    * ゲームの開始
    */
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
