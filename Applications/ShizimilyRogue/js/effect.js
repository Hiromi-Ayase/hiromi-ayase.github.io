/*global ROT, tm*/
var game = game || {};

(function (ns) {
    ns.Effect = {};
    ns.EffectLayer = function () {
        var layer = tm.define("game.EffectLayer", {
            superClass: "tm.display.Shape",
            init: function () {
                this.superInit();
            },
            isEnd: function () {
                var flg = true;
                this.children.forEach(function (child) {
                    if (child.gameEffect && !child.isEnd) {
                        flg = false;
                    }
                });
                return flg;
            },
        });
        return layer();
    }();

    // エフェクト一般
    tm.define("game.effect.Effect", {
        superClass: "tm.display.Shape",
        init: function (name, coord, lock) {
            this.superInit();
            this.name = name;
            this.lock = lock;
            this.gameEffect = true;
            this.tween = tm.anim.Tween();
            if (coord) {
                ns.SetPos(this, coord);
            }
            this.addChildTo(ns.EffectLayer);
            this.animationStack = [];
            this.animatingEnd = 0;            
        },
        setCoord: function (coord) {
            ns.SetPos(this, coord);
        },
        pushTweenTo: function (object, props, duration) {
            this.animationStack.push({
                type: "tweenTo",
                props: props,
                object: object,
                duration: duration
            });
        },
        pushTweenBy: function (object, props, duration) {
            this.animationStack.push({
                type: "tweenBy",
                props: props,
                object: object,
                duration: duration
            });
        },
        push: function (func, duration) {
            func = func || function () {};
            this.animationStack.push({
                type: "other",
                update: func,
                duration: duration
            });
        },
        update: function () {
            if (!this.tween.isPlaying && ns.Frame >= this.animatingEnd && !this.lock) {
                this.animationFunc = function () {};
                if (this.isEnd) {
                    if (this.onEnd) {
                        this.onEnd();
                        this.onEnd = undefined;
                    }
                    this.remove();
                } else if (this.animationStack.length === 0) {
                    this.isEnd = true;
                    this.animatingEnd = ns.Frame + ns.Setting.coolTime;
                } else {
                    var next = this.animationStack.shift();
                    if (next.type === "tweenTo") {
                        this.tween.to(next.object, next.props, next.duration);
                        this.tween.start();
                    } else if (next.type === "tweenBy") {
                        this.tween.by(next.object, next.props, next.duration);
                        this.tween.start();
                    } else {
                        this.animatingEnd = ns.Frame + next.duration;
                        this.animationFunc = next.update;
                    }
                }
            }
            this.animationFunc();
        }
    });

    // 寝る
    ns.Effect.Sleep = tm.define("game.effect.Sleep", {
        superClass: "tm.display.Sprite",
        init: function () {
            var size = ns.Setting.character.size;
            this.superInit("zzz", size, size);
            this.fromJSON({
                name: "Sleep",
                visible: false,
                width: size,
                height: size,
            });
        },
        update: function (app) {
            var count = Math.floor((app.frame % (ns.Setting.fps * 3)) / ns.Setting.fps);
            this.frameIndex = count;
        },
    });


    // 治癒魔法
    ns.Effect.HealSpell = tm.define("game.effect.HealSpell", {
        superClass: "game.effect.Effect",
        init: function (coord) {
            this.superInit("HealSpell", coord);
            this.magical = ns.Effect.Magical(0, -15, 0.2, 0.08).addChildTo(this);
            this.alpha = 0;
            
            this.pushTweenTo(this, {alpha: 1}, 100);
            this.pushTweenBy(this, {y: 24}, 500);
            this.pushTweenTo(this, {alpha: 0}, 100);
        },
        renderLines: function () {
        }
    });

    // 遠距離攻撃魔法
    ns.Effect.AttackSpell = tm.define("game.effect.AttackSpell", {
        superClass: "game.effect.Effect",
        init: function (from, to, dir) {
            this.superInit("AttackSpell", from);
            //this.magical = ns.Effect.Magical(0, 0, 0.2, 0.08).addChildTo(this);
            var size = ns.Setting.character.size;
            var ss = tm.asset.SpriteSheet({
                image: "ball",
                frame: {
                    width: size,
                    height: size
                },
                animations: {
                    "ball": {
                        frames: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, ],
                        next: "ball",
                    }
                }
            });
            this.blendMode = "lighter";
            this.ball = tm.display.AnimationSprite(ss, size, size).addChildTo(this);
            this.ball.gotoAndPlay("ball");

            
            this.rotation = -(dir.value + 2) * 45;
            var duration = from.dist(to) * 100 + 1;
            var diff = dir.coord();
            var pos;
            if (to.equals(from)) {
                pos = ns.Coord2Pos(to);
            } else {
                pos = ns.Coord2Pos({
                    x: to.x - diff.x / 2,
                    y: to.y - diff.y / 2,
                });
            }
            
            this.pushTweenTo(this, pos, duration);
        },
        renderLines: function () {
        }
    });

    // 攻撃モーション
    ns.Effect.AttackMotion = tm.define("game.effect.AttackMotion", {
        superClass: "game.effect.Effect",
        init: function (obj) {
            this.superInit("AttackMotion");

            var dir = obj.dir.coord();
            var x = dir.x * 10;
            var y = dir.y * 10;
            
            this.pushTweenBy(obj, {x: x, y: y}, 100);
            this.pushTweenBy(obj, {x: -x, y: -y}, 100);
        },
    });

    // スキルモーション
    ns.Effect.SkillMotion = tm.define("game.effect.SkillMotion", {
        superClass: "game.effect.Effect",
        init: function (obj) {
            this.superInit("SkillMotion");
            
            this.pushTweenBy(obj, {y: -10}, 100);
            this.pushTweenBy(obj, {y: 10}, 100);
        },
    });

    // ダメージモーション
    ns.Effect.DamageMotion = tm.define("game.effect.DamageMotion", {
        superClass: "game.effect.Effect",
        init: function (obj) {
            this.superInit("DamageMotion");
            var x = 10;
            this.pushTweenBy(obj, {x: x}, 10);
            this.pushTweenBy(obj, {x: -x}, 10);
            this.pushTweenBy(obj, {x: x}, 10);
            this.pushTweenBy(obj, {x: -x}, 10);
            this.pushTweenBy(obj, {x: x}, 10);
            this.pushTweenBy(obj, {x: -x}, 10);
        },
    });

    // 飛ぶ
    ns.Effect.Fly = tm.define("game.effect.Fly", {
        superClass: "game.effect.Effect",
        init: function (object, from, to1, to2) {
            this.superInit("Fly", from);
            this.addChild(object);
            object.setPosition(0, 0);
            var duration = from.dist(to1) * 70 + 1;
            var pos = ns.Coord2Pos(to1);
            pos.y -= 5;
            this.pushTweenTo(this, pos, duration);
            if (to2) {
                this.push(null, 10);
                this.pushTweenTo(this, ns.Coord2Pos(to2), 200);
            }
        },
    });

    // 落とす
    ns.Effect.Put = tm.define("game.effect.Put", {
        superClass: "game.effect.Effect",
        init: function (object, from, to, callback) {
            this.superInit("Put", from);
            this.addChild(object);
            object.setPosition(0, 0);
            this.onEnd = callback;
            this.pushTweenTo(this, ns.Coord2Pos(to), 200);
        },
    });

    // 矢印
    ns.Effect.Arrow = tm.define("game.effect.Arrow", {
        superClass: "tm.display.Shape",
        init: function () {
            this.superInit();
            this.fromJSON({
                name: "Arrow",
                visible: false,
                width: ns.Setting.character.size,
                height: ns.Setting.character.size,
            });
            var canvas = this.canvas;
            canvas.setTransformCenter();
            canvas.fillStyle = "rgba(0, 0, 255, 0.5)";
            canvas.strokeStyle = "rgb(0, 0, 0)";
            for (var i = 45; i < 360; i += 90) {
                canvas.save();
                canvas.rotate(Math.degToRad(i));
                canvas.beginPath();
                canvas.moveTo(0, -30);
                canvas.lineTo(-13, -25);
                canvas.lineTo(0, -50);
                canvas.lineTo(13, -25);
                canvas.closePath();
                canvas.fill();
                canvas.restore();
            }
        },        
    });
    
    // 点滅
    ns.Effect.Blink = tm.define("game.effect.Blink", {
        superClass: "tm.display.Shape",
        init: function (character, callback, interval, max) {
            this.superInit();
            this.character = character;
            this.interval = interval || 5;
            this.blink = 0;
            this.maxBlink = 5 || max;
            this.callback = callback;
            this.addChildTo(ns.EffectLayer);
            this.gameEffect = true;
        },
        update: function () {
            if (ns.Frame % this.interval === 0) {
                this.character.visible = !this.character.visible;
                this.blink ++;
                if (this.blink >= this.maxBlink) {
                    this.callback();
                    this.remove();
                }
            }
        }
    });

    // 魔法陣
    ns.Effect.Magical = tm.define("game.effect.Magical", {
        superClass: "tm.display.Shape",
        init: function (x, y, scaleX, scaleY) {
            scaleX = scaleX || 1;
            scaleY = scaleY || 1;
            this.superInit();
            this.setSize(250, 250);
            this.radius = 80;
            this.blendMode = "lighter";
            this.setScale(scaleX, scaleY);
            this.setPosition(x, y);

            this.layer1 = tm.display.Shape().addChildTo(this);
            this.layer2 = tm.display.Shape().addChildTo(this);
            this.layer1.setSize(this.width, this.height);
            this.layer2.setSize(this.width, this.height);
            this.layer1.setPosition(0, 0);
            this.renderCanvas();
        },
        renderCanvas: function () {
            var canvas = this.canvas;
            var subCanvas1 = this.layer1.canvas;
            var subCanvas2 = this.layer2.canvas;

            canvas.save();
            canvas.setTransformCenter();
            subCanvas1.setTransformCenter();
            subCanvas2.setTransformCenter();
            canvas.fillStyle = "rgb(128, 255, 255)";
            canvas.strokeStyle = "rgb(128, 255, 255)";
            canvas.shadowBlur = 50;
            canvas.shadowColor = "white";

            subCanvas1.fillStyle = "rgb(128, 255, 255)";
            subCanvas2.fillStyle = "rgb(128, 255, 255)";
            subCanvas1.strokeStyle = "rgb(128, 255, 255)";
            subCanvas2.strokeStyle = "rgb(128, 255, 255)";

            // 四角1
            subCanvas1.save();
            subCanvas1.lineWidth = 2;
            subCanvas1.strokePolygon(0, 0, this.radius, 4);
            subCanvas1.restore();

            // 四角2
            subCanvas2.save();
            subCanvas2.lineWidth = 2;
            subCanvas2.strokePolygon(0, 0, this.radius, 4);
            subCanvas2.restore();

            // 円
            canvas.strokeCircle(0, 0, this.radius);
            canvas.strokeCircle(0, 0, this.radius * 0.8);
            canvas.strokeCircle(0, 0, this.radius * 0.69);
            canvas.strokeCircle(0, 0, this.radius * 0.55);
            // 外側の円
            canvas.lineWidth = 4;
            canvas.strokeCircle(0, 0, this.radius * 1.20);

            // 外側テキスト
            var text, i, len;
            text = "shizimily-chan never goes home. bie. shizimily-chan never goes home. bie.";
            subCanvas1.context.font = "15px Century Gothic";
            for (i = 0, len = text.length; i < len; ++i) {
                subCanvas1.save();
                subCanvas1.rotate(Math.degToRad(i * 360 / text.length));
                subCanvas1.translate(0, -this.radius * 1.05);
                subCanvas1.fillText(text[i], 0, 0);
                subCanvas1.restore();
            }

            // 内側テキスト
            text = "shizimily-chan never goes home. bie ";
            subCanvas2.context.font = "12px Century Gothic";
            for (i = 0, len = text.length; i < len; ++i) {
                subCanvas2.save();
                subCanvas2.rotate(Math.degToRad(i * 360 / text.length));
                subCanvas2.translate(0, -this.radius * 0.59);
                subCanvas2.fillText(text[i], 0, 0);
                subCanvas2.restore();
            }
            canvas.restore();
        },
        update: function () {
            this.layer1.rotation = ns.Frame % 360;
            this.layer2.rotation = -ns.Frame % 360;
        },
    });
    
    ns.Effect.BackLabel = tm.define("game.effect.BackLabel", {
        superClass: "tm.display.Label",
        init: function (text) {
            this.superInit(text);
            this.fromJSON({
                x: ns.Setting.screenWidth - 10,
                y: 10,
                align: "right",
                baseline: "top",
                fontSize: 32,
                update: function(app) {
                    this.alpha = (Math.sin(Math.degToRad(app.frame * 5)) + 1) / 2;
                }
            });
        }
    });


}(game));