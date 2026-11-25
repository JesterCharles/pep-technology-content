package toolshed;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * Provided and complete: one tool in the community tool library.
 * purchaseNote is for staff only and must never appear in an API response.
 */
@Entity
public class Tool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The label stuck on the tool, such as PWR-001. Unique across the library. */
    @Column(nullable = false, unique = true)
    private String assetTag;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    /** Whole currency units. */
    @Column(nullable = false)
    private int replacementCost;

    private String purchaseNote;

    protected Tool() {
        // for JPA
    }

    public Tool(String assetTag, String name, String category, int replacementCost) {
        this.assetTag = assetTag;
        this.name = name;
        this.category = category;
        this.replacementCost = replacementCost;
    }

    public Long getId() { return id; }
    public String getAssetTag() { return assetTag; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public int getReplacementCost() { return replacementCost; }
    public String getPurchaseNote() { return purchaseNote; }
}
