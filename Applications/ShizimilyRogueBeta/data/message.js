var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (View) {
        (function (Data) {
            Data.Message = {};
            Data.Message[0 /* Attack */] = function (action) {
                return action.sender.name + "は攻撃した！";
            };
            Data.Message[3 /* Pick */] = function (action) {
                return action.sender.name + "は" + action.targets[0].name + "を拾った！";
            };
            Data.Message[1 /* Use */] = function (action) {
                var item = action.item;
                switch (item.category) {
                    case 4 /* Sweet */:
                        return action.sender.name + "は" + action.item.name + "をたべた";
                    case 6 /* Case */:
                        return action.sender.name + "は" + action.item.name + "に" + action.targetItems[0].name + "とかを入れた";
                    case 5 /* DVD */:
                        return action.sender.name + "は" + action.item.name + "を再生しようとしたけど寝ちゃいました";
                    case 7 /* SDCard */:
                        return action.sender.name + "は" + action.item.name + "を読み込んだ";
                    case 0 /* CPU */:
                        if (action.sender.weapon == action.item) {
                            return action.sender.name + "は" + action.item.name + "を装備した";
                        } else {
                            return action.sender.name + "は" + action.item.name + "をはずした";
                        }
                    case 1 /* GraphicBoard */:
                        if (action.sender.guard == action.item) {
                            return action.sender.name + "は" + action.item.name + "を装備した";
                        } else {
                            return action.sender.name + "は" + action.item.name + "をはずした";
                        }
                    case 3 /* Memory */:
                    case 2 /* HDD */:
                        return action.sender.name + "はデータをいっぱいDLして寝ちゃいました";
                }
            };

            Data.Message[6 /* Status */] = function (action) {
                var unit = action.targets[0];
                switch (action.subType) {
                    case 0 /* Damage */:
                        return unit.name + "は" + action.param + "のダメージ！";
                    case 1 /* Heal */:
                        return unit.name + "は" + action.param + "回復した";
                    case 6 /* Sleep */:
                        return unit.name + "は寝てしまった";
                    case 3 /* Full */:
                        if (unit.stomach == unit.maxStomach)
                            return unit.name + "はおなかがいっぱいになった";
                        else
                            return unit.name + "はおなかがすこしふくれた";
                }
            };

            Data.Message[5 /* Die */] = function (action) {
                return action.sender.isPlayer() ? action.sender.name + "上司に捕まってしまった…" : action.sender.name + "をやっつけた！";
            };
        })(View.Data || (View.Data = {}));
        var Data = View.Data;
    })(ShizimilyRogue.View || (ShizimilyRogue.View = {}));
    var View = ShizimilyRogue.View;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=message.js.map
