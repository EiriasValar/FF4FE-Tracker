module Location exposing
    ( Area
    , Class(..)
    , Context
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
    , shops
    , statusToString
    , toggleProperty
    , toggleStatus
    , update
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
    | Chests Int
    | TrappedChests Int


type CharacterType
    = Ungated
    | Gated


type Key
    = MistCave
    | MistVillagePackage
    | MistVillageMom
    | KaipoBed
    | WateryPass
    | Waterfall
    | Damcyan
    | AntlionCave
    | MtHobs
    | FabulDefence
    | Sheila
    | SheilaPan
    | AdamantGrotto
    | MysidiaElder
    | MtOrdeals
    | BaronInn
    | BaronCastle
    | BaronBasement
    | ToroiaBed
    | CaveMagnes
    | TowerZot1
    | TowerZot2
    | CaveEblan
    | UpperBabil
    | GiantBabil
    | DwarfCastleThrone
    | LowerBabilCannon
    | LowerBabilTop
    | SylphCave
    | FeymarchChest
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
    | Shop Shop


type Shop
    = Baron
    | MistVillage
    | Kaipo
    | Fabul
    | Mysidia
    | Toroia
    | Agart
    | Silvera
    | Eblan
    | DwarfCastle
    | Tomra
    | Feymarch
    | Kokkol
    | Hummingway


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
    , showChecked : Bool
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
regardless of their Status. The Int is the index of the property within
the location, for use with toggleProperty.
-}
getProperties : Context -> Location -> List ( Int, Status, Value )
getProperties { flags, warpGlitchUsed } (Location location) =
    let
        filterProperty index (Property status value) =
            let
                keep =
                    Just ( index, status, value )
            in
            case value of
                Character Ungated ->
                    if flags.noFreeChars then
                        Nothing

                    else
                        keep

                Character Gated ->
                    if flags.classicGiantObjective && location.key == GiantBabil then
                        Nothing

                    else
                        keep

                Boss ->
                    keep

                KeyItem itemClass ->
                    if warpGlitchUsed && location.key == SealedCave then
                        Nothing

                    else if Set.member itemClass flags.keyItems then
                        keep

                    else
                        Nothing

                Chests _ ->
                    keep

                TrappedChests _ ->
                    keep
    in
    location.properties
        |> Array.indexedMap filterProperty
        |> Array.toList
        |> List.filterMap identity


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
    case ( class, location.key ) of
        ( Shops, Shop _ ) ->
            True

        ( Shops, _ ) ->
            False

        ( Checks, Shop _ ) ->
            False

        ( Checks, _ ) ->
            True


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

        -- don't want to call this repeatedly for each location when it depends only on the context
        bossesRelevant =
            bossesHaveValue context

        -- locations that can be accessed regardless of requirements if we can jump
        jumpable =
            Set.fromList <|
                [ BaronCastle
                , BaronBasement
                , CaveMagnes
                , TowerZot2
                , Shop Eblan
                , CaveEblan
                , UpperBabil
                ]

        propertiesHaveValue location =
            getProperties context location
                |> List.any
                    (\( _, _, value ) ->
                        case value of
                            Character _ ->
                                True

                            Boss ->
                                bossesRelevant

                            KeyItem _ ->
                                True

                            _ ->
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
                -- always show dismissed items if showChecked is on, never if it's off
                context.showChecked

            else
                hasValue location
                    && areaAccessible attainedRequirements location
                    && (context.flags.pushBToJump && Set.member l.key jumpable || requirementsMet attainedRequirements location)
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
        finish : Area -> PartialData -> Data
        finish area l =
            { key = l.key
            , name = l.name
            , area = area
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
        ++ shops
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
            ]
      }
    , { key = Waterfall
      , name = "Waterfall"
      , requirements = []
      , value =
            [ Boss
            ]
      }
    , { key = Damcyan
      , name = "Damcyan"
      , requirements = []
      , value =
            [ Character Ungated
            ]
      }
    , { key = AntlionCave
      , name = "Antlion Cave"
      , requirements = []
      , value =
            [ Boss
            , KeyItem Main
            ]
      }
    , { key = MtHobs
      , name = "Mt. Hobs"
      , requirements = []
      , value =
            [ Boss
            , Character Gated
            ]
      }
    , { key = FabulDefence
      , name = "Fabul Defence"
      , requirements = []
      , value =
            [ Boss
            , KeyItem Main
            ]
      }
    , { key = Sheila
      , name = "Sheila"
      , requirements = [ UndergroundAccess ]
      , value =
            [ KeyItem Main
            ]
      }
    , { key = SheilaPan
      , name = "Sheila - Pan"
      , requirements = [ UndergroundAccess, Pan ]
      , value =
            [ KeyItem Main
            ]
      }
    , { key = AdamantGrotto
      , name = "Adamant Grotto"
      , requirements = [ Hook, RatTail ]
      , value =
            [ KeyItem Main
            ]
      }
    , { key = MysidiaElder
      , name = "Mysidia"
      , requirements = []
      , value =
            [ Character Ungated
            , Character Ungated
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
            ]
      }
    , { key = BaronInn
      , name = "Baron Inn"
      , requirements = []
      , value =
            [ Boss
            , Boss
            , Character Gated
            , KeyItem Main
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
    , { key = ToroiaBed
      , name = "Edward in Toroia"
      , requirements = []
      , value =
            [ KeyItem Free
            ]
      }
    , { key = CaveMagnes
      , name = "Cave Magnes"
      , requirements = [ TwinHarp ]
      , value =
            [ Boss
            , KeyItem Main
            ]
      }
    , { key = TowerZot1
      , name = "Tower of Zot 1"
      , requirements = []
      , value =
            [ Boss
            ]
      }
    , { key = TowerZot2
      , name = "Tower of Zot 2"
      , requirements = [ EarthCrystal ]
      , value =
            [ Character Gated
            , Character Gated
            , Boss
            , KeyItem Main
            ]
      }
    , { key = CaveEblan
      , name = "Cave Eblan"
      , requirements = [ Hook ]
      , value =
            [ Character Gated
            ]
      }
    , { key = UpperBabil
      , name = "Upper Bab-il"
      , requirements = [ Hook ]
      , value =
            [ Boss
            , Boss
            ]
      }
    , { key = GiantBabil
      , name = "Giant of Bab-il"
      , requirements = [ DarknessCrystal ]
      , value =
            [ Boss
            , Boss
            , Character Gated
            ]
      }
    ]


underground : List PartialData
underground =
    [ { key = DwarfCastleThrone
      , name = "Dwarf Castle"
      , requirements = []
      , value =
            [ Boss
            , Character Gated
            , Boss
            , KeyItem Main
            , KeyItem Warp
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
    , { key = LowerBabilTop
      , name = "Lower Bab-il - Top"
      , requirements = []
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
            ]
      }
    , { key = FeymarchChest
      , name = "Feymarch"
      , requirements = []
      , value =
            [ KeyItem Main
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
    , { key = SealedCave
      , name = "Sealed Cave"
      , requirements = [ LucaKey ]
      , value =
            [ KeyItem Main
            , Boss
            ]
      }
    ]


moon : List PartialData
moon =
    [ { key = LunarDais
      , name = "Lunar Dais"
      , requirements = []
      , value =
            [ Character Gated
            ]
      }
    , { key = CaveBahamut
      , name = "Cave Bahamut"
      , requirements = []
      , value =
            [ Boss
            , KeyItem Summon
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


shops : List Data
shops =
    [ { key = Shop Baron
      , name = "Baron"
      , area = Surface
      , requirements = []
      }
    , { key = Shop MistVillage
      , name = "Mist Village"
      , area = Surface
      , requirements = []
      }
    , { key = Shop Kaipo
      , name = "Kaipo"
      , area = Surface
      , requirements = []
      }
    , { key = Shop Fabul
      , name = "Fabul"
      , area = Surface
      , requirements = []
      }
    , { key = Shop Mysidia
      , name = "Mysidia"
      , area = Surface
      , requirements = []
      }
    , { key = Shop Toroia
      , name = "Toroia"
      , area = Surface
      , requirements = []
      }
    , { key = Shop Agart
      , name = "Agart"
      , area = Surface
      , requirements = []
      }
    , { key = Shop Silvera
      , name = "Silvera"
      , area = Surface
      , requirements = []
      }
    , { key = Shop Eblan
      , name = "Eblan"
      , area = Surface
      , requirements = [ Hook ]
      }
    , { key = Shop DwarfCastle
      , name = "Dwarf Castle"
      , area = Underground
      , requirements = []
      }
    , { key = Shop Tomra
      , name = "Tomra"
      , area = Underground
      , requirements = []
      }
    , { key = Shop Feymarch
      , name = "Feymarch"
      , area = Underground
      , requirements = []
      }
    , { key = Shop Kokkol
      , name = "Kokkol's Forge"
      , area = Underground
      , requirements = [ LegendSword, Adamant ]
      }
    , { key = Shop Hummingway
      , name = "Hummingway"
      , area = Moon
      , requirements = []
      }
    ]
        |> List.map
            (\l ->
                { key = l.key
                , name = l.name
                , area = l.area
                , requirements = Set.fromList l.requirements
                , status = Unseen
                , properties = Array.empty
                }
            )
