# Commits, diffs and .gitignore

## Objectives

- Say where a change lives: working copy, staging area or a commit
- Stage and commit only the change you mean to, and tell git diff from git diff --staged
- Keep a secrets file out of Git with .gitignore

## Teaching

### Start with a guess

Git keeps your project in three places, shown in the model: your working copy (the files you edit), a staging area and the commits in history. You will learn what each one means next.

### Three places a change can live

- Working copy: the files on disk that you edit.
- Staging area (also called the index): the snapshot you are preparing for the next commit. git add app.js copies the file into it.
- Commit: a saved snapshot in history, made from the staging area by git commit -m "message".

git status lists which files differ where. git diff compares working copy with staging; git diff --staged compares staging with the last commit, so it shows exactly what the next commit will hold.

### Keep secrets out with .gitignore

.env holds settings such as keys. It must never be committed, but it keeps showing as untracked, and git add . would stage it.

A .gitignore file lists name patterns Git should not track. A matching untracked file disappears from git status, and git add . skips it. .gitignore does not unstage or untrack a file Git already has. Commit .gitignore itself so your whole team shares the rule.

### Apply it to a new file

Same three places, new situation. Use the model: the staging area is a snapshot taken when you run git add.

## Model

Practice repositorySimulation: no real Git runs

### Working copyfiles you edit

- app.jsmodified

### Staging areanext commit

- nothing staged

### Commitshistory, newest first

- C1 Start shopapp.js, notes.txt

## Recap

- A change starts in the working copy; git add copies it into the staging area; git commit saves the staged snapshot to history.
- git diff shows unstaged changes; git diff --staged shows what the next commit will hold.
- Stage files by name for a focused commit. git add . stages everything that is not ignored, secrets included.
- .gitignore keeps untracked files such as .env out. Commit .gitignore itself.

Next topic: Branches and switching between them

## Cheat sheet

|  |  |
| --- | --- |
| git status | which files differ in working copy, staging and last commit |
| git add <file> | copy a file into the staging area |
| git restore --staged <file> | take a file back out of staging |
| git diff / git diff --staged | unstaged changes / what the next commit holds |
| git commit -m "message" | save the staging area as a commit |
| .gitignore | name patterns Git should not track |

## Sources

Teaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings.

- git-add: description
- git-diff: description
- git-commit: description
- gitignore: description
- git-restore: options

## Static interaction alternatives

### predict

Prediction (not scored). You saved an edit to app.js. You run git commit -m "Fix total" without anything else first. What happens? Options: Nothing is committed; Git says no changes were added; The app.js edit is committed; Every changed file is committed; Git discards the unsaved edit. Answer: Nothing is committed; Git says no changes were added. Nothing is committed; Git says no changes were added: A commit records only what is in the staging area, and nothing was staged yet. Git prints no changes added to commit. The app.js edit is committed: Attractive, because you did save the file. But saving changes only the working copy; Git commits what you staged with git add. Every changed file is committed: Git never commits all changes on its own; you choose files with git add. (git commit -a exists but is not used here.) Git discards the unsaved edit: Git does not delete working-copy changes when a commit has nothing to record. Your edit stays in the working copy.

### terminal

Practice terminal (simulated; nothing runs on your computer). Task: Make a focused commit of the cart fix only. Your notes and the .env secrets file must not go in. Goals: Stage only app.js; Check it with git diff --staged before committing; Commit it; notes.txt stays changed in the working copy. One sequence that meets every goal: git add app.js, then git diff --staged, then git commit -m "Fix cart total".

### terminal

Practice terminal (simulated; nothing runs on your computer). Task: Ignore .env, then commit the updated .gitignore on its own. Goals: .env no longer shows as untracked; Commit .gitignore on its own. One sequence that meets every goal: echo ".env" >> .gitignore, then git add .gitignore, then git commit -m "Ignore .env".

### mcq

Check (one retry, then the answer is shown). You run git add config.js, then edit config.js again and save. Then you run git commit -m "Update config". What does the new commit hold? Options: config.js as it was when you ran git add; config.js with your latest edit; Both versions of config.js; Nothing; Git refuses because the file changed. Answer: config.js as it was when you ran git add. config.js as it was when you ran git add: Right: git add copied that version into the staging area, and a commit records the staging area. The later edit stays in the working copy. config.js with your latest edit: A commit records the staging area, not the working copy. The newer edit was never staged. Both versions of config.js: A commit holds one version of each file: the staged one. Nothing; Git refuses because the file changed: Git commits the staged version without complaint. git status would list config.js as both staged and not staged. Retry question: Staging holds style.css version 2, the working copy holds version 3 and the last commit holds version 1. You run git commit. What happens? Options: The commit holds version 2; git status still shows style.css modified; The commit holds version 3; nothing left to commit; The commit holds version 2; nothing left to commit; The commit is empty because version 1 is already saved. Answer: The commit holds version 2; git status still shows style.css modified. The commit holds version 2; git status still shows style.css modified: Right: the commit copies the staging area (version 2). Version 3 in the working copy still differs, so it shows as modified, not staged. The commit holds version 3; nothing left to commit: The working copy is not committed directly; only staged content is. The commit holds version 2; nothing left to commit: Half right. Version 3 still differs from the new commit, so git status reports it as modified. The commit is empty because version 1 is already saved: Staging differs from the last commit, so there is something to record: version 2.
