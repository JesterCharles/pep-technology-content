package pep.collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.List;
import org.junit.jupiter.api.Test;

class DeskTest {

    @Test
    void balancedBrackets() {
        assertTrue(Desk.isBalanced(""));
        assertTrue(Desk.isBalanced("a(b[c]{d})e"));
        assertTrue(Desk.isBalanced("{[()()]}"));
    }

    @Test
    void unbalancedBrackets() {
        assertFalse(Desk.isBalanced("(]"), "a closing bracket must match the latest opening one");
        assertFalse(Desk.isBalanced("(()"), "an opening bracket left on the stack is unbalanced");
        assertFalse(Desk.isBalanced("())"), "a closing bracket with an empty stack is unbalanced");
        assertFalse(Desk.isBalanced("([)]"));
    }

    @Test
    void serveUsesHeadForUrgentAndTailForOthers() {
        assertEquals(List.of("!d", "!b", "a", "c"), Desk.serve(List.of("a", "!b", "c", "!d")));
        assertEquals(List.of("x", "y", "z"), Desk.serve(List.of("x", "y", "z")), "plain jobs are first-in-first-out");
    }

    @Test
    void nextOrNoneLooksWithoutRemoving() {
        Deque<String> jobs = new ArrayDeque<>();
        assertEquals("none", Desk.nextOrNone(jobs));
        jobs.offer("print");
        jobs.offer("scan");
        assertEquals("print", Desk.nextOrNone(jobs));
        assertEquals(2, jobs.size(), "nextOrNone must not remove the job");
    }
}
