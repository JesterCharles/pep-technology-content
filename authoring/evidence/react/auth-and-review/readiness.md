# Readiness record: react/auth-and-review

Status: **unreviewed first drafts, not delivery-ready.** This author-side record routes later review. It approves nothing, waives no gate, replaces no education or React-SME review, and marks nothing final, green, upload-safe, published or merged. No critic or reconciliation record exists for this module.

## Minimum-release preparation (2026-11-08)

This module is explicitly marked for the tonight minimum release. Each topic carries `owner-essential-qa.json`: `acceptanceProfile` minimum, `independentCriticApproval` not-required-not-performed, bound to the current `artifact.html` and `artifact.gift`. Independent critic approval was not required or performed. Each record lists its browser gates, replacement private proof and owner essential pass as **pending, not performed**. Main `e9a8aa28` was merged; no history was rewritten and `2221d3dc` and its receipts remain in history.

**Native select practice was replaced, not emulated.** Every native `<select>` practice control became a radio group (`fieldset[data-pep-choice]`) with the same option values, labels, default selection and grading. A small in-page shim gives the group the same `value` and `selectedIndex` behavior the simulators already read, so simulator logic is unchanged apart from two `querySelectorAll('select')` calls. QA `select` actions became `check` actions on the matching radio. The estimator P50 and interaction units and the generated `artifact.md` are unchanged on every converted page. The keyboard-`select` limitation recorded below therefore no longer applies to these pages. Radio keyboard operation has not yet been run in a browser here or on Linux.

**Every receipt in this module is stale and queued for replacement.** Main changed the bound `harness.mjs`, `T08-html-static.mjs` and `python-answer-scan.py`, so all receipts are stale in addition to any page or QA change. Until source-owned replacement proofs land, T06 fails on them. No browser run, private proof or owner essential pass was performed for this preparation checkpoint, because another task held the browser lane.

| Topic | Change | Receipt | Next |
| --- | --- | --- | --- |
| login-with-a-session-cookie-or-jwt | 2 select controls to radio groups; 18 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| protected-pages-and-role-based-screens | none | stale: harness, python-scan, T08 | replacement private proof required |
| handling-401-and-403-redirect-and-sign-out | 2 select controls to radio groups; 18 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| turning-off-the-dev-profile | none | stale: harness, python-scan, T08 | replacement private proof required |
| javascript-fundamentals-review | 2 select controls to radio groups; 6 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| react-review | 1 select control to radio groups; 36 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |

Non-browser gates on these bytes: T01, T02, T05, T07, T14, T15, T16, T19 and T24 pass. Source receipts were re-fetched live and every source returned HTTP 200. T06 fails only on this module's stale receipt bindings listed above (26 errors). T25 on `main` does not yet support the minimum profile, so it still requires critic coverage.

Sections below describe checkpoint `2221d3dc` and are superseded where they conflict with this section.

Base: readiness checkpoint `134d977` with main `817aeb6` merged. Gates ran on 2026-11-05 on Darwin arm64 with Playwright Chromium 140.0.7339.16 and the unmodified shared harness. `first-draft-manifest.json` remains the record of the original `a91aee3` bytes.

## What changed since 134d977

- Learner HTML on 6 of 6 pages: each editor block gained `id`, `data-pep-answer-sensitive` and `data-pep-answer-targets`. A `data-file` attribute was added only where the visible editor label names no file. No visible text or interaction changed. The estimator P50 and `artifact.md` were checked and are unchanged on each changed page.
- `qa-paths.json` on those pages: the private-success opt-in with one `answerSafety.tasks` entry per editor. `completion` and `progress` now assert that public routes stay incomplete at zero credit on the first editor.
- `sources.json` on those pages: re-fetched live and rebound; every source returned HTTP 200.
- `qa-receipt.json` on those pages: added in an evidence-only child of its proof commit, carrying metadata and the five public bindings only.
- GIFT banks, catalog IDs and curriculum are unchanged.

## Private success proof

6 topics and 7 editor tasks ran through the landed private runner on four routes each: success, wrongFirst, keyboard and sandbox. Each run also passed the runner's gate-owned check that every declared task reports completed, one credit and grade 1 and that the page completes. These runs were on this macOS host only.

Mixed-result refusal: at `be6f17c8`, the same bytes bound by every receipt, the runner refused all 6 of a deliberately failing overlay. On a page with several editors the first passes and the rest miss (mixed). On a page with one editor that editor misses (all-fail). The overlay claimed incomplete, so the refusal came from the gate-owned per-task check; a separate replay on the bound HTML and on the pre-correction routes confirmed each route ran to the end and left the failing task at completed false, credit 0, grade 0.

| Topic | Declared tasks | Receipt commit | Refusal run | T10 | T11 | T12 |
| --- | --- | --- | --- | --- | --- | --- |
| login-with-a-session-cookie-or-jwt | `#editor-task-3` javascript-editor: loginWithCookie, getOrders, getOrdersWithJwt | `6ae642e8` | all-fail: refused | fail | fail | fail |
| protected-pages-and-role-based-screens | `#editor-task-2` jsx-editor: RequireAuth, Toolbar | `2e06115c` | all-fail: refused | pass | pass | pass |
| handling-401-and-403-redirect-and-sign-out | `#editor-task-3` javascript-editor: handleStatus | `e4da0674` | all-fail: refused | fail | fail | fail |
| turning-off-the-dev-profile | `#editor-task-3` javascript-editor: base, VITE_API_URL | `d715272b` | all-fail: refused | pass | pass | pass |
| javascript-fundamentals-review | `#editor-task-2` javascript-editor: summarize; `#editor-task-4` jsx-editor: add, PI | `e115f18e` | mixed: refused | fail | fail | pass |
| react-review | `#editor-task-3` jsx-editor: Todos | `96cea7e0` | all-fail: refused | fail | fail | fail |

## Checks

Passing with the unmodified harness: T01-T09, T13-T16, T18-T20 and T24.

## Remaining failures

T10:
- 2: `guidance setup must finish on a later attempted but incomplete unlocked activity`
- 1: `Restart wrong check could not establish non-authored current controls`
- 1: `#activity-3 data-pep-attempts expected "2"; got "0"`

T11:
- 2: `#activity-2 data-pep-attempts expected "2"; got "0"`
- 1: `Restart wrong check could not establish non-authored current controls`
- 1: `#activity-3 data-pep-attempts expected "2"; got "0"`

T12:
- 3: `#activity-2 data-pep-settled expected "true"; got "false"`

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
| login-with-a-session-cookie-or-jwt | 7.48 | 10.81 | 11 | present |
| protected-pages-and-role-based-screens | 7.06 | 10.39 | 11 | present |
| handling-401-and-403-redirect-and-sign-out | 6.97 | 10.3 | 11 | present |
| turning-off-the-dev-profile | 6.7 | 9.45 | 10 | present |
| javascript-fundamentals-review | 8.21 | 12.71 | 13 | absent: declared review exemption |
| react-review | 7.61 | 11.69 | 12 | absent: declared review exemption |

## Current bytes

| Topic | artifact.html sha256 | artifact.md sha256 |
| --- | --- | --- |
| login-with-a-session-cookie-or-jwt | `93230b4d1ab2a9faed5205903a3c1096b08eb734289d0f6cab8e08c1d319df69` | `398b71849e37aa6ae46c40cf6de49a5aa1c04befcec389ebbabc08d58c8917db` |
| protected-pages-and-role-based-screens | `cc126035c477c7a78bfa59a9c84ad493fa283dd598457a959ebcc73294af1317` | `62b7d56ec9b8788c90fe8a6e533be60aecc2aefdddee1d824257f28ad46c0332` |
| handling-401-and-403-redirect-and-sign-out | `d42dd19c127afc10bf3c960b878cf426ffc20f10c83eba7294cef32d27b3edd0` | `41846d7ba2ae6a9ea14d47dc8e382d0f46c0a2308a9976e66ecff1d8bae803cc` |
| turning-off-the-dev-profile | `ec3401ba59ec52357fefee5f73cbb54327dcadc6d6fa115ad43311b071617a57` | `882eb0727764a74fc5766b343e592e73d4c65d3971930ce008c0bfeca13249e2` |
| javascript-fundamentals-review | `7ea492e5698551310d376942b55a4ff9830ac2655bc85ae0d37db7de6de65975` | `6ac40359102ab7bd2df98522c99b9d0228a9f68ccf3631e183cb01f9498ffa8f` |
| react-review | `dc237f8384d206d74a4caefbe59af9ad41d8693c94c2873dc1bfa3b0479b52f8` | `e2886a8657c164162c3e39c9e60126e4d4df2abc5066755c272a8d3ac53066c3` |
