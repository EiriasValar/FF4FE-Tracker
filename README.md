# Yet Another Web Tracker for Final Fantasy IV: Free Enterprise!

Try it [here](https://eiriasvalar.github.io/FF4FE-Tracker/public/)!

[Free Enterprise](http://ff4fe.com/) is a randomizer for Final Fantasy IV. A tracker is a piece of software that helps a randomizer player keep track of the things they have and haven't yet done or seen as they play the game.

The [Free Enterprise Resources](https://docs.google.com/spreadsheets/d/1Dpdq74HZ-KipaSnSqRuMMXjJdn-uSP2C-UvKYyS3-wY/edit#gid=0) document has links to a number of other trackers, all of which have provided some inspiration for this one. In particular the high-level UI is heavily based on [BigDunka's tracker](https://fftracker.dunka.net/index.html).

The Key Item icons (except for the Mist Dragon) are the property of [SchalaKitty](http://schala-kitty.net/ff4fe-tracker/), used with permission.

Other icons are all sprites from the game, taken from [videogamesprites.net](http://www.videogamesprites.net/).


# Usage

Most of the tracker's functionality should be intuitive, particularly with a bit of experimentation and/or familiarity with other trackers. But if you're curious about the details, or encounter behaviour you don't understand, read on!

## Flags
Pasting the flag string used to generate your seed into the provided text area will allow the tracker to only show things relevant to your seed, e.g. hiding free character locations when `Nchars` is on, showing a potential second key item in Dwarf Castle when `Gwarp` is on, etc.

Any flags that aren't relevant to the tracker are ignored. This means any mistyped or invalid content in the flag string is also ignored; no error will be shown. As long as you copy the flag string from Free Enterprise rather than typing it out, this shouldn't be an issue.

If you encounter a valid flag that the tracker doesn't respect, it may not be implemented in the tracker yet (particularly if it's new to FE), or there may be a bug. Either way, please [let me know](#contact) about it!

## Key Items

Click on the icons for key items as you obtain them; the list of available locations will expand as area-gating key items are obtained. Items that don't exist under the given flags (no `Pass` without a `P...` flag, no `Pink Tail` under `Kvanilla`) aren't shown.

The `D.Mist` icon is shown when `Nkey` is in effect: when you find and defeat the Mist Dragon/D.Mist boss, you can mark it to a) remember that you've done it, b) cause a Mist Village location to appear to remind you to collect your potential key item, and c) keep the tracker apprised of whether you're still hunting for any bosses.

The total number of key items collected is shown in the lower-right (unless `-exp:nokeybonus` is on) to make it easier to tell at a glance how close you are to receiving double experience for reaching 10 key items. (As a reminder, the `Pass` does not count towards this total, even when `Pkey` is on.)

## Objectives

Specific objectives set in the flags are listed; click on them to toggle them between Incomplete and Complete. The tally at the top shows how many objectives are complete, how many total are required, and whether completing them awards the `Crystal` or wins the game.

For each random objective allocated by the flags, a `(Choose random objective)` item will be shown; click on it to bring up a list of the possible objectives and choose the one randomly assigned by the game to track it. Click the trash can icon to unset a chosen random objective.

The order in which the objectives are presented is based on their order in the flags (the numbers in the flags are ignored), which may differ from the order shown in-game. Also, the tracker will allow multiple instances of the same objective, though Free Enterprise itself won't.

## Locations

The list of locations (AKA "checks") currently available to you is shown here. Click on a location name to remove it from the list once you've completed (or otherwise decided to dismiss) it, or right-click to highlight it for future reference (e.g. having located an objective boss that you can't defeat yet).

A given location is shown if:
- You can reach it (you have access to the Underground or Moon if necessary)
- You can enter it (you have any required key items)
- It has **value**

Each location shows icons representing the kinds of **value** available there: characters to recruit, bosses to fight, _potential_ key items to acquire, and untrapped/trapped chests to loot. The value that exists at a location depends on the flags (certain character and key item checks only exist under certain flags), and on the [filters](#filters)。

Value icons can be clicked to mark them as individually completed. In the case of treasure chests, clicking them decrements the displayed counter; these can also be right-clicked to skip directly to being completed.

### Special Value icons

Checking off value icons is generally just for your reference, and has no impact on the tracker's logic – with the following exceptions:
- `Upper Bab-il`: Checking off the airship Falcon indicates you've reached the Underground via this location: Underground locations can now be shown. (This is automatically checked off if you dismiss the location entirely.)
- `Dwarf Castle`: If `Gwarp` is on, a faded-out second Key Item icon is shown, representing the key item check in the `Sealed Cave`, which can be reached from this location via the warp glitch. Checking it off tells the tracker that you've done this, and that there's therefore no longer a key item check to be had in the `Sealed Cave`.
- `Sylph Cave`: A Yang icon is shown; checking it off when you've talked to Yang in his bed enables a key item check with `Sheila` in Fabul. A second Yang icon appears when the `Pan` is acquired: bonk him with it and check the icon to enable `Sheila`'s second key item check. (Dismissing the whole location will also automatically check whichever Yang icons are present.) Since you may need to visit this location more than once, it will un-dismiss itself when you acquire the `Pan`.

### Boss stats

Hovering over a boss icon shows some stats for that boss spot. The stats that actually apply will depend on the boss who appears there; see the Free Enterprise Wiki's page on [the boss scaling algorithm](https://wiki.ff4fe.com/doku.php?id=boss_randomization#boss_scaling_algorithm) for more details. As such, these numbers should be taken as general indicators of a spot's power relative to other spots, not absolute truth.

The bottom half of the stats popup shows some calculations for specific bosses of interest if they appear in that spot:
- The damage range on Kainazzo's `Wave` attack (which is based on his current HP), calculated from his starting HP total in the given spot.
- The damage range on Dark Knight Cecil's Darkwave attack, calculated from the physical attack stats in the given spot.
- The magic defence that Valvalis will have in the given spot (while in her Tornado form): if it's 255 (as it is in many places), all spells will miss her.

### Filters

A row of value icons also appears in the Locations header: these control the filters that are applied – in combination with some built-in logic – to determine what kinds of value are actually, well, _valuable_.

If _none_ of the types of value at a given location are deemed to actually have value in your current circumstance, the location as a whole is considered to have no value, and won't be shown.

Click on a filter to toggle it between On (lit up), Off (crossed out), or Default (faded out).
- **On** means "this is always valuable": any accessible location with that kind of value will be shown. This is the initial setting for Characters and Key Items, as you are pretty much always interested in both those things at the start of a seed.
- **Off** means "this is never valuable": that kind of value won't be shown at all, and having this kind of value won't cause a location to be shown. This is the initial setting for Untrapped Chests, as almost every location has such chests, so seeing them all adds a lot of clutter.
- **Default** means "leave it up to the tracker to decide whether or not this is valuable": the value icon will always be shown for locations where it exists, but its existence may or may not be sufficient to cause a location to be shown.

  This is most often noticable with Bosses, which are treated as valuable as long as there's an incomplete boss hunt objective or an `Nkey` D.Mist boss that hasn't been found yet – but boss icons continue to be shown (on locations that appear due to having some other value) even when they're no longer valuable themselves. It also comes up with `Odkmatter` or `Ktrap`, which make Untrapped and Trapped chests valuable.

The final Eye filter can be used to show locations that you've already dismissed.

## Shops

Shops behave like Locations, but deal in a separate set of values: the items they have to sell you! Shops can still be dismissed by clicking on their names.

The value icons for a shop correspond to Weapons, Armour, Curatives, J-Items, and Other. Rather than serving as a reminder of what kinds of shop are in which locations, these are meant to remind you of what items you've seen in which shops: click them to highlight them.

- The Curative and J-Item icons bring up a submenu of specific items of that type that could be present (given the shop's location and the flags); when any items in the sublist are selected, the icon lights up for quick later reference.
- The Other icon brings up a text box for entering notes. Once there's anything in the text box, the icon will light up.

There are a lot of items in Free Enterprise, and even the most obscure might happen to be relevant in a particular situation, so no attempt is made to be comprehensive here. Instead, it's an opinionated list of the items you're most likely to be a) interested in and b) unable to purchase as much of as you want on your first visit – i.e. the things you may actually need to come back for later. For anything else, there's the Other text area.

# Contact

Feel free to drop me (`@EiriasValar`) a line on the **Free Enterprise Workshop** Discord, and/or to [create an Issue](https://github.com/EiriasValar/FF4FE-Tracker/issues) on GitHub to report a bug or request a feature.

# Development

`npm start` will install the dependencies, build the app, and launch the local development server.

The tracker is written in [Elm](https://elm-lang.org/), compiled to JavaScript. As there's only a single logical page,
no navigation infrastructure is implemented (anymore).

[Elm Bootstrap](http://elm-bootstrap.info/) is used just for the Dropdown module, to allow for dropdown options with non-string values (used when setting a random objective). The "bootstrap" stylesheet is a heavily-gutted version to handle just the dropdown elements, with nothing particularly Bootstrap-y about them. This dependency could be entirely removed with a bit of work to recreate the Dropdown element.

# TODO features
- Type-to-filter random objective selection
- Proper shop item lists for Svanilla and Sshuffle
- Treat locations as having value when we have quest objectives for completing them
- Accommodate streaming better (customizable background colour?)
- Expand the shop weapon and armour items into short submenus?

# TODO housekeeping
- Consistent icon handling
- Possibly de-value characters when the flags make them irrelevant (e.g. Cparty:1)
- Don't require right-clicks for anything
- Close the Shop Other textarea onBlur (without breaking the toggle)
- Make Statuses more intuitive; Dismissed meaning On for shops and items is weird
- Add CSS linting
- Bvanilla + Nkey + no boss hunt objectives = Mist Cave is the only boss with value
- Enable the Crystal when under Owin:crystal and the requisite number of objectives
  are completed
- Hide the Objectives section when no objectives are active

# TOMAYBEDOs
- Pull some types out of Location.elm, it's getting overloaded. Though they're
  all pretty interdependent. Don't want a bunch of 20-line modules per type;
  also don't want a meaningless Types.elm. Not seeing any obvious delineations.
  Tried moving Locations and its methods into their own module, but that winds
  up doubling the surface area of Location.
- Keyboard navigation?
- Remove elm-bootstrap
- Switch to compiled CSS
- Resizing a shop's textarea input doesn't persist, neither between different
  shops, nor when closing and reopening the same shop. Suppressing the ability
  to resize feels unfriendly to the user, but is it useful without persistence?
- Complete quest objectives when the corresponding location is dismissed? Might
  be too aggressive. Maybe you dismissed the location because you know it will
  be too slow/hard and you have other objectives you can take instead.
- Rework Objective.elm, it makes me sadder every time I interact with it.
- Give a type to the Property thruple returned by getProperties
