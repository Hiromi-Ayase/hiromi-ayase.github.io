var game = game || {};

(function (ns) {
    ns.Stage = {
        "black": {
            name: "black",
            displayName: "ぶらっく企業",
            floor: [],
            message: {
                clear :[
                    "しじみりちゃんは帰れました・・・",
                    "満員電車にゆられ、昼間のパッチのことを考えながら・・・",
                    "しじみりちゃん「今日は徹夜でID攻略するぞっ」",
                    "でも、しじみりちゃんは重大なことを忘れていたのです・・・",
                    "それは・・・",
                    "・・・",
                    "まだ今日が月曜日だったっていうこと・・・・",
                    "",
                    "～Fin～",
                ],
                staffRoll: [
                    "しじみりちゃんは帰れませんでした",
                    "",
                    "～制作スタッフ～",
                    "まだ２時",
                    "",
                    "～登場人物～",
                    "ブラック企業勤務のしじみりちゃん",
                    "",
                    "～すぺしゃるさんくす～",
                    "「楽園」のおきゃくさま",
                    "#aminocyclo",
                    "ゆみのひと",
                ]
            }
        },
        "white": {
            name: "white",
            displayName: "ほわいと企業",
            floor: [],
            message: {
                clear :[
                    "しじみりちゃんは帰れました・・・",
                    "満員電車にゆられ、新しいアバターのことを考えながら・・・",
                    "しじみりちゃん「今日はファッションショーかなっ」",
                    "でも、しじみりちゃんはまだ重大なことを知りません・・・",
                    "それは・・・",
                    "・・・",
                    "ガチャの当たり確率が0.001％ということ・・・・",
                    "",
                    "～Fin～",
                ],
                staffRoll: [
                    "しじみりちゃんは帰れませんでした",
                    "",
                    "～制作スタッフ～",
                    "まだ２時",
                    "",
                    "～登場人物～",
                    "ほわいと企業勤務のしじみりちゃん",
                    "",
                    "～すぺしゃるさんくす～",
                    "「楽園」勤務の脳内人格の方々",
                    "#aminocyclo",
                    "ゆみのひと",
                ]
            }
        },
        "tutorial": {
            name: "tutorial",
            displayName: "チュートリアル",
            message: [
                "しじみりちゃんは帰れませんでしたの説明です。",
                "このゲームはいわゆるローグライクゲームというものです。",
                "主人公のしじみりちゃんを操作してゴールをめざしてください。",
                "しじみりちゃんはいつもは「ひーらー」というお仕事しています。",
                "ところが、このお仕事はお金があんまりかせげないので",
                "「ぶらっくきぎょう」というところで仕方なく働いています。",
                "この「ぶらっくきぎょう」は17：30が定時なのですが、",
                "いつも02：00まで働かせられています・・・",
                "でも、今日はTERAの新しいパッチがあたった日。",
                "なので是が非でも帰らなければいけません。",
                "しかもPTが組める02：00までに。",
                "",
                "このゲームではCPUやグラボを装備してしじみりちゃんを強くします。",
                "また、うつゲージを消費して魔法を使うことができます。",
                "うつゲージやHPは左で回ってる魔法陣でわかります。",
                "魔法はグラボの種類によって遠距離攻撃とヒールが使い分けられます。",
                "また、お腹が空いたりHPが減ったりしたらお菓子を食べましょう。",
                "暇つぶしにDVDを見てもいいかもしれません。",
                "性能の悪いパーツは合成してメインのパーツを強化しちゃいましょう。",
                "",
                "キー操作はZが攻撃、Xが魔法、Cが足踏み、Vがメニュー",
                "Aがダッシュ、Sがその場で停止、Dが斜め移動、Fがマップ非表示です。",
                "しじみりちゃんをぜひアルボレアの新パッチで遊ばせてあげましょう。",
            ]
        },
    };
    
    var floor;

    // ブラックステージ
    floor = ns.Stage.black.floor;
    floor[1] = {
        name: "社長室",
        description: [
            "しじみり「こわいエリーンちゃん、いあエリーンさんがいる・・・」"
        ],
        type: "exectiveRoom2",
        bgm: "bossFloor",
        next: "clear",
    };
    floor[2] = {
        name: "上級幹部室",
        description: [
            "しじみり「もっとこわいひとがいっぱい・・・」",
        ],
        type: "exectiveRoom1",
    };
    floor[3] = {
        name: "下級幹部室",
        description: [
            "しじみり「こわいひとがいっぱい・・・」",
        ],
        type: "exectiveRoom1",
    };
    floor[4] = {
        name: "高温多湿ルーム",
        description: [
            "しじみり「不快指数まっくす・・・」",
        ],
        type: "breakRoom3",
    };
    floor[5] = {
        name: "熱湯風呂",
        description: [
            "しじみり「びえーあついよぉ」",
        ],
        type: "breakRoom2",
    };
    floor[6] = {
        name: "給湯室",
        description: [
            "しじみり「こーひー」",
        ],
        type: "breakRoom1",
    };
    floor[7] = {
        name: "ねずみ配信室",
        description: [
            "しじみり「この会社本当に大丈夫なのかな・・・」",
        ],
        type: "computerOffice3",
    };
    floor[8] = {
        name: "アニメ配信室",
        description: [
            "しじみり「いつか通報してやる・・・」",
        ],
        type: "computerOffice3",
    };
    floor[9] = {
        name: "ゲーム配信室",
        description: [
            "しじみり「ここで働きたかったなぁ・・・」",
        ],
        type: "computerOffice2",
    };
    floor[10] = {
        name: "ミャンマー事業部",
        description: [
            "しじみり「だけどあぶらぎっしゅなかれーはちょっと・・・」",
        ],
        type: "computerOffice1",
    };
    floor[11] = {
        name: "インド対応室",
        description: [
            "しじみり「かえったらかれーたべゆ」"
        ],
        type: "remoteOffice2",
    };
    floor[12] = {
        name: "追い出し部屋",
        description: [
            "しじみり「追い出されたほうが実は幸せなのでは・・・」",
        ],
        type: "remoteOffice2",
    };
    floor[13] = {
        name: "白いお部屋",
        description: [
            "しじみり「ここはなんだろう・・・心やすらぐ・・・」",
        ],
        type: "remoteOffice1",
    };
    floor[14] = {
        name: "セクハラ促進部",
        description: [
            "しじみり「びえーえっちな写真がいっぱい・・・」",
        ],
        type: "office3",
    };
    floor[15] = {
        name: "パワハラ促進部",
        description: [
            "しじみり「・・・って強気に言えたらなぁ・・・」",
            "しじみり「おいそこの盾ちょっとくらいすぎだろ」",
        ],
        type: "office3",
    };
    floor[16] = {
        name: "意識の高い部屋",
        description: [
            "しじみり「圧倒的な成長を遂げないと・・・ヒールの速度とか・・・」",
        ],
        type: "office2",
    };
    floor[17] = {
        name: "サビ残推奨室",
        description: [
            "しじみり「先月の残業時間180時間・・・残業代30円・・・」",
        ],
        type: "office2",
    };
    floor[18] = {
        name: "社内ニート養成室",
        description: [
            "しじみり「もう仕事の書類はみたくないよぉ・・・」",
        ],
        type: "office1",
    };
    floor[19] = {
        name: "社畜養成室",
        description: [
            "しじみり「書類がいっぱいあるよぉ・・・」",
        ],
        type: "office1",
    };
    floor[20] = {
        name: "しじみり隔離部屋",
        description: [
            "しじみり「なんとしてでも帰らないと・・・」",
            "しじみり「今日は待ちに待ったパッチの日・・・」",
        ],
        type: "first",
        bgm: "firstFloor",
    };

    // ホワイトステージ
    floor = ns.Stage.white.floor;
    floor[1] = {
        name: "社長室",
        description: [
            "しじみり「こわいひとがいっぱい・・・」"
        ],
        bgm: "bossFloor",
        type: "exectiveRoom2",
    };
    floor[2] = {
        name: "追い出し部屋",
        description: [
            "しじみり「追い出されたほうが実は幸せなのでは・・・」",
        ],
        type: "remoteOffice2",
    };
    floor[3] = {
        name: "白いお部屋",
        description: [
            "しじみり「ここはなんだろう・・・心やすらぐ・・・」",
        ],
        type: "remoteOffice1",
    };
    floor[4] = {
        name: "セクハラ促進部",
        description: [
            "しじみり「びえーえっちな写真がいっぱい・・・」",
        ],
        type: "office3",
    };
    floor[5] = {
        name: "パワハラ促進部",
        description: [
            "しじみり「・・・って強気に言えたらなぁ・・・」",
            "しじみり「おいそこの盾ちょっとくらいすぎだろ」",
        ],
        type: "office3",
    };
    floor[6] = {
        name: "意識の高い部屋",
        description: [
            "しじみり「圧倒的な成長を遂げないと・・・ヒールの速度とか・・・」",
        ],
        type: "office2",
    };
    floor[7] = {
        name: "サビ残推奨室",
        description: [
            "しじみり「先月の残業時間180時間・・・残業代30円・・・」",
        ],
        type: "office2",
    };
    floor[8] = {
        name: "社内ニート養成室",
        description: [
            "しじみり「もう仕事の書類はみたくないよぉ・・・」",
        ],
        type: "office1",
    };
    floor[9] = {
        name: "社畜養成室",
        description: [
            "しじみり「書類がいっぱいあるよぉ・・・」",
        ],
        type: "office1",
    };
    floor[10] = {
        name: "しじみり隔離部屋",
        description: [
            "しじみり「なんとしてでも帰らないと・・・」",
            "しじみり「今日は待ちに待ったパッチの日・・・」",
        ],
        bgm: "firstFloor",
        type: "first",
    };

    ns.DebugStage = {
        name: "debug",
        displayName: "でばっぐ企業",
        floor: [
            {},
            {
                name: "デバッグ部屋",
                description: [
                    "しじみり「今日は待ちに待ったデバッグの日・・・」",
                    "しじみり「えっ、じゃあ帰れない！？」",
                ],
                type: "debug"
            }
        ],
        message: {
            clear :[
                "でばっぐだよー",
                "ねこ「にくよこせにゃー」",
                "",
                "～Fin～",
            ],
            staffRoll: [
                "しじみりちゃんは帰れませんでした",
                "",
                "～制作スタッフ～",
                "まだ２時",
                "",
                "～登場人物～",
                "ブラック企業勤務のしじみりちゃん",
                "",
                "～すぺしゃるさんくす～",
                "「楽園」のおきゃくさま",
                "#aminocyclo",
                "ゆみのひと",
            ]
        }
    };
}(game));
