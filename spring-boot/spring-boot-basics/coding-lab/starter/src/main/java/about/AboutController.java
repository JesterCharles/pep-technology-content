package about;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * A small endpoint kept in its own package, the way a shared module would be.
 * This class is complete; you do not edit or move it. Task 5 makes Spring find it.
 */
@RestController
public class AboutController {

    private final String service;

    public AboutController(@Value("${spring.application.name:unnamed}") String service) {
        this.service = service;
    }

    @GetMapping("/about")
    public About about() {
        return new About(service, "Workshop catalog lab");
    }

    /** The JSON body of GET /about. */
    public record About(String service, String description) {
    }
}
