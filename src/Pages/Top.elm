module Pages.Top exposing (Model, Msg, Params, page)

import Dict exposing (Dict)
import EverySet as Set exposing (EverySet)
import Html exposing (Html, button, div, h2, span, table, td, text, textarea, tr)
import Html.Attributes exposing (class, classList, style, type_)
import Html.Events exposing (onClick)
import Location exposing (Location, Requirement(..))
import Spa.Document exposing (Document)
import Spa.Page as Page exposing (Page)
import Spa.Url exposing (Url)


type alias Set a =
    EverySet a


type alias Params =
    ()


type alias Model =
    { url : Url Params
    , attained : Set Requirement
    , locations : Dict Int Location
    , showCheckedLocations : Bool
    }


type Msg
    = ToggleRequirement Requirement
    | ToggleLocation Int
    | ToggleCheckedLocations
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

        Reset ->
            { model | attained = Set.empty, locations = Location.locations }


view : Model -> Document Msg
view model =
    { title = "FFIV Free Enterprise Tracker"
    , body =
        [ --h2 [] [ text "Flag String" ]
          --, textarea [] []
          button [ type_ "button", onClick Reset ] [ text "Reset" ]
        , h2 [] [ text "Key Items" ]
        , viewKeyItems model.attained

        --, h2 [] [ text "Objectives" ]
        --, viewObjectives
        , h2 []
            [ text "Locations"
            , span [ onClick ToggleCheckedLocations, style "font-size" "small" ]
                [ if model.showCheckedLocations then
                    text "Hide checked"

                  else
                    text "Show checked"
                ]
            ]
        , viewLocations model.locations model.attained model.showCheckedLocations
        ]
    }


viewKeyItems : Set Requirement -> Html Msg
viewKeyItems attained =
    let
        req : Requirement -> String -> Html Msg
        req requirement class =
            td
                [ classList
                    [ ( "requirement " ++ class, True )
                    , ( "enabled", Set.member requirement attained )
                    ]
                , onClick (ToggleRequirement requirement)
                ]
                [ text class ]

        numAttained =
            -- we care about this number for the 10 key items experience bonus, so
            -- don't count the MistDragon or Pass, which aren't real key items
            attained
                |> Set.filter (not << memberOf [ MistDragon, Pass ])
                |> Set.size
    in
    table []
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
            [ req MistDragon "mist-dragon"
            , req RatTail "rat-tail"
            , req PinkTail "pink-tail"
            , td
                [ classList
                    [ ( "requirement total", True )
                    , ( "key-bonus-reached", numAttained >= 10 )
                    ]
                ]
                [ text <| String.fromInt numAttained ++ " / 17" ]
            ]
        ]


viewObjectives : Html Msg
viewObjectives =
    text ""


viewLocations : Dict Int Location -> Set Requirement -> Bool -> Html Msg
viewLocations locations attained showChecked =
    locations
        -- toList sorts by key
        |> Dict.toList
        |> List.filterMap
            (\( key, loc ) ->
                if Location.isProspect attained loc || (showChecked && Location.isChecked loc) then
                    div
                        [ onClick <| ToggleLocation key
                        ]
                        [ text <| Location.getName loc ]
                        |> Just

                else
                    Nothing
            )
        |> div []


memberOf : List a -> a -> Bool
memberOf xs x =
    List.member x xs


toggle : a -> Set a -> Set a
toggle item set =
    if Set.member item set then
        Set.remove item set

    else
        Set.insert item set
