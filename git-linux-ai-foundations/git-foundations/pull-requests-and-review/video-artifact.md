---
title: How to create a pull request in 4 min | GitHub for Beginners
channel: GitHub
url: https://www.youtube.com/watch?v=nCKdihvneS0
runtimeMinutes: 3.7
embeddable: true
checkedAt: 2026-10-12
covers: []
  - o1: a pull request is a proposal to merge changes from one branch into another, reviewed and discussed before they are integrated (transcript, description, chapter 00:17)
  - o1: the base branch is the one you merge into and the compare branch holds your changes; the PR shows the diff between them (transcript)
  - o3 in part: ask a teammate to review, and merge into main once the PR has been reviewed; draft PRs for work not ready for review (transcript)
  - Demo of branch, commit, git push origin <branch> and GitHub's Compare & pull request button (transcript, chapter 00:59)
gaps: []
  - o2: answering a review comment by pushing a new commit to the same branch is not covered (transcript)
  - o3: passing checks and resolved comments as merge conditions are not covered; AI-made PRs are not covered (transcript)
cautions: []
  - First-party channel (GitHub, channel id UC7c3Kb6jYCRj4JOHHZTxKsQ)
  - Uses git checkout -b rather than git switch -c, and git push origin <branch> without -u
  - Fit was judged from captions (auto-generated and en-US tracks exist; the auto track was read), chapters and description; frames were not re-inspected in this pass
alternates: []
rejected: []
---

# Video companion: Pull requests and review comments

**Selected:** [How to create a pull request in 4 min | GitHub for Beginners](https://www.youtube.com/watch?v=nCKdihvneS0), GitHub (first-party), 224 s (3:44), checked live 2026-10-12.
Public oEmbed returned HTTP 200 and the player reported status OK.
This re-verifies the previous (legacy) pick.

## Fit against the topic objectives

How verified: caption transcript, the description's own chapters (00:00 intro, 00:17 definition, 00:42 where, 00:59 demo, 02:27 tips) and live player metadata.

- **o1 What a pull request asks** - covered: "a proposal to merge a set of changes from one branch into another", with base and compare branches.
- **o2 Answer a review comment with a new commit on the same branch** - not covered.
- **o3 What must happen before merging** - partly covered: review before merge, and the tip to review, build and test your own PR first.

## Cautions

- Older command spellings (`git checkout -b`); no `-u` on the first push.

## Alternates (all verified live 2026-10-12)

- GitHub (first-party), [How to merge a pull request | Introduction to GitHub](https://www.youtube.com/watch?v=FDXSgyDGmho), 203 s. Transcript: review, test locally and give feedback; merge "once all requested changes are resolved"; all conflicts must be resolved before merging; pushing a new commit to the same branch updates the PR. Better for o2 and o3, weaker for o1; it is the selection for the merge-conflicts topic.

## Rejected

- Visual Studio Code (first-party), [Pull Requests in VS Code](https://www.youtube.com/watch?v=LdSwWxVzUpo), 611 s: exceeds the 7-minute budget.
- GitHub (first-party), [How to close pull requests faster with Copilot code review | GitHub Checkout](https://www.youtube.com/watch?v=8hyvYP5PCks), 640 s: exceeds the 7-minute budget.

## Front-matter note

`alternates` and `rejected` are empty in the front matter because the repository's T01 front-matter parser reads list items only as strings while the schema requires objects. The records above are the authoritative list.
The full search is in `evidence/git-linux-ai-foundations/git-foundations/video-search.md`.
