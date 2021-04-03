module Flags exposing
    ( Flags
    , default
    , parse
    )


type alias Flags =
    { noFreeChars : Bool
    , noFreeKeyItem : Bool
    , pushBToJump : Bool
    }


default : Flags
default =
    { noFreeChars = False
    , noFreeKeyItem = False
    , pushBToJump = False
    }


{-| Would this be cleaner with a Parser?
-}
parse : String -> Flags
parse flagString =
    flagString
        |> String.words
        |> List.foldl parseFlag default


parseFlag : String -> Flags -> Flags
parseFlag flag flags =
    case String.uncons flag of
        Just ( 'N', opts ) ->
            opts
                |> String.split "/"
                |> List.foldl parseN flags

        Just ( '-', "pushbtojump" ) ->
            { flags | pushBToJump = True }

        _ ->
            flags


parseN : String -> Flags -> Flags
parseN switch flags =
    case switch of
        "chars" ->
            { flags | noFreeChars = True }

        "key" ->
            { flags | noFreeKeyItem = True }

        _ ->
            flags
