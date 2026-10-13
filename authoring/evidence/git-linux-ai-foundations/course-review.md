# Course review: `git-linux-ai-foundations` assembly

Plan step R6 assembles Course 1 after its three modules merged (`linux-foundations`, `git-foundations`, `ai-foundations`).
This course branch adds the approved course-level lab "Ship a safe change" (R5 decision: lab yes), lists it in `course.json` `courseLabs` as `ship-safe-change`, and regenerates `course.lock.json` with `authoring/tools/pep lock git-linux-ai-foundations`.
No module content, topic manifest or module lock changed; regenerating the locks left all three `module.lock.json` files byte-identical.

## Lab as built

- Path and id: `git-linux-ai-foundations/coding-lab/`, id `git-linux-ai-foundations/coding-lab`, scope `course`.
- Objectives: nine of the ten primary objectives of the R5 specification. `linux-foundations/environment-variables-and-secrets#o3` was removed in the correction loop (finding course1-edu-002) because the lab never practises revoking or rotating a committed secret; its `.env` work remains supporting practice and the topic stays in `covers`.
- Toolchain: Git (>=2.23, for `git switch`) and the Python standard library (>=3.11); macOS, Linux and Windows; no network at setup or test; no container engine.
- Launch contract: every command starts with `python`. Step 1 of the README gives a per-terminal remediation that makes `python` mean a Python 3.11+ launcher (`alias python=python3` on macOS/Linux, `Set-Alias python py` in PowerShell, `doskey python=py -3 $*` in cmd, `alias python='py -3'` in Git Bash) and the Windows app-execution-alias fix, so the single test command stays `python -m unittest discover -s tests -v`.
- Setup `python tests/setup_lab.py`; one test command `python -m unittest discover -s tests -v`; cleanup `python tests/cleanup_lab.py`; all run from the lab folder.
- Seven named public checks read repository state with machine-oriented Git commands (`rev-parse`, `rev-list`, `diff-tree`, `check-ignore`, `ls-files`, `status --porcelain`, `merge-base --is-ancestor`) and import the learner's `status_message.py`; no check parses decorative Git prose, commit hashes or locale text.
- Minutes: an estimated median of 18 (`minutes.estimatedMedian`, labelled an estimate in the README) and a 20-minute cap; track requirement `standard: required`, `fast: not-required` until a Fast day allocation is confirmed.

### Author decisions against the R5 specification

0. **Reset and cleanup rebuild the whole starter folder** (finding sme-reset-preserves-and-commits-extra-files): both containment-check and delete all of `starter/ship-safe-change/`, so a learner-added file can neither survive nor enter the rebuilt initial commit.
   Setup also points repository-local `core.excludesFile` at an empty `.git/info/no-global-excludes` (finding sme-global-ignore-breaks-start-state), so a personal global `.env` ignore rule cannot hide the starting state; global config is untouched.
   `python tests/check_lab_scripts.py` regression-checks both on a temporary copy of the lab; the learner test command does not discover it.
1. **Setup creates the learner's `.env`** (R5 "Starting repository state" and cleanup list), so step 3 shows it as untracked before any `git add`; the README's step 5 then has the learner add the ignore rule before staging anything.
   R5's learner step 5 also says "before creating/copying local `.env`"; that reading would need a shell-specific copy command (`cp`, `copy`, `Copy-Item`), which the Windows parity note rules out.
   Reviewers should confirm this keeps `environment-variables-and-secrets#o3` ("git-ignoring the .env file before it is ever added") honest.
2. **`PROPOSAL.md` is part of the initial commit**, so the final clean-tree check does not force the learner to commit or delete it.
3. **The prepared teammate branch** adds a support-team comment directly above the same return line and a new `help_message()` function; Git deterministically reports a content conflict in `status_message.py`.
   The acceptance output `<deployment>: ready` is unchanged, so "keep both sides" is satisfiable, and a public check confirms `help_message()` text survived.
4. **The README gives the Python API, not the finished line**: `import os` and the generic form `os.environ.get("NAME", "fallback")`.
   Python is not taught in this course, and the assessed skills are review, staging, branching and conflict resolution.
5. **Repository-local config written by setup**: `user.name`, `user.email`, `core.autocrlf=false`, `commit.gpgsign=false`, `merge.conflictStyle=merge` (stable markers whatever the learner's global style), `merge.ff=false` (a global `merge.ff=only` cannot block the merge) and `core.excludesFile` (above).
   Setup's own commits run with `GIT_CONFIG_GLOBAL` pointed at the null device and `GIT_CONFIG_NOSYSTEM=1`; all lab Git calls set `GIT_CEILING_DIRECTORIES` to `starter/` so they can never act on an enclosing repository.
6. **Every commit and merge in the README uses `-m`**, so no default editor opens.
7. **Fix-up commits are allowed**: the focused-commit check requires every learner commit to touch only `.gitignore` and `status_message.py`, and the merge check looks for the latest merge commit rather than requiring `HEAD` itself to be the merge.

### Terminal behavior and learner pages

The lab runs in the learner's own terminal and adds no HTML page or simulated terminal.
The course pages keep the repaired course-1 Evolv non-form direct Run/Enter behavior: the 14 pages with a practice terminal contain Enter handlers and none contains a `<form>` (inspection of `git-linux-ai-foundations/*/*/artifact.html` on this branch), and gates T10 (strict sandbox, form-submission dependency) and T11 (behavior) pass for every page.

## Gate results

Run on this branch with Node 24 on macOS. First pass at the lab commit `28b25f9`; the correction-loop pass on the final bytes is recorded after the first table.

| Command | Result |
|---|---|
| `npm ci` | pass |
| `npm test` | 121 of 122 pass; the one failure is `default check excludes negative fixtures`, which runs `pep check` and reports only the four T25 lines below |
| `npm run check` | 4 errors, all T25 "missing current education/sme critic coverage" for `git-linux-ai-foundations/coding-lab/lab.json` and `README.md` |

No other gate reported any error for any of the three modules, their 19 topics and companions, their module locks and evidence, the course assessment blueprint, `course.json` or `course.lock.json`.
The T25 errors are expected until the independent education and SME critic reports for the lab, and their reconciliation, are recorded under this directory with `reviewedPath` set to the lab files.

Correction-loop pass on the final bytes (after the critic records and fixes were committed):

| Command | Result |
|---|---|
| `npm ci` | pass |
| `npm test` | 121 of 122 pass; the one failure is `default check excludes negative fixtures`, which reports only the six T25 lines below |
| `npm run check` | 6 errors, all T25: the two high findings (course1-edu-001-python-launcher-macos, sme-reset-preserves-and-commits-extra-files) remain open until their critics' rechecks, and `coding-lab/lab.json` and `README.md` lack current education and SME coverage because the reports bind the pre-correction bytes |

No other gate reported any error for any module, the lab, `course.json` or `course.lock.json`.

Lab gates (lab contract section 10) are recorded in [`coding-lab-solved-run.md`](coding-lab-solved-run.md): solved at `f01c065` by run `solved-1791915814`, bound to the lab bytes; it supersedes the first record at `28b25f9`.

## Export check

```text
authoring/tools/pep export git-linux-ai-foundations
```

Result: exit 0, printed `build/export`.
The gitignored bundle `build/export/git-linux-ai-foundations/` holds 19 `artifact.html`, 19 `artifact.md`, 17 `artifact.gift`, 17 `video-artifact.md`, 6 `artifact.pdf` and the lab files of `coding-lab/` (20 at `28b25f9`, 21 after the correction loop), and `build/export/index.html` links all 19 pages across the three modules.

```text
authoring/tools/pep export-lab git-linux-ai-foundations/coding-lab
```

Result: exit 0, printed `build/labs/git-linux-ai-foundations/coding-lab`; after the correction loop it holds 22 files (the 21 lab files plus `LAB_BUNDLE.sha256`), and the course export holds the same 21 lab files.
Inside that bundle the starter failed 7 of 7 checks, the private solved run passed 7 of 7, and cleanup restored bytes identical to the source lab.

## Critic dispositions

Fresh, independent education and technology-SME critics reviewed commit `1f1fb16` (the lab, `course.json`, `course.lock.json` and this record).
Their reports, `course-critic-education.json` and `course-critic-sme.json`, and the non-author reconciliation `course-reconciliation.json` are committed unchanged beside this file.
All six findings were accepted and applied in one correction loop; the author did not review or approve its own output.

| Finding | Severity | Decision | Applied |
|---|---|---|---|
| course1-edu-001-python-launcher-macos | high | accept | One `python` launch contract with per-terminal remediation for macOS, Linux, PowerShell, cmd and Git Bash; verified on the macOS host, Windows rows checked against official documentation only |
| course1-edu-002-compound-objective-overclaim | medium | accept | `environment-variables-and-secrets#o3` removed from `lab.json` objectives |
| course1-edu-003-unmeasured-median | medium | accept | 18 minutes labelled an estimate in the README and `lab.json` (`estimatedMedian`, cleanup notes); cap kept at 20; pilot recorded as open below |
| course1-edu-004-decision-revealed | low | accept | Neutral opening; "requested change" wording now follows the recorded decision in step 4 |
| sme-reset-preserves-and-commits-extra-files | high | accept | Whole-starter reset and cleanup with containment checks; regression check with a nested learner file |
| sme-global-ignore-breaks-start-state | medium | accept | Repository-local empty `core.excludesFile`; regression check with an isolated global excludes file ignoring `.env` |

The two high findings stay open in T25 until each critic rechecks them against the corrected bytes; the original reports also bind the pre-correction bytes, so T25 reports missing current coverage until those rechecks are recorded.

## Remaining unverified items

- Windows receipt for PowerShell, cmd and Git Bash, including the `cd starter\ship-safe-change` and `python` launcher remediation: not run; the remediation is checked against official documentation only (sources in `coding-lab-solved-run.md`).
- Linux (Ubuntu) receipt: not run locally, and CI does not yet execute lab commands.
- Git 2.23 to 2.27 compatibility: only Git 2.55.0 was exercised; the setup avoids `git init -b` (2.28) and uses `git switch` (2.23).
- Learner timing pilot (open): the 18-minute median is the R5 design estimate, not a measured pilot. Pilot the final instructions with representative learners; keep the 20-minute cap and, if the observed median exceeds it, simplify the conflict or review path rather than raising the cap.
- Platform delivery: no Evolv upload, adapter or publication is part of this branch; `platform.adapter` stays `null` until the platform lab contract is known.
