var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (View) {
        // ゲーム画面のサイズ
        View.VIEW_WIDTH = 640;
        View.VIEW_HEIGHT = 480;
        var FPS = 30;

        // シーン
        var Scene = (function (_super) {
            __extends(Scene, _super);
            function Scene() {
                _super.apply(this, arguments);
            }
            Scene.init = function (onloadHandler) {
                enchant();
                Scene.game = new enchant.Core(View.VIEW_WIDTH, View.VIEW_HEIGHT);
                Scene.game.fps = FPS;

                var assetsURL = [];
                for (var id in Scene.ASSETS)
                    assetsURL.push(Scene.ASSETS[id].URL);

                Scene.game.preload(assetsURL);
                View.Input.init();
                Scene.game.onload = function () {
                    Scene.game.addEventListener(enchant.Event.ENTER_FRAME, View.Input.update);
                    for (var id in Scene.ASSETS)
                        Scene.ASSETS[id].DATA = Scene.game.assets[Scene.ASSETS[id].URL];

                    onloadHandler();
                };
                Scene.game.start();
            };

            Scene.addAnimating = function () {
                Scene._animating++;
                //Common.Debug.message("add animating:" + Scene._animating);
            };

            Scene.decAnimating = function () {
                Scene._animating--;
                //Common.Debug.message("dec animating:" + Scene._animating);
            };

            Object.defineProperty(Scene, "animating", {
                get: function () {
                    return Scene._animating > 0;
                },
                enumerable: true,
                configurable: true
            });

            Scene.setScene = function (scene, updateHandler) {
                Scene.game.removeEventListener(enchant.Event.ENTER_FRAME, Scene.contollerUpdateHandler);
                Scene.game.addEventListener(enchant.Event.ENTER_FRAME, updateHandler);
                Scene.contollerUpdateHandler = updateHandler;

                View.Input.resetKeys();
                Scene.game.replaceScene(scene);
            };
            Scene.ASSETS = {
                WALL00: { URL: "./images/Map/wall_floor.png", DATA: null },
                FLOOR: { URL: "./images/Map/Floor.png", DATA: null },
                MINI_MAP: { URL: "./images/Map/minimap.png", DATA: null },
                MESSAGE_WINDOW: { URL: "./images/Message/MessageWindow.png", DATA: null },
                MESSAGE_ICON: { URL: "./images/Message/MessageIcon.png", DATA: null },
                MENU_CURSOR: { URL: "./images/Menu/MenuCursor.png", DATA: null },
                MENU_WINDOW: { URL: "./images/Menu/MenuWindow.png", DATA: null },
                CPU: { URL: "./images/Item/CPU.png", DATA: null },
                GRAPHIC_BOARD: { URL: "./images/Item/GraphicBoard.png", DATA: null },
                HDD: { URL: "./images/Item/HDD.png", DATA: null },
                MEMORY: { URL: "./images/Item/Memory.png", DATA: null },
                SWEET: { URL: "./images/Item/Sweet.png", DATA: null },
                DVD: { URL: "./images/Item/DVD.png", DATA: null },
                PC_CASE: { URL: "./images/Item/PCCase.png", DATA: null },
                SD_CARD: { URL: "./images/Item/SDCard.png", DATA: null },
                SHIZIMILY: { URL: "./images/Unit/Shizimily.png", DATA: null },
                WORD: { URL: "./images/Unit/Word.png", DATA: null },
                STAIRS: { URL: "./images/Object/Stairs.png", DATA: null },
                UNIT: { URL: "./images/unit.png", DATA: null },
                TITLE: { URL: "./images/title.png", DATA: null },
                LOGO: { URL: "./images/logo.png", DATA: null },
                SHADOW: { URL: "./images/shadow.png", DATA: null },
                //            UI_APAD: { URL: "./images/apad.png", DATA: <enchant.Surface>null },
                //            UI_FONT: { URL: "./images/font.png", DATA: <enchant.Surface>null },
                //            UI_ICON: { URL: "./images/icon.png", DATA: <enchant.Surface>null },
                //            UI_PAD: { URL: "./images/pad.png", DATA: <enchant.Surface>null },
                BGM_MAIN: { URL: "./music/shizimily.mp3", DATA: null },
                SE_ATTACK: { URL: "./sound/attack.mp3", DATA: null },
                SE_HEAL: { URL: "./sound/heal.mp3", DATA: null },
                SE_TAKE: { URL: "./sound/take.mp3", DATA: null },
                SE_USE: { URL: "./sound/use.mp3", DATA: null },
                SE_DIE: { URL: "./sound/die.mp3", DATA: null },
                SE_STAIR: { URL: "./sound/stair.mp3", DATA: null }
            };

            Scene._animating = 0;

            Scene._keyLock = false;
            return Scene;
        })(enchant.Scene);
        View.Scene = Scene;

        var OpeningScene = (function (_super) {
            __extends(OpeningScene, _super);
            function OpeningScene() {
                _super.apply(this, arguments);
            }
            return OpeningScene;
        })(Scene);

        var EndingScene = (function (_super) {
            __extends(EndingScene, _super);
            function EndingScene() {
                _super.apply(this, arguments);
            }
            return EndingScene;
        })(Scene);
    })(ShizimilyRogue.View || (ShizimilyRogue.View = {}));
    var View = ShizimilyRogue.View;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=scene.js.map
