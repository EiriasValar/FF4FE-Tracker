module Main exposing (main)

import App
import Browser


type alias Flags =
    ()


main : Program Flags App.Model App.Msg
main =
    Browser.document
        { init = App.init
        , view = App.view
        , update = App.update
        , subscriptions = App.subscriptions
        }
