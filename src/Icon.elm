module Icon exposing
    ( Icon
    , fromFilter
    , fromRequirement
    , fromValue
    , no
    )

import AssocList as Dict exposing (Dict)
import Html exposing (Html)
import Html.Attributes exposing (src)
import Location
    exposing
        ( Filter(..)
        , PseudoRequirement(..)
        , Requirement(..)
        , ShopValue(..)
        , Value(..)
        )


type alias Icon msg =
    { class : String
    , title : String
    , img : List (Html.Attribute msg) -> Html msg
    }


fromFilter : Filter -> Icon msg
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


fromValue : Value -> Maybe (Icon msg)
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

        Requirement (Pseudo YangTalk) ->
            Just yangTalk

        Requirement (Pseudo YangBonk) ->
            Just yangBonk

        Requirement (Pseudo Falcon) ->
            Just falcon

        Shop Weapon ->
            Just weapon

        Shop Armour ->
            Just armour

        Shop (Healing _) ->
            Just healing

        Shop (JItem _) ->
            Just jItem

        Shop (Other _) ->
            Just other

        _ ->
            Nothing


fromRequirement : Requirement -> Maybe (Icon msg)
fromRequirement requirement =
    Dict.get requirement requirements


character : Icon msg
character =
    { class = "character"
    , title = "Character"
    , img = img "img/sprites/Mini1-Front.gif"
    }


boss : Icon msg
boss =
    { class = "boss"
    , title = "Boss"
    , img = img "img/sprites/Monster3-Front.gif"
    }


keyItem : Icon msg
keyItem =
    { class = "key-item"
    , title = "Key item check"
    , img = img "img/sprites/Key-edit.gif"
    }


chest : Icon msg
chest =
    { class = "chest"
    , title = "Untrapped chests"
    , img = img "img/sprites/BlueChest1.gif"
    }


trappedChest : Icon msg
trappedChest =
    { class = "trapped-chest"
    , title = "Trapped chests"
    , img = img "img/sprites/RedChest2.gif"
    }


yangTalk : Icon msg
yangTalk =
    { class = "yang-talk"
    , title = "Talk to Yang"
    , img = img "img/sprites/Yang-KO1.gif"
    }


yangBonk : Icon msg
yangBonk =
    { class = "yang-bonk"
    , title = "Bonk Yang"
    , img = img "img/sprites/Yang-Front.gif"
    }


falcon : Icon msg
falcon =
    { class = "falcon"
    , title = "Launch the Falcon"
    , img = img "img/sprites/Falcon-Left-still.png"
    }


visible : Icon msg
visible =
    { class = "checked"
    , title = "Dismissed locations"
    , img = img "img/sprites/SecurityEye.gif"
    }


no : Html msg
no =
    Html.img [ Html.Attributes.class "no", src "img/no.png" ] []


weapon : Icon msg
weapon =
    { class = "weapon"
    , title = "Weapon"
    , img = img "img/sprites/KnightSword.gif"
    }


armour : Icon msg
armour =
    { class = "armour"
    , title = "Armour"
    , img = img "img/sprites/Armor.gif"
    }


healing : Icon msg
healing =
    { class = "healing"
    , title = "Healing consumables"
    , img = img "img/sprites/RecoveryItem.gif"
    }


jItem : Icon msg
jItem =
    { class = "jItem"
    , title = "J-items"
    , img = img "img/sprites/Hourglass.gif"
    }


other : Icon msg
other =
    { class = "other"
    , title = "Other"
    , img = img "img/sprites/Summon.gif"
    }


requirements : Dict Requirement (Icon msg)
requirements =
    [ ( Adamant
      , { class = "adamant"
        , title = "Adamant"
        , img = img "img/schalakitty/FFIVFE-Icons-13Adamant-Color-Alt.png"
        }
      )
    , ( BaronKey
      , { class = "baron-key"
        , title = "Baron Key"
        , img = img "img/schalakitty/FFIVFE-Icons-9BaronKey-Color.png"
        }
      )
    , ( Crystal
      , { class = "crystal"
        , title = "Crystal"
        , img = img "img/schalakitty/FFIVFE-Icons-1THECrystal-Color.png"
        }
      )
    , ( DarknessCrystal
      , { class = "darkness-crystal"
        , title = "Darkness Crystal"
        , img = img "img/schalakitty/FFIVFE-Icons-4DarkCrystal-Color.png"
        }
      )
    , ( EarthCrystal
      , { class = "earth-crystal"
        , title = "Earth Crystal"
        , img = img "img/schalakitty/FFIVFE-Icons-5EarthCrystal-Color.png"
        }
      )
    , ( Hook
      , { class = "hook"
        , title = "Hook"
        , img = img "img/schalakitty/FFIVFE-Icons-3Hook-Color.png"
        }
      )
    , ( LegendSword
      , { class = "legend-sword"
        , title = "Legend Sword"
        , img = img "img/schalakitty/FFIVFE-Icons-14LegendSword-Color.png"
        }
      )
    , ( LucaKey
      , { class = "luca-key"
        , title = "Luca Key"
        , img = img "img/schalakitty/FFIVFE-Icons-12LucaKey-Color.png"
        }
      )
    , ( MagmaKey
      , { class = "magma-key"
        , title = "Magma Key"
        , img = img "img/schalakitty/FFIVFE-Icons-10MagmaKey-Color.png"
        }
      )
    , ( Pseudo MistDragon
      , { class = "mist-dragon"
        , title = "D.Mist Defeated"
        , img = img "img/sprites/MistDragon1.gif"
        }
      )
    , ( Package
      , { class = "package"
        , title = "Package"
        , img = img "img/schalakitty/FFIVFE-Icons-7Package-Color.png"
        }
      )
    , ( Pan
      , { class = "pan"
        , title = "Pan"
        , img = img "img/schalakitty/FFIVFE-Icons-15Pan-Color-Alt.png"
        }
      )
    , ( Pseudo Pass
      , { class = "pass"
        , title = "Pass"
        , img = img "img/schalakitty/FFIVFE-Icons-2Pass-Color.png"
        }
      )
    , ( PinkTail
      , { class = "pink-tail"
        , title = "Pink Tail"
        , img = img "img/schalakitty/FFIVFE-Icons-18PinkTail-Color.png"
        }
      )
    , ( RatTail
      , { class = "rat-tail"
        , title = "Rat Tail"
        , img = img "img/schalakitty/FFIVFE-Icons-17RatTail-Color.png"
        }
      )
    , ( SandRuby
      , { class = "sand-ruby"
        , title = "Sand Ruby"
        , img = img "img/schalakitty/FFIVFE-Icons-8SandRuby-Color.png"
        }
      )
    , ( Spoon
      , { class = "spoon"
        , title = "Spoon"
        , img = img "img/schalakitty/FFIVFE-Icons-16Spoon-Color.png"
        }
      )
    , ( TowerKey
      , { class = "tower-key"
        , title = "Tower Key"
        , img = img "img/schalakitty/FFIVFE-Icons-11TowerKey-Color.png"
        }
      )
    , ( TwinHarp
      , { class = "twin-harp"
        , title = "Twin Harp"
        , img = img "img/schalakitty/FFIVFE-Icons-6TwinHarp-Color.png"
        }
      )
    ]
        |> Dict.fromList


img : String -> List (Html.Attribute msg) -> Html msg
img src_ attrs =
    Html.img (src src_ :: attrs) []
