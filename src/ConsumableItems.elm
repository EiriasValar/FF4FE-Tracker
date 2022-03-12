module ConsumableItems exposing
    ( ConsumableItem
    , ConsumableItems
    , anyDismissed
    , decodeStatuses
    , encodeStatuses
    , filter
    , healingItems
    , jItems
    , update
    )

import Array exposing (Array)
import Array.Extra
import Json.Decode as Decode
import Json.Encode as Encode
import Status exposing (Status(..))


{-| Opaque so we can enforce filtering
-}
type ConsumableItems
    = ConsumableItems (Array ConsumableItem)


type alias ConsumableItem =
    { name : String
    , tier : Int
    , isJItem : Bool
    , status : Status
    }


update : Int -> (ConsumableItem -> ConsumableItem) -> ConsumableItems -> ConsumableItems
update index fn (ConsumableItems items) =
    Array.Extra.update index fn items
        |> ConsumableItems


{-| Extract the consumable items from the given ConsumableItems according to the
given filter function, returning them along with their indices in the array. The
filter function should take into account surrounding context about which this
module knows nothing – flags, locations – don't pass `(always True)`, that would
be cheating.
-}
filter : (ConsumableItem -> Bool) -> ConsumableItems -> List ( Int, ConsumableItem )
filter fn (ConsumableItems items) =
    items
        |> Array.toIndexedList
        |> List.filter (Tuple.second >> fn)


anyDismissed : ConsumableItems -> Bool
anyDismissed (ConsumableItems items) =
    items
        |> Array.toList
        |> List.any (.status >> (==) Dismissed)


healingItems : ConsumableItems
healingItems =
    [ { name = "Cure2"
      , tier = 3
      }
    , { name = "Cure3"
      , tier = 4
      }
    , { name = "Life"
      , tier = 2
      }
    , { name = "Tent"
      , tier = 2
      }
    , { name = "Cabin"
      , tier = 4
      }
    , { name = "Ether"
      , tier = 3
      }
    , { name = "Status-healing"
      , tier = 1
      }
    ]
        |> List.map
            (\{ name, tier } ->
                { name = name
                , tier = tier
                , isJItem = False
                , status = Unseen
                }
            )
        |> Array.fromList
        |> ConsumableItems


jItems : ConsumableItems
jItems =
    [ { name = "Bacchus"
      , tier = 5
      }
    , { name = "Coffin"
      , tier = 5
      }
    , { name = "Hourglass"
      , tier = 5
      }
    , { name = "Moonveil"
      , tier = 7
      }
    , { name = "Siren"
      , tier = 5
      }
    , { name = "Starveil"
      , tier = 2
      }
    , { name = "Vampire"
      , tier = 4
      }
    ]
        |> List.map
            (\{ name, tier } ->
                { name = name
                , tier = tier
                , isJItem = True
                , status = Unseen
                }
            )
        |> Array.fromList
        |> ConsumableItems


encodeStatuses : ConsumableItems -> Encode.Value
encodeStatuses (ConsumableItems items) =
    Encode.array (.status >> Status.encode) items


{-| Pass in healingItems or jItems to decode the statuses into
-}
decodeStatuses : ConsumableItems -> Decode.Decoder ConsumableItems
decodeStatuses (ConsumableItems base) =
    let
        updateStatus : Status -> ConsumableItem -> ConsumableItem
        updateStatus status item =
            { item | status = status }

        updateItems : Array Status -> Array ConsumableItem
        updateItems statuses =
            Array.Extra.apply (statuses |> Array.map updateStatus) base
    in
    Decode.array Status.decode
        |> Decode.map (updateItems >> ConsumableItems)
