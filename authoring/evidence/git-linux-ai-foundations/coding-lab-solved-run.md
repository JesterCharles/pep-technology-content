# Solved-run record: `git-linux-ai-foundations/coding-lab`

solved at 28b25f9cb8201acd665b0d458f634ad09cd048f8 by run solved-1791913445

- Lab bytes binding: sha256 `5850edf4ad74e6cb1dbf65c31770d946adbb682a01d1adee1aad5e8703cb39f2` of the `LAB_BUNDLE.sha256` manifest written by `authoring/tools/pep export-lab git-linux-ai-foundations/coding-lab` at that commit (one `sha256  path` line per lab file, sorted).
  Any change to a lab file changes this binding; the record is then stale and the run must be repeated.
- Private material: the solved learner repository state was produced from uncommitted private staging outside the repository and is not recorded here, not even as a hash.
- Environment: macOS 26.7.1, Git 2.55.0, Python 3.11 and Python 3.14; no network; no container engine.

## What the run checked

| Gate (lab contract section 10) | Result |
|---|---|
| `lab.json` schema-valid | pass (`npm run check`, T01) |
| Prerequisites verified | `git --version` 2.55.0 (needs >=2.23); `python3.11 --version` 3.11 and `python3.14 --version` 3.14 (need >=3.11) |
| Starter expectation `fail` | before setup and right after `python tests/setup_lab.py`: `FAILED (failures=7)`, all seven `failingTests` fail with their next-action messages |
| Solved test run offline | `python -m unittest discover -s tests -v` printed 7 `ok` and `OK` on Python 3.11 and 3.14 |
| Expected output | the run's test lines and summary equal `expected/on-completion.txt` after replacing the run time with `<seconds>` |
| Cleanup | `python tests/cleanup_lab.py` left `git status --porcelain --ignored git-linux-ai-foundations` empty (no created or ignored paths remain, starter bytes restored) |
| Global Git config unchanged | sha256 prefix of `git config --global --list` was `9586fb9843a74f5c` before and after |
| Export bundle | the same solved run passed inside `build/labs/git-linux-ai-foundations/coding-lab/` from `export-lab`, and its cleanup restored bytes identical to the source lab |

## Negative routes exercised

Each route started from a fresh setup and failed only the checks named:

| Route | Failing checks |
|---|---|
| `git add .` before ignoring `.env` | `test_env_file_is_ignored_and_untracked`, `test_feature_commit_is_focused` |
| Merge resolved by keeping only the learner's side | `test_prepared_branch_is_merged` (teammate `help_message()` lost) |
| Conflict markers staged and committed | `test_merge_is_resolved_without_markers`, plus the two import-based checks report "not valid Python" |
| Feature commit made on `main` | `test_expected_feature_branch_is_checked_out`, `test_feature_commit_is_focused` |

## Not yet recorded

- Windows local receipt (PowerShell, cmd and Git Bash) and Linux/Ubuntu run: no Windows or Linux host was available to this run; CI does not yet execute lab commands.
- Learner pilot timing: the 18-minute median and 20-minute cap are the R5 design estimate, not a measured pilot.
