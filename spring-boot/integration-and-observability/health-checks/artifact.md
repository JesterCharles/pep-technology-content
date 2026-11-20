# Health checks

## Objectives

- Add Spring Boot Actuator and read the aggregate status from /actuator/health, then enable component visibility with management.endpoint.health.show-components (component and detail visibility default to never; expose them only to trusted callers) and read the database health contributor's status
- Expose only the endpoints you need over HTTP and explain why other Actuator endpoints stay unexposed by default
- Explain how liveness and readiness health groups are used by a platform that restarts or routes traffic to the service

## Teaching

You add `spring-boot-starter-actuator` to a service with a database, and call `GET /actuator/health`.

To see which component is down, turn on component visibility:

```
management.endpoint.health.show-components=always
```

Now `/actuator/health` lists contributors such as `db` and `diskSpace`, each with a status. Aggregate status is `DOWN` if a contributor is down.

Set `show-details` only for trusted callers, using `when-authorized`, because details can reveal database products and sizes.

By default, only `health` is exposed over HTTP, because other endpoints can contain sensitive data. Add only what you use:

```
management.endpoints.web.exposure.include=health,info
```

Never expose everything with `*` on a public port. `env`, `heapdump` and `loggers` can reveal secrets or let callers change behavior.

For platforms, liveness answers "should this process be restarted?", and readiness answers "should it receive traffic?". Since Spring Boot 4.0 they are on by default, in any environment, at `/actuator/health/liveness` and `/actuator/health/readiness`. Set `management.endpoint.health.probes.enabled=false` to turn them off. In Spring Boot 3.x they were on automatically only on Kubernetes.

A teammate sets `management.endpoints.web.exposure.include=*` on a public port "so ops can see everything".

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `/actuator/health` shows the aggregate; turn on `show-components` to see contributors.
- Only health is exposed by default, so add others deliberately.
- Liveness decides restarts, and readiness decides traffic.

## Cheat sheet

Where to act: Use the command box under the log.

Next step: Run both starts from the task, then read the health endpoint once; its two labelled lines show what each start returns.

Printed alternative: Default: {"groups":["liveness","readiness"],"status":"UP"}. With show-components=always: {"components":{"db":{"status":"UP"},"diskSpace":{"status":"UP"},"livenessState":{"status":"UP"},"ping":{"status":"UP"},"readinessState":{"status":"UP"},"ssl":{"status":"UP"}},"groups":["liveness","readiness"],"status":"UP"}.

Where to act: Toggle where the database check is included.

Next step: Which probe causes a restart, and which only stops traffic?

Printed alternative: Database check in readiness only: traffic stops, with no restart. In liveness too: the platform restarts the process repeatedly. In neither: traffic keeps arriving and requests fail.

- Starter: `spring-boot-starter-actuator`.
- `management.endpoints.web.exposure.include=health,info`
- `management.endpoint.health.probes.enabled=false` turns the probes off; they are on by default in Spring Boot 4.

## Sources

Status: Sources checked on 8 November 2026; independent review pending.

- https://docs.spring.io/spring-boot/4.1/reference/actuator/endpoints.html
- https://docs.spring.io/spring-boot/4.1/reference/actuator/enabling.html
- https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. Component and detail visibility default to never.
- **B. Not this one:** That requires `show-components` or `show-details` to be set.
- **C. Not this one:** Only health is exposed over HTTP by default, and it shows a summary.
- **D. Not this one:** The health endpoint is exposed by default.

### terminal

**Printed alternative:** Default: {"groups":["liveness","readiness"],"status":"UP"}. With show-components=always: {"components":{"db":{"status":"UP"},"diskSpace":{"status":"UP"},"livenessState":{"status":"UP"},"ping":{"status":"UP"},"readinessState":{"status":"UP"},"ssl":{"status":"UP"}},"groups":["liveness","readiness"],"status":"UP"}.

### explore

**Printed alternative:** Database check in readiness only: traffic stops, with no restart. In liveness too: the platform restarts the process repeatedly. In neither: traffic keeps arriving and requests fail.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. These can leak secrets or change behavior. Keep the list minimal, and behind authentication.
- **B. Not this one:** Some values are masked by default, but a heap dump can contain anything in memory.
- **C. Not this one:** The problem here is exposure, not speed.
- **D. Not this one:** It starts normally, which is why the risk is easy to miss.
