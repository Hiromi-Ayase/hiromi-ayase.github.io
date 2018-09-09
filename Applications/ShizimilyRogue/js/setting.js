var game = game || {};

(function (ns) {
    'use strict';
    ns.Setting = {
        "screenWidth": 1280,
        "screenHeight": 720,
        "tileSize": 64,
        "scale": 1,
        "fps": 60,
        "coolTime": 15,
        "worldScroll": 500,
        "keyInterval": 15,
        "fogSize": 12,
        "fluctuation": 0.2,
        "maxTurn": 8.5 * 60 * 6,
        "enemyBorn": 0.01,
        "attackFail": 0.2,
        "forgotDetination": 10,
        "reinforce": {
            probability: [1, 1, 1, 1, 1, 1, 0.7, 0.5, 0.4, 0.3, 0.2, 0.1],
        },
        "url": "https://dl.dropboxusercontent.com/u/9407653/Applications/ShizimilyRogue/index.html?nosound=true",
        "randomNews": 180,
        "randomVoice": 100,
        
        "face": {
            table: [
                ["A0", "C0", "B0"],
                ["D0", "E0", "F0"],
                ["D1", "G2", "F1"],
                ["A2", "D2", "H2"],
            ],
            frame: 20,
            type: {
                pick: "happy",
                damage: "sad",
            },
        },
        "sound": {
            "volume": {
                "bgm": 30,
                "effect": 30,
                "base": 300,
            }
        },
        "message": {
            "background": "messageWindow",
            "top": 285,
            "left": 130,
            "height": 83,
            "width": 900,
            "lineHeight": "30px",
            "wait": 0.2,
            "displayWait": 3,
            "maxLog": 10,
        },
        "fov": {
            "room": {
                "margin": 2,
                "position": 1,
            },
            "path": {
                "size": 2.5
            }
        },
        "object": {
            "animationFrequency": 10,
            "speed": 200,
            "adjust": {
                "x": 32,
                "y": 64
            },
            "type": {
                "character": 0,
                "item": 1,
                "trap": 2,
                "stairs": 3,
            },
            "layer": [1, 0, 0, 0],
        },
        "stairs": {
            "size": 64,
            "asset": "object_stairs",
            "name": "階段",
            "frameIndex": 0,
        },
        "stateChange": {
            "sleep": 10,
            "seal": 10,
        },
        "item": {
            "size": 64,
            "data": {
                "CPU": {
                    "Corei7ex": {
                        "asset": "item",
                        "baseName": "Core i7 Extreme",
                        "frameIndex": 0,
                        "atk": 30,
                        "frequency": 2,
                        "description": "装備すると社畜力おおはばあっぷ☆",
                    },
                    "Corei7": {
                        "asset": "item",
                        "baseName": "Core i7",
                        "frameIndex": 0,
                        "atk": 20,
                        "frequency": 10,
                        "description": "装備するとTERAもかるがるうごくよ！",
                    },
                    "Corei5": {
                        "asset": "item",
                        "baseName": "Core i5",
                        "frameIndex": 0,
                        "atk": 15,
                        "frequency": 20,
                        "description": "装備すると社畜にふさわしい仕事力が！",
                    },
                    "Corei3": {
                        "asset": "item",
                        "baseName": "Core i3",
                        "frameIndex": 0,
                        "atk": 10,
                        "frequency": 40,
                        "description": "うーん、ちょっと非力かな？ごうせいには使えるかな？",
                    },
                },
                "Graphic": {
                    "GFtitan": {
                        "asset": "item",
                        "baseName": "GeForce GTX TITAN",
                        "frameIndex": 4,
                        "def": 30,
                        "type": "geforce",
                        "frequency": 1,
                        "description": "残業回避力抜群！遠距離魔法もできるよ！",
                    },
                    "GF980Ti": {
                        "asset": "item",
                        "baseName": "GeForce GTX 980Ti",
                        "frameIndex": 4,
                        "def": 20,
                        "type": "geforce",
                        "frequency": 3,
                        "description": "TERAもかるがる表示できるね！遠距離魔法もできるよ！",
                    },
                    "GF920": {
                        "asset": "item",
                        "baseName": "GeForce 960",
                        "frameIndex": 4,
                        "def": 10,
                        "type": "geforce",
                        "frequency": 20,
                        "description": "そ、ソリティアぐらいなら・・！ごうせいには使えるかな？",
                    },
                    "RadeonFury": {
                        "asset": "item",
                        "baseName": "Radeon R9 Fury X",
                        "frameIndex": 4,
                        "def": 30,
                        "type": "radeon",
                        "frequency": 1,
                        "description": "装備したら残業回避力抜群！ヒールもできるよ！",
                    },
                    "RadeonR9": {
                        "asset": "item",
                        "baseName": "Radeon R9 290",
                        "frameIndex": 4,
                        "def": 20,
                        "type": "radeon",
                        "frequency": 3,
                        "description": "装備したらTERAもかるがる！ヒールもできるよ！",
                    },
                    "RadeonR7": {
                        "asset": "item",
                        "baseName": "Radeon R7 260",
                        "frameIndex": 4,
                        "def": 10,
                        "type": "radeon",
                        "frequency": 20,
                        "description": "マインスイーパぐらいなら・・・！ごうせいには使えるかな？",
                    },
                },
                "DVD": {
                    "Sleep": {
                        "asset": "item",
                        "name": "子守唄のDVD",
                        "frameIndex": 8,
                        "frequency": 20,
                        "description": "敵がみんなおねんね",
                    },
                    "Real": {
                        "asset": "item",
                        "name": "リア充のDVD",
                        "frameIndex": 8,
                        "frequency": 20,
                        "description": "敵がみんなばくはつ",
                    },
                    "Rock": {
                        "asset": "item",
                        "name": "排気口マップROM",
                        "frameIndex": 9,
                        "frequency": 20,
                        "description": "このフロアのどこかに出られるよ",
                    },
                },
                "Sweet": {
                    "ShortCake": {
                        "asset": "item",
                        "name": "いちごのケーキ",
                        "frameIndex": 36,
                        "hp": 10,
                        "frequency": 100,
                        "full": 50,
                        "type": "cake",
                        "description": "とってもおいしくてお腹いっぱいになるよ",
                    },
                    "HoleCake": {
                        "asset": "item",
                        "name": "まぁるいケーキ",
                        "frameIndex": 37,
                        "hp": 100,
                        "full": 100,
                        "frequency": 30,
                        "type": "cake",
                        "description": "おいしいうえに元気いっぱいになるよ",
                    },
                    "SoftCream": {
                        "asset": "item",
                        "name": "ソフトクリーム",
                        "frameIndex": 32,
                        "utsu": 30,
                        "full": 30,
                        "frequency": 10,
                        "type": "ice",
                        "description": "あまいものをたべるとうつがすっきり",
                    },
                    "IceCream": {
                        "asset": "item",
                        "name": "だっつ",
                        "frameIndex": 33,
                        "utsu": 100,
                        "full": 50,
                        "frequency": 1,
                        "type": "ice",
                        "description": "高級アイスでうつをふきとばせ！",
                    },
                    "CookieA": {
                        "asset": "item",
                        "name": "クッキー",
                        "frameIndex": 28,
                        "hp": 10,
                        "utsu": 20,
                        "full": 10,
                        "frequency": 5,
                        "type": "cookie",
                        "description": "うつとHPがちょっとづつ回復",
                    },
                    "CookieB": {
                        "asset": "item",
                        "name": "クッキー",
                        "frameIndex": 29,
                        "hp": 20,
                        "utsu": 10,
                        "full": 10,
                        "frequency": 5,
                        "type": "cookie",
                        "description": "うつとHPがちょっとづつ回復",
                    },
                },
                "Storage": {
                    "PCCase": {
                        "asset": "item",
                        "name": "PCケース",
                        "frameIndex": 12,
                        "frequency": 1,
                        "size": 3,
                        "type": "storage",
                        "description": "",
                    },
                    "Memory": {
                        "asset": "item",
                        "name": "メモリ",
                        "frameIndex": 16,
                        "frequency": 2,
                        "size": 2,
                        "type": "storage",
                        "description": "",
                    },
                    "HDD": {
                        "asset": "item",
                        "name": "HDD",
                        "frameIndex": 24,
                        "frequency": 3,
                        "size": 1,
                        "type": "storage",
                        "description": "",
                    },
                    "SDCard": {
                        "asset": "item",
                        "name": "SDカード",
                        "frameIndex": 20,
                        "frequency": 5,
                        "size": 0.2,
                        "type": "storage",
                        "description": "",
                    },
                },
            }
        },
        "trap": {
            "size": 64,
            "data": {
                "blackhole": {
                    "asset": "trap",
                    "name": "ぶらっくほーる",
                    "frameIndex": 0,
                    "frequency": 0.7,
                    "break": 0.05,
                },
                "summon": {
                    "asset": "trap",
                    "name": "召喚の罠",
                    "frameIndex": 4,
                    "frequency": 0.7,
                    "break": 0.3,
                },
                "pin": {
                    "asset": "trap",
                    "name": "画鋲",
                    "frameIndex": 5,
                    "frequency": 0.7,
                    "break": 0.05,
                },
                "hungry": {
                    "asset": "trap",
                    "name": "おかしの絵",
                    "frameIndex": 3,
                    "frequency": 0.7,
                    "break": 0.05,
                },
                "hole": {
                    "asset": "trap",
                    "name": "おとしあな",
                    "frameIndex": 1,
                    "frequency": 0.7,
                    "break": 0,
                },
                "sleep": {
                    "asset": "trap",
                    "name": "すいみんの罠",
                    "frameIndex": 2,
                    "frequency": 0.7,
                    "break": 0.05,
                },
            },
        },
        //Enemy:
        // Word, Excel, PowerPoint,
        // Letter, Mail,
        // Telephone, Feature, Smartphone,
        // Magcup, Pot, Bucket,
        // Popori, Elin
        "stage": {
            "first": {
                "item": 5,
                "enemy": 0,
                "trap": 5,
                "map": "Digger",
                "width": 40,
                "height": 40,
                "enemyType": ["Word"],
                "tile": "green",
            },
            "office1": {
                "item": 7,
                "enemy": 7,
                "trap": 5,
                "map": "Digger",
                "width": 40,
                "height": 40,
                "enemyType": ["Word"],
                "tile": "red",
            },
            "office2": {
                "item": 7,
                "enemy": 7,
                "trap": 5,
                "map": "Digger",
                "width": 40,
                "height": 40,
                "enemyType": ["Word", "Excel"],
                "tile": "blue",
            },
            "office3": {
                "item": 7,
                "enemy": 7,
                "trap": 5,
                "map": "Digger",
                "width": 40,
                "height": 40,
                "enemyType": ["Word", "Excel", "PowerPoint"],
                "tile": "green",
            },
            "remoteOffice1": {
                "item": 7,
                "enemy": 7,
                "trap": 5,
                "map": "Digger",
                "width": 40,
                "height": 40,
                "enemyType": ["Excel", "PowerPoint", "Letter"],
                "tile": "black",
            },
            "remoteOffice2": {
                "item": 7,
                "enemy": 7,
                "trap": 5,
                "map": "Digger",
                "width": 40,
                "height": 40,
                "enemyType": ["Excel", "PowerPoint", "Letter", "Mail"],
                "tile": "red",
            },
            "computerOffice1": {
                "item": 7,
                "enemy": 7,
                "trap": 5,
                "map": "Digger",
                "width": 40,
                "height": 40,
                "enemyType": ["Telephone", "PowerPoint", "Mail"],
                "tile": "green",
            },
            "computerOffice2": {
                "item": 7,
                "enemy": 7,
                "trap": 5,
                "map": "Digger",
                "width": 40,
                "height": 40,
                "enemyType": ["Telephone", "Feature", "PowerPoint", "Mail"],
                "tile": "blue",
            },
            "computerOffice3": {
                "item": 7,
                "enemy": 7,
                "trap": 5,
                "map": "Digger",
                "width": 40,
                "height": 40,
                "enemyType": ["Telephone", "Feature", "Smartphone", "Mail"],
                "tile": "green",
            },
            "breakRoom1": {
                "item": 7,
                "enemy": 7,
                "trap": 5,
                "map": "Digger",
                "width": 40,
                "height": 40,
                "enemyType": ["Magcup", "Feature", "Smartphone"],
                "tile": "black",
            },
            "breakRoom2": {
                "item": 7,
                "enemy": 7,
                "trap": 5,
                "map": "Digger",
                "width": 40,
                "height": 40,
                "enemyType": ["Magcup", "Pot", "Feature", "Smartphone"],
                "tile": "green",
            },
            "breakRoom3": {
                "item": 7,
                "enemy": 7,
                "trap": 5,
                "map": "Digger",
                "width": 40,
                "height": 40,
                "enemyType": ["Magcup", "Pot", "Bucket", "Smartphone"],
                "tile": "red",
            },
            "exectiveRoom1": {
                "item": 7,
                "enemy": 7,
                "trap": 5,
                "map": "Digger",
                "width": 40,
                "height": 40,
                "enemyType": ["Popori", "Bucket", "Smartphone"],
                "tile": "hole",
            },
            "exectiveRoom2": {
                "item": 7,
                "enemy": 7,
                "trap": 5,
                "map": "Digger",
                "width": 40,
                "height": 40,
                "enemyType": ["Popori", "Elin", "Bucket", "Smartphone"],
                "tile": "hole",
            },
            "debug": {
                "item": 10,
                "enemy": 0,
                "trap": 10,
                "map": "Digger",
                "width": 25,
                "height": 25,
//                "enemyType": ["Letter", "Telephone", "Feature", "Smartphone", "Mail", "Magcup", "Pot", "Popori", "Elin", "Bucket", "Word", "Excel", "PowerPoint"],
                "enemyType": ["Smartphone"],
                "tile": [
                    "basic", "blue", "green", "red", "black", "hole"
                ],
            },
        },
        "character": {
            "max": 15,
            "size": 192,
            "adjust": {
                "x": 30,
                "y": 55
            },
            "shizimily": {
                "name": "しじみりちゃん",
                "status": {
                    "hp": 100,
                    "maxHp": 100,
                    "atk": 15,
                    "def": 5,
                    "hungry": 100,
                    "hungryByStep": 6,
                    "maxHungry": 100,
                    "utsu": 100,
                    "maxUtsu": 100,
                    "maxInventory": 12,
                    "skillUtsu": 10,
                    "matk": 100,
                },
                "asset": "character_shizimily",
                "frequency": {
                    "walk": [16, 16, 16, 16],
                    "attack": [8, 8, 8, 8],
                    "damage": [2],
                    "throw": [32],
                    "eat": [16, 16, 16, 16],
                    "skill": [8, 8, 8, 8, 4],
                    "playDVD": [32],
                    "die": [32],
                    "magic": [16],
                    "sleep": [16, 16, 16, 16],
                    "trap": [10],
                },
                "animation": {
                    "walk_top": [16, 17, 18, 19],
                    "walk_topLeft": [20, 21, 22, 23],
                    "walk_left": [24, 25, 26, 27],
                    "walk_bottomLeft": [28, 29, 30, 31],
                    "walk_bottom": [0, 1, 2, 3],
                    "walk_bottomRight": [4, 5, 6, 7],
                    "walk_right": [8, 9, 10, 11],
                    "walk_topRight": [12, 13, 14, 15],
                    "attack_top": [48, 49, 50, 51],
                    "attack_topLeft": [52, 53, 54, 55],
                    "attack_left": [56, 57, 58, 59],
                    "attack_bottomLeft": [60, 61, 62, 63],
                    "attack_bottom": [32, 33, 34, 35],
                    "attack_bottomRight": [36, 37, 38, 39],
                    "attack_right": [40, 41, 42, 43],
                    "attack_topRight": [44, 45, 46, 47],
                    "damage_top": [68],
                    "damage_topLeft": [69],
                    "damage_left": [70],
                    "damage_bottomLeft": [71],
                    "damage_bottom": [64],
                    "damage_bottomRight": [65],
                    "damage_right": [66],
                    "damage_topRight": [67],
                    "throw_top": [120],
                    "throw_topLeft": [124],
                    "throw_left": [128],
                    "throw_bottomLeft": [132],
                    "throw_bottom": [104],
                    "throw_bottomRight": [108],
                    "throw_right": [112],
                    "throw_topRight": [116],
                    "magic_top": [88],
                    "magic_topLeft": [92],
                    "magic_left": [96],
                    "magic_bottomLeft": [100],
                    "magic_bottom": [72],
                    "magic_bottomRight": [76],
                    "magic_right": [80],
                    "magic_topRight": [84],
                    "skill": [136, 137, 138, 139, 0],
                    "playDVD": [136],
                    "eat_cake": [144, 145, 146, 147],
                    "eat_cookie": [148, 149, 150, 151],
                    "eat_ice": [152, 153, 154, 155],
                    "die": [142],
                    "sleep": [140, 141, 142],
                    "trap": [64],
                }
            },
            "enemy": {
                "Office": {
                    "Word": {
                        "name": "ワード",
                        status: {
                            "hp": 10,
                            "maxHp": 10,
                            "atk": 10,
                            "def": 0,
                            "replaceSkill": true,
                            "drop": {
                                "frequency": 0.03
                            }
                        },
                        "asset": "character_doc",
                        "frequency": {
                            "walk": [16, 16],
                            "sleep": [1],
                        },
                        "animation": {
                            "walk": [0, 1],
                            "sleep": [0],
                        },
                    },
                    "Excel": {
                        "name": "エクセル",
                        status: {
                            "hp": 20,
                            "maxHp": 10,
                            "atk": 20,
                            "def": 10,
                            "drop": {
                                "frequency": 0.03
                            }
                        },
                        "asset": "character_doc",
                        "frequency": {
                            "walk": [16, 16],
                            "sleep": [1],
                        },
                        "animation": {
                            "walk": [4, 5],
                            "sleep": [0],
                        },
                    },
                    "PowerPoint": {
                        "name": "パワーポイント",
                        status: {
                            "hp": 40,
                            "maxHp": 10,
                            "atk": 30,
                            "def": 15,
                            "drop": {
                                "frequency": 0.03
                            }
                        },
                        "asset": "character_doc",
                        "frequency": {
                            "walk": [16, 16],
                            "sleep": [1],
                        },
                        "animation": {
                            "walk": [8, 9],
                            "sleep": [0],
                        },
                    }
                },
                "Letter": {
                    "Letter": {
                        "name": "封筒",
                        status: {
                            "hp": 50,
                            "maxHp": 20,
                            "atk": 30,
                            "def": 15,
                            "utsuAtk": 5,
                            "ignoreWall": true,
                            "drop": {
                                "frequency": 0.03
                            }
                        },
                        "asset": "character_letter",
                        "frequency": {
                            "walk": [16, 16],
                            "sleep": [1],
                        },
                        "animation": {
                            "walk_top": [2, 3],
                            "walk_topLeft": [2, 3],
                            "walk_left": [0, 1],
                            "walk_bottomLeft": [0, 1],
                            "walk_bottom": [0, 1],
                            "walk_bottomRight": [0, 1],
                            "walk_right": [0, 1],
                            "walk_topRight": [2, 3],
                            "sleep": [0],
                        },
                    },
                    "Mail": {
                        "name": "メール",
                        status: {
                            "hp": 50,
                            "maxHp": 20,
                            "atk": 35,
                            "def": 15,
                            "utsuAtk": 5,
                            "ignoreWall": true,
                            "invisible": true,
                            "drop": {
                                "frequency": 0.03
                            }
                        },
                        "asset": "character_mail",
                        "frequency": {
                            "walk": [16, 16],
                            "sleep": [1],
                        },
                        "animation": {
                            "walk": [0, 1],
                            "sleep": [0],
                        },
                    },
                },
                "Telephone": { // うつに小ダメージ(utsuAtk 10)
                    "Telephone": { // 30％の確率でランダム移動(randomWalk=0.3)
                        "name": "固定電話",
                        status: {
                            "hp": 60,
                            "maxHp": 50,
                            "atk": 40,
                            "def": 20,
                            "utsuAtk": 5,
                            "randomWalk": 0.3,
                            "drop": {
                                "frequency": 0.03
                            }
                        },
                        "asset": "character_telephone",
                        "frequency": {
                            "walk": [16, 16],
                            "sleep": [1],
                        },
                        "animation": {
                            "walk": [0, 1],
                            "sleep": [0],
                        },
                    },
                    "Feature": { // 入れ替わりスキル 発動10％ (skill=replace)
                        "name": "ガラケー",
                        status: {
                            "hp": 60,
                            "maxHp": 50,
                            "atk": 40,
                            "def": 20,
                            "utsuAtk": 5,
                            "skill": {
                                type: "replace",
                                frequency: 0.1,
                            },
                            "drop": {
                                "frequency": 0.03
                            }
                        },
                        "asset": "character_feature",
                        "frequency": {
                            "walk": [16, 16],
                            "sleep": [1],
                        },
                        "animation": {
                            "walk": [0, 1],
                            "sleep": [0],
                        },
                    },
                    "Smartphone": { // ワープスキル 発動10％ (skill=warp)
                        "name": "スマホ",
                        status: {
                            "hp": 60,
                            "maxHp": 50,
                            "atk": 40,
                            "def": 20,
                            "utsuAtk": 5,
                            "skill": {
                                range: "long",
                                type: "warp",
                                frequency: 0.1,
                            },
                            "drop": {
                                "frequency": 0.03
                            },
                        },
                        "asset": "character_smartphone",
                        "frequency": {
                            "walk": [16, 16],
                            "sleep": [1],
                        },
                        "animation": {
                            "walk": [0, 1],
                            "sleep": [0],
                        },
                    },
                },
                "Water": {
                    "Magcup": { // 魔法無効(noMagic) 空腹攻撃(hungryAtk=10)
                        "name": "マグカップ",
                        status: {
                            "hp": 80,
                            "maxHp": 70,
                            "atk": 45,
                            "def": 20,
                            "hungryAtk": 10,
                            "noMagic": true,
                            "drop": {
                                "frequency": 0.03
                            },
                        },
                        "asset": "character_magcup",
                        "frequency": {
                            "walk": [16, 16],
                            "sleep": [1],
                        },
                        "animation": {
                            "walk": [0, 1],
                            "sleep": [0],
                        },
                    },
                    "Pot": { // 魔法無効 空腹攻撃(hungryAtk=10) 食べ物ドロップ
                        "name": "電気ポット",
                        status: {
                            "hp": 80,
                            "maxHp": 70,
                            "atk": 45,
                            "def": 20,
                            "hungryAtk": 10,
                            "noMagic": true,
                            "drop": {
                                "type": "Sweet",
                                "frequency": 0.3
                            },
                        },
                        "asset": "character_pot",
                        "frequency": {
                            "walk": [16, 16],
                            "sleep": [1],
                        },
                        "animation": {
                            "walk_top": [2, 3],
                            "walk_topLeft": [2, 3],
                            "walk_left": [0, 1],
                            "walk_bottomLeft": [0, 1],
                            "walk_bottom": [0, 1],
                            "walk_bottomRight": [0, 1],
                            "walk_right": [0, 1],
                            "walk_topRight": [2, 3],
                            "sleep": [0],
                        },
                    },
                    "Bucket": { // 魔法無効 自爆
                        "name": "バケツ",
                        status: {
                            "hp": 120,
                            "maxHp": 70,
                            "atk": 50,
                            "def": 20,
                            "matk": 100,
                            "hungryAtk": 20,
                            "noMagic": true,
                            "selfBomb": true,
                            "drop": {
                                "frequency": 0.03
                            },
                        },
                        "asset": "character_bucket",
                        "frequency": {
                            "walk": [16, 16],
                            "sleep": [1],
                        },
                        "animation": {
                            "walk": [0, 1],
                            "sleep": [0],
                        },
                    },
                },
                "Human": { // 鬱に大ダメージ(utsuAtk=30) 2回攻撃(multiAttack=2)
                    "Popori": {
                        "name": "ポポリ",
                        status: {
                            "hp": 100,
                            "maxHp": 100,
                            "atk": 40,
                            "def": 25,
                            "utsuAtk": 10,
                            "multiAttack": 2,
                            "skill": {
                                "frequency": 0.1,
                                "type": "seal",
                            },
                            "drop": {
                                "frequency": 0.03
                            },
                            "boss": true,
                        },
                        "asset": "character_popori",
                        "frequency": {
                            "walk": [16, 16],
                            "sleep": [1],
                        },
                        "animation": {
                            "walk_top": [2, 3],
                            "walk_topLeft": [2, 3],
                            "walk_left": [0, 1],
                            "walk_bottomLeft": [0, 1],
                            "walk_bottom": [0, 1],
                            "walk_bottomRight": [0, 1],
                            "walk_right": [0, 1],
                            "walk_topRight": [2, 3],
                            "sleep": [0],
                        },
                    },
                    "Elin": {
                        "name": "エリーン",
                        status: {
                            "hp": 100,
                            "maxHp": 100,
                            "atk": 45,
                            "def": 25,
                            "utsuAtk": 10,
                            "multiAttack": 2,
                            "skill": {
                                "frequency": 0.1,
                                "type": "seal",
                            },
                            "drop": {
                                "frequency": 0.03
                            },
                            "boss": true,
                        },
                        "asset": "character_elin",
                        "frequency": {
                            "walk": [16, 16],
                            "sleep": [1],
                        },
                        "animation": {
                            "walk_top": [2, 3],
                            "walk_topLeft": [2, 3],
                            "walk_left": [0, 1],
                            "walk_bottomLeft": [0, 1],
                            "walk_bottom": [0, 1],
                            "walk_bottomRight": [0, 1],
                            "walk_right": [0, 1],
                            "walk_topRight": [2, 3],
                            "sleep": [0],
                        },
                    },
                },
            }
        },

        "tile": {
            "basic": {
                "floor": [22, 0, 20, 2],
                "tile": {
                    "circle": [0, 1, 20, 21],
                    "row": [2, 2, 22, 22],
                    "cross": [3, 4, 23, 24],
                    "column": [60, 61, 60, 61],
                    "plain": [62, 62, 62, 62]
                },
                "bottom": {
                    "circle": [40, 41],
                    "row": [42, 42],
                    "cross": [43, 44],
                    "column": [60, 61]
                }
            },
            "blue": {
                "floor": [62, 40, 60, 42],
                "tile": {
                    "circle": [0, 1, 20, 21],
                    "row": [2, 2, 22, 22],
                    "cross": [3, 4, 23, 24],
                    "column": [60, 61, 60, 61],
                    "plain": [62, 62, 62, 62]
                },
                "bottom": {
                    "circle": [40, 41],
                    "row": [42, 42],
                    "cross": [43, 44],
                    "column": [60, 61]
                }
            },
            "green": {
                "floor": [102, 80, 100, 82],
                "tile": {
                    "circle": [0, 1, 20, 21],
                    "row": [2, 2, 22, 22],
                    "cross": [3, 4, 23, 24],
                    "column": [60, 61, 60, 61],
                    "plain": [62, 62, 62, 62]
                },
                "bottom": {
                    "circle": [40, 41],
                    "row": [42, 42],
                    "cross": [43, 44],
                    "column": [60, 61]
                }
            },
            "red": {
                "floor": [142, 120, 140, 122],
                "tile": {
                    "circle": [0, 1, 20, 21],
                    "row": [2, 2, 22, 22],
                    "cross": [3, 4, 23, 24],
                    "column": [60, 61, 60, 61],
                    "plain": [62, 62, 62, 62]
                },
                "bottom": {
                    "circle": [40, 41],
                    "row": [42, 42],
                    "cross": [43, 44],
                    "column": [60, 61]
                }
            },
            "black": {
                "floor": [182, 160, 180, 162],
                "tile": {
                    "circle": [0, 1, 20, 21],
                    "row": [2, 2, 22, 22],
                    "cross": [3, 4, 23, 24],
                    "column": [60, 61, 60, 61],
                    "plain": [62, 62, 62, 62]
                },
                "bottom": {
                    "circle": [40, 41],
                    "row": [42, 42],
                    "cross": [43, 44],
                    "column": [60, 61]
                }
            },
            "hole": {
                "floor": [222, 200, 220, 202],
                "tile": {
                    "circle": [0, 1, 20, 21],
                    "row": [2, 2, 22, 22],
                    "cross": [3, 4, 23, 24],
                    "column": [60, 61, 60, 61],
                    "plain": [62, 62, 62, 62]
                },
                "bottom": {
                    "circle": [40, 41],
                    "row": [42, 42],
                    "cross": [43, 44],
                    "column": [60, 61]
                }
            },
        },
        "minimap": {
            "size": 10,
            "top": 340,
            "left": 740,
        },
        "assets": {
            "opening_bg": "img/opening/opening_bg.png",
            "opening_logo": "img/opening/opening_logo.png",
            "opening_black_on": "img/opening/opening_black_on.png",
            "opening_black_off": "img/opening/opening_black_off.png",
            "opening_white_on": "img/opening/opening_white_on.png",
            "opening_white_off": "img/opening/opening_white_off.png",
            "opening_tutorial_on": "img/opening/opening_tutorial_on.png",
            "opening_tutorial_off": "img/opening/opening_tutorial_off.png",
            "ending_bg": "img/ending_bg.png",
            "item": "img/item.png",
            "tutorial": "img/tutorial.png",
            "trap": "img/trap.png",
            "object_stairs": "img/Stairs.png",
            "background": "img/bg.png",
            "zzz": "img/zzz.png",
            "character_shizimily": "img/character/shizimi_big_all.png",
            "character_bucket": "img/character/character_bucket.png",
            "character_doc": "img/character/character_doc.png",
            "character_feature": "img/character/character_feature.png",
            "character_letter": "img/character/character_letter.png",
            "character_magcup": "img/character/character_magcup.png",
            "character_mail": "img/character/character_mail.png",
            "character_pot": "img/character/character_pot.png",
            "character_smartphone": "img/character/character_smartphone.png",
            "character_telephone": "img/character/character_telephone.png",
            "character_elin": "img/character/enemy_elin_walk.png",
            "character_popori": "img/character/enemy_popori_walk.png",
            "shadow": "img/shadow.png",
            "messageWindow": "img/MessageWindow.png",
            "digital": "img/digital.png",
            "note": "img/notebook.png",
            "menuicon_add": "img/menuIcon/add.png",
            "menuicon_alert": "img/menuIcon/alert.png",
            "menuicon_favourites": "img/menuIcon/favourites.png",
            "menuicon_star": "img/menuIcon/star.png",
            "menuicon_basket-full": "img/menuIcon/basket-full.png",
            "menuicon_basket-empty": "img/menuIcon/basket-empty.png",
            "menuicon_right": "img/menuIcon/right.png",
            "menuicon_error": "img/menuIcon/error.png",
            "menuicon_configuration": "img/menuIcon/configuration.png",
            "menuicon_movie": "img/menuIcon/movie.png",
            "menuicon_statistic": "img/menuIcon/statistic.png",
            "menuicon_notepad": "img/menuIcon/notepad.png",
            "menuicon_empty": "img/menuIcon/bin-empty.png",
            "menuicon_search": "img/menuIcon/search.png",
            "menuicon_earth": "img/menuIcon/earth.png",
            "menuicon_hint": "img/menuIcon/hint.png",
            "faceicon_A0": "img/faceIcon/shizimily_faceIcon_A0.png",
            "faceicon_A1": "img/faceIcon/shizimily_faceIcon_A1.png",
            "faceicon_A2": "img/faceIcon/shizimily_faceIcon_A2.png",
            "faceicon_B0": "img/faceIcon/shizimily_faceIcon_B0.png",
            "faceicon_B1": "img/faceIcon/shizimily_faceIcon_B1.png",
            "faceicon_C0": "img/faceIcon/shizimily_faceIcon_C0.png",
            "faceicon_C1": "img/faceIcon/shizimily_faceIcon_C1.png",
            "faceicon_D0": "img/faceIcon/shizimily_faceIcon_D0.png",
            "faceicon_D1": "img/faceIcon/shizimily_faceIcon_D1.png",
            "faceicon_D2": "img/faceIcon/shizimily_faceIcon_D2.png",
            "faceicon_E0": "img/faceIcon/shizimily_faceIcon_E0.png",
            "faceicon_E1": "img/faceIcon/shizimily_faceIcon_E1.png",
            "faceicon_E2": "img/faceIcon/shizimily_faceIcon_E2.png",
            "faceicon_F0": "img/faceIcon/shizimily_faceIcon_F0.png",
            "faceicon_F1": "img/faceIcon/shizimily_faceIcon_F1.png",
            "faceicon_F2": "img/faceIcon/shizimily_faceIcon_F2.png",
            "faceicon_G0": "img/faceIcon/shizimily_faceIcon_G0.png",
            "faceicon_G1": "img/faceIcon/shizimily_faceIcon_G1.png",
            "faceicon_G2": "img/faceIcon/shizimily_faceIcon_G2.png",
            "faceicon_H0": "img/faceIcon/shizimily_faceIcon_H0.png",
            "faceicon_H1": "img/faceIcon/shizimily_faceIcon_H1.png",
            "faceicon_H2": "img/faceIcon/shizimily_faceIcon_H2.png",
            "ball": "img/ball.png",
        },
        "loading_assets": {
            "logo_maker": "img/madaniji.png",
            "bgm_loading": "sound/PCFemale_Voice04_000160_00229633.ogg",
        },
    };
    ns.Setting.screenCenterX = ns.Setting.screenWidth / 2;
    ns.Setting.screenCenterY = ns.Setting.screenHeight / 2;

    ns.Config = {
        volume: {
            effect: ns.Setting.sound.volume.effect,
            bgm: ns.Setting.sound.volume.bgm,
        },
        key: {
            z: "z",
            x: "x",
            c: "c",
            v: "v",
            a: "a",
            s: "s",
            d: "d",
            f: "f",
        },
    };
}(game));