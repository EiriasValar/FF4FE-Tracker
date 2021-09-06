module Colour exposing
    ( Colours
    , For(..)
    , encode
    , set
    )

import Json.Encode as Json


type alias Colours =
    { background : String
    , text : String
    }


type For
    = Background
    | Text


set : For -> String -> Colours -> Colours
set for colour colours =
    case for of
        Background ->
            { colours | background = colour }

        Text ->
            { colours | text = colour }


encode : Colours -> Json.Value
encode colours =
    Json.object
        [ ( "background", Json.string colours.background )
        , ( "text", Json.string colours.text )
        ]
