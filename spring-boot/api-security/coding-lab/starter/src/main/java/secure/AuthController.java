package secure;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
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

    /** What a new account needs; bcrypt reads at most 72 bytes, so a password over 72 characters is refused too. */
    public record Registration(@NotBlank String username, @NotBlank @Size(max = 72) String password) {
    }

    @PostMapping("/auth/register")
    public ResponseEntity<Void> register(@Valid @RequestBody Registration registration, BindingResult invalid) {
        // Answer a broken registration here with 400; left to Spring's error page, an anonymous
        // caller would see the security filter's 401 instead.
        if (invalid.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }
        // An existing account is never replaced, so registering cannot take over an account that exists.
        if (accounts.storedPassword(registration.username()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        accounts.register(registration.username(), registration.password());
        return ResponseEntity.status(HttpStatus.CREATED).build();
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
