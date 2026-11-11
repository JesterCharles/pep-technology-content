package secure;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** Login endpoints. This class is complete; you do not edit it. */
@RestController
public class AuthController {

    private final UserAccountService accounts;
    private final TokenService tokens;

    public AuthController(UserAccountService accounts, TokenService tokens) {
        this.accounts = accounts;
        this.tokens = tokens;
    }

    public record Credentials(String username, String password) {
    }

    @PostMapping("/auth/register")
    @org.springframework.web.bind.annotation.ResponseStatus(HttpStatus.CREATED)
    public void register(@RequestBody Credentials credentials) {
        accounts.register(credentials.username(), credentials.password());
    }

    @PostMapping("/auth/token")
    public ResponseEntity<Map<String, String>> token(@RequestBody Credentials credentials) {
        if (!accounts.matches(credentials.username(), credentials.password())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<String> roles = "admin".equals(credentials.username())
                ? List.of("ADMIN")
                : List.of("USER");
        return ResponseEntity.ok(Map.of("token", tokens.issue(credentials.username(), roles)));
    }
}
