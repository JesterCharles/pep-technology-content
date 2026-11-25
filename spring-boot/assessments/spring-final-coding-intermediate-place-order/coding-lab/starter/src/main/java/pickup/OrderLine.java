package pickup;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

/** Provided and complete: one line of an order. It owns the order_id foreign key. */
@Entity
public class OrderLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id")
    private PickupOrder order;

    @Column(nullable = false)
    private String sku;

    private int quantity;

    protected OrderLine() {
        // for JPA
    }

    public OrderLine(String sku, int quantity) {
        this.sku = sku;
        this.quantity = quantity;
    }

    public Long getId() { return id; }
    public PickupOrder getOrder() { return order; }
    public String getSku() { return sku; }
    public int getQuantity() { return quantity; }

    void setOrder(PickupOrder order) { this.order = order; }
}
