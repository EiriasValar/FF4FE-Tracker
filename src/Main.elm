module Main exposing (main)

import App
import Browser
import Colour exposing (Colours)


type alias Flags =
    Maybe Colours


main : Program Flags App.Model App.Msg
main =
    Browser.document
        { init = App.init
        , view = App.view
        , update = App.update
        , subscriptions = App.subscriptions
        }
