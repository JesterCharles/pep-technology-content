# FastAPI routes

## Objectives

- Define GET and POST routes with path and query parameters and a Pydantic request body, and run the app locally
- Predict the status code and error body FastAPI returns when a path parameter, query parameter or request body fails validation
- Test routes with FastAPI's TestClient and pytest

## Teaching

### Signatures declare the interface

A decorator binds a method and path to a function. A name in the path is a path parameter. Any other simple parameter is a query parameter, required unless it has a default. A parameter typed as a Pydantic model is the JSON request body.

FastAPI validates all of them before your function runs. A failure returns 422 with a `detail` list, where `loc` says where the problem is, such as `["query", "limit"]`. Run locally with `fastapi dev main.py`, then browse the docs at `/docs`.

```
class OrderIn(BaseModel):
    sku: str
    qty: int

@app.get("/orders/{order_id}")
def read_order(order_id: int, limit: int = 10): ...

@app.post("/orders", status_code=201)
def create_order(order: OrderIn): ...
```

### Signature first, then logic

Write the decorator, then the signature; FastAPI builds the validation from them. Set the success code on the decorator with `status_code=201` when a route creates something.

This example has a path parameter, an optional query parameter and a body on two routes. Yours use different names.

```
@app.get("/users/{user_id}")
def read_user(user_id: int, active: bool = True):
    return {"id": user_id, "active": active}

@app.post("/users", status_code=201)
def create_user(user: UserIn):
    return user
```

### TestClient calls the app with no running server

`TestClient(app)` lets pytest send requests straight to your app, with no server or network. Assert on `status_code` and `json()`, and test failures as well as successes. A test for a 422 proves your interface rejects bad input.

```
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_rejects_non_integer_id():
    response = client.get("/items/abc")
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["path", "item_id"]
```

## Recap

- A path name is a path parameter, a simple parameter is a query parameter, and a Pydantic-typed parameter is the JSON body.
- FastAPI validates before your function runs. A failure returns 422, and `detail[].loc` says where.
- Run locally with `fastapi dev main.py`, and browse `/docs`.
- `TestClient(app)` lets pytest test routes with no server. Assert on failures as well as successes.

## Cheat sheet

A hotel receptionist checks the booking form before calling any staff. A form with letters in the room-number box goes straight back to the guest with a note about that box, and housekeeping is never disturbed.

Checks happen at the front desk, so the staff behind it only see valid requests.

Where to act: The loc value in the response body.

Next step: Send the request with limit=x and read the first item in loc.

Where to act: The first ___ line, above the return.

Next step: Write the decorator with the path template, then the def line with both parameters and their types.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The second ___ line.

Next step: Set the success code on the decorator, and type the parameter with the model so FastAPI reads the body.

Optional time: about 3 minutes

Success criteria: Write on paper a test that POSTs a valid body and asserts 201 and the returned name, then a second that POSTs an empty body and asserts the `loc` you expect.

```
@app.get("/things/{thing_id}")
def read(thing_id: int, limit: int = 10): ...

@app.post("/things", status_code=201)
def create(thing: ThingIn): ...

client = TestClient(app)
assert client.get("/things/abc").status_code == 422
```

## Sources

First draft, not reviewed. Retrieved 2026-11-04. Checked by the author against these official pages; no independent reviewer has checked this page yet.

- FastAPI: First steps
- FastAPI: Path parameters
- FastAPI: Query parameters
- FastAPI: Request body
- FastAPI: Testing

## Static interaction alternatives

### predict

Prediction: a route declares an int path parameter and receives a non-numeric value. Decide what the client gets.

### explore

Request console with responses recorded from FastAPI. GET /orders/7?limit=3 returns 200. GET /orders/abc returns 422 with loc path, order_id. GET /orders/7?limit=x returns 422 with loc query, limit. POST /orders with a body of sku A and qty "2" returns 201 with qty 2. POST /orders with no qty returns 422 with loc body, qty. DELETE /orders/7 returns 405.

### mcq

Question: interpret a 422 response that names the request body and a missing field.

### terminal

Coding task: write a GET route with a path and query parameter, and a POST route with a body and a 201 status.

### mcq

Question: a TestClient test posts a numeric string and asserts the response field equals that string. Decide what pytest reports.
