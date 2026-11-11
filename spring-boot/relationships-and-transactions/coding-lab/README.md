# Relationships and Transactions lab: sessions, bookings and the N+1 trap

## Goal

Workshops get sessions, and sessions take bookings.
Four linked tasks: map the one-to-many/many-to-one pair, make the booking write-pair transactional, fix an N+1 listing with a fetch join, and serve a lazy collection from a read-only transaction.

## What you edit

| File | Tasks |
| --- | --- |
| `starter/src/main/java/bookings/Workshop.java` | 1 |
| `starter/src/main/java/bookings/Session.java` | 1 |
| `starter/src/main/java/bookings/BookingService.java` | 2 |
| `starter/src/main/java/bookings/WorkshopRepository.java` | 3 |
| `starter/src/main/java/bookings/WorkshopService.java` | 3, 4 |

Everything else (controller, DTO records, `data.sql`) is complete and stays as shipped.

## Prerequisites

JDK 25 and Apache Maven 3.9 or later (`java -version`, `mvn -v`; both must report Java 25).

## Setup (once, needs the internet)

From the lab's `starter` folder:

```
mvn -q dependency:go-offline
```

## Tasks

Run the one test command from the `starter` folder after each task:

```
mvn -q -o test
```

Until Task 1 is done the context cannot start and every test reports the same error; that is the shipped state.

### Task 1: map both sides of the relationship

The `session` table holds the `workshop_id` foreign key, so `Session` is the owning side:
in `Session.java`, annotate the `workshop` field with `@ManyToOne(fetch = FetchType.LAZY)`.
In `Workshop.java`, mirror it on the inverse side: annotate `sessions` with `@OneToMany(mappedBy = "workshop")`.
The shipped `addSession` helper keeps both sides in sync; `data.sql` seeds three workshops and three sessions.
Done when `task1MapsTheRelationshipAndServesASession` no longer fails.

### Task 2: two writes that stand or fall together

`BookingService.book` reserves seats, then records the booking.
Run the tests and read the failure: overbooking session 1 leaves it with **-87 seats** and no booking row, because each repository write committed on its own before the check threw.
Mark the method `@Transactional` (`org.springframework.transaction.annotation.Transactional`); the unchecked exception now rolls both writes back.
Done when `task2RollsBackTheFailedBooking` no longer fails.

### Task 3: fix the N+1 summary

`GET /workshops/summary` reads every workshop, then each workshop's lazy `sessions` inside the loop: 1 query + 1 per workshop.
The test proves it with Hibernate statistics (`collection fetch count`).
Declare the fetch-join query from the TODO in `WorkshopRepository.java` and call it from `summaries()`; parents and children then arrive in one statement.
(Uncomment `spring.jpa.show-sql=true` to watch the queries collapse; note a collection fetch join is not safely combinable with pagination - this listing is unpaged.)
Done when `task3LoadsTheSummariesWithoutNPlusOne` no longer fails.

### Task 4: lazy loading needs an open session

`GET /workshops/1/sessions` fails with `LazyInitializationException`: `sessionsOf` touches the lazy collection, but with `spring.jpa.open-in-view=false` (deliberate, see `application.properties`) no Hibernate session is open outside a transaction.
Annotate `sessionsOf` with `@Transactional(readOnly = true)` so the collection loads while the session is still open.
Done when `task4ServesLazySessionsFromAReadOnlyTransaction` no longer fails.

## Test

```
mvn -q -o test
```

from the `starter` folder.
When you finish, the command prints nothing and exits with status 0.
The tests check responses plus Hibernate's query statistics; they never read your source.

## Expected output

`expected/test-summary.txt` shows the surefire summary of a completed run.

## Offline note

Only the setup step uses the network. H2 runs in memory inside the test JVM.

## Cleanup

The lab writes only `starter/target`:

- macOS and Linux: `rm -rf target`
- Windows PowerShell: `Remove-Item -Recurse -Force target`

## Troubleshooting

- **`Could not determine recommended JdbcType for 'java.util.List<bookings.Session>'`**: Task 1 is not done; Hibernate is treating the association fields as columns.
- **`mappedBy reference an unknown target entity property`**: the `mappedBy` value must name the field on the owning side: `workshop`.
- **`LazyInitializationException`**: a lazy association was touched with no transaction open - that is Task 4's lesson.
- **`mvn -v` shows a Java version other than 25**: set `JAVA_HOME` to your JDK 25 folder and open a new terminal.
