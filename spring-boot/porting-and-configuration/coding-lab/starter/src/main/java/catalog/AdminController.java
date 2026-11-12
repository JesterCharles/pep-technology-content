package catalog;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

/**
 * A maintenance endpoint guarded by the admin token. This class is complete;
 * you change where the token comes from (Task 5), not this code.
 * The token is a required property with no default: if catalog.admin-token or
 * any placeholder inside it cannot be resolved, the application refuses to start.
 */
@RestController
public class AdminController {

    private final String adminToken;

    public AdminController(@Value("${catalog.admin-token}") String adminToken) {
        this.adminToken = adminToken;
    }

    @GetMapping("/admin/ping")
    public ResponseEntity<Void> ping(
            @RequestHeader(name = "X-Admin-Token", required = false) String token) {
        if (adminToken.equals(token)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(401).build();
    }
}
