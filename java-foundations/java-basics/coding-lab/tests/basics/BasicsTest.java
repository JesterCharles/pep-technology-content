package basics;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

/** Public tests for the Java Basics lab: they run Basics.main and read what it prints. */
@TestMethodOrder(MethodOrderer.MethodName.class)
class BasicsTest {
    private static List<String> lines;
    private static String code;

    @BeforeAll
    static void runProgram() throws IOException {
        PrintStream original = System.out;
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        System.setOut(new PrintStream(buffer, true, StandardCharsets.UTF_8));
        try {
            Basics.main(new String[0]);
        } finally {
            System.setOut(original);
        }
        lines = buffer.toString(StandardCharsets.UTF_8).lines().toList();
        String source = Files.readString(Path.of("src/main/java/basics/Basics.java"), StandardCharsets.UTF_8);
        // Ignore comments, so the TODO hints do not count as code.
        code = source.replaceAll("(?s)/\\*.*?\\*/", "").replaceAll("//[^\\n]*", "");
    }

    private static String line(String label) {
        return lines.stream().filter(l -> l.startsWith(label + ":")).findFirst().orElse("(no line starting with " + label + ":)");
    }

    @Test
    void task1Average() {
        assertEquals("Average: 87.5", line("Average"), "Task 1: the average of 90 and 85 keeps its fraction");
        assertFalse(code.contains("87.5"), "Task 1: compute the average from scoreA and scoreB instead of typing 87.5");
    }

    @Test
    void task2Initials() {
        assertEquals("Initials: AL", line("Initials"), "Task 2: initials of ada lovelace in upper case");
        assertFalse(code.contains("\"AL\""), "Task 2: build the initials from first and last instead of typing \"AL\"");
    }

    @Test
    void task3Even() {
        assertEquals("Even: true", line("Even"), "Task 3: 42 is even");
        assertTrue(code.contains("%"), "Task 3: use the remainder operator %");
    }

    @Test
    void task4Grade() {
        assertEquals("Grade: B", line("Grade"), "Task 4: a score of 85 is a B");
        assertTrue(code.contains("else if"), "Task 4: use an if / else if / else chain");
    }

    @Test
    void task5Day() {
        assertEquals("Day: weekend", line("Day"), "Task 5: day 6 is a weekend day");
        assertTrue(code.contains("switch") && code.contains("->"), "Task 5: use a switch with arrow labels");
    }

    @Test
    void task6Countdown() {
        assertEquals("Countdown: 5 4 3 2 1", line("Countdown"), "Task 6: count down from 5 to 1");
        assertTrue(code.contains("for ("), "Task 6: use a for loop");
    }
}
