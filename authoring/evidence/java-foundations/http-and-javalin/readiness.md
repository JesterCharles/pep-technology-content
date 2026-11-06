# http-and-javalin readiness receipt (author first build)

Module: `java-foundations/http-and-javalin` (Foundation days F15-F16).
Author: Claude Opus 5.5, first build, 2026-10-16; updated the same day after the resource pause to close the two recorded author-side gaps (Markdown companions and the guided local-run lab). This is the author's checkpoint, not a review: an author's first output is never accepted, and no critic or reconciliation evidence exists yet.
Scope: the four learner HTML pages, their derived `artifact.md` companions, and the `routes-and-handlers-in-javalin` topic coding lab. Other companions are honestly absent with reasons in each `topic.json`.

## 1. Topics and objectives

The catalog `topicOrder` has five entries. Four are learner topics with a page in this build; the fifth, `repository-wiring-and-errors-project`, is `kind: lab-brief` (the F16 project brief) and is excluded from the learner-page count and from this build.

| Topic | Kind | Objectives (catalog text, unchanged) | Where practised |
| --- | --- | --- | --- |
| `how-a-request-travels` | reading | o1 trace URL to response; o2 URL parts; o3 localhost and port | o2 URL-part sort (A2); o1 request-trace sequence (A3); o3 apply check (A4) |
| `http-methods-status-codes-and-json` | core | o1 methods, safe/idempotent; o2 status class and code; o3 JSON with nesting and arrays | o1 method sort (A2) and safe/idempotent sort (A3); o3 JSON editor (A4); o2 apply check (A5) |
| `routes-and-handlers-in-javalin` | core | o1 trace route and Context call; o2 write/register handler **+ guided local run**; o3 exception handler **+ guided local run** | o1 predict (A1), Context sort (A2), trace apply (A5); o2 POST-handler editor (A3); o3 exception-handler editor (A4); both via the required guided local run (end of A4) in the topic coding lab, section 6 |
| `lambdas-as-handlers` | core | o1 anonymous class to lambda; o2 lambda implements the single abstract method; o3 method reference | o1 editor (A2); o2 functional-interface sort (A3) and predict (A1); o3 editor (A4) and apply check (A5) |

No objective text, topic, track copy or syllabus row was added or changed. One canonical tree serves Standard and Fast.

## 2. Template and engine reuse (hash proof)

- Template source: the frozen proven learner-page design of `collections-streams/collections-in-depth/sorting-with-comparator/artifact.html` at `9dfdec4` (blob `a4fed90cb31f59ebafcb3afdeeea9304ea869a6c`, file sha256 `feb3fdda012976e687effeba46918c0b412d2e01812fa110ab1301a881142530`), which integrates guidance-contract candidate `885207e` (DESIGN.md and HTML contract read at that commit).
- Shared `<style>` block (lines 14-408 of that file, including the `predict@1` and `mcq-with-confidence@1` component CSS and the noscript style): byte-identical in all four pages, sha256 `84bbf8308917473fb89eee24ee319c7ea331483d020fbc53fd93885c86909810`.
- Shared lesson engine `<script>` (guidance state, `predict@1` and `mcq-with-confidence@1` component JS copied unchanged from `components/`, lane sort, sequence, bounded editor shell, current-only Restart, reversible navigation, objectives, print helper): byte-identical in all four pages, sha256 `29d22e2da4711141784c6e45c33355a209eabdb3dd91b0dfe38e6034eb1c9cd9`. It generalises the reference engine to N activities and keyed interactions; its behaviour was proven once per page by the direct proof below, not by re-proving internal mutations.
- Shared Javalin practice interpreter (`var JV`, bounded parser and request simulator): byte-identical in the two Javalin pages, sha256 `537c448317225e21b626bf9ed8b044310735dd824ef9e38916ef529b8d7f2789` (its default 404 and 500 bodies now match a real Javalin 7.2.3 run).
- Page-specific bytes per page: the `<head>` metadata, `<main>` content and the `PEP_PAGE` data script.
- No shared tooling, schema, component, DESIGN.md or other module was changed.

| Page | artifact.html sha256 | Bytes | Activities |
| --- | --- | --- | --- |
| `how-a-request-travels` | `57457ad5fde091d14b4934e68cf945e1b3b455badfa17614ecdf4831437a2bf3` | 85 596 | 4 |
| `http-methods-status-codes-and-json` | `471fd517f7f9c7ef2a346bb70f4026cd3e3d63d96449ad47c3a39634f220778c` | 92 076 | 5 |
| `routes-and-handlers-in-javalin` | `68e7acf9e068d626ff3e4dd1f080cede2aef4b89cc403415c8033dbf02313f04` | 117 327 | 5 |
| `lambdas-as-handlers` | `41b8d686617a8ed61f9d613bf87b1ba2d8b5c1b2eddaec997815a563b7db1fb6` | 112 068 | 5 |

## 3. Direct artifact proof (per page, final bytes above)

Run locally with Playwright 1.55.0 driving installed Google Chrome, against each `artifact.html` from `file://` with every non-page request blocked. All four pages: **PASS** on every item below.

- Offline and standalone: no network or sibling-file request attempted; zero console errors or uncaught exceptions in every context.
- Routes: success, wrong-first-then-correct, and wrong-twice settle routes each reach `data-pep-complete="true"`; settled checks report "settled, not correct"; editor routes include compile-error, unsupported-form and wrong-behaviour runs before the passing run.
- Navigation and state: completed timeline link, Previous, browser Back; a typed future fragment (`#activity-3`) does not bypass the locked frontier; Restart clears only the current activity (credit 0) while other activities stay completed and the frontier stays.
- Responsive: 320×568, 390×844, 768×1024 (touch), 1366×768 and 683×384 (the 200% zoom CSS viewport of 1366×768), each in light and dark: no page-level horizontal overflow at load, with Objectives open, and on every activity with all its disclosures open after a wrong-twice route; every visible button, summary, timeline and back link at least 44×44 CSS px. Forced colors at 390 px: no overflow.
- Keyboard: the full success route by keyboard activation only (Space on radios, Enter on buttons, typed editor input), with a visible 2 px focus outline on each activated control; Objectives open with Enter and close with Escape.
- Sandbox: the wrong-twice route and timeline navigation complete inside `<iframe sandbox="allow-scripts">` at 390×844 (opaque origin; storage unused).
- No JavaScript: every activity section and its activity checks render, every workspace has its noscript reading (editors carry `data-pep-no-js` readings with starter, accepted subset and how to compare), and the recap renders.
- Print: under print media every activity heading renders; `beforeprint` opens every closed disclosure and `afterprint` restores all of them.
- Whole-document answer scan: no completed editor input from the QA routes, and no answer-only statement of one (18+ characters, not a starter line), appears anywhere in the page bytes after HTML-entity and JavaScript-escape decoding. Two exposures found during the build were removed (an Activity 5 code sample that showed the Activity 4 exception handler; cheat-sheet lines that showed a method-reference answer and the POST registration line).
- Timing: frozen estimator (`estimate_reading.py`, sha256 `0deca96b…f96f`) measured each final page; modeled worst paths and budgets are in each `topic.json` `minutes.basis`: 13.89 → 14, 14.96 → 15, 15.00 → 15, 14.98 → 15 minutes (the guided local-run instructions on the Routes page count toward its required time; the lab's own work is in `lab.json` minutes). Lane items and prose were trimmed to stay within the 15-minute cap; no interaction was removed to pass.

Not run in this pass (by firstmate instruction: cheap per-page smokes only; Codex-backed module QA follows): the repository's deep Playwright gates T09-T13, axe, contrast and colour-vision transforms, and `npm run check` as a whole. `qa-paths.json` files use the current `main` schema; see section 6.

## 4. Sources

Every page carries a "Sources and review date" disclosure. Each topic has `sources.json` (retrieved live 2026-10-16, HTTP 200, page sha256, sections used) bound to its final artifact bytes: MDN HTTP overview, DNS, Port, Methods, Status, Safe, Idempotent; RFC 3986, 6761, 8259, 9110; Javalin 7.2.3 documentation, Javadoc (`Handler`, `ExceptionHandler`) and `ExceptionMapper.kt` source at tag `javalin-parent-7.2.3`; JLS SE 25 chapters 9 and 15; dev.java lambda and method-reference pages. Freshness stays `unverified` until the SME critic verifies the bytes; open unverified items are listed in each `topic.json`.

## 5. Accessibility, privacy and honesty notes

- Native `<details>` objectives, hints (nested in order, `data-section-skip`) and optional disclosures; anecdotes are code-free; challenges are paper-only and never touch required state.
- Every option is explained; graded checks give one retry in a second representation, then settle; confidence is reported and never scored.
- Editors are honest simulators: unsupported forms report "not supported in this practice editor"; Javalin's default 404 body is shown as a placeholder note rather than invented text; an exception with no handler gives 500, as in Javalin 7.2.3's `ExceptionMapper`.
- No telemetry, no storage dependence, no external learner dependency, no credentials or private inputs.

## 6. Guided local-run lab (routes-and-handlers-in-javalin o2, o3)

- Bundle: `java-foundations/http-and-javalin/routes-and-handlers-in-javalin/coding-lab/` (lab.json, README.md, starter with `pom.xml` pinning `io.javalin:javalin-bundle:7.2.3`, JUnit 6.1.3 and Maven plugins, public tests in `tests/`, `expected/test-summary.txt`). One test command, `mvn -q -o test`, after one-time `mvn -q dependency:go-offline`; no container engine.
- Public checks (`pep.books.BookAppTest`, javalin-testtools against the real app on a free localhost port): Task 1 POST answers 201 with the saved book as JSON, and the book is then listed (o2); Task 2 a missing book answers 404 with `{"error":"No book with id 99"}` (o3); an existing book still answers 200.
- The starter compiles and fails exactly the three declared tests with stable `Task 1` / `Task 2` messages; the private solution passes all four. Solved-run evidence with the file bindings is `coding-lab-solved-run.json` in this module's evidence (added in the evidence-only commit after the lab commit). The solution stays in uncommitted private staging.
- Solved run: `solved at a2643911aa4d01abdbe23e6fc02668debbdb5a95 by run local-20261016T225510Z-temurin25.0.4.1-maven3.9.16` (macOS arm64, Temurin 25.0.4.1, Maven 3.9.16, empty private Maven repository): starter fails the three declared tests identically twice; the private solution passes 4 of 4 with no terminal output; four private variants each fail the intended test; cleanup leaves only the shipped files. Private staging was retired after the run.
- The Routes page now ends Activity 4 with a required **Guided local run** section that sends the learner to this lab.

## 7. Open items

- Review pending: independent education and Java/HTTP-SME critics on exact bytes of all four pages and the lab, then non-author reconciliation. No critic evidence exists; T25 fails until it does.
- Companions still absent by scope: `artifact.gift` and `video-artifact.md` for all four, and `artifact.pdf` for the Reading topic; reasons recorded per topic. `artifact.md` is now present for all four, derived with `authoring/tools/qa/md-from-html.mjs`.
- Guidance-contract QA sequencing: pages carry `data-pep-guidance-contract`, but `main`'s `qa-paths.schema.json` has no `guidance` object yet (candidate `885207e`, PR 43, adds it). The committed `qa-paths.json` files validate against `main`; when PR 43 lands, each needs its `guidance` object added.
- Lab coverage: the solved run is recorded on macOS only; Linux and Windows are not yet recorded.
- Gate status (cheap static gates): T01-T08, T14-T20 and T24 pass on the lab commit. T25 fails until critic evidence exists. Deep browser gates T09-T13 were not run in this pass; the direct per-page proof in section 3 was rerun on the changed Routes and Lambdas bytes.
- Observation (nonblocking, template-level): in a Playwright `srcdoc` sandbox iframe, a pointer click on an option label did not toggle its radio; the same happens on the frozen reference page, and the route passes in a `file://` sandbox iframe. Worth a check in the platform's real embed.
- The QA route files necessarily contain completed editor inputs (evidence, never learner-visible), as on the sibling Java module.
