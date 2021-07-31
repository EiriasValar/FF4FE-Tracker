module Location exposing
    ( Area
    , Class(..)
    , ConsumableItem
    , ConsumableItems
    , Context
    , Filter(..)
    , FilterType(..)
    , Key(..)
    , Location
    , Locations
    , PseudoRequirement(..)
    , Requirement(..)
    , ShopValue(..)
    , Status(..)
    , Value(..)
    , all
    , areaToString
    , countable
    , filterByContext
    , filterItems
    , get
    , getArea
    , getItems
    , getKey
    , getName
    , getProperties
    , getProperty
    , getStatus
    , groupByArea
    , insert
    , isPseudo
    , setText
    , statusToString
    , toggleItem
    , toggleProperty
    , toggleStatus
    , undismissByGatingRequirement
    , update
    , values
    )

import Array exposing (Array)
import Array.Extra
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


type Property
    = Property Status Value


type Status
    = Unseen
    | Seen
    | SeenSome Int
    | Dismissed


type Value
    = Character CharacterType
    | Boss
    | KeyItem KeyItemClass
    | Chest Int -- excluding trapped chests
    | TrappedChest Int
    | Shop ShopValue
    | Requirement Requirement
    | GatedValue Requirement Value


type CharacterType
    = Ungated
    | Gated


type ShopValue
    = Weapon
    | Armour
    | Item -- pseudo-value for Location definition; gets expanded into Healing/JItem
    | Healing ConsumableItems
    | JItem ConsumableItems
    | Other String


{-| Opaque so we can enforce filtering
-}
type ConsumableItems
    = ConsumableItems (Array ConsumableItem)


type alias ConsumableItem =
    { name : String
    , tier : Int
    , isJItem : Bool
    , status : Status
    }


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


type Key
    = MistCave
    | MistVillage
    | MistVillageShops
    | MistVillagePackage
    | MistVillageMom
    | Kaipo
    | KaipoShops
    | WateryPass
    | Waterfall
    | Damcyan
    | AntlionCave
    | MtHobs
    | FabulShops
    | FabulDefence
    | Sheila
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
    | Zot
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
    | Pseudo PseudoRequirement


type PseudoRequirement
    = Pass
    | MistDragon
    | UndergroundAccess
    | YangTalk
    | YangBonk
    | Falcon


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
getProperties context location =
    getProperties_ context True location


getProperties_ : Context -> Bool -> Location -> List ( Int, Status, Value )
getProperties_ context unwrapGatedValues (Location location) =
    let
        -- certain values don't exist under certain flags
        -- note the free key item from Edward has its own key item class rather than
        -- being special-cased here
        exists value =
            case value of
                Character Ungated ->
                    not context.flags.noFreeChars

                Character Gated ->
                    not <| context.flags.classicGiantObjective && location.key == Giant

                KeyItem itemClass ->
                    not (context.warpGlitchUsed && location.key == SealedCave)
                        -- under Kvanilla, Baron Castle only has a key item if it's the Pass
                        && not (location.key == BaronCastle && itemClass == Vanilla && not context.flags.passIsKeyItem)
                        && Set.member itemClass context.flags.keyItems

                GatedValue required v ->
                    case ( context.flags.pushBToJump, location.key, v ) of
                        ( True, Zot, _ ) ->
                            -- PBTJ lets us access all gated requirements in Zot
                            exists v

                        ( True, CaveMagnes, KeyItem _ ) ->
                            -- PBTJ lets us access the gated Key Item in Magnes
                            -- (but not the Boss)
                            exists v

                        _ ->
                            -- otherwise, gated value exists if we have
                            -- its gating requirement, and the value itself
                            -- exists
                            Set.member required context.attainedRequirements
                                && exists v

                Shop shopValue ->
                    let
                        passesNightMode =
                            not context.flags.nightMode
                                || (location.area /= Surface)
                                || (location.key == BaronWeaponShop)
                                || (location.key == CaveEblanShops)
                                || (location.key == ToroiaShops && (not <| List.member shopValue [ Weapon, Armour ]))

                        hasValue =
                            case shopValue of
                                Weapon ->
                                    not context.flags.kleptomania

                                Armour ->
                                    not context.flags.kleptomania

                                Healing items ->
                                    not <| List.isEmpty <| filterItems context (Location location) items

                                JItem items ->
                                    not <| List.isEmpty <| filterItems context (Location location) items

                                _ ->
                                    True
                    in
                    passesNightMode && hasValue

                _ ->
                    True

        notFilteredOut (Property _ value) =
            valueToFilter value
                |> Maybe.andThen (\filter -> Dict.get filter context.filterOverrides)
                |> Maybe.withDefault Show
                |> (/=) Hide

        unwrapGatedValue value =
            case ( unwrapGatedValues, value ) of
                ( True, GatedValue _ v ) ->
                    v

                _ ->
                    value

        toTuple ( index, Property status value ) =
            ( index, status, unwrapGatedValue value )
    in
    location.properties
        -- extract indices before doing any filtering so they're accurate
        |> Array.toIndexedList
        |> List.filter (\( _, Property _ value ) -> exists value)
        |> List.filter (Tuple.second >> notFilteredOut)
        |> List.map toTuple


{-| For the given property index, returns a list – filtered by the given Context
– of all the ConsumableItems in that property's value, if any. The returned Ints
are the indices of the items within the property, for use with toggleItem.
-}
getItems : Context -> Int -> Location -> List ( Int, ConsumableItem )
getItems context valueIndex (Location location) =
    case Array.get valueIndex location.properties of
        Just (Property _ (Shop (Healing items))) ->
            filterItems context (Location location) items

        Just (Property _ (Shop (JItem items))) ->
            filterItems context (Location location) items

        _ ->
            []


type ShopType
    = UngatedShop
    | GatedShop
    | SmithyShop


{-| Filters the ConsumableItems to just those that exist, given the Context and
Location.
-}
filterItems : Context -> Location -> ConsumableItems -> List ( Int, ConsumableItem )
filterItems { flags } (Location location) (ConsumableItems items) =
    let
        shopType =
            if location.key == KokkolShop then
                SmithyShop

            else if Set.isEmpty location.requirements && location.area == Surface then
                UngatedShop

            else
                GatedShop

        exists item =
            if item.name == "Life" && flags.noLifePots then
                False

            else if item.name == "Siren" && flags.noSirens then
                False

            else if item.isJItem && flags.noJItems then
                False

            else
                case ( flags.shopRandomization, shopType ) of
                    ( Flags.Standard, UngatedShop ) ->
                        item.tier <= 4

                    ( Flags.Standard, GatedShop ) ->
                        item.tier <= 5

                    ( Flags.Standard, SmithyShop ) ->
                        item.tier == 6

                    ( Flags.Pro, UngatedShop ) ->
                        item.tier <= 3

                    ( Flags.Pro, GatedShop ) ->
                        item.tier <= 4

                    ( Flags.Pro, SmithyShop ) ->
                        List.member item.tier [ 5, 6 ]

                    _ ->
                        True
    in
    items
        |> Array.toIndexedList
        |> List.filter (Tuple.second >> exists)


getStatus : Location -> Status
getStatus (Location location) =
    location.status


toggleStatus : Context -> Status -> Location -> Location
toggleStatus context status (Location location) =
    let
        newStatus =
            toggleStatus_ status location.status

        properties =
            if newStatus == Dismissed then
                Array.map dismissSpecialValue location.properties

            else
                location.properties

        -- It would feel a little redundant and visually busy to mark as
        -- dismissed each value icon when we dismiss the location (and also
        -- potentially incorrect: sometimes you dismiss a location not because
        -- you cleared it, but because you don't want to see it) – but for
        -- Requirement values, which affect other location accessibility, it
        -- makes sense, particularly at locations that can be visited multiple
        -- times (i.e. Sylph Cave, Sheila).
        dismissSpecialValue (Property propStatus value) =
            let
                newPropStatus =
                    case value of
                        Requirement _ ->
                            Dismissed

                        GatedValue required v ->
                            case ( Set.member required context.attainedRequirements, v, location.key ) of
                                ( True, Requirement _, _ ) ->
                                    Dismissed

                                ( True, KeyItem _, Sheila ) ->
                                    -- Sheila's the only location with two (gated) key items
                                    -- that we might get on separate trips; mark them completed
                                    -- when the location is dismissed so things are clear when
                                    -- the location gets automatically undismissed when we bonk Yang
                                    Dismissed

                                _ ->
                                    propStatus

                        _ ->
                            propStatus
            in
            Property newPropStatus value
    in
    Location
        { location
            | status = newStatus
            , properties = properties
        }


{-| Returns the info for the property at the given index for the given location,
assuming they exist. No context filtering: we assume if you have the index for a
property, it's visible. GatedValue is likewise unconditionally unpacked: if you
don't have its gating requirement, you can't have had it returned by
getProperties.
-}
getProperty : Key -> Int -> Locations -> Maybe ( Status, Value )
getProperty key index (Locations locations) =
    Dict.get key locations
        |> Maybe.andThen
            (\(Location location) ->
                Array.get index location.properties
            )
        |> Maybe.map
            (\(Property status value) ->
                case value of
                    GatedValue _ v ->
                        ( status, v )

                    _ ->
                        ( status, value )
            )


{-| Advance the given property of the given location to its next logical
state.

For countable properties, the Status progression is:
Unseen -> SeenSome 1 -> SeenSome 2 -> ... -> SeenSome x-1 -> Dismissed -> Unseen
For other properties, or if the `hard` flag is True, it's simply:
Unseen -> Dismissed -> Unseen
as we have no use for the Seen state for properties.

-}
toggleProperty : Int -> Bool -> Location -> Location
toggleProperty index hard (Location location) =
    case Array.get index location.properties of
        Just (Property status value) ->
            let
                newStatus =
                    case ( hard, countable value, status ) of
                        ( False, Just total, Unseen ) ->
                            if total > 1 then
                                SeenSome 1

                            else
                                -- if there's only 1 of the thing, we skip
                                -- SeenSome and go straight to Dismissed
                                Dismissed

                        ( False, Just total, SeenSome seen ) ->
                            if seen + 1 < total then
                                SeenSome <| seen + 1

                            else
                                Dismissed

                        ( _, _, Dismissed ) ->
                            Unseen

                        _ ->
                            Dismissed
            in
            Location { location | properties = Array.set index (Property newStatus value) location.properties }

        Nothing ->
            Location location


{-| Toggle the status of the given shop value's given item; also update the
status of the shop value itself, to Dismissed if any of its items are, or Unseen
if none of them are.
-}
toggleItem : Int -> Int -> Location -> Location
toggleItem valueIndex itemIndex (Location location) =
    let
        toggle : Property -> Property
        toggle (Property status value) =
            let
                ( newStatus, newValue ) =
                    case value of
                        Shop (Healing items) ->
                            fromItems items
                                |> Tuple.mapSecond (Shop << Healing)

                        Shop (JItem items) ->
                            fromItems items
                                |> Tuple.mapSecond (Shop << JItem)

                        _ ->
                            ( status, value )

                fromItems : ConsumableItems -> ( Status, ConsumableItems )
                fromItems (ConsumableItems items) =
                    let
                        newItems =
                            Array.Extra.update
                                itemIndex
                                (\item -> { item | status = toggleStatus_ Dismissed item.status })
                                items

                        newStatus_ =
                            if newItems |> Array.toList |> List.any (.status >> (==) Dismissed) then
                                Dismissed

                            else
                                Unseen
                    in
                    ( newStatus_, ConsumableItems newItems )
            in
            Property newStatus newValue
    in
    Location { location | properties = Array.Extra.update valueIndex toggle location.properties }


{-| Set the string in the Location's Shop Other property at the given index.
-}
setText : Int -> String -> Location -> Location
setText valueIndex newText (Location location) =
    let
        set : Property -> Property
        set (Property _ value) =
            let
                newStatus =
                    if newText == "" then
                        Unseen

                    else
                        Dismissed

                newValue =
                    case value of
                        Shop (Other _) ->
                            Shop <| Other newText

                        _ ->
                            value
            in
            Property newStatus newValue
    in
    Location { location | properties = Array.Extra.update valueIndex set location.properties }


statusToString : Status -> String
statusToString status =
    case status of
        Unseen ->
            "unseen"

        Seen ->
            "seen"

        SeenSome _ ->
            "seen-some"

        Dismissed ->
            "dismissed"


{-| "Toggle" the existing status with respect to the given "on" state: if they're the
same, toggle "off" (to Unseen); otherwise, set to "on".

This is to accommodate treating either Seen or Dismissed as the "on" state,
while also being able to switch directly from one to the other.

    Unseen |> statusToggle Dismissed
    --> Dismissed
    Dismissed |> statusToggle Dismissed
    --> Unseen
    Dismissed |> statusToggle Seen
    --> Seen

-}
toggleStatus_ : Status -> Status -> Status
toggleStatus_ on existing =
    if on == existing then
        Unseen

    else
        on


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


get : Key -> Locations -> Maybe Location
get key (Locations locations) =
    Dict.get key locations


values : Locations -> List Location
values (Locations locations) =
    Dict.values locations


insert : Location -> Locations -> Locations
insert location locations =
    -- use Dict.update rather than Dict.insert so the order is preserved
    update (getKey location) (always <| Just location) locations


update : Key -> (Maybe Location -> Maybe Location) -> Locations -> Locations
update key fn (Locations locations) =
    Locations <|
        Dict.update key fn locations


{-| Updates any Locations that have a GatedValue gated by the given Requirement,
setting their status to Unseen.

I.e. if the Pan's just been acquired, and Sylph Cave is Dismissed, set it to
Unseen because there's something new to do there now.

-}
undismissByGatingRequirement : Context -> Requirement -> Locations -> Locations
undismissByGatingRequirement context requirement (Locations locations) =
    let
        updateLocation ((Location l) as location) =
            if hasGatedValue location then
                Location { l | status = Unseen }

            else
                location

        hasGatedValue : Location -> Bool
        hasGatedValue =
            getProperties_ context False
                >> List.any
                    (\( _, _, value ) ->
                        case value of
                            GatedValue req _ ->
                                req == requirement

                            _ ->
                                False
                    )
    in
    Locations <| Dict.map (always updateLocation) locations


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
                || Set.member (Pseudo Falcon) c.attainedRequirements

        attainedRequirements =
            if undergroundAccess then
                Set.insert (Pseudo UndergroundAccess) c.attainedRequirements

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
                , CaveEblan
                , CaveEblanShops
                , UpperBabil
                ]

        filters =
            filtersFrom context

        propertiesHaveValue location =
            -- getProperties and filtersFrom have done all the heavy lifting
            -- of pruning the list of properties to just the ones appropriate
            -- to the context we're in
            getProperties context location
                |> List.any
                    (\( _, status, value ) ->
                        case ( value, valueToFilter value ) of
                            ( Requirement (Pseudo Falcon), _ ) ->
                                -- the Falcon only has value if we don't have a
                                -- way underground yet – but if our underground
                                -- access IS the Falcon being checked off,
                                -- continue to treat it as valuable so the
                                -- location doesn't disappear
                                status == Dismissed || not undergroundAccess

                            ( Requirement _, _ ) ->
                                -- other Requirements are always valuable
                                True

                            ( Shop _, _ ) ->
                                -- shops are always valuable
                                True

                            ( _, Just filter ) ->
                                -- anything else is valuable if it's in the set of
                                -- positive filters
                                Set.member filter filters

                            _ ->
                                -- anything else is likely invisible metadata
                                False
                    )

        isRelevant ((Location l) as location) =
            if not <| isClass class location then
                False

            else if l.status == Dismissed then
                -- always show Dismissed items if that filter is set to Show
                Dict.get Checked context.filterOverrides
                    |> Maybe.withDefault Hide
                    |> (==) Show

            else
                propertiesHaveValue location
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
                        && (not <| Set.member (Pseudo MistDragon) context.attainedRequirements)
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
            Set.member (Pseudo UndergroundAccess) attained

        Moon ->
            Set.member DarknessCrystal attained


requirementsMet : Set Requirement -> Location -> Bool
requirementsMet attained (Location location) =
    Set.diff location.requirements attained
        |> Set.isEmpty


isPseudo : Requirement -> Bool
isPseudo requirement =
    case requirement of
        Pseudo _ ->
            True

        _ ->
            False


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

        Shop _ ->
            Nothing

        Requirement _ ->
            Nothing

        GatedValue _ _ ->
            -- we could unwrap the gated value and call `valueToFilter` on it,
            -- but we actually shouldn't ever wind up calling this on a
            -- GatedValue; leave it Nothing so we notice if we do
            Nothing


countable : Value -> Maybe Int
countable value =
    case value of
        Chest c ->
            Just c

        TrappedChest c ->
            Just c

        _ ->
            Nothing


all : Locations
all =
    let
        isShop value =
            case value of
                Shop _ ->
                    True

                _ ->
                    False

        expandShop value =
            case value of
                Shop Item ->
                    [ Shop <| Healing healingItems, Shop <| JItem jItems ]

                _ ->
                    [ value ]

        addOther vals =
            if List.any isShop vals then
                vals ++ [ Shop <| Other "" ]

            else
                vals

        finish : Area -> PartialData -> Data
        finish area l =
            { key = l.key
            , name = l.name
            , area = area
            , isShop = List.any isShop l.value
            , requirements = Set.fromList l.requirements
            , status = Unseen
            , properties =
                l.value
                    |> List.concatMap expandShop
                    |> addOther
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
            [ Shop Weapon
            , Shop Armour
            ]
      }
    , { key = MistVillagePackage
      , name = "Mist - Package"
      , requirements = [ Package ]
      , value =
            [ Character Gated
            , Boss
            ]
      }
    , { key = MistVillageMom
      , name = "Mist - Mom"
      , requirements = [ Pseudo MistDragon ]
      , value =
            [ KeyItem Main
            , KeyItem Vanilla
            ]
      }
    , { key = Kaipo
      , name = "Kaipo"
      , requirements = []
      , value =
            [ GatedValue SandRuby <| Character Gated
            , Chest 1
            ]
      }
    , { key = KaipoShops
      , name = "Kaipo"
      , requirements = []
      , value =
            [ Shop Weapon
            , Shop Armour
            , Shop Item
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
            , KeyItem Vanilla
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
            [ Shop Weapon
            , Shop Armour
            , Shop Item
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
    , { key = Sheila
      , name = "Sheila"
      , requirements = []
      , value =
            [ GatedValue (Pseudo YangTalk) (KeyItem Main)
            , GatedValue (Pseudo YangTalk) (KeyItem Vanilla)
            , GatedValue (Pseudo YangBonk) (KeyItem Main)
            , GatedValue (Pseudo YangBonk) (KeyItem Vanilla)
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
            [ Shop Weapon
            , Shop Armour
            , Shop Item
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
            , KeyItem Vanilla
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
            , KeyItem Vanilla
            , Chest 13
            ]
      }
    , { key = BaronItemShop
      , name = "Baron"
      , requirements = []
      , value =
            [ Shop Item
            ]
      }
    , { key = BaronWeaponShop
      , name = "Baron"
      , requirements = [ BaronKey ]
      , value =
            [ Shop Weapon
            , Shop Armour

            -- not worth the hassle!
            -- , Chest 2
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
            , KeyItem Vanilla
            , Chest 20
            ]
      }
    , { key = BaronBasement
      , name = "Baron Basement"
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
            [ Shop Weapon
            , Shop Armour
            , Shop Item
            ]
      }
    , { key = ToroiaCastle
      , name = "Toroia Castle"
      , requirements = []
      , value =
            [ KeyItem Free -- also Vanilla
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
      , requirements = []
      , value =
            [ GatedValue TwinHarp Boss
            , GatedValue TwinHarp <| KeyItem Main
            , GatedValue TwinHarp <| KeyItem Vanilla
            , Chest 10
            ]
      }
    , { key = Zot
      , name = "Tower of Zot"
      , requirements = []
      , value =
            [ Boss
            , GatedValue EarthCrystal <| Character Gated
            , GatedValue EarthCrystal <| Character Gated
            , GatedValue EarthCrystal <| Boss
            , GatedValue EarthCrystal <| KeyItem Main
            , GatedValue EarthCrystal <| KeyItem Vanilla
            , Chest 5
            , TrappedChest 1
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
            [ Shop Weapon
            , Shop Armour
            , Shop Item
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
            [ Shop Weapon
            , Shop Armour
            , Shop Item
            ]
      }
    , { key = AdamantGrotto
      , name = "Adamant Grotto"
      , requirements = [ Hook, RatTail ]
      , value =
            [ KeyItem Main
            , KeyItem Vanilla
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
      , name = "Eblan"
      , requirements = [ Hook ]
      , value =
            [ Shop Weapon
            , Shop Armour
            , Shop Item
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
            , Requirement <| Pseudo Falcon
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
            , KeyItem Vanilla
            , KeyItem Warp -- also Vanilla
            , Chest 18
            ]
      }
    , { key = DwarfCastleShops
      , name = "Dwarf Castle"
      , requirements = []
      , value =
            [ Shop Weapon
            , Shop Armour
            , Shop Item
            ]
      }
    , { key = LowerBabil
      , name = "Lower Bab-il"
      , requirements = []
      , value =
            [ Boss
            , KeyItem Main
            , KeyItem Vanilla
            , Chest 12
            , TrappedChest 4
            ]
      }
    , { key = LowerBabilCannon
      , name = "Super Cannon"
      , requirements = [ TowerKey ]
      , value =
            [ Boss
            , KeyItem Main
            , KeyItem Vanilla
            ]
      }
    , { key = SylphCave
      , name = "Sylph Cave"
      , requirements = []
      , value =
            [ Requirement <| Pseudo YangTalk
            , GatedValue Pan (Requirement <| Pseudo YangBonk)
            , GatedValue Pan (KeyItem Summon)
            , Chest 25
            , TrappedChest 7
            ]
      }
    , { key = Feymarch
      , name = "Feymarch"
      , requirements = []
      , value =
            [ KeyItem Main
            , KeyItem Vanilla
            , Chest 20
            , TrappedChest 1
            ]
      }
    , { key = FeymarchShops
      , name = "Feymarch"
      , requirements = []
      , value =
            [ Shop Weapon
            , Shop Armour
            , Shop Item
            ]
      }
    , { key = FeymarchKing
      , name = "Feymarch King"
      , requirements = []
      , value =
            [ Boss
            , KeyItem Summon
            ]
      }
    , { key = FeymarchQueen
      , name = "Feymarch Queen"
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
            [ Shop Weapon
            , Shop Armour
            , Shop Item
            ]
      }
    , { key = SealedCave
      , name = "Sealed Cave"
      , requirements = [ LucaKey ]
      , value =
            [ KeyItem Main
            , KeyItem Vanilla
            , Boss
            , Chest 19
            ]
      }
    , { key = Kokkol
      , name = "Kokkol"
      , requirements = []
      , value =
            [ Chest 4
            ]
      }
    , { key = KokkolShop
      , name = "Kokkol"
      , requirements = [ LegendSword, Adamant ]
      , value =
            [ Shop Weapon
            , Shop Armour
            , Shop Item
            ]
      }
    ]


moon : List PartialData
moon =
    [ { key = Hummingway
      , name = "Hummingway"
      , requirements = []
      , value =
            [ Shop Item
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
      , name = "Lunar Palace"
      , requirements = []
      , value =
            [ Character Gated
            , Chest 21
            , TrappedChest 9
            ]
      }
    , { key = MurasameAltar
      , name = "Altar 1 (Murasame)"
      , requirements = []
      , value =
            [ Boss
            , KeyItem MoonBoss
            ]
      }
    , { key = WyvernAltar
      , name = "Altar 2 (Crystal Sword)"
      , requirements = []
      , value =
            [ Boss
            , KeyItem MoonBoss
            ]
      }
    , { key = WhiteSpearAltar
      , name = "Altar 3 (White Spear)"
      , requirements = []
      , value =
            [ Boss
            , KeyItem MoonBoss
            ]
      }
    , { key = RibbonRoom
      , name = "Altar 4 (Ribbons)"
      , requirements = []
      , value =
            [ Boss
            , KeyItem MoonBoss
            ]
      }
    , { key = MasamuneAltar
      , name = "Altar 5 (Masamune)"
      , requirements = []
      , value =
            [ Boss
            , KeyItem MoonBoss
            ]
      }
    ]


healingItems : ConsumableItems
healingItems =
    [ { name = "Cure2"
      , tier = 3
      }
    , { name = "Cure3"
      , tier = 4
      }
    , { name = "Life"
      , tier = 2
      }
    , { name = "Ether"
      , tier = 3
      }
    , { name = "Status-healing"
      , tier = 1
      }
    ]
        |> List.map
            (\{ name, tier } ->
                { name = name
                , tier = tier
                , isJItem = False
                , status = Unseen
                }
            )
        |> Array.fromList
        |> ConsumableItems


jItems : ConsumableItems
jItems =
    [ { name = "Bacchus"
      , tier = 5
      }
    , { name = "Coffin"
      , tier = 5
      }
    , { name = "Hourglass"
      , tier = 5
      }
    , { name = "Moonveil"
      , tier = 6
      }
    , { name = "Siren"
      , tier = 5
      }
    , { name = "Starveil"
      , tier = 2
      }
    , { name = "Vampire"
      , tier = 4
      }
    ]
        |> List.map
            (\{ name, tier } ->
                { name = name
                , tier = tier
                , isJItem = True
                , status = Unseen
                }
            )
        |> Array.fromList
        |> ConsumableItems
