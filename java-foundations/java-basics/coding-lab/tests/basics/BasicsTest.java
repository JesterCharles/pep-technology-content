package basics;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

/**
 * Public tests for the Java Basics lab. Each test calls one method with several
 * inputs, including edge cases, and checks only the results it returns.
 */
@TestMethodOrder(MethodOrderer.MethodName.class)
class BasicsTest {

    @Test
    void task1Average() {
        assertAll(
                () -> assertEquals(87.5, Basics.average(90, 85), "Task 1: average(90, 85)"),
                () -> assertEquals(1.5, Basics.average(1, 2), "Task 1: average(1, 2)"),
                () -> assertEquals(0.0, Basics.average(0, 0), "Task 1: average(0, 0)"),
                () -> assertEquals(-2.5, Basics.average(-3, -2), "Task 1: average(-3, -2)"),
                () -> assertEquals(2.0E9, Basics.average(2_000_000_000, 2_000_000_000),
                        "Task 1: average(2000000000, 2000000000), where a + b does not fit in an int"));
    }

    @Test
    void task2Initials() {
        assertAll(
                () -> assertEquals("AL", Basics.initials("ada", "lovelace"), "Task 2: initials(\"ada\", \"lovelace\")"),
                () -> assertEquals("GH", Basics.initials("Grace", "hopper"), "Task 2: initials(\"Grace\", \"hopper\")"),
                () -> assertEquals("XY", Basics.initials("x", "y"), "Task 2: initials(\"x\", \"y\")"));
    }

    @Test
    void task3Even() {
        assertAll(
                () -> assertEquals(true, Basics.isEven(42), "Task 3: isEven(42)"),
                () -> assertEquals(false, Basics.isEven(7), "Task 3: isEven(7)"),
                () -> assertEquals(true, Basics.isEven(0), "Task 3: isEven(0)"),
                () -> assertEquals(true, Basics.isEven(-4), "Task 3: isEven(-4)"),
                () -> assertEquals(false, Basics.isEven(-3), "Task 3: isEven(-3)"));
    }

    @Test
    void task4Grade() {
        assertAll(
                () -> assertEquals("A", Basics.grade(100), "Task 4: grade(100)"),
                () -> assertEquals("A", Basics.grade(90), "Task 4: grade(90)"),
                () -> assertEquals("B", Basics.grade(89), "Task 4: grade(89)"),
                () -> assertEquals("B", Basics.grade(80), "Task 4: grade(80)"),
                () -> assertEquals("C", Basics.grade(79), "Task 4: grade(79)"),
                () -> assertEquals("C", Basics.grade(70), "Task 4: grade(70)"),
                () -> assertEquals("F", Basics.grade(69), "Task 4: grade(69)"),
                () -> assertEquals("F", Basics.grade(0), "Task 4: grade(0)"));
    }

    @Test
    void task5Day() {
        assertAll(
                () -> assertEquals("weekday", Basics.dayType(1), "Task 5: dayType(1)"),
                () -> assertEquals("weekday", Basics.dayType(5), "Task 5: dayType(5)"),
                () -> assertEquals("weekend", Basics.dayType(6), "Task 5: dayType(6)"),
                () -> assertEquals("weekend", Basics.dayType(7), "Task 5: dayType(7)"),
                () -> assertEquals("unknown", Basics.dayType(0), "Task 5: dayType(0)"),
                () -> assertEquals("unknown", Basics.dayType(8), "Task 5: dayType(8)"));
    }

    @Test
    void task6Countdown() {
        assertAll(
                () -> assertEquals("5 4 3 2 1", Basics.countdown(5), "Task 6: countdown(5)"),
                () -> assertEquals("3 2 1", Basics.countdown(3), "Task 6: countdown(3)"),
                () -> assertEquals("1", Basics.countdown(1), "Task 6: countdown(1)"),
                () -> assertEquals("", Basics.countdown(0), "Task 6: countdown(0)"));
    }
}
