package secure;

import java.security.Principal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * You edit this file in Task 7. This endpoint was added in a hurry: it
 * returns the entity itself, reads the repository directly and never asks
 * who is calling.
 *
 * Given: Spring passes the authenticated caller as the Principal parameter;
 * for a bearer token, caller.getName() is the token's subject from Task 3.
 *
 * TODO Task 7 step 3: talk to the service layer instead of the repository,
 * answer with the response DTO for the caller's own booking, and reject a
 * non-positive id with a Bean Validation constraint.
 */
@RestController
public class BookingController {

    private final BookingRepository repository;

    public BookingController(BookingRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/bookings/{id}")
    public Booking byId(@PathVariable Long id, Principal caller) {
        return repository.findById(id).orElseThrow();
    }
}
