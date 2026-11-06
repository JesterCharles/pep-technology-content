package pep.collections;

import java.util.List;
import java.util.Map;

/** Part 6 (topic: How HashMap works). */
public final class Tally {
    private Tally() { }

    /** Counts how often each word appears. Use Map.merge. */
    public static Map<String, Integer> count(List<String> words) {
        throw new UnsupportedOperationException("TODO Tally.count");
    }

    /**
     * Groups words by their first character. Each list keeps the input order.
     * Use Map.computeIfAbsent.
     */
    public static Map<Character, List<String>> byInitial(List<String> words) {
        throw new UnsupportedOperationException("TODO Tally.byInitial");
    }
}
