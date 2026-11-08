# Calling the Spring Boot API from FastAPI: service URL, token and timeouts

## Objectives

- Call the Spring Boot API from a FastAPI route with httpx, reading the service base URL and bearer token from settings loaded from environment variables
- Set explicit timeouts and turn a timeout, connection error or non-2xx upstream response into a clear error response from your own API
- Test the outbound call without a running Spring Boot service by using an httpx mock transport

## Teaching

### Configure the call, then plan for failure

Keep the service URL and token out of your code. A settings class reads them from environment variables. Send the token as `Authorization: Bearer ...`, and set timeouts on purpose.

Each failure surfaces differently. A slow upstream raises `httpx.TimeoutException`, and a refused connection raises `httpx.ConnectError`. A non-2xx response raises nothing until you call `raise_for_status()`, which raises `httpx.HTTPStatusError`. Decide what your API says for each: commonly 504 for a timeout and 502 for other upstream failures.

```
class Settings(BaseSettings):
    spring_base_url: str
    spring_token: str

settings = Settings()
client = httpx.Client(
    base_url=settings.spring_base_url,
    headers={"Authorization": f"Bearer {settings.spring_token}"},
    timeout=httpx.Timeout(5.0, connect=2.0),
)
```

### Catch specific failures, most specific first

`httpx.TimeoutException` is a kind of `httpx.TransportError`, so catch it first; the first matching `except` wins. `httpx.TransportError` covers connection failures. `httpx.HTTPStatusError` covers the non-2xx responses that `raise_for_status()` reports.

Raise `HTTPException` with a clear message, and do not echo the upstream body or your token to your own client.

### MockTransport needs no Spring Boot

`httpx.MockTransport(handler)` routes requests to your Python function instead of the network. The handler receives the request, so a test can check the URL and token, then return a fixed `httpx.Response` or raise a timeout.

```
def handler(request):
    assert request.headers["Authorization"] == "Bearer test"
    raise httpx.ReadTimeout("slow", request=request)

client = httpx.Client(
    transport=httpx.MockTransport(handler),
    base_url="http://spring.test",
    headers={"Authorization": "Bearer test"},
)
```

## Recap

- Read the base URL and token from settings loaded from environment variables, and send `Authorization: Bearer token`.
- Set timeouts on purpose. httpx defaults to 5 seconds, and an uncaught timeout becomes a plain 500.
- Catch `TimeoutException` before `TransportError`, and call `raise_for_status()` to surface a non-2xx response. Return clear 504 or 502 errors, without echoing upstream details.
- `httpx.MockTransport` tests the call with no running service.

## Cheat sheet

A waiter asks the kitchen about a dish. If the kitchen goes quiet, the waiter does not stand there all night: after a few minutes they return and tell the guest honestly that the dish is delayed, instead of leaving the table waiting with no word.

Set a waiting limit, then give the caller a clear answer.

Where to act: The two timing lists in the model.

Next step: Set the upstream slower than the timeout and press Call, then reverse them.

Where to act: The ___ line in the try block.

Next step: Assign the response, then call the method that raises on a non-2xx status.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The order of your except clauses.

Next step: Decide which of the transport exceptions is the more specific one and make sure it comes first.

Optional time: about 3 minutes

Success criteria: Write on paper a handler that returns `httpx.Response(404, json={})`, and state which `except` in your function runs, and which status your API returns.

| Failure | httpx raises | Common response |
| --- | --- | --- |
| Slow upstream | `TimeoutException` | 504 |
| Refused connection | `ConnectError` | 502 |
| Non-2xx status | `HTTPStatusError`, after `raise_for_status()` | 502 |

## Sources

First draft, not reviewed. Retrieved 2026-11-04. Checked by the author against these official pages; no independent reviewer has checked this page yet.

- httpx: Timeouts
- httpx: Exceptions
- httpx: Transports
- httpx: Quickstart
- FastAPI: Settings and environment variables
- RFC 6750: Bearer token usage
- RFC 9110: HTTP Semantics

## Static interaction alternatives

### predict

Prediction: a route calls a slow upstream with no explicit timeout or error handling. Decide what the client gets.

### explore

Model: if the upstream is slower than the read timeout, httpx raises ReadTimeout and your API returns 504. If the connection is refused, httpx raises ConnectError and your API returns 502. With a rejected token, upstream 401 becomes HTTPStatusError after raise_for_status, and your API returns 502. Otherwise your API returns 200.

### mcq

Question: decide what httpx does with a 401 response when raise_for_status is not called.

### terminal

Coding task: call the upstream with httpx, check the status, and map a timeout, a transport failure and a non-2xx response to clear errors.

### mcq

Question: decide what a test using httpx.MockTransport proves.
