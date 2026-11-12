package bookings;

/** Response DTO; returning DTOs instead of entities avoids recursive JSON. Complete. */
public record WorkshopSummary(Long id, String title, int sessionCount) {
}
