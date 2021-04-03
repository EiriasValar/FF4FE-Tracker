module Location exposing
    ( Location
    , Requirement(..)
    , getBosses
    , getCharacters
    , getName
    , hasKeyItem
    , isChecked
    , isProspect
    , locations
    , toggleChecked
    )

import Dict exposing (Dict)
import EverySet as Set exposing (EverySet)
import Flags exposing (Flags)


type alias Set a =
    EverySet a


type Location
    = Location Internals


type alias Internals =
    { name : String
    , area : Area
    , checked : Bool
    , requirements : Set Requirement
    , jumpable : Bool
    , characters : Maybe CharacterCount
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
    | Free


type CharacterCount
    = Ungated Int
    | Gated Int


getName : Location -> String
getName (Location location) =
    location.name


getCharacters : Flags -> Location -> Int
getCharacters flags (Location location) =
    case location.characters of
        Just (Gated n) ->
            n

        Just (Ungated n) ->
            if flags.noFreeChars then
                0

            else
                n

        Nothing ->
            0


getBosses : Flags -> Location -> Int
getBosses _ (Location location) =
    location.bosses


hasKeyItem : Flags -> Location -> Bool
hasKeyItem flags (Location location) =
    case location.keyItem of
        Just Free ->
            not flags.noFreeKeyItem

        Nothing ->
            False

        _ ->
            True


isChecked : Location -> Bool
isChecked (Location location) =
    location.checked


toggleChecked : Location -> Location
toggleChecked (Location location) =
    Location { location | checked = not location.checked }


isProspect : Flags -> Set Requirement -> Location -> Bool
isProspect flags attained ((Location l) as location) =
    let
        newAttained =
            if flags.pushBToJump || Set.member MagmaKey attained || Set.member Hook attained then
                Set.insert UndergroundAccess attained

            else
                attained
    in
    not l.checked
        && hasValue flags location
        && areaAccessible newAttained location
        && (flags.pushBToJump && l.jumpable || requirementsMet newAttained location)


hasValue : Flags -> Location -> Bool
hasValue flags location =
    -- TODO suppress getBosses if there's no boss objective or item-bearing dmist still to find
    (getCharacters flags location > 0)
        || (getBosses flags location > 0)
        || hasKeyItem flags location


areaAccessible : Set Requirement -> Location -> Bool
areaAccessible attained (Location location) =
    case location.area of
        Surface ->
            True

        Underground ->
            Set.member UndergroundAccess attained

        Moon ->
            Set.member DarknessCrystal attained


requirementsMet : Set Requirement -> Location -> Bool
requirementsMet attained (Location location) =
    Set.diff location.requirements attained
        |> Set.isEmpty


locations : Dict Int Location
locations =
    [ { name = "Mist Cave"
      , area = Surface
      , requirements = []
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Nothing
      }
    , { name = "Mist Village - Package"
      , area = Surface
      , requirements = [ Package ]
      , jumpable = False
      , characters = Just <| Gated 1
      , bosses = 1
      , keyItem = Nothing
      }
    , { name = "Mist Village - Mom"
      , area = Surface
      , requirements = [ MistDragon ]
      , jumpable = False
      , characters = Nothing
      , bosses = 0
      , keyItem = Just Main
      }
    , { name = "Kaipo"
      , area = Surface
      , requirements = [ SandRuby ]
      , jumpable = False
      , characters = Just <| Gated 1
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Watery Pass"
      , area = Surface
      , requirements = []
      , jumpable = False
      , characters = Just <| Ungated 1
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Waterfall"
      , area = Surface
      , requirements = []
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Nothing
      }
    , { name = "Damcyan"
      , area = Surface
      , requirements = []
      , jumpable = False
      , characters = Just <| Ungated 1
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Antlion Cave"
      , area = Surface
      , requirements = []
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Mt. Hobbs"
      , area = Surface
      , requirements = []
      , jumpable = False
      , characters = Just <| Gated 1
      , bosses = 1
      , keyItem = Nothing
      }
    , { name = "Fabul Defence"
      , area = Surface
      , requirements = []
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Sheila 1"
      , area = Surface
      , requirements = [ UndergroundAccess ]
      , jumpable = False
      , characters = Nothing
      , bosses = 0
      , keyItem = Just Main
      }
    , { name = "Sheila 2"
      , area = Surface
      , requirements = [ UndergroundAccess, Pan ]
      , jumpable = False
      , characters = Nothing
      , bosses = 0
      , keyItem = Just Main
      }
    , { name = "Adamant Grotto"
      , area = Surface
      , requirements = [ Hook, RatTail ]
      , jumpable = False
      , characters = Nothing
      , bosses = 0
      , keyItem = Just Main
      }
    , { name = "Mysidia"
      , area = Surface
      , requirements = []
      , jumpable = False
      , characters = Just <| Ungated 2
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Mt. Ordeals"
      , area = Surface
      , requirements = []
      , jumpable = False
      , characters = Just <| Ungated 1
      , bosses = 3
      , keyItem = Just Main
      }
    , { name = "Baron Inn"
      , area = Surface
      , requirements = []
      , jumpable = False
      , characters = Just <| Gated 1
      , bosses = 2
      , keyItem = Just Main
      }
    , { name = "Baron Castle"
      , area = Surface
      , requirements = [ BaronKey ]
      , jumpable = True
      , characters = Just <| Gated 1
      , bosses = 2
      , keyItem = Just Main
      }
    , { name = "Baron Castle Basement"
      , area = Surface
      , requirements = [ BaronKey ]
      , jumpable = True
      , characters = Nothing
      , bosses = 1
      , keyItem = Just Summon
      }
    , { name = "Bedward"
      , area = Surface
      , requirements = []
      , jumpable = False
      , characters = Nothing
      , bosses = 0
      , keyItem = Just Free
      }
    , { name = "Cave Magnes"
      , area = Surface
      , requirements = [ TwinHarp ]
      , jumpable = True
      , characters = Nothing
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Tower of Zot 1"
      , area = Surface
      , requirements = []
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Nothing
      }
    , { name = "Tower of Zot 2"
      , area = Surface
      , requirements = [ EarthCrystal ]
      , jumpable = True
      , characters = Just <| Gated 2
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Cave Eblan"
      , area = Surface
      , requirements = [ Hook ]
      , jumpable = True
      , characters = Just <| Gated 1
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Upper Bab-il"
      , area = Surface
      , requirements = [ Hook ]
      , jumpable = True
      , characters = Nothing
      , bosses = 2
      , keyItem = Nothing
      }
    , { name = "Giant of Bab-il"
      , area = Surface
      , requirements = [ DarknessCrystal ]
      , jumpable = False
      , characters = Just <| Gated 1
      , bosses = 2
      , keyItem = Nothing
      }
    , { name = "Dwarf Castle"
      , area = Underground
      , requirements = []
      , jumpable = False
      , characters = Just <| Gated 1
      , bosses = 2
      , keyItem = Just Main
      }
    , { name = "Lower Bab-il - Cannon"
      , area = Underground
      , requirements = [ TowerKey ]
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Lower Bab-il - Top"
      , area = Underground
      , requirements = []
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Sylph Cave"
      , area = Underground
      , requirements = [ Pan ]
      , jumpable = False
      , characters = Nothing
      , bosses = 0
      , keyItem = Just Summon
      }
    , { name = "Feymarch - King"
      , area = Underground
      , requirements = []
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Just Summon
      }
    , { name = "Feymarch - Queen"
      , area = Underground
      , requirements = []
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Just Summon
      }
    , { name = "Sealed Cave"
      , area = Underground
      , requirements = [ LucaKey ]
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Just Main
      }
    , { name = "Lunar Dais"
      , area = Moon
      , requirements = []
      , jumpable = False
      , characters = Just <| Gated 1
      , bosses = 0
      , keyItem = Nothing
      }
    , { name = "Cave Bahamut"
      , area = Moon
      , requirements = []
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Just Summon
      }
    , { name = "Murasame Altar"
      , area = Moon
      , requirements = []
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Just MoonBoss
      }
    , { name = "Wyvern Altar"
      , area = Moon
      , requirements = []
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Just MoonBoss
      }
    , { name = "White Spear Altar"
      , area = Moon
      , requirements = []
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Just MoonBoss
      }
    , { name = "Ribbon Room"
      , area = Moon
      , requirements = []
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Just MoonBoss
      }
    , { name = "Masamune Altar"
      , area = Moon
      , requirements = []
      , jumpable = False
      , characters = Nothing
      , bosses = 1
      , keyItem = Just MoonBoss
      }
    ]
        |> List.indexedMap
            (\index l ->
                Tuple.pair index <|
                    Location
                        { name = l.name
                        , area = l.area
                        , checked = False
                        , requirements = Set.fromList l.requirements
                        , jumpable = l.jumpable
                        , characters = l.characters
                        , bosses = l.bosses
                        , keyItem = l.keyItem
                        }
            )
        |> Dict.fromList
