# Pull requests and review comments

## Objectives

- Explain what a pull request asks: merge a branch into a base branch after review
- Answer a review comment by pushing a new commit to the same branch
- Say what must happen before a PR, including an AI-made one, is merged

## Teaching

Start with a guess

Teams rarely commit straight to main. Changes arrive as a pull request that teammates review first. The model shows your branch and its pull request.

## Model

Practice repository
Simulation: no real Git runs
Pull request #12
branch feature/cart-total

Commits: your computer C5; GitHub C5

Pull request: base main ← head feature/cart-total

Review by Ana: "Please handle an empty cart." (changes requested)

Checks and status: tests passing; open

## Recap

RecapA pull request asks to merge a head branch into a base branch, usually main, after review.Answer a review comment with a new commit pushed to the same branch; the PR updates itself.Merge only with approval, passing required checks and resolved comments.Review AI-made changes at least as carefully; see AI Foundations for how.Cheat sheetgit push -u origin <branch>publish your branch to GitHubbase <- headmerge the head branch into the base branchnew commit + git pushanswer a review commentMerge pull requestonly after approval, checks and resolved commentsSources and review dateTeaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28), and GitHub Docs (the pages show no version or update date). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings.GitHub: pull requestsGitHub: pull request reviewsGitHub: about protected branchesGitHub: merging a pull requestNext topic: Review: Git and the shell

## Cheat sheet

Cheat sheetgit push -u origin <branch>publish your branch to GitHubbase <- headmerge the head branch into the base branchnew commit + git pushanswer a review commentMerge pull requestonly after approval, checks and resolved comments

Sources and review dateTeaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28), and GitHub Docs (the pages show no version or update date). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings.GitHub: pull requestsGitHub: pull request reviewsGitHub: about protected branchesGitHub: merging a pull request

## Sources

Sources and review dateTeaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28), and GitHub Docs (the pages show no version or update date). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings.GitHub: pull requestsGitHub: pull request reviewsGitHub: about protected branchesGitHub: merging a pull request

## Static interaction alternatives

### predict

Prediction (not scored). You opened a pull request from your branch into main. A reviewer asks for a change. Where should your fix go? Options: A new commit pushed to the same branch; A new pull request; Straight onto main; An edit to the reviewer's comment. Answer: A new commit pushed to the same branch. A new commit pushed to the same branch: The pull request tracks your branch, so a pushed commit appears in it automatically, next to the comment it answers. A new pull request: Attractive, but it splits the discussion: reviewers lose the comment history. Straight onto main: That skips the review the pull request exists for. An edit to the reviewer's comment: Comments describe changes; code changes must be committed.

### terminal

Practice terminal (simulated; nothing runs on your computer). Task: Get your feature/cart-total work into main through review. Goals: Open a PR asking to merge your branch into main; Answer the review with a new commit on the same branch; Merge only after approval. One sequence that meets every goal: git push -u origin feature/cart-total, then Open PR: base main ← head feature/cart-total, then git commit -m "Handle empty cart", then git push -u origin feature/cart-total, then Merge pull request.

### mcq

Check (one retry, then the answer is shown). A PR from feature/search into main has one approval, but a required test check is failing and one review comment is unresolved. Is it ready to merge? Options: No: fix the failing check and resolve the comment first; Yes: one approval is enough; Yes: merge now and fix it on main; No: you must open a new PR. Answer: No: fix the failing check and resolve the comment first. No: fix the failing check and resolve the comment first: Right: approval is one of three conditions; the failing check and the open comment both still block. Yes: one approval is enough: Approval alone does not cover a failing check or an unanswered comment. Yes: merge now and fix it on main: That puts known-broken code on main, which review exists to prevent. No: you must open a new PR: The same PR is fine: push fixes to its branch. Retry question: The model shows PR #21. Which item still blocks merging? Options: The failing tests check; The approval; The branch name; Nothing; it is ready. Answer: The failing tests check. The failing tests check: Right: approval is in and comments are resolved, but the required check fails. The approval: PR #21 already has an approval. The branch name: Branch names never block a merge. Nothing; it is ready: A required check is failing, so it is not ready.
