package pickup;

import java.util.List;

/** Provided. The response shape of an order. */
public record OrderResponse(Long id, String customer, List<LineResponse> lines, int totalItems) {

    public record LineResponse(String sku, int quantity) {
    }

    public static OrderResponse from(PickupOrder order) {
        List<LineResponse> lines = order.getLines().stream()
                .map(line -> new LineResponse(line.getSku(), line.getQuantity()))
                .toList();
        int total = lines.stream().mapToInt(LineResponse::quantity).sum();
        return new OrderResponse(order.getId(), order.getCustomer(), lines, total);
    }
}
