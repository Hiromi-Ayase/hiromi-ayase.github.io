var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (View) {
        var TitleScene = (function (_super) {
            __extends(TitleScene, _super);
            function TitleScene() {
                _super.call(this);
                var title = new enchant.Sprite(View.VIEW_WIDTH, View.VIEW_HEIGHT);
                title.image = View.Scene.IMAGE.TITLE.DATA;
                var label = new enchant.Label();
                label.text = "Aボタンを押してね";
                this.addChild(title);
                this.addChild(label);
            }
            return TitleScene;
        })(View.Scene);
        View.TitleScene = TitleScene;
    })(ShizimilyRogue.View || (ShizimilyRogue.View = {}));
    var View = ShizimilyRogue.View;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=titleScene.js.map
