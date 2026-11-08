# Role-protected endpoints

## Objectives

- Restrict endpoints by path, method and role with authorizeHttpRequests in a SecurityFilterChain bean
- Predict 401 versus 403 for an unauthenticated request and an authenticated request without the required role
- Test protected endpoints with MockMvc and Spring Security's test support for an anonymous user and users with different roles

## Teaching

A rule says `POST /workshops/**` requires role ADMIN, and everything else needs authentication. Two calls are made: one with no token, and one with a valid USER token.

A `SecurityFilterChain` bean states the rules, in order. The first match wins, so put specific rules first, and `anyRequest` last.

```
@Bean
SecurityFilterChain api(HttpSecurity http) throws Exception {
  http.csrf(c -> c.disable())
      .oauth2ResourceServer(o -> o.jwt(withDefaults()))
      .authorizeHttpRequests(a -> a
      .requestMatchers(HttpMethod.GET, "/reports/**").permitAll()
      .requestMatchers(HttpMethod.POST, "/reports/**").hasRole("MANAGER")
      .anyRequest().authenticated());
  return http.build();
}
```

`hasRole("ADMIN")` checks for the authority `ROLE_ADMIN`. With JWTs, map your `roles` claim to those authorities with a `JwtAuthenticationConverter`, because the default maps `scope` to `SCOPE_*`. This chain is for a stateless token API: the resource server answers 401 for a missing token, and CSRF is off because no cookie carries the login.

Spring Security test support runs a request as a chosen user with `MockMvc`. Add `spring-boot-starter-security-test`.

```
mvc.perform(post("/reports"))
   .andExpect(status().isUnauthorized());

mvc.perform(post("/reports").with(user("g").roles("GUEST")))
   .andExpect(status().isForbidden());

mvc.perform(post("/reports").with(user("m").roles("MANAGER")))
   .andExpect(status().isCreated());
```

Test each case. A security rule with no test can silently regress.

A rule list has `.anyRequest().authenticated()` first, followed by `.requestMatchers("/public/**").permitAll()`.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `authorizeHttpRequests` rules match in order, ending with `anyRequest`.
- 401 means not authenticated; 403 means authenticated but not allowed.
- Test anonymous, wrong-role and right-role cases.

## Cheat sheet

Where to act: Add one chained rule per requirement, in the order given.

Next step: The first match wins, so which rule must be last?

Printed alternative: Add three rules in order: permitAll for GET, hasRole ADMIN for DELETE, and authenticated for everything else. Starter file: `SecurityConfig.java`.

Where to act: Replace each `___`.

Next step: The teaching panel shows the exact shape for an anonymous request and a user request.

Printed alternative: Complete both tests: 401 for anonymous, and 403 for a request made as a USER role. Starter file: `SecurityTest.java`.

- `hasRole("ADMIN")` checks `ROLE_ADMIN`.
- Default JWT authorities map `scope` to `SCOPE_*`; use `JwtAuthenticationConverter` for roles.
- `.with(user("x").roles("USER"))`

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-security/reference/servlet/architecture.html
- https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html
- https://docs.spring.io/spring-security/reference/servlet/authorization/method-security.html
- https://docs.spring.io/spring-security/reference/servlet/test/mockmvc/index.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. 401 means not authenticated, and 403 means authenticated but not allowed.
- **B. Not this one:** A caller with no token has not been authenticated at all, so it gets 401.
- **C. Not this one:** The USER caller is authenticated. The missing permission is a 403.
- **D. Not this one:** That is not the default behavior.

### terminal

**Printed alternative:** Add three rules in order: permitAll for GET, hasRole ADMIN for DELETE, and authenticated for everything else. Starter file: `SecurityConfig.java`.

### terminal

**Printed alternative:** Complete both tests: 401 for anonymous, and 403 for a request made as a USER role. Starter file: `SecurityTest.java`.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Later rules could never match, so it fails fast.
- **B. Not this one:** The order is the order you write. It is not sorted for you.
- **C. Not this one:** This configuration does not start at all.
- **D. Not this one:** No rule says that.
