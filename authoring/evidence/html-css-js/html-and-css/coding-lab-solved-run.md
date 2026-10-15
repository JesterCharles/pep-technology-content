# Solved-run record: `html-css-js/html-and-css/coding-lab`

solved at 60a04f0c92fd4805c4de606683fbe93f77bc5789 by run solved-1792034553

- Exact lab-byte binding: sha256 `b92c0fce50e3ea83f23641322493dec2d69ba36438bfba530a3c439a968f769f` of the `LAB_BUNDLE.sha256` file written by `authoring/tools/pep export-lab html-css-js/html-and-css/coding-lab` from clean commit `60a04f0c92fd4805c4de606683fbe93f77bc5789`.
- The export was created only after that commit established the final public lab bytes. Its manifest inventories `tests/layout.test.mjs` as sha256 `89b0daacda16c8255ff66971ebd2e607ea0bdfaabf17724467e325ba6b65f603`.
- Private material: independently completed `starter/index.html` and `starter/styles.css` existed only inside the ignored fresh export, were never added to Git, and were deleted with that export after the run. No solution or solution hash is recorded here.
- Environment: macOS, Node.js v24.2.0, npm 11.3.0; network used only by the one-time `npm ci`; no container engine.
- Supersedes run `solved-1792030050`, whose recorded pre-final commit and bundle binding did not cover the final public tests.

## Exact-export checks

Every check in this section used the fresh export bound above.

| Gate (lab contract section 10) | Result |
|---|---|
| Setup | `npm ci` in the exported bundle's `starter/` added 3 packages, found 0 vulnerabilities, and installed pinned Playwright 1.55.1 with its headless Chromium |
| Untouched starter expectation `fail` | public command `node --test --test-reporter=spec` gave `pass 0`, `fail 7`; all seven declared `failingTests` failed |
| Private solved run offline | the same public command gave `pass 7`, `fail 0`; the browser helper blocked every non-file request |
| Expected output | after replacing timings with `<ms>`, the solved output matched `expected/on-completion.txt` byte-for-byte |
| Cleanup | the export, its `node_modules`, and both privately completed starter files were deleted; the tracked tree remained clean before this receipt was written |

## Public-test regression matrix

The correction was also exercised against the complete retained matrix using the final public test bytes:

- all 11 valid routes passed all seven tests, including comment-separated media syntax, custom-property indirection, and valid later rules at 800px and 1200px;
- all 21 invalid routes were rejected, including later 800px three-column and 1200px block-layout overrides;
- harmless ordered rules at 1,200.25px and 100,000px passed all seven tests;
- a harmless ordered rule at Chromium's exact 10,000,000px viewport cap passed all seven tests: the boundary was rendered and its unrepresentable following pixel was omitted;
- a harmless ordered rule strictly above that cap passed all seven tests: its finite width still participated in source-order validation, but generated no rendered candidate.

The unchanged starter separately remained `pass 0`, `fail 7`.

## Not yet recorded

- A run on Node.js 22.12 exactly, and Linux and Windows runs: only macOS with Node.js v24.2.0 was available; CI does not execute lab commands.
- Learner pilot timing: the 62-minute cap is the intake planning allowance for the S21 guided lab and the 50-minute median a design estimate, not a measured pilot.
