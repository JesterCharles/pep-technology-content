# Readiness record: react/forms-context-and-crud

Status: **unreviewed first drafts, not delivery-ready.** This author-side record routes later review. It approves nothing, waives no gate, replaces no education or React-SME review, and marks nothing final, green, upload-safe, published or merged. No critic or reconciliation record exists for this module.

## Minimum-release completion (2026-11-08)

Main `174d4c86` (minimum-profile T25 support) was merged at `19ef8ab8` without rewriting checkpoint `ccf35668` or `2221d3dc`; their receipts remain in history. Learner bytes are final at `ecf4e760ed6d79d246fc158c5be2f784adc47af7`.

**Replacement private proofs.** Each receipt below was replaced from a clean proof commit by an evidence-only child, with staging retired after the passing run. Every editor task reached completed, credit 1 and grade 1 with the page complete across the success, wrong-first, keyboard and sandbox routes, and the gate's exact public-byte leak comparison passed. A dry run at `19ef8ab8` refused every mixed or all-fail run with no private value recorded.

| Topic | Private success proof |
| --- | --- |
| controlled-forms | validated at 8fced9228ddbe3cb74b83315c4eb311ed9a365b8 by run react-controlled-forms-1794118275506; pass |
| accessible-forms | validated at 5b3cb8894a77e6ae84497be32dd7de8863ba4b6d by run react-accessible-forms-1794118275626; pass |
| sharing-state-with-context | validated at c758b2a829f556d0264777e5c10cbafa46496d72 by run react-sharing-state-with-context-1794118275747; pass |
| create-edit-and-delete-against-the-api | validated at 29e48e60126d2303a696d98aaf6c8a7213468d45 by run react-create-edit-and-delete-against-the-api-1794118275860; pass |
| handling-submission-errors-in-forms | validated at c0e308d3dee18d762f3c04c7445fa06f15d3aa01 by run react-handling-submission-errors-in-forms-1794118275971; pass |
| ui-tests-with-testing-library-querying-by-role-and-label | validated at ebd40b2c5bcb2e0a9d17d0e44a5f55bb4f1fa129 by run react-ui-tests-with-testing-library-querying-by-role-and-label-1794118276047; pass |

**Browser gates.** T08, T09, T12, T13 and T18 passed at `19ef8ab8`. T10 first failed on `props`: disabling the radio fieldset left each radio's own `disabled` property false, so a restart check tried an inert radio. The page now disables each radio (commit `4f65773a`); T10 and T11 then passed. The first T11 run crashed on a full shared disk (`ENOSPC`), not on page content, and passed on rerun. Runs used Darwin arm64 Playwright Chromium 140.0.7339.16. Radio groups use Space through the harness keyboard route; Linux keyboard operation was not run and is unassessed.

**Owner essential pass.** Each topic's `owner-essential-qa.json` (`acceptanceProfile` minimum, `independentCriticApproval` not-required-not-performed) binds the current `artifact.html` and `artifact.gift` and lists the checks performed. Every private input was compared exactly and whitespace-normalized against all tracked files at `ecf4e760` with no match, then retired. The full repository check and npm test passed at `ecf4e760`. This is implementation-owner evidence only; no independent critic reviewed these drafts and nothing here is published.

The preparation section below is superseded where it conflicts with this section.

## Minimum-release preparation (2026-11-08)

This module is explicitly marked for the tonight minimum release. Each topic carries `owner-essential-qa.json`: `acceptanceProfile` minimum, `independentCriticApproval` not-required-not-performed, bound to the current `artifact.html` and `artifact.gift`. Independent critic approval was not required or performed. Each record lists its browser gates, replacement private proof and owner essential pass as **pending, not performed**. Main `e9a8aa28` was merged; no history was rewritten and `2221d3dc` and its receipts remain in history.

**Native select practice was replaced, not emulated.** Every native `<select>` practice control became a radio group (`fieldset[data-pep-choice]`) with the same option values, labels, default selection and grading. A small in-page shim gives the group the same `value` and `selectedIndex` behavior the simulators already read, so simulator logic is unchanged apart from two `querySelectorAll('select')` calls. QA `select` actions became `check` actions on the matching radio. The estimator P50 and interaction units and the generated `artifact.md` are unchanged on every converted page. The keyboard-`select` limitation recorded below therefore no longer applies to these pages. Radio keyboard operation has not yet been run in a browser here or on Linux.

**Every receipt in this module is stale and queued for replacement.** Main changed the bound `harness.mjs`, `T08-html-static.mjs` and `python-answer-scan.py`, so all receipts are stale in addition to any page or QA change. Until source-owned replacement proofs land, T06 fails on them. No browser run, private proof or owner essential pass was performed for this preparation checkpoint, because another task held the browser lane.

| Topic | Change | Receipt | Next |
| --- | --- | --- | --- |
| controlled-forms | none | stale: harness, python-scan, T08 | replacement private proof required |
| accessible-forms | 2 select controls to radio groups; 22 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| sharing-state-with-context | 2 select controls to radio groups; 18 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| create-edit-and-delete-against-the-api | 2 select controls to radio groups; 28 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| handling-submission-errors-in-forms | 1 select control to radio groups; 21 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| ui-tests-with-testing-library-querying-by-role-and-label | none | stale: harness, python-scan, T08 | replacement private proof required |

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
| accessible-forms | `9e2760eefcdfd56ae07ea40c46924b5239b9eb785eb1b4347607bd62ab50ad5a` | `f1f63cd89b2fdeca906b8c1f62d3a70d354038e8db072c969207401197978795` |
| sharing-state-with-context | `7bd2997afa48c273e1a23511b226c0f2d255b2c6beb061d5242cee410398ae4c` | `1a08640d1c173a7f51e15306dcf44fa9029425cd1b6c444a4eb775386cff2ad7` |
| create-edit-and-delete-against-the-api | `ae7bb4efd59a5a59059a64bb6d9d9cd539e88b5e965181610b525df3966dd4b8` | `c79f3ba79dd7e9b55108573f86cc96bc08aa8c667b8b39a202ae4e0925dfd7c0` |
| handling-submission-errors-in-forms | `18af2ffc6201bfe40e1746de4297b871427dfdcedea133d8edd6acc55d871e1e` | `49f2ed312a5135147b531e3c3b295b00e8e6c6ad0776bc4137859fee046cd83e` |
| ui-tests-with-testing-library-querying-by-role-and-label | `eb8bec9cba17c5029981c19af9569e65ebda3f44f09a148813502e2ff10c2b30` | `4c6215efb6f64ddd9abc7fe06dd94de9c40a44779856d68d6244349ed859a721` |
