# Unified learner-page QA

The Playwright Chromium harness implements gates T09-T13 and T18 from `docs/workflow.md`.
It replaces the three course-1 module-specific harness formats with one JSON path format.

## Run it

```sh
npm run check
node tools/qa/run.mjs
node tools/qa/run.mjs java-foundations/basics/a-topic
node tools/qa/run.mjs --write-evidence java-foundations/basics/a-topic
```

Normal runs write receipts and failure diagnostics under gitignored `build/qa/`.
Only the explicit `--write-evidence` form writes
`evidence/<course>/<module>/<topic>/qa-receipt.json`.
Screenshots and traces always remain under `build/qa/`; never commit them.

Every check logs `no topics with artifact.html; skipped` and passes when its scan has no HTML topics.
The harness uses the Playwright-managed Chromium pinned by `package-lock.json`.

## Topic path file

Every HTML topic has
`evidence/<course>/<module>/<topic>/qa-paths.json`, validated by
`schemas/qa-paths.schema.json`.
Selectors belong to the page, not to the harness. A path is an ordered list of declarative actions.
The three required routes must independently finish the topic:

- `success`: correct on the first attempt;
- `wrongFirst`: wrong first and then correct on retry;
- `wrongTwice`: wrong twice and reach the honest settled state.

`simulatorEdges` records realistic unsupported, partial, or look-alike states and their assertions.
`progress` separately asserts that each route reached 100%. `restart.actions` completes, restarts, and repeats an
activity; `restart.credit` proves credit was not duplicated. `keyboard` is the complete success route using semantic
keyboard activation. The harness requires visible focus at each
keyboard activation and verifies the same completion assertion. A focus indicator may be on the control or a
`:focus-within` ancestor, but it must appear on focus and its outline or shadow must contrast at least 3:1 with the
adjacent background.

### Actions

Each action has `do` and `selector`. Supported actions are:

- input: `click`, `check`, `fill` (`value`), `press` (`key`), and `select` (`value`);
- assertions: `expectText` (`text`, a regular expression), `expectValue` (`value`, a regular expression),
  `expectAttribute` (`attribute` and `equals`), `expectVisible`, `expectHidden`, `expectEnabled`,
  `expectDisabled`, and `expectFocus`.

Assertions are part of the path. Put an assertion immediately after the state change it checks so a failure names the
exact selector and route.

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

## Gate behavior

- **T09:** loads the exact `artifact.html` through `file://`, blocks non-local requests, and fails console errors,
  uncaught exceptions, and attempted network access.
- **T10:** runs all three routes inside an iframe whose only sandbox token is `allow-scripts`. Its opaque origin makes
  unguarded Web Storage access fail naturally.
- **T11:** runs all routes, simulator edge cases, restart/no-duplicate-credit, and the completion assertion.
- **T12:** permits no serious or critical axe findings; runs the keyboard and reduced-motion success routes; requires
  `aria-live`; checks direct body text at 4.5:1 and rendered borders at 3:1 in forced light and dark themes. Fully
  transparent borders are not rendered and are excluded.
- **T13:** checks 1366x768 light, 1366x681 light, 400x860 dark, and an equivalent 200% zoom CSS viewport. It rejects
  horizontal overflow and clipped essential controls or text. Non-rendered content—including descendants of closed
  `details`, CSS-hidden content, and zero-size live regions with no visible descendants—is excluded.
- **T18:** regenerates Markdown in memory and requires byte equality. A declared PDF must load as PDF and contain an
  extractable text map (or produce non-empty `pdftotext` output when that tool is installed).

## Markdown and PDF tools

```sh
node tools/qa/md-from-html.mjs path/artifact.html path/artifact.md
node tools/qa/pdf-from-md.mjs path/artifact.md path/artifact.pdf
```

Markdown derivation includes the H1 title, objectives, teaching, model, recap, cheat sheet, sources, and every
`data-interaction` element's author-written `data-static-alt` value or descendant block. It preserves semantic block
boundaries, list markers, and table rows. Nested section markers have structural ownership, so a recap containing a
cheat sheet and sources emits each section once; repeated text in distinct sections is not deduplicated. Missing
objectives or static alternatives fail rather than being invented. PDF rendering uses
`tools/qa/print-template.html` version 1 and pinned Playwright Chromium.

## Provenance

The behavior vocabulary and matrix were independently ported from the read-only course-1 harnesses in the Linux,
Git, and AI `_work/qa/` directories of
`git-linux-ai-foundations-20261007-evolv-terminal-repair`. The source formats were inspected on 2026-10-08.
This repository contains the generalized format and implementation only, not course-1 learner content.
