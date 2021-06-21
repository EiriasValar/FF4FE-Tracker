module Icon exposing (Icon, fromFilter, fromValue)

import Html exposing (Html)
import Html.Attributes exposing (src)
import Location exposing (Filter(..), ShopValue(..), Value(..))


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
fromValue value =
    case value of
        Character _ ->
            Just character

        Boss ->
            Just boss

        KeyItem _ ->
            Just keyItem

        Chest _ ->
            Just chest

        TrappedChest _ ->
            Just trappedChest

        Shop Weapon ->
            Just weapon

        Shop Armour ->
            Just armour

        Shop Accessory ->
            Just accessory

        Shop Healing ->
            Just healing

        Shop Camping ->
            Just camping

        Shop JItem ->
            Just jItem

        Shop (Other _) ->
            Just other

        _ ->
            Nothing


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


weapon : Icon
weapon =
    { class = "weapon"
    , img = img "/img/sprites/KnightSword.gif"
    }


armour : Icon
armour =
    { class = "armour"
    , img = img "/img/sprites/Armor.gif"
    }


accessory : Icon
accessory =
    { class = "accessory"
    , img = img "/img/sprites/Ring.gif"
    }


healing : Icon
healing =
    { class = "healing"
    , img = img "/img/sprites/RecoveryItem.gif"
    }


camping : Icon
camping =
    { class = "camping"
    , img = img "/img/sprites/Tent-edit.gif"
    }


jItem : Icon
jItem =
    { class = "jItem"
    , img = img "/img/sprites/Hourglass.gif"
    }


other : Icon
other =
    { class = "other"
    , img = img "/img/sprites/Summon.gif"
    }


img : String -> Html Never
img src_ =
    Html.img [ src src_ ] []
