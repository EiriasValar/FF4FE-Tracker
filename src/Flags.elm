module Flags exposing
    ( Flags
    , KeyItemClass(..)
    , parse
    , rewardToString
    )

import Array exposing (Array)
import EverySet as Set exposing (EverySet)
import Objective exposing (BossObjective(..), Objective(..))


type alias Set a =
    EverySet a


type alias Flags =
    { objectives : Array Objective
    , randomObjectives : Int
    , randomObjectiveTypes : Set Objective.Type
    , requiredObjectives : Int
    , objectiveReward : Reward
    , keyItems : Set KeyItemClass
    , classicGiantObjective : Bool
    , passIsKeyItem : Bool
    , noTreasures : Bool
    , noFreeChars : Bool
    , warpGlitch : Bool
    , keyExpBonus : Bool
    , pushBToJump : Bool
    }


type KeyItemClass
    = Main
    | Warp
    | Summon
    | MoonBoss
    | Trapped
    | Free
    | Vanilla


type Reward
    = Crystal
    | Win


rewardToString : Reward -> String
rewardToString reward =
    case reward of
        Crystal ->
            "crystal"

        Win ->
            "win"


{-| Would this be cleaner with a Parser?
-}
parse : String -> Flags
parse flagString =
    let
        default : Flags
        default =
            { objectives = Array.empty
            , randomObjectives = 0
            , randomObjectiveTypes = Set.empty
            , requiredObjectives = 0
            , objectiveReward = Win
            , keyItems = Set.singleton Free
            , classicGiantObjective = False
            , passIsKeyItem = False
            , noTreasures = False
            , noFreeChars = False
            , warpGlitch = False
            , keyExpBonus = True
            , pushBToJump = False
            }

        -- Random objective types aren't additive flags: if none are given, all are enabled;
        -- if some are given, only they are enabled. So we default to the empty set, pushing
        -- enabled types into it - then if it's still empty when we're done, fill it with every
        -- type.
        fixupObjectiveTypes flags =
            if Set.isEmpty flags.randomObjectiveTypes then
                { flags | randomObjectiveTypes = Set.fromList [ Objective.Character, Objective.Boss, Objective.Quest ] }

            else
                flags

        -- if no number of required objectives was specified, assume all are required
        fixupRequiredObjectives flags =
            let
                requiredObjectives =
                    if flags.requiredObjectives == 0 then
                        Array.length flags.objectives + flags.randomObjectives

                    else
                        flags.requiredObjectives
            in
            { flags | requiredObjectives = requiredObjectives }

        -- when the Fiends mode objective is on, the game treats it as six separate objectives
        fixupFiends flags =
            let
                objectives =
                    if flags.objectives |> Array.toList |> List.member Fiends then
                        [ DefeatBoss Milon
                        , DefeatBoss MilonZ
                        , DefeatBoss Kainazzo
                        , DefeatBoss Valvalis
                        , DefeatBoss Rubicant
                        , DefeatBoss Elements
                        ]
                            |> Array.fromList
                            |> Array.append flags.objectives
                            |> Array.filter ((/=) Fiends)

                    else
                        flags.objectives
            in
            { flags | objectives = objectives }

        -- Kvanilla excludes Kmain/summon/moon, and Kmain must be on
        -- if Kvanilla isn't
        fixupKeyItems flags =
            let
                keyItems =
                    if Set.member Vanilla flags.keyItems then
                        [ Main, Summon, MoonBoss ]
                            |> Set.fromList
                            |> Set.diff flags.keyItems

                    else
                        Set.insert Main flags.keyItems
            in
            { flags | keyItems = keyItems }
    in
    flagString
        |> String.words
        |> List.foldl parseFlag default
        |> fixupObjectiveTypes
        |> fixupRequiredObjectives
        |> fixupFiends
        |> fixupKeyItems


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

        Just ( 'P', opts ) ->
            opts
                |> String.split "/"
                |> List.foldl parseP flags

        Just ( 'T', opts ) ->
            opts
                |> String.split "/"
                |> List.foldl parseT flags

        Just ( 'N', opts ) ->
            opts
                |> String.split "/"
                |> List.foldl parseN flags

        Just ( 'G', opts ) ->
            opts
                |> String.split "/"
                |> List.foldl parseG flags

        Just ( '-', opt ) ->
            parseOther opt flags

        _ ->
            flags


parseO : String -> Flags -> Flags
parseO opts incomingFlags =
    let
        parseMode mode flags =
            case Objective.fromString mode of
                Just objective ->
                    { flags
                        | classicGiantObjective = objective == ClassicGiant
                        , objectives = Array.push objective flags.objectives
                    }

                Nothing ->
                    flags

        parseRandom switch flags =
            case switch of
                "char" ->
                    { flags | randomObjectiveTypes = Set.insert Objective.Character flags.randomObjectiveTypes }

                "boss" ->
                    { flags | randomObjectiveTypes = Set.insert Objective.Boss flags.randomObjectiveTypes }

                "quest" ->
                    { flags | randomObjectiveTypes = Set.insert Objective.Quest flags.randomObjectiveTypes }

                num ->
                    case String.toInt num of
                        Just n ->
                            { flags | randomObjectives = n }

                        Nothing ->
                            flags
    in
    case String.split ":" opts of
        [ "mode", modes ] ->
            modes
                |> String.split ","
                |> List.foldl parseMode incomingFlags

        [ "random", subopts ] ->
            subopts
                |> String.split ","
                |> List.foldl parseRandom incomingFlags

        [ "req", count ] ->
            case String.toInt count of
                Just c ->
                    { incomingFlags | requiredObjectives = c }

                Nothing ->
                    -- ignoring req:all, as that's the default when no req is given
                    incomingFlags

        [ "win", reward ] ->
            case reward of
                "game" ->
                    { incomingFlags | objectiveReward = Win }

                "crystal" ->
                    { incomingFlags | objectiveReward = Crystal }

                _ ->
                    incomingFlags

        [ num, objectiveStr ] ->
            case ( String.toInt num, Objective.fromString objectiveStr ) of
                ( Just _, Just objective ) ->
                    -- since we want to parse in one pass, ignore the given
                    -- numbers and assume the objectives are in order
                    { incomingFlags | objectives = Array.push objective incomingFlags.objectives }

                _ ->
                    incomingFlags

        _ ->
            incomingFlags


parseK : String -> Flags -> Flags
parseK switch flags =
    case switch of
        "vanilla" ->
            { flags | keyItems = Set.insert Vanilla flags.keyItems }

        "main" ->
            { flags | keyItems = Set.insert Main flags.keyItems }

        "summon" ->
            { flags | keyItems = Set.insert Summon flags.keyItems }

        "moon" ->
            { flags | keyItems = Set.insert MoonBoss flags.keyItems }

        "trap" ->
            { flags | keyItems = Set.insert Trapped flags.keyItems }

        _ ->
            flags


parseP : String -> Flags -> Flags
parseP switch flags =
    case switch of
        "key" ->
            { flags | passIsKeyItem = True }

        _ ->
            flags


parseT : String -> Flags -> Flags
parseT switch flags =
    case switch of
        "empty" ->
            { flags | noTreasures = True }

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
            { flags
                | warpGlitch = True
                , keyItems = Set.insert Warp flags.keyItems
            }

        _ ->
            flags


parseOther : String -> Flags -> Flags
parseOther switch flags =
    case switch of
        "exp:nokeybonus" ->
            { flags | keyExpBonus = False }

        "pushbtojump" ->
            { flags | pushBToJump = True }

        _ ->
            flags
