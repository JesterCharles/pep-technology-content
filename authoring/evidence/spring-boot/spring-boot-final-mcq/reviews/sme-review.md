# Spring course-final MCQ: Spring SME critic review

- Role: Spring SME critic (independent; not the author). Read-only on the candidate files.
- Date: 2026-11-19
- Probes ran offline (`-o`) on OpenJDK 25.0.5.1, Maven 3.9.16 and the Boot 4.1.2 BOM. Work lives under `SCR/critic-sme/`:
  - `h/`: a copy of the author harness.
  - `p/`: my own stem-faithful probes.
  - `fmt.mjs`: my format check.

Candidate sha256 (all match `SCR/cf-draft-v1-sha256.txt`, re-checked after my runs with `shasum -c`):

| File | sha256 |
| --- | --- |
| final-mcq.gift | 67dd4b0d0808d608d0c26ba7426d86e6a1e34b8e427184fc216ae07050ab20a6 |
| coverage.json | f43b1b3a8f2fc1755ecac94c3b990799b5f3cdfa962256aed87f6828b222ddba |
| blueprint-proposal.json | 091726ae83b6ba224a69fb14cb343629cd37a90db875a2decadb281d9972e8e5 |
| audit.txt | a856b0209cc547c6396ad5c705bd8f96cdfcd94ae649c2b0e184157b6013f7f5 |
| README.md | d1e2c6bc98a0739b2ea0f0cb919c9b4e6b865c6c98401adaabe654f3b151e18e |
| check-bank.mjs | da35b052561539bf5cfce928837b5eff2ff315d5440bd6a3ddb01b9832f25b1b |
| key-proof/ (sha256 of the sorted per-file sha256 list) | 978abf5b372b08c84fc1611b31dc23e426b11db4c8245ce05567d8f3e25a643c |

## Verdict

**approve-with-changes.** All 30 keys are correct for Boot 4.1.2, Java 25 and Security 7, and every distractor is definitely wrong. The format rules pass. The findings below concern a cue, feedback accuracy and labels; none changes a key.

## Findings

| id | severity | item(s) | finding | required fix |
| --- | --- | --- | --- | --- |
| CFS-1 | medium | sbf-q17 | Answer cue: the key is the single longest option by a wide margin (123 rendered characters, against 105, 81 and 61). | Shorten the key, for example "400 problem+json naming no fields; override the validation handler in an advice", or lengthen the shorter distractors. |
| CFS-2 | low | sbf-q17 option D feedback | The feedback says a catch-all `@ExceptionHandler(Exception.class)` "would turn it into a 500". Under this stem (`problemdetails.enabled=true`), Boot's problem-details advice still answers first. My probe got **400**, "Invalid request content.", with a catch-all advice present. The distractor is still wrong. | Rewrite: "Two failed constraints are still one validation failure, answered with 400." Drop the 500 claim, or say that it depends on advice order. |
| CFS-3 | low | sbf-q25 (key and option A), sbf-q23 (option D) | The options use shorthand (`default_batch_fetch_size=50`, `hibernate.default_batch_fetch_size=50`). Boot passes only `spring.jpa.properties.*` to Hibernate. Probe: unprefixed gives 52 statements, prefixed gives 3. As written, the q25 key is literally ineffective config and the q23 D feedback is untrue. | Use `spring.jpa.properties.hibernate.default_batch_fetch_size=50`, or say "Hibernate batch fetching, size 50". |
| CFS-4 | low | sbf-q07 | (a) An app whose database is unreachable at startup never starts with JPA (probe: Hibernate "Unable to determine Dialect"). (b) Boot 4.1 also lists livenessState, readinessState, ping and ssl. The key is non-exclusive, so it stays correct. | Say "the database went down after startup". Optionally: "lists each component's status, including db DOWN and diskSpace UP, with no details". |
| CFS-5 | low | sbf-q18, sbf-q28 feedback | q18: the key feedback says "non-2xx", but the default handler throws only for 4xx and 5xx. The option A and C feedback has run-on, duplicated clauses. q28 option D: "with or without a token" overstates it, because a resource-server chain can still answer 401 to an *invalid* bearer token on a permitAll path. | Say "4xx or 5xx". Split the run-on clauses. Change the q28 wording to "with or without a token, as long as no invalid token is sent", or simply "lets every request through". |
| CFS-6 | low | bank header, category, proposal `mcqPart.category` | The header says "spring-boot-module-check Part 1", but in `spring-boot-final-assessment` the MCQ is Part 2. The category points at the separate 16-MCQ module-check folder; the author followed the brief. The header also still says "Private author draft for review." | The canonical task confirms the delivery category (Collections declares its own, which is a precedent). Change the header to "Part 2" and replace the draft wording at delivery. |
| CFS-7 | low | key-proof q21, q25, q30 | Some proofs are weaker proxies than their stems. q30 uses `user().roles()` with MockMvc instead of bearer tokens. q21 adds a second request. q25 adds `&sort=title` and `open-in-view=false`. My stem-faithful variants confirm all three keys. | Add the stem-faithful variants to the harness, or record in `results.txt` that these are proxies. |

## Checked and confirmed

- **Format (item 7).** I ran `validateGift(…, { html: true })` in my own script and applied the course-final test rules.
  - 30 questions. Plain mode rejects the bytes.
  - 0 dropped comment lines, 0 numeric newlines, 0 unsafe code lines, 4 options each.
  - Keys A8/B7/C7/D8, longest run 2.
  - The key is the single longest option in 3 items; only q17 is material.
  - No grammatical or absolute-word cue found in any key.
- **Author harness.** I re-ran a copy offline with the default TMPDIR: 29 classes, 0 failures. I audited the q06, q08, q10 and q29 tests; they use the stem's data, for example q10's four rows.
- **My own stem-faithful probes: 19 keys, all confirmed.**
  - q03: 1,2,1.
  - q04: `MissingWebServerFactoryBeanException`.
  - q07: 503, DOWN, no details.
  - q11: 400 over a real port.
  - q13: `isNew=false`, then select and insert.
  - q14: 3 rows, still garden 1.
  - q15: 200 "partial", tank 1 still 1000.
  - q16: one select, no update.
  - q17: on gives problem+json with no fields; off gives default JSON with no fields.
  - q18: 500 after a real partner 404.
  - q19: `{bcrypt}`, salts differ.
  - q20: validate fails on `queen_colour`.
  - q21 and q22, verbatim: each fails only on its status assertion (409/200 and 401/403).
  - q24: 400 without the advice, 500 with it.
  - q25 at the exact URL with default OSIV: 52, then 3.
  - q26: 200 with the shown order, 403 once fixed.
  - q27: `BadJwtException`.
  - q30 over a real port with real HS256 tokens and a roles converter: 401, 400, 403.
- **Distractors executed.**
  - q17 B and q17 D.
  - q20 B: the edited V1 fails the checksum.
  - q20 D: `update` starts, but it is wrong per the taught rule "validate or none once Flyway owns the schema".
  - q22 C: `roles("ROLE_STAFF")` throws.
  - q24 B.
  - q23 and q25 contrast runs.
- **Cited keys q02, q05 and q12.** Sound; q05 matches RFC 9110 idempotence.
- **API currency.**
  - Boot 4: starter names, `problemdetails`, `@MockitoBean`, `PagedModel`, RestClient.
  - Security 7: `authorizeHttpRequests`, `requestMatchers(HttpMethod, …)`, `NimbusJwtDecoder`, delegating encoder.
  - Hibernate 7 behaviour is confirmed by the probes.
  - No Jackson 2-only API appears.
- **Blueprint proposal (item 8)**, checked by script against MAIN at a00:
  - Objectives: 77, minus 21 removed, plus 19 added, gives exactly the 75 proposed. All 21 removed were MCQ-only, and all 17 that gain MCQ were practical-only.
  - The practical part is unchanged: its objective set, 8 items, 60/40 weights and 70% pass mark. The total is 150 + 30 = 180 minutes.
  - All 62 MCQ objectives are elicited by items, and every objective id exists in the catalog.
