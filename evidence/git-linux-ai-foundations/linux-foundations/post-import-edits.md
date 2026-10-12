# Post-import edits to imported learner pages

Every change to imported page bytes after the byte-faithful import (commit 664f7ec) and the normalization commit is listed here for the critics.

## environment-variables-and-secrets: demo key value shortened

- File: `git-linux-ai-foundations/linux-foundations/environment-variables-and-secrets/artifact.html`, the `.env` fixture in the step-3 repository explorer.
- Change: `API_KEY=demo-not-a-real-key-42` became `API_KEY=demo-fake-42`.
- Reason: the repository secret scan (gate 4, `tools/checks/T07-forbidden.mjs`) treats any `api_key=` value of 12 or more characters as a secret. The value was always a labelled fake; the new value stays obviously fake and is under the threshold.
- Decision: approved by Firstmate on 2026-10-12 (option b of the blocker report); the T07 tooling is unchanged.
- Learner impact: none intended; the step still asks which files may be committed, and `.env` remains the file holding the value.
