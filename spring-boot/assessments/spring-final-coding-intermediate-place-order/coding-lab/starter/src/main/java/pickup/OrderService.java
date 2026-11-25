package pickup;

import org.springframework.stereotype.Service;

/** You complete place. Keep its signature; the controller calls it. */
@Service
public class OrderService {

    private final OrderRepository orders;
    private final ProductRepository products;

    public OrderService(OrderRepository orders, ProductRepository products) {
        this.orders = orders;
        this.products = products;
    }

    /** Places the order and reserves its stock, all or nothing. */
    public OrderResponse place(NewOrder request) {
        throw new UnsupportedOperationException("TODO: OrderService.place");
    }
}
