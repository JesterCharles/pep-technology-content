# Connecting Java to Postgres with JDBC

## Objectives

- Build a jdbc:postgresql URL from host, port and database, reading the settings from environment variables rather than hard-coding them
- Diagnose a failed connection from its message: missing driver, refused host and port, unknown database or rejected password
- Read query results by moving the ResultSet cursor with next() and mapping each row's columns into a Java object

## Teaching

### Start with a guess

Until now you ran SQL in `psql`. From here on, a Java program sends the same SQL. Practice prediction, not scored.

### Driver, URL and settings

JDBC is the `java.sql` API: interfaces such as `Connection`, `PreparedStatement` and `ResultSet`. A driver implements them for one database. For PostgreSQL that is pgJDBC, the Maven dependency `org.postgresql:postgresql`. Without it, `DriverManager` finds no driver for the URL and throws an `SQLException`.

```
String url = "jdbc:postgresql://" + System.getenv("PGHOST")
    + ":" + System.getenv("PGPORT") + "/" + System.getenv("PGDATABASE");
Connection conn = DriverManager.getConnection(
    url, System.getenv("PGUSER"), System.getenv("PGPASSWORD"));
```

The URL names the host, port and database. The project reads every setting from an environment variable, so the same code reaches your database and the tests' throwaway database, and no password is written in the code or committed to Git.

### Rows come back through a cursor

```
try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(
         "SELECT id, name, city FROM customers ORDER BY id");
     ResultSet rs = ps.executeQuery()) {
    while (rs.next()) {
        customers.add(new Customer(
            rs.getLong("id"), rs.getString("name"), rs.getString("city")));
    }
}
```

A `ResultSet` is a cursor that starts before the first row. `next()` moves it one row on and returns `false` once no rows remain. Getters such as `getString("name")` read a column of the current row. Turning each row into a `Customer` is called mapping.

### Apply it: read the error first

Each failure names its cause: a missing driver, a refused host and port, an unknown database or a rejected password.

## Model

Settings and results (simulated: no Java or database runs here)

### Environment variables

- `PGHOST=localhost`
- `PGPORT=5432`
- `PGDATABASE=shop`
- `PGUSER=shop_app`
- `PGPASSWORD` set, not shown

### Program state

No connection yet.

Built URL: `jdbc:postgresql://localhost:5432/shop`

## Recap

- pgJDBC is the driver; without the dependency, `DriverManager` reports "No suitable driver found".
- The URL is `jdbc:postgresql://host:port/database`; build it from environment variables, never from hard-coded values or a committed password.
- Call `next()` before reading a row; map each row's columns into a new Java object until `next()` returns `false`.

Next topic: Prepared statements and SQL injection

## Cheat sheet

|  |  |
| --- | --- |
| Message starts with | Look at |
| `No suitable driver found` | The pgJDBC dependency, or a typo in `jdbc:postgresql:` |
| `Connection to ... refused` | `PGHOST`, `PGPORT`, and whether PostgreSQL is running |
| `FATAL: database ... does not exist` | `PGDATABASE` and the database name in the URL |
| `FATAL: password authentication failed` | `PGUSER` and `PGPASSWORD` |

Optional time: about 3 minutes, in addition to the topic time

Success criteria: your helper builds the URL only from environment variables and says which variable is missing.

Sketch a small `Db.connect()` helper for the project. If `System.getenv("PGHOST")` returns `null`, the URL would contain the text `null`. Write how your helper stops early with a clear message naming the missing variable. Nothing here is checked or counted.

Your helper sketch (optional) static Connection connect() throws SQLException { // read PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD }

## Sources

Checked against these live official sources on 2026-11-09 for Java SE 25 and the PostgreSQL JDBC driver (pgJDBC 42.7). This page never runs Java, JDBC or a database: connections, rows and messages are simulated, and message wording is shortened from the driver and server.

- The Java Tutorials: Establishing a Connection
- The Java Tutorials: Retrieving and Modifying Values from Result Sets
- Java SE 25 API: DriverManager
- Java SE 25 API: ResultSet (cursor before the first row, next())
- pgJDBC: Initializing the Driver (Maven coordinates, connection URL)

## Static interaction alternatives

### predict

Prediction (practice, not scored): a project without the pgJDBC dependency calls DriverManager.getConnection with a jdbc:postgresql URL. Answer: it compiles, then throws SQLException: No suitable driver found, because java.sql is part of the JDK but no PostgreSQL driver is on the classpath. It is not a compile error, the JDK ships no PostgreSQL driver, and JDBC never runs psql.

### explore

Activity: connection attempts. Correct settings: connected to database shop at localhost:5432. PGPORT=5433: Connection to localhost:5433 refused, because nothing accepts connections on that port. PGDATABASE=shopp: FATAL: database "shopp" does not exist. Wrong PGPASSWORD: FATAL: password authentication failed for user "shop_app". pgJDBC missing from pom.xml: No suitable driver found for jdbc:postgresql://localhost:5432/shop.

### explore

Activity: step through a ResultSet of three rows (1 Amara Leeds, 2 Bo York, 3 Chidi Leeds). The cursor starts before row 1, so reading first fails with: ResultSet not positioned properly, perhaps you need to call next. Each next() returns true and moves to rows 1, 2 and 3; each row is mapped with getLong("id"), getString("name") and getString("city") into a Customer. The fourth next() returns false and the loop ends with three customers.

### mcq

Apply question: tests export PGDATABASE=shop_test but fail with FATAL: database "shop" does not exist. Cause: the URL hard-codes shop instead of reading PGDATABASE. A missing driver says No suitable driver found; a wrong password says password authentication failed; a stopped server gives Connection refused. Retry: Connection to localhost:5433 refused means nothing accepts connections at that host and port, so check PGPORT and that PostgreSQL is running.
