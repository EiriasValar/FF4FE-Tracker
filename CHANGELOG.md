## 2021-08-01
- Show some rough/possible stats for a boss spot when hovering over its icon.

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
