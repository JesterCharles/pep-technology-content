# Calling another service with RestClient: base URL and timeouts

## Objectives

- Call another HTTP service with RestClient built from the auto-configured RestClient.Builder, with the base URL read from configuration
- Set connect and read timeouts and turn a timeout, connection error or non-2xx response into a clear error from your own API
- Test the client without the other service running by using MockRestServiceServer

## Teaching

Your service calls a partner API. The partner stops responding, and there is no timeout configured. Your endpoint keeps calling it.

Boot auto-configures a prototype `RestClient.Builder`. Inject it, and set a base URL from configuration so each environment can point somewhere different.

```
@Service
class InventoryClient {
  private final RestClient http;
  InventoryClient(RestClient.Builder b,
      @Value("${inventory.url}") String url) {
    this.http = b.baseUrl(url).build();
  }
  Stock stock(long id) {
    return http.get().uri("/stock/{id}", id)
        .retrieve().body(Stock.class);
  }
}
```

In current Boot, add `spring-boot-starter-restclient` if your starters do not already bring it.

Set timeouts with global client properties:

```
spring.http.clients.connect-timeout=2s
spring.http.clients.read-timeout=3s
```

A timeout or connection failure surfaces as `ResourceAccessException`. A non-2xx response surfaces as a `RestClientResponseException` subclass, unless you handle it with `onStatus`. Catch these at the client boundary and raise your own exception, so your API answers clearly, such as 502 or 503, without passing on partner details.

You want to test `PartnerClient` with no partner running, with no network and no container engine.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Build from the auto-configured `RestClient.Builder`, with a base URL from configuration.
- Set connect and read timeouts, and translate failures into your own errors.
- Test with `MockRestServiceServer`, with no network.

## Cheat sheet

Where to act: Start with the constructor parameters.

Next step: One parameter is the builder Boot gives you; the other is a value read from a property.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Then fix the assignment.

Next step: The builder has a method for the base URL, and then `build`.

Printed alternative: Inject RestClient.Builder and a @Value for partner.base-url, then build the client with baseUrl. Starter file: `PartnerClient.java`.

Where to act: Change the partner behavior control, and read the mapping.

Next step: Which failures say the partner could not be reached at all?

Printed alternative: Read timeout or connection refused: ResourceAccessException, your API answers 503. Partner 500: HttpServerErrorException, your API answers 502. Partner 404: HttpClientErrorException, your API may answer 404.

- `spring.http.clients.connect-timeout`, `spring.http.clients.read-timeout`
- `ResourceAccessException`: timeout or connection failure.
- `RestClient.Builder` is a prototype bean, so each injection gets its own.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://docs.spring.io/spring-boot/reference/features/external-config.html
- https://docs.spring.io/spring-boot/reference/io/rest-client.html
- https://docs.spring.io/spring-framework/reference/testing/spring-mvc-test-client.html
- https://docs.spring.io/spring-framework/reference/integration/rest-clients.html

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. A call with no timeout can wait a long time, tying up a thread.
- **B. Not this one:** Do not assume a short default. Set timeouts deliberately.
- **C. Not this one:** Nothing restarts it for you.
- **D. Not this one:** That behavior needs explicit code or a library.

### terminal

**Printed alternative:** Inject RestClient.Builder and a @Value for partner.base-url, then build the client with baseUrl. Starter file: `PartnerClient.java`.

### explore

**Printed alternative:** Read timeout or connection refused: ResourceAccessException, your API answers 503. Partner 500: HttpServerErrorException, your API answers 502. Partner 404: HttpClientErrorException, your API may answer 404.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. It answers at the client layer, so your code runs with no network.
- **B. Not this one:** That makes the test slow and flaky, and it depends on a third party.
- **C. Not this one:** Chained stubs are brittle, and they do not prove your request is right.
- **D. Not this one:** They can, and error mapping especially deserves a test.
