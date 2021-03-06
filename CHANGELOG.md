## 2022-03-11
- Treat Lunar Subterrane trapped chests differently under Ktrap when none of
  Kmoon/unsafe are on (as they can't contain key items in that case).
- Remove support for `Orandom:gated_quest`. `Orandom:tough_quest` will be handled
  once there's an official answer about what it includes/excludes.

## 2021-12-29
- Link the Defeat D. Mist objective with the D. Mist "key item", so completing
  or obtaining one gives you the other.
- Fix bug where marking Sylph Cave as complete would always un-complete Sheila,
  even if you'd already checked off both Yang values.
- Remove hardcoded green text colour where it can clash with the background,
  namely the objectives counter (on completing the required number) and
  right-clicked location names.
- [4.5.0 beta] Support Knofree and Cnofree flags (formerly Nkey and Nchars)
- [4.5.0 beta] Support Cnoearned flag

## 2021-09-08
- Show Valvalis' physical evasion in the boss stats.
- Fix logic bug where `Pshop` caused all shops to be hidden.

## 2021-09-06
- Fix bug where gated value icons didn't respect Hide filters.
- Change random objective selection UI to support type-to-filter (at the cost
  of losing the subheadings in the dropdown list).
- Add colour pickers for the background and text colours, which persist between
  pageloads.

## 2021-08-18
- Mark objectives as complete when their locations are dismissed, since that's
  pretty much always what you want to have happen.
- Combine the two Baron shop locations into one, with the weapon and armour
  shop icons being gated by the Baron Key.
- Manage the state of the Crystal key item automatically when under
  `Owin:crystal`, based on objective completion.
- Handle `Bvanilla`: show boss hunt objectives in their vanilla locations, and
  treat Mist Cave as valuable (under `Nkey`).

## 2021-08-13
- Fix bug where Toroia was displaying the Pass objective regardless of whether
  you had the Pass yet. Thanks to Illiena for the report!

## 2021-08-07
- Refactor Objective-handling code: shouldn't have any noticeable effects
  unless I've broken something.
- Mark locations that contain our quest objectives, and automatically un-dismiss
  such locations when we gain an item that gates those objectives. There are
  still a few rough edges on this; please see the README for more details.
- Hide the Objectives section when there aren't any.

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
  underground, Sheila's two key items) ??? so you can e.g. talk to Yang to access
  Sheila but keep Sylph Cave undismissed to remember its trapped chests ??? but
  dismissing the whole location also automatically checks off the icons, for
  convenience.
- Automatically un-dismiss Sylph Cave when you get the Pan, and Sheila when you
  bonk Yang, to account for multiple trips to those locations.
- Add a separate 'Dismissed locations' filter for the Shops section.

### 2021-07-28
- Handle the (currently in beta) `gated_quest` option for the `Orandom` flag,
  which slightly reduces the set of possible random quest objectives.
