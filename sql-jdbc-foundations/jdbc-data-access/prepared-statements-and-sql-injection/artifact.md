# Prepared statements and SQL injection

## Objectives

- Explain how a value concatenated into SQL text can change what the statement does, and why a value bound to a ? parameter cannot
- Rewrite a concatenated JDBC query as a PreparedStatement with ? placeholders and 1-based setter calls
- Choose executeQuery for a SELECT and executeUpdate for INSERT, UPDATE or DELETE, and read the row count executeUpdate returns

## Teaching

### Start with a guess

A search box sends the city a user types to `findByCity`. Practice prediction, not scored.

```
String sql = "SELECT id, name, city FROM customers WHERE city = '"
    + city + "'";
```

### Text or value

Concatenation pastes the typed value into the SQL text, and the database parses whatever text arrives. A quote in the value ends the string literal early, and the rest is read as SQL. That is SQL injection.

With a `?` placeholder the SQL text is fixed before any value exists. The value is sent separately and is only ever a value, never SQL. OWASP lists these parameterized queries as the first defense.

### Bind every value

```
String sql = "SELECT id, name, city FROM customers WHERE city = ?";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, city);
    try (ResultSet rs = ps.executeQuery()) {
        // map rows as before
    }
}
```

Calling `prepareStatement` is not enough on its own: if the text was built with `+`, the injection is already in it. Write `?` without quotes, then bind each value with a setter. Parameter numbers start at 1 and follow the placeholders from left to right. Bind before you execute.

### Query or update

`executeQuery` runs a `SELECT` and returns a `ResultSet`. `executeUpdate` runs `INSERT`, `UPDATE` or `DELETE` and returns an `int`: the number of rows changed. Zero rows is not an error.

## Model

What the database receives (simulated: no Java or database runs here)

### customers

- 1, Amara, Leeds
- 2, Bo, York
- 3, Chidi, Leeds

### Last statement

Nothing sent yet.

Rows returned: none yet.

## Recap

- A concatenated value becomes SQL text and can change what the statement does; a bound `?` value cannot.
- Fixed text with `?`, then `setString`, `setInt` or `setLong` from index 1, then execute.
- `executeQuery` for `SELECT`; `executeUpdate` for changes, returning the row count.

Next topic: Transactions and ACID

## Cheat sheet

|  |  |
| --- | --- |
| Need | Write |
| A typed value in SQL | `... WHERE city = ?` then `ps.setString(1, city)` |
| Two values | `VALUES (?, ?)` then setters 1 and 2 |
| Rows back | `ps.executeQuery()` |
| Rows changed | `int n = ps.executeUpdate()` |

Optional time: about 3 minutes, in addition to the topic time

Success criteria: the statement text has two placeholders and each value has its own setter with the right index.

The project's `save` inserts a name and a city. Write the SQL text with placeholders and the two setter calls, in order. Nothing here is checked or counted.

Your insert (optional) String sql = "INSERT INTO customers (name, city) VALUES ..."; // setters:

## Sources

Checked against these live official sources on 2026-11-09 for Java SE 25 and pgJDBC 42.7. This page never runs Java, JDBC or a database: the explorer and the editor checks are simulated, and the editor checks patterns in your text rather than compiling it.

- The Java Tutorials: Using Prepared Statements
- Java SE 25 API: PreparedStatement
- OWASP SQL Injection Prevention Cheat Sheet
- pgJDBC: Issuing a Query and Processing the Result

## Static interaction alternatives

### predict

Prediction (practice, not scored): the city x' OR '1'='1 is concatenated into WHERE city = '...'. The text becomes WHERE city = 'x' OR '1'='1', and '1'='1' is true for every row, so all three customers come back. It is not treated as a city name, PostgreSQL does not reject it, and Java does not escape quotes for you.

### explore

Activity: the same typed values sent two ways. Concatenated Leeds: WHERE city = 'Leeds', 2 rows. Concatenated x' OR '1'='1: WHERE city = 'x' OR '1'='1', every row, because the quote ended the string and OR '1'='1' became SQL. Concatenated St. John's: the quote ends the string early and the leftover text is a syntax error. Bound with ?: the SQL text stays WHERE city = ? and the value is compared as a whole string, so x' OR '1'='1 and St. John's each return 0 rows with no error.

### terminal

Editor activity: rewrite findByCity so the SQL text is SELECT id, name, city FROM customers WHERE city = ? with an unquoted placeholder, call ps.setString(1, city) after prepareStatement and before executeQuery, and open the ResultSet in its own try inside the PreparedStatement try. A quoted '?' is a literal question mark, not a parameter; index 0 is out of range because parameters start at 1; keeping + city in the text keeps the injection even inside prepareStatement.

### mcq

Apply question: executeUpdate for a DELETE that matches no row returns 0 and throws nothing; a row count of 0 is a normal result the repository can check. Retry: executeUpdate runs the UPDATE and returns how many rows changed; executeQuery is for statements that return rows.
