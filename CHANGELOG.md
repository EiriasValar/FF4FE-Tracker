## Upcoming release

- Refactor Objective-handling code: shouldn't have any noticeable effects
  unless I've broken something.
- Mark locations that contain our quest objectives, and automatically un-dismiss
  such locations when we gain an item that gates those objectives. Some sharp
  edges on this at the moment, including the fact that you can get the location
  objective icons into a state where they'll seem to ignore the next click.

## 2021-08-03
- Free Enterprise 4.4.0 has been released: Moonveil is now a tier 7 item, up
  from tier 6.

## 2021-08-02
- Show some rough/possible stats for a boss spot when hovering over its icon.
- Appropriately limit the shop item lists under `Svanilla` or `Sshuffle`.
- Automatically filter out characters under `Cparty:1`.

## 2021-07-31
- Consolidate locations that had multiple instances to accommodate a mix of
  gated and ungated/differently-gated things (Kaipo, Cave Magnes, Zot, Sylph
  Cave, Sheila); the value icons for a location can now be individually gated
  instead.
- Show icons for uniquely valuable things tied to specific locations (i.e.
  launching the Falcon, talking to Yang, bonking Yang). Checking off the
  individual icons is now what opens up access to the things you'd expect (the
  underground, Sheila's two key items) – so you can e.g. talk to Yang to access
  Sheila but keep Sylph Cave undismissed to remember its trapped chests – but
  dismissing the whole location also automatically checks off the icons, for
  convenience.
- Automatically un-dismiss Sylph Cave when you get the Pan, and Sheila when you
  bonk Yang, to account for multiple trips to those locations.
- Add a separate 'Dismissed locations' filter for the Shops section.

### 2021-07-28
- Handle the (currently in beta) `gated_quest` option for the `Orandom` flag,
  which slightly reduces the set of possible random quest objectives.
