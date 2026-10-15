# PEP technology content

Private source of PEP technology learner content. Learner-facing curriculum is intentionally visible at the repository root; production and QA machinery is grouped under `authoring/`.

This repository is private and proprietary; see `LICENSE-NOTICE.md`.

## Curriculum map

```text
curriculum/                         shared curriculum declaration, snapshots and lock
components/                         reusable learner-interface fragments
<course>/                           learner content; absent while a course is wholly pending
  assessments/<assessment>/
    blueprint.json                  learner-safe blueprint; never keys or rubrics
  coding-lab/                       optional course-wide lab
  <module>/
    assessments/<assessment>/       optional module assessment blueprints
    coding-lab/                     optional module-wide lab
    <topic>/
      artifact.html                 primary standalone learner page
      artifact.md                   derived text alternative
      artifact.pdf                  optional handout
      artifact.gift                 formative practice quiz
      video-artifact.md             optional curated video record
      coding-lab/                   optional topic lab
authoring/
  catalog/<course>/                 machine-readable path-isomorphic catalog
    course.json                     course identity and module order
    course.lock.json                generated course-level lock
    <module>/
      module.json                   module identity and topic order
      module.lock.json              generated module/evidence lock
      <topic>/topic.json            objectives, timing and companion declarations
  evidence/                         review and source evidence
  docs/                             contracts
  schemas/                          schemas
  tests/                            tool tests and fixtures
  tools/                            validation, lock, QA and export tooling
```

There is one canonical `<course>/<module>/<topic>/` tree. There is no `topics/` level and no parallel content copy for a delivery track. Standard and Fast tracks reuse the same course/topic content through the shared declarations in `curriculum/`; track mappings may select shared Standard days rather than duplicating learner artifacts.

### Standard and Fast track overlays

The authoritative calendar declares tracks as entries in the `tracks` array in `curriculum/snapshot/pep-calendar.json`: `/tracks/0/id` is `foundation`, `/tracks/1/id` is `standard`, and `/tracks/2/id` is `fast`. That frozen calendar and the simplified curriculum snapshot are integrity-bound by `curriculum/curriculum.lock.json` and `curriculum/snapshot/SHA256SUMS`; edit neither snapshot by hand. Re-extract an approved calendar update with:

```sh
node authoring/tools/curriculum/extract-calendar.mjs /path/to/pep-calendar.html /tmp/pep-calendar.json
```

A Fast instructional day at `/tracks/2/weeks/<week-index>/days/<day-index>` can carry three source-mapping fields:

- `sourceStandardDays` lists the Standard program-day numbers used as sources for that Fast day. For example, `/tracks/2/weeks/0/days/0/sourceStandardDays` is `[1, 2]` for `FT1`.
- `alsoCovers` lists additional covered Standard-day annotations. Each entry names a `standardDay`, its `title`, and any specifically enumerated `topics`; an empty array means no additional annotation. For example, `/tracks/2/weeks/0/days/0/alsoCovers` names Standard day 1.
- `skimsStandardDay` is either `null` or the Standard program-day number whose material is skimmed rather than fully covered. For example, `/tracks/2/weeks/0/days/1/skimsStandardDay` is `4` for `FT2`.

`authoring/schemas/track.schema.json` defines the normalized overlay contract: each day requires `sourceStandardDays` as stable string day ids, while selected `topics` use references plus an explicit `full`, `skim`, or `review` emphasis. The source-calendar-only `alsoCovers` and `skimsStandardDay` keys are therefore translated into topic selection and emphasis, not copied into a normalized overlay.

A topic still has one `authoring/catalog/<course>/<module>/<topic>/topic.json`. Its `/curriculum/<mapping-index>/calendarDayIds` lists every applicable calendar id, such as `S1` and `FT1`, and the same mapping records the authoritative curriculum `pointer` and its `exact`, `split`, or `shared` relation. An overlay changes sequencing or emphasis only: it never creates another course, module, topic manifest, or learner-artifact copy.

## Add another curriculum course

1. **Add a catalog course.** Choose a stable slug and create `authoring/catalog/<course>/course.json`. Course discovery is structural under the neutral catalog, so the same layout works for Java, SQL, Python, web, React, container/CI or Spring curricula. Do not create a root learner directory until learner content exists.
2. **Add modules in the catalog.** Create `authoring/catalog/<course>/<module>/module.json` and list module ids in `course.json` `moduleOrder`. Ordering belongs in manifests, not directory-name prefixes.
3. **Add topics directly under each catalog module.** Create `authoring/catalog/<course>/<module>/<topic>/topic.json`, list topic ids in `module.json` `topicOrder`, and put the primary `artifact.html` plus declared companions at `<course>/<module>/<topic>/` only when authored. Use `authoring/tools/pep new-topic <course>/<module>/<topic>` to create an absent-artifact catalog manifest without a learner directory or placeholder.
4. **Add labs only where they earn their setup cost.** A lab may live under a topic, module or course as `coding-lab/`. It uses one language-native test command and no container engine; see `authoring/docs/lab-contract.md`.
5. **Add assessments without secrets.** Put learner-safe blueprints under `<course>/assessments/` or `<course>/<module>/assessments/`. Never commit answer keys, rubrics, hidden tests, scoring secrets or reference solutions.
6. **Reuse shared components.** Copy versioned fragments from `components/<name>/` into standalone learner HTML using the declared markers and record the component version in `topic.json`. Components are authoring references, not runtime dependencies.
7. **Record review evidence.** Source receipts and independent critic records live under `authoring/evidence/<course>/...`; the mirrored course/module/topic path shows what they support.
8. **Generate locks.** Run `authoring/tools/pep lock <course>` after catalog, content or evidence changes. Locks are written under `authoring/catalog/<course>/`; never hand-edit them. Old-layout branches can run `authoring/tools/pep migrate-catalog` after rebasing.

For the complete artifact, review and delivery rules, read `authoring/AGENTS.md` and the contracts in `authoring/docs/`.

## Root paths at a glance

| Path | Purpose |
|---|---|
| `<course>/` | Learner artifacts, labs and learner-safe assessment blueprints only |
| `authoring/catalog/` | Course/module/topic manifests and generated locks |
| `curriculum/` | Shared curriculum source snapshots and integrity lock |
| `components/` | Reusable learner-facing UI fragments |
| `authoring/docs/` | HTML, lab, workflow and tool contracts; `content-workflow/` offers Simple and Detailed pipeline views |
| `authoring/evidence/` | Source receipts, critic reports and reconciliation records |
| `authoring/schemas/` | Manifest and evidence schemas |
| `authoring/tests/` | Tool tests and fixtures |
| `authoring/tools/` | Validation, lock, QA and export tooling |
| `.github/workflows/` | CI entrypoints kept at root for GitHub discovery |
| `AGENTS.md`, `CLAUDE.md` | Thin agent discovery entrypoints into `authoring/` |

## Local gates

Prerequisites: Git, the Node.js major named in `.nvmrc` (for example through `nvm use`), and Poppler (`pdfinfo` and `pdffonts`; for example `poppler-utils` or `brew install poppler`), which T20 needs to inspect PDFs.

```sh
npm ci
npm test
authoring/tools/pep migrate-catalog --check
npm run check
```

The executable `authoring/tools/pep` CLI provides `check`, `lock`, `export`, `export-lab`, `new-topic` and the idempotent `migrate-catalog`. Use `authoring/tools/pep --help` or `authoring/tools/pep <subcommand> --help`. Generated learner and lab bundles are written under the gitignored `build/` directory.

Every merge requires approval. See `authoring/docs/workflow.md` for branch scope, independent criticism, reconciliation and delivery rules.
