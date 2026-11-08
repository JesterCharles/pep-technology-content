# Dependency injection replacing manual wiring

## Objectives

- Replace the manual new-based wiring of a controller, service and repository with Spring-managed components that receive their dependencies through constructors
- Predict the startup outcome when a required bean is missing or when two beans match one injection point, and resolve the ambiguity with @Primary or @Qualifier
- Explain why constructor injection keeps a class testable with plain new in a unit test

## Teaching

Your handler builds its own collaborators:

```
var repo = new InMemoryWorkshopRepository();
var service = new WorkshopService(repo);
var controller = new WorkshopController(service);
```

You mark the three classes as Spring components and delete those lines. Each class now asks for what it needs through its constructor.

Spring finds classes marked with stereotypes such as `@RestController`, `@Service` and `@Repository`. Each one becomes a bean in the container.

A class states its dependencies as constructor parameters and keeps them in `final` fields. With a single constructor, no `@Autowired` is required.

```
@Service
class WorkshopService {
  private final WorkshopRepository repo;
  WorkshopService(WorkshopRepository repo) { this.repo = repo; }
}
```

Because the dependency is a plain parameter, a unit test can pass a fake with `new`, with no Spring at all.

The container resolves each constructor parameter by type at startup, so wiring problems stop the app before it serves a request.

- No matching bean: startup fails naming the missing type.
- Two matching beans: startup fails because the injection point is ambiguous.
- Fix for ambiguity: mark one bean `@Primary`, or name the wanted bean with `@Qualifier` at the injection point.

A startup failure is good news: the mistake is found before any learner or customer sends a request.

A class uses field injection with `@Autowired`. A colleague wants to unit-test it without starting Spring, using a fake repository.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Stereotype annotations register beans; constructors declare what each bean needs.
- Missing or ambiguous beans stop startup with a message naming the problem.
- Constructor injection lets a unit test call `new` with a fake.

## Cheat sheet

Where to act: Start at the line with `new WorkshopService`.

Next step: That line must go; think about what replaces it so the field still gets a value.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Look at the constructor signature in the teaching panel.

Next step: The parameter type is what the container uses to find the bean.

Printed alternative: Change the class so the container supplies `WorkshopService` through a constructor, with a final field and no `new` call. Starter file: `WorkshopController.java`.

Where to act: Change the Beans present control first.

Next step: Decide how many repository beans exist; with two, you must also pick a resolution.

Printed alternative: None present fails: no qualifying bean. Both present with no resolution fails: expected single matching bean but found 2. Both present with @Primary on the JPA bean or a @Qualifier naming it succeeds. Only the JPA bean present succeeds.

- One constructor needs no `@Autowired`.
- Ambiguity: `@Primary` for a default, `@Qualifier` at the injection point.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/using/spring-beans-and-dependency-injection.html
- https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html
- https://docs.spring.io/spring-framework/reference/core/beans/classpath-scanning.html
- https://docs.spring.io/spring-framework/reference/core/beans/basics.html
- https://jakarta.ee/specifications/dependency-injection/2.0/

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Not this one:** Constructor parameters are filled by the container, so the service is not null.
- **B. Correct answer:** Right. The container builds the graph in dependency order and injects through constructors.
- **C. Not this one:** The point of the change is that your code no longer calls `new` for these beans.
- **D. Not this one:** The JVM creates nothing by itself. The Spring container does this.

### terminal

**Printed alternative:** Change the class so the container supplies `WorkshopService` through a constructor, with a final field and no `new` call. Starter file: `WorkshopController.java`.

### explore

**Printed alternative:** None present fails: no qualifying bean. Both present with no resolution fails: expected single matching bean but found 2. Both present with @Primary on the JPA bean or a @Qualifier naming it succeeds. Only the JPA bean present succeeds.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. A constructor parameter lets the test pass the fake directly, with no container.
- **B. Not this one:** `@Primary` belongs on a bean and does not change how a test can supply a value.
- **C. Not this one:** A shared static dependency makes tests order-dependent and hides the requirement.
- **D. Not this one:** That works but is slow, and it is the opposite of a plain unit test.

### terminal

**Printed alternative:** Replace the placeholder so the test builds the controller with `new`, passing a `FakeWorkshopService` through its constructor, without starting Spring. The starter is the test shown in the editor; this reading does not include a finished answer.

### explore

**Printed alternative:** Record the exception name that the simulated run reports for the field-injected version.
