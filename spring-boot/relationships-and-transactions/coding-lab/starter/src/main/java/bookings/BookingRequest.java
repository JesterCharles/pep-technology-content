package bookings;

/** Request body for a booking. Complete. */
public record BookingRequest(String attendee, int seats) {
}
