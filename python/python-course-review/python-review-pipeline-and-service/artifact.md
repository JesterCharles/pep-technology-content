# Review scenarios: data pipeline and FastAPI service

## Objectives

- Predict how many model replies a generator-fed Pydantic validation step accepts and rejects, and what a second pass over the same generator yields
- Choose the load step that is safe to rerun, leaves no partial batch when it fails, updates a changed record through an upsert and keeps personal data out of logs
- Predict the status codes a FastAPI service returns for an invalid path parameter, a missing record and an upstream call that exceeds its httpx timeout

## Teaching

### Activity 1 of 3: Predict the enrichment check

This page wraps up Data Pipelines and FastAPI Services with new scenarios that mix its topics, all on a support desk pipeline that tags tickets with a model and serves the results. Answer from memory first; every option explains itself after you check.

The model's replies were saved one per line in `replies.jsonl`:

```
{"ticket_id": "12", "label": "billing"}
{"ticket_id": 13.5, "label": "login"}
{"ticket_id": 14}
not json
```

The enrichment step reads the file with a generator and validates each reply in Pydantic's default lax mode:

```
from pydantic import BaseModel, ValidationError


class Tag(BaseModel):
    ticket_id: int
    label: str


def read_lines(path):
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line


replies = read_lines("replies.jsonl")
accepted, rejected = [], []
for text in replies:
    try:
        accepted.append(Tag.model_validate_json(text))
    except ValidationError:
        rejected.append(text)

print(len(accepted), len(rejected), len(list(replies)))
```

### Activity 2 of 3: Choose the safe, rerunnable load

Accepted customer records are loaded into PostgreSQL. The `customers` table has a unique constraint on `email`, and each record holds an email and a plan. The load must:

- be safe to rerun: yesterday's file sometimes arrives twice;
- leave nothing half-loaded when it fails partway;
- update a customer's plan when the file has a new one;
- keep personal data, such as emails, out of the logs.

The load starts from this code. `rows` is a list of `(email, plan)` tuples, `batch_id` names the file, and each option below changes the SQL, the log line or the loop.

```
with psycopg.connect(os.environ["DATABASE_URL"]) as conn:
    with conn.cursor() as cur:
        cur.executemany(SQL, rows)
logger.info("loaded batch=%s rows=%s", batch_id, len(rows))
```

### Activity 3 of 3: Predict the service's status codes

The FastAPI service serves the loaded customers and asks the Spring Boot API for their orders. Its outbound client is configured from settings:

```
spring = httpx.Client(
    base_url=settings.spring_base_url,
    headers={"Authorization": f"Bearer {settings.spring_token}"},
    timeout=httpx.Timeout(5.0, connect=2.0),
)


@app.get("/customers/{customer_id}", response_model=CustomerOut)
def read_customer(customer_id: int, db=Depends(get_db)):
    row = db.fetch_customer(customer_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return row


@app.get("/customers/{customer_id}/orders")
def customer_orders(customer_id: int):
    try:
        response = spring.get(f"/api/customers/{customer_id}/orders")
        response.raise_for_status()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Orders service timed out")
    except httpx.TransportError:
        raise HTTPException(status_code=502, detail="Orders service unavailable")
    except httpx.HTTPStatusError:
        raise HTTPException(status_code=502, detail="Orders service error")
    return response.json()
```

Three requests arrive:

1. `GET /customers/abc`
2. `GET /customers/99`, and customer 99 is not in the database.
3. `GET /customers/7/orders`, while the Spring Boot API takes 30 seconds to answer.

## Recap

- A generator is single-use: once a loop has exhausted it, another pass yields nothing and raises no error. Call the generator function again for a fresh pass.
- Model output is untrusted input. `model_validate_json` raises `ValidationError` for invalid JSON, a missing required field or a lossy conversion; default lax mode still converts safe values such as `"12"` to 12.
- A unique key with `ON CONFLICT ... DO UPDATE SET col = EXCLUDED.col`, inside one connection block, makes a load idempotent and all or nothing. Log batch names and counts, never records.
- FastAPI answers a failed parameter check with 422 before your function runs, and `HTTPException` sends your own status, such as 404. Set an httpx timeout, catch `TimeoutException` before `TransportError`, and return 504 or 502.

## Cheat sheet

Where to act: The `ticket_id` values on the first two lines.

Next step: For each one, decide whether lax mode can turn it into an `int` without losing anything, or must reject it.

Another hint Hint 2 of 2 for Activity 1

Where to act: The last two lines of the file and the final `list(replies)`.

Next step: Ask what `model_validate_json` does with a reply that lacks a required field and with text that is not JSON. Then ask what a generator yields once a `for` loop has already run it to the end.

Where to act: The SQL statement and the logging line in each option.

Next step: For each option, ask what happens to a customer who is already in the table, and what text ends up in the log file.

Another hint Hint 2 of 2 for Activity 2

Where to act: The option that calls `conn.commit()` inside its loop.

Next step: Picture the run failing on the 500th row of 1,000. Decide which rows are already committed and which are rolled back, compared with one `with` block around the whole batch.

Where to act: Request 1 and the type of `customer_id`.

Next step: Decide whether FastAPI can turn `abc` into an `int`, and which status it returns before your function runs when a path parameter fails validation.

Another hint Hint 2 of 2 for Activity 3

Where to act: Request 3, the `timeout` on the client and the order of the `except` clauses.

Next step: Decide what httpx raises when no reply comes within 5 seconds, then walk down the `except` clauses and stop at the first one that matches that exception.

```
def read_lines(path):               # a generator: one pass only
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line

try:
    item = Model.model_validate_json(text)  # lax mode: "12" -> 12; 13.5 rejected
except ValidationError:
    rejected.append(text)

INSERT INTO t (key, col) VALUES (%s, %s)
ON CONFLICT (key) DO UPDATE SET col = EXCLUDED.col;
logger.info("loaded batch=%s rows=%s", batch_id, len(rows))

# 422 failed validation, 404 HTTPException, 504 upstream timeout, 502 other upstream failure
except httpx.TimeoutException: ...    # before TransportError
```

Claims on this page were checked against these official sources, retrieved 2026-11-19.

- Python: Functional Programming HOWTO: generators; an exhausted iterator yields nothing more
- Python: json: json.loads parses one string, as used per line for JSON Lines
- Pydantic: Models: required fields, data conversion and model_validate_json
- Pydantic: Conversion table: lax mode: a valid integer string converts to int; a float must be an exact int
- Pydantic: Validation errors: int_from_float, missing and json_invalid error types
- PostgreSQL: INSERT: ON CONFLICT DO NOTHING and DO UPDATE with EXCLUDED
- psycopg 3: Transactions management: the connection block commits on success and rolls back on an exception
- psycopg 3: Cursor classes: executemany runs one statement for a sequence of parameters
- Python: Logging HOWTO: logging variable data with %s arguments
- FastAPI: Path Parameters: typed path parameters are validated before the function runs
- FastAPI: Handling Errors: HTTPException with status_code and detail; validation errors return 422
- HTTPX: Timeouts: httpx.Timeout with a default and a separate connect timeout
- HTTPX: Exceptions: TimeoutException is a TransportError; HTTPStatusError from raise_for_status

## Static interaction alternatives

### predict

Question: What does the script print?. Option A: 2 2 0 - Not quite. Lax mode accepts a float for an int field only when it has no fractional part. 13.5 would lose its .5, so Pydantic rejects it instead of cutting it to 13. Option B: 1 3 4 - Not quite. The counts are right, but a generator is single-use. The for loop ran it to the end, so list(replies) gets nothing and its length is 0. Call read_lines again for a fresh pass. Option C: 0 4 0 - Not quite. In the default lax mode, the string "12" is a safe conversion to the integer 12, so the first reply is accepted. Option D: 1 3 0 - Correct. Lax mode turns "12" into 12, so only the first reply is accepted. 13.5 has a fractional part, the third reply lacks the required label, and not json is invalid JSON, so model_validate_json raises ValidationError for all three. The loop exhausted the generator, so the last count is 0. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### mcq

Question: Which load meets all four requirements?. Option A: SQL is INSERT INTO customers (email, plan) VALUES (%s, %s) ON CONFLICT (email) DO NOTHING; the rest stays as shown. - Not quite. A rerun adds no duplicates, but DO NOTHING keeps the old row, so a customer who changed plan keeps the old plan. DO UPDATE SET plan = EXCLUDED.plan writes the new value. Option B: SQL is INSERT INTO customers (email, plan) VALUES (%s, %s) ON CONFLICT (email) DO UPDATE SET plan = EXCLUDED.plan; the rest stays as shown. - Correct. The upsert on the unique email inserts new customers and updates the plan of existing ones, so a rerun leaves the same table. The connection block commits the whole batch on a clean exit and rolls it back on an exception. The log line holds only the batch name and a count. Option C: SQL is the DO UPDATE SET plan = EXCLUDED.plan upsert, and the log line becomes logger.info("loaded %s", rows). - Not quite. The load is right, but the log line writes every email into the log file, where it is copied, shared and kept for a long time. Log references and counts, not records. Option D: SQL is the DO UPDATE SET plan = EXCLUDED.plan upsert, but the connection opens without a with block and a loop runs cur.execute(SQL, row) then conn.commit() for each row. - Not quite. A rerun is still safe, but committing after each row means a failure partway leaves the earlier rows loaded and the rest missing. One with block around the batch makes it all or nothing, and executemany avoids a commit per row. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.

### predict

Question: Which status codes do the three requests get, in order?. Option A: 400, 404, 504 - Not quite. FastAPI reports a parameter that fails validation as 422, with a detail list whose loc names the path parameter, not as 400. Option B: 422, 404, 502 - Not quite. TimeoutException is a kind of TransportError, but the first matching except wins, and the timeout clause comes first, so the code is 504. Option C: 422, 404, 504 - Correct. abc is not an int, so validation returns 422 before read_customer runs. A missing row raises the 404 HTTPException. With a 5-second timeout, the slow upstream raises a TimeoutException, which the first except turns into 504. Option D: 422, 404, and the third request waits 30 seconds, then returns 200 - Not quite. The client sets httpx.Timeout(5.0, connect=2.0), so httpx gives up after 5 seconds without a reply and raises a timeout, which this route turns into 504. Before feedback, the learner rates confidence: Guessing, Fairly sure or Certain.
