package workshops;

import java.util.List;

// TODO Task 1: register the catalog below as a bean. Its construction needs logic
// (seed data), so use the registration route the beans page recommends for that case.
public class CatalogConfig {

    public WorkshopCatalog workshopCatalog() {
        return new WorkshopCatalog(List.of(
                new Workshop(1, "Spring Kickstart", 20),
                new Workshop(2, "REST Deep Dive", 8)));
    }
}
