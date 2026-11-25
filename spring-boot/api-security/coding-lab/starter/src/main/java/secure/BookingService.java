package secure;

import org.springframework.stereotype.Service;

/** You edit this file in Task 7. */
@Service
public class BookingService {

    private final BookingRepository repository;

    public BookingService(BookingRepository repository) {
        this.repository = repository;
    }

    /**
     * The caller's own booking, as a response DTO.
     *
     * TODO Task 7 step 2: look the booking up with your derived query, map it
     * with BookingView.from, and throw a NoSuchElementException
     * (java.util.NoSuchElementException) when nothing matches - the caller
     * then cannot tell another customer's booking from a missing one.
     */
    public BookingView mine(Long id, String owner) {
        return null;
    }
}
