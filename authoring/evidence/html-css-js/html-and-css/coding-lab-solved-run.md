# Solved-run record: `html-css-js/html-and-css/coding-lab`

solved at 843af270bed5d8d89201865a5484b43b35f80488 with the final lab correction applied by run solved-1792025518

- Lab bytes binding: sha256 `d86cce1a93893c286b45460c166f115fe14e8a3d3e904c46549e978c29ce7a18` of the `LAB_BUNDLE.sha256` manifest written by `authoring/tools/pep export-lab html-css-js/html-and-css/coding-lab` from the bytes corrected in this commit.
  Any change to a lab file changes this binding; the record is then stale and the run must be repeated.
- Private material: the independently completed `starter/index.html` and `starter/styles.css` existed only in ignored temporary staging, were never added to Git, and were retired after the run. No solution or solution hash is recorded here.
- Environment: macOS, Node.js v24.2.0, npm 11.3.0; network used only by the one-time `npm ci`; no container engine.
- Supersedes `solved at 460f79a040ffdfeee6236e32ae7c618587c1ecb1 with the review fix to tests/css.mjs applied by run solved-1792023109` (bundle `45fd4984…`), whose lab bytes changed in the final correction.

## What the run checked

All routes used the public command against the corrected public tests and pinned Playwright 1.55.1/Chromium. The completed control was also run from a fresh exported bundle.

| Gate (lab contract section 10) | Result |
|---|---|
| `lab.json` schema-valid | pass (T01); bundle standalone check pass (T20) |
| Prerequisites verified | `node --version` printed v24.2.0 (lab needs >=22.12); `npm --version` printed 11.3.0 (needs >=10) |
| Setup | `npm ci` in the exported bundle's `starter/` added 3 packages, found 0 vulnerabilities, and installed Playwright 1.55.1's headless Chromium inside `starter/node_modules` |
| Starter expectation `fail` | the shipped starter gave `pass 0`, `fail 7`; all seven declared `failingTests` failed with outcome-first messages |
| Solved test run offline | `node --test --test-reporter=spec` gave `pass 7`, `fail 0`; the browser blocked every non-file request |
| Rendered breakpoint outcomes | Chromium measured one card column at 599px, two at 600px and 700px, stacked regions at 999px, and the required two-column region layout at 1000px and 1100px |
| Expected output | the solved output matched `expected/on-completion.txt` after replacing timings with `<ms>` |
| Cleanup | deleting `starter/node_modules` and private staging left only shipped files; `git status --porcelain html-css-js` showed only the intended tracked correction |

## Accepted positive routes

Each route started from the completed control with only the named spelling or indirection change and passed all seven tests, including rendered 700px and 1100px outcomes:

| Route | Result |
|---|---|
| canonical integer minimum-width conditions | `pass 7` |
| compact whitespace and comma spacing | `pass 7` |
| `screen and` plus right-hand range syntax | `pass 7` |
| `only screen and` plus `all and` | `pass 7` |
| left-hand range syntax | `pass 7` |
| uppercase media at-keywords | `pass 7` |
| finite decimal spellings numerically equal to 600px and 1000px | `pass 7` |
| defined custom-property indirection for the one- and two-column tracks, with a quoted comma token present | `pass 7`; the quoted token remained unchanged in source inspection |

## Retained negative routes

Each route started from the completed control with only the named defect and was rejected by at least one relevant public check:

| Route | Result |
|---|---|
| maximum-width/wrong-direction condition | reject |
| strict greater-than boundary | reject |
| 601px wrong threshold | reject |
| 600.5px non-equivalent threshold | reject |
| non-px unit | reject |
| unitless threshold | reject |
| compound orientation condition | reject |
| comma-separated alternative | reject |
| print media | reject |
| malformed condition | reject |
| malformed `@mediascreen` at-keyword | reject; wider rendered layouts remained absent |
| decreasing breakpoint order | reject |
| unresolved custom properties | reject; rendered card layout remained wrong |
| resolved custom property producing the wrong track count | reject |
| two unequal card columns | reject |
| 200%-wide page | reject at 400px |
| hidden overflow with a 900px page | reject at 400px with root overflow forced visible |
| missing responsive hero rule | reject at 400px |
| stacked navigation | reject |

## Not yet recorded

- A run on Node.js 22.12 exactly, and Linux and Windows runs: only macOS with Node.js v24.2.0 was available; CI does not execute lab commands.
- Learner pilot timing: the 62-minute cap is the intake planning allowance for the S21 guided lab and the 50-minute median a design estimate, not a measured pilot.
