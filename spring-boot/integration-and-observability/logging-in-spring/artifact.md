# Reading: logging in Spring

## Objectives

- Log with an SLF4J logger at the right level and set levels per package with logging.level properties
- Read Spring Boot's default console log line to find the time, level, thread, logger and message
- Keep secrets and personal data out of log messages

## Teaching

A class has `log.debug("Loaded {} rows", rows.size());` and the app runs with default logging settings.

Use the SLF4J API. A `{}` placeholder is filled in only if the line is actually logged.

```
private static final Logger log = LoggerFactory.getLogger(BookingService.class);

log.info("Booking {} created", id);
log.warn("Workshop {} nearly full", wid);
log.error("Payment failed for booking {}", id, ex);
```

ERROR something failed. WARN something odd, still working. INFO key business events. DEBUG developer detail. Set levels per package:

```
logging.level.com.acme=debug
logging.level.org.hibernate.SQL=debug
```

A default console line has fixed parts:

```
2026-11-04T09:14:03.218Z  INFO 4312 --- [shop] [nio-8080-exec-1] c.acme.BookingService : Booking 42 created
```

That is the time, level, process id, application name, thread, logger and message. The thread name helps you follow one request among concurrent ones.

Keep secrets and personal data out of messages: never log passwords, tokens or full card numbers. Log an id rather than the person's details.

Production shows no debug output from your package. You need more detail about one package briefly, without changing code.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Use SLF4J with `{}` placeholders, at the level that matches the meaning.
- Set levels per package with `logging.level.*`.
- Read the time, level, thread and logger on each line, and keep secrets out.

## Cheat sheet

Where to act: Read the definitions in the teaching panel.

Next step: Ask whether something failed, is odd but working, is a key event, or is just detail.

Where to act: Read only the message at the end of each line.

Next step: Ask whether the value could harm someone if the log were shared.

- The default root level is INFO.
- To log an exception, pass it as the last argument.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/features/logging.html
- https://docs.spring.io/spring-boot/appendix/application-properties/index.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. Levels below the threshold are dropped.
- **B. Not this one:** Levels exist so that you can filter.
- **C. Not this one:** Logging is not rate-limited this way by default.
- **D. Not this one:** A filtered line is simply ignored.

### drag

**Answer and reason for each row**

- **Booking 42 was created: INFO.** A key business event.
- **Payment call failed, and the booking was not saved: ERROR.** An operation failed.
- **Partner replied slowly but successfully: WARN.** Odd, but the work still succeeded.
- **Mapping 18 entities to DTOs: DEBUG.** Detail useful only while investigating.

### mcq

**What each line shows**

- **Line 1 (leave):** A plain id and event is fine.
- **Line 2 (mark):** A password must never be logged, at any level.
- **Line 3 (leave):** No secret or personal data.
- **Line 4 (mark):** A bearer token works as a credential, so logging it gives away access.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. A property sets the level for one package, and an environment variable or argument can supply it.
- **B. Not this one:** That makes normal detail look like failures.
- **C. Not this one:** That floods the logs and may expose data.
- **D. Not this one:** That bypasses levels and structure, and it needs a rebuild.
