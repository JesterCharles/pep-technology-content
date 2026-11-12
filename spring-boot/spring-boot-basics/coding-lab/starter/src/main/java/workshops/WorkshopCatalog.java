package workshops;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * The in-memory catalog. This class is complete; you do not edit it.
 * It is NOT annotated: CatalogConfig turns it into a bean with seed data,
 * which is exactly what Task 1 wires into the controller.
 */
public class WorkshopCatalog {

    private final List<Workshop> workshops;

    public WorkshopCatalog(List<Workshop> seed) {
        this.workshops = new ArrayList<>(seed);
    }

    public List<Workshop> findAll() {
        return List.copyOf(workshops);
    }

    public Optional<Workshop> findById(int id) {
        return workshops.stream().filter(w -> w.id() == id).findFirst();
    }

    public Workshop add(NewWorkshop request) {
        int nextId = workshops.stream().mapToInt(Workshop::id).max().orElse(0) + 1;
        Workshop created = new Workshop(nextId, request.title(), request.seats());
        workshops.add(created);
        return created;
    }
}
