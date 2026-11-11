package bookings;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/** A confirmed booking row. This class is complete; you do not edit it. */
@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String attendee;
    private int seats;
    private Long sessionId;

    protected Booking() {
    }

    public Booking(String attendee, int seats, Long sessionId) {
        this.attendee = attendee;
        this.seats = seats;
        this.sessionId = sessionId;
    }

    public Long getId() {
        return id;
    }

    public String getAttendee() {
        return attendee;
    }

    public int getSeats() {
        return seats;
    }

    public Long getSessionId() {
        return sessionId;
    }
}
