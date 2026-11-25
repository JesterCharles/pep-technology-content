package pickup;

import java.util.List;

/** Provided. The request body of POST /api/orders. */
public record NewOrder(String customer, List<Line> lines) {

    public record Line(String sku, int quantity) {
    }
}
