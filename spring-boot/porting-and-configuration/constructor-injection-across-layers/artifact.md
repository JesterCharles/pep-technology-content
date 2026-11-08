# Constructor injection across layers

## Objectives

- Wire a controller to a service and the service to a repository interface through final constructor fields with no @Autowired field injection
- Unit-test the service with a hand-written fake repository passed to its constructor, without starting Spring
- Explain how depending on the repository interface lets the in-memory implementation be replaced by a JPA repository later without changing the service

## Teaching

Two classes wire their dependencies differently:

```
@Service
class A {
  @Autowired private OrderRepository repo;
}

@Service
class B {
  private final OrderRepository repo;
  B(OrderRepository repo) { this.repo = repo; }
}
```

You write a unit test with no Spring context and a fake repository.

Each layer holds the next as a `final` field, set in the only constructor: controller to service, service to repository interface.

The service depends on the interface, `WorkshopRepository`, not on `InMemoryWorkshopRepository`. Spring injects whichever single implementation is a bean.

Avoid `@Autowired` on fields: such a dependency is invisible from outside, cannot be `final`, and leaves the object half-built without a container.

With constructor injection, a unit test is plain Java. A hand-written fake implements the interface:

```
class FakeRates implements RateRepository {
  public double rateFor(String code) { return 1.5; }
}

var prices = new PriceService(new FakeRates());
```

The test starts no context, so it runs in milliseconds and has no database to set up.

Next month, the team replaces the in-memory repository with a JPA repository. `WorkshopService` depends on the `WorkshopRepository` interface.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Every layer takes the next through one constructor into a `final` field.
- Depend on the repository interface, not an implementation.
- A plain fake and `new` test a service without starting Spring.

## Cheat sheet

Where to act: Start at the two field lines.

Next step: Think about which type the service should know: the behavior it needs, or one storage choice?

Printed alternative: Replace field injection with a final field of the repository interface type, assigned in a constructor. Starter file: `Workshops.java`.

Where to act: Replace the first `___`.

Next step: The constructor you wrote earlier tells you what to pass.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Replace the second `___`.

Next step: Use `assertEquals` with the count you expect first, then the actual size.

Printed alternative: Create the service with a fake repository and assert the result size, with no Spring context. Starter file: `WorkshopServiceTest.java`.

- No `@Autowired` is needed with a single constructor.
- Controller to service to repository, never the reverse.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/using/spring-beans-and-dependency-injection.html
- https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html
- https://docs.spring.io/spring-framework/reference/core/beans/classpath-scanning.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. `A` has no way to accept a fake without reflection or starting Spring.
- **B. Not this one:** Having no constructor is what makes `A` hard to test: nothing sets the field.
- **C. Not this one:** A plain test has no Spring container, so nothing fills the field.
- **D. Not this one:** A service is plain Java. Only the wiring needs the container.

### terminal

**Printed alternative:** Replace field injection with a final field of the repository interface type, assigned in a constructor. Starter file: `Workshops.java`.

### terminal

**Printed alternative:** Create the service with a fake repository and assert the result size, with no Spring context. Starter file: `WorkshopServiceTest.java`.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. The service only knows the interface, so the storage choice stays outside it.
- **B. Not this one:** The change is right but the reason is not: Spring never rewrites your class. The service is untouched because it depends only on the interface.
- **C. Not this one:** Spring injects by the declared interface type. Naming the JPA class would undo the benefit of depending on the interface.
- **D. Not this one:** Queries belong in the repository. The service keeps calling the same interface.
