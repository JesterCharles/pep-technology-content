package bookings;

import org.springframework.data.jpa.repository.JpaRepository;

/** You edit this file in Task 3. */
public interface WorkshopRepository extends JpaRepository<Workshop, Long> {

    // TODO Task 3: declare a fetch-join query that loads workshops AND their
    // sessions in one statement:
    //   @Query("select distinct w from Workshop w left join fetch w.sessions")
    //   List<Workshop> findAllWithSessions();
}
