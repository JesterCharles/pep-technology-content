package catalog;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

/** Task 6: the V2 migration must seed the catalog_items table Flyway owns. */
@SpringBootTest(properties = { "spring.main.banner-mode=off", "logging.level.root=warn" })
class MigrationTest {

    @Autowired
    JdbcTemplate jdbc;

    @Test
    void task6SeedsTheCatalogItemsTable() {
        Integer count = jdbc.queryForObject("select count(*) from catalog_items", Integer.class);
        assertEquals(5, count,
                "catalog_items should hold the five seeded rows after the V2 migration");
        String name = jdbc.queryForObject(
                "select name from catalog_items where id = 3", String.class);
        assertEquals("Mechanical keyboard", name,
                "catalog_items row 3 should match the in-memory catalog");
    }
}
