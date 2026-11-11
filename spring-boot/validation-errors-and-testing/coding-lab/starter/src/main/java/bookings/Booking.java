package bookings;

/** A stored booking. This record is complete; you do not edit it. */
public record Booking(Long id, String attendee, String email, int seats) {
}
