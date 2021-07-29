{- Lotta unfortunate boilerplate in here, partly as a result of not being able
   to get at all the possible values of a union type through reflection. Could
   go the same route as Location, and just define (once) a list of records, but
   that feels unnecessarily clunky when the records would have only two fields,
   plus `fromString` would then have to scan the list for the given name.
-}


module Objective exposing
    ( BossObjective(..)
    , CharacterObjective(..)
    , Objective(..)
    , QuestObjective(..)
    , Type(..)
    , bosses
    , characters
    , fromString
    , gatedQuests
    , isBoss
    , quests
    , toString
    )


type Objective
    = ClassicForge
    | ClassicGiant
    | Fiends
    | DarkMatterHunt
    | GetCharacter CharacterObjective
    | DefeatBoss BossObjective
    | DoQuest QuestObjective


type Type
    = Character
    | Boss
    | Quest
    | GatedQuest


isBoss : Objective -> Bool
isBoss objective =
    case objective of
        Fiends ->
            True

        DefeatBoss _ ->
            True

        _ ->
            False


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


characters : List Objective
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
        |> List.map GetCharacter


type BossObjective
    = DMist
    | Officer
    | Octomamm
    | Antlion
    | Waterhag
    | MomBomb
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


bosses : List Objective
bosses =
    [ DMist
    , Officer
    , Octomamm
    , Antlion
    , Waterhag
    , MomBomb
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
        |> List.map DefeatBoss


type QuestObjective
    = Ungated UngatedQuest
    | Gated GatedQuest


type UngatedQuest
    = MistCave
    | Waterfall
    | AntlionCave
    | MtHobs
    | Fabul
    | MtOrdeals
    | BaronInn
    | Pass


type GatedQuest
    = BaronCastle
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


quests : List Objective
quests =
    List.map Ungated
        [ MistCave
        , Waterfall
        , AntlionCave
        , MtHobs
        , Fabul
        , MtOrdeals
        , BaronInn
        ]
        ++ List.map Gated
            [ BaronCastle
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
            ]
        ++ [ Ungated Pass ]
        |> List.map DoQuest


gatedQuests : List Objective
gatedQuests =
    let
        isGated q =
            case q of
                DoQuest (Gated _) ->
                    True

                _ ->
                    False
    in
    List.filter isGated quests


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

        GetCharacter characterObjective ->
            "Get " ++ charToString characterObjective

        DefeatBoss bossObjective ->
            "Defeat " ++ bossToString bossObjective

        DoQuest questObjective ->
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
            "D. Mist"

        Officer ->
            "Officer"

        Octomamm ->
            "Octomamm"

        Antlion ->
            "Antlion"

        Waterhag ->
            "Waterhag"

        MomBomb ->
            "MomBomb"

        Gauntlet ->
            "the Fabul Gauntlet"

        Milon ->
            "Milon"

        MilonZ ->
            "Milon Z."

        DarkKnight ->
            "D.Knight"

        Guards ->
            "the Guards"

        Karate ->
            "Karate"

        Baigan ->
            "Baigan"

        Kainazzo ->
            "Kainazzo"

        DarkElf ->
            "the Dark Elf"

        MagusSisters ->
            "the Magus Sisters"

        Valvalis ->
            "Valvalis"

        Calbrena ->
            "Calbrena"

        Golbez ->
            "Golbez"

        DrLugae ->
            "Dr. Lugae"

        DarkImps ->
            "the Dark Imps"

        KQEblan ->
            "K.Eblan and Q.Eblan"

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
            "Pale Dim"

        Wyvern ->
            "Wyvern"

        Plague ->
            "Plague"

        DLunars ->
            "D.Lunars"

        Ogopogo ->
            "Ogopogo"


questToString : QuestObjective -> String
questToString quest =
    case quest of
        Ungated q ->
            case q of
                MistCave ->
                    "Defeat the boss of the Mist Cave"

                Waterfall ->
                    "Defeat the boss of the Waterfall"

                AntlionCave ->
                    "Complete the Antlion Nest"

                MtHobs ->
                    "Rescue the hostage on Mt. Hobs"

                Fabul ->
                    "Defend Fabul"

                MtOrdeals ->
                    "Complete Mt. Ordeals"

                BaronInn ->
                    "Defeat the bosses of Baron Inn"

                Pass ->
                    "Unlock the Pass door in Toroia"

        Gated q ->
            case q of
                BaronCastle ->
                    "Liberate Baron Castle"

                CaveMagnes ->
                    "Complete Cave Magnes"

                TowerZot ->
                    "Complete the Tower of Zot"

                DwarfCastle ->
                    "Defeat the bosses of Dwarf Castle"

                LowerBabil ->
                    "Defeat the boss of Lower Bab-il"

                Falcon ->
                    "Launch the Falcon"

                SealedCave ->
                    "Complete the Sealed Cave"

                FeymarchQueen ->
                    "Defeat the queen at the Town of Monsters"

                FeymarchKing ->
                    "Defeat the king at the Town of Monsters"

                BaronBasement ->
                    "Defeat the Baron Castle basement throne"

                Giant ->
                    "Complete the Giant of Bab-il"

                CaveBahamut ->
                    "Complete Cave Bahamut"

                MurasameAltar ->
                    "Conquer the vanilla Murasame altar"

                WyvernAltar ->
                    "Conquer the vanilla Crystal Sword altar"

                WhiteSpearAltar ->
                    "Conquer the vanilla White Spear altar"

                RibbonRoom ->
                    "Conquer the vanillla Ribbon room"

                MasamuneAltar ->
                    "Conquer the vanilla Masamune Altar"

                Package ->
                    "Burn village Mist with the Package"

                SandRuby ->
                    "Cure the fever with the SandRuby"

                UnlockSewer ->
                    "Unlock the sewer with the Baron Key"

                TwinHarp ->
                    "Break the Dark Elf's spell with the TwinHarp"

                Treasury ->
                    "Open the Toroia Treasury with the Earth Crystal"

                MagmaKey ->
                    "Drop the Magma Key into the Agart well"

                SuperCannon ->
                    "Destroy the Super Cannon"

                UnlockSealedCave ->
                    "Unlock the Sealed Cave"

                BigWhale ->
                    "Raise the Big Whale"

                RatTail ->
                    "Trade away the Rat Tail"

                Forge ->
                    "Have Kokkol forge Legend Sword with Adamant"

                PanWake ->
                    "Wake Yang with the Pan"

                PanReturn ->
                    "Return the Pan to Yang's wife"

                PinkTail ->
                    "Trade away the Pink Tail"


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
                |> Maybe.map GetCharacter

        [ "boss", boss ] ->
            bossFromString boss
                |> Maybe.map DefeatBoss

        [ "quest", quest ] ->
            questFromString quest
                |> Maybe.map DoQuest

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

        "mombomb" ->
            Just MomBomb

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
    let
        ungated =
            Just << Ungated

        gated =
            Just << Gated
    in
    case quest of
        "mistcave" ->
            ungated MistCave

        "waterfall" ->
            ungated Waterfall

        "antlionnest" ->
            ungated AntlionCave

        "hobs" ->
            ungated MtHobs

        "fabul" ->
            ungated Fabul

        "ordeals" ->
            ungated MtOrdeals

        "baroninn" ->
            ungated BaronInn

        "baroncastle" ->
            gated BaronCastle

        "magnes" ->
            gated CaveMagnes

        "zot" ->
            gated TowerZot

        "dwarfcastle" ->
            gated DwarfCastle

        "lowerbabil" ->
            gated LowerBabil

        "falcon" ->
            gated Falcon

        "sealedcave" ->
            gated SealedCave

        "monsterqueen" ->
            gated FeymarchQueen

        "monsterking" ->
            gated FeymarchKing

        "baronbasement" ->
            gated BaronBasement

        "giant" ->
            gated Giant

        "cavebahamut" ->
            gated CaveBahamut

        "murasamealtar" ->
            gated MurasameAltar

        "crystalaltar" ->
            gated WyvernAltar

        "whitealtar" ->
            gated WhiteSpearAltar

        "ribbonaltar" ->
            gated RibbonRoom

        "masamunealtar" ->
            gated MasamuneAltar

        "burnmist" ->
            gated Package

        "curefever" ->
            gated SandRuby

        "unlocksewer" ->
            gated UnlockSewer

        "music" ->
            gated TwinHarp

        "toroiatreasury" ->
            gated Treasury

        "magma" ->
            gated MagmaKey

        "supercannon" ->
            gated SuperCannon

        "unlocksealedcave" ->
            gated UnlockSealedCave

        "bigwhale" ->
            gated BigWhale

        "traderat" ->
            gated RatTail

        "forge" ->
            gated Forge

        "wakeyang" ->
            gated PanWake

        "tradepan" ->
            gated PanReturn

        "tradepink" ->
            gated PinkTail

        "pass" ->
            ungated Pass

        _ ->
            Nothing
