package catalog;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Shows the effective configuration. This class is complete; you do not edit it. */
@RestController
public class InfoController {

    private final CatalogProperties properties;

    public InfoController(CatalogProperties properties) {
        this.properties = properties;
    }

    @GetMapping("/info")
    public Map<String, Object> info() {
        // The admin token is deliberately NOT exposed here: secrets stay out of responses and logs.
        return Map.of(
                "greeting", properties.greeting(),
                "pageSize", properties.pageSize() == null ? 0 : properties.pageSize());
    }
}
