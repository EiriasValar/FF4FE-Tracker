module Pages.Top exposing (Model, Msg, Params, page)

import Array exposing (Array)
import Bootstrap.CDN
import Bootstrap.Dropdown as Dropdown
import Dict exposing (Dict)
import EverySet as Set exposing (EverySet)
import Flags exposing (Flags)
import Html exposing (Html, button, div, h2, input, li, span, table, td, text, textarea, tr, ul)
import Html.Attributes exposing (class, classList, style, type_)
import Html.Events exposing (onClick, onInput)
import Location exposing (Context, Location, Requirement(..))
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
    , randomObjectives : Array (Maybe Objective)
    , dropdowns : Array Dropdown.State
    , completedObjectives : Set Objective
    , attainedRequirements : Set Requirement
    , locations : Dict Int Location
    , showCheckedLocations : Bool
    , warpGlitchUsed : Bool
    }


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
            Flags.updateRandomObjectives Array.empty flags

        dropdowns =
            fixDropdownsLength (Array.length randomObjectives) Array.empty
    in
    { url = url
    , flagString = flagString
    , flags = flags
    , randomObjectives = randomObjectives
    , dropdowns = dropdowns
    , completedObjectives = Set.empty
    , attainedRequirements = Set.empty
    , locations = Location.locations
    , showCheckedLocations = False
    , warpGlitchUsed = False
    }
        |> with Cmd.none


subscriptions : Model -> Sub Msg
subscriptions model =
    model.dropdowns
        |> Array.indexedMap
            (\index dropdown ->
                Dropdown.subscriptions dropdown (DropdownMsg index)
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
            { model | randomObjectives = Array.set index (Just objective) model.randomObjectives }

        DropdownMsg index dropdown ->
            { model | dropdowns = Array.set index dropdown model.dropdowns }

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
                    Flags.updateRandomObjectives model.randomObjectives flags

                dropdowns =
                    fixDropdownsLength (Array.length randomObjectives) model.dropdowns
            in
            -- storing both flagString and the Flags derived from it isn't ideal, but we ignore
            -- flagString everywhere else; it only exists so we can prepopulate the flags textarea
            { model
                | flagString = flagString
                , flags = flags
                , randomObjectives = randomObjectives
                , dropdowns = dropdowns
            }


view : Model -> Document Msg
view model =
    { title = "FFIV Free Enterprise Tracker"
    , body =
        [ -- TODO remove this
          Bootstrap.CDN.stylesheet
        , textarea
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
                |> Array.indexedMap (\i o -> viewEditableObjective i o model.completedObjectives (Array.get i model.dropdowns))
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


viewEditableObjective : Int -> Maybe Objective -> Set Objective -> Maybe Dropdown.State -> Html Msg
viewEditableObjective index maybeObjective completedObjectives maybeDropdown =
    case ( maybeObjective, maybeDropdown ) of
        ( Just objective, _ ) ->
            -- TODO allow for changing a set objective
            viewObjective objective <| Set.member objective completedObjectives

        ( Nothing, Just dropdown ) ->
            -- TODO allow for setting an objective
            li []
                [ Dropdown.dropdown
                    dropdown
                    { options = []
                    , toggleMsg = DropdownMsg index
                    , toggleButton =
                        Dropdown.toggle [] [ text "(Set random objective)" ]
                    , items =
                        Dropdown.header [ text "Character Hunts" ]
                            :: (Objective.characters
                                    |> List.map
                                        (\char ->
                                            Dropdown.buttonItem
                                                [ onClick <| SetRandomObjective index <| Objective.Character char ]
                                                [ text <| Objective.toString <| Objective.Character char ]
                                        )
                               )
                            ++ Dropdown.header [ text "Boss Hunts" ]
                            :: (Objective.bosses
                                    |> List.map
                                        (\boss ->
                                            Dropdown.buttonItem
                                                [ onClick <| SetRandomObjective index <| Objective.Boss boss ]
                                                [ text <| Objective.toString <| Objective.Boss boss ]
                                        )
                               )
                            ++ Dropdown.header [ text "Quests" ]
                            :: (Objective.quests
                                    |> List.map
                                        (\quest ->
                                            Dropdown.buttonItem
                                                [ onClick <| SetRandomObjective index <| Objective.Quest quest ]
                                                [ text <| Objective.toString <| Objective.Quest quest ]
                                        )
                               )
                    }
                ]

        ( Nothing, Nothing ) ->
            li [] [ text "No objective, no dropdown state, no way out!" ]


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
        context =
            { flags = model.flags
            , randomObjectives = model.randomObjectives
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


fixDropdownsLength : Int -> Array Dropdown.State -> Array Dropdown.State
fixDropdownsLength newCount dropdowns =
    let
        delta =
            newCount - Array.length dropdowns
    in
    if delta > 0 then
        Array.append dropdowns <|
            Array.repeat delta Dropdown.initialState

    else if delta < 0 then
        Array.slice 0 delta dropdowns

    else
        dropdowns


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
