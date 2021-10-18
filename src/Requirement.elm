module Requirement exposing
    ( PseudoRequirement(..)
    , Requirement(..)
    , decode
    , encode
    , isPseudo
    )

import Json.Decode as Decode
import Json.Encode as Encode
import Serialize as S


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
    let
        parse =
            S.decodeFromJson codec
                >> Result.map Decode.succeed
                >> Result.withDefault (Decode.fail "Decoder error")
    in
    Decode.value
        |> Decode.andThen parse


encode : Requirement -> Encode.Value
encode =
    S.encodeToJson codec


codec : S.Codec e Requirement
codec =
    let
        pseudoCodec : S.Codec e PseudoRequirement
        pseudoCodec =
            S.customType
                (\pass mistdragon undergroundaccess yangtalk yangbonk falcon forge value ->
                    case value of
                        Pass ->
                            pass

                        MistDragon ->
                            mistdragon

                        UndergroundAccess ->
                            undergroundaccess

                        YangTalk ->
                            yangtalk

                        YangBonk ->
                            yangbonk

                        Falcon ->
                            falcon

                        Forge ->
                            forge
                )
                |> S.variant0 Pass
                |> S.variant0 MistDragon
                |> S.variant0 UndergroundAccess
                |> S.variant0 YangTalk
                |> S.variant0 YangBonk
                |> S.variant0 Falcon
                |> S.variant0 Forge
                |> S.finishCustomType
    in
    S.customType
        (\package sandruby baronkey lucakey magmakey towerkey darknesscrystal earthcrystal crystal hook twinharp pan rattail adamant legendsword spoon pinktail pseudo value ->
            case value of
                Package ->
                    package

                SandRuby ->
                    sandruby

                BaronKey ->
                    baronkey

                LucaKey ->
                    lucakey

                MagmaKey ->
                    magmakey

                TowerKey ->
                    towerkey

                DarknessCrystal ->
                    darknesscrystal

                EarthCrystal ->
                    earthcrystal

                Crystal ->
                    crystal

                Hook ->
                    hook

                TwinHarp ->
                    twinharp

                Pan ->
                    pan

                RatTail ->
                    rattail

                Adamant ->
                    adamant

                LegendSword ->
                    legendsword

                Spoon ->
                    spoon

                PinkTail ->
                    pinktail

                Pseudo pseudoRequirement ->
                    pseudo pseudoRequirement
        )
        |> S.variant0 Package
        |> S.variant0 SandRuby
        |> S.variant0 BaronKey
        |> S.variant0 LucaKey
        |> S.variant0 MagmaKey
        |> S.variant0 TowerKey
        |> S.variant0 DarknessCrystal
        |> S.variant0 EarthCrystal
        |> S.variant0 Crystal
        |> S.variant0 Hook
        |> S.variant0 TwinHarp
        |> S.variant0 Pan
        |> S.variant0 RatTail
        |> S.variant0 Adamant
        |> S.variant0 LegendSword
        |> S.variant0 Spoon
        |> S.variant0 PinkTail
        |> S.variant1 Pseudo pseudoCodec
        |> S.finishCustomType
