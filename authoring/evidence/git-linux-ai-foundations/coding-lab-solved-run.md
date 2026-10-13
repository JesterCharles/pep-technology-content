# Solved-run record: `git-linux-ai-foundations/coding-lab`

solved at f01c065babeaf34913f67d030cc9caf0ccccd3c1 by run solved-1791915814

- Lab bytes binding: sha256 `7b642b19e357e9dd955fffc81dc53c3460d2bf2e2bb1e5f8455db515e5e4e7d9` of the `LAB_BUNDLE.sha256` manifest written by `authoring/tools/pep export-lab git-linux-ai-foundations/coding-lab` at that commit (one `sha256  path` line per lab file, sorted).
  Any change to a lab file changes this binding; the record is then stale and the run must be repeated.
- Private material: the solved learner repository state was produced from uncommitted private staging outside the repository and is not recorded here, not even as a hash.
- Environment: macOS 26.7.1, Git 2.55.0, Python 3.11 and Python 3.14; no network; no container engine.
  This host has no `python` executable, so the published commands were run in zsh after the README's macOS remediation `alias python=python3` (and `alias python=python3.11` for the 3.11 cleanup).
- Supersedes the first record, `solved at 28b25f9 by run solved-1791913445`, whose lab bytes changed in the critic correction loop.

## What the run checked

| Gate (lab contract section 10) | Result |
|---|---|
| `lab.json` schema-valid | pass (`npm run check`, T01) |
| Prerequisites verified | `git --version` 2.55.0 (needs >=2.23); `python --version` through the alias printed 3.14.6, and `python3.11 --version` 3.11 (need >=3.11) |
| Starter expectation `fail` | before setup and right after `python tests/setup_lab.py`: `FAILED (failures=7)`, all seven `failingTests` fail with their next-action messages |
| Solved test run offline | `python -m unittest discover -s tests -v` printed 7 `ok` and `OK` on Python 3.11 and 3.14 |
| Expected output | the run's test lines and summary equal `expected/on-completion.txt` after replacing the run time with `<seconds>` |
| Cleanup | `python tests/cleanup_lab.py` left `git status --porcelain --ignored git-linux-ai-foundations` empty (no created or ignored paths remain, starter bytes restored) |
| Global Git config unchanged | sha256 prefix of `git config --global --list` was `9586fb9843a74f5c` before and after |
| Setup and cleanup regression | `python tests/check_lab_scripts.py` passed 2 of 2 on Python 3.11 and 3.14, both with a solved learner repository in place and after cleanup: a global excludes file ignoring `.env` no longer hides the starting state, and reset and cleanup remove a learner-added nested file, keep it out of every rebuilt commit, and restore fixture bytes. The same check failed 2 of 2 on the lab scripts of `1f1fb16`. |
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
  The Windows launcher remediations in the README are checked against official documentation only, retrieved 2026-10-13T18:21:25Z:
  - Python "Using Python on Windows", sections 4.1 (install manager gives a global `python` command; "Manage app execution aliases" troubleshooting) and 4.1.9 (`py -3.<version>`/`-V:3` forms), https://docs.python.org/3/using/windows.html, sha256 `6912c1d6471e2b77a7794c912cf4f930720e2e1cb0d1a6604e79d0b0306d259f`.
  - Microsoft "Set-Alias" (an alias cannot carry parameters, so the PowerShell row aliases plain `py`), https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/set-alias, sha256 `3e99a797e8ca449014ee545d8909ba007cd329b01b7065e9b2f42307dab91571`.
  - Microsoft "doskey" (`$*` passes all arguments), https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/doskey, sha256 `82f2050b8f4d371f6f4fb4f7ade169d4278beaa69a2f4b62e17289811184a4c7`.
  - Python "Using Python on Unix platforms" for `python3` on Linux, https://docs.python.org/3/using/unix.html, sha256 `677b6a63c82d6c963e720540560710b632ef9e844a41ff3ecb0983c1fd7e1e2c`.
  The Git Bash `alias python='py -3'` row and the Linux `alias python=python3` row are unverified on those hosts; the same alias form was run on this macOS host in zsh and interactive bash.
- Learner pilot timing: the 18-minute median and 20-minute cap are the R5 design estimate, not a measured pilot.
