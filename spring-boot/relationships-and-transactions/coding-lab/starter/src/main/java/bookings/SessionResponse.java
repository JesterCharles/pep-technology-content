package bookings;

/** Response DTO for one session; it never serializes the workshop back-reference. Complete. */
public record SessionResponse(Long id, String startDate, int seatsLeft) {
}
