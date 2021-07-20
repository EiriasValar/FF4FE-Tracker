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
import EverySet as Set exposing (EverySet)
import Flags exposing (Flags, KeyItemClass(..))
import Html exposing (Html, div, h2, h4, li, span, table, td, text, textarea, tr, ul)
import Html.Attributes exposing (class, classList, id)
import Html.Events exposing (onClick, onInput)
import Icon
import Json.Decode
import Location
    exposing
        ( ConsumableItem
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
    , items : List ( Int, ConsumableItem )
    }


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
    | ToggleShopMenu (List ( Int, ConsumableItem )) Location.Key Int
    | ToggleShopItem ShopMenu Int
    | UpdateFlags String


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


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    -- we don't have any Cmds to send (we're just using Browser.document for
    -- subscriptions)
    innerUpdate msg model
        |> with Cmd.none


innerUpdate : Msg -> Model -> Model
innerUpdate msg model =
    let
        toggleProperty key index hard newModel =
            { newModel | locations = Location.update key (Maybe.map <| Location.toggleProperty index hard) newModel.locations }
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
            { model | attainedRequirements = toggle requirement model.attainedRequirements }

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
                    Location.toggleStatus status location

                requirements =
                    newLocation
                        |> Location.getProperties (getContext model)
                        |> List.filterMap
                            (\( _, _, value ) ->
                                case value of
                                    Requirement req ->
                                        Just req

                                    _ ->
                                        Nothing
                            )
                        |> Set.fromList

                attainedRequirements =
                    case Location.getStatus newLocation of
                        Unseen ->
                            Set.diff model.attainedRequirements requirements

                        Dismissed ->
                            Set.union model.attainedRequirements requirements

                        _ ->
                            model.attainedRequirements
            in
            { model
                | locations = Location.insert newLocation model.locations
                , attainedRequirements = attainedRequirements
            }

        ToggleProperty key index ->
            toggleProperty key index False model

        HardToggleProperty key index ->
            toggleProperty key index True model

        ToggleWarpGlitchUsed key index ->
            toggleProperty key index False <|
                { model | warpGlitchUsed = not model.warpGlitchUsed }

        ToggleShopMenu items key index ->
            let
                newShop =
                    { key = key
                    , index = index
                    , items = items
                    }

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
                                { menu | items = items }
                            )
            in
            { model
                | locations = locations
                , shopMenu = shopMenu
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


view : Model -> Browser.Document Msg
view model =
    { title = "FFIV Free Enterprise Tracker"
    , body =
        [ div [ class "content" ]
            [ div [ id "flagstring" ]
                [ textarea
                    [ class "flagstring"
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
                [ h2 []
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
                        Dropdown.toggle [] [ text "(Set random objective)" ]
                    , items =
                        section Objective.Character "Character Hunts" Objective.characters
                            ++ section Objective.Boss "Boss Hunts" Objective.bosses
                            ++ section Objective.Quest "Quests" Objective.quests
                    }
                ]


viewKeyItems : Flags -> Set Requirement -> Html Msg
viewKeyItems flags attained =
    let
        req : Requirement -> String -> Html Msg
        req requirement class =
            td
                [ onClick (ToggleRequirement requirement) ]
                [ div
                    [ classList
                        [ ( "requirement " ++ class, True )
                        , ( "disabled", not <| Set.member requirement attained )
                        ]
                    ]
                    []
                ]

        numAttained =
            -- we care about this number for the 10 key items experience bonus, so
            -- don't count the MistDragon or Pass, which aren't real key items
            attained
                |> Set.filter (not << Location.isPseudo)
                |> Set.size
    in
    table [ class "requirements" ]
        [ tr []
            [ req Crystal "crystal"
            , displayCellIf flags.passExists <|
                req (Pseudo Pass) "pass"
            , req Hook "hook"
            , req DarknessCrystal "darkness-crystal"
            ]
        , tr []
            [ req EarthCrystal "earth-crystal"
            , req TwinHarp "twin-harp"
            , req Package "package"
            , req SandRuby "sand-ruby"
            ]
        , tr []
            [ req BaronKey "baron-key"
            , req MagmaKey "magma-key"
            , req TowerKey "tower-key"
            , req LucaKey "luca-key"
            ]
        , tr []
            [ req Adamant "adamant"
            , req LegendSword "legend-sword"
            , req Pan "pan"
            , req Spoon "spoon"
            ]
        , tr []
            [ displayCellIf (not <| Set.member Flags.Free flags.keyItems) <|
                req (Pseudo MistDragon) "mist-dragon"
            , req RatTail "rat-tail"
            , displayCellIf (not <| Set.member Vanilla flags.keyItems) <|
                req PinkTail "pink-tail"
            , displayCellIf flags.keyExpBonus <|
                td
                    [ classList
                        [ ( "requirement total", True )
                        , ( "key-bonus-reached", numAttained >= 10 )
                        ]
                    ]
                    [ displayIf (numAttained > 0) <|
                        text <|
                            String.fromInt numAttained
                    ]
            ]
        ]


viewFilters : Model -> Html Msg
viewFilters model =
    let
        viewFilter filter =
            let
                stateClass =
                    case Dict.get filter model.filterOverrides of
                        Just Show ->
                            "show"

                        Just Hide ->
                            "hide"

                        Nothing ->
                            "unset"

                icon =
                    Icon.fromFilter filter
            in
            span
                [ class "filter"
                , class stateClass
                , class icon.class
                , onClick <| ToggleFilter filter
                ]
                [ icon.img |> Html.map never ]
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
                , onClick <| ToggleShopItem menu itemIndex
                ]
                [ text item.name ]
    in
    div [ class "shop-menu" ] <|
        List.map viewItem menu.items


viewProperty : Location.Context -> Location -> ( Int, Status, Value ) -> Html Msg
viewProperty context location ( index, status, value ) =
    let
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

        msg =
            case value of
                KeyItem Warp ->
                    ToggleWarpGlitchUsed

                Shop (Healing items) ->
                    ToggleShopMenu <| Location.filterItems context location items

                Shop (JItem items) ->
                    ToggleShopMenu <| Location.filterItems context location items

                _ ->
                    ToggleProperty

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
                , onClick <| msg (Location.getKey location) index
                , onRightClick <| HardToggleProperty (Location.getKey location) index
                ]
                [ icon.img |> Html.map never
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
    let
        toMaybe : RandomObjective -> Maybe Objective
        toMaybe randomObjective =
            case randomObjective of
                Set objective ->
                    Just objective

                Unset _ ->
                    Nothing
    in
    { flags = model.flags
    , randomObjectives = model.randomObjectives |> Array.toList |> List.filterMap toMaybe |> Set.fromList
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
        td [] []


with : b -> a -> ( a, b )
with b a =
    ( a, b )


onRightClick : msg -> Html.Attribute msg
onRightClick msg =
    Html.Events.preventDefaultOn "contextmenu" <| Json.Decode.succeed ( msg, True )
