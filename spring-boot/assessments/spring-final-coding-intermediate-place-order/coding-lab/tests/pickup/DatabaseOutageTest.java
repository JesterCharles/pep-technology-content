package pickup;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

/**
 * Public checks 4 to 8. After dee's first order (see ShopTestBase), each check
 * makes the database refuse one write of the same order placed again, as an
 * outage would. Whatever your code saves and in whatever order, the failed
 * order must change nothing.
 */
class DatabaseOutageTest extends ShopTestBase {

    void assertTheRefusedOrderChangedNothing(FirstOrder first, String refusedWrite) {
        int status = postOrder(DEE);
        int refused = SqlOutage.refused();
        SqlOutage.end();
        assertTrue(refused > 0, "this check makes the database refuse " + refusedWrite
                + ", but your code never sent it: placing an order saves the order, its lines and the stock changes");
        assertTrue(status < 200 || status >= 300, "the refused write must not report success, got " + status);
        assertEquals(first.after(), snapshot(), "after the database refused " + refusedWrite
                + ", the failed order may not change anything: no stock reserved, no order or line saved");
    }

    @Test
    void task1ARefusedOrderInsertChangesNothing() {
        FirstOrder first = placeTheFirstOrder();
        SqlOutage.startCounting();
        SqlOutage.refuse("insert into pickup_order", 0);
        assertTheRefusedOrderChangedNothing(first, "the order insert");
    }

    @Test
    void task1ARefusedLineInsertChangesNothing() {
        FirstOrder first = placeTheFirstOrder();
        SqlOutage.startCounting();
        SqlOutage.refuse("insert into order_line", 0);
        assertTheRefusedOrderChangedNothing(first, "the first line insert");
    }

    @Test
    void task1ARefusedFirstStockUpdateChangesNothing() {
        FirstOrder first = placeTheFirstOrder();
        SqlOutage.startCounting();
        SqlOutage.refuse("update product", 0);
        assertTheRefusedOrderChangedNothing(first, "the first stock update");
    }

    @Test
    void task1ARefusedSecondStockUpdateChangesNothing() {
        FirstOrder first = placeTheFirstOrder();
        SqlOutage.startCounting();
        SqlOutage.refuse("update product", 1);
        assertTheRefusedOrderChangedNothing(first, "the second stock update");
    }

    /** Whatever order your writes come in, refusing the last one must also undo every earlier one. */
    @Test
    void task1ARefusedLastWriteChangesNothing() {
        FirstOrder first = placeTheFirstOrder();
        SqlOutage.startCounting();
        SqlOutage.refuseWrite(first.writes() - 1);
        assertTheRefusedOrderChangedNothing(first, "the last of its " + first.writes() + " writes");
    }
}
