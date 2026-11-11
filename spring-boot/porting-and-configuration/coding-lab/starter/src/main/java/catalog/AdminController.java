package catalog;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

/**
 * A maintenance endpoint guarded by the admin token. This class is complete;
 * you change where the token comes from (Task 5), not this code.
 */
@RestController
public class AdminController {

    private final CatalogProperties properties;

    public AdminController(CatalogProperties properties) {
        this.properties = properties;
    }

    @GetMapping("/admin/ping")
    public ResponseEntity<Void> ping(
            @RequestHeader(name = "X-Admin-Token", required = false) String token) {
        if (properties.adminToken() != null && properties.adminToken().equals(token)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(401).build();
    }
}
