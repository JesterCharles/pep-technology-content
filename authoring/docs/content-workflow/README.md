# How PEP content is built

This is the short, repository-grounded guide to the PEP content pipeline. Open the [interactive companion](index.html) for the Archify golden path and stage-by-stage inspection. The HTML contains its diagram, styles, data and interaction inline, so core reading works from `file://`, offline, and without JavaScript.

## The golden path

1. **Freeze intake.** Select the curriculum slice from the locked snapshots, set the course/module/topic map, objectives, artifact applicability, lab plan and honest minute budgets, then freeze version-specific official sources. Intake creates manifests, never placeholders. Sources: [`../workflow.md`](../workflow.md), [`../../../curriculum/curriculum.lock.json`](../../../curriculum/curriculum.lock.json), [`../tools/validators.md`](../tools/validators.md).
2. **Map the canonical design.** Course, module and topic identities and order live in path-isomorphic manifests under `authoring/catalog/`. A topic exists in the catalog before learner bytes exist; its manifest records each artifact as present or absent with a reason. Sources: [`../../AGENTS.md`](../../AGENTS.md), [`../../../README.md`](../../../README.md), catalog schemas in [`../../schemas/`](../../schemas/).
3. **Author learner material.** `artifact.html` is the topic source of truth. It embeds its CSS, JavaScript, data and accessible visuals. Deterministic Markdown, optional PDF, formative GIFT and optional video records are companions. Labs are multi-file bundles only when real-toolchain practice earns the setup cost. Sources: [`../html-artifact-contract.md`](../html-artifact-contract.md), [`../lab-contract.md`](../lab-contract.md), [`../tools/qa.md`](../tools/qa.md).
4. **Bind provenance.** Source receipts bind live official-source fetches to current artifact bytes. Video receipts separately prove public availability, embeddability and duration. Evidence paths mirror course/module/topic scope. Sources: [`../tools/validators.md`](../tools/validators.md), [`../tools/evidence.md`](../tools/evidence.md), evidence schemas in [`../../schemas/`](../../schemas/).
5. **Run deterministic gates.** `npm test`, `authoring/tools/pep migrate-catalog --check`, and `npm run check` are the repository and CI interface. The workflow defines 18 conceptual gates; the current tool directory implements them in 22 `T*.mjs` check modules. The QA harness covers offline, sandboxed behavior, accessibility, responsive layouts and deterministic Markdown/PDF checks. Sources: [`../../../package.json`](../../../package.json), [`../../../.github/workflows/ci.yml`](../../../.github/workflows/ci.yml), [`../../tools/pep`](../../tools/pep), [`../../tools/checks/`](../../tools/checks/).
6. **Obtain independent criticism.** Fresh education and technology-SME critics review final bytes independently. They do not see the author transcript. The SME grounds findings in live official documentation. No available independent critic means pause, not self-approval. Source: [`../workflow.md`](../workflow.md).
7. **Reconcile, correct and recheck.** A non-author decides `accept`, `reject-with-evidence` or `escalate`. The author applies accepted findings one correction loop at a time. The relevant critics recheck high and critical findings against new hashes. One second correction loop is allowed; a third escalates. Sources: [`../workflow.md`](../workflow.md), [`../tools/evidence.md`](../tools/evidence.md), [`../../tools/checks/T25-critic-gate.mjs`](../../tools/checks/T25-critic-gate.mjs).
8. **Reconcile catalog and locks.** Content, declarations and evidence must agree. `authoring/tools/pep lock` regenerates scope-local course or module locks; locks retain historical stale bindings but only current bindings count for review coverage. T04/T05/T06 enforce catalog/file/lock agreement and T25 enforces current critic coverage. Sources: [`../workflow.md`](../workflow.md), [`../tools/evidence.md`](../tools/evidence.md), [`../../tools/lib/locks.mjs`](../../tools/lib/locks.mjs).
9. **Open a focused PR and pass CI.** Branch scope is module, course or tooling—never a mixture. CI repeats tests, migration check and the complete gate run. Every merge requires approval. Sources: [`../workflow.md`](../workflow.md), [`../../../.github/workflows/ci.yml`](../../../.github/workflows/ci.yml).
10. **Hand off neutrally.** `pep export` and `pep export-lab` prepare tracked learner material and a checksummed lab bundle under ignored `build/`. Platform conversion, private assessment material, upload, publication and deployment remain outside this repository. Source: [`../lab-contract.md`](../lab-contract.md), [`../../tools/pep`](../../tools/pep).

### Real branches only

- **Standalone learner artifacts:** HTML is primary. Markdown, PDF, GIFT and video are present only when declared; every absence has a reason.
- **Labs:** a topic, module or course bundle may exist. It has one language-native test command and no container engine. Private solutions and hidden tests never enter Git.
- **Video:** `video-artifact.md` is optional; a current `video.json` receipt is required when it exists. No video file is downloaded.
- **Archify:** supports authoring and repository documentation only. Adapted output is self-contained SVG with system fonts and a license record; it is never a learner-page runtime or interaction engine.

## What the state words mean

These are operational reading terms, not a new manifest state machine.

| State | Minimum defensible meaning | It does **not** mean |
|---|---|---|
| **Authored** | Intended learner bytes exist, catalog declarations match them, and required source/provenance records have been prepared. | Accepted, approved or merged. An author's first output is never accepted. |
| **Independently reviewed** | Current education and SME evidence covers each reviewable file; every finding has non-author reconciliation; no critical/high item remains open under T25. | All deterministic gates pass, or an approval exists. |
| **Delivery-ready** | Final bytes pass applicable local tests and checks, declarations and locks are regenerated, review evidence is current, and the focused PR is ready for approval. | Merged, uploaded, published or platform-accepted. |
| **Landed** | The approved focused PR has merged into the default branch and its CI result applies to that merged commit. | Platform delivery. |
| **Platform-ready** | The neutral export is available and any required private staging has been validated for handoff to the platform owner. | Upload or acceptance. Those outcomes are not tracked here, so this guide cannot claim them. |

## Prompts and roles

The repository tracks role contracts, schemas and evidence—not a standalone author, critic or reconciler prompt file. Do not reconstruct a hidden prompt from review prose or claim unverifiable model behavior. The canonical safe instruction anchors are:

- author: [`../../AGENTS.md`](../../AGENTS.md), [`../workflow.md`](../workflow.md), and the HTML/lab contracts;
- education critic and technology-SME critic: the role definitions in [`../workflow.md`](../workflow.md) §2.3;
- non-author reconciler and rechecker: [`../workflow.md`](../workflow.md) §2.4 and [`../tools/evidence.md`](../tools/evidence.md);
- deterministic tools: source and CLI help under [`../../tools/`](../../tools/).

The interactive companion labels this honestly as “prompt not tracked” and shows only short excerpts or links from those tracked contracts.

## Worked example: Linux Foundations

[`git-linux-ai-foundations/linux-foundations`](../../../git-linux-ai-foundations/linux-foundations/) is a tracked end-to-end example, selected for evidence completeness rather than rank. The generated [metrics snapshot](metrics.json) proves:

- 5 topics, each with HTML, Markdown, GIFT and video; 1 topic also has a PDF;
- 5 source receipts, 5 video receipts and 5 declarative QA-path files;
- 7 unique module-review findings: 4 medium and 3 low; all 7 were accepted;
- first recheck: 5 resolved and 1 open; a bounded second correction/recheck cycle closes all 7 unique findings; no third cycle was used;
- the current module lock inventories 74 tracked file records.

Follow the bytes from the [module manifest](../../catalog/git-linux-ai-foundations/linux-foundations/module.json), through the [module reviews](../../evidence/git-linux-ai-foundations/linux-foundations/), to the [generated lock](../../catalog/git-linux-ai-foundations/linux-foundations/module.lock.json). `node authoring/tools/pep check --only T25 git-linux-ai-foundations/linux-foundations` verifies the current critic gate without using private material.

Repository-wide counts in `metrics.json` are a source-tree snapshot, **not** production telemetry: 9 catalog courses, 36 modules, 249 catalog topics, 26 topics with HTML, 2 learner labs and 8 learner-safe assessment blueprints at the time of generation. Duration, model token/cost data, platform acceptance and learner telemetry are unavailable.

## Archify provenance and reproduction

The diagram producer is `tt-a1i/archify` **v3.0.1**, annotated tag object `679f195584e4216fd582c073d8964b3a9f59107e`, resolving to commit `2ab3cae7ac2c2a55d7386ca789d03c4fcd31816c`. The repository license at that commit is MIT. The actual CLI is `archify/bin/archify.mjs`; its SHA-256 is `97788086acaac4122aafc56c48acfe5fde1979d6aaa67db73aa1f4ab70b34390`. This is the source repository, not the unrelated npm package named `archify`.

Tracked reproduction assets:

- [`golden-path.archify.json`](golden-path.archify.json): typed workflow input;
- [`reproduce-diagram.mjs`](reproduce-diagram.mjs): deterministic render, SVG extraction/adaptation and offline drift check;
- [`diagram-provenance.json`](diagram-provenance.json): exact input, raw HTML, script and final SVG hashes;
- [`golden-path.svg`](golden-path.svg): adapted final SVG, embedded byte-for-byte into `index.html`.

To reproduce without network behavior, obtain and extract the pinned commit, verify the archive SHA-256 recorded in `diagram-provenance.json`, then run:

```sh
node authoring/docs/content-workflow/reproduce-diagram.mjs \
  --archify-root /path/to/extracted/archify-v3.0.1
```

Add `--write` only after reviewing an intentional diagram change. The script checks the version, MIT license, package CLI mapping, CLI/license hashes, raw render hash, post-processing script hash and final SVG hash. It invokes only Archify `render`; it never invokes update, finalize, deliver, preview or any network behavior. The shipped guide has no Archify runtime dependency.

Refresh and verify repository metrics with:

```sh
node authoring/docs/content-workflow/generate-metrics.mjs --write
node authoring/docs/content-workflow/generate-metrics.mjs
```
