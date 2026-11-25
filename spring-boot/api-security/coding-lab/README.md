# API Security lab: lock down the workshop API

## Goal

This is the Standard track's required lab for the API security module. It comes at the end of the module: after the Spring review page and before the Spring module check, on the same day.
Seven linked tasks: hash stored passwords, restrict endpoints by path and role, issue a signed JWT, let the resource server check it on every request, keep a dev profile open for the front-end team (including the browser's CORS check for the local front end) without ever weakening the default profile, and finally close the classic API risks on a booking endpoint that was added in a hurry.
Task 7 is a mixed review of earlier Spring days (layers and DTOs, a Spring Data derived query, validation, error bodies without internals and a MockMvc test), applied to a risk from the module's OWASP reading, and it ends with the attack each earlier practice answers. The one piece it gives you is the caller: the handler already receives it as a `java.security.Principal`.

Authoring estimate, not a measured learner pilot: about 5 minutes of setup before the day, then about 55 minutes for the seven tasks (Tasks 1 to 5 about 31, Task 6 about 5, Task 7 about 19). If the lab passes 60 minutes, pause and finish Task 7 in self-study so the Spring module check still starts on time.
All credentials in this lab are disposable development values; the JWT key comes from a property with an environment-variable override, exactly as the secrets topic teaches.

## What you edit

| File | Tasks |
| --- | --- |
| `starter/src/main/java/secure/SecurityConfig.java` | 1, 2, 5 |
| `starter/src/main/java/secure/UserAccountService.java` | 1 |
| `starter/src/main/java/secure/TokenService.java` | 3 |
| `starter/src/main/java/secure/DevSecurityConfig.java` (shipped empty, with its imports) | 5, 6 |
| `starter/src/main/java/secure/BookingRepository.java` | 7 |
| `starter/src/main/java/secure/BookingService.java` | 7 |
| `starter/src/main/java/secure/BookingController.java` | 7 |
| `starter/src/main/java/secure/ApiErrors.java` | 7 |
| `tests/secure/OwnBookingTest.java` (a test you finish, and five attack requests) | 7 |

`WorkshopController`, `AuthController`, the `Booking` entity, the `BookingView` record, the JWT key plumbing, `data.sql` and `application.properties` are complete and stay as shipped.

## Prerequisites

JDK 25 and Apache Maven 3.9 or later (`java -version`, `mvn -v`; both must report Java 25).

## Setup (once, needs the internet)

From the lab's `starter` folder:

```
mvn -q dependency:go-offline
```

## Tasks

Run the one test command from the `starter` folder after each task:

```
mvn -q -o test
```

Out of the box every task test fails: with Spring Security on the classpath and no configuration, Boot locks every endpoint behind a generated password - and the user store still keeps raw passwords.
One shipped check, `defaultProfileSendsNoCorsHeaders`, passes from the start and must keep passing: it guards the default profile while you work on Task 6.

### Task 1: hash stored passwords

In `SecurityConfig`, add the `PasswordEncoder` bean from the TODO (`PasswordEncoderFactories.createDelegatingPasswordEncoder()` - bcrypt by default, and the stored `{bcrypt}` prefix records the algorithm for future upgrades).
In `UserAccountService`, inject it through the constructor, store `encoder.encode(rawPassword)` and compare with `encoder.matches(rawPassword, stored)`.
Done when `task1StoresOnlyHashedPasswords` no longer fails.

### Task 2: the security filter chain

Add the `SecurityFilterChain` bean from the TODO in `SecurityConfig`: `GET /workshops` and `/auth/**` public, `/admin/**` only for role `ADMIN`, everything else authenticated, and the oauth2 resource server checking JWTs with the shipped converter.
Remember the status pair: no credentials is 401, wrong role is 403.
Done when `task2ProtectsEndpointsByPathAndRole` no longer fails.

### Task 3: issue a signed JWT

Implement `TokenService.issue` exactly as its TODO shows: subject, issued-at, a 15-minute expiry and a `roles` claim, signed HS256 with the shared key.
`POST /auth/token` already calls it after a successful password check.
Done when `task3IssuesASignedTokenWithClaimsAndExpiry` no longer fails.

### Task 4: the resource server checks every request

No new code if Task 2 wired `.oauth2ResourceServer(...)`: the decoder verifies signature and expiry, the converter turns the `roles` claim into `ROLE_*` authorities.
The test sends a real token (200) and a tampered one (401).
Done when `task4AcceptsItsOwnTokensAndRejectsTampering` no longer fails.

### Task 5: a dev profile that keeps endpoints open

Fill in the shipped `DevSecurityConfig.java`, whose imports are ready: make it a `@Configuration` class annotated `@Profile("dev")` with one `SecurityFilterChain` bean that permits all requests (`auth -> auth.anyRequest().permitAll()`, csrf disabled).
Then annotate the main `filterChain` method in `SecurityConfig` with `@Profile("!dev")`, so exactly one chain exists per profile.
The dev test proves the open profile; `SecurityLabTest` keeps proving, on the same run, that the default profile stays locked down.
Done when `task5DevProfileKeepsEndpointsOpen` no longer fails.

### Task 6: let the local front end call the API, in dev only

The front-end team runs its Vite dev server at `http://localhost:5173` and calls the API at `http://localhost:8080`: a different origin, so the browser first sends a CORS preflight and blocks the call unless the API allows that origin.
In `DevSecurityConfig`:

1. Add a CORS configuration bean that allows exactly the origin `http://localhost:5173`, the methods `GET`, `POST`, `PUT` and `DELETE` and any request header, for every path. The dev-profile page explains why only this origin; the bean types and setters are in the hint below.
2. Turn CORS on in the dev chain, using that bean.

Allow exactly that one origin, never `*`.
Keep the bean inside the `@Profile("dev")` class. Spring Security also turns CORS on by itself for any chain when a `UrlBasedCorsConfigurationSource` bean exists, so the same bean outside the dev profile could put CORS headers on the default profile too; the shipped `defaultProfileSendsNoCorsHeaders` check fails if any CORS configuration bean exists outside the dev profile.

<details><summary>Hint</summary>

Step 1 is a `CorsConfigurationSource` bean named `corsConfigurationSource`: a `CorsConfiguration` with `setAllowedOrigins`, `setAllowedMethods` and `setAllowedHeaders`, registered for `"/**"` on a `UrlBasedCorsConfigurationSource` (all from `org.springframework.web.cors`).
Step 2 is `.cors(Customizer.withDefaults())` on the dev chain (`org.springframework.security.config.Customizer`).

</details>

Done when `task6DevProfileAllowsOnlyTheLocalFrontEndOrigin` no longer fails.

### Task 7: review - a customer reads only their own booking

`GET /bookings/{id}` was added in a hurry, and `BookingController` shows it: it reads the repository directly, returns the `Booking` entity with its internal owner and payment reference, ignores who is calling, and lets a missing id escape as a 500.
Any logged-in customer who changes the number in the URL reads someone else's booking: broken object level authorization, OWASP API1.
Fix it with practices you already know; each TODO names the page that taught it:

1. `BookingRepository`: add a derived query that finds a booking by its id and its owner, so the database returns a booking only to its owner.
2. `BookingService.mine`: use that query, map the result to the `BookingView` response DTO, and throw `NoSuchElementException` when nothing matches.
3. `BookingController`: depend on `BookingService` instead of the repository, return the caller's `BookingView` (the caller's username is `caller.getName()`), and reject a non-positive id with a Bean Validation constraint.
4. `ApiErrors`: map `NoSuchElementException` to a 404 problem with the title `Booking not found` and a fixed detail of your own wording.
   Another customer's booking now looks exactly like a missing one, and the body reveals nothing internal.
5. `tests/secure/OwnBookingTest.java`: replace `null` with the attacker's request, Grace asking for Ada's booking 2 with her own valid token, expecting 404, ending in `.andReturn()`.
   This is the test that proves the ownership check; a role check could not, because both customers have the same role.
   The shipped checks in the file confirm that your request is exactly that one.
6. `tests/secure/OwnBookingTest.java`: show the attack each earlier practice answers.
   The file lists five practices from the OWASP reading: password hashing, role checks, validation, the response DTO and safe error bodies.
   For each one, replace `null` with the request an attacker would send that this practice is there to answer, written as `attack(caller, "METHOD /path")`, or as `login(username, password)` for a login. The file describes the callers, the accounts and the helpers.
   Each request then runs against your finished API, and the practice must be what refuses it or answers it safely.
   Validation and safe error bodies are defence in depth: the owner query would also turn a bad id away, and Spring Boot's own error page already leaves out the exception. Their rows check that your constraint and your `ApiErrors` handler are what answer the request.

The shipped `task7ServesOnlyTheCallersOwnBooking` test also checks the layers: the controller must not depend on the repository, the repository must declare the id-and-owner query, and the id must carry a constraint.
The shipped `task7ShowsTheAttackEachPracticeStops` test sends each step 6 request for real and checks that its practice is what answers it; one run lists every row that is still missing or wrong.

<details><summary>Hint for step 6</summary>

For each practice, ask which attacker request it is there to answer: what would the attacker try, and where does this practice meet it?
The reading's two questions keep two attacks apart: "this record, for this user?" is step 5's owner check, and "this action, for this role?" is what role checks answer.

</details>

<details><summary>Hints for steps 1 and 3</summary>

Step 1: `Optional<Booking> findByIdAndOwner(Long id, String owner)`.
Step 3: the handler returns `BookingView` from `service.mine(id, caller.getName())`, with `@Positive` (`jakarta.validation.constraints`) on the id.

</details>

Done when `task7ServesOnlyTheCallersOwnBooking`, `task7ProvesTheOwnershipCheck` and `task7ShowsTheAttackEachPracticeStops` no longer fail.

<details><summary>Read after the tests pass: the risk behind each step 6 row</summary>

Password hashing: API2 Broken Authentication; a copied user table must not be a list of working passwords.
Role checks: API5 Broken Function Level Authorization; a normal user must not run an admin action.
Validation: bad input, which the reading pairs with validation; it is not a separate category in the 2023 list, and here it is defence in depth behind the owner query.
The response DTO: API3 Broken Object Property Level Authorization in the full list; a response must not carry internal fields.
Safe error bodies: in the full list, error messages that expose internals fall under API8 Security Misconfiguration; Spring Boot's own error page already hides them, so the row checks that your handler does too.
Step 5's owner check is API1 Broken Object Level Authorization, the reading's main example.

</details>


## Test

```
mvn -q -o test
```

from the `starter` folder.
When you finish, the command prints nothing and exits with status 0.

To try it live: `mvn -q -o spring-boot:run` from `starter/`, then

```
curl -s -X POST localhost:8080/auth/token -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin-dev-password"}'
curl -s localhost:8080/admin/stats -H "Authorization: Bearer <token from above>"
```

## Expected output

`expected/test-summary.txt` shows the surefire summary of a completed run.

## Offline note

Only the setup step uses the network. Tokens are issued and checked inside the JVM with the shared HMAC key; no identity provider runs.

## Cleanup

The lab writes only `starter/target`:

- macOS and Linux: `rm -rf target`
- Windows PowerShell: `Remove-Item -Recurse -Force target`

## Troubleshooting

- **Everything answers 401 even after Task 2**: the chain bean is probably not a `@Bean`, or the request hit `/admin/**` without a token - that 401 is correct.
- **`task4` gets 403 with a valid token**: `.oauth2ResourceServer(...)` is missing from the chain, so the token is never read and the caller counts as anonymous.
- **Two `SecurityFilterChain` beans clash in dev**: Task 5's second half is missing - annotate the main chain method with `@Profile("!dev")`.
- **`task6` gets `Access-Control-Allow-Origin` `null`**: the dev chain does not turn CORS on, or it cannot find your CORS bean (Task 6 hint); **`defaultProfileSendsNoCorsHeaders` fails**: a CORS configuration bean exists outside the `@Profile("dev")` class; move it into `DevSecurityConfig`.
- **`task7` sees `Status expected:<404> but was:<200>`** for booking 2: the lookup still ignores the caller (Task 7 steps 1 to 3).
- **`task7` says the controller must use BookingService** or **needs a derived query** or **check the id with a constraint**: a layer of the review is missing (Task 7 steps 1 and 3); a hand-written check in the controller does not count.
- **`task7ProvesTheOwnershipCheck` says step 5 must ask for Ada's booking 2**: your request is another one that also answers 404; send exactly Grace's GET of booking 2 with her token.
- **`task7ShowsTheAttackEachPracticeStops` lists a step 6 row**: the line after the row's name says what its practice did with your request; when an earlier task is unfinished, the message names that task first.
- **`Request processing failed: java.util.NoSuchElementException`**: the `ApiErrors` handler of Task 7 step 4 is missing.
- **`Expected no value at JSON path "$.paymentReference"`**: the controller still returns the entity instead of `BookingView`.
- **`The verification key's size is not large enough`**: the `jwt.secret` value must stay at least 32 bytes for HS256.
- **`mvn -v` shows a Java version other than 25**: set `JAVA_HOME` to your JDK 25 folder and open a new terminal.
