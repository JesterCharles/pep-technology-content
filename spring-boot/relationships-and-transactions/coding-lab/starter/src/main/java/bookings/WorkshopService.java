package bookings;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** You edit this file in Tasks 3 and 4. */
@Service
public class WorkshopService {

    private final WorkshopRepository workshops;

    public WorkshopService(WorkshopRepository workshops) {
        this.workshops = workshops;
    }

    /**
     * One row per workshop with its session count.
     * TODO Task 3: this reads every workshop and then, inside the loop, each
     * workshop's lazy sessions collection - the N+1 pattern (1 query for the
     * workshops + 1 per workshop). Replace findAll() with your fetch-join
     * method so everything arrives in one query.
     */
    @Transactional(readOnly = true)
    public List<WorkshopSummary> summaries() {
        return workshops.findAll().stream()
                .map(w -> new WorkshopSummary(w.getId(), w.getTitle(), w.getSessions().size()))
                .toList();
    }

    /**
     * The sessions of one workshop.
     * TODO Task 4: this touches the lazy sessions collection, but no transaction
     * is open here, so the Hibernate session has already closed:
     * LazyInitializationException. Open a read-only transaction for this method
     * with @Transactional(readOnly = true), like summaries() above.
     */
    public List<SessionResponse> sessionsOf(Long workshopId) {
        Workshop workshop = workshops.findById(workshopId).orElseThrow();
        return workshop.getSessions().stream()
                .map(s -> new SessionResponse(s.getId(), s.getStartDate(), s.getSeatsLeft()))
                .toList();
    }
}
