package pep.collections;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;
import org.junit.jupiter.api.Test;

class PairTest {

    @Test
    void storesTwoValuesOfDifferentTypes() {
        Pair<String, Integer> p = new Pair<>("seats", 42);
        String first = p.first();
        int second = p.second();
        assertEquals("seats", first);
        assertEquals(42, second);
    }

    @Test
    void swapReversesTheTypesToo() {
        Pair<Integer, String> swapped = new Pair<>("row", 7).swap();
        Integer first = swapped.first();
        assertEquals(7, first);
        assertEquals("row", swapped.second());
    }

    @Test
    void lastOfReturnsTheElementType() {
        String s = Pair.lastOf(List.of("a", "b", "c"));
        Double d = Pair.lastOf(List.of(1.5, 2.5));
        assertEquals("c", s);
        assertEquals(2.5, d);
    }
}
