module Pages.Top exposing (Model, Msg, Params, page)

import Html exposing (Html, h2, text, textarea)
import Spa.Document exposing (Document)
import Spa.Page as Page exposing (Page)
import Spa.Url exposing (Url)


type alias Params =
    ()


type alias Model =
    { url : Url Params
    }


type alias Msg =
    Never


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
    }


update : Msg -> Model -> Model
update msg model =
    model


view : Model -> Document Msg
view model =
    { title = "FFIV Free Enterprise Tracker"
    , body =
        [ h2 [] [ text "Flag String" ]
        , textarea [] []
        , h2 [] [ text "Key Items" ]
        , viewKeyItems
        , h2 [] [ text "Objectives" ]
        , viewObjectives
        , h2 [] [ text "Locations" ]
        , viewLocations
        ]
    }


viewKeyItems : Html Msg
viewKeyItems =
    text ""


viewObjectives : Html Msg
viewObjectives =
    text ""


viewLocations : Html Msg
viewLocations =
    text ""
