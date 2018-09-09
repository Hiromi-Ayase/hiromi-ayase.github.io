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

                var titleBackground = new enchant.Sprite(TitleScene.CONTENT_WIDTH, TitleScene.CONTENT_HEIGHT);
                var surface = new enchant.Surface(TitleScene.CONTENT_WIDTH, TitleScene.CONTENT_HEIGHT);
                titleBackground.image = surface;
                titleBackground.opacity = 0.7;
                titleBackground.x = (View.VIEW_WIDTH - TitleScene.CONTENT_WIDTH) / 2;
                titleBackground.y = TitleScene.CONTENT_TOP;

                surface.context.fillStyle = "black";
                surface.context.fillRect(0, 0, TitleScene.CONTENT_WIDTH, TitleScene.CONTENT_HEIGHT);

                var img = new enchant.Sprite(View.VIEW_WIDTH, View.VIEW_HEIGHT);
                img.image = View.Scene.ASSETS.TITLE.DATA;

                var content = new enchant.Label();
                content.text = "Aボタンを押してね";
                content.color = "white";
                content.textAlign = "center";
                content.width = TitleScene.CONTENT_WIDTH;
                content.font = "26px cursive";
                content.y = TitleScene.CONTENT_TOP + (titleBackground.height - 20) / 2;
                content.x = titleBackground.x;

                var title = new enchant.Sprite(View.Scene.ASSETS.LOGO.DATA.width, View.Scene.ASSETS.LOGO.DATA.height);
                title.image = View.Scene.ASSETS.LOGO.DATA;
                title.x = 30;
                title.y = 30;

                this.addChild(img);
                this.addChild(titleBackground);
                this.addChild(content);
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
            TitleScene.CONTENT_WIDTH = 400;
            TitleScene.CONTENT_HEIGHT = 100;
            TitleScene.CONTENT_TOP = 300;
            return TitleScene;
        })(View.Scene);
        View.TitleScene = TitleScene;
    })(ShizimilyRogue.View || (ShizimilyRogue.View = {}));
    var View = ShizimilyRogue.View;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=titleScene.js.map
