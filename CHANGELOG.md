## 2021-07-31
- Allow individually checking off uniquely valuable things (i.e. launching
  the Falcon, talking to Yang, bonking Yang) to work as you'd expect, so you
  can mark them as obtained without having to dismiss the location (e.g. you
  talked to Yang but still want to track the trapped chests in the Sylph Cave).
- Add a separate 'Dismissed locations' filter for the Shops section.

### 2021-07-30
- Consolidate split locations for Kaipo, Cave Magnes, and Zot, similarly to
  Sylph Cave and Sheila.
- Check off uniquely valuable things when dismissing locations that may become
  undismissed automatically (Sylph Cave, Sheila), so it's clear what remains
  to be gained from them when they do.

### 2021-07-29
- Fix weirdness in how Sylph Cave was handled (it was actually two locations,
  pre- and post-Pan, which didn't share their chest counts), and show Yang
  icons there to indicate the Sheila-unlocking value.
- Un-dismiss Sylph Cave when you get the Pan, and Sheila when you (re-)dismiss
  Sylph Cave, to allow for a Sylph->Sheila->(...)->Pan->Sylph->Sheila
  sequence.

### 2021-07-28
- Handle the (currently in beta) `gated_quest` option for the `Orandom` flag,
  which slightly reduces the set of possible random quest objectives.
