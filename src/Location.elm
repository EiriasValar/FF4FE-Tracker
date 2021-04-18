module Location exposing
    ( Context
    , Key(..)
    , Location
    , Locations
    , Requirement(..)
    , all
    , filterByContext
    , getBosses
    , getCharacters
    , getKey
    , getKeyItems
    , getName
    , isChecked
    , toggleChecked
    , update
    , values
    )

import Array
import AssocList as Dict exposing (Dict)
import EverySet as Set exposing (EverySet)
import Flags exposing (Flags, KeyItemClass(..))
import Objective exposing (Objective)


type alias Set a =
    EverySet a


type Location
    = Location Data


type alias Data =
    { key : Key
    , name : String
    , area : Area
    , checked : Bool
    , requirements : Set Requirement
    , jumpable : Bool
    , characters : Maybe CharacterCount
    , bosses : Int
    , keyItem : Maybe KeyItemClass
    }


type Key
    = MistCave
    | MistVillagePackage
    | MistVillageMom
    | Kaipo
    | WateryPass
    | Waterfall
    | Damcyan
    | AntlionCave
    | MtHobs
    | FabulDefence
    | Sheila
    | SheilaPan
    | AdamantGrotto
    | Mysidia
    | MtOrdeals
    | BaronInn
    | BaronCastle
    | BaronBasement
    | Toroia
    | CaveMagnes
    | TowerZot1
    | TowerZot2
    | CaveEblan
    | UpperBabil
    | GiantBabil
    | DwarfCastle
    | LowerBabilCannon
    | LowerBabilTop
    | SylphCave
    | FeymarchKing
    | FeymarchQueen
    | SealedCave
    | LunarDais
    | CaveBahamut
    | MurasameAltar
    | WyvernAltar
    | WhiteSpearAltar
    | RibbonRoom
    | MasamuneAltar


type Requirement
    = Package
    | SandRuby
    | BaronKey
    | LucaKey
    | MagmaKey
    | TowerKey
    | DarknessCrystal
    | EarthCrystal
    | Crystal
    | Hook
    | TwinHarp
    | Pan
    | RatTail
    | Adamant
    | LegendSword
    | Spoon
    | PinkTail
    | Pass
    | MistDragon
    | UndergroundAccess


type Area
    = Surface
    | Underground
    | Moon


type CharacterCount
    = Ungated Int
    | Gated Int


type alias Context =
    { flags : Flags
    , randomObjectives : Set Objective
    , completedObjectives : Set Objective
    , attainedRequirements : Set Requirement
    , warpGlitchUsed : Bool
    , showChecked : Bool
    }


getKey : Location -> Key
getKey (Location location) =
    location.key


getName : Location -> String
getName (Location location) =
    location.name


getCharacters : Context -> Location -> Int
getCharacters { flags } (Location location) =
    case location.characters of
        Just (Gated n) ->
            if flags.classicGiantObjective && location.key == GiantBabil then
                0

            else
                n

        Just (Ungated n) ->
            if flags.noFreeChars then
                0

            else
                n

        Nothing ->
            0


getBosses : Context -> Location -> Int
getBosses _ (Location location) =
    location.bosses


getKeyItems : Context -> Location -> Int
getKeyItems { flags, warpGlitchUsed } (Location location) =
    let
        keyItems =
            case location.keyItem of
                Just itemClass ->
                    if Set.member itemClass flags.keyItems then
                        1

                    else
                        0

                _ ->
                    0

        modifier =
            if warpGlitchUsed && location.key == SealedCave then
                -1

            else
                0
    in
    keyItems + modifier


isChecked : Location -> Bool
isChecked (Location location) =
    location.checked


toggleChecked : Location -> Location
toggleChecked (Location location) =
    Location { location | checked = not location.checked }


type Locations
    = Locations (Dict Key Location)


values : Locations -> List Location
values (Locations locations) =
    Dict.values locations


update : Key -> (Maybe Location -> Maybe Location) -> Locations -> Locations
update key fn (Locations locations) =
    Locations <|
        Dict.update key fn locations


filterByContext : Context -> Locations -> Locations
filterByContext c (Locations locations) =
    let
        undergroundAccess =
            c.flags.pushBToJump
                || Set.member MagmaKey c.attainedRequirements
                || (Dict.get UpperBabil locations |> Maybe.map isChecked |> Maybe.withDefault False)

        attainedRequirements =
            if undergroundAccess then
                Set.insert UndergroundAccess c.attainedRequirements

            else
                c.attainedRequirements

        context =
            { c | attainedRequirements = attainedRequirements }

        -- don't want to call this repeatedly for each location when it depends only on the context
        bossesRelevant =
            bossesHaveValue context

        isRelevant ((Location l) as location) =
            if l.checked then
                -- always show checked items if showChecked is on, never if it's off
                context.showChecked

            else
                ((getCharacters context location > 0)
                    || (bossesRelevant && getBosses context location > 0)
                    || (getKeyItems context location > 0)
                    || (l.key == UpperBabil && not undergroundAccess)
                )
                    && areaAccessible attainedRequirements location
                    && (context.flags.pushBToJump && l.jumpable || requirementsMet attainedRequirements location)
    in
    locations
        |> Dict.filter (always isRelevant)
        |> Locations


{-| Returns True if, based on the given Context, bosses may be intrisically
valuable. Namely, if there are Boss Hunt objectives to fullfil, or a D.Mist
to find when the Nkey flag is on.
-}
bossesHaveValue : Context -> Bool
bossesHaveValue context =
    let
        combinedObjectives =
            context.flags.objectives
                |> Array.toList
                |> Set.fromList
                |> Set.union context.randomObjectives

        outstandingObjectives =
            if Set.size context.completedObjectives >= context.flags.requiredObjectives then
                Set.empty

            else
                Set.diff combinedObjectives context.completedObjectives

        activeBossHunt =
            outstandingObjectives
                |> Set.filter Objective.isBoss
                |> Set.isEmpty
                |> not

        -- Finding D.Mist is interesting if the Free key item is turned off and we
        -- haven't already found it. Technically it may also stop being interesting
        -- if we've already attained Go Mode without it, but at that point *most* of
        -- what we track stops being interesting.
        huntingDMist =
            (not <| Set.member Flags.Free context.flags.keyItems)
                && (not <| Set.member MistDragon context.attainedRequirements)
    in
    activeBossHunt || huntingDMist


areaAccessible : Set Requirement -> Location -> Bool
areaAccessible attained (Location location) =
    case location.area of
        Surface ->
            True

        Underground ->
            Set.member UndergroundAccess attained

        Moon ->
            Set.member DarknessCrystal attained


requirementsMet : Set Requirement -> Location -> Bool
requirementsMet attained (Location location) =
    Set.diff location.requirements attained
        |> Set.isEmpty


all : Locations
all =
    let
        finish : Area -> PartialData -> ( Key, Location )
        finish area l =
            { key = l.key
            , name = l.name
            , area = area
            , checked = False
            , requirements = Set.fromList l.requirements
            , jumpable = l.jumpable
            , characters = Nothing
            , bosses = 0
            , keyItem = Nothing
            }
                |> foldInto addValue l.value
                |> Location
                |> Tuple.pair l.key

        addValue : Value -> Data -> Data
        addValue v d =
            case v of
                Characters c ->
                    { d | characters = Just c }

                Bosses n ->
                    { d | bosses = n }

                KeyItem k ->
                    { d | keyItem = Just k }
    in
    List.map (finish Surface) surface
        ++ List.map (finish Underground) underground
        ++ List.map (finish Moon) moon
        -- reverse so the AssocList dict is in the right order
        |> List.reverse
        |> Dict.fromList
        |> Locations


type alias PartialData =
    { key : Key
    , name : String
    , requirements : List Requirement
    , jumpable : Bool
    , value : List Value
    }


type Value
    = Characters CharacterCount
    | Bosses Int
    | KeyItem KeyItemClass


surface : List PartialData
surface =
    [ { key = MistCave
      , name = "Mist Cave"
      , requirements = []
      , jumpable = False
      , value =
            [ Bosses 1
            ]
      }
    , { key = MistVillagePackage
      , name = "Mist Village - Package"
      , requirements = [ Package ]
      , jumpable = False
      , value =
            [ Characters <| Gated 1
            , Bosses 1
            ]
      }
    , { key = MistVillageMom
      , name = "Mist Village - Mom"
      , requirements = [ MistDragon ]
      , jumpable = False
      , value =
            [ KeyItem Main
            ]
      }
    , { key = Kaipo
      , name = "Kaipo"
      , requirements = [ SandRuby ]
      , jumpable = False
      , value =
            [ Characters <| Gated 1
            ]
      }
    , { key = WateryPass
      , name = "Watery Pass"
      , requirements = []
      , jumpable = False
      , value =
            [ Characters <| Ungated 1
            ]
      }
    , { key = Waterfall
      , name = "Waterfall"
      , requirements = []
      , jumpable = False
      , value =
            [ Bosses 1
            ]
      }
    , { key = Damcyan
      , name = "Damcyan"
      , requirements = []
      , jumpable = False
      , value =
            [ Characters <| Ungated 1
            ]
      }
    , { key = AntlionCave
      , name = "Antlion Cave"
      , requirements = []
      , jumpable = False
      , value =
            [ Bosses 1
            , KeyItem Main
            ]
      }
    , { key = MtHobs
      , name = "Mt. Hobs"
      , requirements = []
      , jumpable = False
      , value =
            [ Characters <| Gated 1
            , Bosses 1
            ]
      }
    , { key = FabulDefence
      , name = "Fabul Defence"
      , requirements = []
      , jumpable = False
      , value =
            [ Bosses 1
            , KeyItem Main
            ]
      }
    , { key = Sheila
      , name = "Sheila"
      , requirements = [ UndergroundAccess ]
      , jumpable = False
      , value =
            [ KeyItem Main
            ]
      }
    , { key = SheilaPan
      , name = "Sheila - Pan"
      , requirements = [ UndergroundAccess, Pan ]
      , jumpable = False
      , value =
            [ KeyItem Main
            ]
      }
    , { key = AdamantGrotto
      , name = "Adamant Grotto"
      , requirements = [ Hook, RatTail ]
      , jumpable = False
      , value =
            [ KeyItem Main
            ]
      }
    , { key = Mysidia
      , name = "Mysidia"
      , requirements = []
      , jumpable = False
      , value =
            [ Characters <| Ungated 2
            ]
      }
    , { key = MtOrdeals
      , name = "Mt. Ordeals"
      , requirements = []
      , jumpable = False
      , value =
            [ Characters <| Ungated 1
            , Bosses 3
            , KeyItem Main
            ]
      }
    , { key = BaronInn
      , name = "Baron Inn"
      , requirements = []
      , jumpable = False
      , value =
            [ Characters <| Gated 1
            , Bosses 2
            , KeyItem Main
            ]
      }
    , { key = BaronCastle
      , name = "Baron Castle"
      , requirements = [ BaronKey ]
      , jumpable = True
      , value =
            [ Characters <| Gated 1
            , Bosses 2
            , KeyItem Main
            ]
      }
    , { key = BaronBasement
      , name = "Baron Castle Basement"
      , requirements = [ BaronKey ]
      , jumpable = True
      , value =
            [ Bosses 1
            , KeyItem Summon
            ]
      }
    , { key = Toroia
      , name = "Edward in Toroia"
      , requirements = []
      , jumpable = False
      , value =
            [ KeyItem Free
            ]
      }
    , { key = CaveMagnes
      , name = "Cave Magnes"
      , requirements = [ TwinHarp ]
      , jumpable = True
      , value =
            [ Bosses 1
            , KeyItem Main
            ]
      }
    , { key = TowerZot1
      , name = "Tower of Zot 1"
      , requirements = []
      , jumpable = False
      , value =
            [ Bosses 1
            ]
      }
    , { key = TowerZot2
      , name = "Tower of Zot 2"
      , requirements = [ EarthCrystal ]
      , jumpable = True
      , value =
            [ Characters <| Gated 2
            , Bosses 1
            , KeyItem Main
            ]
      }
    , { key = CaveEblan
      , name = "Cave Eblan"
      , requirements = [ Hook ]
      , jumpable = True
      , value =
            [ Characters <| Gated 1
            ]
      }
    , { key = UpperBabil
      , name = "Upper Bab-il"
      , requirements = [ Hook ]
      , jumpable = True
      , value =
            [ Bosses 2
            ]
      }
    , { key = GiantBabil
      , name = "Giant of Bab-il"
      , requirements = [ DarknessCrystal ]
      , jumpable = False
      , value =
            [ Characters <| Gated 1
            , Bosses 2
            ]
      }
    ]


underground : List PartialData
underground =
    [ { key = DwarfCastle
      , name = "Dwarf Castle"
      , requirements = []
      , jumpable = False
      , value =
            [ Characters <| Gated 1
            , Bosses 2
            , KeyItem Main
            ]
      }
    , { key = LowerBabilCannon
      , name = "Lower Bab-il - Cannon"
      , requirements = [ TowerKey ]
      , jumpable = False
      , value =
            [ Bosses 1
            , KeyItem Main
            ]
      }
    , { key = LowerBabilTop
      , name = "Lower Bab-il - Top"
      , requirements = []
      , jumpable = False
      , value =
            [ Bosses 1
            , KeyItem Main
            ]
      }
    , { key = SylphCave
      , name = "Sylph Cave"
      , requirements = [ Pan ]
      , jumpable = False
      , value =
            [ KeyItem Summon
            ]
      }
    , { key = FeymarchKing
      , name = "Feymarch - King"
      , requirements = []
      , jumpable = False
      , value =
            [ Bosses 1
            , KeyItem Summon
            ]
      }
    , { key = FeymarchQueen
      , name = "Feymarch - Queen"
      , requirements = []
      , jumpable = False
      , value =
            [ Bosses 1
            , KeyItem Summon
            ]
      }
    , { key = SealedCave
      , name = "Sealed Cave"
      , requirements = [ LucaKey ]
      , jumpable = False
      , value =
            [ Bosses 1
            , KeyItem Main
            ]
      }
    ]


moon : List PartialData
moon =
    [ { key = LunarDais
      , name = "Lunar Dais"
      , requirements = []
      , jumpable = False
      , value =
            [ Characters <| Gated 1
            ]
      }
    , { key = CaveBahamut
      , name = "Cave Bahamut"
      , requirements = []
      , jumpable = False
      , value =
            [ Bosses 1
            , KeyItem Summon
            ]
      }
    , { key = MurasameAltar
      , name = "Murasame Altar"
      , requirements = []
      , jumpable = False
      , value =
            [ Bosses 1
            , KeyItem MoonBoss
            ]
      }
    , { key = WyvernAltar
      , name = "Wyvern Altar"
      , requirements = []
      , jumpable = False
      , value =
            [ Bosses 1
            , KeyItem MoonBoss
            ]
      }
    , { key = WhiteSpearAltar
      , name = "White Spear Altar"
      , requirements = []
      , jumpable = False
      , value =
            [ Bosses 1
            , KeyItem MoonBoss
            ]
      }
    , { key = RibbonRoom
      , name = "Ribbon Room"
      , requirements = []
      , jumpable = False
      , value =
            [ Bosses 1
            , KeyItem MoonBoss
            ]
      }
    , { key = MasamuneAltar
      , name = "Masamune Altar"
      , requirements = []
      , jumpable = False
      , value =
            [ Bosses 1
            , KeyItem MoonBoss
            ]
      }
    ]


{-| List.foldl but with the accumulator as the last argument,
for ease of piping.
-}
foldInto : (a -> b -> b) -> List a -> b -> b
foldInto fn list acc =
    List.foldl fn acc list
