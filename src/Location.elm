module Location exposing (new)


type Location
    = Location Internals


type alias Internals =
    { name : String
    , area : Area
    , checked : Bool
    , requires : List Requirement
    , characters : Int
    , bosses : Int
    , keyItem : Maybe KeyItem
    }


type Area
    = Surface
    | Underground
    | Moon


type KeyItem
    = Main
    | Summon
    | MoonBoss


type Requirement
    = Package
    | SandRuby
    | BaronKey
    | LucaKey
    | MagmaKey
    | TowerKey
    | DarknessCrystal
    | EarthCrystal
    | Hook
    | TwinHarp
    | Pan
    | RatTail
    | Adamant
    | LegendSword
    | Spoon
    | PinkTail
    | MistDragon
    | UndergroundAccess



-- identify free characters by requires = [] and bosses = 0
-- nope, ordeals has no requirements
-- hardcode the free spots: watery pass, damcyan, mysidia, ordeals

viewLocations : List Location -> List Requirement -> Html msg
viewLocations locations requirements =
    let
        locationAccessible location =


        showLocation location =
            location.checked
                && location.requirements |> List.all (List.memberOf requirements)
    locations
        |> List.map (\location ->
            if not location.checked && location.requirements |> List.all (List.memberOf requirements) then

            else
                text "" 
        )



new : List Location
new =
    [ { name = "Mist Cave"
      , area = Surface
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 1
      , keyItem = Nothing
      }
    , { name = "Mist Village - Package"
      , area = Surface
      , checked = False
      , requires = [ Package ]
      , characters = 1
      , bosses = 1
      , keyItem = Nothing
      }
    , { name = "Mist Village - Mom"
      , area = Surface
      , checked = False
      , requires = [ MistDragon ]
      , characters = 0
      , bosses = 0
      , keyItem = Just Main
      }
    , { name = "Kaipo"
      , area = Surface
      , checked = False
      , requires = [ SandRuby ]
      , characters = 1
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Watery Pass"
      , area = Surface
      , checked = False
      , requires = []
      , characters = 1
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Waterfall"
      , area = Surface
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 1
      , keyItem = Nothing
      }
    , { name = "Damcyan"
      , area = Surface
      , checked = False
      , requires = []
      , characters = 1
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Antlion Cave"
      , area = Surface
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Mt. Hobbs"
      , area = Surface
      , checked = False
      , requires = []
      , characters = 1
      , bosses = 1
      , keyItem = Nothing
      }
    , { name = "Fabul Defence"
      , area = Surface
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Sheila 1"
      , area = Surface
      , checked = False
      , requires = [ UndergroundAccess ]
      , characters = 0
      , bosses = 0
      , keyItem = Just Main
      }
    , { name = "Sheila 2"
      , area = Surface
      , checked = False
      , requires = [ UndergroundAccess, Pan ]
      , characters = 0
      , bosses = 0
      , keyItem = Just Main
      }
    , { name = "Mysidia"
      , area = Surface
      , checked = False
      , requires = []
      , characters = 2
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Mt. Ordeals"
      , area = Surface
      , checked = False
      , requires = []
      , characters = 1
      , bosses = 3
      , keyItem = Just Main
      }
    , { name = "Baron Inn"
      , area = Surface
      , checked = False
      , requires = []
      , characters = 1
      , bosses = 2
      , keyItem = Just Main
      }
    , { name = "Baron Castle"
      , area = Surface
      , checked = False
      , requires = [ BaronKey ]
      , characters = 1
      , bosses = 2
      , keyItem = Just Main
      }
    , { name = "Baron Castle Basement"
      , area = Surface
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 1
      , keyItem = Just Summon
      }
    , { name = "Bedward"
      , area = Surface
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 0
      , keyItem = Just Main
      }
    , { name = "Cave Magnes"
      , area = Surface
      , checked = False
      , requires = [ TwinHarp ]
      , characters = 0
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Tower of Zot 1"
      , area = Surface
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 1
      , keyItem = Nothing
      }
    , { name = "Tower of Zot 2"
      , area = Surface
      , checked = False
      , requires = [ EarthCrystal ]
      , characters = 2
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Upper Bab-il"
      , area = Surface
      , checked = False
      , requires = [ Hook ]
      , characters = 1
      , bosses = 2
      , keyItem = Nothing
      }
    , { name = "Giant of Bab-il"
      , area = Surface
      , checked = False
      , requires = [ DarknessCrystal ]
      , characters = 1
      , bosses = 2
      , keyItem = Nothing
      }
    , { name = "Adamant Grotto"
      , area = Surface
      , checked = False
      , requires = [ Hook, RatTail ]
      , characters = 0
      , bosses = 0
      , keyItem = Just Main
      }
    , { name = "Dwarf Castle"
      , area = Underground
      , checked = False
      , requires = []
      , characters = 1
      , bosses = 2
      , keyItem = Just Main
      }
    , { name = "Lower Bab-il - Top"
      , area = Underground
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Lower Bab-il - Cannon"
      , area = Underground
      , checked = False
      , requires = [ TowerKey ]
      , characters = 0
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Sylph Cave"
      , area = Underground
      , checked = False
      , requires = [ Pan ]
      , characters = 0
      , bosses = 0
      , keyItem = Just Summon
      }
    , { name = "Feymarch - King"
      , area = Underground
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 1
      , keyItem = Just Summon
      }
    , { name = "Feymarch - Queen"
      , area = Underground
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 1
      , keyItem = Just Summon
      }
    , { name = "Sealed Cave"
      , area = Underground
      , checked = False
      , requires = [ LucaKey ]
      , characters = 0
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Lunar Dais"
      , area = Moon
      , checked = False
      , requires = []
      , characters = 1
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Cave Bahamut"
      , area = Moon
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 1
      , keyItem = Just Summon
      }
    , { name = "Murasame Altar"
      , area = Moon
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 1
      , keyItem = Just MoonBoss
      }
    , { name = "Wyvern Altar"
      , area = Moon
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 1
      , keyItem = Just MoonBoss
      }
    , { name = "White Spear Altar"
      , area = Moon
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 1
      , keyItem = Just MoonBoss
      }
    , { name = "Ribbon Room"
      , area = Moon
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 1
      , keyItem = Just MoonBoss
      }
    , { name = "Masamune Altar"
      , area = Moon
      , checked = False
      , requires = []
      , characters = 0
      , bosses = 1
      , keyItem = Just MoonBoss
      }
    ]
        |> List.map Location
