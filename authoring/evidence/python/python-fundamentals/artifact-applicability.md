# Artifact applicability: python-fundamentals

This file reconciles the module against its authorized artifact contract:

- `authoring/evidence/python/intake.md`:
  - "Artifact applicability", rules line 289, legend line 291, rows lines 295-303;
  - "Lab plan", "No lab, with reason", line 337.
- The catalog manifests `authoring/catalog/python/course.json`, `authoring/catalog/python/python-fundamentals/module.json` and each topic's `topic.json`.
- The matrix v3 expected-artifact scope those lines cite (intake line 10).

Reconciled on 2026-10-14.

## Contract

- **Intake line 289:** "core topics require HTML (with embedded simulator practice), derived Markdown and a practice GIFT quiz, with a video only when a suitable verified one qualifies; the Reading topic also carries a printable PDF (matrix `print-handout`); the review topic carries HTML (with simulator) and Markdown only; absent companions record a reason."
- **Intake lines 295-303:** all nine `python-fundamentals` topics are `core` and read: html R, md R, pdf -, gift R, video V, lab -.
- **Intake line 337:** "`python-fundamentals` (S14-S15) and `fastapi-services` (S18): the confirmed expected-artifact scope gives these Concept-day topics no lab overlay. Page simulators carry the practice, and the `data-pipelines` lab exercises venv, script and pytest skills on the real toolchain."
- **Module manifest:** `module.json` has `moduleLabs: []`, and its `sourceCoverageNotes` record "No module coding lab".
- **Course labs:** the course has no course lab (`courseLabs` is empty, intake line 339). The Fast registrations project package is course-level and still an open slot (intake line 285), so it is outside this module.

## Per-topic result

Legend:

- **present**: authored in this module.
- **n/a**: not required by the contract line cited.

| Topic | html | md | gift | video text alternative | pdf / handout | topic lab |
|---|---|---|---|---|---|---|
| `python-syntax-for-java-developers` | present | present | present | present | n/a (line 295) | n/a (lines 295, 337) |
| `functions-and-arguments` | present | present | present | present | n/a (line 296) | n/a (lines 296, 337) |
| `lists-dicts-sets-and-tuples` | present | present | present | present | n/a (line 297) | n/a (lines 297, 337) |
| `slicing-and-comprehensions` | present | present | present | present | n/a (line 298) | n/a (lines 298, 337) |
| `mutability-and-aliasing` | present | present | present | present | n/a (line 299) | n/a (lines 299, 337) |
| `modules-imports-and-virtual-environments` | present | present | present | present | n/a (line 300) | n/a (lines 300, 337) |
| `exceptions-and-logging` | present | present | present | present | n/a (line 301) | n/a (lines 301, 337) |
| `writing-and-running-script-files` | present | present | present | present | n/a (line 302) | n/a (lines 302, 337) |
| `testing-with-pytest` | present | present | present | present | n/a (line 303) | n/a (lines 303, 337) |

Module coding lab: **not owned by this module** (intake line 337; `module.json` `moduleLabs: []`). The Standard lab overlay practises venv, script and pytest skills in the `data-pipelines` module lab.

## Why each n/a holds

- **PDF / handout:** the contract gives a printable PDF only to the course's Reading topic, `data-pipelines/keeping-sensitive-data-out-of-prompts` (matrix `print-handout`, intake line 289). All nine topics here are `core`. Each `topic.json` records `pdf` absent with this reason.
- **Topic lab:** each topic's practice runs in its page simulators, including the `python-syntax-for-java-developers` lesson editor, and S14-S15 are Concept days with no lab overlay (intake line 337). Each `topic.json` records `lab` absent with this reason. The educational critic confirms the omission (intake line 337).
- **Video:** the contract's **V** makes the video conditional on a verified qualifying video. All nine qualified on 2026-10-14, so each topic has a `video-artifact.md` and an `authoring/evidence/python/python-fundamentals/<topic>/video.json` receipt. The search is in `video-search.md`.

## Extra in this module

`python-syntax-for-java-developers` also embeds the `lesson-editor@3` shell with the `python@1` adapter, a captain requirement of 2026-10-14. See `lesson-editor/README.md` and that topic's `lesson-editor-import.json` receipt.
