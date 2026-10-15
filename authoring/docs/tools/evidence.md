# Review evidence and critic gate

`authoring/tools/pep check --only T25` runs gate 18. It checks each topic, module and course review scope independently.

## Files

Topic evidence uses these exact original-report and reconciliation names under
`authoring/evidence/<course>/<module>/<topic>/`:

- `critic-education.json`
- `critic-sme.json`
- `reconciliation.json`

Topic rechecks use `critic-education-recheck.json` or `critic-sme-recheck.json`. To retain more than one immutable
recheck for a role, a recheck may add a deterministic kebab-case prefix, for example
`focused-final-critic-education-recheck.json`. Prefixes are allowed only on rechecks; topic original reports and the
reconciliation retain their exact names.

Course- and module-level evidence prefixes the same names with the reviewed unit, such as
`intake-critic-education.json` or `module-check-reconciliation.json`. Reports and reconciliations are validated by
`authoring/schemas/critic-report.schema.json` and `authoring/schemas/reconciliation.schema.json`.

A report can name its primary repo-relative target in `reviewedPath`. A recheck report adds:

```json
{
  "recheck": {
    "of": "authoring/evidence/course/module/topic/critic-education.json",
    "items": [
      {
        "findingId": "education-1",
        "status": "resolved",
        "file": "course/module/topic/artifact.html",
        "reviewedSha256": "<sha256>",
        "note": "Rechecked against the corrected explanation."
      }
    ]
  }
}
```

`of` must identify an existing original report of the same role in the same evidence directory. The report's
`findings` array may be empty; use it only for genuinely new findings discovered during recheck.

## Hash binding

For an object containing `reviewedSha256` or `artifactSha256`, `authoring/tools/pep lock` resolves the target in this order:

1. that object's `reviewedPath`;
2. that object's `file`;
3. that object's `location.file`;
4. the nearest ancestor object's `reviewedPath`;
5. for topic evidence only, the topic's `artifact.html`.

These paths are repository-relative. A binding with no target or a path outside the repository fails lock
generation. `artifactHashes` maps keep their existing behavior: each map key is resolved relative to the associated
course, module or topic artifact root. Immutable records that use an old learner-tree path for one of the five moved
metadata classes (`course.json`, `course.lock.json`, `module.json`, `module.lock.json`, `topic.json`) resolve narrowly
to the matching `authoring/catalog/` path only when that catalog file exists; an existing direct path always wins.
Generated locks record the physical catalog path.

Generated locks retain fresh and stale in-scope hashes and mark each binding with `current`. When a target recorded
by immutable review evidence has since been removed, its binding remains in the lock with `current: false`,
`historical: true`, and `missing: true`. It cannot provide current critic coverage; replacement files still require
current education and SME coverage.

### Solved-run evidence

`authoring/schemas/solved-run.schema.json` owns JSON files named `lab-run.json` or `<scope>-solved-run.json` under
the associated course, module or topic evidence directory. `lab` is the normalized repository-relative path of the
public `coding-lab/`. Existing records express the complete file inventory either as `artifactHashes` keyed relative
to that lab or as `files` entries containing a repository-relative `file` and `reviewedSha256`; both normalize to the
same contract.

T06 compares that inventory with `git ls-files` for the declared lab and hashes the current bytes. Every tracked
public lab file must appear exactly once with a lowercase SHA-256, and no other path may appear. Missing files, newly
tracked files, stale bytes, duplicate or escaping paths, and any attempted private solution binding fail even after
lock regeneration. The evidence may describe private staging, but it must never contain or hash private solution
bytes, hidden tests, answer keys or scoring material. These solved-run checks do not change the historical semantics
of critic bindings.

A course-level evidence reference to module content is historical: the course lock protects the evidence file bytes
but omits that cross-scope binding, so later module changes do not stale the shared course lock. Such a historical
intake reference can close its course-level intake finding, but it never supplies current critic coverage for module
content; current module coverage must come from evidence under that module. T06 requires committed catalog locks to be
byte-identical to regeneration. Regenerate with `authoring/tools/pep lock` after changing catalog metadata, content or evidence.

## Legacy evidence references

New manifests, receipts and review records use `authoring/evidence/...`. Course 1 and its attested review records
predate the `authoring/` layout and retain their original `evidence/...` strings so their bytes and review authority
do not change during the repository move. When the referenced file does not exist at its root `evidence/` path, the
tooling resolves only that legacy prefix to `authoring/evidence/`; the decision is made per reference, and a file that
exists at the root path wins. `evidence/` is a reserved root, and no other old root prefix is aliased.
Generated locks record the physical `authoring/evidence/...` path even when a preserved record used the legacy
spelling.

## Gate 18 behavior

Reviewable files are topic HTML, GIFT and video artifacts; assessment blueprints at course and module scope; and
`coding-lab/lab.json` plus `coding-lab/README.md` at every scope. Each file needs current education and SME critic
coverage.

Every finding needs a reconciliation decision made by someone other than the artifact author. A critical or high
finding closes only when it is rejected with evidence, or when an accepted finding has a current same-role
`resolved` recheck. Escalated findings, `open` rechecks and accepted findings without a resolved recheck remain
open. When the repository has no reviewable files, T25 reports that fact and passes.
