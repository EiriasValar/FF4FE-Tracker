module Main exposing (main)

import App
import Browser
import Colour exposing (Colours)
import Json.Encode exposing (Value)


type alias Flags =
    Maybe Value


main : Program Flags App.Model App.Msg
main =
    Browser.document
        { init = App.init
        , view = App.view
        , update = App.update
        , subscriptions = App.subscriptions
        }
