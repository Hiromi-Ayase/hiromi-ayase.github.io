var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (View) {
        var GameOverScene = (function (_super) {
            __extends(GameOverScene, _super);
            function GameOverScene() {
                _super.call(this);
                var title = new enchant.Sprite(View.VIEW_WIDTH, View.VIEW_HEIGHT);
                title.image = View.Scene.ASSETS.TITLE.DATA;
                var label = new enchant.Label();
                label.text = "げーむおーばー！ Aボタンを押してね";
                this.addChild(title);
                this.addChild(label);
            }
            return GameOverScene;
        })(View.Scene);
        View.GameOverScene = GameOverScene;
    })(ShizimilyRogue.View || (ShizimilyRogue.View = {}));
    var View = ShizimilyRogue.View;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=gameOverScene.js.map
