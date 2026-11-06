# Authoring notes: python-fundamentals

Author: Claude Opus 5.5, one author context for all nine topics, in `topicOrder`. These notes are for the critics and reconciler; they make no review claim.

## Page shape

- Every page follows root `DESIGN.md` lesson anatomy (2026-10-15): a topic bar (the only `h1`, activity position, done count and the honest minutes label, Restart activity), then a reading and instruction panel (step heading, teaching, the visible Goals list that keeps `data-pep-objectives`, this activity's checks and numbered steps) beside a workspace (the step's task, model, interaction, feedback and Continue). The regions stack below 960 px. The shared shell CSS is `page-shell/shell.css`, pasted first in every page and checked by `lesson-editor/module-regressions.test.mjs`.
- Activities run predict (not scored), teach-then-do activities, an apply check with confidence, one retry in a second form and a settled state, then a recap with a cheat sheet and sources. Functions, exceptions, script files and pytest have five activities: the code-writing editor is its own activity, placed after every construct it requires has been taught and practised.
- The page engine (progress, restart snapshots, predict, apply, retry and settle logic) follows the structure of `git-linux-ai-foundations/linux-foundations/navigating-the-shell/artifact.html`; no course-1 content is copied.
- Option groups are radio buttons rather than `select` elements so the keyboard route is identical on every platform.

## Mobile and optional disclosures (2026-10-15, contract from main 9271193)

- Every page enrolls with `<main data-pep-responsive>` after passing the 320/390/768, phone-landscape, touch and 200% zoom matrix (T13). On the eight stepped pages each activity is one `<section class="pep-act" data-step="N">` whose reading region (`data-pep-instructions`: teaching, then the four-part steps) precedes its workspace (`data-pep-workspace`: `code` for the one editor activity, `activity` otherwise), so instructions precede the interaction in source and visual order.
- `page-shell/shell.css` adds the mobile rules once for all nine pages: wrapping topic-bar progress, 44 × 44 radio targets (a 20 px drawn dot inside a 44 px native input), 16 px text entry with 16 px scroll margin below 480 px, and phone bounds of 240 px for the editor and 180 px for Problems/Output, `.out` and the terminal log, with boundary scroll returning to the page. The editor shortcut legend and simulator badge are the only chrome hidden below 480 px; file name, Run, Reset code, Problems, Output and status stay visible. The stamped lesson-editor and terminal fragments are unchanged.
- Each code workspace holds one `<noscript data-pep-no-js>` reading (task, starter, supported subset, how to compare, expected result; no completed answer). It and the optional extras carry `data-section-skip`, so required-path words, code lines and P50 are byte-for-byte the same as before this pass and every timing record stands.
- Optional disclosures sit inside their activity: an anecdote at the end of that activity's teaching, a challenge after its feedback. Anecdotes (8) are code-free everyday stories with one `data-pep-anecdote-story` and a short `data-pep-anecdote-map`: a thermometer read two ways (syntax, activity 3), a courier's bundling and unpacking windows (functions, 3), a bakery's queue, sign, register and price board (collections, 2), the librarian's walk (slicing, 3), the wall whiteboard (mutability, 4), the food-hall pantry and shopping list (modules, 2), the newsroom threshold (exceptions, 3) and the recipe card's last step (scripts, 3); none answers its page's opening prediction. Challenges (5) on functions (4), slicing (3), exceptions (3), scripts (4) and pytest (4) extend only taught constructs, state optional time and success criteria, and contain no controls, answers or completed code. Collections, mutability and modules omit a challenge, and pytest omits an anecdote, because nothing specific would add value there.

## No-JavaScript linear reading (2026-11-05)

- JavaScript is a progressive enhancement of a complete source-order reading. The head sets `pep-js` on `<html>`; nothing in the stage is authored `hidden`, and the engine hides every non-current activity on load. Without JavaScript every activity reads in order (teaching, the four-part steps, the workspace prompt and model, a static result) followed by the recap; only the inert controls, feedback, Continue, Restart and the progress bar are hidden.
- Each non-editor interaction is followed by a `<noscript data-section-skip>` static result that renders its author-written `data-static-alt` (the terminal's comes from `TOPIC.termAlt`); each editor activity keeps its `<noscript data-pep-no-js>` reading. Both are excluded from the timing estimate, and the model caption stays on the first activity only, so every P50 is unchanged.
- Settled is not passed (2026-11-05). The unscored prediction is informational and completes when answered. A required check that settles after its retry (the apply question) lets the learner continue but stays not done with no credit: progress reads "N of M done · 1 settled, not passed", its segment shows settled, and reaching the recap sets `data-pep-complete="false"` with a "not complete yet" message unless every activity passed. Restart on that activity retries it for credit. `wrongTwice` proves the settled state, then restarts and passes; a separate simulator edge proves the page stays incomplete.
- The engine finds per-activity regions by `data-region` (the former container ids: `current-task`, `current-control`, `current-feedback` and so on) instead of by id, which keeps Restart snapshots and feedback lookups working.

## Terminal component

- `modules-imports-and-virtual-environments`, `writing-and-running-script-files` and `testing-with-pytest` embed `components/terminal` version 1 unchanged (html, css and js fragments with markers; T24) and declare `"components": {"terminal": "1"}`.
- The fragment's HTML is fixed and carries no `data-static-alt`, so each page sets the author-written terminal alternative (`TOPIC.termAlt`) on the `.term` element when the page loads; `artifact.md` carries it under "Static interaction alternatives".
- The other six pages contain no terminal and declare no components.

## Simulator fidelity

- Every Python result, error message, traceback, log line and pytest report shown was produced by running the same code on CPython 3.14.6 with pytest 9.1.1 and pip 26.1.2 on 2026-10-13, and the pip and pytest runs were re-recorded on 2026-10-15 (`tool-runs/`), then embedded as data; nothing is computed by imitation except slice positions, which use CPython's slice-index rule and match the embedded results, and the lesson editor below.
- The terminals simulate bash on a fictional Linux machine (`sam@pep:~/shop`). Unsupported commands say "not available in this practice terminal"; Windows commands get a pointer to the Windows form.
- The pip install output is shortened and says so; the system-Python install refusal (`externally-managed-environment`) models a Debian-style system Python.

## Lesson editor

- Captain requirement (2026-10-14): Python pages need an embedded editor for learners who cannot use a terminal.
- `python-syntax-for-java-developers` activity 2 now uses it. The learner fixes a half-translated `describe()` in a VS Code-inspired editor with a gutter, Problems, Output and a status bar. This replaces the six radio-button line choices that tested the same objective.
- Free-form editing serves this objective best: the objective is writing Python block syntax (colons, indentation, `elif`, `+=`, no types), and the line choices let learners recognise the answer without producing it.
- Source: `lesson-editor/` holds a language-neutral shell (`lesson-editor@3`) plus the Python (`python@1`), scaffold (`python-scaffold@3`) and comprehension (`python-comprehension@1`) adapters. Each page inlines stamped copies; `drift.test.mjs` keeps the copies identical to the source. `import-proof.mjs` writes an Evolv-like import receipt per page, and the differential test checks the adapter against CPython 3.14.6. The README states the contract, the statuses and the limits.
- Code-writing objectives use the editor (DESIGN.md Real Task Rule): the syntax pilot (`python@1`); the functions, exceptions, script-files and pytest scaffolds (`python-scaffold@3`, structural validation only); and slicing activity 3 (`python-comprehension@1`), where the learner types a list comprehension and a set or dict comprehension that a bounded evaluator runs on `prices` (differential-tested against CPython in `comprehension-differential.mjs`). No completed answer is committed: the scaffold and comprehension positives come only from authorized uncommitted private fixtures outside the repository, and the four scaffold topics prove success through the private-success overlay (`answerSafety.privateSuccessProof`).
- Collections and mutability keep sorters and call buttons, and modules, script files and pytest keep the terminal component: their objectives are choosing, predicting and running tools rather than writing a statement.
- Real tool runs behind the venv and pytest simulators are recorded in `tool-runs/` (`record.py` writes `pip.json` and `pytest.json`); the regressions compare the pages with those receipts.

## Timing

- `modeledP50` is the frozen estimator's P50 on the final bytes; `modeledWorstPath` adds per-unit worst-route minutes recorded in each `minutes.basis`. Budgets total 115 minutes for S14+S15 pages on FT9 (limit 120): S14 49, S15 66, and T14 passes every calendar day. The 2026-10-15 correction (DESIGN.md shell, a separate editor activity on four pages, the typed comprehension editor) re-timed every page: functions, collections, mutability, modules, scripts and pytest keep their budgets, syntax drops from 14 to 13, slicing rises from 11 to 12 and exceptions from 13 to 14; every topic stays at or under 15.

## Scope

- Per-topic artifact applicability (html, md, gift, video text alternative, PDF, topic lab and module lab), with the contract lines cited, is in `artifact-applicability.md`. Every topic has a verified video companion (`video-search.md`); no PDF or lab is required.

- No coding lab (module and topic manifests record the omission); no project assets: the intake places the Fast registrations project package at course level, outside a module branch, with its slot still open for the Fast overlay.
- `artifact.md` files are generated with `authoring/tools/qa/md-from-html.mjs`; GIFT files are validated with `authoring/tools/gift/validate.mjs`.
