package bookings;

import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** The web layer. This class is complete; you do not edit it. */
@RestController
public class ApiController {

    private final WorkshopService workshopService;
    private final BookingService bookingService;

    public ApiController(WorkshopService workshopService, BookingService bookingService) {
        this.workshopService = workshopService;
        this.bookingService = bookingService;
    }

    @GetMapping("/workshops/summary")
    public List<WorkshopSummary> summaries() {
        return workshopService.summaries();
    }

    @GetMapping("/workshops/{id}/sessions")
    public List<SessionResponse> sessionsOf(@PathVariable Long id) {
        return workshopService.sessionsOf(id);
    }

    @GetMapping("/sessions/{id}")
    public SessionResponse session(@PathVariable Long id) {
        return bookingService.session(id);
    }

    @PostMapping("/sessions/{id}/bookings")
    public ResponseEntity<Long> book(@PathVariable Long id, @RequestBody BookingRequest request) {
        Booking booking = bookingService.book(id, request.attendee(), request.seats());
        return ResponseEntity.status(HttpStatus.CREATED).body(booking.getId());
    }

    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public void notFound() {
    }

    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public void conflict() {
    }
}
