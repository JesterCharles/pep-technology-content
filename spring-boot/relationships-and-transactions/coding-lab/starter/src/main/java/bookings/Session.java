package bookings;

import jakarta.persistence.Entity;
// TODO Task 1: more imports you will need.
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

/** You edit this file in Task 1. */
@Entity
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String startDate;
    private int seatsLeft;

    // TODO Task 1: map the many-to-one side: @ManyToOne(fetch = FetchType.LAZY).
    // This side owns the relationship: it holds the workshop_id foreign key.
    // LAZY keeps a session load from dragging its workshop along by default.
    private Workshop workshop;

    protected Session() {
    }

    public Session(String startDate, int seatsLeft) {
        this.startDate = startDate;
        this.seatsLeft = seatsLeft;
    }

    public Long getId() {
        return id;
    }

    public String getStartDate() {
        return startDate;
    }

    public int getSeatsLeft() {
        return seatsLeft;
    }

    public void setSeatsLeft(int seatsLeft) {
        this.seatsLeft = seatsLeft;
    }

    public Workshop getWorkshop() {
        return workshop;
    }

    void setWorkshop(Workshop workshop) {
        this.workshop = workshop;
    }
}
