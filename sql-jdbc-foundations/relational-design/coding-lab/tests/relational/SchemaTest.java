package relational;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Savepoint;
import java.sql.Statement;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

/**
 * Public tests for the relational design lab.
 * Each test runs inside a transaction that is rolled back, so tests never see each other's rows.
 */
@TestMethodOrder(MethodOrderer.MethodName.class)
class SchemaTest {
    private static Connection db;
    private static String schemaError;

    @BeforeAll
    static void setUp() throws Exception {
        db = LabDatabase.create();
        schemaError = LabDatabase.loadSchema(db);
        db.setAutoCommit(false);
    }

    @AfterAll
    static void tearDown() throws Exception {
        LabDatabase.drop(db);
    }

    @BeforeEach
    void schemaLoaded() {
        if (schemaError != null) {
            fail("schema.sql did not run: " + schemaError);
        }
    }

    @AfterEach
    void undo() throws SQLException {
        db.rollback();
    }

    // ---------- helpers ----------

    private static void run(String sql) {
        try (Statement s = db.createStatement()) {
            s.execute(sql);
        } catch (SQLException e) {
            fail("This statement should be accepted, but PostgreSQL rejected it:\n  " + sql + "\n  " + e.getMessage());
        }
    }

    /** Runs a statement that must be rejected with the given SQLSTATE (the kind of rule). */
    private static void rejected(String sql, String sqlState, String rule) throws SQLException {
        Savepoint sp = db.setSavepoint();
        try (Statement s = db.createStatement()) {
            s.execute(sql);
            fail("This statement should be rejected by " + rule + ", but it was accepted:\n  " + sql);
        } catch (SQLException e) {
            assertEquals(sqlState, e.getSQLState(),
                    "This statement should be rejected by " + rule + ", but the error was different:\n  " + sql + "\n  " + e.getMessage());
        } finally {
            db.rollback(sp);
        }
    }

    private static String[] column(String table, String column) throws SQLException {
        try (PreparedStatement p = db.prepareStatement(
                "SELECT data_type, character_maximum_length, numeric_scale, is_nullable "
                        + "FROM information_schema.columns WHERE table_schema = 'public' AND table_name = ? AND column_name = ?")) {
            p.setString(1, table);
            p.setString(2, column);
            try (ResultSet r = p.executeQuery()) {
                if (!r.next()) {
                    fail("Table " + table + " has no column named " + column + ".");
                }
                return new String[] {r.getString(1), r.getString(2), r.getString(3), r.getString(4)};
            }
        }
    }

    private static void seed() {
        run("INSERT INTO students (id, name, email) VALUES (1, 'Ana Lima', 'ana@example.com')");
        run("INSERT INTO courses (code, title, capacity) VALUES ('SQL101', 'SQL Foundations', 30)");
    }

    // ---------- tasks ----------

    @Test
    void task1Tables() throws SQLException {
        for (String table : new String[] {"students", "courses", "enrollments"}) {
            try (PreparedStatement p = db.prepareStatement(
                    "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ?")) {
                p.setString(1, table);
                try (ResultSet r = p.executeQuery()) {
                    assertTrue(r.next(), "schema.sql must create a table named " + table + ".");
                }
            }
        }
    }

    @Test
    void task2Students() throws SQLException {
        assertEquals("integer", column("students", "id")[0], "students.id must be an integer.");
        String[] name = column("students", "name");
        assertEquals("character varying", name[0], "students.name must be varchar(100).");
        assertEquals("100", name[1], "students.name must allow at most 100 characters: varchar(100).");
        assertEquals("text", column("students", "email")[0], "students.email must be text.");
        seed();
        rejected("INSERT INTO students (id, name, email) VALUES (1, 'Ben Okafor', 'ben@example.com')", "23505", "the primary key on students.id");
        rejected("INSERT INTO students (id, name, email) VALUES (NULL, 'Ben Okafor', 'ben@example.com')", "23502", "the primary key on students.id (never null)");
        rejected("INSERT INTO students (id, name, email) VALUES (2, NULL, 'ben@example.com')", "23502", "NOT NULL on students.name");
        rejected("INSERT INTO students (id, name, email) VALUES (2, 'Ben Okafor', NULL)", "23502", "NOT NULL on students.email");
        rejected("INSERT INTO students (id, name, email) VALUES (2, 'Ben Okafor', 'ana@example.com')", "23505", "UNIQUE on students.email");
        rejected("INSERT INTO students (id, name, email) VALUES (2, repeat('x', 101), 'ben@example.com')", "22001", "the varchar(100) type of students.name");
        run("INSERT INTO students (id, name, email) VALUES (2, 'Ben Okafor', 'ben@example.com')");
    }

    @Test
    void task3Courses() throws SQLException {
        assertEquals("text", column("courses", "code")[0], "courses.code must be text.");
        assertEquals("integer", column("courses", "capacity")[0], "courses.capacity must be an integer.");
        seed();
        rejected("INSERT INTO courses (code, title, capacity) VALUES ('SQL101', 'Again', 10)", "23505", "the primary key on courses.code");
        rejected("INSERT INTO courses (code, title, capacity) VALUES ('JDBC201', NULL, 10)", "23502", "NOT NULL on courses.title");
        rejected("INSERT INTO courses (code, title, capacity) VALUES ('JDBC201', 'JDBC', NULL)", "23502", "NOT NULL on courses.capacity");
        rejected("INSERT INTO courses (code, title, capacity) VALUES ('JDBC201', 'JDBC', 0)", "23514", "a CHECK that capacity is more than 0");
        run("INSERT INTO courses (code, title, capacity) VALUES ('JDBC201', 'JDBC', 1)");
    }

    @Test
    void task4EnrollmentKeys() throws SQLException {
        seed();
        run("INSERT INTO enrollments (student_id, course_code) VALUES (1, 'SQL101')");
        rejected("INSERT INTO enrollments (student_id, course_code) VALUES (9, 'SQL101')", "23503", "the foreign key from enrollments.student_id to students");
        rejected("INSERT INTO enrollments (student_id, course_code) VALUES (1, 'NOPE999')", "23503", "the foreign key from enrollments.course_code to courses");
        rejected("INSERT INTO enrollments (student_id, course_code) VALUES (1, 'SQL101')", "23505", "a primary key on (student_id, course_code), so a student enrolls in a course once");
        rejected("INSERT INTO enrollments (student_id, course_code) VALUES (NULL, 'SQL101')", "23502", "NOT NULL on enrollments.student_id");
        rejected("DELETE FROM students WHERE id = 1", "23503", "the foreign key from enrollments.student_id (a student with enrollments cannot be deleted)");
        run("INSERT INTO students (id, name, email) VALUES (2, 'Ben Okafor', 'ben@example.com')");
        run("DELETE FROM students WHERE id = 2");
    }

    @Test
    void task5EnrollmentDefaults() throws SQLException {
        assertTrue(column("enrollments", "enrolled_at")[0].startsWith("timestamp"), "enrollments.enrolled_at must be a timestamp.");
        String[] grade = column("enrollments", "grade");
        assertEquals("numeric", grade[0], "enrollments.grade must be numeric(5,2).");
        assertEquals("2", grade[2], "enrollments.grade must keep 2 decimal places: numeric(5,2).");
        seed();
        run("INSERT INTO enrollments (student_id, course_code) VALUES (1, 'SQL101')");
        try (Statement s = db.createStatement();
                ResultSet r = s.executeQuery("SELECT enrolled_at, grade FROM enrollments WHERE student_id = 1")) {
            assertTrue(r.next(), "The enrollment just inserted should be there.");
            assertNotNull(r.getTimestamp(1), "enrolled_at was left out of the insert, so it needs a DEFAULT of the current time.");
            assertNull(r.getBigDecimal(2), "grade was left out of the insert, so it should be empty (null).");
        }
        run("INSERT INTO courses (code, title, capacity) VALUES ('JDBC201', 'JDBC', 20)");
        rejected("INSERT INTO enrollments (student_id, course_code, grade) VALUES (1, 'JDBC201', 100.5)", "23514", "a CHECK that grade is between 0 and 100");
        rejected("INSERT INTO enrollments (student_id, course_code, grade) VALUES (1, 'JDBC201', -1)", "23514", "a CHECK that grade is between 0 and 100");
        run("INSERT INTO enrollments (student_id, course_code, grade) VALUES (1, 'JDBC201', 99.5)");
    }
}
