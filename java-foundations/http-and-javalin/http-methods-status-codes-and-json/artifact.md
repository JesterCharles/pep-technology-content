# HTTP methods, status codes and JSON

## Objectives

- Choose GET, POST, PUT or DELETE for an operation and say which methods are safe or idempotent
- Pick a status code class (2xx, 4xx, 5xx) and a specific code for a response
- Read and write a JSON object with nested values and arrays

## Teaching

Every HTTP response carries a three-digit status code. A browser asks for a missing book. Predict before any explanation.

```
GET /books/42 HTTP/1.1
Host: localhost:7070
```

- `GET /books` or `GET /books/7`: read the list, or one book.
- `POST /books`: send data to process, typically a new book whose id the server picks.
- `PUT /books/7`: create or replace book 7 with the complete version in the request.
- `DELETE /books/7`: remove book 7.

A method is safe when the client asks only to read, requesting no change. `GET` is safe.

A method is idempotent when sending the same request twice is meant to leave the server as sending it once. `PUT` and `DELETE` are idempotent: replacing book 7 with the same version twice, or removing it twice, ends in the same state. Every safe method is idempotent too. `POST` is neither: each identical `POST` may add another book.

So after a timeout, a client can safely resend an idempotent request.

Request and response bodies in this module are JSON. A JSON object is `{ }` holding `"name": value` pairs separated by commas. Names are always strings in double quotes. A value is a string in double quotes, a number, `true`, `false`, `null`, an array `[ ]` of values, or another object, so objects and arrays nest.

```
{
  "id": 3,
  "tags": ["classic", "space"],
  "owner": { "name": "Ana", "admin": false }
}
```

Single quotes, trailing commas and comments are not JSON.

The first digit of a status code is its class:

- 2xx success: `200 OK`; `201 Created` when the request made a new resource, such as a `POST` that adds a book; `204 No Content` for success with no body, such as a `DELETE`.
- 4xx client error: the request is the problem. `400 Bad Request` for input the server will not process, such as a missing title; `404 Not Found` when nothing exists at the path.
- 5xx server error: the request was fine but the server failed, such as `500 Internal Server Error` when server code throws.

## Model

The model: a request is a sentence. The path is the noun, the resource; the method is the verb, what to do with it; the status code is the server's one-word answer.

## Recap

- `GET` reads, `POST` adds or processes, `PUT` creates or replaces at a known path, `DELETE` removes.
- `GET` is safe and idempotent; `PUT` and `DELETE` are idempotent but not safe; `POST` is neither.
- 2xx means success (200, 201, 204), 4xx means the request is wrong (400, 404), 5xx means the server failed (500).
- A JSON object holds quoted names with values; values can be strings, numbers, `true`, `false`, `null`, arrays and nested objects.

Next topic: Routes and handlers in Javalin

## Cheat sheet

Where to act: The operation shown after Operation:, above the four method buttons.

Next step: First ask whether the operation only reads. If it changes data, ask whether it adds something new, swaps in a complete version, or removes something.

Where to act: The request shown after Request:.

Next step: Imagine the server state after the request arrives once, then after it arrives twice. Same state means idempotent; no change asked for at all means safe as well.

Where to act: After the `"year"` line, before the closing `}`.

Next step: Each new pair needs a comma before it, because `"year"` is no longer the last item. The `authors` value starts with `[`.

Another hint Another hint, 2 of 2 for Activity 4

Where to act: The value of `publisher`.

Next step: That value is a whole object of its own, so it opens with `{`, holds its two quoted names with string values, and closes with `}` before the outer object closes.

Optional time: about 4 minutes, in addition to this topic's time.

Plan a tiny API for a reading list. On paper, write one line per operation: list all entries, add an entry, replace entry 3, remove entry 3, and read an entry that does not exist. For each line give the method, the path, whether the method is safe or idempotent, and the status code a successful or failed call returns.

Success criteria: each line uses the method, property and status code taught on this page, and you can say in one sentence why the missing entry gets a 4xx code and not a 5xx code.

|  |  |
| --- | --- |
| Read | `GET /books`, `GET /books/7`: 200 |
| Add | `POST /books`: 201 |
| Replace | `PUT /books/7`: 200 or 204 |
| Remove | `DELETE /books/7`: 204 |
| Bad input / missing | 400 / 404 |
| JSON shape | `{"name": "x", "list": [1, 2], "inner": {"ok": true}}` |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC). Links open outside this lesson.

- RFC 9110, HTTP Semantics: section 9 (methods; 9.2.1 safe, 9.2.2 idempotent; 9.3 GET, POST, PUT, DELETE) and section 15 (status code classes; 200, 201, 204, 400, 404, 500).
- RFC 8259, The JSON Data Interchange Format: values, objects, arrays, strings.
- MDN: HTTP request methods, including PATCH for partial modification.
- MDN glossary: Safe (HTTP methods) and Idempotent.
- MDN: HTTP response status codes.

## Static interaction alternatives

### predict

Prediction (practice, not scored): GET /books/42 when the server has no book 42. 200 OK with an empty body (wrong: 200 says the request succeeded); 404 Not Found (correct: the server found no book at that path); 500 Internal Server Error (wrong: 500 means the server itself failed); 400 Bad Request (wrong: the request is well formed; only the book is missing).

### drag

Method sorting activity: show the list of all books uses GET; add a new book whose id the server picks uses POST; replace book 7 with a complete new version uses PUT; remove book 7 uses DELETE; place an order, where every request creates another order, uses POST.

### drag

Property sorting activity: GET /books is safe and idempotent; PUT /books/7 is idempotent but not safe; DELETE /books/7 is idempotent but not safe; POST /books is neither safe nor idempotent.

### explore

JSON editor. The starter object has id 7, title Good Omens and year 1990. The learner adds authors, an array of two author-name strings, and publisher, a nested object with string values for name and city. Run parses the text with the browser's JSON parser and checks: one JSON object; id 7, title and year kept; authors is an array of two non-empty strings; publisher is an object with non-empty string name and city. Single quotes, a trailing comma, unquoted names and comments are reported as JSON syntax errors.

### mcq

Apply question: POST /books with an empty title, when every book needs a non-empty title, should get 400 Bad Request: the client sent input the server will not process. Wrong: 201 Created (nothing was created); 404 Not Found (the path /books exists); 500 Internal Server Error (the server did not fail; the input is wrong). Retry form: a correct GET /books during which a server bug throws an unhandled exception gets 500 Internal Server Error, a 5xx server error.
