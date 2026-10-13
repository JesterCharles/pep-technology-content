# HTML artifact contract

Provenance: restates the rules of the course-1 author contract, "Git/Linux/AI Foundations — local learner HTML authoring", as adopted for this repository.

This contract governs every topic's `artifact.html` and its companions.
The gates in `authoring/docs/workflow.md` check it mechanically wherever a rule is machine-checkable.

## 1. Place in the tree

- Each topic lives at `<course>/<module>/<topic>/`; there is no `topics/` level and there are no parallel versioned build folders.
- `artifact.html` is the primary learner artifact and the single source of truth for the topic's learner content.
- A topic directory may contain only `topic.json`, `artifact.html`, `artifact.md`, `artifact.pdf`, `artifact.gift`, `video-artifact.md` and `coding-lab/`.
- Hashes are generated into `<course>/<module>/module.lock.json`; authored files never carry their own hashes.

## 2. Standalone

- One file of plain HTML, CSS and JavaScript.
- No frameworks, CDNs, web fonts or runtime network requests.
- System font stacks only: serif headings, `system-ui` body, `ui-monospace` code.
- The page works when opened from `file://` and when embedded in an iframe.

## 3. Platform-embeddable

- Every interaction works inside an iframe with `sandbox="allow-scripts"` only: no `allow-forms`, `allow-same-origin`, `allow-popups` or `allow-modals`.
- No interaction depends on form submission; controls dispatch directly in JavaScript.
- Every storage access is wrapped in `try`/`catch`, because an opaque origin throws.
- No `alert`, `confirm` or `prompt`.
- Links open in place with `rel="noopener"`.

## 4. Interactive learning shape

- A header shows the learner's position and an honest "About N minutes" label, and offers 2-3 observable objectives in a collapsed, accessible `<details>` disclosure (inside `[data-pep-objectives]`).
- The learner predicts before any teaching.
- The page builds one mental model.
- Teach then do, 2-3 times, with at most 120 words per teach step and nothing used before it is taught.
- An apply check asks for a real confidence rating before showing feedback.
- A recap closes the page, with an optional cheat sheet marked `data-section-skip`.
- The page offers at least 2 genuine manipulations, not just reading and clicking "next".
- Every option is explained, right or wrong.
- A wrong answer gets one retry, then the answer is revealed.
- An answer locks once settled.
- Each activity can restart without duplicate credit; the last edit counts.

## 5. Honest simulators

- A simulator says plainly when something is unsupported, for example "not available in this practice terminal".
- Tasks check the resulting state, not the exact keystrokes.
- A simulator never shows behavior the real tool would not show.

## 6. Accessibility

- Semantic controls, full keyboard use and a visible focus indicator.
- Dynamic output is announced through `aria-live`.
- Correctness is never shown by color alone.
- Motion respects `prefers-reduced-motion`.
- Text contrast is at least 4.5:1 and meaningful borders at least 3:1, in both light and dark themes.
- The page works at 200% zoom and at 400 px width without horizontal scroll.

## 7. Metadata

- The page carries normalized `pep:` meta tags (`pep:course`, `pep:module`, `pep:topic`, `pep:topic-id`, `pep:budget-minutes`, `pep:source`) generated from `topic.json`.
- A gate verifies the meta tags equal `topic.json`.
- Interactive elements keep the `data-interaction`, `data-confidence` and `data-steps` attributes the timing estimator reads.

## 8. No telemetry

- Pages send nothing anywhere: no analytics, beacons or tracking.
- Any future platform completion event is added only as an adapter seam after the platform contract is known.

## 9. Source-grounded content

- Every technical claim traces to a source record in the topic's evidence, fetched live from official documentation with a retrieval date.
- The page shows a short optional "Sources and review date" disclosure.
- An unverified claim is listed as unverified and never badged as verified.

## 10. Timing

- Minutes come from the frozen reading-time estimator; its cost table is never changed to make a page pass.
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

### Diagrams

- Learner pages embed only independently implemented inline SVG, with `<title>`, `<desc>` and a text alternative.
- Archify is supporting diagram tooling for authoring and repository docs only, never a learner-page runtime or interaction engine.
- Adapted diagram output must reduce to self-contained SVG with system fonts, with its license recorded in `topic.json`.
- A diagram must improve understanding; decoration is rejected.

## 13. Licensing

- Every third-party snippet, asset or adapted code has a license record; see `LICENSE-NOTICE.md`.
