package pep.collections;

import java.util.Deque;
import java.util.List;

/** Part 2 (topic: Stacks and queues). Use an ArrayDeque, not java.util.Stack. */
public final class Desk {
    private Desk() { }

    /**
     * Returns true when every (, [ and { in {@code text} is closed by the matching bracket,
     * in the right order. Other characters are ignored. Use a deque as a stack.
     */
    public static boolean isBalanced(String text) {
        throw new UnsupportedOperationException("TODO Desk.isBalanced");
    }

    /**
     * Returns the jobs in the order a help desk serves them. Jobs are handled one deque:
     * a job starting with "!" is urgent and goes to the head (push); any other job goes to
     * the tail (offer). After all arrivals, jobs are removed from the head (poll) until empty.
     */
    public static List<String> serve(List<String> arrivals) {
        throw new UnsupportedOperationException("TODO Desk.serve");
    }

    /** Returns the next job without removing it, or "none" when {@code jobs} is empty. */
    public static String nextOrNone(Deque<String> jobs) {
        throw new UnsupportedOperationException("TODO Desk.nextOrNone");
    }
}
