# Review: JDBC

## Objectives

- Retrieve and apply the steps to query a database from Java: get a Connection, prepare a statement, execute it, read the ResultSet and close resources with try-with-resources
- Explain why a PreparedStatement with ? parameters prevents SQL injection where string concatenation does not
- Decide when to group statements in one transaction with setAutoCommit(false), commit and rollback

## Teaching

Answer from memory first. This is the shape of a JDBC query from the project, reading `customers(id, name, city)`:

```
String sql = "SELECT id, name FROM customers WHERE city = ?";
try (Connection conn = DriverManager.getConnection(url, user, password);
     PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, city);
    try (ResultSet rs = ps.executeQuery()) {
        while (rs.next()) {
            System.out.println(rs.getInt("id") + " " + rs.getString("name"));
        }
    }
}
```

A `ResultSet` cursor starts before the first row. `next()` moves it to the next row and returns `false` when no rows remain; only then can getters such as `getString("name")` read the current row. `executeQuery` returns a result set; `executeUpdate` returns the number of rows changed.

Two ways to put a city typed by a user into the query:

```
// Concatenation: the value becomes part of the SQL text
String sql = "SELECT id, name FROM customers WHERE city = '" + city + "'";
// Parameter: the SQL text is fixed; the value is bound separately
PreparedStatement ps = conn.prepareStatement(
    "SELECT id, name FROM customers WHERE city = ?");
ps.setString(1, city);
```

SQL injection happens when typed input changes the meaning of the SQL text itself.

With a `PreparedStatement`, the SQL text with its `?` placeholders is fixed before any value arrives. Each `setString` or `setInt` binds a value to a placeholder, and the database treats it only as a value, never as SQL. The OWASP SQL Injection Prevention Cheat Sheet names this, parameterized queries, as the first defense.

A new connection is in auto-commit mode: each statement is committed as soon as it completes. When several statements must succeed or fail together, turn auto-commit off and end the transaction yourself:

```
conn.setAutoCommit(false);
try {
    debit.executeUpdate();   // take 50 from account A
    credit.executeUpdate();  // add 50 to account B
    conn.commit();
} catch (SQLException e) {
    conn.rollback();
    throw e;
}
```

If the second update fails, `rollback()` undoes the first, so no money disappears.

## Model

The model: each JDBC object comes from the one before it. `DriverManager` gives a `Connection`, the connection prepares a `PreparedStatement`, executing it gives a `ResultSet`, and the result set is a cursor you move with `next()`.

## Recap

- Connection, then `prepareStatement`, then setters, then `executeQuery`, then `while (rs.next())` with getters; try-with-resources closes them in reverse order.
- Concatenated input can change the SQL text; a `?` parameter is bound as a value and can never become SQL.
- Use `setAutoCommit(false)`, `commit()` and `rollback()` when several changes must succeed or fail together.

Next: the SQL module check

## Cheat sheet

Where to act: The first two steps of each option, then the step that reads columns.

Next step: Ask which object each method belongs to: a step can only run once the object it is called on exists, and a getter needs a current row.

A clerk reads instructions aloud to a warehouse crew: "Send the parcel to" followed by whatever the customer wrote on the form. One customer writes an address that ends "and also open the safe". Another clerk instead hands the crew a fixed instruction card with a blank box, and staples the customer's form to it; whatever the form says, it is only ever an address.

Reading input as part of the instructions lets it change them; attaching it as a separate value keeps it data.

Where to act: The City typed by the user field.

Next step: A real city such as `O'Fallon` already contains a quote; type one like it, then look at where the concatenated string literal now ends.

Where to act: The work described after Work:.

Next step: Count the changing statements, then imagine the program crashing between two of them: would the data be left half done?

Optional time: about 10 minutes, in addition to this topic's time.

In your JDBC project, add a repository method that saves an order and its items. Use only the steps on this page: one connection, prepared statements with `?` parameters, `setAutoCommit(false)`, `commit` and `rollback`, and try-with-resources.

Success criteria: when an item insert fails, for example because of a constraint, neither the order nor any of its items remains in the database, and every resource is closed.

|  |  |
| --- | --- |
| Connect | `DriverManager.getConnection(url, user, password)` |
| Prepare and bind | `conn.prepareStatement("… WHERE city = ?")`, `ps.setString(1, city)` |
| Read rows | `try (ResultSet rs = ps.executeQuery()) { while (rs.next()) { … } }` |
| Change rows | `int changed = ps.executeUpdate();` |
| Transaction | `conn.setAutoCommit(false); … conn.commit();` or `conn.rollback();` |

## Sources

Claims on this page were checked against the live official documentation below on 16 October 2026 (UTC), for Java SE 25 and the PostgreSQL JDBC driver. Links open outside this lesson.

- Processing SQL Statements with JDBC: the steps, and closing with try-with-resources.
- The try-with-resources Statement: resources close in the opposite order of their creation.
- ResultSet (Java SE 25): the cursor starts before the first row; `next`.
- PreparedStatement (Java SE 25): setters, `executeQuery` and `executeUpdate`.
- Connection (Java SE 25): auto-commit by default, `setAutoCommit`, `commit` and `rollback`.
- Using Transactions.
- pgJDBC: Issuing a Query and Processing the Result.
- OWASP SQL Injection Prevention Cheat Sheet: prepared statements with parameterized queries.

## Static interaction alternatives

### predict

Retrieval prediction (practice, not scored): the try-with-resources blocks open conn, then ps, then rs. Options: rs, then ps, then conn, each as its block ends, even if an exception is thrown (correct: resources close in the opposite order of their creation); conn, then ps, then rs (wrong: that is the opening order); only conn, because closing it is enough (wrong: try-with-resources closes every declared resource); nothing until garbage collection (wrong: try-with-resources closes them when the block ends).

### mcq

Apply question: the JDBC query steps in order. Correct: get a Connection from DriverManager, prepare the statement on it, set the ? parameters, executeQuery, move with rs.next() and read the columns, close with try-with-resources. Wrong: preparing the statement before getting the connection (prepareStatement is a Connection method); executing before setting parameters (each ? needs a value first); reading columns before rs.next() (the cursor starts before the first row). Retry form: a getter called straight after executeQuery fails because rs.next() was never called to move to the first row.

### explore

Injection explorer. The concatenated query puts the typed city inside quotes in the SQL text. For Lyon the text is SELECT id, name FROM customers WHERE city = 'Lyon'. For a value with a quote, such as O'Fallon, the quote ends the string literal early and the rest of the value is read as SQL, so the statement is malformed; a crafted value such as x' OR '1'='1 turns the condition into city = 'x' OR '1'='1', which is true for every customer. The prepared statement's SQL text is always SELECT id, name FROM customers WHERE city = ?, and parameter 1 is bound to the exact typed text as one string value.

### mcq

Apply question: why a bound ? value cannot change the query. Correct: the SQL text is fixed with its placeholders, and the value is sent separately and treated only as data. Wrong: PreparedStatement deletes quote characters from values (it keeps the value exactly); it rejects values that contain SQL keywords (it does not inspect values); it is safe because prepared statements run faster (speed has nothing to do with it). Retry form: conn.prepareStatement with the city concatenated into the SQL text is still open to injection, because the value is part of the text before preparing.

### drag

Sorting activity. Move 50 from account A to account B with two updates: one transaction. Insert an order row and its three item rows: one transaction. Delete a user, then that user's sessions: one transaction. Read one customer's name: auto-commit is enough. Change one customer's email with a single UPDATE: auto-commit is enough, because one statement is already all or nothing.
