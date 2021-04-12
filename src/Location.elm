module Location exposing
    ( Context
    , Location
    , Requirement(..)
    , all
    , getBosses
    , getCharacters
    , getKeyItems
    , getName
    , isChecked
    , isDwarfCastle
    , pruneIrrelevant
    , toggleChecked
    )

import Array exposing (Array)
import EverySet as Set exposing (EverySet)
import Flags exposing (Flags, KeyItemClass(..))
import Objective exposing (Objective)


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


type CharacterCount
    = Ungated Int
    | Gated Int


type alias Context =
    { flags : Flags
    , randomObjectives : Set Objective
    , completedObjectives : Set Objective
    , attainedRequirements : Set Requirement
    , warpGlitchUsed : Bool
    , showChecked : Bool
    }



-- Names of locations with one-off rules so we can reference them directly


dwarfCastle : String
dwarfCastle =
    "Dwarf Castle"


sealedCave : String
sealedCave =
    "Sealed Cave"


giantOfBabil : String
giantOfBabil =
    "Giant of Bab-il"


getName : Location -> String
getName (Location location) =
    location.name


getCharacters : Context -> Location -> Int
getCharacters { flags } (Location location) =
    case location.characters of
        Just (Gated n) ->
            if flags.classicGiantObjective && location.name == giantOfBabil then
                0

            else
                n

        Just (Ungated n) ->
            if flags.noFreeChars then
                0

            else
                n

        Nothing ->
            0


getBosses : Context -> Location -> Int
getBosses _ (Location location) =
    location.bosses


getKeyItems : Context -> Location -> Int
getKeyItems { flags, warpGlitchUsed } (Location location) =
    let
        keyItems =
            case location.keyItem of
                Just itemClass ->
                    if Set.member itemClass flags.keyItems then
                        1

                    else
                        0

                _ ->
                    0

        modifier =
            if warpGlitchUsed && location.name == sealedCave then
                -1

            else
                0
    in
    keyItems + modifier


isChecked : Location -> Bool
isChecked (Location location) =
    location.checked


toggleChecked : Location -> Location
toggleChecked (Location location) =
    Location { location | checked = not location.checked }


isDwarfCastle : Location -> Bool
isDwarfCastle (Location location) =
    location.name == dwarfCastle


{-| Nothings out any of the provided locations that don't have anything
to offer, based on the given context. Returning Maybe instead of outright
filtering to preserve the array indices.
-}
pruneIrrelevant : Context -> Array Location -> Array (Maybe Location)
pruneIrrelevant c =
    let
        attainedRequirements =
            if
                c.flags.pushBToJump
                    || Set.member MagmaKey c.attainedRequirements
                    || Set.member Hook c.attainedRequirements
            then
                Set.insert UndergroundAccess c.attainedRequirements

            else
                c.attainedRequirements

        context =
            { c | attainedRequirements = attainedRequirements }

        -- worried about calling this for each location when it depends only on the context
        bossesRelevant =
            bossesHaveValue context

        isRelevant ((Location l) as location) =
            (context.showChecked || not l.checked)
                && ((getCharacters context location > 0)
                        || (bossesRelevant && getBosses context location > 0)
                        || (getKeyItems context location > 0)
                   )
                && areaAccessible attainedRequirements location
                && (context.flags.pushBToJump && l.jumpable || requirementsMet attainedRequirements location)
    in
    Array.map
        (\l ->
            if isRelevant l then
                Just l

            else
                Nothing
        )


{-| Returns True if, based on the given Context, bosses may be intrisically
valuable. Namely, if there are Boss Hunt objectives to fullfil, or a D.Mist
to find when the Nkey flag is on.
-}
bossesHaveValue : Context -> Bool
bossesHaveValue context =
    let
        combinedObjectives =
            context.flags.objectives
                |> Array.toList
                |> Set.fromList
                |> Set.union context.randomObjectives

        outstandingObjectives =
            if Set.size context.completedObjectives >= context.flags.requiredObjectives then
                Set.empty

            else
                Set.diff combinedObjectives context.completedObjectives

        activeBossHunt =
            outstandingObjectives
                |> Set.filter Objective.isBoss
                |> Set.isEmpty
                |> not

        -- Finding D.Mist is interesting if the Free key item is turned off and we
        -- haven't already found it. Technically it may also stop being interesting
        -- if we've already attained Go Mode without it, but at that point *most* of
        -- what we track stops being interesting.
        huntingDMist =
            (not <| Set.member Flags.Free context.flags.keyItems)
                && (not <| Set.member MistDragon context.attainedRequirements)
    in
    activeBossHunt || huntingDMist


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


all : Array Location
all =
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
    , { name = giantOfBabil
      , area = Surface
      , requirements = [ DarknessCrystal ]
      , jumpable = False
      , characters = Just <| Gated 1
      , bosses = 2
      , keyItem = Nothing
      }
    , { name = dwarfCastle
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
    , { name = sealedCave
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
        |> List.map
            (\l ->
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
        |> Array.fromList
