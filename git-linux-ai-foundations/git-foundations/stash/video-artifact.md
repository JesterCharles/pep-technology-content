---
title: How to STASH in Your JetBrains IDE
channel: JetBrains
url: https://www.youtube.com/watch?v=rQXUSI50uhs
runtimeMinutes: 2.7
embeddable: true
checkedAt: 2026-10-12
covers: []
  - o2: the task switch the page teaches - uncommitted work on a feature branch, stash it, switch to main, commit a fix, come back, pop the stash (transcript)
  - o2 in part: listing stashes and "pop stash" deleting the stash after applying it (transcript)
  - o1 in part: stashing records the difference between the head commit and the working directory (description)
gaps: []
  - o1: that untracked files stay behind by default (git stash -u) is not covered (transcript)
  - git stash, git stash list and git stash pop are not typed; the IDE menus and search are used (transcript)
cautions: []
  - First-party channel (JetBrains, channel id UCGp4UBwpTNegd_4nCpuBcow)
  - JetBrains IDE walkthrough with comic dialogue; it contrasts stash with the JetBrains-only Shelve feature
  - Fit was judged from the auto-generated caption track and the description; frames were not inspected
alternates: []
rejected: []
---

# Video companion: Stash: setting work aside

**Selected:** [How to STASH in Your JetBrains IDE](https://www.youtube.com/watch?v=rQXUSI50uhs), JetBrains (first-party), 162 s (2:42), checked live 2026-10-12.
Public oEmbed returned HTTP 200 and the player reported status OK.

## Fit against the topic objectives

How verified: caption transcript, video description and live player metadata.

- **o1 What git stash saves and leaves behind by default** - partly covered. The description says stashing records the difference between the head commit and the working directory; untracked files are not discussed.
- **o2 Use git stash, list and pop to switch tasks** - covered as a workflow: stash unfinished feature work, switch to main, commit the fix, return, list stashes and "pop stash" (which deletes the stash after applying). Done through the IDE, not typed commands.

## Cautions

- IDE-specific: menus, "search everywhere" and the Shelve comparison are JetBrains features.

## Alternates (all verified live 2026-10-12)

- Philomatics (**not first-party**), [Go beyond git stash & pop](https://www.youtube.com/watch?v=ou6FvHyPegQ), 219 s. The previous (legacy) pick. Captions cover typed `git stash`, `git stash list` with `stash@{0}` newest, `git stash pop`, `apply`, `drop` and stash conflicts; it ends with a workshop advertisement.
- Visual Studio Code (first-party), [What is 'git STASH'?](https://www.youtube.com/watch?v=N6uEF6I4svc), 52 s. Transcript sets up an untracked JPEG beside edited files, then ends after creating a stash, before explaining what was left behind.
- Microsoft Visual Studio (first-party), [Saving Work in Progress with Stashing in Visual Studio [Ep 3] | Advanced Series](https://www.youtube.com/watch?v=jOYKUyBJ_Qg), 48 s. Transcript: stash to switch branches for a bug fix, then `git stash apply`.

## Rejected

- Visual Studio Code (first-party), [Git: Commits in Visual Studio Code](https://www.youtube.com/watch?v=E6ADS2k8oNQ), 505 s. Its stash section (from 5:14) shows an untracked file left behind unless you choose to include untracked files, but the whole video exceeds the 7-minute budget.

## Front-matter note

`alternates` and `rejected` are empty in the front matter because the repository's T01 front-matter parser reads list items only as strings while the schema requires objects. The records above are the authoritative list.
The full search is in `evidence/git-linux-ai-foundations/git-foundations/video-search.md`.
