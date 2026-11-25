package secure;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.ServletException;
import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Map;
import java.util.List;
import org.junit.jupiter.api.Test;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.Arrays;
import java.util.Optional;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.ApplicationContext;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

/**
 * Tasks 1-4 and 7: hashing, the filter chain, issuing and checking JWTs, a
 * booking endpoint that serves only the caller's own data, and the attack
 * each practice stops (step 6 requests live in OwnBookingTest). The CORS check
 * proves that the default profile stays closed to other origins (Task 6).
 */
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

    @Autowired
    ApplicationContext context;

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
        // Flip a character in the middle of the payload segment, which always
        // invalidates the signature over header.payload.
        String[] parts = admin.split("\\.");
        int mid = parts[1].length() / 2;
        char flipped = parts[1].charAt(mid) == 'A' ? 'B' : 'A';
        String tampered = parts[0] + "."
                + parts[1].substring(0, mid) + flipped + parts[1].substring(mid + 1)
                + "." + parts[2];
        mvc.perform(get("/admin/stats").header("Authorization", "Bearer " + tampered))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void defaultProfileSendsNoCorsHeaders() throws Exception {
        // Outside the dev profile no cross-origin call is allowed, not even from the local front end,
        // and no CORS configuration exists at all: it belongs to the dev profile only.
        assertTrue(context.getBeansOfType(UrlBasedCorsConfigurationSource.class).isEmpty(),
                "the default profile must not contain a CORS configuration bean: keep it in the dev profile (Task 6)");
        mvc.perform(options("/workshops")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }

    @Test
    void task7ServesOnlyTheCallersOwnBooking() throws Exception {
        // The review keeps the layers: the controller talks to the service, the repository
        // answers with a derived query that takes the owner, and the id carries a constraint.
        assertTrue(Arrays.stream(BookingController.class.getConstructors())
                        .flatMap(c -> Arrays.stream(c.getParameterTypes()))
                        .noneMatch(BookingRepository.class::equals),
                "Task 7 step 3: BookingController must use BookingService, not the repository");
        assertTrue(Arrays.stream(BookingController.class.getDeclaredFields())
                        .noneMatch(f -> BookingRepository.class.isAssignableFrom(f.getType())),
                "Task 7 step 3: BookingController must use BookingService, not the repository");
        assertTrue(Arrays.stream(BookingRepository.class.getDeclaredMethods())
                        .anyMatch(m -> m.getName().startsWith("findBy") && m.getName().contains("Owner")
                                && m.getReturnType().equals(Optional.class)
                                && Arrays.equals(m.getParameterTypes(), new Class<?>[] { Long.class, String.class })),
                "Task 7 step 1: BookingRepository needs a derived query that finds a booking by id and owner");
        Method byId = Arrays.stream(BookingController.class.getDeclaredMethods())
                .filter(m -> m.getName().equals("byId")).findFirst().orElseThrow();
        Parameter id = byId.getParameters()[0];
        assertTrue(Arrays.stream(id.getAnnotations())
                        .anyMatch(a -> a.annotationType().isAnnotationPresent(jakarta.validation.Constraint.class)),
                "Task 7 step 3: check the id with a Bean Validation constraint, not by hand");
        String grace = tokens.issue("grace", List.of("USER"));
        assertNotNull(grace, "Task 3 must be done first: issue returned null");
        // Grace reads her own booking, and sees only the response fields.
        mvc.perform(get("/bookings/1").header("Authorization", "Bearer " + grace))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.workshop").value("Spring Kickstart"))
                .andExpect(jsonPath("$.seats").value(2))
                .andExpect(jsonPath("$.owner").doesNotExist())
                .andExpect(jsonPath("$.paymentReference").doesNotExist());
        // Ada's booking looks exactly like a missing one, and the body reveals nothing internal.
        mvc.perform(get("/bookings/2").header("Authorization", "Bearer " + grace))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.title").value("Booking not found"))
                .andExpect(content().string(not(containsString("ada"))))
                .andExpect(content().string(not(containsString("PAY-"))))
                .andExpect(content().string(not(containsString("Exception"))));
        mvc.perform(get("/bookings/999").header("Authorization", "Bearer " + grace))
                .andExpect(status().isNotFound());
        // A bad id is the client's mistake, and no token means no access at all.
        mvc.perform(get("/bookings/0").header("Authorization", "Bearer " + grace))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/bookings/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void task7ShowsTheAttackEachPracticeStops() throws Exception {
        // Step 6 in OwnBookingTest: for each practice, the attack it is there to answer. Each
        // request is sent for real, and the checks below are worked out from the running app
        // and the shipped classes, so a row passes only when that practice is what answers it.
        // The rows' own customer accounts are registered first, so no other test's order matters.
        accounts.register("grace", "grace-dev-pass-1");
        accounts.register("ada", "ada-dev-pass-1");
        List<String> problems = new ArrayList<>();
        String earlier = earlierTasks();
        if (earlier != null) {
            problems.add(earlier);
        } else {
            row(problems, "answeredByPasswordHashing", OwnBookingTest.answeredByPasswordHashing(), this::answeredByHashing);
            row(problems, "answeredByRoleChecks", OwnBookingTest.answeredByRoleChecks(), this::answeredByRoleCheck);
            row(problems, "answeredByValidation", OwnBookingTest.answeredByValidation(), this::answeredByValidation);
            row(problems, "answeredByTheResponseDto", OwnBookingTest.answeredByTheResponseDto(), this::answeredByTheDto);
            row(problems, "answeredBySafeErrorBodies", OwnBookingTest.answeredBySafeErrorBodies(), this::answeredBySafeErrors);
        }
        assertTrue(problems.isEmpty(), "Task 7 step 6, in OwnBookingTest:\n  " + String.join("\n  ", problems));
    }

    /** A step 6 request whose path is not a real URI, such as one with {id} still in it. */
    static final class MalformedRow extends RuntimeException {
    }

    interface RowCheck {
        String problem(OwnBookingTest.Attack attack) throws Exception;
    }

    private static void row(List<String> problems, String name, OwnBookingTest.Attack attack, RowCheck check)
            throws Exception {
        String problem;
        try {
            problem = attack == null ? "replace null with the request this practice is there to answer"
                    : check.problem(attack);
        } catch (MalformedRow malformed) {
            problem = "write a real path: an actual id in place of any {placeholder}, "
                    + "and no spaces or other characters a URL cannot hold";
        }
        if (problem != null) {
            problems.add(name + ": " + problem);
        }
    }

    /** Step 6 runs on top of Tasks 1 to 3; says which one is missing, or null when they are done. */
    private String earlierTasks() throws Exception {
        if (tokens.issue("grace", List.of("USER")) == null) {
            return "finish Task 3 first: issue returned null, so no caller has a token yet";
        }
        List<String> issuedRoles;
        try {
            issuedRoles = context.getBean(JwtDecoder.class).decode(tokens.issue("admin", List.of("ADMIN")))
                    .getClaimAsStringList("roles");
        } catch (RuntimeException notReadable) {
            issuedRoles = null;
        }
        if (issuedRoles == null || !issuedRoles.contains("ADMIN")) {
            return "finish Task 3 first: the token's roles claim does not carry the caller's roles";
        }
        // Two paths no row accepts. With Task 2's chain, a valid USER token reaches the app on the first
        // (simply not found, 404) and is refused by the ADMIN rule on the second (403). A chain without
        // its .oauth2ResourceServer line refuses the token (401 or 403); without the chain bean at all,
        // Spring Boot's default chain lets the token through to /admin as well (404).
        String bearer = "Bearer " + tokens.issue("grace", List.of("USER"));
        int open = mvc.perform(get("/step6-prerequisite-probe").header("Authorization", bearer))
                .andReturn().getResponse().getStatus();
        if (open == 401 || open == 403) {
            return "finish Task 2 first: the chain does not accept a valid token yet "
                    + "(is the .oauth2ResourceServer line in place?)";
        }
        int admin = mvc.perform(get("/admin/step6-prerequisite-probe").header("Authorization", bearer))
                .andReturn().getResponse().getStatus();
        if (admin != 403) {
            return "finish Task 2 first: a USER token is not refused on /admin/** yet "
                    + "(is your SecurityFilterChain a @Bean with the ADMIN rule?)";
        }
        int asAdmin = mvc.perform(get("/admin/step6-prerequisite-probe")
                .header("Authorization", "Bearer " + tokens.issue("admin", List.of("ADMIN"))))
                .andReturn().getResponse().getStatus();
        if (asAdmin == 401 || asAdmin == 403) {
            return "finish Task 2 first: an ADMIN token is refused on /admin/** "
                    + "(the rule should be hasRole(\"ADMIN\"), which matches the ROLE_ADMIN authority the converter gives)";
        }
        return null;
    }

    /** Sends the attack as written, or as the given caller; null when the request ended in an unhandled exception. */
    private MvcResult send(OwnBookingTest.Attack attack, String caller) throws Exception {
        MockHttpServletRequestBuilder request;
        try {
            request = MockMvcRequestBuilders.request(HttpMethod.valueOf(attack.method().toUpperCase()),
                    java.net.URI.create(attack.path()));
        } catch (IllegalArgumentException notAUri) {
            throw new MalformedRow();
        }
        if (attack.username() != null) {
            String sent = OwnBookingTest.STOLEN.equals(attack.password())
                    ? accounts.storedPassword(attack.username()) : attack.password();
            request.contentType(MediaType.APPLICATION_JSON).content("{\"username\":" + json(attack.username())
                    + ",\"password\":" + json(sent) + "}");
        }
        if (caller != null) {
            String token = tokens.issue(caller, "admin".equals(caller) ? List.of("ADMIN") : List.of("USER"));
            request.header("Authorization", "Bearer " + token);
        }
        try {
            return mvc.perform(request).andReturn();
        } catch (ServletException unhandled) {
            return null;
        }
    }

    private static String json(String value) {
        return value == null ? "null" : "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }

    private static String well(OwnBookingTest.Attack attack) {
        if (attack.method() == null || !attack.method().matches("(?i)GET|POST|PUT|DELETE|PATCH")) {
            return "write the request as \"METHOD /path\", for example \"GET /workshops\"";
        }
        if (attack.path() == null || !attack.path().startsWith("/")) {
            return "the path must start with /";
        }
        if (attack.caller() != null && !List.of("grace", "ada", "admin").contains(attack.caller())) {
            return "the caller must be \"grace\", \"ada\", \"admin\" or null";
        }
        return null;
    }

    private String answeredByHashing(OwnBookingTest.Attack attack) throws Exception {
        if (attack.username() == null) {
            return "password hashing answers a login: write it with login(username, password)";
        }
        String stored = accounts.storedPassword(attack.username());
        if (stored == null) {
            return "the user table holds no account with that name";
        }
        if (!OwnBookingTest.STOLEN.equals(attack.password())) {
            return "hashing protects what the user table stores, so this login is not one it answers";
        }
        Map<String, String> known = Map.of("admin", "admin-dev-password", "grace", "grace-dev-pass-1", "ada", "ada-dev-pass-1");
        if (stored.equals(known.get(attack.username()))) {
            return "finish Task 1 first: the user table still stores passwords as they were given";
        }
        MvcResult real = send(OwnBookingTest.login("grace", "grace-dev-pass-1"), null);
        if (real == null || real.getResponse().getStatus() != 200) {
            return "finish Tasks 1 and 2 first: a login with the real password does not succeed yet";
        }
        MvcResult result = send(attack, null);
        if (result == null || result.getResponse().getStatus() != 401) {
            return "password hashing did not refuse this login";
        }
        return null;
    }

    private String answeredByRoleCheck(OwnBookingTest.Attack attack) throws Exception {
        String shape = well(attack);
        if (shape != null) {
            return shape;
        }
        if (attack.username() != null) {
            return "role checks decide what a logged-in caller may do, not whether a login succeeds";
        }
        if (attack.caller() == null || "admin".equals(attack.caller())) {
            return "this caller is not one a role check refuses";
        }
        MvcResult result = send(attack, attack.caller());
        MvcResult asAdmin = send(attack, "admin");
        if (asAdmin == null || asAdmin.getResponse().getStatus() / 100 != 2) {
            if (result != null && result.getResponse().getStatus() == 403) {
                return "the role check did refuse this caller, but this API has no such admin action, "
                        + "so the row cannot show that an ADMIN may do it; aim at an admin action this API has";
            }
            return "even an ADMIN cannot do this, so no role check is what answers it";
        }
        if (result == null || result.getResponse().getStatus() != 403) {
            return "role checks did not refuse this request (finish Task 2's ADMIN rule if it is missing)";
        }
        return null;
    }

    private String answeredByValidation(OwnBookingTest.Attack attack) throws Exception {
        String shape = well(attack);
        if (shape != null) {
            return shape;
        }
        Method byId = Arrays.stream(BookingController.class.getDeclaredMethods())
                .filter(m -> m.getName().equals("byId")).findFirst().orElse(null);
        if (byId == null || byId.getParameterCount() == 0 || Arrays.stream(byId.getParameters()[0].getAnnotations())
                .noneMatch(a -> a.annotationType().isAnnotationPresent(jakarta.validation.Constraint.class))) {
            return "finish Task 7 step 3 first: the booking id carries no constraint yet";
        }
        MvcResult result = send(attack, attack.caller());
        if (attack.username() != null && result != null && result.getResponse().getStatus() == 401) {
            return "this login was refused by the password check, not by a Bean Validation constraint";
        }
        if (attack.caller() == null && result != null && result.getResponse().getStatus() == 401) {
            return "without a token the security filter refused this request before it reached the controller, "
                    + "so validation never ran; the request must carry a caller's token";
        }
        Exception rejected = result == null ? null : result.getResolvedException();
        if (!(rejected instanceof HandlerMethodValidationException || rejected instanceof MethodArgumentNotValidException
                || rejected instanceof ConstraintViolationException)) {
            return "no Bean Validation constraint rejected this request";
        }
        return null;
    }

    private String answeredByTheDto(OwnBookingTest.Attack attack) throws Exception {
        String shape = well(attack);
        if (shape != null) {
            return shape;
        }
        Method byId = Arrays.stream(BookingController.class.getDeclaredMethods())
                .filter(m -> m.getName().equals("byId")).findFirst().orElse(null);
        if (byId == null || byId.getReturnType().equals(Booking.class)) {
            return "finish Task 7 steps 2 and 3 first: the handler still returns the Booking entity";
        }
        MvcResult result = attack.caller() == null ? null : send(attack, attack.caller());
        Map<String, Object> body = null;
        if (result != null && result.getResponse().getStatus() == 200) {
            try {
                body = JsonParserFactory.getJsonParser().parseMap(result.getResponse().getContentAsString());
            } catch (RuntimeException notAnObject) {
                body = null;
            }
        }
        List<String> entityFields = Arrays.stream(Booking.class.getDeclaredFields()).map(f -> f.getName()).toList();
        if (body == null || body.isEmpty() || !entityFields.containsAll(body.keySet())) {
            return "this request does not give the caller a booking, so the response DTO is not what answers it";
        }
        if (body.keySet().containsAll(entityFields)) {
            return "the response still carries every field of the Booking entity";
        }
        return null;
    }

    private String answeredBySafeErrors(OwnBookingTest.Attack attack) throws Exception {
        String shape = well(attack);
        if (shape != null) {
            return shape;
        }
        boolean hasHandler = Arrays.stream(ApiErrors.class.getDeclaredMethods())
                .anyMatch(m -> m.isAnnotationPresent(ExceptionHandler.class));
        if (!hasHandler) {
            return "finish Task 7 step 4 first: ApiErrors has no handler yet";
        }
        MvcResult result = send(attack, attack.caller());
        if (result == null) {
            return "this request ends in an exception that no handler answers";
        }
        Exception failure = result.getResolvedException();
        if (result.getResponse().getStatus() < 400) {
            return "this request succeeds, so no error body is written";
        }
        if (failure == null) {
            return "this request was refused before it reached your code (for example by the security filter), "
                    + "so your ApiErrors handler never wrote its body";
        }
        boolean handledByApiErrors = Arrays.stream(ApiErrors.class.getDeclaredMethods())
                .filter(m -> m.isAnnotationPresent(ExceptionHandler.class))
                .flatMap(m -> m.getAnnotation(ExceptionHandler.class).value().length > 0
                        ? Arrays.stream(m.getAnnotation(ExceptionHandler.class).value())
                        : Arrays.stream(m.getParameterTypes()).filter(Throwable.class::isAssignableFrom))
                .anyMatch(type -> type.isInstance(failure));
        if (!handledByApiErrors) {
            return "your ApiErrors handler did not answer this error";
        }
        // Internal detail is the exception's type, a stack frame, or whatever text the exception carries.
        // The exception's own message may be wording the learner chose, so the handler is also called
        // directly with a marker message: a handler that copies exception text into its body shows it.
        String body = result.getResponse().getContentAsString();
        if (body.contains(failure.getClass().getName()) || body.contains(failure.getClass().getSimpleName())
                || body.contains("Exception") || body.matches("(?s).*\\bat [\\w$.]+\\(.*")
                || handlerEchoesExceptionText(failure.getClass())) {
            return "the error body still reveals the exception";
        }
        return null;
    }

    private boolean handlerEchoesExceptionText(Class<? extends Exception> type) throws Exception {
        // Send an exception of the same type, carrying a marker message, through Spring MVC's own
        // exception resolvers, as if the booking request had thrown it, and read what was written.
        String marker = "step6-internal-marker-" + System.nanoTime();
        Exception probe;
        try {
            probe = type.getConstructor(String.class).newInstance(marker);
        } catch (ReflectiveOperationException noMessageConstructor) {
            return false;
        }
        String token = tokens.issue("grace", List.of("USER"));
        org.springframework.security.oauth2.jwt.Jwt jwt = context.getBean(JwtDecoder.class).decode(token);
        org.springframework.security.core.Authentication caller =
                new org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken(
                        jwt, List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER")));
        org.springframework.mock.web.MockHttpServletRequest request =
                new org.springframework.mock.web.MockHttpServletRequest("GET", "/bookings/999");
        request.addHeader("Accept", "application/json, application/problem+json");
        request.addHeader("Authorization", "Bearer " + token);
        request.setUserPrincipal(caller);
        org.springframework.mock.web.MockHttpServletResponse response =
                new org.springframework.mock.web.MockHttpServletResponse();
        org.springframework.security.core.context.SecurityContext before =
                org.springframework.security.core.context.SecurityContextHolder.getContext();
        org.springframework.security.core.context.SecurityContext during =
                org.springframework.security.core.context.SecurityContextHolder.createEmptyContext();
        during.setAuthentication(caller);
        org.springframework.security.core.context.SecurityContextHolder.setContext(during);
        try {
            HandlerMethod byId = new HandlerMethod(context.getBean(BookingController.class),
                    Arrays.stream(BookingController.class.getDeclaredMethods())
                            .filter(m -> m.getName().equals("byId")).findFirst().orElseThrow());
            context.getBean("handlerExceptionResolver", org.springframework.web.servlet.HandlerExceptionResolver.class)
                    .resolveException(request, response, byId, probe);
        } catch (RuntimeException resolverFailed) {
            return false;
        } finally {
            org.springframework.security.core.context.SecurityContextHolder.setContext(before);
        }
        return response.getContentAsString().contains(marker) || String.valueOf(response.getErrorMessage()).contains(marker);
    }
}
