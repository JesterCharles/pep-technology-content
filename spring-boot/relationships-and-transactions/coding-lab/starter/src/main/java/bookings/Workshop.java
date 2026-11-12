package bookings;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
// TODO Task 1: more imports you will need.
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

/** You edit this file in Task 1. */
@Entity
public class Workshop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    // TODO Task 1: map the one-to-many side: @OneToMany(mappedBy = "workshop").
    // The sessions table holds the foreign key, so Session is the owning side
    // and this side mirrors it through mappedBy.
    private List<Session> sessions = new ArrayList<>();

    protected Workshop() {
    }

    public Workshop(String title) {
        this.title = title;
    }

    /** Keeps both sides of the relationship in sync; use it instead of sessions.add. */
    public void addSession(Session session) {
        sessions.add(session);
        session.setWorkshop(this);
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public List<Session> getSessions() {
        return sessions;
    }
}
