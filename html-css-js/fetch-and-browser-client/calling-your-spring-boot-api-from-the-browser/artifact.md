# Calling your Spring Boot API from the browser

## Objectives

- Send GET and POST requests with a JSON body and Content-Type header to a REST API
- Map API responses, including error responses, to updates in the page

## Teaching

Your Spring controller has `@PostMapping` with an `@RequestBody` record. Predict what happens with this call.

```
await fetch("/api/records", {
  method: "POST",
  body: JSON.stringify({ title: "New" }),
});
```

A GET needs only a URL. A POST with JSON needs three things: the method, the header and a string body.

```
const res = await fetch(url, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

Spring reads that body into your `@RequestBody` type. A create usually answers 201 with the new record. The server in this editor is a page-local practice stand-in for your API.

Each response deserves a matching page update: 201 adds to the list, 400 shows what to fix, and 415 is a bug in your code. A rejected `fetch` means the server was unreachable.

Use the Network panel when debugging: it shows what was really sent, whatever your code intended.

Now connect the response to the page. Read the status, then update one place for each outcome.

```
if (res.status === 201) { /* add it */ }
else if (res.status === 400) { /* show detail */ }
else { /* generic message */ }
```

Use the returned record, not the input, so you show what the server stored. Use `textContent` for all of it.

A POST returns 400 with `Failed to read request`. The Network panel shows the request payload as `[object Object]`, even though `Content-Type` is correct.

```
await fetch("/api/records", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: { title: "New" },
});
```

## Recap

A GET needs a URL. A JSON POST needs the method, a `Content-Type` of `application/json` and a `JSON.stringify` body. Map each outcome to a page update: 201 adds what the server returned, 400 shows the detail, other statuses show a generic message, and a rejection offers a retry. The Network panel shows what was really sent.

## Cheat sheet

What does Spring answer?

- 415 Unsupported Media Type: correct. With a string body and no header, `fetch` sends `text/plain;charset=UTF-8`. Spring has no converter for that to your record, so it refuses.
- 201 Created: not correct. `JSON.stringify` makes JSON text, but nothing tells the server it is JSON.
- A CORS error, always: not correct. This could be same-origin. A missing content type is a separate issue.
- `fetch` throws before sending: not correct. The call is valid and it is sent.

Where to act: The `fetch` call in `createRecord`.

Next step: Pass an options object as the second argument with `method`, `headers` and `body`, following the example on this page.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: The `body` property.

Next step: A plain object cannot be sent directly, so turn it into a JSON string first.

async function listRecords() { ___ } async function createRecord(title) { ___ } listRecords() .then((all) => console.log(all.length)) .then(() => createRecord("Second")) .then((rec) => console.log(rec.title));

listRecords awaits fetch and then res.json(). createRecord passes method POST, a Content-Type header of application/json and a JSON.stringify body, then returns await res.json(). The output is 1, then Second.

Where to act: The Title field and the two checkboxes.

Next step: Change one thing per save, so each result has one cause.

A valid save gives 201, and the page adds the record. A blank title gives 400 with a detail shown to the user. A missing header gives 415, which is a code bug needing a generic message and a console error. A switched-off server rejects fetch, and the page offers a retry.

Where to act: After the `await fetch` call.

Next step: Parse the body once, since both the 201 and 400 answers have JSON. Then branch on `res.status`.

const list = document.querySelector("#records"); const status = document.querySelector("#status"); async function save(title) { ___ } save("Buy milk");

Await the POST, and parse the JSON body once. On status 201, append a list item with the returned title and set the status to Saved. On 400, set the status to the detail field. Otherwise use Could not save.

What is the fix?

- Use `body: JSON.stringify({ title: "New" })`: correct. `fetch` does not serialize plain objects. It converted it to the string `[object Object]`, which is not valid JSON.
- Change the header to `application/object`: not correct. No such media type would help. The header is right; the body is wrong.
- Move `title` into the URL query string: not correct. Your `@RequestBody` expects JSON in the body.
- Add `@CrossOrigin` to the controller: not correct. This is not a CORS failure: the server received the request and answered.

| JSON POST needs | Why |
| --- | --- |
| `method: "POST"` | GET is the default |
| A `Content-Type` of `application/json` | Without it a string body is sent as `text/plain` |
| `body` from `JSON.stringify` | `fetch` does not serialize plain objects |
| `await res.json()` on the answer | Reads what the server stored |

## Sources

- MDN: Using the Fetch API, retrieved 2026-11-04
- Spring Framework: CORS, retrieved 2026-11-04
- Spring Framework: Mapping requests, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What does Spring answer?

- 415 Unsupported Media Type: correct. With a string body and no header, `fetch` sends `text/plain;charset=UTF-8`. Spring has no converter for that to your record, so it refuses.
- 201 Created: not correct. `JSON.stringify` makes JSON text, but nothing tells the server it is JSON.
- A CORS error, always: not correct. This could be same-origin. A missing content type is a separate issue.
- `fetch` throws before sending: not correct. The call is valid and it is sent.

### terminal

### Static alternative

listRecords awaits fetch and then res.json(). createRecord passes method POST, a Content-Type header of application/json and a JSON.stringify body, then returns await res.json(). The output is 1, then Second.

### explore

### Static alternative

A valid save gives 201, and the page adds the record. A blank title gives 400 with a detail shown to the user. A missing header gives 415, which is a code bug needing a generic message and a console error. A switched-off server rejects fetch, and the page offers a retry.

### terminal

### Static alternative

Await the POST, and parse the JSON body once. On status 201, append a list item with the returned title and set the status to Saved. On 400, set the status to the detail field. Otherwise use Could not save.

### mcq

### Static alternative

What is the fix?

- Use `body: JSON.stringify({ title: "New" })`: correct. `fetch` does not serialize plain objects. It converted it to the string `[object Object]`, which is not valid JSON.
- Change the header to `application/object`: not correct. No such media type would help. The header is right; the body is wrong.
- Move `title` into the URL query string: not correct. Your `@RequestBody` expects JSON in the body.
- Add `@CrossOrigin` to the controller: not correct. This is not a CORS failure: the server received the request and answered.
