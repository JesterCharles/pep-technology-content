# microservices-and-ci-cd: minimum-release preparation

Recorded 2026-11-08 by the module's implementation owner. This is author evidence, not a critic review.

## Status

- Profile: minimum acceptance profile (tonight's release scope). Each of the 8 topics opts in through its own `owner-essential-qa.json`, bound to the current `artifact.html` and `artifact.gift` hashes.
- Independent education and SME critic approval was not required and was not performed. No critic or reconciliation records exist for these bytes.
- Not final, not green, not upload-safe, not published and not merged. Browser gates and companions are still pending (see below).

## Coverage

Canonical topics come from `authoring/catalog/containers-cicd/microservices-and-ci-cd/module.json` `topicOrder`, and each is counted once.

| Topic | HTML | GIFT (questions) | Budget (min) |
|---|---|---|---|
| monolith-vs-microservices | present | present (6) | 12 |
| adding-fastapi-service-to-compose | present | present (6) | 13 |
| service-to-service-calls | present | present (7) | 15 |
| sql-vs-nosql | present | present (6) | 10 |
| api-gateways-and-service-discovery | present | present (5) | 10 |
| github-actions-pipeline | present | present (6) | 15 |
| secrets-in-ci | present | present (6) | 12 |
| jenkins-registries-cd-and-kubernetes | present | present (6) | 12 |

HTML: 8 of 8. GIFT: 8 of 8 (48 questions, unchanged since first-draft checkpoint `b931bbdb`).

## What changed from the first-draft checkpoint

- Catalog: `html` and `gift` are now declared present. `md`, Reading-topic `pdf` and `video` stay absent, each with its reason. Module-lab reasons now say the lab is deferred. Minutes were re-measured with the frozen estimator, and worst paths were modeled per `authoring/docs/tools/validators.md`. Every budget rose to its honest minimum. `freshness.sourcesRef` now points at each topic's `sources.json`.
- Pages: `pep:source`, `pep:budget-minutes`, `data-pep-required-minutes` and the visible minute label match the catalog. The draft comment, the `pep:draft-status` meta and the visible sources status now state the minimum profile honestly. This resolves the first draft's T08/T15 `sourcesRef` conflict.
- `service-to-service-calls` and `github-actions-pipeline`: prose was trimmed (about 120 and 140 words) so the modeled worst path fits the 15-minute topic ceiling. In `github-actions-pipeline`, the activity 4 Where this fits section was removed; its point remains in the activity 4 teaching. No objective, claim or activity was removed.
- `sources.json`: `reviewedSha256` now binds the new page bytes. The sources were not re-fetched; their 2026-11-04 retrievals stand. The GitHub Actions pins were re-verified with `git ls-remote` on 2026-11-08.

## Owner essential pass

- Correctness: every activity's teaching, task, feedback, worked explanation and recap was read against the topic's sources, along with every GIFT question. No claim needed correction. Items that remain unverified are listed in each `topic.json` `freshness`.
- Honest interaction: every model, simulator and practice editor says on the page what it does not run. No page presents simulated output as execution.
- Answer safety and privacy: a targeted scan of learner, GIFT and QA bytes found no completed editor input. Formative option keys and checker rules are readable in page source, as on every offline formative page. No private inputs or secrets are committed.

## Checks

- Pass on these bytes (non-browser): T01, T02, T03, T04, T05, T07, T14, T15, T16, T17, T19, T20 and T24. The module lock is regenerated, and T06 is run after it.
- T25: needs the minimum-profile support (schema, T01 mapping, T25 owner coverage) that is currently only on the `fm/pep-m-java-foundations-inheritance-and-design-safe` branch. Main's T25 still reports missing critic coverage until that lands. In an uncommitted scratch copy of these exact bytes with that branch's T25, T01 and schema (commit `de5a1695`), T25 and T01 pass. A one-byte change to `sql-vs-nosql/artifact.html` made T25 fail with missing current owner coverage, as expected.
- Not run: browser gates T08, T09, T10, T11, T12, T13 and T18 (Chromium belongs to another lane until clearance). `artifact.md` derivation and Reading PDFs wait for the same clearance. Until then, T18 fails because `md` is absent. Any browser-driven change to page bytes requires new owner records and a lock regeneration.
- Never run: real Compose, Docker, GitHub Actions, Jenkins, Kubernetes, FastAPI or Spring execution. Labs are deferred.
