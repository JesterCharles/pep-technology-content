# Readiness receipt: java-foundations/classes-and-objects (author checkpoint)

Author-side evidence for the nine canonical learner HTML pages of this module.
It is not critic or reconciliation evidence: independent education and Java-SME exact-byte reviews of all nine pages are still required, and no page is badged verified until they pass.

## 1. Scope and objectives

- Catalog `module.json` `topicOrder` lists ten entries; `classes-in-practice-project` has `kind: lab-brief` and is excluded from the learner-page count. The nine learner topics below each have one `artifact.html` in the single canonical tree (no Standard/Fast copies).
- Each page's Objectives disclosure lists its `topic.json` objectives verbatim (three per topic). No objective was added, dropped or reworded.
- Companions: `artifact.md` is present because gate T18 requires it for every HTML topic; it is derived by `authoring/tools/qa/md-from-html.mjs` from the page, never hand-edited. GIFT, video and PDF companions are absent with recorded reasons in each `topic.json` (HTML-first build).

| Topic | Kind | Objectives | Activities | P50 / worst path / budget (min) | Page sha256 (prefix) |
| --- | --- | --- | --- | --- | --- |
| `access-modifiers` | core | 3 | predict → lanes → code → mcq | 7.45 / 14.03 / 15 | `7acfc37840c4bf86` |
| `classes-and-objects` | core | 3 | predict → lanes → code → mcq | 8.32 / 14.65 / 15 | `bd43efa5f6b02bf3` |
| `constructors` | core | 3 | predict → lanes → code → mcq | 8.42 / 14.75 / 15 | `f2c637b37b65f391` |
| `double-equals-vs-equals` | core | 3 | predict → lanes → code → mcq | 8.24 / 14.57 / 15 | `ed33f92a8a8bd2b2` |
| `encapsulation-with-getters-and-setters` | core | 3 | predict → lanes → code → mcq | 7.81 / 14.14 / 15 | `2e24812095df1a3e` |
| `enums` | core | 3 | predict → lanes → code → mcq | 8.63 / 14.71 / 15 | `23f2bcde3df45e8c` |
| `final-and-tostring` | reading | 3 | predict → lanes → code → mcq | 7.95 / 14.53 / 15 | `0f8eca3608ea9048` |
| `stack-vs-heap-and-object-references` | core | 3 | predict → lanes → mselect → mcq | 9.64 / 13.72 / 14 | `71354d66e5677c0b` |
| `string-immutability` | core | 3 | predict → lanes → code → mcq | 7.58 / 14.16 / 15 | `14e9b2418f7e1efa` |

## 2. Template and engine provenance

- Design source: root `DESIGN.md` and the guidance contract in candidate `885207e034695aaf109ef0afe61fb1de50af9468` (topic bar with Objectives disclosure and Restart, reversible Previous/Next with locked future steps, activity checks, nested progressive hints, Where this fits, optional Anecdote and Challenge, bounded editor workspace). No shared tooling, schema or component was changed.
- Every page embeds the same shell bytes, so the shell is proven once and reused by hash:
  - shell CSS sha256 `5e59bb286dc42fa465ac0d64972bae066e009af56b7b5edd129e6f122ca2c804`
  - activity engine JS sha256 `92e841c836358666cf295bd8cc4c7ff30642b0095eec178f29a705e2f5803792`
- Page-specific bytes are the activity HTML and the `window.PEP_PAGE` data block (options, explanations, lane items and per-task structural checks).
- `data-pep-guidance-contract` is set on each page. `qa-paths.json` follows the schema on `main`, which has no `guidance` object; when the candidate tooling lands, each page needs that object added (generalized-validator item, non-blocking per captain intent).

## 3. Sources

- Each topic's `authoring/evidence/java-foundations/classes-and-objects/<topic>/sources.json` was produced by `authoring/tools/net/check-links.mjs`: every source returned HTTP 200, and the receipt binds the current page bytes.
- Sources are the Java SE 25 JLS and JVMS, the Java SE 25 API (Object, String, StringBuilder, Enum, IllegalArgumentException) and dev.java tutorials.
- The riskiest claims were re-read in the live text on 2026-10-16: default constructor and its access (JLS 8.8.9); enum constructors may not be public or protected (8.9.2); non-enhanced switch statements need not be exhaustive (14.11.2); identical string literals refer to the same instance (3.10.5); reachability (12.6.1); the `Object.toString` form; `String.trim` returning this string when nothing is removed.
- `freshness.status` stays `unverified`, with the pending SME review listed as the unverified item.

## 4. Direct artifact proof (headless Chrome, `file://`, network blocked)

For all nine pages:

- Full route with correct answers (code tasks solved with private solutions held only in scratch, never committed) and full wrong-twice route: page completes, credit 1 per activity, grade 1 or 0, no console or page errors, no network or sibling-file requests.
- Restart on the last activity resets only that activity's credit; earlier credit and page completion are kept. Timeline link then browser Back restore activity state without resets. A deep link to a locked `#activity-3` lands on activity 1.
- No horizontal overflow at 320, 390, 768 and 1280 px for every activity, nor at 640 px with device scale 2 (200% zoom equivalent), in dark and forced-colors modes.
- Keyboard: radios, confidence and Check operate from the keyboard; focus moves to feedback after a check and to the next heading after Next; Objectives opens with Enter and closes with Escape.
- Touch at 390 px: tap completes Activity 1. Source-list links were under 44 px and were raised to 44 px targets in the shared shell.
- Print: all four activities render, every disclosure expands, navigation hides, and `afterprint` restores the closed state.
- JavaScript disabled: all four activities and each activity's expected-results reading render.
- The estimator (`authoring/tools/timing/estimate_reading.py`) gives P50 7.71 to 9.64 min. The worst path is modeled in each `topic.json` basis. Day totals: F9 = 60 and F11 = 74 of 120 minutes.

## 5. Answer safety

- Coding tasks check structure (declarations, modifiers, statement shapes) against the topic's own criteria, using token tests. No completed solution exists in any learner-visible HTML, JavaScript, no-JS reading, hint, cheat sheet or QA JSON.
- A whole-document scan of the raw and entity-decoded bytes of every page for the private solutions' key statements found no hits. One earlier draft hit, cheat-sheet rows that restated Activity 3 answers, was fixed before this checkpoint.
- The committed QA routes reach completion on the code activities only through the settle path (two checked, incomplete tries). They contain no solution text.
- Formative MCQ and lane answers appear in explanations and no-JS readings, as the repository contract allows for low-stakes practice.

## 6. Status and hard blockers

- Hard blockers found and fixed before checkpoint: the answer exposure through cheat sheets; and a code check that counted an unchanged starter as a try (it no longer does).
- Correction after checkpoint `ff961d7` (firstmate inbox 003): T13 reported `ed-3` clipped on access-modifiers (desktop) and classes-and-objects (phone-320). Cause: the editor's line-number gutter grew past the textarea's height cap (400 px, or 240 px on narrow screens), so the code region scrolled and moved the textarea outside its box. The shared shell now caps the gutter at the same height, hides its overflow and keeps it scrolled in step with the textarea. Only those shell CSS and JS lines changed; page content, `artifact.md`, timing and QA routes are byte-identical to the checkpoint.
- Open, owned by the next steps: independent Codex education and Java-SME exact-byte reviews of all nine pages (T25 critic coverage is expected to fail until they land); the GIFT, video and PDF companions; and the `guidance` QA object once the candidate tooling merges.

