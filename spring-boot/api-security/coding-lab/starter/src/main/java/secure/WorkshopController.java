package secure;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** The API being protected. This class is complete; you do not edit it. */
@RestController
public class WorkshopController {

    @GetMapping("/workshops")
    public List<Map<String, Object>> workshops() {
        return List.of(
                Map.of("id", 1, "title", "Spring Kickstart"),
                Map.of("id", 2, "title", "REST Deep Dive"));
    }

    @GetMapping("/admin/stats")
    public Map<String, Object> stats() {
        return Map.of("bookings", 42);
    }
}
