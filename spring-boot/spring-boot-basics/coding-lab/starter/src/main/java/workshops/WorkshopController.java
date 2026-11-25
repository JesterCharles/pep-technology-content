package workshops;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * You edit this file in Tasks 1, 2, 3 and 6.
 * Work through the tasks in the README, top to bottom.
 */
@RestController
public class WorkshopController {

    // TODO Task 1: this manual `new` ignores the seeded catalog bean, so the
    // controller sees an empty catalog. Get the bean by constructor injection instead.
    private WorkshopCatalog catalog = new WorkshopCatalog(List.of());

    // TODO Task 1 (same step): return the catalog's workshops instead of List.of().
    @GetMapping("/workshops")
    public List<Workshop> all() {
        return List.of();
    }

    // TODO Task 2: add GET /workshops/{id}: 200 with the workshop, 404 when the id is unknown.

    // TODO Task 3: add POST /workshops: 201 Created, a Location header and the created workshop.

    // TODO Task 6: add the GET operation that fixtures/workshops-openapi.yaml describes.
}
