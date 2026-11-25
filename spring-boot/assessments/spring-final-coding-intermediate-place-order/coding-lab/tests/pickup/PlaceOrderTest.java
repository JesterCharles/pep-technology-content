package pickup;

import static org.hamcrest.Matchers.contains;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

/**
 * Public checks 1 to 3. Each check starts from the data.sql state (see
 * ShopTestBase). What was saved is read back through ShopState.
 */
class PlaceOrderTest extends ShopTestBase {

    static String body(String customer, String... skuQuantityPairs) {
        StringBuilder json = new StringBuilder("{\"customer\":\"" + customer + "\",\"lines\":[");
        for (int i = 0; i < skuQuantityPairs.length; i += 2) {
            if (i > 0) json.append(',');
            json.append("{\"sku\":\"").append(skuQuantityPairs[i])
                .append("\",\"quantity\":").append(skuQuantityPairs[i + 1]).append('}');
        }
        return json.append("]}").toString();
    }

    ResultActions place(String json) throws Exception {
        return mvc.perform(post("/api/orders").contentType(MediaType.APPLICATION_JSON).content(json));
    }

    void assertNothingChangedSince(FirstOrder first, String why) {
        assertEquals(first.after(), snapshot(), why + ": no stock may be reserved and no order or line saved");
    }

    @Test
    void task1AddLineSetsBothSides() {
        PickupOrder order = new PickupOrder("eve");
        OrderLine pens = new OrderLine("PEN-BLK", 2);
        OrderLine notebooks = new OrderLine("NB-A5", 1);
        order.addLine(pens);
        order.addLine(notebooks);
        assertEquals(List.of(pens, notebooks), order.getLines(),
                "addLine must add the line to the order's list, in the order the lines are added");
        assertSame(order, pens.getOrder(),
                "addLine must also point the line back at its order (line.setOrder): that side fills order_id");
        assertSame(order, notebooks.getOrder(),
                "addLine must also point the line back at its order (line.setOrder): that side fills order_id");
    }

    @Test
    void task1PlacesAnOrderWithItsLines() throws Exception {
        MvcResult placed = place(body("dee", "PEN-BLK", "3", "USB-32", "1"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.customer").value("dee"))
                .andExpect(jsonPath("$.lines[*].sku", contains("PEN-BLK", "USB-32")))
                .andExpect(jsonPath("$.totalItems").value(4))
                .andReturn();
        Integer id = JsonPath.read(placed.getResponse().getContentAsString(), "$.id");
        assertNotNull(id, "the placed order's id must be in the response body");
        String location = placed.getResponse().getHeader("Location");
        assertTrue(location != null && location.endsWith("/api/orders/" + id),
                "Location should point at /api/orders/" + id + " but was " + location);
        assertEquals("dee", shop().customerOf(id));
        assertEquals(List.of("PEN-BLK x3", "USB-32 x1"), shop().linesOf(id),
                "the saved lines must be linked to the new order (order_id)");
        assertEquals(Map.of("NB-A5", 10, "PEN-BLK", 47, "USB-32", 1), shop().stock(),
                "placing the order must reserve its stock");
    }

    @Test
    void task1AFailingLineChangesNothing() throws Exception {
        FirstOrder first = placeTheFirstOrder();
        // PEN-BLK has enough stock, USB-32 does not.
        place(body("ana", "PEN-BLK", "4", "USB-32", "5"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.title").value("Not enough stock"));
        assertNothingChangedSince(first, "not enough stock on the second line");
        // Two lines for the same SKU: 2 + 2 of USB-32 when only 2 are left.
        place(body("ana", "USB-32", "2", "USB-32", "2"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.title").value("Not enough stock"));
        assertNothingChangedSince(first, "two lines for one SKU beyond its stock");
        // An unknown SKU after a valid line.
        place(body("ana", "NB-A5", "2", "NOPE-1", "1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.title").value("Product not found"));
        assertNothingChangedSince(first, "an unknown SKU on the second line");
        // A quantity below 1 after a valid line.
        place(body("ana", "PEN-BLK", "2", "NB-A5", "0"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Invalid quantity"));
        assertNothingChangedSince(first, "a quantity of 0 on the second line");
    }
}
