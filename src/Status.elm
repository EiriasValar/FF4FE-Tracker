module Status exposing
    ( Status(..)
    , toString
    , toggle
    )


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
