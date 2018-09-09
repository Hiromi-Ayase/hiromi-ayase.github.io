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

                var titleBackground = new enchant.Sprite(GameOverScene.CONTENT_WIDTH, GameOverScene.CONTENT_HEIGHT);
                var surface = new enchant.Surface(GameOverScene.CONTENT_WIDTH, GameOverScene.CONTENT_HEIGHT);
                titleBackground.image = surface;
                titleBackground.opacity = 0.7;
                titleBackground.x = (View.VIEW_WIDTH - GameOverScene.CONTENT_WIDTH) / 2;
                titleBackground.y = GameOverScene.CONTENT_TOP;

                surface.context.fillStyle = "black";
                surface.context.fillRect(0, 0, GameOverScene.CONTENT_WIDTH, GameOverScene.CONTENT_HEIGHT);

                var img = new enchant.Sprite(View.VIEW_WIDTH, View.VIEW_HEIGHT);
                img.image = View.Scene.ASSETS.TITLE.DATA;

                var content = new enchant.Label();
                content.text = "明日がんばる！(Aボタン)";
                content.color = "white";
                content.textAlign = "center";
                content.width = GameOverScene.CONTENT_WIDTH;
                content.font = "26px cursive";
                content.y = GameOverScene.CONTENT_TOP + (titleBackground.height - 20) / 2;
                content.x = titleBackground.x;

                var title = new enchant.Label();
                title.text = "ゲームオーバー！<br/><br/>帰れませんでした・・・";
                title.color = "white";
                title.textAlign = "center";
                title.width = View.VIEW_WIDTH;
                title.font = "56px cursive";
                title.y = 50;
                title.x = 0;

                var titleShadow = new enchant.Label();
                titleShadow.text = title.text;
                titleShadow.color = "black";
                titleShadow.textAlign = "center";
                titleShadow.width = View.VIEW_WIDTH;
                titleShadow.font = "56px cursive";
                titleShadow.y = title.y + 4;
                titleShadow.x = 4;

                this.addChild(img);
                this.addChild(titleBackground);
                this.addChild(content);
                this.addChild(titleShadow);
                this.addChild(title);

                var buttonA = new enchant.ui.Button("A", "dark", 20, 20);
                buttonA.y = 330;
                buttonA.x = 440;
                buttonA.height = 40;
                buttonA.opacity = 0.7;
                this.addChild(buttonA);
                buttonA.on("touchstart", function (e) {
                    ShizimilyRogue.Common.VIRTUAL_CONSOLE = true;
                });
            }
            GameOverScene.CONTENT_WIDTH = 400;
            GameOverScene.CONTENT_HEIGHT = 100;
            GameOverScene.CONTENT_TOP = 300;
            return GameOverScene;
        })(View.Scene);
        View.GameOverScene = GameOverScene;
    })(ShizimilyRogue.View || (ShizimilyRogue.View = {}));
    var View = ShizimilyRogue.View;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=gameOverScene.js.map
