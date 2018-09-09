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

                var imageUrl = [];
                for (var id in Scene.IMAGE)
                    imageUrl.push(Scene.IMAGE[id].URL);

                Scene.game.preload(imageUrl);
                Scene.eventInit();
                Scene.game.onload = function () {
                    for (var id in Scene.IMAGE)
                        Scene.IMAGE[id].DATA = Scene.game.assets[Scene.IMAGE[id].URL];
                    onloadHandler();
                };
                Scene.game.start();
            };

            Scene.addAnimating = function () {
                Scene._animating++;
            };

            Scene.decAnimating = function () {
                Scene._animating--;
            };

            Object.defineProperty(Scene, "animating", {
                get: function () {
                    return Scene._animating > 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scene, "keyUp", {
                get: function () {
                    return Scene._keyUp;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scene, "keyDown", {
                get: function () {
                    return Scene._keyDown;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scene, "keyLeft", {
                get: function () {
                    return Scene._keyLeft;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scene, "keyRight", {
                get: function () {
                    return Scene._keyRight;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scene, "keyDirection", {
                get: function () {
                    if (Scene._keyUp && Scene._keyLeft)
                        return 7 /* UP_LEFT */;
                    else if (Scene._keyUp && Scene._keyRight)
                        return 1 /* UP_RIGHT */;
                    else if (Scene._keyDown && Scene._keyRight)
                        return 3 /* DOWN_RIGHT */;
                    else if (Scene._keyDown && Scene._keyLeft)
                        return 5 /* DOWN_LEFT */;
                    else if (Scene._keyDown)
                        return 4 /* DOWN */;
                    else if (Scene._keyUp)
                        return 0 /* UP */;
                    else if (Scene._keyRight)
                        return 2 /* RIGHT */;
                    else if (Scene._keyLeft)
                        return 6 /* LEFT */;
                    else
                        null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Scene, "keyA", {
                get: function () {
                    return Scene._keyA;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Scene, "keyB", {
                get: function () {
                    return Scene._keyB;
                },
                enumerable: true,
                configurable: true
            });

            Scene.resetKeys = function () {
                this._keyUp = false;
                this._keyDown = false;
                this._keyLeft = false;
                this._keyRight = false;
                this._keyA = false;
                this._keyB = false;
            };

            Object.defineProperty(Scene, "keyLock", {
                get: function () {
                    return Scene._keyLock;
                },
                set: function (value) {
                    Scene._keyLock = value;
                    if (value)
                        Scene.resetKeys();
                },
                enumerable: true,
                configurable: true
            });

            Scene.eventInit = function () {
                Scene.game.keybind('Z'.charCodeAt(0), "a");
                Scene.game.keybind('X'.charCodeAt(0), "b");

                Scene.game.addEventListener(enchant.Event.UP_BUTTON_DOWN, function (e) {
                    Scene._keyUp = !Scene.keyLock && true;
                });
                Scene.game.addEventListener(enchant.Event.DOWN_BUTTON_DOWN, function (e) {
                    Scene._keyDown = !Scene.keyLock && true;
                });
                Scene.game.addEventListener(enchant.Event.RIGHT_BUTTON_DOWN, function (e) {
                    Scene._keyRight = !Scene.keyLock && true;
                });
                Scene.game.addEventListener(enchant.Event.LEFT_BUTTON_DOWN, function (e) {
                    Scene._keyLeft = !Scene.keyLock && true;
                });
                Scene.game.addEventListener(enchant.Event.A_BUTTON_DOWN, function (e) {
                    Scene._keyA = !Scene.keyLock && true;
                });
                Scene.game.addEventListener(enchant.Event.B_BUTTON_DOWN, function (e) {
                    Scene._keyB = !Scene.keyLock && true;
                });

                Scene.game.addEventListener(enchant.Event.UP_BUTTON_UP, function (e) {
                    Scene._keyUp = false;
                });
                Scene.game.addEventListener(enchant.Event.DOWN_BUTTON_UP, function (e) {
                    Scene._keyDown = false;
                });
                Scene.game.addEventListener(enchant.Event.RIGHT_BUTTON_UP, function (e) {
                    Scene._keyRight = false;
                });
                Scene.game.addEventListener(enchant.Event.LEFT_BUTTON_UP, function (e) {
                    Scene._keyLeft = false;
                });
                Scene.game.addEventListener(enchant.Event.A_BUTTON_UP, function (e) {
                    Scene._keyA = false;
                });
                Scene.game.addEventListener(enchant.Event.B_BUTTON_UP, function (e) {
                    Scene._keyB = false;
                });
            };

            Scene.setScene = function (scene, updateHandler) {
                Scene.game.clearEventListener(enchant.Event.ENTER_FRAME);
                Scene.game.replaceScene(scene);
                Scene.game.addEventListener(enchant.Event.ENTER_FRAME, updateHandler);
            };
            Scene.IMAGE = {
                WALL: { URL: "./images/wall_01.png", DATA: null },
                FLOOR: { URL: "./images/floor_01.png", DATA: null },
                UNIT: { URL: "./images/unit.png", DATA: null },
                SHIZIMILY: { URL: "./images/shizimi.png", DATA: null },
                TITLE: { URL: "./images/title.png", DATA: null },
                MESSAGE: { URL: "./images/MessageWindow.png", DATA: null },
                ITEM_WINDOW: { URL: "./images/ItemWindow.png", DATA: null },
                MESSAGE_ICON: { URL: "./images/shizimily_faceIcon_A0.png", DATA: null },
                SHADOW: { URL: "./images/shadow.png", DATA: null },
                MEMU_MAIN: { URL: "./images/MainMenu.png", DATA: null },
                CURSOR: { URL: "./images/cursor.png", DATA: null },
                ITEM: { URL: "./images/cake.png", DATA: null },
                USE_MENU: { URL: "./images/UseMenu.png", DATA: null },
                MINI_MAP: { URL: "./images/minimap.png", DATA: null }
            };

            Scene._keyUp = false;
            Scene._keyDown = false;
            Scene._keyLeft = false;
            Scene._keyRight = false;
            Scene._keyA = false;
            Scene._keyB = false;
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
