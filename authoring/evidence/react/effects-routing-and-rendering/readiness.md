# Readiness record: react/effects-routing-and-rendering

Status: **unreviewed first drafts, not delivery-ready.** This author-side record routes later review. It approves nothing, waives no gate, replaces no education or React-SME review, and marks nothing final, green, upload-safe, published or merged. No critic or reconciliation record exists for this module.

## Minimum-release completion (2026-11-08)

Main `174d4c86` (minimum-profile T25 support) was merged at `19ef8ab8` without rewriting checkpoint `ccf35668` or `2221d3dc`; their receipts remain in history. Learner bytes are final at `ecf4e760ed6d79d246fc158c5be2f784adc47af7`.

**Replacement private proofs.** Each receipt below was replaced from a clean proof commit by an evidence-only child, with staging retired after the passing run. Every editor task reached completed, credit 1 and grade 1 with the page complete across the success, wrong-first, keyboard and sandbox routes, and the gate's exact public-byte leak comparison passed. A dry run at `19ef8ab8` refused every mixed or all-fail run with no private value recorded.

| Topic | Private success proof |
| --- | --- |
| loading-data-with-useeffect | validated at 8d66ee1642d6a9da2495df4f1bcd5f8538eaa797 by run react-loading-data-with-useeffect-1794118274941; pass |
| loading-and-error-states | validated at cc62edf7c16f63df77056347ba4bf55d5390ed60 by run react-loading-and-error-states-1794118275058; pass |
| custom-hooks | validated at 897783f5d545dcb4c0b8ac2da5bbe3bff39a6eaf by run react-custom-hooks-1794118275157; pass |
| routing-and-route-parameters | validated at ee381693f9434a01f3fefe502c1373b39dfb16e4 by run react-routing-and-route-parameters-1794118275242; pass |
| navigation | validated at 4a754a16a736be5043804b9647eebc46845de4c5 by run react-navigation-1794118275336; pass |
| what-makes-a-component-re-render | not applicable (no editor task) |
| lifting-state-up | validated at 54b9585b260ba61f0f122a007e76f76b3705441f by run react-lifting-state-up-1794118275427; pass |

**Browser gates.** T08, T09, T12, T13 and T18 passed at `19ef8ab8`. T10 first failed on `props`: disabling the radio fieldset left each radio's own `disabled` property false, so a restart check tried an inert radio. The page now disables each radio (commit `4f65773a`); T10 and T11 then passed. The first T11 run crashed on a full shared disk (`ENOSPC`), not on page content, and passed on rerun. Runs used Darwin arm64 Playwright Chromium 140.0.7339.16. Radio groups use Space through the harness keyboard route; Linux keyboard operation was not run and is unassessed.

**Owner essential pass.** Each topic's `owner-essential-qa.json` (`acceptanceProfile` minimum, `independentCriticApproval` not-required-not-performed) binds the current `artifact.html` and `artifact.gift` and lists the checks performed. Every private input was compared exactly and whitespace-normalized against all tracked files at `ecf4e760` with no match, then retired. The full repository check and npm test passed at `ecf4e760`. This is implementation-owner evidence only; no independent critic reviewed these drafts and nothing here is published.

The preparation section below is superseded where it conflicts with this section.

## Minimum-release preparation (2026-11-08)

This module is explicitly marked for the tonight minimum release. Each topic carries `owner-essential-qa.json`: `acceptanceProfile` minimum, `independentCriticApproval` not-required-not-performed, bound to the current `artifact.html` and `artifact.gift`. Independent critic approval was not required or performed. Each record lists its browser gates, replacement private proof and owner essential pass as **pending, not performed**. Main `e9a8aa28` was merged; no history was rewritten and `2221d3dc` and its receipts remain in history.

**Native select practice was replaced, not emulated.** Every native `<select>` practice control became a radio group (`fieldset[data-pep-choice]`) with the same option values, labels, default selection and grading. A small in-page shim gives the group the same `value` and `selectedIndex` behavior the simulators already read, so simulator logic is unchanged apart from two `querySelectorAll('select')` calls. QA `select` actions became `check` actions on the matching radio. The estimator P50 and interaction units and the generated `artifact.md` are unchanged on every converted page. The keyboard-`select` limitation recorded below therefore no longer applies to these pages. Radio keyboard operation has not yet been run in a browser here or on Linux.

**Every receipt in this module is stale and queued for replacement.** Main changed the bound `harness.mjs`, `T08-html-static.mjs` and `python-answer-scan.py`, so all receipts are stale in addition to any page or QA change. Until source-owned replacement proofs land, T06 fails on them. No browser run, private proof or owner essential pass was performed for this preparation checkpoint, because another task held the browser lane.

| Topic | Change | Receipt | Next |
| --- | --- | --- | --- |
| loading-data-with-useeffect | 1 select control to radio groups; 9 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| loading-and-error-states | 2 select controls to radio groups; 30 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| custom-hooks | 1 select control to radio groups; 9 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| routing-and-route-parameters | 1 select control to radio groups; 9 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| navigation | 1 select control to radio groups; 9 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |
| what-makes-a-component-re-render | 1 select control to radio groups; 9 QA actions | no receipt (no editor) | not applicable |
| lifting-state-up | 1 select control to radio groups; 3 QA actions | stale: html, qa-paths, harness, python-scan, T08 | replacement private proof required |

Non-browser gates on these bytes: T01, T02, T05, T07, T14, T15, T16, T19 and T24 pass. Source receipts were re-fetched live and every source returned HTTP 200. T06 fails only on this module's stale receipt bindings listed above (30 errors). T25 on `main` does not yet support the minimum profile, so it still requires critic coverage.

Sections below describe checkpoint `2221d3dc` and are superseded where they conflict with this section.

Base: readiness checkpoint `134d977` with main `817aeb6` merged. Gates ran on 2026-11-05 on Darwin arm64 with Playwright Chromium 140.0.7339.16 and the unmodified shared harness. `first-draft-manifest.json` remains the record of the original `a91aee3` bytes.

## What changed since 134d977

- Learner HTML on 6 of 7 pages: each editor block gained `id`, `data-pep-answer-sensitive` and `data-pep-answer-targets`. A `data-file` attribute was added only where the visible editor label names no file. No visible text or interaction changed. The estimator P50 and `artifact.md` were checked and are unchanged on each changed page.
- `qa-paths.json` on those pages: the private-success opt-in with one `answerSafety.tasks` entry per editor. `completion` and `progress` now assert that public routes stay incomplete at zero credit on the first editor.
- `sources.json` on those pages: re-fetched live and rebound; every source returned HTTP 200.
- `qa-receipt.json` on those pages: added in an evidence-only child of its proof commit, carrying metadata and the five public bindings only.
- GIFT banks, catalog IDs and curriculum are unchanged.

## Private success proof

6 topics and 6 editor tasks ran through the landed private runner on four routes each: success, wrongFirst, keyboard and sandbox. Each run also passed the runner's gate-owned check that every declared task reports completed, one credit and grade 1 and that the page completes. These runs were on this macOS host only.

Mixed-result refusal: at `be6f17c8`, the same bytes bound by every receipt, the runner refused all 6 of a deliberately failing overlay. On a page with several editors the first passes and the rest miss (mixed). On a page with one editor that editor misses (all-fail). The overlay claimed incomplete, so the refusal came from the gate-owned per-task check; a separate replay on the bound HTML and on the pre-correction routes confirmed each route ran to the end and left the failing task at completed false, credit 0, grade 0.

`what-makes-a-component-re-render` has no editor, so it has no answer-sensitive task, no opt-in and no private proof.

| Topic | Declared tasks | Receipt commit | Refusal run | T10 | T11 | T12 |
| --- | --- | --- | --- | --- | --- | --- |
| loading-data-with-useeffect | `#editor-task-4` jsx-editor: Profile | `d1fb3edb` | all-fail: refused | fail | fail | fail |
| loading-and-error-states | `#editor-task-3` javascript-editor: load | `e48bd0b2` | all-fail: refused | fail | fail | fail |
| custom-hooks | `#editor-task-3` jsx-editor: useToggle | `27d9943d` | all-fail: refused | fail | fail | fail |
| routing-and-route-parameters | `#editor-task-3` jsx-editor: App | `6506c44e` | all-fail: refused | fail | fail | fail |
| navigation | `#editor-task-4` jsx-editor: SaveButton | `e6027829` | all-fail: refused | fail | fail | fail |
| what-makes-a-component-re-render | none: no editor, no opt-in | none | n/a | fail | fail | fail |
| lifting-state-up | `#editor-task-3` jsx-editor: Accordion | `ea6468ad` | all-fail: refused | fail | fail | fail |

## Checks

Passing with the unmodified harness: T01-T09, T13-T16, T18-T20 and T24.

## Remaining failures

T10:
- 2: `Restart wrong check could not establish non-authored current controls`
- 5: `guidance setup must finish on a later attempted but incomplete unlocked activity`

T11:
- 2: `Restart wrong check could not establish non-authored current controls`
- 5: `#activity-2 data-pep-attempts expected "2"; got "0"`

T12:
- 7: `#activity-2 data-pep-settled expected "true"; got "false"`

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
| loading-data-with-useeffect | 8.53 | 12.2 | 13 | present |
| loading-and-error-states | 7.44 | 10.77 | 11 | present |
| custom-hooks | 7.33 | 10.66 | 11 | present |
| routing-and-route-parameters | 7.03 | 10.36 | 11 | present |
| navigation | 7.52 | 10.6 | 11 | present |
| what-makes-a-component-re-render | 5.2 | 7.12 | 10 | present |
| lifting-state-up | 7.15 | 10.48 | 11 | present |

## Current bytes

| Topic | artifact.html sha256 | artifact.md sha256 |
| --- | --- | --- |
| loading-data-with-useeffect | `bc4b2f425c7dcfa556f094fb9618e6a932b36b410e8895c41a6e688732312ac5` | `74a1ee4c5a946adc31111f102074262a4a5d6af180825a43abd546c5291b20f4` |
| loading-and-error-states | `40b2358b26258fc062378705556d01f87ecb58f27e88e2484b6acbdce4246c58` | `ef85e6529fe1b166090488b93bc2f7b39d43fcc706ca8771efcf778c0b2cc75d` |
| custom-hooks | `3bc18aa82d20c46f6b30eb999064da915206eba89466e2f88ebb6fa6882462b6` | `f49217fcfc8164bae6a7fc150c3f437b65ae7bb2f4e6ee5b2d364644e5fbcf43` |
| routing-and-route-parameters | `001f2e771444d0e0b853cf17421ac9ffa8e907ac3f61b9e10b99f92b51edc09c` | `fe9d7296d2083c633893119e845dc6128b0fe596b3b66897df9d5126721abd8a` |
| navigation | `6138b833d41ba826095d4a856538fdfefb93afd6eafe1a360c87b9857d5adb7e` | `53a50f4a3792e87fe885b5484efb6ac979e17a63d2cd7210e1bcad58f54fb670` |
| what-makes-a-component-re-render | `af4d1d7f26d4524bf011ee2087ee431383d8c9de3007bf5b18f9797bed0f1d6e` | `af222e44a86932656adf179feb679b29a1094e1be25cb44ff1db24396f98d986` |
| lifting-state-up | `6b80acc1dc998f6517691931cb50823ff84d8c4eb6fa3bfa693fb4f402b6a843` | `ad5f8d7f9eec35cb1e84bcde65b92f508543719ca31d9f4238f4655e74b3244c` |
