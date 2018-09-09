/*global ROT, tm*/
var game = game || {};

(function (ns) {
    ns.Message = {};
    ns.Message.damage = "{character}は{target}に{amount}のダメージを与えた！";
    ns.Message.damageWithUtsu = "{character}は{target}に{amount}のダメージを与えた上にいじめた！";
    ns.Message.damageWithHungry = "{character}は{target}に{amount}のダメージを与えた上に飯テロをした！";
    ns.Message.noMagic = "{target}は魔法がきかない！";
    ns.Message.die = function (param) {
        if (param.character.name === "shizimily") {
            return "しじみりちゃんは深夜残業につかまってしまった...";
        } else {
            return "{character}をたおした！";
        }
    };
    ns.Message.shizimilyDie = "{character}は深夜残業につかまってしまった…";
    ns.Message.use = "{character}は{target}を使った";
    ns.Message.selfBomb = "{character}は自爆した！";
    ns.Message.pick = "{item}を拾った";
    ns.Message.lost = "{item}はどこかにきえてしまった...";
    ns.Message.unpick = "{item} はこれ以上持てない";
    ns.Message.notThrow = "なげるものがないよ";
    ns.Message.notStairs = "ここは階段じゃないよ";
    ns.Message.skill = "ヒール！{amount}回復した";
    ns.Message.utsu = "うつで魔法が使えない...";
    ns.Message.healUtsu = function (param) {
        if (param.character.name === "shizimily") {
            return "{target}をもぐもぐ。うつが{utsu}回復したよ";
        } else {
            return "{character}に{target}を食べられた";
        }
    };
    ns.Message.heal = function (param) {
        if (param.character.name === "shizimily") {
            return "{target}をもぐもぐ。HPが{hp}回復したよ";
        } else {
            return "{character}に{target}を食べられた";
        }
    };
    ns.Message.healBoth = "{character}は{target}を食べてHPが{hp}、うつから{utsu}回復した";
    ns.Message.eat = function (param) {
        if (param.character.name === "shizimily") {
            return "{target}もぐもぐ。";
        } else {
            return "{character}に{target}を食べられた";
        }
    };
    ns.Message.equip = "{target}を装備した";
    ns.Message.unequip = "{target}をはずした";
    ns.Message.noVGA = "ぐらぼを装備してないよ";
    ns.Message.trap = "{character}は{target}を踏んだ！";
    ns.Message.trapOff = "{target}の上にのったけど何もおきなかった";
    ns.Message.trapBreak = "{target}はこわれちゃった";
    ns.Message.hungry = "{character}はおなかがすいてほとんどうごけない・・・";
    ns.Message.noItem = "なにもないよ？";
    ns.Message.playDVD = "{character}は{dvd}を再生した";
    ns.Message.noAction = "でも特に何もおきなかった...";
    ns.Message.hit = "{character}に{item}があたった";
    ns.Message.sleep = "{character}はおねんねしちゃった";
    ns.Message.sleeping = function (param) {
        if (param.character.name === "shizimily") {
            return "ぐーぐー";
        } else {
            return "none";
        }
    };
    ns.Message.getStorage = function (param) {
        if (param.amount < 1) {
            return "{item}をひろった。かばんがちょっとふえたよ";
        } else {
            return "{item}をひろった。かばんが{amount}ふえたよ";
        }
    };
    ns.Message.put = "{item}をおいた";
    ns.Message.start = "{stage}";
    ns.Message.notEquipped = "{type}を装備してないよ？";
    ns.Message.reinforce = "{before}を強化して{after}になった";
    ns.Message.seal = "{character}は封印された！";
    ns.Message.sealed = "魔法は封印されて使えない...";
    ns.Message.sealSkill = "{character}は封印魔法を使った！";
    ns.Message.replaceSkill = "{character}は位置替え魔法を使った！";
    ns.Message.warpSkill = "{character}はワープ魔法を使った！";
    ns.Message.timeover = "しじみり「まだ2時・・・まだ2時・・・」";
    ns.Message.pickStair = "しじみり「かいだんひろうの・・・？」";
    ns.Message.dieBoss = "つよいの倒した！でもあのひと昨日のPTにいたような・・・";
    ns.Message.attackFailed = "{character}の攻撃ははずれちゃった";
    ns.Message.news = function () {
        var list = [
            "「しじみりちゃんのライバルが+12＜熔嘩凱帝の僧杖＞強化に成功しました。」",
            "「しじみりちゃんの残業代が暗黒の時空間にすいこまれました。」",
            "「しじみりちゃんが100時間かけて作った書類にコーヒーがかかりました。」",
            "「しじみりちゃんのPTメンバーが+4で強化をあきらめました。」",
            "「しじみりちゃん以外のPTが寝てしまいました。」",
            "「しじみりちゃんのプリンがねこにたべられました。」",
        ];
        return list.random();
    };
    ns.Message.newsRep = function () {
        var list = [
            "しじみり「びえー」",
            "しじみり「ぶえー」",
            "しじみり「ひ」",
        ];
        return list.random();
    };
    ns.Message.reinforced = "{item}はもう強化できないよ";
    ns.Message.reinforceFailed = "ごうせいにしっぱいしちゃった・・・";
    ns.Message.reinforceMax = "しじみりちゃんが+12＜{item}＞強化に成功しました。";
}(game));