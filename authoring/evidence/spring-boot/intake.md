# Course intake: Spring Boot

Course intake for `spring-boot` (calendar technology `spring`, Standard days S1-S13, Fast Track days FT1-FT8).
This intake ships the course, module and topic manifests, the S13/FT8 module-check blueprint and evidence only; it authors no learner artifact, project scaffold, lab code or test.
Every topic artifact is recorded absent: applicable companions with the reason "authored in the <module> module PR", inapplicable ones with their applicability reason.

## Inputs

- Curriculum snapshot: `curriculum/snapshot/pep-curriculum.json` (sha256 `9520f1fde24630604a82ecc1188726339ee02233d0274c622f4dda9c8c0204f8`) and `curriculum/snapshot/pep-calendar.json` (sha256 `634da8de5c6034e269b56347b2009fa24eb74eb9bd94f6bd8d5f65f54459ce00`), curriculum version `2026-10-01` per `curriculum/curriculum.lock.json`.
- Confirmed coverage matrix v3 (read-only, frozen): `matrix-v3.json` (sha256 `4e936d703e64dba4f7973458b57aed0e921fad0d5afecca319cf7cec7806c4cd`) and `discrepancies-v3.json` (sha256 `ba6580b06af9d94d6f4ed53cf82986cdbd3db357fee09d2b268511505b2b9c3a`). Its 90 `spring-boot` topic-string rows (46 Standard, 44 Fast) are the authoritative topic inventory and expected-artifact scope.
- Production inventory amendment 1 (`inventory-amendment-1.md`, sha256 `5f42ead55268ab047406ef4457b1042d994f44fb65b7a9ee7234a5cc0d058713`, captain decision `pep-fast-project-block`, option A): six Fast project increments for `spring-boot` on FT1, FT2, FT3, FT4, FT6 and FT8.
- Repository contracts on `main`: `AGENTS.md`, `authoring/docs/workflow.md`, `authoring/docs/html-artifact-contract.md`, `authoring/docs/lab-contract.md`, `authoring/docs/tools/*.md`, `authoring/schemas/`, and the new-course budget rule in `authoring/docs/tools/validators.md`.
- Plan: approved PEP technology-content plan sections 2.3, 3, 4, 5, 6, 7.1 and 11.
- Sibling intakes on `main` read as patterns (not copied): `java-foundations` (day-level project briefs as `lab-brief` topics), `python` (Fast route roles, cumulative Fast project with claimed versus practised fragments) and `containers-cicd`.
- Terminal foundation: `components/terminal` version 1 (from the repaired course-1 Evolv package `git-linux-ai-foundations-20261007-evolv-terminal-repair`): form-free direct Run-button and Enter-key dispatch, captain-confirmed working in Evolv (platform success, not a captured trace). Reused as is, not re-derived.

## Course slice

| Day | Track | Calendar title | Day type | requiredLab | Snapshot pointer | Calendar rows |
|---|---|---|---|---|---|---|
| S1 | Standard | Spring Boot basics | Concept | false | `/tracks/1/weeks/0/days/0` | 0. Spring vs Spring Boot: what Boot adds; 1. Generating a Spring Boot project and its structure; 2. Dependency injection replacing manual wiring; 3. Beans and bean scopes; 4. Reading: how auto-configuration works |
| S2 | Standard | REST controllers | Concept | false | `/tracks/1/weeks/0/days/1` | 0. REST controllers; 1. Path, query and body parameters; 2. Response codes with ResponseEntity; 3. Reading an OpenAPI spec and exploring it in Swagger UI |
| S3 | Standard | Porting to Spring Boot | Lab | false | `/tracks/1/weeks/0/days/2` | 0. Porting a Javalin route, service and repository to Spring Boot; 1. Constructor injection across layers; 2. Reading: REST design recap |
| S4 | Standard | Configuration, profiles and migrations | Lab | false | `/tracks/1/weeks/0/days/3` | 0. Configuration files and profiles; 1. Secrets from the environment; 2. Schema migrations with Flyway |
| S5 | Standard | Spring Data JPA | Lab | false | `/tracks/1/weeks/0/days/4` | 0. Spring Data JPA with Hibernate; 1. Entities and IDs; 2. Repositories, derived queries and @Query; 3. Seeing the generated SQL |
| S6 | Standard | API layers and DTOs | Project | false | `/tracks/1/weeks/1/days/0` | 0. Controller, service and repository layers; 1. DTOs and mapping; 2. Pagination and sorting |
| S7 | Standard | Entity relationships | Lab | false | `/tracks/1/weeks/1/days/1` | 0. One-to-many and many-to-one relationships; 1. Lazy and eager loading; 2. Relationship pitfalls |
| S8 | Standard | Transactions and N+1 | Lab | false | `/tracks/1/weeks/1/days/2` | 0. How transactions work in Spring; 1. The N+1 query problem: spotting it in SQL logs; 2. Fixing N+1 with JOIN FETCH |
| S9 | Standard | Error handling | Lab | true | `/tracks/1/weeks/1/days/3` | 0. Bean Validation on requests; 1. Global error handling; 2. Standard error responses with ProblemDetail |
| S10 | Standard | API testing | Concept | false | `/tracks/1/weeks/1/days/4` | 0. Mockito in Spring: @MockitoBean; 1. Web-layer tests with MockMvc; 2. Debugging a failing request |
| S11 | Standard | Integration and service calls | Lab | false | `/tracks/1/weeks/2/days/0` | 0. An integration test; 1. Calling another service with RestClient: base URL and timeouts; 2. Reading: logging in Spring; 3. Health checks |
| S12 | Standard | API security: sessions and JWTs | Lab | true | `/tracks/1/weeks/2/days/1` | 0. Reading: session cookies vs JWTs, trade-offs; 1. Password hashing; 2. Issuing and checking a JWT; 3. Role-protected endpoints; 4. A dev profile that keeps endpoints open during front-end work; 5. Reading: common API security risks (OWASP) |
| S13 | Standard | Spring review and check | Review | false | `/tracks/1/weeks/2/days/2` | 0. Spring review: layers, data access, errors, testing, security; 1. Spring module check |
| FT1 | Fast | Spring Boot basics + REST controllers | Fast (from S1, S2) | false | `/tracks/2/weeks/0/days/0` | 0. Spring vs Spring Boot: what Boot adds; 1. Generating a Spring Boot project and its structure; 2. Dependency injection replacing manual wiring; 3. REST controllers; 4. Beans and bean scopes (skim); 5. How auto-configuration works (skim) |
| FT2 | Fast | Porting to Spring Boot | Fast (from S3, skims S4) | false | `/tracks/2/weeks/0/days/1` | 0. Porting a Javalin route, service and repository to Spring Boot; 1. Path, query and body parameters; 2. Response codes with ResponseEntity; 3. Reading an OpenAPI spec and exploring it in Swagger UI; 4. Configuration files and profiles (skim); 5. Secrets from the environment (skim); 6. REST design recap (skim) |
| FT3 | Fast | Spring Data JPA | Fast (from S5, skims S7) | false | `/tracks/2/weeks/0/days/2` | 0. Spring Data JPA with Hibernate; 1. Entities and IDs; 2. Repositories, derived queries and @Query; 3. Seeing the generated SQL; 4. Relationship pitfalls (skim) |
| FT4 | Fast | API layers and DTOs | Fast (from S6) | false | `/tracks/2/weeks/0/days/3` | 0. Controller, service and repository layers; 1. DTOs and mapping; 2. Pagination and sorting; 3. Schema migrations with Flyway; 4. Web-layer tests with MockMvc |
| FT5 | Fast | Error handling | Lab (presented as Project implementation on Fast) | true | `/tracks/2/weeks/0/days/4` | 0. Bean Validation on requests; 1. Global error handling; 2. Standard error responses with ProblemDetail; 3. Logging in Spring (skim) |
| FT6 | Fast | Transactions and N+1 | Fast (from S8, skims S10) | false | `/tracks/2/weeks/1/days/0` | 0. One-to-many and many-to-one relationships; 1. How transactions work in Spring; 2. The N+1 query problem: spotting it in SQL logs; 3. Fixing N+1 with JOIN FETCH; 4. Lazy and eager loading (skim); 5. Mockito in Spring: @MockitoBean (skim); 6. Debugging a failing request (skim) |
| FT7 | Fast | API security: sessions and JWTs | Lab (presented as Project implementation on Fast) | true | `/tracks/2/weeks/1/days/1` | 0. Password hashing; 1. Issuing and checking a JWT; 2. Role-protected endpoints; 3. A dev profile that keeps endpoints open during front-end work; 4. Session cookies vs JWTs: trade-offs (skim); 5. Common API security risks (OWASP) (skim) |
| FT8 | Fast | Spring review and check | Fast (from S13, skims S11) | false | `/tracks/2/weeks/1/days/2` | 0. An integration test (skim); 1. Calling another service with RestClient: base URL and timeouts (skim); 2. Spring review: layers, data access, errors, testing, security; 3. Spring module check |

S13 and FT8 both carry the calendar assessment `moduleCheck` (formats `MCQ` and `coding`, pass mark 70); both map to the one course-level blueprint below. The calendar sets `requiredLab: true` on S9, S12, FT5 and FT7.

## Module map (second-mate grouping decision)

The snapshot gives `spring-boot` no module grouping or count (discrepancy `source-gap-spring-boot-modules`, category A, sequenced to this intake). This intake records the following grouping as a **second-mate grouping decision, not syllabus**: modules follow calendar day sequence, each the batch unit for one module PR (4-9 topic manifests). It changes no topic, day or order in the calendar, and the decision is visible for approval at merge.

| Module | Title | Standard days | Fast rows | Topic manifests |
|---|---|---|---|---|
| `spring-boot-basics` | Spring Boot Basics and REST Controllers | S1-S2 | FT1 rows 0-5; FT2 rows 1-3 | 9 |
| `porting-and-configuration` | Porting, Configuration and Migrations | S3-S4 | FT2 rows 0, 4-6; FT4 row 3 | 6 |
| `spring-data-jpa` | Spring Data JPA and API Layers | S5-S6 | FT3 rows 0-3; FT4 rows 0-2 | 8 |
| `relationships-and-transactions` | Entity Relationships and Transactions | S7-S8 | FT3 row 4; FT6 rows 0-4 | 6 |
| `validation-errors-and-testing` | Validation, Error Handling and API Testing | S9-S10 | FT4 row 4; FT5 rows 0-2; FT6 rows 5-6 | 7 |
| `integration-and-observability` | Integration Tests, Service Calls and Observability | S11 | FT5 row 3; FT8 rows 0-1 | 4 |
| `api-security` | API Security and Spring Review | S12-S13 | FT7 rows 0-5; FT8 row 2 | 8 |

Total: 48 manifests — 45 canonical topics (39 core, 5 Reading, 1 review) and 3 day-level project briefs (kind `lab-brief`, not syllabus topics). The 44 instructional rows match plan section 2.3 (spring: 36 core and 5 Reading on Standard, plus 3 S6 Project-day rows that the Fast track teaches as topic pages on FT4).

Why this grouping: S1-S2 are the two Concept days that introduce Boot, DI and controllers (FT1 plus most of FT2); S3-S4 are the Lab days that port the Java Foundations Javalin app and configure it; S5-S6 build persistence and then layer it in the S6 project; S7-S8 are the relationship and transaction Lab days; S9-S10 pair error handling (required lab) with the testing that checks it; S11 stands alone because its integration, service-call, logging and health topics do not continue into security; S12-S13 hold security (required lab) and the review. Alternatives rejected: one module per day (S6, S9, S10 and S13 would hold three or fewer topics and the S9/S10 testing link would split), S10-S11 together (S9 would stand alone with three topics and the MockMvc topic would sit away from the errors it tests), and S11-S13 together (11 manifests, above the 4-9 batch size).

## Topic list with relations

One canonical topic per instructional calendar row (core and Reading). Topic ids are the matrix v3 proposed slugs. Relations: `exact` maps a row to one topic; `shared` maps one row to a canonical topic and also to its day's project brief. The `(skim)` suffix on Fast rows is track emphasis metadata, not a separate page, so those rows map `exact` to the same topic. No row is `split`.

| # | Topic | Module | Kind | Mappings (day row: relation) |
|---|---|---|---|---|
| 1 | `spring-vs-spring-boot-what-boot-adds` | `spring-boot-basics` | core | S1 row 0 `/tracks/1/weeks/0/days/0/topics/0`: exact — Spring vs Spring Boot: what Boot adds<br>FT1 row 0 `/tracks/2/weeks/0/days/0/topics/0`: exact — Spring vs Spring Boot: what Boot adds |
| 2 | `generating-a-spring-boot-project-and-its-structure` | `spring-boot-basics` | core | S1 row 1 `/tracks/1/weeks/0/days/0/topics/1`: exact — Generating a Spring Boot project and its structure<br>FT1 row 1 `/tracks/2/weeks/0/days/0/topics/1`: exact — Generating a Spring Boot project and its structure |
| 3 | `dependency-injection-replacing-manual-wiring` | `spring-boot-basics` | core | S1 row 2 `/tracks/1/weeks/0/days/0/topics/2`: exact — Dependency injection replacing manual wiring<br>FT1 row 2 `/tracks/2/weeks/0/days/0/topics/2`: exact — Dependency injection replacing manual wiring |
| 4 | `beans-and-bean-scopes` | `spring-boot-basics` | core | S1 row 3 `/tracks/1/weeks/0/days/0/topics/3`: exact — Beans and bean scopes<br>FT1 row 4 `/tracks/2/weeks/0/days/0/topics/4`: exact — Beans and bean scopes (skim) |
| 5 | `how-auto-configuration-works` | `spring-boot-basics` | reading | S1 row 4 `/tracks/1/weeks/0/days/0/topics/4`: exact — Reading: how auto-configuration works<br>FT1 row 5 `/tracks/2/weeks/0/days/0/topics/5`: exact — How auto-configuration works (skim) |
| 6 | `rest-controllers` | `spring-boot-basics` | core | S2 row 0 `/tracks/1/weeks/0/days/1/topics/0`: exact — REST controllers<br>FT1 row 3 `/tracks/2/weeks/0/days/0/topics/3`: exact — REST controllers |
| 7 | `path-query-and-body-parameters` | `spring-boot-basics` | core | S2 row 1 `/tracks/1/weeks/0/days/1/topics/1`: exact — Path, query and body parameters<br>FT2 row 1 `/tracks/2/weeks/0/days/1/topics/1`: exact — Path, query and body parameters |
| 8 | `response-codes-with-responseentity` | `spring-boot-basics` | core | S2 row 2 `/tracks/1/weeks/0/days/1/topics/2`: exact — Response codes with ResponseEntity<br>FT2 row 2 `/tracks/2/weeks/0/days/1/topics/2`: exact — Response codes with ResponseEntity |
| 9 | `reading-an-openapi-spec-and-exploring-it-in-swagger-ui` | `spring-boot-basics` | core | S2 row 3 `/tracks/1/weeks/0/days/1/topics/3`: exact — Reading an OpenAPI spec and exploring it in Swagger UI<br>FT2 row 3 `/tracks/2/weeks/0/days/1/topics/3`: exact — Reading an OpenAPI spec and exploring it in Swagger UI |
| 10 | `porting-a-javalin-route-service-and-repository-to-spring-boot` | `porting-and-configuration` | core | S3 row 0 `/tracks/1/weeks/0/days/2/topics/0`: exact — Porting a Javalin route, service and repository to Spring Boot<br>FT2 row 0 `/tracks/2/weeks/0/days/1/topics/0`: exact — Porting a Javalin route, service and repository to Spring Boot |
| 11 | `constructor-injection-across-layers` | `porting-and-configuration` | core | S3 row 1 `/tracks/1/weeks/0/days/2/topics/1`: exact — Constructor injection across layers |
| 12 | `rest-design-recap` | `porting-and-configuration` | reading | S3 row 2 `/tracks/1/weeks/0/days/2/topics/2`: exact — Reading: REST design recap<br>FT2 row 6 `/tracks/2/weeks/0/days/1/topics/6`: exact — REST design recap (skim) |
| 13 | `configuration-files-and-profiles` | `porting-and-configuration` | core | S4 row 0 `/tracks/1/weeks/0/days/3/topics/0`: exact — Configuration files and profiles<br>FT2 row 4 `/tracks/2/weeks/0/days/1/topics/4`: exact — Configuration files and profiles (skim) |
| 14 | `secrets-from-the-environment` | `porting-and-configuration` | core | S4 row 1 `/tracks/1/weeks/0/days/3/topics/1`: exact — Secrets from the environment<br>FT2 row 5 `/tracks/2/weeks/0/days/1/topics/5`: exact — Secrets from the environment (skim) |
| 15 | `schema-migrations-with-flyway` | `porting-and-configuration` | core | S4 row 2 `/tracks/1/weeks/0/days/3/topics/2`: exact — Schema migrations with Flyway<br>FT4 row 3 `/tracks/2/weeks/0/days/3/topics/3`: exact — Schema migrations with Flyway |
| 16 | `spring-data-jpa-with-hibernate` | `spring-data-jpa` | core | S5 row 0 `/tracks/1/weeks/0/days/4/topics/0`: exact — Spring Data JPA with Hibernate<br>FT3 row 0 `/tracks/2/weeks/0/days/2/topics/0`: exact — Spring Data JPA with Hibernate |
| 17 | `entities-and-ids` | `spring-data-jpa` | core | S5 row 1 `/tracks/1/weeks/0/days/4/topics/1`: exact — Entities and IDs<br>FT3 row 1 `/tracks/2/weeks/0/days/2/topics/1`: exact — Entities and IDs |
| 18 | `repositories-derived-queries-and-at-query` | `spring-data-jpa` | core | S5 row 2 `/tracks/1/weeks/0/days/4/topics/2`: exact — Repositories, derived queries and @Query<br>FT3 row 2 `/tracks/2/weeks/0/days/2/topics/2`: exact — Repositories, derived queries and @Query |
| 19 | `seeing-the-generated-sql` | `spring-data-jpa` | core | S5 row 3 `/tracks/1/weeks/0/days/4/topics/3`: exact — Seeing the generated SQL<br>FT3 row 3 `/tracks/2/weeks/0/days/2/topics/3`: exact — Seeing the generated SQL |
| 20 | `controller-service-and-repository-layers` | `spring-data-jpa` | core | S6 row 0 `/tracks/1/weeks/1/days/0/topics/0`: shared — Controller, service and repository layers<br>FT4 row 0 `/tracks/2/weeks/0/days/3/topics/0`: exact — Controller, service and repository layers |
| 21 | `dtos-and-mapping` | `spring-data-jpa` | core | S6 row 1 `/tracks/1/weeks/1/days/0/topics/1`: shared — DTOs and mapping<br>FT4 row 1 `/tracks/2/weeks/0/days/3/topics/1`: exact — DTOs and mapping |
| 22 | `pagination-and-sorting` | `spring-data-jpa` | core | S6 row 2 `/tracks/1/weeks/1/days/0/topics/2`: shared — Pagination and sorting<br>FT4 row 2 `/tracks/2/weeks/0/days/3/topics/2`: exact — Pagination and sorting |
| 23 | `api-layers-and-dtos-project` | `spring-data-jpa` | lab-brief | S6 row 0 `/tracks/1/weeks/1/days/0/topics/0`: shared — Controller, service and repository layers<br>S6 row 1 `/tracks/1/weeks/1/days/0/topics/1`: shared — DTOs and mapping<br>S6 row 2 `/tracks/1/weeks/1/days/0/topics/2`: shared — Pagination and sorting |
| 24 | `one-to-many-and-many-to-one-relationships` | `relationships-and-transactions` | core | S7 row 0 `/tracks/1/weeks/1/days/1/topics/0`: exact — One-to-many and many-to-one relationships<br>FT6 row 0 `/tracks/2/weeks/1/days/0/topics/0`: exact — One-to-many and many-to-one relationships |
| 25 | `lazy-and-eager-loading` | `relationships-and-transactions` | core | S7 row 1 `/tracks/1/weeks/1/days/1/topics/1`: exact — Lazy and eager loading<br>FT6 row 4 `/tracks/2/weeks/1/days/0/topics/4`: exact — Lazy and eager loading (skim) |
| 26 | `relationship-pitfalls` | `relationships-and-transactions` | core | S7 row 2 `/tracks/1/weeks/1/days/1/topics/2`: exact — Relationship pitfalls<br>FT3 row 4 `/tracks/2/weeks/0/days/2/topics/4`: exact — Relationship pitfalls (skim) |
| 27 | `how-transactions-work-in-spring` | `relationships-and-transactions` | core | S8 row 0 `/tracks/1/weeks/1/days/2/topics/0`: exact — How transactions work in Spring<br>FT6 row 1 `/tracks/2/weeks/1/days/0/topics/1`: exact — How transactions work in Spring |
| 28 | `the-n-1-query-problem-spotting-it-in-sql-logs` | `relationships-and-transactions` | core | S8 row 1 `/tracks/1/weeks/1/days/2/topics/1`: exact — The N+1 query problem: spotting it in SQL logs<br>FT6 row 2 `/tracks/2/weeks/1/days/0/topics/2`: exact — The N+1 query problem: spotting it in SQL logs |
| 29 | `fixing-n-1-with-join-fetch` | `relationships-and-transactions` | core | S8 row 2 `/tracks/1/weeks/1/days/2/topics/2`: exact — Fixing N+1 with JOIN FETCH<br>FT6 row 3 `/tracks/2/weeks/1/days/0/topics/3`: exact — Fixing N+1 with JOIN FETCH |
| 30 | `bean-validation-on-requests` | `validation-errors-and-testing` | core | S9 row 0 `/tracks/1/weeks/1/days/3/topics/0`: exact — Bean Validation on requests<br>FT5 row 0 `/tracks/2/weeks/0/days/4/topics/0`: shared — Bean Validation on requests |
| 31 | `global-error-handling` | `validation-errors-and-testing` | core | S9 row 1 `/tracks/1/weeks/1/days/3/topics/1`: exact — Global error handling<br>FT5 row 1 `/tracks/2/weeks/0/days/4/topics/1`: shared — Global error handling |
| 32 | `standard-error-responses-with-problemdetail` | `validation-errors-and-testing` | core | S9 row 2 `/tracks/1/weeks/1/days/3/topics/2`: exact — Standard error responses with ProblemDetail<br>FT5 row 2 `/tracks/2/weeks/0/days/4/topics/2`: shared — Standard error responses with ProblemDetail |
| 33 | `error-handling-project` | `validation-errors-and-testing` | lab-brief | FT5 row 0 `/tracks/2/weeks/0/days/4/topics/0`: shared — Bean Validation on requests<br>FT5 row 1 `/tracks/2/weeks/0/days/4/topics/1`: shared — Global error handling<br>FT5 row 2 `/tracks/2/weeks/0/days/4/topics/2`: shared — Standard error responses with ProblemDetail<br>FT5 row 3 `/tracks/2/weeks/0/days/4/topics/3`: shared — Logging in Spring (skim) |
| 34 | `mockito-in-spring-at-mockitobean` | `validation-errors-and-testing` | core | S10 row 0 `/tracks/1/weeks/1/days/4/topics/0`: exact — Mockito in Spring: @MockitoBean<br>FT6 row 5 `/tracks/2/weeks/1/days/0/topics/5`: exact — Mockito in Spring: @MockitoBean (skim) |
| 35 | `web-layer-tests-with-mockmvc` | `validation-errors-and-testing` | core | S10 row 1 `/tracks/1/weeks/1/days/4/topics/1`: exact — Web-layer tests with MockMvc<br>FT4 row 4 `/tracks/2/weeks/0/days/3/topics/4`: exact — Web-layer tests with MockMvc |
| 36 | `debugging-a-failing-request` | `validation-errors-and-testing` | core | S10 row 2 `/tracks/1/weeks/1/days/4/topics/2`: exact — Debugging a failing request<br>FT6 row 6 `/tracks/2/weeks/1/days/0/topics/6`: exact — Debugging a failing request (skim) |
| 37 | `an-integration-test` | `integration-and-observability` | core | S11 row 0 `/tracks/1/weeks/2/days/0/topics/0`: exact — An integration test<br>FT8 row 0 `/tracks/2/weeks/1/days/2/topics/0`: exact — An integration test (skim) |
| 38 | `calling-another-service-with-restclient-base-url-and-timeouts` | `integration-and-observability` | core | S11 row 1 `/tracks/1/weeks/2/days/0/topics/1`: exact — Calling another service with RestClient: base URL and timeouts<br>FT8 row 1 `/tracks/2/weeks/1/days/2/topics/1`: exact — Calling another service with RestClient: base URL and timeouts (skim) |
| 39 | `logging-in-spring` | `integration-and-observability` | reading | S11 row 2 `/tracks/1/weeks/2/days/0/topics/2`: exact — Reading: logging in Spring<br>FT5 row 3 `/tracks/2/weeks/0/days/4/topics/3`: shared — Logging in Spring (skim) |
| 40 | `health-checks` | `integration-and-observability` | core | S11 row 3 `/tracks/1/weeks/2/days/0/topics/3`: exact — Health checks |
| 41 | `session-cookies-vs-jwts-trade-offs` | `api-security` | reading | S12 row 0 `/tracks/1/weeks/2/days/1/topics/0`: exact — Reading: session cookies vs JWTs, trade-offs<br>FT7 row 4 `/tracks/2/weeks/1/days/1/topics/4`: shared — Session cookies vs JWTs: trade-offs (skim) |
| 42 | `password-hashing` | `api-security` | core | S12 row 1 `/tracks/1/weeks/2/days/1/topics/1`: exact — Password hashing<br>FT7 row 0 `/tracks/2/weeks/1/days/1/topics/0`: shared — Password hashing |
| 43 | `issuing-and-checking-a-jwt` | `api-security` | core | S12 row 2 `/tracks/1/weeks/2/days/1/topics/2`: exact — Issuing and checking a JWT<br>FT7 row 1 `/tracks/2/weeks/1/days/1/topics/1`: shared — Issuing and checking a JWT |
| 44 | `role-protected-endpoints` | `api-security` | core | S12 row 3 `/tracks/1/weeks/2/days/1/topics/3`: exact — Role-protected endpoints<br>FT7 row 2 `/tracks/2/weeks/1/days/1/topics/2`: shared — Role-protected endpoints |
| 45 | `a-dev-profile-that-keeps-endpoints-open-during-front-end-work` | `api-security` | core | S12 row 4 `/tracks/1/weeks/2/days/1/topics/4`: exact — A dev profile that keeps endpoints open during front-end work<br>FT7 row 3 `/tracks/2/weeks/1/days/1/topics/3`: shared — A dev profile that keeps endpoints open during front-end work |
| 46 | `common-api-security-risks-owasp` | `api-security` | reading | S12 row 5 `/tracks/1/weeks/2/days/1/topics/5`: exact — Reading: common API security risks (OWASP)<br>FT7 row 5 `/tracks/2/weeks/1/days/1/topics/5`: shared — Common API security risks (OWASP) (skim) |
| 47 | `api-security-project` | `api-security` | lab-brief | FT7 row 0 `/tracks/2/weeks/1/days/1/topics/0`: shared — Password hashing<br>FT7 row 1 `/tracks/2/weeks/1/days/1/topics/1`: shared — Issuing and checking a JWT<br>FT7 row 2 `/tracks/2/weeks/1/days/1/topics/2`: shared — Role-protected endpoints<br>FT7 row 3 `/tracks/2/weeks/1/days/1/topics/3`: shared — A dev profile that keeps endpoints open during front-end work<br>FT7 row 4 `/tracks/2/weeks/1/days/1/topics/4`: shared — Session cookies vs JWTs: trade-offs (skim)<br>FT7 row 5 `/tracks/2/weeks/1/days/1/topics/5`: shared — Common API security risks (OWASP) (skim) |
| 48 | `spring-review-layers-data-access-errors-testing-security` | `api-security` | review | S13 row 0 `/tracks/1/weeks/2/days/2/topics/0`: exact — Spring review: layers, data access, errors, testing, security<br>FT8 row 2 `/tracks/2/weeks/1/days/2/topics/2`: exact — Spring review: layers, data access, errors, testing, security |

Rows that are not learner topics: S13 row 1 and FT8 row 3 "Spring module check" map to the course-level blueprint `spring-boot/assessments/spring-boot-module-check` (never a learner topic).

Coverage: all 90 matrix v3 topic-string rows map — 88 to canonical topics (the S6, FT5 and FT7 rows also `shared` to their project brief) and 2 to the blueprint. No topic was added, merged or renamed beyond the calendar.

Relation notes:

- Standard-only topics: `constructor-injection-across-layers` (S3) and `health-checks` (S11) have no Fast row. Fast learners meet constructor injection inside `dependency-injection-replacing-manual-wiring` and the FT1 increment; health checks stay Standard-only and are excluded from the shared blueprint.
- S6 rows (`controller-service-and-repository-layers`, `dtos-and-mapping`, `pagination-and-sorting`): the matrix expects only a project row on S6 but full topic pages on FT4, so each row is one canonical topic page `shared` with the S6 brief. On Standard the brief's embedded teach-then-check steps teach them before use, and the pages are reference; on Fast they are FT4 pages.
- FT5 and FT7 rows: the matrix expects both topic pages and a project row, so each row maps `shared` to its canonical topic and to the FT5 or FT7 brief.
- Fast placement out of Standard order (track-overlay input, not changed here): FT3 row 4 `relationship-pitfalls` (skim) precedes FT6's relationship mapping; FT4 rows 3-4 place Flyway (S4) and MockMvc (S10) on FT4; FT5 row 3 places logging (S11) on FT5; FT6 rows 5-6 place `@MockitoBean` and debugging (S10) on FT6. Teach-before-apply on Fast is handled inside the increments and briefs below.

Prerequisites: in-course prerequisites use full `spring-boot/<module>/<topic>` ids. Cross-course prerequisites name merged topic ids on `main` (`java-foundations/...`, `sql-jdbc-foundations/...`); `course.json` names the course ids `git-linux-ai-foundations`, `java-foundations`, `sql-jdbc-foundations` and `collections-streams`.

### Objectives

Two or three observable objectives per topic and brief, with exact ids (also in each `topic.json`):

- `spring-boot-basics/spring-vs-spring-boot-what-boot-adds`
  - o1: Distinguish the Spring Framework (the IoC container and Spring MVC) from Spring Boot (starters, auto-configuration and an embedded server) for a described application setup task
  - o2: Name what Boot adds for a web application that plain Spring leaves to the developer: curated dependency management through the spring-boot-dependencies BOM or the starter parent, starters as convenient sets of managed dependencies, auto-configured beans and an embedded server started from a main method
  - o3: Explain why a Spring Boot application runs with java -jar or mvn spring-boot:run without deploying to a separately installed server
- `spring-boot-basics/generating-a-spring-boot-project-and-its-structure`
  - o1: Generate a Maven Spring Boot project with Spring Initializr, choosing the Java version, group, artifact and the web starter
  - o2: Locate the main application class, application.properties, src/main and src/test, and the parent and starter dependencies in pom.xml of a generated project
  - o3: Build and run the generated project's tests with Maven and start the application, then read the startup log to find the port it listens on
- `spring-boot-basics/dependency-injection-replacing-manual-wiring`
  - o1: Replace the manual new-based wiring of a controller, service and repository with Spring-managed components that receive their dependencies through constructors
  - o2: Predict the startup outcome when a required bean is missing or when two beans match one injection point, and resolve the ambiguity with @Primary or @Qualifier
  - o3: Explain why constructor injection keeps a class testable with plain new in a unit test
- `spring-boot-basics/beans-and-bean-scopes`
  - o1: Register a bean with a stereotype annotation found by component scanning and with a @Bean method in a @Configuration class, and choose between them
  - o2: Predict whether two injections receive the same instance for the singleton and prototype scopes
  - o3: Explain why a stateless singleton service must not keep per-request data in instance fields
- `spring-boot-basics/how-auto-configuration-works`
  - o1: Explain how @SpringBootApplication combines configuration, component scanning and auto-configuration
  - o2: Predict whether an auto-configured bean is created from its conditions, such as a class on the classpath, a property value or a missing user-defined bean
  - o3: Use the --debug condition evaluation report to find why an auto-configuration did or did not apply
- `spring-boot-basics/rest-controllers`
  - o1: Write a @RestController with @GetMapping and @PostMapping methods that return Java records serialized as JSON
  - o2: Map a Javalin route and handler from Java Foundations to the equivalent Spring MVC controller method and request mapping
  - o3: Send requests to a running controller with curl and match each response to the handler method that produced it
- `spring-boot-basics/path-query-and-body-parameters`
  - o1: Bind a path variable, a required and an optional query parameter and a JSON request body to handler method parameters with @PathVariable, @RequestParam and @RequestBody
  - o2: Predict the response status when a required query parameter is missing or a path variable cannot be converted to the declared type
  - o3: Choose whether a value belongs in the path, the query string or the body for a described request
- `spring-boot-basics/response-codes-with-responseentity`
  - o1: Return 200, 201 with a Location header, 204 and 404 from handler methods with ResponseEntity
  - o2: Choose the status code for a described outcome (created, found, not found, no content, invalid input) by its HTTP meaning
  - o3: Predict the status, headers and body a client receives from a given ResponseEntity expression
- `spring-boot-basics/reading-an-openapi-spec-and-exploring-it-in-swagger-ui`
  - o1: Read an OpenAPI document to find an operation's path, parameters, request body schema and response codes
  - o2: Add the springdoc-openapi library to a Boot project and open the generated OpenAPI document and Swagger UI locally
  - o3: Send a request from Swagger UI and compare its documented and actual responses
- `porting-and-configuration/porting-a-javalin-route-service-and-repository-to-spring-boot`
  - o1: Port the Java Foundations Javalin route, service and in-memory repository to a Spring Boot controller, @Service and @Repository with the same JSON responses
  - o2: Replace Javalin exception mapping with a Spring handler that returns the same 400 and 404 responses
  - o3: Verify the port by running the same requests against both versions and comparing status codes and bodies
- `porting-and-configuration/constructor-injection-across-layers`
  - o1: Wire a controller to a service and the service to a repository interface through final constructor fields with no @Autowired field injection
  - o2: Unit-test the service with a hand-written fake repository passed to its constructor, without starting Spring
  - o3: Explain how depending on the repository interface lets the in-memory implementation be replaced by a JPA repository later without changing the service
- `porting-and-configuration/rest-design-recap`
  - o1: Name resources with plural nouns and use HTTP methods for actions instead of verbs in paths
  - o2: Classify HTTP methods as safe and idempotent and choose the method for a described operation
  - o3: Choose consistent status codes and JSON error bodies across the endpoints of one API
- `porting-and-configuration/configuration-files-and-profiles`
  - o1: Read settings from application.properties or application.yaml into a @ConfigurationProperties record and with @Value
  - o2: Activate a profile with spring.profiles.active and predict which profile-specific value wins for a given set of files
  - o3: Predict the effective value when the same property is set in a properties file, an environment variable and a command-line argument
- `porting-and-configuration/secrets-from-the-environment`
  - o1: Supply a secret such as a database password or signing key through an environment variable mapped by relaxed binding instead of committing it in application.properties
  - o2: Fail fast at startup when a required secret is missing, using a required configuration property with no default
  - o3: Keep secrets out of logs, error messages and Git history, and explain why a committed secret must be rotated, not only deleted
- `porting-and-configuration/schema-migrations-with-flyway`
  - o1: Write versioned Flyway migrations named V<version>__<description>.sql that create and change tables, and let Spring Boot apply them at startup
  - o2: Predict what Flyway does on startup for a new migration, an already applied migration and an edited applied migration (checksum mismatch)
  - o3: Explain why schema changes go in a new migration and why spring.jpa.hibernate.ddl-auto is set to validate or none once Flyway owns the schema
- `spring-data-jpa/spring-data-jpa-with-hibernate`
  - o1: Explain how Spring Data JPA, Jakarta Persistence and Hibernate divide the work between repository interfaces, the persistence API and the provider that issues SQL
  - o2: Configure a Boot project with the Data JPA starter and an embedded H2 database, and predict the datasource Boot auto-configures when no URL is set
  - o3: Compare a repository call with the equivalent hand-written JDBC code from the SQL course
- `spring-data-jpa/entities-and-ids`
  - o1: Map a class to a table with @Entity, @Table, @Id, @GeneratedValue and @Column, with the no-argument constructor Jakarta Persistence requires
  - o2: Choose an ID generation strategy and predict the ID before and after save
  - o3: Explain how Spring Data decides whether save inserts or updates an entity and why equals and hashCode based on a generated ID need care
- `spring-data-jpa/repositories-derived-queries-and-at-query`
  - o1: Declare a repository interface extending JpaRepository and use its inherited CRUD methods
  - o2: Write derived query methods such as findByTitleContainingIgnoreCase and predict the query a method name produces
  - o3: Write a JPQL @Query with a named parameter for a query a method name cannot express clearly
- `spring-data-jpa/seeing-the-generated-sql`
  - o1: Turn on SQL logging with spring.jpa.show-sql or the org.hibernate.SQL logger and bind parameter logging
  - o2: Match each SQL statement in a log to the repository call that issued it
  - o3: Spot an unexpected extra query in a log and name the repository or entity code that caused it
- `spring-data-jpa/controller-service-and-repository-layers`
  - o1: Assign each responsibility of a described feature (HTTP mapping, business rule, persistence) to the controller, service or repository layer
  - o2: Refactor a controller that calls the repository directly so that it calls a service that owns the business rule
  - o3: Explain why the controller depends on the service and the service on the repository interface, never the reverse
- `spring-data-jpa/dtos-and-mapping`
  - o1: Define request and response DTOs as Java records that expose only the fields the API contract needs
  - o2: Map between an entity and its DTOs in one place and keep entities out of controller signatures
  - o3: Explain how returning entities directly can leak internal fields or trigger lazy loading during serialization
- `spring-data-jpa/pagination-and-sorting`
  - o1: Accept page, size and sort query parameters as a Pageable and pass it to a repository method
  - o2: Predict the content and page metadata of a response for a given page, size and sort
  - o3: Return a stable paged JSON shape with PagedModel instead of serializing PageImpl directly
- `spring-data-jpa/api-layers-and-dtos-project`
  - o1: Separate a Spring Boot feature into controller, service and repository layers so that the controller holds no business rule and no repository call
  - o2: Expose the API only through request and response DTO records, mapped from entities in one mapper
  - o3: Serve a paged and sorted listing whose response content and page metadata pass the public tests run with mvn -q -o test
- `relationships-and-transactions/one-to-many-and-many-to-one-relationships`
  - o1: Map a bidirectional one-to-many and many-to-one relationship with @OneToMany(mappedBy) and @ManyToOne
  - o2: Identify the owning side as the side that holds the foreign key, and predict which change Hibernate saves when only the inverse side is updated
  - o3: Keep both sides of a bidirectional relationship in sync with helper methods
- `relationships-and-transactions/lazy-and-eager-loading`
  - o1: State the default fetch type for @ManyToOne and @OneToMany and predict when Hibernate loads the associated data
  - o2: Explain a LazyInitializationException from a stack trace and where the session closed
  - o3: Choose lazy loading with an explicit fetch for the use case instead of switching an association to eager
- `relationships-and-transactions/relationship-pitfalls`
  - o1: Predict the effect of cascade types and orphanRemoval when a parent is saved or deleted or a child is removed from a collection
  - o2: Avoid infinite recursion when serializing bidirectional relationships by returning DTOs
  - o3: Explain why toString, equals and hashCode must not traverse lazy associations
- `relationships-and-transactions/how-transactions-work-in-spring`
  - o1: Mark a service method @Transactional so that several repository writes commit or roll back together
  - o2: Predict whether a transaction rolls back for an unchecked exception, a checked exception and a self-invocation through this
  - o3: Use @Transactional(readOnly = true) for read paths and explain the proxy that applies transactional behavior
- `relationships-and-transactions/the-n-1-query-problem-spotting-it-in-sql-logs`
  - o1: Recognize the N+1 pattern in a SQL log: one query for the parents followed by one query per parent for its children
  - o2: Count the queries a listing endpoint issues for a given number of rows from the log or Hibernate statistics
  - o3: Explain why N+1 stays hidden with small test data and grows with real data
- `relationships-and-transactions/fixing-n-1-with-join-fetch`
  - o1: Rewrite a repository query with JOIN FETCH or an @EntityGraph so that a listing loads parents and children in one query
  - o2: Verify the fix by counting queries in the SQL log before and after
  - o3: Explain why JOIN FETCH on a collection does not combine safely with database pagination and choose an alternative such as a separate batch query
- `validation-errors-and-testing/bean-validation-on-requests`
  - o1: Annotate a request DTO with constraints such as @NotBlank, @Size, @Email and @Positive and trigger validation with @Valid on a @RequestBody parameter
  - o2: Predict the status code and which fields fail for a given invalid request body
  - o3: Validate a path variable or query parameter with a constraint on the method parameter
- `validation-errors-and-testing/global-error-handling`
  - o1: Handle a custom not-found exception and validation failures for all controllers in one @RestControllerAdvice with @ExceptionHandler methods
  - o2: Predict which handler runs for a thrown exception when local and global handlers both match
  - o3: Return error responses that never expose stack traces or internal details to the client while logging them on the server
- `validation-errors-and-testing/standard-error-responses-with-problemdetail`
  - o1: Return RFC 9457 problem details with ProblemDetail, setting type, title, status, detail and an extra property
  - o2: Enable Spring MVC's built-in problem details for framework exceptions and predict the body of a validation failure
  - o3: Explain why one standard error shape helps API clients compared with ad hoc error JSON
- `validation-errors-and-testing/error-handling-project`
  - o1: Validate incoming request DTOs with Bean Validation so that invalid bodies are rejected with 400 before the service runs
  - o2: Handle not-found, conflict and validation failures for every controller in one @RestControllerAdvice
  - o3: Return every error as an RFC 9457 ProblemDetail body with no stack trace, checked by the public tests run with mvn -q -o test
- `validation-errors-and-testing/mockito-in-spring-at-mockitobean`
  - o1: Replace a service bean in a Spring test context with @MockitoBean and stub its behavior with when(...).thenReturn(...)
  - o2: Verify an interaction on a @MockitoBean and explain how it differs from a plain Mockito mock created without Spring
  - o3: Choose between a plain unit test with a fake, a @MockitoBean slice test and a full context test for a described class
- `validation-errors-and-testing/web-layer-tests-with-mockmvc`
  - o1: Write a @WebMvcTest that performs a request with MockMvc and asserts the status, headers and JSON body
  - o2: Test a controller's 404 and 400 responses in a @WebMvcTest, supplying the service bean from a @TestConfiguration fake (stubbing it with @MockitoBean is taught later in mockito-in-spring-at-mockitobean)
  - o3: Read a failing MockMvc assertion to tell an expected status mismatch from a wrong JSON value
- `validation-errors-and-testing/debugging-a-failing-request`
  - o1: Trace a failing request through the controller, service and repository using the response status, the server log and the stack trace
  - o2: Reproduce the failure in a MockMvc test before fixing it
  - o3: Classify a failure as a client error (4xx) or a server error (5xx) and locate the layer responsible
- `integration-and-observability/an-integration-test`
  - o1: Write a @SpringBootTest that starts the full application context with the embedded H2 database and exercises an endpoint end to end
  - o2: Choose between @SpringBootTest, @WebMvcTest and @DataJpaTest for a described test by what each loads
  - o3: Keep integration tests independent with a known database state for each test
- `integration-and-observability/calling-another-service-with-restclient-base-url-and-timeouts`
  - o1: Call another HTTP service with RestClient built from the auto-configured RestClient.Builder, with the base URL read from configuration
  - o2: Set connect and read timeouts and turn a timeout, connection error or non-2xx response into a clear error from your own API
  - o3: Test the client without the other service running by using MockRestServiceServer
- `integration-and-observability/logging-in-spring`
  - o1: Log with an SLF4J logger at the right level and set levels per package with logging.level properties
  - o2: Read Spring Boot's default console log line to find the time, level, thread, logger and message
  - o3: Keep secrets and personal data out of log messages
- `integration-and-observability/health-checks`
  - o1: Add Spring Boot Actuator and read the aggregate status from /actuator/health, then enable component visibility with management.endpoint.health.show-components (component and detail visibility default to never; expose them only to trusted callers) and read the database health contributor's status
  - o2: Expose only the endpoints you need over HTTP and explain why other Actuator endpoints stay unexposed by default
  - o3: Explain how liveness and readiness health groups are used by a platform that restarts or routes traffic to the service
- `api-security/session-cookies-vs-jwts-trade-offs`
  - o1: Compare server-side sessions identified by a cookie with self-contained JWTs on state, revocation, scaling and size
  - o2: Explain why a browser sends cookies automatically and what that means for CSRF, and why a bearer token in a header is not sent automatically
  - o3: Choose sessions or JWTs for a described client and API and justify the choice
- `api-security/password-hashing`
  - o1: Hash a password for storage with Spring Security's delegating PasswordEncoder (bcrypt by default) and check a login with matches
  - o2: Explain why passwords are hashed with a slow, salted algorithm rather than encrypted or hashed with a fast digest
  - o3: Read the {id} prefix in a stored delegating hash and explain how it allows upgrading the algorithm later
- `api-security/issuing-and-checking-a-jwt`
  - o1: Issue a signed JWT after a successful login with a JwtEncoder, setting subject, issued-at, expiry and a roles claim
  - o2: Configure the OAuth 2.0 resource server to validate the JWT signature and expiry on each request with a key read from the environment
  - o3: Predict the response for a missing, expired or tampered token
- `api-security/role-protected-endpoints`
  - o1: Restrict endpoints by path, method and role with authorizeHttpRequests in a SecurityFilterChain bean
  - o2: Predict 401 versus 403 for an unauthenticated request and an authenticated request without the required role
  - o3: Test protected endpoints with MockMvc and Spring Security's test support for an anonymous user and users with different roles
- `api-security/a-dev-profile-that-keeps-endpoints-open-during-front-end-work`
  - o1: Define a dev-profile SecurityFilterChain that permits all requests and allows the local front-end origin with CORS, active only when the dev profile is on
  - o2: Prove that the default profile still enforces authentication by running the security tests without the dev profile
  - o3: Explain the risk of shipping an open profile and how profile activation and startup checks prevent it
- `api-security/common-api-security-risks-owasp`
  - o1: Identify three common risks for this course's API in described endpoints: broken object level authorization (API1), broken authentication (API2) and broken function level authorization (API5) from the OWASP API Security Top 10 2023; the full list is optional reference
  - o2: Identify broken object level authorization in a described endpoint and the ownership check that fixes it
  - o3: Connect earlier course practices (validation, DTOs, error bodies without internals, password hashing, role checks) to the risks they reduce
- `api-security/api-security-project`
  - o1: Store users with password hashes from the delegating PasswordEncoder and issue a signed JWT from a login endpoint
  - o2: Protect write endpoints by role with a SecurityFilterChain that validates JWTs, returning 401 and 403 as the public tests expect
  - o3: Keep a dev profile that opens endpoints for local front-end work while the default profile stays protected, proven by the public tests run with mvn -q -o test
- `api-security/spring-review-layers-data-access-errors-testing-security`
  - o1: Retrieve and apply layering, JPA mapping and query, validation and error handling, testing and security skills on mixed practice tasks without new material
  - o2: Trace one request through security, controller, service, repository and error handling, and locate where a described defect (N+1 query, missing validation, open endpoint) would surface

## Cross-track model

Standard and Fast Track share this one canonical tree; there are no per-track copies and nothing is authored twice. Standard adds the coding labs through its lab overlay; Fast skips coding labs and moves straight into project implementation. Fast's emphasis (`skim`), day packing and the FT5/FT7 presentation are track-overlay metadata, written when the track overlays are built (`pep-t1-track-overlays`), not in this course tree.

FT5 and FT7 (calendar `Lab`, `requiredLab: true`) are presented on the Fast track as **Project implementation** (discrepancy `conflict-ft5-lab-label`, resolved by the approved track model; FT7 follows the same model). The snapshot is unchanged. On those days the Lab template's "Lab brief" (7) and "Guided lab" (85) blocks carry the FT5 or FT7 project brief; Fast has no coding lab on any day.

### Fast route roles (input to the Fast overlay)

The Fast day is the frozen route of six blocks — Warm-up 5, Skim 10, Try-first diagnostic 15, Project 70, Timed without AI 15, Reflection 5 = 120 minutes (FT5 and FT7 use the Lab template: Warm-up 8, Lab brief 7, Guided lab 85, Redo one step without AI 10, Reflection 10). The required Fast route is those blocks, not the sum of every mapped page, so each page takes one of these roles:

- **diagnostic entry**: the try-first diagnostic probes this page's objectives first;
- **conditional remediation**: the learner opens the full page only when the diagnostic shows a gap;
- **skim/reference**: a `(skim)` row, read in the 10-minute Skim block and kept as reference;
- **project support**: consulted while building; every concept the project applies is still taught by an embedded teach-then-check step, never by assuming the page was read.

| Fast day | Pages: role |
|---|---|
| FT1 | `spring-vs-spring-boot-what-boot-adds`, `generating-a-spring-boot-project-and-its-structure`, `dependency-injection-replacing-manual-wiring`, `rest-controllers`: diagnostic entry, project support; `beans-and-bean-scopes`, `how-auto-configuration-works`: skim/reference |
| FT2 | `porting-a-javalin-route-service-and-repository-to-spring-boot`, `path-query-and-body-parameters`, `response-codes-with-responseentity`: diagnostic entry, project support; `reading-an-openapi-spec-and-exploring-it-in-swagger-ui`: diagnostic entry, conditional remediation; `configuration-files-and-profiles`, `secrets-from-the-environment`, `rest-design-recap`: skim/reference (configuration and secrets also project support) |
| FT3 | `spring-data-jpa-with-hibernate`, `entities-and-ids`, `repositories-derived-queries-and-at-query`, `seeing-the-generated-sql`: diagnostic entry, project support; `relationship-pitfalls`: skim/reference |
| FT4 | `controller-service-and-repository-layers`, `dtos-and-mapping`, `pagination-and-sorting`, `schema-migrations-with-flyway`: diagnostic entry, project support; `web-layer-tests-with-mockmvc`: diagnostic entry, conditional remediation, project support |
| FT5 | `bean-validation-on-requests`, `global-error-handling`, `standard-error-responses-with-problemdetail`: project support (FT5 brief); `logging-in-spring`: skim/reference |
| FT6 | `one-to-many-and-many-to-one-relationships`, `how-transactions-work-in-spring`, `the-n-1-query-problem-spotting-it-in-sql-logs`, `fixing-n-1-with-join-fetch`: diagnostic entry, project support; `lazy-and-eager-loading`, `mockito-in-spring-at-mockitobean`, `debugging-a-failing-request`: skim/reference |
| FT7 | `password-hashing`, `issuing-and-checking-a-jwt`, `role-protected-endpoints`, `a-dev-profile-that-keeps-endpoints-open-during-front-end-work`: project support (FT7 brief); `session-cookies-vs-jwts-trade-offs`, `common-api-security-risks-owasp`: skim/reference |
| FT8 | `an-integration-test`, `calling-another-service-with-restclient-base-url-and-timeouts`: skim/reference, project support; `spring-review-layers-data-access-errors-testing-security`: review |

These roles are proposals for the Fast overlay, which validates the route against the blocks; this intake neither compresses page budgets nor adds or removes topics. T14's per-day page-budget sum remains a separate repository gate (see Minute budgets).

### Fast-order prerequisites (reconciliation spring-intake-edu-001)

The frozen topic order is kept. Every in-course `prerequisites` entry is a true prerequisite that is met earlier on **both** tracks (an earlier day, or an earlier row of the same day); later enrichment is never listed as a prerequisite. The correction removed or replaced every entry that broke this on Fast: Flyway before introductory JPA (now configuration), DTOs and lazy loading before the FT3 `relationship-pitfalls` skim (now entities and IDs), `@MockitoBean` and ProblemDetail before FT4 MockMvc (now controllers and status codes), lazy loading before the FT6 N+1 page (now the one-to-many mapping), `ResponseEntity` before the FT2 porting row 0 (removed), the Standard-only constructor-injection topic before Fast pages (now `dependency-injection-replacing-manual-wiring`), and the Standard-only S6 brief before the FT5 brief (now the layers page). The table below is the verifiable Fast-route record; no tooling enforces it (tooling is out of scope for a course intake).

| Fast day, row | Topic | Prerequisites and where each is first met on the Fast route |
|---|---|---|
| FT1 row 0 | `spring-vs-spring-boot-what-boot-adds` | `java-foundations/inheritance-and-design/solid-basics` (Foundation); `java-foundations/http-and-javalin/routes-and-handlers-in-javalin` (Foundation) |
| FT1 row 1 | `generating-a-spring-boot-project-and-its-structure` | `java-foundations/classes-and-objects/classes-in-practice-project` (Foundation); `spring-vs-spring-boot-what-boot-adds` (FT1 row 0) |
| FT1 row 2 | `dependency-injection-replacing-manual-wiring` | `java-foundations/inheritance-and-design/solid-basics` (Foundation); `generating-a-spring-boot-project-and-its-structure` (FT1 row 1) |
| FT1 row 3 | `rest-controllers` | `java-foundations/http-and-javalin/routes-and-handlers-in-javalin` (Foundation); `java-foundations/http-and-javalin/http-methods-status-codes-and-json` (Foundation); `dependency-injection-replacing-manual-wiring` (FT1 row 2) |
| FT1 row 4 | `beans-and-bean-scopes` | `dependency-injection-replacing-manual-wiring` (FT1 row 2) |
| FT1 row 5 | `how-auto-configuration-works` | `beans-and-bean-scopes` (FT1 row 4) |
| FT2 row 0 | `porting-a-javalin-route-service-and-repository-to-spring-boot` | `java-foundations/http-and-javalin/repository-wiring-and-errors-project` (Foundation); `rest-controllers` (FT1 row 3) |
| FT2 row 1 | `path-query-and-body-parameters` | `rest-controllers` (FT1 row 3) |
| FT2 row 2 | `response-codes-with-responseentity` | `java-foundations/http-and-javalin/http-methods-status-codes-and-json` (Foundation); `path-query-and-body-parameters` (FT2 row 1) |
| FT2 row 3 | `reading-an-openapi-spec-and-exploring-it-in-swagger-ui` | `response-codes-with-responseentity` (FT2 row 2) |
| FT2 row 4 | `configuration-files-and-profiles` | `beans-and-bean-scopes` (FT1 row 4) |
| FT2 row 5 | `secrets-from-the-environment` | `configuration-files-and-profiles` (FT2 row 4) |
| FT2 row 6 | `rest-design-recap` | `response-codes-with-responseentity` (FT2 row 2) |
| FT3 row 0 | `spring-data-jpa-with-hibernate` | `sql-jdbc-foundations/reporting-indexes-and-review/jdbc-data-access-project` (Foundation); `configuration-files-and-profiles` (FT2 row 4) |
| FT3 row 1 | `entities-and-ids` | `sql-jdbc-foundations/relational-design/tables-keys-and-relationships` (Foundation); `spring-data-jpa-with-hibernate` (FT3 row 0) |
| FT3 row 2 | `repositories-derived-queries-and-at-query` | `entities-and-ids` (FT3 row 1) |
| FT3 row 3 | `seeing-the-generated-sql` | `repositories-derived-queries-and-at-query` (FT3 row 2) |
| FT3 row 4 | `relationship-pitfalls` | `entities-and-ids` (FT3 row 1) |
| FT4 row 0 | `controller-service-and-repository-layers` | `dependency-injection-replacing-manual-wiring` (FT1 row 2); `repositories-derived-queries-and-at-query` (FT3 row 2) |
| FT4 row 1 | `dtos-and-mapping` | `java-foundations/inheritance-and-design/records` (Foundation); `controller-service-and-repository-layers` (FT4 row 0) |
| FT4 row 2 | `pagination-and-sorting` | `sql-jdbc-foundations/crud-aggregates-and-joins/filtering-and-sorting` (Foundation); `dtos-and-mapping` (FT4 row 1) |
| FT4 row 3 | `schema-migrations-with-flyway` | `sql-jdbc-foundations/relational-design/create-table-data-types-and-constraints` (Foundation); `configuration-files-and-profiles` (FT2 row 4) |
| FT4 row 4 | `web-layer-tests-with-mockmvc` | `rest-controllers` (FT1 row 3); `response-codes-with-responseentity` (FT2 row 2) |
| FT5 row 0 | `bean-validation-on-requests` | `dtos-and-mapping` (FT4 row 1) |
| FT5 row 0 | `error-handling-project` | `controller-service-and-repository-layers` (FT4 row 0); `dtos-and-mapping` (FT4 row 1); `response-codes-with-responseentity` (FT2 row 2); `web-layer-tests-with-mockmvc` (FT4 row 4) |
| FT5 row 1 | `global-error-handling` | `java-foundations/exceptions-and-logging/custom-exceptions` (Foundation); `bean-validation-on-requests` (FT5 row 0) |
| FT5 row 2 | `standard-error-responses-with-problemdetail` | `global-error-handling` (FT5 row 1) |
| FT5 row 3 | `logging-in-spring` | `java-foundations/exceptions-and-logging/logging` (Foundation) |
| FT6 row 0 | `one-to-many-and-many-to-one-relationships` | `sql-jdbc-foundations/relational-design/tables-keys-and-relationships` (Foundation); `entities-and-ids` (FT3 row 1) |
| FT6 row 1 | `how-transactions-work-in-spring` | `controller-service-and-repository-layers` (FT4 row 0) |
| FT6 row 2 | `the-n-1-query-problem-spotting-it-in-sql-logs` | `seeing-the-generated-sql` (FT3 row 3); `one-to-many-and-many-to-one-relationships` (FT6 row 0) |
| FT6 row 3 | `fixing-n-1-with-join-fetch` | `the-n-1-query-problem-spotting-it-in-sql-logs` (FT6 row 2); `repositories-derived-queries-and-at-query` (FT3 row 2) |
| FT6 row 4 | `lazy-and-eager-loading` | `one-to-many-and-many-to-one-relationships` (FT6 row 0) |
| FT6 row 5 | `mockito-in-spring-at-mockitobean` | `java-foundations/testing-and-java-review/mocking-with-mockito` (Foundation); `dependency-injection-replacing-manual-wiring` (FT1 row 2); `rest-controllers` (FT1 row 3) |
| FT6 row 6 | `debugging-a-failing-request` | `java-foundations/exceptions-and-logging/reading-stack-traces` (Foundation); `web-layer-tests-with-mockmvc` (FT4 row 4) |
| FT7 row 0 | `api-security-project` | `error-handling-project` (FT5 row 0); `configuration-files-and-profiles` (FT2 row 4); `secrets-from-the-environment` (FT2 row 5); `entities-and-ids` (FT3 row 1); `web-layer-tests-with-mockmvc` (FT4 row 4) |
| FT7 row 0 | `password-hashing` | `entities-and-ids` (FT3 row 1) |
| FT7 row 1 | `issuing-and-checking-a-jwt` | `password-hashing` (FT7 row 0); `secrets-from-the-environment` (FT2 row 5) |
| FT7 row 2 | `role-protected-endpoints` | `issuing-and-checking-a-jwt` (FT7 row 1); `web-layer-tests-with-mockmvc` (FT4 row 4) |
| FT7 row 3 | `a-dev-profile-that-keeps-endpoints-open-during-front-end-work` | `role-protected-endpoints` (FT7 row 2); `configuration-files-and-profiles` (FT2 row 4) |
| FT7 row 4 | `session-cookies-vs-jwts-trade-offs` | `rest-design-recap` (FT2 row 6) |
| FT7 row 5 | `common-api-security-risks-owasp` | `role-protected-endpoints` (FT7 row 2) |
| FT8 row 0 | `an-integration-test` | `web-layer-tests-with-mockmvc` (FT4 row 4); `repositories-derived-queries-and-at-query` (FT3 row 2) |
| FT8 row 1 | `calling-another-service-with-restclient-base-url-and-timeouts` | `configuration-files-and-profiles` (FT2 row 4); `global-error-handling` (FT5 row 1) |
| FT8 row 2 | `spring-review-layers-data-access-errors-testing-security` | `role-protected-endpoints` (FT7 row 2); `an-integration-test` (FT8 row 0); `fixing-n-1-with-join-fetch` (FT6 row 3); `standard-error-responses-with-problemdetail` (FT5 row 2) |

Early Fast uses stay self-contained:

- FT3 row 4 `relationship-pitfalls` (skim): read as reference with a one-paragraph just-in-time bridge (what an association between two entities is) built on `entities-and-ids`. Its checks depend on DTOs (FT4) and fetch types (FT6), so on the Fast route its practice-quiz items are taken on FT6 after the relationship and lazy-loading pages, never on FT3; the overlay places them.
- FT4 row 4 `web-layer-tests-with-mockmvc`: objective o2 is now taught with a `@TestConfiguration` fake service, so FT4 teaches and checks only MockMvc behavior available before `@MockitoBean` (FT6) and ProblemDetail (FT5).
- FT2 row 0 porting: the Javalin port is checked against status codes the port already returns; the `ResponseEntity` page follows in rows 1-2 of the same day.

## Project-artifact plan

Each calendar project row gets exactly one reusable, learner-facing project brief; Standard and Fast both use the same canonical artifact. Following the merged `java-foundations` pattern (captain decision `pep-project-rows`, option A), each brief is a `topic.json` of kind `lab-brief` in the module of its day, whose `coding-lab/` directory holds the starter scaffold, fixtures and public tests in the lab-contract layout and is presented to learners as a project, never as a coding lab. The briefs are authored in their module PRs; this intake writes only their manifests.

All three briefs and the six Fast increments build one cumulative learner project, the **workshop booking API**: a Spring Boot 4.1 (Spring MVC) service for workshops and registrations on an embedded in-memory H2 database. It is the API the Python course's FT11 increment later calls.

Rules for every brief:

- Test command: `mvn -q -o test` (JUnit via Maven Surefire), offline after the one-time online `mvn dependency:go-offline`; JDK 25 and Maven from Java Foundations. One command on macOS, Linux and Windows (the Maven wrapper's `./mvnw` and `mvnw.cmd` differ by OS, so the installed `mvn` is the single command).
- Datastore: embedded in-memory H2 created and dropped by each test run; no database server, Docker, Podman, Compose, Testcontainers or other learner-side container engine. Outbound calls use `MockRestServiceServer`; no network.
- Determinism: pinned Spring Boot 4.1.x parent (4.1.1 at intake) and plugin versions, fixed fixtures, no wall clock (a fixed `Clock` bean where expiry is tested), locale or network dependence; the shipped starter fails named public tests with stable messages.
- No reference solution, completed increment, hidden test or private checkpoint enters the repository; the solved-run check runs against uncommitted private staging (`authoring/docs/lab-contract.md` section 8).
- Running the app (`mvn spring-boot:run`) and `curl` are real-terminal steps; any in-page terminal simulation reuses `components/terminal` version 1 unchanged.

### S6 brief: `spring-data-jpa/api-layers-and-dtos-project` (Standard S6 Project day; Fast FT4 increment)

- Calendar: S6 Project day (Warm-up 5, Plan the work 10, Build 80, Timed without AI 15, Commit and walkthrough note 10). Rows S6 0-2 map `shared` to this brief.
- Outcomes (objectives o1-o3): layered controller, service and repository with no business rule in the controller; request and response DTO records mapped in one mapper; a paged and sorted listing whose content and page metadata pass the public tests.
- Scaffold (Standard entry): a generated Boot project with the `Workshop` entity, a Flyway `V1` migration and a `WorkshopRepository extends JpaRepository` provided (S4-S5 skills, already practised in the S3-S4 and S5 labs); stub `WorkshopService`, `WorkshopController`, `WorkshopMapper` and DTO records with TODOs. The provided repository has no derived or `@Query` methods, so it gives away none of the FT3 increment's claimed fragments.
- Public tests: `WorkshopControllerTest` (MockMvc) and `WorkshopServiceTest`, run with `mvn -q -o test`.
- Teach before apply on Standard (reconciliation spring-intake-edu-002): the day's own three rows are taught in full **before the scaffold is opened**. The 80-minute Build block starts with a 36-minute teach phase: the pages `controller-service-and-repository-layers`, `dtos-and-mapping` and `pagination-and-sorting` (12 minutes each, their budgets), each ending with its in-page check (predict which layer owns a 404 decision; predict the JSON of a DTO versus the entity; predict page 1 of size 2 sorted by title). Only then do learners open the scaffold for a 44-minute build used for transfer and feedback: orient 4, layering refactor 12, DTOs and mapper 12, paged listing 12, wrap 4. Short reminders inside the build may stay but never count as teaching. Every other applied concept is taught on S1-S5. Pilot item for the S6 module PR: confirm the 36 + 44 split; if the build overruns, the paged listing becomes the extension step, never the teach phase.

| Applied concept | Taught before S6 by |
|---|---|
| REST controllers, parameters, ResponseEntity | `spring-boot-basics/rest-controllers` o1, `path-query-and-body-parameters` o1, `response-codes-with-responseentity` o1 (S2) |
| constructor injection across layers | `porting-and-configuration/constructor-injection-across-layers` o1 (S3) |
| configuration and Flyway migration | `porting-and-configuration/configuration-files-and-profiles` o1, `schema-migrations-with-flyway` o1 (S4) |
| entities, repositories, SQL log | `spring-data-jpa/spring-data-jpa-with-hibernate` o2, `entities-and-ids` o1, `repositories-derived-queries-and-at-query` o1, `seeing-the-generated-sql` o1 (S5) |
| layers, DTOs, pagination | the day's own rows: the three pages and their checks in the teach phase, completed before the scaffold is opened |

### FT5 brief: `validation-errors-and-testing/error-handling-project` (Fast FT5 Project implementation; Standard optional)

- Calendar: FT5 (Lab template, presented as Project implementation): Lab brief 7 + Guided lab 85 carry the brief. Rows FT5 0-3 map `shared` to this brief.
- Outcomes (o1-o3): Bean Validation rejects invalid request DTOs with 400 before the service runs; one `@RestControllerAdvice` handles not-found, conflict and validation failures; every error is an RFC 9457 `ProblemDetail` with no stack trace.
- Scaffold: an extension onto the learner's own cumulative project after FT4 (Fast) or after the S6 brief (Standard): new stub `ApiExceptionHandler`, `WorkshopNotFoundException`, constraint TODOs on the existing request DTO, and public tests `ErrorHandlingTest` (MockMvc). It ships no earlier increment's completed code.
- Standard use: S9's required module lab stays Standard's required practice; Standard may use this brief as optional consolidation on the S6 project. No learner does both as required work.
- Teach before apply (Fast; reconciliations spring-intake-edu-002 and spring-sme-002): the Lab brief block (7) introduces the brief. The Guided block (85) opens with a 40-minute **teach-and-diagnostic phase** before any project work: the pages `bean-validation-on-requests`, `global-error-handling` and `standard-error-responses-with-problemdetail` (12 minutes each, ending with their checks: predict which fields fail for a given body; predict which handler runs for a thrown exception; predict the problem body for a missing workshop), then a 4-minute diagnostic of three predict items that gates opening the scaffold. The 45-minute build is transfer and feedback: orient 3, validation 12, global handler 12, ProblemDetail 12, wrap 6. Total 85. Logging is **not** a project action: the FT5 row 3 `logging-in-spring` (skim) stays in the Skim/reference role, and the scaffold's handler logs nothing the learner must write. Prior Fast prerequisites: DTOs and layers (FT4), `ResponseEntity` status codes (FT2), MockMvc (FT4).

### FT7 brief: `api-security/api-security-project` (Fast FT7 Project implementation; Standard optional)

- Calendar: FT7 (Lab template, presented as Project implementation): Lab brief 7 + Guided lab 85. Rows FT7 0-5 map `shared` to this brief.
- Outcomes (o1-o3): users stored with delegating `PasswordEncoder` hashes and a login endpoint that issues a signed JWT; write endpoints protected by role through a `SecurityFilterChain` that validates JWTs (401 versus 403); a dev profile that opens endpoints for local front-end work while the default profile stays protected.
- Scaffold: an extension onto the cumulative project: stub `SecurityConfig`, `TokenService`, `AuthController`, `AppUser` entity with a Flyway migration, a fixed `Clock` bean for expiry tests, the JWT HMAC key read from the environment variable `APP_JWT_SECRET` with a test-only value in `src/test/resources`, and public tests `SecurityTest` and `DevProfileTest` (MockMvc with Spring Security test support). No network or identity provider: the app signs and validates its own tokens with Spring Security's Nimbus `JwtEncoder` and `JwtDecoder`.
- Standard use: S12's required module lab stays Standard's required practice; the brief is optional consolidation on the S6 project.
- Teach before apply (Fast; reconciliation spring-intake-edu-002): the Lab brief block (7) introduces the brief. The Guided block (85) opens with a 52-minute **teach-and-diagnostic phase**: the pages `password-hashing`, `issuing-and-checking-a-jwt`, `role-protected-endpoints` and `a-dev-profile-that-keeps-endpoints-open-during-front-end-work` (12 minutes each, ending with their checks: predict whether `matches` accepts a re-hashed password; predict the claims of an issued token and the response for an expired one; predict 401 versus 403 for three requests; predict which profile's chain applies when `dev` is not active), then a 4-minute diagnostic that gates opening the scaffold. The 33-minute build is transfer and feedback: orient 3, hashing and login 8, issuing the token 8, JWT validation and role rules 8, dev profile 3, wrap 3. Total 85. The skim rows (sessions versus JWTs, OWASP) stay reference; the wrap checklist names API1, API2 and API5 without claiming those objectives. Pilot item for the api-security module PR: FT7's 33-minute build is the tightest; if a pilot overruns, the dev-profile build step moves to the page practice and `DevProfileTest` becomes practised, not claimed — the teach phase is never cut. Prior Fast prerequisites: configuration and secrets (FT2), entities and Flyway (FT3-FT4), MockMvc (FT4), error handling (FT5).

## Fast project increments: one cumulative project in six increments

Amendment 1 (captain decision `pep-fast-project-block`, option A): the 70-minute Project block of FT1, FT2, FT3, FT4, FT6 and FT8 runs six successive increments of the workshop booking API, building toward the FT5 and FT7 briefs. Learners see each as a project increment, never as a coding lab.

Program Fast pattern applied to every increment:

- Each increment fits the 70-minute Project block, so each Fast day stays inside its frozen 120-minute template (Warm-up 5, Skim 10, Try-first diagnostic 15, Project 70, Timed without AI 15, Reflection 5). If a pilot shows an overrun, the author drops the increment's last step to the topic page, never the other blocks.
- Every applied concept gets a short, minuted, embedded **teach-then-check** step before its first use: a teach segment, then a check (a predict-the-result question or one named public test turning from failing to passing). The 10-minute Skim and the topic pages are reference only.
- **Claimed versus practised**: a requirement fragment is claimed only with a named pre-application check (inside that step's check minutes) and a named public test that observes it. Every other fragment is practised, not claimed, and stays owned by its topic page and practice quiz. A claimed fragment is **whole** only when its objective has no other requirement; otherwise it is **partial**, with the remainder named.
- Each increment ships a starter (FT1) or an extension (later days) with new stubs, fixtures and public tests only; no extension ships an earlier increment's completed code. Public tests live in one package per increment (`increment1` ... `increment8`, matching the Fast day) and run with the one language-native runner, offline after the one-time setup:
  - while working on increment N: `mvn -q -o test -Dtest=increment<N>.*` (the same Surefire command filtered to that package; unquoted so it reads the same in cmd.exe, PowerShell and POSIX shells — reconciliation spring-sme-005; the module PR proves the exact selector against the authored package layout and runs a Windows command-line smoke run as a release check);
  - to complete increment N: `mvn -q -o test`, the cumulative command over all increments shipped so far.
- A learner with an unfinished earlier increment gets no promise of a passing cumulative run. Late entry and the solved-run check are verified against uncommitted private checkpoints in which increments 1 to N-1 are complete, kept in private staging like solutions and never committed.
- No Docker or other learner-side container engine; embedded H2 only; no network.
- Reuse: FT4 is the S6 brief in its extension form (same stubs and public tests, applied to the learner's own project); FT3, FT6 and FT8 reuse the Standard S5, S7-S8 and S11 module-lab fixtures and the public tests whose skills match, presented inside the project.
- Package slot (open for the Fast overlay, as in the `python` intake): no repository contract yet defines a project-increment artifact. This intake proposes one course-level package following the lab-contract layout (it spans modules, so `course.lock.json` would cover it) presented as a project; `course.json` `courseLabs` stays empty until that slot is agreed. Every increment must be piloted against its 70 minutes before release.

Increment binding table (reconciliations spring-intake-edu-003 and spring-sme-006-fast-increments-unbound). This structured table binds all six increments and their public-test packages to the one course-level workshop booking API project, alongside the FT5 and FT7 briefs that sit between them. A machine-readable package or overlay manifest with lock, schema and check binding is deferred to the track-overlay task `pep-t1-track-overlays`, which owns Fast overlays for every course; this intake adds no tooling or schema.

| Order | Fast day | Artifact | Calendar rows referenced (unchanged) | Extends | Public-test package and named tests | Claimed fragments | Minute plan in the block |
|---|---|---|---|---|---|---|---|
| 1 | FT1 | increment 1 (starter) | FT1 rows 0-3 (rows 4-5 skim) | — | `increment1`: `WiringTest#controllerReceivesCatalogByConstructor`, `WorkshopControllerTest#listReturnsJsonArray` | DI o1 (partial), REST controllers o1 (partial) | 8 + 20 + 25 + 12 + 5 = 70 |
| 2 | FT2 | increment 2 (extension) | FT2 rows 0-2, 4-5 (rows 3, 6 page/skim) | 1 | `increment2`: `ParametersTest#pathAndOptionalQueryAreBound`, `StatusTest#createReturns201WithLocation`, `StatusTest#unknownIdReturns404`, `ConfigTest#devProfileOverridesCapacity` | parameters o1, ResponseEntity o1, profiles o2 (all partial) | 5 + 27 + 18 + 15 + 5 = 70 |
| 3 | FT3 | increment 3 (extension) | FT3 rows 0-3 (row 4 skim) | 2 | `increment3`: `RepositoryTest#findByTopicIgnoreCase`, `RepositoryTest#findWithSeatsLeft` | repositories o2 (partial), o3 (whole) | 5 + 18 + 22 + 10 + 10 + 5 = 70 |
| 4 | FT4 | increment 4 (the S6 brief in extension form) | FT4 rows 0-4 | 3 | `increment4`: `WorkshopControllerTest#secondPageSortedByTitle`, `WorkshopControllerTest#responseOmitsInternalFields`, `MigrationTest#schemaValidatesAgainstV1` | pagination o2 (whole), DTOs o1 (partial), Flyway o3 (partial) | 4 + 12 + 14 + 14 + 14 + 8 + 4 = 70 |
| 5 | FT5 | brief `error-handling-project` | FT5 rows 0-3 (`shared`) | 4 | `ErrorHandlingTest#invalidBodyReturns400WithFieldErrors`, `ErrorHandlingTest#missingWorkshopReturnsProblemDetail` | Bean Validation o2 (whole), ProblemDetail o1 (partial) | brief 7; guided 85 = teach and diagnostic 40 + build 45 |
| 6 | FT6 | increment 6 (extension) | FT6 rows 0-3 (rows 4-6 skim) | 5 | `increment6`: `MappingTest#registrationOwnsForeignKey`, `RegistrationServiceTest#failedRegistrationRollsBack`, `QueryCountTest#listingUsesOneQuery` | relationships o2 (partial), transactions o1 (whole), JOIN FETCH o1 (whole) | 4 + 20 + 18 + 22 + 6 = 70 |
| 7 | FT7 | brief `api-security-project` | FT7 rows 0-5 (`shared`) | 6 | `SecurityTest#storedPasswordIsDelegatingHash`, `SecurityTest#loginWithWrongPasswordFails`, `SecurityTest#anonymousWriteIs401`, `SecurityTest#userRoleWriteIs403`, `DevProfileTest#defaultProfileStillProtected` | password hashing o1, roles o2, dev profile o2 (all whole) | brief 7; guided 85 = teach and diagnostic 52 + build 33 |
| 8 | FT8 | increment 8 (extension) | FT8 rows 0-1 (skim) and row 2 (review) | 7 | `increment8`: `VenueClientTest#upstream500MapsTo502Problem` | RestClient o2 (partial) | 4 + 22 + 24 + 14 + 6 = 70 |

All rows: no container engine, embedded H2, no network; `mvn -q -o test` is the cumulative command and `mvn -q -o test -Dtest=increment<N>.*` the per-increment selector.

FT1 increment 1, project skeleton and first endpoint (70 minutes):

| Step | Minutes (teach + check + apply) | Teach-then-check | Learner outcome (observable) |
|---|---|---|---|
| Orient and build | 8 (3 + 1 + 4) | What the generated project contains (main class, `pom.xml` parent and web starter, `src/main` and `src/test`); check: name the file that starts the app | `mvn -q -o test` runs and fails the named increment-1 tests |
| A service bean, injected | 20 (5 + 2 + 13) | `@Service` found by component scanning, constructor injection replacing `new`; check: predict the startup result when the controller needs a bean that is not annotated | `WorkshopCatalog` (in-memory list of `Workshop` records) is injected into the controller through its constructor |
| A REST controller | 25 (6 + 2 + 17) | `@RestController`, `@GetMapping`, records serialized as JSON; check: predict the JSON for a two-workshop list | `GET /workshops` returns the catalog as a JSON array |
| Run it | 12 (3 + 1 + 8) | `mvn spring-boot:run`, reading the port in the startup log, `curl`; check: which log line shows the port | the learner sees the JSON with `curl http://localhost:8080/workshops` |
| Wrap | 5 | none (no new concept) | `mvn -q -o test` passes increment 1; commit with Git |

FT2 increment 2, parameters, status codes and configuration (70 minutes):

| Step | Minutes (teach + check + apply) | Teach-then-check | Learner outcome (observable) |
|---|---|---|---|
| Orient | 5 | none: add the extension files; compare the Java Foundations Javalin `GET /items/{id}` handler with its Spring mapping | `-Dtest='increment2.**'` fails the named increment-2 tests |
| Path, query and body | 27 (7 + 2 + 18) | `@PathVariable`, `@RequestParam` (required and optional), `@RequestBody` record; check: predict the status for `/workshops/abc` | `GET /workshops/{id}`, `GET /workshops?topic=` and `POST /workshops` bind their inputs |
| Status codes | 18 (5 + 2 + 11) | `ResponseEntity` 201 with `Location`, 404; check: predict status and `Location` for a created workshop | POST returns 201 with `Location`; an unknown id returns 404 |
| Configuration and a secret | 15 (5 + 2 + 8) | `@ConfigurationProperties` record, profile-specific file, environment override by relaxed binding; check: predict the effective `workshops.default-capacity` for a given file set and environment | default capacity comes from configuration; a `dev` profile file overrides it |
| Wrap | 5 | none | increment 2 then the cumulative command pass; commit |

FT3 increment 3, persistence with Spring Data JPA (70 minutes):

| Step | Minutes (teach + check + apply) | Teach-then-check | Learner outcome (observable) |
|---|---|---|---|
| Orient | 5 | none: add the JPA and H2 dependencies already in the extension `pom.xml`; schema is generated by Hibernate for embedded H2 until FT4 adds Flyway | `-Dtest='increment3.**'` fails |
| Entity and ID | 18 (5 + 2 + 11) | `@Entity`, `@Id`, `@GeneratedValue`, no-argument constructor; check: predict the ID before and after `save` | `Workshop` becomes an entity and `WorkshopRepository extends JpaRepository` replaces the in-memory catalog |
| Derived query and @Query | 22 (6 + 2 + 14) | derived method names, JPQL `@Query` with a named parameter; check: predict the WHERE clause of `findByTopicIgnoreCase` | `findByTopicIgnoreCase` and `@Query findWithSeatsLeft(:min)` return the fixture workshops |
| See the SQL | 10 (3 + 1 + 6) | `spring.jpa.show-sql` and the `org.hibernate.SQL` logger; check: match a log line to a call | the learner reads the SQL for each repository call |
| Rewire | 10 (2 + 1 + 7) | none new: the controller now uses the repository through the service; check: predict which earlier tests still pass | increments 1-3 pass the cumulative command |
| Wrap | 5 | none | commit |

FT4 increment 4, layers, DTOs, pagination, migrations (70 minutes; the S6 brief in extension form):

| Step | Minutes (teach + check + apply) | Teach-then-check | Learner outcome (observable) |
|---|---|---|---|
| Orient | 4 | none | `-Dtest='increment4.**'` fails |
| Flyway | 12 (4 + 1 + 7) | `V1__create_workshop.sql`, `ddl-auto=validate`; check: predict startup after an applied migration is edited | the schema comes from Flyway and the app starts with `validate` |
| Layers | 14 (4 + 2 + 8) | controller, service, repository responsibilities; check: which layer owns a 404 decision | the controller calls only `WorkshopService` |
| DTOs | 14 (4 + 2 + 8) | request and response records, one mapper; check: predict the JSON of the DTO versus the entity | responses omit internal fields |
| Pagination | 14 (4 + 2 + 8) | `Pageable`, sort parameter, `PagedModel`; check: predict page 1 of size 2 sorted by title | `GET /workshops?page=1&size=2&sort=title` returns the expected page |
| MockMvc | 8 (3 + 1 + 4) | `@WebMvcTest`, `perform`, status and JSON path assertions, with the service supplied by the provided `@TestConfiguration` fake (no `@MockitoBean` or ProblemDetail, which come on FT6 and FT5); check: read a failing assertion | the learner adds one MockMvc test for the 404 case |
| Wrap | 4 | none | cumulative command passes increments 1-4; commit |

FT6 increment 6, relationships, transactions and N+1 (70 minutes):

| Step | Minutes (teach + check + apply) | Teach-then-check | Learner outcome (observable) |
|---|---|---|---|
| Orient | 4 | none: the extension adds a Flyway `V3` migration for `registration` | `-Dtest='increment6.**'` fails |
| One-to-many | 20 (6 + 2 + 12) | `@ManyToOne` owning side, `@OneToMany(mappedBy)`, sync helpers; check: predict what is saved when only the inverse collection changes | `Registration` belongs to a `Workshop` |
| Transactions | 18 (5 + 2 + 11) | `@Transactional` on a service method, rollback on unchecked exceptions; check: predict seats and registrations after a failure mid-method | `register` decrements seats and saves a registration atomically |
| N+1 | 22 (6 + 2 + 14) | the N+1 pattern in the SQL log and Hibernate statistics, `JOIN FETCH`; check: count the queries in a given log | the workshops-with-registrations listing runs in one query |
| Wrap | 6 | none | cumulative command passes; commit |

FT8 increment 8, integration test and a service call (70 minutes; the FT8 module check sits outside this block):

| Step | Minutes (teach + check + apply) | Teach-then-check | Learner outcome (observable) |
|---|---|---|---|
| Orient | 4 | none | `-Dtest='increment8.**'` fails |
| Integration test | 22 (6 + 2 + 14) | `@SpringBootTest` with `@AutoConfigureMockMvc` and embedded H2, versus `@WebMvcTest`; check: predict which beans each test loads | the learner writes `BookingFlowIT`: create, register, list |
| RestClient call | 24 (7 + 2 + 15) | `RestClient.Builder` with a configured base URL, timeouts, mapping upstream failures, `MockRestServiceServer`; check: predict the response when the upstream returns 500 | `VenueClient` calls the venue service at the configured base URL and maps its errors |
| Review pass | 14 | none (no new concept): run the cumulative suite, fix one seeded defect from a list (missing validation, open endpoint, N+1) | the cumulative command passes |
| Wrap | 6 | none | commit |

Coverage claimed by the increments and briefs. Each claimed row names its pre-application check and the public test that observes it; test names are binding names for the authors.

| Day | Objective | Fragment claimed | Pre-application check (step) | Public test | Coverage |
|---|---|---|---|---|---|
| FT1 | `dependency-injection-replacing-manual-wiring#o1` | the controller receives the service through its constructor | startup prediction (A service bean) | `increment1.WiringTest#controllerReceivesCatalogByConstructor` | partial [service-to-repository wiring] |
| FT1 | `rest-controllers#o1` | a `@GetMapping` method returns records as JSON | JSON prediction (A REST controller) | `increment1.WorkshopControllerTest#listReturnsJsonArray` | partial [`@PostMapping`] |
| FT2 | `path-query-and-body-parameters#o1` | bind a path variable and an optional query parameter | `/workshops/abc` status prediction (Path, query and body) | `increment2.ParametersTest#pathAndOptionalQueryAreBound` | partial [required query parameter; body] |
| FT2 | `response-codes-with-responseentity#o1` | 201 with `Location` and 404 | status and `Location` prediction (Status codes) | `increment2.StatusTest#createReturns201WithLocation`, `#unknownIdReturns404` | partial [200 and 204] |
| FT2 | `configuration-files-and-profiles#o2` | a profile-specific value wins when the profile is active | effective-value prediction (Configuration) | `increment2.ConfigTest#devProfileOverridesCapacity` | partial [setting `spring.profiles.active` outside tests] |
| FT3 | `repositories-derived-queries-and-at-query#o2` | a derived query method returns the matching rows | WHERE-clause prediction (Derived query) | `increment3.RepositoryTest#findByTopicIgnoreCase` | partial [predicting the query for other names] |
| FT3 | `repositories-derived-queries-and-at-query#o3` | a JPQL `@Query` with a named parameter | (same step) | `increment3.RepositoryTest#findWithSeatsLeft` | whole |
| FT4 | `pagination-and-sorting#o2` | page content and metadata for a page, size and sort | page prediction (Pagination) | `increment4.WorkshopControllerTest#secondPageSortedByTitle` | whole |
| FT4 | `dtos-and-mapping#o1` | responses expose only contract fields | DTO JSON prediction (DTOs) | `increment4.WorkshopControllerTest#responseOmitsInternalFields` | partial [request DTO] |
| FT4 | `schema-migrations-with-flyway#o3` | `ddl-auto=validate` once Flyway owns the schema | edited-migration prediction (Flyway) | `increment4.MigrationTest#schemaValidatesAgainstV1` | partial [explaining why changes go in a new migration] |
| FT5 | `bean-validation-on-requests#o2` | an invalid body returns 400 naming the failing fields | page check of `bean-validation-on-requests` (teach phase), then the gating diagnostic | `ErrorHandlingTest#invalidBodyReturns400WithFieldErrors` | whole |
| FT5 | `standard-error-responses-with-problemdetail#o1` | a not-found returns a ProblemDetail with type, title, status and detail | page check of `standard-error-responses-with-problemdetail` (teach phase), then the gating diagnostic | `ErrorHandlingTest#missingWorkshopReturnsProblemDetail` | partial [extra property] |
| FT6 | `one-to-many-and-many-to-one-relationships#o2` | the owning side holds the foreign key | inverse-side prediction (One-to-many) | `increment6.MappingTest#registrationOwnsForeignKey` | partial [predicting the inverse-only update] |
| FT6 | `how-transactions-work-in-spring#o1` | several writes commit or roll back together | failure prediction (Transactions) | `increment6.RegistrationServiceTest#failedRegistrationRollsBack` | whole |
| FT6 | `fixing-n-1-with-join-fetch#o1` | the listing loads parents and children in one query | query-count check (N+1) | `increment6.QueryCountTest#listingUsesOneQuery` | whole |
| FT7 | `password-hashing#o1` | stored hashes come from the delegating encoder and `matches` checks a login | page check of `password-hashing` (teach phase) | `SecurityTest#storedPasswordIsDelegatingHash`, `#loginWithWrongPasswordFails` | whole |
| FT7 | `role-protected-endpoints#o2` | 401 for anonymous and 403 for a wrong role | page check of `role-protected-endpoints` (teach phase), then the gating diagnostic | `SecurityTest#anonymousWriteIs401`, `#userRoleWriteIs403` | whole |
| FT7 | `a-dev-profile-that-keeps-endpoints-open-during-front-end-work#o2` | the default profile still enforces authentication | page check of the dev-profile page (teach phase) | `DevProfileTest#defaultProfileStillProtected` | whole |
| FT8 | `calling-another-service-with-restclient-base-url-and-timeouts#o2` | an upstream 500 becomes a clear error from your API | upstream-500 prediction (RestClient call) | `increment8.VenueClientTest#upstream500MapsTo502Problem` | partial [timeouts; connection errors] |

For FT5 and FT7 the pre-application check is the page's own check in the teach-and-diagnostic phase, completed before the scaffold is opened; the build only applies and transfers.

Practised, not claimed (used in the steps but lacking a pre-application check, an observing public test, or both; owned by the topic pages and quizzes): generating and running the project and reading the port (`generating-a-spring-boot-project-and-its-structure#o2`, `#o3`); `@PostMapping` and `curl` (`rest-controllers#o1`, `#o3`); the Javalin comparison (`porting-a-javalin-route-service-and-repository-to-spring-boot#o1`); request bodies (`path-query-and-body-parameters#o1`); environment overrides (`configuration-files-and-profiles#o3`, `secrets-from-the-environment#o1`); entity mapping and IDs (`entities-and-ids#o1`, `#o2`); SQL logging (`seeing-the-generated-sql#o1`, `#o2`); layering (`controller-service-and-repository-layers#o2`); the mapper (`dtos-and-mapping#o2`); writing a MockMvc test (`web-layer-tests-with-mockmvc#o1`); the global handler (`global-error-handling#o1`); the S6 brief's layers and DTOs on Standard (taught by the pages in its teach phase and observed by its own public tests, not by an increment); sync helpers (`one-to-many-and-many-to-one-relationships#o1`, `#o3`); issuing and validating the JWT (`issuing-and-checking-a-jwt#o1`, `#o2`); the integration test (`an-integration-test#o1`); base URL configuration and `MockRestServiceServer` (`calling-another-service-with-restclient-base-url-and-timeouts#o1`, `#o3`).

Not applied by the Fast project: the `(skim)` rows `beans-and-bean-scopes`, `how-auto-configuration-works`, `rest-design-recap`, `relationship-pitfalls`, `lazy-and-eager-loading`, `mockito-in-spring-at-mockitobean`, `debugging-a-failing-request`, `logging-in-spring`, `session-cookies-vs-jwts-trade-offs` and `common-api-security-risks-owasp` (Skim block and pages only), `reading-an-openapi-spec-and-exploring-it-in-swagger-ui` (page practice), and the Standard-only `constructor-injection-across-layers` and `health-checks`.

Day fit: every increment totals exactly 70 minutes and every brief exactly its calendar block (S6 Build 80 as teach 36 + build 44; FT5 and FT7 Guided 85 as teach-and-diagnostic plus build), so each Fast day fits its frozen 120-minute template with no reduction. Open item for the track-overlay task (not decided here): FT8 also carries the module check, but the Fast template has no module-check block; see the blueprint section.

## Artifact applicability

Rules (plan section 5 and the confirmed matrix v3 expected-artifact scope): core topics require HTML (with embedded simulator practice), derived Markdown and a practice GIFT quiz, with a video only when a suitable verified one qualifies; Reading topics also carry a printable PDF (matrix `print-handout`); the review topic carries HTML (with simulator) and Markdown only; project briefs carry HTML, Markdown and their project scaffold in the topic `coding-lab/` directory; the module check carries no learner file.

Legend: **R** required, authored in the module PR; **V** conditional video, authored only if a live, public, embeddable video qualifies within budget, otherwise absent with the search record; **M** practised in the planned module coding lab (Standard lab overlay), topic-level `coding-lab/` absent; **B** applied in the S6 project brief, no topic lab; **P** project scaffold and public tests in the brief's own `coding-lab/` directory; **-** not applicable, with the reason in `topic.json`.

| Topic | Kind | html | md | pdf | gift | video | lab |
|---|---|---|---|---|---|---|---|
| `spring-boot-basics/spring-vs-spring-boot-what-boot-adds` | core | R | R | - | R | V | - |
| `spring-boot-basics/generating-a-spring-boot-project-and-its-structure` | core | R | R | - | R | V | - |
| `spring-boot-basics/dependency-injection-replacing-manual-wiring` | core | R | R | - | R | V | - |
| `spring-boot-basics/beans-and-bean-scopes` | core | R | R | - | R | V | - |
| `spring-boot-basics/how-auto-configuration-works` | reading | R | R | R | R | V | - |
| `spring-boot-basics/rest-controllers` | core | R | R | - | R | V | - |
| `spring-boot-basics/path-query-and-body-parameters` | core | R | R | - | R | V | - |
| `spring-boot-basics/response-codes-with-responseentity` | core | R | R | - | R | V | - |
| `spring-boot-basics/reading-an-openapi-spec-and-exploring-it-in-swagger-ui` | core | R | R | - | R | V | - |
| `porting-and-configuration/porting-a-javalin-route-service-and-repository-to-spring-boot` | core | R | R | - | R | V | M |
| `porting-and-configuration/constructor-injection-across-layers` | core | R | R | - | R | V | M |
| `porting-and-configuration/rest-design-recap` | reading | R | R | R | R | V | M |
| `porting-and-configuration/configuration-files-and-profiles` | core | R | R | - | R | V | M |
| `porting-and-configuration/secrets-from-the-environment` | core | R | R | - | R | V | M |
| `porting-and-configuration/schema-migrations-with-flyway` | core | R | R | - | R | V | M |
| `spring-data-jpa/spring-data-jpa-with-hibernate` | core | R | R | - | R | V | M |
| `spring-data-jpa/entities-and-ids` | core | R | R | - | R | V | M |
| `spring-data-jpa/repositories-derived-queries-and-at-query` | core | R | R | - | R | V | M |
| `spring-data-jpa/seeing-the-generated-sql` | core | R | R | - | R | V | M |
| `spring-data-jpa/controller-service-and-repository-layers` | core | R | R | - | R | V | B |
| `spring-data-jpa/dtos-and-mapping` | core | R | R | - | R | V | B |
| `spring-data-jpa/pagination-and-sorting` | core | R | R | - | R | V | B |
| `spring-data-jpa/api-layers-and-dtos-project` | lab-brief | R | R | - | - | - | P |
| `relationships-and-transactions/one-to-many-and-many-to-one-relationships` | core | R | R | - | R | V | M |
| `relationships-and-transactions/lazy-and-eager-loading` | core | R | R | - | R | V | M |
| `relationships-and-transactions/relationship-pitfalls` | core | R | R | - | R | V | M |
| `relationships-and-transactions/how-transactions-work-in-spring` | core | R | R | - | R | V | M |
| `relationships-and-transactions/the-n-1-query-problem-spotting-it-in-sql-logs` | core | R | R | - | R | V | M |
| `relationships-and-transactions/fixing-n-1-with-join-fetch` | core | R | R | - | R | V | M |
| `validation-errors-and-testing/bean-validation-on-requests` | core | R | R | - | R | V | M |
| `validation-errors-and-testing/global-error-handling` | core | R | R | - | R | V | M |
| `validation-errors-and-testing/standard-error-responses-with-problemdetail` | core | R | R | - | R | V | M |
| `validation-errors-and-testing/error-handling-project` | lab-brief | R | R | - | - | - | P |
| `validation-errors-and-testing/mockito-in-spring-at-mockitobean` | core | R | R | - | R | V | - |
| `validation-errors-and-testing/web-layer-tests-with-mockmvc` | core | R | R | - | R | V | - |
| `validation-errors-and-testing/debugging-a-failing-request` | core | R | R | - | R | V | - |
| `integration-and-observability/an-integration-test` | core | R | R | - | R | V | M |
| `integration-and-observability/calling-another-service-with-restclient-base-url-and-timeouts` | core | R | R | - | R | V | M |
| `integration-and-observability/logging-in-spring` | reading | R | R | R | R | V | M |
| `integration-and-observability/health-checks` | core | R | R | - | R | V | M |
| `api-security/session-cookies-vs-jwts-trade-offs` | reading | R | R | R | R | V | M |
| `api-security/password-hashing` | core | R | R | - | R | V | M |
| `api-security/issuing-and-checking-a-jwt` | core | R | R | - | R | V | M |
| `api-security/role-protected-endpoints` | core | R | R | - | R | V | M |
| `api-security/a-dev-profile-that-keeps-endpoints-open-during-front-end-work` | core | R | R | - | R | V | M |
| `api-security/common-api-security-risks-owasp` | reading | R | R | R | R | V | M |
| `api-security/api-security-project` | lab-brief | R | R | - | - | - | P |
| `api-security/spring-review-layers-data-access-errors-testing-security` | review | R | R | - | - | - | - |

Terminal interaction: pages whose simulators show terminal commands (`generating-a-spring-boot-project-and-its-structure`, `rest-controllers` with `curl`, `how-auto-configuration-works` with `--debug`, `seeing-the-generated-sql`, `secrets-from-the-environment` with environment variables, and the briefs' run steps) reuse `components/terminal` version 1 unchanged and declare `"components": {"terminal": "1"}` in their module PR (T24 drift check). Its form-free direct Run/Enter dispatch is the canonical terminal foundation for every track; it is not redesigned here. Intake `components` stay empty because no page exists yet.

## Lab plan

No lab uses Docker, Podman, Compose, Testcontainers or any other learner-side container engine. Each lab has exactly one language-native test command, `mvn -q -o test` (JUnit via Maven Surefire), offline after the one-time online `mvn dependency:go-offline`, on macOS, Linux and Windows, with JDK 25 and Maven from Java Foundations. Datastore: embedded in-memory H2 only, created and dropped by the tests; `lab.json` declares the `target/` build directory for cleanup. The plan's alternative of a learner-local PostgreSQL (plan section 6.3) is not needed: no lab objective depends on PostgreSQL-specific behavior, and H2 differences (for example dialect-specific SQL in the log) are disclosed in each lab README.

| Lab | Scope | Calendar day | Covers | Test command | Track | Status |
|---|---|---|---|---|---|---|
| `spring-boot/porting-and-configuration/coding-lab` | module | S3-S4 (Lab) | port the Java Foundations Javalin app; constructor injection; profiles; environment secrets; Flyway on H2 | `mvn -q -o test` | Standard lab overlay | planned |
| `spring-boot/spring-data-jpa/coding-lab` | module | S5 (Lab) | entities, IDs, repositories, derived queries, `@Query`, SQL log | `mvn -q -o test` | Standard lab overlay | planned |
| `spring-boot/relationships-and-transactions/coding-lab` | module | S7-S8 (Lab) | relationships, fetch types, pitfalls, transactions, N+1 detection with Hibernate statistics and `JOIN FETCH` | `mvn -q -o test` | Standard lab overlay | planned |
| `spring-boot/validation-errors-and-testing/coding-lab` | module | S9 (Lab, **requiredLab**) | Bean Validation, global handler, ProblemDetail, checked by MockMvc tests | `mvn -q -o test` | Standard lab overlay (required) | planned |
| `spring-boot/integration-and-observability/coding-lab` | module | S11 (Lab) | `@SpringBootTest` integration test, `RestClient` with `MockRestServiceServer`, logging levels, Actuator health | `mvn -q -o test` | Standard lab overlay | planned |
| `spring-boot/api-security/coding-lab` | module | S12 (Lab, **requiredLab**) | password hashing, JWT issue and validation with a key from the environment and a fixed `Clock`, role rules, dev profile, Spring Security MockMvc tests | `mvn -q -o test` | Standard lab overlay (required) | planned |
| brief `coding-lab/` in `api-layers-and-dtos-project`, `error-handling-project`, `api-security-project` | topic (project brief) | S6, FT5, FT7 | see Project-artifact plan | `mvn -q -o test` | both tracks, presented as a project | planned |

S9 and S12 carry the calendar's `requiredLab: true` and are the two required Standard coding labs. The other Standard Lab days (S3, S4, S5, S7, S8, S11) carry the matrix `lab-overlay` scope with the same Lab template "Guided lab" block, so they get planned module labs too. Fast skips every module lab: FT5 and FT7 are Project implementation, and the other Fast days run project increments.

Every lab: pinned Spring Boot 4.1.x parent (4.1.1 at intake) and plugin versions recorded in `lab.json`; fixed fixtures; no wall clock, network or locale dependence; the starter fails named public tests with stable messages; no reference solution, hidden test or key is committed; the solved-run gate runs locally against uncommitted private staging (`authoring/docs/lab-contract.md` section 8). Module labs are authored in their module PRs and recorded in `module.json` `moduleLabs` then.

No lab, with reason: `spring-boot-basics` (S1-S2 Concept days, no lab overlay in the confirmed scope; page simulators carry practice and the S3-S4 lab applies the skills); the S10 Concept-day topics (no lab overlay; the S9 lab's MockMvc tests are read and run there); the review (the S13 "Practice without AI" platform block). No course lab; `courseLabs` is empty (the Fast increment package slot is an open item above).

## Minute budgets

Rule: the revised new-course budget rule merged on `main` (`authoring/docs/tools/validators.md`, Reading time): each integer topic budget is at least `ceil(max(estimator P50, modeledWorstPath))`, at most 15, never a weighted share of a day pool, and the budgets mapped to a calendar day must fit that day type's complete block total (120 minutes for every Spring day type).

Basis at intake: no `artifact.html` exists, so the estimator cannot run. Each topic records an intake planning model in `minutes.basis`: `modeledP50` is the target page time (core 9, Reading 6, review 9 minutes), `modeledWorstPath` adds 2.5 minutes for the worst required route (two wrong graded attempts and wrong-first explores per interactive unit; course-1 measured gaps of 2.41-2.65 minutes above P50), and `budget = aboutLabel = ceil(max(modeledP50, modeledWorstPath))`. Project briefs carry 5 minutes with 0/0 modeled values (not measured), as in `java-foundations`; build time is project time inside the calendar block, not page time. The module PR replaces `modeledP50` with the frozen estimator P50 on the authored bytes, re-models the worst path and keeps the budget at or above the rule's minimum; T14 then checks day totals.

| Topic | Days | modeledP50 | modeledWorstPath | budget = aboutLabel |
|---|---|---|---|---|
| `spring-vs-spring-boot-what-boot-adds` | S1, FT1 | 9 | 11.5 | 12 |
| `generating-a-spring-boot-project-and-its-structure` | S1, FT1 | 9 | 11.5 | 12 |
| `dependency-injection-replacing-manual-wiring` | S1, FT1 | 9 | 11.5 | 12 |
| `beans-and-bean-scopes` | S1, FT1 | 9 | 11.5 | 12 |
| `how-auto-configuration-works` | S1, FT1 | 6 | 8.5 | 9 |
| `rest-controllers` | S2, FT1 | 9 | 11.5 | 12 |
| `path-query-and-body-parameters` | S2, FT2 | 9 | 11.5 | 12 |
| `response-codes-with-responseentity` | S2, FT2 | 9 | 11.5 | 12 |
| `reading-an-openapi-spec-and-exploring-it-in-swagger-ui` | S2, FT2 | 9 | 11.5 | 12 |
| `porting-a-javalin-route-service-and-repository-to-spring-boot` | S3, FT2 | 9 | 11.5 | 12 |
| `constructor-injection-across-layers` | S3 | 9 | 11.5 | 12 |
| `rest-design-recap` | S3, FT2 | 6 | 8.5 | 9 |
| `configuration-files-and-profiles` | S4, FT2 | 9 | 11.5 | 12 |
| `secrets-from-the-environment` | S4, FT2 | 9 | 11.5 | 12 |
| `schema-migrations-with-flyway` | S4, FT4 | 9 | 11.5 | 12 |
| `spring-data-jpa-with-hibernate` | S5, FT3 | 9 | 11.5 | 12 |
| `entities-and-ids` | S5, FT3 | 9 | 11.5 | 12 |
| `repositories-derived-queries-and-at-query` | S5, FT3 | 9 | 11.5 | 12 |
| `seeing-the-generated-sql` | S5, FT3 | 9 | 11.5 | 12 |
| `controller-service-and-repository-layers` | S6, FT4 | 9 | 11.5 | 12 |
| `dtos-and-mapping` | S6, FT4 | 9 | 11.5 | 12 |
| `pagination-and-sorting` | S6, FT4 | 9 | 11.5 | 12 |
| `api-layers-and-dtos-project` | S6 | 0 | 0 | 5 |
| `one-to-many-and-many-to-one-relationships` | S7, FT6 | 9 | 11.5 | 12 |
| `lazy-and-eager-loading` | S7, FT6 | 9 | 11.5 | 12 |
| `relationship-pitfalls` | S7, FT3 | 9 | 11.5 | 12 |
| `how-transactions-work-in-spring` | S8, FT6 | 9 | 11.5 | 12 |
| `the-n-1-query-problem-spotting-it-in-sql-logs` | S8, FT6 | 9 | 11.5 | 12 |
| `fixing-n-1-with-join-fetch` | S8, FT6 | 9 | 11.5 | 12 |
| `bean-validation-on-requests` | S9, FT5 | 9 | 11.5 | 12 |
| `global-error-handling` | S9, FT5 | 9 | 11.5 | 12 |
| `standard-error-responses-with-problemdetail` | S9, FT5 | 9 | 11.5 | 12 |
| `error-handling-project` | FT5 | 0 | 0 | 5 |
| `mockito-in-spring-at-mockitobean` | S10, FT6 | 9 | 11.5 | 12 |
| `web-layer-tests-with-mockmvc` | S10, FT4 | 9 | 11.5 | 12 |
| `debugging-a-failing-request` | S10, FT6 | 9 | 11.5 | 12 |
| `an-integration-test` | S11, FT8 | 9 | 11.5 | 12 |
| `calling-another-service-with-restclient-base-url-and-timeouts` | S11, FT8 | 9 | 11.5 | 12 |
| `logging-in-spring` | S11, FT5 | 6 | 8.5 | 9 |
| `health-checks` | S11 | 9 | 11.5 | 12 |
| `session-cookies-vs-jwts-trade-offs` | S12, FT7 | 6 | 8.5 | 9 |
| `password-hashing` | S12, FT7 | 9 | 11.5 | 12 |
| `issuing-and-checking-a-jwt` | S12, FT7 | 9 | 11.5 | 12 |
| `role-protected-endpoints` | S12, FT7 | 9 | 11.5 | 12 |
| `a-dev-profile-that-keeps-endpoints-open-during-front-end-work` | S12, FT7 | 9 | 11.5 | 12 |
| `common-api-security-risks-owasp` | S12, FT7 | 6 | 8.5 | 9 |
| `api-security-project` | FT7 | 0 | 0 | 5 |
| `spring-review-layers-data-access-errors-testing-security` | S13, FT8 | 9 | 11.5 | 12 |

Day totals of planned budgets against the 120-minute day: S1 57, S2 48, S3 33, S4 36, S5 48, S6 41, S7 36, S8 36, S9 36, S10 36, S11 45, S12 66, S13 12, FT1 69, FT2 81, FT3 60, FT4 60, FT5 50, FT6 84, FT7 71, FT8 36.

FT6 (7 pages, 84) and FT2 (7 pages, 81) are T14's binding constraints, with 36 and 39 minutes of headroom; no day overflows. If measured honest minimums overflow, T14 reports it and the overflow needs an explicit pacing decision outside the gate; budgets are never compressed. T14's page-budget sum is not the Fast learner's route: the required Fast route is the six fixed blocks, with page roles as in Fast route roles above.

## Spring Boot module check blueprint

`spring-boot/assessments/spring-boot-module-check/blueprint.json`, one course-level blueprint whose identity and objective pool are shared by Standard S13 and Fast FT8, and whose timing is scoped to S13. It holds only identity, objective references, format assignment, item counts, the Standard schedule, environment requirements and general learner instructions (reconciliation spring-sme-001): no item, task prompt, expected outcome, test, key, rubric, scoring guide or solution, here or in the blueprint.

- Calendar identity copied verbatim from the snapshot `assessment` of both S13 and FT8 (identical): `kind` `moduleCheck`, `formats` `MCQ` and `coding`, `passMark` 70. The calendar gives no weights or cut scores, so `weights` is empty. `dayId` is `S13`, the Standard Review day whose "Module check" block (MCQ + coding assessment, 45 minutes) sets the duration; the schema holds one day id.
- Standard schedule (S13 only; reconciliation spring-intake-edu-005): MCQ 16 items in 16 minutes, then an explicit 4-minute transition to open the provided Maven project and run `mvn -q -o test` once, then the coding part of 2 items in 25 minutes; `durationMinutes` 45. The item count was reduced from 20 to 16 to reserve the transition and test-run time; the split is this intake's proposal, as the calendar gives only the block total.
- Objectives: 20 exact `spring-boot/<module>/<topic>#<objective-id>` references with `objectiveFormats` (16 MCQ, 4 coding), one per sampled topic, all from topics that both tracks study. Excluded: the Standard-only `constructor-injection-across-layers` and `health-checks`, the review page and the project briefs (checked by their own public tests). A 45-minute check cannot sample all 42 shared topics; the other 22 are checked by their practice quizzes, labs and project tests.

  | Module | Sampled topic: objective (format) |
  |---|---|
  | spring-boot-basics | `spring-vs-spring-boot-what-boot-adds` o1, `dependency-injection-replacing-manual-wiring` o2, `path-query-and-body-parameters` o2, `response-codes-with-responseentity` o2 (MCQ) |
  | porting-and-configuration | `configuration-files-and-profiles` o3, `secrets-from-the-environment` o1, `schema-migrations-with-flyway` o2 (MCQ) |
  | spring-data-jpa | `entities-and-ids` o3 (MCQ); `repositories-derived-queries-and-at-query` o2, `dtos-and-mapping` o2 (coding) |
  | relationships-and-transactions | `one-to-many-and-many-to-one-relationships` o2, `how-transactions-work-in-spring` o2, `the-n-1-query-problem-spotting-it-in-sql-logs` o2, `fixing-n-1-with-join-fetch` o1 (MCQ) |
  | validation-errors-and-testing | `mockito-in-spring-at-mockitobean` o3 (MCQ); `bean-validation-on-requests` o1, `standard-error-responses-with-problemdetail` o1 (coding) |
  | integration-and-observability | `calling-another-service-with-restclient-base-url-and-timeouts` o2 (MCQ) |
  | api-security | `role-protected-endpoints` o2, `common-api-security-risks-owasp` o2 (MCQ) |

- Allowed resources: the frozen calendar states no resource rule for the S13 "Module check" block, so any rule is set and shown by the platform assessment owner; the repository invents no assessment policy. Environment: JDK 25, Maven and the Spring Boot 4.1 dependencies cached so `mvn -q -o test` runs offline, provided or named by the platform owner; embedded H2 only, no container engine, network or AI service.
- Open item (module authoring and the assessment owner): pilot the complete Standard route — quiz, transition, project open, test runs and both coding items — against the 45 minutes before release; the authored items stay in platform-only staging.
- **Open pacing item for the track-overlay task (recorded, not solved):** the Fast day type has no 45-minute "Module check" block (Warm-up 5, Skim 10, Try-first diagnostic 15, Project 70, Timed without AI 15, Reflection 5 already total 120), yet FT8 carries the same `moduleCheck`. FT8 timing and placement are unresolved; the learner instructions state the Standard schedule only and tell Fast learners the platform shows FT8's timing.
- Gates T01 and T07 check the blueprint's key names.

## Official sources per topic

Closes `source-gap-spring-boot-official-evidence` (category A, sequenced to this intake). On 2026-10-13 this intake fetched 115 live first-party sources: the Spring Boot reference (docs.spring.io serving Spring Boot 4.1.1, the current GA per Maven Central metadata; 4.2.0 milestones are not used), its managed dependency coordinates (Hibernate ORM 7.4.5, Flyway 12.4.0, Spring Security 7.1.1, Jakarta Validation 3.1.1, Jakarta Persistence 3.2.0, JUnit 6.0.3, Mockito 5.23.0), Spring Framework, Spring Data JPA and Commons, Spring Security, Spring guides and Initializr, Hibernate ORM 7.4 guides, Jakarta Persistence 3.2, Validation 3.1 and Dependency Injection 2.0 specification pages, Redgate Flyway, H2, springdoc-openapi, the OpenAPI Specification (swagger.io serving 3.2; spec.openapis.org 3.1.1), Swagger UI, RFCs 9457, 9110, 7519, 6750 and 6265, the OWASP API Security Top 10 2023 and OWASP cheat sheets, JUnit, Mockito, Maven and Javalin. `authoring/evidence/spring-boot/source-snapshot.json` records each final URL (after redirects), retrieval time, sha256 of the fetched bytes and the topics and sections it supports. Raw fetched pages are not committed.

Gaps and substitutions, recorded honestly: on the first pass seven URLs returned HTTP 404 and were not used — a non-existent Spring Framework `mvc-controller/ann-rest-exceptions.html` path (the live `webmvc/mvc-ann-rest-exceptions.html` is used), a non-existent Spring Data `repositories/query-methods.html` (the live `query-methods-details.html` and `jpa/query-methods.html` are used), three Jakarta specification document paths (the live specification landing pages for the same versions are used), an outdated Redgate Flyway migrations page id (the live "Migrations" page is used) and OWASP's former `JSON_Web_Token_for_Java_Cheat_Sheet` (the live `JSON_Web_Token_Cheat_Sheet` is used). Each replacement is the same publisher's current page for the same subject; all 115 frozen sources returned HTTP 200. No source is unreachable.

Dynamic bytes and canonical hashes (reconciliation spring-sme-006-dynamic-source-hash): a second fetch of all 115 sources on 2026-10-13 returned different raw bytes for 7 pages because of per-request ids or timestamps (Cloudflare or CDN tails): the OWASP API Security home, Spring Boot Actuator endpoints and Common Application Properties, Spring Security Method Security, and the three Hibernate 7.4 guides. For each, `sectionsUsed` also records a canonical text sha256 under method canonical-text-v1 (drop `script`, `style`, `noscript` and `template` elements and HTML comments, strip tags, unescape entities, collapse whitespace, hash the UTF-8 text); the canonical hash was equal across both fetches. The raw sha256 stays recorded with the URL and retrieval time. Versioned documentation URLs were preferred where served: docs.spring.io's version-pinned paths (for example `/spring-boot/4.1.1/...`, `/spring-framework/reference/7.0/...`) redirect to the unversioned pages, which serve Spring Boot 4.1.1 (`data-version="4.1.1"`), so the final URLs are recorded; Hibernate uses its versioned `/orm/7.4/` path.

Notes for authors and SME critics:

- Version facts the module PRs must respect (from the frozen sources): Spring Boot 4.1.1 requires at least Java 17 and is compatible with versions up to and including Java 26, and requires Spring Framework 7.0.9 or above, so JDK 25 from Java Foundations is supported; bean overriding in tests uses Spring Framework's `@MockitoBean` and `@MockitoSpyBean`; MockMvc offers a fluent AssertJ API through `MockMvcTester`; Hibernate ORM is 7.4 and Jakarta Persistence 3.2.
- springdoc-openapi is the springdoc project's own documentation (third-party to Spring); the module PR confirms its Spring Boot 4.1 compatibility and pins its version.
- Freshness: every `topic.json` records `unverified` with no `checkedAt`, because no page is authored yet; module PR SME criticism verifies the authored bytes against live sources and writes per-topic `sources.json` receipts.

| Topic | Official first-party sources (frozen in source-snapshot.json) |
|---|---|
| `spring-vs-spring-boot-what-boot-adds` | https://spring.io/projects/spring-boot/<br>https://docs.spring.io/spring-boot/index.html<br>https://docs.spring.io/spring-boot/system-requirements.html<br>https://docs.spring.io/spring-framework/reference/core/beans/introduction.html<br>https://docs.spring.io/spring-boot/maven-plugin/index.html<br>https://docs.spring.io/spring-boot/reference/features/spring-application.html |
| `generating-a-spring-boot-project-and-its-structure` | https://docs.spring.io/spring-boot/tutorial/first-application/index.html<br>https://docs.spring.io/spring-boot/reference/using/build-systems.html<br>https://docs.spring.io/spring-boot/reference/using/structuring-your-code.html<br>https://docs.spring.io/spring-boot/reference/using/using-the-springbootapplication-annotation.html<br>https://docs.spring.io/spring-boot/reference/using/running-your-application.html<br>https://start.spring.io/<br>https://docs.spring.io/initializr/docs/current/reference/html/<br>https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html<br>https://docs.spring.io/spring-boot/maven-plugin/index.html |
| `dependency-injection-replacing-manual-wiring` | https://docs.spring.io/spring-boot/reference/using/spring-beans-and-dependency-injection.html<br>https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html<br>https://docs.spring.io/spring-framework/reference/core/beans/classpath-scanning.html<br>https://docs.spring.io/spring-framework/reference/core/beans/basics.html<br>https://jakarta.ee/specifications/dependency-injection/2.0/ |
| `beans-and-bean-scopes` | https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html<br>https://docs.spring.io/spring-framework/reference/core/beans/classpath-scanning.html<br>https://docs.spring.io/spring-framework/reference/core/beans/java/bean-annotation.html<br>https://docs.spring.io/spring-framework/reference/core/beans/basics.html |
| `how-auto-configuration-works` | https://docs.spring.io/spring-boot/reference/using/auto-configuration.html<br>https://docs.spring.io/spring-boot/reference/using/using-the-springbootapplication-annotation.html<br>https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html<br>https://docs.spring.io/spring-boot/reference/features/spring-application.html |
| `rest-controllers` | https://spring.io/guides/gs/rest-service/<br>https://docs.spring.io/spring-boot/reference/web/servlet.html<br>https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html<br>https://javalin.io/documentation<br>https://docs.spring.io/spring-boot/reference/features/json.html |
| `path-query-and-body-parameters` | https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html<br>https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestparam.html<br>https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestbody.html<br>https://www.rfc-editor.org/rfc/rfc9110.html |
| `response-codes-with-responseentity` | https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html<br>https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/responseentity.html<br>https://www.rfc-editor.org/rfc/rfc9110.html |
| `reading-an-openapi-spec-and-exploring-it-in-swagger-ui` | https://springdoc.org/<br>https://swagger.io/specification/<br>https://spec.openapis.org/oas/v3.1.1.html<br>https://swagger.io/open-source/swagger-ui/ |
| `porting-a-javalin-route-service-and-repository-to-spring-boot` | https://spring.io/guides/gs/rest-service/<br>https://docs.spring.io/spring-boot/reference/web/servlet.html<br>https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html<br>https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html<br>https://javalin.io/documentation |
| `constructor-injection-across-layers` | https://docs.spring.io/spring-boot/reference/using/spring-beans-and-dependency-injection.html<br>https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html<br>https://docs.spring.io/spring-framework/reference/core/beans/classpath-scanning.html |
| `rest-design-recap` | https://spring.io/guides/gs/rest-service/<br>https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html<br>https://www.rfc-editor.org/rfc/rfc9110.html |
| `configuration-files-and-profiles` | https://docs.spring.io/spring-boot/reference/features/external-config.html<br>https://docs.spring.io/spring-boot/reference/features/profiles.html<br>https://docs.spring.io/spring-boot/appendix/application-properties/index.html |
| `secrets-from-the-environment` | https://docs.spring.io/spring-boot/reference/features/external-config.html<br>https://docs.spring.io/spring-boot/reference/features/logging.html<br>https://docs.spring.io/spring-boot/appendix/application-properties/index.html |
| `schema-migrations-with-flyway` | https://docs.spring.io/spring-boot/reference/data/sql.html<br>https://docs.spring.io/spring-boot/how-to/data-initialization.html<br>https://documentation.red-gate.com/fd/<br>https://documentation.red-gate.com/fd/quickstart-how-flyway-works-184127223.html<br>https://documentation.red-gate.com/fd/migrations-271585107.html |
| `spring-data-jpa-with-hibernate` | https://spring.io/projects/spring-data-jpa/<br>https://docs.spring.io/spring-boot/reference/data/sql.html<br>https://docs.spring.io/spring-data/jpa/reference/index.html<br>https://docs.spring.io/spring-data/jpa/reference/jpa/getting-started.html<br>https://www.h2database.com/html/main.html<br>https://jakarta.ee/specifications/persistence/3.2/<br>https://docs.hibernate.org/orm/7.4/introduction/html_single/ |
| `entities-and-ids` | https://docs.spring.io/spring-data/jpa/reference/jpa/entity-persistence.html<br>https://jakarta.ee/specifications/persistence/3.2/<br>https://docs.hibernate.org/orm/7.4/introduction/html_single/<br>https://docs.hibernate.org/orm/7.4/userguide/html_single/ |
| `repositories-derived-queries-and-at-query` | https://docs.spring.io/spring-data/jpa/reference/repositories/core-concepts.html<br>https://docs.spring.io/spring-data/jpa/reference/repositories/query-methods-details.html<br>https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html<br>https://docs.spring.io/spring-data/commons/reference/repositories/core-concepts.html<br>https://docs.hibernate.org/orm/7.4/querylanguage/html_single/ |
| `seeing-the-generated-sql` | https://docs.spring.io/spring-boot/reference/features/logging.html<br>https://docs.spring.io/spring-boot/reference/data/sql.html<br>https://docs.hibernate.org/orm/7.4/introduction/html_single/<br>https://docs.hibernate.org/orm/7.4/userguide/html_single/ |
| `controller-service-and-repository-layers` | https://spring.io/guides/gs/rest-service/<br>https://docs.spring.io/spring-boot/reference/using/structuring-your-code.html<br>https://docs.spring.io/spring-framework/reference/core/beans/classpath-scanning.html |
| `dtos-and-mapping` | https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestbody.html<br>https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html<br>https://docs.spring.io/spring-boot/reference/features/json.html |
| `pagination-and-sorting` | https://docs.spring.io/spring-data/jpa/reference/repositories/core-concepts.html<br>https://docs.spring.io/spring-data/jpa/reference/repositories/query-methods-details.html<br>https://docs.spring.io/spring-data/jpa/reference/repositories/core-extensions.html |
| `api-layers-and-dtos-project` | (project brief: uses the sources of its prerequisite and own-row topics) |
| `one-to-many-and-many-to-one-relationships` | https://jakarta.ee/specifications/persistence/3.2/<br>https://docs.hibernate.org/orm/7.4/introduction/html_single/<br>https://docs.hibernate.org/orm/7.4/userguide/html_single/ |
| `lazy-and-eager-loading` | https://jakarta.ee/specifications/persistence/3.2/<br>https://docs.hibernate.org/orm/7.4/introduction/html_single/<br>https://docs.hibernate.org/orm/7.4/userguide/html_single/ |
| `relationship-pitfalls` | https://jakarta.ee/specifications/persistence/3.2/<br>https://docs.hibernate.org/orm/7.4/introduction/html_single/<br>https://docs.hibernate.org/orm/7.4/userguide/html_single/ |
| `how-transactions-work-in-spring` | https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html<br>https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html<br>https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-decl-explained.html<br>https://docs.spring.io/spring-data/jpa/reference/jpa/transactions.html |
| `the-n-1-query-problem-spotting-it-in-sql-logs` | https://docs.spring.io/spring-boot/reference/features/logging.html<br>https://docs.hibernate.org/orm/7.4/introduction/html_single/<br>https://docs.hibernate.org/orm/7.4/userguide/html_single/ |
| `fixing-n-1-with-join-fetch` | https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html<br>https://docs.hibernate.org/orm/7.4/introduction/html_single/<br>https://docs.hibernate.org/orm/7.4/querylanguage/html_single/ |
| `bean-validation-on-requests` | https://docs.spring.io/spring-boot/reference/io/validation.html<br>https://docs.spring.io/spring-framework/reference/core/validation/beanvalidation.html<br>https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-validation.html<br>https://jakarta.ee/specifications/bean-validation/3.1/ |
| `global-error-handling` | https://docs.spring.io/spring-boot/reference/web/servlet.html<br>https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-advice.html<br>https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-exceptionhandler.html |
| `standard-error-responses-with-problemdetail` | https://docs.spring.io/spring-boot/reference/web/servlet.html<br>https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html<br>https://www.rfc-editor.org/rfc/rfc9457.html |
| `error-handling-project` | (project brief: uses the sources of its prerequisite and own-row topics) |
| `mockito-in-spring-at-mockitobean` | https://docs.spring.io/spring-boot/reference/testing/index.html<br>https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html<br>https://docs.spring.io/spring-framework/reference/testing/annotations/integration-spring/annotation-mockitobean.html<br>https://javadoc.io/doc/org.mockito/mockito-core/5.24.0/index.html |
| `web-layer-tests-with-mockmvc` | https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html<br>https://docs.spring.io/spring-framework/reference/testing/mockmvc.html<br>https://docs.spring.io/spring-framework/reference/testing/mockmvc/assertj.html |
| `debugging-a-failing-request` | https://docs.spring.io/spring-boot/reference/features/logging.html<br>https://docs.spring.io/spring-boot/reference/web/servlet.html<br>https://docs.spring.io/spring-framework/reference/testing/mockmvc.html<br>https://www.rfc-editor.org/rfc/rfc9110.html |
| `an-integration-test` | https://docs.spring.io/spring-boot/reference/testing/index.html<br>https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html<br>https://docs.spring.io/spring-framework/reference/testing/mockmvc.html<br>https://www.h2database.com/html/main.html |
| `calling-another-service-with-restclient-base-url-and-timeouts` | https://docs.spring.io/spring-boot/reference/features/external-config.html<br>https://docs.spring.io/spring-boot/reference/io/rest-client.html<br>https://docs.spring.io/spring-framework/reference/testing/spring-mvc-test-client.html<br>https://docs.spring.io/spring-framework/reference/integration/rest-clients.html |
| `logging-in-spring` | https://docs.spring.io/spring-boot/reference/features/logging.html<br>https://docs.spring.io/spring-boot/appendix/application-properties/index.html |
| `health-checks` | https://docs.spring.io/spring-boot/reference/actuator/endpoints.html<br>https://docs.spring.io/spring-boot/reference/actuator/enabling.html |
| `session-cookies-vs-jwts-trade-offs` | https://docs.spring.io/spring-security/reference/servlet/authentication/session-management.html<br>https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html<br>https://www.rfc-editor.org/rfc/rfc7519.html<br>https://www.rfc-editor.org/rfc/rfc6750.html<br>https://www.rfc-editor.org/rfc/rfc6265.html<br>https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html<br>https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html |
| `password-hashing` | https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/password-encoder.html<br>https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html<br>https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html |
| `issuing-and-checking-a-jwt` | https://docs.spring.io/spring-boot/reference/web/spring-security.html<br>https://docs.spring.io/spring-security/reference/servlet/architecture.html<br>https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html<br>https://www.rfc-editor.org/rfc/rfc7519.html<br>https://www.rfc-editor.org/rfc/rfc6750.html<br>https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html |
| `role-protected-endpoints` | https://docs.spring.io/spring-security/reference/servlet/architecture.html<br>https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html<br>https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html<br>https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/index.html |
| `a-dev-profile-that-keeps-endpoints-open-during-front-end-work` | https://docs.spring.io/spring-boot/reference/features/profiles.html<br>https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html<br>https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html |
| `common-api-security-risks-owasp` | https://api-security.owasp.org/<br>https://api-security.owasp.org/editions/2023/en/0x11-t10/ |
| `api-security-project` | (project brief: uses the sources of its prerequisite and own-row topics) |
| `spring-review-layers-data-access-errors-testing-security` | https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html<br>https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html<br>https://docs.spring.io/spring-framework/reference/testing/mockmvc.html<br>https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html<br>https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html<br>https://api-security.owasp.org/editions/2023/en/0x11-t10/ |

Calendar references for the `spring` technology: [Spring guides](https://spring.io/guides), [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service), [Spring Data JPA](https://spring.io/projects/spring-data-jpa), [OWASP API Security](https://owasp.org/API-Security/) — all four are in the snapshot at their final URLs.

## Category-A records closed by this intake

| Record | Resolution |
|---|---|
| `source-gap-spring-boot-modules` | Module grouping chosen and recorded above as a second-mate grouping decision, not syllabus: seven modules by calendar day sequence. Pending approval at merge. |
| `source-gap-spring-boot-official-evidence` | 115 live first-party sources fetched and frozen with sha256 and retrieval times in `authoring/evidence/spring-boot/source-snapshot.json`; no unreachable source. |
| `conflict-ft5-lab-label` (already resolved by the approved track model) | Applied: FT5 and FT7 are Project implementation with project briefs, no Fast coding lab; the snapshot is unchanged. |

## Open items

For the track-overlay task (`pep-t1-track-overlays`):

- FT8 module-check timing and placement on the Fast template (see blueprint section).
- The machine-readable package or overlay manifest for the Fast cumulative project, with lock, schema and check binding (the increment binding table above is the intake's record).
- Fast rows placed out of Standard order (FT3 row 4, FT4 rows 3-4, FT5 row 3, FT6 rows 5-6): handled by the Fast-order prerequisites table and self-contained early uses; the overlay records emphasis and places the deferred FT3 skim-page quiz on FT6.

For module authoring (release checks, not decided here):

- Pilot S6 (teach 36 + build 44), FT5 (40 + 45) and FT7 (52 + 33) against their blocks; FT7 is the tightest.
- Pilot each Fast increment against its 70 minutes.
- Prove the per-increment Surefire selector and run a Windows command-line smoke run.
- Pilot the full S13 module-check route against 45 minutes.

## Intake criticism

Fresh independent educational and technology-SME critics reviewed the first intake commit (`b716235`). Their reports and the non-author reconciliation are committed unchanged as `intake-critic-education.json`, `intake-critic-sme.json` and `intake-reconciliation.json`. Outcome: all 12 findings accepted (4 high, 7 medium, 1 low) and applied in one correction loop within the scope limits in each rationale (no tooling or schema change; the machine-readable Fast package binding is deferred to the track-overlay task):

- spring-intake-edu-001: true prerequisites only, met earlier on both tracks; a verifiable Fast-order prerequisites table; self-contained FT3 and FT4 early uses (MockMvc objective o2 now uses a test-configuration fake).
- spring-intake-edu-002: S6, FT5 and FT7 now teach their rows through the pages and checks before the scaffold is opened; the build is transfer and feedback.
- spring-intake-edu-003 and spring-sme-006-fast-increments-unbound: the increment binding table.
- spring-intake-edu-004: `common-api-security-risks-owasp` o1 narrowed to API1, API2 and API5.
- spring-intake-edu-005: 16 MCQ items with an explicit 4-minute transition; full-route pilot recorded as an open item.
- spring-sme-001: task prompts and task-specific outcomes removed from the blueprint and this intake.
- spring-sme-002: the FT5 logging action removed; logging stays skim/reference.
- spring-sme-003: `health-checks` o1 makes component visibility explicit (defaults to never).
- spring-sme-004: `spring-vs-spring-boot-what-boot-adds` o2 separates BOM or parent dependency management from starters.
- spring-sme-005: unquoted, shell-neutral per-increment selector and a Windows smoke-run release check.
- spring-sme-006-dynamic-source-hash: canonical text hashes for the 7 dynamic sources; versioned-URL handling recorded.

The high findings await the critics' focused rechecks on the corrected bytes.
