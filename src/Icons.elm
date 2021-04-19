module Icons exposing (boss, character, keyItem, keyItemClickable)

import Html exposing (Html)
import Html.Attributes exposing (class, classList, src)
import Html.Events exposing (onClick)


character : Html msg
character =
    img [ class "icon character", src "/img/sprites/Mini1-Front.gif" ]


boss : Html msg
boss =
    img [ class "icon boss", src "/img/sprites/Monster3-Front.gif" ]


keyItem : Html msg
keyItem =
    keyItem_ []


keyItemClickable : Bool -> msg -> Html msg
keyItemClickable disabled onClickMsg =
    keyItem_
        [ class "clickable"
        , classList [ ( "disabled", disabled ) ]
        , onClick onClickMsg
        ]


keyItem_ : List (Html.Attribute msg) -> Html msg
keyItem_ extraAttrs =
    img <|
        [ class "icon key-item", src "/img/sprites/BrownChest1.gif" ]
            ++ extraAttrs


{-| Convenience version of img that doesn't expect children
-}
img : List (Html.Attribute msg) -> Html msg
img attrs =
    Html.img attrs []
