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
            /**
            * ショートケーキ
            */
            var ShortCake = (function (_super) {
                __extends(ShortCake, _super);
                function ShortCake() {
                    _super.call(this, 4 /* Sweet */, "ショートケーキ");
                }
                ShortCake.prototype.use = function (action, unit) {
                    unit.takeInventory(this);
                    var action = ShizimilyRogue.Common.Action.Status(unit, 3 /* Full */, 100);
                    return [action];
                };
                return ShortCake;
            })(Model.Item);

            /**
            * アイス
            */
            var Ice = (function (_super) {
                __extends(Ice, _super);
                function Ice() {
                    _super.call(this, 4 /* Sweet */, "アイス");
                }
                Ice.prototype.use = function (action, unit) {
                    unit.takeInventory(this);
                    var action = ShizimilyRogue.Common.Action.Status(unit, 5 /* Comfort */, 100);
                    return [action];
                };
                return Ice;
            })(Model.Item);

            /**
            * 溶けたアイス
            */
            var MeltedIce = (function (_super) {
                __extends(MeltedIce, _super);
                function MeltedIce() {
                    _super.call(this, 4 /* Sweet */, "溶けたアイス");
                }
                MeltedIce.prototype.use = function (action, unit) {
                    unit.takeInventory(this);
                    var action = ShizimilyRogue.Common.Action.Status(unit, 4 /* Utsu */, 10);
                    return [action];
                };
                return MeltedIce;
            })(Model.Item);

            /**
            * クッキー
            */
            var Cookie = (function (_super) {
                __extends(Cookie, _super);
                function Cookie() {
                    _super.call(this, 4 /* Sweet */, "クッキー");
                }
                Cookie.prototype.use = function (action, unit) {
                    unit.takeInventory(this);
                    var action = ShizimilyRogue.Common.Action.Status(unit, 3 /* Full */, 5);
                    return [action];
                };
                return Cookie;
            })(Model.Item);

            /**
            * 睡眠薬入りバナナ
            */
            var Banana_Sleep = (function (_super) {
                __extends(Banana_Sleep, _super);
                function Banana_Sleep() {
                    _super.call(this, 4 /* Sweet */, "睡眠薬入りバナナ");
                }
                Banana_Sleep.prototype.use = function (action, unit) {
                    unit.takeInventory(this);
                    var action = ShizimilyRogue.Common.Action.Status(unit, 6 /* Sleep */, 10);
                    return [action];
                };
                return Banana_Sleep;
            })(Model.Item);

            /**
            * からし入りバナナ(炎がはける）
            */
            var Banana_Mustard = (function (_super) {
                __extends(Banana_Mustard, _super);
                function Banana_Mustard() {
                    _super.call(this, 4 /* Sweet */, "からし入りバナナ");
                }
                Banana_Mustard.prototype.use = function (action, unit) {
                    unit.takeInventory(this);

                    /* 未実装 */
                    return [action];
                };
                return Banana_Mustard;
            })(Model.Item);
            Data.Banana_Mustard = Banana_Mustard;

            /**
            * 目薬入りバナナ(罠が見えるようになる)
            */
            var Banana_EyeWash = (function (_super) {
                __extends(Banana_EyeWash, _super);
                function Banana_EyeWash() {
                    _super.call(this, 4 /* Sweet */, "目薬入りバナナ");
                }
                Banana_EyeWash.prototype.use = function (action, unit) {
                    unit.takeInventory(this);

                    /* 未実装 */
                    return [action];
                };
                return Banana_EyeWash;
            })(Model.Item);

            /**
            * 凍ったバナナ(10ターン気絶)
            */
            var Banana_Frozen = (function (_super) {
                __extends(Banana_Frozen, _super);
                function Banana_Frozen() {
                    _super.call(this, 4 /* Sweet */, "凍ったバナナ");
                }
                Banana_Frozen.prototype.use = function (action, unit) {
                    unit.takeInventory(this);
                    var action = ShizimilyRogue.Common.Action.Status(unit, 8 /* Senseless */, 10);
                    return [action];
                };
                return Banana_Frozen;
            })(Model.Item);

            /**
            * Core i7 Extreme
            */
            var Core_i7_Extreme = (function (_super) {
                __extends(Core_i7_Extreme, _super);
                function Core_i7_Extreme() {
                    _super.apply(this, arguments);
                    this.baseParam = 100;
                    this.baseName = "Core i7 Extreme";
                    this.isHeavy = true;
                }
                return Core_i7_Extreme;
            })(Model.Weapon);

            /**
            * Core i7
            */
            var Core_i7 = (function (_super) {
                __extends(Core_i7, _super);
                function Core_i7() {
                    _super.apply(this, arguments);
                    this.baseParam = 70;
                    this.baseName = "Core i7";
                }
                return Core_i7;
            })(Model.Weapon);

            /**
            * Core i5
            */
            var Core_i5 = (function (_super) {
                __extends(Core_i5, _super);
                function Core_i5() {
                    _super.apply(this, arguments);
                    this.baseParam = 30;
                    this.baseName = "Core i5";
                }
                return Core_i5;
            })(Model.Weapon);

            /**
            * Core i3
            */
            var Core_i3 = (function (_super) {
                __extends(Core_i3, _super);
                function Core_i3() {
                    _super.apply(this, arguments);
                    this.baseParam = 0;
                    this.baseName = "Core i3";
                }
                return Core_i3;
            })(Model.Weapon);

            /**
            * GeForce GTX Titan
            */
            var GeForceGTX_Titan = (function (_super) {
                __extends(GeForceGTX_Titan, _super);
                function GeForceGTX_Titan() {
                    _super.apply(this, arguments);
                    this.baseName = "GeForce GTX Titan";
                    this.baseParam = 100;
                    this.utuParam = 90;
                    this.isHeavy = true;
                }
                return GeForceGTX_Titan;
            })(Model.Guard);

            /**
            * GeForce GTX 780 Ti
            */
            var GeForceGTX_780Ti = (function (_super) {
                __extends(GeForceGTX_780Ti, _super);
                function GeForceGTX_780Ti() {
                    _super.apply(this, arguments);
                    this.baseName = "GeForce GTX 780Ti";
                    this.baseParam = 70;
                    this.utuParam = 60;
                }
                return GeForceGTX_780Ti;
            })(Model.Guard);

            /**
            * GeForce GT 620
            */
            var GeForceGT_620 = (function (_super) {
                __extends(GeForceGT_620, _super);
                function GeForceGT_620() {
                    _super.apply(this, arguments);
                    this.baseName = "GeForce GT 620";
                    this.baseParam = 30;
                    this.utuParam = 0;
                }
                return GeForceGT_620;
            })(Model.Guard);

            /**
            * Radeon R9 295X2
            */
            var Radeon_R9_295X2 = (function (_super) {
                __extends(Radeon_R9_295X2, _super);
                function Radeon_R9_295X2() {
                    _super.apply(this, arguments);
                    this.baseName = "Radeon R9 295X2";
                    this.baseParam = 90;
                    this.utuParam = 100;
                    this.isHeavy = true;
                }
                return Radeon_R9_295X2;
            })(Model.Guard);

            /**
            * Radeon R8 280
            */
            var Radeon_R8_280 = (function (_super) {
                __extends(Radeon_R8_280, _super);
                function Radeon_R8_280() {
                    _super.apply(this, arguments);
                    this.baseName = "Radeon R8 280";
                    this.baseParam = 60;
                    this.utuParam = 70;
                }
                return Radeon_R8_280;
            })(Model.Guard);

            /**
            * Radeon HD 6670
            */
            var Radeon_HD_6670 = (function (_super) {
                __extends(Radeon_HD_6670, _super);
                function Radeon_HD_6670() {
                    _super.apply(this, arguments);
                    this.baseName = "Radeon HD 6670";
                    this.baseParam = 0;
                    this.utuParam = 30;
                }
                return Radeon_HD_6670;
            })(Model.Guard);

            /**
            * 子守唄のDVD(部屋の敵が寝る)
            */
            var SleepingDVD = (function (_super) {
                __extends(SleepingDVD, _super);
                function SleepingDVD() {
                    _super.call(this, "子守唄のDVD");
                }
                SleepingDVD.prototype.use = function (action, unit) {
                    unit.takeInventory(this);
                    var action = ShizimilyRogue.Common.Action.Skill(9 /* RoomUnit */, 0 /* Sleep */);
                    action.sender = unit;
                    return [action];
                };
                return SleepingDVD;
            })(Model.DVD);

            /**
            * ロックDVD フロアの敵が10ターン混乱する
            */
            var RockDVD = (function (_super) {
                __extends(RockDVD, _super);
                function RockDVD() {
                    _super.call(this, "ロックのDVD");
                }
                RockDVD.prototype.use = function (action, unit) {
                    unit.takeInventory(this);
                    var action = ShizimilyRogue.Common.Action.Skill(9 /* RoomUnit */, 1 /* Confuse */);
                    action.sender = unit;
                    return [action];
                };
                return RockDVD;
            })(Model.DVD);

            /**
            * リア充のDVD フロアの敵に100の爆発ダメージ
            */
            var RealJuDVD = (function (_super) {
                __extends(RealJuDVD, _super);
                function RealJuDVD() {
                    _super.call(this, "リア充なDVD");
                }
                RealJuDVD.prototype.use = function (action, unit) {
                    unit.takeInventory(this);
                    var action = ShizimilyRogue.Common.Action.Skill(9 /* RoomUnit */, 3 /* Blast */);
                    action.sender = unit;
                    return [action];
                };
                return RealJuDVD;
            })(Model.DVD);

            /**
            * 意識の高いDVD(グラボ編) 装備中の防具の強さがあがる
            */
            var HighAwarenessDVD_Guard = (function (_super) {
                __extends(HighAwarenessDVD_Guard, _super);
                function HighAwarenessDVD_Guard() {
                    _super.call(this, "意識の高いDVD(グラボ編)");
                }
                HighAwarenessDVD_Guard.prototype.use = function (action, unit) {
                    unit.takeInventory(this);

                    /* 未実装 */
                    action.sender = unit;
                    return [action];
                };
                return HighAwarenessDVD_Guard;
            })(Model.DVD);

            /**
            * 意識の高いDVD(CPU編) 装備中の武器の強さがあがる
            */
            var HighAwarenessDVD_Weapon = (function (_super) {
                __extends(HighAwarenessDVD_Weapon, _super);
                function HighAwarenessDVD_Weapon() {
                    _super.call(this, "意識の高いDVD(CPU編)");
                }
                HighAwarenessDVD_Weapon.prototype.use = function (action, unit) {
                    unit.takeInventory(this);

                    /* 未実装 */
                    action.sender = unit;
                    return [action];
                };
                return HighAwarenessDVD_Weapon;
            })(Model.DVD);

            /**
            * DVD_R他のDVDをコピーできる
            */
            var DVD_R = (function (_super) {
                __extends(DVD_R, _super);
                function DVD_R() {
                    _super.call(this, "DVD_R");
                }
                DVD_R.prototype.use = function (action, unit) {
                    unit.takeInventory(this);

                    /* 未実装 */
                    action.sender = unit;
                    return [action];
                };
                return DVD_R;
            })(Model.DVD);

            /**
            * お宝鑑定団のDVD アイテムを識別できる
            */
            var Wealth_DVD = (function (_super) {
                __extends(Wealth_DVD, _super);
                function Wealth_DVD() {
                    _super.call(this, "お宝鑑定団のDVD");
                }
                Wealth_DVD.prototype.use = function (action, unit) {
                    unit.takeInventory(this);

                    /* 未実装 */
                    action.sender = unit;
                    return [action];
                };
                return Wealth_DVD;
            })(Model.DVD);

            /**
            * フォーマットDVD HDDの空き容量を100GB増やす
            */
            var Format_DVD = (function (_super) {
                __extends(Format_DVD, _super);
                function Format_DVD() {
                    _super.call(this, "フォーマットDVD");
                }
                Format_DVD.prototype.use = function (action, unit) {
                    unit.takeInventory(this);

                    /* 未実装 */
                    action.sender = unit;
                    return [action];
                };
                return Format_DVD;
            })(Model.DVD);

            /**
            * PC再起動DVD メモリの空き容量をMAXにする
            */
            var Restart_DVD = (function (_super) {
                __extends(Restart_DVD, _super);
                function Restart_DVD() {
                    _super.call(this, "PC再起動DVD");
                }
                Restart_DVD.prototype.use = function (action, unit) {
                    unit.takeInventory(this);

                    /* 未実装 */
                    action.sender = unit;
                    return [action];
                };
                return Restart_DVD;
            })(Model.DVD);

            /**
            * 場所替えアプリ
            */
            var Swap_SDCard = (function (_super) {
                __extends(Swap_SDCard, _super);
                function Swap_SDCard() {
                    _super.call(this, "場所替えアプリ");
                }
                Swap_SDCard.prototype.use = function (action, unit) {
                    /* 未実装 */
                    return [];
                };
                return Swap_SDCard;
            })(Model.SDCard);

            /**
            * 引き寄せアプリ
            */
            var Pull_SDCard = (function (_super) {
                __extends(Pull_SDCard, _super);
                function Pull_SDCard() {
                    _super.call(this, "引き寄せアプリ");
                }
                Pull_SDCard.prototype.use = function (action, unit) {
                    /* 未実装 */
                    return [];
                };
                return Pull_SDCard;
            })(Model.SDCard);

            /**
            * 吹き飛ばしアプリ
            */
            var Blow_SDCard = (function (_super) {
                __extends(Blow_SDCard, _super);
                function Blow_SDCard() {
                    _super.call(this, "吹き飛ばしアプリ");
                }
                Blow_SDCard.prototype.use = function (action, unit) {
                    /* 未実装 */
                    return [];
                };
                return Blow_SDCard;
            })(Model.SDCard);

            /**
            * 封印アプリ
            */
            var Seal_SDCard = (function (_super) {
                __extends(Seal_SDCard, _super);
                function Seal_SDCard() {
                    _super.call(this, "封印アプリ");
                }
                Seal_SDCard.prototype.use = function (action, unit) {
                    /* 未実装 */
                    return [];
                };
                return Seal_SDCard;
            })(Model.SDCard);

            /**
            * 身代わりアプリ
            */
            var Sacrifice_SDCard = (function (_super) {
                __extends(Sacrifice_SDCard, _super);
                function Sacrifice_SDCard() {
                    _super.call(this, "身代わりアプリ");
                }
                Sacrifice_SDCard.prototype.use = function (action, unit) {
                    /* 未実装 */
                    return [];
                };
                return Sacrifice_SDCard;
            })(Model.SDCard);

            /**
            * HDD
            */
            var HDD = (function (_super) {
                __extends(HDD, _super);
                function HDD() {
                    _super.call(this, 2 /* HDD */, "HDD");
                    this.size = Math.floor(ROT.RNG.getUniform() * 5000) + 200;
                }
                Object.defineProperty(HDD.prototype, "name", {
                    get: function () {
                        return "HDD" + " [" + (this.size) + "GB]";
                    },
                    enumerable: true,
                    configurable: true
                });

                HDD.prototype.use = function (action, unit) {
                    /* 未実装 */
                    return [];
                };
                return HDD;
            })(Model.Item);
            Data.HDD = HDD;

            /**
            * Memory
            */
            var Memory = (function (_super) {
                __extends(Memory, _super);
                function Memory() {
                    _super.call(this, 3 /* Memory */, "Memory");
                    this.size = Math.floor(ROT.RNG.getUniform() * 5000) + 200;
                }
                Object.defineProperty(Memory.prototype, "name", {
                    get: function () {
                        return "Memory" + " [" + (this.size) + "MB]";
                    },
                    enumerable: true,
                    configurable: true
                });

                Memory.prototype.use = function (action, unit) {
                    /* 未実装 */
                    return [];
                };
                return Memory;
            })(Model.Item);

            /**
            * PCケース
            */
            var PC_Case = (function (_super) {
                __extends(PC_Case, _super);
                function PC_Case() {
                    _super.call(this, "PCケース");
                }
                return PC_Case;
            })(Model.Case);

            /**
            * フルタワーPCケース
            */
            var FullTower_Case = (function (_super) {
                __extends(FullTower_Case, _super);
                function FullTower_Case() {
                    _super.call(this, "フルタワーPCケース");
                }
                return FullTower_Case;
            })(Model.Case);

            /**
            * キューブケース
            */
            var Cube_Case = (function (_super) {
                __extends(Cube_Case, _super);
                function Cube_Case() {
                    _super.call(this, "キューブケース");
                }
                return Cube_Case;
            })(Model.Case);

            /** お菓子一覧 */
            var SWEET_LIST = [ShortCake, Ice, MeltedIce, Cookie, Banana_Sleep, Banana_Mustard, Banana_EyeWash, Banana_Frozen];

            /** DVD一覧 */
            var DVD_LIST = [SleepingDVD, RockDVD, RealJuDVD, HighAwarenessDVD_Guard, HighAwarenessDVD_Weapon, DVD_R, Wealth_DVD, Format_DVD, Restart_DVD];

            /** SDCard一覧 */
            var SDCard_LIST = [Swap_SDCard, Pull_SDCard, Blow_SDCard, Seal_SDCard, Sacrifice_SDCard];

            /** CPU一覧 */
            var CPU_LIST = [Core_i7_Extreme, Core_i7, Core_i5, Core_i3];

            /** グラボ一覧 */
            var GPU_LIST = [GeForceGTX_Titan, GeForceGTX_780Ti, GeForceGT_620, Radeon_R9_295X2, Radeon_R8_280, Radeon_HD_6670];

            /** ケース一覧 */
            var Case_LIST = [PC_Case, FullTower_Case, Cube_Case];

            /**
            * アイテム生成クラス
            */
            var ItemFactory = (function () {
                function ItemFactory() {
                }
                /**
                * ランダムにお菓子を生成する
                * @return {Common.Item} お菓子
                */
                ItemFactory.getSweet = function () {
                    var n = Math.floor(ROT.RNG.getUniform() * SWEET_LIST.length);
                    return new SWEET_LIST[n];
                };

                /**
                * ランダムにDVDを生成する
                * @return {Common.Item} DVD
                */
                ItemFactory.getDVD = function () {
                    var n = Math.floor(ROT.RNG.getUniform() * DVD_LIST.length);
                    return new DVD_LIST[n];
                };

                /**
                * ランダムにSDCardを生成する
                * @return {Common.Item} SDCard
                */
                ItemFactory.getSDCard = function () {
                    var n = Math.floor(ROT.RNG.getUniform() * SDCard_LIST.length);
                    return new SDCard_LIST[n];
                };

                /**
                * ランダムにグラボを生成する
                * @return {Common.Item} グラボ
                */
                ItemFactory.getGPU = function () {
                    var n = Math.floor(ROT.RNG.getUniform() * GPU_LIST.length);
                    return new GPU_LIST[n];
                };

                /**
                * ランダムにCPUを生成する
                * @return {Common.Item} CPU
                */
                ItemFactory.getCPU = function () {
                    var n = Math.floor(ROT.RNG.getUniform() * CPU_LIST.length);
                    return new CPU_LIST[n];
                };

                /**
                * ランダムにケースを生成する
                * @return {Common.Item} Case
                */
                ItemFactory.getCase = function () {
                    var n = Math.floor(ROT.RNG.getUniform() * Case_LIST.length);
                    return new Case_LIST[n];
                };

                /**
                * HDDを生成する
                * @return {Common.Item} HDD
                */
                ItemFactory.getHDD = function () {
                    return new HDD();
                };

                /**
                * Memoryを生成する
                * @return {Common.Item} Memory
                */
                ItemFactory.getMemory = function () {
                    return new Memory();
                };

                /**
                * ランダムにアイテムを生成する
                * @return {Common.Item} Memory
                */
                ItemFactory.getItem = function () {
                    // 0:お菓子 1:DVD 2:SDCard 3:GPU 4:CPU 5:Case 6:HDD 7:Memory
                    var n = Math.floor(ROT.RNG.getUniform() * 8);
                    switch (n) {
                        case 0:
                            return ItemFactory.getSweet();
                        case 1:
                            return ItemFactory.getDVD();
                        case 2:
                            return ItemFactory.getSDCard();
                        case 3:
                            return ItemFactory.getGPU();
                        case 4:
                            return ItemFactory.getCPU();
                        case 5:
                            return ItemFactory.getCase();
                        case 6:
                            return ItemFactory.getHDD();
                        case 7:
                            return ItemFactory.getMemory();
                    }
                };
                return ItemFactory;
            })();
            Data.ItemFactory = ItemFactory;
        })(Model.Data || (Model.Data = {}));
        var Data = Model.Data;
    })(ShizimilyRogue.Model || (ShizimilyRogue.Model = {}));
    var Model = ShizimilyRogue.Model;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=items.js.map
