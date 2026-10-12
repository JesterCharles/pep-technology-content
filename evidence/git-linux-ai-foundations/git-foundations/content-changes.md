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
