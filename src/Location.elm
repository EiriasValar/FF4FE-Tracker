module Location exposing (Location, Requirement(..), initialList)

import EverySet as Set exposing (EverySet)


type alias Set a =
    EverySet a


type Location
    = Location Internals


type alias Internals =
    { name : String
    , area : Area
    , checked : Bool
    , requirements : Set Requirement
    , characters : Int
    , bosses : Int
    , keyItem : Maybe KeyItemClass
    }


type Requirement
    = Package
    | SandRuby
    | BaronKey
    | LucaKey
    | MagmaKey
    | TowerKey
    | DarknessCrystal
    | EarthCrystal
    | Crystal
    | Hook
    | TwinHarp
    | Pan
    | RatTail
    | Adamant
    | LegendSword
    | Spoon
    | PinkTail
    | Pass
    | MistDragon
    | UndergroundAccess


type Area
    = Surface
    | Underground
    | Moon


type KeyItemClass
    = Main
    | Summon
    | MoonBoss



-- identify free characters by requirements = [] and bosses = 0
-- nope, ordeals has no requirements
-- hardcode the free spots: watery pass, damcyan, mysidia, ordeals


isAccessible : Set Requirement -> Location -> Bool
isAccessible attained location =
    areaAccessible attained location
        && requirementsMet attained location


areaAccessible : Set Requirement -> Location -> Bool
areaAccessible attained (Location location) =
    case location.area of
        Surface ->
            True

        Underground ->
            -- check for Push B to Jump flag will go here
            Set.member MagmaKey attained || Set.member Hook attained

        Moon ->
            Set.member DarknessCrystal attained


requirementsMet : Set Requirement -> Location -> Bool
requirementsMet attained (Location location) =
    Set.diff location.requirements attained
        |> Set.isEmpty


initialList : List Location
initialList =
    [ { name = "Mist Cave"
      , area = Surface
      , requirements = []
      , characters = 0
      , bosses = 1
      , keyItem = Nothing
      }
    , { name = "Mist Village - Package"
      , area = Surface
      , requirements = [ Package ]
      , characters = 1
      , bosses = 1
      , keyItem = Nothing
      }
    , { name = "Mist Village - Mom"
      , area = Surface
      , requirements = [ MistDragon ]
      , characters = 0
      , bosses = 0
      , keyItem = Just Main
      }
    , { name = "Kaipo"
      , area = Surface
      , requirements = [ SandRuby ]
      , characters = 1
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Watery Pass"
      , area = Surface
      , requirements = []
      , characters = 1
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Waterfall"
      , area = Surface
      , requirements = []
      , characters = 0
      , bosses = 1
      , keyItem = Nothing
      }
    , { name = "Damcyan"
      , area = Surface
      , requirements = []
      , characters = 1
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Antlion Cave"
      , area = Surface
      , requirements = []
      , characters = 0
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Mt. Hobbs"
      , area = Surface
      , requirements = []
      , characters = 1
      , bosses = 1
      , keyItem = Nothing
      }
    , { name = "Fabul Defence"
      , area = Surface
      , requirements = []
      , characters = 0
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Sheila 1"
      , area = Surface
      , requirements = [ UndergroundAccess ]
      , characters = 0
      , bosses = 0
      , keyItem = Just Main
      }
    , { name = "Sheila 2"
      , area = Surface
      , requirements = [ UndergroundAccess, Pan ]
      , characters = 0
      , bosses = 0
      , keyItem = Just Main
      }
    , { name = "Mysidia"
      , area = Surface
      , requirements = []
      , characters = 2
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Mt. Ordeals"
      , area = Surface
      , requirements = []
      , characters = 1
      , bosses = 3
      , keyItem = Just Main
      }
    , { name = "Baron Inn"
      , area = Surface
      , requirements = []
      , characters = 1
      , bosses = 2
      , keyItem = Just Main
      }
    , { name = "Baron Castle"
      , area = Surface
      , requirements = [ BaronKey ]
      , characters = 1
      , bosses = 2
      , keyItem = Just Main
      }
    , { name = "Baron Castle Basement"
      , area = Surface
      , requirements = [ BaronKey ]
      , characters = 0
      , bosses = 1
      , keyItem = Just Summon
      }
    , { name = "Bedward"
      , area = Surface
      , requirements = []
      , characters = 0
      , bosses = 0
      , keyItem = Just Main
      }
    , { name = "Cave Magnes"
      , area = Surface
      , requirements = [ TwinHarp ]
      , characters = 0
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Tower of Zot 1"
      , area = Surface
      , requirements = []
      , characters = 0
      , bosses = 1
      , keyItem = Nothing
      }
    , { name = "Tower of Zot 2"
      , area = Surface
      , requirements = [ EarthCrystal ]
      , characters = 2
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Upper Bab-il"
      , area = Surface
      , requirements = [ Hook ]
      , characters = 1
      , bosses = 2
      , keyItem = Nothing
      }
    , { name = "Giant of Bab-il"
      , area = Surface
      , requirements = [ DarknessCrystal ]
      , characters = 1
      , bosses = 2
      , keyItem = Nothing
      }
    , { name = "Adamant Grotto"
      , area = Surface
      , requirements = [ Hook, RatTail ]
      , characters = 0
      , bosses = 0
      , keyItem = Just Main
      }
    , { name = "Dwarf Castle"
      , area = Underground
      , requirements = []
      , characters = 1
      , bosses = 2
      , keyItem = Just Main
      }
    , { name = "Lower Bab-il - Top"
      , area = Underground
      , requirements = []
      , characters = 0
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Lower Bab-il - Cannon"
      , area = Underground
      , requirements = [ TowerKey ]
      , characters = 0
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Sylph Cave"
      , area = Underground
      , requirements = [ Pan ]
      , characters = 0
      , bosses = 0
      , keyItem = Just Summon
      }
    , { name = "Feymarch - King"
      , area = Underground
      , requirements = []
      , characters = 0
      , bosses = 1
      , keyItem = Just Summon
      }
    , { name = "Feymarch - Queen"
      , area = Underground
      , requirements = []
      , characters = 0
      , bosses = 1
      , keyItem = Just Summon
      }
    , { name = "Sealed Cave"
      , area = Underground
      , requirements = [ LucaKey ]
      , characters = 0
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Lunar Dais"
      , area = Moon
      , requirements = []
      , characters = 1
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Cave Bahamut"
      , area = Moon
      , requirements = []
      , characters = 0
      , bosses = 1
      , keyItem = Just Summon
      }
    , { name = "Murasame Altar"
      , area = Moon
      , requirements = []
      , characters = 0
      , bosses = 1
      , keyItem = Just MoonBoss
      }
    , { name = "Wyvern Altar"
      , area = Moon
      , requirements = []
      , characters = 0
      , bosses = 1
      , keyItem = Just MoonBoss
      }
    , { name = "White Spear Altar"
      , area = Moon
      , requirements = []
      , characters = 0
      , bosses = 1
      , keyItem = Just MoonBoss
      }
    , { name = "Ribbon Room"
      , area = Moon
      , requirements = []
      , characters = 0
      , bosses = 1
      , keyItem = Just MoonBoss
      }
    , { name = "Masamune Altar"
      , area = Moon
      , requirements = []
      , characters = 0
      , bosses = 1
      , keyItem = Just MoonBoss
      }
    ]
        |> List.map
            (\l ->
                Location
                    { name = l.name
                    , area = l.area
                    , checked = False
                    , requirements = Set.fromList l.requirements
                    , characters = l.characters
                    , bosses = l.bosses
                    , keyItem = l.keyItem
                    }
            )
