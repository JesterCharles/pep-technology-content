# Lab contract

Provenance: restates the coding-lab rules of the course-1 author contract, "Git/Linux/AI Foundations — local learner HTML authoring", as extended by the approved PEP technology-content plan.

This contract governs every `coding-lab/` directory.
Labs run on the learner's own toolchain, never in Docker or another container engine.

## 1. Layout

```
coding-lab/
  lab.json     declarative manifest
  README.md    learner instructions
  starter/     files the learner edits, runnable as shipped
  tests/                 public tests only
  fixtures/    small, deterministic, license-clean data
  expected/    expected learner-visible output
```

- `README.md` covers the goal, prerequisites with a version check, setup, task steps, how to test, expected output, the offline note, cleanup and troubleshooting.
- No other files or directories belong in a lab.

A coding lab or course project is the only learner-artifact form that may require multiple files. The bundle root is the dependency boundary. `README.md` is the learner entrypoint and must contain the exact setup and test commands declared in `lab.json`. Every regular file shipped below `coding-lab/` is a required bundle file; exported bundles include `LAB_BUNDLE.sha256`, which inventories every other shipped file. No symlink, absolute path, `..` traversal, import, command, or file reference may require material outside the bundle. Language/runtime tools are allowed only when declared under `prerequisites`; core setup and tests follow the bundle's declared network policy.

## 2. Scope

- A lab is scoped to a topic, a module or a course, or is honestly omitted.
- Topic lab: one topic's objectives need real-toolchain practice that the page simulator cannot honestly give.
  It lives at `<course>/<module>/<topic>/coding-lab/`.
- Module lab: one exercise set spans several topics in a module.
  It lives at `<course>/<module>/coding-lab/` and is covered by `workflow/catalog/<course>/<module>/module.lock.json`.
- Course lab: a cumulative build across modules.
  It lives at `<course>/coding-lab/` and is covered by `workflow/catalog/<course>/course.lock.json`.
- Omission: when the page simulator already gives truthful, assessed practice and a local toolchain adds setup cost without new learning.
  The topic records `lab: "none"` with a one-line reason confirmed by the educational critic.

## 3. One test command

- Each lab has exactly one language-native test command, declared in `lab.json`.
- After a one-time setup step, the test command runs fully offline.
- Typical commands: `mvn -q -o test` (Java and Spring), `python -m pytest -q` or `python -m unittest` (Python), `node --test` or `npm test` (JavaScript and React).
- Database labs use a learner-local server or an embedded database, created and dropped by the lab.

## 4. No container engine

- No Docker, Podman, Compose or other learner-side container engine, for setup or tests.
- Testcontainers is excluded.
- Topics that teach container tooling use daemon-free labs (tests that validate learner-written files against stated rules) and honest HTML simulators instead.

## 5. Determinism

- Fixed seeds and pinned dependency versions, with lockfiles committed.
- No wall clock, network or locale dependence in tests.
- The same starter and the same learner change give the same result on every run.

## 6. Expected learner output

- The shipped starter fails the named public tests with stable messages, unless the lab is declared exploratory, in which case it passes and prints guidance.
- On completion, the test summary matches the file in `expected/`.

## 7. Cleanup

- `lab.json` declares every path and database the lab creates.
- The documented cleanup step removes them, and the gate confirms nothing else changed.

## 8. No solutions in the repository

- The repository holds only public tests.
- Reference solutions and hidden tests are written only in uncommitted private staging outside the repository.
  `platform-only/` is ignored by Git as a backstop, never as a storage location.
- Validation runs the staged solution against the public tests and records only "solved at <commit> by run <id>", never a hash of the solution or a key.
- The solved-run JSON is evidence, not part of the learner bundle. `workflow/schemas/solved-run.schema.json` owns its shape, and `workflow/docs/tools/evidence.md` defines its public-file binding.
- The staged material is handed to the platform owner, and the staging copy is retired after confirmed upload.

## 9. Platform handoff

- The tooling's `export-lab` subcommand produces a neutral bundle of the lab directory for the platform owner.
- Platform-specific adapters are added only once the platform contract is known.

## 10. Gates

- `lab.json` is schema-valid and its prerequisites are verified.
- The starter expectation holds.
- The test command passes offline after setup against the private solution.
  This solved-run gate runs locally against uncommitted private staging only, never in CI, because solutions never enter the repository.
  It is recorded in the lab's JSON evidence as text of the form "solved at <commit> by run <id>", with a lowercase sha256 binding for every tracked public lab file.
  `workflow/tools/pep check` rejects missing, extra, duplicate, malformed, private-material and stale file bindings. A lab edit therefore invalidates the solved run even after its generated lock is refreshed; the private run must be repeated and re-recorded.
- Cleanup leaves nothing behind.
- Labs run on Ubuntu in CI; other operating systems are recorded locally until CI covers them.
