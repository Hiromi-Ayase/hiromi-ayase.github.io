var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (View) {
        var ClearScene = (function (_super) {
            __extends(ClearScene, _super);
            function ClearScene() {
                _super.call(this);

                var titleBackground = new enchant.Sprite(ClearScene.CONTENT_WIDTH, ClearScene.CONTENT_HEIGHT);
                var surface = new enchant.Surface(ClearScene.CONTENT_WIDTH, ClearScene.CONTENT_HEIGHT);
                titleBackground.image = surface;
                titleBackground.opacity = 0.7;
                titleBackground.x = (View.VIEW_WIDTH - ClearScene.CONTENT_WIDTH) / 2;
                titleBackground.y = ClearScene.CONTENT_TOP;

                surface.context.fillStyle = "black";
                surface.context.fillRect(0, 0, ClearScene.CONTENT_WIDTH, ClearScene.CONTENT_HEIGHT);

                var img = new enchant.Sprite(View.VIEW_WIDTH, View.VIEW_HEIGHT);
                img.image = View.Scene.ASSETS.TITLE.DATA;

                var content = new enchant.Label();
                content.text = "タイトル画面へ！(Aボタン)";
                content.color = "white";
                content.textAlign = "center";
                content.width = ClearScene.CONTENT_WIDTH;
                content.font = "26px cursive";
                content.y = ClearScene.CONTENT_TOP + (titleBackground.height - 20) / 2;
                content.x = titleBackground.x;

                var title = new enchant.Label();
                title.text = "しじみりちゃんは<br/><br/>帰れました！";
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
            ClearScene.CONTENT_WIDTH = 400;
            ClearScene.CONTENT_HEIGHT = 100;
            ClearScene.CONTENT_TOP = 300;
            return ClearScene;
        })(View.Scene);
        View.ClearScene = ClearScene;
    })(ShizimilyRogue.View || (ShizimilyRogue.View = {}));
    var View = ShizimilyRogue.View;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=clearScene.js.map
