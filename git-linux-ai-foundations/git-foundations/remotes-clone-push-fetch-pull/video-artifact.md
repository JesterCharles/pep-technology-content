---
title: Fetch Changes in any JetBrains IDE
channel: JetBrains
url: https://www.youtube.com/watch?v=tnz2I9rxrfk
runtimeMinutes: 3.1
embeddable: true
checkedAt: 2026-10-12
covers: []
  - o3 in part: fetch gets the new commits but does not apply them to your local branch or working copy (transcript, description)
  - o2: after a fetch the log shows origin/main with two new commits while the local main does not have them (transcript)
  - o3 in part: the IDE's Update action combines a fetch with pulling the changes into your branch (transcript)
gaps: []
  - o1: SSH key pairs, and which half you share, are not covered (transcript)
  - o3: clone and push are not covered (transcript)
  - No git commands are typed; fetch and update are IDE actions (transcript)
cautions: []
  - First-party channel (JetBrains, channel id UCGp4UBwpTNegd_4nCpuBcow)
  - JetBrains IDE walkthrough; "Update Project" is a JetBrains term for fetch plus merge or rebase
  - No single first-party video under 8 minutes was found that covers SSH keys, clone, push and fetch versus pull together
  - Fit was judged from the auto-generated caption track and the description; frames were not inspected
alternates: []
rejected: []
---

# Video companion: Remotes: SSH keys, clone, push, fetch vs pull

**Selected:** [Fetch Changes in any JetBrains IDE](https://www.youtube.com/watch?v=tnz2I9rxrfk), JetBrains (first-party), 184 s (3:04), checked live 2026-10-12.
Public oEmbed returned HTTP 200 and the player reported status OK.

## Fit against the topic objectives

How verified: caption transcript, video description and live player metadata.

- **o1 Which half of an SSH key pair you share** - not covered.
- **o2 Local main versus origin/main** - covered: after the fetch, "origin main ... has two new commits", while there is "no evidence ... of those two commits" on the local main.
- **o3 What clone, fetch, pull and push change** - fetch and pull (Update) are covered; clone and push are not.

## Cautions

- IDE-specific; learners should map "Update" to `git pull`.

## Alternates (all verified live 2026-10-12)

- Training (**not first-party**), [Git Push, Pull, and Fetch Explained for Beginners | Part 3](https://www.youtube.com/watch?v=mwgFRnwTTXI), 194 s. The previous (legacy) pick. Captions cover typed `git remote add`, `git push -u origin main`, `git fetch`, "behind origin/main", `git pull` and a definition of clone; no SSH. Very low audience (16 views at check time).
- GitHub (first-party), [How to clone a remote repository in Git](https://www.youtube.com/watch?v=0XYymJLW_KQ), 57 s. Transcript: `git clone` with an HTTPS URL copied from GitHub.
- GitHub (first-party), [Syncing your local and remote Git repositories](https://www.youtube.com/watch?v=-ZWEbzxXQWM), 48 s. Transcript: `git pull` fetches and merges remote changes into the local branch.
- GitHub (first-party), [How to never type passwords when using Git operations: GitHub Changelog](https://www.youtube.com/watch?v=6XaZ0ryZRcY), 102 s. Transcript: SSH keys made with `ssh-keygen` as one option after password authentication ended; it does not explain public versus private halves.

## Rejected

- GitHub (first-party), [Set up your SSH security key in less than two minutes - GitHub Checkout](https://www.youtube.com/watch?v=EbsmqUJy5ag), 204 s. Its description is about hardware security keys for SSH, which goes beyond the page's basic key pair.

## Front-matter note

`alternates` and `rejected` are empty in the front matter because the repository's T01 front-matter parser reads list items only as strings while the schema requires objects. The records above are the authoritative list.
The full search is in `evidence/git-linux-ai-foundations/git-foundations/video-search.md`.
