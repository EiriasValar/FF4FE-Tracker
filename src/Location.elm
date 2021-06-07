module Location exposing
    ( Area
    , Class(..)
    , Context
    , Filter(..)
    , FilterType(..)
    , Key(..)
    , Location
    , Locations
    , Requirement(..)
    , Status(..)
    , Value(..)
    , all
    , areaToString
    , filterByContext
    , getArea
    , getKey
    , getName
    , getProperties
    , getStatus
    , groupByArea
    , statusToString
    , toggleProperty
    , toggleStatus
    , update
    , valueToFilter
    , values
    )

import Array exposing (Array)
import AssocList as Dict exposing (Dict)
import EverySet as Set exposing (EverySet)
import Flags exposing (Flags, KeyItemClass(..))
import List.Extra
import Objective exposing (Objective)


type alias Set a =
    EverySet a


type Location
    = Location Data


type alias Data =
    { key : Key
    , name : String
    , area : Area
    , isShop : Bool
    , requirements : Set Requirement
    , status : Status
    , properties : Array Property
    }


type Status
    = Unseen
    | Seen
    | Dismissed



-- TODO some of these types and methods could live somewhere else? Location's feeling overloaded


type Property
    = Property Status Value


type Value
    = Character CharacterType
    | Boss
    | KeyItem KeyItemClass
    | Chest Int -- excluding trapped chests
    | TrappedChest Int
    | Shop -- dummy, for now; TODO values per interesting shop item type?


type Filter
    = Characters
    | Bosses
    | KeyItems
    | Chests
    | TrappedChests
    | Checked


type FilterType
    = Show
    | Hide


type CharacterType
    = Ungated
    | Gated


type Key
    = MistCave
    | MistVillage
    | MistVillageShops
    | MistVillagePackage
    | MistVillageMom
    | Kaipo
    | KaipoShops
    | KaipoBed
    | WateryPass
    | Waterfall
    | Damcyan
    | AntlionCave
    | MtHobs
    | FabulShops
    | FabulDefence
    | Sheila1
    | Sheila2
    | Mysidia
    | MysidiaShops
    | MtOrdeals
    | Baron
    | BaronItemShop
    | BaronWeaponShop
    | BaronSewer
    | BaronCastle
    | BaronBasement
    | Toroia
    | ToroiaShops
    | ToroiaCastle
    | ToroiaTreasury
    | CaveMagnes
    | Zot1
    | Zot2
    | Agart
    | AgartShops
    | Silvera
    | SilveraShops
    | AdamantGrotto
    | CastleEblan
    | CaveEblan
    | CaveEblanShops
    | UpperBabil
    | Giant
    | DwarfCastle
    | DwarfCastleShops
    | LowerBabil
    | LowerBabilCannon
    | SylphCave
    | Feymarch
    | FeymarchShops
    | FeymarchKing
    | FeymarchQueen
    | Tomra
    | TomraShops
    | SealedCave
    | Kokkol
    | KokkolShop
    | Hummingway
    | CaveBahamut
    | LunarPath
    | LunarSubterrane
    | MurasameAltar
    | WyvernAltar
    | WhiteSpearAltar
    | RibbonRoom
    | MasamuneAltar


type Class
    = Checks
    | Shops


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


type alias Context =
    { flags : Flags
    , randomObjectives : Set Objective
    , completedObjectives : Set Objective
    , attainedRequirements : Set Requirement
    , warpGlitchUsed : Bool
    , filterOverrides : Dict Filter FilterType
    }


getKey : Location -> Key
getKey (Location location) =
    location.key


getName : Location -> String
getName (Location location) =
    location.name


getArea : Location -> Area
getArea (Location location) =
    location.area


{-| Returns all the Location's properties that exist given the context,
regardless of their Status, minus any that have been filtered out. The Int
is the index of the property within the location, for use with toggleProperty.
-}
getProperties : Context -> Location -> List ( Int, Status, Value )
getProperties { flags, warpGlitchUsed, filterOverrides } (Location location) =
    let
        -- certain values don't exist under certain flags
        -- note the free key item from Edward has its own key item class rather than
        -- being special-cased here
        exists (Property _ value) =
            case value of
                Character Ungated ->
                    not flags.noFreeChars

                Character Gated ->
                    not <| flags.classicGiantObjective && location.key == Giant

                KeyItem itemClass ->
                    not (warpGlitchUsed && location.key == SealedCave)
                        && Set.member itemClass flags.keyItems

                _ ->
                    True

        notFilteredOut (Property _ value) =
            valueToFilter value
                |> Maybe.andThen (\filter -> Dict.get filter filterOverrides)
                |> Maybe.withDefault Show
                |> (/=) Hide

        toTuple index (Property status value) =
            ( index, status, value )
    in
    location.properties
        |> Array.toList
        |> List.filter exists
        |> List.filter notFilteredOut
        |> List.indexedMap toTuple


getStatus : Location -> Status
getStatus (Location location) =
    location.status


toggleStatus : Status -> Location -> Location
toggleStatus status (Location location) =
    let
        newStatus =
            if location.status == status then
                Unseen

            else
                status
    in
    Location { location | status = newStatus }


toggleProperty : Int -> Location -> Location
toggleProperty index (Location location) =
    case Array.get index location.properties of
        Just (Property status value) ->
            let
                newStatus =
                    if status == Dismissed then
                        Unseen

                    else
                        Dismissed
            in
            Location { location | properties = Array.set index (Property newStatus value) location.properties }

        Nothing ->
            Location location


statusToString : Status -> String
statusToString status =
    case status of
        Unseen ->
            "unseen"

        Seen ->
            "seen"

        Dismissed ->
            "dismissed"


areaToString : Area -> String
areaToString area =
    case area of
        Surface ->
            "surface"

        Underground ->
            "underground"

        Moon ->
            "moon"


isClass : Class -> Location -> Bool
isClass class (Location location) =
    (class == Shops) == location.isShop


type Locations
    = Locations (Dict Key Location)


values : Locations -> List Location
values (Locations locations) =
    Dict.values locations


update : Key -> (Maybe Location -> Maybe Location) -> Locations -> Locations
update key fn (Locations locations) =
    Locations <|
        Dict.update key fn locations


groupByArea : Locations -> List ( Area, List Location )
groupByArea =
    values
        -- gather into (loc1, [loc2, loc3, ...]) tuples by area
        >> List.Extra.gatherEqualsBy getArea
        -- convert the "key" into an Area, and put that location back into the list
        >> List.map (\( loc, locs ) -> ( getArea loc, loc :: locs ))


filterByContext : Class -> Context -> Locations -> Locations
filterByContext class c (Locations locations) =
    let
        undergroundAccess =
            c.flags.pushBToJump
                || Set.member MagmaKey c.attainedRequirements
                || (Dict.get UpperBabil locations |> Maybe.map (getStatus >> (==) Dismissed) |> Maybe.withDefault False)

        attainedRequirements =
            if undergroundAccess then
                Set.insert UndergroundAccess c.attainedRequirements

            else
                c.attainedRequirements

        context =
            { c | attainedRequirements = attainedRequirements }

        -- locations that can be accessed regardless of requirements if we can jump
        jumpable =
            Set.fromList <|
                [ BaronSewer
                , BaronCastle
                , BaronBasement
                , CaveMagnes
                , Zot2
                , CaveEblan
                , CaveEblanShops
                , UpperBabil
                ]

        filters =
            filtersFrom context

        propertiesHaveValue location =
            -- anything overridden to Show has value
            -- anything overridden to Hide doesn't (and isn't returned
            -- by getProperties)
            -- otherwise, characters and key items have value
            -- bosses and chests have value depending on flags
            getProperties context location
                |> List.any
                    (\( _, _, value ) ->
                        case valueToFilter value of
                            Just filter ->
                                Set.member filter filters

                            Nothing ->
                                False
                    )

        hasValue ((Location l) as location) =
            isClass Shops location
                || (l.key == UpperBabil && not undergroundAccess)
                || propertiesHaveValue location

        isRelevant ((Location l) as location) =
            if not <| isClass class location then
                False

            else if l.status == Dismissed then
                -- always show dismissed items if Sbow Checked is on, never otherwise
                Dict.get Checked context.filterOverrides
                    |> Maybe.withDefault Hide
                    |> (==) Show

            else
                hasValue location
                    && areaAccessible attainedRequirements location
                    && (context.flags.pushBToJump && Set.member l.key jumpable || requirementsMet attainedRequirements location)
    in
    locations
        |> Dict.filter (always isRelevant)
        |> Locations


filtersFrom : Context -> Set Filter
filtersFrom context =
    Dict.foldl
        (\filter type_ ->
            case type_ of
                Show ->
                    Set.insert filter

                Hide ->
                    Set.remove filter
        )
        (defaultFiltersFrom context)
        context.filterOverrides


defaultFiltersFrom : Context -> Set Filter
defaultFiltersFrom context =
    let
        outstanding =
            outstandingObjectives context

        {- True if, based on the given Context, bosses may be intrisically
           valuable. Namely, if there are Boss Hunt objectives to fullfil, or a D.Mist
           to find when the Nkey flag is on.
        -}
        bossesHaveValue =
            let
                activeBossHunt =
                    outstanding
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

        onDarkMatterHunt =
            (List.member Objective.DarkMatterHunt <| Array.toList context.flags.objectives)
                && (not <| Set.member Objective.DarkMatterHunt context.completedObjectives)
                && (not <| Set.isEmpty outstanding)

        trappedKeyItems =
            Set.member Trapped context.flags.keyItems
    in
    [ ( Characters, True )
    , ( Bosses, bossesHaveValue )
    , ( KeyItems, True )
    , ( Chests, onDarkMatterHunt )
    , ( TrappedChests, trappedKeyItems )
    ]
        |> List.filter Tuple.second
        |> List.map Tuple.first
        |> Set.fromList


outstandingObjectives : Context -> Set Objective
outstandingObjectives context =
    let
        combinedObjectives =
            context.flags.objectives
                |> Array.toList
                |> Set.fromList
                |> Set.union context.randomObjectives
    in
    if Set.size context.completedObjectives >= context.flags.requiredObjectives then
        Set.empty

    else
        Set.diff combinedObjectives context.completedObjectives


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


valueToFilter : Value -> Maybe Filter
valueToFilter value =
    -- This seems silly. Is this silly?
    case value of
        Character _ ->
            Just Characters

        Boss ->
            Just Bosses

        KeyItem _ ->
            Just KeyItems

        Chest _ ->
            Just Chests

        TrappedChest _ ->
            Just TrappedChests

        Shop ->
            Nothing


all : Locations
all =
    let
        finish : Area -> PartialData -> Data
        finish area l =
            { key = l.key
            , name = l.name
            , area = area
            , isShop = List.member Shop l.value
            , requirements = Set.fromList l.requirements
            , status = Unseen
            , properties =
                l.value
                    |> List.map (Property Unseen)
                    |> Array.fromList
            }
    in
    List.map (finish Surface) surface
        ++ List.map (finish Underground) underground
        ++ List.map (finish Moon) moon
        |> List.map
            (\l ->
                ( l.key, Location l )
            )
        -- reverse so the AssocList dict is in the right order
        |> List.reverse
        |> Dict.fromList
        |> Locations


type alias PartialData =
    { key : Key
    , name : String
    , requirements : List Requirement
    , value : List Value
    }


surface : List PartialData
surface =
    [ { key = MistCave
      , name = "Mist Cave"
      , requirements = []
      , value =
            [ Boss
            , Chest 4
            ]
      }
    , { key = MistVillage
      , name = "Mist Village"
      , requirements = []
      , value =
            [ Chest 7
            ]
      }
    , { key = MistVillageShops
      , name = "Mist Village"
      , requirements = []
      , value =
            [ Shop
            ]
      }
    , { key = MistVillagePackage
      , name = "Mist Village - Package"
      , requirements = [ Package ]
      , value =
            [ Character Gated
            , Boss
            ]
      }
    , { key = MistVillageMom
      , name = "Mist Village - Mom"
      , requirements = [ MistDragon ]
      , value =
            [ KeyItem Main
            ]
      }
    , { key = Kaipo
      , name = "Kaipo"
      , requirements = []
      , value =
            [ Chest 1
            ]
      }
    , { key = KaipoShops
      , name = "Kaipo"
      , requirements = []
      , value =
            [ Shop
            ]
      }
    , { key = KaipoBed
      , name = "Kaipo"
      , requirements = [ SandRuby ]
      , value =
            [ Character Gated
            ]
      }
    , { key = WateryPass
      , name = "Watery Pass"
      , requirements = []
      , value =
            [ Character Ungated
            , Chest 19
            ]
      }
    , { key = Waterfall
      , name = "Waterfall"
      , requirements = []
      , value =
            [ Boss
            , Chest 4
            ]
      }
    , { key = Damcyan
      , name = "Damcyan"
      , requirements = []
      , value =
            [ Character Ungated
            , Chest 13
            ]
      }
    , { key = AntlionCave
      , name = "Antlion Cave"
      , requirements = []
      , value =
            [ Boss
            , KeyItem Main
            , Chest 13
            ]
      }
    , { key = MtHobs
      , name = "Mt. Hobs"
      , requirements = []
      , value =
            [ Boss
            , Character Gated
            , Chest 5
            ]
      }
    , { key = FabulShops
      , name = "Fabul"
      , requirements = []
      , value =
            [ Shop
            ]
      }
    , { key = FabulDefence
      , name = "Fabul Defence"
      , requirements = []
      , value =
            [ Boss
            , KeyItem Main
            , Chest 10
            ]
      }
    , { key = Sheila1
      , name = "Sheila 1"
      , requirements = [ UndergroundAccess ]
      , value =
            [ KeyItem Main
            ]
      }
    , { key = Sheila2
      , name = "Sheila 2"
      , requirements = [ UndergroundAccess, Pan ]
      , value =
            [ KeyItem Main
            ]
      }
    , { key = Mysidia
      , name = "Mysidia"
      , requirements = []
      , value =
            [ Character Ungated
            , Character Ungated
            ]
      }
    , { key = MysidiaShops
      , name = "Mysidia"
      , requirements = []
      , value =
            [ Shop
            ]
      }
    , { key = MtOrdeals
      , name = "Mt. Ordeals"
      , requirements = []
      , value =
            [ Character Ungated
            , Boss
            , Boss
            , KeyItem Main
            , Boss
            , Chest 4
            ]
      }
    , { key = Baron
      , name = "Baron Inn"
      , requirements = []
      , value =
            [ Boss
            , Boss
            , Character Gated
            , KeyItem Main
            , Chest 13
            ]
      }
    , { key = BaronItemShop
      , name = "Baron"
      , requirements = []
      , value =
            [ Shop
            ]
      }
    , { key = BaronWeaponShop
      , name = "Baron Weapon"
      , requirements = [ BaronKey ]
      , value =
            [ Chest 2
            , Shop
            ]
      }
    , { key = BaronSewer
      , name = "Baron Sewer"
      , requirements = [ BaronKey ]
      , value =
            [ Chest 9
            ]
      }
    , { key = BaronCastle
      , name = "Baron Castle"
      , requirements = [ BaronKey ]
      , value =
            [ Boss
            , Boss
            , Character Gated
            , KeyItem Main
            , Chest 20
            ]
      }
    , { key = BaronBasement
      , name = "Baron Castle Basement"
      , requirements = [ BaronKey ]
      , value =
            [ Boss
            , KeyItem Summon
            ]
      }
    , { key = Toroia
      , name = "Toroia"
      , requirements = []
      , value =
            [ Chest 4
            ]
      }
    , { key = ToroiaShops
      , name = "Toroia"
      , requirements = []
      , value =
            [ Shop
            ]
      }
    , { key = ToroiaCastle
      , name = "Toroia Castle"
      , requirements = []
      , value =
            [ KeyItem Free
            , Chest 9
            ]
      }
    , { key = ToroiaTreasury
      , name = "Toroia Treasury"
      , requirements = [ EarthCrystal ]
      , value =
            [ Chest 18
            ]
      }
    , { key = CaveMagnes
      , name = "Cave Magnes"
      , requirements = [ TwinHarp ]
      , value =
            [ Boss
            , KeyItem Main

            -- TODO these chests aren't gated by the TwinHarp
            , Chest 10
            ]
      }
    , { key = Zot1
      , name = "Tower of Zot 1"
      , requirements = []
      , value =
            [ Boss
            , Chest 5
            , TrappedChest 1
            ]
      }
    , { key = Zot2
      , name = "Tower of Zot 2"
      , requirements = [ EarthCrystal ]
      , value =
            [ Character Gated
            , Character Gated
            , Boss
            , KeyItem Main
            ]
      }
    , { key = Agart
      , name = "Agart"
      , requirements = []
      , value =
            [ Chest 1
            ]
      }
    , { key = AgartShops
      , name = "Agart"
      , requirements = []
      , value =
            [ Shop
            ]
      }
    , { key = Silvera
      , name = "Silvera"
      , requirements = []
      , value =
            [ Chest 3
            ]
      }
    , { key = SilveraShops
      , name = "Silvera"
      , requirements = []
      , value =
            [ Shop
            ]
      }
    , { key = AdamantGrotto
      , name = "Adamant Grotto"
      , requirements = [ Hook, RatTail ]
      , value =
            [ KeyItem Main
            ]
      }
    , { key = CastleEblan
      , name = "Castle Eblan"
      , requirements = []
      , value =
            [ Chest 19
            , TrappedChest 3
            ]
      }
    , { key = CaveEblan
      , name = "Cave Eblan"
      , requirements = [ Hook ]
      , value =
            [ Character Gated
            , Chest 21
            , TrappedChest 1
            ]
      }
    , { key = CaveEblanShops
      , name = "Cave Eblan"
      , requirements = [ Hook ]
      , value =
            [ Shop
            ]
      }
    , { key = UpperBabil
      , name = "Upper Bab-il"
      , requirements = [ Hook ]
      , value =
            [ Boss
            , Boss
            , Chest 7
            , TrappedChest 1
            ]
      }
    , { key = Giant
      , name = "Giant of Bab-il"
      , requirements = [ DarknessCrystal ]
      , value =
            [ Boss
            , Boss
            , Character Gated
            , Chest 7
            , TrappedChest 1
            ]
      }
    ]


underground : List PartialData
underground =
    [ { key = DwarfCastle
      , name = "Dwarf Castle"
      , requirements = []
      , value =
            [ Boss
            , Character Gated
            , Boss
            , KeyItem Main
            , KeyItem Warp
            , Chest 18
            ]
      }
    , { key = DwarfCastleShops
      , name = "Dwarf Castle"
      , requirements = []
      , value =
            [ Shop
            ]
      }
    , { key = LowerBabil
      , name = "Lower Bab-il"
      , requirements = []
      , value =
            [ Boss
            , KeyItem Main
            , Chest 12
            , TrappedChest 4
            ]
      }
    , { key = LowerBabilCannon
      , name = "Lower Bab-il - Cannon"
      , requirements = [ TowerKey ]
      , value =
            [ Boss
            , KeyItem Main
            ]
      }
    , { key = SylphCave
      , name = "Sylph Cave"
      , requirements = [ Pan ]
      , value =
            [ KeyItem Summon

            -- TODO these chests aren't gated by the Pan
            , Chest 25
            , TrappedChest 7
            ]
      }
    , { key = Feymarch
      , name = "Feymarch"
      , requirements = []
      , value =
            [ KeyItem Main
            , Chest 20
            , TrappedChest 1
            ]
      }
    , { key = FeymarchShops
      , name = "Feymarch"
      , requirements = []
      , value =
            [ Shop
            ]
      }
    , { key = FeymarchKing
      , name = "Feymarch - King"
      , requirements = []
      , value =
            [ Boss
            , KeyItem Summon
            ]
      }
    , { key = FeymarchQueen
      , name = "Feymarch - Queen"
      , requirements = []
      , value =
            [ Boss
            , KeyItem Summon
            ]
      }
    , { key = Tomra
      , name = "Tomra"
      , requirements = []
      , value =
            [ Chest 6
            ]
      }
    , { key = TomraShops
      , name = "Tomra"
      , requirements = []
      , value =
            [ Shop
            ]
      }
    , { key = SealedCave
      , name = "Sealed Cave"
      , requirements = [ LucaKey ]
      , value =
            [ KeyItem Main
            , Boss
            , Chest 19
            ]
      }
    , { key = Kokkol
      , name = "Kokkol's Forge"
      , requirements = []
      , value =
            [ Chest 4
            ]
      }
    , { key = KokkolShop
      , name = "Kokkol's Forge"
      , requirements = [ LegendSword, Adamant ]
      , value =
            [ Shop
            ]
      }
    ]


moon : List PartialData
moon =
    [ { key = Hummingway
      , name = "Hummingway"
      , requirements = []
      , value =
            [ Shop
            ]
      }
    , { key = CaveBahamut
      , name = "Cave Bahamut"
      , requirements = []
      , value =
            [ Boss
            , KeyItem Summon
            , Chest 4
            ]
      }
    , { key = LunarPath
      , name = "Lunar Path"
      , requirements = []
      , value =
            [ Chest 2
            , TrappedChest 1
            ]
      }
    , { key = LunarSubterrane
      , name = "Lunar Dais"
      , requirements = []
      , value =
            [ Character Gated
            , Chest 21
            , TrappedChest 9
            ]
      }
    , { key = MurasameAltar
      , name = "Murasame Altar"
      , requirements = []
      , value =
            [ Boss
            , KeyItem MoonBoss
            ]
      }
    , { key = WyvernAltar
      , name = "Wyvern Altar"
      , requirements = []
      , value =
            [ Boss
            , KeyItem MoonBoss
            ]
      }
    , { key = WhiteSpearAltar
      , name = "White Spear Altar"
      , requirements = []
      , value =
            [ Boss
            , KeyItem MoonBoss
            ]
      }
    , { key = RibbonRoom
      , name = "Ribbon Room"
      , requirements = []
      , value =
            [ Boss
            , KeyItem MoonBoss
            ]
      }
    , { key = MasamuneAltar
      , name = "Masamune Altar"
      , requirements = []
      , value =
            [ Boss
            , KeyItem MoonBoss
            ]
      }
    ]
