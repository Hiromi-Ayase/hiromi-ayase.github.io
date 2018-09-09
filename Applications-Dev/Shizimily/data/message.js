var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (View) {
        (function (Data) {
            Data.Message = {};
            Data.Message[1 /* Attack */] = function () {
                return "{object.name}は攻撃した！";
            };
            Data.Message[6 /* Damage */] = function () {
                return "{object.name}は{action.params[0]}のダメージ！";
            };
            Data.Message[4 /* Pick */] = function () {
                return "{object.name}は{action.objects[0].name}を拾った！";
            };
            Data.Message[2 /* Use */] = function () {
                return "{object.name}をたべた";
            };
            Data.Message[7 /* Heal */] = function () {
                return "{object.name}は{action.params[0]}回復した";
            };

            Data.Message[5 /* Die */] = function (result) {
                return result.object.id == ShizimilyRogue.Common.PLAYER_ID ? "{object.name}は上司に捕まってしまった…" : "{object.name}をやっつけた！";
            };
        })(View.Data || (View.Data = {}));
        var Data = View.Data;
    })(ShizimilyRogue.View || (ShizimilyRogue.View = {}));
    var View = ShizimilyRogue.View;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=message.js.map
