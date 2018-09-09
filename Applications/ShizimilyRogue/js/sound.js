/*global ROT, tm*/
var game = game || {};

// サウンドデータ
(function (ns) {

    ns.Sound = ns.Sound || {};

    ns.Sound.Data = {
        "shizimily_attack": [
            "PCFemale_Voice04_000001_0002BE90.ogg",
            "PCFemale_Voice04_000002_0002DB1A.ogg",
            "PCFemale_Voice04_000003_0002F657.ogg",
            "PCFemale_Voice04_000004_00031197.ogg",
            "PCFemale_Voice04_000005_00032DA6.ogg",
            "PCFemale_Voice04_000006_00034867.ogg",
            "PCFemale_Voice04_000007_00036ACA.ogg",
            "PCFemale_Voice04_000008_00038CBD.ogg",
            "PCFemale_Voice04_000009_0003B01A.ogg",
            "PCFemale_Voice04_000010_0003D1BD.ogg",
            "PCFemale_Voice04_000011_0003F3E9.ogg",
            "PCFemale_Voice04_000012_00041686.ogg",
            "PCFemale_Voice04_000013_00042F13.ogg",
            "PCFemale_Voice04_000014_0004470B.ogg",
            "PCFemale_Voice04_000015_00045FDE.ogg",
            "PCFemale_Voice04_000016_000478E2.ogg",
        ],
        "Elin_attack": [
            "PCFemale_Voice04_000001_0002BE90.ogg",
            "PCFemale_Voice04_000002_0002DB1A.ogg",
            "PCFemale_Voice04_000003_0002F657.ogg",
            "PCFemale_Voice04_000004_00031197.ogg",
            "PCFemale_Voice04_000005_00032DA6.ogg",
            "PCFemale_Voice04_000006_00034867.ogg",
            "PCFemale_Voice04_000007_00036ACA.ogg",
            "PCFemale_Voice04_000008_00038CBD.ogg",
            "PCFemale_Voice04_000009_0003B01A.ogg",
            "PCFemale_Voice04_000010_0003D1BD.ogg",
            "PCFemale_Voice04_000011_0003F3E9.ogg",
            "PCFemale_Voice04_000012_00041686.ogg",
            "PCFemale_Voice04_000013_00042F13.ogg",
            "PCFemale_Voice04_000014_0004470B.ogg",
            "PCFemale_Voice04_000015_00045FDE.ogg",
            "PCFemale_Voice04_000016_000478E2.ogg",
        ],
        "Popori_attack": [
            "PoporiM_Young_000019_00073CE9.ogg",
            "PoporiM_Young_000024_000895BE.ogg",
            "PoporiM_Young_000020_00075C07.ogg",
            "PoporiM_Young_000030_000ABD60.ogg",
            "PoporiM_Young_000031_000AFFC0.ogg",
            "PoporiM_Young_000032_000B39D0.ogg",
            "PoporiM_Young_000033_000B6F4E.ogg",
            "PoporiM_Young_000034_000BB6A3.ogg",
            "PoporiM_Young_000035_000BF288.ogg",
            "PoporiM_Young_000036_000C42F7.ogg",
        ],
        "shizimily_damage": [
            "PCFemale_Voice04_000017_00049229.ogg",
            "PCFemale_Voice04_000018_0004B78A.ogg",
            "PCFemale_Voice04_000019_0004D986.ogg",
            "PCFemale_Voice04_000020_0004FFB4.ogg",
            "PCFemale_Voice04_000021_00051E44.ogg",
            "PCFemale_Voice04_000022_00053E3E.ogg",
            "PCFemale_Voice04_000023_00055882.ogg",
            "PCFemale_Voice04_000024_00057107.ogg",
            "PCFemale_Voice04_000025_00058933.ogg",
            "PCFemale_Voice04_000026_0005A22C.ogg",
            "PCFemale_Voice04_000027_0005BABB.ogg",
            "PCFemale_Voice04_000028_0005DE58.ogg",
            "PCFemale_Voice04_000029_000602F2.ogg",
        ],
        "shizimily_die": [
            "PCFemale_Voice04_000030_000623F3.ogg",
            "PCFemale_Voice04_000031_00065287.ogg",
            "PCFemale_Voice04_000032_000679CA.ogg",
            "PCFemale_Voice04_000033_0006AFB8.ogg",
        ],
        "shizimily_magic": [
            "PC_Skill_000379_009638D3.ogg",
        ],
        "shizimily_skill": [
            "PC_Skill_000357_008EF5FE.ogg",
        ],
        "shizimily_shame": "PCFemale_Voice04_000117_0015128A.ogg",
        "shizimily_yay": "PCFemale_Voice04_000170_0026FAFE.ogg",
        "shizimily_reinforce": "PCFemale_Voice04_000170_0026FAFE.ogg",
        "attack": [
            "ModuleSound_000048_0010EFE1.ogg",
            "ModuleSound_000049_0011148D.ogg",
            "ModuleSound_000050_0011339A.ogg",
            "ModuleSound_000051_0011526E.ogg",
            "ModuleSound_000052_00117539.ogg",
        ],

        "damage": [
            "ModuleSound_000341_00419E2D.ogg",
            "ModuleSound_000342_0041BD90.ogg",
            "ModuleSound_000343_0041DCBD.ogg",
            "ModuleSound_000344_0042008A.ogg",
            "ModuleSound_000345_0042269A.ogg",
            "ModuleSound_000346_00424954.ogg",
            "ModuleSound_000347_00426EAB.ogg",
            "ModuleSound_000348_004290FC.ogg",
        ],

        "pick": "InterfaceSound_000167_00358A7D.ogg",
        "equip": "InterfaceSound_000121_002762D3.ogg",
        "eat_cake": "InterfaceSound_000110_00258205.ogg",
        "eat_ice": "InterfaceSound_000110_00258205.ogg",
        "eat_cookie": "InterfaceSound_000110_00258205.ogg",
        "playDVD": [
            "InterfaceSound_000265_005C5A15.ogg",
            "InterfaceSound_000241_004E669D.ogg",
            "PC_Skill_000391_009A0FA6.ogg",
        ],
        "reinforce": "InterfaceSound_000249_005182E5.ogg",
        "reinforceFailed": "InterfaceSound_000252_0052DDC2.ogg",
        "attackFailed": "InterfaceSound_000360_0097514E.ogg",
        "interface_start": "InterfaceSound_000264_005BB1D5.ogg",
        "interface_mapfound": "InterfaceSound_000255_0053E6F0.ogg",

        "die_boss": [
            "Boss_Battle_000032_0409A864.ogg",
            "Boss_Battle_000033_040B610B.ogg",
            "Boss_Battle_000034_040C7B2A.ogg",
        ],

        "interface_news": "InterfaceSound_000259_00584663.ogg", //テロップ

        "trap_blackhole": "PC_Skill_000004_000FE1F1.ogg",
        "trap_pin": "PC_Skill_000094_003C54D4.ogg",
        "trap_summon": "PC_Skill_000059_002D5134.ogg",
        "trap_sleep": "PC_Skill_000010_0012D13B.ogg",
        "trap_hole": "PC_Skill_000055_002C1F8F.ogg",
        "trap_hungry": "ModuleSound_000315_003D5908.ogg",

        "bgm_opening": "Ambience_Field_000016_01F79CE8.ogg",
        "bgm_gameOver": "Ambience_Field_000043_05976AA3.ogg",
        "bgm_gameClear": "City_Town_000005_009BF544.ogg",
        "bgm_tutorial": "City_Town_000006_00CBE9D5.ogg",
        "bgm_firstFloor": "Ambience_Field_000018_0239F7B2.ogg",
        "bgm_bossFloor": "Ambience_Field_000045_05D5145C.ogg",
        "bgm_loading": "PCFemale_Voice04_000160_00229633.ogg",
        "bgm": [
            "Ambience_Field_000001_00011FEE.ogg",
            "Ambience_Field_000002_0020FC25.ogg",
            "Ambience_Field_000003_003E2DF4.ogg",
            "Ambience_Field_000004_006068B2.ogg",
            "Ambience_Field_000005_0080C8CE.ogg",
            "Ambience_Field_000006_00A2A69F.ogg",
            "Ambience_Field_000007_00C0E9C9.ogg",
            "Ambience_Field_000008_00E9D119.ogg",
            "Ambience_Field_000009_010E8801.ogg",
            "Ambience_Field_000010_013245B4.ogg",
            "Ambience_Field_000011_01501368.ogg",
            "Ambience_Field_000012_0171B78F.ogg",
            "Ambience_Field_000013_01925003.ogg",
            "Ambience_Field_000014_01B7D580.ogg",
            "Ambience_Field_000015_01D6C719.ogg",
        ],
        "random": [
            "PCFemale_Voice04_000117_0015128A.ogg",
            "PCFemale_Voice04_000160_00229633.ogg",
            "PCFemale_Voice04_000170_0026FAFE.ogg",
        ],
    };
    //ns.Sound.Data = {};
    ns.Sound.voiceFrequency = {
        "attack": 0.3,
        "damage": 0.3,
    };

}(game));