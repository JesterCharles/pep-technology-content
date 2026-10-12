# Merge conflicts

## Objectives

- Explain why Git stops a merge with a conflict
- Read the \<\<\<\<\<\<\<, ======= and \>\>\>\>\>\>\> markers and name each side
- Resolve a conflict: write the final text, remove markers, git add, then commit

## Teaching

### Start with a guess

Merging joins the work of two branches. Usually Git combines them on its own. The model shows main and feature/title, which both changed the page heading.

### Reading and resolving a conflict

When both branches changed the same lines, Git stops with a conflict and writes both versions into the file:

- <<<<<<< HEAD starts your current branch's version.
- ======= separates the two.
- >>>>>>> feature/title ends the incoming branch's version.

To resolve: edit the file to the final text and delete all three marker lines; git add the file to mark it resolved; git commit to finish the merge. git merge --abort cancels everything.

### Apply it to a new conflict

Same markers, different file.

## Model

Practice repositorySimulation: no real Git runs

### Historynewest first

1. C4Store titlefeature/title
2. C3Shop titleHEAD → main
3. C2Add cart

### index.html, heading lineindex.html on main

```
Welcome to PEP Shop
```

## Recap

- A common conflict happens when both branches change the same area and Git cannot combine the changes automatically; Git stops and asks you.
- Between <<<<<<< HEAD and ======= is your current branch; after it, the incoming branch.
- Resolve by editing to the final text and deleting all markers, then git add and git commit.
- Git lets you commit leftover markers, so check the file first. git merge --abort starts over.

Next topic: Merge vs rebase

## Cheat sheet

|  |  |
| --- | --- |
| git merge <branch> | merge <branch> into the current branch |
| git status | lists unmerged (conflicted) files |
| git add <file> | mark a conflict resolved |
| git commit | finish the merge |
| git merge --abort | cancel and restore the pre-merge state |

## Sources

Teaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings.

- git-merge: how conflicts are presented
- git-merge: how to resolve conflicts
- git-merge: merge strategies

## Static interaction alternatives

### predict

Prediction (not scored). You and a teammate changed the same line of index.html on different branches. You run git merge. What does Git do? Options: Stops with a conflict and asks you to decide; Keeps the newest change automatically; Keeps your version; Combines both lines automatically. Answer: Stops with a conflict and asks you to decide. Stops with a conflict and asks you to decide: When both sides changed the same lines, Git cannot know which you want, so it stops and marks the file as conflicted. Keeps the newest change automatically: Attractive, but Git never picks a winner by time; newer is not always right. Keeps your version: Git does not prefer your branch; it asks you. Combines both lines automatically: Git combines changes automatically only when they touch different lines.

### terminal

Practice terminal (simulated; nothing runs on your computer). Task: You are on main. Merge feature/title. The team chose the heading from feature/title. Goals: Start the merge and meet the conflict; Heading is the team's choice, with no markers; Mark it resolved and finish the merge. One sequence that meets every goal: git merge feature/title, then Edit: keep feature/title line only, then git add index.html, then git commit -m "Merge feature/title".

### mcq

Check (one retry, then the answer is shown). You are on main, merging sale. The model shows the conflict in price.txt. Which line came from sale? Options: price = 12; price = 10; Both lines; Neither; Git invented them. Answer: price = 12. price = 12: Right: it sits between ======= and >>>>>>> sale, the incoming branch's part. price = 10: That line follows <<<<<<< HEAD, so it is the version on main, the branch you are on. Both lines: Each side contributes one version; only one line is from sale. Neither; Git invented them: Git copies each side's real content between the markers. Retry question: You are on main, merging feature/menu into it. Where in a conflict block is the feature/menu version? Options: After ======= and before >>>>>>> feature/menu; After <<<<<<< HEAD and before =======; The whole file; In the marker lines themselves. Answer: After ======= and before >>>>>>> feature/menu. After ======= and before >>>>>>> feature/menu: Right: the lower part belongs to the branch being merged in, named on the closing marker. After <<<<<<< HEAD and before =======: The upper part is HEAD: the branch you are on, main. The whole file: Only the lines inside the markers differ; the rest merged cleanly. In the marker lines themselves: Marker lines only label the parts, and must be deleted.
