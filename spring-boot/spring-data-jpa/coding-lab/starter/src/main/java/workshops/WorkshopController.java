package workshops;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * You edit this file in Task 5: these handlers return Workshop entities
 * directly, which leaks internalNotes to every client. Create a
 * WorkshopResponse record (id, title, category, seats) with one mapper method
 * and return DTOs from every handler instead.
 */
@RestController
public class WorkshopController {

    private final WorkshopService service;

    public WorkshopController(WorkshopService service) {
        this.service = service;
    }

    @GetMapping("/workshops")
    public List<Workshop> all() {
        return service.all();
    }

    @GetMapping("/workshops/by-category")
    public List<Workshop> byCategory(@RequestParam String category) {
        return service.byCategory(category);
    }

    @GetMapping("/workshops/search")
    public List<Workshop> search(@RequestParam String q) {
        return service.search(q);
    }

    /** Accepts ?page=0&size=2&sort=seats,desc and returns a stable paged JSON shape. */
    @GetMapping("/workshops/page")
    public PagedModel<Workshop> page(Pageable pageable) {
        return new PagedModel<>(service.page(pageable));
    }
}
