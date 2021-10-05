module Requirement exposing
    ( PseudoRequirement(..)
    , Requirement(..)
    , decode
    , encode
    , isPseudo
    )

import Json.Decode as Decode
import Json.Encode as Encode


type Requirement
    = Package
    | SandRuby
    | BaronKey
    | LucaKey
    | MagmaKey
    | TowerKey
    | DarknessCrystal
    | EarthCrystal
    | Crystal
    | Hook
    | TwinHarp
    | Pan
    | RatTail
    | Adamant
    | LegendSword
    | Spoon
    | PinkTail
    | Pseudo PseudoRequirement


type PseudoRequirement
    = Pass
    | MistDragon
    | UndergroundAccess
    | YangTalk
    | YangBonk
    | Falcon
    | Forge


isPseudo : Requirement -> Bool
isPseudo requirement =
    case requirement of
        Pseudo _ ->
            True

        _ ->
            False


decode : Decode.Decoder Requirement
decode =
    Debug.todo ""


encode : Requirement -> Encode.Value
encode requirement =
    Debug.todo ""
