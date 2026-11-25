# Final Assessment coding challenge, Python/FastAPI (intermediate, 20 minutes): the refund route

## Goal

The refunds service is a FastAPI app that asks the Spring Boot payments service about a payment before it records a refund.
Write the one route that is missing: `POST /refunds`.

**Time: 20 minutes from the end of setup, reading included.** Do the setup below before the timer starts. The models, settings, payments client, store and checks are provided.

## What you edit

Only `starter/refunds/main.py`: add the route below the provided `get_payments` function.
Leave every other file as it is. Keep the provided names `app`, `get_store` and `get_payments`.

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

Then run the checks once. All 9 fail before you start:

```
python -m pytest -q
```

The checks need no running payments service and no environment variables: each check plugs a stand-in service and a fresh store into your app with dependency overrides.

## What is provided

| Name | Where | What it gives you |
| --- | --- | --- |
| `RefundRequest` | `refunds/models.py` | The request body: `payment_id`, `amount` (a `Decimal` above 0) and `reason` |
| `RefundOut` | `refunds/models.py` | The response: `id`, `payment_id`, `amount`, `status` |
| `get_store()` | `main.py` | Dependency: the `RefundStore` |
| `get_payments()` | `main.py` | Dependency: a `PaymentsClient` |
| `payments.get_payment(payment_id)` | `refunds/payments.py` | Returns the payment as a dict with `"status"`, `"amount"` (already a `Decimal`) and `"customer_email"`, or raises `PaymentNotFound`, `UpstreamTimeout` or `UpstreamError` |
| `store.refunded_total(payment_id)` | `refunds/store.py` | The `Decimal` total already refunded for that payment |
| `store.add(payment_id, amount, reason, customer_email)` | `refunds/store.py` | Records a refund and returns it (it has more fields than `RefundOut`) |

The request's `amount`, the refunded total and the payment's `"amount"` are all `Decimal`, so add and compare them directly. `Decimal` and `float` cannot be mixed in arithmetic.

## The task

Add `POST /refunds` to `main.py`. It takes a `RefundRequest` body and gets the store and the payments client with `Depends(get_store)` and `Depends(get_payments)`. It looks the payment up once with the provided client.

What the route answers:

| Situation | Answer |
| --- | --- |
| `get_payment` raises `PaymentNotFound` | 404, `detail` `payment not found` |
| `get_payment` raises `UpstreamTimeout` | 504, `detail` `payments service timed out` |
| `get_payment` raises `UpstreamError` | 502, `detail` `payments service unavailable` |
| The payment's `"status"` is not `"captured"` | 409, `detail` `payment is not captured`, even when the amount is also too large |
| What was already refunded for this payment plus this `amount` is more than the payment's `"amount"` | 409, `detail` `refund exceeds captured amount` |
| Otherwise | **201** with the stored refund |

- Refunds of one payment may add up to exactly its amount. Refunds of other payments do not count.
- An accepted refund is added to the store with the request's `payment_id`, `amount` and `reason` and the payment's `"customer_email"`.
- The response body holds only the `RefundOut` fields: never the reason or the customer's email. Every check that gets a refund accepted also checks this.
- A refused refund is never stored.
- An invalid body (for example `amount` 0 or a missing `reason`) is answered with 422 before your function runs, so the payments service is not called.

## Test

Run the checks from the assessment folder:

```
python -m pytest -q
```

Each check's name and failure message say what is still wrong. You are scored on the checks you pass.
When every check passes, the output looks like `expected/on-completion.txt`.
Only `check1` insists on status 201; the other checks accept any success status for an accepted refund, but every accepted refund's body must hold only the `RefundOut` fields.

## Troubleshooting

- **PowerShell refuses to run `Activate.ps1`:** run `Set-ExecutionPolicy -Scope Process RemoteSigned` in that terminal and activate again, or run `.venv\Scripts\python -m pytest -q` without activating.
- **`No module named fastapi` or `No module named pytest`:** the virtual environment is not active. Activate it again in this terminal.
- **`No module named refunds` or no checks found:** run the command from the assessment folder (the one that holds this README), not from `starter/`.

## Cleanup

Run `deactivate`, then delete what the run created.

macOS and Linux:

```
rm -rf .venv .pytest_cache starter/refunds/__pycache__ tests/__pycache__
```

Windows PowerShell:

```
Remove-Item -Recurse -Force .venv, .pytest_cache, starter/refunds/__pycache__, tests/__pycache__ -ErrorAction SilentlyContinue
```
