# Course review: `git-linux-ai-foundations` assembly

Plan step R6 assembles Course 1 after its three modules merged (`linux-foundations`, `git-foundations`, `ai-foundations`).
This course branch adds the approved course-level lab "Ship a safe change" (R5 decision: lab yes), lists it in `course.json` `courseLabs` as `ship-safe-change`, and regenerates `course.lock.json` with `authoring/tools/pep lock git-linux-ai-foundations`.
No module content, topic manifest or module lock changed; regenerating the locks left all three `module.lock.json` files byte-identical.

## Lab as built

- Path and id: `git-linux-ai-foundations/coding-lab/`, id `git-linux-ai-foundations/coding-lab`, scope `course`.
- Objectives: the ten primary objectives of the R5 specification, unchanged; supporting objectives are not listed in `lab.json`.
- Toolchain: Git (>=2.23, for `git switch`) and the Python standard library (>=3.11); macOS, Linux and Windows; no network at setup or test; no container engine.
- Setup `python tests/setup_lab.py`; one test command `python -m unittest discover -s tests -v`; cleanup `python tests/cleanup_lab.py`; all run from the lab folder.
- Seven named public checks read repository state with machine-oriented Git commands (`rev-parse`, `rev-list`, `diff-tree`, `check-ignore`, `ls-files`, `status --porcelain`, `merge-base --is-ancestor`) and import the learner's `status_message.py`; no check parses decorative Git prose, commit hashes or locale text.
- Minutes: median 18, cap 20; track requirement `standard: required`, `fast: not-required` until a Fast day allocation is confirmed.

### Author decisions against the R5 specification

1. **Setup creates the learner's `.env`** (R5 "Starting repository state" and cleanup list), so step 3 shows it as untracked before any `git add`; the README's step 5 then has the learner add the ignore rule before staging anything.
   R5's learner step 5 also says "before creating/copying local `.env`"; that reading would need a shell-specific copy command (`cp`, `copy`, `Copy-Item`), which the Windows parity note rules out.
   Reviewers should confirm this keeps `environment-variables-and-secrets#o3` ("git-ignoring the .env file before it is ever added") honest.
2. **`PROPOSAL.md` is part of the initial commit**, so the final clean-tree check does not force the learner to commit or delete it.
3. **The prepared teammate branch** adds a support-team comment directly above the same return line and a new `help_message()` function; Git deterministically reports a content conflict in `status_message.py`.
   The acceptance output `<deployment>: ready` is unchanged, so "keep both sides" is satisfiable, and a public check confirms `help_message()` text survived.
4. **The README gives the Python API, not the finished line**: `import os` and the generic form `os.environ.get("NAME", "fallback")`.
   Python is not taught in this course, and the assessed skills are review, staging, branching and conflict resolution.
5. **Repository-local config written by setup**: `user.name`, `user.email`, `core.autocrlf=false`, `commit.gpgsign=false`, `merge.conflictStyle=merge` (stable markers whatever the learner's global style) and `merge.ff=false` (a global `merge.ff=only` cannot block the merge).
   Setup's own commits run with `GIT_CONFIG_GLOBAL` pointed at the null device and `GIT_CONFIG_NOSYSTEM=1`; all lab Git calls set `GIT_CEILING_DIRECTORIES` to `starter/` so they can never act on an enclosing repository.
6. **Every commit and merge in the README uses `-m`**, so no default editor opens.
7. **Fix-up commits are allowed**: the focused-commit check requires every learner commit to touch only `.gitignore` and `status_message.py`, and the merge check looks for the latest merge commit rather than requiring `HEAD` itself to be the merge.

### Terminal behavior and learner pages

The lab runs in the learner's own terminal and adds no HTML page or simulated terminal.
The course pages keep the repaired course-1 Evolv non-form direct Run/Enter behavior: the 14 pages with a practice terminal contain Enter handlers and none contains a `<form>` (inspection of `git-linux-ai-foundations/*/*/artifact.html` on this branch), and gates T10 (strict sandbox, form-submission dependency) and T11 (behavior) pass for every page.

## Gate results

Run on this branch at the lab commit `28b25f9` with Node 24 on macOS:

| Command | Result |
|---|---|
| `npm ci` | pass |
| `npm test` | 121 of 122 pass; the one failure is `default check excludes negative fixtures`, which runs `pep check` and reports only the four T25 lines below |
| `npm run check` | 4 errors, all T25 "missing current education/sme critic coverage" for `git-linux-ai-foundations/coding-lab/lab.json` and `README.md` |

No other gate reported any error for any of the three modules, their 19 topics and companions, their module locks and evidence, the course assessment blueprint, `course.json` or `course.lock.json`.
The T25 errors are expected until the independent education and SME critic reports for the lab, and their reconciliation, are recorded under this directory with `reviewedPath` set to the lab files.

Lab gates (lab contract section 10) are recorded in [`coding-lab-solved-run.md`](coding-lab-solved-run.md): solved at `28b25f9` by run `solved-1791913445`, bound to the lab bytes.

## Export check

```text
authoring/tools/pep export git-linux-ai-foundations
```

Result: exit 0, printed `build/export`.
The gitignored bundle `build/export/git-linux-ai-foundations/` holds 19 `artifact.html`, 19 `artifact.md`, 17 `artifact.gift`, 17 `video-artifact.md`, 6 `artifact.pdf` and the 20 files of `coding-lab/`, and `build/export/index.html` links all 19 pages across the three modules.

```text
authoring/tools/pep export-lab git-linux-ai-foundations/coding-lab
```

Result: exit 0, printed `build/labs/git-linux-ai-foundations/coding-lab` with 21 files (the 20 lab files plus `LAB_BUNDLE.sha256`).
Inside that bundle the starter failed 7 of 7 checks, the private solved run passed 7 of 7, and cleanup restored bytes identical to the source lab.

## Critic dispositions

Pending.
The lab (`coding-lab/`) and the course-level changes (`course.json`, `course.lock.json`, this record) await fresh, independent education and technology-SME critics and a non-author reconciliation; the author does not review or approve them.
Their records will be added beside this file and summarized here in the correction loop.

## Remaining unverified items

- Windows receipt for PowerShell, cmd and Git Bash, including the `cd starter\ship-safe-change` and `python` launcher guidance: not run.
- Linux (Ubuntu) receipt: not run locally, and CI does not yet execute lab commands.
- Git 2.23 to 2.27 compatibility: only Git 2.55.0 was exercised; the setup avoids `git init -b` (2.28) and uses `git switch` (2.23).
- Learner timing: the 18-minute median and 20-minute cap are the R5 design estimate, not a measured pilot.
- Platform delivery: no Evolv upload, adapter or publication is part of this branch; `platform.adapter` stays `null` until the platform lab contract is known.
