port module Ports exposing (setColours)

import Json.Encode exposing (Value)


port setColours : Value -> Cmd msg
