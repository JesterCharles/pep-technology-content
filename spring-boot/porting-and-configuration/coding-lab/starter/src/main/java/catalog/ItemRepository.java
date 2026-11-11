package catalog;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

/**
 * The in-memory repository ported from Java Foundations. This class is
 * complete; you do not edit it. The Flyway migrations in
 * src/main/resources/db/migration prepare the real database table that
 * replaces it in the Spring Data JPA module.
 */
@Repository
public class ItemRepository {

    private static final List<Item> ITEMS = List.of(
            new Item(1, "Laptop stand", 4900),
            new Item(2, "USB-C cable", 1200),
            new Item(3, "Mechanical keyboard", 9900),
            new Item(4, "Webcam", 6500),
            new Item(5, "Desk mat", 2300));

    public List<Item> findAll() {
        return ITEMS;
    }

    public Optional<Item> findById(int id) {
        return ITEMS.stream().filter(item -> item.id() == id).findFirst();
    }
}
