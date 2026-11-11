package bookings;

// TODO Task 1: the constraint imports you need are ready to use.
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

/**
 * The request body for creating a booking. You edit this file in Task 1.
 *
 * TODO Task 1: constrain the components so bad requests are rejected before
 * any code runs: attendee @NotBlank, email @NotBlank and @Email, seats @Min(1).
 */
public record NewBooking(String attendee, String email, int seats) {
}
