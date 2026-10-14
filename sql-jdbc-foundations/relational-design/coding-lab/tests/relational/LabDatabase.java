package relational;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

/**
 * Creates the lab database on your local PostgreSQL server, loads schema.sql into it,
 * and drops it again when the tests finish.
 *
 * Connection settings come from the same environment variables psql uses:
 * PGHOST (default localhost), PGPORT (default 5432), PGUSER (default: your login name),
 * PGPASSWORD (optional) and PGDATABASE, the existing database used to run
 * CREATE DATABASE and DROP DATABASE (default postgres).
 */
final class LabDatabase {
    static final String LAB_DB = "relational_design_lab";

    private LabDatabase() {
    }

    private static String env(String name, String fallback) {
        String value = System.getenv(name);
        return value == null || value.isBlank() ? fallback : value;
    }

    private static Connection connect(String database) throws SQLException {
        String url = "jdbc:postgresql://" + env("PGHOST", "localhost") + ":" + env("PGPORT", "5432") + "/" + database;
        Properties props = new Properties();
        props.setProperty("user", env("PGUSER", System.getProperty("user.name")));
        String password = System.getenv("PGPASSWORD");
        if (password != null) {
            props.setProperty("password", password);
        }
        return DriverManager.getConnection(url, props);
    }

    private static void admin(String sql) throws SQLException {
        try (Connection c = connect(env("PGDATABASE", "postgres")); Statement s = c.createStatement()) {
            s.execute(sql);
        }
    }

    /** Recreates the lab database and opens a connection to it. */
    static Connection create() throws SQLException {
        try {
            admin("DROP DATABASE IF EXISTS " + LAB_DB);
            admin("CREATE DATABASE " + LAB_DB);
        } catch (SQLException e) {
            throw new SQLException("Could not reach PostgreSQL to create the lab database. "
                    + "Check that the server is running and that PGHOST, PGPORT, PGUSER and PGPASSWORD "
                    + "work with psql (see README.md, Troubleshooting). Server said: " + e.getMessage(), e);
        }
        return connect(LAB_DB);
    }

    /** Runs the learner's schema.sql; returns null on success or the error text. */
    static String loadSchema(Connection c) throws IOException {
        String sql = Files.readString(Path.of("schema.sql"));
        try (Statement s = c.createStatement()) {
            s.execute(sql);
            return null;
        } catch (SQLException e) {
            return e.getMessage();
        }
    }

    static void drop(Connection c) throws SQLException {
        if (c != null) {
            c.close();
        }
        admin("DROP DATABASE IF EXISTS " + LAB_DB);
    }
}
