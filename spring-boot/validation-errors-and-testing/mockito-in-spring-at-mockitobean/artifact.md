# Mockito in Spring: @MockitoBean

## Objectives

- Replace a service bean in a Spring test context with @MockitoBean and stub its behavior with when(...).thenReturn(...)
- Verify an interaction on a @MockitoBean and explain how it differs from a plain Mockito mock created without Spring
- Choose between a plain unit test with a fake, a @MockitoBean slice test and a full context test for a described class

## Teaching

A test replaces a bean in the context:

```
@WebMvcTest(WorkshopController.class)
class WorkshopControllerTest {
  @Autowired MockMvc mvc;
  @MockitoBean WorkshopService service;

  @Test void lists() throws Exception {
    when(service.all()).thenReturn(List.of(new Workshop(1, "Intro")));
    mvc.perform(get("/workshops")).andExpect(status().isOk());
  }
}
```

`@MockitoBean` is a Spring Framework test annotation that defines a Mockito mock as a bean in the `ApplicationContext`, replacing any existing bean of that type.

```
when(bookings.find(3L)).thenReturn(new Booking(3, "a@b.c"));
when(bookings.find(99L)).thenThrow(new BookingNotFound(99));
```

A method with no stub returns a default such as `null` or an empty list, so a test with an unstubbed call can pass or fail for the wrong reason.

`verify` checks that a call happened: `verify(service).book(3L, "a@b.c");` and `verify(service, never()).delete(anyLong());`.

A plain Mockito mock made with `@Mock` or `mock(...)` lives in the test alone, and Spring knows nothing about it. `@MockitoBean` is needed only when Spring builds the object under test.

| Test style | Good for |
| --- | --- |
| Plain test with a fake | One class of logic |
| `@MockitoBean` slice | A controller, with a mocked service |
| `@SpringBootTest` | The whole app wired together |

A test has `@Mock WorkshopService service;` on a `@WebMvcTest` class. Startup fails with a message that no `WorkshopService` bean was found.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `@MockitoBean` puts a mock into the Spring test context.
- Stub with `when(...).thenReturn(...)`, and check with `verify`.
- Pick the smallest test style that can prove the behavior.

## Cheat sheet

Where to act: Start with the field marked by the TODO.

Next step: Which annotation puts a mock into the Spring context here?

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Then fill the `___`.

Next step: Write a stub with `when` for the exact call, then say what it returns.

Printed alternative: Annotate the service field with @MockitoBean, and stub get(7L) to return the workshop. Starter file: `WorkshopControllerTest.java`.

Where to act: Use the table in the teaching panel.

Next step: Does the test need Spring at all? If so, how much of it?

- `@MockitoBean` and `@MockitoSpyBean` come from Spring Framework test support.
- `verify(mock, never()).method(...)`

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/testing/index.html
- https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html
- https://docs.spring.io/spring-framework/reference/testing/annotations/integration-spring/annotation-mockitobean.html
- https://javadoc.io/doc/org.mockito/mockito-core/5.24.0/index.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. `@MockitoBean` places a mock in the Spring context, so the controller receives it.
- **B. Not this one:** A `@MockitoBean` replaces the bean of that type in the context.
- **C. Not this one:** Without a mock or fake, the context would fail to start; with it, the mock is injected.
- **D. Not this one:** Nothing in the test creates a real service.

### terminal

**Printed alternative:** Annotate the service field with @MockitoBean, and stub get(7L) to return the workshop. Starter file: `WorkshopControllerTest.java`.

### drag

**Answer and reason for each row**

- **A pricing service with discount rules and one repository: Plain test with fake.** No Spring behavior is under test.
- **A controller that returns 404 when the service throws: @MockitoBean slice.** The mapping needs the web layer, and the service can be mocked.
- **A request flowing through security, service and H2: Full context test.** The behavior is several real parts working together.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Only `@MockitoBean` registers the mock in the application context.
- **B. Not this one:** Slices commonly use `@MockitoBean`.
- **C. Not this one:** Controllers are ordinary instances.
- **D. Not this one:** That would not put it in the context.
