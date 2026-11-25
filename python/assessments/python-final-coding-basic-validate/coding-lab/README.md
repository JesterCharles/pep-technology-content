# Final Assessment coding challenge, Python (basic, 10 minutes): accepted and rejected records

## Goal

The payments team reads a nightly batch of card transactions.
Write one function, `validate(records)`, that checks each raw record with the provided Pydantic model and splits the batch into accepted transactions and rejected records.

**Time: 10 minutes from the end of setup, reading included.** Do the setup below before the timer starts. The model, the file reader and the checks are provided.

## What you edit

Only `validate` in `starter/settlement/extract.py`.
Leave every other file as it is, and keep the function's name and parameter.

## Setup (before the timer, needs the internet once)

You need Python 3.12 (`python3.12 --version`, or `py -3.12 --version` on Windows).
Open a terminal in the assessment folder (the folder that holds this README):

macOS and Linux:

```
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -r starter/requirements.txt
```

Windows PowerShell:

```
py -3.12 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r starter/requirements.txt
```

Then run the checks once. All 7 fail before you start:

```
python -m pytest -q
```

## The task

`validate(records)` takes any iterable of raw dicts and returns a tuple `(accepted, rejected)`:

- `accepted` is a list with a `Transaction` (from `settlement.models`) for every record that validates, in input order.
- `rejected` is a list with one dict for every record that raises `ValidationError`, in input order:
  `{"txn_id": <the record's txn_id, or None if it has none>, "fields": <the field names in the error>}`.
  `fields` is a list that names each failed field once, sorted A to Z (use `sorted`), so the same record always gives the same list.
  Each rejected dict has exactly these two keys: no raw record and no error details.

Rules:

- A bad record must not stop the batch: validate every record.
- Records that share a `txn_id` are separate records: keep every one.
- Loop over `records` only once. It may be a generator, such as the provided `read_jsonl(path)`, which can be read only once.
- Use `raw.get("txn_id")`, because some records have no `txn_id`.
- `exc.errors()` is a list of errors. Each error has a `"loc"` tuple whose first item is the field name.

Example: `{"txn_id": "T7", "account": "ACCT-7", "amount": "0", "currency": "US"}` is rejected as `{"txn_id": "T7", "fields": ["amount", "currency"]}`.

## Test

Run the checks from the assessment folder:

```
python -m pytest -q
```

Each check's name and failure message say what is still wrong. You are scored on the checks you pass.
When every check passes, the output looks like `expected/on-completion.txt`.
`check7` runs the whole `fixtures/transactions.jsonl` batch through `read_jsonl` and your `validate`.

## Troubleshooting

- **PowerShell refuses to run `Activate.ps1`:** run `Set-ExecutionPolicy -Scope Process RemoteSigned` in that terminal and activate again, or run `.venv\Scripts\python -m pytest -q` without activating.
- **`No module named pytest` or `No module named pydantic`:** the virtual environment is not active. Activate it again in this terminal.
- **`No matching distribution found for pydantic-core`:** the virtual environment was made with another Python. Delete `.venv` and create it again with Python 3.12.

## Cleanup

Run `deactivate`, then delete what the run created.

macOS and Linux:

```
rm -rf .venv .pytest_cache starter/settlement/__pycache__ tests/__pycache__
```

Windows PowerShell:

```
Remove-Item -Recurse -Force .venv, .pytest_cache, starter/settlement/__pycache__, tests/__pycache__ -ErrorAction SilentlyContinue
```
