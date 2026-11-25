package bookings;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** You edit this file in Task 1 (one annotation) and Task 5 (one annotation). */
@RestController
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    // TODO Task 5 step 3: ids start at 1. After you have reproduced the report
    // and written your prediction, reject zero and negative ids with a Bean
    // Validation constraint on the id parameter (README Task 5).
    @GetMapping("/bookings/{id}")
    public Booking byId(@PathVariable Long id) {
        return service.byId(id);
    }

    // TODO Task 1: constraints only run when validation is requested: put @Valid
    // (jakarta.validation.Valid) in front of the @RequestBody parameter.
    @PostMapping("/bookings")
    @ResponseStatus(HttpStatus.CREATED)
    public Booking create(@RequestBody NewBooking request) {
        return service.create(request);
    }
}
