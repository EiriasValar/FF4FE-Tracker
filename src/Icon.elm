module Icon exposing
    ( Icon
    , check
    , dkc
    , fromFilter
    , fromRequirement
    , fromValue
    , kainazzo
    , no
    , objective
    , toImg
    , trash
    , valvalis
    )

import AssocList as Dict exposing (Dict)
import Html exposing (Html)
import Html.Attributes exposing (src)
import Requirement exposing (PseudoRequirement(..), Requirement(..))
import Value exposing (Filter(..), ShopValue(..), Value(..))


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

        Boss _ ->
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

        Objective _ ->
            Just objective

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


toImg : Icon msg -> Html msg
toImg icon =
    icon.img [ Html.Attributes.class icon.class, Html.Attributes.title icon.title ]


objective : Icon msg
objective =
    { class = "objective-icon"
    , title = "Objective"
    , img = img "img/sprites/Crystal-still.png"
    }


trash : Icon msg
trash =
    { class = "trash"
    , title = "Delete objective"
    , img = img "img/sprites/TrashCan.gif"
    }


check : Html msg
check =
    Html.img [ Html.Attributes.class "check", src "img/check.png" ] []


no : Html msg
no =
    Html.img [ Html.Attributes.class "no", src "img/no.png" ] []


character : Icon msg
character =
    { class = ""
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
    , img = img "img/sprites/Key-gold.gif"
    }


chest : Icon msg
chest =
    { class = ""
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
    { class = ""
    , title = "Talk to Yang"
    , img = img "img/sprites/Yang-KO1.gif"
    }


yangBonk : Icon msg
yangBonk =
    { class = ""
    , title = "Bonk Yang"
    , img = img "img/sprites/Yang-Front.gif"
    }


falcon : Icon msg
falcon =
    { class = ""
    , title = "Launch the Falcon"
    , img = img "img/sprites/Falcon-Left-still.png"
    }


visible : Icon msg
visible =
    { class = ""
    , title = "Dismissed locations"
    , img = img "img/sprites/SecurityEye.gif"
    }


weapon : Icon msg
weapon =
    { class = ""
    , title = "Weapon"
    , img = img "img/sprites/KnightSword.gif"
    }


armour : Icon msg
armour =
    { class = ""
    , title = "Armour"
    , img = img "img/sprites/Armor.gif"
    }


healing : Icon msg
healing =
    { class = ""
    , title = "Healing consumables"
    , img = img "img/sprites/RecoveryItem.gif"
    }


jItem : Icon msg
jItem =
    { class = ""
    , title = "J-items"
    , img = img "img/sprites/Hourglass.gif"
    }


other : Icon msg
other =
    { class = ""
    , title = "Other"
    , img = img "img/sprites/Summon.gif"
    }


kainazzo : Icon msg
kainazzo =
    { class = ""
    , title = "Kainazzo Wave damage at max HP"
    , img = img "img/sprites/Cagnazzo.gif"
    }


dkc : Icon msg
dkc =
    { class = ""
    , title = "Dark Knight Cecil Darkwave damage"
    , img = img "img/sprites/Cecil1-Front.gif"
    }


valvalis : Icon msg
valvalis =
    { class = ""
    , title = "Valvalis physical evasion and magical defence"
    , img = img "img/sprites/Barbariccia.gif"
    }


requirements : Dict Requirement (Icon msg)
requirements =
    [ ( Adamant
      , { class = ""
        , title = "Adamant"
        , img = img "img/schalakitty/FFIVFE-Icons-13Adamant-Color-Alt.png"
        }
      )
    , ( BaronKey
      , { class = ""
        , title = "Baron Key"
        , img = img "img/schalakitty/FFIVFE-Icons-9BaronKey-Color.png"
        }
      )
    , ( Crystal
      , { class = ""
        , title = "Crystal"
        , img = img "img/schalakitty/FFIVFE-Icons-1THECrystal-Color.png"
        }
      )
    , ( DarknessCrystal
      , { class = ""
        , title = "Darkness Crystal"
        , img = img "img/schalakitty/FFIVFE-Icons-4DarkCrystal-Color.png"
        }
      )
    , ( EarthCrystal
      , { class = ""
        , title = "Earth Crystal"
        , img = img "img/schalakitty/FFIVFE-Icons-5EarthCrystal-Color.png"
        }
      )
    , ( Hook
      , { class = ""
        , title = "Hook"
        , img = img "img/schalakitty/FFIVFE-Icons-3Hook-Color.png"
        }
      )
    , ( LegendSword
      , { class = ""
        , title = "Legend Sword"
        , img = img "img/schalakitty/FFIVFE-Icons-14LegendSword-Color.png"
        }
      )
    , ( LucaKey
      , { class = ""
        , title = "Luca Key"
        , img = img "img/schalakitty/FFIVFE-Icons-12LucaKey-Color.png"
        }
      )
    , ( MagmaKey
      , { class = ""
        , title = "Magma Key"
        , img = img "img/schalakitty/FFIVFE-Icons-10MagmaKey-Color.png"
        }
      )
    , ( Pseudo MistDragon
      , { class = ""
        , title = "D.Mist Defeated"
        , img = img "img/sprites/MistDragon1.gif"
        }
      )
    , ( Package
      , { class = ""
        , title = "Package"
        , img = img "img/schalakitty/FFIVFE-Icons-7Package-Color.png"
        }
      )
    , ( Pan
      , { class = ""
        , title = "Pan"
        , img = img "img/schalakitty/FFIVFE-Icons-15Pan-Color-Alt.png"
        }
      )
    , ( Pseudo Pass
      , { class = ""
        , title = "Pass"
        , img = img "img/schalakitty/FFIVFE-Icons-2Pass-Color.png"
        }
      )
    , ( PinkTail
      , { class = ""
        , title = "Pink Tail"
        , img = img "img/schalakitty/FFIVFE-Icons-18PinkTail-Color.png"
        }
      )
    , ( RatTail
      , { class = ""
        , title = "Rat Tail"
        , img = img "img/schalakitty/FFIVFE-Icons-17RatTail-Color.png"
        }
      )
    , ( SandRuby
      , { class = ""
        , title = "Sand Ruby"
        , img = img "img/schalakitty/FFIVFE-Icons-8SandRuby-Color.png"
        }
      )
    , ( Spoon
      , { class = ""
        , title = "Spoon"
        , img = img "img/schalakitty/FFIVFE-Icons-16Spoon-Color.png"
        }
      )
    , ( TowerKey
      , { class = ""
        , title = "Tower Key"
        , img = img "img/schalakitty/FFIVFE-Icons-11TowerKey-Color.png"
        }
      )
    , ( TwinHarp
      , { class = ""
        , title = "Twin Harp"
        , img = img "img/schalakitty/FFIVFE-Icons-6TwinHarp-Color.png"
        }
      )
    ]
        |> Dict.fromList


img : String -> List (Html.Attribute msg) -> Html msg
img src_ attrs =
    Html.img (src src_ :: attrs) []
