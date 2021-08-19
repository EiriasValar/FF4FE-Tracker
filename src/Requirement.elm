module Requirement exposing
    ( PseudoRequirement(..)
    , Requirement(..)
    , isPseudo
    )


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
