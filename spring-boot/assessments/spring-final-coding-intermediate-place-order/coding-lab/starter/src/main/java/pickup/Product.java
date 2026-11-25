package pickup;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/** Provided and complete: a shop product and how many are on the shelf. */
@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String name;

    private int stock;

    protected Product() {
        // for JPA
    }

    public Long getId() { return id; }
    public String getSku() { return sku; }
    public String getName() { return name; }
    public int getStock() { return stock; }

    /**
     * Takes quantity items off the shelf. Throws InvalidQuantityException for a
     * quantity below 1, or NotEnoughStockException; either way it changes nothing.
     */
    public void reserve(int quantity) {
        if (quantity < 1) {
            throw new InvalidQuantityException(sku, quantity);
        }
        if (quantity > stock) {
            throw new NotEnoughStockException(sku, quantity, stock);
        }
        stock -= quantity;
    }
}
