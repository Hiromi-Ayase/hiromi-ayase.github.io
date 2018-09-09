var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (Controller) {
        // ダンジョンの論理サイズ
        var WIDTH = 30;
        var HEIGHT = 30;

        // ダンジョンの初期階層
        var FIRST_FLOOR = 20;

        var Game = (function () {
            function Game() {
            }
            // ゲームの開始
            Game.prototype.start = function () {
                var _this = this;
                ShizimilyRogue.View.Scene.init(function () {
                    // 最初はタイトル
                    _this.setScene(new TitleScene());
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
                var a = ShizimilyRogue.View.Input.BtnA.count;
                if (a > 0) {
                    return new GameScene(FIRST_FLOOR);
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
                var a = ShizimilyRogue.View.Input.BtnA.count;
                if (a > 0) {
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

        var ClearScene = (function () {
            function ClearScene() {
                this._view = new ShizimilyRogue.View.ClearScene();
            }
            ClearScene.prototype.update = function (e) {
                var a = ShizimilyRogue.View.Input.BtnA.count;
                if (a > 0) {
                    return new TitleScene();
                }
                return null;
            };

            Object.defineProperty(ClearScene.prototype, "view", {
                get: function () {
                    return this._view;
                },
                enumerable: true,
                configurable: true
            });
            return ClearScene;
        })();

        var GameScene = (function () {
            function GameScene(floor, player) {
                if (typeof player === "undefined") { player = null; }
                this.player = player;
                this.init(floor);
            }
            GameScene.prototype.getFov = function () {
                return this.dungeonManager.getFOV(this.player);
            };

            Object.defineProperty(GameScene.prototype, "cell", {
                get: function () {
                    return this.dungeonManager.getCell(this.player.cell.coord.x, this.player.cell.coord.y);
                },
                enumerable: true,
                configurable: true
            });

            GameScene.prototype.update = function (e) {
                if (!ShizimilyRogue.View.Scene.animating && ShizimilyRogue.View.Input.mode == 0 /* Game */) {
                    switch (this.dungeonManager.endState) {
                        case 3 /* GameOver */:
                            return new GameOverScene();
                        case 2 /* Up */:
                            ShizimilyRogue.View.Scene.ASSETS.SE_STAIR.DATA.play();
                            var nextFloor = this.getFov().floor - 1;
                            if (nextFloor == 1) {
                                return new ClearScene();
                            } else {
                                return new GameScene(this.getFov().floor - 1, this.player);
                            }
                    }

                    if (this.dungeonManager.currentTurn == this.player && this._view.hasFieldFocus()) {
                        var dir = ShizimilyRogue.View.Input.keyDirection;

                        if (ShizimilyRogue.View.Input.BtnY.count > 0) {
                            // TBD:飛び道具
                            if (ShizimilyRogue.View.Input.BtnA.count > 0) {
                                // TBD:指定方向にダッシュ
                            } else if (ShizimilyRogue.View.Input.BtnB.count > 0 && dir != null) {
                                this.player.setDir(dir);
                                // 方向転換
                            } else if (dir != null) {
                                this.player.setDir(dir);
                            }
                            // 移動
                        } else if (dir != null) {
                            /*if (Common.DEBUG)
                            View.Scene.resetKeys();*/
                            this.player.setDir(dir);
                            if (ShizimilyRogue.View.Input.BtnX.count == 0 && this.getFov().movable[dir]) {
                                var action = ShizimilyRogue.Common.Action.Move();
                                this.input(action);
                            }
                            // 攻撃
                        } else if (ShizimilyRogue.View.Input.BtnA.count > 0) {
                            var action = ShizimilyRogue.Common.Action.Attack();
                            this.input(action);
                            // TBD:前方ダッシュ
                        } else if (ShizimilyRogue.View.Input.BtnB.count > 5) {
                            // メニュー
                        } else if (ShizimilyRogue.View.Input.BtnX.count > 0) {
                            this.showMainMenu();
                        }
                    }
                    this.viewUpdate();
                }
                this._view.updateFrame(10);
                return null;
            };

            GameScene.prototype.showMainMenu = function () {
                var _this = this;
                var mainItems = ["攻撃", "アイテム"];
                if (this.cell.isItem()) {
                    mainItems.push("ひろう");
                } else if (this.cell.isExit()) {
                    mainItems.push("次の階へ");
                }

                this._view.showMenu(0 /* Main */, mainItems, function (n) {
                    if (n == 0) {
                        _this._view.closeMenu();
                        var action = ShizimilyRogue.Common.Action.Attack();
                        _this.input(action);
                    }
                    if (n == 1) {
                        _this.showItemMenu();
                    }
                    if (n == 2) {
                        _this._view.closeMenu();
                        if (_this.cell.isItem()) {
                            var action = ShizimilyRogue.Common.Action.Pick();
                            _this.input(action);
                        } else if (_this.cell.isExit()) {
                            var action = ShizimilyRogue.Common.Action.None();
                            action.end = 2 /* Up */;
                            _this.input(action);
                        }
                    }
                }, false);
            };

            GameScene.prototype.showItemMenu = function () {
                var _this = this;
                var p = this.player;
                var itemNames = this.player.inventory.map(function (item) {
                    return p.guard != null && p.guard.id == item.id || p.weapon != null && p.weapon.id == item.id ? (item.name + "(E)") : item.name;
                });
                this._view.showMenu(1 /* Item */, itemNames, function (m) {
                    var item = _this.player.inventory[m];
                    var commandNames = item.commands();
                    _this._view.showMenu(2 /* Use */, item.commands(), function (n) {
                        if (commandNames[n] == "見る") {
                            var pcCase = item;
                            var innerItemNames = pcCase.innerItems.map(function (item) {
                                return item.name;
                            });
                            var innerItemNames = ["からだよ"];
                            _this._view.showMenu(1 /* Item */, innerItemNames, function (l) {
                                _this._view.closeMenu();
                                //var next: Common.Action = item.select(0, [pcCase.innerItems[l]]);
                                //this.input(next);
                            });
                            //} else if (commandNames[n] == "入れる") {
                            //    this._view.showMenu(View.MenuType.Item, itemNames, l => {
                            //        this._view.closeMenu();
                            //        var next: Common.Action = item.select(1, [this.player.inventory[l]]);
                            //        this.input(next);
                            //    });
                        } else {
                            _this._view.closeMenu();
                            var next = item.select(n);
                            _this.input(next);
                        }
                    });
                });
            };

            GameScene.prototype.input = function (action) {
                this.dungeonManager.addInput([action]);
            };

            GameScene.prototype.viewUpdate = function () {
                while (this.dungeonManager.hasNext()) {
                    var action = this.dungeonManager.update();
                    this._view.updateAction(this.getFov(), action, 10);
                    if (!action.isPick() && !action.isSystem() && !action.isNone()) {
                        break;
                    }
                }
            };

            Object.defineProperty(GameScene.prototype, "view", {
                get: function () {
                    return this._view;
                },
                enumerable: true,
                configurable: true
            });

            GameScene.prototype.init = function (floor) {
                var _this = this;
                // Dungeon(Model)とSceneManager(View)の作成
                this.dungeonManager = new ShizimilyRogue.Model.DungeonManager();

                if (this.player == null)
                    this.player = new ShizimilyRogue.Model.Player("しじみりちゃん");

                var results = this.dungeonManager.init(WIDTH, HEIGHT, floor, this.player);

                // Map生成
                var fov = this.getFov();
                var data = new ShizimilyRogue.View.GameSceneData(this.player, fov.width, fov.height, this.dungeonManager.objects, function (x, y) {
                    return _this.dungeonManager.getCell(x, y);
                });

                this._view = new ShizimilyRogue.View.GameScene(data, fov);
                results.forEach(function (action) {
                    return _this._view.updateAction(fov, action, ShizimilyRogue.Common.UNIT_SPEED);
                });
            };
            return GameScene;
        })();
    })(ShizimilyRogue.Controller || (ShizimilyRogue.Controller = {}));
    var Controller = ShizimilyRogue.Controller;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=controller.js.map
