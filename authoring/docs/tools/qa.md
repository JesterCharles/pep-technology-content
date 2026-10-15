# Unified learner-page QA

The Playwright Chromium harness implements gates T09-T13 and T18 from `authoring/docs/workflow.md`.
It replaces the three course-1 module-specific harness formats with one JSON path format.

## Run it

```sh
npm run check
node authoring/tools/qa/run.mjs
node authoring/tools/qa/run.mjs java-foundations/basics/a-topic
node authoring/tools/qa/run.mjs --write-evidence java-foundations/basics/a-topic
node authoring/tools/qa/run.mjs --private-overlay /absolute/outside-repo/private-qa.json
```

Normal runs write receipts and failure diagnostics under gitignored `build/qa/`.
Only the explicit `--write-evidence` form writes
`authoring/evidence/<course>/<module>/<topic>/qa-receipt.json`.
Screenshots and traces always remain under `build/qa/`; never commit them.

Every check logs `no topics with artifact.html; skipped` and passes when its scan has no HTML topics.
The harness uses the Playwright-managed Chromium pinned by `package-lock.json`.

## Topic path file

Every HTML topic is joined by ids from `authoring/catalog/<course>/<module>/<topic>/topic.json` to the learner directory and has
`authoring/evidence/<course>/<module>/<topic>/qa-paths.json`, validated by
`authoring/schemas/qa-paths.schema.json`.
Selectors belong to the page, not to the harness. A path is an ordered list of declarative actions.
The three required routes must independently finish the topic:

- `success`: correct on the first attempt;
- `wrongFirst`: wrong first and then correct on retry;
- `wrongTwice`: wrong twice and reach the honest settled state.

`simulatorEdges` records realistic unsupported, partial, or look-alike states and their assertions.
`progress` separately asserts that each route reached 100%. `restart.actions` completes, restarts, and repeats an
activity; `restart.credit` proves credit was not duplicated. `keyboard` is the complete success route using semantic
keyboard activation. `data-pep-guidance-contract` and `spec.guidance` are mandatory together. Enrolled specs require
`activityNavigation`, `activityNavigationKeyboard`, `activityNavigationTouch`, `objectives` and `objectivesTouch`;
`hints` is required exactly when parsed HTML contains hints. Empty, partial or author-selected omission fails before
browser execution. The contract fixture demonstrates the exact shape. Author paths reach authored states, while
harness-owned checks observe preservation, every future lock, a fresh future fragment, browser history, state and
credit invariants, Restart after wrong and completed attempts, disclosure accounting and sequential native hints.
The harness requires visible focus at each keyboard activation and verifies the same completion assertion. A focus
indicator may be on the control or a `:focus-within` ancestor, but it must appear on focus and its outline or shadow
must contrast at least 3:1 with the adjacent background.

### Actions

Actions use strict per-action schema branches; missing or irrelevant operands are rejected. Supported actions are:

- `click` and `check`: `do` plus `selector` only;
- `fill` and `select`: `do`, `selector` and `value`;
- `press`: `do`, `selector` and `key`;
- `goBack` and `goForward`: `do` only, with no selector;
- `expectText`: `selector` and non-empty regular-expression `text`;
- `expectValue`: `selector` and regular-expression `value`;
- `expectAttribute`: `selector`, `attribute` and `equals`;
- `expectVisible`, `expectHidden`, `expectEnabled`, `expectDisabled` and `expectFocus`: `selector` only.

Selector actions may also carry `timeoutMs`; history actions may not. Assertions are part of the path. Put one
immediately after the state change it checks so a failure names the exact selector and route.

### Worked example

```json
{
  "schemaVersion": 1,
  "completion": {
    "selector": "#lesson",
    "attribute": "data-pep-complete",
    "equals": "true"
  },
  "progress": { "selector": "#progress", "text": "100%" },
  "routes": {
    "success": [
      { "do": "click", "selector": "#predict-b" },
      { "do": "click", "selector": "#predict-check" },
      { "do": "click", "selector": "#sim-safe" },
      { "do": "click", "selector": "#answer-right" },
      { "do": "click", "selector": "#answer-check" },
      { "do": "click", "selector": "#next" }
    ],
    "wrongFirst": [
      { "do": "click", "selector": "#predict-b" },
      { "do": "click", "selector": "#predict-check" },
      { "do": "click", "selector": "#sim-safe" },
      { "do": "click", "selector": "#answer-wrong" },
      { "do": "click", "selector": "#answer-check" },
      { "do": "expectText", "selector": "#feedback", "text": "Try again" },
      { "do": "click", "selector": "#retry-right" },
      { "do": "click", "selector": "#retry-check" },
      { "do": "click", "selector": "#next" }
    ],
    "wrongTwice": [
      { "do": "click", "selector": "#predict-b" },
      { "do": "click", "selector": "#predict-check" },
      { "do": "click", "selector": "#sim-safe" },
      { "do": "click", "selector": "#answer-wrong" },
      { "do": "click", "selector": "#answer-check" },
      { "do": "click", "selector": "#retry-wrong" },
      { "do": "click", "selector": "#retry-check" },
      { "do": "expectText", "selector": "#feedback", "text": "settled, not correct" },
      { "do": "click", "selector": "#next" }
    ]
  },
  "simulatorEdges": [
    {
      "name": "unsupported command stays incomplete",
      "actions": [
        { "do": "fill", "selector": "#command", "value": "unsupported" },
        { "do": "press", "selector": "#command", "key": "Enter" },
        { "do": "expectText", "selector": "#terminal-log", "text": "not available" },
        { "do": "expectDisabled", "selector": "#next" }
      ]
    }
  ],
  "restart": {
    "actions": [
      { "do": "click", "selector": "#sim-safe" },
      { "do": "click", "selector": "#restart" },
      { "do": "click", "selector": "#sim-safe" }
    ],
    "credit": { "selector": "#progress", "text": "1 of 3" }
  },
  "keyboard": [
    { "do": "click", "selector": "#predict-b" },
    { "do": "click", "selector": "#predict-check" },
    { "do": "click", "selector": "#sim-safe" },
    { "do": "click", "selector": "#answer-right" },
    { "do": "click", "selector": "#answer-check" },
    { "do": "click", "selector": "#next" }
  ]
}
```

This format preserves the action-and-assertion expressiveness of Linux `paths.js`, the compact per-topic data of the
Git `tNN.json` files, and the reusable route roles of AI `spec.js`. No course-1 page content is copied.

### Answer-sensitive routes and private proof

An answer-sensitive task and `qa-paths.json` declare the same task selector, supported language scanner and target
names. Committed paths contain only public-safe starter, incomplete, malformed, wrong-result, unsupported-shape,
reset and no-premature-credit routes. The target-aware scanner covers decoded HTML prose and attributes, hidden and
no-JavaScript/static alternatives, hints, fit/anecdote copy, embedded script strings/templates, fixtures and all QA
JSON strings. Python comprehension targets are analyzed with CPython `tokenize` and `ast`, not a spelling regex.

Completed inputs run only from an absolute authorized uncommitted overlay outside the repository, against the exact
public commit, with required `success`, `wrongFirst`, `keyboard` and `sandbox` action routes. The private runner uses
the same strict public action schema but disables tracing, screenshots, value logging and `build/` output; errors are
generic so completed values do not enter logs. It never writes evidence. After the operator retires staging, the existing committed
`qa-receipt.json` may add `privateSuccessProof`: a commit/run statement, time/environment/pass result,
`stagingRetired: true`, and bindings for only the current public artifact, QA path, harness, T08 parser/scanner and
Python AST scanner. It never records private values or hashes. T01 validates the receipt shape and T06 rejects stale,
missing or private-material bindings. CI continues to execute only public-safe routes. See the exact field shape in
`authoring/schemas/qa-receipt.schema.json`.

## Gate behavior

- **T09:** loads the exact `artifact.html` through `file://`, blocks network and sibling `file:` requests (only the
  page itself may load), and fails console errors, uncaught exceptions, and attempted network or sibling-file access.
  It also loads with JavaScript disabled: the document must remain non-empty; later nested hints start unavailable and
  every native optional, hint and objective disclosure opens in sequence; one ordered timeline anchor resolves to each
  visible activity; every activity after the first has exactly one working predecessor back link; and each
  `[data-pep-workspace="code"]` exposes one non-empty `<noscript data-pep-no-js>` reading. Each enrolled page is also
  printed: all activities, teaching, checks, objectives, hints, optional labels and static alternatives are visible,
  navigation-only controls are absent, and `afterprint` exactly restores the prior disclosure states.
- **T10:** runs all three routes and every mandatory guidance route inside an iframe whose only sandbox token is
  `allow-scripts`. Its opaque origin makes unguarded Web Storage access fail naturally.
- **T11:** runs all routes, simulator edge cases, restart/no-duplicate-credit, and the completion assertion. Enrolled
  pages additionally run navigation and objectives by pointer, keyboard and 320/390 px touch; nested hints by pointer,
  keyboard and phone touch; every locked future activation; a fresh future fragment; monotonic frontier/no-navigation-
  credit checks; preserved input/attempt/feedback/completion/credit/grade/Continue state; current-only Restart after a
  wrong attempt and after completion; exact one-credit re-completion; and unchanged required accounting while hints or
  optional disclosures are used.
- **T12:** permits no serious or critical axe findings; runs the keyboard and reduced-motion success routes; requires
  `aria-live`; checks direct body text at 4.5:1 and rendered borders at 3:1 in forced light and dark themes. Fully
  transparent borders are not rendered and are excluded.
- **T13:** for pages whose root main carries `data-pep-responsive`, checks 1366×768 and short desktop; 320×568 and
  390×844 phone portraits; 844×390 phone landscape; 768×1024 tablet portrait; and an equivalent 200% zoom CSS
  viewport. Light and dark contexts are represented. Unmigrated pages retain the previous desktop, short desktop,
  400×860 and 200% zoom matrix until they are re-authored; add the marker only with the responsive migration.
  Touch contexts execute the required wrong-twice route with real tap events and reject visible buttons, fields,
  summaries, role controls and ordinary anchors below 44×44 CSS px. At every viewport the harness opens Objectives and
  every nested hint in sequence, rerunning overflow, clipping and target checks after each reveal. Every context rejects
  page-level horizontal overflow and clipped essential controls or text.
  Non-rendered content—including descendants of closed `details`, CSS-hidden content, and zero-size live regions with
  no visible descendants—is excluded.
- **T18:** regenerates Markdown in memory and requires byte equality. A declared PDF must load as PDF and contain an
  extractable text map (or produce non-empty `pdftotext` output when that tool is installed).

## Markdown and PDF tools

```sh
node authoring/tools/qa/md-from-html.mjs path/artifact.html path/artifact.md
node authoring/tools/qa/pdf-from-md.mjs path/artifact.md path/artifact.pdf
```

Markdown derivation includes the H1 title, objectives, teaching, model, recap, cheat sheet, sources, and every
`data-interaction` element's author-written `data-static-alt` value or descendant block. It preserves semantic block
boundaries, list markers, table rows, definition-list and labelled key-value rows, and inline code. Preformatted code
and line-oriented code or diff renderings become fenced blocks without losing source-line prefixes or boundaries.
Use `<pre>`, block `<code>`, `.diff`, `[data-diff]` or `[data-code-block]` for line-oriented content; use `<dl>` or
label/value child classes or attributes for labelled rows. Nested section markers have structural ownership, so a
recap containing a cheat sheet and sources emits each section once; repeated text in distinct sections is not
deduplicated. Missing objectives or static alternatives fail rather than being invented. PDF rendering uses
`authoring/tools/qa/print-template.html` at the `PRINT_TEMPLATE_VERSION` declared in `pdf-from-md.mjs` and pinned
Playwright Chromium.

## Provenance

The behavior vocabulary and matrix were independently ported from the read-only course-1 harnesses in the Linux,
Git, and AI `_work/qa/` directories of
`git-linux-ai-foundations-20261007-evolv-terminal-repair`. The source formats were inspected on 2026-10-08.
This repository contains the generalized format and implementation only, not course-1 learner content.
