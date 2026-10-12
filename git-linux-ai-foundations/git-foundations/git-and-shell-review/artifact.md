# Review: Git and the shell

## Objectives

- Retrieve where a change lives and which command moves it
- Choose the commands that take one change from the repository folder to a pushed branch
- Connect shell navigation to working inside a repository

## Teaching

Warm up: recall first

This topic is review: nothing new. You practise one change from the shell to GitHub; the recap lists the module's other ideas for reference. Recall before you look anything up.

## Model

Practice repository
Simulation: no real Git runs

Shell location: /home/ana/projects/shop

Working copy
shop
clean
Staging area
next commit
receipt.js
staged
Commits
HEAD on main
C7 Add receipt (main)
GitHub
branches
main
C7

## Recap

Module recapChanges move working copy → staging (git add) → commit; .gitignore keeps secrets out.Branches are movable names; commit moves the one HEAD is on. Stash sets work aside.Revert what is pushed; reset only local commits. Fetch looks, pull merges, push shares.Resolve conflicts by editing out markers; merge shared work; land changes through reviewed pull requests.Cheat sheetcd ~/projects/shopgo to the repository foldergit switch -c <name>new branch, changes come alonggit add / git commitstage, then savegit push -u origin <name>first push of a new branchSources and review dateTeaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings. Shell error wording follows GNU Bash and could not be checked: the GNU manual site did not respond.git-switch: descriptiongit-add: descriptiongit-push: options (--set-upstream)Next: back to the course page for Linux and AI Foundations.

## Cheat sheet

Cheat sheetcd ~/projects/shopgo to the repository foldergit switch -c <name>new branch, changes come alonggit add / git commitstage, then savegit push -u origin <name>first push of a new branch

Sources and review dateTeaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings. Shell error wording follows GNU Bash and could not be checked: the GNU manual site did not respond.git-switch: descriptiongit-add: descriptiongit-push: options (--set-upstream)

## Sources

Sources and review dateTeaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings. Shell error wording follows GNU Bash and could not be checked: the GNU manual site did not respond.git-switch: descriptiongit-add: descriptiongit-push: options (--set-upstream)

## Static interaction alternatives

### predict

Prediction (not scored). Which command shows exactly what your next commit will contain? Options: git diff --staged; git diff; git status; git log. Answer: git diff --staged. git diff --staged: It compares the staging area with the last commit, which is precisely the next commit. git diff: Plain git diff shows changes you have not staged, so they are not in the next commit. git status: Status names the staged files but does not show their content. git log: Log lists commits already made, not the next one.

### terminal

Practice terminal (simulated; nothing runs on your computer). Task: You are in /home/ana and already edited receipt.js in the shop repository. Ship the fix on its own branch. Goals: Move into the repository folder; Commit the fix on a new branch fix/receipt; Publish the branch with the fix to GitHub. One sequence that meets every goal: cd projects/shop, then git switch -c fix/receipt, then git add receipt.js, then git commit -m "Fix receipt", then git push -u origin fix/receipt.

### mcq

Check (one retry, then the answer is shown). You are in /home/ana and run git status. Git prints fatal: not a git repository. What is wrong? Options: You are not inside the repository folder; cd into it first; Git is not installed; The repository is broken; Run git init in /home/ana. Answer: You are not inside the repository folder; cd into it first. You are not inside the repository folder; cd into it first: Right: Git looks for .git in the current folder and its parents. /home/ana has none. Git is not installed: An uninstalled Git would print "command not found", not a Git error. The repository is broken: The repository is fine; Git simply cannot see it from here. Run git init in /home/ana: That would create a new, empty repository in your home folder, not fix anything. Retry question: The model shows you are in /home/ana/notes and the shop repository is /home/ana/projects/shop. Which command puts you where Git commands work for the shop? Options: cd ~/projects/shop; cd shop; git init; ls -a. Answer: cd ~/projects/shop. cd ~/projects/shop: Right: ~ is /home/ana, so this reaches the folder that holds .git from anywhere. cd shop: From /home/ana/notes there is no shop folder, so cd fails and you stay put. git init: It would make a new repository in notes, not open the shop. ls -a: It lists the current folder but does not move you.
