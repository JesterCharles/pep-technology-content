# Streams over data loaded from the database

## Objectives

- Load rows from a JDBC ResultSet into a list of records, then process that list with a stream pipeline of filter, map, sorted and collect open
- Distinguish lazy intermediate operations from terminal operations, and predict the error when a stream is reused after its terminal operation open
- Decide whether a given filter or aggregation belongs in the SQL query (WHERE, GROUP BY, HAVING) or in the stream, using the rule: reduce rows in SQL when the program needs only the reduced result; process in the stream when the rows are already loaded for another use or the logic exists only in Java open

## Teaching

A stream pipeline has `filter` and `map` but no terminal operation yet. Predict what has happened to the source list.

Move a `ResultSet` cursor with `next()`, which returns false after the last row. For each row, read its columns, build a record and add it to a list. A stream over that list then filters, maps and sorts in memory; `toList` or `collect` produces the result.

Intermediate operations return a new stream and do no work yet; a terminal operation such as `toList` or `count` traverses the source. A stream may be used only once: the API allows `IllegalStateException` on reuse, and the JDK throws it. Create a new stream to traverse again.

`WHERE` removes rows, `GROUP BY` forms groups for aggregates, and `HAVING` filters groups. Reduce in SQL when the program needs only the reduced result; use the stream when rows are already loaded for another use or the logic exists only in Java.

## Recap

- Turn ResultSet rows into records, then stream the list.
- Intermediate stages are lazy; reusing a stream throws.
- Reduce in SQL unless rows are loaded or logic is Java-only.

Goals show done only after their checks pass; Evolv records completion.

## Cheat sheet

Loading rows is like unloading a delivery into labeled bins. A stream pipeline is a pick list for those bins: circle eligible items, relabel them, then order them. Nothing is picked until someone submits the final request.

Load first: the loop condition is the call that moves the cursor; inside, read the three columns and add one Order.

Another hint Hint 2 of 2

Then the pipeline: filter compares status with "OPEN" using equals, map turns an Order into its code, and sorted orders the codes.

## Sources

Official sources checked live on 2026-10-16 for Java SE 25.

- ResultSet API
- Stream API
- java.util.stream package
- PostgreSQL table expressions (WHERE, GROUP BY, HAVING)

## Static interaction alternatives

### predict

Choose what has happened when a pipeline has filter and map but no terminal operation, then read the explanation printed under every option.

### terminal

Given: record Order(code, status, cents) and a ResultSet rs with five rows (A-109 OPEN 1200, A-101 SHIPPED 800, A-104 OPEN 450, A-117 CANCELLED 300, A-102 OPEN 990). Write a while (rs.next()) loop that adds an Order per row to rows, then a rows.stream() pipeline that keeps OPEN orders, maps to code and sorts. Expected openCodes: [A-102, A-104, A-109].

### mcq

Using the three-line snippet, choose the line where traversal starts, record confidence, then compare the explanation printed under every option.

### mcq

Predict what big.count() does after big was used on line 2, record confidence, then compare the explanation printed under every option.

### mcq

Report needs only customers whose OPEN totals exceed 50000 cents. SQL or stream?

### mcq

Orders already loaded for a table; also show the OPEN count. SQL or stream?

### mcq

Flag orders with a Java-only method. SQL or stream?
