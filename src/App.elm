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
import Bootstrap.Dropdown as Dropdown exposing (DropdownItem)
import Browser
import Browser.Dom
import Browser.Events
import EverySet as Set exposing (EverySet)
import Flags exposing (Flags, KeyItemClass(..))
import Html exposing (Html, a, div, h2, h4, li, span, text, textarea, ul)
import Html.Attributes exposing (autocomplete, class, classList, cols, href, id, rows, spellcheck, target, title, value)
import Html.Events exposing (onClick, onInput)
import Icon
import Json.Decode
import Location
    exposing
        ( ConsumableItem
        , ConsumableItems
        , Filter(..)
        , FilterType(..)
        , Location
        , Locations
        , PseudoRequirement(..)
        , Requirement(..)
        , ShopValue(..)
        , Status(..)
        , Value(..)
        )
import Maybe.Extra
import Objective exposing (Objective)
import String.Extra
import Task


type alias Set a =
    EverySet a


type alias Model =
    { flagString : String
    , flags : Flags
    , randomObjectives : Array RandomObjective
    , completedObjectives : Set Objective
    , attainedRequirements : Set Requirement
    , locations : Locations
    , filterOverrides : Dict Filter FilterType
    , warpGlitchUsed : Bool
    , shopMenu : Maybe ShopMenu
    }


type RandomObjective
    = Set Objective
    | Unset Dropdown.State


type alias ShopMenu =
    { key : Location.Key
    , index : Int
    , content : ShopMenuContent
    }


type ShopMenuContent
    = Items (List ( Int, ConsumableItem ))
    | Text String


type Msg
    = ToggleObjective Objective
    | SetRandomObjective Int Objective
    | UnsetRandomObjective Int
    | DropdownMsg Int Dropdown.State
    | ToggleRequirement Requirement
    | ToggleFilter Filter
    | ToggleLocationStatus Location Location.Status
    | ToggleProperty Location.Key Int
    | HardToggleProperty Location.Key Int
    | ToggleWarpGlitchUsed Location.Key Int
    | ToggleShopMenu ShopMenu
    | CloseShopMenu
    | ToggleShopItem ShopMenu Int
    | UpdateShopText ShopMenu String
    | UpdateFlags String
    | DoNothing


{-| The ID of any shop menu text input, of which only one will ever
exist at a time.
-}
shopMenuID : String
shopMenuID =
    "shop-menu-input"


init : () -> ( Model, Cmd Msg )
init _ =
    let
        flagString =
            "Kmain/summon/moon Sstandard Gwarp Nkey O1:char_kain/2:quest_antlionnest/random:3,char,boss/req:4"

        flags =
            Flags.parse flagString

        randomObjectives =
            updateRandomObjectives flags Array.empty
    in
    { flagString = flagString
    , flags = flags
    , randomObjectives = randomObjectives
    , completedObjectives = Set.empty
    , attainedRequirements = Set.empty
    , locations = Location.all
    , filterOverrides =
        Dict.fromList
            [ ( Characters, Show )
            , ( KeyItems, Show )
            , ( Chests, Hide )
            ]
    , warpGlitchUsed = False
    , shopMenu = Nothing
    }
        |> with Cmd.none


subscriptions : Model -> Sub Msg
subscriptions model =
    let
        dropdowns =
            model.randomObjectives
                |> Array.indexedMap
                    (\index randomObjective ->
                        case randomObjective of
                            Unset dropdown ->
                                Dropdown.subscriptions dropdown (DropdownMsg index)

                            Set _ ->
                                Sub.none
                    )
                |> Array.toList
                |> Sub.batch

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

        shopMenu =
            case model.shopMenu of
                Just _ ->
                    Sub.batch [ shopMenuClick, shopMenuEscape ]

                Nothing ->
                    Sub.none
    in
    Sub.batch
        [ dropdowns
        , shopMenu
        ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        -- doing this here rather than every other Msg branch having to
        -- explicitly return its own Cmd.none
        cmd =
            case msg of
                ToggleShopMenu _ ->
                    -- a bit inelegant that we're unconditionally trying to
                    -- focus an element that will only sometimes exist, but so
                    -- convenient
                    Browser.Dom.focus shopMenuID
                        |> Task.attempt (always DoNothing)

                _ ->
                    Cmd.none
    in
    innerUpdate msg model
        |> with cmd


innerUpdate : Msg -> Model -> Model
innerUpdate msg model =
    let
        toggleProperty key index hard newModel =
            { newModel | locations = Location.update key (Maybe.map <| Location.toggleProperty index hard) newModel.locations }

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
    in
    case msg of
        ToggleObjective objective ->
            { model | completedObjectives = toggle objective model.completedObjectives }

        SetRandomObjective index objective ->
            { model | randomObjectives = Array.set index (Set objective) model.randomObjectives }

        UnsetRandomObjective index ->
            -- the UI doesn't allow unsetting an objective if it's completed, so we don't
            -- have to worry about un-completing it here
            { model | randomObjectives = Array.set index (Unset Dropdown.initialState) model.randomObjectives }

        DropdownMsg index dropdown ->
            case Array.get index model.randomObjectives of
                Just (Unset _) ->
                    { model | randomObjectives = Array.set index (Unset dropdown) model.randomObjectives }

                _ ->
                    model

        ToggleRequirement requirement ->
            if Set.member requirement model.attainedRequirements then
                { model | attainedRequirements = Set.remove requirement model.attainedRequirements }

            else
                attainRequirement requirement model

        ToggleFilter filter ->
            { model
                | filterOverrides =
                    Dict.update filter
                        (\state ->
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
                        )
                        model.filterOverrides
            }

        ToggleLocationStatus location status ->
            let
                newLocation =
                    Location.toggleStatus (getContext model) status location

                newModel =
                    { model | locations = Location.insert newLocation model.locations }

                -- collect any Requirements this location awards as value
                requirements =
                    newLocation
                        |> Location.getProperties (getContext newModel)
                        |> List.filterMap
                            (\( _, _, value ) ->
                                case value of
                                    Requirement req ->
                                        Just req

                                    _ ->
                                        Nothing
                            )
                        |> Set.fromList
            in
            case Location.getStatus newLocation of
                Unseen ->
                    -- unattain the rewarded requirements
                    { newModel | attainedRequirements = Set.diff newModel.attainedRequirements requirements }

                Dismissed ->
                    -- attain the rewarded requirements
                    Set.foldl attainRequirement newModel requirements

                _ ->
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
                        |> Maybe.map (Location.getItems (getContext model) menu.index)
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
                    randomObjectives
                        |> Array.toList
                        |> List.filterMap randomObjectiveToMaybe
                        |> List.append (Array.toList flags.objectives)
                        |> Set.fromList
                        |> Set.intersect model.completedObjectives

                -- filter out chests when they're all empty, unless they've explicitly
                -- been enabled
                filterOverrides =
                    if flags.noTreasures && Dict.get Chests model.filterOverrides /= Just Show then
                        Dict.insert Chests Hide model.filterOverrides

                    else
                        model.filterOverrides
            in
            -- storing both flagString and the Flags derived from it isn't ideal, but we ignore
            -- flagString everywhere else; it only exists so we can prepopulate the flags textarea
            { model
                | flagString = flagString
                , flags = flags
                , randomObjectives = randomObjectives
                , completedObjectives = completedObjectives
                , filterOverrides = filterOverrides
                , shopMenu = Nothing
            }

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
                    , viewFilters model
                    ]
                , viewLocations model Location.Checks
                ]
            , displayIf (not <| List.member model.flags.shopRandomization [ Flags.Cabins, Flags.Empty ] || model.flags.passInShop) <|
                div [ id "shops" ]
                    [ h2 [] [ text "Shops" ]
                    , viewLocations model Location.Shops
                    ]
            ]
        , div [ id "footer" ]
            [ text "Documentation, credits, etc can be found in "
            , a [ href "https://github.com/EiriasValar/FF4FE-Tracker", target "_blank" ]
                [ text "the GitHub repo" ]
            ]
        ]
    }


viewObjectives : Model -> Html Msg
viewObjectives model =
    let
        numCompleted =
            Set.size model.completedObjectives

        numRequired =
            model.flags.requiredObjectives

        fixed =
            model.flags.objectives
                |> Array.map (\o -> viewObjective o (Set.member o model.completedObjectives) Nothing)
                |> Array.toList

        random =
            model.randomObjectives
                |> Array.indexedMap (\i o -> viewEditableObjective i o model.completedObjectives model.flags.randomObjectiveTypes)
                |> Array.toList
    in
    div [ id "objectives" ]
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
        , ul [ class "objectives" ]
            (fixed ++ random)
        ]


viewObjective : Objective -> Bool -> Maybe Int -> Html Msg
viewObjective objective completed randomIndex =
    let
        onClickNoPropagate msg =
            Html.Events.stopPropagationOn "click" <| Json.Decode.succeed ( msg, True )
    in
    li
        [ classList
            [ ( "objective", True )
            , ( "completed", completed )
            ]
        , onClick (ToggleObjective objective)
        ]
        [ span [ class "icon state" ] []
        , span [ class "text" ] [ text <| Objective.toString objective ]
        , case ( completed, randomIndex ) of
            ( False, Just index ) ->
                -- we're unlikely to want to delete a completed objective, and in the
                -- event that we do, it's easy enough to toggle it off again first
                span [ class "icon delete", onClickNoPropagate <| UnsetRandomObjective index ] []

            _ ->
                text ""
        ]


viewEditableObjective : Int -> RandomObjective -> Set Objective -> Set Objective.Type -> Html Msg
viewEditableObjective index randomObjective completedObjectives objectiveTypes =
    let
        item : Objective -> DropdownItem Msg
        item objective =
            Dropdown.buttonItem
                [ onClick <| SetRandomObjective index objective ]
                [ text <| Objective.toString objective ]

        section : Objective.Type -> String -> List Objective -> List (DropdownItem Msg)
        section objectiveType header objectives =
            if Set.member objectiveType objectiveTypes then
                Dropdown.header [ text header ]
                    :: List.map item objectives

            else
                []
    in
    case randomObjective of
        Set objective ->
            viewObjective objective (Set.member objective completedObjectives) (Just index)

        Unset dropdown ->
            li [ class "objective unset" ]
                [ Dropdown.dropdown
                    dropdown
                    { options = []
                    , toggleMsg = DropdownMsg index
                    , toggleButton =
                        Dropdown.toggle [] [ text "(Choose random objective)" ]
                    , items =
                        section Objective.Character "Character Hunts" Objective.characters
                            ++ section Objective.Boss "Boss Hunts" Objective.bosses
                            ++ section Objective.Quest "Quests" Objective.quests
                            ++ section Objective.GatedQuest "Gated Quests" Objective.gatedQuests
                    }
                ]


viewKeyItems : Flags -> Set Requirement -> Html Msg
viewKeyItems flags attained =
    let
        req : Requirement -> Html Msg
        req requirement =
            case Icon.fromRequirement requirement of
                Just icon ->
                    icon.img
                        [ class "requirement"
                        , class icon.class
                        , classList [ ( "disabled", not <| Set.member requirement attained ) ]
                        , title icon.title
                        , onClick (ToggleRequirement requirement)
                        ]

                Nothing ->
                    div [] []

        numAttained =
            -- we care about this number for the 10 key items experience bonus, so
            -- don't count the things that aren't real key items
            attained
                |> Set.filter (not << Location.isPseudo)
                |> Set.size
    in
    div [ class "requirements" ]
        [ req Crystal
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
                [ class "requirement total"
                , classList [ ( "key-bonus-reached", numAttained >= 10 ) ]
                ]
                [ displayIf (numAttained > 0) <|
                    text (String.fromInt numAttained)
                ]
        ]


viewFilters : Model -> Html Msg
viewFilters model =
    let
        viewFilter filter =
            let
                ( stateClass, hide ) =
                    case Dict.get filter model.filterOverrides of
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
                [ class "filter"
                , class stateClass
                , class icon.class
                , title icon.title
                , onClick <| ToggleFilter filter
                ]
                [ icon.img []
                , displayIf hide <|
                    Icon.no
                ]
    in
    span [ class "filters" ] <|
        List.map viewFilter [ Characters, KeyItems, Bosses, Chests, TrappedChests, Checked ]


viewLocations : Model -> Location.Class -> Html Msg
viewLocations model locClass =
    let
        context : Location.Context
        context =
            getContext model

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
        , class <| Location.statusToString <| Location.getStatus location
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
                , class <| Location.statusToString item.status

                -- prevent propagation so toggling an item doesn't
                -- also trigger closing the menu
                , onClickNoBubble <| ToggleShopItem menu itemIndex
                ]
                [ text item.name ]
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


viewProperty : Location.Context -> Location -> ( Int, Status, Value ) -> Html Msg
viewProperty context location ( index, status, value ) =
    let
        key =
            Location.getKey location

        extraClass =
            case value of
                KeyItem Warp ->
                    "warp"

                Chest _ ->
                    "countable"

                TrappedChest _ ->
                    "countable"

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
            case ( Location.countable value, status ) of
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
                , class <| Location.statusToString status
                , title <|
                    case value of
                        KeyItem Warp ->
                            "Sealed Cave key item check"

                        _ ->
                            icon.title
                , clickHandler
                , onRightClick <| HardToggleProperty key index
                ]
                [ icon.img []
                , displayIf (count > 0) <|
                    span [ class "count" ] [ text <| String.fromInt count ]
                ]

        Nothing ->
            text ""


updateRandomObjectives : Flags -> Array RandomObjective -> Array RandomObjective
updateRandomObjectives flags objectives =
    let
        delta =
            flags.randomObjectives - Array.length objectives
    in
    if delta > 0 then
        -- add unset objectives to the end of the array
        Array.append objectives <|
            Array.repeat delta (Unset Dropdown.initialState)

    else if delta < 0 then
        -- remove excess objectives from the end of the array
        Array.slice 0 delta objectives

    else
        objectives


randomObjectiveToMaybe : RandomObjective -> Maybe Objective
randomObjectiveToMaybe o =
    case o of
        Set objective ->
            Just objective

        Unset _ ->
            Nothing


getContext : Model -> Location.Context
getContext model =
    { flags = model.flags
    , randomObjectives = model.randomObjectives |> Array.toList |> List.filterMap randomObjectiveToMaybe |> Set.fromList
    , completedObjectives = model.completedObjectives
    , attainedRequirements = model.attainedRequirements
    , warpGlitchUsed = model.warpGlitchUsed
    , filterOverrides = model.filterOverrides
    }


toggle : a -> Set a -> Set a
toggle item set =
    if Set.member item set then
        Set.remove item set

    else
        Set.insert item set


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
