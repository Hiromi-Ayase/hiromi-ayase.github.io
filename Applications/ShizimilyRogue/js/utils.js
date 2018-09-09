/*global ROT, tm*/
var game = game || {};

(function (ns) {
    ns.Util = {};

    // Tile constants
    ns.BLOCK = {
        WALL: 0,
        PATH: 1,
        ROOM: 2
    };

    ns.ACTION = {
        "MOVE": "move",
        "SKILL": "skill",
        "ATTACK": "attack",
        "THROW": "throw",
        "USE": "use",
        "PICK": "pick",
        "PUT": "put",
        "REINFORCE": "reinforce",
        "SELFBOMB": "selfbomb",
        "NONE": "none",
    };

    ns.STATE = {
        "SLEEP": "sleep",
        "SEAL": "seal",
    };

    /**
     * Auto Tile Data
     * @param   {Object} tile   Tile data
     * @param   {Object} bottom Bottom tile data
     * @returns {Object} Auto tile data
     */
    ns.Util.AutoTileData = function (tile, bottom) {
        var data = {
            /**
             * 隣接しているマップから、どのタイルを選択するのかを決定する情報をパターンにしておく
             *
             * パターンを決定する条件
             *  0: タイルが存在しないこと
             *  1:　タイルが存在すること
             *  2: どちらでもよい
             */
            MAP_PATTERN: [
                /**
                 * 0 に使用するタイルを決定するパターン
                 */
                [
                    {
                        pattern: [
                            [1, 1, 2],
                            [1, 1, 2],
                            [2, 2, 2]
                        ],
                        tile: tile.plain[0]
                    }, {
                        pattern: [
                            [0, 1, 2],
                            [1, 1, 2],
                            [2, 2, 2]
                        ],
                        tile: tile.cross[0]
                    }, {
                        pattern: [
                            [2, 1, 2],
                            [0, 1, 2],
                            [2, 2, 2]
                        ],
                        tile: tile.column[0]
                    }, {
                        pattern: [
                            [2, 0, 2],
                            [1, 1, 2],
                            [2, 2, 2]
                        ],
                        tile: tile.row[0]
                    }, {
                        pattern: [
                            [2, 0, 2],
                            [0, 1, 2],
                            [2, 2, 2]
                        ],
                        tile: tile.circle[0]
                    }
                ],

                /**
                 * 1 に使用するタイルを決定するパターン
                 */
                [
                    {
                        pattern: [
                            [2, 1, 1],
                            [2, 1, 1],
                            [2, 2, 2]
                        ],
                        tile: tile.plain[1]
                    }, {
                        pattern: [
                            [2, 1, 0],
                            [2, 1, 1],
                            [2, 2, 2]
                        ],
                        tile: tile.cross[1]
                    }, {
                        pattern: [
                            [2, 1, 2],
                            [2, 1, 0],
                            [2, 2, 2]
                        ],
                        tile: tile.column[1]
                    }, {
                        pattern: [
                            [2, 0, 2],
                            [2, 1, 1],
                            [2, 2, 2]
                        ],
                        tile: tile.row[1]
                    }, {
                        pattern: [
                            [2, 0, 2],
                            [2, 1, 0],
                            [2, 2, 2]
                        ],
                        tile: tile.circle[1]
                    }
                ],

                /**
                 * 2 に使用するタイルを決定するパターン
                 */
                [
                    {
                        pattern: [
                            [2, 2, 2],
                            [1, 1, 2],
                            [1, 1, 2]
                        ],
                        tile: tile.plain[2]
                    }, {
                        pattern: [
                            [2, 2, 2],
                            [1, 1, 2],
                            [0, 1, 2]
                        ],
                        tile: tile.cross[2],
                    }, {
                        pattern: [
                            [2, 2, 2],
                            [0, 1, 2],
                            [2, 1, 2]
                        ],
                        tile: tile.column[2],
                    }, {
                        pattern: [
                            [2, 2, 2],
                            [1, 1, 2],
                            [2, 0, 2]
                        ],
                        tile: tile.row[2],
                    }, {
                        pattern: [
                            [2, 2, 2],
                            [0, 1, 2],
                            [2, 0, 2]
                        ],
                        tile: tile.circle[2],
                    }
                ],

                /**
                 * 3 に使用するタイルを決定するパターン
                 */
                [
                    {
                        pattern: [
                            [2, 2, 2],
                            [2, 1, 1],
                            [2, 1, 1]
                        ],
                        tile: tile.plain[3]
                    }, {
                        pattern: [
                            [2, 2, 2],
                            [2, 1, 1],
                            [2, 1, 0]
                        ],
                        tile: tile.cross[3],
                    }, {
                        pattern: [
                            [2, 2, 2],
                            [2, 1, 0],
                            [2, 1, 2]
                        ],
                        tile: tile.column[3],
                    }, {
                        pattern: [
                            [2, 2, 2],
                            [2, 1, 1],
                            [2, 0, 2]
                        ],
                        tile: tile.row[3],
                    }, {
                        pattern: [
                            [2, 2, 2],
                            [2, 1, 0],
                            [2, 0, 2]
                        ],
                        tile: tile.circle[3],
                    }
                ]
            ],
            dir: [
                {
                    "x": -1,
                    "y": -1
                },
                {
                    "x": 0,
                    "y": -1
                },
                {
                    "x": 1,
                    "y": -1
                },
                {
                    "x": -1,
                    "y": 0
                },
                {
                    "x": 0,
                    "y": 0
                },
                {
                    "x": 1,
                    "y": 0
                },
                {
                    "x": -1,
                    "y": 1
                },
                {
                    "x": 0,
                    "y": 1
                },
                {
                    "x": 1,
                    "y": 1
                }
            ],
            newLocation: [
                {
                    "x": 0,
                    "y": 0
                },
                {
                    "x": 1,
                    "y": 0
                },
                {
                    "x": 0,
                    "y": 1
                },
                {
                    "x": 1,
                    "y": 1
                }
            ]
        };

        if (bottom) {
            data.MAP_PATTERN[2][1].bottom = bottom.cross[0];
            data.MAP_PATTERN[2][2].bottom = bottom.column[0];
            data.MAP_PATTERN[2][3].bottom = bottom.row[0];
            data.MAP_PATTERN[2][4].bottom = bottom.circle[0];
            data.MAP_PATTERN[3][1].bottom = bottom.cross[1];
            data.MAP_PATTERN[3][2].bottom = bottom.column[1];
            data.MAP_PATTERN[3][3].bottom = bottom.row[1];
            data.MAP_PATTERN[3][4].bottom = bottom.circle[1];
        }
        return data;
    };

    /**
     * Auto tile generator
     * @param   {Object} TILE_PATTERN Tile Pattern
     * @param   {Array}  map          Map object
     * @param   {Number} width        Width
     * @param   {Number} height       Height
     * @returns {Array}  [Layer1, Layer2]
     */
    ns.Util.Autotile = function (TILE_PATTERN, map, width, height) {
        'use strict';
        var newMap = [];
        var newMap2 = [];
        var x, y, i, j, k;

        var data = ns.Util.AutoTileData(TILE_PATTERN.tile, TILE_PATTERN.bottom);
        for (y = 0; y < height; y += 1) {
            for (x = 0; x < width; x += 1) {
                for (i = 0; i < data.MAP_PATTERN.length; i += 1) {
                    // newMapの場所 0, 1, 2, 3のパターン選択
                    var mp = data.MAP_PATTERN[i];
                    for (j = 0; j < mp.length; j += 1) {
                        // plain, cross, column, row, circleで各判定
                        var flg = true;
                        for (k = 0; k < data.dir.length; k += 1) {
                            var d = data.dir[k];
                            var ptn = mp[j].pattern[d.y + 1][d.x + 1];
                            if (ptn !== 2) {
                                var newY = y + d.y;
                                var newX = x + d.x;
                                var block;
                                if (newX >= width || newX < 0 || newY >= height || newY < 0) {
                                    block = 1;
                                } else {
                                    block = map[newY * width + newX];
                                }
                                if (block !== 0 && ptn !== 0 || block === 0 && ptn === 0) {
                                    flg = false;
                                    break;
                                }
                            }
                        }

                        if (flg) {
                            var loc = data.newLocation[i];
                            var index = (y * 2 + loc.y) * width * 2 + (x * 2 + loc.x);
                            if (mp[j].bottom !== undefined) {
                                newMap2[index + width * 2] = mp[j].bottom;
                            }
                            newMap[index] = mp[j].tile;
                            break;
                        }
                    }
                }
            }
        }

        var floor = [];
        for (x = 0; x < width * 2; x += 1) {
            for (y = 0; y < height * 2; y += 1) {
                if (x === 0 || y === 0 || x === width * 2 - 1 || y === height * 2 - 1) {
                    floor[x + y * width * 2] = 7;
                } else {
                    var line = TILE_PATTERN.floor[(y + x - x % 2) % 4];
                    floor[x + y * width * 2] = x % 2 === 0 ? (line + 8) : (line + 9);
                }
            }
        }

        return {
            floor: [{
                data: floor
            }], 
            map: [{
                data: newMap2
            }, {
                data: newMap
            }],
            world: [{
                data: floor
            }, {
                data: newMap2
            }, {
                data: newMap
            }],
        };
    };

    /**
     * Create the map.
     * @param   {Number} width  Width
     * @param   {Number} height Height
     * @returns {Object} Map data
     */
    ns.Util.CreateMap = function (tile, width, height, type) {
        var creator = new ROT.Map[type](width, height);
        var ret = {
            width: width,
            height: height,
            blocks: [],
            freeCells: [],
            freeRooms: [],
            sheetData: {},
            room: [],
        };
        var blocks = [];
        var rotMap = creator.create(function (x, y, value) {
            value = value ? ns.BLOCK.WALL : ns.BLOCK.PATH;
            blocks[x + y * width] = value;

            if (ret.blocks[x] === undefined) {
                ret.blocks[x] = [];
                ret.room[x] = [];
            }
            ret.blocks[x][y] = value;
            if (value !== ns.BLOCK.WALL) {
                ret.freeCells.push(ns.Coord(x, y));
            }
        });
        if (rotMap.getRooms !== undefined) {
            rotMap.getRooms().forEach(function (room) {
                room.fov = [];
                var x, y;
                for (x = room.getLeft(); x <= room.getRight(); x++) {
                    for (y = room.getTop(); y <= room.getBottom(); y++) {
                        ret.blocks[x][y] = ns.BLOCK.ROOM;
                        ret.room[x][y] = room;
                        var coord = ns.Coord(x, y);
                        ret.freeRooms.push(coord);
                        room.fov.push(coord.hash);
                    }
                }
                for (x = room.getLeft() - 1; x <= room.getRight() + 1; x++) {
                    room.fov.push(ns.Coord(x, room.getTop() - 1).hash);
                    room.fov.push(ns.Coord(x, room.getBottom() + 1).hash);
                }
                for (y = room.getTop() - 1; y <= room.getBottom() + 1; y++) {
                    room.fov.push(ns.Coord(room.getLeft() - 1, y).hash);
                    room.fov.push(ns.Coord(room.getRight() + 1, y).hash);
                }
            });
        }

        var autotileLayer = ns.Util.Autotile(ns.Setting.tile[tile], blocks, width, height);

        //TEST map sheet & map sprite
        var autoTileSize = ns.Setting.tileSize / 2;
        ret.sheetData = {
            world: {
                tilewidth: autoTileSize,
                tileheight: autoTileSize,
                width: width * 2,
                height: height * 2,
                tilesets: [
                    {
                        image: "background"
                    }
                ],
                layers: autotileLayer.world
            },
            map: {
                tilewidth: autoTileSize,
                tileheight: autoTileSize,
                width: width * 2,
                height: height * 2,
                tilesets: [
                    {
                        image: "background"
                    }
                ],
                layers: autotileLayer.map
            },
            floor: {
                tilewidth: autoTileSize,
                tileheight: autoTileSize,
                width: width * 2,
                height: height * 2,
                tilesets: [
                    {
                        image: "background"
                    }
                ],
                layers: autotileLayer.floor
            }
        };
        return ret;
    };

    /**
     * 座標
     */
    ns.Coord = tm.define("game.Coord", {
        init: function (x, y) {
            this.x = x;
            this.y = y;
            this.hash = x + "," + y;
        },
        add: function (a, b) {
            if (b === undefined) {
                b = a.y;
                a = a.x;
            }
            return ns.Coord(this.x + a, this.y + b);
        },
        minus: function (coord) {
            return ns.Coord(this.x - coord.x, this.y - coord.y);
        },
        proceed: function (dir, num) {
            num = num || 1;
            var coord = dir.coord();
            return ns.Coord(this.x + coord.x * num, this.y + coord.y * num);
        },
        back: function (dir, num) {
            num = num || 1;
            var coord = dir.coord();
            return ns.Coord(this.x - coord.x * num, this.y - coord.y * num);
        },
        isNeighbor: function (coord) {
            return !this.equals(coord) && Math.abs(this.x - coord.x) <= 1 && Math.abs(this.y - coord.y) <= 1;
        },
        equals: function (coord) {
            return this.x === coord.x && this.y === coord.y;
        },
        calcDist: function (coord, dir, max) {
            max = max || 1;
            var c = this;
            for (var i = 1; i <= max; i++) {
                c = c.proceed(dir);
                if (c.equals(coord)) {
                    return i;
                }
            }
            return Number.MAX_VALUE;
        },
        dist: function (coord) {
            return Math.max(Math.abs(coord.x - this.x), Math.abs(coord.y - this.y));
        },
        dir: function (coord) {
            var x = coord.x - this.x;
            var y = coord.y - this.y;
            return ns.Coord2Dir(x, y);
        }
    });

    ns.Hash2Coord = function (hash) {
        var index = hash.indexOf(",");
        var x = Number(hash.substring(0, index));
        var y = Number(hash.substring(index + 1));
        return ns.Coord(x, y);
    };

    // DIRを名前に変換
    ns.Dir2Name = ["right", "topRight", "top", "topLeft", "left", "bottomLeft", "bottom", "bottomRight"];

    // DIRを座標に変換
    ns.Dir2Coord = [ns.Coord(1, 0), ns.Coord(1, -1), ns.Coord(0, -1), ns.Coord(-1, -1), ns.Coord(-1, 0), ns.Coord(-1, 1), ns.Coord(0, 1), ns.Coord(1, 1)];
    ns.Coord2Pos = function (coord, type) {
        var adjust = type === ns.Setting.object.type.character ? ns.Setting.character.adjust : ns.Setting.object.adjust;
        return {
            x: coord.x * ns.Setting.tileSize + adjust.x,
            y: coord.y * ns.Setting.tileSize + adjust.y,
        };
    };
    ns.SetPos = function (target, coord) {
        if (target && coord) {
            var pos = ns.Coord2Pos(coord, target.objectType);
            target.setPosition(pos.x, pos.y);
            target.coord = coord;
        }
    };

    // アイテムが落ちる優先順位
    ns.Util.PutPriority = [
        ns.Coord(0, 0), ns.Coord(1, 0), ns.Coord(0, 1), ns.Coord(-1, 0), ns.Coord(0, -1), ns.Coord(1, 1), ns.Coord(-1, 1), ns.Coord(-1, -1), ns.Coord(1, -1),
        ns.Coord(2, 0), ns.Coord(0, 2), ns.Coord(-2, 0), ns.Coord(0, -2), ns.Coord(2, 1), ns.Coord(1, 2), ns.Coord(-2, 1), ns.Coord(1, -2), ns.Coord(-1, 2), ns.Coord(2, -1), ns.Coord(-1, -2), ns.Coord(-2, -1),
        ns.Coord(2, 2), ns.Coord(2, -2), ns.Coord(-2, 2), ns.Coord(-2, -2)

    ];

    ns.Coord2Dir = function (x, y) {
        x = x !== 0 ? x / Math.abs(x) : 0;
        y = y !== 0 ? y / Math.abs(y) : 0;
        var index = [
            [3, 2, 1],
            [4, 1, 0],
            [5, 6, 7],
        ];
        var i = index[y + 1][x + 1];
        return ns.Dirs[index[y + 1][x + 1]];
    };

    // Direction.
    ns.Dir = tm.define("game.Dir", {
        init: function (dir) {
            this.value = dir;
        },
        name: function () {
            return ns.Dir2Name[this.value];
        },
        coord: function () {
            return ns.Dir2Coord[this.value];
        },
        add: function (r) {
            return ns.Dirs[(this.value + 8 + r) % 8];
        },
        isDiagonal: function () {
            return this.value % 2 === 1;
        },
    });
    ns.Dirs = [ns.Dir(0), ns.Dir(1), ns.Dir(2), ns.Dir(3), ns.Dir(4), ns.Dir(5), ns.Dir(6), ns.Dir(7)];
    ns.DirPriorityInRoom = [0, 1, -1, 2, -2];
    ns.DirPriorityInPath = [2, 0, -2, 4];

    /**
     * Action
     */
    ns.Action = tm.define("game.Action", {
        init: function (character, type, dir, target) {
            this.type = type;
            this.character = character;
            this.dir = dir;
            this.target = target;
        },
    });

    // Character's view
    ns.View = tm.define("game.View", {
        init: function (width, height, coord, list, objects, blocks, doors, addObject, getFreeCell, ignoreWall) {
            this.list = list;
            this.objects = objects;
            this.blocks = blocks;
            this.coord = coord;
            this.inRoom = blocks[coord.x][coord.y] === ns.BLOCK.ROOM;
            this.doors = doors;
            this.addObject = addObject;
            this.getFreeCell = getFreeCell;
            this.ignoreWall = ignoreWall;
        },
        /**
         * Is wall?
         * @param   {Object}  coord Coordinate
         * @returns {Boolean} True: yes
         */
        isWall: function (coord) {
            if (this.ignoreWall) {
                return coord.x === 0 || coord.x === this.width - 1 || coord.y === 0 || coord.y === this.height - 1;
            }
            return this.blocks[coord.x][coord.y] === ns.BLOCK.WALL;
        },
        /**
         * Is movable?
         * @returns {Boolean} True:movable
         */
        isMovable: function (dir) {
            var c = dir.coord();
            var coord = this.coord;
            var isEmpty = this.isEmpty(coord.proceed(dir));
            isEmpty = isEmpty && !this.isWall(coord.add(0, c.y));
            isEmpty = isEmpty && !this.isWall(coord.add(c.x, 0));
            return isEmpty;
        },
        /**
         * Is attackable?
         * @param   {Object}  coord Coordinate
         * @returns {Boolean} True: Yes
         */
        isAttackable: function (coord) {
            if (!coord.isNeighbor(this.coord)) {
                return false;
            }
            var dir = this.coord.dir(coord);
            var c = dir.coord();
            var isAttackable = true;
            isAttackable = isAttackable && !this.isWall(this.coord.add(0, c.y));
            isAttackable = isAttackable && !this.isWall(this.coord.add(c.x, 0));
            return isAttackable;
        },
        /**
         * Is the cell empty?
         * @param   {Object}  coord Coordinate
         * @returns {Boolean} True:empty
         */
        isEmpty: function (coord, type) {
            type = type || ns.Setting.object.type.character;
            if (this.isWall(coord)) {
                return false;
            }
            var layer = ns.Setting.object.layer[type];
            for (var i = 0; i < this.objects.length; i++) {
                var objType = this.objects[i].objectType;
                var objLayer = ns.Setting.object.layer[objType];
                if (objLayer === layer && this.objects[i].coord.equals(coord)) {
                    return false;
                }
            }
            return true;
        },
        /**
         * 部屋の中で障害物を考慮した方向を取得
         * @param   {Object} coord Destination
         * @returns {Object} direction
         */
        getTargetDir: function (coord) {
            var dir = this.coord.dir(coord);

            for (var i = 0; i < ns.DirPriorityInRoom.length; i++) {
                var d = dir.add(ns.DirPriorityInRoom[i]);
                if (this.isMovable(d)) {
                    return d;
                }
            }
            return null;
        },
        /**
         * 通路の中での優先順位の方向を取得
         * @param   {Object} dir Direction
         * @returns {Object} Direction
         */
        getPathDir: function (dir) {
            for (var i = 0; i < ns.DirPriorityInPath.length; i++) {
                var d = dir.add(ns.DirPriorityInPath[i]);
                if (this.isMovable(d)) {
                    return d;
                }
            }
            return dir;
        },
        /**
         * ランダムな方向を取得
         */
        getRandomDir: function () {
            var list = [];
            for (var i = 0; i < 8; i++) {
                if (this.isMovable(ns.Dirs[i])) {
                    list.push(ns.Dirs[i]);
                }
            }
            return list.random();
        },
        /**
         * 視界の中に階段があれば取得
         */
        getStairs: function () {
            return this.getViewObject("stairs");
        },
        /**
         * 視界の中にしじみりちゃんがいれば取得
         */
        getShizimily: function () {
            return this.getViewObject("shizimily");
        },
        /**
         * ゲーム内にある指定の名前のオブジェクトを取得
         * @param   {String}  name 名前
         * @param   {Boolean} view True:見えるもののみ
         * @returns {Object}  GameObject
         */
        getViewObject: function (name, view) {
            var list;
            if (view === undefined) {
                view = true;
            }
            if (view) { 
                list = this.getViewObjects();
            } else {
                list = this.objects;
            }
            var target = null;
            list.forEach(function (obj) {
                if (obj.name === name) {
                    target = obj;
                }
            });
            return target;
        },
        /**
         * 視界内のオブジェクトをすべて取得
         * @returns {[[Type]]} [[Description]]
         */
        getViewObjects: function () {
            var list = [];
            this.objects.forEach(function (obj) {
                if (this.list[obj.coord.hash]) {
                    list.push(obj);
                }
            }, this);
            return list;
        },
        countObjects: function (type) {
            type = type || ns.Setting.object.type.character;
            var count = 0;
            this.objects.forEach(function (obj) {
                if (obj.objectType === type) {
                    count ++;
                }
            }, this);
            return count;
        },
        /**
         * 視界外のマスを取得
         * @returns {[[Type]]} [[Description]]
         */
        getOtherRoomCell: function () {
            return this.getFreeCell(ns.BLOCK.ROOM, this.list);
        },
        /**
         * 自分を除く視界内のゲームキャラクタを全て取得
         * @returns {Array} ゲームオブジェクト
         */
        getCharacters: function () {
            var list = [];
            this.getViewObjects().forEach(function (obj) {
                if (obj.objectType === ns.Setting.object.type.character && !obj.coord.equals(this.coord)) {
                    list.push(obj);
                }
            }, this);
            return list;
        },
        /**
         * 自分の方向の前にいるキャラを取得
         * @returns {Object} キャラクタ
         */
        getForwardCharacter: function (dir, max) {
            max = max || 1;
            var coord = this.coord;
            var ret = null;
            var minDist = 0;

            var c = coord;
            for (var i = 1; i <= max; i++) {
                c = c.proceed(dir);
                if (!this.isWall(c)) {
                    minDist = i;
                } else {
                    ret = ns.BLOCK.WALL;
                    break;
                }
            }
            this.getCharacters().forEach(function (chara) {
                var dist = coord.calcDist(chara.coord, dir, max);
                if (minDist >= dist) {
                    ret = chara;
                    minDist = dist;
                }
            }, this);
            return ret;
        },
        /**
         * 距離len以内のブロックを全て取得
         * @param   {Number} len                Length
         * @param   {Object} [coord=this.coord] 開始位置
         * @param   {Object} [visited={}]       除外
         * @returns {Object} Coordのハッシュをキーとするハッシュ
         */
        getNearBlocks: function (len, coord, visited) {
            coord = coord || this.coord;
            visited = visited || {};

            if (len >= 0 && !this.isWall(coord)) {
                visited[coord.hash] = true;
                for (var i = 0; i < 8; i++) {
                    this.getNearBlocks(len - 1, coord.proceed(ns.Dirs[i]), visited);
                }
            }
            return visited;
        },

        /**
         * 物をおいた時の座標を取得
         * @param   {[[Type]]} [coord=this.coord] [[Description]]
         * @returns {[[Type]]} [[Description]]
         */
        getPut: function (coord, type) {

            coord = coord || this.coord;
            type = type || ns.Setting.object.type.item;
            var put = null;
            var movable = this.getNearBlocks(2, coord);
            ns.Util.PutPriority.forEach(function (p) {
                var c = coord.add(p);
                if (!put && movable[c.hash] && this.isEmpty(c, type)) {
                    put = c;
                }
            }, this);
            return put;
        },
        /**
         * 投げた時の情報を取得
         * @param   {Object} dir      Direction
         * @param   {Number} [max=10] 最大距離
         * @returns {Object} 投擲情報
         */
        getThrow: function (dir, max) {
            max = max || 10;
            var character = this.getForwardCharacter(dir, max);
            var coord;
            var hit = null;
            var wall = false;
            if (character === ns.BLOCK.WALL) {
                coord = this.getEdge(dir);
                wall = true;
            } else if (character) {
                coord = character.coord;
                hit = character;
            } else {
                coord = this.coord.proceed(dir, max);
            }
            var put = this.getPut(coord);
            return ns.ThrowInfo(coord, wall, hit, put);
        },
        /**
         * Get the edge coordinate.
         * @param   {Object} dir Direction
         * @returns {Object} Coordinate
         */
        getEdge: function (dir) {
            var c = this.coord;
            var ret = c;
            while (true) {
                c = c.proceed(dir);
                if (this.isWall(c)) {
                    break;
                } else {
                    ret = c;
                }
            }
            return ret;
        },
        /**
         * 隣接するキャラクタを全て取得
         * @returns {Array} キャラクタリスト
         */
        getNeighborCharacters: function () {
            var coord = this.coord;
            var list = [];
            this.getCharacters().forEach(function (chara) {
                if (coord.isNeightbor(chara.coord)) {
                    list.push(chara);
                }
            }, this);
            return list;
        },
        /**
         * 視界内のゲームアイテムを全て取得
         * @returns {Array} アイテムオブジェクト
         */
        getItems: function () {
            var list = [];
            this.objects.forEach(function (obj) {
                if (obj.objectType === ns.Setting.object.type.item) {
                    list.push(obj);
                }
            }, this);
            return list;
        },
        /**
         * 真下のゲームアイテムを取得
         * @returns {Object} アイテムオブジェクト
         */
        getItem: function (coord) {
            coord = coord || this.coord;
            var item = null;
            this.objects.forEach(function (obj) {
                if (obj.objectType === ns.Setting.object.type.item && obj.coord.equals(coord)) {
                    item = obj;
                }
            }, this);
            return item;
        },
        /**
         * 真下のゲームアイテムを取得
         * @returns {Object} アイテムオブジェクト
         */
        getTrap: function (coord) {
            coord = coord || this.coord;
            var trap = null;
            this.objects.forEach(function (obj) {
                if (obj.objectType === ns.Setting.object.type.trap && obj.coord.equals(coord)) {
                    trap = obj;
                }
            }, this);
            return trap;
        },
        /**
         * 真下のオブジェクトを取得
         * @returns {Object} アイテムオブジェクト
         */
        getFloorObject: function (coord) {
            coord = coord || this.coord;
            var floorObj = null;
            this.objects.forEach(function (obj) {
                var layer = ns.Setting.object.layer[obj.objectType];
                if (layer === 0 && obj.coord.equals(coord)) {
                    floorObj = obj;
                }
            }, this);
            return floorObj;
        },
        /**
         * 真下が階段かどうか
         * @returns {Boolean} 階段かどうか
         */
        isStairs: function () {
            var flg = false;
            this.objects.forEach(function (obj) {
                if (obj.objectType === ns.Setting.object.type.stairs && obj.coord.equals(this.coord)) {
                    flg = true;
                }
            }, this);
            return flg;
        },
    });

    /**
     * アイテムを投げた際の情報
     * @param {Object}  coord アイテムが到達した座標
     * @param {Boolean} wall  壁にあたったかどうか
     * @param {Object}  hit   あたったキャラ
     * @param {Object}  put   床に落ちた場合の座標
     */
    ns.ThrowInfo = tm.define("game.ThrowInfo", {
        init: function (coord, wall, hit, put) {
            this.coord = coord;
            this.hit = hit;
            this.wall = wall;
            this.put = put;
        }
    });


    /**
     * ダメージ計算式
     * @param   {Number} atk 攻撃力
     * @param   {Number} def 防御力
     * @param   {Number} hp  HP
     * @returns {Number} ダメージ量
     */
    ns.Damage = function (atk, def, hp) {
        var r = Math.random() * 0.25 + 0.875;
        var value = atk * r - def;
        if (value < 0.5) {
            value = 1;
        } else {
            value = Math.floor(value + 0.5);
        }
        value = Math.min(hp, value);
        return value;
    };

    /**
     * キーボード入力を受け付ける
     * @param   {Object}   app  [[Description]]
     * @returns {Object}   [[Description]]
     */
    ns.Util.KeyInput = function (app) {
        var press = function (n) {
                n = n || 1;
                ns.Util.KeyInputLast = app.frame + ns.Setting.keyInterval * n * (ns.Speed / ns.Setting.object.speed);
        };

        var zKey = app.keyboard.getKey(ns.Config.key.z);
        var xKey = app.keyboard.getKey(ns.Config.key.x);
        var cKey = app.keyboard.getKey(ns.Config.key.c);
        var vKey = app.keyboard.getKey(ns.Config.key.v);
        var aKey = app.keyboard.getKey(ns.Config.key.a);
        var sKey = app.keyboard.getKey(ns.Config.key.s);
        var dKey = app.keyboard.getKey(ns.Config.key.d);
        var fKey = app.keyboard.getKey(ns.Config.key.f);
        var angle = app.keyboard.getKeyAngle();
        
        var abs;
        if (app.keyboard.getKey("z")) {
            abs = "z";
        } else if (app.keyboard.getKey("x")) {
            abs = "x";
        } else if (app.keyboard.getKey("c")) {
            abs = "c";
        } else if (app.keyboard.getKey("v")) {
            abs = "v";
        } else if (app.keyboard.getKey("a")) {
            abs = "a";
        } else if (app.keyboard.getKey("s")) {
            abs = "s";
        } else if (app.keyboard.getKey("d")) {
            abs = "d";
        } else if (app.keyboard.getKey("f")) {
            abs = "f";
        }

        // 10キー対応
        var tenKey = [null, 225, 270, 315, 180, null, 0, 135, 90, 45];
        for (var i = 1; i <= 9; i++) {
            if (app.keyboard.getKey(96 + i)) {
                angle = tenKey[i];
            }
        }

        if (!abs && angle === null) {
            ns.Util.KeyInputLast = 0;
        }
        if (ns.Util.KeyInputLast > app.frame) {
            return {
                press: press,
            };
        }

        // バーチャルパッド対応
        if (ns.Controller) {
            if (ns.Controller.pad.isTouching) {
                angle = 360 - ns.Controller.pad.angle;
            }
            zKey = zKey || ns.Controller.zKey;
            xKey = xKey || ns.Controller.xKey;
            cKey = cKey || ns.Controller.cKey;
            vKey = vKey || ns.Controller.vKey;
        }

        var dir;
        if (angle !== null) {
            dir = Math.floor(((angle + 22.5) % 360) / 45);
        } else {
            dir = -1;
        }
        
        return {
            abs: abs,
            z: zKey,
            x: xKey,
            c: cKey,
            v: vKey,
            a: aKey,
            s: sKey,
            d: dKey,
            f: fKey,
            dir: dir,
            press: press,
        };
    };
    
    /**
     * ゆらぎを入れた数を取得
     * @param   {Number} num   Base number
     * @param   {Number} ratio Fluctuations ratio
     * @returns {Number} modified number
     */
    ns.Util.addFluctuation = function (num, ratio) {
        ratio = ratio || ns.Setting.fluctuation;
        var fluc = Math.random() * num * ratio * 2;
        return Math.floor(fluc + num * (1 - ratio));
    };
    
    // クラスジェネレータ情報
    ns.Util.classGenInfo = {
        item: {
            superClass: "game.item.Item",
            package: "game.item",
        },
        enemy: {
            superClass: "game.character.Enemy",
            package: "game.character",
        },
        trap: {
            superClass: "game.trap.Trap",
            package: "game.trap",
        },
    };
    
    /**
     * クラスジェネレータ
     * @param   {Object} output     Output instance
     * @param   {Object} data       Class data
     * @param   {String} type       Class Type
     * @param   {Object} param      Class parameter
     * @returns {Object} Classes
     */
    ns.Util.classGenerator = function (output, objectType, data, param, type) {
        var superClass = ns.Util.classGenInfo[objectType].superClass;
        var package = ns.Util.classGenInfo[objectType].package;

        var init;
        if (type !== undefined) {
            data = data[type];
        }
        var classInfo = function (name, info) {
            var ret = {
                superClass: superClass,
                init: function (coord) {
                    this.superInit(name, coord, type);
                }
            };
            for (var key in param) {
                ret[key] = param[key];
            }
            return ret;
        };
        for (var key in data) {
            output[key] = tm.define(package + "." + key, classInfo(key));
        }
    };
    
    /**
     * 歩数を時間に
     * @param   {Number} turn ターン数
     * @returns {String} 時刻
     */
    ns.Util.turn2date = function (turn) {
        var date = 17 * 60 * 60 + 30 * 60;
        date += turn * 10;
        var hour = Math.floor(date / 3600);
        var min = Math.floor((date - hour * 3600) / 60);
        var sec = date % 60;
        if (hour >= 24) {
            hour -= 24;
        }
        if (hour < 10) {
            hour = "0" + hour;
        }
        if (min < 10) {
            min = "0" + min;
        }
        if (sec < 10) {
            sec = "0" + sec;
        }
        return "" + hour + min + sec;
    };
    
    ns.Util.createFrames = function (keyFrames, frequencies) {
        if (!frequencies) {
            return keyFrames;
        }
        var list = [];
        for (var i = 0; i < keyFrames.length; i ++) {
            for (var k = 0; k < frequencies[i]; k ++) {
                list.push(keyFrames[i]);
            }
        }
        return list;
    };
    
    ns.Util.randomBool = function (threshold) {
        if (!threshold) {
            return false;
        }
        var rand = Math.random();
        if (rand < threshold) {
            return true;
        } else {
            return false;
        }
    };
    
    ns.Util.getFace = function (maxUtsu, utsu) {
        var utsuRatio = utsu / maxUtsu;

        var utsuIndex;
        if (utsuRatio > 0.75) {
            utsuIndex = 0;
        } else if (utsuRatio > 0.5) { 
            utsuIndex = 1;
        } else if (utsuRatio > 0.25) { 
            utsuIndex = 2;
        } else {
            utsuIndex = 3;
        }

        return ns.Setting.face.table[utsuIndex];
    };

}(game));