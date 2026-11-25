# Optional video curation: Spring Boot

Course `spring-boot`. Curated and checked on 2026-11-09 in response to the captain's request to curate videos that help course timing estimates.

## Status: screened shortlist, not approved learner companions

- **No video in this record was watched or listened to.** YouTube blocked transcripts, captions and playback for automated access during this check, so no video's spoken or on-screen content was reviewed.
- The evidence used (live playability, oEmbed embed status, page metadata, publisher descriptions and chapter markers, publisher companion repositories and articles, and current official docs for version compatibility) supports **metadata and segment-fit screening only**. It is not a complete content review.
- This is an initial partial shortlist and a knowledge handoff for timing estimates. It does not approve any video as a learner companion. Each entry carries a screening status; entries marked unapproved are excluded from the minute totals.
- Every video here is an optional supplement: no learner page links to it, no learner path requires it, and its minutes are kept apart from required learner-path timing.

## Why a course-level record, and what learner integration still needs

- This record is a planning handoff, not a substitute for, or a way around, the learner-companion gates. Topic `video` status in `authoring/catalog/<course>/<module>/<topic>/topic.json` stays `absent` until a companion passes normal learner-companion integration: a `video-artifact.md` per topic, a `check-video.mjs` receipt, gate 13 (T17) and gate 18 critic coverage (T25).
- Gap in the current conventions for optional segments: `authoring/schemas/video-artifact.frontmatter.schema.json` (`additionalProperties: false`) has no segment fields; `parseVideoFrontmatter` in `authoring/tools/net/check-video.mjs` reads only flat `key: value` lines; T17 (`authoring/tools/checks/T17-video.mjs`) compares the receipt's full `runtimeSeconds` with `topic.minutes.budget`; and the contract in `authoring/docs/html-artifact-contract.md` (`video-artifact.md`) links one whole video per topic. A segment of a longer video therefore cannot be expressed, and its full runtime would fail the budget.
- Smallest legitimate follow-up: (1) a repository-tooling branch that adds optional scalar `segmentStartSeconds` and `segmentEndSeconds` front-matter fields to the schema and contract, and makes T17 check that the segment lies within the receipt's verified runtime and budget the segment length when present (the full-runtime check stays when absent); then (2) module branches that author per-topic `video-artifact.md` companions for approved entries, with receipts and independent critic review under T25.

## Verification method and limits

- Live public watch page, fetched 2026-11-09 with an anonymous client: `playabilityStatus` OK, `playableInEmbed` true, not unlisted, not private, runtime from `lengthSeconds`, publish date and channel name from the page, description and YouTube chapter markers from the page data.
- Link and embed behavior: the YouTube oEmbed endpoint returned HTTP 200 for every selected URL (the signal `authoring/tools/net/check-video.mjs` uses for embeddability). Every selection is reachable at its `https://www.youtube.com/watch?v=<id>` URL (page `playabilityStatus` OK); a segment start can be linked with `&t=<seconds>s`.
- Topic fit comes from the publisher's own description and chapters, plus the companion repository (`pom.xml` and source) or accompanying article the publisher links, fetched live where named. Search-result titles were used only to find candidates; a candidate with title-only evidence is rejected.
- Version compatibility: where the video or its companion predates the course's target versions, the assigned concept was checked against current official documentation for the target line (frozen course sources, rechecked live where stated). Each entry's status says whether it is version-matched, a legacy video with substantiated concept, or concept-only.
- Blocked on 2026-11-09: caption bodies came back empty, the transcript API returned HTTP 400 `FAILED_PRECONDITION`, playback failed in an automated browser, and page fetches were then rate-limited (HTTP 429). Claims below go no further than the description, chapters, companion material and docs.
- Segment bounds follow chapter markers. Where a chapter marker is not in the publisher's description it is marked as a YouTube chapter marker and may be auto-generated, so its bounds are approximate.
- Nothing was downloaded or redistributed; no account, subscription or paid service is needed to watch.

## Selected videos

### SB1. Build a Spring Boot 4 REST API in Minutes

- URL: https://www.youtube.com/watch?v=klnxzL8oQdM
- Publisher: Dan Vega (published 2025-12-18)
- Full runtime: 25:32 (1532 s)
- Assigned segment: 8:58-23:56 (YouTube chapter markers "Initializr configuration", "Creating the API", "Implementing features"); watch 14.97 min (898 s)
- Mapped topics: `spring-boot-basics/generating-a-spring-boot-project-and-its-structure` o1 (Initializr choices); `spring-boot-basics/rest-controllers` o1 (@RestController returning records as JSON); `spring-boot-basics/path-query-and-body-parameters` o1 in part (@PathVariable and @RequestBody; @RequestParam not shown in the companion code)
- Screening status: screened: version-matched
- Version fit: Companion repository named in the description, danvega/meetup: spring-boot-starter-parent 4.0.0, java.version 25, spring-boot-starter-webmvc. Course pins Spring Boot 4.1.1 and JDK 25; same major line.
- Target-version compatibility: Companion repo targets Spring Boot 4.0.0 / Java 25 (same major as the course pin 4.1.1).
- Content evidence: Publisher description (Spring Initializr, controllers, records, a working CRUD API); YouTube chapter markers; companion GroupController uses @RestController, @RequestMapping, @GetMapping, @PostMapping, @PutMapping, @DeleteMapping, @PathVariable, @RequestBody, a record, @ResponseStatus(CREATED / NO_CONTENT) and ResponseStatusException(NOT_FOUND).
- Cautions: Segment bounds come from YouTube chapter markers that are not in the publisher description (likely auto-generated), so they are approximate. Returns status codes with @ResponseStatus and ResponseStatusException, not ResponseEntity (taught in response-codes-with-responseentity). Shows IntelliJ IDEA; any editor works. In-memory list, no service or repository layer.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

### SB2. Spring Boot Tutorial: Resolving Bean Ambiguity Like a Pro

- URL: https://www.youtube.com/watch?v=jCjHAD94c8A
- Publisher: Dan Vega (published 2025-09-03)
- Full runtime: 16:52 (1012 s)
- Assigned segment: 1:04-8:56 (YouTube chapter markers "Defining payment beans", "Resolving bean ambiguity"); watch 7.87 min (472 s)
- Mapped topics: `spring-boot-basics/dependency-injection-replacing-manual-wiring` o2 (two beans match one injection point; @Qualifier)
- Screening status: screened: legacy video; assigned concept substantiated in current target-version docs
- Version fit: Companion repository danvega/qualified: spring-boot-starter-parent 3.5.5, java.version 24 (Spring Framework 6.2, which the description names). Qualifier resolution is unchanged in the course's Spring Framework 7 line, but the video is not Boot 4.
- Target-version compatibility: Spring Framework 7 reference "Fine-tuning Annotation-based Autowiring with Qualifiers" and "@Primary or @Fallback" (factory-collaborators.html, frozen course source retrieved 2026-10-13; rechecked live 2026-11-09).
- Content evidence: Publisher description lists @Qualifier, custom qualifier annotations and parameter-name resolution; companion code has two PaymentProcessor @Component beans and a constructor injection point with a custom qualifier annotation.
- Cautions: @Primary is not named in the description, so it is not claimed. Custom qualifier annotations go beyond the lesson. The later ObjectProvider and BeanFactory chapters (8:56 onward) are not assigned.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

### SB3. Spring Beans Showdown: Unraveling the Mystery of @Component vs @Bean!

- URL: https://www.youtube.com/watch?v=CWEQ-1vff1o
- Publisher: Dan Vega (published 2023-04-17)
- Full runtime: 18:18 (1098 s)
- Assigned segment: 7:22-15:06 (YouTube chapter markers "Using component annotations", "Specialized component types", "Using the bean annotation"); watch 7.73 min (464 s)
- Mapped topics: `spring-boot-basics/beans-and-bean-scopes` o1 (stereotype annotation versus @Bean method)
- Screening status: screened: legacy video; assigned concept substantiated in current target-version docs
- Version fit: Published 2023-04-17 (Spring Boot 3.0 era); no companion repository is linked, so the exact version is unverified. @Component, @Service and @Bean in @Configuration are unchanged in Spring Framework 7.
- Target-version compatibility: Spring Framework 7 reference: @Bean methods in @Configuration or @Component classes (java/bean-annotation.html) and classpath scanning of stereotypes (classpath-scanning.html), frozen course source retrieved 2026-10-13; bean-annotation page rechecked live 2026-11-09.
- Content evidence: Publisher title and description (key differences between @Component and @Bean, use cases); linked companion blog post; YouTube chapter markers.
- Cautions: Bean scopes (o2) and stateless singletons (o3) are not covered. Version not pinned by a repository.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

### SB4. Spring ResponseEntity -  How to customize the response in Spring Boot

- URL: https://www.youtube.com/watch?v=B5Zrn1Tzyqw
- Publisher: Dan Vega (published 2022-12-16)
- Full runtime: 11:24 (684 s)
- Assigned segment: 1:16-8:22 (YouTube chapter markers "What is a response entity" to "Customizing response headers"); watch 7.1 min (426 s)
- Mapped topics: `spring-boot-basics/response-codes-with-responseentity` o1 and o3 in part (status and headers set through ResponseEntity)
- Screening status: screened: legacy video; assigned concept substantiated in current target-version docs
- Version fit: Published 2022-12-16, after Spring Boot 3.0 GA; no companion repository, so the exact version is unverified. ResponseEntity's builder API is unchanged in Spring Framework 7.
- Target-version compatibility: Spring Framework 7.0.10 ResponseEntity javadoc (checked live 2026-11-09) lists ok(), created(URI), noContent(), notFound() and status(HttpStatusCode); responseentity.html is a frozen course source retrieved 2026-10-13.
- Content evidence: Publisher description (what ResponseEntity is and how to customize the response); YouTube chapter markers "When to use response entity" and "Customizing response headers".
- Cautions: 201 with a Location header, 204 and 404 are not confirmed by the evidence; the lesson's examples remain the reference. Opens with commentary on a social-media post (0:39-1:16), excluded from the segment.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

### SB5. Spring Boot 4: Why Flyway Silently Never Runs

- URL: https://www.youtube.com/watch?v=G4oiGPFD5iU
- Publisher: Dan Vega (published 2026-10-01)
- Full runtime: 0:49 (49 s)
- Assigned segment: full video (0:00-0:49); watch 0.82 min (49 s)
- Mapped topics: `porting-and-configuration/schema-migrations-with-flyway` o1 (Boot 4 applies migrations only with spring-boot-starter-flyway)
- Screening status: screened: version-matched
- Version fit: Spring Boot 4 specific, published 2026-10-01: the description states that in Boot 4 the Flyway dependency alone no longer triggers auto-configuration and spring-boot-starter-flyway is required. The course page uses spring-boot-starter-flyway.
- Target-version compatibility: Spring Boot 4 specific; matches the course page's spring-boot-starter-flyway.
- Content evidence: Publisher description states the claim in full; the same fix is a chaptered segment (11:30 "Break 3: Flyway never runs") of the publisher's Boot 3.5.16 to 4.1.1 migration video HiPkoGTeNJc.
- Cautions: A 49-second tip, not a Flyway tutorial: naming (V<version>__<description>.sql), checksums and ddl-auto (o1-o3) are not covered.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

### SB6. Ultimate Guide: Derived Queries with Spring Data JPA

- URL: https://www.youtube.com/watch?v=GVeY08vUiPE
- Publisher: Thorben Janssen (published 2019-07-25)
- Full runtime: 10:13 (613 s)
- Assigned segment: 1:28-3:41 (YouTube chapter markers "Derived Queries"); watch 2.22 min (133 s)
- Mapped topics: `spring-data-jpa/repositories-derived-queries-and-at-query` o2 (derived query methods from method names)
- Screening status: screened: legacy video; assigned concept substantiated in current target-version docs
- Version fit: Published 2019-07-25 (Spring Data JPA 2.x, javax.persistence era). Method-name query derivation keywords are unchanged in the course's Spring Data line; package names in any code shown are outdated.
- Target-version compatibility: Current Spring Data JPA reference (jpa/query-methods.html, frozen course source retrieved 2026-10-13; rechecked live 2026-11-09) lists the Containing and IgnoreCase keywords; the video's javax.persistence imports are legacy.
- Content evidence: Publisher description and YouTube chapter markers; accompanying article linked from the description.
- Cautions: Older javax-era code. JpaRepository CRUD (o1) and @Query (o3) are outside the segment.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

### SB7. Hibernate's Best Logging Configuration

- URL: https://www.youtube.com/watch?v=tsJRRzeC9ak
- Publisher: Thorben Janssen (published 2022-04-28)
- Full runtime: 10:53 (653 s)
- Assigned segment: 5:00-8:54 (YouTube chapter markers "Configuring SQL logging", "Development configuration"); watch 3.9 min (234 s)
- Mapped topics: `spring-data-jpa/seeing-the-generated-sql` o1 (SQL and bind-parameter logging categories); `relationships-and-transactions/the-n-1-query-problem-spotting-it-in-sql-logs` o2 in part (statistics logging to count queries)
- Screening status: screened: concept-only (segment shows legacy API or configuration)
- Version fit: Published 2022-04-28; the description says the configuration depends on the Hibernate version (5 versus 6). The course uses Hibernate ORM 7.4, which keeps the Hibernate 6 org.hibernate.SQL category; the course page's property names are the reference.
- Target-version compatibility: Hibernate ORM 7.4 Introduction (checked live 2026-11-09) names org.hibernate.SQL and org.hibernate.orm.jdbc.bind, the Hibernate 6+ categories; the 2022 video also discusses Hibernate 5 categories, which do not apply. Treat as concept-only for which categories to enable.
- Content evidence: Publisher description (development configuration logs SQL statements and the number of executed queries; production configuration logs as little as possible); YouTube chapter markers.
- Cautions: Plain Hibernate configuration, not Spring Boot's spring.jpa.show-sql or logging.level properties. Not Hibernate 7 specific.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

### SB8. Best Practices for Many-To-One and One-To-Many Association Mappings

- URL: https://www.youtube.com/watch?v=tciSOIQngig
- Publisher: Thorben Janssen (published 2017-11-27)
- Full runtime: 9:34 (574 s)
- Assigned segment: full video (0:00-9:34); watch 9.57 min (574 s)
- Mapped topics: `relationships-and-transactions/one-to-many-and-many-to-one-relationships` o1 and o3 (bidirectional @ManyToOne/@OneToMany(mappedBy); helper methods); `relationships-and-transactions/relationship-pitfalls` o1 (CascadeType.REMOVE and orphanRemoval)
- Screening status: screened: concept-only (segment shows legacy API or configuration)
- Version fit: Published 2017-11-27; the accompanying article uses javax.persistence. The mapping annotations are unchanged in Jakarta Persistence 3.2 apart from the jakarta package.
- Target-version compatibility: Concepts match the Hibernate ORM 7.4 Introduction (checked live 2026-11-09: prefer @ManyToOne with @OneToMany(mappedBy); orphanRemoval; @ManyToOne eager by default and should be lazy), but the 2017 code uses javax.persistence and Hibernate 5.
- Content evidence: Accompanying article fetched 2026-11-09 has the same six practices: avoid unidirectional one-to-many, avoid huge to-many mappings, think twice before CascadeType.REMOVE, use orphanRemoval for parent-child, implement helper methods for bidirectional associations, define FetchType.LAZY for @ManyToOne.
- Cautions: javax-era code and Hibernate 5. No chapter markers, so the whole video is assigned. The owning-side concept (o2) is shown in code but not explained.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

### SB9. How to choose the right FetchType to avoid Hibernate performance issues

- URL: https://www.youtube.com/watch?v=1X3IKf-J65c
- Publisher: Thorben Janssen (published 2024-10-10)
- Full runtime: 9:40 (580 s)
- Assigned segment: 1:26-9:40 (YouTube chapter markers "Default FetchType", "Other FetchTypes", "FetchType Lazy"); watch 8.23 min (494 s)
- Mapped topics: `relationships-and-transactions/lazy-and-eager-loading` o1 and o3 (default fetch types; prefer LAZY with query-specific fetching)
- Screening status: screened: legacy video; assigned concept substantiated in current target-version docs
- Version fit: Published 2024-10-10 (Hibernate 6 era). JPA default fetch types are defined by the specification and unchanged in Jakarta Persistence 3.2.
- Target-version compatibility: Hibernate ORM 7.4 Introduction (checked live 2026-11-09): @ManyToOne is fetched eagerly by default and almost all associations should be lazy.
- Content evidence: Publisher description and YouTube chapter markers (fetching unused related entities causes most performance issues; shows the mapping fix and a logging configuration that reveals the problem).
- Cautions: Plain Hibernate/JPA; Spring Boot's open-in-view default is not discussed.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

### SB10. LazyInitializationException: What it is and the best way to fix it

- URL: https://www.youtube.com/watch?v=6p-fuwVxryg
- Publisher: Thorben Janssen (published 2020-05-28)
- Full runtime: 9:57 (597 s)
- Assigned segment: 1:06-5:41 (YouTube chapter markers "LazyInitialization Example", "Bad Advice"); watch 4.58 min (275 s)
- Mapped topics: `relationships-and-transactions/lazy-and-eager-loading` o2 (LazyInitializationException after the session closed; why EAGER, open-session-in-view and enable_lazy_load_no_trans are bad fixes)
- Screening status: screened: concept-only (segment shows legacy API or configuration)
- Version fit: Published 2020-05-28 (Hibernate 5). The exception and the rejected fixes still apply to Hibernate 7; the course page notes Spring Boot's spring.jpa.open-in-view.
- Target-version compatibility: Hibernate ORM 7.4 Introduction (checked live 2026-11-09) still describes LazyInitializationException when a proxy is used after its session ends; the 2020 demo is Hibernate 5.
- Content evidence: Accompanying article fetched 2026-11-09: sections "When does Hibernate throw a LazyInitializationException" and "How to NOT fix" (FetchType.EAGER, Open Session in View, hibernate.enable_lazy_load_no_trans), matching the YouTube chapter markers.
- Cautions: The fix chapters (5:41 onward: entity graphs) are not assigned; JOIN FETCH is covered by SB12.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

### SB11. Spring & Spring Data JPA: Managing Transactions

- URL: https://www.youtube.com/watch?v=SUQxXg229Xg
- Publisher: Thorben Janssen (published 2020-06-11)
- Full runtime: 10:33 (633 s)
- Assigned segment: 3:34-8:34 (YouTube chapter markers "Database Transactions", "Transaction Management", "Propagation"); watch 5 min (300 s)
- Mapped topics: `relationships-and-transactions/how-transactions-work-in-spring` o1 and o3 (@Transactional on a service method; the proxy; readOnly per the article)
- Screening status: screened: legacy video; assigned concept substantiated in current target-version docs
- Version fit: Published 2020-06-11 (Spring 5 / Spring Data JPA 2). @Transactional semantics shown are unchanged in Spring Framework 7.
- Target-version compatibility: Spring Framework 7 reference: default rollback only for RuntimeException and Error (rolling-back.html, checked live 2026-11-09); @Transactional(readOnly = true) and proxy-based behavior (annotations.html, frozen course source retrieved 2026-10-13).
- Content evidence: Accompanying article fetched 2026-11-09: @Transactional, the generated proxy, read-only transactions, propagation and rollback on RuntimeException or Error.
- Cautions: Self-invocation and checked-exception rollback (o2) are not explicitly covered. Propagation levels go beyond the lesson.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

### SB12. JOIN FETCH with Hibernate - The end of n+1 select issues

- URL: https://www.youtube.com/watch?v=QAaTLLYdHJ0
- Publisher: Thorben Janssen (published 2024-10-17)
- Full runtime: 6:31 (391 s)
- Assigned segment: 0:31-4:13 (YouTube chapter markers "Typical n1 select issue" and "Joint fetch CLA", auto-generated wording); watch 3.7 min (222 s)
- Mapped topics: `relationships-and-transactions/the-n-1-query-problem-spotting-it-in-sql-logs` o1 (one query for parents, one per parent for children); `relationships-and-transactions/fixing-n-1-with-join-fetch` o1 (JOIN FETCH)
- Screening status: screened: legacy video; assigned concept substantiated in current target-version docs
- Version fit: Published 2024-10-17 (Hibernate 6 era). JPQL JOIN FETCH is unchanged in Jakarta Persistence 3.2 and Hibernate 7.
- Target-version compatibility: Hibernate ORM 7.4 query language guide (querylanguage, frozen course source retrieved 2026-10-13; rechecked live 2026-11-09) documents join fetch.
- Content evidence: Publisher description (lazy fetching is the first step; a JOIN FETCH clause tells Hibernate which relationships to initialize and fixes n+1 select issues) and YouTube chapter markers.
- Cautions: Plain JPQL rather than a Spring Data @Query. The pagination limitation (fixing o3) is not covered; the later chapter on multiple JOIN FETCH clauses is not assigned.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

### SB13. Spring Boot RestClient Error Handling

- URL: https://www.youtube.com/watch?v=MuYzEZk6-zI
- Publisher: Dan Vega (published 2026-03-26)
- Full runtime: 17:24 (1044 s)
- Assigned segment: 2:45-10:30 (publisher chapters "Tip #1: Use the Default RestClient Builder" to "Returning ProblemDetail (RFC 9457) Responses"); watch 7.75 min (465 s)
- Mapped topics: `integration-and-observability/calling-another-service-with-restclient-base-url-and-timeouts` o1 and o2 in part (injected RestClient.Builder; turning non-2xx responses into errors with onStatus and defaultStatusHandler); `validation-errors-and-testing/global-error-handling` o1 (@RestControllerAdvice); `validation-errors-and-testing/standard-error-responses-with-problemdetail` o1 (ProblemDetail, RFC 9457)
- Screening status: screened: version-matched
- Version fit: Companion repository danvega/rest-client-error-handling: spring-boot-starter-parent 4.0.4, java.version 25, spring-boot-starter-restclient. Published 2026-03-26.
- Target-version compatibility: Companion repo targets Spring Boot 4.0.4 / Java 25.
- Content evidence: Publisher chapters and description name the default builder, onStatus, defaultStatusHandler, a global @RestControllerAdvice and ProblemDetail (RFC 9457) responses.
- Cautions: Timeouts and MockRestServiceServer are not covered. The later @Retryable chapters (13:30 onward) use a feature the course does not teach and are not assigned.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

### SB14. MockMvcTester vs RestTestClient: Which one Should You Use in Spring Boot 4?

- URL: https://www.youtube.com/watch?v=xWcqvrpj2PM
- Publisher: Dan Vega (published 2025-12-10)
- Full runtime: 20:46 (1246 s)
- Assigned segment: 3:30-10:45 (publisher chapters "Code Overview", "Key Differences", "Writing Tests with MockMVC Tester"); watch 7.25 min (435 s)
- Mapped topics: `validation-errors-and-testing/web-layer-tests-with-mockmvc` o1 (a @WebMvcTest asserting status and JSON, in the AssertJ-style MockMvcTester form); `validation-errors-and-testing/mockito-in-spring-at-mockitobean` o1 in part (@MockitoBean as the successor to @MockBean)
- Screening status: screened: version-matched
- Version fit: Companion repository danvega/mock-vs-rest: spring-boot-starter-parent 4.0.0, java.version 25, spring-boot-starter-webmvc-test. Published 2025-12-10.
- Target-version compatibility: Companion repo targets Spring Boot 4.0.0 / Java 25.
- Content evidence: Publisher chapters and description (@WebMvcTest, @MockitoBean as the successor to @MockBean, AssertJ-style assertions with MockMvcTester).
- Cautions: The lesson teaches the classic MockMvc perform/andExpect form and names MockMvcTester as the AssertJ alternative; the video shows the alternative. RestTestClient (13:00 onward) is not taught and not assigned.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

### SB15. Secure your REST APIs with Spring Security & Symmetric Key Encryption

- URL: https://www.youtube.com/watch?v=66DtzkhBlSA
- Publisher: Dan Vega (published 2023-01-19)
- Full runtime: 27:53 (1673 s)
- Assigned segment: 15:25-22:25 (YouTube chapter markers "Symmetric key encryption setup", "Implementing the token service"); watch 6.98 min (419 s)
- Mapped topics: `api-security/issuing-and-checking-a-jwt` o1 (JwtEncoder over a symmetric key; issuing a signed token)
- Screening status: screened: legacy video; assigned concept substantiated in current target-version docs
- Version fit: Companion repository danvega/jwt-symmetric-key: spring-boot-starter-parent 3.0.1 (Spring Security 6.0), java.version 17. The assigned token-service code (a JwtEncoder built as NimbusJwtEncoder over an ImmutableSecret JWK source) carries forward to Spring Security 7.1; the security configuration does not (see the unapproved segment).
- Target-version compatibility: Spring Security 7.1 javadoc (checked live 2026-11-09): NimbusJwtEncoder(JWKSource) and NimbusJwtEncoder.withSecretKey exist, and NimbusJwtDecoder.withSecretKey is documented in the resource-server JWT reference. Only the token-service segment is assigned; see the unapproved configuration segment.
- Content evidence: Publisher description (Spring Security, JWT, symmetric key); companion SecurityConfig has authorizeHttpRequests with hasRole/hasAuthority, STATELESS sessions, oauth2ResourceServer JWT, a NimbusJwtEncoder over a secret read from the jwt.key property and an HS512 NimbusJwtDecoder.
- Cautions: Boot 3.0 and Spring Security 6.0 video. The demo user stores its password as {noop} plain text, the opposite of password-hashing. The key comes from a property file rather than an environment variable. Resource-server validation (o2) sits in the unapproved configuration segment.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

### SB16. OWASP API Security Top Ten 2023 Update: What has changed?

- URL: https://www.youtube.com/watch?v=GOo387csZaU
- Publisher: Erik Wilde (published 2023-08-08)
- Full runtime: 11:08 (668 s)
- Assigned segment: 1:33-8:53 (publisher chapters "OWASP API Security Top Ten" to "A Common Problem: Client-Side Enforcement"); watch 7.33 min (440 s)
- Mapped topics: `api-security/common-api-security-risks-owasp` o1 and o2 (the 2023 list; broken object level authorization with the Coinbase example)
- Screening status: screened: version-matched
- Version fit: Published 2023-08-08 about the OWASP API Security Top 10 2023, the edition the course cites.
- Target-version compatibility: About the OWASP API Security Top 10 2023, the edition the course cites.
- Content evidence: Publisher chapters and description (2019 versus 2023 list; the Coinbase BOLA issue; client-side enforcement).
- Cautions: Interview format with APIsec University; the promotional segment (8:53 onward) is excluded. Not Spring-specific.
- Checked: 2026-11-09; live, public, embeddable (oEmbed HTTP 200), `playabilityStatus` OK

## Unapproved segments (excluded from totals)

- 9:20-13:29 of SB15 (YouTube chapter marker "Spring Security six configuration"), https://www.youtube.com/watch?v=66DtzkhBlSA: The companion SecurityConfig uses oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt), which needs a no-argument jwt(). The Spring Security 7.1 OAuth2ResourceServerConfigurer javadoc (checked live 2026-11-09) lists only jwt(Customizer), so this configuration does not carry to the course version. Its 4.15 min are excluded from the totals.

## Topics with no selected video

No candidate met the standard (first-party or reputable publisher, verifiable content and version fit, a concise segment) for these topics, so none is padded in.

- `spring-boot-basics/spring-vs-spring-boot-what-boot-adds` (core)
- `spring-boot-basics/how-auto-configuration-works` (reading)
- `spring-boot-basics/reading-an-openapi-spec-and-exploring-it-in-swagger-ui` (core)
- `porting-and-configuration/porting-a-javalin-route-service-and-repository-to-spring-boot` (core)
- `porting-and-configuration/constructor-injection-across-layers` (core)
- `porting-and-configuration/rest-design-recap` (reading)
- `porting-and-configuration/configuration-files-and-profiles` (core)
- `porting-and-configuration/secrets-from-the-environment` (core)
- `spring-data-jpa/spring-data-jpa-with-hibernate` (core)
- `spring-data-jpa/entities-and-ids` (core)
- `spring-data-jpa/controller-service-and-repository-layers` (core)
- `spring-data-jpa/dtos-and-mapping` (core)
- `spring-data-jpa/pagination-and-sorting` (core)
- `spring-data-jpa/api-layers-and-dtos-project` (lab-brief): not applicable (lab-brief; the catalog records its video companion as not applicable)
- `validation-errors-and-testing/bean-validation-on-requests` (core)
- `validation-errors-and-testing/error-handling-project` (lab-brief): not applicable (lab-brief; the catalog records its video companion as not applicable)
- `validation-errors-and-testing/debugging-a-failing-request` (core)
- `integration-and-observability/an-integration-test` (core)
- `integration-and-observability/logging-in-spring` (reading)
- `integration-and-observability/health-checks` (core)
- `api-security/session-cookies-vs-jwts-trade-offs` (reading)
- `api-security/password-hashing` (core)
- `api-security/role-protected-endpoints` (core)
- `api-security/a-dev-profile-that-keeps-endpoints-open-during-front-end-work` (core)
- `api-security/api-security-project` (lab-brief): not applicable (lab-brief; the catalog records its video companion as not applicable)
- `api-security/spring-review-layers-data-access-errors-testing-security` (review): not applicable (review; the catalog records its video companion as not applicable)

## Candidates checked and not selected

- Spring Boot 4 Crash Course: VegaCon 2027 (Dan Vega, 12:35), https://www.youtube.com/watch?v=eT6KYuoEj4w: a preview of a course application, not a tutorial; covers frameworks the course does not teach (JTE, Spring AI, Spring Data JDBC).
- Spring Boot 3 to 4 Migration: A Real App, Migrated Live (Dan Vega, 29:52), https://www.youtube.com/watch?v=HiPkoGTeNJc: exact version fit (Boot 3.5.16 to 4.1.1, Java 25), but framed as a migration; its Flyway point is covered by SB5 in 49 seconds and its test-starter/@MockitoBean point by SB14. Kept as an alternate.
- Working with Flyway Migrations in a Spring Boot Application (IntelliJ IDEA, 7:45), https://www.youtube.com/watch?v=AMopB9C2bH8: demonstrates generating migrations with IDE database tooling; not verified that every feature shown is in the free edition, and learners write V__ files by hand.
- Fix N+1 Select Issues with Hibernate's EntityGraphs (Thorben Janssen, 6:56), https://www.youtube.com/watch?v=7gm30iX3Nfw: fits fixing-n-1 o1, but SB12 already covers the fix; shows JPA named entity graphs rather than Spring Data @EntityGraph. Kept as an alternate.
- Spring Boot RestClient.Builder Explained (Dan Vega, 13:41), https://www.youtube.com/watch?v=aocKQ2-U3wU: Boot 4 and relevant, but the injected-builder point is already in SB13's assigned segment. Kept as an alternate.
- Spring Security JWT (Dan Vega, 43:06, 2022), https://www.youtube.com/watch?v=KYNR5js2cXE: superseded by SB15, which uses a symmetric key like the course; this one uses RSA keys and is longer.
- Session Vs JWT: The Differences You May Not Know! (ByteByteGo, 6:59), https://www.youtube.com/watch?v=fyTxwIa-1U0: reputable and on topic by title, but the live page has no description or chapters and captions could not be read; title-only evidence does not meet the standard.
- Session vs Token Authentication in 100 Seconds (Fireship, 2:18, 2020), https://www.youtube.com/watch?v=UBUNrFtufWo: same title-only evidence problem.
- Spring Security 7 (Coffee + Software / Josh Long, 39:55), https://www.youtube.com/watch?v=68P21jtmoy0: first-party advocate and exact Security 7 version, but no chapters, so no password-encoder segment can be pinned; mostly one-time tokens, passkeys and MFA, which the course does not teach.
- Spring Boot 4 Modularization Explained (Dan Vega, 10:55), https://www.youtube.com/watch?v=kTLuhE7_jGU: explains Boot 4 starter modularization, related to how-auto-configuration-works, but covers neither @SpringBootApplication nor condition evaluation (--debug), and has no chapters.
- Pagination and Sorting in Spring Boot 4 with Spring Data JPA (LeetJourney, 10:13), https://www.youtube.com/watch?v=lgMbmA381Xo: Boot 4 and on topic, but the publisher's reputation could not be established and PagedModel coverage is unconfirmed.
- Validate REST API Input in Spring Boot 4 with Jakarta Bean Validation (LeetJourney, 5:58), https://www.youtube.com/watch?v=0l199suNnzA: same publisher-reputation gap.

## Optional watch minutes

Unique minutes: each video counts once, and overlapping segments inside one video are merged. Values are before rounding.
Each video is placed on the earliest calendar day of the topics it maps to in that track, so shared Standard/Fast canonical content is counted once per track and never twice inside a track.

- Course total: 105 min (6300 s) across 16 videos.
  - screened: version-matched: 38.12 min (2287 s)
  - screened: legacy video; assigned concept substantiated in current target-version docs: 48.83 min (2930 s)
  - screened: concept-only (segment shows legacy API or configuration): 18.05 min (1083 s)
- Standard track: 105 min (6300 s) from 16 videos; by day: S1 30.57, S2 7.1, S4 0.82, S5 6.12, S7 22.38, S8 8.7, S9 7.75, S10 7.25, S12 14.32.
- Fast track: 105 min (6300 s) from 16 videos; by day: FT1 30.57, FT2 7.1, FT3 15.68, FT4 8.07, FT5 7.75, FT6 21.52, FT7 14.32.

## Required learner-path timing, kept separate

- Course catalog: 45 canonical HTML learner topics, plus 3 lab-brief records (project briefs with no HTML page).
- Standard track: 45 canonical HTML topics (catalog `minutes.budget` sum 590 min), plus 1 lab-brief record (5 min of brief reading; the project work itself is untimed), on 13 calendar days (S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13).
- Fast track: 43 canonical HTML topics (catalog `minutes.budget` sum 564 min), plus 2 lab-brief records (10 min of brief reading; the project work itself is untimed), on 8 calendar days (FT1, FT2, FT3, FT4, FT5, FT6, FT7, FT8).
- Those topic budgets are the timed reading-page portion only. Coding labs, project work, practice, warm-up quizzes, timed coding and the module check are not timed in the topic catalog; hands-on time is unknown where unmeasured, not zero, so the budget sums are lower bounds on required time.
- The frozen calendar sets 2 hours per day.
- Standard track: the frozen snapshot lists 43 instruction days; whether Standard runs 43 or 40 days is an open decision and is not resolved here. Spring Boot occupies S1-S13 in the snapshot either way.
- Fast track: fixed at six weeks including AWS Cloud Practitioner prep (captain constraint; the frozen snapshot lists 25 Fast instruction days plus 7 AWS-prep days). Spring Boot occupies FT1-FT8 in the snapshot.
- Optional video minutes are not added to the required totals above and do not change any day's required load.
