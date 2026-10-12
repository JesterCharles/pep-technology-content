# Video search record: git-foundations

Course `git-linux-ai-foundations`, module `git-foundations`, 8 topics with a video companion.
`git-and-shell-review` is a review topic and has no video companion.
Searched and checked on 2026-10-12 between 21:14Z and 21:20Z (UTC).

## Method

- Starting point: the legacy curation `git-ai-foundations-videos.md` (topics 1-8, checked 2026-10-07). Legacy picks for topics 1 (GitLab) and 8 (GitHub) are first-party; the other six are not, so first-party replacements were searched for.
- First-party channels searched with YouTube's live in-channel search (`https://www.youtube.com/@<handle>/search?query=...`): GitHub (`@GitHub`), GitLab (`@Gitlab`), Atlassian (`@Atlassian`; `@bitbucket` returned no results page), Visual Studio Code (`@code`), Microsoft Visual Studio (`@VisualStudio`), JetBrains (`@JetBrainsTV`), IntelliJ IDEA (`@intellijidea`) and Microsoft Developer (`@MicrosoftDeveloper`).
- Then open YouTube searches to find anything the channel searches missed.
- Every candidate below was checked live: YouTube oEmbed (`https://www.youtube.com/oembed?format=json&url=...`) for public availability and channel name, and the public watch page's player metadata for `lengthSeconds`, publish date, view count and playability.
- Fit was judged from each video's caption track (fetched from YouTube's public player caption list; mostly auto-generated English), its description and its chapters where present. Frames were not inspected in this pass. No video was downloaded.
- "First-party" here means the official channel of a Git host or editor vendor (GitHub, GitLab, Atlassian, Microsoft/VS Code/Visual Studio, JetBrains). GitKraken is recorded as a Git-client vendor.
- Final receipts were written by `node tools/net/check-video.mjs` to `evidence/git-linux-ai-foundations/git-foundations/<topic>/video.json`; every run exited 0 with oEmbed HTTP 200.

## Queries run (UTC)

In-channel searches, 21:14:57Z-21:16:01Z:

- `@GitHub`: stash, git stash, branch, rebase, merge conflict, revert, reset, pull request, fetch, clone, diff, gitignore, ssh key, commit, conflict, undo commit, push.
- `@Gitlab`, `@Atlassian`, `@code`, `@VisualStudio`, `@JetBrainsTV`, `@intellijidea`, `@MicrosoftDeveloper`: git stash, git rebase, merge conflict, git revert, git branch, git fetch.
- `@Atlassian` and `@bitbucket`: git stash, git reset, fetch pull. Atlassian returned only Bitbucket product and conference talks (12-40 min); `@bitbucket` returned no data.

Open YouTube searches, 21:17:59Z-21:18:06Z:

- "github ssh key generate add github" - only third-party tutorials.
- "git fetch vs pull origin/main" - third-party, plus GitKraken (11:40, over budget).
- "git merge vs rebase" - surfaced GitKraken "Git Tutorial: Rebasing & Merging".
- "git merge conflict markers resolve" - surfaced VS Code (8:22) and IntelliJ IDEA (5:34).
- "git stash pop list untracked", "git reset soft hard revert", "git branch HEAD pointer git switch", "git diff staged gitignore" - only third-party results.

## Candidates checked (live, UTC)

| Topic | Video | Channel | First-party | Runtime (s) | Checked | Decision |
|---|---|---|---|---|---|---|
| 1 | [GitInGifs Working Directory & Staging Area](https://www.youtube.com/watch?v=ddo6dL3eVe8) | GitLab | yes | 181 | 21:16:26Z | **Selected** (legacy pick kept) |
| 1 | [Git basics: status and add commands](https://www.youtube.com/watch?v=zztkA8cJaCs) | GitHub | yes | 100 | 21:16:27Z | Alternate |
| 1 | [What is a .gitignore file and why do you need it?](https://www.youtube.com/watch?v=0qdRS3xYwIY) | GitHub | yes | 57 | 21:16:29Z | Alternate |
| 1 | [git diff --staged Will Diff Files You've Staged vs What's Commit](https://www.youtube.com/watch?v=qAgkFa5VsCc) | Nick Janetakis | no | 187 | 21:19:51Z | Alternate |
| 1 | [Git: Commits in Visual Studio Code](https://www.youtube.com/watch?v=E6ADS2k8oNQ) | Visual Studio Code | yes | 505 | 21:16:26Z | Rejected: VS Code button tour, no staging model, diff or .gitignore |
| 2 | [Git: branches in Visual Studio Code](https://www.youtube.com/watch?v=b9LTz6joMf8) | Visual Studio Code | yes | 254 | 21:16:30Z | **Selected** (replaces legacy) |
| 2 | [Git branches: create, switch, and when to use](https://www.youtube.com/watch?v=kJDqrOLVF2k) | ServiceNow Dev Program | no | 158 | 21:16:49Z | Alternate (legacy pick; best conceptual fit) |
| 2 | [How to switch branches and commit changes in git](https://www.youtube.com/watch?v=usaNdfT1hP8) | GitHub | yes | 70 | 21:16:31Z | Alternate |
| 2 | [How to use git branches for beginners](https://www.youtube.com/watch?v=3Fh1A3KGk-I) | GitHub | yes | 44 | 21:16:32Z | Alternate |
| 2 | [GitInGifs: Git Branches](https://www.youtube.com/watch?v=Q5OaMTd7PwM) | GitLab | yes | 215 | 21:16:33Z | Rejected: branch as "a version of the working tree", no commands |
| 3 | [How to undo a mistake on GitHub](https://www.youtube.com/watch?v=a1oRZ1kAA6M) | GitHub | yes | 42 | 21:16:36Z | **Selected** (replaces legacy) |
| 3 | [Git Reset vs Revert - Which One Should You Use?](https://www.youtube.com/watch?v=HuyPRodkME8) | LearnThatStack | no | 199 | 21:16:50Z | Alternate (legacy pick; deeper on --soft/--hard) |
| 3 | [Recovering from mistakes while working with git in Visual Studio [Ep 4]](https://www.youtube.com/watch?v=tkJ1yIktteQ) | Microsoft Visual Studio | yes | 118 | 21:16:35Z | Alternate |
| 3 | [How to Undo Commits in any JetBrains IDE](https://www.youtube.com/watch?v=_-3COzBp5qg) | JetBrains | yes | 201 | 21:16:34Z | Alternate |
| 3 | [Undo a git commit - git reset/revert - pushed/not pushed](https://www.youtube.com/watch?v=GytsxgB4-HU) | Philomatics | no | 207 | 21:19:50Z | Alternate |
| 4 | [How to STASH in Your JetBrains IDE](https://www.youtube.com/watch?v=rQXUSI50uhs) | JetBrains | yes | 162 | 21:16:37Z | **Selected** (replaces legacy) |
| 4 | [Go beyond git stash & pop](https://www.youtube.com/watch?v=ou6FvHyPegQ) | Philomatics | no | 219 | 21:16:51Z | Alternate (legacy pick; typed CLI commands) |
| 4 | [What is 'git STASH'?](https://www.youtube.com/watch?v=N6uEF6I4svc) | Visual Studio Code | yes | 52 | 21:16:38Z | Alternate |
| 4 | [Saving Work in Progress with Stashing in Visual Studio [Ep 3]](https://www.youtube.com/watch?v=jOYKUyBJ_Qg) | Microsoft Visual Studio | yes | 48 | 21:16:39Z | Alternate |
| 4 | [Git: Commits in Visual Studio Code](https://www.youtube.com/watch?v=E6ADS2k8oNQ) | Visual Studio Code | yes | 505 | 21:16:26Z | Rejected: over the 7-min budget |
| 5 | [Fetch Changes in any JetBrains IDE](https://www.youtube.com/watch?v=tnz2I9rxrfk) | JetBrains | yes | 184 | 21:16:39Z | **Selected** (replaces legacy) |
| 5 | [Git Push, Pull, and Fetch Explained for Beginners \| Part 3](https://www.youtube.com/watch?v=mwgFRnwTTXI) | Training | no | 194 | 21:16:51Z | Alternate (legacy pick; 16 views) |
| 5 | [How to clone a remote repository in Git](https://www.youtube.com/watch?v=0XYymJLW_KQ) | GitHub | yes | 57 | 21:16:41Z | Alternate |
| 5 | [Syncing your local and remote Git repositories](https://www.youtube.com/watch?v=-ZWEbzxXQWM) | GitHub | yes | 48 | 21:16:41Z | Alternate |
| 5 | [How to never type passwords when using Git operations: GitHub Changelog](https://www.youtube.com/watch?v=6XaZ0ryZRcY) | GitHub | yes | 102 | 21:18:15Z | Alternate |
| 5 | [Set up your SSH security key in less than two minutes - GitHub Checkout](https://www.youtube.com/watch?v=EbsmqUJy5ag) | GitHub | yes | 204 | 21:18:16Z | Rejected: hardware security keys, beyond the page |
| 6 | [How to merge a pull request \| Introduction to GitHub](https://www.youtube.com/watch?v=FDXSgyDGmho) | GitHub | yes | 203 | 21:16:48Z | **Selected** (replaces legacy) |
| 6 | [Resolving Merge Conflicts - How to Use Git and GitHub](https://www.youtube.com/watch?v=iRyUUGsNHrU) | Udacity | no | 195 | 21:16:52Z | Alternate (legacy pick; explains markers) |
| 6 | [Resolving Git Merge Conflicts: The Easy Way](https://www.youtube.com/watch?v=mSfq1SoMocg) | JetBrains | yes | 172 | 21:16:42Z | Alternate |
| 6 | [Handling Merge Conflicts in Visual Studio [Ep 3]](https://www.youtube.com/watch?v=FTT9pHMvRT8) | Microsoft Visual Studio | yes | 126 | 21:16:43Z | Alternate |
| 6 | [Source Control Tip 9: Dealing with Merge Conflicts in VS Code](https://www.youtube.com/watch?v=ybCxPHzRJfA) | Visual Studio Code | yes | 53 | 21:16:44Z | Alternate (no captions) |
| 6 | [The EXTREMELY helpful guide to merge conflicts](https://www.youtube.com/watch?v=HosPml1qkrg) | Visual Studio Code | yes | 501 | 21:19:51Z | Rejected: over the 6-min budget |
| 6 | [Resolving merge conflicts (4 of 5)](https://www.youtube.com/watch?v=XrXBDSxUvNE) | Microsoft Visual Studio | yes | 407 | 21:18:26Z | Rejected: over the 6-min budget |
| 6 | [IntelliJ IDEA: Resolving Merge Conflicts in Git](https://www.youtube.com/watch?v=WgipWkaU2MM) | IntelliJ IDEA, a JetBrains IDE | yes | 334 | 21:18:27Z | Not listed in the companion; IDE-only and the JetBrains 172 s video covers the same tool |
| 7 | [Branches: Merging, Rebasing, and Squashing in Visual Studio and GitHub [Ep 2]](https://www.youtube.com/watch?v=8Hg9rNRVw7I) | Microsoft Visual Studio | yes | 126 | 21:16:46Z | **Selected** (replaces legacy) |
| 7 | [Git Tutorial: Rebasing & Merging](https://www.youtube.com/watch?v=a_msiOrYLgM) | GitKraken | Git-client vendor | 243 | 21:18:14Z | Alternate |
| 7 | [Git merge vs rebase: what is the difference?](https://www.youtube.com/watch?v=k32vCDCa5kw) | GitHub | yes | 46 | 21:16:45Z | Alternate |
| 7 | [Git Rebase in any JetBrains IDE](https://www.youtube.com/watch?v=wiU3TL3jM8I) | JetBrains | yes | 148 | 21:16:46Z | Alternate |
| 7 | [Git Merge vs. Rebase: Which One Should You Use?](https://www.youtube.com/watch?v=x7oSRtTtoc8) | Josef Bender | no | 186 | 21:16:53Z | Alternate (legacy pick) |
| 7 | [How and when do I merge or rebase?](https://www.youtube.com/watch?v=Nftif2ynvdA) | JetBrains | yes | 938 | 21:19:54Z | Rejected: over the 6-min budget |
| 8 | [How to create a pull request in 4 min \| GitHub for Beginners](https://www.youtube.com/watch?v=nCKdihvneS0) | GitHub | yes | 224 | 21:16:47Z | **Selected** (legacy pick kept) |
| 8 | [How to merge a pull request \| Introduction to GitHub](https://www.youtube.com/watch?v=FDXSgyDGmho) | GitHub | yes | 203 | 21:16:48Z | Alternate (selected for topic 6) |
| 8 | [Pull Requests in VS Code](https://www.youtube.com/watch?v=LdSwWxVzUpo) | Visual Studio Code | yes | 611 | 21:19:52Z | Rejected: over the 7-min budget |
| 8 | [How to close pull requests faster with Copilot code review \| GitHub Checkout](https://www.youtube.com/watch?v=8hyvYP5PCks) | GitHub | yes | 640 | 21:19:53Z | Rejected: over the 7-min budget |
| - | [Using Git with Visual Studio Code (Official Beginner Tutorial)](https://www.youtube.com/watch?v=i_23KUAEtUM) | Visual Studio Code | yes | 416 | 21:16:54Z | Not used: a general tour, no single topic focus |

A `\|` in a title is a literal vertical bar, escaped for the table.

## Decisions

| Topic | Budget | Selected | First-party | Runtime | Versus legacy |
|---|---|---|---|---|---|
| commits-diffs-and-gitignore | 9 min | GitLab, GitInGifs Working Directory & Staging Area | yes | 181 s | Legacy pick re-verified and kept |
| branches-and-switching | 6 min | Visual Studio Code, Git: branches in Visual Studio Code | yes | 254 s | Replaced ServiceNow Dev Program (kept as alternate) |
| undoing-revert-and-reset | 7 min | GitHub, How to undo a mistake on GitHub | yes | 42 s | Replaced LearnThatStack (kept as alternate) |
| stash | 7 min | JetBrains, How to STASH in Your JetBrains IDE | yes | 162 s | Replaced Philomatics (kept as alternate) |
| remotes-clone-push-fetch-pull | 8 min | JetBrains, Fetch Changes in any JetBrains IDE | yes | 184 s | Replaced Training (kept as alternate) |
| merge-conflicts | 6 min | GitHub, How to merge a pull request \| Introduction to GitHub | yes | 203 s | Replaced Udacity (kept as alternate) |
| merge-vs-rebase | 6 min | Microsoft Visual Studio, Branches: Merging, Rebasing, and Squashing ... [Ep 2] | yes | 126 s | Replaced Josef Bender (kept as alternate) |
| pull-requests-and-review | 7 min | GitHub, How to create a pull request in 4 min \| GitHub for Beginners | yes | 224 s | Legacy pick re-verified and kept |

Fit trade-offs worth a reviewer's eye, because the first-party pick covers fewer objectives than the non-first-party legacy pick:

- **branches-and-switching**: VS Code does not teach the pointer model or HEAD (o1, o3); the ServiceNow alternate does.
- **undoing-revert-and-reset**: the GitHub pick is a 42-second tip; LearnThatStack lays out --soft/--mixed/--hard against the three areas (o2).
- **stash** and **remotes-clone-push-fetch-pull**: the JetBrains picks are IDE-driven, with no typed commands; the Philomatics and Training alternates use the CLI. No first-party video covers SSH key pairs (topic 5, o1).
- **merge-conflicts**: the GitHub pick shows markers but resolves with an editor button; Udacity reads and hand-edits the markers (o2).

No topic was recorded absent: every topic had a live, public, embeddable first-party video within its minute budget.
