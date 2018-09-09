var ShizimilyRogue;
(function (ShizimilyRogue) {
    (function (View) {
        var Button = (function () {
            function Button(code, name) {
                this.code = code;
                this.name = name;
                /** キーDown経過フレームカウンタ */
                this.count = 0;
                /** 最後にキーDownイベントが発行されたフレームNo. */
                this.lastInputFrame = 0;
                /** キー入力フラグ（KeyUp/Downイベントで切り替え） */
                this.inputFlag = false;
            }
            return Button;
        })();
        View.Button = Button;

        var Input = (function () {
            function Input() {
            }
            Input.init = function () {
                Input.buttons.forEach(function (btn) {
                    View.Scene.game.keybind(btn.code, btn.name);

                    View.Scene.game.addEventListener(btn.name + "buttondown", function (e) {
                        btn.inputFlag = !View.Scene.keyLock && true;
                        btn.lastInputFrame = View.Scene.game.frame;
                    });

                    View.Scene.game.addEventListener(btn.name + "buttonup", function (e) {
                        btn.inputFlag = false;
                    });
                });
            };

            Input.update = function () {
                var currentFrame = View.Scene.game.frame;
                Input.buttons.forEach(function (btn) {
                    if (btn.inputFlag) {
                        if (currentFrame - btn.lastInputFrame > 20) {
                            btn.inputFlag = false;
                        } else {
                            btn.count++;
                        }
                    } else {
                        btn.count = 0;
                    }
                });
                /*for (var i = 0; i < Input.buttons.length; i++) {
                var btn = Input.buttons[i];
                if (btn.count != 0) {
                var message: string = "";
                Input.buttons.forEach((b) => {
                message += b.count + ":"
                });
                Common.Debug.message(message);
                break;
                }
                }*/
            };

            /* シーン切り替え時、フロア移動時にも呼ぶこと */
            Input.resetKeys = function () {
                Input.buttons.forEach(function (btn) {
                    btn.inputFlag = false;
                    btn.count = 0;
                });
            };

            Object.defineProperty(Input, "keyDirection", {
                get: function () {
                    if (Input.BtnUpLeft.count > 0)
                        return 7 /* UP_LEFT */;
                    else if (Input.BtnUpRight.count > 0)
                        return 1 /* UP_RIGHT */;
                    else if (Input.BtnDownLeft.count > 0)
                        return 5 /* DOWN_LEFT */;
                    else if (Input.BtnDownRight.count > 0)
                        return 3 /* DOWN_RIGHT */;
                    else if (Input.BtnUp.count && Input.BtnLeft.count)
                        return 7 /* UP_LEFT */;
                    else if (Input.BtnUp.count && Input.BtnRight.count)
                        return 1 /* UP_RIGHT */;
                    else if (Input.BtnDown.count && Input.BtnLeft.count)
                        return 5 /* DOWN_LEFT */;
                    else if (Input.BtnDown.count && Input.BtnRight.count)
                        return 3 /* DOWN_RIGHT */;
                    else if (Input.BtnUp.count > Input.keyBufferFrame)
                        return 0 /* UP */;
                    else if (Input.BtnDown.count > Input.keyBufferFrame)
                        return 4 /* DOWN */;
                    else if (Input.BtnLeft.count > Input.keyBufferFrame)
                        return 6 /* LEFT */;
                    else if (Input.BtnRight.count > Input.keyBufferFrame)
                        return 2 /* RIGHT */;
                    else
                        null;
                },
                enumerable: true,
                configurable: true
            });
            Input.BtnA = new Button('Z'.charCodeAt(0), "a");
            Input.BtnB = new Button('X'.charCodeAt(0), "b");
            Input.BtnX = new Button('C'.charCodeAt(0), "x");
            Input.BtnY = new Button('V'.charCodeAt(0), "y");

            Input.BtnUp = new Button(104, "up");
            Input.BtnUpRight = new Button(105, "upright");
            Input.BtnRight = new Button(102, "right");
            Input.BtnDownRight = new Button(99, "downright");
            Input.BtnDown = new Button(98, "down");
            Input.BtnDownLeft = new Button(97, "downleft");
            Input.BtnLeft = new Button(100, "left");
            Input.BtnUpLeft = new Button(103, "upleft");

            Input.buttons = [
                Input.BtnA,
                Input.BtnB,
                Input.BtnX,
                Input.BtnY,
                Input.BtnUp,
                Input.BtnUpRight,
                Input.BtnRight,
                Input.BtnDownRight,
                Input.BtnDown,
                Input.BtnDownLeft,
                Input.BtnLeft,
                Input.BtnUpLeft
            ];

            Input.keyBufferFrame = 3;
            return Input;
        })();
        View.Input = Input;
    })(ShizimilyRogue.View || (ShizimilyRogue.View = {}));
    var View = ShizimilyRogue.View;
})(ShizimilyRogue || (ShizimilyRogue = {}));
//# sourceMappingURL=input.js.map
