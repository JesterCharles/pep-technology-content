package bookings;

import org.springframework.stereotype.Service;

/** You edit this file in Task 2. */
@Service
public class BookingService {

    private final SessionRepository sessions;
    private final BookingRepository bookings;

    public BookingService(SessionRepository sessions, BookingRepository bookings) {
        this.sessions = sessions;
        this.bookings = bookings;
    }

    /** One session's current state. Complete; it reads only plain fields, no lazy collection. */
    public SessionResponse session(Long id) {
        Session session = sessions.findById(id).orElseThrow();
        return new SessionResponse(session.getId(), session.getStartDate(), session.getSeatsLeft());
    }

    /**
     * Reserves seats, then records the booking: two writes that must stand or
     * fall together.
     *
     * TODO Task 2: without a transaction, the seat update in the middle commits
     * on its own; when the check below then throws, the update stays and the
     * booking is never written - the session ends up with negative seats and no
     * matching booking. Mark this method @Transactional
     * (org.springframework.transaction.annotation.Transactional) so the
     * unchecked exception rolls both writes back.
     */
    public Booking book(Long sessionId, String attendee, int seats) {
        Session session = sessions.findById(sessionId).orElseThrow();
        session.setSeatsLeft(session.getSeatsLeft() - seats);
        sessions.save(session);
        if (session.getSeatsLeft() < 0) {
            throw new IllegalStateException(
                    "not enough seats left in session " + sessionId);
        }
        return bookings.save(new Booking(attendee, seats, sessionId));
    }
}
