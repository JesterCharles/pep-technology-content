---
title: "How to undo a mistake on GitHub"
channel: "GitHub"
url: https://www.youtube.com/watch?v=a1oRZ1kAA6M
runtimeMinutes: 0.7
embeddable: true
checkedAt: 2026-10-12
covers:
  - "o1 and o3: if the commit is already pushed, revert it, which creates a new commit that undoes the changes (transcript, description)"
  - "o3: if the commit is not pushed yet, a reset can take the commit back while keeping your changes (transcript, description)"
  - "o2 in part: a hard reset also deletes your changes, so use it only if you mean to (transcript)"
gaps:
  - "The reset command text is shown on screen but not spoken (\"you can run this command\"); --soft was not confirmed by name (transcript)"
  - "o2: the effect of --soft and --hard on branch, staging area and working copy is not laid out side by side (transcript)"
  - "Revert is shown as a click on GitHub, not as git revert in a terminal (transcript, description)"
cautions:
  - "First-party channel (GitHub, channel id UC7c3Kb6jYCRj4JOHHZTxKsQ)"
  - "A 42-second short-form tip from the GitHub for Beginners season 3 series; it ends with a promotion for that series"
  - "Fit was judged from the auto-generated caption track and the description; frames were not inspected"
alternates:
  - title: "Git Reset vs Revert - Which One Should You Use?"
    url: https://www.youtube.com/watch?v=HuyPRodkME8
  - title: "Recovering from mistakes while working with git in Visual Studio [Ep 4] | Intermediate Series"
    url: https://www.youtube.com/watch?v=tkJ1yIktteQ
  - title: "How to Undo Commits in any JetBrains IDE"
    url: https://www.youtube.com/watch?v=_-3COzBp5qg
  - title: "Undo a git commit - git reset/revert - pushed/not pushed"
    url: https://www.youtube.com/watch?v=GytsxgB4-HU
rejected: []
---

# Video companion: Undoing mistakes: revert and reset

**Selected:** [How to undo a mistake on GitHub](https://www.youtube.com/watch?v=a1oRZ1kAA6M), GitHub (first-party), 42 s, checked live 2026-10-12.
Public oEmbed returned HTTP 200 and the player reported status OK.

## Fit against the topic objectives

How verified: caption transcript, video description and live player metadata.

- **o1 Undo a shared commit with git revert, which adds a new commit** - covered: "If you've already pushed your code, just open the commit and click revert. That'll create a new commit that undoes the changes."
- **o2 What reset --soft and --hard change** - partly covered: a reset that "removes the commit but keeps your work in place", and "a hard reset, too, but that one will delete all your changes". The exact command on screen was not verified.
- **o3 Revert for shared commits, reset only for local history** - covered as the pushed or not-pushed rule.

## Cautions

- Very short; it gives the rule, not the model.
- Revert is shown in the GitHub web UI.

## Alternates (all verified live 2026-10-12)

- LearnThatStack (**not first-party**), [Git Reset vs Revert - Which One Should You Use?](https://www.youtube.com/watch?v=HuyPRodkME8), 199 s. The previous (legacy) pick. Captions cover soft, mixed and hard reset against branch, staging area and working directory, revert as a new opposite commit, and revert for shared history. Deeper fit for o2; small channel (4,649 views).
- Microsoft Visual Studio (first-party), [Recovering from mistakes while working with git in Visual Studio [Ep 4] | Intermediate Series](https://www.youtube.com/watch?v=tkJ1yIktteQ), 118 s. Transcript: amend, unstage, revert to before a bad commit, soft reset to move commits to the right branch; Visual Studio UI only.
- JetBrains (first-party), [How to Undo Commits in any JetBrains IDE](https://www.youtube.com/watch?v=_-3COzBp5qg), 201 s. Transcript: "Undo Commit" for an unpushed commit, greyed out for a pushed one; no revert.
- Philomatics (not first-party), [Undo a git commit - git reset/revert - pushed/not pushed](https://www.youtube.com/watch?v=GytsxgB4-HU), 207 s. Title states the pushed or not-pushed rule; transcript not fetched in this pass.

## Rejected

None beyond the alternates; every candidate checked fits the 7-minute budget.
