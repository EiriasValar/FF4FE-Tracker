module Icon exposing (Icon, fromFilter, fromValue)

import Html exposing (Html)
import Html.Attributes exposing (src)
import Location exposing (Filter(..), Value)


type alias Icon =
    { class : String
    , img : Html Never
    }


fromFilter : Filter -> Icon
fromFilter filter =
    case filter of
        Characters ->
            character

        Bosses ->
            boss

        KeyItems ->
            keyItem

        Chests ->
            chest

        TrappedChests ->
            trappedChest

        Checked ->
            visible


fromValue : Value -> Maybe Icon
fromValue =
    Location.valueToFilter >> Maybe.map fromFilter


character : Icon
character =
    { class = "character"
    , img = img "/img/sprites/Mini1-Front.gif"
    }


boss : Icon
boss =
    { class = "boss"
    , img = img "/img/sprites/Monster3-Front.gif"
    }


keyItem : Icon
keyItem =
    { class = "key-item"
    , img = img "/img/sprites/Key-edit.gif"
    }


chest : Icon
chest =
    { class = "chest"
    , img = img "/img/sprites/BlueChest1.gif"
    }


trappedChest : Icon
trappedChest =
    { class = "trapped-chest"
    , img = img "/img/sprites/RedChest2.gif"
    }


visible : Icon
visible =
    { class = "checked"
    , img = img "/img/sprites/SecurityEye.gif"
    }


img : String -> Html Never
img src_ =
    Html.img [ src src_ ] []
