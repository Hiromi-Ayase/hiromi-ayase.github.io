var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (Model) {
        (function (Data) {
            var Item = (function () {
                function Item(category, name, num) {
                    if (typeof num === "undefined") { num = 1; }
                    this.category = category;
                    this.name = name;
                    this.num = num;
                    this.type = 1 /* Item */;
                    this.commands = [
                        2 /* Use */,
                        3 /* Throw */
                    ];
                }
                Item.prototype.use = function (action) {
                    return null;
                };
                return Item;
            })();
            Data.Item = Item;

            var Sweet = (function (_super) {
                __extends(Sweet, _super);
                function Sweet() {
                    _super.call(this, 0 /* Food */, "スイーツ");
                }
                Sweet.prototype.use = function (action) {
                    var action = ShizimilyRogue.Common.Action.Heal(100);
                    return action;
                };
                return Sweet;
            })(Item);
            Data.Sweet = Sweet;
        })(Model.Data || (Model.Data = {}));
        var Data = Model.Data;
    })(ShizimilyRogue.Model || (ShizimilyRogue.Model = {}));
    var Model = ShizimilyRogue.Model;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=items.js.map
