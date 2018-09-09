﻿module ShizimilyRogue.View {

    export enum InputMode {
        Game, Menu
    }

    export class Button {
        /** キーDown経過フレームカウンタ */
        count = 0;
        /** 最後にキーDownイベントが発行されたフレームNo. */
        lastInputFrame = 0;
        /** キー入力フラグ（KeyUp/Downイベントで切り替え） */
        inputFlag = false;

        constructor(public code: number, public name: string) {}
    }

    export class Input {
        
        static BtnA = new Button('Z'.charCodeAt(0), "a");
        static BtnB = new Button('X'.charCodeAt(0), "b");
        static BtnX = new Button('C'.charCodeAt(0), "x");
        static BtnY = new Button('V'.charCodeAt(0), "y");

        static BtnUp        = new Button(104, "up");        // Num 8
        static BtnUpRight   = new Button(105, "upright");   // Num 9
        static BtnRight     = new Button(102, "right");     // Num 6
        static BtnDownRight = new Button(99, "downright");  // Num 3
        static BtnDown      = new Button(98, "down");       // Num 2
        static BtnDownLeft  = new Button(97, "downleft");   // Num 1
        static BtnLeft      = new Button(100, "left");      // Num 4
        static BtnUpLeft    = new Button(103, "upleft");    // Num 7

        static AddConsole(g: enchant.Group) {
            if (Common.VIRTUAL_CONSOLE) {
                var pad = new enchant.ui.Pad();
                pad.y = 350;
                pad.x = 50;
                pad.scale(1.5, 1.5);
                g.addChild(pad);

                var buttonA = new enchant.ui.Button("A", "dark", 20, 20);
                buttonA.y = 400;
                buttonA.x = 470;
                buttonA.height = 40;
                buttonA.opacity = 0.5;
                g.addChild(buttonA);

                var buttonB = new enchant.ui.Button("B", "dark", 20, 20);
                buttonB.y = 400;
                buttonB.x = 540;
                buttonB.height = 40;
                buttonB.opacity = 0.5;
                g.addChild(buttonB);

                var buttonX = new enchant.ui.Button("X", "dark", 20, 20);
                buttonX.y = 350;
                buttonX.x = 470;
                buttonX.height = 40;
                buttonX.opacity = 0.5;
                g.addChild(buttonX);

                var buttonY = new enchant.ui.Button("Y", "dark", 20, 20);
                buttonY.y = 350;
                buttonY.x = 540;
                buttonY.height = 40;
                buttonY.opacity = 0.5;
                g.addChild(buttonY);
            }
        }

        static buttons: Button[] = [
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
            Input.BtnUpLeft,
        ];

        // 移動キー入力のバッファ時間
        private static keyBufferFrame: number = 3;

        public static mode: InputMode = InputMode.Game;

        static init(): void {
            Input.buttons.forEach((btn) => {
                Scene.game.keybind(btn.code, btn.name);

                Scene.game.addEventListener(btn.name + "buttondown", (e) => {
                    btn.inputFlag = true;
                    btn.lastInputFrame = Scene.game.frame;
                });

                Scene.game.addEventListener(btn.name + "buttonup", (e) => {
                    btn.inputFlag = false;
                });
            });
        }

        static update(): void {
            var currentFrame : number = Scene.game.frame;
            Input.buttons.forEach((btn) => {
                if (btn.inputFlag) {
                    if (Common.DEBUG == true && currentFrame - btn.lastInputFrame > 50) {
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
        }

        /* シーン切り替え時、フロア移動時にも呼ぶこと */
        static resetKeys(): void {
            Input.buttons.forEach((btn) => {
                btn.inputFlag = false;
                btn.count = 0;
            });
        }

        static get keyDirection(): number {
            if (Input.BtnUpLeft.count > 0)
                return Common.DIR.UP_LEFT;
            else if (Input.BtnUpRight.count > 0)
                return Common.DIR.UP_RIGHT;
            else if (Input.BtnDownLeft.count > 0)
                return Common.DIR.DOWN_LEFT;
            else if (Input.BtnDownRight.count > 0)
                return Common.DIR.DOWN_RIGHT;

            else if (Input.BtnUp.count && Input.BtnLeft.count)
                return Common.DIR.UP_LEFT;
            else if (Input.BtnUp.count && Input.BtnRight.count)
                return Common.DIR.UP_RIGHT;
            else if (Input.BtnDown.count && Input.BtnLeft.count)
                return Common.DIR.DOWN_LEFT;
            else if (Input.BtnDown.count && Input.BtnRight.count)
                return Common.DIR.DOWN_RIGHT;

            else if (Input.BtnUp.count > Input.keyBufferFrame)
                return Common.DIR.UP;
            else if (Input.BtnDown.count > Input.keyBufferFrame)
                return Common.DIR.DOWN;
            else if (Input.BtnLeft.count > Input.keyBufferFrame)
                return Common.DIR.LEFT;
            else if (Input.BtnRight.count > Input.keyBufferFrame)
                return Common.DIR.RIGHT;

            else null;
        }
    }
}