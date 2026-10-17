# Branches and switching between them

## Objectives

- Describe a branch as a movable name that points at a commit, and HEAD as the branch you are on
- Create and switch branches with git switch -c and git switch
- Predict which branch name moves when you commit

## Teaching

### Start with a guess

A branch lets you build something without disturbing `main`. The model shows history as commits, newest at the top, with labels for branch names.

### A branch is a movable name

A branch is a name that points at one commit. HEAD marks the branch you are on.

When you commit, the new commit's parent is the commit you were on, and only the branch HEAD is on moves forward. Other branch names stay put.

- `git branch login` creates `login` here but leaves you where you are.
- `git switch login` moves HEAD to an existing branch.
- `git switch -c login` creates it and switches in one step.

Switching also swaps your working-copy files to match that branch.

### Apply it to a new branch

Same rule, new names: a commit moves only the branch HEAD is on.

## Model

Practice repository Simulation: no real Git runs

1. C2 Add cart HEAD → main
2. C1 Start shop

HEAD is on main. Working copy files: app.js, cart.js

## Recap

- A branch is a movable name that points at one commit; HEAD marks the branch you are on.
- A commit moves only the branch HEAD is on. Other branches stay where they were.
- `git branch name` creates; `git switch name` moves HEAD; `git switch -c name` does both.
- Switching changes your working-copy files to match the branch you switch to.

Next topic: Undoing mistakes: revert and reset

## Cheat sheet

|  |  |
| --- | --- |
| `git branch` | list branches; * marks the one you are on |
| `git branch <name>` | create a branch here, stay where you are |
| `git switch <name>` | move HEAD to an existing branch |
| `git switch -c <name>` | create a branch and switch to it |

## Sources

Teaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings.

- git-branch: description
- git-switch: description
- git-commit: description

## Static interaction alternatives

### predict

Prediction (not scored). You are on main at commit C2. You run git branch login. Which branch are you on now? Options: Still main; login; Both main and login; No branch at all. Answer: Still main. Still main: git branch login only creates the name login at C2. It does not move you; HEAD stays on main. login: Attractive, but creating a branch and switching to it are separate steps. git switch login would move you. Both main and login: HEAD points at one branch at a time. No branch at all: Creating a branch never detaches you; you stay on main.

### terminal

Practice terminal (simulated; nothing runs on your computer). Task: Build the login form on its own branch, keeping main where it is. Goals: Create branch login at C2 and be on it; Commit on login while main stays at C2; Switch back to main. One sequence that meets every goal: git switch -c login, then git commit -m "Add login form", then git switch main.

### mcq

Check (one retry, then the answer is shown). You are on main at C4. You run git switch -c fix, then git commit -m "Fix tax", making C5. Which names point at C5? Options: fix only; main only; Both main and fix; Neither; the commit has no branch. Answer: fix only. fix only: Right: git switch -c fix put HEAD on fix, so the commit moved only fix to C5. main stays at C4. main only: main would move only if HEAD were on main. After git switch -c fix, it is on fix. Both main and fix: A commit moves one branch name: the one HEAD is on. Neither; the commit has no branch: HEAD is on fix, so the new commit is on fix. Retry question: In the model, HEAD is on feature at C7 and main is at C6. You run git commit, making C8. What moves? Options: feature moves to C8; main stays at C6; main moves to C8; Both move to C8; HEAD leaves feature and points at C8 alone. Answer: feature moves to C8; main stays at C6. feature moves to C8; main stays at C6: Right: HEAD is on feature, so only feature moves. main moves to C8: main is not the branch HEAD is on, so it does not move. Both move to C8: Only the current branch moves when you commit. HEAD leaves feature and points at C8 alone: HEAD stays attached to feature, and feature itself moves to C8.
