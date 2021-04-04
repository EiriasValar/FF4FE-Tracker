module Pages.Top exposing (Model, Msg, Params, page)

import Dict exposing (Dict)
import EverySet as Set exposing (EverySet)
import Flags exposing (Flags)
import Html exposing (Html, button, div, h2, input, span, table, td, text, textarea, tr)
import Html.Attributes exposing (class, classList, style, type_)
import Html.Events exposing (onClick, onInput)
import Location exposing (Location, Metadata, Requirement(..))
import Spa.Document exposing (Document)
import Spa.Page as Page exposing (Page)
import Spa.Url exposing (Url)


type alias Set a =
    EverySet a


type alias Params =
    ()


type alias Model =
    { url : Url Params
    , metadata : Metadata
    , attained : Set Requirement
    , locations : Dict Int Location
    , showCheckedLocations : Bool
    }


type Msg
    = ToggleRequirement Requirement
    | ToggleLocation Int
    | ToggleCheckedLocations
    | ToggleWarpGlitchUsed
    | UpdateFlags String
    | Reset


page : Page Params Model Msg
page =
    Page.sandbox
        { init = init
        , update = update
        , view = view
        }


init : Url Params -> Model
init url =
    { url = url
    , metadata =
        { flags = Flags.default
        , warpGlitchUsed = False
        }
    , attained = Set.empty
    , locations = Location.locations
    , showCheckedLocations = False
    }


update : Msg -> Model -> Model
update msg model =
    case msg of
        ToggleRequirement requirement ->
            { model | attained = toggle requirement model.attained }

        ToggleLocation key ->
            { model | locations = Dict.update key (Maybe.map Location.toggleChecked) model.locations }

        ToggleCheckedLocations ->
            { model | showCheckedLocations = not model.showCheckedLocations }

        ToggleWarpGlitchUsed ->
            let
                metadata =
                    model.metadata
            in
            { model | metadata = { metadata | warpGlitchUsed = not metadata.warpGlitchUsed } }

        UpdateFlags flagString ->
            let
                metadata =
                    model.metadata
            in
            { model | metadata = { metadata | flags = Flags.parse flagString } }

        Reset ->
            { model | attained = Set.empty, locations = Location.locations }


view : Model -> Document Msg
view model =
    { title = "FFIV Free Enterprise Tracker"
    , body =
        [ textarea [ onInput UpdateFlags ] []
        , h2 [] [ text "Key Items" ]
        , viewKeyItems model.metadata model.attained

        --, h2 [] [ text "Objectives" ]
        --, viewObjectives
        , h2 []
            [ text "Locations"
            , input
                [ type_ "checkbox"
                , onClick ToggleCheckedLocations
                ]
                []
            ]
        , viewLocations model.metadata model.locations model.attained model.showCheckedLocations
        ]
    }


viewKeyItems : Metadata -> Set Requirement -> Html Msg
viewKeyItems metadata attained =
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
            [ if not <| Set.member Flags.Free metadata.flags.keyItems then
                req MistDragon "mist-dragon"

              else
                td [] []
            , req RatTail "rat-tail"
            , req PinkTail "pink-tail"
            , td
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


viewObjectives : Html Msg
viewObjectives =
    text ""


viewLocations : Metadata -> Dict Int Location -> Set Requirement -> Bool -> Html Msg
viewLocations metadata locations attained showChecked =
    locations
        -- toList sorts by key
        |> Dict.toList
        |> List.filterMap
            (\( key, loc ) ->
                if Location.isProspect metadata attained loc || (showChecked && Location.isChecked loc) then
                    let
                        warpItem =
                            -- assuming here that there's always an item to be had, regardless of K flags
                            if metadata.flags.warpGlitch && Location.isDwarfCastle loc then
                                [ span
                                    [ classList
                                        [ ( "icon key-item clickable", True )
                                        , ( "disabled", not metadata.warpGlitchUsed )
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
                                List.repeat (Location.getCharacters metadata loc) (span [ class "icon character" ] [])
                                    ++ List.repeat (Location.getBosses metadata loc) (span [ class "icon boss" ] [])
                                    ++ List.repeat (Location.getKeyItems metadata loc) (span [ class "icon key-item" ] [])
                                    ++ warpItem
                            ]

                else
                    Nothing
            )
        |> div [ class "locations" ]


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
