# Readiness record: react/components-and-state

Status: **unreviewed first drafts, not delivery-ready.** This author-side record routes later review. It approves nothing, waives no gate, replaces no education or React-SME review, and marks nothing final, green, upload-safe, published or merged. No critic or reconciliation record exists for this module.

## Minimum-release completion (2026-11-08)

Main `174d4c86` (minimum-profile T25 support) was merged at `19ef8ab8` without rewriting checkpoint `ccf35668` or `2221d3dc`; their receipts remain in history. Learner bytes are final at `ecf4e760ed6d79d246fc158c5be2f784adc47af7`.

**Replacement private proofs.** Each receipt below was replaced from a clean proof commit by an evidence-only child, with staging retired after the passing run. Every editor task reached completed, credit 1 and grade 1 with the page complete across the success, wrong-first, keyboard and sandbox routes, and the gate's exact public-byte leak comparison passed. A dry run at `19ef8ab8` refused every mixed or all-fail run with no private value recorded.

| Topic | Private success proof |
| --- | --- |
| components-and-jsx | validated at 4f65773a2a7aadd412f463991bef048fdb02fa22 by run react-components-and-jsx-1794118274157; pass |
| props | validated at 426a52b8f0845b27c7ccda5e06dd0539ffb0aa38 by run react-props-1794118274234; pass |
| project-structure | validated at ce63993ef86308b8598e06f954c2b4baa66bf09b by run react-project-structure-1794118274419; pass |
| conditional-display | validated at 5ededdfa36598d2754dbeef2497662cf8d218df9 by run react-conditional-display-1794118274537; pass |
| usestate | validated at 93892a6d0c8de0e1ed4cfb0786334f196024a6f3 by run react-usestate-1794118274634; pass |
| updating-state-immutably | validated at dc715ee4db6268f469505f88fca1f288ea8cb9a0 by run react-updating-state-immutably-1794118274727; pass |
| rendering-lists-with-keys | validated at 41b0ce82c649239e0e7ddabd774ca52711d5cd1d by run react-rendering-lists-with-keys-1794118274837; pass |

**Browser gates.** T08, T09, T12, T13 and T18 passed at `19ef8ab8`. T10 first failed on `props`: disabling the radio fieldset left each radio's own `disabled` property false, so a restart check tried an inert radio. The page now disables each radio (commit `4f65773a`); T10 and T11 then passed. The first T11 run crashed on a full shared disk (`ENOSPC`), not on page content, and passed on rerun. Runs used Darwin arm64 Playwright Chromium 140.0.7339.16. Radio groups use Space through the harness keyboard route; Linux keyboard operation was not run and is unassessed.

**Owner essential pass.** Each topic's `owner-essential-qa.json` (`acceptanceProfile` minimum, `independentCriticApproval` not-required-not-performed) binds the current `artifact.html` and `artifact.gift` and lists the checks performed. Every private input was compared exactly and whitespace-normalized against all tracked files at `ecf4e760` with no match, then retired. The full repository check and npm test passed at `ecf4e760`. This is implementation-owner evidence only; no independent critic reviewed these drafts and nothing here is published.

The preparation section below is superseded where it conflicts with this section.

## Minimum-release preparation (2026-11-08)

This module is explicitly marked for the tonight minimum release. Each topic carries `owner-essential-qa.json`: `acceptanceProfile` minimum, `independentCriticApproval` not-required-not-performed, bound to the current `artifact.html` and `artifact.gift`. Independent critic approval was not required or performed. Each record lists its browser gates, replacement private proof and owner essential pass as **pending, not performed**. Main `e9a8aa28` was merged; no history was rewritten and `2221d3dc` and its receipts remain in history.

**Native select practice was replaced, not emulated.** Every native `<select>` practice control became a radio group (`fieldset[data-pep-choice]`) with the same option values, labels, default selection and grading. A small in-page shim gives the group the same `value` and `selectedIndex` behavior the simulators already read, so simulator logic is unchanged apart from two `querySelectorAll('select')` calls. QA `select` actions became `check` actions on the matching radio. The estimator P50 and interaction units and the generated `artifact.md` are unchanged on every converted page. The keyboard-`select` limitation recorded below therefore no longer applies to these pages. Radio keyboard operation has not yet been run in a browser here or on Linux.

**Every receipt in this module is stale and queued for replacement.** Main changed the bound `harness.mjs`, `T08-html-static.mjs` and `python-answer-scan.py`, so all receipts are stale in addition to any page or QA change. Until source-owned replacement proofs land, T06 fails on them. No browser run, private proof or owner essential pass was performed for this preparation checkpoint, because another task held the browser lane.

| Topic | Change | Receipt | Next |
| --- | --- | --- | --- |
| components-and-jsx | none | stale: harness, python-scan, T08 | replacement private proof required |
| props | 1 select control to radio groups; 0 QA actions | stale: html, harness, python-scan, T08 | replacement private proof required |
| project-structure | 2 select controls to radio groups; 38 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| conditional-display | 1 select control to radio groups; 9 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| usestate | 1 select control to radio groups; 9 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| updating-state-immutably | 1 select control to radio groups; 9 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| rendering-lists-with-keys | 1 select control to radio groups; 0 QA actions | stale: html, harness, python-scan, T08 | replacement private proof required |

Non-browser gates on these bytes: T01, T02, T05, T07, T14, T15, T16, T19 and T24 pass. Source receipts were re-fetched live and every source returned HTTP 200. T06 fails only on this module's stale receipt bindings listed above (31 errors). T25 on `main` does not yet support the minimum profile, so it still requires critic coverage.

Sections below describe checkpoint `2221d3dc` and are superseded where they conflict with this section.

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
| props | `736128723914068d1d09bbfc3a9027c5a0dfa35294ee31dc8fb3490fcb78e211` | `bcd5ecd416a14774a21abbdbc0f779da12c5482c493c06de4ea07e06ea6cf0f4` |
| project-structure | `8be23a8697e0ee11596d32db8cb7a526284b92681ed11b1a078fa79cc115257a` | `45857767819f97c0ca504e4d86989f00f21c1b8bd5bcb9e16d0bec1147b16f84` |
| conditional-display | `719708e50ff455dfdf7e7f273966405db7d459aa37287340c7fa50801033c794` | `f0d6f72ac8acf3dc43c176162ac12414e283daf75e2443cd32ab17c6a0921cbd` |
| usestate | `d6fd4635a04e72a2788cb4188e3f4d9249fbad17c7b22477230bd336c6bbb2a4` | `325b54e544c4c2ee21c5ee0754fb94708f79a72a765dbc155da5c80d0ea7ea91` |
| updating-state-immutably | `295b7a7e3d1a8ccca65e291cd8f995381d93f228fa5124da3befb9bdd4bd6546` | `40a70927b29bb0af43000a806aed5a1a682dcec0539061dd9531940347aa6e4b` |
| rendering-lists-with-keys | `11f74239675b2e842472d5903dcf4023142a1925d73bfedc576a6555f9dcac16` | `311d87e6da4537bab71ed07f46c6510b76db1ba880dd701976caa82157e4ba43` |
