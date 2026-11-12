# Integration and Observability lab: trust, but verify

## Goal

The booking platform calls a partner service and ops wants proof of life.
Four linked tasks: finish a real integration test, implement the outbound `RestClient` call, survive a partner outage with a warning in the log, and contribute a custom health component to `/actuator/health`.
The partner service never runs: `MockRestServiceServer` intercepts the client inside the test JVM.

## What you edit

| File | Tasks |
| --- | --- |
| `tests/ops/OpsIntegrationTest.java` (a test you finish) | 1 |
| `starter/src/main/java/ops/PartnerClient.java` | 2, 3 |
| `starter/src/main/java/ops/PartnerHealthIndicator.java` | 4 |
| `starter/src/main/resources/application.properties` | 4 (one line) |

Everything else is complete and stays as shipped.

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

### Task 1: finish the integration test

Open `tests/ops/OpsIntegrationTest.java` and follow its TODO: annotate the class with `@SpringBootTest` and `@AutoConfigureMockMvc`, so the full application context starts and the test exercises `GET /ping` end to end.
(A `@WebMvcTest` would load only the web slice, a `@DataJpaTest` only persistence - an integration test wants the real wiring.)
Done when `task1BootsTheFullContextAndPingsIt` no longer fails.

### Task 2: call the partner with RestClient

`PartnerClient` is already built from the auto-configured `RestClient.Builder`, with the base URL from `partner.base-url` and timeouts from `spring.http.clients.*` (see `application.properties`).
Implement `fetchStatus()` exactly as its TODO shows: `client.get().uri("/status").retrieve().body(PartnerStatus.class).status()`.
Done when `task2CallsThePartnerStatusEndpoint` no longer fails.

### Task 3: a partner outage is their incident, not ours

When the partner answers 500 (or times out), our API must keep answering.
Wrap the call in `try/catch (RestClientException)`, log `log.warn("partner status check failed: {}", exception.getMessage())` and return `"UNKNOWN"`.
The test provokes a 500 and reads the captured log output.
Done when `task3TurnsAPartnerFailureIntoUnknownAndALogLine` no longer fails.

### Task 4: a partner component on the health endpoint

Follow the TODO in `PartnerHealthIndicator.java`: annotate the class `@Component`, implement `HealthIndicator` (`org.springframework.boot.health.contributor`), and return `Health.up().withDetail("baseUrl", properties.baseUrl()).build()`.
Actuator names the component `partner` (the class name minus `HealthIndicator`).
Then uncomment `management.endpoint.health.show-details=always` in `application.properties` so components and details appear in the response.
Done when `task4ContributesPartnerHealthWithDetails` no longer fails.

## Test

```
mvn -q -o test
```

from the `starter` folder.
When you finish, the command prints nothing and exits with status 0.
No network, no database, no running partner: `MockRestServiceServer` answers inside the JVM.

## Expected output

`expected/test-summary.txt` shows the surefire summary of a completed run.

## Offline note

Only the setup step uses the network. The `partner.example` URL is never contacted; the tests intercept it.

## Cleanup

The lab writes only `starter/target`:

- macOS and Linux: `rm -rf target`
- Windows PowerShell: `Remove-Item -Recurse -Force target`

## Troubleshooting

- **`task3` reports an exception instead of UNKNOWN**: the catch block is missing or catches the wrong type; `RestClientException` is the common supertype for client failures.
- **`$.components.partner` not found**: either the indicator class is not a `@Component` implementing `HealthIndicator`, or `management.endpoint.health.show-details=always` is still commented out.
- **`mvn -v` shows a Java version other than 25**: set `JAVA_HOME` to your JDK 25 folder and open a new terminal.
