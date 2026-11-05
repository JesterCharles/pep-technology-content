# Readiness record: react/effects-routing-and-rendering

Status: **unreviewed first drafts, not delivery-ready.** This author-side record routes later review. It approves nothing, waives no gate, replaces no education or React-SME review, and marks nothing final, green, upload-safe, published or merged. No critic or reconciliation record exists for this module.

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
| loading-data-with-useeffect | `f2b7120af19553e520b34c75129252858f198fd08dd1042820c52c4cc4c9909b` | `74a1ee4c5a946adc31111f102074262a4a5d6af180825a43abd546c5291b20f4` |
| loading-and-error-states | `570e006919254721de5c62e137167f77f0a5605f72e95a4af23cb61e1d744910` | `ef85e6529fe1b166090488b93bc2f7b39d43fcc706ca8771efcf778c0b2cc75d` |
| custom-hooks | `1e72ce5c98d4bcc15ee64447f7a48808d3d29f311805df110b060e69a3eb31a9` | `f49217fcfc8164bae6a7fc150c3f437b65ae7bb2f4e6ee5b2d364644e5fbcf43` |
| routing-and-route-parameters | `f2a9b93253dfab4ef48539a9241b0789637291de31516547e8b3be58e61fb90a` | `fe9d7296d2083c633893119e845dc6128b0fe596b3b66897df9d5126721abd8a` |
| navigation | `7605d260ea3ec82946db353fd311a83969541131bc81b4676020294944f93f9d` | `53a50f4a3792e87fe885b5484efb6ac979e17a63d2cd7210e1bcad58f54fb670` |
| what-makes-a-component-re-render | `533b8e273d90c9bb361ea8471b9d233eeacd0a6dd7afb74157d673f83085abd5` | `af222e44a86932656adf179feb679b29a1094e1be25cb44ff1db24396f98d986` |
| lifting-state-up | `7c65ec73d6fc3c29ff13bbdc39412b8a108dc6337f297efb8893daa619952f7e` | `ad5f8d7f9eec35cb1e84bcde65b92f508543719ca31d9f4238f4655e74b3244c` |
