# Issuing and checking a JWT

## Objectives

- Issue a signed JWT after a successful login with a JwtEncoder, setting subject, issued-at, expiry and a roles claim
- Configure the OAuth 2.0 resource server to validate the JWT signature and expiry on each request with a key read from the environment
- Predict the response for a missing, expired or tampered token

## Teaching

A client sends a request with a JWT whose payload was edited after signing, changing `"roles":["USER"]` to `"roles":["ADMIN"]`. The signature was left the same.

After checking a login, sign a token with `JwtEncoder`. Set the subject, times and any claims you need:

```
var at = Instant.now();
var claims = JwtClaimsSet.builder()
    .subject(account.username())
    .issuedAt(at)
    .expiresAt(at.plus(5, ChronoUnit.MINUTES))
    .claim("tier", account.tier())
    .build();
return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
```

A JWT is signed, not encrypted: anyone can read it. Never put secrets in claims. Keep lifetimes short.

Add `spring-boot-starter-security-oauth2-resource-server`, then enable JWT handling in the filter chain with `oauth2ResourceServer(o -> o.jwt(withDefaults()))`.

A `JwtDecoder` validates the signature and the expiry on each request. For a shared-secret setup, read the key from the environment:

```
@Bean
JwtDecoder jwtDecoder(@Value("${app.jwt.key}") String key) {
  var secret = new SecretKeySpec(key.getBytes(UTF_8), "HmacSHA256");
  return NimbusJwtDecoder.withSecretKey(secret).build();
}
```

A missing, expired or tampered token leads to 401, with a `WWW-Authenticate: Bearer` header.

A teammate adds the user's date of birth and national id to the JWT claims, so that services do not need to look them up.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `JwtEncoder` signs claims such as subject, issued-at, expiry and roles.
- A resource server validates signature and expiry on each request, using a key from the environment.
- Missing, expired or tampered tokens give 401; claims are readable, so keep them minimal.

## Cheat sheet

Where to act: Add one builder call per requirement.

Next step: The teaching panel shows the builder methods. Which two relate to time?

Printed alternative: Add subject, issuedAt, expiresAt and a roles claim to the claims builder. Starter file: `TokenService.java`.

Where to act: Decide whether authentication succeeds first.

Next step: Signature and expiry are checked before any role rule applies.

- Starter: `spring-boot-starter-security-oauth2-resource-server`.
- `oauth2ResourceServer(o -> o.jwt(withDefaults()))`
- HS256 keys must be at least 256 bits.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/web/spring-security.html
- https://docs.spring.io/spring-security/reference/servlet/architecture.html
- https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html
- https://www.rfc-editor.org/rfc/rfc7519.html
- https://www.rfc-editor.org/rfc/rfc6750.html
- https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. The signature covers the header and payload, so any edit makes verification fail.
- **B. Not this one:** Readable does not mean trusted. The signature proves integrity.
- **C. Not this one:** The token is invalid before roles matter. Authentication failure gives 401.
- **D. Not this one:** An invalid token is a normal, handled authentication failure.

### terminal

**Printed alternative:** Add subject, issuedAt, expiresAt and a roles claim to the claims builder. Starter file: `TokenService.java`.

### drag

**Answer and reason for each row**

- **No `Authorization` header on a protected endpoint: 401.** The caller is not authenticated.
- **A token that expired 5 minutes ago: 401.** Expiry validation fails.
- **A token whose payload was edited: 401.** The signature no longer verifies.
- **A valid token, for an endpoint this caller has the role for: 200.** Authentication and authorization both pass.
- **A valid token without the role that endpoint requires: 403.** The caller is authenticated, but not allowed.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Signing proves integrity, not secrecy. Keep claims minimal.
- **B. Not this one:** They can hold strings. The issue is exposure.
- **C. Not this one:** A correctly issued token is still valid.
- **D. Not this one:** A standard signed JWT is not encrypted.
