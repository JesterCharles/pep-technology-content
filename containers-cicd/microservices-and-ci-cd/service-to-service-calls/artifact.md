# Service-to-service calls: tokens, timeouts and failed downstream calls

## Objectives

- Forward a bearer token in the Authorization header on a call from one service to another, with the token taken from the incoming request or configuration rather than hard-coded
- Set explicit connect and read timeouts on an outgoing call with HTTPX in the FastAPI service and with Spring's RestClient, and compare them with each client's documented default and with timeouts deliberately disabled when the downstream service hangs
- Turn a failed or timed-out downstream call into a clear error response, such as 502, 503 or 504, instead of a hang or an unhandled exception

## Teaching

`reports` calls `api` to look up a user. `api` accepts the connection, then sends nothing.

```
async with httpx.AsyncClient(timeout=None) as client:
    resp = await client.get(f"{API_URL}/users/me")
```

A bearer token travels in a header: `Authorization: Bearer <token>`. Whoever holds it can use it, so it never goes in source code or logs.

A service can also send its own token, read from configuration:

```
headers = {"Authorization": f"Bearer {settings.api_token}"}
limits = httpx.Timeout(10.0, connect=60.0)
await client.get(url, headers=headers, timeout=limits)
```

`connect` limits opening the connection. `read` limits waiting for data.

Spring's `RestClient` sets timeouts on its request factory:

```
var http = HttpClient.newBuilder()
    .connectTimeout(Duration.ofSeconds(2)).build();
var factory = new JdkClientHttpRequestFactory(http);
factory.setReadTimeout(Duration.ofSeconds(3));
var client = RestClient.builder()
    .baseUrl(reportsUrl).requestFactory(factory).build();
```

HTTPX has a five-second inactivity default that `timeout=None` turns off. A JDK-backed RestClient with nothing set has no read limit. Never rely on a default you have not read.

Turn a failed call into a clear status:

- 502 Bad Gateway: the downstream service sent an invalid response.
- 503 Service Unavailable: you cannot handle this now, and it should pass.
- 504 Gateway Timeout: no timely response arrived.

```
except httpx.TimeoutException:
    raise HTTPException(504, "api did not answer in time")
```

For a refused connection, pick 502 or 503 and use it consistently.

Whenever `api` hangs, requests to `reports` pile up and never finish. The handler:

```
async with httpx.AsyncClient(timeout=None) as client:
    resp = await client.get(url, headers=headers)
    resp.raise_for_status()
```

## Recap

You finished 0 of 5 activities and got 0 right. Any settled activity shows what to review; Restart activity lets you try it again.

- Forward the request’s bearer token or read one from configuration; never hard-code it.
- Set explicit connect and read limits on both HTTPX and RestClient; defaults differ, and off means no limit.
- Turn a failed call into a clear response: 504 for a timeout, 502 for an invalid reply, 503 for temporarily refusing.

## Cheat sheet

Reading without JavaScript: decide first, then read on.

Where to act: Start with the arguments of `client.get`.

Next step: The handler already receives the token as a parameter. Look at what the example passes for headers.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Now look at the timeout argument.

Next step: Build a timeout object as the example does, and give it the connect and read values the task names.

Printed alternative: On the outgoing call, send the caller’s token in the Authorization header and set a 2 second connect limit and a 3 second read limit. The starter is shown in the editor box above. Compare your edit with the requirements under What success looks like; this reading does not include a finished answer.

Where to act: Set Downstream to the hanging option first.

Next step: With that fixed, compare what each Setting does to the waiting time.

Printed alternative: Against a hung service: HTTPX with nothing set stops after about 5 seconds; HTTPX with timeout=None and RestClient with nothing set keep waiting; explicit limits stop after about 3 seconds on either client. A healthy service returns quickly in every case, and a refused connection fails quickly in every case.

Reading without JavaScript: decide first, then read on.

Reading without JavaScript: decide first, then read on.

- HTTPX default: five seconds of inactivity. `timeout=None` disables it.
- RestClient: limits live on the request factory.
- Never log the `Authorization` header.

## Sources

Status: minimum release, checked by the page author on 2026-11-08. Sources were fetched live on 2026-11-04 and the author checked the page against them; no independent education or technology review was performed.

- RFC 6750: Authorization Request Header Field (Bearer)
- RFC 9110: 502, 503 and 504 status codes
- HTTPX Timeouts: five-second default, connect and read, timeout=None
- Spring Framework REST Clients: RestClient and its request factories
- JdkClientHttpRequestFactory: setReadTimeout
- HttpClient.Builder: connectTimeout
- Circuit Breaker pattern

## Static interaction alternatives

### predict

What does the caller of reports see? Each option is explained after the question in this reading.

### terminal

On the outgoing call, send the caller’s token in the Authorization header and set a 2 second connect limit and a 3 second read limit. The starter is shown in the editor box above. Compare your edit with the requirements under What success looks like; this reading does not include a finished answer.

### explore

Against a hung service: HTTPX with nothing set stops after about 5 seconds; HTTPX with timeout=None and RestClient with nothing set keep waiting; explicit limits stop after about 3 seconds on either client. A healthy service returns quickly in every case, and a refused connection fails quickly in every case.

### drag

Which status should reports return? Each row and its explanation follow in this reading.

### mcq

What should change? Each option is explained after the question in this reading.
