# Workflow

Provenance: restates the quality process of the course-1 author contract, "Git/Linux/AI Foundations — local learner HTML authoring", and its source-freshness supplement, as adopted by the approved PEP technology-content plan.

This document defines how learner content is authored, criticized, reconciled, gated and delivered.

## 1. Scope

- In scope: learner content in the canonical `<course>/<module>/<topic>/` tree, its path-isomorphic metadata under `authoring/catalog/<course>/`, its evidence, and the repository tooling that validates it.
- Out of scope: Evolv platform code or configuration, platform-only material, syllabus changes, assessment policy, publication, upload and deployment.

## 2. Pipeline

### 2.1 Intake and source freeze

- Fix the course slice from the curriculum, the module map, the topic list and draft objectives.
- Decide artifact applicability per topic and the lab plan, following `authoring/docs/html-artifact-contract.md` and `authoring/docs/lab-contract.md`.
- Set minute budgets with the allocation policy in `authoring/docs/tools/validators.md`.
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

All gates run on the final bytes.
Every gate runs locally and in CI except the lab solved-run gate (part of gate 15), which needs uncommitted private staging; `authoring/docs/lab-contract.md` defines how it is recorded and how CI checks that record.

1. Schema: every manifest, lab, blueprint and evidence file validates.
2. Tree: no `topics/` directory; allowed filenames only; no empty or placeholder files; manifests and files match; absences carry reasons.
3. Lock: catalog `module.lock.json` and `course.lock.json` are byte-identical to regeneration. Each evidence binding records whether its reviewed hash is current; stale critic coverage is rejected by gate 18.
4. Forbidden content: no keys, rubrics, solutions, hidden tests or scoring secrets outside the formative GIFT and MCQ exception; secret scan; no remote fonts; no form-submission dependency.
5. Standalone and offline: loads from `file://` with network and sibling-file requests blocked and zero console errors; every learner artifact meets the standalone rules in `authoring/docs/html-artifact-contract.md` (T09, T20).
6. Platform sandbox: every behavioral path completes in an iframe with `sandbox="allow-scripts"` only, tolerating storage failures.
7. Behavior: success route, wrong-first and retry route, simulator edge cases, restart without duplicate credit, progress reaching 100%, and optional disclosures excluded from required objective/progress/completion state.
8. Accessibility: no serious or critical automated findings, keyboard-only path completes, visible focus, `aria-live`, reduced motion, contrast in both themes.
9. Responsive and input: pages migrated with `data-pep-responsive` cover desktop, short desktop, 320/390 px phone portrait, practical phone landscape, 768 px tablet portrait and 200% zoom; no page-level horizontal overflow or clipped essentials; 44 px touch targets; wrapping topic/progress controls; usable Restart; instructions before interactions; virtual-keyboard-safe fields; bounded editor/output regions without a scroll trap; and reachable Problems/Output with context. Unmigrated pages retain the prior 400 px matrix until re-authored; never add the marker without the responsive fix.
10. Timing: estimator within budget, contract-owned `data-section-skip` optional disclosures excluded, the about-label covers the worst required path, and day totals fit their blocks.
11. Sources: every claim mapped, sources fresh, links live, and unverified items listed.
12. GIFT: parses, ASCII only, one correct answer, feedback on every option, category matches the topic.
13. Video: live, public, embeddable and within budget.
14. Markdown and PDF: heading and objective parity, static alternatives present, PDF renders with extractable text.
15. Lab: the gates in `authoring/docs/lab-contract.md`; the solved-run gate is local-only with recorded evidence that CI checks.
16. Diagrams: inline SVG with title, description and text alternative.
17. Licensing: every third-party item has a license record.
18. Critic gate: both critic reports or rechecks cover the final bytes, zero open critical or high findings, and reconciliation by a non-author.

The tooling under `authoring/tools/` implements these gates behind `npm run check`.

### 2.6 Evidence

- Topic evidence lives under `authoring/evidence/<course>/<module>/<topic>/`. Course evidence lives directly under `authoring/evidence/<course>/`; module assessment and lab evidence may live directly under `authoring/evidence/<course>/<module>/`.
- Topic critic filenames are `critic-education.json`, `critic-sme.json`, `critic-education-recheck.json`, `critic-sme-recheck.json` and `reconciliation.json`. Course- and module-level records prefix those names with the reviewed unit, for example `intake-critic-sme.json` and `intake-reconciliation.json`.
- A critic report's optional `reviewedPath` names its repo-relative review target. A recheck names its original same-role report in `recheck.of`; each rechecked item records its finding id, `resolved` or `open` status, repo-relative file, current reviewed sha256 and a note. A recheck may have no new `findings`.
- For each `reviewedSha256` or `artifactSha256`, the binding target is the containing object's `reviewedPath`, then its `file`, then its `location.file`, then the nearest ancestor `reviewedPath`. Topic evidence otherwise defaults to that topic's `artifact.html`; evidence at other levels must name a target. `artifactHashes` retains its map-key-relative behavior.
- `authoring/tools/pep lock` records each in-scope evidence hash, resolved target and `current: true|false`. Stale hashes are retained rather than preventing regeneration. A target removed after immutable review evidence was recorded remains explicitly marked `current: false`, `historical: true`, and `missing: true`; it cannot provide current T25 coverage. T06 requires every lock to exist and be byte-identical to regeneration, while T25 rejects stale critic coverage.
  - `authoring/catalog/<course>/<module>/module.lock.json` covers that module's catalog metadata, learner files and `authoring/evidence/<course>/<module>/`.
  - `authoring/catalog/<course>/course.lock.json` covers only course-level files: catalog `course.json`, learner course assessments/labs and course-level evidence. A course evidence reference to module content or catalog metadata is a historical intake record: its bytes remain protected by the course evidence file record, but its target is excluded from current course-lock bindings so later module work cannot stale the shared lock.
- The per-module lock exists so parallel module PRs never edit one shared manifest.
- Screenshots, traces and browser profiles are CI artifacts or private local data, never committed.

## 3. Assessments and private staging

- Formative practice quizzes and MCQs may be committed, because they are low-stakes.
- Assessment answer keys, rubrics, reference solutions, hidden tests and scoring secrets never enter the repository, not even as hashes of short keys.
- Assessment blueprints may hold identity, objectives covered, item counts, durations and learner-facing instructions only.
- Temporary uncommitted private staging outside the repository is allowed for validation and platform handoff, and is retired after confirmed upload.

## 4. Branch scope and delivery

- Module branch: one focused branch and PR per module, editing `<course>/<module>/`, `authoring/catalog/<course>/<module>/` and `authoring/evidence/<course>/<module>/`.
- Course branch: course-wide assembly or shared course metadata, in a separate branch and PR after module integration, editing course-level learner, catalog and evidence files only.
- Tooling branch: repository-wide tooling in its own branch and PR, editing schemas, tools, fixtures, shared components, current docs, CI and root config; a catalog migration may atomically move metadata without changing learner bytes.
- Never mix these scopes in one branch, and never let parallel workers edit the same manifest or lock.
- Content and mixed changes run full validation; internal tooling may use a direct PR.
- Every merge requires approval.
