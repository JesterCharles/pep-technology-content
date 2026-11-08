# Controller, service and repository layers

## Objectives

- Assign each responsibility of a described feature (HTTP mapping, business rule, persistence) to the controller, service or repository layer
- Refactor a controller that calls the repository directly so that it calls a service that owns the business rule
- Explain why the controller depends on the service and the service on the repository interface, never the reverse

## Teaching

A rule says: a workshop cannot be booked when it is full. A team writes this check in the controller, and then adds a second endpoint and a scheduled job that also book workshops.

A request travels down through three layersThe controller handles HTTP, the service owns business rules, and the repository handles persistence, each calling only the layer below it. Controller: HTTP mapping and status Service: business rules Repository: persistence

Dependencies point down, never up.

A controller translates HTTP to method calls and back. A service owns business rules and transaction boundaries. A repository reads and writes data.

A useful test: would this code still be needed if the same operation were called from a scheduled job? If so, it does not belong in the controller.

A controller that calls a repository directly usually grows rules over time. The refactor is mechanical: move the rule into a service method, and make the controller call only that method.

```
@Service
class BookingService {
  private final BookingRepository bookings;
  private final WorkshopRepository workshops;
  // constructor
  Booking book(long workshopId, String email) { ... }
}
```

The service throws a domain exception when the rule fails, and the web layer maps it to a status.

A service class imports `HttpServletRequest` and reads a header to decide a discount.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Controller for HTTP, service for rules and transactions, repository for data.
- Dependencies point down: controller to service to repository.
- Rules live where every caller shares them, in the service.

## Cheat sheet

Where to act: Read each row against the three labels in the diagram.

Next step: Ask: is it about HTTP, a rule of the business, or storage?

Where to act: Start with the two field lines.

Next step: Which single collaborator does a thin controller need?

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Then rewrite the method body.

Next step: The rule has moved, so the body becomes one line.

Printed alternative: Inject BookingService instead of the repositories, and make the method call service.book with the id and email. Starter file: `BookingController.java`.

- If a scheduled job would need it, it does not belong in the controller.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://spring.io/guides/gs/rest-service/
- https://docs.spring.io/spring-boot/reference/using/structuring-your-code.html
- https://docs.spring.io/spring-framework/reference/core/beans/classpath-scanning.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. A business rule belongs below the web layer, so every caller shares it.
- **B. Not this one:** A scheduled job never goes through a controller.
- **C. Not this one:** A database only knows the rules you put in it.
- **D. Not this one:** Spring never relocates your code.

### drag

**Answer and reason for each row**

- **Map `POST /bookings` and pick status 201: Controller.** Paths and status codes are HTTP concerns.
- **Refuse a booking when the workshop is full: Service.** This is a business rule that every caller must share.
- **Find all bookings for a workshop id: Repository.** This is a data access query.
- **Commit two writes together: Service.** A business operation sets the transaction boundary.

### terminal

**Printed alternative:** Inject BookingService instead of the repositories, and make the method call service.book with the id and email. Starter file: `BookingController.java`.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Dependencies point down, so the service stays callable without HTTP.
- **B. Not this one:** The change is right but the reason is not: speed is not the point. Pointing dependencies down keeps the service free of HTTP.
- **C. Not this one:** It can compile, but a job or test now needs a fake HTTP request.
- **D. Not this one:** That spreads the HTTP dependency even lower; repositories read data, not headers.
