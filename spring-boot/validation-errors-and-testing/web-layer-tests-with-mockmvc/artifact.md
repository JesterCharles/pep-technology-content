# Web-layer tests with MockMvc

## Objectives

- Write a @WebMvcTest that performs a request with MockMvc and asserts the status, headers and JSON body
- Test a controller's 404 and 400 responses in a @WebMvcTest, supplying the service bean from a @TestConfiguration fake (stubbing it with @MockitoBean is taught later in mockito-in-spring-at-mockitobean)
- Read a failing MockMvc assertion to tell an expected status mismatch from a wrong JSON value

## Teaching

A test performs a request with no server running:

```
@WebMvcTest(WorkshopController.class)
class T {
  @Autowired MockMvc mvc;
  // the controller needs a WorkshopService bean
}
```

Use a `@TestConfiguration` to give the slice a simple fake service. `MockMvc` then performs requests without a network, and you assert on status, headers and JSON.

```
mvc.perform(get("/bookings/3"))
   .andExpect(status().isOk())
   .andExpect(header().string("Content-Type", containsString("json")))
   .andExpect(jsonPath("$.email").value("a@b.c"));
```

In current Boot, `@WebMvcTest` comes from the `spring-boot-webmvc-test` module, via `spring-boot-starter-webmvc-test`. `MockMvcTester` offers an AssertJ-style alternative.

A failure message says what kind of problem you have:

```
Status expected:<200> but was:<404>

JSON path "$.title" expected:<Intro> but was:<Other>
```

A status failure usually means routing, a thrown exception or an error handler. A JSON value failure means the request succeeded, and the data or mapping is wrong. Test the error paths too, for example a 404 from a fake service that finds nothing, and a 400 from an invalid body.

You need a test that a controller returns 404 when `service.get(99)` finds nothing. No database is involved, and the team has not covered `@MockitoBean` yet.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- `@WebMvcTest` loads the web layer for a controller; you supply its collaborators.
- Assert status, headers and JSON with `andExpect`.
- Status failures and JSON failures point to different causes.

## Cheat sheet

Where to act: Start after `mvc`.

Next step: Use `perform`, then one `andExpect` per assertion.

Printed alternative: Perform the GET, and assert the status and the JSON title with andExpect. Starter file: `WorkshopWebTest.java`.

Where to act: Compare each row with the teaching panel.

Next step: Is the failure about the status code or about a JSON value?

- `jsonPath("$.field").value(...)`
- `MockMvcTester` is the AssertJ-style option.
- Test modules: `spring-boot-starter-webmvc-test`.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html
- https://docs.spring.io/spring-framework/reference/testing/mockmvc.html
- https://docs.spring.io/spring-framework/reference/testing/mockmvc/assertj.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. It is a slice: the service must be supplied by a fake or mock bean.
- **B. Not this one:** That is `@SpringBootTest`.
- **C. Not this one:** It does start a Spring context, limited to the web layer.
- **D. Not this one:** MockMvc calls the MVC layer directly with no real network.

### terminal

**Printed alternative:** Perform the GET, and assert the status and the JSON title with andExpect. Starter file: `WorkshopWebTest.java`.

### drag

**Answer and reason for each row**

- **`Status expected:<200> but was:<404>`: Routing or handler outcome.** The path may not match, or a handler answered 404.
- **`JSON path "$.title" expected:<Intro> but was:<Other>`: Data or mapping.** The request succeeded with a different value.
- **`Status expected:<201> but was:<400>` on a POST with a blank title: Request input.** Validation rejected the body before the handler ran.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. A simple fake in the slice proves the mapping, with no real service or database.
- **B. Not this one:** That turns a focused web test into a far heavier one.
- **C. Not this one:** The slice does not load services, so startup fails without a bean.
- **D. Not this one:** That is not how controllers work.
