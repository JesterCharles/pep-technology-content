# The N+1 query problem: spotting it in SQL logs

## Objectives

- Recognize the N+1 pattern in a SQL log: one query for the parents followed by one query per parent for its children
- Count the queries a listing endpoint issues for a given number of rows from the log or Hibernate statistics
- Explain why N+1 stays hidden with small test data and grows with real data

## Teaching

A listing endpoint loads 3 workshops, then reads each one's lazy sessions while mapping to DTOs:

```
for (Workshop w : workshopRepository.findAll()) {
  dtos.add(new WorkshopDto(w.getTitle(), w.getSessions().size()));
}
```

N+1 means 1 query for the parents, followed by N queries for children, one per parent. The log shows a repeating statement with a different bound value each time.

```
select w1_0.id,w1_0.title from workshops w1_0
select s1_0.workshop_id,s1_0.id from sessions s1_0 where s1_0.workshop_id=?
select s1_0.workshop_id,s1_0.id from sessions s1_0 where s1_0.workshop_id=?
select s1_0.workshop_id,s1_0.id from sessions s1_0 where s1_0.workshop_id=?
```

The statement is identical each time. Only the bound value changes.

With 3 rows, N+1 costs four quick queries, and tests pass. With 1,000 rows, it costs 1,001 round trips per request, so the time grows with the data.

Count queries rather than guess: read the SQL log, or turn on Hibernate statistics:

```
spring.jpa.properties.hibernate.generate_statistics=true
```

Statistics report `JDBC statements` per session, which makes a clear before-and-after number.

An integration test with 2 rows shows 3 queries and passes in 40 ms. In staging, with 8,000 rows, the same endpoint times out.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- N+1 is one parent query followed by one child query per parent.
- Identical statements with changing bound values are the signature in the log.
- Small test data hides it, so count queries.

## Cheat sheet

Where to act: Compare the lines for one that repeats.

Next step: The first query returned the parents. Which statement repeats once per parent?

Where to act: Change the Rows control and read the total.

Next step: The total is always one more than the number of parents.

Printed alternative: 3 rows: 4 queries. 50 rows: 51 queries. 1,000 rows: 1,001 queries. 5,000 rows: 5,001 queries.

- Statistics: `spring.jpa.properties.hibernate.generate_statistics=true`.
- Total queries equal parents plus one.

## Sources

Status: unreviewed first draft, 2026-11-04. Sources were fetched live on 2026-11-04; no independent education or technology review has happened yet, so every claim here remains unverified by a reviewer.

- https://docs.spring.io/spring-boot/reference/features/logging.html
- https://docs.hibernate.org/orm/7.4/introduction/html_single/
- https://docs.hibernate.org/orm/7.4/userguide/html_single/

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. That is the N+1 pattern, with N equal to 3.
- **B. Not this one:** That needs an explicit fetch. Each lazy collection loads on its own.
- **C. Not this one:** A join happens only if you ask for one.
- **D. Not this one:** You also need the first query that returned the three workshops.

### mcq

**What each line shows**

- **Line 1 (leave):** This is the 1 in N+1: it returns the parents.
- **Line 2 (mark):** This loads sessions for workshop 1.
- **Line 3 (mark):** The same statement, for workshop 2.
- **Line 4 (mark):** The same statement, for workshop 3.
- **Line 5 (leave):** This is an unrelated write, not part of the listing pattern.

### explore

**Printed alternative:** 3 rows: 4 queries. 50 rows: 51 queries. 1,000 rows: 1,001 queries. 5,000 rows: 5,001 queries.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. The count formula matches the symptom. Confirm by counting statements on the slow endpoint.
- **B. Not this one:** A network issue would not explain the query growth with row count.
- **C. Not this one:** Threads do not change how many queries a request runs.
- **D. Not this one:** It grows too, but the repeated database round trips are the first thing to check.
