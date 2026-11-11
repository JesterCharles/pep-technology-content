# API Security lab: lock down the workshop API

## Goal

This is the required lab of the Standard track's security day.
Five linked tasks: hash stored passwords, restrict endpoints by path and role, issue a signed JWT, let the resource server check it on every request, and keep a dev profile open for the front-end team without ever weakening the default profile.
All credentials in this lab are disposable development values; the JWT key comes from a property with an environment-variable override, exactly as the secrets topic teaches.

## What you edit

| File | Tasks |
| --- | --- |
| `starter/src/main/java/secure/SecurityConfig.java` | 1, 2, 5 |
| `starter/src/main/java/secure/UserAccountService.java` | 1 |
| `starter/src/main/java/secure/TokenService.java` | 3 |
| `starter/src/main/java/secure/DevSecurityConfig.java` (you create it) | 5 |

The controllers, the JWT key plumbing and `application.properties` are complete and stay as shipped.

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

Out of the box every test fails: with Spring Security on the classpath and no configuration, Boot locks every endpoint behind a generated password - and the user store still keeps raw passwords.

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

Create `DevSecurityConfig.java`: a `@Configuration` class annotated `@Profile("dev")` with one `SecurityFilterChain` bean that permits all requests (`auth -> auth.anyRequest().permitAll()`, csrf disabled).
Then annotate the main `filterChain` method in `SecurityConfig` with `@Profile("!dev")`, so exactly one chain exists per profile.
The dev test proves the open profile; `SecurityLabTest` keeps proving, on the same run, that the default profile stays locked down.
Done when `task5DevProfileKeepsEndpointsOpen` no longer fails.

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
- **`task4` gets 401 with a valid token**: `.oauth2ResourceServer(...)` is missing from the chain, or the converter was not passed to `.jwt(...)`.
- **Two `SecurityFilterChain` beans clash in dev**: Task 5's second half is missing - annotate the main chain method with `@Profile("!dev")`.
- **`The verification key's size is not large enough`**: the `jwt.secret` value must stay at least 32 bytes for HS256.
- **`mvn -v` shows a Java version other than 25**: set `JAVA_HOME` to your JDK 25 folder and open a new terminal.
