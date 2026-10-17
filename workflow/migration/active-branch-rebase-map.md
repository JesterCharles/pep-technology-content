# Active module branch rebase map

This migration does not rebase or modify active content branches. Their owners should rebase only after the layout PR lands, using this map.

## Path map

| Active content | Old path | New path |
|---|---|---|
| Python learner files | `python/` | `standard-fast-track/python/` |
| Python catalog | `authoring/catalog/python/` | `workflow/catalog/python/` |
| Python evidence | `authoring/evidence/python/` | `workflow/evidence/python/` |
| Collections learner files | `collections-streams/` | `foundational-track/collections-streams/` |
| Collections catalog | `authoring/catalog/collections-streams/` | `workflow/catalog/collections-streams/` |
| Collections evidence | `authoring/evidence/collections-streams/` | `workflow/evidence/collections-streams/` |
| Containers learner files | `containers-cicd/` | `standard-fast-track/containers-cicd/` |
| Containers catalog | `authoring/catalog/containers-cicd/` | `workflow/catalog/containers-cicd/` |
| Containers evidence | `authoring/evidence/containers-cicd/` | `workflow/evidence/containers-cicd/` |
| Shared authoring contracts/tools | `authoring/` | `workflow/` |
| Shared components | `components/` | `workflow/components/` |
| Curriculum snapshots | `curriculum/` | `workflow/curriculum/` |

## Likely conflict zones

- Course and module locks: accept the rebased content/evidence, then regenerate with `workflow/tools/pep lock <course>`; never hand-merge lock records.
- Evidence bindings (`reviewedPath`, finding `file`, lock `artifactPath`, and solved-run `lab`): retain the content branch's hash/status judgment but rewrite the repository path through the table above.
- Topic `freshness.sourcesRef`: retain the branch's evidence record and use `workflow/evidence/<course>/...`.
- Tool or documentation references: use `workflow/tools/pep`, `workflow/components/`, `workflow/curriculum/`, and `workflow/docs/design-system.md`; do not recreate old-root aliases.
- Root course add/delete conflicts: resolve into the mapped track root. Standard and Fast remain one shared tree.

## Byte-identity recipe

Run this before the rebase from the content branch, then again after resolving paths. The canonical id strips only the track prefix, so a pure move compares equal.

```sh
course=python # or collections-streams / containers-cicd
old=$course
case "$course" in
  collections-streams) new="foundational-track/$course" ;;
  python|containers-cicd) new="standard-fast-track/$course" ;;
esac

git ls-files -z -- "$old" \
  | while IFS= read -r -d '' file; do
      rel=${file#"$old/"}
      printf '%s  %s/%s\n' "$(shasum -a 256 "$file" | cut -d' ' -f1)" "$course" "$rel"
    done | sort > "/tmp/${course}.before.sha256"

# Rebase and resolve with the map, then:
git ls-files -z -- "$new" \
  | while IFS= read -r -d '' file; do
      rel=${file#"$new/"}
      printf '%s  %s/%s\n' "$(shasum -a 256 "$file" | cut -d' ' -f1)" "$course" "$rel"
    done | sort > "/tmp/${course}.after.sha256"

diff -u "/tmp/${course}.before.sha256" "/tmp/${course}.after.sha256"
npm test
npm run check
```

A non-empty hash diff requires review; do not conceal it with a copy, alias, symlink, or regenerated learner artifact.
