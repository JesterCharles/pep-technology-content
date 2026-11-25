# FastAPI Services lab: the sign-up results API

## Goal

The nightly data pipeline loads the workshop sign-ups, and its export adds the desk's sign-up id, workshop and status. This lab reads a JSON snapshot of that export (`fixtures/signups.json`). The front desk now wants the sign-ups over HTTP, together with each workshop's details from the Spring Boot workshop catalog (`GET /workshops/{id}`, the API you built in the Spring Boot Basics lab).
In eight linked tasks you add the FastAPI routes, read the catalog's address and token from environment variables, call the catalog with httpx and a timeout, turn its failures into clear answers, and write your own tests.
The one write route, `POST /signups`, records a walk-in at the desk in this app's memory only; the pipeline stays the source of truth.
Everything runs on your own computer: no cloud account, no Docker, no database, and no running Spring Boot service; the tests replace the catalog with an `httpx.MockTransport`.

About 50 minutes in total, setup included (an estimate): setup and Tasks 1-3 fit the day's 20-minute coding-lab block and Tasks 4-8 the 40-minute block, so the end of Task 3 is the place to pause between them. If you pass 60 minutes in total, pause and finish in self-study.

## What you edit

| File | Tasks |
| --- | --- |
| `starter/signups_api/main.py` | 1-3 and 7: the models and routes |
| `starter/signups_api/settings.py` | 4: the settings |
| `starter/signups_api/upstream.py` | 5-6: the call to the workshop catalog |
| `starter/test_api.py` | 8: your own tests |

Leave `tests/`, `fixtures/`, `expected/`, `starter/signups_api/repository.py`, `starter/signups_api/__init__.py` and `starter/requirements.txt` as they are.
Each check is named after its task, and its failure message says what to do next.

## Prerequisites

Python 3.12 or later. Check it in a terminal:

- macOS and Linux: `python3 --version`
- Windows: `py --version`

## Setup (once, needs the internet)

Open a terminal in the lab folder (the folder that holds this README). Create and activate a virtual environment, then install the pinned packages.

macOS and Linux:

```
python3 -m venv .venv
source .venv/bin/activate
```

Windows PowerShell:

```
py -m venv .venv
.venv\Scripts\Activate.ps1
```

Once the environment is active, `python` means its Python on every system. Then:

```
python -m pip install -r starter/requirements.txt
```

This installs FastAPI, httpx, pydantic-settings, uvicorn and pytest at the exact versions the lab was tested with. Starlette's `TestClient` now runs on the `httpx2` package, so that is installed too; your own code uses `httpx`.
Activate the environment again in every new terminal before you run the tests.

## Tasks

Run the one test command from the lab folder after each task:

```
python -m pytest -q
```

Before you start, all eight `test_taskNN_...` checks fail.
Every route gets the sign-ups from a repository through the dependency `repo=Depends(get_repository)`; the repository's methods are `get(signup_id)`, `list_by_session(session, limit, offset)` and `add(data)`. The checks replace `get_repository` with their own data, so a route that does not use `Depends(get_repository)` will not see it.

### Task 1: create a sign-up (`main.py`)

1. Write two Pydantic models: `SignupIn(BaseModel)` with `email`, `name` and `session` as `str` and `workshop_id: int`; `SignupOut(BaseModel)` with `id: int`, `name`, `session` and `status` as `str`, and `workshop_id: int`. `SignupOut` leaves the email out on purpose: answers never repeat personal data.
2. Add `@app.post("/signups", status_code=201, response_model=SignupOut)` above a function that takes `signup: SignupIn` and `repo=Depends(get_repository)` and returns `repo.add(signup.model_dump())`.

FastAPI validates the body against `SignupIn`: a `workshop_id` of `"x"` is answered with `422` before your function runs.

### Task 2: one sign-up, or 404 (`main.py`)

Add `GET /signups/{signup_id}` with `response_model=SignupOut` and the path parameter `signup_id: int`.
Look the sign-up up with `repo.get(signup_id)`. When the result is `None`, `raise HTTPException(status_code=404, detail="Sign-up not found")`; otherwise return it.

### Task 3: one page of a session (`main.py`)

Add `GET /sessions/{session}/signups` with `response_model=list[SignupOut]`, the path parameter `session: str` and two query parameters with limits:
`limit: int = Query(10, ge=1, le=50)` and `offset: int = Query(0, ge=0)`.
Return `repo.list_by_session(session, limit, offset)`. `?limit=2&offset=1` skips the session's first sign-up and returns the next two; `?limit=0` is a `422`. (In the optional run below, `/sessions/testing/signups?limit=1&offset=1` returns Eli Novak, the second of the two testing sign-ups.)

Optional: see the routes run. The page's `fastapi dev main.py` needs the `fastapi[standard]` extra, which this lab does not install, so start the same app with uvicorn instead: `cd starter`, then `python -m uvicorn signups_api.main:app`, open http://127.0.0.1:8000/docs, try the routes, stop it with Ctrl-C and go back with `cd ..` before you run the tests.
The `/docs` page loads its Swagger UI files from the internet; offline, open http://127.0.0.1:8000/openapi.json or call a route such as http://127.0.0.1:8000/signups/1 instead.

This is the end of the 20-minute block.

### Task 4: settings from the environment (`settings.py`)

Give `Settings(BaseSettings)` three fields: `spring_base_url: str`, `spring_token: str` and `spring_timeout_seconds: float = 2.0`.
pydantic-settings fills each field from the environment variable of the same name in any letter case (`SPRING_BASE_URL`, `SPRING_TOKEN`, `SPRING_TIMEOUT_SECONDS`), so the token never appears in your code. The token has no default: a missing `SPRING_TOKEN` raises a `ValidationError`.

### Task 5: an httpx client for the catalog (`upstream.py`)

`make_client(settings, transport=None)` returns `httpx.Client(...)` with:

- `base_url=settings.spring_base_url`;
- `headers={"Authorization": f"Bearer {settings.spring_token}"}`;
- `timeout=httpx.Timeout(settings.spring_timeout_seconds)`, which limits each step of the call (connecting, sending, waiting for each read), so a catalog that stops answering cannot hang your request;
- `transport=transport`, so a test can plug in an `httpx.MockTransport`.

The Spring Boot Basics catalog ignores the token; a deployed catalog checks it.

### Task 6: map the catalog's failures (`upstream.py`)

`fetch_workshop(client, workshop_id)` returns the catalog's JSON body for `GET /workshops/{workshop_id}`, and turns each failure the page lists into an `UpstreamError(status_code, detail)`:

1. Inside `try:`, call `response = client.get(f"/workshops/{workshop_id}")`, then `response.raise_for_status()`, then return `response.json()`.
2. Catch, in this order:

| `except` | Raise |
| --- | --- |
| `httpx.TimeoutException` | `UpstreamError(504, "Workshop service timed out")` |
| `httpx.TransportError` (a refused connection and the other transport failures) | `UpstreamError(502, "Workshop service unavailable")` |
| `httpx.HTTPStatusError as err` (from `raise_for_status()`) | `UpstreamError(502, f"Workshop service returned {err.response.status_code}")` |

`TimeoutException` is a kind of `TransportError`, and the first matching `except` wins, so the timeout must come first. Without `raise_for_status()`, httpx raises nothing for a 404 or 500 answer.

### Task 7: the workshop route (`main.py`)

Add `GET /signups/{signup_id}/workshop` with the parameters `signup_id: int`, `repo=Depends(get_repository)` and `client=Depends(get_workshop_client)`:

1. look up the sign-up and answer 404 as in Task 2 when it is missing;
2. call `fetch_workshop(client, signup["workshop_id"])`; on `UpstreamError as err`, `raise HTTPException(status_code=err.status_code, detail=err.detail)`;
3. return `{"signup_id": signup_id, "workshop": workshop}`.

### Task 8: your own tests (`test_api.py`)

Add two test functions to `starter/test_api.py`:

1. **A route test with an override.** Set `app.dependency_overrides[get_repository] = lambda: SignupRepository([])`, call `client.get("/signups/1")`, and assert the status is 404 and the body is `{"detail": "Sign-up not found"}`. Clear the override at the end with `app.dependency_overrides.clear()` (inside `finally:` so a failing assert still clears it).
2. **An outbound call with a mock transport.** Write a handler that raises `httpx.ReadTimeout("slow", request=request)`, build `httpx.Client(base_url="http://spring.test", transport=httpx.MockTransport(handler))`, and check that `fetch_workshop(...)` raises `UpstreamError` with `status_code` 504 (use `with pytest.raises(UpstreamError) as raised:` and add `import pytest`).

A route-level test of the workshop route that overrides `get_workshop_client` with a mock-transport client is accepted for the second test too.
Run only your file while you work: `python -m pytest -q starter/test_api.py`.
The Task 8 check runs your tests against your code, where they must pass and must put a `get_repository` entry into `app.dependency_overrides`. It then runs them against four broken versions, where they must fail: an app that answers 200 to everything, an app that ignores dependency overrides, a `fetch_workshop` that never raises and one that answers every failure with the wrong status.

## Test

The one test command, run from the lab folder with the virtual environment active:

```
python -m pytest -q
```

When you finish, every test passes: your own tests plus the eight lab checks.

## Expected output

`expected/on-completion.txt` shows a completed run. The number of dots and tests depends on how many tests you wrote, and the time differs on every run.

## Offline note

Only the setup step uses the network, and, if you open it, the optional `/docs` page in your browser. The tests never open a connection: the catalog is an `httpx.MockTransport`, and `TestClient` calls your app in-process. Running the app with uvicorn listens only on your own computer.

## Cleanup

The lab creates `.venv` and `.pytest_cache` in the lab folder and `__pycache__` folders under `starter/` and `tests/` (and `starter/.pytest_cache` if you ran pytest inside `starter`). Stop uvicorn if it is running, deactivate the environment with `deactivate`, then delete them from the lab folder:

- macOS and Linux: `rm -rf .venv .pytest_cache starter/.pytest_cache starter/__pycache__ starter/signups_api/__pycache__ tests/__pycache__`
- Windows PowerShell: `Remove-Item -Recurse -Force .venv, .pytest_cache, starter\.pytest_cache, starter\__pycache__, starter\signups_api\__pycache__, tests\__pycache__ -ErrorAction SilentlyContinue`

## Troubleshooting

- **`command not found: python` or `python3`**: on macOS and Linux create the environment with `python3`; after `source .venv/bin/activate`, `python` works. On Windows use `py`.
- **`No module named fastapi` or `No module named pytest`**: the virtual environment is not active in this terminal. Activate it and run the test command again.
- **Only your own tests ran, or `no tests ran`**: you are in the `starter` folder. Go back to the lab folder with `cd ..` and run the test command there.
- **Every route test fails with `404 Not Found` for the route itself**: check the path and the decorator (`@app.get`, `@app.post`) against the task.
- **A route test gets the real fixture data instead of the test's**: the route reads the repository some other way; take it as `repo=Depends(get_repository)`.
- **`ValidationError` mentioning `spring_base_url` when you run the app and call the workshop route**: set the two variables in that terminal before starting uvicorn (macOS and Linux: `export SPRING_BASE_URL=http://localhost:8080` and `export SPRING_TOKEN=dev-token`; PowerShell: `$env:SPRING_BASE_URL = "http://localhost:8080"` and `$env:SPRING_TOKEN = "dev-token"`). Without a running catalog the route answers 502.
- **PowerShell refuses to run `Activate.ps1`**: run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, then activate again.
- **Port 8000 already in use when you start uvicorn**: stop the other server, or add `--port 8001`.
- **You pass 60 minutes**: pause, note the task you are on, and finish in self-study; every check is still named after its task.
