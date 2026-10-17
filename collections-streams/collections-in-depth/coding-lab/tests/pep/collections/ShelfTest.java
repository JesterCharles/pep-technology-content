package pep.collections;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class ShelfTest {

    @Test
    void removeBlankRemovesEmptyAndSpaceOnlyTitlesInPlace() {
        List<String> titles = new ArrayList<>(List.of("Dune", "", "Emma", "   ", "", "Ulysses"));
        List<String> result = Shelf.removeBlank(titles);
        assertSame(titles, result, "removeBlank must change and return the same list");
        assertEquals(List.of("Dune", "Emma", "Ulysses"), titles);
    }

    @Test
    void uniqueInOrderKeepsFirstAppearanceOrder() {
        List<String> titles = List.of("Emma", "Dune", "Emma", "Beloved", "Dune");
        assertEquals(List.of("Emma", "Dune", "Beloved"), new ArrayList<>(Shelf.uniqueInOrder(titles)),
                "each title once, in first-appearance order");
    }

    @Test
    void copiesOfReturnsStockOrZero() {
        Map<String, Integer> stock = Map.of("Dune", 3, "Emma", 0);
        assertEquals(3, Shelf.copiesOf(stock, "Dune"));
        assertEquals(0, Shelf.copiesOf(stock, "Emma"));
        assertEquals(0, Shelf.copiesOf(stock, "Ulysses"), "a title that is not stocked has 0 copies");
    }
}
