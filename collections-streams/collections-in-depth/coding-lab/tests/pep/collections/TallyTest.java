package pep.collections;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class TallyTest {

    private static List<String> words() throws IOException {
        return Files.readAllLines(Path.of("..", "fixtures", "words.txt"), StandardCharsets.UTF_8);
    }

    @Test
    void countsEveryWord() throws IOException {
        Map<String, Integer> expected = Map.of(
                "to", 2, "be", 2, "or", 1, "not", 1, "that", 1, "is", 1, "the", 1, "question", 1);
        assertEquals(expected, Tally.count(words()));
    }

    @Test
    void countOfAnEmptyListIsEmpty() {
        assertEquals(Map.of(), Tally.count(List.of()));
    }

    @Test
    void groupsByInitialKeepingInputOrder() throws IOException {
        Map<Character, List<String>> expected = Map.of(
                't', List.of("to", "to", "that", "the"),
                'b', List.of("be", "be"),
                'o', List.of("or"),
                'n', List.of("not"),
                'i', List.of("is"),
                'q', List.of("question"));
        assertEquals(expected, Tally.byInitial(words()));
    }
}
