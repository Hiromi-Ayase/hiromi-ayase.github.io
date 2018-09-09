var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (Scene) {
        // ゲーム画面のサイズ
        var VIEW_WIDTH = 640;
        var VIEW_HEIGHT = 480;

        // セルのサイズ
        var OBJECT_WIDTH = 64;
        var OBJECT_HEIGHT = 64;

        // ゲーム画面
        var SceneManager = (function () {
            function SceneManager() {
            }
            SceneManager.prototype.switchView = function (scene) {
                switch (scene) {
                    case 1 /* Opening */:
                        this.currentView = new OpeningScene();
                        break;
                    case 2 /* Ending */:
                        this.currentView = new EndingScene();
                        break;
                    case 0 /* Game */:
                        this.currentView = new GameScene();
                        break;
                }
            };
            return SceneManager;
        })();
        Scene.SceneManager = SceneManager;

        var AbstractScene = (function () {
            function AbstractScene() {
            }
            return AbstractScene;
        })();

        var OpeningScene = (function (_super) {
            __extends(OpeningScene, _super);
            function OpeningScene() {
                _super.apply(this, arguments);
            }
            return OpeningScene;
        })(AbstractScene);

        var EndingScene = (function (_super) {
            __extends(EndingScene, _super);
            function EndingScene() {
                _super.apply(this, arguments);
            }
            return EndingScene;
        })(AbstractScene);

        var GameScene = (function (_super) {
            __extends(GameScene, _super);
            function GameScene() {
                _super.call(this);
            }
            GameScene.prototype.map = function () {
                var wholeScene = new enchant.Group();

                for (var layer = 1; layer < 2; layer++) {
                    var map = new enchant.Map(OBJECT_WIDTH, OBJECT_HEIGHT);
                    var rawTable = dungeon.floor.getTable(layer);
                    var table = getMap(rawTable);
                    map.image = view.assets[wallImg];
                    map.loadData(table);
                    wholeScene.addChild(map);
                }
            };
            return GameScene;
        })(AbstractScene);

        var AbstractView = (function () {
            function AbstractView() {
                this.view = new enchant.Group();
            }
            return AbstractView;
        })();

        var Map = (function (_super) {
            __extends(Map, _super);
            function Map() {
                _super.apply(this, arguments);
            }
            Map.prototype.viewTable = function (table) {
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

                var w = table[0].length;
                var h = table.length;
                var wall = typeof ShizimilyRogue.Wall;

                for (var y = 0; y < h; y++) {
                    var line = table[y];
                    map.push(new Array(w));
                    for (var x = 0; x < w; x++) {
                        var type = typeof line[x];
                        if (type == wall) {
                            var blockId = 0;
                            blockId |= (x == 0 || y == 0 || typeof table[y - 1][x - 1] != wall) ? 1 : 0;
                            blockId |= (y == 0 || typeof table[y - 1][x] != wall) ? 2 : 0;
                            blockId |= (x == w - 1 || y == 0 || typeof table[y - 1][x + 1] != wall) ? 4 : 0;
                            blockId |= (x == w - 1 || typeof table[y][x + 1] != wall) ? 8 : 0;
                            blockId |= (x == w - 1 || y == h - 1 || typeof table[y + 1][x + 1] != wall) ? 16 : 0;
                            blockId |= (y == h - 1 || typeof table[y + 1][x] != wall) ? 32 : 0;
                            blockId |= (x == 0 || y == h - 1 || typeof table[y + 1][x - 1] != wall) ? 64 : 0;
                            blockId |= (x == 0 || typeof table[y][x - 1] != wall) ? 128 : 0;

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
        })(AbstractView);

        window.onload = function (e) {
            enchant();
            AbstractScene.game = new enchant.Core(VIEW_WIDTH, VIEW_HEIGHT);
            AbstractScene.game.preload("map.png", "unit.png", "windowmessage.png", "");
            AbstractScene.game.fps = 30;
        };
    })(ShizimilyRogue.Scene || (ShizimilyRogue.Scene = {}));
    var Scene = ShizimilyRogue.Scene;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=view.js.map
