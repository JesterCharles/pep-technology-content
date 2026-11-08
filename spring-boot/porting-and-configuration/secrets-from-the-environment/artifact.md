# Secrets from the environment

## Objectives

- Supply a secret such as a database password or signing key through an environment variable mapped by relaxed binding instead of committing it in application.properties
- Fail fast at startup when a required secret is missing, using a required configuration property with no default
- Keep secrets out of logs, error messages and Git history, and explain why a committed secret must be rotated, not only deleted

## Teaching

A developer commits `spring.datasource.password=winter2026` to `application.properties` on a public branch, then deletes it in the next commit.

Keep the key in configuration but not the value. Boot maps environment variables to properties by relaxed binding: uppercase the key, replace dots with underscores and remove dashes.

| Property | Environment variable |
| --- | --- |
| `spring.mail.password` | `SPRING_MAIL_PASSWORD` |
| `app.jwt.secret-key` | `APP_JWT_SECRETKEY` |

To fail fast, also reference that variable in a placeholder with no default. The environment still supplies the value, and if it is missing, startup stops.

```
spring.mail.password=${SPRING_MAIL_PASSWORD}
```

Set the variable for one process when you start it. In a Unix shell:

```
APP_JWT_SECRETKEY=dev-only java -jar app.jar
```

Locally, keep real values in an untracked file and list it in `.gitignore`. In production, a platform secret store injects the variable.

A value that was ever committed stays in Git history and every clone, so it must be rotated: replaced at its source, not only deleted from the file. Secrets must also stay out of logs and error bodies. Never log the raw value, and never return it in an error response.

An endpoint logs each request with `log.info("login {} {}", username, password);` to help debug a login problem.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Configuration holds keys; the environment holds secret values.
- A placeholder with no default stops startup if the secret is missing.
- A committed secret must be rotated, not just deleted, and secrets never belong in logs.

## Cheat sheet

Where to act: Work on the line that holds the password.

Next step: A placeholder keeps the key, but the value must come from outside the file.

Printed alternative: Replace the literal password with a placeholder, with no default, for the environment variable that relaxed binding maps to spring.datasource.password. Starter file: `application.properties`.

Where to act: Use the command box under the log.

Next step: The teaching panel shows the form that sets a variable for one process.

Printed alternative: java -jar app.jar fails: could not resolve the placeholder. SPRING_DATASOURCE_PASSWORD=dev-only java -jar app.jar starts normally.

- `spring.datasource.password` maps to `SPRING_DATASOURCE_PASSWORD`.
- Required: `${SPRING_DATASOURCE_PASSWORD}`. Optional with default: `${SPRING_DATASOURCE_PASSWORD:fallback}`.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/features/external-config.html
- https://docs.spring.io/spring-boot/reference/features/logging.html
- https://docs.spring.io/spring-boot/appendix/application-properties/index.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. Deleting a line does not delete history, and anyone may have copied it. Treat it as compromised.
- **B. Not this one:** History still holds the old commit, and clones keep it too.
- **C. Not this one:** Going private does not un-expose a secret already seen.
- **D. Not this one:** Assume exposure. You usually cannot prove no one copied it.

### terminal

**Printed alternative:** Replace the literal password with a placeholder, with no default, for the environment variable that relaxed binding maps to spring.datasource.password. Starter file: `application.properties`.

### terminal

**Printed alternative:** java -jar app.jar fails: could not resolve the placeholder. SPRING_DATASOURCE_PASSWORD=dev-only java -jar app.jar starts normally.

### drag

**Your reason**

- **Why rotate: history and clones keep the value.** A later commit hides the line but not the earlier commit, and anyone who cloned or forked the branch has it. Only replacing the secret at its source makes the leaked value useless.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Logs are copied, shipped and retained, so a logged secret spreads far.
- **B. Not this one:** DEBUG can still be enabled in production. The secret must not be logged at any level.
- **C. Not this one:** Many people and systems can read logs, and they live a long time.
- **D. Not this one:** Base64 is reversible encoding, not protection.
