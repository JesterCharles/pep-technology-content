---
title: Git: branches in Visual Studio Code
channel: Visual Studio Code
url: https://www.youtube.com/watch?v=b9LTz6joMf8
runtimeMinutes: 4.2
embeddable: true
checkedAt: 2026-10-12
covers: []
  - o2 in part: git branch <name> creates a branch and leaves you where you are, while git checkout -b <name> creates and switches (transcript, chapter 0:23)
  - o2 in part: switching with git switch <name> or git checkout <name> (transcript, chapter 1:55)
  - Listing branches with git branch (transcript, chapter 1:40)
gaps: []
  - o1: a branch as a movable name pointing at a commit, and HEAD, are not covered (transcript)
  - o3: which branch name moves when you commit is not covered (transcript)
  - git switch -c is not named; the VS Code UI runs git checkout to create and switch (transcript)
cautions: []
  - First-party channel (Visual Studio Code, channel id UCs5Y5_7XK8HLDX0SLNwkd3w)
  - Driven through the VS Code command palette and status bar; commands are shown in the Git output log rather than typed
  - Renaming (git branch -m) and deleting (git branch -d) go beyond the page
  - Fit was judged from captions (auto-generated and en-US tracks exist; the auto track was read), chapters and description; frames were not inspected
alternates: []
rejected: []
---

# Video companion: Branches and switching between them

**Selected:** [Git: branches in Visual Studio Code](https://www.youtube.com/watch?v=b9LTz6joMf8), Visual Studio Code (first-party), 254 s (4:14), checked live 2026-10-12.
Public oEmbed returned HTTP 200 and the player reported status OK.

## Fit against the topic objectives

How verified: caption transcript, the description's own chapters (0:23 create, 1:40 list, 1:55 switch, 2:54 rename, 3:19 delete) and live player metadata.

- **o1 Branch as a movable name; HEAD as the branch you are on** - not covered.
- **o2 Create and switch with git switch -c and git switch** - partly covered. It contrasts `git branch <name>` (create, stay) with `git checkout -b` (create and switch) and names `git switch <name>` and `git checkout <name>` for switching, pointing to the official Git docs for their history. `git switch -c` itself is not named.
- **o3 Predict which branch moves on commit** - not covered.

## Cautions

- An editor walkthrough: VS Code ran `git checkout` behind its "Create Branch" action.
- Rename and delete sections are extra to the page.

## Alternates (all verified live 2026-10-12)

- ServiceNow Dev Program (**not a first-party Git-tool channel**), [Git branches: create, switch, and when to use](https://www.youtube.com/watch?v=kJDqrOLVF2k), 158 s. The previous (legacy) pick. Its captions give the best conceptual fit: "a branch is a label that tracks which commit you're on and moves forward with you as you commit", and `git switch -c`. It is aimed at ServiceNow SDK and Claude Code users and has 368 views.
- GitHub (first-party), [How to switch branches and commit changes in git](https://www.youtube.com/watch?v=usaNdfT1hP8), 70 s. Transcript: `git switch main`, `git switch update-name`, then add and commit. A short clip from a longer series.
- GitHub (first-party), [How to use git branches for beginners](https://www.youtube.com/watch?v=3Fh1A3KGk-I), 44 s. Transcript: `git checkout -b` and `git branch`; describes a branch as "like creating a copy of a document", which conflicts with the pointer model.

## Rejected

- GitLab (first-party), [GitInGifs: Git Branches](https://www.youtube.com/watch?v=Q5OaMTd7PwM), 215 s. Transcript calls a branch "a version of a project's working tree" that is "completely detached from the main branch", which conflicts with the page's pointer model, and shows no commands.

## Front-matter note

`alternates` and `rejected` are empty in the front matter because the repository's T01 front-matter parser reads list items only as strings while the schema requires objects. The records above are the authoritative list.
The full search is in `evidence/git-linux-ai-foundations/git-foundations/video-search.md`.
