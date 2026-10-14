# Solved-run record: `html-css-js/html-and-css/coding-lab`

solved at 04d392b49cdb92b5ddcbf5ea8b7036fa17819055 by run solved-1791990562

- Lab bytes binding: sha256 `afef1edee936dcd15c2ff383ac21805b563831efdf19ae38d74ab10d20a36c9f` of the `LAB_BUNDLE.sha256` manifest written by `authoring/tools/pep export-lab html-css-js/html-and-css/coding-lab` at that commit.
  Any change to a lab file changes this binding; the record is then stale and the run must be repeated.
- Private material: the solved `starter/index.html` and `starter/styles.css` were written in uncommitted private staging outside the repository and are not recorded here, not even as a hash.
- Environment: macOS, Node.js v24.2.0; no network; no container engine; no packages installed.

## What the run checked

| Gate (lab contract section 10) | Result |
|---|---|
| `lab.json` schema-valid | pass (`npm run check`, T01); bundle standalone check pass (T20) |
| Prerequisites verified | `node --version` printed v24.2.0 (lab needs >=22.12) |
| Starter expectation `fail` | the exported starter gave `fail 7`: all seven `failingTests` fail with their next-action messages |
| Solved test run offline | `node --test --test-reporter=spec` in the exported bundle gave `pass 7`, `fail 0` |
| Expected output | the run's output equals `expected/on-completion.txt` after replacing timings with `<ms>` |
| Cleanup | the tests create no files; `git status --porcelain html-css-js` stayed empty after the runs in the source lab, and the exported bundle is a disposable copy under gitignored `build/` |

## Negative routes exercised

Each route started from the solved state with one change and failed only the check named:

| Route | Failing check |
|---|---|
| 1000px query written before the 600px query | `task 4 and 5: every media query is min-width, written from small to large` |
| Desktop-first `@media (max-width: 599px)` block kept | `task 4 and 5: every media query is min-width, written from small to large` |
| `.page` keeps `width: 960px` | `task 6: nothing in the base styles is wider than 400px, and the hero picture shrinks to fit` |
| `.site-nav ul` with `flex-direction: column` | `task 3: .site-nav ul is a flex row with a gap` |

## Not yet recorded

- A run on Node.js 22.12 exactly, and Linux and Windows runs: only macOS with Node.js v24.2.0 was available; CI does not yet execute lab commands.
- Learner pilot timing: the 62-minute cap is the intake planning allowance for the S21 guided lab and the 50-minute median a design estimate, not a measured pilot.
- Rendered appearance: the tests check source rules only; the README's browser checks were not run in this record.
