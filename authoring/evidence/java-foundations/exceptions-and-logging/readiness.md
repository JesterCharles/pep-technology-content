# Exceptions and Logging: author readiness receipt

Author checkpoint for the five canonical learner HTML pages of `java-foundations/exceptions-and-logging` (F14).
This is the author's own evidence; it is not critic or reconciliation evidence.
Independent education and Java-SME reviews of the exact committed bytes are still required.

## 1. Catalog and objective coverage

The five topics and their objectives come unchanged from `authoring/catalog/java-foundations/exceptions-and-logging/*/topic.json` (intake rows 40-44, F14, relation exact).
No objective was added, removed or reworded.

| Topic | Objective | Practised in |
| --- | --- | --- |
| checked-vs-unchecked-exceptions | o1 checked vs unchecked in the Throwable hierarchy | Activity 1 predict; Activity 2 lane sort (7 classes) |
| | o2 declare with throws or handle | Activity 3 bounded Java editor (`firstLine`, declare or handle) |
| | o3 choose checked or unchecked | Activity 4 apply check with confidence and retry; Where this fits |
| try-catch-finally-and-try-with-resources | o1 catch specific, order most to least specific | Activity 1 predict; Activity 2 bounded Java editor (`ratio` catch order) |
| | o2 predict when finally runs | Activity 3 lane sort (6 situations) |
| | o3 try-with-resources | Activity 4 apply check on close order; Where this fits; optional challenge |
| custom-exceptions | o1 define a class with a message-and-cause constructor | Activity 2 bounded Java editor, edit 1 |
| | o2 throw for a broken business rule | Activity 2 editor, edit 3; Activity 3 lane sort (custom or standard); Where this fits |
| | o3 wrap without losing the cause | Activity 1 predict; Activity 2 editor, edit 2; Activity 4 apply check on `getCause()` |
| reading-stack-traces | o1 type, message, first own frame | Activity 1 predict; Activity 2 lane sort (6 trace pieces) |
| | o2 follow Caused by: to the root | Activity 3 lane sort on a three-level chain |
| | o3 helpful NullPointerException messages | Activity 4 apply check with retry |
| logging (Reading) | o1 why log instead of println | Activity 4 apply check with retry; Where this fits |
| | o2 choose a level | Activity 1 predict (threshold); Activity 2 lane sort (7 events) |
| | o3 log an exception with its stack trace, without sensitive data | Activity 3 bounded Java editor (one SLF4J call, five observable checks) |

## 2. Sources and technical truth

- Per-topic receipts: `authoring/evidence/java-foundations/exceptions-and-logging/<topic>/sources.json`, live official pages retrieved 2026-10-16 (all HTTP 200), each bound to the current `artifact.html` by `reviewedSha256`.
- Every compiler message, stack trace and program output on the pages was produced on OpenJDK 25.0.4.1 (Temurin), including: `unreported exception IOException; must be caught or declared to be thrown`, `exception NumberFormatException has already been caught`, the multi-catch subclassing error, `is never thrown in body of corresponding try statement`, try-with-resources close order with and without an exception, `System.exit` skipping `finally`, `getCause()` with and without a cause, the PriceList, Cart and ReportLoader traces, and the two helpful NPE messages (plus the `-g` local-name case).
- SLF4J behaviour (placeholder filling, an unfilled `{}` printed literally, a trailing throwable printed as a stack trace, `e.getMessage()` printed as text only, INFO default of slf4j-simple) was observed with SLF4J 2.0.17 and slf4j-simple 2.0.17.
- Honest gaps, listed in each `topic.json` `freshness.unverifiedItems`: independent SME verification is pending; on the logging page, the sources define SLF4J levels but not which everyday event belongs at each level, so the Activity 2 assignments are taught practice for SME judgement.

## 3. Design and template reuse

- Production template: `collections-streams/collections-in-depth/sorting-with-comparator/artifact.html` on branch `fm/pep-m-collections-streams-collections-in-depth` (git blob `a4fed90cb31f59ebafcb3afdeeea9304ea869a6c`), the guidance-contract page built on candidate `885207e034695aaf109ef0afe61fb1de50af9468`, read with that candidate's root `DESIGN.md` and `authoring/docs/html-artifact-contract.md`.
- The whole `<style>` block of every page is that template's style block, byte for byte: sha256 `0c6c59f9ccaa1bad7bc76d150f344351bf0c6e1273fb1b44c6ab5ab74a866f76` on all five pages.
- The engine script is one byte-identical block on all five pages: sha256 `bc47182aed866353f0eb7513fbbd9a3be9b348d0d9bc2a11a9cdcb897d3f0d1a`. It is the template engine generalised only so the activity order comes from page data (`acts`), plus a shared editor shell whose checker each page supplies. Guidance state, Restart, navigation, history, objectives and print code are the template's logic.
- Embedded `predict@1` and `mcq-with-confidence@1` CSS and JS fragments equal `components/*/component.*` byte for byte on every page.
- Only the first `<script>` (`window.PEP_PAGE`: page data and the page's bounded checker) and the `<main>` content are page-specific.
- Each page carries `data-pep-responsive` and `data-pep-guidance-contract`, Objectives disclosure, activity checks, nested progressive hints inside `data-pep-may-stall` tasks, Where this fits where a real choice exists (omitted on reading-stack-traces), code-free optional anecdotes, and Previous/Next with back links.

## 4. Direct artifact proof (cheap author smokes)

Run on the final bytes in system Chrome through Playwright, offline from `file://`:

- Full required route on every page: predict, every lane sort, every editor (starter, wrong forms and a correct form), and the apply check reach `data-pep-complete="true"` and "Topic complete."; Restart on the current activity drops only that activity's credit; Previous keeps state.
- 320 dark, 768 light, 1280 dark and 390 no-JavaScript: zero horizontal overflow on all five pages; one visible activity with JavaScript, all four plus the recap without it; print media shows all four activities; no visible control under 44 px tall.
- No page error, console error or non-`file:` request on any route.
- Visual spot checks: checked-vs-unchecked Activity 3 at 1280 dark and reading-stack-traces Activity 3 at 390 dark match the template anatomy.

Not yet proven by the author and left to the module QA pass: keyboard-only route, 200% zoom, forced colors, sandboxed iframe, touch emulation, and the full `npm run check` harness under its pinned Chromium (that Chromium is not installed in this workspace).

## 5. Answer safety and privacy

- Learner pages: a whole-document normalised scan of each `artifact.html` (head, styles, comments, `<noscript>`, static alternatives, hints, inline scripts) found no complete successful editor input for any of the four editor activities.
- Hints name where to act and the next reasoning step; none contains a finished statement.
- Static alternatives, `<noscript>` readings and `data-static-alt` restate tasks, starters, supported subsets and observable targets only.
- Formative MCQ and lane answers appear in no-JavaScript readings and feedback, as the template and contract allow for low-stakes practice.
- QA evidence: committed `qa-paths.json` files hold no successful editor input, in plain or encoded, hashed or obfuscated form. A recursive scan of every string in every committed `qa-paths.json`, `sources.json`, `topic.json`, the module lock and this receipt found none. Editor routes stop at public-safe steps: starter run, an unsupported form reported as not supported, Reset code, and assertions that the activity stays incomplete and Next stays disabled.
- Successful editor proof runs only from uncommitted author staging outside the repository. It was re-run on the current bytes, and all four editor pages reached `data-pep-complete="true"`. The inputs are not logged, hashed or committed.
- The card number on the logging page is the obviously fake `1234-5678-9012-3456`. No credentials, learner data, telemetry, storage, external fetch or runtime dependency.

## 6. Gates and hard blockers

- Metadata: `topic.json` minutes come from the frozen estimator (P50 8.2 / 9.06 / 8.54 / 9.1 / 7.82) with modelled worst paths, giving budgets 14 / 14 / 14 / 14 / 13 (F14 total 69 of 120). HTML is present. Markdown, GIFT, video and the Reading PDF are honestly absent, deferred to a companion pass. Components are declared. The module lock is regenerated.
- `qa-paths.json` follows the current main schema. Every committed route, the keyboard route, Restart and every simulator edge was replayed in Chrome and passes its own assertions. Only reading-stack-traces, which has no editor, completes the topic publicly. On the other four pages the public routes stop at the editor, so the harness completion check (gate T11) cannot pass from committed bytes alone. Their success proof is the private staging run in section 5. This is a known, intended gap, not a page defect.
- `qa-paths.json` and the `guidance` object: the candidate-only `guidance` object is not written because main's schema rejects it; if PR #43 merges first, the `guidance` object must be added for the `data-pep-guidance-contract` marker.
- Critic evidence (T25) is absent by design: it comes from the independent reviews, not the author.
- Hard blockers found by the author: none.
