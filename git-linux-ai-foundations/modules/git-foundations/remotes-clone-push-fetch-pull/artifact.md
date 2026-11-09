# Remotes: SSH keys, clone, push, fetch vs pull

## Objectives

- Explain which half of an SSH key pair you share and which you never share
- Tell your local main apart from the remote-tracking ref origin/main
- Predict what clone, fetch, pull and push change on each side

## Teaching

### Start with a guess

Your team shares one copy of the repository on GitHub. The model shows your computer on the left and GitHub on the right; the dashed `origin/main` label is your computer's note of GitHub's `main`.

### Prove who you are, then clone

A remote is another copy of the repository, usually on GitHub, named `origin`.

Over SSH you prove who you are with a key pair. `id_ed25519` is the private key: it never leaves your computer. `id_ed25519.pub` is the public key: you paste it into GitHub's SSH keys settings.

`git clone git@github.com:pep/shop.git` then copies the whole history and sets up `origin`.

### fetch, pull and push

Your clone has your own `main` plus `origin/main`, a note of where GitHub's `main` was when you last talked to it.

- `git fetch` downloads new commits and moves only `origin/main`.
- `git pull` fetches, then moves your branch forward to match. With no pull setting configured, it stops if both sides gained new commits. Options or configuration can choose a different integration strategy; `git pull --no-rebase` merges instead.
- `git push` uploads your commits and moves GitHub's `main`, but only if your branch already contains everything GitHub has.

### Apply it to a rejected push

Same rule: push only adds to GitHub's history; it never drops a teammate's commit.

## Model

Practice repository Simulation: no real Git runs

### Your computer local repository

1. C2 Add cart HEAD → main origin/main
2. C1 Start shop

### GitHub (origin) remote repository

1. C3 Sam: add search main
2. C2 Add cart
3. C1 Start shop

GitHub SSH keys: id_ed25519.pub (public)

## Recap

- Share only the public key (`.pub`); the private key never leaves your computer.
- `git clone` copies the history and sets up `origin`.
- `git fetch` moves `origin/main` only; `git pull` also updates your branch, and stops if both sides changed unless a pull strategy is configured.
- `git push` is accepted only when your branch already contains everything on GitHub.

Next topic: Merge conflicts

## Cheat sheet

|  |  |
| --- | --- |
| `git clone <url>` | copy a remote repository |
| `git fetch` | download; update origin/main only |
| `git pull` | fetch, then fast-forward your branch |
| `git pull --no-rebase` | fetch and merge when both sides changed |
| `git push` | upload your commits |
| `~/.ssh/id_ed25519.pub` | public key: safe to paste into GitHub |

## Sources

Teaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28), and GitHub Docs (the pages show no version or update date). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings.

- GitHub: generating a new SSH key
- GitHub: adding a new SSH key to your account
- GitHub: Error: Permission denied (publickey)
- git-clone: description
- git-fetch: description
- git-pull: description and merge options (--ff-only default)
- git-push: note about fast-forwards

## Static interaction alternatives

### predict

Prediction (not scored). Sam pushed a new commit to GitHub. You run git fetch. What changes on your computer? Options: origin/main moves to Sam's commit; your main and files stay; Your main and files update to Sam's commit; Nothing until you push; GitHub receives your commits. Answer: origin/main moves to Sam's commit; your main and files stay. origin/main moves to Sam's commit; your main and files stay: git fetch downloads commits and updates origin/main only. Your branch and files do not change. Your main and files update to Sam's commit: Attractive, but updating your branch is what git pull adds after fetching. Nothing until you push: Fetch does download: you get Sam's commit and an updated origin/main. GitHub receives your commits: Fetch only downloads. Uploading is git push.

### terminal

Practice terminal (simulated; nothing runs on your computer). Task: Your key pair already exists in ~/.ssh. Let GitHub recognise you, then clone the shop. Goals: GitHub has your public key; the private key stays private; Clone the repository. One sequence that meets every goal: Paste id_ed25519.pub into GitHub SSH keys, then git clone git@github.com:pep/shop.git.

### terminal

Practice terminal (simulated; nothing runs on your computer). Task: Sam pushed C3. Look at it first, take it into your main, then share a commit of your own. Goals: Download C3 without changing your main; Bring C3 into your main; Commit and push a change of your own. One sequence that meets every goal: git fetch, then git pull, then git commit -m "Add footer", then git push.

### mcq

Check (one retry, then the answer is shown). Your main is at C5. GitHub's main has C6 from a teammate. You commit C7 on C5 and run git push. What happens? Options: Rejected: bring in C6 first, then push; Accepted; C7 replaces C6; GitHub merges C6 and C7 for you; C7 goes onto a new branch next to C6. Answer: Rejected: bring in C6 first, then push. Rejected: bring in C6 first, then push: Right: GitHub's main has C6, which your branch lacks, so Git rejects the push until you integrate it. Accepted; C7 replaces C6: A normal push never discards someone else's commit. GitHub merges C6 and C7 for you: GitHub does not merge on push; you integrate C6 locally first. C7 goes onto a new branch next to C6: Push updates the branch you name; it does not invent a new branch. Retry question: The model shows your C7 and GitHub's C6, both built on C5. Which steps get C7 onto GitHub safely? Options: git pull --no-rebase, then git push; git push again; git fetch only; git clone again. Answer: git pull --no-rebase, then git push. git pull --no-rebase, then git push: Right: both sides have new commits, so with no pull setting configured, plain git pull stops; --no-rebase merges C6 in, and then push is accepted. git push again: Nothing changed, so it is rejected again. git fetch only: Fetch shows you C6 but leaves your main without it, and nothing is uploaded. git clone again: A fresh clone would not contain your C7 at all.
