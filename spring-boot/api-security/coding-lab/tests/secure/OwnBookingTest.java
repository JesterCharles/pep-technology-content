package secure;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * You edit this file in Task 7: step 5 writes the test that proves the
 * ownership check, and step 6 writes the attack each practice stops. The
 * imports you need are already at the top of the file.
 */
@SpringBootTest(properties = { "spring.main.banner-mode=off", "logging.level.root=warn" })
@AutoConfigureMockMvc
class OwnBookingTest {

    // TODO Task 7 step 6: for each practice below, replace null with the request
    // an attacker would send that this practice is there to answer. Write it
    // with attack(caller, "METHOD /path") or login(username, password).
    // Callers: "grace" and "ada" (role USER; Grace owns booking 1, Ada owns
    // booking 2), "admin" (role ADMIN), or null for no token. The user table
    // holds admin from the start, and the step 6 check registers grace and ada
    // before it runs your rows. The shipped check in SecurityLabTest sends each
    // request and checks that this practice is what answers it (the OWASP
    // reading, "common API security risks").
    static Attack answeredByPasswordHashing() { return null; }
    static Attack answeredByRoleChecks() { return null; }
    static Attack answeredByValidation() { return null; }
    static Attack answeredByTheResponseDto() { return null; }
    static Attack answeredBySafeErrorBodies() { return null; }

    /** One attacker request for step 6. Leave this record and the helpers below as shipped. */
    record Attack(String caller, String method, String path, String username, String password) {
    }

    /** A request such as "GET /workshops", sent with the caller's own valid token (none for null). */
    static Attack attack(String caller, String request) {
        String[] parts = request.trim().split("\\s+", 2);
        return new Attack(caller, parts[0], parts.length > 1 ? parts[1] : "", null, null);
    }

    /** POST /auth/token with this username and password, sent without a token. */
    static Attack login(String username, String password) {
        return new Attack(null, "POST", "/auth/token", username, password);
    }

    /** Stands for the value the user table stores for that user, as an attacker who copied the table holds it. */
    static final String STOLEN = "<the stored value>";

    @Autowired
    MockMvc mvc;

    @Autowired
    TokenService tokens;

    @Test
    void task7ProvesTheOwnershipCheck() throws Exception {
        String grace = tokens.issue("grace", List.of("USER"));
        assertNotNull(grace, "Task 3 must be done first: issue returned null");
        MvcResult result = null;
        // TODO Task 7 step 5: replace null above with the request an attacker
        // would try: Grace asks for booking 2, which belongs to Ada, with her own
        // valid token ("Bearer " + grace in the Authorization header). Expect 404
        // and keep the result with .andReturn().
        assertNotNull(result, "step 5 missing: perform Grace's GET /bookings/2 and keep its MvcResult");
        assertEquals("GET", result.getRequest().getMethod(), "step 5 must be a GET");
        assertEquals("/bookings/2", result.getRequest().getRequestURI(),
                "step 5 must ask for Ada's booking 2, not a booking that does not exist");
        assertEquals("Bearer " + grace, result.getRequest().getHeader("Authorization"),
                "step 5 must send Grace's own valid token");
        assertEquals(404, result.getResponse().getStatus(),
                "another customer's booking must look exactly like a missing one");
    }
}
