# How PEP content is built

Open the [interactive companion](index.html) to scan the complete path and inspect one stage at a time. **Simple** is the default six-stage guide; **Detailed** adds the authenticated correction loops and stage-adjacent failure disclosures. The same file is the Claude-Artifact-ready source. It embeds both diagrams, styles, data and interaction, so the core reading works from `file://`, offline and without JavaScript. Review [`PUBLICATION-SAFETY.md`](PUBLICATION-SAFETY.md) before any separately authorized public share.

## The six-stage path

1. **Input — freeze what should be taught.** Fix the approved curriculum slice, topic list, draft objectives, artifact applicability, honest timing and version-specific official sources before learner files exist. Intake creates manifests, never placeholders. Sources: [`../workflow.md`](../workflow.md) §2.1, [`../../../curriculum/curriculum.lock.json`](../../../curriculum/curriculum.lock.json), [`../tools/validators.md`](../tools/validators.md).
2. **Design — give it one stable structure.** Put course, module and topic identity and order in path-isomorphic manifests under `authoring/catalog/`. Declare every intended companion present or absent with a reason. Sources: [`../../AGENTS.md`](../../AGENTS.md), [`../../../README.md`](../../../README.md), [`../../schemas/`](../../schemas/).
3. **Build — create one standalone learner experience.** `artifact.html` is primary. Add deterministic Markdown, optional PDF, formative GIFT, video records or a real-toolchain lab only where declared and justified. Archify assets support authoring documentation only; they are not learner-page runtime. Sources: [`../html-artifact-contract.md`](../html-artifact-contract.md), [`../lab-contract.md`](../lab-contract.md), [`../tools/qa.md`](../tools/qa.md).
4. **Verify — bind claims and exercise final behavior.** Source receipts bind current official documentation to artifact hashes; video receipts separately prove availability and duration. Local gates check structure, offline and sandboxed behavior, accessibility, responsiveness, timing and companion parity. Sources: [`../tools/validators.md`](../tools/validators.md), [`../tools/evidence.md`](../tools/evidence.md), [`../../tools/pep`](../../tools/pep).
5. **Review + improve — apply independent judgment.** Fresh education and technology critics review the same candidate independently. A non-author reconciles every finding; the author corrects accepted findings; relevant critics recheck fresh hashes. One second correction loop is allowed; a third escalates. Sources: [`../workflow.md`](../workflow.md) §§2.3–2.4, [`../tools/evidence.md`](../tools/evidence.md), [`../../tools/checks/T25-critic-gate.mjs`](../../tools/checks/T25-critic-gate.mjs).
6. **Deliver — reconcile, approve and hand off neutrally.** Align declarations, learner files and evidence; regenerate the scope-local lock; open a focused PR; pass CI; obtain approval. `pep export` and `pep export-lab` create ignored neutral bundles. Platform conversion, upload and publication remain outside this repository. Sources: [`../workflow.md`](../workflow.md) §4, [`../../../.github/workflows/ci.yml`](../../../.github/workflows/ci.yml), [`../lab-contract.md`](../lab-contract.md).

### Detailed correction loops

The Detailed tab preserves the same happy path and shows bounded returns to the smallest owner:

- unclear scope or source versions return to Input/clarification before learner bytes advance;
- catalog/tree mismatches return to Design;
- artifact and deterministic-gate defects return to the owning authoring step, followed by affected-gate reruns;
- accepted education or technology findings move through non-author reconciliation, correction and fresh same-role recheck; a second loop is allowed once and a third escalates;
- stale receipts, solved-run records, review bindings or locks require fresh exact-head proof and affected checks;
- CI/tooling defects return to the responsible content or tooling stage;
- a platform-owner rejection returns to the owning stage and requires a new neutral export, but platform acceptance remains external and untracked.

Each closed disclosure names the failure in plain language. Opening it identifies what failed, where work returns, what evidence refreshes and what permits resuming.

### Real branches, only where applicable

- **Companions:** Markdown, PDF and formative GIFT are declared per topic; every absence has a reason.
- **Labs:** a topic, module or course may carry one language-native bundle with no committed solution or hidden test.
- **Video:** `video-artifact.md` is optional and requires a current `video.json` receipt. No video file is downloaded.
- **Archify:** produces static authoring/documentation SVG only. The shipped guide has no Archify runtime dependency.

## Readiness words

These are reading terms, not a new manifest state machine.

| State | Minimum defensible meaning | Not implied |
|---|---|---|
| **Authored** | Intended learner bytes exist; declarations match; required provenance is prepared. | Accepted, approved or merged. |
| **Independently reviewed** | Current education and SME coverage; every finding reconciled by a non-author; no open critical/high. | All deterministic gates pass or approval exists. |
| **Delivery-ready** | Final bytes pass applicable local gates; declarations, locks and review evidence are current; the focused PR is reviewable. | Merged, uploaded or platform-accepted. |
| **Landed** | The approved focused PR is merged to the default branch and merged-commit CI applies. | Platform delivery. |
| **Platform-ready** | A neutral export exists and required private staging has been validated for handoff. | Upload or acceptance. Those outcomes are not tracked here. |

## Roles and prompt ownership

The repository tracks role contracts, schemas and evidence—not a standalone author, critic or reconciler prompt file. Do not reconstruct hidden prompts or claim unverifiable model behavior.

- author: [`../../AGENTS.md`](../../AGENTS.md), [`../workflow.md`](../workflow.md), and the HTML/lab contracts;
- education and technology critics: [`../workflow.md`](../workflow.md) §2.3;
- non-author reconciler and rechecker: [`../workflow.md`](../workflow.md) §2.4 and [`../tools/evidence.md`](../tools/evidence.md);
- deterministic behavior: CLI help and checks under [`../../tools/`](../../tools/).

The interactive guide places these safe excerpts and links inside the stage they govern.

## One module through the same path

[`git-linux-ai-foundations/linux-foundations`](../../../git-linux-ai-foundations/linux-foundations/) is the representative example because its tracked evidence is complete, not because it is ranked.

| Stage | Tracked example |
|---|---|
| Input | five curriculum-mapped topics |
| Design | five ordered topic IDs in the [module manifest](../../catalog/git-linux-ai-foundations/linux-foundations/module.json) |
| Build | 21 learner artifacts: 5 HTML, 5 Markdown, 1 PDF, 5 GIFT and 5 video records |
| Verify | 5 source receipts, 5 video receipts and 5 QA-path files |
| Review + improve | 7 accepted findings; 5 resolved / 1 open after the first recheck; all 7 resolved after the second; no third cycle |
| Deliver | 74 file records in the generated [module lock](../../catalog/git-linux-ai-foundations/linux-foundations/module.lock.json) |

Follow the evidence from the manifest through the [review and recheck records](../../evidence/git-linux-ai-foundations/linux-foundations/) to the lock. `node authoring/tools/pep check --only T25 git-linux-ai-foundations/linux-foundations` verifies current critic coverage without private material.

## Dated repository context

[`metrics.json`](metrics.json) is a point-in-time source-tree snapshot captured on `2026-10-14`, not telemetry or a deployment claim: 9 catalog courses, 36 modules, 249 topics, 26 topics with HTML, 2 learner labs, 8 learner-safe blueprints, and 18 contractual gates implemented by 22 current `T*.mjs` modules. Content PRs do not refresh this documentation snapshot and CI does not compare it with the growing live tree.

Unavailable—and not estimated—are authoring/review duration, model tokens or cost, platform upload/acceptance and learner usage, completion or performance.

Preview current metrics on stdout, or intentionally record a new dated snapshot on a tooling branch:

```sh
node authoring/docs/content-workflow/generate-metrics.mjs
node authoring/docs/content-workflow/generate-metrics.mjs --write
```

When recording a snapshot, update the same dated values in this README and the interactive guide.

## Archify provenance and reproduction

The producer is `tt-a1i/archify` **v3.0.1**, annotated tag object `679f195584e4216fd582c073d8964b3a9f59107e`, resolving to commit `2ab3cae7ac2c2a55d7386ca789d03c4fcd31816c`. The license is MIT. The actual CLI is `archify/bin/archify.mjs` with SHA-256 `97788086acaac4122aafc56c48acfe5fde1979d6aaa67db73aa1f4ab70b34390`; this is not the unrelated npm package named `archify`.

Tracked assets:

- [`golden-path.archify.json`](golden-path.archify.json), [`golden-path.svg`](golden-path.svg), [`diagram-provenance.json`](diagram-provenance.json) and [`reproduce-diagram.mjs`](reproduce-diagram.mjs): Simple source, adapted SVG, hashes and deterministic drift check;
- [`detailed-architecture.archify.json`](detailed-architecture.archify.json), [`detailed-architecture.svg`](detailed-architecture.svg), [`detailed-diagram-provenance.json`](detailed-diagram-provenance.json) and [`reproduce-detailed-diagram.mjs`](reproduce-detailed-diagram.mjs): Detailed source, adapted SVG, hashes and deterministic drift check;
- [`bind-diagram.mjs`](bind-diagram.mjs): proves both adapted SVGs are embedded byte-for-byte in `index.html`.

Simple hashes remain: input `92ae09ca55005a721e97647ced74137c639fdc719318c13a6d73b6158e5feecd`; raw Archify HTML `af0f705ad0fef143e6755444527cf4b6797d707f3a4dbc2b05c4df44fe475b9a`; final SVG `5ca3cf3ea81b51c00fead395da14840ca8f14eb4e3d3e00667e47e1150775f21`.

Detailed hashes are: input `80f7d1152b9fcc2642f0b4e60aaf61d1005ea693558610d3c38597695f0aa90e`; raw Archify HTML `14325849945e85206569ffbdfb823f3b05fde8b513953f9e29edb53338e898ea`; final SVG `5e15d4dd8d0221ed2dcad862b40adf2fe1f2773aac7b86c707bc21f08e0bb0e8`.

After obtaining and verifying the pinned source archive recorded in `diagram-provenance.json`, reproduce without network behavior:

```sh
node authoring/docs/content-workflow/reproduce-diagram.mjs \
  --archify-root /path/to/extracted/archify-v3.0.1
node authoring/docs/content-workflow/reproduce-detailed-diagram.mjs \
  --archify-root /path/to/extracted/archify-v3.0.1
node authoring/docs/content-workflow/bind-diagram.mjs --check
```

Use `--write` only after reviewing an intentional diagram change. The recipe invokes Archify `render` only—never update, finalize, deliver, preview or another network behavior.
