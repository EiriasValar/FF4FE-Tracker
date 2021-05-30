# Yet Another Web Tracker for Final Fantasy IV: Free Enterprise!

[Free Enterprise](http://ff4fe.com/) is a randomizer for Final Fantasy IV. A tracker is a piece of software that helps a randomizer player keep track of the things they have and haven't yet done or seen as they play the game.

The [Free Enterprise Resources](https://docs.google.com/spreadsheets/d/1Dpdq74HZ-KipaSnSqRuMMXjJdn-uSP2C-UvKYyS3-wY/edit#gid=0) document has links to a number of other trackers, all of which have provided some inspiration for this one. In particular the high-level UI is heavily based on [BigDunka's tracker](https://fftracker.dunka.net/index.html).

The Key Item icons (except for the Mist Dragon) are the property of [SchalaKitty](http://schala-kitty.net/ff4fe-tracker/), used with permission. **TODO get permission so this is true!**

Other icons are all sprites from the game, taken from [videogamesprites.net](http://www.videogamesprites.net/).


# Using it

`npm start` will get the tracker running locally.

Pasting the flag string used to generate your seed into the provided text area will allow the tracker to only show things relevant to your seed (e.g. hiding free character locations when `Nchars` is on, showing a potential second key item in Dwarf Castle when `Gwarp` is on, etc).


# Development

The tracker is written in [Elm](https://elm-lang.org/), compiled to JavaScript.

It very trivially uses [elm-spa](https://elm-spa.dev): as development progressed it became clear that the tracker would only ever be a single logical page.

[Elm Bootstrap](http://elm-bootstrap.info/) is used just for the Dropdown module, to allow for dropdown options with non-string values (used when setting a random objective). The "bootstrap" stylesheet is a heavily-gutted version to handle just the dropdown elements, with nothing particularly Bootstrap-y about them. This dependency could be entirely ripped out with a bit of work to recreate the Dropdown element.
