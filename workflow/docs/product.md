# Product

<!-- impeccable:product-schema 1 -->

> This record is inferred from the explicit repository contracts and the assigned internal-guide brief because this autonomous lane has no interactive product-answer mechanism.

## Platform

web

## Users

PEP content authors, independent education and technology reviewers, non-author reconcilers, repository maintainers, and platform handoff owners. They need to understand which tracked artifact or record owns each step and what evidence makes a content state defensible.

## Product Purpose

This private repository is the canonical source of PEP technology learner content and its authoring evidence. Success means learner artifacts are source-grounded, independently reviewed, deterministically validated, catalog-bound, approved, and handed off without exposing protected assessment or learner material.

## Operating Context

Work happens in focused module, course, or tooling branches. Authors use curriculum snapshots, path-isomorphic catalog manifests, standalone learner artifacts, evidence records, generated locks, the `workflow/tools/pep` CLI, repository tests, pull requests, and CI. Platform publication remains outside this repository.

## Capabilities and Constraints

- HTML is the primary topic artifact; companion files are present or explicitly absent in catalog metadata.
- Curriculum snapshots and generated locks establish deterministic integrity boundaries.
- Fresh education and technology criticism, non-author reconciliation, and bounded correction/recheck loops are mandatory.
- Core artifacts work offline; internal documentation must not depend on telemetry, runtime services, external fonts, or network-loaded assets.
- Assessment keys, rubrics, hidden tests, solutions, credentials, learner data, and platform-only material never enter the repository.
- This repository supports neutral export and handoff; it does not publish, upload, deploy, or prove platform acceptance.

## Evidence on Hand

Authoritative contracts live in `workflow/AGENTS.md` and `workflow/docs/`; executable behavior lives in `workflow/tools/`, `workflow/schemas/`, `workflow/tests/`, root package scripts, and `.github/workflows/ci.yml`. Catalog and review evidence live under `workflow/catalog/` and `workflow/evidence/`. Completed and in-progress learner modules provide tracked examples.

## Product Principles

1. Tracked executable truth outranks status prose.
2. Every claim, review, and delivery state names its evidence boundary.
3. Human judgment and deterministic gates complement rather than replace each other.
4. Protected material stays out of both learner artifacts and process documentation.
5. Handoff states are named honestly; repository readiness is not platform publication.

## Accessibility & Inclusion

Learner and documentation surfaces must support keyboard and touch-equivalent use, visible focus, semantic structure, reduced motion, both supported color schemes, 200% zoom, and a 400 px viewport without horizontal page scrolling. Core reading remains available without JavaScript.
