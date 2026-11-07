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
- Final shared bytes are identical in every page: `engine.css` `d72bde2e7b44050ca093d8a31464ead1990dd78185889f2804d082ef9ee4e273`, `jmini.js` `d4fa36dc9d68aa735809e826ea32487cbd54e160bd2b4f2782fe125750fe0af3`, `engine.js` `0d57c1d4aa5aec27d157a8c5b1d7e7961d574c29200e8d5d91e8e182d679eebc`.

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
- Simple and compound array assignments resolve the array/index once and preserve Java's RHS-versus-null/bounds exception precedence. The bounded differential now has 41 cases: the prior controls plus `Map.get` value typing, all eight legal primitive-array reference families as truthful lesson limits, an explicit primitive-array generic constructor, primitive/computed-`int` versus `null` as a truthful compile-time model limit, and a legal boxed-null control. All 41 match under the available local JDK 17 compatibility run; the required JDK 25 rerun remains the Java narrow-recheck gate.
- Exception claims promise JDK names, not exact simulator messages. Step-limit copy no longer claims a real JDK necessarily runs forever.

## 6. Direct proof and blockers

- Mechanical T14 results on the final prose are arrays 9.04/12.04 (budget 13), search 9.16/12.16 (budget 13), lists 8.79/11.79 (budget 12), and maps 8.78/11.78 (budget 12), where each pair is modeled P50/worst required path.
- `build.mjs --check`, progression regression, the 41-case local compatibility differential and focused T08, T14, T15, T16, T18 and T20 checks pass on the final public bytes. Each `qa-receipt.json` is refreshed by its required private proof sequence.
- Final page hashes: arrays `ba47b91b89403cb7c0d0718e5b4ec9a2cd926b6b70eaa99ea55d36b5be04c985`; search `6611faf376d94d87bc20d6a729056ce054441d5936ad34a995278eec061854ee`; lists `17e8e905256a35c6b99f2f4006018e372ee199a9aa5842af0bdb51449443c9cc`; maps `b4728c518206c437caef6cae06d3ec9fed0937383e61d84bab514986bc84df0b`.
- Four fresh private successful-run proofs are complete in the required serial order with retired staging: arrays at `c3ad4bde3e7fc96e0c2dc580c8c4c5c3f745e57e`, search at `b8f48125e4dd18186c49cfd4d67285d71f30d5bc`, ArrayList at `82336c06d946b4aca688367331b20fc56ffc31ac`, and HashMap at `5775dd21b1b5b0a2ecaad2ee5f93e8aeac6e11ab`; each immediate child changes only its receipt and generated lock.
- **Current hard blockers before selected delivery validation:** narrow education/privacy recheck of the changed navigation-accounting feedback and final static/print consequences, plus narrow Java-SME recheck of the two jmini clauses, bounded differential additions, readiness and receipt chain. All unchanged approvals and all four exact GIFT approvals transfer.
