# git-foundations: post-normalization content changes

Every byte change to an imported learner page after normalization is listed here for the critics.
Import fidelity: `import-fidelity.txt` (commit 06d9aa3). Normalization (pep: meta tags, data: favicon link removed): commit 8e47bbf.

## 1. Fake secret value shortened (firstmate decision 002, item 1)

- File: `git-linux-ai-foundations/git-foundations/commits-diffs-and-gitignore/artifact.html`
- Change: the simulated `.env` diff line `+  API_KEY=practice-only-not-real` became `+  API_KEY=fake-demo`.
- Reason: gate T07's secret pattern matches any `api_key=` value of 12 or more characters; the value is a deliberately fake teaching example. No other text changed.

## 2. Objectives list and static interaction alternatives (firstmate decision 002, item 3)

- Files: all nine `artifact.html` pages in this module.
- Change: a header objectives list (`<ul class="objectives" data-pep-objectives>`) using the exact `topic.json` objective text, and an author-written `data-static-alt` attribute on every `data-interaction` element (27 in total).
- Reason: contract sections 4 and 12 and gate T18, which derives `artifact.md` from these hooks. No other content changed.
