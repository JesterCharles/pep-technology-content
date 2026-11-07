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
- Final shared bytes are identical in every page: `engine.css` `d72bde2e7b44050ca093d8a31464ead1990dd78185889f2804d082ef9ee4e273`, `jmini.js` `d70c606c88ec5d14a2ffc632548a6a557abfb9f0a785ff325ca38a83de2c077d`, `engine.js` `139d9548f9274af67a413b92774224a61edd46a861231955a3d541f244024a91`.

## 3. Learning and answer safety

- Two runs of edited code, including identical edits, unlock unlimited ungraded navigation; only one whole run passing every local check completes the code activity and awards credit.
- Search GIFT now uses present target `4` in `{9, 2, 30, 4, 1}`, for which the shown binary-search path can wrongly report missing.
- Lists teaching now says type arguments may be reference types or wildcards; in the novice case `Integer` is a reference type and `int` is primitive.
- Scores completion now also requires the requested `set` and `remove` operations on the same `scores` list, while permitting any implementation that performs those operations and meets the visible state/output criteria.
- No complete learner implementations, private inputs, answer-derived hashes, hidden tests, keys or rubrics are committed. Whole-document Java answer-safety remains enrolled through the four existing `qa-paths.json` declarations and exact starter pins.

## 4. Completion, navigation and Restart

- Finishing the final activity while required code remains open keeps page completion false and the recap hidden, names the open activity and supplies a direct return link.
- Passing that activity makes completion and recap current. Editing credited code immediately invalidates stale completion, credit, grade and recap while navigation stays unlocked; a later nonpass remains incomplete, and a genuine repass restores current completion. Restart remains a separate current-activity reset route with the same stale-credit protections.
- `progression-regression.mjs` proves both sequences on all four pages with answer-free synthetic engine results. It also proves unchanged starter runs do not count, identical edited runs can unlock navigation without credit, activity titles are not duplicated in open notes, and stale open notes retract after a pass.

## 5. Java fidelity

- The bounded interpreter accepts `-2147483648`, explicit `new ArrayList<Integer>()` and a bare class-instance-creation statement while rejecting a bare array creation statement.
- Legal bounded `Integer`/`Boolean` receiver methods run; `Boolean.compareTo(null)` throws `NullPointerException`; other legal wrapper methods are lesson limits, while only statically primitive receivers receive the javac-style dereference Error. `List.remove(Object)` has boolean static type and `remove(int)` retains the element type.
- Simple and compound array assignments resolve the array/index once and preserve Java's RHS-versus-null/bounds exception precedence. The OpenJDK 25.0.5 differential has 25/25 matches, including the named non-goal controls, four independent assignment-order probes, wrapper methods, explicit generic construction and the minimum `int` literal.
- Exception claims promise JDK names, not exact simulator messages. Step-limit copy no longer claims a real JDK necessarily runs forever.

## 6. Direct proof and blockers

- Mechanical T14 results on the final prose are arrays 9.04/12.04 (budget 13), search 9.16/12.16 (budget 13), lists 8.79/11.79 (budget 12), and maps 8.78/11.78 (budget 12), where each pair is modeled P50/worst required path.
- `build.mjs --check`, progression regression and the OpenJDK 25 differential pass on the final public bytes. Focused T08, T14, T15, T16, T18 and T20 checks are run before the public checkpoint; `qa-receipt.json` is refreshed only by the required private proof sequence.
- Final page hashes: arrays `bfa9fba78d6e6db61c05ddc1d135eedd45a94cb5f82d9bea1857d43890ddcb3e`; search `f623a526cc9c22df1767d21b01ea0fb8d45328b35e8aa2838a42fca13af2efab`; lists `e2e4a52858506fa8e4831c8e2baef1bdb2e389d88e7c544163424ec68029a401`; maps `92b9c28a15a8dd7a8f11247cbc5408c96727082c0906ede9a110268f40418c9f`.
- **Hard blockers at this public checkpoint:** refresh each topic's private successful-run proof exactly once in the required serial lineage, then obtain focused education and Java-SME re-review of changed regions. Unchanged review-transfer regions and all four exact GIFT approvals remain transferred.
