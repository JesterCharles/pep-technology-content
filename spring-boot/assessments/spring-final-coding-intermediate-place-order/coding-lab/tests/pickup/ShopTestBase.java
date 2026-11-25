package pickup;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import jakarta.persistence.EntityManagerFactory;
import java.util.Map;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Shared setup for the public checks: one application context for every
 * check (so a test run starts the application once), with the database put
 * back to the data.sql state by the test's own SQL before each check. The
 * SqlOutage inspector is registered for every check but refuses nothing
 * unless a check switches it on.
 */
@SpringBootTest(properties = {
        "spring.main.banner-mode=off",
        "logging.level.root=warn",
        "spring.jpa.properties.hibernate.session_factory.statement_inspector=pickup.SqlOutage" })
@AutoConfigureMockMvc
abstract class ShopTestBase {

    /** dee orders PEN-BLK x3 and NB-A5 x2: one order row, two line rows, two stock changes. */
    static final String DEE = "{\"customer\":\"dee\",\"lines\":"
            + "[{\"sku\":\"PEN-BLK\",\"quantity\":3},{\"sku\":\"NB-A5\",\"quantity\":2}]}";
    /** data.sql plus dee's order. */
    static final Snapshot AFTER_DEE = new Snapshot(Map.of("NB-A5", 8, "PEN-BLK", 47, "USB-32", 2), 2, 4);

    @Autowired MockMvc mvc;
    @Autowired EntityManagerFactory entityManagerFactory;
    @Autowired JdbcTemplate jdbc;

    ShopState shop() { return new ShopState(entityManagerFactory); }

    /** What is in the database: stock by SKU, and how many orders and order lines are saved. */
    record Snapshot(Map<String, Integer> stock, long orders, long lines) { }

    /** What the first order left behind, and how many writes it sent to the database. */
    record FirstOrder(Snapshot after, int writes) { }

    Snapshot snapshot() {
        ShopState shop = shop();
        return new Snapshot(shop.stock(), shop.orderCount(), shop.lineCount());
    }

    /** POSTs an order and returns the HTTP status, or -1 when an exception escaped the application. */
    int postOrder(String json) {
        try {
            return mvc.perform(post("/api/orders").contentType(MediaType.APPLICATION_JSON).content(json))
                    .andReturn().getResponse().getStatus();
        } catch (Exception escaped) {
            return -1;
        }
    }

    /**
     * The start of every check except the two that look only at addLine or
     * a placed order: dee places one normal order, and it must be placed in
     * full (201, stock reserved, the order and both lines saved). Until
     * placing an order works, these checks stop here.
     */
    FirstOrder placeTheFirstOrder() {
        SqlOutage.startCounting();
        int status = postOrder(DEE);
        int writes = SqlOutage.writes();
        assertEquals(201, status, "placing dee's normal order (PEN-BLK x3, NB-A5 x2) must work (201) "
                + "before this check can test what a failing order changes");
        assertEquals(AFTER_DEE, snapshot(), "dee's order answered 201, so its stock must be reserved "
                + "(stock changes must be saved) and the order and its 2 lines saved");
        return new FirstOrder(AFTER_DEE, writes);
    }

    @BeforeEach
    void resetTheShopToDataSql() {
        SqlOutage.end();
        jdbc.execute("delete from order_line");
        jdbc.execute("delete from pickup_order");
        jdbc.execute("alter table order_line alter column id restart with 1");
        jdbc.execute("alter table pickup_order alter column id restart with 1");
        jdbc.update("update product set stock = 50 where sku = 'PEN-BLK'");
        jdbc.update("update product set stock = 10 where sku = 'NB-A5'");
        jdbc.update("update product set stock = 2 where sku = 'USB-32'");
        jdbc.update("insert into pickup_order (customer) values ('ana')");
        jdbc.update("insert into order_line (order_id, sku, quantity) values (1, 'PEN-BLK', 5)");
        jdbc.update("insert into order_line (order_id, sku, quantity) values (1, 'NB-A5', 1)");
    }

    @AfterEach
    void endOutage() { SqlOutage.end(); }
}
