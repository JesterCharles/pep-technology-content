package bookings;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Service;

/** In-memory storage for bookings. This class is complete; you do not edit it. */
@Service
public class BookingService {

    private final Map<Long, Booking> bookings = new LinkedHashMap<>();
    private final AtomicLong ids = new AtomicLong(1);

    public BookingService() {
        create(new NewBooking("Ada Lovelace", "ada@example.com", 2));
    }

    public Booking byId(Long id) {
        Booking booking = bookings.get(id);
        if (booking == null) {
            throw new NoSuchElementException("No booking with id " + id);
        }
        return booking;
    }

    public Booking create(NewBooking request) {
        Long id = ids.getAndIncrement();
        Booking booking = new Booking(id, request.attendee(), request.email(), request.seats());
        bookings.put(id, booking);
        return booking;
    }
}
