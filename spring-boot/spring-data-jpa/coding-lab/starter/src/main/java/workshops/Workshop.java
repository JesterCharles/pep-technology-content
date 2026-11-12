package workshops;

// TODO Task 1: the imports you need are ready to use.
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * You edit this file in Task 1.
 *
 * TODO Task 1: map this class to a table: annotate the class with @Entity,
 * the id field with @Id and @GeneratedValue(strategy = GenerationType.IDENTITY).
 * Jakarta Persistence also requires a no-argument constructor; it is already
 * below, protected so only JPA uses it.
 */
public class Workshop {

    private Long id;
    private String title;
    private String category;
    private int seats;
    private String internalNotes;

    protected Workshop() {
    }

    public Workshop(String title, String category, int seats, String internalNotes) {
        this.title = title;
        this.category = category;
        this.seats = seats;
        this.internalNotes = internalNotes;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getCategory() {
        return category;
    }

    public int getSeats() {
        return seats;
    }

    /** Internal planning notes. The API must never expose this field (Task 5). */
    public String getInternalNotes() {
        return internalNotes;
    }
}
