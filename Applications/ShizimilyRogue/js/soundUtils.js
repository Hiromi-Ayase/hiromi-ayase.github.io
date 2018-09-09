/*global ROT, tm*/
var game = game || {};

// サウンド処理関数
(function (ns) {
    ns.Sound = ns.Sound || {};

    // サウンド
    tm.define("game.sound.Object", {
        playAsset: function (asset) {
            asset = ns.Sound.Data[asset];
            if (asset) {
                ns.Sound.Random.stop();
                if (typeof asset === "string") {
                    asset = [asset];
                }
                asset = "sound_" + asset.random();
                var sound = tm.asset.Manager.get(asset);
                if (sound) {
                    sound = sound.clone();
                    sound.volume = ns.Config.volume.effect / ns.Setting.sound.volume.base;
                    sound.play();
                } else {
                }
                this.sound = sound;
            }
        },
        setVolume: function (volume) {
            ns.Config.volume.effect = volume;
        },
    });

    // インターフェースサウンド
    ns.Sound.Interface = tm.define("game.sound.Interface", {
        superClass: "game.sound.Object",
        init: function () {
            this.superInit();
        },
        play: function (name) {
            var asset = "interface_" + name;
            this.playAsset(asset);
        },
    });

    // トラップサウンド
    ns.Sound.Trap = tm.define("game.sound.Trap", {
        superClass: "game.sound.Object",
        init: function () {
            this.superInit();
        },
        play: function (name) {
            var asset = "trap_" + name;
            this.playAsset(asset);
        },
    });

    // キャラクターサウンド
    ns.Sound.Character = tm.define("game.sound.Character", {
        superClass: "game.sound.Object",
        init: function (name) {
            this.superInit();
            this.name = name;
        },

        play: function (type, freq) {
            freq = freq || ns.Sound.voiceFrequency[type];
            freq = freq || 1;
            var r = Math.random();

            var voiceAsset = r > freq ? undefined : this.name + "_" + type;
            var asset = type;
            this.playAsset(asset);
            this.playAsset(voiceAsset);
        },
    });
    
    // ランダムサウンド
    ns.Sound.Random = tm.define("game.sound.Random", {
        superClass: "game.sound.Object",
        init: function () {
            this.superInit();
        },

        play: function () {
            this.playAsset("random");
        },
        stop: function () {
            if (this.sound) {
                this.sound.stop();
            }
        },
    })();

    // BGM
    ns.Sound.Bgm = tm.define("game.sound.Bgm", {
        init: function () {
        },
        play: function (bgm) {
            if (bgm === undefined) {
                // ポーズフラグ
                if (this.paused && this.sound) {
                    this.sound.play();
                    this.paused = false;
                    return;
                }
                if (ns.Sound.Data.bgm) {
                    bgm = ns.Sound.Data.bgm.random();
                }
            } else if (typeof bgm === "number") {
                bgm = ns.Sound.Data.bgm[bgm];
            } else {
                bgm = ns.Sound.Data["bgm_" + bgm];
            }
            if (bgm) {
                if (this.sound) {
                    this.stop();
                }
                this.bgm = bgm;
                this.sound = tm.sound.Sound("sound/" + bgm);
                this.sound.volume = ns.Config.volume.bgm / ns.Setting.sound.volume.base;
                this.sound.loop = true;
                this.sound.play();
            }
        },
        pause: function () {
            if (this.sound) {
                this.sound.pause();
                this.paused = true;
            }
        },
        stop: function (duration) {
            if (duration === undefined) {
                duration = 200;
            }
            if (this.sound !== undefined && !this.stopping) {
                this.stopping = true;
                var tween = tm.anim.Tween();
                tween.to(this.sound, {volume: 0}, duration);
                tween.start();
                var sound = this.sound;
                tween.on("finish", function () {
                    sound.stop();
                    this.stopping = false;
                }.bind(this));
            }
        },
        setVolume: function (volume) {
            ns.Config.volume.bgm = volume;
            if (this.sound) {
                this.sound.volume = volume / ns.Setting.sound.volume.base;
            }
        },
    })();
})(game);