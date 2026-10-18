# Readiness receipt: reporting-indexes-and-review (author checkpoint)

Author checkpoint only. Independent education and SQL/JDBC-SME review has not run; no critic or reconciliation evidence exists.
Learner pages: six (the catalog lab-brief `jdbc-data-access-project` is excluded and not authored).

## Shared template bytes (identical on all six pages)

- Shared CSS block, from the sorting-with-comparator template at candidate 885207e lineage: sha256 `0c6c59f9ccaa1bad7bc76d150f344351bf0c6e1273fb1b44c6ab5ab74a866f76`.
- Shared engine script (navigation/state/Restart/print/objectives, `predict@1` and `mcq-with-confidence@1` component JS byte-equal to `components/`, lane sort): sha256 `6c714cb2917cc824d1616d7ea01132a57e9c1146e2346b07a0ae3a69d0b0120c`.
- Page-specific bytes: the body, the `window.PEP_PAGE` data script, the `indexes` CREATE INDEX checker, the `jdbc-review` injection explorer and its small CSS block.

## Components

| Page | Activities | Budget | Main harness (T09 T10 T12 T13 T18) | T11 | Direct proof |
| --- | --- | --- | --- | --- | --- |
| subqueries-and-ctes | predict, lanes, 2 MCQ | 13 | pass | routes, edges, restart pass; optional-at-load fails (see blockers) | pass |
| window-functions-top-n-per-group | predict, lanes, 2 MCQ | 13 | pass | same | pass |
| indexes | predict, CREATE INDEX editor, lanes, MCQ | 11 | pass | same | pass |
| query-plans-with-explain | predict, lanes, MCQ | 9 | pass | pass | pass |
| sql-review-joins-grouping-window-functions | predict, lanes, MCQ | 9 | pass | same as row 1 | pass |
| jdbc-review | predict, 2 MCQ, injection explorer, lanes | 15 | pass | same as row 1 | pass |

Main harness (`node authoring/tools/qa/run.mjs`, local, 2026-10-16) covered offline/file and no-JS (T09), sandbox `allow-scripts` routes (T10), axe/keyboard/contrast in light and dark (T12), 1366, short desktop, 320, 390, 844 landscape, 768, 200% zoom, touch and overflow (T13), and Markdown parity (T18).
Direct proof script (Playwright, 390 and 320 px) on every page: deep link past the frontier ignored; Next then browser Back/Forward restores activities with feedback kept; Previous focuses the heading; Restart clears only the current activity and keeps the frontier; forced colors at 320 px dark has no overflow and keeps topic-bar borders; print shows every activity and the recap, hides navigation, opens every disclosure and `afterprint` restores them; no-JS print shows every activity without overflow; zero console errors and zero network requests.
Every SQL result and error message quoted on the SQL pages was run on PostgreSQL 17.5 (PGlite); EXPLAIN plan lines are quoted from the current manual.
Answer scan: no committed route or page byte contains a fitting CREATE INDEX statement; the editor success route is the honest two-miss settle. Formative MCQ answers are revealed after settling, as the contract allows.

## Hard blockers and open items

- None reproduced on a page for answer exposure, inaccessible controls, external dependency, broken state/navigation, hidden required content or overflow.
- Main-branch T11 `optional-accounting` clicks the first optional disclosure at initial load, but contract-placed disclosures live in later, hidden activities; 885207e's harness reaches them by navigation. Validator mismatch, not reproduced as a page defect.
- `qa-paths.json` follows the main schema; the 885207e `guidance` object is not present.
- T25 critic gate will fail until independent reviews and reconciliation exist.
- GIFT, video and PDF companions and the planned module coding lab are deferred (reasons in `topic.json`); `artifact.md` is generated because T18 requires it for HTML topics.
