# git-foundations: post-normalization content changes

Every byte change to an imported learner page after normalization is listed here for the critics.
Import fidelity: `import-fidelity.txt` (commit 2dc5979). Normalization (pep: meta tags, data: favicon link removed): commit 1ac047c.

## 1. Fake secret value shortened (firstmate decision 002, item 1)

- File: `git-linux-ai-foundations/git-foundations/commits-diffs-and-gitignore/artifact.html`
- Change: the simulated `.env` diff line kept the key name API_KEY and replaced its 21-character fake value ("practice", "only", "not", "real" joined by hyphens) with `fake-demo`.
- Reason: gate T07's secret pattern matches any `api_key=` value of 12 or more characters; the value is a deliberately fake teaching example. No other text changed.

## 2. Objectives list and static interaction alternatives (firstmate decision 002, item 3)

- Files: all nine `artifact.html` pages in this module.
- Change: a header objectives list (`<ul class="meta" data-pep-objectives aria-label="Objectives">`, the header list style the page already defines) using the exact `topic.json` objective text, and an author-written `data-static-alt` attribute on every `data-interaction` element (27 in total).
- Reason: contract sections 4 and 12 and gate T18, which derives `artifact.md` from these hooks. No other content changed.

## 3. Critic correction loop 1 (module-reconciliation.json)

- EDU-002 / EDU-003 (merge-conflicts, undoing-revert-and-reset, commits-diffs-and-gitignore): terminal `data-static-alt` goals were truncated at escaped apostrophes (`\'`) and kept Markdown `**` markers by the authoring extraction. Fixed the extraction and regenerated every terminal alternative; every static goal now contains its live goal text, checked in the browser against `#goals-N` for all 13 practice terminals.
- EDU-004 (git-and-shell-review): objective o2 narrowed in `topic.json` and the page header from "Choose the right Git command for a described situation" to "Choose the commands that take one change from the repository folder to a pushed branch"; the opening teach text no longer claims the module's ideas all work together, and now says the page practises one change from the shell to GitHub with the recap listing the other ideas for reference. No checks or syllabus added.
- sme-git-001 (stash): teaching, recap, cheat sheet and GIFT feedback now say `git stash pop` removes the entry once it applies cleanly; after a conflict the entry stays until `git stash drop`.
- sme-git-002 (merge-conflicts): recap and GIFT feedback now say a common conflict happens when both branches change the same area and Git cannot combine the changes automatically. Exercise unchanged.
- EDU-001: deferred to repository PR #13 (Markdown derivation); `artifact.md` is regenerated with the current tool only to match the corrected HTML.
