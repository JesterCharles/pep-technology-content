# Project agent memory

This file is the project contract for every agent working in this repository.
It points to the authoritative docs instead of copying them.
The root `AGENTS.md` is the discovery entrypoint and points here.

## Purpose

This repository is the private source of PEP technology learner content.
HTML is the primary learner artifact; every other topic file is a companion to it.

## Layout

- Content lives in one canonical root `<course>/<module>/<topic>/` tree.
  There is no `topics/` directory at any level, and there are no parallel or versioned build folders.
- A root directory containing `course.json` is a course; internal production material lives under `authoring/`.
- Directory names are stable slugs equal to ids (`^[a-z0-9]+(-[a-z0-9]+)*$`); order lives in `course.json` and `module.json`, never in name prefixes.
- A topic directory may contain only `topic.json`, `artifact.html`, `artifact.md`, `artifact.pdf`, `artifact.gift`, `video-artifact.md` and `coding-lab/`.
  An absent companion is recorded with a reason in `topic.json`; empty or placeholder files are forbidden.
- Manifests: `<course>/course.json`, `<course>/<module>/module.json`, `<course>/<module>/<topic>/topic.json`.
- Locks are generated, never hand-edited:
  - `<course>/<module>/module.lock.json` covers that module's files and its `authoring/evidence/<course>/<module>/` subtree.
  - `<course>/course.lock.json` covers only course-level files: `course.json`, course assessments, course labs and course-level evidence.
- Evidence lives under `authoring/evidence/<course>/` (course level) and `authoring/evidence/<course>/<module>/<topic>/` (per topic).
- Assessment blueprints live in `<course>/assessments/` or `<course>/<module>/assessments/`.
- Reusable learner components live in `components/`; schemas, tools, tests and process docs live in `authoring/`; CI remains in `.github/workflows/` for discovery.

## Never commit

- Assessment answer keys, rubrics, hidden tests, reference or instructor solutions and scoring secrets.
  Formative learner practice quizzes (`artifact.gift`) and MCQs are the one exception, because they are low-stakes.
- Hashes of short answer keys: a hash of "B" is trivially reversible.
  Record "validated at <commit> by run <id>" instead.
- Platform-only material; it stays in uncommitted private staging and is retired after confirmed upload.
- Real secrets, learner data, telemetry, browser profiles, screenshots, downloaded videos, and third-party code without a license record.

## Authoring contract

- Follow `authoring/docs/html-artifact-contract.md` for every learner page and companion.
- Shared page components come from `components/` at a declared version.
- No telemetry.

## Workflow

- Follow `authoring/docs/workflow.md`.
- An author's first output is never accepted.
- Two independent critics review, a non-author reconciles, and one correction loop runs at a time.

## Labs

- Follow `authoring/docs/lab-contract.md`.
- No Docker or other container engine; one language-native test command per lab; no committed solutions or hidden tests.

## Commands

- The repository gate interface is `npm ci`, `npm test` and `npm run check`; CI runs them from the root.
- The `authoring/tools/pep` CLI provides `check`, `lock`, `export`, `export-lab` and `new-topic`; read its help for usage.
- The QA harness ships with that tooling; run it locally through `npm run check`.
- Use `authoring/tools/pep <subcommand> --help` for deterministic, offline CLI usage; generated exports stay under gitignored `build/`.

## Sources

- Ground every technical claim in live official sources, recorded with retrieval dates in topic evidence.
- Never badge an unverified claim as verified; list it as unverified.

## Delivery

- Scope each branch and PR to one of: one module, course-level files, or repository tooling.
  A module branch edits only its module directory and its `authoring/evidence/<course>/<module>/` subtree; a course branch edits course-level files only; a tooling branch edits `authoring/`, `components/`, CI and root config only.
- Never let parallel branches edit the same manifest or lock.
- All gates must pass; merge only with approval.

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
Keep root `AGENTS.md` and `CLAUDE.md` as thin discovery entrypoints rather than duplicating this contract.
