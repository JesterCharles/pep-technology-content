# Readiness record: react/components-and-state

Status: **unreviewed first drafts, not delivery-ready.** This author-side record routes later review. It approves nothing, waives no gate, replaces no education or React-SME review, and marks nothing final, green, upload-safe, published or merged. No critic or reconciliation record exists for this module.

Base: readiness checkpoint `134d977` with main `817aeb6` merged. Gates ran on 2026-11-05 on Darwin arm64 with Playwright Chromium 140.0.7339.16 and the unmodified shared harness. `first-draft-manifest.json` remains the record of the original `a91aee3` bytes.

## What changed since 134d977

- Learner HTML on 7 of 7 pages: each editor block gained `id`, `data-pep-answer-sensitive` and `data-pep-answer-targets`. A `data-file` attribute was added only where the visible editor label names no file. No visible text or interaction changed. The estimator P50 and `artifact.md` were checked and are unchanged on each changed page.
- `qa-paths.json` on those pages: the private-success opt-in with one `answerSafety.tasks` entry per editor. `completion` and `progress` now assert that public routes stay incomplete at zero credit on the first editor.
- `sources.json` on those pages: re-fetched live and rebound; every source returned HTTP 200.
- `qa-receipt.json` on those pages: added in an evidence-only child of its proof commit, carrying metadata and the five public bindings only.
- GIFT banks, catalog IDs and curriculum are unchanged.

## Private success proof

7 topics and 11 editor tasks ran through the landed private runner on four routes each: success, wrongFirst, keyboard and sandbox. Each run also passed the runner's gate-owned check that every declared task reports completed, one credit and grade 1 and that the page completes. These runs were on this macOS host only.

Mixed-result refusal: at `be6f17c8`, the same bytes bound by every receipt, the runner refused all 7 of a deliberately failing overlay. On a page with several editors the first passes and the rest miss (mixed). On a page with one editor that editor misses (all-fail). The overlay claimed incomplete, so the refusal came from the gate-owned per-task check; a separate replay on the bound HTML and on the pre-correction routes confirmed each route ran to the end and left the failing task at completed false, credit 0, grade 0.

| Topic | Declared tasks | Receipt commit | Refusal run | T10 | T11 | T12 |
| --- | --- | --- | --- | --- | --- | --- |
| components-and-jsx | `#editor-task-2` jsx-editor: App, Welcome; `#editor-task-3` jsx-editor: Signup; `#editor-task-4` jsx-editor: Receipt | `8abb3007` | mixed: refused | pass | pass | pass |
| props | `#editor-task-3` jsx-editor: Panel | `66338534` | all-fail: refused | pass | pass | pass |
| project-structure | `#editor-task-3` jsx-editor: Header, Nav | `e5b42e36` | all-fail: refused | fail | fail | fail |
| conditional-display | `#editor-task-3` jsx-editor: Inbox | `393157e0` | all-fail: refused | fail | fail | fail |
| usestate | `#editor-task-3` jsx-editor: Likes; `#editor-task-4` jsx-editor: Score | `480a3558` | mixed: refused | fail | fail | fail |
| updating-state-immutably | `#editor-task-3` javascript-editor: renamed, moved; `#editor-task-4` javascript-editor: added, removed, retitled | `4a41c025` | mixed: refused | fail | fail | fail |
| rendering-lists-with-keys | `#editor-task-2` jsx-editor: Todo | `2ef20afa` | all-fail: refused | pass | pass | pass |

## Checks

Passing with the unmodified harness: T01-T09, T13-T16, T18-T20 and T24.

## Remaining failures

T10:
- 4: `guidance setup must finish on a later attempted but incomplete unlocked activity`

T11:
- 4: `#activity-2 data-pep-attempts expected "2"; got "0"`

T12:
- 4: `#activity-2 data-pep-settled expected "true"; got "false"`

T25 still reports missing education and SME critic coverage for every topic, because independent review has not been allocated.

**Every T10, T11 and T12 failure above has one proven cause: keyboard `select` on this host.** The harness keyboard path presses Home then ArrowDown, which leaves a closed `<select>` unchanged on Darwin Chromium, including on a plain non-PEP control page. Counterfactual: a scratch copy of the same commit, changing only those two harness keyboard `select` steps to `selectOption`, passed T09-T13 and T18 on all 26 React pages. That is scratch diagnosis, not gate evidence, and it does not prove keyboard operability.

**Linux is unknown.** No Linux browser run exists for these pages, no committed topic route on `main` before this work used a keyboard `select`, and the routes keep the contract's `select` action. These failures are recorded as failures in each `qa-receipt.json`. They are not waived.

## Review qualifications

- `jsx-editor` and `javascript-editor` use scan mode `none`. The only automated protection beyond matched editor shape is the runner's exact and whitespace-collapsed comparison against the topic's public files and `qa-paths.json`. Renamed, reshaped, assembled or encoded leaks, and semantic disclosure in hints, are for independent review.
- Declared targets are author-chosen names. Reviewers should confirm they are the right names. In particular, `data-file` supplies the matched extension on `project-structure` (`src/App.jsx`), `javascript-fundamentals-review` activity 4 (`src/App.jsx`) and `turning-off-the-dev-profile` (`src/api.js`), whose visible labels name no file. The last editor also holds `.env.local`. The `ui-tests-with-testing-library-querying-by-role-and-label` body defines no named function, so its targets are the provided helpers it must use.
- Private inputs were retired after the first-draft run and rebuilt for this run from the author's local session log, then retired per topic before each receipt was recorded. That session log remains outside the repository and still contains them.
- The private keyboard route uses repeated first-character type-ahead for `select`, then asserts the value, because the harness `select` keystrokes fail on this host. It proves that key path on macOS only. It is not the committed public keyboard route and does not clear the failures above.
- The wrong-first routes on `conditional-display`, `navigation` and `create-edit-and-delete-against-the-api` were corrected so that a retry starts from a state that can pass. In `create-edit-and-delete-against-the-api`, an item added by a mistaken POST cannot be deleted from the simulator's URL list, so a learner must use Restart to recover. No learner behavior was changed. Reviewers should judge that recovery path.
- With the landed setup rule, the guidance Restart procedure runs on a settled miss rather than a credited activity. Only the authored `restart` route exercises credit removal on these pages.
- `qa-paths.json` commits formative choice keys, public simulator inputs and wrong editor attempts. Reviewers should confirm none of them discloses an exercise answer.
- Practice editors and simulators are bounded models, not differentially tested against a real React toolchain.

## Timing

Worst path is a model from the estimator cost table, not a measurement with learners.

| Topic | Estimator P50 | Modeled worst path | Budget and label | GIFT |
| --- | --- | --- | --- | --- |
| components-and-jsx | 8.99 | 13.16 | 14 | present |
| props | 7.29 | 10.62 | 11 | present |
| project-structure | 7.24 | 10.32 | 11 | present |
| conditional-display | 7.04 | 10.54 | 11 | present |
| usestate | 8.04 | 11.96 | 12 | present |
| updating-state-immutably | 7.99 | 11.91 | 12 | present |
| rendering-lists-with-keys | 6.31 | 9.06 | 10 | present |

## Current bytes

| Topic | artifact.html sha256 | artifact.md sha256 |
| --- | --- | --- |
| components-and-jsx | `a05ec3050a64d1fdbbb6c416302fb01d82a4b17f58267208deb82359b56d18a6` | `130cc77b5143d3d930e464184806ee0ce139626762a937d253c40e2691628d70` |
| props | `1ca90aaf3688562a4e832cd189224945b534c702a94e4dbb68c7dd02b6bfcb97` | `bcd5ecd416a14774a21abbdbc0f779da12c5482c493c06de4ea07e06ea6cf0f4` |
| project-structure | `a64783d48dacf4779df5e22203ceeb2f4030f101db059698ea606b796d7971e9` | `45857767819f97c0ca504e4d86989f00f21c1b8bd5bcb9e16d0bec1147b16f84` |
| conditional-display | `c2c9e92e7e32e855417ce59367dcfd1a488551994058fc210f73c970df0aff46` | `f0d6f72ac8acf3dc43c176162ac12414e283daf75e2443cd32ab17c6a0921cbd` |
| usestate | `f1d9bce5171d3a485d6e0afabe23636cf4e33e12426cd24e524ca7a9aaac2dfc` | `325b54e544c4c2ee21c5ee0754fb94708f79a72a765dbc155da5c80d0ea7ea91` |
| updating-state-immutably | `ca61faa2d9b2346c57ef835c8d4c76f70c7815a82c6e95404d02815c04d7cbc7` | `40a70927b29bb0af43000a806aed5a1a682dcec0539061dd9531940347aa6e4b` |
| rendering-lists-with-keys | `6b9b38f20897ad72315046ff6c8e68a82a69e5e231011634d1bb5f31cc77163a` | `311d87e6da4537bab71ed07f46c6510b76db1ba880dd701976caa82157e4ba43` |
