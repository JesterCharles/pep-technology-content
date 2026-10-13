package basics;

import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

/**
 * Public tests for the Java Basics lab. Each test calls one method with several
 * inputs, including edge cases. Tasks 3, 5 and 6 also read that one method's own
 * code, with comments and string literals removed, to check the construct the task names.
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
    void task3Even() throws IOException {
        assertAll(
                () -> assertEquals(true, Basics.isEven(42), "Task 3: isEven(42)"),
                () -> assertEquals(false, Basics.isEven(7), "Task 3: isEven(7)"),
                () -> assertEquals(true, Basics.isEven(0), "Task 3: isEven(0)"),
                () -> assertEquals(true, Basics.isEven(-4), "Task 3: isEven(-4)"),
                () -> assertEquals(false, Basics.isEven(-3), "Task 3: isEven(-3)"));
        assertTrue(methodCode("isEven").contains("%"), "Task 3: isEven must use the remainder operator %");
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
    void task5Day() throws IOException {
        assertAll(
                () -> assertEquals("weekday", Basics.dayType(1), "Task 5: dayType(1)"),
                () -> assertEquals("weekday", Basics.dayType(5), "Task 5: dayType(5)"),
                () -> assertEquals("weekend", Basics.dayType(6), "Task 5: dayType(6)"),
                () -> assertEquals("weekend", Basics.dayType(7), "Task 5: dayType(7)"),
                () -> assertEquals("unknown", Basics.dayType(0), "Task 5: dayType(0)"),
                () -> assertEquals("unknown", Basics.dayType(8), "Task 5: dayType(8)"));
        String code = methodCode("dayType");
        assertTrue(code.contains("switch") && code.contains("->"),
                "Task 5: dayType must use a switch with arrow labels (->)");
    }

    @Test
    void task6Countdown() throws IOException {
        assertAll(
                () -> assertEquals("5 4 3 2 1", Basics.countdown(5), "Task 6: countdown(5)"),
                () -> assertEquals("3 2 1", Basics.countdown(3), "Task 6: countdown(3)"),
                () -> assertEquals("1", Basics.countdown(1), "Task 6: countdown(1)"),
                () -> assertEquals("", Basics.countdown(0), "Task 6: countdown(0)"));
        assertTrue(Pattern.compile("\\bfor\\s*\\(").matcher(methodCode("countdown")).find(),
                "Task 6: countdown must use a for loop");
    }

    /** The body of one method declared in Basics.java, without comments or string and char literals. */
    private static String methodCode(String name) throws IOException {
        String source = Files.readString(Path.of("src/main/java/basics/Basics.java"), StandardCharsets.UTF_8);
        String code = withoutCommentsAndLiterals(source);
        Matcher declaration = Pattern.compile("\\bstatic\\s+\\w+\\s+" + name + "\\s*\\([^)]*\\)\\s*\\{").matcher(code);
        if (!declaration.find()) {
            return "";
        }
        int open = declaration.end() - 1;
        int depth = 0;
        for (int i = open; i < code.length(); i++) {
            char c = code.charAt(i);
            if (c == '{') {
                depth++;
            } else if (c == '}' && --depth == 0) {
                return code.substring(open, i + 1);
            }
        }
        return "";
    }

    private static String withoutCommentsAndLiterals(String source) {
        StringBuilder out = new StringBuilder();
        int i = 0;
        while (i < source.length()) {
            char c = source.charAt(i);
            if (source.startsWith("//", i)) {
                while (i < source.length() && source.charAt(i) != '\n') {
                    i++;
                }
            } else if (source.startsWith("/*", i)) {
                int end = source.indexOf("*/", i + 2);
                i = end < 0 ? source.length() : end + 2;
            } else if (c == '"' || c == '\'') {
                i++;
                while (i < source.length() && source.charAt(i) != c) {
                    i += source.charAt(i) == '\\' ? 2 : 1;
                }
                i++;
                out.append(c).append(c);
            } else {
                out.append(c);
                i++;
            }
        }
        return out.toString();
    }
}
