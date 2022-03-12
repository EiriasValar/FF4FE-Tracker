module Status exposing
    ( Status(..)
    , decode
    , encode
    , toString
    , toggle
    )

import Json.Decode as Decode
import Json.Encode as Encode
import Serialize as S


type Status
    = Unseen
    | Seen
    | SeenSome Int
    | Dismissed


toString : Status -> String
toString status =
    case status of
        Unseen ->
            "unseen"

        Seen ->
            "seen"

        SeenSome _ ->
            "seen-some"

        Dismissed ->
            "dismissed"


{-| "Toggle" the existing status with respect to the given "on" state: if they're the
same, toggle "off" (to Unseen); otherwise, set to "on".

This is to accommodate treating either Seen or Dismissed as the "on" state,
while also being able to switch directly from one to the other.

    Unseen |> statusToggle Dismissed
    --> Dismissed
    Dismissed |> statusToggle Dismissed
    --> Unseen
    Dismissed |> statusToggle Seen
    --> Seen

-}
toggle : Status -> Status -> Status
toggle on existing =
    if on == existing then
        Unseen

    else
        on


decode : Decode.Decoder Status
decode =
    let
        parse =
            S.decodeFromJson codec
                >> Result.map Decode.succeed
                >> Result.withDefault (Decode.fail "Decoder error")
    in
    Decode.value
        |> Decode.andThen parse


encode : Status -> Encode.Value
encode =
    S.encodeToJson codec


codec : S.Codec e Status
codec =
    S.customType
        (\unseen seen seensome dismissed value ->
            case value of
                Unseen ->
                    unseen

                Seen ->
                    seen

                SeenSome count ->
                    seensome count

                Dismissed ->
                    dismissed
        )
        |> S.variant0 Unseen
        |> S.variant0 Seen
        |> S.variant1 SeenSome S.int
        |> S.variant0 Dismissed
        |> S.finishCustomType
