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
            var Ignore = (function (_super) {
                __extends(Ignore, _super);
                function Ignore() {
                    _super.call(this, "いぐー");
                    this.category = 1;
                }
                return Ignore;
            })(Model.Enemy);
            Data.Ignore = Ignore;
        })(Model.Data || (Model.Data = {}));
        var Data = Model.Data;
    })(ShizimilyRogue.Model || (ShizimilyRogue.Model = {}));
    var Model = ShizimilyRogue.Model;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=units.js.map
