module App exposing
    ( Model
    , Msg
    , init
    , subscriptions
    , update
    , view
    )

import Array exposing (Array)
import AssocList as Dict exposing (Dict)
import Browser
import Browser.Dom
import Browser.Events
import Colour exposing (Colours)
import ConsumableItems exposing (ConsumableItem, ConsumableItems)
import EverySet as Set exposing (EverySet)
import Flags exposing (Flags, KeyItemClass(..))
import Html exposing (Html, a, datalist, div, h2, h4, hr, input, li, option, span, text, textarea, ul)
import Html.Attributes exposing (autocomplete, class, classList, cols, href, id, rows, spellcheck, target, title, type_, value)
import Html.Events exposing (onClick, onInput)
import Icon
import Json.Decode
import Json.Encode
import Location exposing (IndexedProperty, Location, Locations)
import Maybe.Extra
import Objective exposing (Objective)
import Ports
import Requirement exposing (PseudoRequirement(..), Requirement(..))
import Status exposing (Status(..))
import String.Extra
import Task
import Value
    exposing
        ( BossStats
        , Filter(..)
        , FilterType(..)
        , ShopValue(..)
        , Value(..)
        )


type alias Set a =
    EverySet a


type alias Model =
    { flagString : String
    , flags : Flags
    , randomObjectives : Array RandomObjective
    , completedObjectives : Set Objective.Key
    , attainedRequirements : Set Requirement
    , locations : Locations
    , locationFilterOverrides : Dict Filter FilterType
    , shopFilterOverrides : Dict Filter FilterType
    , warpGlitchUsed : Bool
    , shopMenu : Maybe ShopMenu
    , colours : Colours
    }


type RandomObjective
    = Set Objective
    | Unset


type alias ShopMenu =
    { key : Location.Key
    , index : Int
    , content : ShopMenuContent
    }


type ShopMenuContent
    = Items (List ( Int, ConsumableItem ))
    | Text String


type Msg
    = ToggleObjective Objective.Key
    | SetRandomObjective Int String
    | UnsetRandomObjective Int
    | ToggleRequirement Requirement
    | ToggleFilter Location.Class Filter
    | ToggleLocationStatus Location Status
    | ToggleProperty Location.Key Int
    | HardToggleProperty Location.Key Int
    | ToggleWarpGlitchUsed Location.Key Int
    | ToggleShopMenu ShopMenu
    | CloseShopMenu
    | ToggleShopItem ShopMenu Int
    | UpdateShopText ShopMenu String
    | UpdateFlags String
    | SetColour Colour.For String
    | DoNothing


{-| The ID of any shop menu text input, of which only one will ever
exist at a time.
-}
shopMenuID : String
shopMenuID =
    "shop-menu-input"


init : Maybe Json.Encode.Value -> ( Model, Cmd Msg )
init savedColours =
    let
        flagString =
            "Kmain/summon/moon Sstandard Gwarp Nkey O1:char_kain/2:quest_antlionnest/random:3/req:4"

        flags =
            Flags.parse flagString

        randomObjectives =
            updateRandomObjectives flags Array.empty

        colours =
            Colour.decode savedColours
    in
    { flagString = flagString
    , flags = flags
    , randomObjectives = randomObjectives
    , completedObjectives = Set.empty
    , attainedRequirements = Set.empty
    , locations = Location.all
    , locationFilterOverrides =
        Dict.fromList
            [ ( Characters, Show )
            , ( KeyItems, Show )
            , ( Chests, Hide )
            ]
    , shopFilterOverrides = Dict.empty
    , warpGlitchUsed = False
    , shopMenu = Nothing
    , colours = colours
    }
        |> with (Ports.setColours <| Colour.encode colours)


subscriptions : Model -> Sub Msg
subscriptions model =
    let
        -- close the shop menu on any click outside it
        shopMenuClick =
            -- for simplicity, rather than figuring out whether a click
            -- was in or out of the shop menu, we listen for clicks
            -- anywhere, and rely on a) the shop menu being entirely
            -- comprised of elements with their own onClick handlers,
            -- and b) those elements using onClickNoBubble: as a result,
            -- any clicks inside the menu won't reach this handler, and
            -- so won't cause the menu to close
            Browser.Events.onClick <| Json.Decode.succeed CloseShopMenu

        -- close the shop menu on pressing the Escape key
        shopMenuEscape =
            Json.Decode.field "key" Json.Decode.string
                |> Json.Decode.andThen
                    (\key ->
                        case key of
                            "Escape" ->
                                Json.Decode.succeed CloseShopMenu

                            _ ->
                                Json.Decode.fail ""
                    )
                -- onKeyPress doesn't work with the macbook touchbar
                |> Browser.Events.onKeyUp
    in
    case model.shopMenu of
        Just _ ->
            Sub.batch [ shopMenuClick, shopMenuEscape ]

        Nothing ->
            Sub.none


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    -- handling Cmds here rather than almost every Msg branch having to
    -- explicitly return its own Cmd.none
    case msg of
        ToggleShopMenu _ ->
            -- a bit inelegant that we're unconditionally trying to
            -- focus an element that will only sometimes exist, but so
            -- convenient
            innerUpdate msg model
                |> with (focus shopMenuID)

        SetColour for colour ->
            let
                colours =
                    Colour.set for colour model.colours
            in
            { model | colours = colours }
                |> with (Ports.setColours <| Colour.encode colours)

        _ ->
            innerUpdate msg model
                |> with Cmd.none


innerUpdate : Msg -> Model -> Model
innerUpdate msg model =
    let
        toggleProperty key index hard newModel =
            let
                locations =
                    Location.update key (Maybe.map <| Location.toggleProperty index hard) newModel.locations

                -- if the property is a Requirement, update our
                -- attainedRequirements accordingly
                updateRequirements =
                    case Location.getProperty key index locations of
                        Just ( Unseen, Requirement requirement ) ->
                            removeRequirement requirement

                        Just ( Dismissed, Requirement requirement ) ->
                            attainRequirement requirement

                        _ ->
                            identity

                -- ditto for Objectives
                updateObjectives =
                    case Location.getProperty key index locations of
                        Just ( Unseen, Value.Objective objective ) ->
                            Set.remove objective

                        Just ( Dismissed, Value.Objective objective ) ->
                            Set.insert objective

                        _ ->
                            identity
            in
            { newModel
                | locations = locations
                , completedObjectives = updateObjectives newModel.completedObjectives
            }
                |> updateRequirements
                |> updateCrystal

        -- when we attain a new requirement, add it to the set and un-dismiss
        -- any locations for which it gates value
        attainRequirement requirement newModel =
            let
                attainedRequirements =
                    Set.insert requirement newModel.attainedRequirements

                context =
                    getContext { newModel | attainedRequirements = attainedRequirements }

                locations =
                    Location.undismissByGatingRequirement context requirement newModel.locations
            in
            { newModel
                | attainedRequirements = attainedRequirements
                , locations = locations
            }

        removeRequirement requirement newModel =
            { newModel | attainedRequirements = Set.remove requirement model.attainedRequirements }

        attainObjective objective newModel =
            { newModel
                | completedObjectives = Set.insert objective newModel.completedObjectives
                , locations = Location.objectiveToggled objective True newModel.locations
            }
                |> updateCrystal

        removeObjective objective newModel =
            { newModel
                | completedObjectives = Set.remove objective newModel.completedObjectives
                , locations = Location.objectiveToggled objective False newModel.locations
            }
                |> updateCrystal

        -- if the Crystal is rewarded from completing objectives rather than being found, keep
        -- it in sync with our objectives
        updateCrystal newModel =
            let
                fn =
                    if newModel.flags.objectiveReward == Flags.Crystal then
                        if Set.size newModel.completedObjectives >= newModel.flags.requiredObjectives then
                            Set.insert Crystal

                        else
                            Set.remove Crystal

                    else
                        identity
            in
            { newModel | attainedRequirements = fn newModel.attainedRequirements }
    in
    case msg of
        ToggleObjective objective ->
            if Set.member objective model.completedObjectives then
                removeObjective objective model

            else
                attainObjective objective model

        SetRandomObjective index description ->
            case Objective.fromDescription description of
                Just objective ->
                    { model | randomObjectives = Array.set index (Set objective) model.randomObjectives }

                Nothing ->
                    model

        UnsetRandomObjective index ->
            -- the UI doesn't allow unsetting an objective if it's completed, so we don't
            -- have to worry about un-completing it here
            { model | randomObjectives = Array.set index Unset model.randomObjectives }

        ToggleRequirement requirement ->
            if Set.member requirement model.attainedRequirements then
                removeRequirement requirement model

            else
                attainRequirement requirement model

        ToggleFilter locClass filter ->
            let
                toggle state =
                    case state of
                        Nothing ->
                            Just Show

                        Just Show ->
                            if filter == Checked then
                                -- skip the Hide state for Checked, as that's the default
                                Nothing

                            else
                                Just Hide

                        Just Hide ->
                            if List.member filter [ Characters, KeyItems ] then
                                -- skip the Nothing state for these filters, as they always
                                -- default to Show (so Nothing is redundant)
                                Just Show

                            else
                                Nothing
            in
            case locClass of
                Location.Checks ->
                    { model | locationFilterOverrides = Dict.update filter toggle model.locationFilterOverrides }

                Location.Shops ->
                    { model | shopFilterOverrides = Dict.update filter toggle model.shopFilterOverrides }

        ToggleLocationStatus location status ->
            let
                newLocation =
                    Location.toggleStatus (getContext model) status location

                newModel =
                    { model | locations = Location.insert newLocation model.locations }

                properties =
                    Location.getProperties (getContext newModel) newLocation

                -- collect any Requirements this location awards as value
                requirements =
                    properties
                        |> List.filterMap (.value >> Value.requirement)

                -- and do likewise for Objectives
                objectives =
                    properties
                        |> List.filterMap (.value >> Value.objective)
            in
            case Location.getStatus newLocation of
                Dismissed ->
                    -- attain the rewarded requirements and objectives
                    newModel
                        |> modelFoldl attainRequirement requirements
                        |> modelFoldl attainObjective objectives

                _ ->
                    -- don't unattain the rewarded values on Unseen: they
                    -- can be manually unchecked where appropriate
                    newModel

        ToggleProperty key index ->
            toggleProperty key index False model

        HardToggleProperty key index ->
            toggleProperty key index True model

        ToggleWarpGlitchUsed key index ->
            toggleProperty key index False <|
                { model | warpGlitchUsed = not model.warpGlitchUsed }

        ToggleShopMenu newShop ->
            let
                shopMenu =
                    case model.shopMenu of
                        Just existingShop ->
                            if existingShop.key == newShop.key && existingShop.index == newShop.index then
                                Nothing

                            else
                                Just newShop

                        Nothing ->
                            Just newShop
            in
            { model | shopMenu = shopMenu }

        CloseShopMenu ->
            { model | shopMenu = Nothing }

        ToggleShopItem menu itemIndex ->
            let
                locations =
                    Location.update menu.key (Maybe.map <| Location.toggleItem menu.index itemIndex) model.locations

                shopMenu =
                    locations
                        |> Location.get menu.key
                        |> Maybe.map (Location.getItems (getContextFor Location.Shops model) menu.index)
                        |> Maybe.map
                            (\items ->
                                { menu | content = Items items }
                            )
            in
            { model
                | locations = locations
                , shopMenu = shopMenu
            }

        UpdateShopText menu newText ->
            let
                locations =
                    Location.update menu.key (Maybe.map <| Location.setText menu.index newText) model.locations
            in
            { model
                | locations = locations
                , shopMenu = Just { menu | content = Text newText }
            }

        UpdateFlags flagString ->
            let
                flags =
                    Flags.parse flagString

                randomObjectives =
                    updateRandomObjectives flags model.randomObjectives

                -- uncomplete any objectives that no longer exist
                completedObjectives =
                    randomObjectiveKeys randomObjectives
                        |> Set.union (Objective.keys flags.objectives)
                        |> Set.intersect model.completedObjectives

                -- filter out chests when they're all empty, unless they've
                -- explicitly been enabled
                filterChests =
                    if flags.noTreasures && Dict.get Chests model.locationFilterOverrides /= Just Show then
                        Dict.insert Chests Hide

                    else
                        identity

                -- filter out characters if there aren't any to recruit
                -- yes this is ridiculously niche
                filterCharacters =
                    if flags.noCharacters then
                        Dict.insert Characters Hide

                    else
                        identity

                locationFilterOverrides =
                    model.locationFilterOverrides
                        |> filterChests
                        |> filterCharacters
            in
            -- storing both flagString and the Flags derived from it isn't ideal, but we ignore
            -- flagString everywhere else; it only exists so we can prepopulate the flags textarea
            { model
                | flagString = flagString
                , flags = flags
                , randomObjectives = randomObjectives
                , completedObjectives = completedObjectives
                , locationFilterOverrides = locationFilterOverrides
                , shopMenu = Nothing
            }
                |> updateCrystal

        SetColour _ _ ->
            -- handled in the outer update function
            model

        DoNothing ->
            model


view : Model -> Browser.Document Msg
view model =
    { title = "FFIV Free Enterprise Tracker"
    , body =
        [ div [ class "content" ]
            [ div [ id "flagstring" ]
                [ textarea
                    [ class "flagstring"
                    , autocomplete False
                    , spellcheck False
                    , onInput UpdateFlags
                    ]
                    [ text model.flagString ]
                ]
            , viewObjectives model
            , div [ id "key-items" ]
                [ h2 [] [ text "Key Items" ]
                , viewKeyItems model.flags model.attainedRequirements
                ]
            , div [ id "checks" ]
                [ h2 [ class "locations-header" ]
                    [ text "Locations"
                    , viewFilters model Location.Checks
                    ]
                , viewLocations model Location.Checks
                ]
            , displayIf (not <| List.member model.flags.shopRandomization [ Flags.Cabins, Flags.Empty ] || model.flags.passInShop) <|
                div [ id "shops" ]
                    [ h2 [ class "shops-header" ]
                        [ text "Shops"
                        , viewFilters model Location.Shops
                        ]
                    , viewLocations model Location.Shops
                    ]
            ]
        , div [ id "footer" ]
            [ div [ id "colour-pickers" ]
                [ span [ class "colour-picker" ]
                    [ text "Background: "
                    , input
                        [ type_ "color"
                        , value model.colours.background
                        , onInput <| SetColour Colour.Background
                        ]
                        []
                    ]
                , span [ class "colour-picker" ]
                    [ text "Text: "
                    , input
                        [ type_ "color"
                        , value model.colours.text
                        , onInput <| SetColour Colour.Text
                        ]
                        []
                    ]
                ]
            , div []
                [ text "Please see the "
                , a [ href "https://github.com/EiriasValar/FF4FE-Tracker/tree/release#readme", target "_blank" ]
                    [ text "GitHub repo" ]
                , text " for documentation, credits, and contact info"
                ]
            , div []
                [ a [ href "https://github.com/EiriasValar/FF4FE-Tracker/blob/release/CHANGELOG.md", target "_blank" ]
                    [ text "Changelog" ]
                ]
            ]
        ]
    }


objectivesDatalistId : String
objectivesDatalistId =
    "objective-options"


viewObjectives : Model -> Html Msg
viewObjectives model =
    let
        numCompleted =
            Set.size model.completedObjectives

        numRequired =
            model.flags.requiredObjectives

        viewArray : (Int -> a -> b) -> Array a -> List b
        viewArray fn =
            Array.indexedMap fn
                >> Array.toList

        fixed _ o =
            viewObjective o (Set.member o.key model.completedObjectives) Nothing

        random i o =
            viewEditableObjective i o model.completedObjectives

        listFor : Objective.Type -> List Objective -> List (Html Msg)
        listFor objectiveType objectives =
            if Set.member objectiveType model.flags.randomObjectiveTypes then
                List.map
                    (\o -> option [] [ text o.description ])
                    objectives

            else
                []
    in
    div [ id "objectives" ] <|
        if model.flags.requiredObjectives > 0 then
            [ h2 []
                [ text "Objectives"
                , span
                    [ class "progress"
                    , classList [ ( "complete", numCompleted >= numRequired ) ]
                    ]
                    [ text <|
                        "("
                            ++ String.fromInt numCompleted
                            ++ "/"
                            ++ String.fromInt numRequired
                            ++ " to "
                            ++ Flags.rewardToString model.flags.objectiveReward
                            ++ ")"
                    ]
                ]
            , datalist [ id objectivesDatalistId ] <|
                listFor Objective.Character Objective.characters
                    ++ listFor Objective.Boss Objective.bosses
                    ++ listFor Objective.Quest Objective.quests
                    ++ listFor Objective.GatedQuest Objective.gatedQuests
            , ul [ class "objectives" ] <|
                viewArray fixed model.flags.objectives
                    ++ viewArray random model.randomObjectives
            ]

        else
            []


viewObjective : Objective -> Bool -> Maybe Int -> Html Msg
viewObjective objective completed randomIndex =
    li
        [ classList
            [ ( "objective", True )
            , ( "completed", completed )
            ]
        , onClick (ToggleObjective objective.key)
        ]
        [ span [ class "icon" ] [ Icon.toImg Icon.objective ]
        , span [ class "text" ] [ text objective.description ]
        , case ( completed, randomIndex, Icon.trash ) of
            ( False, Just index, icon ) ->
                -- we're unlikely to want to delete a completed objective, and in the
                -- event that we do, it's easy enough to toggle it off again first
                icon.img
                    [ class icon.class
                    , title icon.title
                    , onClickNoBubble <| UnsetRandomObjective index
                    ]

            _ ->
                text ""
        ]


viewEditableObjective : Int -> RandomObjective -> Set Objective.Key -> Html Msg
viewEditableObjective index randomObjective completedObjectives =
    case randomObjective of
        Set objective ->
            viewObjective objective (Set.member objective.key completedObjectives) (Just index)

        Unset ->
            li [ class "objective unset" ]
                [ input
                    [ Html.Attributes.list objectivesDatalistId
                    , onInput <| SetRandomObjective index
                    ]
                    []
                ]


viewKeyItems : Flags -> Set Requirement -> Html Msg
viewKeyItems flags attained =
    let
        req : Requirement -> Html Msg
        req requirement =
            req_ requirement False

        req_ : Requirement -> Bool -> Html Msg
        req_ requirement readonly =
            case Icon.fromRequirement requirement of
                Just icon ->
                    let
                        readonlyAttr =
                            if readonly then
                                [ title <| icon.title ++ " (can't be toggled directly)"
                                , class "readonly"
                                ]

                            else
                                [ title icon.title
                                , onClick <| ToggleRequirement requirement
                                ]
                    in
                    icon.img <|
                        [ class "requirement"
                        , class icon.class
                        , classList [ ( "disabled", not <| Set.member requirement attained ) ]
                        ]
                            ++ readonlyAttr

                Nothing ->
                    div [] []

        numAttained =
            -- we care about this number for the 10 key items experience bonus, so
            -- don't count the things that aren't real key items
            attained
                |> Set.filter (not << Requirement.isPseudo)
                |> Set.size
    in
    div [ class "requirements" ]
        [ if flags.objectiveReward == Flags.Crystal then
            req_ Crystal True

          else
            req_ Crystal False
        , displayCellIf flags.passExists <|
            req (Pseudo Pass)
        , req Hook
        , req DarknessCrystal
        , req EarthCrystal
        , req TwinHarp
        , req Package
        , req SandRuby
        , req BaronKey
        , req MagmaKey
        , req TowerKey
        , req LucaKey
        , req Adamant
        , req LegendSword
        , req Pan
        , req Spoon
        , displayCellIf (not <| Set.member Flags.Free flags.keyItems) <|
            req (Pseudo MistDragon)
        , req RatTail
        , displayCellIf (not <| Set.member Vanilla flags.keyItems) <|
            req PinkTail
        , displayCellIf flags.keyExpBonus <|
            div
                [ class "requirement readonly total"
                , classList [ ( "key-bonus-reached", numAttained >= 10 ) ]
                ]
                [ displayIf (numAttained > 0) <|
                    text (String.fromInt numAttained)
                ]
        ]


viewFilters : Model -> Location.Class -> Html Msg
viewFilters model locClass =
    let
        ( filters, overrides ) =
            case locClass of
                Location.Checks ->
                    ( [ Characters, KeyItems, Bosses, Chests, TrappedChests, Checked ]
                    , model.locationFilterOverrides
                    )

                Location.Shops ->
                    ( [ Checked ]
                    , model.shopFilterOverrides
                    )

        viewFilter filter =
            let
                ( stateClass, hide ) =
                    case Dict.get filter overrides of
                        Just Show ->
                            ( "show", False )

                        Just Hide ->
                            ( "hide", True )

                        Nothing ->
                            ( "unset", False )

                icon =
                    Icon.fromFilter filter
            in
            span
                [ class "icon filter"
                , class stateClass
                , class icon.class
                , title icon.title
                , onClick <| ToggleFilter locClass filter
                ]
                [ icon.img []
                , displayIf hide <|
                    Icon.no
                ]
    in
    span [ class "filters" ] <|
        List.map viewFilter filters


viewLocations : Model -> Location.Class -> Html Msg
viewLocations model locClass =
    let
        context : Location.Context
        context =
            getContextFor locClass model

        viewArea : ( Location.Area, List Location ) -> Html Msg
        viewArea ( area, locations ) =
            div []
                [ h4 []
                    [ text <| String.Extra.toTitleCase <| Location.areaToString area ]
                , div [ class "area-locations" ] <|
                    List.concatMap (viewLocation model.shopMenu context) locations
                ]
    in
    model.locations
        |> Location.filterByContext locClass context
        |> Location.groupByArea
        |> List.map viewArea
        |> div [ class "locations" ]


viewLocation : Maybe ShopMenu -> Location.Context -> Location -> List (Html Msg)
viewLocation shopMenu context location =
    [ span
        [ class "name"
        , class <| Status.toString <| Location.getStatus location
        , onClick <| ToggleLocationStatus location Dismissed
        , onRightClick <| ToggleLocationStatus location Seen
        ]
        [ text <| Location.getName location ]
    , span [ class "icons-container" ]
        [ span [ class "icons" ] <|
            List.map (viewProperty context location) (Location.getProperties context location)
        , shopMenu
            |> Maybe.Extra.filter (.key >> (==) (Location.getKey location))
            |> Maybe.map viewMenu
            |> Maybe.withDefault (text "")
        ]
    ]


viewMenu : ShopMenu -> Html Msg
viewMenu menu =
    let
        viewItem ( itemIndex, item ) =
            div
                [ class "shop-item"
                , class <| Status.toString item.status

                -- prevent propagation so toggling an item doesn't
                -- also trigger closing the menu
                , onClickNoBubble <| ToggleShopItem menu itemIndex
                ]
                [ span [ class "name" ] [ text item.name ] ]
    in
    div [ class "shop-menu" ] <|
        case menu.content of
            Items items ->
                List.map viewItem items

            Text shopText ->
                [ textarea
                    [ id shopMenuID
                    , rows 3
                    , cols 10
                    , autocomplete False
                    , spellcheck False
                    , value shopText
                    , onInput (UpdateShopText menu)
                    , onClickNoBubble DoNothing
                    ]
                    []
                ]


viewProperty : Location.Context -> Location -> IndexedProperty -> Html Msg
viewProperty context location { index, status, value } =
    let
        key =
            Location.getKey location

        extraClass =
            case value of
                KeyItem Warp ->
                    "warp"

                _ ->
                    ""

        clickHandler =
            let
                shopItems : ConsumableItems -> ShopMenuContent
                shopItems =
                    Items << Location.filterItems context location

                toggleShopMenu content =
                    ToggleShopMenu
                        { key = key
                        , index = index
                        , content = content
                        }
            in
            case value of
                KeyItem Warp ->
                    onClick <| ToggleWarpGlitchUsed key index

                -- prevent propagation of clicks on shop menu roots: clicking
                -- the root of an already-open menu already closes itself, and
                -- if we let the click propagate, the top-level onClick handler
                -- in subscriptions will catch it and immediately re-close the
                -- menu after we open it
                Shop (Healing items) ->
                    onClickNoBubble <| toggleShopMenu <| shopItems items

                Shop (JItem items) ->
                    onClickNoBubble <| toggleShopMenu <| shopItems items

                Shop (Other shopText) ->
                    onClickNoBubble <| toggleShopMenu <| Text shopText

                _ ->
                    onClick <| ToggleProperty key index

        count =
            case ( Value.countable value, status ) of
                ( Just total, SeenSome seen ) ->
                    total - seen

                ( Just total, _ ) ->
                    total

                _ ->
                    0
    in
    case Icon.fromValue value of
        Just icon ->
            span
                [ class "icon"
                , class icon.class
                , class extraClass
                , class <| Status.toString status
                , title <|
                    case value of
                        KeyItem Warp ->
                            "Sealed Cave key item check"

                        _ ->
                            icon.title
                , clickHandler
                , onRightClick <| HardToggleProperty key index
                ]
                [ icon.img [ class "value" ]
                , displayIf (status == Dismissed) <|
                    Icon.check
                , displayIf (count > 0) <|
                    span [ class "count" ] [ text <| String.fromInt count ]
                , case value of
                    Boss stats ->
                        -- hidden/shown with CSS on hover
                        viewBossStats stats

                    _ ->
                        text ""
                ]

        Nothing ->
            text ""


viewBossStats : BossStats -> Html Msg
viewBossStats stats =
    let
        formatHP =
            -- break up large HP totals with commas
            stats.hp
                |> String.fromInt
                |> String.reverse
                |> String.Extra.break 3
                |> String.join ","
                |> String.reverse

        formatSpeed =
            if stats.minSpeed == stats.maxSpeed then
                String.fromInt stats.minSpeed

            else
                String.fromInt stats.minSpeed
                    ++ "-"
                    ++ String.fromInt stats.maxSpeed

        waveDmg =
            let
                -- formula from Zoe's Kainazzo Reference sheet:
                -- https://docs.google.com/spreadsheets/d/1Nf1amT-WzIw7RkffAGpEq05p1nSQ-6qU9lgQr7QyBgk/edit
                min =
                    (toFloat stats.hp / 25)
                        |> ceiling

                max =
                    (toFloat min * 1.5)
                        |> ceiling
            in
            String.fromInt min
                ++ "-"
                ++ String.fromInt max

        darkwaveDmg =
            let
                -- formula from the PAIN MAN sheet:
                -- https://docs.google.com/spreadsheets/d/1w938cMyuKb_-MBAUNQG8L1ynIRGBntskT4I4mkuTgF4/edit
                min =
                    (toFloat (stats.atk * stats.atkMult) / 2)
                        |> ceiling

                max =
                    min + stats.atk
            in
            String.fromInt min
                ++ "-"
                ++ String.fromInt max
    in
    div [ class "boss-stats", onClickNoBubble DoNothing ]
        [ div [] [ text "Approximate stats:" ]
        , div [] [ text <| "HP: " ++ formatHP ]
        , div []
            [ text <|
                "Atk: "
                    ++ String.fromInt stats.atk
                    ++ "x"
                    ++ String.fromInt stats.atkMult
                    ++ ", "
                    ++ String.fromInt stats.hit
                    ++ "%"
            ]
        , div [] [ text <| "Mag: " ++ String.fromInt stats.mag ]
        , div [] [ text <| "Speed: " ++ formatSpeed ]
        , hr [] []
        , div []
            [ span [ class "icon" ] [ Icon.toImg Icon.kainazzo ]
            , text <| "Dmg: " ++ waveDmg
            ]
        , div []
            [ span [ class "icon" ] [ Icon.toImg Icon.dkc ]
            , text <| "Dmg: " ++ darkwaveDmg
            ]
        , div []
            [ span [ class "icon" ] [ Icon.toImg Icon.valvalis ]
            , text <| "MDef: " ++ String.fromInt stats.valvalisMDef
            ]
        ]


updateRandomObjectives : Flags -> Array RandomObjective -> Array RandomObjective
updateRandomObjectives flags objectives =
    let
        delta =
            flags.randomObjectives - Array.length objectives
    in
    if delta > 0 then
        -- add unset objectives to the end of the array
        Array.append objectives <|
            Array.repeat delta Unset

    else if delta < 0 then
        -- remove excess objectives from the end of the array
        Array.slice 0 delta objectives

    else
        objectives


randomObjectiveKeys : Array RandomObjective -> Set Objective.Key
randomObjectiveKeys =
    let
        toMaybeKey o =
            case o of
                Set objective ->
                    Just objective.key

                Unset ->
                    Nothing
    in
    Array.toList
        >> List.filterMap toMaybeKey
        >> Set.fromList


getContext : Model -> Location.Context
getContext =
    -- a bit of a cheat, but currently in most places a) we handle location
    -- events agnostic of whether they're Checks or Shops, and b) any meaningful
    -- logic related to filters only applies to Checks
    getContextFor Location.Checks


getContextFor : Location.Class -> Model -> Location.Context
getContextFor locClass model =
    { flags = model.flags
    , randomObjectives = randomObjectiveKeys model.randomObjectives
    , completedObjectives = model.completedObjectives
    , attainedRequirements = model.attainedRequirements
    , warpGlitchUsed = model.warpGlitchUsed
    , filterOverrides =
        case locClass of
            Location.Checks ->
                model.locationFilterOverrides

            Location.Shops ->
                model.shopFilterOverrides
    }


displayIf : Bool -> Html msg -> Html msg
displayIf predicate html =
    if predicate then
        html

    else
        text ""


displayCellIf : Bool -> Html msg -> Html msg
displayCellIf predicate html =
    if predicate then
        html

    else
        div [] []


with : b -> a -> ( a, b )
with b a =
    ( a, b )


modelFoldl : (a -> Model -> Model) -> List a -> Model -> Model
modelFoldl fn list model =
    List.foldl fn model list


onRightClick : msg -> Html.Attribute msg
onRightClick msg =
    Html.Events.preventDefaultOn "contextmenu" <| Json.Decode.succeed ( msg, True )


{-| A click event that doesn't propagate
-}
onClickNoBubble : msg -> Html.Attribute msg
onClickNoBubble msg =
    Html.Events.custom "click" <|
        Json.Decode.succeed
            { message = msg
            , stopPropagation = True
            , preventDefault = True
            }


focus : String -> Cmd Msg
focus id =
    Browser.Dom.focus id
        |> Task.attempt (always DoNothing)
