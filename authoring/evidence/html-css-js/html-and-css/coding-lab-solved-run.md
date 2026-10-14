# Solved-run record: `html-css-js/html-and-css/coding-lab`

solved at 61eb867d33b56d2c41390d15fc1a695e496a1935 by run solved-1792006019

- Lab bytes binding: sha256 `4f6f84e9299153218fdea3ecab490ea2a3cf29c18edbb507bb6a9e437ff145db` of the `LAB_BUNDLE.sha256` manifest written by `authoring/tools/pep export-lab html-css-js/html-and-css/coding-lab` at that commit.
  Any change to a lab file changes this binding; the record is then stale and the run must be repeated.
- Private material: the solved `starter/index.html` and `starter/styles.css` were written in uncommitted private staging outside the repository and are not recorded here, not even as a hash.
- Environment: macOS, Node.js v24.2.0, npm 11.3.0; network used only by the one-time `npm ci`; no container engine.
- Supersedes `solved at 04d392b49cdb92b5ddcbf5ea8b7036fa17819055 by run solved-1791990562`, whose lab bytes changed in critic correction loop 1 (outcome-based README and tests, real-browser task 6).

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

## Not yet recorded

- A run on Node.js 22.12 exactly, and Linux and Windows runs: only macOS with Node.js v24.2.0 was available; CI does not yet execute lab commands.
- Learner pilot timing: the 62-minute cap is the intake planning allowance for the S21 guided lab and the 50-minute median a design estimate, not a measured pilot.
- The README's by-hand browser checks at 700px and 1100px were not run in this record; task 6 covers 400px.
