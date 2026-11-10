# Testing a repository against a provided test database

## Objectives

- Explain why repository tests run against a separate, freshly created test database rather than the development database
- Read a failing repository test's expected and actual values to locate the bug in the SQL or the row mapping
- Order the test database lifecycle: create the database, apply the schema and seed data, run the tests, close connections and drop the database

## Teaching

### Start with a guess

A JUnit test for the JDBC repository points at your everyday database, `shop`, which already holds three customers. Practice prediction, not scored.

```
repo.save(new Customer(0, "Dee", "Hull"));
assertEquals(1, repo.findAll().size());
```

### A database just for the tests

Tests that share your development database depend on whatever rows happen to be there, and can change or delete them. A test-database helper, like the one the project provides, avoids both: it creates a uniquely named database, applies `schema.sql` and the seed rows, runs the tests against it, then drops it.

Order matters. A table cannot be created in a database that does not exist yet, and PostgreSQL refuses to drop a database while connections to it are still open.

### Read the failure

A failed `assertEquals(expected, actual)` prints `expected: <x> but was: <y>`. The expected value is what the test wanted; the actual value is what your repository returned. Ask where that actual value came from, then follow it back to the SQL, the setter or the mapping line.

### Apply it: why a fresh database

A repository test is only useful if it gives the same result on every machine and every run.

## Model

Test run state (simulated: no Java, JUnit or database runs here)

### Test database

shop (development): 3 customers

### Evidence

No test run yet.

```
No step run yet.
```

## Recap

- Run repository tests against a fresh, uniquely named test database, never your development data.
- Use the expected and actual values, plus the stored data, to decide whether the bug is in the SQL, a setter or the mapping.
- Create the database, apply the schema and seed, run the tests, close connections, then drop it.

Next: the F23 JDBC data access project, where you build and test the real JDBC repository with these steps.

## Cheat sheet

|  |  |
| --- | --- |
| Message | Usually means |
| `FATAL: database ... does not exist` | The test database was not created yet |
| `relation "customers" does not exist` | The schema was not applied |
| `expected: <3> but was: <0>` | The seed rows were not inserted, or a filter matches nothing |
| `is being accessed by other users` | A connection is still open; close it before dropping |

Optional time: about 3 minutes, in addition to the topic time

Success criteria: your test name and assertion would fail for exactly one bug and pass once it is fixed.

Write a test for `deleteById`: arrange with a seed customer, act by deleting it, and assert one thing that proves it is gone. Nothing here is checked or counted.

Your test sketch (optional) @Test void deleteById_removesTheCustomer() { // arrange, act, assert }

## Sources

Checked against these live official sources on 2026-11-09 for PostgreSQL 18 and JUnit Jupiter. This page never runs Java, JUnit, JDBC or a database: the lifecycle, messages and test failures are simulated and shortened.

- PostgreSQL: CREATE DATABASE
- PostgreSQL: DROP DATABASE (not while connected)
- JUnit User Guide: assertions and test lifecycle

## Static interaction alternatives

### predict

Prediction (practice, not scored): the development database already has 3 customers, so after saving one, findAll returns 4 and the test fails with expected: <1> but was: <4>. The test is not isolated: its result depends on data it did not create, and it also left a new row in your development database.

### explore

Activity: the test database lifecycle, in order: CREATE DATABASE shop_test_7f3a; apply schema.sql; insert the seed rows; run the tests; close connections; DROP DATABASE shop_test_7f3a. Too early: applying the schema first gives FATAL: database "shop_test_7f3a" does not exist; seeding before the schema gives ERROR: relation "customers" does not exist; running the tests before seeding gives expected: <3> but was: <0>; dropping with a connection still open gives ERROR: database "shop_test_7f3a" is being accessed by other users.

### explore

Activity: locate two bugs. Test 1: assertEquals("Leeds", found.city()) fails with expected: <Leeds> but was: <Amara>, while psql shows the row stored as name Amara, city Leeds; the data is stored correctly, so the row mapping reads name into city. Test 2: findByCity("Leeds") expects 2 and gets 0, while the seed has two Leeds rows; the setter binds the literal text "city" instead of the city variable.

### mcq

Apply question: a fresh, uniquely named test database gives every run the same known starting data and never reads or changes the development database; a unique name also keeps parallel or leftover runs apart. PostgreSQL does not require it, it is not faster than an in-memory fake, and no production data is copied. Retry: give each test a known starting state, for example recreate or clean the data before each test, instead of depending on test order.
