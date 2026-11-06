package pep.collections;

import java.util.ArrayList;
import java.util.List;

/** Part 4 (topic: Big-O basics). */
public final class Overlap {
    private Overlap() { }

    /**
     * Returns the names that appear in both lists, in the order they appear in {@code a},
     * each name once.
     *
     * This version gives the right answer, but it scans the whole of {@code b} once for every
     * name in {@code a}, and {@code both.contains} scans the growing result too. Rewrite it so
     * that the whole method is expected O(n + m): read {@code b} in a single pass into a HashSet first, and
     * remember the names already added in a second HashSet (or collect them in a LinkedHashSet)
     * instead of calling contains on the result list.
     * In a comment, state the time complexity before and after, with n = a.size() and m = b.size().
     */
    public static List<String> inBoth(List<String> a, List<String> b) {
        List<String> both = new ArrayList<>();
        for (String x : a) {
            for (String y : b) {
                if (x.equals(y) && !both.contains(x)) {
                    both.add(x);
                }
            }
        }
        return both;
    }
}
