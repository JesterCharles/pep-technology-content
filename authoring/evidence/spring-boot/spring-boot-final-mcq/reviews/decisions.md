# Reconciliation: Spring Boot course-final MCQ draft

- Non-author reconciler. Date: 2026-11-19.
- sha256 of the inputs:
  - final-mcq.gift `67dd4b0d0808d608d0c26ba7426d86e6a1e34b8e427184fc216ae07050ab20a6`
  - education-review.md `eba7d76c32739e22c3b28857e090642eca45be99c568ed7ad383ce631d8e0d5b`
  - sme-review.md `388133124098426e03f5644e24d193e7df4d0e7969c318c4ee83d89f7228f059`
- I checked the findings against the bytes at MAIN a00a6658: the pages and their JS models, the banks, the calendar, the manifests, the blueprint, `estimate_reading.py` and the harness.
- I did not re-run the SME's probes for CFS-2 to CFS-5; those rulings rely on the SME's results.

## Binding definitions

**T (replacement test).** A new or retargeted item must meet all five conditions.
1. Its setup and its deciding fact are both new. Check them against the topic bank, the module practice, every page activity, Where-this-fits task and page model, sfcp-q01 to q08, the coding assessments, Project 2 and the other 29 items.
2. It uses only APIs that Fast pages teach, and its primary topic is on a Fast day.
3. Its key is executed stem-faithfully, with a contrast run for any feedback that makes a behavioural claim. A conceptual key cites a page section instead.
4. It keeps its slot's band and key letter.
5. Its `differsFrom` names every source checked.

**R (coverage minimum).** Every taught topic must decide at least one option. That option is either a key that cannot be chosen without the topic's taught fact, or a distractor that only that fact eliminates. In both cases the feedback must name the fact.
- An `alsoElicits` entry that decides nothing does not count.
- Record each topic as `decides: [{item, role, objective}]`.
- Exceptions need captain sign-off. The only one pending is E1 (health-checks).
- Constructor-injection is not an exception. Its option must rest on a fact the Fast DI page also teaches: in Activity 2, either final constructor fields with no `@Autowired`, or a unit test built with `new` and a fake. Cite both pages.

**G (working timing gate).** Per item, t = 60·W/200 + 4·L + 30 s.
- W is the number of tokens in the rendered stem plus the options, excluding feedback.
- L is the number of non-blank lines inside `<pre>`.
- The rates and the 30 s `predict` cost come from the frozen `estimate_reading.py` (`0deca96b…`).
- Pass when Σt ≤ 30.0 min and every t ≤ 75 s. Also report Σt with the estimator's `mcq` cost of 45 s.
- The current bank reads in about 19.1 min, so Σt is about 34.1 min. Items over 75 s: q01, q02, q04, q20, q23, q24, q25 and q27.
- Reading time needs a cut of about 22%.

## Rulings

| id | ruling | sev | binding fix |
| --- | --- | --- | --- |
| CFE-1 | accept | high | Activity 1 has the same setup and fact. Replace q15 under T; the primary stays transactions. The critic's example is not pre-approved. |
| CFE-2 + CFS-1 + CFS-2 | accept, combined | high | Activity 3 states the key. Replace q17 under T; the primary stays problem-detail. The key must not be the single longest option. Claim advice precedence only if it is executed. |
| CFE-3 | accept | high | Bank item o1 has the same distractor and fact. Password-hashing becomes secondary, deciding an option under R. The band-2 slot takes a new primary: generating, spring-data-jpa-with-hibernate, DTOs, logging or OWASP. |
| CFE-4 | accept | high | The page model prints "no delete (row stays)". Replace q14 under T; the primary stays pitfalls, and one-to-many must still decide an option. Add a README note for the page owner on Activity 1 option C. |
| CFE-5 | accept | high | Activity 3 and practice Q6 confirm it. Retarget q22 to a MockMvc fact under T. The 401/403 distinction may decide only q30. |
| CFE-6 | accept | high | Apply R. In q30, vary (b) across the options. Map q25 to pagination o2: the pagination page teaches the count query, and that is what separates the key from A. q06's `differsFrom` must name the Activity 4 builder. |
| CFE-7 + CFS-4 | accept | high | See Conflict. Default: replace q07 with a band-1 item whose primary is a CFE-6 topic, and record E1. If the captain keeps health checks: use a setup distinct from Activity 2, with the CFS-4 wording. |
| CFE-8 | accept | medium | No page teaches the web-application type. Replace q04 D with a distractor that a taught fact refutes. |
| CFE-9 | accept | medium | q12: add a rule that looks like a format check but needs data, and drop "All" from A and B. q20: the options must differ in the executed validate outcome. q29: no distractor may be refuted by the stem, and the key must not be the single longest option. Decide it on status, log and trace. |
| CFE-10 | accept | medium | q21: make the mismatch meaningful rather than case-only, and execute it. q24: remove the prior status from the stem. |
| CFE-11 | partial | medium | A trim alone proves nothing, and a dry run is impossible. Use G and record it in `audit.txt`. README and `timeFitNote` must say the timing is modelled. |
| CFE-12 + CFS-5 | accept | low | q05: replace B and D. q28: say what the tests assert, and reword D. q18: say "4xx or 5xx" and split the run-on sentences. Leave q06 unchanged. |
| CFS-3 | accept | low | In the q25 key and option A, and in q23 option D, use `spring.jpa.properties.hibernate.default_batch_fetch_size`. The page also uses shorthand, so this stays low. |
| CFS-6 | partial | low | Change the header to "Part 2" and drop the draft wording. Leave the category as briefed: the canonical task sets it to the delivery folder path, per the test convention. Note this in README. |
| CFS-7 | accept | low | The harness confirms the proxies (`roles()`, `sort=title`, `open-in-view`). Add stem-faithful tests for q21, q25, q30 and every changed key, then regenerate `results.txt`. |

Counts by finding id: 7 high, 5 medium (CFS-1 is merged into CFE-2), 7 low, 0 rejected. CFE-11 and CFS-6 are partial.

## Consolidated corrections (one loop)

1. Replace q14, q15 and q17, and retarget q22 (CFE-1, 2, 4, 5).
2. Put new primaries into the q19 (band 2) and q07 (band 1) slots (CFE-3, 7).
3. Apply R:
   - The following must each decide an option: generating, constructor-injection, spring-data-jpa-with-hibernate, DTOs, logging, OWASP (a BOLA distractor in q26 fits), one-to-many and password-hashing.
   - Vary q30 (b).
4. Make the row edits for CFE-8, 9, 10 and 12, and for CFS-3, 5 and 6.
5. Trim the bank to pass G. Record t for each item, Σt and the `mcq` row.
6. `check-bank.mjs` passes: every letter keyed at least 7 times, no run longer than 2, the key is the single longest option in at most 7 items, and no new absolute-word cue.
7. Execute the changed keys and their behavioural feedback, then regenerate `results.txt`.
8. Update:
   - `coverage.json`: decides, E1, q25 and q06.
   - `audit.txt`: G, R, T and the Fast-page grep.
   - `README.md`: E1, timing, the page-owner note and the category.
   - `blueprint-proposal.json`: objectives, health-checks unsampled pending E1, and `timeFitNote`.
9. If G or R fails without dropping applied items or topics, stop and report the numbers.
10. Both critics recheck against the new hashes.

The correction stays bounded at 6 replacements and about 12 edits. It keeps 30 items, the 8/14/8 band split and the 150-minute practical.

## Conflict determination

**(a) Audience.** The canonical brief names no track, but the calendar places the Spring check on S13 and FT8, `course.json` sources FT1-FT8, and the blueprint says "this Standard/Fast course final". So Fast learners sit this final. A topic on no Fast day is untaught for them, whether as a primary or as a deciding option. The other 29 primaries all fall on Fast days.

**Coverage: YES, one narrow MATERIAL DESIGN CONFLICT.**
- `integration-and-observability/module.json` says "health-checks has no Fast row (Standard-only)", and Actuator appears on no other page.
- One shared bank cannot both cover health checks and avoid untaught material.
- The accepted 40-item blueprint already maps health-checks o1 and o2 to the MCQ.

Captain decision 1:
- (A), the default: E1 excludes health checks. Standard learners keep the topic quiz and the mastery check.
- (B): keep one item that Fast learners were not taught.

**Timing: UNRESOLVED.**
- At the `predict` cost, a cut of about 22% fits.
- At the estimator's `mcq` cost of 45 s (its label for applied items), decision time alone is 22.5 min. A bank that passes G models at about 37.5 min, and no trim reaches 30.

Captain decision 2: which cost governs exam items. If it is `mcq`, escalate the trade-off (fewer items or more minutes). The author works to G meanwhile.

**Dedup versus coverage: no conflict.** A new setup is always available.

**Unaffected:** the 30-item count, the progression, the no-repeat rule and the 150-minute practical.
