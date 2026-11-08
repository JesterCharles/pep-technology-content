# Spring review: layers, data access, errors, testing, security

## Objectives

- Retrieve and apply layering, JPA mapping and query, validation and error handling, testing and security skills on mixed practice tasks without new material
- Trace one request through security, controller, service, repository and error handling, and locate where a described defect (N+1 query, missing validation, open endpoint) would surface

## Teaching

This review uses no new material. Picture a request: `POST /workshops/3/bookings` with a bearer token and a JSON body.

You will not learn anything new here. Use what you remember, then check yourself. Where would each defect surface, and which tool shows it?

This handler breaks several rules from this course. Recall each rule before you change anything: layers, DTOs, validation and status codes.

Good work includes the right proof. Choose the smallest test that proves each change.

A new endpoint must let a customer read their own booking. It has no tests yet, and it uses `findById`.

## Recap

Every activity is answered, but this topic is not complete: 0 of 5 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Security, then controller and validation, then service, then repository; errors map at the edge.
- Keep DTOs at the boundary and rules in the service, and read SQL logs for surprises.
- Choose the smallest test that proves each change.

## Cheat sheet

Where to act: Trace the request order from the first activity.

Next step: Which layer can notice this problem first?

Where to act: Start with the parameter.

Next step: An entity should not bind from JSON. What replaces it, and what triggers its constraints?

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Then fix the body.

Next step: Which layer owns writes? The status should say something was created.

Printed alternative: Replace the entity with a validated DTO, call the service, and return 201 with a response DTO and a Location. Starter file: `BookingController.java`.

Where to act: Recall what each test style loads.

Next step: Does the proof need security, web, persistence or just one class?

- N+1: SQL log. Missing validation: `@Valid`. Open endpoint: filter chain. Rule skipped: service.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html
- https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html
- https://docs.spring.io/spring-framework/reference/testing/mockmvc.html
- https://docs.spring.io/spring-data/jpa/reference/jpa/query-methods.html
- https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html
- https://api-security.owasp.org/editions/2023/en/0x11-t10/

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. Security runs before the controller, validation at binding, and rules and data below that.
- **B. Not this one:** That is reversed. A request enters at the web edge.
- **C. Not this one:** Security filters run before the controller is reached.
- **D. Not this one:** The service is called from the controller.

### drag

**Answer and reason for each row**

- **A listing issues 201 queries for 200 rows: Repository and SQL log.** The repeated select shows up in the SQL log as N+1.
- **A blank title reaches the database because `@Valid` is missing: Controller edge.** The trigger belongs on the handler parameter.
- **Anyone can call `DELETE /workshops/3`: Security filter chain.** An open endpoint means a missing rule in the chain.
- **A booking succeeds on a full workshop: Service.** The capacity rule belongs in the service.

### terminal

**Printed alternative:** Replace the entity with a validated DTO, call the service, and return 201 with a response DTO and a Location. Starter file: `BookingController.java`.

### drag

**Answer and reason for each row**

- **A blank email now returns 400: @WebMvcTest.** Web-layer validation can be proved with a fake service.
- **A capacity rule refuses a full workshop: Plain unit test.** It is one class of logic, with a fake repository.
- **A fetch join loads sessions in one statement: @DataJpaTest.** It is a query against a real persistence layer.
- **An anonymous DELETE now returns 401 end to end: @SpringBootTest with security test support.** The whole chain and security rules are under test.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. This closes broken object level authorization, and the test proves it.
- **B. Not this one:** That adds leak and lazy loading risks, and the access problem remains.
- **C. Not this one:** Every customer has that role, so they can still read each other's bookings.
- **D. Not this one:** That makes stolen tokens worse, and it does not touch access.
