# Serving pipeline results as an API

## Objectives

- Expose loaded pipeline results through read-only endpoints with a response model that limits the fields returned
- Return 404 with HTTPException for a missing record, and page results with limit and offset query parameters
- Provide the database connection to routes as a dependency, and replace it in tests with a dependency override

## Teaching

### Read-only endpoints with limited fields

Serving results means read-only `GET` routes over tables your pipeline has already loaded. `response_model` limits what leaves, so internal columns stay internal, even if your query returns them.

Page with `limit` and `offset` query parameters, and bound them with `Query`, so one request cannot ask for everything. Pass them to SQL as parameters: `LIMIT %s OFFSET %s`. For one record that does not exist, raise `HTTPException(status_code=404, detail="...")`.

```
@app.get("/results", response_model=list[ResultOut])
def list_results(limit: int = Query(20, ge=1, le=100),
                 offset: int = Query(0, ge=0)):
    ...
```

### Return the record, or raise a 404

A missing record is a normal outcome, and the client should learn it clearly. Raising `HTTPException(status_code=404, detail="...")` stops the function and sends that response. Returning `None` would instead attempt a validation of nothing against your response model.

Fetch with a parameter, not a formatted string. The `db` argument below comes from a dependency, covered next.

```
@app.get("/users/{user_id}", response_model=UserOut)
def read_user(user_id: int, db=Depends(get_db)):
    row = db.fetch_user(user_id)
    if row is None:
        raise HTTPException(status_code=404, detail="User not found")
    return row
```

### Dependencies make routes testable

`Depends(get_db)` tells FastAPI to call `get_db` for each request and pass in the result. A generator dependency can open a connection, `yield` it, and close it after the response.

In tests, `app.dependency_overrides[get_db] = fake_db` replaces it, so no database runs. Clear the overrides after the test, so they cannot leak into the next one.

```
def get_db():
    with psycopg.connect(os.environ["DATABASE_URL"]) as conn:
        yield conn

app.dependency_overrides[get_db] = lambda: FakeDb()
try:
    assert client.get("/results/9").status_code == 404
finally:
    app.dependency_overrides.clear()
```

## Recap

- Serve loaded results through read-only `GET` routes, and let `response_model` limit which fields leave.
- Bound `limit` and `offset` with `Query`, and pass them to SQL as parameters.
- Raise `HTTPException(status_code=404, detail="...")` for a missing record.
- Provide the connection through `Depends(get_db)`, and replace it in tests with `app.dependency_overrides`, clearing it afterwards.

## Cheat sheet

A library shows readers one shelf of the catalogue at a time, and the card they see lists the title and shelf number, never the borrower history printed on the librarian copy.

Readers get a limited page and limited details, however much the back office holds.

Where to act: The Limit and Offset lists.

Next step: Set Limit to 2, then try Offset 0, 2 and 4, and note which ids come back.

Where to act: The first ___ line, above the def.

Next step: Write the GET decorator with its path template, then add the argument that limits the returned fields.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The second ___ line, after the fetch.

Next step: Test whether the fetch found nothing, then stop the function by raising rather than returning.

Optional time: about 3 minutes

Success criteria: Sketch on paper a list route with `limit` and `offset`, including the SQL with two `%s` placeholders in the right order for `LIMIT` and `OFFSET`.

```
@app.get("/results", response_model=list[ResultOut])
def list_results(limit: int = Query(20, ge=1, le=100),
                 offset: int = Query(0, ge=0),
                 db=Depends(get_db)):
    return db.fetch_results(limit, offset)

raise HTTPException(status_code=404, detail="Not found")
app.dependency_overrides[get_db] = lambda: FakeDb()
```

## Sources

First draft, not reviewed. Retrieved 2026-11-04. Checked by the author against these official pages; no independent reviewer has checked this page yet.

- FastAPI: Response model
- FastAPI: Handling errors
- FastAPI: Dependencies
- FastAPI: Testing
- PostgreSQL: SELECT (LIMIT and OFFSET)

## Static interaction alternatives

### predict

Prediction: a route returns three keys but declares a response model with two. Decide what the client receives.

### explore

Console over five result rows with ids 1 to 5. limit and offset select a slice: limit 2, offset 2 returns ids 3 and 4. limit below 1 returns 422 with type greater_than_equal. Without a response model, each row also shows an email field. A missing id returns 404 with the detail Result not found.

### mcq

Question: predict which rows limit 2 and offset 2 return from ids 1 to 5.

### terminal

Coding task: write a GET route with a response model that raises a 404 for a missing record.

### mcq

Question: a dependency override supplies a fake database. Decide what two requests return.
