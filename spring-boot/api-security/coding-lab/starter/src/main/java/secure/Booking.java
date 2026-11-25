package secure;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

/**
 * A stored workshop booking. This entity is complete; you do not edit it.
 * The owner and the payment reference are internal: neither belongs in a response.
 */
@Entity
public class Booking {

    @Id
    private Long id;
    private String owner;
    private String workshop;
    private int seats;
    private String paymentReference;

    protected Booking() {
    }

    public Long getId() {
        return id;
    }

    public String getOwner() {
        return owner;
    }

    public String getWorkshop() {
        return workshop;
    }

    public int getSeats() {
        return seats;
    }

    public String getPaymentReference() {
        return paymentReference;
    }
}
