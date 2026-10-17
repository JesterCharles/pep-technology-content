# How PEP content is built

PEP turns approved curriculum into a reviewed, evidence-backed learner-content package through one six-stage path:

1. **Input — freeze curriculum and sources.** Fix scope, timing, applicability and version-specific official references before learner material exists. Source: [`../workflow.md`](../workflow.md) §2.1.
2. **Design — align objectives and activities.** Order explanations, practice and checks so each serves an approved outcome and teaches before use. Source: [`../workflow.md`](../workflow.md) §2.2.
3. **Create — author learner material.** Build the standalone lesson first, then only the declared text alternatives, formative questions, video records and authentic labs. Sources: [`../html-artifact-contract.md`](../html-artifact-contract.md) and [`../lab-contract.md`](../lab-contract.md).
4. **Verify — check content and behavior.** Bind technical claims to current official sources and exercise accessibility, offline behavior, timing, companions, labs and assessments with deterministic checks. Sources: [`../tools/validators.md`](../tools/validators.md) and [`../tools/qa.md`](../tools/qa.md).
5. **Review + improve — apply two independent lenses.** Education and technology reviewers inspect the same exact candidate. A non-author reconciles findings; accepted corrections receive a fresh same-role recheck. Source: [`../workflow.md`](../workflow.md) §§2.3–2.4.
6. **Ready — reconcile the content package.** Confirm declarations, learner bytes, source receipts, deterministic results and independent review evidence are complete and current for the same package. Source: [`../workflow.md`](../workflow.md) §2.6.

The **Simple** tab is the first-read path. Selecting a stage reveals what happens, why it matters to learners and what proves quality; specialist tools, evidence and metrics stay in native disclosures.

The **Detailed** tab preserves the same path and adds six bounded content corrections:

- unclear curriculum or source intent returns to Input;
- an objective/activity mismatch returns to Design;
- inaccurate or inaccessible material returns to Create;
- a lab or behavior defect returns to Create, then reruns Verify;
- independent findings move through reconciliation, correction and fresh exact-byte recheck;
- stale evidence after correction returns only to the affected proof and review steps.

With JavaScript, Detailed begins on a clean happy path. Its six stage nodes are selectable by mouse, touch, Enter/Space and arrow keys. One selected stage and its correction loop remain prominent, unrelated loops dim, and exactly one public-safe example appears. Without JavaScript, all six examples remain available as sequential native disclosures.

## Content states

| State | Proven here |
|---|---|
| **Designed** | Objectives, activities, timing and learner formats map to approved curriculum. |
| **Created** | Declared learner material exists and follows the artifact and lab contracts. |
| **Verified** | Applicable deterministic content and behavior checks pass on current bytes with current source proof. |
| **Independently reviewed** | Education and technology evidence covers one candidate; accepted findings have fresh same-role rechecks. |
| **Package ready** | Declarations, checks and review evidence are complete and current for one exact learner-content package. |

Package readiness is the boundary of this guide. Any later distribution process is separate and is not represented here.

## Representative evidence

Linux Foundations is the representative example because its tracked content and review evidence are complete, not because it is ranked:

- 5 ordered topics and 21 learner artifacts: 5 HTML, 5 Markdown, 1 PDF, 5 GIFT and 5 video records;
- 5 source receipts, 5 video receipts and 5 QA-path files;
- 7 accepted review findings;
- 5 resolved / 1 open after the first recheck, then all 7 resolved after the second;
- no third correction cycle.

Follow the [learning plan](../../catalog/git-linux-ai-foundations/linux-foundations/module.json), [learner material](../../../foundational-track/git-linux-ai-foundations/linux-foundations/) and [review evidence](../../evidence/git-linux-ai-foundations/linux-foundations/).

## Dated metrics

[`metrics.json`](metrics.json) is a point-in-time content snapshot captured on `2026-10-14`, not learner telemetry: 9 courses, 36 modules, 249 catalog topics, 26 topics with HTML, 2 learner labs, 8 learner-safe blueprints, and 18 contractual gates implemented by 22 check modules.

Unavailable—and not estimated—are workflow/review duration, model tokens or cost, and learner usage, completion or performance.

Preview the live content tree without changing the snapshot:

```sh
node workflow/docs/content-workflow/generate-metrics.mjs
```

## Archify provenance and reproduction

Archify is a build-time producer only. Both final SVGs and all guide interactions are static and self-contained.

The pinned producer is `tt-a1i/archify` **v3.0.1**, annotated tag object `679f195584e4216fd582c073d8964b3a9f59107e`, resolving to `2ab3cae7ac2c2a55d7386ca789d03c4fcd31816c`, under MIT. The actual CLI is `archify/bin/archify.mjs` with SHA-256 `97788086acaac4122aafc56c48acfe5fde1979d6aaa67db73aa1f4ab70b34390`; it is not the unrelated npm package named `archify`.

Tracked assets:

- Simple: [`golden-path.archify.json`](golden-path.archify.json), [`golden-path.svg`](golden-path.svg), [`diagram-provenance.json`](diagram-provenance.json), [`reproduce-diagram.mjs`](reproduce-diagram.mjs).
- Detailed: [`detailed-architecture.archify.json`](detailed-architecture.archify.json), [`detailed-architecture.svg`](detailed-architecture.svg), [`detailed-diagram-provenance.json`](detailed-diagram-provenance.json), [`reproduce-detailed-diagram.mjs`](reproduce-detailed-diagram.mjs).
- Binding: [`bind-diagram.mjs`](bind-diagram.mjs) embeds both SVGs byte-for-byte in [`index.html`](index.html).

Simple hashes: input `bec66d7c7083f10bf25696e65a71ce03f2280f0937667a6cda189fcd22faf2eb`; raw Archify HTML `023291c51319c3626af8d2910b6f3efc1cf3ef51e4588457ebee5fe0d2c90fa7`; final SVG `b223535eb0c165eee86c39c177f2f8c0535b55697e2b1ff89d2b068183072b09`.

Detailed hashes: input `1e4e0f1a7a750c866e10034791a6c6427d8ae634f6cfe2a1471a6b4af15017e7`; raw Archify HTML `cfcf6561e3615ddee2ce966389d11f8df54ced39518c5e2b26430d81e9439ab4`; final SVG `b6b58a9c41d0dc01d0a68936c8ace0ee390bbcaad2f843f478519d76829d0f12`.

Reproduce from a verified, extracted v3.0.1 source tree:

```sh
node workflow/docs/content-workflow/reproduce-diagram.mjs \
  --archify-root /path/to/extracted/archify-v3.0.1
node workflow/docs/content-workflow/reproduce-detailed-diagram.mjs \
  --archify-root /path/to/extracted/archify-v3.0.1
node workflow/docs/content-workflow/bind-diagram.mjs --check
```

The recipes invoke only local rendering. Use `--write` only after reviewing an intentional source change.

## Safety and Artifact source

[`index.html`](index.html) is the exact single-file Claude Artifact source. It has no runtime network, font, media, sibling-file or Archify dependency. [`PUBLICATION-SAFETY.md`](PUBLICATION-SAFETY.md) records the disclosure inventory and separate authorization boundary.
