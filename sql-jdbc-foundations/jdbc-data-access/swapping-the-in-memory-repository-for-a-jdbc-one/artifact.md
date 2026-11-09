# Swapping the in-memory repository for a JDBC one

## Objectives

- Map between a table row and a Java object in both directions: bind fields to parameters when saving and read columns into a new object when finding
- Close the Connection, PreparedStatement and ResultSet with try-with-resources and state the order they close in
- Replace an in-memory repository with a JDBC implementation of the same interface so that only the line that constructs it changes

## Teaching

### Start with a guess

In the Java course, a service used a repository only through its interface, backed by a `HashMap`. Now the data moves into PostgreSQL. Practice prediction, not scored.

```
interface CustomerRepository {
    Optional<Customer> findById(long id);
    Customer save(Customer c);
}
// Main
var service = new CustomerService(new InMemoryCustomerRepository());
```

### Same interface, new storage

`JdbcCustomerRepository implements CustomerRepository`. Callers see no difference, so only the line that constructs the repository changes. JDBC methods throw the checked `SQLException`, which the interface does not declare: catch it inside the JDBC class and rethrow an unchecked exception of your own, such as `RepositoryException`.

Mapping runs both ways. `save` binds fields to parameters in placeholder order; `findById` reads columns into a new object.

### Close every resource

A `Connection`, `PreparedStatement` and `ResultSet` hold resources on the server until closed. Declare them in try-with-resources headers and Java closes them when the block ends, even when an exception is thrown, in the reverse order they were opened.

```
try (Connection conn = Db.connect();
     PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setLong(1, id);
    try (ResultSet rs = ps.executeQuery()) {
        // read the row
    }
}
```

A connection opened without it leaks on every call, until PostgreSQL refuses new connections.

### Apply it: close order

Resources close in the opposite order to the one they were opened in.

## Model

One interface, two implementations (simulated: no Java or database runs here)

### CustomerService

- uses `CustomerRepository` only
- unchanged by the swap

### Implementations

- `InMemoryCustomerRepository`: `HashMap`
- `JdbcCustomerRepository`: `customers` table

Open server resources: 0

## Recap

- Bind object fields to `?` parameters in placeholder order to save; read columns by label into a new object to find.
- Open the connection, statement and result set in try-with-resources; they close in reverse order, even on an exception.
- Implement the same interface and catch `SQLException` inside, so only the line that constructs the repository changes.

Next topic: Testing a repository against a provided test database

## Cheat sheet

|  |  |
| --- | --- |
| Method | JDBC shape |
| `findById` | `SELECT ... WHERE id = ?`, `setLong(1, id)`, `if (rs.next())` map, else `Optional.empty()` |
| `save` | `INSERT ... VALUES (?, ?)`, setters in column order, `executeUpdate()` |
| Every method | try-with-resources; `catch (SQLException e)` then rethrow unchecked |

Optional time: about 3 minutes, in addition to the topic time

Success criteria: your outline names the SQL, the setters in order and the resources in try-with-resources.

Outline `save(Customer c)` for the JDBC repository: the statement, the setters and the resources. Nothing here is checked or counted.

Your outline (optional) public Customer save(Customer c) { // SQL: // setters: }

## Sources

Checked against these live official sources on 2026-11-09 for Java SE 25. This page never runs Java, JDBC or a database: wiring and close order are simulated, and the editor checks patterns in your text rather than compiling it.

- The Java Tutorials: The try-with-resources Statement (reverse close order)
- Java SE 25 API: Statement.close also closes its current ResultSet
- Java SE 25 API: PreparedStatement setters
- The Java Tutorials: Processing SQL Statements with JDBC

## Static interaction alternatives

### predict

Prediction (practice, not scored): only the line in Main that constructs the repository changes, to new CustomerService(new JdbcCustomerRepository()). The service talks only to the interface, so its methods and constructor stay the same, and the interface does not need throws SQLException because the JDBC class catches it and rethrows an unchecked exception.

### explore

Activity: wire and map. Main constructs new CustomerService(new JdbcCustomerRepository()); the service still receives the interface. In save, INSERT INTO customers (name, city) VALUES (?, ?) binds customer.city() as parameter 2, because placeholders follow the column list. In findById, the id comes from rs.getLong("id"); column indexes start at 1, so getLong(0) is invalid, and the id column is a number, not a string.

### terminal

Editor activity: stop the leak in findById. Declare Connection conn = Db.connect() and PreparedStatement ps = conn.prepareStatement(...) in one try-with-resources header, call ps.setLong(1, id), then open ResultSet rs = ps.executeQuery() in its own try-with-resources, and keep catch (SQLException e) rethrowing RepositoryException. Plain local variables are never closed, so each call leaks a connection.

### mcq

Apply question: try-with-resources closes in reverse order of opening, so the ResultSet closes first (inner try ends), then the PreparedStatement, then the Connection. Retry: closing a Statement also closes its current ResultSet, so rs is closed when ps closes, but declaring it in try-with-resources keeps the intent clear.
