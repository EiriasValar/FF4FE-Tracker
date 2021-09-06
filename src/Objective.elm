module Objective exposing
    ( Boss(..)
    , Character(..)
    , Key(..)
    , Objective
    , Quest(..)
    , Type(..)
    , bosses
    , characters
    , fromDescription
    , fromFlag
    , gatedQuests
    , isBoss
    , keys
    , member
    , quests
    )

import Array exposing (Array)
import Dict exposing (Dict)
import EverySet as Set exposing (EverySet)


type alias Set a =
    EverySet a


type Type
    = Character
    | Boss
    | Quest
    | GatedQuest


type alias Objective =
    { key : Key
    , flag : String
    , description : String
    , isGated : Bool
    }


fromFlag : String -> Maybe Objective
fromFlag flag =
    Dict.get flag allObjectivesByFlag


fromDescription : String -> Maybe Objective
fromDescription description =
    Dict.get description allObjectivesByDescription


isBoss : Key -> Bool
isBoss key =
    case key of
        Fiends ->
            -- we'll probably never hit this case, since we explode
            -- the Fiends objective as soon as we parse the flag
            True

        DefeatBoss _ ->
            True

        _ ->
            False


member : Key -> Array Objective -> Bool
member key =
    Array.toList
        >> List.map .key
        >> List.member key


keys : Array Objective -> Set Key
keys =
    Array.toList
        >> List.map .key
        >> Set.fromList


type Key
    = ClassicForge
    | ClassicGiant
    | Fiends
    | DarkMatterHunt
    | GetCharacter Character
    | DefeatBoss Boss
    | DoQuest Quest


type Character
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


type Boss
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


type Quest
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


characters : List Objective
characters =
    let
        fromTuple ( key, name ) =
            { key = GetCharacter key
            , flag = "char_" ++ String.toLower name
            , description = "Get " ++ name
            , isGated = List.member key [ Edge, FuSoYa ]
            }
    in
    [ ( Cecil, "Cecil" )
    , ( Kain, "Kain" )
    , ( Rydia, "Rydia" )
    , ( Tellah, "Tellah" )
    , ( Edward, "Edward" )
    , ( Rosa, "Rosa" )
    , ( Yang, "Yang" )
    , ( Palom, "Palom" )
    , ( Porom, "Porom" )
    , ( Cid, "Cid" )
    , ( Edge, "Edge" )
    , ( FuSoYa, "FuSoYa" )
    ]
        |> List.map fromTuple


bosses : List Objective
bosses =
    let
        fromTuple ( key, flag, name ) =
            { key = DefeatBoss key
            , flag = "boss_" ++ flag
            , description = "Defeat " ++ name
            , isGated = False
            }
    in
    [ ( DMist, "dmist", "D. Mist" )
    , ( Officer, "officer", "Officer" )
    , ( Octomamm, "octomamm", "Octomamm" )
    , ( Antlion, "antlion", "Antlion" )
    , ( Waterhag, "waterhag", "Waterhag" )
    , ( MomBomb, "mombomb", "MomBomb" )
    , ( Gauntlet, "fabulgauntlet", "the Fabul Gauntlet" )
    , ( Milon, "milon", "Milon" )
    , ( MilonZ, "milonz", "Milon Z." )
    , ( DarkKnight, "mirrorcecil", "D.Knight" )
    , ( Guards, "guard", "the Guards" )
    , ( Karate, "karate", "Karate" )
    , ( Baigan, "baigan", "Baigan" )
    , ( Kainazzo, "kainazzo", "Kainazzo" )
    , ( DarkElf, "darkelf", "the Dark Elf" )
    , ( MagusSisters, "magus", "the Magus Sisters" )
    , ( Valvalis, "valvalis", "Valvalis" )
    , ( Calbrena, "calbrena", "Calbrena" )
    , ( Golbez, "golbez", "Golbez" )
    , ( DrLugae, "lugae", "Dr. Lugae" )
    , ( DarkImps, "darkimp", "the Dark Imps" )
    , ( KQEblan, "kingqueen", "K.Eblan and Q.Eblan" )
    , ( Rubicant, "rubicant", "Rubicant" )
    , ( EvilWall, "evilwall", "EvilWall" )
    , ( Asura, "asura", "Asura" )
    , ( Leviatan, "leviatan", "Leviatan" )
    , ( Odin, "odin", "Odin" )
    , ( Bahamut, "bahamut", "Bahamut" )
    , ( Elements, "elements", "Elements" )
    , ( CPU, "cpu", "CPU" )
    , ( PaleDim, "paledim", "Pale Dim" )
    , ( Wyvern, "wyvern", "Wyvern" )
    , ( Plague, "plague", "Plague" )
    , ( DLunars, "dlunar", "the D.Lunars" )
    , ( Ogopogo, "ogopogo", "Ogopogo" )
    ]
        |> List.map fromTuple


quests : List Objective
quests =
    let
        ungated =
            [ MistCave
            , Waterfall
            , AntlionCave
            , MtHobs
            , Fabul
            , MtOrdeals
            , BaronInn
            , Pass
            ]

        fromTuple ( key, flag, desc ) =
            { key = DoQuest key
            , flag = "quest_" ++ flag
            , description = desc
            , isGated = not <| List.member key ungated
            }
    in
    [ ( MistCave, "mistcave", "Defeat the boss of the Mist Cave" )
    , ( Waterfall, "waterfall", "Defeat the boss of the Waterfall" )
    , ( AntlionCave, "antlionnest", "Complete the Antlion Nest" )
    , ( MtHobs, "hobs", "Rescue the hostage on Mt. Hobs" )
    , ( Fabul, "fabul", "Defend Fabul" )
    , ( MtOrdeals, "ordeals", "Complete Mt. Ordeals" )
    , ( BaronInn, "baroninn", "Defeat the bosses of Baron Inn" )
    , ( BaronCastle, "baroncastle", "Liberate Baron Castle" )
    , ( CaveMagnes, "magnes", "Complete Cave Magnes" )
    , ( TowerZot, "zot", "Complete the Tower of Zot" )
    , ( DwarfCastle, "dwarfcastle", "Defeat the bosses of Dwarf Castle" )
    , ( LowerBabil, "lowerbabil", "Defeat the boss of Lower Bab-il" )
    , ( Falcon, "falcon", "Launch the Falcon" )
    , ( SealedCave, "sealedcave", "Complete the Sealed Cave" )
    , ( FeymarchQueen, "monsterqueen", "Defeat the queen at the Town of Monsters" )
    , ( FeymarchKing, "monsterking", "Defeat the king at the Town of Monsters" )
    , ( BaronBasement, "baronbasement", "Defeat the Baron Castle basement throne" )
    , ( Giant, "giant", "Complete the Giant of Bab-il" )
    , ( CaveBahamut, "cavebahamut", "Complete Cave Bahamut" )
    , ( MurasameAltar, "murasamealtar", "Conquer the vanilla Murasame altar" )
    , ( WyvernAltar, "crystalaltar", "Conquer the vanilla Crystal Sword altar" )
    , ( WhiteSpearAltar, "whitealtar", "Conquer the vanilla White Spear altar" )
    , ( RibbonRoom, "ribbonaltar", "Conquer the vanillla Ribbon room" )
    , ( MasamuneAltar, "masamunealtar", "Conquer the vanilla Masamune Altar" )
    , ( Package, "burnmist", "Burn village Mist with the Package" )
    , ( SandRuby, "curefever", "Cure the fever with the SandRuby" )
    , ( UnlockSewer, "unlocksewer", "Unlock the sewer with the Baron Key" )
    , ( TwinHarp, "music", "Break the Dark Elf's spell with the TwinHarp" )
    , ( Treasury, "toroiatreasury", "Open the Toroia treasury with the Earth Crystal" )
    , ( MagmaKey, "magma", "Drop the Magma Key into the Agart well" )
    , ( SuperCannon, "supercannon", "Destroy the Super Cannon" )
    , ( UnlockSealedCave, "unlocksealedcave", "Unlock the Sealed Cave" )
    , ( BigWhale, "bigwhale", "Raise the Big Whale" )
    , ( RatTail, "traderat", "Trade away the Rat Tail" )
    , ( Forge, "forge", "Have Kokkol forge Legend Sword with Adamant" )
    , ( PanWake, "wakeyang", "Wake Yang with the Pan" )
    , ( PanReturn, "tradepan", "Return the Pan to Yang's wife" )
    , ( PinkTail, "tradepink", "Trade away the Pink Tail" )
    , ( Pass, "pass", "Unlock the Pass door in Toroia" )
    ]
        |> List.map fromTuple


gatedQuests : List Objective
gatedQuests =
    List.filter .isGated quests


classic : List Objective
classic =
    let
        fromTuple ( key, flag, desc ) =
            { key = key
            , flag = flag
            , description = desc
            , isGated = False
            }
    in
    [ ( ClassicForge, "classicforge", "Classic Forge the Crystal" )
    , ( ClassicGiant, "classicgiant", "Classic Giant%" )
    , ( Fiends, "fiends", "Fiends%" )
    , ( DarkMatterHunt, "dkmatter", "Deliver 30 Dark Matter" )
    ]
        |> List.map fromTuple


allObjectives : List Objective
allObjectives =
    classic ++ characters ++ bosses ++ quests


allObjectivesByFlag : Dict String Objective
allObjectivesByFlag =
    allObjectives
        |> List.map (\o -> ( o.flag, o ))
        |> Dict.fromList


allObjectivesByDescription : Dict String Objective
allObjectivesByDescription =
    allObjectives
        |> List.map (\o -> ( o.description, o ))
        |> Dict.fromList
