---
title: "Branches: Merging, Rebasing, and Squashing in Visual Studio and GitHub [Ep 2] | Advanced Series"
channel: "Microsoft Visual Studio"
url: https://www.youtube.com/watch?v=8Hg9rNRVw7I
runtimeMinutes: 2.1
embeddable: true
checkedAt: 2026-10-12
covers:
  - "o1 in part: merging gives the primary branch a new merge commit and keeps the other branch's history as a detour in the graph (transcript)"
  - "o2: rebasing replays every commit of the secondary branch on top of the primary branch, giving a linear graph (transcript)"
  - "Merge and rebase add the same changes; they differ in how commits are connected (transcript)"
gaps:
  - "o1: a fast-forward merge that only moves the branch pointer is not covered (transcript)"
  - "o2: that replayed commits are new commits with new IDs is not stated outright (transcript)"
  - "o3: the rule not to rebase commits other people already have is not covered (transcript)"
cautions:
  - "First-party channel (Microsoft Visual Studio, channel id UChqrDOwARrxdJF-ykAptc7w)"
  - "Visual Studio context menus and GitHub pull-request merge options; squashing goes beyond the page"
  - "Fit was judged from the auto-generated caption track and the description; frames were not inspected"
alternates:
  - title: "Git Tutorial: Rebasing & Merging"
    url: https://www.youtube.com/watch?v=a_msiOrYLgM
  - title: "Git merge vs rebase: what is the difference?"
    url: https://www.youtube.com/watch?v=k32vCDCa5kw
  - title: "Git Rebase in any JetBrains IDE"
    url: https://www.youtube.com/watch?v=wiU3TL3jM8I
  - title: "Git Merge vs. Rebase: Which One Should You Use?"
    url: https://www.youtube.com/watch?v=x7oSRtTtoc8
rejected:
  - title: "How and when do I merge or rebase?"
    url: https://www.youtube.com/watch?v=Nftif2ynvdA
    reason: "938 s: exceeds the 6-minute budget."
---

# Video companion: Merge vs rebase

**Selected:** [Branches: Merging, Rebasing, and Squashing in Visual Studio and GitHub [Ep 2] | Advanced Series](https://www.youtube.com/watch?v=8Hg9rNRVw7I), Microsoft Visual Studio (first-party), 126 s (2:06), checked live 2026-10-12.
Public oEmbed returned HTTP 200 and the player reported status OK.

## Fit against the topic objectives

How verified: caption transcript, video description and live player metadata.

- **o1 Merge commit versus fast-forward** - partly covered: "when merging your primary branch will get a new merge commit". Fast-forward is not covered.
- **o2 Rebase replays your commits on a new base** - covered: "every commit in your secondary branch gets replayed on top of your primary branch".
- **o3 Do not rebase commits other people already have** - not covered.

## Cautions

- The last third covers squashing and GitHub's pull-request merge settings, beyond the page.

## Alternates (all verified live 2026-10-12)

- GitKraken (Git client vendor; not a Git-host or editor first party), [Git Tutorial: Rebasing & Merging](https://www.youtube.com/watch?v=a_msiOrYLgM), 243 s. Captions state that rebased commits become brand-new commits and warn about rewriting history and force pushes, which is closest to o3; but it describes a merge as merging "all these changes into one commit", which is imprecise. Recorded 2016.
- GitHub (first-party), [Git merge vs rebase: what is the difference?](https://www.youtube.com/watch?v=k32vCDCa5kw), 46 s. Transcript: merge preserves full history, rebase is for cleaning up your personal branch; no new-commit or shared-commit rule.
- JetBrains (first-party), [Git Rebase in any JetBrains IDE](https://www.youtube.com/watch?v=wiU3TL3jM8I), 148 s. Transcript: rebasing a feature branch onto an updated main in the IDE.
- Josef Bender (**not first-party**), [Git Merge vs. Rebase: Which One Should You Use?](https://www.youtube.com/watch?v=x7oSRtTtoc8), 186 s. The previous (legacy) pick; small channel (865 views).

## Rejected

- JetBrains (first-party), [How and when do I merge or rebase?](https://www.youtube.com/watch?v=Nftif2ynvdA), 938 s: exceeds the 6-minute budget.
