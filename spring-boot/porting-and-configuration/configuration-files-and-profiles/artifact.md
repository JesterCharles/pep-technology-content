# Configuration files and profiles

## Objectives

- Read settings from application.properties or application.yaml into a @ConfigurationProperties record and with @Value
- Activate a profile with spring.profiles.active and predict which profile-specific value wins for a given set of files
- Predict the effective value when the same property is set in a properties file, an environment variable and a command-line argument

## Teaching

`application.properties` has `app.greeting=hello`. `application-dev.properties` has `app.greeting=hi from dev`. You start the app with `spring.profiles.active=dev`.

Two ways to read settings: `@Value("${app.greeting}")` injects a single value, and `@ConfigurationProperties` binds a whole group into a typed object, which suits several related settings.

```
@ConfigurationProperties("app.mail")
record MailProperties(String host, int port) {}

@SpringBootApplication
@ConfigurationPropertiesScan
class App { }
```

With that record, `app.mail.host` and `app.mail.port` are bound with conversion to `int`. Keys can come from `.properties` or `.yaml`.

Boot merges many property sources. Later, more specific sources override earlier ones. For this course, remember this order, lowest to highest:

- `application.properties`
- The profile file, such as `application-dev.properties`
- OS environment variables
- Command-line arguments

So the jar can carry safe defaults, while each environment overrides what it needs. A profile file joins only when its profile is active: set `spring.profiles.active=dev` in `application.properties`, as `SPRING_PROFILES_ACTIVE` or as a command-line argument.

The jar has `app.limit=10`. Production sets `APP_LIMIT=50` in the environment and starts with `java -jar app.jar --app.limit=75`.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `@Value` reads one value; `@ConfigurationProperties` binds a typed group.
- An active profile file overrides the base file.
- Environment variables and command-line arguments override both.

## Cheat sheet

Where to act: Fill the annotation first.

Next step: The prefix is the part of the keys that both settings share.

Printed alternative: Complete the annotation prefix and record components so that app.feed.url and app.feed.limit bind, and bind app.greeting to the greeting parameter with @Value. Starter file: `Settings.java`.

Where to act: Toggle one source at a time and read the winner.

Next step: A higher-priority source hides everything below it.

Printed alternative: Command-line argument set: it wins. Otherwise the environment variable wins if set; otherwise the profile file; otherwise the base file.

- Activate a profile: `spring.profiles.active=dev`.
- Scan records: `@ConfigurationPropertiesScan`.
- Files: `application.properties` or `application.yaml`.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/features/external-config.html
- https://docs.spring.io/spring-boot/reference/features/profiles.html
- https://docs.spring.io/spring-boot/appendix/application-properties/index.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. A profile-specific file overrides the non-specific one when that profile is active.
- **B. Not this one:** The base file provides defaults, and an active profile overrides them.
- **C. Not this one:** Properties do not concatenate. One value wins.
- **D. Not this one:** Defining a key at several levels is normal and is how overriding works.

### terminal

**Printed alternative:** Complete the annotation prefix and record components so that app.feed.url and app.feed.limit bind, and bind app.greeting to the greeting parameter with @Value. Starter file: `Settings.java`.

### explore

**Printed alternative:** Command-line argument set: it wins. Otherwise the environment variable wins if set; otherwise the profile file; otherwise the base file.

### drag

**Activating the profile**

- **Line that activates dev: `spring.profiles.active=dev`.** `spring.config.activate.on-profile` only marks a document as belonging to a profile; it does not turn the profile on, and `spring.profile` is not a Boot property.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Command-line arguments outrank environment variables and files.
- **B. Not this one:** The environment variable outranks the file, but the command line outranks it.
- **C. Not this one:** The packaged value is only the default.
- **D. Not this one:** Overlapping sources are normal. One simply wins.
