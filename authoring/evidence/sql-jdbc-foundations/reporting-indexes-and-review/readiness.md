# Readiness receipt: reporting-indexes-and-review

Learner pages: six. The catalog-only lab brief `jdbc-data-access-project` is excluded from this count and is not authored here.

## 1. Canonical artifacts

All six topics have one standalone HTML page in the canonical learner tree, with generated Markdown companions. The four non-review topics have seven-item formative GIFT banks; the two review topics retain their cataloged not-applicable reason. The indexes bank's query-design item is conceptual and non-executable.

## 2. Shared template and behavior

The common page engine is byte-identical across all six HTML files: sha256 `7e86c0c17347e70fe546b508d132195bedf70ba1a9bb069d50f07788904bdc24`. It preserves activity state across navigation, restarts only the current activity, distinguishes settled access from successful completion, shows an incomplete recap after a settled miss, and restores completion only after a genuine pass. The indexes checker additionally invalidates a credited pass immediately after a token-meaningful edit, preserves byte-identical and token-equivalent no-op edits, and locks a settled failed run until Restart without changing its attempts, zero credit or zero grade. Page-specific code is limited to page data plus the indexes checker and JDBC injection explorer.

## 3. Sources and technical proof

All six source receipts were fetched live from official PostgreSQL, Java, pgJDBC and OWASP documentation on 7 November 2026. PostgreSQL 18 bindings cover skip scan and index-only visibility-map qualifications. The bounded PostgreSQL 17.5 probe passed 22 assertions for the module's subquery, CTE, window, join, aggregate, EXPLAIN, transaction and index claims; a fresh PGlite PostgreSQL probe also accepted a schema-qualified function-call index expression, while the page truthfully leaves that legal expression form unassessed.

## 4. Learner safety and accessibility

The pages remain standalone, offline, no-JavaScript readable, print-complete and sandbox-compatible. Objectives, progressive hints, fit boundaries, activity checks, Previous/Next navigation and current-only Restart remain present. Public QA contains only starter, malformed, incomplete, unsupported or nonpassing SQL for the answer-sensitive indexes activity. Legal-but-unmodelled PostgreSQL forms report **Not supported** and remain unassessed.

## 5. Focused regression coverage

The six `wrongTwice` routes assert settled activity state without completion or credit and assert page completion remains false while the settled recap is visible. The indexes Restart route additionally proves a post-settlement run cannot mutate the two-attempt frontier or restore completion, credit or grade before Restart. The query-plans success route proves complete → Restart → incomplete → wrong retry → correct repass → complete. Indexes simulator edges cover `ONLY`, schema qualification, unqualified and schema-qualified expressions, operator classes and `COLLATE` as unsupported; JDBC edges cover ordinary, quote-bearing and doubled-quote values without treating noncanonical text as a successful injection.

## 6. Remaining gate

The transferred independent education and SQL/JDBC-SME approvals cover unchanged regions from the reviewed safe checkpoint. Focused fresh role review is still required for the final changed bytes: shared completion semantics, indexes checker/GIFT, JDBC explorer, query-plan hint/navigation, subquery aggregate explanation, source/timing bindings and regenerated companions. T25 is expected to remain the only review-process failure until that evidence is supplied by the independent roles. The current private indexes success-proof identity and exact five public-byte bindings are recorded only in `indexes/qa-receipt.json`; its successful input and derivatives remain outside repository and reviewer surfaces.

No hard learner blocker is currently known for answer exposure, inaccessible controls, external dependency, broken navigation/state, hidden required content or horizontal overflow. Video/PDF companions and the planned module coding lab remain deferred for the reasons in each topic manifest.
