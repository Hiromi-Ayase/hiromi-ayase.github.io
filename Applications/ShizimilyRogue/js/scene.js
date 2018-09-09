/*global ROT, tm, window*/
var game = game || {};

// ゲームシーン
(function (ns) {
    ns.Scene = {};
    // チュートリアルシーン
    ns.Scene.Tutorial = tm.define("game.scene.Tutorial", {
        superClass: "tm.app.Scene",
        init: function () {
            this.superInit();
            this.fromJSON({
                width: ns.Setting.screenWidth,
                height: ns.Setting.screenHeight,
            });
            this.bg = tm.display.Sprite("tutorial").fromJSON({
                x: 0,
                y: 0,
                originX: 0,
                originY: 0,
            }).addChildTo(this);
            
            this.logo = tm.display.Sprite("opening_logo").fromJSON({
                x: 130,
                y: 70,
                scaleX: 0.5,
                scaleY: 0.5
            }).addChildTo(this);
            ns.Sound.Bgm.play("tutorial");
            var stage = ns.Stage.tutorial;
            this.backLabel = ns.Effect.BackLabel("Zボタンでタイトルへ").addChildTo(this.bg);
            this.backLabel.visible = false;

            this.message = ns.UI.MessageArea({wait: 4, notErase: true}).addChildTo(this.bg);
            stage.message.forEach(function (line) {
                ns.Log(line);
            }.bind(this));
            ns.UI.Controller(this);
        },
        update: function (app) {
            ns.Frame = app.frame;
            
            if (this.message.messages.length > 0 && this.message.finished() && !this.backLabel.visible) {
                this.backLabel.visible = true;
            }
            
            var key = ns.Util.KeyInput(app);
            if (this.backLabel.visible) {
                if (key.z) {
                    ns.Sound.Bgm.stop();
                    key.press();
                    this.bg.tweener.clear().fadeOut(1000).call(function () {
                        app.replaceScene(ns.Scene.Opening());
                    });
                }
            }
            if (key.x) {
                app.pushScene(ns.Scene.Pause());
                key.press();
            }
        }
    });
    
    // 各階層ごとのシーン
    ns.Scene.Main = tm.define("game.Scene.Main", {
        superClass: "tm.app.Scene",
        init: function (shizimily, stage, floorIndex) {
            floorIndex = floorIndex || stage.floor.length - 1;
            var floor = stage.floor[floorIndex];
            floor.index = floor.index || floorIndex;
            floor.next = floor.next || floorIndex - 1;
            if (floor.next === 0) {
                floor.next = "clear";
            }

            this.superInit();
            this.fromJSON({
                shizimily: shizimily,
                floor: floor,
                world: ns.World(shizimily, floor.type).addChildTo(this),
                message: ns.UI.MessageArea().addChildTo(this),
                clock: ns.UI.Clock(ns.Util.turn2date(shizimily.turn)).addChildTo(this),
                floorDigit: ns.UI.FloorDigit(floor.index, floor.name).addChildTo(this),
                tween: tm.anim.Tween(),
                stage: stage,
                lock: true,
                sound: ns.Sound.Interface(),
            });
            ns.Sound.Bgm.play(floor.bgm);
            this.sound.play("mapfound");
            var messageArray = stage.floor[floorIndex].description;
            if (typeof messageArray === "string") {
                messageArray = [messageArray];
            }
            // Tween 開始後に見せる
            this.world.miniMap.addChildTo(this);
            this.world.y = -this.world.height;

            this.tween.fromTo(this.shizimily, {
                y: -this.world.height
            }, {
                y: shizimily.y
            }, ns.Setting.worldScroll);
            this.tween.start();
            this.tween.on("finish", function () {
                messageArray.forEach(function (message) {
                    ns.Log("start", {stage: message});
                });
                this.lock = false;
            }.bind(this));

            ns.CurrentScene = this;
            // Set the global menu open function
            ns.Menu.Open = function () {
                return ns.Menu.Main().addChildTo(this);
            }.bind(this);
            
            this.faceFrame = 0;
            this.faceSubIndex = 0;
            ns.setFace = function (type) {
                if (type === "happy") {
                    this.faceFrame = ns.Frame + ns.Setting.face.frame;
                    this.faceSubIndex = 1;
                } else if (type === "sad") {
                    this.faceFrame = ns.Frame + ns.Setting.face.frame;
                    this.faceSubIndex = 2;
                }
            }.bind(this);
            ns.UI.Controller(this);
        },
        gameOver: function () {
            if (!this.nextScene) {
                this.nextScene = ns.Scene.GameOver;
                this.message.notErase = true;
            }
        },
        clear: function () {
            this.lock = true;
            var tween = this.tween;
            ns.Sound.Bgm.stop();
            tween.to(this.shizimily, {
                y: this.world.height * 2
            }, ns.Setting.worldScroll);
            tween.on("finish", function () {
                var next = this.floor.next;
                if (next === "clear") {
                    next = ns.Scene.Clear(this.shizimily, this.stage);
                } else {
                    next = ns.Scene.Main(this.shizimily, this.stage, next);
                }
                this.app.replaceScene(next);
            }.bind(this));
            tween.start();
        },
        update: function (app) {
            var status = this.shizimily.status;
            var special = null;
            if (status.sleep) {
                special = "SLEEP!";
            } else if (status.seal) {
                special = "SEAL!";
            } else if (status.hungry / status.maxHungry <= 0.1) {
                special = "HUNGRY!";
            } else if (status.hp / status.maxHp <= 0.1) {
                special = "DANGER!";
            } else if (this.shizimily.turn > ns.Setting.maxTurn * 0.9) {
                special = "TIME!";
            }
            this.message.status.set(status.maxHp, status.hp, status.maxUtsu, status.utsu, special);
            this.clock.setTime(ns.Util.turn2date(this.shizimily.turn));
            ns.Frame = app.frame;

            var faces = ns.Util.getFace(status.maxUtsu, status.utsu);
            this.message.setFace(faces[this.faceSubIndex]);

            if (this.shizimily.dead) {
                this.gameOver();
                this.faceSubIndex = 2;
            } else {
                // ランダムニュース
                if (ns.Frame % (ns.Setting.fps * ns.Setting.randomNews) === 0) {
                    this.sound.play("news");
                    ns.Log("newsRep");
                    ns.Log("news");
                }
                if (ns.Frame % (ns.Setting.fps * ns.Setting.randomVoice) === 0) {
                    ns.Sound.Random.play();
                }
                if (ns.Frame >= this.faceFrame) {
                    this.faceSubIndex = 0;
                }
            }


            if (!this.lock) {
                this.processKey(app);
            }
        },
        processKey: function (app) {
            var key;
            var shizimily = this.shizimily;
            var menu = this.getChildByName("main-menu");

            if (this.nextScene) {
                ns.Sound.Bgm.stop();
                key = ns.Util.KeyInput(app);
                if (key.z) {
                    this.app.replaceScene(this.nextScene(this.shizimily, this.stage));
                    key.press();
                }
            } else if (menu) {
                // メニュー画面
                key = ns.Util.KeyInput(app);
                menu = menu.getCurrent();
                // メインメニューが開いている状態
                var index = menu.index;

                if (menu.name === "setting-menu") {
                    if (menu.nowEditing) {
                        if (index >= 2 && key.abs) {
                            menu.setValue(key.abs);
                            key.press();
                        } else if (key.dir === 0) {
                            menu.setValue(5);
                            key.press();
                        } else if (key.dir === 4) {
                            menu.setValue(-5);
                            key.press();
                        } else if (key.z || key.x) {
                            menu.exec();
                            key.press();
                        }
                    } else {
                        if (key.dir === 2) {
                            menu.selectElement(index - 1);
                            key.press();
                        } else if (key.dir === 6) {
                            menu.selectElement(index + 1);
                            key.press();
                        } else if (key.z) {
                            menu.exec();
                            key.press();
                        } else if (key.x) {
                            menu.close();
                            key.press();
                        }
                    }
                } else if (key.z) {
                    menu.exec();
                    key.press();
                } else if (key.x) {
                    menu.close();
                    key.press();
                } else if (key.dir % 2 === 0) {
                    key.press();
                    var list = [1, -menu.row, -1, menu.row];
                    index += list[key.dir / 2];
                    menu.selectElement(index);
                }
            } else if (this.world.isOperatable()) {
                key = ns.Util.KeyInput(app);

                // ダッシュボタン
                if (key.a) {
                    ns.Speed = ns.Setting.object.speed / 10;
                } else {
                    ns.Speed = ns.Setting.object.speed;
                }
                // 斜め移動限定ボタン
                shizimily.setArrow(key.d);
                // ミニマップ非表示
                this.world.miniMap.visible = !key.f;

                // 通常の入力
                if (key.z) {
                    // Z key
                    this.world.input(ns.ACTION.ATTACK);
                    key.press();
                } else if (key.x) {
                    this.world.input(ns.ACTION.SKILL);
                    key.press();
                } else if (key.c) {
                    this.world.input(ns.ACTION.NONE);
                } else if (key.v) {
                    // V key open menu
                    ns.Menu.Open();
                    key.press();
                } else if (key.dir >= 0) {
                    // 移動
                    // ±22.5度の範囲で角度を決定
                    var dir = ns.Dirs[key.dir];

                    // 斜め移動限定ボタンが押されてる場合
                    if (key.d && !dir.isDiagonal()) {
                        return;
                    }

                    this.world.shizimily.dir = dir;
                    if (!key.s) {
                        this.world.input(ns.ACTION.MOVE);
                        key.press();
                    }
                }
            }
        }
    });

    // オープニング
    ns.Scene.Opening = tm.define("game.scene.Opening", {
        superClass: "tm.app.Scene",
        init: function () {
            this.superInit();
            this.fromJSON({
                width: ns.Setting.screenWidth,
                height: ns.Setting.screenHeight,
            });
            this.bg = tm.display.Sprite("opening_bg").fromJSON({
                x: ns.Setting.screenCenterX,
                y: ns.Setting.screenCenterY,
            }).addChildTo(this);
            ns.Sound.Bgm.play("opening");
            this.logo = tm.display.Sprite("opening_logo").fromJSON({
                y: -250,
            }).addChildTo(this.bg);
            
            this.menu = tm.display.Shape().addChildTo(this.bg);
            this.menu.fromJSON({
                x: 0,
                y: 0,
                originX: 0,
                originY: 0,
                index: 0,
                alpha: 0,
            });
            this.menu.items = [
                ns.Stage.white,
                ns.Stage.black,
                ns.Stage.tutorial,
            ].map(function (item, index) {
                var on = tm.display.Sprite("opening_" + item.name + "_on").addChildTo(this.menu);
                var off = tm.display.Sprite("opening_" + item.name + "_off").addChildTo(this.menu);
                on.visible = false;
                off.visible = false;
                return {
                    on: on,
                    off: off,
                    stage: item
                };
            }.bind(this));
            this.lock = true;
            this.logo.tweener.wait(200).to({
                y: 0
            }, 1200, "easeOutBounce").call(function () {
                this.menu.tweener.to({
                    alpha: 1,
                }, 200).call(function () {
                    this.lock = false;
                }.bind(this));
            }.bind(this));
            ns.UI.Controller(this);
        },
        update: function (app) {
            if (!this.lock) {
                var key = ns.Util.KeyInput(app);
                if (key.dir === 2) {
                    key.press();
                    this.menu.index --;
                } else if (key.dir === 6) {
                    key.press();
                    this.menu.index ++;
                } else if (key.z) {
                    key.press();
                    ns.Sound.Interface().play("start");
                    ns.Sound.Bgm.stop();
                    var shizimily = ns.Character.Shizimily();
                    var stage = this.menu.items[this.menu.index].stage;
                    var scene;
                    if (stage.name === "tutorial") {
                        scene = ns.Scene.Tutorial;
                    } else {
                        scene = ns.Scene.Main;
                    }
                    this.lock = true;
                    this.bg.tweener.fadeOut(1000).call(function () {
                        app.replaceScene(scene(shizimily, stage));
                    });
                }
            }
            this.menu.index = (this.menu.items.length + this.menu.index) % this.menu.items.length;

            this.menu.items.forEach(function(item, index) {
                if (this.menu.index === index) {
                    item.on.visible = true;
                    item.off.visible = false;
                } else {
                    item.on.visible = false;
                    item.off.visible = true;
                }
            }, this);
        }
    });

    // ゲームオーバー
    ns.Scene.GameOver = tm.define("game.scene.GameOver", {
        superClass: "tm.app.Scene",

        init: function (shizimily, stage) {
            this.superInit();
            this.bg = tm.display.Shape().fromJSON({
                width: ns.Setting.screenWidth,
                height: ns.Setting.screenHeight,
                x: 0,
                y: 0,
                originX: 0,
                originY: 0,
                alpha: 0,
            }).addChildTo(this);
            this.title = tm.display.Label("げーむおーばー").fromJSON({
                x: this.bg.width / 2,
                y: this.bg.height / 2 - 150,
                align: "center",
                baseline: "middle",
                fontSize: 64,
                fillStyle: "rgba(255, 255, 255, 1)",
            }).addChildTo(this.bg);
            this.subTitle = tm.display.Label("しじみりちゃんは会社の闇へと吸い込まれて行きました...").fromJSON({
                x: this.bg.width / 2,
                y: this.bg.height / 2 + 100,
                align: "center",
                baseline: "middle",
                fontSize: 32,
                fillStyle: "rgba(255, 255, 255, 0.5)",
            }).addChildTo(this.bg);

            shizimily.fromJSON({
                dir: ns.Dirs[2],
                x: this.bg.width / 2,
                y: this.bg.height / 2 + 20,
            }).addChildTo(this.bg);
            ns.Sound.Bgm.play("gameOver");
            this.backLabel = ns.Effect.BackLabel("Zボタンでタイトルへ").addChildTo(this.bg);
            this.backLabel.visible = false;
            this.bg.tweener.fadeIn(1000).call(function () {
                var tween = tm.anim.Tween();
                tween.fromTo(shizimily, {
                    y: this.bg.height / 2 + 20,
                    alpha: 1,
                    scaleX: 1,
                    scaleY: 1,
                }, {
                    y: this.bg.height / 2 - 20,
                    alpha: 0,
                    scaleX: 0.2,
                    scaleY: 0.2,
                }, 15000).start();
                this.backLabel.tweener.wait(3000).call(function () {
                    this.backLabel.visible = true;
                }.bind(this));
            }.bind(this));
            ns.UI.Controller(this);
            ns.UI.Twitter(this, stage, shizimily);
        },
        update: function (app) {
            var key = ns.Util.KeyInput(app);
            if (this.backLabel.visible && key.z) {
                ns.Sound.Bgm.stop();
                this.bg.tweener.clear().fadeOut(1000).call(function () {
                    app.replaceScene(ns.Scene.Opening());
                }.bind(this));
                key.press();
            }
        }
    });

    // ゲームクリア
    ns.Scene.Clear = tm.define("game.scene.Clear", {
        superClass: "tm.app.Scene",
        init: function (shizimily, stage) {
            this.superInit();
            this.fromJSON({
                width: ns.Setting.screenWidth,
                height: ns.Setting.screenHeight,
            });
            this.bg = tm.display.Sprite("ending_bg").fromJSON({
                x: 0,
                y: 0,
                originX: 0,
                originY: 0,
                alpha: 0,
            }).addChildTo(this);
            
            this.logo = tm.display.Sprite("opening_logo").fromJSON({
                x: 130,
                y: 70,
                scaleX: 0.5,
                scaleY: 0.5
            }).addChildTo(this.bg);
            
            this.backLabel = ns.Effect.BackLabel("決定ボタンでタイトルへ").addChildTo(this.bg);
            this.backLabel.visible = false;

            this.staffRoll = tm.display.RectangleShape().fromJSON({
                x: 900,
                y: 300,
                width: 500,
                height: 450,
                fillStyle: "rgba(0, 0, 0, 0.7)",
                strokeStyle: "rgba(0, 0, 0, 0)",
            }).addChildTo(this.bg);
            tm.display.Label(stage.message.staffRoll.join("\n")).fromJSON({
                y: -this.staffRoll.height / 2 + 50,
                align: "center",
                baseline: "top",
                fontSize: 24,
                fillStyle: "rgba(255, 255, 255, 0.5)",
            }).addChildTo(this.staffRoll);

            
            this.message = ns.UI.MessageArea({wait: 4, notErase: true}).addChildTo(this.bg);
            this.bg.tweener.fadeIn(1000).call(function () {
                stage.message.clear.forEach(function (line) {
                    ns.Log(line);
                }.bind(this));
            });
            ns.Sound.Bgm.play("gameClear");
            shizimily.addChildTo(this.bg);
            shizimily.dir = ns.Dirs[7];
            var tween = tm.anim.Tween();
            tween.fromTo(shizimily, {
                x: 500,
                y: 480,
                alpha: 0
            }, {
                x: 1400,
                y: 400,
                alpha: 1
            }, 15000).start();
            ns.UI.Controller(this);
            ns.UI.Twitter(this, stage, shizimily);
        },
        update: function (app) {
            ns.Frame = app.frame;
            
            if (this.message.messages.length > 0 && this.message.finished() && !this.backLabel.visible) {
                this.backLabel.visible = true;
            }
            
            if (this.backLabel.visible) {
                var key = ns.Util.KeyInput(app);
                if (key.z) {
                    ns.Sound.Bgm.stop();
                    key.press();
                    this.bg.tweener.clear().fadeOut(1000).call(function () {
                        app.replaceScene(ns.Scene.Opening());
                    });
                }
            }
        }
    });

    // ポーズ
    ns.Scene.Pause = tm.define("PauseScene", {
        superClass: "tm.app.Scene",

        init: function () {
            var self = this;
            this.superInit();
            var filter = tm.display.RectangleShape({
                width: ns.Setting.screenWidth,
                height: ns.Setting.screenHeight,
                x: ns.Setting.screenWidth / 2,
                y: ns.Setting.screenHeight / 2,
                fillStyle: "rgba(0,0,0,0.7)",
                strokeStyle: "rgba(0,0,0,0.7)",
            }).addChildTo(this);
            this.label = tm.display.Label("タイトル画面にもどります。OK？ (決定キー:Yes キャンセルキー:No)").fromJSON({
                x: this.with / 2,
                y: this.height / 2,
                align: "center",
                baseline: "middle",
                fontSize: 32,
                fillStyle: "rgba(255, 255, 255, 1)",
            }).addChildTo(this);
            ns.Sound.Bgm.pause();
            ns.UI.Controller(this);
        },
        update: function (app) {
            var key = ns.Util.KeyInput(app);
            if (key.x) {
                ns.Sound.Bgm.play();
                app.popScene();
                key.press();
            } else if (key.z) {
                ns.Sound.Bgm.stop();
                app.popScene();
                app.replaceScene(ns.Scene.Opening());
                key.press();
            }
        }
    });

    // ローディング
    ns.Scene.Loading = tm.define("tm.ui.LoadingScene", {
        superClass: "tm.app.Scene",
        init: function(param) {
            this.superInit();
            this.bg = tm.display.Shape().fromJSON({
                width: ns.Setting.screenWidth,
                height: ns.Setting.screenHeight,
                originX: 0,
                originY: 0
            }).addChildTo(this);
            this.bg.canvas.clearColor("rgb(0, 0, 0)");

            var label = tm.display.Label("Loading").fromJSON({
                x: this.bg.width,
                y: this.bg.height,
                width: param.width,
                align: "right",
                baseline: "bottom",
                fontSize: 32,
                counter: 0,
                update: function(app) {
                    if (app.frame % 30 === 0) {
                        this.text += ".";
                        this.counter += 1;
                        if (this.counter > 3) {
                            this.counter = 0;
                            this.text = "Loading";
                        }
                    }
                }
            }).addChildTo(this.bg);

            var guage = tm.ui.Gauge({
                width: ns.Setting.screenWidth,
                height: 10,
                color: "hsl(200, 100%, 80%)",
                bgColor: "transparent",
                borderColor: "transparent",
                borderWidth: 0,
            }).fromJSON({
                x: 0,
                y: 0,
                animationFlag: false,
                animationTime: 100,
                value: 0
            }).addChildTo(this.bg);

            var logo = tm.display.Sprite("logo_maker").fromJSON({
                x: this.bg.width / 2,
                y: this.bg.height / 2,
            }).addChildTo(this.bg);
            ns.Sound.Bgm.play("loading");
            this.alpha = 0.0;
            this.bg.tweener.clear().fadeIn(100).call(function() {
                var loader = tm.asset.Loader();

                loader.onload = function() {
                    this.bg.tweener.clear().wait(200).fadeOut(500).call(function() {
                        var nextScene;
                        if (param.stage) {
                            var shizimily = ns.Character.Shizimily();
                            var vga = ns.Item.GF980Ti();
                            var vga2 = ns.Item.RadeonFury();
                            var cpu = ns.Item.Corei5();
                            var dvd = ns.Item.Sleep();
                            var real = ns.Item.Real();
                            vga.level = 10;
                            shizimily.inventory = [
                                vga, cpu, dvd, real, vga2,
                                ns.Item.Corei5(),
                                ns.Item.Corei5(),
                                ns.Item.Corei5(),
                            ];
                            nextScene = ns.Scene.Main(shizimily, param.stage);
                        } else {
                            nextScene = ns.Scene.Opening();
                        }
                        this.app.replaceScene(nextScene);
                        var e = tm.event.Event("load");
                        this.fire(e);
                    }.bind(this));
                }.bind(this);

                loader.onprogress = function(e) {
                    guage.value = e.progress * 100;
                    var event = tm.event.Event("progress");
                    event.progress = e.progress;
                    this.fire(event);
                }.bind(this);

                loader.load(param.assets);
            }.bind(this));
        },
    });
}(game));

// メインルーチン
(function (ns) {
    ns.Speed = ns.Setting.object.speed;
    ns.Frame = 0;

    // 音をアセットに追加
    var addAudioAsset = function () {
        for (var key in ns.Sound.Data) {
            if (key.substring(0, 3) !== "bgm") {
                var data = ns.Sound.Data[key];
                if (data instanceof Array) {
                    for (var i = 0; i < data.length; i ++) {
                        ns.Setting.assets["sound_" + data[i]] = "sound/" + data[i];
                    }
                } else if (typeof data === "string") {
                    ns.Setting.assets["sound_" + data] = "sound/" + data;
                }
            }
        }
    };

    var clearAudioAsset = function () {
        for (var key in ns.Setting.assets) {
            if (key.substring(0, 6) === "sound_") {
                delete ns.Setting.assets[key];
            }
        }
    };

    tm.main(function () {
        var query = tm.util.QueryString.parse(window.location.search.slice(1));

        ns.Debug = query.debug ? true : false;
        ns.DebugTrap = query.debugTrap ? true: false;
        var stage = query.debugStage ? ns.DebugStage : undefined;
        var app = tm.app.CanvasApp("#world");

        app.resize(ns.Setting.screenWidth, ns.Setting.screenHeight);
        app.canvas.imageSmoothingEnabled = false;
        app.background = "rgb(0, 0, 0)";
        
        if (query.mobile) {
            ns.Controller = {
                pad: tm.ui.Pad(),
            };
            ["z", "x", "c", "v"].forEach(function (c) {
                ns.Controller[c] = tm.ui.FlatButton({
                    width: 100, 
                    height: 100, 
                    text: c,
                    fillStyle: "black"
                });
                ns.Controller[c].addEventListener("pointingmove", function (e) {
                    ns.Controller[c + "Key"] = true;
                }).addEventListener("pointingend", function (e) {
                    ns.Controller[c + "Key"] = false;
                });
            });
        }
            
        var loader = tm.asset.Loader();
        loader.onload = function (e) {
            ns.App = app;
            var loadingScene = ns.Scene.Loading({
                assets: ns.Setting.assets,
                stage: stage
            });
            app.fps = ns.Setting.fps;
            app.replaceScene(loadingScene);
            app.run();
        };

        // サウンドのあるなし判定
        if (query.nosound) {
            delete ns.Setting.loading_assets.bgm_loading;
            ns.Sound.Data = {};
            loader.load(ns.Setting.loading_assets);
            window.console.log("No bgm mode start.");
        } else {
            addAudioAsset();
            loader.load(ns.Setting.loading_assets);
            window.console.log("Bgm mode start.");
        }
        
        // force to no BGM mode
        window.setTimeout(function () {
            if (!ns.App) {
                clearAudioAsset();
                delete ns.Setting.loading_assets.bgm_loading;
                ns.Sound.Data = {};
                loader.load(ns.Setting.loading_assets);
                window.console.log("Force to start no bgm mode start.");
            }
        }.bind(this), 1000);
    });
}(game));