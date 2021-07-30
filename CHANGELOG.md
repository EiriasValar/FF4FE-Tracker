### 2021-07-30
- Consolidate split locations for Kaipo, Cave Magnes, and Zot, similarly to
  Sylph Cave and Sheila.

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
