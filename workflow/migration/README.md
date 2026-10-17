# Layout migration proof

`layout-baseline.json` inventories the default-branch state before the three-root move: canonical course/module/topic identities, declared artifact types, every tracked learner-safe file's byte count and SHA-256, deduplicated track counts, and the Fast-only technology derived from the calendar.

`workflow/tests/layout-migration.test.mjs` compares that inventory with the moved tree, proves Standard/Fast course uniqueness, validates path-valued metadata, checks root pointer thinness, and exercises required CLI/CI entrypoints.

Learner HTML remains byte-identical. Existing pages embed `pep:source="authoring/evidence/..."`; changing that marker would violate the byte-preservation requirement. T08 therefore treats only the mechanical `authoring/` → `workflow/` form of this embedded provenance identifier as equivalent. It does not resolve, recreate, redirect, or symlink the old path. All live catalog/evidence references use `workflow/evidence/...`.

See `active-branch-rebase-map.md` for the post-merge map and verification recipe for Python, Collections, and Containers work.
