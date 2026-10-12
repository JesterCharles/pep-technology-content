---
title: How to merge a pull request | Introduction to GitHub
channel: GitHub
url: https://www.youtube.com/watch?v=FDXSgyDGmho
runtimeMinutes: 3.4
embeddable: true
checkedAt: 2026-10-12
covers: []
  - o1: a merge conflict occurs when changes are made to the same part of the same file on two different branches (transcript)
  - o2 in part: a terminal git merge main stops with a message and the file shows conflict markers (transcript)
  - o3: pick the final text, then git add, git commit -m "resolve merge conflict", git status and git push, after which the pull request shows no conflict (transcript)
gaps: []
  - o2: the <<<<<<<, ======= and >>>>>>> markers are not named or read side by side in the narration (transcript)
  - The final text is chosen with the editor's "Accept Current Change" action rather than by hand-editing and deleting markers (transcript)
  - git merge --abort is not covered (transcript)
cautions: []
  - First-party channel (GitHub, channel id UC7c3Kb6jYCRj4JOHHZTxKsQ)
  - Framed as merging a pull request; the first 40 seconds recap pull requests and review (topic 8)
  - Fit was judged from captions (auto-generated and en-US tracks exist; the auto track was read) and live metadata; frames were not inspected
alternates: []
rejected: []
---

# Video companion: Merge conflicts

**Selected:** [How to merge a pull request | Introduction to GitHub](https://www.youtube.com/watch?v=FDXSgyDGmho), GitHub (first-party), 203 s (3:23), checked live 2026-10-12.
Public oEmbed returned HTTP 200 and the player reported status OK.

## Fit against the topic objectives

How verified: caption transcript and live player metadata.

- **o1 Why Git stops a merge** - covered: "a merge conflict occurs when changes are made to the same part of the same file on two different branches".
- **o2 Read the markers and name each side** - partly covered: after `git merge main`, "you will get a message like this that shows you some conflict markers". The markers are on screen but not explained by name in the narration.
- **o3 Resolve: final text, remove markers, git add, commit** - covered: choose the change, `git add .`, `git commit -m`, `git status`, then push.

## Cautions

- Resolution uses an editor button; the page teaches editing the file by hand.
- Also shows `git switch main` and `git pull origin main` before the merge.

## Alternates (all verified live 2026-10-12)

- Udacity (**not first-party**), [Resolving Merge Conflicts - How to Use Git and GitHub](https://www.youtube.com/watch?v=iRyUUGsNHrU), 195 s. The previous (legacy) pick. Captions explain the marker sections (HEAD is "my code", the other branch below) and rewriting the final version with all marker lines removed; it uses a diff3 style with a common-ancestor section and 2015-era `checkout`/`master`.
- JetBrains (first-party), [Resolving Git Merge Conflicts: The Easy Way](https://www.youtube.com/watch?v=mSfq1SoMocg), 172 s. Transcript and description: why Git cannot pick a side, then the IDE's three-pane merge tool.
- Microsoft Visual Studio (first-party), [Handling Merge Conflicts in Visual Studio [Ep 3] | Intermediate Series](https://www.youtube.com/watch?v=FTT9pHMvRT8), 126 s. Transcript: conflict while merging a collaborator's branch, Visual Studio merge editor, then commit and push.
- Visual Studio Code (first-party), [Source Control Tip 9: Dealing with Merge Conflicts in VS Code](https://www.youtube.com/watch?v=ybCxPHzRJfA), 53 s. No captions; by its description it shows VS Code highlighting current and incoming changes.

## Rejected

- Visual Studio Code (first-party), [The EXTREMELY helpful guide to merge conflicts](https://www.youtube.com/watch?v=HosPml1qkrg), 501 s: exceeds the 6-minute budget.
- Microsoft Visual Studio (first-party), [Resolving merge conflicts (4 of 5) | Getting started with GitHub](https://www.youtube.com/watch?v=XrXBDSxUvNE), 407 s: exceeds the 6-minute budget, and its conflict arises from a rejected push rather than a branch merge.

## Front-matter note

`alternates` and `rejected` are empty in the front matter because the repository's T01 front-matter parser reads list items only as strings while the schema requires objects. The records above are the authoritative list.
The full search is in `evidence/git-linux-ai-foundations/git-foundations/video-search.md`.
