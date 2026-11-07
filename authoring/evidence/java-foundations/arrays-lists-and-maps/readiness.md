# Readiness receipt: java-foundations/arrays-lists-and-maps

Author correction checkpoint, 2026-11-07. This is author-owned readiness evidence, not critic or reconciliation evidence. Focused independent education and Java-SME review of changed bytes remains required.

## 1. Scope, objectives and sources

- The four catalog topics and their objective text remain authoritative and unchanged: arrays, linear/binary search, ArrayList and HashMap.
- Official Java SE 25 and canonical Dev.java sources were fetched successfully on 2026-11-07; each topic receipt records URL, final URL, byte hash and sections used.
- Learner source labels now state the OpenJDK 25 recheck. HashMap teaching says hash buckets and the API's usually constant-time `get`/`put` assumption rather than “without searching”.
- The search and lists GIFT banks change only the reviewed unsorted-search item and generic-type item. Arrays GIFT `0b8cef648ece06781a4cfcf2620c98a0012a845eb14fb25284b37b4dcd3c7fb0` and HashMap GIFT `f837116df8aa331d2d96d0eaeb39f2277ca5ef208e394239abe8197b2fe0bb24` retain their exact dual-role approvals.

## 2. Learner design and access

- One canonical standalone HTML page per topic; Markdown is derived byte-for-byte by `md-from-html.mjs`. No duplicate tracks, external runtime dependencies, telemetry or learner JavaScript requirement.
- The frozen DESIGN anatomy remains: accessible Objectives, activity-owned criteria and progressive hints, code-free analogy, conditional fit guidance, stateful Previous/Next, current-only Restart, no-JS reading and print-complete content.
- Final shared bytes are identical in every page: `engine.css` `d72bde2e7b44050ca093d8a31464ead1990dd78185889f2804d082ef9ee4e273`, `jmini.js` `40a1a2b90219b00ff020cbc776702a50f875275067a497c7f2743e40a06d6e4b`, `engine.js` `0d57c1d4aa5aec27d157a8c5b1d7e7961d574c29200e8d5d91e8e182d679eebc`.

## 3. Learning and answer safety

- `data-pep-attempts` is only the ungraded navigation counter. Untouched starter runs do not count; comment/format-only, missing-input, compile-error and unsupported runs may open navigation after the existing threshold but never complete the activity, award grade/credit or consume an assessment allowance. Only one whole run passing every local check completes the code activity and awards credit.
- Search GIFT now uses present target `4` in `{9, 2, 30, 4, 1}`, for which the shown binary-search path can wrongly report missing.
- Lists teaching now says type arguments may be reference types or wildcards; in the novice case `Integer` is a reference type and `int` is primitive.
- Scores completion now also requires the requested `set` and `remove` operations on the same `scores` list, while permitting any implementation that performs those operations and meets the visible state/output criteria.
- No complete learner implementations, private inputs, answer-derived hashes, hidden tests, keys or rubrics are committed. Whole-document Java answer-safety remains enrolled through the four existing `qa-paths.json` declarations and exact starter pins.

## 4. Completion, navigation and Restart

- Finishing the final activity while required code remains open keeps page completion false and the recap hidden, names the open activity and supplies a direct return link.
- Passing that activity makes completion and recap current. Editing credited code immediately invalidates stale completion, credit, grade and recap while navigation stays unlocked; a later nonpass remains incomplete, and a genuine repass restores current completion. Restart remains a separate current-activity reset route with the same stale-credit protections.
- `progression-regression.mjs` proves both sequences on all four pages with answer-free synthetic engine results. It also proves unchanged starter runs do not count; comment/format-only, missing-input, compile-error and unsupported runs remain zero-grade/zero-credit navigation events; activity titles are not duplicated in open notes; and stale open notes retract after a pass.

## 5. Java fidelity

- The bounded interpreter accepts `-2147483648`, explicit `new ArrayList<Integer>()` and a bare class-instance-creation statement while rejecting a bare array creation statement.
- Legal bounded `Integer`/`Boolean` receiver methods run; `Boolean.compareTo(null)` throws `NullPointerException`; other legal wrapper methods are lesson limits, while only statically primitive receivers receive the javac-style dereference Error. `List.remove(Object)` has boolean static type and `remove(int)` retains the element type. `Map.get` and `getOrDefault` retain the declared value type, including through equality, wrapper receiver methods and `List.remove(Object)`.
- Simple and compound array assignments resolve the array/index once and preserve Java's RHS-versus-null/bounds exception precedence. Equality distinguishes the literal `null` from a runtime-null boxed value: an `int` or `boolean` compared with the literal remains a truthful compile-time Stop, while a statically known null `Integer`/`Boolean` compared with the corresponding primitive compiles and throws `NullPointerException` during unboxing. Integer coverage includes a variable, `List.get(...)` and missing-key `Map.get(...)`. If a runtime-null expression is compared with a primitive but the bounded evaluator cannot infer the expression's boxed static type, it now reports an honest practice-editor limit instead of silently returning `false` or claiming a universal exception.
- Explicit collection constructors reject bare primitive scalar type arguments throughout their argument list, including the second `HashMap` position and the `double` family. Legal primitive-array reference arguments remain truthful practice-editor limits. The final JDK differential has 47 cases, including independent integer and boolean literal-null/runtime-unboxing controls, nested-generic-call and ternary unknown-static-type controls, and scalar-constructor and primitive-array controls; all 47 pass on checksum-verified Temurin `javac 25.0.5`.
- The A16 correction is one authored equality hunk in `jmini.js` plus the two named controls and their value-free assertion in `jmini-differential.mjs`; the four page meta/embed pairs are generated copies. `engine.js`, `engine.css`, every source body, Markdown, GIFT bank, teaching, Recap, static/print and state bytes remain unchanged. Exception claims promise JDK names, not exact simulator messages. Step-limit copy no longer claims a real JDK necessarily runs forever.

## 6. Direct proof and blockers

- Mechanical T14 results on the final prose are arrays 9.04/12.04 (budget 13), search 9.16/12.16 (budget 13), lists 8.79/11.79 (budget 12), and maps 8.78/11.78 (budget 12), where each pair is modeled P50/worst required path.
- `build.mjs --check`, progression regression and the 47-case JDK 25 differential pass on the final public bytes. Focused repository checks and four fresh sequential private proofs remain to be refreshed after this learner-byte checkpoint.
- Final page hashes: arrays `307d37a19eca73a9a9cfd0a7459826894fefdfd04118830e6f18c0c01f2adb63`; search `8767f831d479feff18f4816efbe23192625e7a57674acb18001feb3fa880bf57`; lists `b4b4cac18fbb3ef01a3ba4eb07c7ade8826d0447257c8fb2a954b0ea8d1dcd71`; maps `1a55acb8a9b3522198e2f2dea0a273b0cf0ae1861e183cf4bd76dad66596431b`.
- The receipts through `3ecfcf7b56e70631cbd344bab00530391c11bccc` remain historical only after this learner-byte change. Fresh run IDs, immediate evidence-only receipt children, refusal controls and retired staging are required for all four final pages.
- **Current hard blockers before selected delivery validation:** four fresh private proofs and same-role education and Java micro-rechecks of only the A16 equality hunk, named uncertainty controls, rebuilt embeds, readiness, ancestry and fresh receipts. All unchanged approvals and all four exact GIFT approvals transfer.
