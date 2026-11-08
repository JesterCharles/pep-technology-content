# DTOs and mapping

## Objectives

- Define request and response DTOs as Java records that expose only the fields the API contract needs
- Map between an entity and its DTOs in one place and keep entities out of controller signatures
- Explain how returning entities directly can leak internal fields or trigger lazy loading during serialization

## Teaching

A controller returns its entity directly:

```
@Entity
class User {
  @Id Long id;
  String email;
  String passwordHash;
}

@GetMapping("/users/{id}")
User one(@PathVariable long id) { return repo.findById(id).orElseThrow(); }
```

A DTO (data transfer object) is a class made for the API contract. Java records fit well:

```
record NewWorkshop(String title, int capacity) {}
record WorkshopResponse(long id, String title) {}
```

A request DTO holds only what a client may send, so a client cannot set fields such as `role` by adding them to JSON. A response DTO holds only what a client may see.

Then the entity can change without changing the API.

Map between entity and DTO in one place, so changes have one home. A small mapper class, or a static factory on the record, is enough.

```
record WorkshopResponse(long id, String title) {
  static WorkshopResponse from(Workshop w) {
    return new WorkshopResponse(w.getId(), w.getTitle());
  }
}
```

Keep entities out of controller signatures. Returning an entity also lets the JSON writer walk its getters, which can trigger lazy loading while the response is written.

A client sends `{"email":"a@b.c","role":"ADMIN"}` to an endpoint that binds directly to the `User` entity, which has a `role` field.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- DTO records define the API contract in each direction.
- Map in one place, and keep entities out of controller signatures.
- Returning entities risks leaks and lazy loading during serialization.

## Cheat sheet

Where to act: Replace each `___` with record components.

Next step: Each record lists only what that direction of the contract needs.

Printed alternative: Declare the request record with email and password, and the response record with id and email only. Starter file: `UserDtos.java`.

Where to act: Start with the method return type.

Next step: After changing the type, the return statement needs one more call around the entity.

Printed alternative: Change the return type to UserResponse, and convert the entity with UserResponse.from. Starter file: `UserController.java`.

- Name DTOs by purpose: `NewUser`, `UserResponse`.
- A static `from` factory is often enough.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestbody.html
- https://docs.spring.io/spring-data/jpa/reference/repositories/projections.html
- https://docs.spring.io/spring-boot/reference/features/json.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. Serialization writes the properties it can see, so the hash leaks unless you shape the response.
- **B. Not this one:** JPA has no idea which fields are sensitive.
- **C. Not this one:** Returning entities works, which is why this mistake is easy to make.
- **D. Not this one:** `@Id` marks the primary key. It does not limit the JSON.

### terminal

**Printed alternative:** Declare the request record with email and password, and the response record with id and email only. Starter file: `UserDtos.java`.

### drag

**Your reason**

- **Why not return the entity: the JSON writer walks every getter.** It writes fields such as the password hash and can load lazy associations during the response, outside your control.

### terminal

**Printed alternative:** Change the return type to UserResponse, and convert the entity with UserResponse.from. Starter file: `UserController.java`.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. This is mass assignment. Only bind what the client may set.
- **B. Not this one:** Binding sets any matching property it can reach; it does not know which fields are internal.
- **C. Not this one:** Here `role` is a known field on the entity, so it binds.
- **D. Not this one:** The database stores what it is given, if the column allows it.
