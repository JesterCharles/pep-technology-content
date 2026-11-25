# Containers & CI/CD course final: coverage, duration and provenance

Bank: `containers-cicd/assessments/containers-cicd-course-final/final-mcq.gift`, sha256 `d9842d49680d013a4501bacee346da29403f8f7fea3592a17bc9277bd201693b` (copied unchanged from the private authoring candidate).

Provenance (recorded by the candidate's author, not re-run here): five education and SME critic rounds, the last of which accepted; a non-author reconciler decided 71 findings (59 fixed, 12 accepted as is, 0 open high); the repository `validateGift` check passed; the candidate's lexical duplicate scan maximum was 0.045. Those critic and reconciler reports are in private staging in a different schema and are not imported. Not imported into any platform and not browser-tested. Timing (30 minutes for 30 items) is an allocation, not a measured learner time.

Overlap with the Spring Boot course final and the Standard/Fast final checkpoint is reported in the lane notes, not rewritten here. The legacy `containers-cicd-module-check` blueprint is untouched.


Private authoring candidate. This report names item ids, topics, objectives and levels only; it holds no question text, options, feedback or keys.

## Shape

- Items: 30 single-answer MCQ, GIFT `[html]`, category `containers-cicd/assessments/containers-cicd-course-final`, titles `ccd-cf30-q01`..`q30`.
- Levels: easy 8 (q01-q08), medium 12 (q09-q20), hard 10 (q21-q30).
- Correct-answer positions: {'A': 7, 'B': 7, 'C': 8, 'D': 8}; longest repeated run 2.
- Key length rank among its four options (1 = longest): {'1': 6, '2': 12, '3': 6, '4': 6}; key strictly longest in 3 of 30.
- Topics assessed: 16 of 16. Objectives decided or co-decided: 39 of 48.

## Duration

- 30 minutes for 30 items: about 1 minute allotted per item (sizing only; no per-question timer).
- Reading load: 2222 words in all (stems, code and options; code tokens counted as words), at most 85 in one item, about 74 per item.
- Basis: at a careful 150-200 words per minute the reading takes 11-15 minutes, leaving 15-19 minutes for decisions. That matches the existing module check's MCQ pace (its blueprint: an 8-minute quiz of 8 MCQ). The Git/Linux/AI 30-minute candidate allots 1.5 minutes per item (20 items); this bank is denser, which is an owner tradeoff if the platform needs slack. Only the education critic assessed timing (defensible).
- Code-bearing items read slower than their word count: 5 items carry a snippet, at most 5 lines.

## Topic map

`*` = co-decided (secondary objective of a cross-topic item).

| Topic | Calendar | Items |
|---|---|---|
| containers-and-compose/containers-and-images | taught, both tracks | q01, q03, q22, q30* |
| containers-and-compose/image-layers-and-build-caching | Standard reading / Fast skim | q09, q21* |
| containers-and-compose/multi-stage-builds | taught, both tracks | q08, q10, q21 |
| containers-and-compose/ports-volumes-and-environment-variables | taught, both tracks | q12, q23, q24* |
| containers-and-compose/compose-spring-boot-and-database | taught, both tracks | q02, q11, q22*, q23*, q30 |
| containers-and-compose/service-name-networking | taught, both tracks | q14, q24* |
| containers-and-compose/depends-on-with-health-checks | taught, both tracks | q13 |
| containers-and-compose/debugging-with-logs-and-exec | Fast skim | q14*, q22* |
| microservices-and-ci-cd/monolith-vs-microservices | taught, both tracks | q15, q26, q27 |
| microservices-and-ci-cd/adding-fastapi-service-to-compose | taught, both tracks | q19, q24 |
| microservices-and-ci-cd/service-to-service-calls | taught, both tracks | q16, q25, q26* |
| microservices-and-ci-cd/sql-vs-nosql | Standard reading / Fast skim | q07 |
| microservices-and-ci-cd/api-gateways-and-service-discovery | Standard reading / Fast skim | q06, q20 |
| microservices-and-ci-cd/github-actions-pipeline | taught, both tracks | q04, q18, q28 |
| microservices-and-ci-cd/secrets-in-ci | taught, both tracks | q05, q17, q29 |
| microservices-and-ci-cd/jenkins-registries-cd-and-kubernetes | optional reading (both tracks) | q17* |

## Item map

| Item | Level | Objectives |
|---|---|---|
| q01 | easy | containers-and-compose/containers-and-images#o2 |
| q02 | easy | containers-and-compose/compose-spring-boot-and-database#o1 |
| q03 | easy | containers-and-compose/containers-and-images#o3 |
| q04 | easy | microservices-and-ci-cd/github-actions-pipeline#o1 |
| q05 | easy | microservices-and-ci-cd/secrets-in-ci#o1 |
| q06 | easy | microservices-and-ci-cd/api-gateways-and-service-discovery#o1, microservices-and-ci-cd/api-gateways-and-service-discovery#o3 |
| q07 | easy | microservices-and-ci-cd/sql-vs-nosql#o1, microservices-and-ci-cd/sql-vs-nosql#o2 |
| q08 | easy | containers-and-compose/multi-stage-builds#o2 |
| q09 | medium | containers-and-compose/image-layers-and-build-caching#o3, containers-and-compose/image-layers-and-build-caching#o1 |
| q10 | medium | containers-and-compose/multi-stage-builds#o1 |
| q11 | medium | containers-and-compose/compose-spring-boot-and-database#o2 |
| q12 | medium | containers-and-compose/ports-volumes-and-environment-variables#o3 |
| q13 | medium | containers-and-compose/depends-on-with-health-checks#o2 |
| q14 | medium | containers-and-compose/service-name-networking#o2, containers-and-compose/debugging-with-logs-and-exec#o1 |
| q15 | medium | microservices-and-ci-cd/monolith-vs-microservices#o1, microservices-and-ci-cd/monolith-vs-microservices#o3 |
| q16 | medium | microservices-and-ci-cd/service-to-service-calls#o1 |
| q17 | medium | microservices-and-ci-cd/secrets-in-ci#o3, microservices-and-ci-cd/jenkins-registries-cd-and-kubernetes#o2 |
| q18 | medium | microservices-and-ci-cd/github-actions-pipeline#o2 |
| q19 | medium | microservices-and-ci-cd/adding-fastapi-service-to-compose#o2 |
| q20 | medium | microservices-and-ci-cd/api-gateways-and-service-discovery#o2 |
| q21 | hard | containers-and-compose/multi-stage-builds#o3, containers-and-compose/image-layers-and-build-caching#o3 |
| q22 | hard | containers-and-compose/containers-and-images#o1, containers-and-compose/compose-spring-boot-and-database#o3, containers-and-compose/debugging-with-logs-and-exec#o2 |
| q23 | hard | containers-and-compose/ports-volumes-and-environment-variables#o2, containers-and-compose/compose-spring-boot-and-database#o3 |
| q24 | hard | microservices-and-ci-cd/adding-fastapi-service-to-compose#o3, containers-and-compose/ports-volumes-and-environment-variables#o1, containers-and-compose/service-name-networking#o3 |
| q25 | hard | microservices-and-ci-cd/service-to-service-calls#o2 |
| q26 | hard | microservices-and-ci-cd/monolith-vs-microservices#o3, microservices-and-ci-cd/service-to-service-calls#o3 |
| q27 | hard | microservices-and-ci-cd/monolith-vs-microservices#o2 |
| q28 | hard | microservices-and-ci-cd/github-actions-pipeline#o3, microservices-and-ci-cd/github-actions-pipeline#o2 |
| q29 | hard | microservices-and-ci-cd/secrets-in-ci#o2 |
| q30 | hard | containers-and-compose/compose-spring-boot-and-database#o3, containers-and-compose/containers-and-images#o1 |

## Objectives not decided by any item

Coverage counts are author-tagged. The education critic judged some tags nominal: service-to-service o3 decides only the 504 case (502/503 are never decided), and depends-on-with-health-checks o3 (reading health states) has no item of its own. Read the count as breadth, not as mastery evidence per objective.

- containers-and-compose/image-layers-and-build-caching#o2
- containers-and-compose/service-name-networking#o1
- containers-and-compose/depends-on-with-health-checks#o1
- containers-and-compose/depends-on-with-health-checks#o3
- containers-and-compose/debugging-with-logs-and-exec#o3
- microservices-and-ci-cd/adding-fastapi-service-to-compose#o1
- microservices-and-ci-cd/sql-vs-nosql#o3
- microservices-and-ci-cd/jenkins-registries-cd-and-kubernetes#o1
- microservices-and-ci-cd/jenkins-registries-cd-and-kubernetes#o3
