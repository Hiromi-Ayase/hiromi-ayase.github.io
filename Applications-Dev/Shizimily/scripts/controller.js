var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (Controller) {
        // ダンジョンの論理サイズ
        var WIDTH = 25;
        var HEIGHT = 25;

        var Game = (function () {
            function Game() {
            }
            // ゲームの開始
            Game.prototype.start = function () {
                var _this = this;
                ShizimilyRogue.View.Scene.init(function () {
                    // 最初はタイトル
                    _this.setScene(new GameScene());
                });
            };

            Game.prototype.setScene = function (scene) {
                var _this = this;
                this.scene = scene;
                ShizimilyRogue.View.Scene.setScene(scene.view, function (e) {
                    var scene = _this.scene.update(e);
                    if (scene != null) {
                        _this.setScene(scene);
                    }
                });
            };
            return Game;
        })();
        Controller.Game = Game;

        var TitleScene = (function () {
            function TitleScene() {
                this._view = new ShizimilyRogue.View.TitleScene();
            }
            TitleScene.prototype.update = function (e) {
                var a = ShizimilyRogue.View.Scene.keyA;
                if (a) {
                    return new GameScene();
                }
                return null;
            };

            Object.defineProperty(TitleScene.prototype, "view", {
                get: function () {
                    return this._view;
                },
                enumerable: true,
                configurable: true
            });
            return TitleScene;
        })();

        var GameOverScene = (function () {
            function GameOverScene() {
                this._view = new ShizimilyRogue.View.GameOverScene();
            }
            GameOverScene.prototype.update = function (e) {
                var a = ShizimilyRogue.View.Scene.keyA;
                if (a) {
                    return new TitleScene();
                }
                return null;
            };

            Object.defineProperty(GameOverScene.prototype, "view", {
                get: function () {
                    return this._view;
                },
                enumerable: true,
                configurable: true
            });
            return GameOverScene;
        })();

        var GameScene = (function () {
            function GameScene() {
                this.init();
            }
            GameScene.prototype.getFov = function () {
                return this.dungeonManager.getFOV(this.player);
            };

            GameScene.prototype.update = function (e) {
                if (!ShizimilyRogue.View.Scene.animating) {
                    if (this.dungeonManager.endState != 0 /* None */) {
                        return new GameOverScene();
                    }

                    var dir = ShizimilyRogue.View.Scene.keyDirection;
                    var a = ShizimilyRogue.View.Scene.keyA;
                    var b = ShizimilyRogue.View.Scene.keyB;
                    if (dir != null) {
                        if (ShizimilyRogue.Common.DEBUG)
                            ShizimilyRogue.View.Scene.resetKeys();
                        this.player.setDir(dir);
                        if (this.getFov().movable[dir]) {
                            var action = ShizimilyRogue.Common.Action.Move();
                            this.viewUpdate(action);
                        }
                    } else if (a == true) {
                        var action = ShizimilyRogue.Common.Action.Attack(this.player.atk);
                        this.viewUpdate(action);
                    } else if (b == true) {
                        this.showMenu();
                    }
                }
                return null;
            };

            GameScene.prototype.showMenu = function () {
                var _this = this;
                this._view.showMenu(0 /* Main */, ["攻撃", "アイテム"], function (n) {
                    if (n == 1) {
                        var itemNames = _this.player.inventory.map(function (item) {
                            return item.name;
                        });
                        _this._view.showMenu(1 /* Item */, itemNames, function (m) {
                            var item = _this.player.inventory[m];
                            var commandNames = [];
                            item.commands.forEach(function (command) {
                                switch (command) {
                                    case 2 /* Use */:
                                        commandNames.push("使う");
                                        break;
                                    case 3 /* Throw */:
                                        commandNames.push("投げる");
                                        break;
                                }
                            });
                            _this._view.showMenu(2 /* Use */, commandNames, function (command) {
                                _this._view.closeMenu();
                                var action = null;
                                switch (command) {
                                    case 0:
                                        action = ShizimilyRogue.Common.Action.Use(item);
                                        break;
                                    case 1:
                                        action = ShizimilyRogue.Common.Action.Throw(item);
                                        break;
                                }
                                _this.viewUpdate(action);
                            });
                        });
                    }
                }, false);
            };

            GameScene.prototype.viewUpdate = function (action) {
                if (typeof action === "undefined") { action = null; }
                if (action != null) {
                    var results = [];
                    this.dungeonManager.next(action, function (result) {
                        results.push(result);
                        //if (this.dungeonManager.currentObject.isPlayer()) {
                        //    this._view.update(this.fov, results, 10);
                        //    results = [];
                        //}
                    });
                    this._view.update(this.getFov(), results, 10);
                }
            };

            Object.defineProperty(GameScene.prototype, "view", {
                get: function () {
                    return this._view;
                },
                enumerable: true,
                configurable: true
            });

            GameScene.prototype.init = function () {
                var _this = this;
                // Dungeon(Model)とSceneManager(View)の作成
                this.dungeonManager = new ShizimilyRogue.Model.DungeonManager(WIDTH, HEIGHT);
                this.player = this.dungeonManager.currentTurn;

                // Map生成
                var fov = this.getFov();
                var data = new ShizimilyRogue.View.GameSceneData(this.player, fov.width, fov.height, this.dungeonManager.objects, function (x, y) {
                    return _this.dungeonManager.getCell(x, y);
                });
                this._view = new ShizimilyRogue.View.GameScene(data, fov);
            };
            return GameScene;
        })();
    })(ShizimilyRogue.Controller || (ShizimilyRogue.Controller = {}));
    var Controller = ShizimilyRogue.Controller;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=controller.js.map
