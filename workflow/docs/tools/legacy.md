# Legacy indexes and import fidelity

`workflow/evidence/legacy/course-1-packages.json` is a text-only SHA-256 index of learner-facing files in the four
course-1 packages. `_work/` trees and non-learner files are excluded. The index identifies
`git-linux-ai-foundations-20261007-evolv-terminal-repair` as authoritative.

`workflow/evidence/legacy/tournament.json` preserves only the frozen event manifest status and hashes, the named hash
index, preserved tarball and checksum-file record, and the cancellation date. It is historical evidence only.
Do not use it to resume, replay, score or rank the tournament.

Both files are validated by T01 against `workflow/schemas/legacy-course-packages.schema.json` and
`workflow/schemas/legacy-tournament.schema.json`.

## Verify a first import commit

After the byte-faithful commit that first adds one module's `artifact.html` files, run:

```sh
node workflow/tools/legacy/verify-import.mjs <commit> <course>/<module>
```

The tool reads blobs from the named commit, not the worktree. It requires the commit's added HTML artifacts to
match the complete set of authoritative legacy learner-page hashes for that module. Renaming from numbered
legacy files to canonical topic paths is allowed because matching is by bytes. On success it writes:

```text
workflow/evidence/<course>/<module>/import-fidelity.txt
```

Commit that receipt with the module evidence. A mismatch exits nonzero and does not write a receipt.
