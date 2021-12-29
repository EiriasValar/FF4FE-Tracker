module LocationKey exposing (Key(..), decode, encode)

import Json.Decode as Decode
import Json.Encode as Encode
import Serialize as S


type Key
    = MistCave
    | MistVillage
    | MistVillageShops
    | MistVillagePackage
    | MistVillageMom
    | Kaipo
    | KaipoShops
    | WateryPass
    | Waterfall
    | Damcyan
    | AntlionCave
    | MtHobs
    | FabulShops
    | FabulDefence
    | Sheila
    | Mysidia
    | MysidiaShops
    | MtOrdeals
    | Baron
    | BaronShop
    | BaronSewer
    | BaronCastle
    | BaronBasement
    | Toroia
    | ToroiaShops
    | ToroiaCastle
    | ToroiaTreasury
    | CaveMagnes
    | Zot
    | Agart
    | AgartShops
    | Silvera
    | SilveraShops
    | AdamantGrotto
    | CastleEblan
    | CaveEblan
    | CaveEblanShops
    | UpperBabil
    | Giant
    | DwarfCastle
    | DwarfCastleShops
    | LowerBabil
    | LowerBabilCannon
    | SylphCave
    | Feymarch
    | FeymarchShops
    | FeymarchKing
    | FeymarchQueen
    | Tomra
    | TomraShops
    | SealedCave
    | Kokkol
    | KokkolShop
    | Hummingway
    | CaveBahamut
    | LunarPath
    | LunarSubterrane
    | MurasameAltar
    | WyvernAltar
    | WhiteSpearAltar
    | RibbonRoom
    | MasamuneAltar


decode : Decode.Decoder Key
decode =
    let
        parse =
            S.decodeFromJson codec
                >> Result.map Decode.succeed
                >> Result.withDefault (Decode.fail "Decoder error")
    in
    Decode.value
        |> Decode.andThen parse


encode : Key -> Encode.Value
encode =
    S.encodeToJson codec


codec : S.Codec e Key
codec =
    S.customType
        (\mistcave mistvillage mistvillageshops mistvillagepackage mistvillagemom kaipo kaiposhops waterypass waterfall damcyan antlioncave mthobs fabulshops fabuldefence sheila mysidia mysidiashops mtordeals baron baronshop baronsewer baroncastle baronbasement toroia toroiashops toroiacastle toroiatreasury cavemagnes zot agart agartshops silvera silverashops adamantgrotto castleeblan caveeblan caveeblanshops upperbabil giant dwarfcastle dwarfcastleshops lowerbabil lowerbabilcannon sylphcave feymarch feymarchshops feymarchking feymarchqueen tomra tomrashops sealedcave kokkol kokkolshop hummingway cavebahamut lunarpath lunarsubterrane murasamealtar wyvernaltar whitespearaltar ribbonroom masamunealtar value ->
            case value of
                MistCave ->
                    mistcave

                MistVillage ->
                    mistvillage

                MistVillageShops ->
                    mistvillageshops

                MistVillagePackage ->
                    mistvillagepackage

                MistVillageMom ->
                    mistvillagemom

                Kaipo ->
                    kaipo

                KaipoShops ->
                    kaiposhops

                WateryPass ->
                    waterypass

                Waterfall ->
                    waterfall

                Damcyan ->
                    damcyan

                AntlionCave ->
                    antlioncave

                MtHobs ->
                    mthobs

                FabulShops ->
                    fabulshops

                FabulDefence ->
                    fabuldefence

                Sheila ->
                    sheila

                Mysidia ->
                    mysidia

                MysidiaShops ->
                    mysidiashops

                MtOrdeals ->
                    mtordeals

                Baron ->
                    baron

                BaronShop ->
                    baronshop

                BaronSewer ->
                    baronsewer

                BaronCastle ->
                    baroncastle

                BaronBasement ->
                    baronbasement

                Toroia ->
                    toroia

                ToroiaShops ->
                    toroiashops

                ToroiaCastle ->
                    toroiacastle

                ToroiaTreasury ->
                    toroiatreasury

                CaveMagnes ->
                    cavemagnes

                Zot ->
                    zot

                Agart ->
                    agart

                AgartShops ->
                    agartshops

                Silvera ->
                    silvera

                SilveraShops ->
                    silverashops

                AdamantGrotto ->
                    adamantgrotto

                CastleEblan ->
                    castleeblan

                CaveEblan ->
                    caveeblan

                CaveEblanShops ->
                    caveeblanshops

                UpperBabil ->
                    upperbabil

                Giant ->
                    giant

                DwarfCastle ->
                    dwarfcastle

                DwarfCastleShops ->
                    dwarfcastleshops

                LowerBabil ->
                    lowerbabil

                LowerBabilCannon ->
                    lowerbabilcannon

                SylphCave ->
                    sylphcave

                Feymarch ->
                    feymarch

                FeymarchShops ->
                    feymarchshops

                FeymarchKing ->
                    feymarchking

                FeymarchQueen ->
                    feymarchqueen

                Tomra ->
                    tomra

                TomraShops ->
                    tomrashops

                SealedCave ->
                    sealedcave

                Kokkol ->
                    kokkol

                KokkolShop ->
                    kokkolshop

                Hummingway ->
                    hummingway

                CaveBahamut ->
                    cavebahamut

                LunarPath ->
                    lunarpath

                LunarSubterrane ->
                    lunarsubterrane

                MurasameAltar ->
                    murasamealtar

                WyvernAltar ->
                    wyvernaltar

                WhiteSpearAltar ->
                    whitespearaltar

                RibbonRoom ->
                    ribbonroom

                MasamuneAltar ->
                    masamunealtar
        )
        |> S.variant0 MistCave
        |> S.variant0 MistVillage
        |> S.variant0 MistVillageShops
        |> S.variant0 MistVillagePackage
        |> S.variant0 MistVillageMom
        |> S.variant0 Kaipo
        |> S.variant0 KaipoShops
        |> S.variant0 WateryPass
        |> S.variant0 Waterfall
        |> S.variant0 Damcyan
        |> S.variant0 AntlionCave
        |> S.variant0 MtHobs
        |> S.variant0 FabulShops
        |> S.variant0 FabulDefence
        |> S.variant0 Sheila
        |> S.variant0 Mysidia
        |> S.variant0 MysidiaShops
        |> S.variant0 MtOrdeals
        |> S.variant0 Baron
        |> S.variant0 BaronShop
        |> S.variant0 BaronSewer
        |> S.variant0 BaronCastle
        |> S.variant0 BaronBasement
        |> S.variant0 Toroia
        |> S.variant0 ToroiaShops
        |> S.variant0 ToroiaCastle
        |> S.variant0 ToroiaTreasury
        |> S.variant0 CaveMagnes
        |> S.variant0 Zot
        |> S.variant0 Agart
        |> S.variant0 AgartShops
        |> S.variant0 Silvera
        |> S.variant0 SilveraShops
        |> S.variant0 AdamantGrotto
        |> S.variant0 CastleEblan
        |> S.variant0 CaveEblan
        |> S.variant0 CaveEblanShops
        |> S.variant0 UpperBabil
        |> S.variant0 Giant
        |> S.variant0 DwarfCastle
        |> S.variant0 DwarfCastleShops
        |> S.variant0 LowerBabil
        |> S.variant0 LowerBabilCannon
        |> S.variant0 SylphCave
        |> S.variant0 Feymarch
        |> S.variant0 FeymarchShops
        |> S.variant0 FeymarchKing
        |> S.variant0 FeymarchQueen
        |> S.variant0 Tomra
        |> S.variant0 TomraShops
        |> S.variant0 SealedCave
        |> S.variant0 Kokkol
        |> S.variant0 KokkolShop
        |> S.variant0 Hummingway
        |> S.variant0 CaveBahamut
        |> S.variant0 LunarPath
        |> S.variant0 LunarSubterrane
        |> S.variant0 MurasameAltar
        |> S.variant0 WyvernAltar
        |> S.variant0 WhiteSpearAltar
        |> S.variant0 RibbonRoom
        |> S.variant0 MasamuneAltar
        |> S.finishCustomType
