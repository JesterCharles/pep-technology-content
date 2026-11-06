# Readiness receipt: crud-aggregates-and-joins (corrected eight-page author checkpoint)

Author checkpoint only. No critic or reconciliation evidence is authored here, and author proof does not replace independent review.

This checkpoint applies:

- the education review of `97ad33ecf1c072636cfbcdc35100e21cc731c94a`: STATE-01 and EDU-02, plus five teaching-example overlaps found by the author;
- the SQL/JDBC SME review of `f82e7b5d07ee2af0c1c32c9668ed9f8c1f63a0bd`: SME-01 to SME-04;
- the learner guidance contract now on main (PR 43), which supersedes EDU-01's visible Goals list.

The pages also carry the answer-safe QA paths that QA-01 needed, using the private-input contract from PR 45. All eight pages stay **not upload-safe** until fresh independent education and SQL/JDBC re-reviews pass on these exact bytes.

## 1. Inventory

| Topic | artifact.html sha256 (current) | Approved before the SQL markers (584aa77e) |
| --- | --- | --- |
| insert-update-and-delete | `8d2f36621ab26b178b793c5585dfa9791358874daff25f400c8b1d130960bdd6` | `ee58712242863df67c7606a2cc889a43258084c07d76319d20de9fd39f19ca5f` |
| seeding-sample-data | `2d85267d3bdb2057c181b7a30fa7fe2735c8769b9bdc4bb638354e991b50f073` | `c8178ba69e56d8d33a271a1d89942ea57ca0d130a449c62f2568a6a766329220` |
| filtering-and-sorting | `987c3f13c6d5bea0f53d7c8059c52d5cf1c8ca04bb5605f2dd44a105ac32cf2f` | `db52c5886d71fd373400f2dd34604d2cdbbc69173c750007eaecc2ee6235c5ad` |
| handling-nulls-coalesce-and-case | `5e88982934d6833e105b6fe597705149920aefc82217fd9bafa66491186273dc` | `6fba5958a3945ac2cf21a012dd70d888f3786530db41eb85f1069f4aacaea249` |
| aggregate-functions | `b0f314d813b90174db42328caa143c3875706c1969812ca0b8a247446cca06da` | `53b552fc3baa547a153d7e27f0c1a1b95a9f293cdc0ef7c5370a9094492fc3c5` |
| group-by-and-having | `776cba1d1125c5314d21839c8836a6315c8a976020b0d3f7a1bcf78b0c363b00` | `e19553a08761d033250e9d0c971a1e1f040d8f809d15fa2191a1f646aae0ae0a` |
| inner-and-left-joins | `292cef62ab31ad49e0caa0c8b1b704a1cfd84a31bc0582c6b1d87d5a37f29d45` | `4fcd22aab345fe38f13bf7d7e6fd7bac7503cccebbec8c13ecab2af8e36a52e3` |
| anti-joins-and-self-joins | `64511025915b81676bd95785420b2508d46d1ed62e55e6e55a3c47bb449099c1` | `b33cb645482a92277099275793bb680c1578840b4a640aa89cd91e1ef5aa67da` |

The current bytes are the approved bytes plus the 16 SQL answer-sensitive marker attributes described in section 13; stripping those attributes reproduces the approved column exactly. Objectives, catalog topics and syllabus are unchanged. Every `topic.json` minutes record was refreshed with the frozen estimator. filtering-and-sorting rises from 12 to 13 minutes, because its new NULL-placement teaching raises the modeled worst path to 12.05; every other label and budget is unchanged.

## 2. Template and engine

Shared bytes, identical on all eight pages:

- complete `<style>…</style>` block: sha256 `d3daae680cae7a36abb91f39f80d965adfa7b5fd61532462ef9c4f7a33b9bd60`;
- `sql-practice-controller.js` (opening comment through `})();\n`, stamped in each page): sha256 `7245e51fff447f16f6ef3d0e35d218d98a6d0f974b7cdb3f69f5f1fc814b9929`;
- `shell.js` `8464aa8cd0f62e9d3306c497486159bf5dc0efd5e625947f0bd245b5c7134ef9` and `sql-practice-adapter.js` `a47cbd40c8dd09f8d133665bb7d1fb01391d16359d643747d331d51f5829ed83`, unchanged. The emulator is not generalized.

Shared corrections:

- **Objectives (guidance contract).** The page-wide Goals list, its CSS and its state code are gone. The objectives are now one native **Objectives** disclosure in the topic bar: `details[data-pep-objectives]`, with a summary carrying `aria-controls="objectives-body"` and one `li` per catalog objective in exact text.
  - Native click, tap and keyboard open it.
  - Escape and an outside click close it, and print expands it.
  - The optional desktop hover-open enhancement is not used.

  Observable requirements stay activity-local under **What success looks like** (`data-pep-activity-checks`). The Next-topic and recap source links are 44 px targets.
- **STATE-01.** Restart recomputes page state from current activity state. `data-pep-complete`, `data-pep-route-settled`, progress, credit and recap therefore agree, and re-completion earns one credit.
- **Settled is not success (Lambdas regression check, confirmed here).** Before this fix, the public wrong route on filtering-and-sorting showed this defect: after two failed runs, activity 2 read `settled=true`, `continue=true`, `completed=true`, `credit=1`, `grade=0`. Now a failed required activity, whether two failed editor runs or a wrong apply retry, only settles: `settled=true` and `continue=true`, with `completed=false`, `credit=0` and `grade=0`.
  - `completed=true` and `credit=1` need passing evidence: every local check passes, or the apply answer is correct. A prediction is unscored practice, so making one is its evidence.
  - A later passing run on a settled editor activity still completes it.
  - Page `data-pep-complete` is true only when every activity is completed. The new `data-pep-route-settled` is true when every activity is completed or settled, and it opens the recap. The recap names the settled activities as not passed.
- **SME-02 helpers.** `SQLCHK.nodes` and `SQLCHK.calls` read the adapter's existing parsed statement. They are read-only.

## 3. Page corrections

- **EDU-02 (handling-nulls).** The apply check requires `IS NOT NULL` in both forms.
- **Example overlaps.** No teaching or prediction statement passes its own editor task. The checks require the task's named columns, and for joins a two-key `ORDER BY`.
- **SME-01 (aggregate-functions).**
  - The percentage answer is `100.0 * COUNT(city) / COUNT(*)`, with bigint truncation explained.
  - The feedback adds the zero-row `NULLIF(COUNT(*), 0)` note.
  - Sources: `functions-math`, `functions-conditional` and `functions-aggregate`.
- **SME-02.** Result checks are kept, and each concept goal also needs a parsed-statement invariant:
  - a COALESCE call over `city`;
  - `count(*)` and `count(city)` from `students`;
  - `sum`, `avg`, `min` and `max` over `fee` from `courses`;
  - an aggregate inside `HAVING`;
  - a LEFT JOIN to `enrollments` with `IS NULL` on its right-side key;
  - two `instructors` aliases joined on `lead_id` = `instructor_id`.

  The six shortcuts the SME demonstrated stay incomplete. Equivalent shapes pass.
- **SME-03 (seeding).** These ordinary foreign keys are checked as each INSERT statement finishes; only a DEFERRABLE constraint waits until COMMIT. Source: `sql-set-constraints`.
- **SME-04 (group-by).** The rule is narrowed to this example, with one parenthetical note on PostgreSQL's grouped-primary-key functional dependency. Source: `sql-select`.

## 4. Sources

All eight `sources.json` receipts bind the current hashes in section 1. They were re-retrieved live on 2026-11-06 for the marker bytes: every official PostgreSQL URL, HTTP 200 status and cited section is unchanged, and the receipts list the retrievals per topic.

## 5. QA paths and gates

Each topic has a committed `authoring/evidence/sql-jdbc-foundations/crud-aggregates-and-joins/<topic>/qa-paths.json` with a `guidance` object (`hints: true`). The committed routes contain no completed editor statement:

- **Completion routes.** The committed `success`, `wrongFirst`, `wrongTwice` and `keyboard` routes reach the end of each page honestly. Their completion assertion is `data-pep-route-settled="true"`, and each route also asserts that `data-pep-complete` stays `"false"` and that every settled editor activity reads `completed=false`, `credit=0`, `grade=0`:
  - each editor task is settled with two public, non-solving runs of `SELECT * FROM students;`;
  - the formative prediction and apply MCQs are answered (allowed by the repository contract);
  - `wrongFirst` uses the apply retry, and `wrongTwice` settles the apply check.
- **Simulator edges.** An unsupported `CREATE TABLE` is a lesson limit with no attempt counted. Running the untouched starter earns nothing.
- **Restart.** The restart route completes, restarts and repeats the prediction, and its credit assertion stays at `1 of 4 done`.
- **Navigation setup.** The guidance navigation routes leave a settled grade-0 prediction plus one attempted, incomplete editor activity.

`answerSafety` declares the 16 SQL editor tasks: `#activity-2` and `#activity-3` on each page, each `language: "sql"` with `scan: "none"`, under `privateSuccessProof: true` (section 13). There is no SQL structural scan; the targets are underscore-normalized editor file stems used only by the generic encoded/digest guard.

Gate results on these bytes:

- **T08 to T13:** pass for all eight topics, by `authoring/tools/pep check --only T08` and `node authoring/tools/qa/run.mjs sql-jdbc-foundations/crud-aggregates-and-joins`.
- **T01, T02, T06, T07, T14, T15, T20, T24:** pass.
- **T18:** fails on all eight because `artifact.md` must be declared present for an HTML topic. That requirement predates this work. The Markdown companions are a cataloged deferral outside this module's HTML scope.
- **T25:** fails, as expected, until independent critic evidence exists.

Private completed-input proof (`run.mjs --private-overlay`) runs from uncommitted files outside the repository only. Its overlays reference `valueFrom: "private:<topic>-a2|a3"`, resolved through `PEP_QA_PRIVATE_INPUTS_FILE`. The result is recorded in section 6. No private value, answer or answer-derived hash is committed.

## 6. Hard blockers and handoff

Private completed-input proof, the source-owned private overlay mechanism with staging retired after each run. **Historical, unpublished evidence:** the runs below were made under the pre-PR-59 contract at commits that exist only on the unpublished old branch and are not ancestors of the publication head. The current proof is the eight `-9` receipt chains in section 13.

- aggregate-functions and group-by-and-having passed at public commit `7b83635f5340c47389553e8029911fd0c3b5ea6c`, in runs `crud-<topic>-6`.
- anti-joins-and-self-joins, filtering-and-sorting, handling-nulls-coalesce-and-case and inner-and-left-joins are byte-identical to their proof at `3d3e264ee7b24511e93b5bf2df9c9ad54d6a6ffa`, in runs `crud-<topic>-5`.
- insert-update-and-delete and seeding-sample-data are byte-identical to their proof at `929a14d4914673cbe3a22f9b6c821f135025e5a3`, in runs `crud-<topic>-3`.
- Each private success, wrongFirst, keyboard and sandbox route reached `data-pep-route-settled="true"` and `data-pep-complete="true"`, with both editor tasks reading `completed=true`, `credit=1` and `grade=1`.
- No private value was recorded.

Still required:

- the T18 Markdown companions, or a decision to keep them deferred;
- fresh independent education and SQL/JDBC SME re-review of these exact bytes, plus non-author reconciliation and T25.

## 7. Formative GIFT banks (2026-11-04)

- Added `artifact.gift` for all eight topics, following the agreed sibling-bank structure:
  - header comments and `$CATEGORY: sql-jdbc-foundations/crud-aggregates-and-joins/<topic>`;
  - titles that name the objective id;
  - exactly one correct option, and feedback on every option beginning `Correct.` or `Not quite.`.
- Each bank has two items per catalog objective, using new scenarios and distractors drawn from real misconceptions: 4 items for aggregate-functions and 6 for each of the other seven, 46 in total.
- Angle-bracket comparisons are written in words or as `BETWEEN`, because GIFT forbids `<` and `>`.
- Each `topic.json` now records `gift` as present.
- Validation:
  - `node authoring/tools/gift/validate.mjs` reports every bank valid (46 questions), and gates T16 and T07 pass.
  - A placeholder scan found no TODO, TBD or placeholder text.
  - None of the editors' completed private inputs appears in any bank.
- Correct-answer notation is the permitted formative GIFT exception. No assessment keys, rubrics, hidden tests, solutions or private inputs were added.
- At the time of this GIFT pass, learner HTML, `qa-paths.json` and the then-current private-overlay proof were unchanged. Section 13 later added the SQL markers and declarations and replaced that proof.

## 8. Combined correction pass (2026-11-06)

This pass corrects the education recheck and the SQL/JDBC SME review of `a9270e324d2e9161da7c4feba13739bd1c73d865`. CEDU-08 (re-grading after a revealed answer) and CEDU-09 (recap names) are deferred unchanged: Restart-after-reveal policy and recap polish are out of scope for this pass.

| ID | Artifact | Correction |
| --- | --- | --- |
| CEDU-01, SME-L1 | filtering-and-sorting HTML | Activity 3 now teaches NULL placement: NULL sorts as if larger, so `DESC` puts it first and `NULLS LAST` moves it. The task keeps courses with at least 3 credits, so the NULL-fee course reaches Output, and leaving out `NULLS LAST` gives a visibly wrong order. The check matches those rows, requires a credits predicate in WHERE, and requires course_id as the final sort key. The explicit `NULLS LAST` token is no longer required. |
| CEDU-04 | filtering-and-sorting HTML | Activity 3 drops the title condition, so its task no longer repeats the activity 2 example. |
| SME-L6 | filtering-and-sorting HTML | The comparison list names `!=` as an alias of `<>`. |
| CEDU-02, SME-05 | handling-nulls HTML | The CASE rule is now the true one: no comparison with NULL is true, so a NULL needs its own `IS NULL` branch before ELSE. Hint 1 and the criterion are rewritten to match. The `case` goal needs a CASE in the select list with a WHEN testing `fee IS NULL`, in any branch order. The dead `txt`/`indexOf` code is removed. |
| SME-L3 | handling-nulls, aggregate-functions, group-by-and-having, anti-joins-and-self-joins HTML | The checks now require the requested column names: `city_label`, `fee_band`, `total_fee`/`average_fee`/`lowest_fee`/`highest_fee`, `enrollment_count`, and `employee`/`manager`. |
| CEDU-04 | handling-nulls HTML | The COALESCE example now uses a column fallback, `COALESCE(nickname, name)` on `members`. The task's literal fallback over `city` stays as transfer. |
| CEDU-04 | anti-joins HTML | The self-join example now uses a generic `staff` table, `worker`/`boss` aliases and `boss_id`. The task maps the pattern onto `instructors` and `lead_id`. |
| CEDU-07 | anti-joins HTML | Activity 1 now reads "The list below holds some instructor ids and one NULL." |
| SME-L2, SME-L4 | group-by-and-having HTML | The page says ascending order already puts the NULL group last and that DESC would need `NULLS LAST`, and it now cites `queries-order`. The prediction feedback is narrowed to "grouping by city does not determine one name". |
| CEDU-03 | shared controller, all eight HTML | While an activity is not completed, success ticks show only the current run. |
| CEDU-05, SME-06 | handling-nulls GIFT | The distractor `phone != ''` is now `phone != NULL`, with accurate feedback. |
| CEDU-06 | group-by-and-having GIFT, seeding-sample-data GIFT | The cloned items now pose new decisions: which grouped query raises an ERROR, and on which machine a server-side `COPY` path must exist. |
| SME-L5 | anti-joins GIFT | The self-join distractor's feedback says PostgreSQL rejects the same table name twice in FROM without aliases. |

Old reviewed bytes fail each boundary. A private author probe ran the same cases on the `a9270e3` bytes and on these bytes, using Chrome and `file://`. Its SQL is held in uncommitted scratch and described here in words:

- **CEDU-01**
  - Old: a filter-correct query sorted `fee DESC, course_id` produced the expected Output but was not credited.
  - New: leaving out the NULL placement gives the wrong visible order and is not credited. The intended query is credited.
- **CEDU-02**
  - Old: a CASE with a wrong alias was credited. So was a CASE that labels the NULL fee only through ELSE, with no IS NULL branch.
  - New: neither is credited. The IS NULL branch placed after the numeric test is credited in both old and new, so no false order rule is enforced.
- **SME-L3**
  - Old: wrong or missing aliases were credited on handling-nulls activity 2, aggregate-functions activity 3, group-by activity 3 and anti-joins activity 3.
  - New: none is credited.
- **CEDU-03**
  - The committed seeding `qa-paths.json` edge "success ticks show the current run only" fails on the old bytes. After a passing first run and a failing second run, the `clean` tick still reads `done`.
  - It passes on the new bytes, where the tick reads blank and the activity shows `completed=false`, `credit=0`.

Sources: live official PostgreSQL retrievals on 2026-11-06, all HTTP 200:

- `queries-order` ("NULLS FIRST is the default for DESC order, and NULLS LAST otherwise") for filtering and group-by;
- `functions-conditional` ("If the condition's result is not true, any subsequent WHEN clauses are examined") and `functions-comparison` ("!= is an alias") for handling-nulls and filtering.

All eight GIFT banks still validate, at 46 items.

## 9. Narrow correction pass after the d442eeb rechecks (2026-11-06)

The pass changes only filtering-and-sorting activity 3 (CEDU-10, CEDU-11, SME-07) and anti-joins-and-self-joins activity 3 (CEDU-12). Every other HTML page, the shared controller (`7245e51f…`), the style and adapter regions, and all eight GIFT banks are byte-identical to `d442eeb`. CEDU-08, CEDU-09, CEDU-13 to CEDU-15 and the SME low residue are deferred unchanged.

**Filtering activity 3**

- The `filter` goal is now judged on the qualifying row set in any order, plus a credits predicate in WHERE. A correct filter stays credited when the sort or NULL placement is wrong.
- The `sort` goal needs all of the following, so the credits-DESC example shortcut and a fee key placed after another key are rejected:
  - the first ORDER BY key references `fee`, so `COALESCE(fee, …)` forms still pass;
  - `course_id` is the final key;
  - the exact expected order.
- Feedback names the failing clause: sort by fee first, then NULL placement, then fee order, then the final course_id. The tie-breaker note appears only when course_id is not the last key.

**Anti-joins activity 3**

- The task, hint 2 and the first criterion now state that the two result columns are named `employee` and `manager`.
- The `aliases` goal depends on correct rows and the self-join structure, not on the output names.
- When only the names are wrong, the single note asks for the column names.

**Old and new regressions.** A private probe used Chrome and `file://`; its SQL stays in uncommitted scratch and is retired after the run. It compared the `d442eeb` bytes with these:

- **Credits-DESC example shortcut (SME-07, CEDU-10).** Old: credited. New: `filter` done, `sort` open, note "sort them by fee first".
- **Fee placed after credits as a secondary key.** Old: credited. New: rejected the same way.
- **NULL placement left out (CEDU-11).** Old: `filter` open with a misdirecting tie-breaker note. New: `filter` done, `sort` open, NULL-placement note only.
- **Missing final course_id.** Tie-breaker note, old and new.
- **COALESCE-fee equivalent and the intended form.** Credited, old and new.
- **Hint-following self-join without output names (CEDU-12).** Old: both criteria open, plus an alias/join note. New: `aliases` done, `rows` open, naming note only.
- **Named self-join.** Credited, old and new.

**Committed value-free QA edges.** The public inputs stay below a near-solution. All three edges pass on the new bytes:

- filtering-and-sorting, "a wrong row set is not told to add a tie-breaker it already has". It fails on the `d442eeb` bytes.
- filtering-and-sorting, "a credits-first sort earns no sort credit".
- anti-joins-and-self-joins, "wrong rows get the row note, not the column-naming note".

## 10. Local finalization (2026-11-06)

**Static alternatives.** By firstmate decision, the six apply questions without one now carry an author-written `data-static-alt` on `fieldset#apply-a`. The pages are aggregate-functions, anti-joins-and-self-joins, filtering-and-sorting, group-by-and-having, handling-nulls-coalesce-and-case and inner-and-left-joins.

- The alternative lists the learner-visible question, its option set with the formative explanations, the marked answer and the retry answer, following the approved insert and seeding pattern.
- Removing that one attribute restores each page byte-for-byte to its approved `2a5bb566` bytes.
- No interaction, task, teaching, grading, answer or GIFT byte changed.

**Markdown companions.** `artifact.md` was generated once for all eight topics by the canonical `node authoring/tools/qa/md-from-html.mjs <artifact.html> <artifact.md>` and was not hand-edited. A completed-statement scan found no task answer in any companion. Each `topic.json` now declares `md` present, and T18 passes.

| Topic | artifact.md sha256 |
| --- | --- |
| aggregate-functions | `4c76dbc4ebc51ac2b2e796f592df013b0e65265cd258bcf7def21fb4aba848c2` |
| anti-joins-and-self-joins | `fa76fa58ae075b4ea88b3e1f6218071dafcc9be0436b7522eb95533683c3f39f` |
| filtering-and-sorting | `2544f457e273eccce7a622325ce5fab7c7ece94e4a8369d87380bb876d1ba314` |
| group-by-and-having | `d9710debf302a1e3c5705c61477aeefa4fe72fbe75c37e6a19f8496c64b7f466` |
| handling-nulls-coalesce-and-case | `0058b843c3f3e95e05354dca4405ec7f7bb9b052d45e652513f170d16aab81e5` |
| inner-and-left-joins | `f80679b934801772546714afea71cd8f6765e77634d1394f29288225b082fd84` |
| insert-update-and-delete | `e973b9e0a315c32c3946c724287cff25ed85aa4a3c59b8d9c2f35c1a8ff7ab81` |
| seeding-sample-data | `193fb020cfa480cdd0a3a0e7af7f76e128ae2e7926d258cb3c5589001f48a62e` |

**Critic and reconciliation records.** These are transcribed from the filed independent reports only. No finding, approval, evidence or review was invented.

- `critic-education.json` and `critic-sme.json` per topic:
  - authored by `pep-m-sql-crud-edu-d442` and `pep-m-sql-crud-sme-d442`;
  - bound to the d442eeb bytes they reviewed;
  - for the six pages unchanged at 2a5bb566, the exact-byte approval transfer by the 2a5b reviewers is noted in the author field.
- `critic-education-recheck.json` and `critic-sme-recheck.json` for filtering-and-sorting and anti-joins-and-self-joins:
  - authored by `pep-m-sql-crud-edu-2a5b` and `pep-m-sql-crud-sme-2a5b`;
  - bound to the 2a5bb566 bytes;
  - CEDU-10, CEDU-11, CEDU-12, SME-07 and the anti-joins L-res-3 are recorded as resolved.
- `reconciliation.json` per topic:
  - `decidedBy` is firstmate, a non-author; the module author is recorded only as `author`.
  - CEDU-10, CEDU-11, CEDU-12 and SME-07 are accepted and closed.
  - CEDU-13 to CEDU-18, SME R1 to R4 and the carried L-res items are accepted as valid LOW observations, retained as non-blocking and deferred. CEDU-08 and CEDU-09 were reconciled in earlier rounds and are not part of these two reports.

**Privacy limitation.** The filed reviews used a browser tool path that is not an untraced success mechanism, and none of its inputs or arguments is carried into any record.

- Success-boundary evidence for these pages is only the source-owned private overlay proof and its retired-staging receipts (section 6).
- The committed public negative QA edges are value-free guards. They are not the private old/new success-boundary proof.

**T25.** T25 reports missing current education and SME coverage for the six HTML files that gained the attribute. That is expected until the requested narrow independent recheck of the new static alternatives, the derived companions and the exact identity of all other page regions is recorded. Coverage is current for all eight GIFT banks and for insert and seeding HTML, and every finding is reconciled.

## 11. SME-08 rendered-fidelity correction (2026-11-06)

The two independent static/Markdown reviews of `39e355f9af5d62301c6f288db0329cc44e1f66f2` are recorded per topic as `static-critic-education-recheck.json` (`pep-m-sql-crud-static-edu-39e3`) and `static-critic-sme-recheck.json` (`pep-m-sql-crud-static-sme-39e3`), each a recheck of that topic's base critic record,. Each is bound to the bytes reviewed: `artifact.html`, `artifact.md` and `artifact.gift` at 39e355f9.

- Each `reconciliation.json`, decided by firstmate, accepts CEDU-19 as a deferred LOW owned by shared tooling, with no exporter task in this pass.
- On aggregate-functions and group-by-and-having it accepts SME-08 as fixed.

**Correction.** On aggregate-functions and group-by-and-having only:

- The activity 4 `fieldset#apply-a` `data-static-alt` value now wraps each SQL option, the retry answer's SQL and every remaining `COUNT(...)`/`SUM(...)` fragment in Markdown code spans.
- The question, options, explanations, marked answers and retry semantics are unchanged.
- Each page is byte-identical to 39e355f9 outside that attribute value.
- No script, style or print helper reads the attribute, so the visible, no-JavaScript and print HTML is unchanged.
- The two `artifact.md` companions were re-derived once with `md-from-html.mjs`.
- Every other learner byte (six HTML, six Markdown, eight GIFT) and the shared controller and style are byte-identical to 39e355f9.

**Rendered-text proof.** The proof renders the activity 4 static alternative with the repository's markdown-it configuration from `pdf-from-md.mjs` (`html: false, linkify: true, typographer: false`):

| Topic | 39e355f9 | Current |
| --- | --- | --- |
| aggregate-functions | 1 of 7 `COUNT(*)` survive; 3 `<em>` spans | 7 of 7 survive; 0 `<em>` |
| group-by-and-having | 0 of 10 `COUNT(*)` survive; 5 `<em>` spans | 10 of 10 survive; 0 `<em>` |

All four option boundaries are kept in both topics. The full current render of all eight companions contains no `<em>` element.

## 12. Final COUNT(*) rechecks and closeout (2026-11-06)

Both focused rechecks approve checkpoint `584aa77e0e984241068b518b6110a0816f337760` on its exact learner bytes. They are recorded on aggregate-functions and group-by-and-having as `countstar-critic-education-recheck.json` (`pep-m-sql-crud-countstar-edu-584a`) and `countstar-critic-sme-recheck.json` (`pep-m-sql-crud-countstar-sme-584a`). Each is bound to the reviewed `artifact.html`, `artifact.md` and `artifact.gift`.

- SME-08 is recorded as resolved.
- The education recheck's one new LOW, CEDU-20, was evidence-only: section 1 listed the two Markdown hashes in the HTML column for these two pages. It is corrected here in `readiness.md` only; no learner, lock-bound source or catalog byte changed for it.
- CEDU-19 and the other deferred LOWs remain deferred as previously reconciled.
- The SME report's tooling follow-up remains outside this module: either escape plain-text alternatives in `md-from-html.mjs` or document that `data-static-alt` is Markdown source.

## 13. SQL answer-sensitive declarations and current private proof (2026-11-06)

PR 59 (`44171c7aa628e5dc7f4a0880e5e8b85f2c16bfcb`) added the `sql` answer-sensitive language. The publication branch merges that main non-destructively and then adds only these bytes.

- **HTML markers.** Each of the 16 `section.pep-activity` hosts `#activity-2` and `#activity-3` gains ` data-pep-answer-sensitive="sql" data-pep-answer-targets="<target>"`. Each host contains exactly one `sql-practice@1` editor root and its `.sql` file label, as the landed contract requires. Stripping the attributes reproduces the approved `584aa77e` bytes. No objective, task wording, SQL behaviour, feedback, static alternative, Markdown or GIFT byte changed.
- **Targets.** The targets are underscore-normalized editor file stems, for example `student_counts` for `student-counts.sql`. Under `scan: "none"` there is no SQL structural scan; T08 feeds the targets only to the generic encoded, assembled and digest guard.
- **Declarations.** Each `qa-paths.json` adds one `answerSafety` block with `privateSuccessProof: true` and the two matching `sql` / `scan: "none"` tasks; no other qa-paths byte changed. The public routes still settle both editor activities at `completed=false`, `credit=0`, `grade=0`.
- **Proof chain.** Declarations and markers landed at P `7ca3bf4a66bd1d7a196c4a462b9b5eee5488fe33`. Each topic was then proved at the current tip, and its receipt was added in the immediate child commit, which changes only that receipt and the module lock:

| Topic | Proof commit | Run | Receipt commit |
| --- | --- | --- | --- |
| aggregate-functions | `4e3eeee4b88ad04454a6782fbae58c613411fb11` | `crud-aggregate-functions-9` | `398b92de` |
| anti-joins-and-self-joins | `398b92de` | `crud-anti-joins-and-self-joins-9` | `ac97b5da` |
| filtering-and-sorting | `ac97b5da` | `crud-filtering-and-sorting-9` | `50aeea70` |
| group-by-and-having | `50aeea70` | `crud-group-by-and-having-9` | `0176b327` |
| handling-nulls-coalesce-and-case | `0176b327` | `crud-handling-nulls-coalesce-and-case-9` | `832acb40` |
| inner-and-left-joins | `832acb40` | `crud-inner-and-left-joins-9` | `786400da` |
| insert-update-and-delete | `786400da` | `crud-insert-update-and-delete-9` | `0ac252b7` |
| seeding-sample-data | `0ac252b7` | `crud-seeding-sample-data-9` | `b11a8d85592be03480e824063c8aad7943b3cd5d` |

- **Superseded receipts.** An earlier commit, `4e3eeee4`, recorded all eight `-8` receipts from one pass at P at once. That breaks T06's rule of one receipt per immediate child, so the chain above superseded it forward without rewriting any ref. No current receipt carries a `-8` run.
- **Bindings.** Every receipt binds exactly five files: the topic's `artifact.html` and `qa-paths.json`, `authoring/tools/qa/harness.mjs`, `authoring/tools/qa/python-answer-scan.py` and `authoring/tools/checks/T08-html-static.mjs`. They are byte-identical from P to the head.
- **Results.**
  - Every run passed all four private routes, with both declared tasks reading `completed=true`, `credit=1` and `grade=1`, and the page complete.
  - Mixed (one editor passing) and all-fail runs at P were refused 16/16 by the runner's own declared-task gate.
  - Staging was created per topic outside the repository and deleted before each receipt.
  - No private value, derivative or hash is recorded in any public byte or ancestor commit.
- **Rechecks.** Two independent focused exact-byte rechecks of `b11a8d85` approve the marker, declaration and proof scope: education `pep-m-sql-crud-proof-edu-b11a` (no findings) and SQL `pep-m-sql-crud-proof-sme-b11a`. They are recorded per topic as `proof-critic-education-recheck.json` and `proof-critic-sme-recheck.json`.
  - SME-P01 (medium, evidence-only) and SME-P02 (low, optional wording) are both accepted and corrected in this readiness refresh. The same edit folds in the education report's matching optional wording note.
  - All earlier teaching, SQL, static-alternative, Markdown and GIFT approvals transfer by exact region identity.
- **Superseded statements.** Gate statements in sections 5 and 6 describe earlier checkpoints. At the current head, T01–T08, T14–T16, T18, T20, T24, T25 and browser T09–T13 pass.
