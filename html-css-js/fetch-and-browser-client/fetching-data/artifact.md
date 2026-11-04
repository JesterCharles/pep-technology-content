# Fetching data

## Objectives

- Request JSON with fetch and await and read the parsed body
- Explain why fetch resolves on HTTP error statuses and check response.ok
- Render fetched data into the page safely

## Teaching

In many Java HTTP clients, or with `RestTemplate`, an error status can throw. Predict what happens here when the server answers 404.

```
try {
  const res = await fetch("/api/missing");
  console.log("got", res.status);
} catch (err) {
  console.log("caught");
}
```

`fetch(url)` returns a promise for a `Response`, which arrives when the headers do. Reading the body is a second asynchronous step, so there are two awaits.

```
const res = await fetch("/api/orders");
const orders = await res.json();
```

`res.json()` reads the stream and parses it. It rejects if the body is not valid JSON. A body can be read only once. This editor uses a practice server inside the page; the responses are real `Response` objects, and no network request is made.

Since `fetch` fulfills on error statuses, checking is your job. `res.ok` is `true` for statuses 200 to 299.

```
if (!res.ok) {
  throw new Error("Request failed: " + res.status);
}
```

Throwing turns the HTTP failure into a rejection, so one `catch` in your caller can handle both this and network failures. Check before you parse: an error body may not be the JSON you expect.

Fetched data is untrusted, even from your own API, because it may hold text that visitors wrote. Build elements and insert values with `textContent`, as you did in the cross-site scripting topic.

```
const row = document.createElement("p");
row.textContent = user.name;
panel.append(row);
```

Never build HTML strings from response data.

A teammate's function logs `undefined`, and the Network panel shows a 200 response with a correct JSON body.

```
async function loadUser() {
  const res = await fetch("/api/user");
  const user = res.json();
  console.log(user.name);
}
```

## Recap

`fetch` gives you a promise for a Response, and `res.json()` gives you a promise for the parsed body, so there are two awaits. `fetch` rejects only when no response arrives, so check `res.ok` and throw for HTTP failures. Render data with `textContent`, because response data is untrusted.

## Cheat sheet

What is logged?

- `got 404`: correct. The `fetch` promise fulfills whenever the server answers. A 404 is a successful HTTP exchange, so you must check the status yourself.
- `caught`: not correct. `fetch` rejects only when no response arrives at all, such as on a network failure.
- Nothing, because the promise stays pending: not correct. The server answered, so the promise settles.
- `got undefined`: not correct. A response object always has a numeric `status`.

Where to act: Inside `loadBooks`.

Next step: Write two statements, each with `await`: one to get the response, and one to read its body.

async function loadBooks() { ___ } loadBooks().then((books) => console.log(books.length, books[0].title));

Await fetch for the response, then await res.json() for the parsed body, and return it. The array has 2 books, the first titled Clean Code.

Where to act: After the `await fetch` line.

Next step: Test the `ok` property before reading the body. Include `res.status` in the error message.

async function loadBook(id) { ___ } loadBook(1) .then((book) => console.log(book.title)) .then(() => loadBook(99)) .catch((err) => console.log(err.message));

Await fetch, test res.ok, throw an Error containing res.status when it is false, and otherwise return await res.json(). Book 1 logs Clean Code, and book 99 logs a message containing 404.

Where to act: After you have the parsed array.

Next step: Loop over the array. In each pass, create an `li`, set its text from the title, and attach it to the list.

async function showBooks() { const list = document.querySelector("#books"); ___ } showBooks();

After reading the JSON, loop over the books, create a list item for each, set textContent from the title, and append it. The title with markup shows literally, and no extra elements are created.

Why is it undefined?

- `res.json()` returns a promise, so `user` is a promise with no `name`. It needs `await`: correct. Reading the body is asynchronous. Without `await`, you read a property from the promise rather than from the data.
- The server sent the wrong JSON: not correct. The Network panel shows the body is right. The bug is on the client.
- It needs `JSON.parse(res)`: not correct. `res` is a Response object, not text. `res.json()` is the right call; it only needs awaiting.
- `res.ok` must be checked before `json()` will work: not correct. You should check it, but skipping the check does not cause this.

```
async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}
```

## Sources

- MDN: Using the Fetch API, retrieved 2026-11-04
- MDN: Response.json, retrieved 2026-11-04
- WHATWG Fetch standard, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What is logged?

- `got 404`: correct. The `fetch` promise fulfills whenever the server answers. A 404 is a successful HTTP exchange, so you must check the status yourself.
- `caught`: not correct. `fetch` rejects only when no response arrives at all, such as on a network failure.
- Nothing, because the promise stays pending: not correct. The server answered, so the promise settles.
- `got undefined`: not correct. A response object always has a numeric `status`.

### terminal

### Static alternative

Await fetch for the response, then await res.json() for the parsed body, and return it. The array has 2 books, the first titled Clean Code.

### terminal

### Static alternative

Await fetch, test res.ok, throw an Error containing res.status when it is false, and otherwise return await res.json(). Book 1 logs Clean Code, and book 99 logs a message containing 404.

### terminal

### Static alternative

After reading the JSON, loop over the books, create a list item for each, set textContent from the title, and append it. The title with markup shows literally, and no extra elements are created.

### mcq

### Static alternative

Why is it undefined?

- `res.json()` returns a promise, so `user` is a promise with no `name`. It needs `await`: correct. Reading the body is asynchronous. Without `await`, you read a property from the promise rather than from the data.
- The server sent the wrong JSON: not correct. The Network panel shows the body is right. The bug is on the client.
- It needs `JSON.parse(res)`: not correct. `res` is a Response object, not text. `res.json()` is the right call; it only needs awaiting.
- `res.ok` must be checked before `json()` will work: not correct. You should check it, but skipping the check does not cause this.
