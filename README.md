# Yet Another Web Tracker for Final Fantasy IV: Free Enterprise!

[Free Enterprise](http://ff4fe.com/) is a randomizer for Final Fantasy IV. A tracker is a piece of software that helps a randomizer player keep track of the things they have and haven't yet done or seen as they play the game.

The [Free Enterprise Resources](https://docs.google.com/spreadsheets/d/1Dpdq74HZ-KipaSnSqRuMMXjJdn-uSP2C-UvKYyS3-wY/edit#gid=0) document has links to a number of other trackers, all of which have provided some inspiration for this one. In particular the high-level UI is heavily based on [BigDunka's tracker](https://fftracker.dunka.net/index.html).

The Key Item icons (except for the Mist Dragon) are the property of [SchalaKitty](http://schala-kitty.net/ff4fe-tracker/), used with permission. **TODO get permission so this is true!**

Other icons are all sprites from the game, taken from [videogamesprites.net](http://www.videogamesprites.net/).


# Using it

`npm start` will get the tracker running locally.

Pasting the flag string used to generate your seed into the provided text area will allow the tracker to only show things relevant to your seed (e.g. hiding free character locations when `Nchars` is on, showing a potential second key item in Dwarf Castle when `Gwarp` is on, etc).

Click on key items or objectives to mark them as obtained/completed; the list of available locations will expand as area-gating key items are obtained, and potentially collapse as objectives are completed.

Click on a location name to remove it from the list once you've completed (or simply checked and dismissed) it, or right-click to highlight it for future reference (e.g. having located an objective boss that you can't defeat yet).

The "value" icons next to a location name can also be clicked to mark them as individually completed; this is just for your reference, and has no impact on the tracker's logic – with the exception of the "phantom" second key item in Dwarf Castle, which appears if the `Gwarp` flag is on. Toggling this key item icon indicates that you used the warp glitch in Dwarf Castle to obtain the Sealed Cave key item check, so the tracker knows there's no longer a key item to be acquired in that location.

The tracker tries to only show you locations that are potentially valuable to you, given your flags and objectives: e.g. if the `Nkey` flag is on, or you have a boss hunt objective active, the Mist Cave (which has a boss but no characters or key items) will appear as an option; otherwise it will be hidden, as there's no intrinsic value to fighting a boss. This logic can be overridden using the filter icons next to the "Locations" heading: toggle an icon to Show (lit up) to always treat that class of thing as valuable, or Hide (crossed out) to not show it at all, nor locations that only have that class of thing to offer. The final Eye icon can be used to show locations that you've already dismissed.

# Development

The tracker is written in [Elm](https://elm-lang.org/), compiled to JavaScript.

It very trivially uses [elm-spa](https://elm-spa.dev): as development progressed it became clear that the tracker would only ever be a single logical page.

[Elm Bootstrap](http://elm-bootstrap.info/) is used just for the Dropdown module, to allow for dropdown options with non-string values (used when setting a random objective). The "bootstrap" stylesheet is a heavily-gutted version to handle just the dropdown elements, with nothing particularly Bootstrap-y about them. This dependency could be entirely ripped out with a bit of work to recreate the Dropdown element.

# TODOs
- Pull some types out of Location.elm, it's getting overloaded
- Fill out remaining chest data, including for towns etc.
- Make clicking on a chest decrease its counter rather than simply toggling it
- Add classes of purchaseable items as Value/icons to Shop locations
- Consistent icon handling, alt tags
- Keyboard navigation?
- Don't require right-clicks for anything

