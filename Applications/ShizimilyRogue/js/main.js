/*global tm, ROT*/

var game = game || {};


//ダンジョン内の階段定義
(function (ns) {
    ns.Stairs = tm.define("game.Stairs", {
        superClass: "tm.display.Sprite",
        init: function (coord) {
            var data = ns.Setting.stairs;
            var size = data.size;
            this.superInit(data.asset);
            this.fromJSON({
                name: "stairs",
                gameObject: true,
                objectType: ns.Setting.object.type.stairs,
                displayName: data.name,
                width: size,
                height: size,
            });
            this.setFrameIndex(data.frameIndex, size, size);
            ns.SetPos(this, coord);
        }
    });
}(game));

//ダンジョン内のトラップ定義
(function (ns) {
    tm.define("game.trap.Trap", {
        superClass: "tm.display.Sprite",
        init: function (name, coord) {
            var data = ns.Setting.trap.data[name];
            var size = ns.Setting.trap.size;
            this.superInit(data.asset);
            this.fromJSON({
                name: name,
                gameObject: true,
                visible: ns.DebugTrap ? true : false,
                objectType: ns.Setting.object.type.trap,
                displayName: data.name,
                width: size,
                height: size,
                data: data,
                sound: ns.Sound.Trap()
            });
            this.setFrameIndex(data.frameIndex, size, size);
            ns.SetPos(this, coord);
            ns.UI.Debug(this);
        }
    });

    // Create traps
    ns.Trap = function () {
        var data = ns.Setting.trap.data;
        var creator = function (ret, callback) {
            ns.Util.classGenerator(ret, "trap", data, {
                invoke: callback
            });
        };

        var ret = {};
        creator(ret, function (user) {
            this.visible = true;
            
            // 発動確率
            if (!ns.Util.randomBool(this.data.frequency)) {
                ns.Log("trapOff", { character: user, target: this });
                return;
            }

            ns.Log("trap", { character: user, target: this });
            var view = user.getView();
            this.sound.play(this.name);
            if (this.name === "hole") {
                user.play("trap");
                user.actionStack.unshift(function () {
                    ns.CurrentScene.clear();
                });
            } else if (this.name === "blackhole") {
                user.play("trap");
                var coord = view.getOtherRoomCell();
                user.actionStack.unshift(function () {
                    user.fly(coord);
                });
            } else if (this.name === "summon") {
                var cList = [];
                ns.Dirs.forEach(function(dir) {
                    var c = user.coord.proceed(dir);
                    if (view.isEmpty(c)) {
                        cList.push(c);
                    }
                });
                var name = ns.Setting.stage[ns.CurrentScene.floor.type].enemyType.random();
                cList.forEach(function(c) {
                    view.addObject(ns.Character.Enemy[name], c);
                });
            } else if (this.name === "pin") {
                user.play("damage");
                user.damage(20);
            } else if (this.name === "sleep") {
                user.stateChanged(this, ns.STATE.SLEEP);
            } else if (this.name === "hungry") {
                user.play("damage");
                user.damage(0, 0, 30);
            }

            // 確率で壊れる
            if (!this.found && ns.Util.randomBool(this.data.break)) {
                ns.Log("trapBreak", { character: user, target: this });
                this.remove();
            }
            // 発見済みフラグを立てる
            this.found = true;
        });
        return ret;
    }();

}(game));

//ダンジョン内のアイテム定義
(function (ns) {
    ns.Item = {};
    // アイテム抽象クラス
    var itemClass = tm.define("game.item.Item", {
        superClass: "tm.display.Sprite",
        init: function (name, coord, type) {
            var itemData = ns.Setting.item.data[type][name];
            var size = ns.Setting.item.size;

            this.superInit(itemData.asset);
            this.fromJSON({
                displayName: itemData.name,
                name: name,
                objectType: ns.Setting.object.type.item,
                itemType: type,
                width: size,
                height: size,
                data: itemData,
                equipped: {},
                level: 0,
                gameObject: true,
            });
            this.setFrameIndex(itemData.frameIndex, size, size);
            ns.SetPos(this, coord);
            ns.UI.Debug(this);
            this.setLevel(0);
        },
        setLevel: function (level) {
            this.level = level;
            if (this.data.baseName) {
                this.displayName = this.data.baseName;
                if (level < 0) {
                    this.displayName += "-" + Math.abs(level);
                } else if (level > 0) {
                    this.displayName += "+" + level;
                }
            }
        },
    });

    // Create items
    ns.Item = function () {
        var data = ns.Setting.item.data;
        var creator = function (ret, type, callback) {
            ns.Util.classGenerator(ret, "item", data, {
                used: callback
            }, type);
        };

        var ret = {};
        creator(ret, "DVD", function (user) {
            user.removeItem(this);
            ns.Log("playDVD", {
                character: user.displayName,
                dvd: this.displayName,
            });
            user.play("playDVD");
            var view, list, first, target;
            if (this.name === "Real") {
                view = user.getView();
                list = view.getCharacters();
                if (list.length > 0) {
                    list.forEach(function (target) {
                        user.actionStack.push(function () {
                            target.attacked(user, true);
                        });
                    });
                } else {
                    ns.Log("noAction");
                }
            } else if (this.name === "Sleep") {
                view = user.getView();
                list = view.getCharacters();
                if (list.length > 0) {
                    list.forEach(function (target) {
                        user.actionStack.push(function () {
                            target.stateChanged(user, ns.STATE.SLEEP);
                        });
                    });
                } else {
                    ns.Log("noAction");
                }
            } else if (this.name === "Rock") {
                view = user.getView();
                target = view.getFreeCell();
                if (target) {
                    user.fly(target);
                } else {
                    ns.Log("noAction");
                }
            }
        });

        creator(ret, "Sweet", function (user) {
            user.removeItem(this);
            var data = {
                character: user,
                target: this,
                utsu: this.data.utsu,
                hp: this.data.hp,
            };
            if (data.utsu && data.hp) {
                user.healUtsu(data.utsu);
                user.heal(data.hp);
                ns.Log("healBoth", data);
            } else if (data.hp) {
                user.heal(data.hp);
                ns.Log("heal", data);
            } else if (data.utsu) {
                user.healUtsu(data.utsu);
                ns.Log("healUtsu", data);
            } else {
                ns.Log("eat", data);
            }
        });

        creator(ret, "CPU", function (user) {
            user.equip(this);
        });

        creator(ret, "Graphic", function (user) {
            user.equip(this);
        });

        creator(ret, "Storage", function (user) {
        });
        return ret;
    }();

    // 頻度総和を取得
    ns.ItemFrequency = function () {
        var totalFrequency = 0;
        var list = {};
        for (var type in ns.Setting.item.data) {
            for (var name in ns.Setting.item.data[type]) {
                var data = ns.Setting.item.data[type][name];
                var freq = data.frequency;
                totalFrequency += freq;
                list[name] = freq;
            }
        }
        return {
            total: totalFrequency,
            list: list
        };
    }();
}(game));


//ダンジョン内のキャラクタ定義
(function (ns) {
    ns.Character = {};

    // キャラクターオブジェクト 外部非公開
    tm.define("game.character.Character", {
        superClass: "tm.display.AnimationSprite",
        init: function (name, coord, characterData) {
            var animation = {};
            var animData = characterData.animation;
            var freqData = characterData.frequency;
            if (animData.hasOwnProperty("walk")) {
                for (var i = 0; i < 8; i ++) {
                    animData["walk_" + ns.Dir2Name[i]] = animData.walk;
                }
            }
            for (var animName in animData) {
                animation[animName] = {};
                var freqName = animName;
                if (freqName.indexOf("_") >= 0) {
                    freqName = freqName.substring(0, freqName.indexOf("_"));
                }
                animation[animName].frames = ns.Util.createFrames(animData[animName], freqData[freqName]);
                if (animName.substring(0, 5) === "walk_") {
                    animation[animName].next = animName;
                }
                if (animName === "sleep") {
                    animation[animName].next = animName;
                }
            }
            var ss = tm.asset.SpriteSheet({
                image: characterData.asset,
                frame: {
                    width: ns.Setting.character.size,
                    height: ns.Setting.character.size
                },
                animations: animation
            });

            this.superInit(ss, ns.Setting.character.size, ns.Setting.character.size);
            this.fromJSON({
                name: name,
                displayName: characterData.name,
                objectType: ns.Setting.object.type.character,
                inventory: [],
                tween: tm.anim.Tween(),
                dir: ns.Dirs[6],
                gameObject: true,
                animatingEnd: 0,
                status: {},
                turn: 0,
                attackCount: 0,
                actionStack: [],
                effect: {
                    sleep: ns.Effect.Sleep().addChildTo(this)
                },
                sound: ns.Sound.Character(name),
            });
            ns.SetPos(this, coord);

            ns.UI.Debug(this);

            // ステータスのコピー
            for (var statusName in characterData.status) {
                this.status[statusName] = characterData.status[statusName];
            }
            if (this.status.invisible) {
                this.visible = false;
            }
        },
        /**
         * Is operatable.
         * @returns {Boolean} True: operation OK
         */
        isOperatable: function () {
            return this.actionStack.length === 0 && this.isAnimationEnd();
        },
        /**
         * Animation End.
         * @returns {[[Type]]} [[Description]]
         */
        isAnimationEnd: function () {
            return ns.EffectLayer.isEnd() && !this.tween.isPlaying && ns.Frame >= this.animatingEnd;
        },
        /**
         * Play the animation.
         * @param {String} name Animation name
         */
        play: function (name) {
            if (this.name === "shizimily") {
                ns.setFace(ns.Setting.face.type[name]);
            }
            this.sound.play(name);
            var nameWidthDir = name + "_" + this.dir.name();
            if (this.ss.animations.hasOwnProperty(nameWidthDir)) {
                name = nameWidthDir;
            }
            var anim = this.ss.animations[name];
            if (anim) {
                this.gotoAndPlay(name);
                this.animatingEnd = ns.Frame + anim.frames.length;
            } else {
                if (name === "skill") {
                    ns.Effect.SkillMotion(this);
                } else if (name === "attack") {
                    ns.Effect.AttackMotion(this);
                } else if (name === "damage") {
                    ns.Effect.DamageMotion(this);
                }
                return false;
            }
        },
        /**
         * オブジェクトの移動
         */
        move: function () {
            var view = this.getView();
            if (view.isMovable(this.dir)) {
                this.coord = this.coord.proceed(this.dir);
                this.tween.to(this, ns.Coord2Pos(this.coord, this.objectType), ns.Speed);
                this.tween.start();
                if (view.getFloorObject(this.coord)) {
                    this.actionStack.unshift(this.step);
                }
            }
        },
        /**
         * 指定位置まで飛ぶ
         * @param {Object} coord 座標
         */
        fly: function (coord) {
            this.coord = coord;
            this.tween.to(this, ns.Coord2Pos(this.coord, this.objectType), ns.Speed);
            this.tween.start();
        },
        /**
         * オブジェクトの攻撃
         */
        attack: function () {
            this.play("attack");

            this.attackCount ++;
            var view = this.getView();
            if (view.isAttackable(this.coord.proceed(this.dir))) {
                var target = view.getForwardCharacter(this.dir);
                if (target && !target.dead) {
                    this.actionStack.unshift(target.attacked.bind(target, this));
                }
                if (this.status.multiAttack && this.status.multiAttack > this.attackCount) {
                    this.actionStack.push(this.attack);
                } else {
                    this.attackCount = 0;
                }
            }
        },
        /**
         * スキル発動
         */
        skill: function (target) {
            this.play("skill");
            var skill = this.status.skill;
            var view = this.getView();
            target = target || view.getForwardCharacter(this.dir);
            if (!skill || !target) {
                return;
            }
            if (skill.type === "seal") {
                ns.Log("sealSkill", {character: this});
                this.actionStack.unshift(target.stateChanged.bind(target, this, ns.STATE.SEAL));
            } else if (skill.type === "replace") {
                ns.Log("replaceSkill", {character: this});
                var coord = this.coord;
                this.actionStack.unshift(function () {
                    this.fly(target.coord);
                    target.fly(coord);
                }.bind(this));
            } else if (skill.type === "warp") {
                ns.Log("warpSkill", {character: this});
                this.actionStack.unshift(target.fly.bind(target, view.getFreeCell()));
            }
        },
        /**
         * 踏んだ
         */
        step: function () {
            return { notCool: true };
        },
        /**
         * 盾を取得
         * @returns {Object} アイテムオブジェクト
         */
        getGuard: function () {
            for (var i = 0; i < this.inventory.length; i ++) {
                var item = this.inventory[i];
                if (item.equipped.def) {
                    return item;
                }
            }
        },
        /**
         * 武器を取得
         * @returns {Object} アイテムオブジェクト
         */
        getWeapon: function () {
            for (var i = 0; i < this.inventory.length; i ++) {
                var item = this.inventory[i];
                if (item.equipped.atk) {
                    return item;
                }
            }
        },
        /**
         * 攻撃力の取得
         * @returns {Number} 攻撃力
         */
        getAtk: function () {
            var equip = this.getWeapon();
            var val = equip ? equip.data.atk * (equip.level + 10) / 10 : 0;
            return this.status.atk + Math.floor(val);
        },
        /**
         * 防御力の取得
         * @returns {Number} 防御力
         */
        getDef: function () {
            var equip = this.getGuard();
            var val = equip ? equip.data.def * (equip.level + 10) / 10 : 0;
            return this.status.def + Math.floor(val);
        },
        /**
         * 攻撃を受けた
         * @param {Object} attacker Attacker
         */
        attacked: function (attacker, isMagic) {
            if (isMagic && this.status.noMagic) {
                ns.Log("noMagic", {character: attacker, target: this});
                return;
            }
            if (attacker.visible) {
                this.dir = this.coord.dir(attacker.coord);
            }
            if (ns.Util.randomBool(ns.Setting.attackFail)) {
                ns.Log("attackFailed", {
                    character: attacker,
                });
                this.play("attackFailed");
                return;
            }
            var atk;
            if (isMagic && attacker.status.matk) {
                atk = attacker.status.matk;
            } else {
                atk = attacker.getAtk();
            }
            var amount = ns.Damage(atk, this.getDef(), this.status.hp);
            var amountUtsu = attacker.status.utsuAtk || 0;
            var amountHungry = attacker.status.hungryAtk || 0;
            if (amountHungry > 0) {
                ns.Log("damageWithHungry", {
                    character: attacker,
                    target: this,
                    amount: amount,
                    amountHungry: amountHungry
                });
            } else if (amountUtsu > 0) {
                ns.Log("damageWithUtsu", {
                    character: attacker,
                    target: this,
                    amount: amount,
                    amountUtsu: amountUtsu
                });
            } else {
                ns.Log("damage", {
                    character: attacker,
                    target: this,
                    amount: amount
                });
            }
            this.visible = true;
            this.damage(amount, amountUtsu, amountHungry);
        },
        /**
         * 状態変更を受けた
         * @param {Object} attacker 攻撃者
         * @param {String} type     状態
         */
        stateChanged: function (attacker, type) {
            this.status[type] = this.turn + ns.Setting.stateChange[type];
            if (type === ns.STATE.SLEEP) {
                ns.Log("sleep", {character: this});
                this.effect.sleep.visible = true;
            } else if (type === ns.STATE.SEAL) {
                ns.Log("seal", {character: this});
            }
        },
        /**
         * ダメージ
         * @param {Number} amount ダメージ量
         */
        damage: function (amount, utsuAmount, amountHungry) {
            this.play("damage");

            this.status.hp -= amount;
            if (this.status.hp < 0) {
                this.status.hp = 0;
            }
            if (this.status.utsu && utsuAmount) {
                this.status.utsu -= utsuAmount;
                if (this.status.utsu < 0) {
                    this.status.utsu = 0;
                }
            }
            if (this.status.hungry && amountHungry) {
                this.status.hungry -= amountHungry;
                if (this.status.hungry < 0) {
                    this.status.hungry = 0;
                }
            }
            this.actionStack.unshift(function () {
                if (this.status.hp <= 0) {
                    this.die();
                }
            });
        },
        /**
         * ヒール
         * @param {Number} amount ヒール量
         */
        heal: function (amount) {
            this.status.hp += amount;
            if (this.status.hp > this.status.maxHp) {
                this.status.hp = this.status.maxHp;
            }
        },
        /**
         * 鬱へのダメージ
         * @param {Number} amount ダメージ量
         */
        damageUtsu: function (amount) {
            this.status.utsu -= amount;
            if (this.status.utsu < 0) {
                this.status.utsu = 0;
            }
        },
        /**
         * 鬱へのヒール
         * @param {Number} amount ヒール量
         */
        healUtsu: function (amount) {
            this.status.utsu += amount;
            if (this.status.utsu > this.status.maxUtsu) {
                this.status.utsu = this.status.maxUtsu;
            }
        },
        /**
         * やられた
         */
        die: function () {
            this.play("die");
            this.dead = true;
            if (this.status.boss) {
                this.play("die_boss");
                ns.Log("dieBoss", {
                    character: this
                });
            } else {
                ns.Log("die", {
                    character: this
                });
            }
            this.actionStack = [];
            var drop = this.status.drop;
            if (drop && ns.Util.randomBool(drop.frequency)) {
                var nameList = [];
                var name;
                if (drop.type) {
                    for (name in ns.Setting.item.data[drop.type]) {
                        nameList.push(name);
                    }
                } else {
                    for (name in ns.Item) {
                        nameList.push(name);
                    }
                }
                name = nameList.random();
                if (name) {
                    var view = this.getView();
                    var item = ns.Item[name]();
                    var put = view.getPut();
                    ns.Effect.Put(item, this.coord, put, function () {
                        view.addObject(item, put);
                    }.bind(this));
                }
            }
            ns.Effect.Blink(this, function () {
                this.remove();
            }.bind(this));
        },
        /**
         * アイテムを投げた
         * @param {Number} index インベントリのインデックス
         */
        throw: function (index) {
            this.play("throw");
            var view = this.getView();
            var item;
            if (index < 0) {
                item = view.getItem();
                this.removeItem(item);
            } else if (index < this.inventory.length) {
                item = this.inventory[index];
                this.removeItem(item);
            }
            if (item) {
                var throwData = view.getThrow(this.dir);
                if (throwData.hit) {
                    ns.Effect.Fly(item, this.coord, throwData.coord);
                    this.actionStack.unshift(function () {
                        if (item.itemType === "Sweet") {
                            throwData.hit.use(item);
                        } else {
                            ns.Log("hit", {character: throwData.hit, item: item});
                            throwData.hit.damage(1);
                        }
                    });
                } else if (throwData.put) {
                    ns.Effect.Fly(item, this.coord, throwData.coord, throwData.put);
                    this.actionStack.unshift(function () {
                        view.addObject(item, throwData.put);
                    });
                } else {
                    ns.Effect.Fly(item, this.coord, throwData.coord);
                    ns.Log("lost", {
                        item: item
                    });
                }
            }
        },
        /**
         * アイテムを置いた
         * @param {Number} index インベントリのインデックス
         */
        put: function (index) {
            if (index < this.inventory.length) {
                var item = this.inventory[index];
                this.removeItem(item);
                var view = this.getView();
                var put = view.getPut();
                if (put) {
                    ns.Effect.Put(item, this.coord, put);
                    this.actionStack.unshift(function () {
                        view.addObject(item, put);
                    });
                    ns.Log("put", {
                        item: item
                    });
                } else {
                    ns.Log("lost", {
                        item: item
                    });
                }
            }
        },
        /**
         * アイテムを使った
         * @param {Object} index 使ったアイテム番号(アイテムそのものでもよい)
         */
        use: function (index) {
            var view = this.getView();
            var item;
            if (index.gameObject) {
                item = index;
            } else if (index < 0) {
                item = view.getItem();
            } else if (index < this.inventory.length) {
                item = this.inventory[index];
            }
            if (item.itemType === "Sweet") {
                this.status.hungry = Math.min(this.status.hungry + item.data.full, this.status.maxHungry);
                if (item.data.type === "cake") {
                    this.play("eat_cake");
                } else if (item.data.type === "ice") {
                    this.play("eat_ice");
                } else if (item.data.type === "cookie") {
                    this.play("eat_cookie");
                }
            }
            item.used(this);
        },
        /**
         * Remove item
         * @param {Object} item Item object
         */
        removeItem: function (item) {
            item.remove();
            item.equipped = {};
            var index = this.inventory.indexOf(item);
            this.inventory.splice(index, 1);
        },
        /**
         * アイテムを装備した
         * @param {Object} item [[Description]]
         */
        equip: function (item) {
            this.play("equip");
            var type;
            if (item.data.atk) {
                // 攻撃力が定義されている
                type = "atk";
            } else if (item.data.def) {
                // 防御力が定義されている
                type = "def";
            }
            if (type) {
                if (item.equipped[type]) {
                    ns.Log("unequip", {
                        character: this,
                        target: item
                    });
                    item.equipped[type] = false;
                } else {
                    ns.Log("equip", {
                        character: this,
                        target: item
                    });
                    // 既存の装備を初期化
                    this.inventory.forEach(function (item) {
                        item.equipped[type] = undefined;
                    });
                    item.equipped[type] = true;
                }
            }
        },
        /**
         * 強化
         * @param {Object} item アイテム
         */
        reinforce: function (item) {
            var cpuIndex = -1;
            var graphicIndex = -1;
            this.inventory.forEach(function (item, index) {
                if (item.equipped.atk) {
                    cpuIndex = index;
                } else if (item.equipped.def) {
                    graphicIndex = index;
                }                            
            });
            var index;
            if (item.itemType === "CPU") {
                if (cpuIndex < 0) {
                    ns.Log("notEquipped", {type: "CPU"});
                    return;
                } else {
                    index = cpuIndex;
                }
            } else if (item.itemType === "Graphic") {
                if (graphicIndex < 0) {
                    ns.Log("notEquipped", {type: "ぐらぼ"});
                    return;
                } else {
                    index = graphicIndex;
                }
            }
            var obj = this.inventory[index];
            this.play("throw");
            if (obj.level >= ns.Setting.reinforce.probability.length) {
                ns.Log("reinforced", {item: item});
            } else if(ns.Util.randomBool(ns.Setting.reinforce.probability[obj.level])) {
                this.play("reinforce");
                var before = obj.displayName;
                obj.setLevel(obj.level + 1);
                var after = obj.displayName;
                ns.Log("reinforce", {before: before, after: after});
                this.removeItem(item);
                if (obj.level === ns.Setting.reinforce.probability.length) {
                    ns.Log("reinforceMax", {item: item});
                    ns.Sound.Interface().play("news");
                }
                this.play("yay");
            } else {
                ns.Log("reinforceFailed");
                this.play("shame");
                this.play("reinforceFailed");
                this.removeItem(item);
            }
        },
        /**
         * 自爆
         */
        selfBomb: function () {
            ns.Log("selfBomb", {character: this});
            var view = this.getView();
            var list = view.getCharacters();
            list.forEach(function (target) {
                this.actionStack.push(function () {
                    target.attacked(this, true);
                }.bind(this));
            }, this);
            this.actionStack.push(this.die.bind(this));
        },
        /**
         * 生きてるかどうか
         * @returns {Boolean} True:生きている
         */
        isAlive: function () {
            return this.status.hp !== 0;
        },
        /**
         * Action.
         * @param {Object} action Action
         */
        action: function (action) {
            if (this.isAlive()) {
                this.turn ++;

                // 睡眠解除
                if (this.status.sleep) {
                    if (this.status.sleep < this.turn) {
                        this.effect.sleep.visible = false;
                        this.status.sleep = undefined;
                    } else {
                        ns.Log("sleeping", {character: this });
                    }
                }

                // 封印解除
                if (this.status.seal && this.status.seal < this.turn) {
                    this.status.seal = undefined;
                }

                if (!this.status.sleep) {
                    this.dir = action.dir;
                    this.animatingEnd = ns.Frame + ns.Setting.coolTime;

                    if (action.type === ns.ACTION.MOVE) {
                        this.move();
                        this.animatingEnd = 0;
                    } else if (action.type === ns.ACTION.ATTACK) {
                        this.attack();
                    } else if (action.type === ns.ACTION.THROW) {
                        this.throw(action.target);
                    } else if (action.type === ns.ACTION.PUT) {
                        this.put(action.target);
                    } else if (action.type === ns.ACTION.PICK) {
                        this.pick();
                    } else if (action.type === ns.ACTION.SKILL) {
                        this.skill(action.target);
                    } else if (action.type === ns.ACTION.USE) {
                        this.use(action.target);
                    } else if (action.type === ns.ACTION.REINFORCE) {
                        this.reinforce(action.target);
                    } else if (action.type === ns.ACTION.SELFBOMB) {
                        this.selfBomb();
                    }
                } else if (this.name === "shizimily") {
                    this.animatingEnd = ns.Frame + ns.Setting.coolTime;
                }
                this.postAction();
            }
        },
        /**
         * アクション後に呼ばれる
         */
        postAction: function () {
        },
        update: function () {
            // Tween, Animation, Effectのいずれも終わった場合
            if (this.isAnimationEnd()) {
                if (this.actionStack.length > 0) {
                    var func = this.actionStack.shift().bind(this);
                    // Play終了コールバックがあった場合
                    var ret = func();
                    // 行動後クールタイムを入れる
                    if (!ret || !ret.notCool) {
                        this.animatingEnd = ns.Frame + ns.Setting.coolTime;
                    }
                }
            }
            // Animationのみが終わった場合
            if (!this.dead && ns.Frame >= this.animatingEnd) {
                var animName;
                if (this.status.sleep) {
                    animName = "sleep";
                    
                    if (this.currentAnimation !== this.ss.animations[animName]) {
                        this.gotoAndPlay(animName);
                    }
                } else {
                    // 現在の向きにアニメーションを変更
                    animName = "walk_" + this.dir.name();
                    if (this.currentAnimation !== this.ss.animations[animName]) {
                        this.gotoAndPlay(animName);
                    }
                }
            }
        }
    });

    // しじみりオブジェクト
    ns.Character.Shizimily = tm.define("game.character.Shizimily", {
        superClass: "game.character.Character",
        init: function (coord) {
            this.superInit("shizimily", coord, ns.Setting.character.shizimily);
            this.fromJSON({
                inventory: [],
                effect: {
                    arrow: ns.Effect.Arrow().addChildTo(this),
                    sleep: {},
                },
                nextHungry: this.status.hungryByStep,
            });
        },
        postAction: function () {
            if (this.status.hungry > 0) {
                if (this.nextHungry <= this.turn) {
                    this.status.hungry --;
                    this.nextHungry = this.turn + this.status.hungryByStep;
                    this.status.hp = Math.min(this.status.maxHp, this.status.hp + 1);
                    this.status.utsu = Math.min(this.status.maxUtsu, this.status.utsu + 1);
                }
            } else {
                ns.Log("hungry", { character: this });
                var amount = Math.floor(this.status.maxHp * 0.1);
                this.actionStack.push(this.damage.bind(this, amount));
            }
        },
        setArrow: function (flg) {
            this.effect.arrow.setVisible(flg === true);
        },
        attack: function () {
            this.play("attack");
            var view = this.getView();
            if (view.isAttackable(this.coord.proceed(this.dir))) {
                var trap = view.getTrap(this.coord.proceed(this.dir));
                if (trap) {
                    this.actionStack.unshift(function () {
                        trap.visible = true;
                    });
                }

                var target = view.getForwardCharacter(this.dir);
                if (target) {
                    this.actionStack.unshift(target.attacked.bind(target, this));
                }
            }
        },
        pick: function () {
            var view = this.getView();
            var obj = view.getFloorObject();
            if (obj) {
                if (obj.objectType === ns.Setting.object.type.trap) {
                    obj.invoke(this);
                } else if (obj.objectType === ns.Setting.object.type.stairs) {
                    ns.Log("pickStair");
                } else if (obj.objectType === ns.Setting.object.type.item) {
                    if (obj.itemType === "Storage") {
                        this.play("pick");
                        this.status.maxInventory += obj.data.size;
                        ns.Log("getStorage", {item: obj, amount: obj.data.size});
                        obj.remove();
                    } else if (this.inventory.length >= Math.floor(this.status.maxInventory)) {
                        ns.Log("unpick", {
                            item: obj
                        });
                    } else {
                        this.play("pick");
                        obj.remove();
                        this.inventory.push(obj);
                        ns.Log("pick", {
                            item: obj
                        });
                    }
                }
            } else {
                ns.Log("noItem");
            }
        },
        step: function () {
            var view = this.getView();
            var obj = view.getFloorObject();
            if (obj) {
                if (obj.objectType === ns.Setting.object.type.trap) {
                    // 罠の上を踏んだ
                    return obj.invoke(this);
                } else {
                    var key = ns.Util.KeyInput(ns.App);
                    if (key.a) {
                        // 高速移動中
                        this.animatingEnd = ns.Frame + ns.Setting.coolTime;
                    } else {
                        if (obj.objectType === ns.Setting.object.type.item) {
                            // アイテムの上を踏んだ
                            this.pick();
                        }
                    }
                }
            } else {
                return { notCool: true };
            }
        },
        skill: function () {
            var guard = this.getGuard();
            if (guard) {
                if (this.status.seal) {
                    ns.Log("sealed");
                    return;
                }
                if (this.status.utsu >= this.status.skillUtsu) {
                    if (guard.data.type === "radeon") {
                        this.play("skill");
                        this.status.utsu -= this.status.skillUtsu;
                        this.actionStack.unshift(function () {
                            var amount = 100;
                            this.heal(amount);
                            ns.Log("skill", {
                                amount: amount
                            });
                        });
                    } else if (guard.data.type === "geforce") {
                        this.play("magic");
                        this.status.utsu -= this.status.skillUtsu;
                        var view = this.getView();
                        var throwInfo = view.getThrow(this.dir);
                        if (throwInfo.hit) {
                            this.actionStack.unshift(function () {
                                throwInfo.hit.attacked(this, true);
                            });
                        }
                        ns.Effect.AttackSpell(this.coord, throwInfo.coord, this.dir);
                    }
                } else {
                    ns.Log("utsu");
                }
            } else {
                ns.Log("noVGA");
            }
        },
        die: function () {
            this.play("die");
            this.dead = true;
            ns.Log("die", {
                character: this
            });
            this.actionStack = [];
        },
    });

    // 敵クラス
    tm.define("game.character.Enemy", {
        superClass: "game.character.Character",
        init: function (name, coord, type) {
            this.superInit(name, coord, ns.Setting.character.enemy[type][name]);
            this.fromJSON({
                destWalkCount: 0,
            });
        },
        /**
         * Pre-action.
         */
        preAction: function () {
            var view = this.getView();
            // しじみりちゃんを発見した場合は追跡方向を記憶
            var shizimily = view.getShizimily();
            if (shizimily) {
                this.destination = shizimily.coord;
            }
        },
        /**
         * Action
         * @returns {Object} Action or null
         */
        getNextAction: function () {
            var view = this.getView();
            var shizimily = view.getShizimily();
            if (shizimily) {
                if (this.status.selfBomb) {
                    // HPが25%以下なら自爆
                    var ratio = this.status.hp / this.status.maxHp;
                    if (ratio < 0.25) {
                        return ns.Action(this, ns.ACTION.SELFBOMB, this.dir);
                    } else if (ratio < 0.5) {
                        return null;
                    }
                }
                var skill = this.status.skill;

                // 遠距離スキル
                
                if (view.isAttackable(shizimily.coord)) {
                    // もししじみりちゃんに攻撃可能ならうごかない
                    var dir = this.coord.dir(shizimily.coord);
                    
                    // スキルがあれば確率計算後発動
                    if (skill && ns.Util.randomBool(skill.frequency)) {
                        return ns.Action(this, ns.ACTION.SKILL, dir);
                    } else {
                        return ns.Action(this, ns.ACTION.ATTACK, dir);
                    }
                } else {
                    // 移動していない、かつしじみりちゃんが見えている、かつ遠距離スキル持ち
                    if (skill && skill.range === "long") {
                        return ns.Action(this, ns.ACTION.SKILL, this.dir, shizimily);
                    }
                }
            }
            return null;
        },
        /**
         * 移動計算
         * @returns {Object} Direction nullの場合は移動せず他の行動
         */
        calcWalk: function () {
            var view = this.getView();

            // ランダム・ウォーク
            if (this.status.randomWalk && Math.random() < this.status.randomWalk) {
                return view.getRandomDir();
            }

            // 目的地についたら目的地をクリア
            if (this.destination && this.destination.equals(this.coord)) {
                this.destination = null;
                this.destWalkCount = 0;
            }
            
            // 自爆敵はHPが50％以下の場合は動かない
            if (this.status.selfBomb && this.status.hp / this.status.maxHp < 0.5) {
                return null;
            }

            // しじみりちゃんを発見した場合は追跡方向を記憶
            var shizimily = view.getShizimily();
            if (shizimily) {
                if (view.isAttackable(shizimily.coord)) {
                    // もししじみりちゃんに攻撃可能ならうごかない
                    return null;
                }
                this.destination = shizimily.coord;

                var skill = this.status.skill;
                if (skill && skill.range === "long" && ns.Util.randomBool(skill.frequency)) {
                    // 遠距離攻撃の場合は動かない
                    return null;
                }
            }

            // 目的地がない場合新たに設定
            if (!this.destination) {
                this.destWalkCount = 0;
                if (this.status.ignoreWall) {
                    // 壁を通過する敵は部屋のどこかを目的地にする
                    this.destination = view.getFreeCell(ns.BLOCK.PATH);
                } else if (view.inRoom) {
                    // その他の場合はドアを目指す(目指すドアが決定済みの場合はそれを使う
                    if (view.doors.length > 1) {
                        // 真後ろのドアには入らない
                        var list = [];
                        view.doors.forEach(function (door) {
                            if (!door.equals(this.coord.proceed(this.dir.add(4)))) {
                                list.push(door);
                            }
                        }, this);
                        var index = Math.floor(Math.random() * list.length);
                        this.destination = list[index];
                    } else if (view.doors.length === 1) {
                        // 1個しかない場合はそれでも入る
                        this.destination = view.doors[0];
                    }
                }
            }

            if (!this.destination) {
                // それでも目的地がない場合は優先順位にしたがって行動
                return view.getPathDir(this.dir);
            } else {
                this.destWalkCount ++;
                // 目的地がある場合はそこに向かう
                var dest = this.destination;
                
                // 指定歩数歩いてつかない場合は目的地を忘れる
                if (this.destWalkCount >= ns.Setting.forgotDetination) {
                    this.destWalkCount = 0;
                    this.destination = null;
                }
                return view.getTargetDir(dest);
            }
        },
    });

    // 敵一覧の作成
    ns.Character.Enemy = function () {
        var data = ns.Setting.character.enemy;
        var ret = {};
        var creator = function (ret, type) {
            ns.Util.classGenerator(ret, "enemy", data, {}, type);
        };
        creator(ret, "Office");
        creator(ret, "Letter");
        creator(ret, "Telephone");
        creator(ret, "Water");
        creator(ret, "Human");
        return ret;
    }();
}(game));

// マップの定義
(function (ns) {

    // ローグワールド
    ns.World = tm.define("game.World", {
        superClass: "tm.display.MapSprite",
        init: function (shizimily, stage) {
            // バックグラウンドマップの表示
            stage = ns.Setting.stage[stage];
            var tile = stage.tile;
            if (tile instanceof Array) {
                tile = tile.random();
            }
            var mapData = ns.Util.CreateMap(tile, stage.width, stage.height, stage.map);
            var worldSheet = mapData.sheetData.world;
            var sheet = tm.asset.MapSheet(worldSheet);
            this.superInit(sheet, worldSheet.tilewidth, worldSheet.tileheight);

            // バックグラウンドマップのフォグの表示
            var fogSize = ns.Setting.fogSize;
            this.fog = tm.display.Sprite("shadow", fogSize, fogSize).fromJSON({
                scaleX: this.width / ns.Setting.fogSize * 2,
                scaleY: this.height / ns.Setting.fogSize * 2,
                x: this.width / 2,
                y: this.height / 2,
            }).addChildTo(this);

            // メインマップはField of viewの中に入れる
            var fov = ns.Fov().addChildTo(this);
            this.fromJSON({
                scaleX: ns.Setting.scale,
                scaleY: ns.Setting.scale,
                actionStack: [],
                turn: 0,
                cool: 0,
                executing: false,
                fov: fov,
                stage: stage,
                map: ns.Map(mapData).addChildTo(fov)
            });
            this.shizimily = this.map.addObject(shizimily);
            this.initStage();

            // minimapは作るだけ
            this.miniMap = ns.UI.MiniMap(this.getView(), stage.width, stage.height);

            // エフェクトレイヤ
            ns.EffectLayer.addChildTo(this);
            ns.ActionStack = this.actionStack;
        },
        /**
         * アイテムの設置と敵の設置
         */
        initStage: function () {
            this.stairs = this.map.addObject(ns.Stairs);
            this.putItems();
            this.putEnemies();
            this.putTraps();
        },
        /**
         * アイテムを配置する
         */
        putItems: function (num, coord) {
            num = num || ns.Util.addFluctuation(this.stage.item);

            for (var i = 0; i < num; i++) {
                var currentFrequency = 0;
                var select = Math.random() * ns.ItemFrequency.total;
                for (var name in ns.Item) {
                    currentFrequency += ns.ItemFrequency.list[name];
                    if (select < currentFrequency) {
                        this.map.addObject(ns.Item[name], coord);
                        break;
                    }
                }
            }
        },
        /**
         * 敵を配置する
         */
        putEnemies: function (num, coord) {
            num = num || ns.Util.addFluctuation(this.stage.enemy);
            for (var i = 0; i < num; i++) {
                var name = this.stage.enemyType.random();
                this.map.addObject(ns.Character.Enemy[name], coord);
            }
        },
        /**
         * 罠を配置する
         */
        putTraps: function (num, coord) {
            num = num || ns.Util.addFluctuation(this.stage.trap);
            var list = [];
            for (var name in ns.Trap) {
                list.push(name);
            }
            for (var i = 0; i < num; i++) {
                this.map.addObject(ns.Trap[list.random()], coord);
            }
        },
        /**
         * ターン処理
         */
        act: function () {
            this.turn++;
            var walk = [];
            var other = [];

            var characters = this.map.getCharacters();
            characters.erase(this.shizimily);

            // 行動前の視界情報
            characters.forEach(function (character) {
                character.preAction();
                // 移動前の座標を保存
                character.preCoord = character.coord;
            }, this);


            // 移動計算
            characters.forEach(function (character) {
                var dir = character.calcWalk();
                if (dir) {
                    this.actionStack.push(ns.Action(character, ns.ACTION.MOVE, dir));
                    character.coord = character.coord.proceed(dir);
                } else {
                    other.push(character);
                }
            }, this);

            // その他の行動計算
            other.forEach(function (character) {
                var action = character.getNextAction();
                if (action) {
                    this.actionStack.push(action);
                }
            }, this);

            // 座標を元に戻す
            characters.forEach(function (character) {
                character.coord = character.preCoord;
                character.preCoord = undefined;
            }, this);
        },
        /**
         * しじみりちゃんのビューを取得
         */
        getView: function () {
            return this.shizimily.getView();
        },

        /**しじみりちゃんの講堂を入力
         * @param {String} type  Action Type
         */
        input: function (type, target) {
            if (this.isOperatable()) {
                var shizimily = this.shizimily;
                if (this.shizimily.status.sleep) {
                    // しじみりちゃんが行動不能
                    this.shizimilyAction = ns.Action(shizimily, ns.ACTION.NONE, shizimily.dir);
                    shizimily.preCoord = shizimily.coord;
                    this.act();
                    shizimily.coord = shizimily.preCoord;
                    shizimily.preCoord = undefined;
                } else {
                    var view = this.getView();
                    shizimily.preCoord = shizimily.coord;
                    if (type === ns.ACTION.MOVE) {
                        if (!view.isMovable(shizimily.dir)) {
                            // 移動はクールタイムを入れない
                            return;
                        }

                        // しじみりちゃんが移動
                        shizimily.coord = shizimily.coord.proceed(this.shizimily.dir);
                    } else if (type === ns.ACTION.THROW) {
                        if (shizimily.inventory.length === 0) {
                            this.cool = ns.Frame + ns.Setting.coolTime;
                            ns.Log("notThrow");
                            return;
                        }
                    }
                    this.shizimilyAction = ns.Action(shizimily, type, shizimily.dir, target);

                    if (type === ns.ACTION.MOVE || type === ns.ACTION.NONE) {
                        // しじみりちゃんが移動なら先に敵の行動も計算
                        this.act();
                        shizimily.coord = shizimily.preCoord;
                        shizimily.preCoord = undefined;
                    }
                }
                this.actionStack.unshift(this.shizimilyAction);
            }
        },
        /**
         * Is operatable map?
         * @returns {Boolean} True: All characters are operatable.
         */
        isUnitTurnEnd: function () {
            var operatable = true;
            this.map.getCharacters().forEach(function (character) {
                operatable = operatable && character.isOperatable();
            }, this);
            return operatable;
        },
        isOperatable: function () {
            return !this.turnPlaying && !this.nextAct && this.isUnitTurnEnd() && this.actionStack.length === 0 && this.cool <= ns.Frame;
        },
        update: function (app) {
            // しじみりちゃんが死んでたらもう更新しない
            if (this.shizimily.dead) {
                return;
            }
            // Execute the action stack
            if (this.isUnitTurnEnd()) {
                this.map.sortObjects();
                // しじみりちゃんが移動以外の行動をした場合はここで行動計算
                if (this.nextAct) {
                    this.act();
                    this.nextAct = undefined;
                }

                if (this.actionStack.length > 0) {
                    this.turnPlaying = true;
                    var action = this.actionStack.shift();
                    if (action.type === ns.ACTION.MOVE || action.type === ns.ACTION.NONE) {
                        var actionList = [action];
                        while (this.actionStack.length > 0) {
                            if (this.actionStack[0].type === ns.ACTION.MOVE || action.type === ns.ACTION.NONE) {
                                action = this.actionStack.shift();
                                actionList.push(action);
                            } else {
                                break;
                            }
                        }
                        // 歩きは一括で行う
                        actionList.forEach(function (act) {
                            act.character.action(act);
                        }, this);
                    } else {
                        // それ以外のアクションは1個づつ
                        action.character.action(action);
                        if (action.character === this.shizimily) {
                            this.nextAct = true;
                        }
                    }
                    this.miniMap.updateView(this.getView());
                } else if (this.turnPlaying) {
                    this.miniMap.updateView(this.getView());
                    var view = this.shizimily.getView();
                    
                    // 時間を過ぎたらゲームオーバー
                    if (this.shizimily.turn >= ns.Setting.maxTurn) {
                        ns.Log("timeover");
                        this.shizimily.die();
                    }

                    // 階段の上にいたらメニューを開く
                    if (this.shizimilyAction.type === ns.ACTION.MOVE) {
                        ns.Util.KeyInputLast = 0;
                        var key = ns.Util.KeyInput(app);
                        if (!key.a && view.isStairs()) {
                            key.press(3);
                            var menu = ns.Menu.Open();
                            menu.selectElement(6);
                        }
                    }
                    
                    // 確率で敵が生まれる
                    if (view.countObjects() < ns.Setting.character.max) {
                        if (ns.Util.randomBool(ns.Setting.enemyBorn)) {
                            var newCoord = view.getOtherRoomCell();
                            if (newCoord) {
                                this.putEnemies(1, newCoord);
                            }
                        }
                    }
                    this.turnPlaying = false;
                }
            }

            // Move the world (Shizimily at center
            var x = this.shizimily.x;
            var y = this.shizimily.y;
            var coord = this.shizimily.coord;
            this.setPosition(ns.Setting.screenCenterX - x * ns.Setting.scale, ns.Setting.screenCenterY - y * ns.Setting.scale);

            // FoV update
            if (this.map.isInRoom(this.shizimily)) {
                var room = this.map.getRoom(coord);
                var width = room.getRight() - room.getLeft() + ns.Setting.fov.room.margin;
                var height = room.getBottom() - room.getTop() + ns.Setting.fov.room.margin;
                var fovX = (room.getRight() + room.getLeft() + ns.Setting.fov.room.position) / 2;
                var fovY = (room.getTop() + room.getBottom() + ns.Setting.fov.room.position) / 2;
                this.fov.setSize(width * ns.Setting.tileSize, height * ns.Setting.tileSize);
                this.fov.setPosition(fovX * ns.Setting.tileSize, fovY * ns.Setting.tileSize);
            } else {
                var size = ns.Setting.tileSize * ns.Setting.fov.path.size;
                this.fov.setSize(size, size);
                this.fov.setPosition(x, y);
            }
            this.map.setPosition(-this.fov.x, -this.fov.y);
        },
    });

    // Field of View
    ns.Fov = tm.define("game.Fov", {
        superClass: "tm.display.RectangleShape",
        init: function () {
            this.superInit({
                fillStyle: "white",
            });
            this.clipping = true;
        },
        update: function () {}
    });

    // マップ
    ns.Map = tm.define("game.Map", {
        superClass: "tm.display.MapSprite",
        init: function (mapData) {
            var floorSheet = mapData.sheetData.floor;
            var mapSheet = mapData.sheetData.map;
            var sheet = tm.asset.MapSheet(floorSheet);
            this.superInit(sheet, floorSheet.tilewidth, floorSheet.tileheight);
            this.mapData = mapData;

            sheet = tm.asset.MapSheet(mapSheet);
            var wall = tm.display.MapSprite(sheet, mapSheet.tilewidth, mapSheet.tileheight);

            this.layer = [];
            this.layer.push(tm.display.Shape().addChildTo(this)); // Item
            wall.addChildTo(this);
            this.layer.push(tm.display.Shape().addChildTo(this)); // Character
        },
        /**
         * オブジェクトを追加
         * @param   {Object} object オブジェクトクラスまたはインスタンス
         * @returns {Object} オブジェクトインスタンス
         */
        addObject: function (object, coord) {
            coord = coord || this.getFreeCell();
            if (!coord) {
                return;
            }
            if (this.mapData.blocks[coord.x][coord.y] === ns.BLOCK.WALL) {
                return null;
            }
            var obj;
            if (object.gameObject) {
                obj = object;
                ns.SetPos(object, coord);
            } else {
                obj = object(coord);
            }
            var layerIndex = ns.Setting.object.layer[obj.objectType];
            obj.addChildTo(this.layer[layerIndex]);
            // キャラクタの場合ビュー取得をつける
            if (obj.objectType === ns.Setting.object.type.character) {
                obj.getView = this.getView.bind(this, obj);
            }
            return obj;
        },
        sortObjects: function (layerIndex) {
            if (layerIndex === undefined) {
                layerIndex = 1;
            }
            var layer = this.layer[layerIndex];
            layer.children.sort(function (a, b) {
                return a.y - b.y;
            });
        },
        /**
         * ゲームオブジェクトを全て取得
         * @returns {Array} ゲームオブジェクト
         */
        getGameObjects: function () {
            var list = [];
            this.layer.forEach(function (layer) {
                layer.children.forEach(function (child) {
                    if (child.gameObject) {
                        list.push(child);
                    }
                }, this);
            }, this);
            return list;
        },
        /**
         * キャラクタのViewを取得
         * @param   {Object} character キャラクタ
         * @returns {Object} FoV
         */
        getView: function (character) {
            // 今いる部屋＋周囲8マスをViewListに追加
            var coord = character.coord;
            var list = {};
            var doors = [];
            list[coord.hash] = this.mapData.blocks[coord.x][coord.y];
            if (this.isInRoom(character)) {
                var room = this.getRoom(coord);
                room.fov.forEach(function (hash) {
                    var c = ns.Hash2Coord(hash);
                    list[hash] = this.mapData.blocks[c.x][c.y];
                }, this);
                room.getDoors(function (x, y) {
                    doors.push(ns.Coord(x, y));
                });
            }
            for (var dir = 0; dir < 8; dir++) {
                var c = coord.proceed(ns.Dirs[dir]);
                list[c.hash] = this.mapData.blocks[c.x][c.y];
            }

            //見えているオブジェクトを追加
            var objects = this.getGameObjects();

            var addObject = this.addObject.bind(this);
            var getFreeCell = this.getFreeCell.bind(this);
            return ns.View(this.mapData.width, this.mapData.height, coord, list, objects, this.mapData.blocks, doors, addObject, getFreeCell, character.status.ignoreWall);
        },
        /**
         * ゲームキャラクタを全て取得
         * @returns {Array} ゲームオブジェクト
         */
        getCharacters: function () {
            var list = [];
            var index = ns.Setting.object.layer[ns.Setting.object.type.character];
            this.layer[index].children.forEach(function (child) {
                if (child.objectType === ns.Setting.object.type.character) {
                    list.push(child);
                }
            }, this);
            return list;
        },
        /**
         * IS the character in the room?
         * @param   {Object}  object Game Objcect
         * @returns {Boolean} True:in room
         */
        isInRoom: function (object) {
            var coord = object.coord;
            return this.mapData.blocks[coord.x][coord.y] === ns.BLOCK.ROOM;
        },
        /**
         * Get the room including the coordinate.
         * @param   {Object} coord Coordinate
         * @returns {Object} Room object
         */
        getRoom: function (coord) {
            return this.mapData.room[coord.x][coord.y];
        },

        /**
         * Get the free cell.
         * @param   {String} [type="room"] "room":Find a cell in a room.
         * @returns {Object} Position Object
         */
        getFreeCell: function (type, view) {
            type = type || ns.BLOCK.ROOM;
            var i, coord;
            var cells = [];
            var exists = {};
            this.getGameObjects().forEach(function (obj) {
                exists[obj.coord.hash] = true;
            }, this);
            var list;
            if (type === ns.BLOCK.ROOM && this.mapData.freeRooms.length > 0) {
                list = this.mapData.freeRooms;
            } else {
                list = this.mapData.freeCells;
            }

            list.forEach(function (coord) {
                if (!exists[coord.hash] && (!view || !view[coord.hash])) {
                    cells.push(coord);
                }
            }, this);
            var pos = cells[Math.floor(Math.random() * cells.length)];
            return pos;
        }
    });
}(game));



// メニュー画面
(function (ns) {
    ns.Menu = {};
    // メニューの抽象クラス
    tm.define("game.menu.Menu", {
        superClass: "tm.display.Sprite",
        init: function (name, level, parentMenu, row, elementWidth) {
            level = level || 0;
            row = row || 6;
            elementWidth = elementWidth || 570 / row;
            var marginX = level === 0 ? 500 : 0;
            var marginY = level === 0 ? 300 : 0;
            var levelMargin = 20;

            this.superInit("note");
            this.fromJSON({
                name: name,
                objectType: "menu",
                row: row,
                elementWidth: elementWidth,
                elementHeight: 150,
                paddingX: elementWidth / 2 - 10,
                paddingY: 90,
                nonActiveAlpha: 0.2,
                duration: 200,
                opening: true,
                tween: tm.anim.Tween(),
                x: marginX + level * levelMargin,
                y: ns.Setting.screenHeight + this.height / 2,
            });
            if (parentMenu) {
                this.parentMenu = parentMenu;
                this.addChildTo(parentMenu);
                parentMenu.setEnabled(false);
            }

            // 下から出す
            this.tween.to(this, {
                y: marginY + level * levelMargin
            }, this.duration, "easeOutExpo");
            this.tween.on("finish", function () {
                this.opening = false;
            }.bind(this));
            this.tween.start();

            // メニュービュー
            this.view = tm.display.Shape({
                width: this.width,
                height: this.height - this.paddingY,
                x: 0,
                y: 0,
                clipping: true
            }).addChildTo(this);

            // メニューコンテンツ置き場
            this.contents = tm.display.Shape({
                x: 0,
                y: 0
            }).addChildTo(this.view);

            // ページャー
            this.pager = tm.display.Label("").fromJSON({
                x: 20 - this.width / 2,
                y: -35 + this.height / 2,
                fillStyle: "rgb(64, 64, 64)",
                align: "left",
            }).addChildTo(this);

            // バックグラウンドのフォグ
            this.fog = tm.display.Sprite("shadow", 12, 12).fromJSON({
                alpha: 0,
                scaleX: (this.width - 10) / 12,
                scaleY: (this.height - 10) / 12
            }).addChildTo(this).setAlpha(0);

            this.elements = [];
            this.index = -1;
        },
        exec: function () {
            if (this.index >= 0) {
                ns.StaticLog();
                this.execSub();
            }
        },
        getCurrent: function () {
            var m = this;
            var found = true;
            var func = function (child) {
                if (child.objectType === "menu") {
                    m = child;
                    found = true;
                }
            };
            while (found) {
                found = false;
                m.children.forEach(func);
            }
            return m;
        },
        addElement: function (name, title, icon, tag) {
            if (!icon) {
                icon = tm.display.Sprite("menuicon_" + name);
            }
            var index = this.elements.length;
            var elem = tm.display.Shape({
                alpha: this.nonActiveAlpha,
                x: this.paddingX - this.width / 2 + this.elementWidth * (index % this.row),
                y: this.paddingY - this.height / 2 + this.elementHeight * (Math.floor(index / this.row))
            }).addChildTo(this.contents);

            elem.icon = icon.addChildTo(elem);
            icon.setPosition(elem.width / 2, icon.height / 2);
            if (tag) {
                tag = this.getTag(tag).addChildTo(elem);
                tag.setPosition(elem.width / 2, icon.height / 2);
            }
            this.elements.push(elem);

            if (!title) {
                icon.y += 15;
            }
            var label = tm.display.Label(title).fromJSON({
                x: elem.width / 2,
                y: icon.height + 20,
                fillStyle: "rgb(64, 64, 64)",
                maxWidth: this.elementWidth,
            }).addChildTo(elem);

            if (this.elements.length === 1) {
                this.selectElement(0);
            }
            this.setPager();
        },
        getTag: function (text) {
            var icon = tm.display.Shape();
            icon.width = this.elementWidth;
            icon.height = this.elementWidth;
            var canvas = icon.canvas;
            canvas.save();
            canvas.setTransformCenter();
            canvas.rotate(Math.degToRad(45));
            canvas.fillStyle = "rgba(0, 0, 255, 0.5)";
            canvas.beginPath();
            canvas.moveTo(-80, -30);
            canvas.lineTo(-60, -50);
            canvas.lineTo(60, -50);
            canvas.lineTo(80, -30);
            canvas.closePath();
            canvas.fill();
            canvas.context.textAlign = "center";
            canvas.fillStyle = "rgba(255, 255, 255, 0.5)";
            canvas.context.font = "18px Century Gothic";
            canvas.fillText(text, 0, -33);
            canvas.restore();
            return icon;
        },
        close: function () {
            if (!this.closing) {
                ns.StaticLog();
                this.tween.to(this, {
                    y: ns.Setting.screenHeight + this.height / 2
                }, this.duration / 2, "easeInQuad").one("finish", function () {
                    if (this.parentMenu) {
                        this.parentMenu.setEnabled(true);
                    }
                    this.remove();
                }.bind(this));
                this.tween.start();
                this.closing = true;
            }
        },
        setEnabled: function (flg) {
            var prop = {};
            prop.alpha = flg ? 0 : 1;
            this.tween.to(this.fog, prop, this.duration / 2);
            this.tween.start();
        },
        setPager: function () {
            var pages = Math.ceil(this.elements.length / (this.row * 2));
            if (pages > 1) {
                var i = Math.floor(this.index / (this.row * 2) + 1);
                this.pager.text = "(" + i + "/" + pages + " page)";
            } else {
                this.pager.text = "";
            }
        },
        selectElement: function (index) {
            if (this.elements.length > 0) {
                index = (this.elements.length + index) % this.elements.length;
                var line = Math.floor(index / this.row / 2);
                if (line !== Math.floor(this.index / this.row / 2)) {
                    var tween = tm.anim.Tween();
                    tween.to(this.contents, {
                        y: -line * this.elementHeight * 2
                    }, 200, "easeOutExpo");
                    tween.start();
                }
                this.elements.forEach(function (elem) {
                    elem.alpha = this.nonActiveAlpha;
                }, this);
                this.elements[index].alpha = 1;
                this.index = index;
                this.setPager();
            }
        },
    });
    // メインメニュー
    ns.Menu.Main = tm.define("game.menu.Main", {
        superClass: "game.menu.Menu",
        init: function () {
            this.superInit("main-menu", 0);
            this.addElement("alert", "たたく");
            this.addElement("favourites", "まほう");
            this.addElement("search", "ひろう");
            this.addElement("basket-full", "つかう");
            this.addElement("empty", "すてる");
            this.addElement("right", "なげる");

            this.addElement("star", "おりる");
            this.addElement("error", "おわる");
            this.addElement("configuration", "そうさ");
            this.addElement("movie", "かころぐ");
            this.addElement("statistic", "すぺっく");
            this.addElement("earth", "ごうせい");

            this.scene = ns.CurrentScene;
        },
        execSub: function () {
            var index = this.index;
            var world = this.scene.world;
            var app = this.scene.app;
            var shizimily = world.shizimily;
            var view = shizimily.getView();
            if (index === 0) {
                // 攻撃
                world.input(ns.ACTION.ATTACK);
            } else if (index === 1) {
                // ヒール
                world.input(ns.ACTION.SKILL);
            } else if (index === 2) {
                // ひろう
                world.input(ns.ACTION.PICK);
            } else if (index === 3) {
                // 使う
                ns.Menu.Item(shizimily.inventory, this, function (index) {
                    world.input(ns.ACTION.USE, index);
                    this.close();
                }.bind(this), shizimily.status.maxInventory);
                return;
            } else if (index === 4) {
                // 捨てる
                ns.Menu.Item(shizimily.inventory, this, function (index) {
                    world.input(ns.ACTION.PUT, index);
                    this.close();
                }.bind(this), shizimily.status.maxInventory);
                return;

            } else if (index === 5) {
                // 投げる
                ns.Menu.Item(shizimily.inventory, this, function (index) {
                    world.input(ns.ACTION.THROW, index);
                    this.close();
                }.bind(this), shizimily.status.maxInventory);
                return;
            } else if (index === 6) {
                // 降りる
                if (view.isStairs()) {
                    this.scene.clear();
                } else {
                    ns.Log("notStairs");
                }
            } else if (index === 7) {
                app.pushScene(ns.Scene.Pause());
            } else if (index === 8) {
                ns.Menu.Setting(this);
                return;
            } else if (index === 9) {
                var array  = [];
                ns.Menu.PastLog(this, ns.PastLog);
                return;
            } else if (index === 10) {
                ns.Menu.Score(this, shizimily);
                return;
            } else if (index === 11) {
                var equippedItems = [];
                shizimily.inventory.forEach(function (item, index) {
                    if (item.itemType === "CPU" || item.itemType === "Graphic") {
                        if (!item.equipped.atk && !item.equipped.def) {
                            equippedItems.push(item);
                        }                            
                    }
                });
                // ごうせい
                ns.Menu.Item(equippedItems, this, function (index) {
                    world.input(ns.ACTION.REINFORCE, equippedItems[index]);
                    this.close();
                }.bind(this), shizimily.status.maxInventory);
                return;
            }
            return this.close();
        },
    });
    // アイテム一覧
    ns.Menu.Item = tm.define("game.menu.Item", {
        superClass: "game.menu.Menu",
        init: function (items, mainMenu, onSelect, max) {
            this.superInit("item-menu", 1, mainMenu, 3);
            this.onSelect = onSelect;
            this.max = max;
            items.forEach(function (item) {
                var tag = null;
                if (item.equipped.atk) {
                    tag = "装備中(CPU)";
                } else if (item.equipped.def) {
                    tag = "装備中(グラボ)";
                }
                this.addElement(item.name, item.displayName, item, tag);
            }, this);
        },
        execSub: function () {
            this.onSelect(this.index);
        },
        setPager: function () {
            var pages = Math.ceil(this.elements.length / (this.row * 2));
            if (this.elements.length === 0) {
                this.pager.text = "なにもないよ";
            } else {
                var i = Math.floor(this.index / (this.row * 2) + 1);
                this.pager.text = "(" + i + "/" + pages + " page) (アイテム " + this.elements.length + "/" + Math.floor(this.max) + ")";
            }
            ns.StaticLog(this.elements[this.index].icon.data.description);
        },
    });
    // 過去ログ
    ns.Menu.PastLog = tm.define("game.menu.PastLog", {
        superClass: "game.menu.Menu",
        init: function (mainMenu, lines) {
            this.superInit("pastlog-menu", 1, mainMenu, 1, 95);
            this.elementHeight = 25;
            this.nonActiveAlpha = 0;
            this.lines = lines;
            this.detailPaddingY = 20;
            this.detailPaddingX = 20;
            
            lines.reverse().forEach(function (line) {
                this.addElement("right", "");
            }, this);

            var height = this.elementHeight * this.elements.length;
            this.detail = tm.display.Shape({
                y: height / 2 - this.paddingY - this.detailPaddingY + 20,
                x: 30,
                width: this.width - 200,
                height: height
            }).addChildTo(this.contents);
        },
        update: function () {
            this.renderLog();
        },
        execSub: function () {
        },
        renderLog: function () {
            var canvas = this.detail.canvas;
            canvas.clear(0, 0, this.detail.width, this.detail.height);
            canvas.strokeStyle = "rgb(0, 0, 0)";
            canvas.beginPath();
            canvas.moveTo(0, -40);
            canvas.lineTo(0, this.detail.height);
            canvas.stroke();

            this.renderLine();
        },
        setPager: function () {
            this.pager.text = "(" + (this.index + 1) + "/" + this.elements.length + " line)";
        },
        renderLine: function () {
            var canvas = this.detail.canvas;
            for (var i = 0; i < this.lines.length; i++) {
                if (i === this.index) {
                    canvas.fillStyle = "rgb(64, 64, 64)";
                    canvas.strokeStyle = "rgb(0, 0, 0)";
                } else {
                    canvas.fillStyle = "rgb(192, 192, 192)";
                    canvas.strokeStyle = "rgb(128, 128, 128)";
                }
                var x = this.detailPaddingX;
                var y = this.detailPaddingY + i * this.elementHeight;

                canvas.font = "14px Century Gothic";
                canvas.fillText(this.lines[i], x, y);
            }
        },
    });
    // 過去ログ
    ns.Menu.Score = tm.define("game.menu.Score", {
        superClass: "game.menu.Menu",
        init: function (mainMenu, shizimily) {
            this.superInit("score-menu", 1, mainMenu, 1, 95);
            this.elementHeight = 30;
            this.nonActiveAlpha = 0;
            this.detailPaddingY = 20;
            this.detailPaddingX = 20;
            
            var height = this.elementHeight * 10;
            this.detail = tm.display.Shape({
                y: height / 2 - this.paddingY - this.detailPaddingY - 20,
                x: 30,
                width: this.width - 200,
                height: height
            }).addChildTo(this.contents);
            
            this.status = {
                name: shizimily.displayName,
                hp: shizimily.status.hp,
                maxHp: shizimily.status.maxHp,
                atk: shizimily.getAtk(),
                def: shizimily.getDef(),
                utsu: shizimily.status.utsu,
                maxUtsu: shizimily.status.maxUtsu,
                hungry: shizimily.status.hungry,
                maxHungry: shizimily.status.maxHungry,
                maxItem: Math.floor(shizimily.status.maxInventory),
                item: shizimily.inventory.length,
            };
            this.lines = [
                "～すてーたす～",
                "",
                "なまえ     : {name}",
                "HP         : {hp} / {maxHp}",
                "うつ       : {utsu} / {maxUtsu}",
                "社畜力     : {atk}",
                "残業回避力 : {def}",
                "空腹度     : {hungry} / {maxHungry}",
                "かばん     : {item} / {maxItem}",
            ];
        },
        update: function () {
            this.renderLog();
        },
        execSub: function () {
        },
        renderLog: function () {
            var canvas = this.detail.canvas;
            canvas.clear(0, 0, this.detail.width, this.detail.height);
            canvas.strokeStyle = "rgb(0, 0, 0)";
            canvas.beginPath();
            canvas.moveTo(0, -40);
            canvas.lineTo(0, this.detail.height);
            canvas.stroke();

            this.renderLine();
        },
        setPager: function () {
        },
        renderLine: function () {
            var canvas = this.detail.canvas;
            for (var i = 0; i < this.lines.length; i++) {
                canvas.fillStyle = "rgb(64, 64, 64)";
                canvas.strokeStyle = "rgb(0, 0, 0)";

                var x = this.detailPaddingX;
                var y = this.detailPaddingY + i * this.elementHeight;

                canvas.font = "18px MS Gothic";
                canvas.fillText(this.lines[i].format(this.status), x, y);
            }
        },
    });
    // 設定
    ns.Menu.Setting = tm.define("game.menu.Setting", {
        superClass: "game.menu.Menu",
        init: function (mainMenu) {
            this.superInit("setting-menu", 1, mainMenu, 1, 95);
            this.elementHeight = 80;
            this.nonActiveAlpha = 0;
            this.addElement("right", "");
            this.addElement("right", "");
            this.addElement("right", "");
            this.addElement("right", "");
            this.addElement("right", "");
            this.addElement("right", "");
            this.addElement("right", "");
            this.addElement("right", "");
            this.addElement("right", "");
            this.addElement("right", "");

            this.params = [ns.Config.volume.bgm, ns.Config.volume.effect, ns.Config.key.z, ns.Config.key.x, ns.Config.key.c, ns.Config.key.v, ns.Config.key.a, ns.Config.key.s, ns.Config.key.d, ns.Config.key.f];
            this.baseParams = [100, 100, "z", "x", "c", "v", "a", "s", "d", "f"];

            this.title = ["BGM音量", "効果音音量", "攻撃・決定", "魔法/キャンセル", "足踏み", "メニュー", "高速移動", "移動禁止", "斜め限定", "マップ非表示"];

            this.detailPaddingY = 40;
            this.detailPaddingX = 80;
            this.graphWidth = 300;
            this.nowEditing = false;

            var height = this.elementHeight * this.elements.length;
            this.detail = tm.display.Shape({
                y: height / 2 - this.paddingY - this.detailPaddingY + 20,
                x: 30,
                width: this.width - 200,
                height: height
            }).addChildTo(this.contents);
            this.renderDetail();

        },
        renderDetail: function () {
            var canvas = this.detail.canvas;
            canvas.clear(0, 0, this.detail.width, this.detail.height);
            canvas.strokeStyle = "rgb(0, 0, 0)";
            canvas.beginPath();
            canvas.moveTo(0, -40);
            canvas.lineTo(0, this.detail.height - 40);
            canvas.stroke();

            this.renderGuage();
        },
        setPager: function () {
            this.pager.text = "(" + (this.index + 1) + "/" + this.elements.length + ")";
        },
        renderGuage: function () {
            var canvas = this.detail.canvas;
            for (var i = 0; i < this.params.length; i++) {
                if (i === this.index && this.nowEditing) {
                    canvas.fillStyle = "rgb(64, 64, 64)";
                    canvas.strokeStyle = "rgb(0, 0, 0)";
                } else {
                    canvas.fillStyle = "rgb(192, 192, 192)";
                    canvas.strokeStyle = "rgb(128, 128, 128)";
                }
                var x = this.detailPaddingX;
                var y = this.detailPaddingY + i * this.elementHeight;

                var param = this.params[i];
                var title = this.title[i];
                var base = this.baseParams[i];

                if (typeof param === "number") {
                    canvas.font = "20px Century Gothic";
                    canvas.fillRect(x, y - 10, param * this.graphWidth / base, 30);
                    canvas.strokeRect(x, y - 10, this.graphWidth, 30);
                    canvas.fillText(title + " (" + param + "/" + base + ")", x, y - 20);
                } else if (typeof param === "string") {
                    canvas.font = "20px Century Gothic";
                    canvas.fillText(title + ": " + param.toUpperCase() + " (標準:" + base.toUpperCase() + ")", x, y);
                }
            }
        },
        execSub: function () {
            this.nowEditing = !this.nowEditing;
        },
        setValue: function (v) {
            if (this.nowEditing) {
                var value = this.params[this.index];
                if (typeof value === "number") {
                    value += v;
                    value = Math.max(value, 0);
                    value = Math.min(value, this.baseParams[this.index]);
                    this.params[this.index] = value;

                    if (this.index === 0) {
                        ns.Sound.Bgm.setVolume(this.params[0]);
                    } else if (this.index === 1) {
                        // エフェクトはサンプル音を流す
                        var effect = ns.Sound.Character("shizimily");
                        effect.setVolume(this.params[1]);
                        effect.play("attack", 1);
                    }
                } else if (typeof value === "string" && typeof v === "string") {
                    for (var i = 2; i < 9; i++) {
                        if (this.params[i] === v) {
                            this.params[i] = this.params[this.index];
                            break;
                        }
                    }
                    this.params[this.index] = v;

                    ns.Config.key.z = this.params[2];
                    ns.Config.key.x = this.params[3];
                    ns.Config.key.c = this.params[4];
                    ns.Config.key.v = this.params[5];
                    ns.Config.key.a = this.params[6];
                    ns.Config.key.s = this.params[7];
                    ns.Config.key.d = this.params[8];
                    ns.Config.key.f = this.params[9];
                    this.nowEditing = false;
                }
            }
        },
        update: function () {
            this.renderDetail();
        },

    });
}(game));

