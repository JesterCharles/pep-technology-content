# Workflow

Provenance: restates the quality process of the course-1 author contract, "Git/Linux/AI Foundations — local learner HTML authoring", and its source-freshness supplement, as adopted by the approved PEP technology-content plan.

This document defines how learner content is authored, criticized, reconciled, gated and delivered.

## 1. Scope

- In scope: learner content in the canonical `<course>/<module>/<topic>/` tree, its evidence, and the repository tooling that validates it.
- Out of scope: Evolv platform code or configuration, platform-only material, syllabus changes, assessment policy, publication, upload and deployment.

## 2. Pipeline

### 2.1 Intake and source freeze

- Fix the course slice from the curriculum, the module map, the topic list and draft objectives.
- Decide artifact applicability per topic and the lab plan, following `docs/html-artifact-contract.md` and `docs/lab-contract.md`.
- Set minute budgets from the curriculum day blocks.
- Freeze the official source list per topic, version-specific, and record curriculum snapshot hashes.
- Intake ships manifests only, never placeholder artifacts.

### 2.2 Authoring

- Authoring standard: content is authored with Claude Opus 5.5.
- One author context per module writes topics in order, which keeps components consistent.
- The author runs the local gates but never approves its own output.
- An author's first output is never accepted.

### 2.3 Independent criticism

- Every new or materially changed artifact gets two fresh, independent critics, run in parallel:
  - Educational critic: objectives are observable and aligned to checks; predict, teach, do and apply; nothing used before it is taught; cognitive load; retrieval and confidence; feedback on every option; beginner language; honest timing; accessible instructions; whether a lab or diagram earns its place; GIFT tests retention rather than recognition.
  - Technology SME critic: every technical claim, command, flag, default and version behavior; simulator fidelity against the real tool; labs build and run on the real toolchain; security and privacy in examples; source freshness.
    The SME critic grounds every finding in live official documentation fetched during review, recording URL, section, retrieval time and text hash.
- Critics see only the artifact bytes, the manifests, the intake and the frozen source list, never the author's transcript.
- Each finding records an id, a severity (`critical`, `high`, `medium` or `low`), a location, the claim, its evidence, a recommendation and the sha256 of the bytes reviewed.
- If no independent critic is available, the work pauses; it is never self-reviewed.

### 2.4 Reconciliation

- A non-author reconciles every finding as `accept`, `reject-with-evidence` or `escalate`, with a rationale.
- The author fixes accepted findings in one correction loop at a time.
- Critics recheck their high and critical findings against the new bytes.
- A second correction loop is allowed once; a third escalates.

### 2.5 Machine gates

All gates run on the final bytes, locally and in CI:

1. Schema: every manifest, lab, blueprint and evidence file validates.
2. Tree: no `topics/` directory; allowed filenames only; no empty or placeholder files; manifests and files match; absences carry reasons.
3. Lock: `module.lock.json` and `course.lock.json` are current, and every evidence binding equals the current bytes.
4. Forbidden content: no keys, rubrics, solutions, hidden tests or scoring secrets outside the formative GIFT and MCQ exception; secret scan; no remote fonts; no form-submission dependency.
5. Standalone and offline: loads from `file://` with network blocked and zero console errors.
6. Platform sandbox: every behavioral path completes in an iframe with `sandbox="allow-scripts"` only, tolerating storage failures.
7. Behavior: success route, wrong-first and retry route, simulator edge cases, restart without duplicate credit, and progress reaching 100%.
8. Accessibility: no serious or critical automated findings, keyboard-only path completes, visible focus, `aria-live`, reduced motion, contrast in both themes.
9. Responsive: desktop, short desktop, 400 px width and 200% zoom without horizontal scroll or clipped essentials.
10. Timing: estimator within budget, the about-label covers the worst required path, and day totals fit their blocks.
11. Sources: every claim mapped, sources fresh, links live, and unverified items listed.
12. GIFT: parses, ASCII only, one correct answer, feedback on every option, category matches the topic.
13. Video: live, public, embeddable and within budget.
14. Markdown and PDF: heading and objective parity, static alternatives present, PDF renders with extractable text.
15. Lab: the gates in `docs/lab-contract.md`.
16. Diagrams and licensing: inline SVG with title, description and text alternative; every third-party item has a license record.
17. Critic gate: both critic reports or rechecks cover the final bytes, zero open critical or high findings, and reconciliation by a non-author.

The tooling under `tools/` implements these gates behind `npm run check`.

### 2.6 Evidence

- Evidence for a topic lives under `evidence/<course>/<module>/<topic>/`: critic reports, reconciliation, QA receipt, timing and sources.
- Every evidence record names the sha256 of the artifact bytes it judged.
- `tools/pep lock` generates the locks, and a gate fails when any binding refers to old bytes:
  - `<course>/<module>/module.lock.json` covers that module's files and `evidence/<course>/<module>/`.
  - `<course>/course.lock.json` covers only course-level files: `course.json`, course assessments, course labs and course-level evidence.
- The per-module lock exists so parallel module PRs never edit one shared manifest.
- Screenshots, traces and browser profiles are CI artifacts or private local data, never committed.

## 3. Assessments and private staging

- Formative practice quizzes and MCQs may be committed, because they are low-stakes.
- Assessment answer keys, rubrics, reference solutions, hidden tests and scoring secrets never enter the repository, not even as hashes of short keys.
- Assessment blueprints may hold identity, objectives covered, item counts, durations and learner-facing instructions only.
- Temporary uncommitted private staging outside the repository is allowed for validation and platform handoff, and is retired after confirmed upload.

## 4. Branch scope and delivery

- Module branch: one focused branch and PR per module, editing only `<course>/<module>/` and `evidence/<course>/<module>/`.
- Course branch: course-wide assembly or shared course metadata, in a separate branch and PR after module integration, editing course-level files only.
- Tooling branch: repository-wide tooling in its own branch and PR, editing `schemas/`, `tools/`, `tests/`, `components/`, `docs/`, CI and root config only.
- Never mix these scopes in one branch, and never let parallel workers edit the same manifest or lock.
- Content and mixed changes run full validation; internal tooling may use a direct PR.
- Every merge requires approval.
