# Undoing mistakes: revert and reset

## Objectives

- Undo a shared commit with git revert, which adds a new commit
- Say what git reset --soft and --hard change: branch, staging area, working copy
- Choose revert for commits other people already have and reset only for commits that exist only in your own local history

## Teaching

Start with a guess

Everyone commits a mistake sometimes. Git has two ways to undo one, and the safe choice depends on who already has the commit. In the model, the dashed label origin/main marks what you have already pushed.

## Model

Practice repository
Simulation: no real Git runs
C3
Change price calc
HEAD → main
origin/main
C2
Add cart
C1
Start shop

Staging area: empty. Working copy changes: none.

## Recap

Recapgit revert <commit> adds a new commit that undoes an earlier one. History keeps the original. Use it for anything pushed.git reset moves your branch back. Use it only for commits nobody else has.--soft keeps the changes staged; the default keeps them unstaged; --hard throws them away.A reset of pushed commits makes your history differ from everyone else's, and a normal push is rejected.Cheat sheetgit revert <commit>new commit that undoes <commit>git reset --soft HEAD~1undo last commit, keep changes stagedgit reset HEAD~1undo last commit, keep changes unstagedgit reset --hard HEAD~1undo last commit and discard its changesSources and review dateTeaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings.git-revert: descriptiongit-reset: options (--soft, --mixed, --hard)git-push: note about fast-forwardsNext topic: Stash: setting work aside

## Cheat sheet

Cheat sheetgit revert <commit>new commit that undoes <commit>git reset --soft HEAD~1undo last commit, keep changes stagedgit reset HEAD~1undo last commit, keep changes unstagedgit reset --hard HEAD~1undo last commit and discard its changes

Sources and review dateTeaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings.git-revert: descriptiongit-reset: options (--soft, --mixed, --hard)git-push: note about fast-forwards

## Sources

Sources and review dateTeaching claims were checked on 2026-10-06 (UTC) against live official documentation: the Git reference manual on git-scm.com (latest source release 2.56.0, released 2026-09-28). Simulated command output is illustrative: its exact wording was not checked and varies with Git version and settings.git-revert: descriptiongit-reset: options (--soft, --mixed, --hard)git-push: note about fast-forwards

## Static interaction alternatives

### predict

Prediction (not scored). C3 broke the price calculation, and you already pushed it. You run git revert C3. What happens to C3? Options: C3 stays; a new commit undoes its change; C3 is deleted from history; C3 is edited to remove the bug; Git refuses because C3 was pushed. Answer: C3 stays; a new commit undoes its change. C3 stays; a new commit undoes its change: git revert adds a new commit containing the opposite of C3's change. History keeps C3, so nobody's copy breaks. C3 is deleted from history: Attractive, but revert never deletes commits. Moving a branch back so a commit drops out is what git reset does. C3 is edited to remove the bug: Commits are never edited in place; Git always makes new commits. Git refuses because C3 was pushed: Revert is the command made for pushed commits, so it works.

### terminal

Practice terminal (simulated; nothing runs on your computer). Task: C3 is pushed and broke prices. Undo it safely and share the fix. Goals: Undo C3\; Share the fix so origin/main has it. One sequence that meets every goal: git revert C3, then git push.

### terminal

Practice terminal (simulated; nothing runs on your computer). Task: C4 is local only and you forgot a file in it. Undo C4 but keep its changes staged so you can recommit. Goals: main back at R1, with C4 off the branch; C4\. One sequence that meets every goal: git reset --soft HEAD~1.

### mcq

Check (one retry, then the answer is shown). You pushed C9, it broke the build, and a teammate has already pulled it. Which undo is safe? Options: git revert C9, then git push; git reset --hard HEAD~1, then git push; git reset --soft HEAD~1; Delete the branch and start again. Answer: git revert C9, then git push. git revert C9, then git push: Right: revert adds an undo commit on top of C9, so your teammate just pulls it. git reset --hard HEAD~1, then git push: Reset drops C9 from your branch, but your teammate has it. Git rejects the push, and forcing it would break their copy. git reset --soft HEAD~1: Still a reset: it rewrites history others already have. Delete the branch and start again: Deleting your branch name does not undo the commit for anyone who pulled it. Retry question: The model shows C9 on your main and on origin/main. Which result keeps everyone's history compatible? Options: C10 "Revert C9" on top of C9; main moved back to C8; C9 no longer on main; C9 changed in place to remove the bug; C9 removed from origin/main by git revert. Answer: C10 "Revert C9" on top of C9. C10 "Revert C9" on top of C9: Right: history only grows, so it stays compatible with your teammate's copy. main moved back to C8; C9 no longer on main: That is a reset of a pushed commit: your main no longer contains what your teammate has. C9 changed in place to remove the bug: Git cannot change a commit in place; this result is not possible. C9 removed from origin/main by git revert: Revert never removes commits from any branch.
