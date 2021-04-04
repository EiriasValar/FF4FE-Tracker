module Flags exposing
    ( Flags
    , KeyItemClass(..)
    , default
    , parse
    )

import EverySet as Set exposing (EverySet)


type alias Set a =
    EverySet a


type alias Flags =
    { keyItems : Set KeyItemClass
    , noFreeChars : Bool
    , warpGlitch : Bool
    , keyExpBonus : Bool
    , pushBToJump : Bool
    }


type KeyItemClass
    = Main
    | Summon
    | MoonBoss
    | Free


default : Flags
default =
    { keyItems = Set.singleton Free
    , noFreeChars = False
    , warpGlitch = False
    , keyExpBonus = True
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
        Just ( 'O', opts ) ->
            opts
                |> String.split "/"
                |> List.foldl parseO flags

        Just ( 'K', opts ) ->
            opts
                |> String.split "/"
                |> List.foldl parseK flags

        Just ( 'N', opts ) ->
            opts
                |> String.split "/"
                |> List.foldl parseN flags

        Just ( 'G', opts ) ->
            opts
                |> String.split "/"
                |> List.foldl parseG flags

        Just ( '-', "exp:nokeybonus" ) ->
            { flags | keyExpBonus = False }

        Just ( '-', "pushbtojump" ) ->
            { flags | pushBToJump = True }

        _ ->
            flags


parseO : String -> Flags -> Flags
parseO switch flags =
    case switch of
        _ ->
            flags


parseK : String -> Flags -> Flags
parseK switch flags =
    case switch of
        "main" ->
            { flags | keyItems = Set.insert Main flags.keyItems }

        "summon" ->
            { flags | keyItems = Set.insert Summon flags.keyItems }

        "moon" ->
            { flags | keyItems = Set.insert MoonBoss flags.keyItems }

        "trap" ->
            -- TODO
            flags

        _ ->
            flags


parseN : String -> Flags -> Flags
parseN switch flags =
    case switch of
        "chars" ->
            { flags | noFreeChars = True }

        "key" ->
            { flags | keyItems = Set.remove Free flags.keyItems }

        _ ->
            flags


parseG : String -> Flags -> Flags
parseG switch flags =
    case switch of
        "warp" ->
            { flags | warpGlitch = True }

        _ ->
            flags
