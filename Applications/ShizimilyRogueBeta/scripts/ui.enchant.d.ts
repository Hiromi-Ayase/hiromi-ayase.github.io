/// <reference path="enchant.d.ts"/>

declare module enchant.ui {
    class Pad extends enchant.Sprite {
        constructor();
    }
    class Button extends enchant.Sprite {
        constructor(text: string, theme: string, height: number, width: number);
    }
}

