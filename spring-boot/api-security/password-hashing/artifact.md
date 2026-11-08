# Password hashing

## Objectives

- Hash a password for storage with Spring Security's delegating PasswordEncoder (bcrypt by default) and check a login with matches
- Explain why passwords are hashed with a slow, salted algorithm rather than encrypted or hashed with a fast digest
- Read the {id} prefix in a stored delegating hash and explain how it allows upgrading the algorithm later

## Teaching

A database leak exposes a `users` table. Compare two columns: `sha256(password)` and a bcrypt hash with a per-user salt.

Never store passwords, and never encrypt them: encryption is reversible. Store a slow, salted hash.

Spring Security provides a delegating encoder. Its default algorithm is bcrypt.

```
@Bean
PasswordEncoder passwordEncoder() {
  return PasswordEncoderFactories.createDelegatingPasswordEncoder();
}

String hash = encoder.encode(raw);
boolean ok = encoder.matches(raw, hash);
```

Compare with `matches`, because each `encode` gives a different output, with a new salt.

A delegating hash starts with its algorithm id:

```
{bcrypt}$2a$10$...
{argon2@SpringSecurity_v5_8}$argon2id$...
```

When checking, the encoder reads the prefix and delegates to the right algorithm, so old hashes keep working after you change the default. New passwords use the new default. Hashes can be upgraded when a user next logs in.

Also: a salt is not a secret, and it is stored in the hash. Cost settings make hashing slower as hardware improves.

A teammate proposes encrypting passwords with AES and keeping the key in configuration, so support can read them back if needed.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Passwords are hashed with a slow, salted algorithm, never encrypted.
- Use the delegating `PasswordEncoder`: `encode` to store, `matches` to check.
- The `{id}` prefix selects the algorithm, which allows later upgrades.

## Cheat sheet

Where to act: Start with the `___` in `register`.

Next step: What should you store instead of the raw value?

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Then fix the login line.

Next step: Two encodes of one password differ. Which method handles that?

Printed alternative: Store the encoded password at registration, and check logins with encoder.matches instead of equals. Starter file: `UserService.java`.

Where to act: Change the default first, and keep an old hash.

Next step: The prefix on the stored value decides which algorithm checks it.

Printed alternative: Stored {bcrypt} with any default: bcrypt checks it. Stored {argon2...} : argon2 checks it. No prefix: there is no matching delegate, so matching throws by default.

- `PasswordEncoderFactories.createDelegatingPasswordEncoder()`
- Default algorithm: bcrypt.
- Two encodes of one password differ.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/password-encoder.html
- https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html
- https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. Slow means fewer guesses per second, and a salt defeats precomputed tables.
- **B. Not this one:** It is strong for other uses, but it is so fast that attackers can try billions of guesses a second.
- **C. Not this one:** Speed and salting make a huge difference.
- **D. Not this one:** Output length does not slow down the guessing.

### terminal

**Printed alternative:** Store the encoded password at registration, and check logins with encoder.matches instead of equals. Starter file: `UserService.java`.

### explore

**Printed alternative:** Stored {bcrypt} with any default: bcrypt checks it. Stored {argon2...} : argon2 checks it. No prefix: there is no matching delegate, so matching throws by default.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Encryption is reversible, so a leaked key would expose every password.
- **B. Not this one:** A cipher and a password hash do different jobs. Reversibility is the issue.
- **C. Not this one:** Fast is exactly what you do not want for password storage.
- **D. Not this one:** Access controls fail. Leaks would expose every password.
