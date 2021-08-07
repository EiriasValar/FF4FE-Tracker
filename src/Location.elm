module Location exposing
    ( Area
    , BossStats
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
import Objective exposing (Key(..))


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
    | Boss BossStats
    | KeyItem KeyItemClass
    | Chest Int -- excluding trapped chests
    | TrappedChest Int
    | Shop ShopValue
    | Requirement Requirement
    | Objective Objective.Key
    | GatedValue Requirement Value


type CharacterType
    = Ungated
    | Gated


{-| Most stats are sourced from the FF3FE Boss Scaling Stats doc:
<https://docs.google.com/spreadsheets/d/1hJZsbzStQfMCQUFzjW9pbdLhJ99wLu1QY-5cmp7Peqg/edit>
The actual stats will vary depending on the boss who appears in a spot; I've
tried to populate them with "representative" values for a "normal" boss. The
Magic stats in particular are very hand-wavy.

Valvalis' MDef is from Inven's Valvalis Reference:
<https://docs.google.com/spreadsheets/d/1tVQFvlQ_4oWCn0EE9d7QAGrYW3w2IbZzuO2MWuUC8ww/edit>

-}
type alias BossStats =
    { hp : Int
    , exp : Int
    , gp : Int
    , atkMult : Int
    , hit : Int
    , atk : Int
    , minSpeed : Int
    , maxSpeed : Int
    , mag : Int
    , valvalisMDef : Int
    }


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
    | Forge


type Area
    = Surface
    | Underground
    | Moon


type alias Context =
    { flags : Flags
    , randomObjectives : Set Objective.Key
    , completedObjectives : Set Objective.Key
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
getProperties_ c unwrapGatedValues (Location location) =
    let
        -- use a pseudo value to handle the only case of two key items together
        -- gating something (in the case of the Hook and Tails, the Hook gates
        -- the location while the Tails individually gate value), rather than
        -- complicating everything else to allow for multiple gating
        -- requirements
        context =
            { c
                | attainedRequirements =
                    if Set.member LegendSword c.attainedRequirements && Set.member Adamant c.attainedRequirements then
                        Set.insert (Pseudo Forge) c.attainedRequirements

                    else
                        c.attainedRequirements
            }

        objectives =
            combinedObjectives context

        -- certain values don't exist under certain flags
        -- note the free key item from Edward has its own key item class rather than
        -- being special-cased here
        exists value =
            case value of
                Character Ungated ->
                    not context.flags.noFreeChars

                Character Gated ->
                    not <| Set.member Objective.ClassicGiant objectives && location.key == Giant

                KeyItem itemClass ->
                    not (context.warpGlitchUsed && location.key == SealedCave)
                        -- under Kvanilla, Baron Castle only has a key item if it's the Pass
                        && not (location.key == BaronCastle && itemClass == Vanilla && not context.flags.passIsKeyItem)
                        && Set.member itemClass context.flags.keyItems

                Objective obj ->
                    -- Objective value exists as long as it's in our objectives,
                    -- regardless of whether or not we've completed it
                    Set.member obj objectives

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

        vanillaItems : Set String
        vanillaItems =
            Dict.get location.key vanillaShops
                |> Maybe.withDefault Set.empty

        allVanillaItems : Set String
        allVanillaItems =
            vanillaShops
                |> Dict.values
                |> List.foldl Set.union Set.empty

        exists item =
            if item.name == "Life" && flags.noLifePots then
                False

            else if item.name == "Siren" && flags.noSirens then
                False

            else if item.isJItem && flags.noJItems then
                False

            else
                case ( flags.shopRandomization, shopType ) of
                    ( Flags.None, _ ) ->
                        Set.member item.name vanillaItems

                    ( Flags.Shuffle, _ ) ->
                        Set.member item.name allVanillaItems

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

        outstanding =
            outstandingObjectives context

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

                            ( Objective obj, _ ) ->
                                -- outstanding objectives are valuable
                                Set.member obj outstanding

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
            Set.member Objective.DarkMatterHunt outstanding

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


combinedObjectives : Context -> Set Objective.Key
combinedObjectives context =
    Objective.keys context.flags.objectives
        |> Set.union context.randomObjectives


outstandingObjectives : Context -> Set Objective.Key
outstandingObjectives context =
    if Set.size context.completedObjectives >= context.flags.requiredObjectives then
        Set.empty

    else
        Set.diff (combinedObjectives context) context.completedObjectives


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

        Boss _ ->
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

        Objective _ ->
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
                { hp = 465
                , exp = 700
                , gp = 200
                , atkMult = 2
                , hit = 90
                , atk = 16
                , minSpeed = 5
                , maxSpeed = 5
                , mag = 10
                , valvalisMDef = 255
                }
            , Chest 4
            , Objective <| DoQuest Objective.MistCave
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
                { hp = 302
                , exp = 880
                , gp = 245
                , atkMult = 3
                , hit = 75
                , atk = 26
                , minSpeed = 2
                , maxSpeed = 4
                , mag = 11
                , valvalisMDef = 255
                }
            , Objective <| DoQuest Objective.Package
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
            , GatedValue SandRuby <| Objective <| DoQuest Objective.SandRuby
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
                { hp = 2350
                , exp = 1200
                , gp = 500
                , atkMult = 2
                , hit = 99
                , atk = 22
                , minSpeed = 31
                , maxSpeed = 31
                , mag = 10
                , valvalisMDef = 255
                }
            , Chest 4
            , Objective <| DoQuest Objective.Waterfall
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
                { hp = 1000
                , exp = 1500
                , gp = 800
                , atkMult = 2
                , hit = 85
                , atk = 11
                , minSpeed = 5
                , maxSpeed = 5
                , mag = 1
                , valvalisMDef = 170
                }
            , KeyItem Main
            , KeyItem Vanilla
            , Chest 13
            , Objective <| DoQuest Objective.AntlionCave
            ]
      }
    , { key = MtHobs
      , name = "Mt. Hobs"
      , requirements = []
      , value =
            [ Boss
                { hp = 1250
                , exp = 4360
                , gp = 1755
                , atkMult = 3
                , hit = 80
                , atk = 30
                , minSpeed = 7
                , maxSpeed = 7
                , mag = 5
                , valvalisMDef = 174
                }
            , Character Gated
            , Chest 5
            , Objective <| DoQuest Objective.MtHobs
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
                { hp = 1880
                , exp = 5590
                , gp = 1425
                , atkMult = 3
                , hit = 90
                , atk = 36
                , minSpeed = 6
                , maxSpeed = 9
                , mag = 15
                , valvalisMDef = 254
                }
            , KeyItem Main
            , Chest 10
            , Objective <| DoQuest Objective.Fabul
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
            , GatedValue (Pseudo YangBonk) (Objective <| DoQuest Objective.PanReturn)
            ]
      }
    , { key = Mysidia
      , name = "Mysidia"
      , requirements = []
      , value =
            [ Character Ungated
            , Character Ungated
            , GatedValue DarknessCrystal <| Objective <| DoQuest Objective.BigWhale
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
                { hp = 2780
                , exp = 3800
                , gp = 3300
                , atkMult = 1
                , hit = 75
                , atk = 19
                , minSpeed = 8
                , maxSpeed = 8
                , mag = 14
                , valvalisMDef = 0
                }
            , Boss
                { hp = 3000
                , exp = 4000
                , gp = 3000
                , atkMult = 3
                , hit = 99
                , atk = 44
                , minSpeed = 9
                , maxSpeed = 9
                , mag = 31
                , valvalisMDef = 255
                }
            , KeyItem Main
            , KeyItem Vanilla
            , Boss
                { hp = 1000
                , exp = 0
                , gp = 0
                , atkMult = 3
                , hit = 99
                , atk = 46
                , minSpeed = 5
                , maxSpeed = 5
                , mag = 17
                , valvalisMDef = 254
                }
            , Chest 4
            , Objective <| DoQuest Objective.MtOrdeals
            ]
      }
    , { key = Baron
      , name = "Baron Town"
      , requirements = []
      , value =
            [ Boss
                { hp = 400
                , exp = 1440
                , gp = 1000
                , atkMult = 3
                , hit = 99
                , atk = 46
                , minSpeed = 11
                , maxSpeed = 14
                , mag = 26
                , valvalisMDef = 255
                }
            , Boss
                { hp = 4000
                , exp = 0
                , gp = 0
                , atkMult = 6
                , hit = 99
                , atk = 86
                , minSpeed = 4
                , maxSpeed = 7
                , mag = 31
                , valvalisMDef = 0
                }
            , Character Gated
            , KeyItem Main
            , KeyItem Vanilla
            , Chest 13
            , Objective <| DoQuest Objective.BaronInn
            , GatedValue BaronKey <| Objective <| DoQuest Objective.UnlockSewer
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
                { hp = 4200
                , exp = 4820
                , gp = 3000
                , atkMult = 4
                , hit = 99
                , atk = 52
                , minSpeed = 8
                , maxSpeed = 8
                , mag = 9
                , valvalisMDef = 254
                }
            , Boss
                { hp = 4000
                , exp = 5500
                , gp = 4000
                , atkMult = 3
                , hit = 99
                , atk = 44
                , minSpeed = 15
                , maxSpeed = 15
                , mag = 29
                , valvalisMDef = 255
                }
            , Character Gated
            , KeyItem Main
            , KeyItem Vanilla
            , Chest 20
            , Objective <| DoQuest Objective.BaronCastle
            ]
      }
    , { key = BaronBasement
      , name = "Baron Basement"
      , requirements = [ BaronKey ]
      , value =
            [ Boss
                { hp = 20500
                , exp = 18000
                , gp = 0
                , atkMult = 9
                , hit = 85
                , atk = 116
                , minSpeed = 43
                , maxSpeed = 46
                , mag = 95
                , valvalisMDef = 255
                }
            , KeyItem Summon
            , Objective <| DoQuest Objective.BaronBasement
            ]
      }
    , { key = Toroia
      , name = "Toroia"
      , requirements = []
      , value =
            [ Chest 4
            , Objective <| DoQuest Objective.Pass
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
            , Objective <| DoQuest Objective.Treasury
            ]
      }
    , { key = CaveMagnes
      , name = "Cave Magnes"
      , requirements = []
      , value =
            [ GatedValue TwinHarp <|
                Boss
                    { hp = 5000
                    , exp = 7000
                    , gp = 9000
                    , atkMult = 4
                    , hit = 99
                    , atk = 54
                    , minSpeed = 11
                    , maxSpeed = 11
                    , mag = 15
                    , valvalisMDef = 255
                    }
            , GatedValue TwinHarp <| KeyItem Main
            , GatedValue TwinHarp <| KeyItem Vanilla
            , Chest 10
            , GatedValue TwinHarp <| Objective <| DoQuest Objective.CaveMagnes
            , GatedValue TwinHarp <| Objective <| DoQuest Objective.TwinHarp
            ]
      }
    , { key = Zot
      , name = "Tower of Zot"
      , requirements = []
      , value =
            [ Boss
                { hp = 9000
                , exp = 9000
                , gp = 9000
                , atkMult = 5
                , hit = 80
                , atk = 60
                , minSpeed = 7
                , maxSpeed = 7
                , mag = 11
                , valvalisMDef = 254
                }
            , GatedValue EarthCrystal <| Character Gated
            , GatedValue EarthCrystal <| Character Gated
            , GatedValue EarthCrystal <|
                Boss
                    { hp = 6000
                    , exp = 9500
                    , gp = 5500
                    , atkMult = 5
                    , hit = 99
                    , atk = 70
                    , minSpeed = 18
                    , maxSpeed = 18
                    , mag = 63
                    , valvalisMDef = 255
                    }
            , GatedValue EarthCrystal <| KeyItem Main
            , GatedValue EarthCrystal <| KeyItem Vanilla
            , Chest 5
            , TrappedChest 1
            , GatedValue EarthCrystal <| Objective <| DoQuest Objective.TowerZot
            ]
      }
    , { key = Agart
      , name = "Agart"
      , requirements = []
      , value =
            [ Chest 1
            , GatedValue MagmaKey <| Objective <| DoQuest Objective.MagmaKey
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
      , requirements = [ Hook ]
      , value =
            [ GatedValue RatTail <| KeyItem Main
            , GatedValue RatTail <| KeyItem Vanilla
            , GatedValue RatTail <| Objective <| DoQuest Objective.RatTail
            , GatedValue PinkTail <| Objective <| DoQuest Objective.PinkTail
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
                { hp = 6000
                , exp = 0
                , gp = 0
                , atkMult = 9
                , hit = 85
                , atk = 116
                , minSpeed = 53
                , maxSpeed = 53
                , mag = 15
                , valvalisMDef = 0
                }
            , Boss
                { hp = 25200
                , exp = 25000
                , gp = 700
                , atkMult = 7
                , hit = 80
                , atk = 88
                , minSpeed = 38
                , maxSpeed = 38
                , mag = 16
                , valvalisMDef = 255
                }
            , Chest 7
            , TrappedChest 1
            , Requirement <| Pseudo Falcon
            , Objective <| DoQuest Objective.Falcon
            ]
      }
    , { key = Giant
      , name = "Giant of Bab-il"
      , requirements = [ DarknessCrystal ]
      , value =
            [ Boss
                { hp = 65000
                , exp = 102500
                , gp = 20000
                , atkMult = 10
                , hit = 80
                , atk = 128
                , minSpeed = 89
                , maxSpeed = 89
                , mag = 15
                , valvalisMDef = 86
                }
            , Boss
                { hp = 24000
                , exp = 150000
                , gp = 10333
                , atkMult = 13
                , hit = 99
                , atk = 174
                , minSpeed = 38
                , maxSpeed = 38
                , mag = 127
                , valvalisMDef = 255
                }
            , Character Gated
            , Chest 7
            , TrappedChest 1
            , Objective <| DoQuest Objective.Giant
            , Objective <| ClassicGiant
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
                { hp = 8524
                , exp = 21000
                , gp = 8000
                , atkMult = 7
                , hit = 99
                , atk = 96
                , minSpeed = 11
                , maxSpeed = 11
                , mag = 41
                , valvalisMDef = 255
                }
            , Character Gated
            , Boss
                { hp = 3002
                , exp = 20000
                , gp = 11000
                , atkMult = 5
                , hit = 99
                , atk = 68
                , minSpeed = 27
                , maxSpeed = 27
                , mag = 1
                , valvalisMDef = 0
                }
            , KeyItem Main
            , KeyItem Vanilla
            , KeyItem Warp -- also Vanilla
            , Chest 18
            , Objective <| DoQuest Objective.DwarfCastle
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
                { hp = 18943
                , exp = 26020
                , gp = 11000
                , atkMult = 6
                , hit = 99
                , atk = 86
                , minSpeed = 27
                , maxSpeed = 27
                , mag = 7
                , valvalisMDef = 0
                }
            , KeyItem Main
            , KeyItem Vanilla
            , Chest 12
            , TrappedChest 4
            , Objective <| DoQuest Objective.LowerBabil
            ]
      }
    , { key = LowerBabilCannon
      , name = "Super Cannon"
      , requirements = [ TowerKey ]
      , value =
            [ Boss
                { hp = 597
                , exp = 5820
                , gp = 135
                , atkMult = 5
                , hit = 70
                , atk = 56
                , minSpeed = 18
                , maxSpeed = 21
                , mag = 16
                , valvalisMDef = 0
                }
            , KeyItem Main
            , KeyItem Vanilla
            , Objective <| DoQuest Objective.SuperCannon
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
            , GatedValue Pan <| Objective <| DoQuest Objective.PanWake
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
                { hp = 35000
                , exp = 28000
                , gp = 0
                , atkMult = 13
                , hit = 99
                , atk = 174
                , minSpeed = 53
                , maxSpeed = 53
                , mag = 34
                , valvalisMDef = 255
                }
            , KeyItem Summon
            , Objective <| DoQuest Objective.FeymarchKing
            ]
      }
    , { key = FeymarchQueen
      , name = "Feymarch Queen"
      , requirements = []
      , value =
            [ Boss
                { hp = 23000
                , exp = 20000
                , gp = 0
                , atkMult = 10
                , hit = 99
                , atk = 134
                , minSpeed = 66
                , maxSpeed = 66
                , mag = 69
                , valvalisMDef = 255
                }
            , KeyItem Summon
            , Objective <| DoQuest Objective.FeymarchQueen
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
                { hp = 19000
                , exp = 23000
                , gp = 8000
                , atkMult = 6
                , hit = 90
                , atk = 84
                , minSpeed = 66
                , maxSpeed = 66
                , mag = 79
                , valvalisMDef = 255
                }
            , Chest 19
            , Objective <| DoQuest Objective.SealedCave
            , Objective <| DoQuest Objective.UnlockSealedCave
            ]
      }
    , { key = Kokkol
      , name = "Kokkol"
      , requirements = []
      , value =
            [ Chest 4
            , GatedValue (Pseudo Forge) (Objective <| DoQuest Objective.Forge)
            , GatedValue (Pseudo Forge) (Objective ClassicForge)
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
                { hp = 37000
                , exp = 35000
                , gp = 0
                , atkMult = 13
                , hit = 99
                , atk = 174
                , minSpeed = 27
                , maxSpeed = 27
                , mag = 17
                , valvalisMDef = 170
                }
            , KeyItem Summon
            , Chest 4
            , Objective <| DoQuest Objective.CaveBahamut
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
                { hp = 27300
                , exp = 59000
                , gp = 0
                , atkMult = 11
                , hit = 85
                , atk = 144
                , minSpeed = 40
                , maxSpeed = 43
                , mag = 31
                , valvalisMDef = 255
                }
            , KeyItem MoonBoss
            , Objective <| DoQuest Objective.MurasameAltar
            ]
      }
    , { key = WyvernAltar
      , name = "Altar 2 (Crystal Sword)"
      , requirements = []
      , value =
            [ Boss
                { hp = 25000
                , exp = 64300
                , gp = 0
                , atkMult = 12
                , hit = 90
                , atk = 160
                , minSpeed = 43
                , maxSpeed = 46
                , mag = 8
                , valvalisMDef = 255
                }
            , KeyItem MoonBoss
            , Objective <| DoQuest Objective.WyvernAltar
            ]
      }
    , { key = WhiteSpearAltar
      , name = "Altar 3 (White Spear)"
      , requirements = []
      , value =
            [ Boss
                { hp = 28000
                , exp = 31200
                , gp = 550
                , atkMult = 11
                , hit = 90
                , atk = 146
                , minSpeed = 29
                , maxSpeed = 32
                , mag = 96
                , valvalisMDef = 255
                }
            , KeyItem MoonBoss
            , Objective <| DoQuest Objective.WhiteSpearAltar
            ]
      }
    , { key = RibbonRoom
      , name = "Altar 4 (Ribbons)"
      , requirements = []
      , value =
            [ Boss
                { hp = 42000
                , exp = 100000
                , gp = 0
                , atkMult = 11
                , hit = 85
                , atk = 144
                , minSpeed = 30
                , maxSpeed = 30
                , mag = 36
                , valvalisMDef = 255
                }
            , KeyItem MoonBoss
            , Objective <| DoQuest Objective.RibbonRoom
            ]
      }
    , { key = MasamuneAltar
      , name = "Altar 5 (Masamune)"
      , requirements = []
      , value =
            [ Boss
                { hp = 37000
                , exp = 61100
                , gp = 0
                , atkMult = 11
                , hit = 99
                , atk = 150
                , minSpeed = 38
                , maxSpeed = 38
                , mag = 127
                , valvalisMDef = 255
                }
            , KeyItem MoonBoss
            , Objective <| DoQuest Objective.MasamuneAltar
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
    , { name = "Tent"
      , tier = 2
      }
    , { name = "Cabin"
      , tier = 4
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
      , tier = 7
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


vanillaShops : Dict Key (Set String)
vanillaShops =
    -- using strings for this is gross, but a type still feels like overkill
    [ ( KaipoShops, [ "Life", "Tent", "Status-healing" ] )
    , ( FabulShops, [ "Life", "Tent", "Status-healing" ] )
    , ( MysidiaShops, [ "Cure2", "Life", "Tent", "Cabin", "Status-healing" ] )
    , ( BaronItemShop, [ "Life", "Tent", "Status-healing" ] )
    , ( ToroiaShops, [ "Life", "Tent", "Status-healing" ] )
    , ( AgartShops, [ "Life", "Tent", "Status-healing" ] )
    , ( SilveraShops, [ "Status-healing" ] )
    , ( CaveEblanShops, [ "Status-healing" ] )
    , ( DwarfCastleShops, [ "Cure2", "Life", "Tent", "Cabin", "Status-healing" ] )
    , ( FeymarchShops, [ "Cure2", "Life", "Tent", "Cabin", "Status-healing" ] )
    , ( TomraShops, [ "Cure2", "Life", "Tent", "Cabin", "Status-healing" ] )
    , ( KokkolShop, [] )
    , ( Hummingway, [ "Cure2", "Life", "Cabin", "Ether" ] )
    ]
        |> List.map (Tuple.mapSecond Set.fromList)
        |> Dict.fromList
