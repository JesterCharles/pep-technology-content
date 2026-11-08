# Turning off the dev profile

## Objectives

- Explain what the back end's dev profile that keeps endpoints open does, and why it must never be active outside local development
- Start the back end without the dev profile by changing its active Spring profiles, and point the front end at it with a Vite environment variable
- Verify after the switch that an unauthenticated request is now refused (401 or 403, depending on the back end's security configuration) and that the front end handles the refusal

## Teaching

During front-end work, the back end ran with a dev profile that keeps endpoints open. Predict what happens if it travels too far, before any teaching.

The back end's dev profile keeps endpoints open so you can build the front end before login exists. It must never be active outside local development.

```
SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run   # open
mvn spring-boot:run                              # protected
```

Remove `dev` from wherever it was set: the environment, a run command, or `spring.profiles.active` in a config file. Then check the startup log for active profiles.

The front end should not hard-code the back end's address. Vite reads environment files such as `.env.local`, and exposes variables that start with `VITE_` on `import.meta.env`:

```
VITE_SEARCH_URL=http://localhost:9200
const searchUrl = import.meta.env.VITE_SEARCH_URL;
```

Only `VITE_` variables reach the browser. Everything with that prefix ends up in the public bundle, so never put secrets there. Restart the dev server after changing `.env` files.

Trust evidence, not intentions. After turning off the profile, verify in two places: an unauthenticated request is refused (401 or 403, depending on the back end's security configuration), and the front end handles that refusal, with the sign-in redirect or a not-allowed message, rather than a blank screen.

## Recap

The dev profile keeps endpoints open for local front-end work, so it must never be active outside local development, where anyone could call the API with no credentials. Start the back end without it by changing its active Spring profiles, and point the front end at it with a `VITE_` environment variable. Then verify that an unauthenticated request is refused (401 or 403, depending on configuration), and that the front end handles the refusal.

## Cheat sheet

Static version: a dev profile that permits all requests is active on a shared server. Decide what someone with no account can do, then compare with Activity 2.

Where to act: The command field.

Next step: Copy the first start command from the teaching text, then the curl from the task. Then stop, and do it again with the other start command.

Without JavaScript the terminal cannot run. On paper, write the commands to start with the dev profile, send a request, stop, start without the profile, and send it again. Say what you expect each request to return.

Where to act: The line under `.env.local`.

Next step: The variable needs the prefix that makes Vite expose it, then an equals sign, then the address.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The `base` line in `src/api.js`.

Next step: Replace the string with the object Vite provides, followed by your variable name.

Without JavaScript the editor cannot run. Starter: an env file with an unprefixed API_URL, and api.js with a hard-coded address. On paper, add the right variable and read it. Check against the teaching snippet.

Static version: after removing the dev profile, things still work in a signed-in browser. Compare testing with no credentials on both sides, doing nothing, searching the code, and insisting on exactly 401. Choose using the teaching text.

```
SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run   # open, local only
mvn spring-boot:run                              # protected

# .env.local: only the VITE_ prefix reaches the browser
VITE_SEARCH_URL=http://localhost:9200
const searchUrl = import.meta.env.VITE_SEARCH_URL;

curl -i http://localhost:8080/api/orders         # expect 401 or 403
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- docs.spring.io/spring-boot/reference/features/profiles.html: Adding Active Profiles; Profile-specific Configuration Files
- docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html: Authorizing an Endpoint
- vite.dev/guide/env-and-mode: Env Variables; Modes

## Static interaction alternatives

### predict

Static version: a dev profile that permits all requests is active on a shared server. Decide what someone with no account can do, then compare with Activity 2.

### explore

Without JavaScript the terminal cannot run. On paper, write the commands to start with the dev profile, send a request, stop, start without the profile, and send it again. Say what you expect each request to return.

### terminal

Without JavaScript the editor cannot run. Starter: an env file with an unprefixed API_URL, and api.js with a hard-coded address. On paper, add the right variable and read it. Check against the teaching snippet.

### mcq

Static version: after removing the dev profile, things still work in a signed-in browser. Compare testing with no credentials on both sides, doing nothing, searching the code, and insisting on exactly 401. Choose using the teaching text.
