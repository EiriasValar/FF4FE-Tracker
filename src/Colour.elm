module Colour exposing
    ( Colours
    , For(..)
    , decode
    , encode
    , set
    )

import Hex
import Json.Decode as Decode
import Json.Encode as Encode
import String.Extra



-- Colour strings should always be in the form "#hhhhhh"


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
                |> setContrastText

        Text ->
            { colours | text = colour }


{-| Set the text colour to black or white, whichever best contrasts with the
background colour.
-}
setContrastText : Colours -> Colours
setContrastText colours =
    let
        rgb =
            colours.background
                |> String.dropLeft 1
                |> String.Extra.break 2
                |> List.map (Hex.fromString >> Result.withDefault 0)

        -- Convert to the Y part of YIQ, which is a good enough approximation of
        -- "lightness" for our purposes; the user can always override the text
        -- colour if they don't like the result. See this post:
        -- https://24ways.org/2010/calculating-color-contrast/
        yiq =
            case rgb of
                [ red, green, blue ] ->
                    (red * 299 + green * 587 + blue * 114) // 1000

                _ ->
                    -- something's wrong, default to black
                    128

        text =
            if yiq >= 128 then
                "#000000"

            else
                "#ffffff"
    in
    { colours | text = text }


encode : Colours -> Encode.Value
encode colours =
    Encode.object
        [ ( "background", Encode.string colours.background )
        , ( "text", Encode.string colours.text )
        ]


decode : Maybe Encode.Value -> Colours
decode =
    Maybe.map (Decode.decodeValue decoder)
        >> Maybe.andThen Result.toMaybe
        >> Maybe.withDefault defaults


decoder : Decode.Decoder Colours
decoder =
    Decode.map2 Colours
        (Decode.field "background" Decode.string)
        (Decode.field "text" Decode.string)


defaults : Colours
defaults =
    { background = "#ffffff"
    , text = "#000000"
    }
