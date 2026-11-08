# Reading an OpenAPI spec and exploring it in Swagger UI

## Objectives

- Read an OpenAPI document to find an operation's path, parameters, request body schema and response codes
- Add the springdoc-openapi library to a Boot project and open the generated OpenAPI document and Swagger UI locally
- Send a request from Swagger UI and compare its documented and actual responses

## Teaching

An OpenAPI document contains this fragment:

```
paths:
  /workshops/{id}:
    get:
      parameters:
        - name: id
          in: path
          required: true
      responses:
        "200": { description: found }
        "404": { description: missing }
```

An OpenAPI document is organized by `paths`, then by HTTP method. Each operation can list `parameters` with `in: path` or `in: query`, a `requestBody` and `responses` keyed by status code.

Schemas describe JSON shapes, usually under `components/schemas`, and operations point at them with `$ref`.

```
requestBody:
  content:
    application/json:
      schema:
        $ref: "#/components/schemas/NewWorkshop"
```

The third-party `springdoc-openapi` library generates the document from your controllers and serves Swagger UI. Pin the version its compatibility table lists for your Boot line: 3.1.x to 3.2.x for Spring Boot 4.1. The `-webmvc-ui` starter serves the document and the UI; the `-webmvc-api` starter serves only the document.

```
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>3.2.0</version>
</dependency>
```

The document is at `/v3/api-docs` and Swagger UI at `/swagger-ui.html`, where Try it out and Execute send a real request and show its response beside the documented ones.

Swagger UI documents `POST /workshops` as returning 201. You press Try it out with valid input and see 200.

## Recap

Every activity is answered, but this topic is not complete: 0 of 4 activities earned credit. An activity that settles without passing earns no credit. Use Restart activity on it to try again.

- Read an operation by path, then method, then parameters, body and responses.
- springdoc serves `/v3/api-docs` and Swagger UI locally.
- Try it out, then compare the actual response with the documented one.

## Cheat sheet

Where to act: Use the teaching panel to find each section name.

Next step: Decide whether the question is about input, output or a JSON shape.

Where to act: Start with the dependency list above the Swagger UI panel.

Next step: Match the starter to the web stack the app runs on, and the version to the Boot line in the compatibility table.

Printed alternative: With `springdoc-openapi-starter-webmvc-ui:3.2.0` on the classpath, restart the app and open `/swagger-ui.html`. Expand `GET /workshops/{id}`: its documented responses are 200 (a `Workshop`) and 404. Press Try it out, enter an id that does not exist, such as 999, and press Execute. The server answers 404 with an empty body, which matches the documented 404.

- Schemas: `components/schemas`, referenced with `$ref`.
- Use `curl -i` to see the status line.

## Sources

Status: minimum release, November 2026. The author checked this page and re-fetched the sources below live; no independent education or technology review has been done, so its claims are not marked as verified by a reviewer.

- https://springdoc.org/
- https://swagger.io/specification/
- https://spec.openapis.org/oas/v3.1.1.html
- https://swagger.io/open-source/swagger-ui/

## Static interaction alternatives

### predict

**Why each option is right or wrong**

- **A. Correct answer:** Right. An OpenAPI document describes operations, parameters and responses.
- **B. Not this one:** A spec describes the HTTP contract, not the implementation.
- **C. Not this one:** OpenAPI describes the API. It says nothing about storage.
- **D. Not this one:** A document can drift from behavior, which is why you compare it with actual responses.

### drag

**Answer and reason for each row**

- **Is `min` a required query value?: parameters.** Query and path values are listed in parameters.
- **What JSON does a create call send?: requestBody.** The operation names the body content type and schema there.
- **Can this call answer 404?: responses.** Responses are keyed by status code.
- **Which fields does `NewWorkshop` have?: components/schemas.** The named shape is defined under components.

### mcq

**Why each dependency is right or wrong**

- **`org.springdoc:springdoc-openapi-starter-webmvc-api:3.2.0`:** Not this one: the `-api` starter serves only the OpenAPI document, not Swagger UI.
- **`org.springdoc:springdoc-openapi-starter-webmvc-ui:3.0.0`:** Not this one: the table lists 3.0.x for Boot 4.0.x.
- **`org.springdoc:springdoc-openapi-starter-webflux-ui:3.2.0`:** Not this one: it is for WebFlux apps, not Spring MVC.
- **`org.springdoc:springdoc-openapi-starter-webmvc-ui:3.2.0`:** Correct answer: the MVC starter with Swagger UI, in the Boot 4.1 line.

### terminal

**Printed alternative:** With `springdoc-openapi-starter-webmvc-ui:3.2.0` on the classpath, restart the app and open `/swagger-ui.html`. Expand `GET /workshops/{id}`: its documented responses are 200 (a Workshop) and 404. Press Try it out, enter an id that does not exist, such as 999, and press Execute. The server answers 404 with an empty body, which matches the documented 404.

### drag

**The comparison, row by row**

- **Documented responses: 200 and 404.** The operation in Swagger UI lists both status codes.
- **Actual response for the missing id: 404 with an empty body.** Execute shows the server response code under the request URL.
- **What the comparison shows: the actual response is one the document lists.** The documented 404 and the actual 404 agree, so this part of the contract holds.

### mcq

**Why each option is right or wrong**

- **A. Correct answer:** Right. Checking actual responses against the contract is the reason to try it out.
- **B. Not this one:** A server can return anything. The document does not enforce behavior.
- **C. Not this one:** They differ: 201 says something was created and pairs with `Location`.
- **D. Not this one:** A generated document can still miss detail, for example if status is set at runtime without being documented.
