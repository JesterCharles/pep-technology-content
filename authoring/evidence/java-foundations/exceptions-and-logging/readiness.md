# Exceptions and Logging: author readiness receipt

Author checkpoint for the five canonical learner pages of `java-foundations/exceptions-and-logging` (F14).
This is author evidence, not critic or reconciliation evidence. Under the tonight minimum acceptance profile, each topic carries implementation-owner `owner-essential-qa.json` bound to its current HTML and GIFT bytes; independent education and Java-SME critic approval was not required and was not performed for these bytes.

## 1. Catalog and objective coverage

The five topics and objectives remain unchanged from `authoring/catalog/java-foundations/exceptions-and-logging/*/topic.json` and intake rows 40–44 (F14, relation `exact`).

| Topic | Objective practice |
| --- | --- |
| checked-vs-unchecked-exceptions | Predict compiler behavior; sort the `Throwable` families; repair `firstLine`; choose checked or unchecked signaling |
| try-catch-finally-and-try-with-resources | Repair catch order; classify when `finally` runs; construct a try-with-resources form and predict resource closing order |
| custom-exceptions | Define the message-and-cause constructor; throw for a business rule; preserve and inspect a cause |
| reading-stack-traces | Identify type/message/first own frame; follow `Caused by:`; interpret helpful `NullPointerException` messages |
| logging | Explain logging over printing; choose levels; log an exception with its stack trace and without sensitive data |

## 2. Sources and technical truth

- Each topic has `authoring/evidence/java-foundations/exceptions-and-logging/<topic>/sources.json`, using official Java SE 25, Dev.java, Javalin, SLF4J and OWASP sources. The four bounded-literal/composer pages add the live JLS SE 25 lexical and escape-sequence source retrieved 2026-11-07; other source retrievals retain their recorded dates.
- Author verification used OpenJDK 25 for the shown compiler diagnostics and runtime behavior. The correction probe used Temurin `javac 25.0.5`: method-parameter catch-name conflicts produced the modeled `variable <name> is already defined in method <signature>` errors, while names declared only inside sibling `try` blocks remained legal.
- Every source receipt is rebound to the current learner HTML bytes. Independent Java-SME verification remains the explicit `freshness.unverifiedItems` item in each topic manifest.

## 3. Frozen design and shared bytes

- The pages retain the frozen learner-page anatomy derived from candidate `885207e034695aaf109ef0afe61fb1de50af9468` and root `DESIGN.md`.
- Four `<style>` blocks remain byte-identical at sha256 `be35f3086485924909c337dae0372d21fc57be2fd5ae9153ca6c78aad6f02f80`; the try-with-resources page adds only its bounded output/static-print rule, producing sha256 `277cf42f64a680b96336c4774449ddb67c5a1e230d6332c0de1d03b77b266cc3`.
- All five shared engine scripts are byte-identical: sha256 `7631932f2df600271cca724c620e0747c7fbb8398959c5ae930111703f29f8bf`.
- Embedded `predict@1` and `mcq-with-confidence@1` component fragments remain repository component bytes.
- Four pages now carry five explicitly answer-sensitive Java tasks: the existing four editors plus Activity 4's bounded `useBoth` composition. Public routes contain only bound starters, malformed, partial or unsupported input; successful values and assessed negative variants stay in authorized staging outside the repository.

## 4. Settled versus successful behavior

The module now applies the established distinction at activity and topic level:

- A failed required activity may settle after two assessed runs and unlock the next activity, but remains `data-pep-completed="false"`, credit `0` and grade `0`.
- Starter-equivalent runs, compiler errors and unsupported runs are reported honestly and do not consume either assessed run. Lexer-token comparison makes comment-only, whitespace-only and formatting-only edits starter-equivalent. Total Run presses and assessed failing executions have separate public data hooks, and every counted failure reports its `1 of 2` or `2 of 2` use.
- A route reaches `data-pep-route-settled="true"` only after every required activity has settled. The topic reaches `data-pep-complete="true"` only when every required activity passed.
- The end panel derives failure from actual result state, including an unmet editor whose optional summary label was absent. It says **Required path settled, not complete**, names the editor activity and never calls failed work complete or objective-fulfilled.
- A settled editor refuses later runs without spending a third assessed run and requires current-only Restart for a new budget. A credited editor keeps credit across token-equivalent comment/whitespace/format edits, but loses completion, credit and grade on a real token change; page completion and recap are recomputed false/hidden while the unlocked frontier and unrelated work remain. A real later pass restores credit.
- Restart activity restores the current editor's starter and assessed budget, recomputes route completion and hides stale recap text while preserving the unlocked frontier and other activity state. Reset code also revokes an earned pass when the restored starter is token-different from the passed source.
- Public value-free routes prove non-running attempts stay false/0/0 while still allowing later hint and optional traversal. Exact private routes prove assessed negative, later-success and Restart recovery behavior.

## 5. Direct artifact and private-proof boundary

- Focused T09–T13 cover all five final pages, including offline/file loading, bounded behavior, keyboard/accessibility, 320/390/768/touch/200% zoom, guidance navigation, hints, Restart, no-JavaScript/static output, print and the landed stepped-optional traversal. Exact current build receipts report all six checks passing.
- T18 passes: all Markdown companions are deterministic derivations of current HTML, and the Logging PDF remains the declared Reading handout.
- Whole-document T08 scanning passes for all five Java declarations. Exact starter bindings protect the complete-looking checked-exception, catch-order, custom-exception and `useBoth` starters; the logging statement task uses the bounded Java statement mode.
- Successful and assessed-negative editor values and overlay files stayed outside the repository, were never copied to learner artifacts or `build/`, and were retired after each proof. The final sequential runs are `exceptions-logging-checked-vs-unchecked-exceptions-final-a1261634` at `5481d103`, `exceptions-logging-try-catch-finally-and-try-with-resources-final-a1261634` at `db9ba90a`, `exceptions-logging-custom-exceptions-final-a1261634` at `9c891bd9`, and `exceptions-logging-logging-final-a1261634` at `823fb2f1`. Their immediate evidence-only children refresh only that topic receipt plus the generated module lock; runner-owned mixed/all-fail controls refused false completion.
- Local-only preservation refs retain historical proof objects without publishing them: `refs/fm-preserve/exceptions-and-logging/private-proof-38aa02f8` → `38aa02f85c8a59a76b6b9856a92821d5349c929d` and `refs/fm-preserve/exceptions-and-logging/private-proof-c0a8c323` → `c0a8c3232688c505921a3c3ea4f04dce592b6f1e`. The refused combined receipt commit `90b31e47` remains on the separate historical local branch, and answer-bearing `a7d15393795074b64be8a42374ddc2a62a779334` remains reachable only in preserved local ancestry; neither belongs on the publication ref.

## 6. Readiness, expected failures and review scope

- Current modeled P50 values remain within budgets 14 / 15 / 14 / 14 / 13 (70 minutes total); the try-with-resources page rises honestly to 15 minutes for its required production action. T14 is the authoritative timing check.
- Each topic has HTML, regenerated deterministic Markdown and six-item formative GIFT practice. Logging also has its regenerated PDF. The four unaffected GIFT banks are byte-identical; Custom Exceptions changes one answer-bearing constructor item into conceptual cause-preservation practice.
- Safe-publication bytes: T01–T05, T07, T08, T14, T15, T16, T18, T20, T24 and the module public regressions pass. The try-with-resources topic's modeled P50 (9.52, worst path 14.27, budget 15) and source receipt were rebound to its safe bytes. T06 still requires four fresh private-success proofs (Checked, Try-with-resources, Custom, Logging) on the publication line; they await the single authorized browser evidence-write retry. T25 uses the minimum profile through per-topic `owner-essential-qa.json`. Critic and reconciliation files were not authored here.
- Public regression `authoring/evidence/java-foundations/exceptions-and-logging/public-regressions.mjs` binds the shipped page/engine bytes and proves token/no-op/Reset state, post-settle budget refusal, post-pass invalidation/recovery, exact five-page engine identity, bounded Java literal diagnostics, token-oracle removal, Activity 4 static/print parity and composed-production controls. Browser QA separately proves starter/invalid construction stays unassessed and cannot expose or consume the output check.
- No independent education or Java-SME recheck is required for the minimum release; earlier reviews of older bytes are not claimed for these bytes.
