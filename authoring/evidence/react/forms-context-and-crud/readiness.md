# Readiness record: react/forms-context-and-crud

Status: **unreviewed first drafts, not delivery-ready.** This author-side record routes later review. It approves nothing, waives no gate, replaces no education or React-SME review, and marks nothing final, green, upload-safe, published or merged. No critic or reconciliation record exists for this module.

Base: readiness checkpoint `134d977` with main `817aeb6` merged. Gates ran on 2026-11-05 on Darwin arm64 with Playwright Chromium 140.0.7339.16 and the unmodified shared harness. `first-draft-manifest.json` remains the record of the original `a91aee3` bytes.

## What changed since 134d977

- Learner HTML on 6 of 6 pages: each editor block gained `id`, `data-pep-answer-sensitive` and `data-pep-answer-targets`. A `data-file` attribute was added only where the visible editor label names no file. No visible text or interaction changed. The estimator P50 and `artifact.md` were checked and are unchanged on each changed page.
- `qa-paths.json` on those pages: the private-success opt-in with one `answerSafety.tasks` entry per editor. `completion` and `progress` now assert that public routes stay incomplete at zero credit on the first editor.
- `sources.json` on those pages: re-fetched live and rebound; every source returned HTTP 200.
- `qa-receipt.json` on those pages: added in an evidence-only child of its proof commit, carrying metadata and the five public bindings only.
- GIFT banks, catalog IDs and curriculum are unchanged.

## Private success proof

6 topics and 6 editor tasks ran through the landed private runner on four routes each: success, wrongFirst, keyboard and sandbox. Each run also passed the runner's gate-owned check that every declared task reports completed, one credit and grade 1 and that the page completes. These runs were on this macOS host only.

Mixed-result refusal: at `be6f17c8`, the same bytes bound by every receipt, the runner refused all 6 of a deliberately failing overlay. On a page with several editors the first passes and the rest miss (mixed). On a page with one editor that editor misses (all-fail). The overlay claimed incomplete, so the refusal came from the gate-owned per-task check; a separate replay on the bound HTML and on the pre-correction routes confirmed each route ran to the end and left the failing task at completed false, credit 0, grade 0.

| Topic | Declared tasks | Receipt commit | Refusal run | T10 | T11 | T12 |
| --- | --- | --- | --- | --- | --- | --- |
| controlled-forms | `#editor-task-3` jsx-editor: Signup | `b1106703` | all-fail: refused | pass | pass | pass |
| accessible-forms | `#editor-task-3` jsx-editor: Field | `7ecb6a34` | all-fail: refused | fail | fail | fail |
| sharing-state-with-context | `#editor-task-3` jsx-editor: ThemeContext | `553406cf` | all-fail: refused | fail | fail | fail |
| create-edit-and-delete-against-the-api | `#editor-task-3` javascript-editor: addItem, removeItem | `6ef4ea55` | all-fail: refused | pass | pass | fail |
| handling-submission-errors-in-forms | `#editor-task-3` javascript-editor: submit | `03d652d3` | all-fail: refused | fail | fail | fail |
| ui-tests-with-testing-library-querying-by-role-and-label | `#editor-task-3` javascript-editor: screen, user | `466457cd` | all-fail: refused | pass | pass | pass |

## Checks

Passing with the unmodified harness: T01-T09, T13-T16, T18-T20 and T24.

## Remaining failures

T10:
- 3: `guidance setup must finish on a later attempted but incomplete unlocked activity`

T11:
- 3: `#activity-2 data-pep-attempts expected "2"; got "0"`

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
| controlled-forms | 7.25 | 10.58 | 11 | present |
| accessible-forms | 8.12 | 11.79 | 12 | present |
| sharing-state-with-context | 7.27 | 10.6 | 11 | present |
| create-edit-and-delete-against-the-api | 8.26 | 11.93 | 12 | present |
| handling-submission-errors-in-forms | 6.88 | 10.21 | 11 | present |
| ui-tests-with-testing-library-querying-by-role-and-label | 7.17 | 10.5 | 11 | present |

## Current bytes

| Topic | artifact.html sha256 | artifact.md sha256 |
| --- | --- | --- |
| controlled-forms | `a6495226199add2cfc113bb8743b46a435a9e7263c15789750c58f5ad684d397` | `592374bba9b05d3f6187631169eb6a40968580edf906e89f11494a11939d50eb` |
| accessible-forms | `6a85a9cbcbba0c51ff41e249cae323222ce89ba31010cbe41f3a33b4bc70b6f2` | `f1f63cd89b2fdeca906b8c1f62d3a70d354038e8db072c969207401197978795` |
| sharing-state-with-context | `29cd5d7d305e4894e59089d773ba2cf26d6a2bc9a86715fe6ceee40275d838e6` | `1a08640d1c173a7f51e15306dcf44fa9029425cd1b6c444a4eb775386cff2ad7` |
| create-edit-and-delete-against-the-api | `7a9c6ca3814b95e75b10b00c4c3fb9359c751734bf9d520be9bea64f51dba56b` | `c79f3ba79dd7e9b55108573f86cc96bc08aa8c667b8b39a202ae4e0925dfd7c0` |
| handling-submission-errors-in-forms | `bcafcc54a39065e0c4c98cf8c5d11216c811b447264bc0fc61df805c92a804db` | `49f2ed312a5135147b531e3c3b295b00e8e6c6ad0776bc4137859fee046cd83e` |
| ui-tests-with-testing-library-querying-by-role-and-label | `eb8bec9cba17c5029981c19af9569e65ebda3f44f09a148813502e2ff10c2b30` | `4c6215efb6f64ddd9abc7fe06dd94de9c40a44779856d68d6244349ed859a721` |
