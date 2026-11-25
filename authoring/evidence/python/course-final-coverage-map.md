# Python course final MCQ: coverage map

Generated from `src/items.py` after correction loop 5 (bank sha256 `7c16d50a9ca619751029e8778e2ee65c593787e0cb0449c626416aa276189b58`). q26 and q29 were re-aimed in loops 3-5 to clear whole-set overlaps with checkpoint sfcp-q11 and sfcp-q13. Item ids are `py-final-qNN` in the bank.
Timing: about 40 s per easy item, 60 s per medium item and 80 s per hard item, so 9 x 40 + 12 x 60 + 9 x 80 = 1,800 s = 30 minutes.

## Topic coverage

| Module | Topic | Items | Fast track |
| --- | --- | --- | --- |
| python-fundamentals | python-syntax-for-java-developers | q01, q02 | full |
| python-fundamentals | functions-and-arguments | q07, q23 | full |
| python-fundamentals | lists-dicts-sets-and-tuples | q02, q03, q09 | full |
| python-fundamentals | slicing-and-comprehensions | q05, q10 | full |
| python-fundamentals | mutability-and-aliasing | q11, q30 | skim |
| python-fundamentals | modules-imports-and-virtual-environments | q15, q25 | full |
| python-fundamentals | exceptions-and-logging | q05, q12, q21, q23, q29 | skim |
| python-fundamentals | writing-and-running-script-files | q17 | skim |
| python-fundamentals | testing-with-pytest | q16, q17, q19, q24 | full |
| data-pipelines | reading-csv-and-json-files-with-generators | q01, q14, q30 | full |
| data-pipelines | connecting-to-postgres-from-python-with-psycopg | q20 | Standard only (S16); Fast reaches the facts used (with-block commit/rollback, `%s` placeholders) through the upsert, ELT and serving pages |
| data-pipelines | loading-into-a-staging-table-with-upserts | q20, q26, q27 | full |
| data-pipelines | elt-transforming-in-sql-after-loading | q22, q27 | skim |
| data-pipelines | cleaning-and-validating-records-with-pydantic-and-type-hints | q07, q13 | full |
| data-pipelines | deduplicating-in-sql-vs-in-python | q09, q22 | skim |
| data-pipelines | ai-enrichment-with-validated-outputs | q28 | full |
| data-pipelines | keeping-sensitive-data-out-of-prompts | q21 | skim |
| fastapi-services | fastapi-routes | q04, q08, q18 | full |
| fastapi-services | serving-pipeline-results-as-an-api | q18, q20, q24 | full |
| fastapi-services | calling-the-spring-boot-api-from-fastapi-service-url-token-and-timeouts | q06, q29 | full |
| fastapi-services | python-review | q30 | Standard only (S19); Fast reaches q30's deciding facts through mutability-and-aliasing and the generators page |

## Items

| Item | Loop-0 id | Band | Topics | Objectives claimed | Key check |
| --- | --- | --- | --- | --- | --- |
| q01 | q01 | easy | python-syntax-for-java-developers, reading-csv-and-json-files-with-generators | python-syntax-for-java-developers#o2 | executed |
| q02 | q02 | easy | python-syntax-for-java-developers, lists-dicts-sets-and-tuples | python-syntax-for-java-developers#o3, lists-dicts-sets-and-tuples#o3 | executed |
| q03 | q03 | easy | lists-dicts-sets-and-tuples | lists-dicts-sets-and-tuples#o2 | executed |
| q04 | q04 | easy | fastapi-routes | fastapi-routes#o1 | executed |
| q05 | q05 | easy | slicing-and-comprehensions, exceptions-and-logging | slicing-and-comprehensions#o3 | executed |
| q06 | q06 | easy | calling-the-spring-boot-api-from-fastapi-service-url-token-and-timeouts | calling-the-spring-boot-api-from-fastapi-service-url-token-and-timeouts#o1, calling-the-spring-boot-api-from-fastapi-service-url-token-and-timeouts#o2 | executed |
| q07 | q08 | easy | functions-and-arguments, cleaning-and-validating-records-with-pydantic-and-type-hints | functions-and-arguments#o3, cleaning-and-validating-records-with-pydantic-and-type-hints#o3 | executed |
| q08 | q09 | easy | fastapi-routes | fastapi-routes#o2 | executed |
| q09 | q16 | easy | deduplicating-in-sql-vs-in-python, lists-dicts-sets-and-tuples | deduplicating-in-sql-vs-in-python#o1, lists-dicts-sets-and-tuples#o1 | executed |
| q10 | q10 | medium | slicing-and-comprehensions | slicing-and-comprehensions#o1, slicing-and-comprehensions#o2 | executed |
| q11 | q11 | medium | mutability-and-aliasing | mutability-and-aliasing#o1, mutability-and-aliasing#o3 | executed |
| q12 | q13 | medium | exceptions-and-logging | exceptions-and-logging#o1, exceptions-and-logging#o2 | executed |
| q13 | q14 | medium | cleaning-and-validating-records-with-pydantic-and-type-hints | cleaning-and-validating-records-with-pydantic-and-type-hints#o1, cleaning-and-validating-records-with-pydantic-and-type-hints#o2, cleaning-and-validating-records-with-pydantic-and-type-hints#o3 | executed |
| q14 | q15 | medium | reading-csv-and-json-files-with-generators | reading-csv-and-json-files-with-generators#o3 | executed |
| q15 | q17 | medium | modules-imports-and-virtual-environments | modules-imports-and-virtual-environments#o3 | page-grounded |
| q16 | q18 | medium | testing-with-pytest | testing-with-pytest#o2 | executed |
| q17 | q19 | medium | writing-and-running-script-files, testing-with-pytest | writing-and-running-script-files#o2, writing-and-running-script-files#o3, testing-with-pytest#o1 | executed |
| q18 | q20 | medium | fastapi-routes, serving-pipeline-results-as-an-api | fastapi-routes#o2, serving-pipeline-results-as-an-api#o2 | executed |
| q19 | q23 | medium | testing-with-pytest | testing-with-pytest#o3 | executed |
| q20 | q27 | medium | serving-pipeline-results-as-an-api, loading-into-a-staging-table-with-upserts, connecting-to-postgres-from-python-with-psycopg | serving-pipeline-results-as-an-api#o2 | emulated |
| q21 | q28 | medium | keeping-sensitive-data-out-of-prompts, exceptions-and-logging | keeping-sensitive-data-out-of-prompts#o3, exceptions-and-logging#o3 | executed |
| q22 | q07 | hard | deduplicating-in-sql-vs-in-python, elt-transforming-in-sql-after-loading | deduplicating-in-sql-vs-in-python#o3 | emulated |
| q23 | q12 | hard | functions-and-arguments, exceptions-and-logging | functions-and-arguments#o1, functions-and-arguments#o2 | executed |
| q24 | q21 | hard | serving-pipeline-results-as-an-api, testing-with-pytest | serving-pipeline-results-as-an-api#o3, serving-pipeline-results-as-an-api#o2 | executed |
| q25 | q22 | hard | modules-imports-and-virtual-environments | modules-imports-and-virtual-environments#o1 | executed |
| q26 | q24 | hard | loading-into-a-staging-table-with-upserts | loading-into-a-staging-table-with-upserts#o2 | emulated (SQLite) and run on PostgreSQL 16.2 |
| q27 | q25 | hard | elt-transforming-in-sql-after-loading, loading-into-a-staging-table-with-upserts | elt-transforming-in-sql-after-loading#o2, elt-transforming-in-sql-after-loading#o3 | emulated rollback; text > integer rejection page-grounded |
| q28 | q26 | hard | ai-enrichment-with-validated-outputs | ai-enrichment-with-validated-outputs#o1, ai-enrichment-with-validated-outputs#o2, ai-enrichment-with-validated-outputs#o3 | executed |
| q29 | q29 | hard | calling-the-spring-boot-api-from-fastapi-service-url-token-and-timeouts, exceptions-and-logging | calling-the-spring-boot-api-from-fastapi-service-url-token-and-timeouts#o2 | executed |
| q30 | q30 | hard | python-review, mutability-and-aliasing, reading-csv-and-json-files-with-generators | python-review#o2, mutability-and-aliasing#o1 | executed |

Critic and reconciliation finding ids (`pyf-edu-NN`, `pyf-sme-NN`) refer to the loop-0 ids in the second column.
