module Pages.Top exposing (Model, Msg, Params, page)

import Array exposing (Array)
import Bootstrap.Dropdown as Dropdown exposing (DropdownItem)
import Dict exposing (Dict)
import EverySet as Set exposing (EverySet)
import Flags exposing (Flags)
import Html exposing (Html, div, h2, input, li, span, table, td, text, textarea, tr, ul)
import Html.Attributes exposing (class, classList, type_)
import Html.Events exposing (onClick, onInput)
import Location exposing (Location, Requirement(..))
import Objective exposing (Objective)
import Spa.Document exposing (Document)
import Spa.Page as Page exposing (Page)
import Spa.Url exposing (Url)


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
    , locations : Dict Int Location
    , showCheckedLocations : Bool
    , warpGlitchUsed : Bool
    }


type RandomObjective
    = Set Objective
    | Unset Dropdown.State


type Msg
    = ToggleObjective Objective
    | SetRandomObjective Int Objective
    | DropdownMsg Int Dropdown.State
    | ToggleRequirement Requirement
    | ToggleLocation Int
    | ToggleCheckedLocations
    | ToggleWarpGlitchUsed
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
            "Kmain O1:char_kain/2:quest_antlionnest/random:3,char,boss/req:4"

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
    , locations = Location.locations
    , showCheckedLocations = False
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
    innerUpdate msg model
        |> with Cmd.none


innerUpdate : Msg -> Model -> Model
innerUpdate msg model =
    case msg of
        ToggleObjective objective ->
            { model | completedObjectives = toggle objective model.completedObjectives }

        SetRandomObjective index objective ->
            { model | randomObjectives = Array.set index (Set objective) model.randomObjectives }

        DropdownMsg index dropdown ->
            case Array.get index model.randomObjectives of
                Just (Unset _) ->
                    { model | randomObjectives = Array.set index (Unset dropdown) model.randomObjectives }

                _ ->
                    model

        ToggleRequirement requirement ->
            { model | attainedRequirements = toggle requirement model.attainedRequirements }

        ToggleLocation key ->
            { model | locations = Dict.update key (Maybe.map Location.toggleChecked) model.locations }

        ToggleCheckedLocations ->
            { model | showCheckedLocations = not model.showCheckedLocations }

        ToggleWarpGlitchUsed ->
            { model | warpGlitchUsed = not model.warpGlitchUsed }

        UpdateFlags flagString ->
            let
                flags =
                    Flags.parse flagString

                randomObjectives =
                    updateRandomObjectives flags model.randomObjectives
            in
            -- storing both flagString and the Flags derived from it isn't ideal, but we ignore
            -- flagString everywhere else; it only exists so we can prepopulate the flags textarea
            { model
                | flagString = flagString
                , flags = flags
                , randomObjectives = randomObjectives
            }


view : Model -> Document Msg
view model =
    { title = "FFIV Free Enterprise Tracker"
    , body =
        [ textarea
            [ class "flagstring"
            , onInput UpdateFlags
            ]
            [ text model.flagString ]
        , h2 [] [ text "Objectives" ]
        , viewObjectives model
        , h2 [] [ text "Key Items" ]
        , viewKeyItems model.flags model.attainedRequirements
        , h2 []
            [ text "Locations"
            , input
                [ type_ "checkbox"
                , onClick ToggleCheckedLocations
                ]
                []
            ]
        , viewLocations model
        ]
    }


viewObjectives : Model -> Html Msg
viewObjectives model =
    let
        fixed =
            model.flags.objectives
                |> Array.map (\o -> viewObjective o <| Set.member o model.completedObjectives)
                |> Array.toList

        random =
            model.randomObjectives
                |> Array.indexedMap (\i o -> viewEditableObjective i o model.completedObjectives model.flags.randomObjectiveTypes)
                |> Array.toList
    in
    ul [ class "objectives" ]
        (fixed ++ random)


viewObjective : Objective -> Bool -> Html Msg
viewObjective objective completed =
    li
        [ classList
            [ ( "objective", True )
            , ( "completed", completed )
            ]
        , onClick (ToggleObjective objective)
        ]
        [ span [ class "icon" ] []
        , span [] [ text <| Objective.toString objective ]
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
            -- TODO allow for changing a set objective
            viewObjective objective <| Set.member objective completedObjectives

        Unset dropdown ->
            li []
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
            [ if not <| Set.member Flags.Free flags.keyItems then
                req MistDragon "mist-dragon"

              else
                td [] []
            , req RatTail "rat-tail"
            , req PinkTail "pink-tail"
            , displayIf flags.keyExpBonus <|
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


viewLocations : Model -> Html Msg
viewLocations model =
    let
        setValue : RandomObjective -> Maybe Objective
        setValue randomObjective =
            case randomObjective of
                Set objective ->
                    Just objective

                Unset _ ->
                    Nothing

        context : Location.Context
        context =
            { flags = model.flags
            , randomObjectives = model.randomObjectives |> Array.toList |> List.filterMap setValue |> Set.fromList
            , completedObjectives = model.completedObjectives
            , attainedRequirements = model.attainedRequirements
            , warpGlitchUsed = model.warpGlitchUsed
            }
    in
    model.locations
        -- toList sorts by key
        |> Dict.toList
        |> List.filterMap
            (\( key, loc ) ->
                if Location.isProspect context loc || (model.showCheckedLocations && Location.isChecked loc) then
                    let
                        warpItem =
                            -- assuming here that there's always an item to be had, regardless of K flags
                            if model.flags.warpGlitch && Location.isDwarfCastle loc then
                                [ span
                                    [ classList
                                        [ ( "icon key-item clickable", True )
                                        , ( "disabled", not model.warpGlitchUsed )
                                        ]
                                    , onClick ToggleWarpGlitchUsed
                                    ]
                                    []
                                ]

                            else
                                []
                    in
                    Just <|
                        div
                            [ classList
                                [ ( "location", True )
                                , ( "checked", Location.isChecked loc )
                                ]
                            ]
                        <|
                            [ span
                                [ class "name"
                                , onClick <| ToggleLocation key
                                ]
                                [ text <| Location.getName loc ]
                            , span [ class "icons" ] <|
                                List.repeat (Location.getCharacters context loc) (span [ class "icon character" ] [])
                                    ++ List.repeat (Location.getBosses context loc) (span [ class "icon boss" ] [])
                                    ++ List.repeat (Location.getKeyItems context loc) (span [ class "icon key-item" ] [])
                                    ++ warpItem
                            ]

                else
                    Nothing
            )
        |> div [ class "locations" ]


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


with : b -> a -> ( a, b )
with b a =
    ( a, b )
