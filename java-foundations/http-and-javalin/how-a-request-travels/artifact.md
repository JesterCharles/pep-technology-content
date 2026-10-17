# Reading: how a request travels from browser to server

## Objectives

- Trace a request from URL through name lookup and connection to a server response
- Name the parts of a URL: scheme, host, port, path and query
- Explain what localhost and a port mean for a server running on your machine

## Teaching

A Java server you will build in this module runs on your own computer. Your browser reaches it with an address like this one. Predict before any explanation.

```
http://localhost:7070/books?sort=year
```

```
https://shop.example.com:8443/api/orders?status=open
scheme   host             port path       query
```

- Scheme, before `://`: the protocol, such as `http` or `https`.
- Host: the computer's name or IP address.
- Port, after a `:`: the program on that computer. If it is left out, `http` means 80 and `https` means 443.
- Path, from the first `/` after the host: the resource.
- Query, after `?`: options, usually `name=value` pairs joined by `&`.

When you press Enter on a URL, the browser is the client. It splits the URL into its parts, then turns the host name into an IP address with a name lookup (DNS). With that address and the port it opens a connection to the server.

Over the connection it sends a request: a method such as `GET`, the path and query, and headers such as `Host`. The program listening on that port reads the request and sends back a response: a status code such as `200 OK`, headers, and usually a body. The browser then shows or uses the body, and the connection is closed or kept for the next request.

`localhost` is a reserved name that always means the computer you are using. It resolves to the loopback address (`127.0.0.1`, or `::1` in IPv6), so the request never leaves the machine.

A port is a number that picks one listening program on a computer. When your Java server starts on port 7070, it waits for connections there, and `http://localhost:7070/` reaches it from a browser on the same computer. If nothing is listening on the port, the connection fails before any request is sent, so no status code comes back.

## Model

The model: a URL is a set of directions read left to right. Each part narrows the destination: which protocol, which computer, which program on it, which resource, and which options.

## Recap

- A URL has a scheme, a host, an optional port, a path and an optional query; a missing port means 80 for `http` and 443 for `https`.
- A request travels: split the URL, look up the host's IP address, connect to the address and port, send the request, and read the response.
- A response carries a status code, headers and usually a body.
- `localhost` always means the computer you are using; the port picks the program listening on it.

Next topic: HTTP methods, status codes and JSON

## Cheat sheet

Where to act: Find the piece inside the two URLs above, then look at the character just before it.

Next step: The character in front of a piece tells you which part starts there: `://` ends the scheme, a `:` after the host starts the port, the next `/` starts the path, and `?` starts the query.

Sending a parcel to a friend in a large office block: you look up the street address from the company name, walk to the building, ask reception for the right desk, hand over a note saying what you want, and wait for a reply slip that starts with "done" or "no such desk".

The company name, building, desk and note play the roles of host name, IP address, port and request.

Where to act: The step buttons under What happens next?

Next step: For each button, ask what it needs before it can happen. A connection needs an address, and an address needs the host name from the URL.

Optional time: about 3 minutes, in addition to this topic's time.

Take the address `https://api.example.org/v2/users/17?fields=name&fields=email`. Write down its scheme, host, port, path and query on paper. The port is not written in the URL, so decide which port the browser connects to and why.

Success criteria: you name all five parts, and you explain the port from the scheme's default.

|  |  |
| --- | --- |
| Scheme | `http`, `https`: before `://` |
| Host | `localhost`, `shop.example.com` |
| Port | `:7070`; default 80 for `http`, 443 for `https` |
| Path | `/books/42` |
| Query | `?sort=year&page=2` |
| Your own server | `http://localhost:7070/` |

## Sources

Claims on this page were checked against the live official pages below on 16 October 2026 (UTC). Links open outside this lesson.

- MDN: An overview of HTTP: client and server, request and response flow over a connection.
- RFC 3986, URI Generic Syntax, section 3: scheme, authority (host and port), path and query.
- RFC 9110, HTTP Semantics, sections 4.2.1 and 4.2.2: http and https URIs and their default ports.
- MDN glossary: DNS: name lookup from a domain name to an IP address.
- MDN glossary: Port.
- RFC 6761, Special-Use Domain Names, section 6.3: localhost names resolve to the loopback address.

## Static interaction alternatives

### predict

Prediction (practice, not scored): which part of http://localhost:7070/books?sort=year picks the program that receives the request? localhost (wrong: it names the computer, not the program); 7070 (correct: the port picks the program listening on that computer); /books (wrong: the path names a resource inside the program); sort=year (wrong: the query adds options for that resource).

### drag

URL sorting activity. https://shop.example.com:8443/api/orders?status=open&page=2: https is the scheme, shop.example.com is the host, 8443 is the port, /api/orders is the path, status=open&page=2 is the query. http://localhost:7070/books/42: localhost is the host, 7070 is the port, /books/42 is the path; it has no query.

### drag

Ordering activity, in order: 1. Split the URL into scheme, host, port, path and query. 2. Look up the host name to get an IP address. 3. Open a connection to that address and port. 4. Send the request: method, path, query and headers. 5. The program listening on that port handles the request. 6. Read the response: status code, headers and body.

### mcq

Apply question: your server runs on your laptop on port 7070; a classmate opens http://localhost:7070/books on their own laptop, which runs no server. Their browser connects to their own laptop, finds nothing listening on port 7070, and the connection fails. Wrong: they see your book list (localhost on their laptop means their laptop); a name lookup finds your laptop (localhost always means the computer making the request); a 404 Not Found status (no server answers, so no status code comes back). Retry form: on your laptop, http://localhost:8080/books, with nothing listening on 8080, also fails to connect; your server on 7070 never sees it.
