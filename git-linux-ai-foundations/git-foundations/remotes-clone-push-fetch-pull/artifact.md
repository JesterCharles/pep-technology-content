# Remotes: SSH keys, clone, push, fetch vs pull

## Objectives

- Explain which half of an SSH key pair you share and which you never share
- Tell your local main apart from the remote-tracking ref origin/main
- Predict what clone, fetch, pull and push change on each side

## Teaching

Start with a guess

Your team shares one copy of the repository on GitHub. The model shows your computer on the left and GitHub on the right; the dashed origin/main label is your computer's note of GitHub's main.

## Model

Practice repository
Simulation: no real Git runs
Your computer
local repository
C2
Add cart
HEAD → main
origin/main
C1
Start shop
GitHub (origin)
remote repository
C3
Sam: add search
main
C2
Add cart
C1
Start shop

GitHub SSH keys: id_ed25519.pub (public)

## Recap

RecapShare only the public key (.pub); the private key never leaves your computer.git clone copies the history and sets up origin.git fetch moves origin/main only; git pull also updates your branch, and stops if both sides changed unless a pull strategy is configured.git push is accepted only when your branch already contains everything on GitHub.Cheat sheetgit clone <url>copy a remote repositorygit fetchdownload; update origin/main onlygit pullfetch, then fast-forward your branchgit pull --no-rebasefetch and merge when both sides changedgit pushupload your commits~/.ssh/id_ed25519.pubpublic key: safe to paste into GitHubSources and review dateTeaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28), and GitHub Docs (the pages show no version or update date). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings.GitHub: generating a new SSH keyGitHub: adding a new SSH key to your accountGitHub: Error: Permission denied (publickey)git-clone: descriptiongit-fetch: descriptiongit-pull: description and merge options (--ff-only default)git-push: note about fast-forwardsNext topic: Merge conflicts

## Cheat sheet

Cheat sheetgit clone <url>copy a remote repositorygit fetchdownload; update origin/main onlygit pullfetch, then fast-forward your branchgit pull --no-rebasefetch and merge when both sides changedgit pushupload your commits~/.ssh/id_ed25519.pubpublic key: safe to paste into GitHub

Sources and review dateTeaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28), and GitHub Docs (the pages show no version or update date). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings.GitHub: generating a new SSH keyGitHub: adding a new SSH key to your accountGitHub: Error: Permission denied (publickey)git-clone: descriptiongit-fetch: descriptiongit-pull: description and merge options (--ff-only default)git-push: note about fast-forwards

## Sources

Sources and review dateTeaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28), and GitHub Docs (the pages show no version or update date). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings.GitHub: generating a new SSH keyGitHub: adding a new SSH key to your accountGitHub: Error: Permission denied (publickey)git-clone: descriptiongit-fetch: descriptiongit-pull: description and merge options (--ff-only default)git-push: note about fast-forwards

## Static interaction alternatives

### predict

Prediction (not scored). Sam pushed a new commit to GitHub. You run git fetch. What changes on your computer? Options: origin/main moves to Sam's commit; your main and files stay; Your main and files update to Sam's commit; Nothing until you push; GitHub receives your commits. Answer: origin/main moves to Sam's commit; your main and files stay. origin/main moves to Sam's commit; your main and files stay: git fetch downloads commits and updates origin/main only. Your branch and files do not change. Your main and files update to Sam's commit: Attractive, but updating your branch is what git pull adds after fetching. Nothing until you push: Fetch does download: you get Sam's commit and an updated origin/main. GitHub receives your commits: Fetch only downloads. Uploading is git push.

### terminal

Practice terminal (simulated; nothing runs on your computer). Task: Your key pair already exists in ~/.ssh. Let GitHub recognise you, then clone the shop. Goals: GitHub has your public key; the private key stays private; Clone the repository. One sequence that meets every goal: Paste id_ed25519.pub into GitHub SSH keys, then git clone git@github.com:pep/shop.git.

### terminal

Practice terminal (simulated; nothing runs on your computer). Task: Sam pushed C3. Look at it first, take it into your main, then share a commit of your own. Goals: Download C3 without changing your main; Bring C3 into your main; Commit and push a change of your own. One sequence that meets every goal: git fetch, then git pull, then git commit -m "Add footer", then git push.

### mcq

Check (one retry, then the answer is shown). Your main is at C5. GitHub's main has C6 from a teammate. You commit C7 on C5 and run git push. What happens? Options: Rejected: bring in C6 first, then push; Accepted; C7 replaces C6; GitHub merges C6 and C7 for you; C7 goes onto a new branch next to C6. Answer: Rejected: bring in C6 first, then push. Rejected: bring in C6 first, then push: Right: GitHub's main has C6, which your branch lacks, so Git rejects the push until you integrate it. Accepted; C7 replaces C6: A normal push never discards someone else's commit. GitHub merges C6 and C7 for you: GitHub does not merge on push; you integrate C6 locally first. C7 goes onto a new branch next to C6: Push updates the branch you name; it does not invent a new branch. Retry question: The model shows your C7 and GitHub's C6, both built on C5. Which steps get C7 onto GitHub safely? Options: git pull --no-rebase, then git push; git push again; git fetch only; git clone again. Answer: git pull --no-rebase, then git push. git pull --no-rebase, then git push: Right: both sides have new commits, so with no pull setting configured, plain git pull stops; --no-rebase merges C6 in, and then push is accepted. git push again: Nothing changed, so it is rejected again. git fetch only: Fetch shows you C6 but leaves your main without it, and nothing is uploaded. git clone again: A fresh clone would not contain your C7 at all.
