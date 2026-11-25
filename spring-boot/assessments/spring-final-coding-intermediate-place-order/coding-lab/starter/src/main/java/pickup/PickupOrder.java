package pickup;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import java.util.ArrayList;
import java.util.List;

/**
 * An order and its lines. The mapping is provided: saving an order also saves
 * the lines in its list (cascade). You complete addLine.
 */
@Entity
public class PickupOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Who collects the order. */
    @Column(nullable = false)
    private String customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @OrderBy("id")
    private List<OrderLine> lines = new ArrayList<>();

    protected PickupOrder() {
        // for JPA
    }

    public PickupOrder(String customer) {
        this.customer = customer;
    }

    public Long getId() { return id; }
    public String getCustomer() { return customer; }
    public List<OrderLine> getLines() { return lines; }

    /** Adds a line to this order, keeping both sides of the relationship in sync. */
    public void addLine(OrderLine line) {
        // TODO
    }
}
