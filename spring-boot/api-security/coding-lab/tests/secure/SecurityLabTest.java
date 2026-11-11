package secure;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;

/** Tasks 1-4: hashing, the filter chain, issuing and checking JWTs. */
@SpringBootTest(properties = { "spring.main.banner-mode=off", "logging.level.root=warn" })
@AutoConfigureMockMvc
class SecurityLabTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectProvider<PasswordEncoder> encoderProvider;

    @Autowired
    UserAccountService accounts;

    @Autowired
    TokenService tokens;

    @Autowired
    JwtDecoder decoder;

    @Test
    void task1StoresOnlyHashedPasswords() {
        PasswordEncoder encoder = encoderProvider.getIfAvailable();
        assertNotNull(encoder,
                "define the delegating PasswordEncoder bean in SecurityConfig (Task 1)");
        accounts.register("grace", "correct-horse-battery");
        String stored = accounts.storedPassword("grace");
        assertTrue(stored != null && stored.startsWith("{bcrypt}"),
                "register must store a delegating bcrypt hash, not the raw password");
        assertTrue(accounts.matches("grace", "correct-horse-battery"),
                "matches must accept the right password against the stored hash");
        assertFalse(accounts.matches("grace", "wrong-password"),
                "matches must reject a wrong password");
    }

    @Test
    void task2ProtectsEndpointsByPathAndRole() throws Exception {
        // The listing is public.
        mvc.perform(get("/workshops"))
                .andExpect(status().isOk());
        // Admin data is not: anonymous gets 401, the wrong role 403, ADMIN 200.
        mvc.perform(get("/admin/stats"))
                .andExpect(status().isUnauthorized());
        mvc.perform(get("/admin/stats").with(user("fan").roles("USER")))
                .andExpect(status().isForbidden());
        mvc.perform(get("/admin/stats").with(user("boss").roles("ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bookings").value(42));
    }

    @Test
    void task3IssuesASignedTokenWithClaimsAndExpiry() {
        String token = tokens.issue("grace", List.of("USER"));
        assertNotNull(token, "issue must return the signed token value (Task 3)");
        Jwt jwt = decoder.decode(token);
        assertTrue(jwt.getSubject().equals("grace"), "the subject must be the username");
        assertTrue(jwt.getClaimAsStringList("roles").contains("USER"),
                "the roles claim must carry the given roles");
        assertNotNull(jwt.getExpiresAt(), "the token must expire");
        assertTrue(jwt.getExpiresAt().isAfter(Instant.now()),
                "the expiry must lie in the future");
    }

    @Test
    void task4AcceptsItsOwnTokensAndRejectsTampering() throws Exception {
        String admin = tokens.issue("admin", List.of("ADMIN"));
        assertNotNull(admin, "Task 3 must be done first: issue returned null");
        mvc.perform(get("/admin/stats").header("Authorization", "Bearer " + admin))
                .andExpect(status().isOk());
        String tampered = admin.substring(0, admin.length() - 2)
                + (admin.endsWith("xx") ? "yy" : "xx");
        mvc.perform(get("/admin/stats").header("Authorization", "Bearer " + tampered))
                .andExpect(status().isUnauthorized());
    }
}
