# A dev profile that keeps endpoints open during front-end work

## Objectives

- Define a dev-profile SecurityFilterChain that permits all requests and allows the local front-end origin with CORS, active only when the dev profile is on
- Prove that the default profile still enforces authentication by running the security tests without the dev profile
- Explain the risk of shipping an open profile and how profile activation and startup checks prevent it

## Teaching

Two beans exist: `@Profile("dev") SecurityFilterChain open(...)`, which permits everything, and `@Profile("!dev") SecurityFilterChain real(...)`, which protects endpoints. The app starts with no active profile.

A front-end developer needs the API open locally. Define a chain that exists only under the `dev` profile, and make the protected chain exist otherwise.

```
@Bean
@Profile("seeded")
DataSeeder seeder() {
  return new DataSeeder();  // exists only under this profile
}
```

For the chain, use the same annotation, with an `anyRequest` rule that permits everything.

The browser also applies CORS: `http://localhost:5173` calling `http://localhost:8080` is a different origin, so allow exactly that origin, under the `dev` profile only.

An open profile is a risk if it reaches production. The defense has three parts:

- **Test without `dev`:** your security tests run with the default profile, and a protected endpoint must answer 401.
- Activate deliberately: set `SPRING_PROFILES_ACTIVE=dev` only on developer machines.
- Check at startup: a bean can refuse to start if `dev` is active in a production environment.

```
@SpringBootTest @AutoConfigureMockMvc
class DefaultProfileIsProtectedTest {
  @Test void anonymousIsRejected() throws Exception {
    mvc.perform(get("/reports")).andExpect(status().isUnauthorized());
  }
}
```

A teammate adds `spring.profiles.active=dev` to `application.properties` "so that nobody forgets it".

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `@Profile("dev")` makes the open chain exist only under that profile.
- Allow the exact local origin for CORS, not a wildcard.
- Prove the default with a test, and add a startup check for mistakes.

## Cheat sheet

Where to act: Start at the annotation above the bean method.

Next step: Which annotation makes a bean exist only under one profile?

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Then look at the CORS bean.

Next step: Name the exact local front-end origin rather than a wildcard.

Printed alternative: Add @Profile("dev") to the chain, permit all requests, and set the allowed origin to the local front end. Starter file: `DevSecurityConfig.java`.

Where to act: Start with where the profile is active.

Next step: Which environment must never be open? What catches a mistake if someone sets it anyway?

Printed alternative: dev on developer machines only, with the startup check: safe. dev in production with no check: an open API. dev in production with the check: startup refuses.

- Local: `SPRING_PROFILES_ACTIVE=dev`.
- `@Profile("!dev")` on the real chain.
- Never set `dev` in packaged defaults.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/features/profiles.html
- https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html
- https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. The default stays protected, and opening up requires asking for it.
- **B. Not this one:** Profile conditions decide which beans exist, not order.
- **C. Not this one:** The `dev` bean does not exist without the profile.
- **D. Not this one:** `!dev` is true here, so `real` exists.

### terminal

**Printed alternative:** Add @Profile("dev") to the chain, permit all requests, and set the allowed origin to the local front end. Starter file: `DevSecurityConfig.java`.

### explore

**Printed alternative:** dev on developer machines only, with the startup check: safe. dev in production with no check: an open API. dev in production with the check: startup refuses.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Activation belongs on developer machines, not in the packaged defaults.
- **B. Not this one:** Only if every deployment remembers to do that. Depending on memory is the risk.
- **C. Not this one:** It will. That is the problem.
- **D. Not this one:** Speed is not the concern here.
