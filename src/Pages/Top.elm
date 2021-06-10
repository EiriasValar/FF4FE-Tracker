module Pages.Top exposing (Model, Msg, Params, page)

import Array exposing (Array)
import AssocList as Dict exposing (Dict)
import Bootstrap.Dropdown as Dropdown exposing (DropdownItem)
import EverySet as Set exposing (EverySet)
import Flags exposing (Flags, KeyItemClass(..))
import Html exposing (Html, div, h2, h4, img, input, li, span, table, td, text, textarea, tr, ul)
import Html.Attributes exposing (class, classList, id, src, type_)
import Html.Events exposing (onClick, onInput)
import Icon
import Json.Decode
import Location exposing (Filter(..), FilterType(..), Location, Locations, Requirement(..), Status(..), Value(..))
import Objective exposing (Objective)
import Spa.Document exposing (Document)
import Spa.Page as Page exposing (Page)
import Spa.Url exposing (Url)
import String.Extra


type alias Set a =
    EverySet a


type alias Params =
    ()


type alias Model =
    { url : Url Params
    , flagString : String
    , flags : Flags
    , randomObjectives : Array RandomObjective
    , completedObjectives : Set Objective
    , attainedRequirements : Set Requirement
    , locations : Locations
    , filterOverrides : Dict Filter FilterType
    , warpGlitchUsed : Bool
    }


type RandomObjective
    = Set Objective
    | Unset Dropdown.State


type Msg
    = ToggleObjective Objective
    | SetRandomObjective Int Objective
    | UnsetRandomObjective Int
    | DropdownMsg Int Dropdown.State
    | ToggleRequirement Requirement
    | ToggleFilter Filter
    | ToggleLocationStatus Location.Key Location.Status
    | ToggleProperty Location.Key Int
    | ToggleWarpGlitchUsed Location.Key Int
    | UpdateFlags String


page : Page Params Model Msg
page =
    Page.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


init : Url Params -> ( Model, Cmd Msg )
init url =
    let
        flagString =
            "Kmain/summon/moon Gwarp Nkey O1:char_kain/2:quest_antlionnest/random:3,char,boss/req:4"

        flags =
            Flags.parse flagString

        randomObjectives =
            updateRandomObjectives flags Array.empty
    in
    { url = url
    , flagString = flagString
    , flags = flags
    , randomObjectives = randomObjectives
    , completedObjectives = Set.empty
    , attainedRequirements = Set.empty
    , locations = Location.all
    , filterOverrides =
        Dict.fromList
            [ ( Characters, Show )
            , ( KeyItems, Show )
            ]
    , warpGlitchUsed = False
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
    -- just using Page.element for the subscriptions, don't have any Cmds to send
    innerUpdate msg model
        |> with Cmd.none


innerUpdate : Msg -> Model -> Model
innerUpdate msg model =
    let
        toggleProperty key index newModel =
            -- TODO decrement countables (chests and trapped chests) rather than toggling
            { newModel | locations = Location.update key (Maybe.map <| Location.toggleProperty index) newModel.locations }
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

        ToggleLocationStatus key status ->
            { model | locations = Location.update key (Maybe.map <| Location.toggleStatus status) model.locations }

        ToggleProperty key index ->
            toggleProperty key index model

        ToggleWarpGlitchUsed key index ->
            toggleProperty key index <|
                { model | warpGlitchUsed = not model.warpGlitchUsed }

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
            in
            -- storing both flagString and the Flags derived from it isn't ideal, but we ignore
            -- flagString everywhere else; it only exists so we can prepopulate the flags textarea
            { model
                | flagString = flagString
                , flags = flags
                , randomObjectives = randomObjectives
                , completedObjectives = completedObjectives
            }


view : Model -> Document Msg
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
            , div [ id "shops" ]
                [ h2 [] [ text "Shops" ]

                -- TODO add item types as values to shops, make them toggleable
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
                |> Set.filter (not << memberOf [ MistDragon, Pass ])
                |> Set.size
    in
    table [ class "requirements" ]
        [ tr []
            [ req Crystal "crystal"
            , req Pass "pass"
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
                req MistDragon "mist-dragon"
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
            { flags = model.flags
            , randomObjectives = model.randomObjectives |> Array.toList |> List.filterMap toMaybe |> Set.fromList
            , completedObjectives = model.completedObjectives
            , attainedRequirements = model.attainedRequirements
            , warpGlitchUsed = model.warpGlitchUsed
            , filterOverrides = model.filterOverrides
            }

        toMaybe : RandomObjective -> Maybe Objective
        toMaybe randomObjective =
            case randomObjective of
                Set objective ->
                    Just objective

                Unset _ ->
                    Nothing

        viewArea : ( Location.Area, List Location ) -> Html Msg
        viewArea ( area, locations ) =
            div []
                [ h4 []
                    [ text <| String.Extra.toTitleCase <| Location.areaToString area ]
                , div [] <|
                    List.map (viewLocation context) locations
                ]
    in
    model.locations
        |> Location.filterByContext locClass context
        |> Location.groupByArea
        |> List.map viewArea
        |> div [ class "locations" ]


viewLocation : Location.Context -> Location -> Html Msg
viewLocation context location =
    let
        key =
            Location.getKey location

        onRightClick msg =
            Html.Events.preventDefaultOn "contextmenu" <| Json.Decode.succeed ( msg, True )

        viewProperty ( index, status, value ) =
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
                    if value == Location.KeyItem Flags.Warp then
                        ToggleWarpGlitchUsed

                    else
                        ToggleProperty
            in
            case Icon.fromValue value of
                Just icon ->
                    span
                        [ class "icon"
                        , class icon.class
                        , class extraClass
                        , class <| Location.statusToString status
                        , onClick <| msg (Location.getKey location) index
                        ]
                        [ icon.img |> Html.map never
                        , span [ class "count" ]
                            [ case value of
                                Location.Chest count ->
                                    text <| String.fromInt count

                                Location.TrappedChest count ->
                                    text <| String.fromInt count

                                _ ->
                                    text ""
                            ]
                        ]

                Nothing ->
                    text ""
    in
    div
        [ class "location"
        , class <| Location.statusToString <| Location.getStatus location
        ]
        [ span
            [ class "name"
            , onClick <| ToggleLocationStatus key Dismissed

            -- TODO do this without requiring right-clicks
            , onRightClick <| ToggleLocationStatus key Seen
            ]
            [ text <| Location.getName location ]
        , span [ class "icons" ] <|
            List.map viewProperty (Location.getProperties context location)
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


memberOf : List a -> a -> Bool
memberOf xs x =
    List.member x xs


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
