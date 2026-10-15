# Solved-run record: `html-css-js/html-and-css/coding-lab`

solved at 460f79a040ffdfeee6236e32ae7c618587c1ecb1 with the review fix to `tests/css.mjs` applied by run solved-1792023109

- Lab bytes binding: sha256 `45fd4984c0f1d180d9f31ffb2363582c33a9bfa1e23db93a649d01b3fb5a5625` of the `LAB_BUNDLE.sha256` manifest written by `authoring/tools/pep export-lab html-css-js/html-and-css/coding-lab` from the commit that adds this record.
  Any change to a lab file changes this binding; the record is then stale and the run must be repeated.
- Private material: the solved `starter/index.html` and `starter/styles.css` were written in uncommitted private staging outside the repository and are not recorded here, not even as a hash.
- Environment: macOS, Node.js v24.2.0, npm 11.3.0; network used only by the one-time `npm ci`; no container engine.
- Supersedes `solved at 61eb867d33b56d2c41390d15fc1a695e496a1935 by run solved-1792006019` (bundle `4f6f84e9…`), whose lab bytes changed when `tests/css.mjs` began reading equivalent CSS spellings as equal: spacing inside parentheses and after commas or colons, a `screen and` or `all and` media prefix, and the range forms `(width >= N)` and `(N <= width)` for `(min-width: N)`.
  That record superseded `solved at 04d392b49cdb92b5ddcbf5ea8b7036fa17819055 by run solved-1791990562`, whose lab bytes changed in critic correction loop 1.

## What the run checked

All runs used a fresh copy of the exported bundle under private staging.

| Gate (lab contract section 10) | Result |
|---|---|
| `lab.json` schema-valid | pass (`npm run check`, T01); bundle standalone check pass (T20) |
| Prerequisites verified | `node --version` printed v24.2.0 (lab needs >=22.12); `npm --version` printed 11.3.0 (needs >=10) |
| Setup | `npm ci` in `starter/` added 3 packages, found 0 vulnerabilities, and installed Playwright 1.55.1's headless Chromium inside `starter/node_modules` |
| Starter expectation `fail` | the shipped starter gave `fail 7`: all seven `failingTests` fail with outcome messages |
| Solved test run offline | `node --test --test-reporter=spec` gave `pass 7`, `fail 0`; the browser test blocks every non-file request |
| Expected output | the run's output equals `expected/on-completion.txt` after replacing timings with `<ms>` |
| Cleanup | deleting `starter/node_modules` left only the shipped starter files; `git status --porcelain html-css-js` stayed empty |

## Equivalent spellings accepted

Each route started from the solved state with one change and passed all seven tests:

| Route | Result |
|---|---|
| `@media (min-width:600px)` and `(min-width:1000px)` with `repeat(2,1fr)` | `pass 7` |
| `@media screen and (min-width: 600px)` with `repeat( 2 , 1fr )`, and `@media (width >= 1000px)` | `pass 7` |

## Negative routes exercised

Each route started from the solved state with one change and failed only the check named:

| Route | Failing check |
|---|---|
| 1000px query written before the 600px query | `task 4 and 5: the stylesheet is mobile-first, adding wider-screen rules from small to large` |
| Desktop-first `@media (max-width: 599px)` block kept | `task 4 and 5: the stylesheet is mobile-first, adding wider-screen rules from small to large` |
| `.page { width: 200%; max-width: 1200px; }` added (critic finding coding-lab-sme-01) | `task 6: at 400px wide the page does not scroll sideways, and the hero picture stays inside its box` (measured 832px) |
| `html, body { overflow-x: hidden; }` with a 900px `.page` | task 6 (measured 932px with root overflow forced visible) |
| Hero picture rule removed | task 6 |
| `.site-nav ul` with `flex-direction: column` | `task 3: the nav links sit side by side with space between them` |
| `@media (width <= 599px)` block added | `task 4 and 5: the stylesheet is mobile-first, adding wider-screen rules from small to large` |
| 600px rule moved to `@media print` | task 4 and the mobile-first check |
| `repeat(3, 1fr)` from 600px | `task 4: the trail cards are one column on phones and two columns from 600px` |

## Not yet recorded

- A run on Node.js 22.12 exactly, and Linux and Windows runs: only macOS with Node.js v24.2.0 was available; CI does not yet execute lab commands.
- Learner pilot timing: the 62-minute cap is the intake planning allowance for the S21 guided lab and the 50-minute median a design estimate, not a measured pilot.
- The README's by-hand browser checks at 700px and 1100px were not run in this record; task 6 covers 400px.
