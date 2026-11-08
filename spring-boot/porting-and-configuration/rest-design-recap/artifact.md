# Reading: REST design recap

## Objectives

- Name resources with plural nouns and use HTTP methods for actions instead of verbs in paths
- Classify HTTP methods as safe and idempotent and choose the method for a described operation
- Choose consistent status codes and JSON error bodies across the endpoints of one API

## Teaching

An API has this endpoint: `POST /getWorkshopById?id=7`. A reviewer asks you to redesign it.

Paths name resources using plural nouns; HTTP methods say what happens. `GET /workshops` lists, `POST /workshops` creates, `GET /workshops/7` reads one, `DELETE /workshops/7` removes one.

RFC 9110 defines two useful properties. Safe methods do not request a change: GET and HEAD. Idempotent methods give the same intended effect when repeated: GET, HEAD, PUT and DELETE. POST is neither by default.

Idempotence is why a client can safely retry a PUT after a timeout.

Consistency across endpoints saves every client from special cases. Pick one JSON error shape and use the same statuses for the same outcomes.

| Method | Safe | Idempotent |
| --- | --- | --- |
| GET | Yes | Yes |
| PUT | No | Yes |
| DELETE | No | Yes |
| POST | No | No |

A timeout tells the client nothing about whether a write happened. Whether a retry is safe depends on the row above.

One endpoint returns `{"message":"not found"}` with status 404. Another returns `{"err":"no such thing"}` with status 200.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Plural nouns name resources; HTTP methods say what happens.
- GET and HEAD are safe; PUT and DELETE are idempotent; POST is neither.
- Use one error shape and consistent statuses across the API.

## Cheat sheet

Pressing a lift call button five times still brings one lift. Posting five identical letters sends five letters.

A repeatable request is like the lift button; a non-repeatable one is like posting a letter.

Where to act: Decide on the HTTP method first in each row.

Next step: Then ask whether the operation targets the whole collection or one known item.

Where to act: Change the Method control and read the model.

Next step: Compare the two properties: you need one yes and one no.

Printed alternative: GET: safe and idempotent, no change requested. PUT: not safe, idempotent, retry has the same effect. DELETE: not safe, idempotent. POST: not safe, not idempotent, a retry can create a duplicate.

- Create: `POST /things`. Read: `GET /things/{id}`. Replace: `PUT /things/{id}`. Remove: `DELETE /things/{id}`.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://spring.io/guides/gs/rest-service/
- https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html
- https://www.rfc-editor.org/rfc/rfc9110.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. A plural noun names the resource, the id is in the path and GET says what you are doing.
- **B. Not this one:** The HTTP method already says get, so a verb in the path repeats it.
- **C. Not this one:** Fetching is a read, and POST is not safe, so caches and clients cannot treat it as a read.
- **D. Not this one:** An action parameter hides the operation. The method should express it.

### drag

**Answer and reason for each row**

- **Create a new workshop: POST /workshops.** The server assigns the new id, so the client posts to the collection.
- **Replace workshop 7 with new data: PUT /workshops/7.** PUT replaces a known resource and is idempotent.
- **Show all workshops: GET /workshops.** A safe read of the collection.
- **Remove workshop 7: DELETE /workshops/7.** Deleting a known resource is idempotent in intent.

### explore

**Printed alternative:** GET: safe and idempotent, no change requested. PUT: not safe, idempotent, retry has the same effect. DELETE: not safe, idempotent. POST: not safe, not idempotent, a retry can create a duplicate.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Clients can then handle every failure the same way.
- **B. Not this one:** Clients see one API. Inconsistency costs each client extra code.
- **C. Not this one:** That hides failure from clients, proxies and monitoring.
- **D. Not this one:** A status plus a consistent body explains what went wrong.
