module Value exposing
    ( BossStats
    , CharacterType(..)
    , Filter(..)
    , FilterType(..)
    , KeyItemClass(..)
    , ShopValue(..)
    , Value(..)
    , countable
    , decodeFilter
    , decodeFilterType
    , decodeMutable
    , encodeFilter
    , encodeFilterType
    , encodeMutable
    , objective
    , requirement
    , toFilter
    )

import ConsumableItems exposing (ConsumableItems)
import Json.Decode as Decode
import Json.Encode as Encode
import Objective
import Requirement exposing (Requirement)
import Serialize as S


type Value
    = Character CharacterType
    | Boss BossStats
    | KeyItem KeyItemClass
    | Chest Int -- excluding trapped chests
    | TrappedChest Int
    | Shop ShopValue
    | Requirement Requirement
    | Objective Objective.Key
    | GatedValue Requirement Value


type CharacterType
    = Ungated
    | Gated


type KeyItemClass
    = Main
    | Warp
    | Summon
    | MoonBoss
    | Trapped
    | Free
    | Vanilla


{-| Most stats are sourced from the FF4FE Boss Scaling Stats doc:
<https://docs.google.com/spreadsheets/d/1hJZsbzStQfMCQUFzjW9pbdLhJ99wLu1QY-5cmp7Peqg/edit>
The actual stats will vary depending on the boss who appears in a spot; I've
tried to populate them with "representative" values for a "normal" boss. The
Magic stats in particular are very hand-wavy.

Valvalis' MDef is from Inven's Valvalis Reference:
<https://docs.google.com/spreadsheets/d/1tVQFvlQ_4oWCn0EE9d7QAGrYW3w2IbZzuO2MWuUC8ww/edit>

-}
type alias BossStats =
    { hp : Int
    , exp : Int
    , gp : Int
    , atkMult : Int
    , hit : Int
    , atk : Int
    , minSpeed : Int
    , maxSpeed : Int
    , mag : Int
    , valvalisDef : DefStats
    , valvalisMDef : Int
    }


type alias DefStats =
    { def : Int
    , evadePercent : Int
    , evadeRolls : Int
    }


type ShopValue
    = Weapon
    | Armour
    | Item -- pseudo-value for Location definition; gets expanded into Healing/JItem
    | Healing ConsumableItems
    | JItem ConsumableItems
    | Other String


type Filter
    = Characters
    | Bosses
    | KeyItems
    | Chests
    | TrappedChests
    | Checked


type FilterType
    = Show
    | Hide


toFilter : Value -> Maybe Filter
toFilter value =
    case value of
        Character _ ->
            Just Characters

        Boss _ ->
            Just Bosses

        KeyItem _ ->
            Just KeyItems

        Chest _ ->
            Just Chests

        TrappedChest _ ->
            Just TrappedChests

        Shop _ ->
            Nothing

        Requirement _ ->
            Nothing

        Objective _ ->
            Nothing

        GatedValue _ val ->
            toFilter val


countable : Value -> Maybe Int
countable value =
    case value of
        Chest c ->
            Just c

        TrappedChest c ->
            Just c

        _ ->
            Nothing


requirement : Value -> Maybe Requirement
requirement value =
    case value of
        Requirement req ->
            Just req

        _ ->
            Nothing


objective : Value -> Maybe Objective.Key
objective value =
    case value of
        Objective obj ->
            Just obj

        _ ->
            Nothing


decodeMutable : Decode.Decoder (Maybe Value)
decodeMutable =
    -- TODO ugh
    Decode.oneOf
        [ Decode.field "shop-healing" (ConsumableItems.decodeStatuses ConsumableItems.healingItems) |> Decode.map (Just << Shop << Healing)
        , Decode.field "shop-jitem" (ConsumableItems.decodeStatuses ConsumableItems.jItems) |> Decode.map (Just << Shop << JItem)
        , Decode.field "shop-other" Decode.string |> Decode.map (Just << Shop << Other)
        ]


encodeMutable : Value -> Encode.Value
encodeMutable value =
    let
        encodeItems name items =
            Encode.object [ ( name, ConsumableItems.encodeStatuses items ) ]
    in
    case value of
        Shop (Healing items) ->
            encodeItems "shop-healing" items

        Shop (JItem items) ->
            encodeItems "shop-jitem" items

        Shop (Other string) ->
            Encode.object [ ( "shop-other", Encode.string string ) ]

        _ ->
            Encode.null


decodeFilter : String -> Maybe Filter
decodeFilter =
    S.decodeFromString filterCodec
        >> Result.toMaybe


encodeFilter : Filter -> String
encodeFilter =
    S.encodeToString filterCodec


decodeFilterType : Decode.Decoder FilterType
decodeFilterType =
    let
        parse =
            S.decodeFromJson filterTypeCodec
                >> Result.map Decode.succeed
                >> Result.withDefault (Decode.fail "Decoder error")
    in
    Decode.value
        |> Decode.andThen parse


encodeFilterType : FilterType -> Encode.Value
encodeFilterType =
    S.encodeToJson filterTypeCodec


filterCodec : S.Codec e Filter
filterCodec =
    S.customType
        (\characters bosses keyitems chests trappedchests checked value ->
            case value of
                Characters ->
                    characters

                Bosses ->
                    bosses

                KeyItems ->
                    keyitems

                Chests ->
                    chests

                TrappedChests ->
                    trappedchests

                Checked ->
                    checked
        )
        |> S.variant0 Characters
        |> S.variant0 Bosses
        |> S.variant0 KeyItems
        |> S.variant0 Chests
        |> S.variant0 TrappedChests
        |> S.variant0 Checked
        |> S.finishCustomType


filterTypeCodec : S.Codec e FilterType
filterTypeCodec =
    S.customType
        (\show hide value ->
            case value of
                Show ->
                    show

                Hide ->
                    hide
        )
        |> S.variant0 Show
        |> S.variant0 Hide
        |> S.finishCustomType
