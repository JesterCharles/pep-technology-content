---
title: "GitInGifs Working Directory & Staging Area"
channel: "GitLab"
url: https://www.youtube.com/watch?v=ddo6dL3eVe8
runtimeMinutes: 3
embeddable: true
checkedAt: 2026-10-12
covers:
  - "o1 where a change lives: the working directory as the folder where you edit, the staging area filled with git add, and a commit as a saved snapshot in the local repository (transcript)"
  - "o2 in part: git status lists changes, git add can stage all changed files or only some, and staged files appear under \"Changes to be committed\" (transcript)"
gaps:
  - "o2: git diff versus git diff --staged is not covered (transcript)"
  - "o3: .gitignore and keeping a secrets file out of Git are not covered (transcript)"
  - "Unstaging with git restore --staged is not covered (transcript)"
cautions:
  - "First-party channel (GitLab), verified on the official GitLab channel id UCnMGQ8QHMAnVIsI3xJrihhg"
  - "Gif and meme presentation; goes on to git push and the remote repository, which topic 5 teaches"
  - "Low audience (605 views at check time); the description ends with a sales contact link"
  - "Fit was judged from YouTube's auto-generated English captions and the description; frames were not re-inspected in this pass"
alternates:
  - title: "Git basics: status and add commands"
    url: https://www.youtube.com/watch?v=zztkA8cJaCs
  - title: "What is a .gitignore file and why do you need it?"
    url: https://www.youtube.com/watch?v=0qdRS3xYwIY
  - title: "git diff --staged Will Diff Files You've Staged vs What's Commit"
    url: https://www.youtube.com/watch?v=qAgkFa5VsCc
rejected:
  - title: "Git: Commits in Visual Studio Code"
    url: https://www.youtube.com/watch?v=E6ADS2k8oNQ
    reason: "505 s. Within budget, but the transcript shows it is a tour of VS Code buttons for add, unstage, amend, undo, stash and clean; it has no staging-area model, no diff and no .gitignore."
---

# Video companion: Commits, diffs and .gitignore

**Selected:** [GitInGifs Working Directory & Staging Area](https://www.youtube.com/watch?v=ddo6dL3eVe8), GitLab (first-party), 181 s (3:01), checked live 2026-10-12.
Public oEmbed returned HTTP 200 and the player reported status OK.

## Fit against the topic objectives

How verified: full auto-generated English caption track, video description and live player metadata.

- **o1 Say where a change lives** - covered. The narration walks from the working directory ("just the folder on your computer where your code lives") through `git add` into the staging area, then `git commit` saving a snapshot to the local repository.
- **o2 Stage only what you mean to; git diff vs git diff --staged** - partly covered. It says `git add` can stage all or only some changed files and that `git status` shows them under "Changes to be committed". `git diff` and `git diff --staged` are not covered.
- **o3 Keep a secrets file out of Git with .gitignore** - not covered.

## Cautions

- Gif and meme style; the second half moves on to `git push` and remote repositories (topic 5).
- 605 views at check time, despite being GitLab's official channel.

## Alternates (all verified live 2026-10-12)

- GitHub (first-party), [Git basics: status and add commands](https://www.youtube.com/watch?v=zztkA8cJaCs), 100 s. Transcript: `git status`, untracked files, `git add .` versus `git add <file>`, re-adding after further edits. No commit model, no diff, no .gitignore.
- GitHub (first-party), [What is a .gitignore file and why do you need it?](https://www.youtube.com/watch?v=0qdRS3xYwIY), 57 s. Transcript: ignoring files Git should not track, using macOS `.DS_Store` as the example and a third-party template site. Does not mention secrets or `.env`.
- Nick Janetakis (not first-party), [git diff --staged Will Diff Files You've Staged vs What's Commit](https://www.youtube.com/watch?v=qAgkFa5VsCc), 187 s. Title and legacy chapter check point at the `--staged` distinction; its transcript was not fetched in this pass.

## Rejected

- Visual Studio Code (first-party), [Git: Commits in Visual Studio Code](https://www.youtube.com/watch?v=E6ADS2k8oNQ), 505 s. Within budget, but the transcript shows it is a tour of VS Code buttons for add, unstage, amend, undo, stash and clean; it has no staging-area model, no diff and no .gitignore.
