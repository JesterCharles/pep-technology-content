package workshops;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * The only file you edit in this lab.
 * Work through the five tasks in the README, top to bottom.
 */
@RestController
public class WorkshopController {

    // TODO Task 1: this manual `new` ignores the seeded bean from CatalogConfig,
    // so the controller sees an empty catalog. Delete the `= new WorkshopCatalog(List.of())`
    // part, make the field final, and assign it from a constructor parameter instead,
    // so Spring injects the configured WorkshopCatalog bean.
    private WorkshopCatalog catalog = new WorkshopCatalog(List.of());

    // TODO Task 1 (same step): return the catalog's workshops instead of List.of().
    // TODO Task 4: add an optional Integer minSeats query parameter; when it is
    // present, return only workshops with at least that many seats.
    @GetMapping("/workshops")
    public List<Workshop> all() {
        return List.of();
    }

    // TODO Task 2: add a GET /workshops/{id} method that takes the id as a
    // @PathVariable and returns the matching workshop.
    // TODO Task 3: make that method return ResponseEntity<Workshop>: 200 with the
    // workshop when the id exists, 404 Not Found when it does not.

    // TODO Task 5: add a POST /workshops method that takes a NewWorkshop
    // @RequestBody, adds it to the catalog, and returns 201 Created with a
    // Location header of /workshops/{newId} and the created workshop as the body.
}
