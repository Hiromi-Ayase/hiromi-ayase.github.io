var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (Common) {
        var Debug = (function () {
            function Debug() {
            }
            Debug.result = function (action) {
                var targetList = "";
                var from = action.lastAction != null ? (" from " + action.lastAction.id) : "";
                action.targets.forEach(function (target) {
                    return targetList += Debug.obj(target) + " ";
                });

                var message = "[" + action.id + from + "] " + Debug.obj(action.sender) + Debug.action(action) + "to:" + targetList + "";
                Debug.message(message);
            };

            Debug.obj = function (object) {
                if (object == null) {
                    return "(null)";
                } else {
                    var turn = object.isUnit() ? (" turn:" + object.turn) : "";
                    var coord = object.cell != null ? (" Coord:[" + object.cell.coord.x + ", " + object.cell.coord.y + "]") : "";
                    return object.name + "(id:" + object.id + turn + " dir:" + Debug.DirString[object.dir] + coord + ") ";
                }
            };

            Debug.action = function (action) {
                var items = " items:[";
                if (action.targetItems != null) {
                    action.targetItems.forEach(function (item) {
                        return items += Debug.obj(item);
                    });
                    items += "]";
                } else {
                    items = "";
                }
                return Debug.ActionString[action.type] + "(sub:" + action.subType + " param:" + action.param + " end:" + action.end + items + ") ";
            };

            Debug.message = function (m) {
                if (Common.DEBUG) {
                    if (Debug.textarea == null) {
                        Debug.textarea = document.getElementById("debug");
                        Debug.textarea.value = "";
                    }
                    Debug.textarea.value = m + "\n" + Debug.textarea.value;
                }
            };
            Debug.clear = function () {
                Debug.textarea.value = "";
            };
            Debug.DirString = ["UP", "UP_RIGHT", "RIGHT", "DOWN_RIGHT", "DOWN", "DOWN_LEFT", "LEFT", "UP_LEFT"];
            Debug.ActionString = ["Attack", "Use", "Throw", "Pick", "Place", "Die", "Status", "Fly", "Move", "Delete", "Swap", "Drop", "Set", "Fail", "None"];

            Debug.textarea = null;
            return Debug;
        })();
        Common.Debug = Debug;
    })(ShizimilyRogue.Common || (ShizimilyRogue.Common = {}));
    var Common = ShizimilyRogue.Common;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=debug.js.map
