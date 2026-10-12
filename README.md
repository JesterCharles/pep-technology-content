# PEP technology content

Private source of PEP technology learner content. Learner-facing curriculum is intentionally visible at the repository root; production and QA machinery is grouped under `authoring/`.

This repository is private and proprietary; see `LICENSE-NOTICE.md`.

## Curriculum map

```text
curriculum/                         shared curriculum declaration, snapshots and lock
components/                         reusable learner-interface fragments
<course>/                           any non-reserved root child containing course.json
  course.json                       course identity, module order and course-level work
  course.lock.json                  generated course-level lock
  assessments/<assessment>/
    blueprint.json                  learner-safe blueprint; never keys or rubrics
  coding-lab/                       optional course-wide lab
  <module>/
    module.json                     module identity and topic order
    module.lock.json                generated module and evidence lock
    assessments/<assessment>/       optional module assessment blueprints
    coding-lab/                     optional module-wide lab
    <topic>/
      topic.json                    objectives, timing and companion declarations
      artifact.html                 primary standalone learner page
      artifact.md                   derived text alternative
      artifact.pdf                  optional handout
      artifact.gift                 formative practice quiz
      video-artifact.md             optional curated video record
      coding-lab/                   optional topic lab
authoring/                          contracts, evidence, schemas, tests and tools
```

There is one canonical `<course>/<module>/<topic>/` tree. There is no `topics/` level and no parallel content copy for a delivery track. Standard and Fast tracks reuse the same course/topic content through the shared declarations in `curriculum/`; track mappings may select shared Standard days rather than duplicating learner artifacts.

### Standard and Fast track overlays

The authoritative overlay declarations are the `standard` and `fast` objects under `tracks` in `curriculum/snapshot/pep-calendar.json`. That frozen calendar and the simplified curriculum snapshot are integrity-bound by `curriculum/curriculum.lock.json` and `curriculum/snapshot/SHA256SUMS`; edit neither snapshot by hand. Re-extract an approved calendar update with:

```sh
node authoring/tools/curriculum/extract-calendar.mjs /path/to/pep-calendar.html /tmp/pep-calendar.json
```

Each Fast day declares `sourceStandardDays`, the Standard program-day numbers it combines or condenses. A topic's single `<course>/<module>/<topic>/topic.json` manifest records every applicable Standard and Fast calendar day id in `curriculum[].calendarDayIds`, tied to the authoritative curriculum `pointer` and its `exact`, `split` or `shared` relation. An overlay changes sequencing or emphasis only: it never creates another course, module, topic manifest or learner-artifact copy.

## Add another curriculum course

1. **Add a root course directory.** Choose a stable slug and create `<course>/course.json` directly under the repository root. Course discovery is structural for non-reserved root children, so the same layout works for Java, SQL, Python, web, React, container/CI or Spring curricula. `authoring/`, `components/` and `curriculum/` are reserved and cannot be courses.
2. **Add modules in the course.** Create `<course>/<module>/module.json` and list module ids in `course.json` `moduleOrder`. Ordering belongs in manifests, not directory-name prefixes.
3. **Add topics directly under each module.** Create `<course>/<module>/<topic>/topic.json`, list topic ids in `module.json` `topicOrder`, and put the primary `artifact.html` plus declared companions beside it. Use `authoring/tools/pep new-topic <course>/<module>/<topic>` to create an absent-artifact manifest without placeholders.
4. **Add labs only where they earn their setup cost.** A lab may live under a topic, module or course as `coding-lab/`. It uses one language-native test command and no container engine; see `authoring/docs/lab-contract.md`.
5. **Add assessments without secrets.** Put learner-safe blueprints under `<course>/assessments/` or `<course>/<module>/assessments/`. Never commit answer keys, rubrics, hidden tests, scoring secrets or reference solutions.
6. **Reuse shared components.** Copy versioned fragments from `components/<name>/` into standalone learner HTML using the declared markers and record the component version in `topic.json`. Components are authoring references, not runtime dependencies.
7. **Record review evidence.** Source receipts and independent critic records live under `authoring/evidence/<course>/...`; the mirrored course/module/topic path shows what they support.
8. **Generate locks.** Run `authoring/tools/pep lock <course>` after content or evidence changes. Never hand-edit a lock.

For the complete artifact, review and delivery rules, read `authoring/AGENTS.md` and the contracts in `authoring/docs/`.

## Root paths at a glance

| Path | Purpose |
|---|---|
| `<course>/` | Learner content, manifests, labs and learner-safe assessment blueprints |
| `curriculum/` | Shared curriculum source snapshots and integrity lock |
| `components/` | Reusable learner-facing UI fragments |
| `authoring/docs/` | HTML, lab, workflow and tool contracts |
| `authoring/evidence/` | Source receipts, critic reports and reconciliation records |
| `authoring/schemas/` | Manifest and evidence schemas |
| `authoring/tests/` | Tool tests and fixtures |
| `authoring/tools/` | Validation, lock, QA and export tooling |
| `.github/workflows/` | CI entrypoints kept at root for GitHub discovery |
| `AGENTS.md`, `CLAUDE.md` | Thin agent discovery entrypoints into `authoring/` |

## Local gates

Prerequisites: Git and the Node.js major named in `.nvmrc` (for example through `nvm use`).

```sh
npm ci
npm test
npm run check
```

The executable `authoring/tools/pep` CLI provides `check`, `lock`, `export`, `export-lab` and `new-topic`. Use `authoring/tools/pep --help` or `authoring/tools/pep <subcommand> --help`. Generated learner and lab bundles are written under the gitignored `build/` directory.

Every merge requires approval. See `authoring/docs/workflow.md` for branch scope, independent criticism, reconciliation and delivery rules.
