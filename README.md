# PEP technology content

This private repository has three ownership roots:

- [`workflow/`](workflow/) — agent instructions, curriculum/catalog metadata, source and review evidence, reusable components, design/process documentation, schemas, tests, and authoring/QA/export tools.
- [`foundational-track/`](foundational-track/) — the canonical learner-facing Foundation course trees and learner-safe assessments/labs.
- [`standard-fast-track/`](standard-fast-track/) — one canonical learner-facing course base shared by Standard and Fast, counted once rather than copied per track.

Files retained at the repository root are plumbing, not content: the primary README and license, package/runtime configuration, GitHub-discovered CI, ignore rules, and thin `AGENTS.md`/`CLAUDE.md` pointers into `workflow/`.

This repository is private and proprietary; see [`LICENSE-NOTICE.md`](LICENSE-NOTICE.md).

## Learner-content layout

Each course is selected into a track root by its authoritative `curriculumSlice.jsonPointers` in `workflow/catalog/<course>/course.json`: track index `0` is Foundation, while indices `1` and `2` share `standard-fast-track/`.

```text
foundational-track/<course>/
standard-fast-track/<course>/
  assessments/<assessment>/blueprint.json
  coding-lab/                              optional course lab
  <module>/
    assessments/<assessment>/blueprint.json
    coding-lab/                            optional module lab
    <topic>/
      artifact.html                        primary learner page
      artifact.md                          text alternative
      artifact.pdf                         optional handout
      artifact.gift                        formative practice quiz
      video-artifact.md                    optional video record
      coding-lab/                          optional topic lab
```

There is one canonical `<track-root>/<course>/<module>/<topic>/` tree. Standard and Fast use the same course/topic bytes; sequencing and emphasis come from the frozen calendar rather than duplicate content trees. The calendar identifies `aws` as the only Fast-only technology. It currently has no canonical repository learner artifacts, so its authoritative declaration remains in `workflow/curriculum/` rather than creating placeholders.

## Workflow ownership

```text
workflow/
  AGENTS.md                  authoritative contributor and agent contract
  catalog/<course>/          course/module/topic manifests and generated locks
  components/                reusable learner-interface source fragments
  curriculum/                approved snapshots and integrity lock
  docs/                      workflow, artifact, lab, design, and product contracts
  evidence/<course>/         source, QA, criticism, and reconciliation records
  migration/                 layout proof and branch rebase map
  schemas/                   machine schemas
  tests/                     tooling tests and fixtures
  tools/                     `pep` CLI, checks, QA, and export tooling
```

The calendar in `workflow/curriculum/snapshot/pep-calendar.json` declares Foundation, Standard, and Fast. Fast instructional days map back to shared Standard material through `sourceStandardDays`, `alsoCovers`, and `skimsStandardDay`; topic manifests record applicable `S…` and `FT…` day ids without creating copies.

For complete rules, read [`workflow/AGENTS.md`](workflow/AGENTS.md), [`workflow/docs/workflow.md`](workflow/docs/workflow.md), and [`workflow/docs/design-system.md`](workflow/docs/design-system.md).

## Commands

Prerequisites are Git, the Node.js major in `.nvmrc`, and Poppler (`pdfinfo` and `pdffonts`).

```sh
npm ci
npm test
npm run check
workflow/tools/pep --help
```

`workflow/tools/pep` provides `check`, `lock`, `export`, `export-lab`, and `new-topic`. Generated output stays under gitignored `build/`. CI remains at `.github/workflows/ci.yml` because GitHub requires that fixed path.
