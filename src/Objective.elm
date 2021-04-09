module Objective exposing
    ( BossObjective(..)
    , CharacterObjective(..)
    , Objective(..)
    , QuestObjective(..)
    , bosses
    , characters
    , fromString
    , quests
    , toString
    )


type Objective
    = ClassicForge
    | ClassicGiant
    | Fiends
    | DarkMatterHunt
    | Character CharacterObjective
    | Boss BossObjective
    | Quest QuestObjective


type CharacterObjective
    = Cecil
    | Kain
    | Rydia
    | Tellah
    | Edward
    | Rosa
    | Yang
    | Palom
    | Porom
    | Cid
    | Edge
    | FuSoYa


characters : List CharacterObjective
characters =
    [ Cecil
    , Kain
    , Rydia
    , Tellah
    , Edward
    , Rosa
    , Yang
    , Palom
    , Porom
    , Cid
    , Edge
    , FuSoYa
    ]


type BossObjective
    = DMist
    | Officer
    | Octomamm
    | Antlion
    | Waterhag
    | MomBom
    | Gauntlet
    | Milon
    | MilonZ
    | DarkKnight
    | Guards
    | Karate
    | Baigan
    | Kainazzo
    | DarkElf
    | MagusSisters
    | Valvalis
    | Calbrena
    | Golbez
    | DrLugae
    | DarkImps
    | KQEblan
    | Rubicant
    | EvilWall
    | Asura
    | Leviatan
    | Odin
    | Bahamut
    | Elements
    | CPU
    | PaleDim
    | Wyvern
    | Plague
    | DLunars
    | Ogopogo


bosses : List BossObjective
bosses =
    [ DMist
    , Officer
    , Octomamm
    , Antlion
    , Waterhag
    , MomBom
    , Gauntlet
    , Milon
    , MilonZ
    , DarkKnight
    , Guards
    , Karate
    , Baigan
    , Kainazzo
    , DarkElf
    , MagusSisters
    , Valvalis
    , Calbrena
    , Golbez
    , DrLugae
    , DarkImps
    , KQEblan
    , Rubicant
    , EvilWall
    , Asura
    , Leviatan
    , Odin
    , Bahamut
    , Elements
    , CPU
    , PaleDim
    , Wyvern
    , Plague
    , DLunars
    , Ogopogo
    ]


type QuestObjective
    = MistCave
    | Waterfall
    | AntlionCave
    | MtHobs
    | Fabul
    | MtOrdeals
    | BaronInn
    | BaronCastle
    | CaveMagnes
    | TowerZot
    | DwarfCastle
    | LowerBabil
    | Falcon
    | SealedCave
    | FeymarchQueen
    | FeymarchKing
    | BaronBasement
    | Giant
    | CaveBahamut
    | MurasameAltar
    | WyvernAltar
    | WhiteSpearAltar
    | RibbonRoom
    | MasamuneAltar
    | Package
    | SandRuby
    | UnlockSewer
    | TwinHarp
    | Treasury
    | MagmaKey
    | SuperCannon
    | UnlockSealedCave
    | BigWhale
    | RatTail
    | Forge
    | PanWake
    | PanReturn
    | PinkTail
    | Pass


quests : List QuestObjective
quests =
    [ MistCave
    , Waterfall
    , AntlionCave
    , MtHobs
    , Fabul
    , MtOrdeals
    , BaronInn
    , BaronCastle
    , CaveMagnes
    , TowerZot
    , DwarfCastle
    , LowerBabil
    , Falcon
    , SealedCave
    , FeymarchQueen
    , FeymarchKing
    , BaronBasement
    , Giant
    , CaveBahamut
    , MurasameAltar
    , WyvernAltar
    , WhiteSpearAltar
    , RibbonRoom
    , MasamuneAltar
    , Package
    , SandRuby
    , UnlockSewer
    , TwinHarp
    , Treasury
    , MagmaKey
    , SuperCannon
    , UnlockSealedCave
    , BigWhale
    , RatTail
    , Forge
    , PanWake
    , PanReturn
    , PinkTail
    , Pass
    ]


toString : Objective -> String
toString objective =
    case objective of
        ClassicForge ->
            "Classic Forge the Crystal"

        ClassicGiant ->
            "Classic Giant%"

        Fiends ->
            "Fiends%"

        DarkMatterHunt ->
            "Dark Matter Hunt"

        Character characterObjective ->
            "Get " ++ charToString characterObjective

        Boss bossObjective ->
            "Defeat " ++ bossToString bossObjective

        Quest questObjective ->
            questToString questObjective


charToString : CharacterObjective -> String
charToString char =
    case char of
        Cecil ->
            "Cecil"

        Kain ->
            "Kain"

        Rydia ->
            "Rydia"

        Tellah ->
            "Tellah"

        Edward ->
            "Edward"

        Rosa ->
            "Rosa"

        Yang ->
            "Yang"

        Palom ->
            "Palom"

        Porom ->
            "Porom"

        Cid ->
            "Cid"

        Edge ->
            "Edge"

        FuSoYa ->
            "FuSoYa"


bossToString : BossObjective -> String
bossToString boss =
    case boss of
        DMist ->
            "DMist"

        Officer ->
            "Officer"

        Octomamm ->
            "Octomamm"

        Antlion ->
            "Antlion"

        Waterhag ->
            "Waterhag"

        MomBom ->
            "MomBom"

        Gauntlet ->
            "Gauntlet"

        Milon ->
            "Milon"

        MilonZ ->
            "MilonZ"

        DarkKnight ->
            "DarkKnight"

        Guards ->
            "Guards"

        Karate ->
            "Karate"

        Baigan ->
            "Baigan"

        Kainazzo ->
            "Kainazzo"

        DarkElf ->
            "DarkElf"

        MagusSisters ->
            "MagusSisters"

        Valvalis ->
            "Valvalis"

        Calbrena ->
            "Calbrena"

        Golbez ->
            "Golbez"

        DrLugae ->
            "DrLugae"

        DarkImps ->
            "DarkImps"

        KQEblan ->
            "KQEblan"

        Rubicant ->
            "Rubicant"

        EvilWall ->
            "EvilWall"

        Asura ->
            "Asura"

        Leviatan ->
            "Leviatan"

        Odin ->
            "Odin"

        Bahamut ->
            "Bahamut"

        Elements ->
            "Elements"

        CPU ->
            "CPU"

        PaleDim ->
            "PaleDim"

        Wyvern ->
            "Wyvern"

        Plague ->
            "Plague"

        DLunars ->
            "DLunars"

        Ogopogo ->
            "Ogopogo"


questToString : QuestObjective -> String
questToString quest =
    case quest of
        MistCave ->
            "MistCave"

        Waterfall ->
            "Waterfall"

        AntlionCave ->
            "AntlionCave"

        MtHobs ->
            "MtHobs"

        Fabul ->
            "Fabul"

        MtOrdeals ->
            "MtOrdeals"

        BaronInn ->
            "BaronInn"

        BaronCastle ->
            "BaronCastle"

        CaveMagnes ->
            "CaveMagnes"

        TowerZot ->
            "TowerZot"

        DwarfCastle ->
            "DwarfCastle"

        LowerBabil ->
            "LowerBabil"

        Falcon ->
            "Falcon"

        SealedCave ->
            "SealedCave"

        FeymarchQueen ->
            "FeymarchQueen"

        FeymarchKing ->
            "FeymarchKing"

        BaronBasement ->
            "BaronBasement"

        Giant ->
            "Giant"

        CaveBahamut ->
            "CaveBahamut"

        MurasameAltar ->
            "MurasameAltar"

        WyvernAltar ->
            "WyvernAltar"

        WhiteSpearAltar ->
            "WhiteSpearAltar"

        RibbonRoom ->
            "RibbonRoom"

        MasamuneAltar ->
            "MasamuneAltar"

        Package ->
            "Package"

        SandRuby ->
            "SandRuby"

        UnlockSewer ->
            "UnlockSewer"

        TwinHarp ->
            "TwinHarp"

        Treasury ->
            "Treasury"

        MagmaKey ->
            "MagmaKey"

        SuperCannon ->
            "SuperCannon"

        UnlockSealedCave ->
            "UnlockSealedCave"

        BigWhale ->
            "BigWhale"

        RatTail ->
            "RatTail"

        Forge ->
            "Forge"

        PanWake ->
            "PanWake"

        PanReturn ->
            "PanReturn"

        PinkTail ->
            "PinkTail"

        Pass ->
            "Pass"


fromString : String -> Maybe Objective
fromString str =
    case String.split "_" (String.toLower str) of
        [ "classicforge" ] ->
            Just ClassicForge

        [ "classicgiant" ] ->
            Just ClassicGiant

        [ "fiends" ] ->
            Just Fiends

        [ "dkmatter" ] ->
            Just DarkMatterHunt

        [ "char", char ] ->
            charFromString char
                |> Maybe.map Character

        [ "boss", boss ] ->
            bossFromString boss
                |> Maybe.map Boss

        [ "quest", quest ] ->
            questFromString quest
                |> Maybe.map Quest

        _ ->
            Nothing


charFromString : String -> Maybe CharacterObjective
charFromString char =
    case char of
        "cecil" ->
            Just Cecil

        "kain" ->
            Just Kain

        "rydia" ->
            Just Rydia

        "tellah" ->
            Just Tellah

        "edward" ->
            Just Edward

        "rosa" ->
            Just Rosa

        "yang" ->
            Just Yang

        "palom" ->
            Just Palom

        "porom" ->
            Just Porom

        "cid" ->
            Just Cid

        "edge" ->
            Just Edge

        "fusoya" ->
            Just FuSoYa

        _ ->
            Nothing


bossFromString : String -> Maybe BossObjective
bossFromString boss =
    case boss of
        "dmist" ->
            Just DMist

        "officer" ->
            Just Officer

        "octomamm" ->
            Just Octomamm

        "antlion" ->
            Just Antlion

        "waterhag" ->
            Just Waterhag

        "mombom" ->
            Just MomBom

        "fabulgauntlet" ->
            Just Gauntlet

        "milon" ->
            Just Milon

        "milonz" ->
            Just MilonZ

        "mirrorcecil" ->
            Just DarkKnight

        "guard" ->
            Just Guards

        "karate" ->
            Just Karate

        "baigan" ->
            Just Baigan

        "kainazzo" ->
            Just Kainazzo

        "darkelf" ->
            Just DarkElf

        "magus" ->
            Just MagusSisters

        "valvalis" ->
            Just Valvalis

        "calbrena" ->
            Just Calbrena

        "golbez" ->
            Just Golbez

        "lugae" ->
            Just DrLugae

        "darkimp" ->
            Just DarkImps

        "kingqueen" ->
            Just KQEblan

        "rubicant" ->
            Just Rubicant

        "evilwall" ->
            Just EvilWall

        "asura" ->
            Just Asura

        "leviatan" ->
            Just Leviatan

        "odin" ->
            Just Odin

        "bahamut" ->
            Just Bahamut

        "elements" ->
            Just Elements

        "cpu" ->
            Just CPU

        "paledim" ->
            Just PaleDim

        "wyvern" ->
            Just Wyvern

        "plague" ->
            Just Plague

        "dlunar" ->
            Just DLunars

        "ogopogo" ->
            Just Ogopogo

        _ ->
            Nothing


questFromString : String -> Maybe QuestObjective
questFromString quest =
    case quest of
        "mistcave" ->
            Just MistCave

        "waterfall" ->
            Just Waterfall

        "antlionnest" ->
            Just AntlionCave

        "hobs" ->
            Just MtHobs

        "fabul" ->
            Just Fabul

        "ordeals" ->
            Just MtOrdeals

        "baroninn" ->
            Just BaronInn

        "baroncastle" ->
            Just BaronCastle

        "magnes" ->
            Just CaveMagnes

        "zot" ->
            Just TowerZot

        "dwarfcastle" ->
            Just DwarfCastle

        "lowerbabil" ->
            Just LowerBabil

        "falcon" ->
            Just Falcon

        "sealedcave" ->
            Just SealedCave

        "monsterqueen" ->
            Just FeymarchQueen

        "monsterking" ->
            Just FeymarchKing

        "baronbasement" ->
            Just BaronBasement

        "giant" ->
            Just Giant

        "cavebahamut" ->
            Just CaveBahamut

        "murasamealtar" ->
            Just MurasameAltar

        "crystalaltar" ->
            Just WyvernAltar

        "whitealtar" ->
            Just WhiteSpearAltar

        "ribbonaltar" ->
            Just RibbonRoom

        "masamunealtar" ->
            Just MasamuneAltar

        "burnmist" ->
            Just Package

        "curefever" ->
            Just SandRuby

        "unlocksewer" ->
            Just UnlockSewer

        "music" ->
            Just TwinHarp

        "toroiatreasury" ->
            Just Treasury

        "magma" ->
            Just MagmaKey

        "supercannon" ->
            Just SuperCannon

        "unlocksealedcave" ->
            Just UnlockSealedCave

        "bigwhale" ->
            Just BigWhale

        "traderat" ->
            Just RatTail

        "forge" ->
            Just Forge

        "wakeyang" ->
            Just PanWake

        "tradepan" ->
            Just PanReturn

        "tradepink" ->
            Just PinkTail

        "pass" ->
            Just Pass

        _ ->
            Nothing
