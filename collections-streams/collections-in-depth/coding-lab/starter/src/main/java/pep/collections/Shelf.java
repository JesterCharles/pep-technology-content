package pep.collections;

import java.util.List;
import java.util.Map;
import java.util.Set;

/** Part 1 (topic: Lists, sets and maps in depth). */
public final class Shelf {
    private Shelf() { }

    /**
     * Removes every blank title (empty, or only spaces) from {@code titles}, in place,
     * and returns the same list. Do not remove inside a for-each loop over the list.
     */
    public static List<String> removeBlank(List<String> titles) {
        throw new UnsupportedOperationException("TODO Shelf.removeBlank");
    }

    /** Returns each title once, in the order it first appears in {@code titles}. */
    public static Set<String> uniqueInOrder(List<String> titles) {
        throw new UnsupportedOperationException("TODO Shelf.uniqueInOrder");
    }

    /** Returns the copies left for {@code title}, or 0 when the title is not in {@code stock}. */
    public static int copiesOf(Map<String, Integer> stock, String title) {
        throw new UnsupportedOperationException("TODO Shelf.copiesOf");
    }
}
