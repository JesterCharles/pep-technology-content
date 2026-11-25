package secure;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * You edit this file in Task 7.
 *
 * TODO Task 7 step 1: findById returns anyone's booking. Declare a derived
 * query that takes the id and the caller's username, so the database only
 * returns a booking the caller owns, as an Optional (Spring Data JPA page,
 * "derived queries").
 */
public interface BookingRepository extends JpaRepository<Booking, Long> {
}
