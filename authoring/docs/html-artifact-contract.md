# HTML artifact contract

Provenance: restates the rules of the course-1 author contract, "Git/Linux/AI Foundations — local learner HTML authoring", as adopted for this repository.

This contract governs every topic's `artifact.html` and its companions.
The gates in `authoring/docs/workflow.md` check it mechanically wherever a rule is machine-checkable.

## 1. Place in the tree

- Each authored learner topic lives at `<course>/<module>/<topic>/`; there is no `topics/` level and there are no parallel versioned build folders. Pending topics live only in `authoring/catalog/`.
- `artifact.html` is the primary learner artifact and the single source of truth for the topic's learner content.
- A learner topic directory may contain only `artifact.html`, `artifact.md`, `artifact.pdf`, `artifact.gift`, `video-artifact.md` and `coding-lab/`; its metadata is `authoring/catalog/<course>/<module>/<topic>/topic.json`.
- Hashes are generated into `authoring/catalog/<course>/<module>/module.lock.json`; authored files never carry their own hashes.

## 2. Standalone learner artifacts

Every learner-facing artifact remains usable when copied without sibling repository files. Core teaching, assessment, visuals, data, and interaction must be present in that artifact.

An HTML learner page is one plain HTML file. It embeds all required CSS, JavaScript, data, and accessible visuals; uses system font stacks; and works from `file://` and in the required sandbox. It must not load a stylesheet, script, font, image, media file, frame, object, worker, module, or data file by relative path or network URL, and it must not make a runtime network request for core behavior. Inline CSS, inline JavaScript, inline accessible SVG, and embedded data that does not require another file are permitted.

Markdown companions, PDF/handouts, video text alternatives, GIFT exports, and course- or module-level learner pages carry their core content in their own bytes. They must not require a sibling image, stylesheet, script, font, template, JSON/data file, or companion artifact. PDF fonts and required assets are embedded. External citations and optional navigation links may remain links, but following a link is never required to understand the artifact or complete its core interaction.

Reusable authoring components are copied into the learner artifact. A source marker may identify where copied bytes came from; it is not a runtime dependency.

## 3. Platform-embeddable

- Every interaction works inside an iframe with `sandbox="allow-scripts"` only: no `allow-forms`, `allow-same-origin`, `allow-popups` or `allow-modals`.
- No interaction depends on form submission; controls dispatch directly in JavaScript.
- Every storage access is wrapped in `try`/`catch`, because an opaque origin throws.
- No `alert`, `confirm` or `prompt`.
- Links open in place with `rel="noopener"`.

## 4. Interactive learning shape

- Follow root `DESIGN.md` for page anatomy. New or re-authored pages mark their root `<main data-pep-responsive>` to opt into the deterministic 320/390/768, touch and zoom contract; migration is per page, never a marker-only mass edit. Add `data-pep-guidance-contract` only when the page also adopts every required guidance hook below and every applicable conditional hook.
- A topic bar contains activity position, honest "about N min" text, a usable **Restart activity** control and one native `[data-pep-objectives]` disclosure labeled **Objectives** or **What you’ll learn**. Objectives are informational and print expanded; they are not a page-wide Goals task. Native focus/click/keyboard/tap remain available even if fine-pointer hover also opens it; Escape and outside click close the enhanced view. The bar uses the contract's clearest accent surface and rail; reading/instructions stay quieter than the bordered card surface around `[data-pep-workspace]`.
- The learner predicts before any teaching.
- The page builds one mental model.
- Teach then do, 2-3 times, with at most 120 words per teach step and nothing used before it is taught.
- In source and visual reading order, all instructions needed for an interaction precede that interaction. A page under the current `data-pep-responsive` contract marks the pair with `data-pep-instructions` and `data-pep-workspace`; both are present and instructions come first. A task heading says **Your task** and names the action and location precisely enough that the learner can state what to do and where.
- When the topic or activity presents a meaningful practitioner choice, put one `[data-pep-where-fits]` peer section after the relevant core explanation and before its locally owned task/workspace. It is never nested in teaching, a task, workspace, hint or optional disclosure. It gives one directly owned, non-empty authentic decision (`data-pep-fit-decision`), good-fit use (`data-pep-fit-good`) and when-not-to-use boundary (`data-pep-fit-boundary`) in that order. One topic-level section is enough unless distinct activities genuinely present different choices; each additional section belongs to a different activity. Omit it when no useful decision exists rather than manufacture boilerplate. It is distinct from the optional anecdote and contains no activity answer.
- Per-activity requirements are a visible peer region after that activity's non-empty task in `[data-pep-activity-checks]`, labeled **What success looks like** or **Activity checks**, never Goals or course objectives. They are not hidden, inert, disclosure-wrapped or borrowed from nested content.
- Use root `DESIGN.md`'s stable semantic surface roles: `[data-pep-where-fits]` is a card with an accent rail; top-level `[data-pep-hint]` and required `[data-pep-activity-checks]` use accent-soft help/requirement surfaces and accent rails; the anecdote is a neutral card with a strong-neutral rail; and the optional challenge is a control surface with a strong-neutral rail. The same type keeps the same token role everywhere. Success, warning and danger colors remain exclusive to actual states. Color is never the only cue: each role retains its prescribed visible label plus boundary/rail and source-order placement in screen, forced-colors and print modes.
- An apply check asks for a real confidence rating before showing feedback.
- A recap closes the required path, with an optional cheat sheet marked `data-section-skip`.
- The page offers at least 2 genuine manipulations, not just reading and clicking "next".
- Every option is explained, right or wrong.
- A wrong answer gets one retry, then the answer is revealed.
- An answer locks once settled.
- Each activity can restart without duplicate credit; the last edit counts. Restart remains a 44 px target at narrow widths, resets only the current required activity to its authored start, clears its feedback and credit, preserves every other activity's work, and never duplicates credit. It does not re-lock an already unlocked activity. It may close optional disclosures; if it resets an optional challenge starter, that reset is still optional and cannot change required progress.

### Reversible activity navigation

- Put an accessible **Previous activity** button (`data-pep-previous`) beside Continue/Next (`data-pep-next`). Use native buttons with visible labels and 44 px targets; do not use a gesture, shortcut or hover as the only navigation.
- Completed and current timeline steps are revisit-able anchors (`data-pep-activity-link`). Future steps remain visibly locked with `aria-disabled="true"` and script guards until completion advances the unlocked frontier. A URL fragment cannot bypass the frontier.
- The state model keeps current activity, a monotonic unlocked frontier, every live input, attempts, settled state, visible feedback, completion, awarded credit, grade contribution, Continue availability and required time separately. Backward, forward and timeline navigation change only current activity; they never rebuild controls, clear values, revoke completion or issue credit. Enrolled pages expose these values through the stable `data-pep-current-activity`, `data-pep-unlocked-through`, `data-pep-required-minutes`, `data-pep-attempts`, `data-pep-settled`, `data-pep-completed`, `data-pep-credit`, `data-pep-grade`, `data-pep-continue` and `data-pep-feedback` QA hooks.
- Explicit page navigation pushes `#activity-N`; browser Back/Forward restores the matching unlocked activity through history/hash handling without resetting state. Move focus to the destination heading after an in-page button/link action, not after browser history traversal.
- With JavaScript disabled, every activity remains an ordinary visible `<section id="activity-N" data-pep-activity>` reached from an `href="#activity-N"` table of contents and followed where useful by an ordinary `data-pep-back-link`. Author source without `hidden`; progressive enhancement hides non-current sections.
- Navigation and preserved state work from `file://`, offline and in the required sandbox. QA author routes only establish page-specific states; harness-owned postconditions activate Previous/Next, current/completed timeline links and back links, a locked future link, guarded future fragment, history and Restart across top-level and sandbox pointer, keyboard and 320/390 touch contexts. Setup must leave meaningful live input in at least two activities, one prior honestly settled/completed activity with exactly one credit, and a later unlocked, attempted but incomplete current activity; a no-op route is not evidence. The harness retains pre-setup authored controls and required time, then verifies the author-established setup state before it owns navigation and Restart. At initial load, after setup and at each harness destination, the current task and its direct activity-check heading and criteria remain visibly rendered on screen. The bounded rendered check rejects structural hiding, ordinary zero opacity and a computed zero-valued `filter: opacity()` component, including percentage and combined-filter serialization; it does not claim pixel, contrast, clipping, blending or arbitrary-paint proof. Each sandbox child viewport must equal its configured desktop or 320/390 phone dimensions before the same invariants run. Restart checks change eligible text/editor, checkbox, radio-group and select controls only to prove exact authored restoration; arbitrary divergence is never submitted. Attempted and prior completed current activities reset directly while every non-current value stays exact. The harness does not force a fresh completion or reactivate a settled disabled control; the authored Restart route proves bounded re-completion, with grade separate from settlement/completion. Hint and optional traversal uses the wrong-twice route plus harness-owned unlocked timeline navigation so later owners receive the same pointer, keyboard, touch, sandbox and responsive checks. Screen readers receive activity names, `aria-current="step"`, locked state and a named Previous/Next group. Print shows all activity sections and omits only navigation controls.

### Optional learner disclosures

A page MAY include either, both or neither of these native disclosures. Omit one when it adds no specific learner value; never fill it with boilerplate. The required teaching and practice remain complete when disclosures are absent or never opened.

- **Anecdote** uses `<details class="pep-optional pep-optional--anecdote" data-pep-optional="anecdote" data-section-skip>`. Its `<summary>` learner label is **Another way to think about it** and includes **Optional example**. Its body contains exactly one `data-pep-anecdote-story`: a concrete everyday story, analogy or plain-language mental model. It is code-free: no code or syntax, pseudocode, API name, terminal command, exact program output or second copy of the technical explanation. One optional `data-pep-anecdote-map` may connect the story to the concept in one short plain-language sentence (at most 25 words). QA applies one-pass canonical UTF-8 base64, percent and hex-byte decoding before its bounded high-confidence syntax, API, explicit Python built-in, common-command and exception/output classifiers; generic call-shaped prose and ordinary words remain legal. Human education and SME review still judges disguised technical restatement and truth. It remains accurate, introduces no prerequisite and never replaces the complete core explanation.
- **Challenge** uses `<details class="pep-optional pep-optional--challenge" data-pep-optional="challenge" data-section-skip>`. Its `<summary>` label is **Challenge (optional)**. Its body states an estimated optional time in `[data-pep-optional-time]` and clear success criteria in `[data-pep-success-criteria]`. It extends or combines only objectives already taught.

Both disclosures are closed by default and appear inside the relevant activity section: Anecdote after the complete core explanation, and Challenge after the required practice and feedback. They do not create heading-level jumps; a disclosure nested under an `h2` activity may use `h3` internally, but its summary is not treated as a heading. Native toggle focus stays on `<summary>`; scripts do not move focus on open or close. Summary and any controls are at least 44 × 44 px, keyboard and touch operable, visibly focused, and screen-reader named. Disclosure content cannot depend on hover, a shortcut or JavaScript and remains in source order for no-JavaScript and assistive-technology reading.

Optional disclosures and descendants MUST NOT carry `data-interaction`, `data-confidence`, `data-pep-objectives`, `data-pep-complete`, or another required-progress/completion hook. Their `data-section-skip` marker excludes their words and code from the required time estimator. Opening, closing, attempting or resetting one never changes Continue availability, required progress, completion, grade, the topic's "about" label or its required time budget. Optional time is additional and is labeled as such; it is not added to `pep:budget-minutes`.

A code challenge may reuse the page's editor with a visibly resettable starter, but is not a second required workspace. It MUST NOT contain or expose a complete answer, hidden solution, rubric, secret test, answer key or client-visible reference implementation. All optional copy is public-safe because the standalone HTML is learner-visible source.

In print, both disclosure bodies expand and retain their **Optional example** / **Challenge (optional)** labels and optional-time cue; interactive buttons may be omitted. A `beforeprint` listener may open closed optional disclosures and an `afterprint` listener MUST restore only those it opened. Without JavaScript, native disclosures remain readable and can be opened before printing. Restart does not alter print output. Progressive enhancement may remember disclosure state only through guarded storage, but the authored default is closed and native HTML remains complete without script.

### Progressive optional hints

- Put a native `<details data-pep-hint data-pep-hint-for="task-id" data-pep-hint-order="1" data-section-skip>` inside every uniquely identified `[data-pep-task][data-pep-may-stall]` where a learner may reasonably stall. This canonical containment is what “beside the task” means in the layout. `data-pep-hint-for` resolves to that exact non-empty task id in the same nearest activity.
- The first visible summary text begins **Need a hint?** and later summaries begin **Another hint**; each includes its ordinal and activity, such as **Hint 1 of 3 for Activity 3**. Chromium-computed accessible names retain that prefix, ordinal and activity and are unique across the page; `aria-label` or `aria-labelledby` cannot replace them with duplicate or incomplete names.
- Each hint owns exactly one non-empty `data-pep-hint-target` sentence naming where to act and one non-empty `data-pep-hint-step` sentence revealing the next reasoning step. It does not give the answer, a finished expression, hidden solution, reference implementation, private test or scoring material.
- Prefer one hint. Multiple hints use `1..N` in DOM order and nest hint 2 inside hint 1's body, hint 3 inside hint 2, and so on. A later summary is unavailable until every predecessor opens; closing an ancestor hides it again without destroying content. Normalized clue text cannot duplicate. Each hint must reveal strictly more; rewording does not qualify.
- Hints carry no required objective, interaction, progress, completion, grading or timing hook. `data-section-skip` excludes them from required time. Opening, closing or reading them changes no activity state or credit.
- Native summary behavior supplies keyboard, touch, screen-reader and no-JavaScript access. Hints remain closed by default, require no hover, and retain visible labels in print. Machine QA enforces structure, order, nesting, names and non-duplication; education and SME review judges genuine progression and semantic answer safety.

## 5. Honest simulators and coding workspaces

- A simulator says plainly when something is unsupported, for example "not available in this practice terminal".
- Tasks check the resulting state, not the exact keystrokes.
- A simulator never shows behavior the real tool would not show.
- A code-writing activity uses the standalone Monaco-style shell in root `DESIGN.md`; it never loads Monaco or another runtime. Use `data-pep-workspace="code"` on the workspace and place its matching `[data-pep-instructions]` first.
- At widths below 480 px, collapse secondary editor chrome (extra file metadata, shortcut legends and decorative status items), but never the file name, Run, Reset code, Problems, Output or the plain-language status. The toolbar and tabs wrap; Run and Reset remain visible 44 px targets. Bound the code area to 240 px and Problems/Output to 180 px on phones; at larger widths their maxima are 400 px and 240 px. Neither region sets the page height or becomes sticky.
- Problems and Output remain adjacent to the editor and reachable after its controls. Their tab buttons use native buttons with tab names and selected state; panels are labeled and focusable only when scrolling is possible. A learner can scroll to the boundary and continue through the page without a keyboard or touch scroll trap.
- Text entry is at least 16 px on phone layouts and has `scroll-margin-block: 16px`, so focusing it with a virtual keyboard does not trigger browser zoom or hide it behind fixed UI (fixed UI is forbidden).
- A coding workspace includes a visible `<noscript data-pep-no-js>` reading in the workspace. It restates the task, starter code, supported subset and expected way to compare results as plain text; it does not reveal a graded answer. JavaScript enhances that complete reading into the editor rather than supplying the only instructions.

### Python Slicing and Comprehensions Activity 3 correction boundary

The module correction keeps the bounded editor and observable Problems/Output, but its adjacent **Your task** must:

1. identify the first edit as replacing `result = ___` with one list comprehension equivalent to the shown loop;
2. identify the second edit as replacing `doubled = ___` with one set or dict comprehension for doubled prices over 10;
3. say that each `___` represents one whole comprehension;
4. explain that the shown loop visits `prices`, keeps values over 10, doubles each kept value and produces `[24, 24, 60]`, retaining the duplicate because it builds a list; and
5. keep all final comprehension expressions absent from learner-visible HTML, JavaScript, static alternatives and hints.

Consolidate the module's existing applicable **Where this fits** teaching rather than duplicating it. Comprehensions fit a bounded iterable already in memory when the transform/filter remains clear as one expression and the whole result is needed. Consider a generator or iterator approach for large or streaming inputs. Prefer an ordinary loop for side effects, multi-step branching, per-item exception handling, early exit, or whenever it states the control flow more clearly. Nested progressive hints decompose the first edit into collected value, `for` source and optional filter; only the later collection-semantics hint distinguishes set uniqueness from dict key-to-value association. Education review—not a deterministic syntax check—asks whether, after only **Your task** and hint 1, a learner can state what to type and where without seeing the completed expression.

### Answer-sensitive public bytes and private success proof

An answer-sensitive task declares its supported scanner and targets on the task, for example `data-pep-answer-sensitive="python-comprehension" data-pep-answer-targets="result doubled"`; its `qa-paths.json` carries an exactly matching `answerSafety` object. The public scanner inventories all enrolled public bytes: decoded visible and hidden text and attributes from the document element and every descendant, including the head, styles and body content outside the enrolled main; document-wide HTML comments; `<noscript>`; templates/static alternatives; hint/fit/anecdote copy; grammar-bounded cooked JavaScript literals, comments and all-literal concatenations; plus every recursive QA JSON string. It labels task/activity/workspace/no-JavaScript/static-alternative and selector-associated QA sources as answer-bearing. CPython `tokenize` extracts balanced comprehension spans from prose and `ast` recursively checks declared-target assignments through wrappers and positional tuple/list targets. Declared-target assignments fail anywhere; standalone comprehensions fail only on answer-bearing surfaces, so unrelated generic teaching remains legal.

A completed input may not be committed directly, reversibly encoded, assembled from literals, obfuscated or represented by an answer-derived digest/hash. The scanner applies bounded decoding for HTML entities, JavaScript escapes/concatenation, canonical UTF-8 base64, percent encoding and hex-byte literals, and rejects target-associated decoder/character assembly and 40/64-hex digest forms. It does not claim arbitrary semantic equivalence or opaque digest provenance: education and Python-SME review remain mandatory for semantic answer leakage and transfer.

Committed paths retain starter, placeholder, malformed/incomplete, unsupported-shape, reset and no-credit/Continue routes. An incorrect observed or expected result uses only starter, incomplete, malformed or unsupported-shape input; a completed declared-target assignment is still prohibited. Complete bare comprehension syntax in an inline script literal is conservatively answer-bearing because static QA cannot prove its render destination. Completed success input comes only from authorized uncommitted staging outside the repository. The runner captures clean public commit **P** before reading the topic, requires exactly five owner-resolved public files to equal P's blobs before and after all four private routes, and rejects dirty tracked/untracked bytes or HEAD movement. Private values are never logged, traced, screenshot, copied to `build/`, obfuscated, hashed or committed, and staging is retired after validation. The existing topic `qa-receipt.json` records only metadata and exactly those five bindings in immediate evidence-only child **R** (the receipt and generated module lock only); its `privateSuccessProof.commit` remains P. T06 proves R's first parent is P, hashes each P blob and current public file, and rejects an old/non-parent commit, missing/extra binding or later public drift. Rebase or squash requires a fresh private run. CI runs public negative/starter routes only.

## 6. Accessibility and responsive operation

- Semantic controls, full keyboard use, screen-reader names and a visible focus indicator. Every pointer target is at least 44 × 44 CSS px. No action is hover-only or keyboard-shortcut-only.
- Dynamic output is announced through `aria-live`.
- Correctness is never shown by color alone.
- Motion respects `prefers-reduced-motion` without removing state changes.
- Text contrast is at least 4.5:1 and meaningful borders/semantic rails at least 3:1 in both light and dark themes. Semantic rail contrast also remains at least 3:1 under deterministic protanopia, deuteranopia and tritanopia transforms; visible labels and boundaries preserve meaning without hue. Forced-colors mode keeps the same labeled regions and non-color boundaries.
- At 320, 390 and 768 CSS px, practical portrait and landscape sizes, and 200% zoom, the page has no page-level horizontal overflow or clipped essential content. Topic/progress controls wrap, Restart remains usable and instructions precede their interaction.
- The host document owns vertical scrolling. Pages use no fixed or sticky element, viewport-height main flow, scroll takeover or nested scrolling for the reading flow. Only bounded editors and Problems/Output regions may scroll; keyboard and touch users can reach and leave each region, and can reach Problems/Output without losing the instruction/workspace association.
- Inputs and editors remain usable when a mobile virtual keyboard reduces the visual viewport: labels and instructions remain before them, focused fields have scroll margin, controls are not fixed behind the keyboard, and text-entry controls use at least 16 px text on phone layouts.
- Print uses the light palette, preserves non-empty teaching, activity-check labels/criteria and actually rendered static alternatives, expands objectives, every hint target/step and optional disclosure body with labels/cues intact, shows every activity section, avoids breaks inside short cards/code/figures, and removes only navigation controls that have no printed meaning. `afterprint` restores every disclosure's exact prior open state.

## 7. Metadata

- The page carries normalized `pep:` meta tags (`pep:course`, `pep:module`, `pep:topic`, `pep:topic-id`, `pep:budget-minutes`, `pep:source`) generated from its catalog `topic.json`.
- A gate joins the catalog entry to the learner path and verifies the meta tags equal it.
- Interactive elements keep the `data-interaction`, `data-confidence` and `data-steps` attributes the timing estimator reads.

## 8. No telemetry

- Pages send nothing anywhere: no analytics, beacons or tracking.
- Any future platform completion event is added only as an adapter seam after the platform contract is known.

## 9. Source-grounded content

- Every technical claim traces to a source record in the topic's evidence, fetched live from official documentation with a retrieval date.
- The page shows a short optional "Sources and review date" disclosure.
- An unverified claim is listed as unverified and never badged as verified.

## 10. Timing

- Minutes come from the frozen reading-time estimator; its cost table is never changed to make a page pass. Content in a contract-owned optional disclosure or hint is marked `data-section-skip` and is excluded from required-path words, code and interactions.
- The estimator P50 must fit the topic budget. Its P90 is informational, not a substitute for a modeled learner route.
- The "About N minutes" label covers the worst required path: two wrong graded attempts and wrong-first explores before settling, modeled per interactive unit and recorded with its evidence.
- 15 minutes is a ceiling for one topic page.
- Topic budgets follow the single allocation policy in `authoring/docs/tools/validators.md` and are recorded in `topic.json`.

## 11. Visual consistency

- Learners see one interface, built from shared components embedded from `components/` at a declared version recorded in `topic.json`.
- Pages stay standalone and hand-authored; components are copied in, never loaded at runtime.
- A drift gate flags embedded component copies that differ from their declared version.

### Component embedding markers

Every copied component fragment is enclosed by markers that name its component, version and fragment kind.
The bytes between markers, including the final newline, must equal the corresponding file under
`components/<name>/`.

```html
<!-- pep:component terminal@1 html -->
...exact contents of components/terminal/component.html...
<!-- /pep:component terminal html -->
```

CSS and JavaScript use block-comment markers so the standalone page remains valid:

```css
/* pep:component terminal@1 css */
...exact contents of components/terminal/component.css...
/* /pep:component terminal css */
```

```js
/* pep:component terminal@1 js */
...exact contents of components/terminal/component.js...
/* /pep:component terminal js */
```

Each marked component must be declared at the same version in `topic.json` `components`. A declaration must
have at least one marked fragment. Pages with neither markers nor declarations pass the component gate. See
`authoring/docs/tools/components.md` for extraction and checking details.

## 12. Companion artifacts

Every companion is present or honestly absent: an absent companion is recorded in `topic.json` with a reason, and empty or placeholder files are forbidden.

### `artifact.md`

- A text alternative derived deterministically from `artifact.html`: title, objectives, teaching text, model description, recap, cheat sheet and sources.
- Each interaction provides an author-written static alternative that the Markdown carries.
- It is never the source of truth; HTML is.
- Headings and objectives match the HTML exactly.

### `artifact.pdf`

- Present only for Reading topics and for topics that declare a print handout.
- Rendered from `artifact.md`; text must be extractable and links must work.

### `artifact.gift`

- A per-topic practice quiz in GIFT plain text, with `$CATEGORY: <course>/<module>/<topic>`.
- Each item has a title, exactly one correct answer, and feedback on every option.
- ASCII only, with GIFT escapes for special characters.
- Items test retention, not recognition of the page's own checks; distractors come from real misconceptions.
- Formative practice quizzes and MCQs may be committed even though GIFT exposes answers, because they are low-stakes.
  Assessment keys, rubrics, reference solutions, hidden tests and scoring secrets never are.

### `video-artifact.md`

- Links one verified public video: title, channel, URL, runtime, embeddability, checked date, what it covers, gaps and cautions.
- Lists alternates and rejected candidates with reasons.
- Never a downloaded file and never an invented URL.
- When no suitable verified video exists, the companion is absent with the search recorded as the reason.

A linked video is optional navigation. When a video text alternative is supplied, the explanatory alternative is contained in the Markdown itself; it does not require the learner to play the linked video. Markdown images are embedded or replaced by an equivalent in-file text description. PDF generation must not turn code/file examples into required external links.

### Diagrams

- Learner pages embed only independently implemented inline SVG, with `<title>`, `<desc>` and a text alternative.
- Archify is supporting diagram tooling for authoring and repository docs only, never a learner-page runtime or interaction engine.
- Adapted diagram output must reduce to self-contained SVG with system fonts, with its license recorded in `topic.json`.
- A diagram must improve understanding; decoration is rejected.

## 13. Licensing

- Every third-party snippet, asset or adapted code has a license record; see `LICENSE-NOTICE.md`.
