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

- Follow root `DESIGN.md` for page anatomy. New or re-authored pages mark their root `<main data-pep-responsive>` to opt into the current deterministic 320/390/768, touch and zoom contract; migration is per page, never a marker-only mass edit. A topic bar contains the learner's activity position, honest "about N min" label and usable **Restart activity** control; 2-3 observable objectives remain visible as a Goals list inside `[data-pep-objectives]`.
- The learner predicts before any teaching.
- The page builds one mental model.
- Teach then do, 2-3 times, with at most 120 words per teach step and nothing used before it is taught.
- In source and visual reading order, all instructions needed for an interaction precede that interaction. A page under the current `data-pep-responsive` contract marks the pair with `data-pep-instructions` and `data-pep-workspace`; both are present and instructions come first.
- An apply check asks for a real confidence rating before showing feedback.
- A recap closes the required path, with an optional cheat sheet marked `data-section-skip`.
- The page offers at least 2 genuine manipulations, not just reading and clicking "next".
- Every option is explained, right or wrong.
- A wrong answer gets one retry, then the answer is revealed.
- An answer locks once settled.
- Each activity can restart without duplicate credit; the last edit counts. Restart remains a 44 px target at narrow widths, resets the current required activity to its authored start, clears its feedback and credit, and never duplicates credit. It may close optional disclosures; if it resets an optional challenge starter, that reset is still optional and cannot change required progress.

### Optional learner disclosures

A page MAY include either, both or neither of these native disclosures. Omit one when it adds no specific learner value; never fill it with boilerplate. The required teaching and practice remain complete when disclosures are absent or never opened.

- **Anecdote** uses `<details class="pep-optional pep-optional--anecdote" data-pep-optional="anecdote" data-section-skip>`. Its `<summary>` learner label is **Another way to think about it** and includes the cue **Optional example**. It gives one simpler explanation, analogy or concrete example, remains technically accurate, introduces no prerequisite and never replaces the core explanation.
- **Challenge** uses `<details class="pep-optional pep-optional--challenge" data-pep-optional="challenge" data-section-skip>`. Its `<summary>` label is **Challenge (optional)**. Its body states an estimated optional time in `[data-pep-optional-time]` and clear success criteria in `[data-pep-success-criteria]`. It extends or combines only objectives already taught.

Both disclosures are closed by default and appear inside the relevant activity section: Anecdote after the complete core explanation, and Challenge after the required practice and feedback. They do not create heading-level jumps; a disclosure nested under an `h2` activity may use `h3` internally, but its summary is not treated as a heading. Native toggle focus stays on `<summary>`; scripts do not move focus on open or close. Summary and any controls are at least 44 × 44 px, keyboard and touch operable, visibly focused, and screen-reader named. Disclosure content cannot depend on hover, a shortcut or JavaScript and remains in source order for no-JavaScript and assistive-technology reading.

Optional disclosures and descendants MUST NOT carry `data-interaction`, `data-confidence`, `data-pep-objectives`, `data-pep-complete`, or another required-progress/completion hook. Their `data-section-skip` marker excludes their words and code from the required time estimator. Opening, closing, attempting or resetting one never changes Continue availability, required progress, completion, grade, the topic's "about" label or its required time budget. Optional time is additional and is labeled as such; it is not added to `pep:budget-minutes`.

A code challenge may reuse the page's editor with a visibly resettable starter, but is not a second required workspace. It MUST NOT contain or expose a complete answer, hidden solution, rubric, secret test, answer key or client-visible reference implementation. All optional copy is public-safe because the standalone HTML is learner-visible source.

In print, both disclosure bodies expand and retain their **Optional example** / **Challenge (optional)** labels and optional-time cue; interactive buttons may be omitted. A `beforeprint` listener may open closed optional disclosures and an `afterprint` listener MUST restore only those it opened. Without JavaScript, native disclosures remain readable and can be opened before printing. Restart does not alter print output. Progressive enhancement may remember disclosure state only through guarded storage, but the authored default is closed and native HTML remains complete without script.

## 5. Honest simulators and coding workspaces

- A simulator says plainly when something is unsupported, for example "not available in this practice terminal".
- Tasks check the resulting state, not the exact keystrokes.
- A simulator never shows behavior the real tool would not show.
- A code-writing activity uses the standalone Monaco-style shell in root `DESIGN.md`; it never loads Monaco or another runtime. Use `data-pep-workspace="code"` on the workspace and place its matching `[data-pep-instructions]` first.
- At widths below 480 px, collapse secondary editor chrome (extra file metadata, shortcut legends and decorative status items), but never the file name, Run, Reset code, Problems, Output or the plain-language status. The toolbar and tabs wrap; Run and Reset remain visible 44 px targets. Bound the code area to 240 px and Problems/Output to 180 px on phones; at larger widths their maxima are 400 px and 240 px. Neither region sets the page height or becomes sticky.
- Problems and Output remain adjacent to the editor and reachable after its controls. Their tab buttons use native buttons with tab names and selected state; panels are labeled and focusable only when scrolling is possible. A learner can scroll to the boundary and continue through the page without a keyboard or touch scroll trap.
- Text entry is at least 16 px on phone layouts and has `scroll-margin-block: 16px`, so focusing it with a virtual keyboard does not trigger browser zoom or hide it behind fixed UI (fixed UI is forbidden).
- A coding workspace includes a visible `<noscript data-pep-no-js>` reading in the workspace. It restates the task, starter code, supported subset and expected way to compare results as plain text; it does not reveal a graded answer. JavaScript enhances that complete reading into the editor rather than supplying the only instructions.

## 6. Accessibility and responsive operation

- Semantic controls, full keyboard use, screen-reader names and a visible focus indicator. Every pointer target is at least 44 × 44 CSS px. No action is hover-only or keyboard-shortcut-only.
- Dynamic output is announced through `aria-live`.
- Correctness is never shown by color alone.
- Motion respects `prefers-reduced-motion` without removing state changes.
- Text contrast is at least 4.5:1 and meaningful borders at least 3:1, in both light and dark themes.
- At 320, 390 and 768 CSS px, practical portrait and landscape sizes, and 200% zoom, the page has no page-level horizontal overflow or clipped essential content. Topic/progress controls wrap, Restart remains usable and instructions precede their interaction.
- The host document owns vertical scrolling. Pages use no fixed or sticky element, viewport-height main flow, scroll takeover or nested scrolling for the reading flow. Only bounded editors and Problems/Output regions may scroll; keyboard and touch users can reach and leave each region, and can reach Problems/Output without losing the instruction/workspace association.
- Inputs and editors remain usable when a mobile virtual keyboard reduces the visual viewport: labels and instructions remain before them, focused fields have scroll margin, controls are not fixed behind the keyboard, and text-entry controls use at least 16 px text on phone layouts.
- Print uses the light palette, preserves required teaching and static alternatives, expands optional disclosure content, avoids breaks inside short cards/code/figures, and removes only controls that have no printed meaning.

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

- Minutes come from the frozen reading-time estimator; its cost table is never changed to make a page pass. Content in a contract-owned optional disclosure is marked `data-section-skip` and is excluded from required-path words, code and interactions.
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
