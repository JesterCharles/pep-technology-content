# pep-technology-content

Private source of PEP technology learner content.
Each topic's primary learner artifact is a standalone interactive HTML page, with derived companions (Markdown text alternative, optional PDF handout, practice quiz, curated video link and optional no-Docker coding lab).

This repository is private and proprietary; see `LICENSE-NOTICE.md`.

## Repository layout

```
README.md  AGENTS.md  LICENSE-NOTICE.md
docs/                         contracts: HTML artifact, lab, workflow
schemas/ tools/ tests/        validation tooling (lands in later tooling PRs)
components/                   versioned shared page components (later tooling PR)
<course>/
  course.json  course.lock.json
  assessments/                blueprints only, never keys or rubrics
  <module>/
    module.json  module.lock.json
    <topic>/                  topic.json, artifact.html and companions
evidence/<course>/<module>/<topic>/
```

There is one canonical `<course>/<module>/<topic>/` tree with no `topics/` level and no parallel versioned build folders.
Hashes and evidence bindings are generated per module in `<course>/<module>/module.lock.json`; `<course>/course.lock.json` covers only course-level files.
That split lets parallel module PRs proceed without ever editing one shared manifest.

## Contracts

- `docs/html-artifact-contract.md`: the learner page rules and companion artifacts.
- `docs/lab-contract.md`: the no-Docker coding-lab rules.
- `docs/workflow.md`: authoring, independent criticism, reconciliation, gates and delivery.
- `AGENTS.md`: the short contract every agent session follows.

## Quick start

Prerequisites: Git and the Node.js major named in `.nvmrc` (for example through `nvm use`).

```sh
git clone https://github.com/JesterCharles/pep-technology-content.git
cd pep-technology-content
nvm use
```

Read `AGENTS.md`, then the contract in `docs/` that matches your change.

## Gate commands

The repository gate interface is three commands, run in this order locally and in CI:

```sh
npm ci          # install pinned tooling
npm test        # tool unit tests
npm run check   # all content gates
```

These commands become available when the tooling PRs add `package.json`; this skeleton does not provide them yet.
Until then, CI passes with a log line stating that the tooling has not landed.

The tooling under `tools/` will also provide a `tools/pep` CLI with the `check`, `lock`, `export`, `export-lab` and `new-topic` subcommands; its own help is the reference for usage.

## Contributing

- Branch scope is one of: one module, course-level files, or repository tooling; never mix them.
- Content and mixed changes run full validation; internal tooling may use a direct PR.
- Every merge requires approval.

See `docs/workflow.md` for the full delivery rules.
