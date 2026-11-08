# An integration test

## Objectives

- Write a @SpringBootTest that starts the full application context with the embedded H2 database and exercises an endpoint end to end
- Choose between @SpringBootTest, @WebMvcTest and @DataJpaTest for a described test by what each loads
- Keep integration tests independent with a known database state for each test

## Teaching

A test class has these annotations and calls an endpoint that reads from the database:

```
@SpringBootTest
@AutoConfigureMockMvc
class BookingIntegrationTest {
  @Autowired MockMvc mvc;
}
```

No `@MockitoBean` is present, and H2 is on the classpath.

`@SpringBootTest` starts the full context. `@AutoConfigureMockMvc` then gives you `MockMvc`, so requests pass through your filters, controllers, services and repositories into H2.

```
@Test
void createsAndReads() throws Exception {
  mvc.perform(post("/workshops").contentType(APPLICATION_JSON)
        .content("{\"title\":\"Intro\",\"capacity\":10}"))
     .andExpect(status().isCreated());
}
```

Compare it with a slice test: more realistic and slower, and a failure can be anywhere.

| Annotation | Loads | Use for |
| --- | --- | --- |
| `@SpringBootTest` | Whole app | Wiring across layers |
| `@WebMvcTest` | MVC layer | Status, JSON, validation |
| `@DataJpaTest` | JPA layer | Queries and mappings |

Tests sharing a context also share its database. Leftover rows make a test pass alone and fail in a suite. Give each test a known state: insert what it needs at the start, clear in `@BeforeEach`, or mark it `@Transactional` so a mock-environment test rolls back at the end.

`createsBooking` passes on its own. When the whole class runs, `countsBookings` fails, expecting 0 and finding 1.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `@SpringBootTest` loads the full context; `@AutoConfigureMockMvc` adds `MockMvc`.
- Choose the smallest annotation that can prove the behavior.
- Keep tests independent with a known database state for each test.

## Cheat sheet

Where to act: Start above the class.

Next step: One annotation loads everything; another supplies MockMvc.

Printed alternative: Add @SpringBootTest and @AutoConfigureMockMvc, then perform GET /workshops and expect 200. Starter file: `WorkshopIntegrationTest.java`.

Where to act: Use the table in the teaching panel.

Next step: Ask which real parts the check actually depends on.

- `@SpringBootTest`: all beans.
- `@WebMvcTest`: web slice.
- `@DataJpaTest`: persistence slice.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/testing/index.html
- https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html
- https://docs.spring.io/spring-framework/reference/testing/mockmvc.html
- https://www.h2database.com/html/main.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. `@SpringBootTest` loads the full application context, so all the real beans are used.
- **B. Not this one:** `MockMvc` is how the request is sent. `@SpringBootTest` decides what is loaded.
- **C. Not this one:** Nothing is mocked unless you ask.
- **D. Not this one:** The default uses a mock web environment, and H2 here. It never picks production.

### terminal

**Printed alternative:** Add @SpringBootTest and @AutoConfigureMockMvc, then perform GET /workshops and expect 200. Starter file: `WorkshopIntegrationTest.java`.

### drag

**Answer and reason for each row**

- **A blank title returns 400 with the right body: @WebMvcTest.** Only the web layer and validation are involved.
- **A custom JPQL query returns the right rows: @DataJpaTest.** Only persistence is under test.
- **Creating a booking then reading it through the API: @SpringBootTest.** The behavior depends on several real layers together.
- **A controller maps not found to 404: @WebMvcTest.** The service can be a fake, and the mapping is web-layer behavior.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Tests should not depend on what others left behind.
- **B. Not this one:** That hides the coupling, and it breaks as soon as the order changes.
- **C. Not this one:** That removes a check rather than fixing the isolation.
- **D. Not this one:** Size has nothing to do with leftover rows.
