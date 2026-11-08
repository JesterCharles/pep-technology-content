# Cleaning and validating records with Pydantic and type hints

## Objectives

- Define a Pydantic model with type-hinted required, optional and defaulted fields for one input record
- Validate raw records, separating accepted rows from rejected rows by catching ValidationError and recording its error details
- Normalize a field with a field validator and predict which raw inputs Pydantic converts and which it rejects

## Teaching

### Type hints become checks

A Pydantic model turns type hints into runtime validation. A field with no default is required. `note: str | None = None` is optional: it may be absent or `None`. `active: bool = True` has a default.

In the default lax mode, Pydantic converts values when the conversion is safe: `"12"` becomes `12`. It rejects lossy or unparseable values with a `ValidationError` naming the field, the error type and a message. Note that an `int` does not become a `str`.

```
class Customer(BaseModel):
    email: str               # required
    age: int | None = None   # optional
    active: bool = True      # default
```

### Catch ValidationError per record

One bad record should not stop a pipeline. Validate inside the loop, catch `ValidationError`, and keep the details: `e.errors()` returns a list of dicts with `loc`, `type` and `msg`.

Catch only `ValidationError`. A bare `except` would also hide your own bugs. Store the raw record with its errors so someone can inspect or replay it later.

```
for record in batch:
    try:
        accepted.append(Customer(**record))
    except ValidationError as err:
        rejected.append((record, err.errors()))
```

### A field validator normalizes one field

`@field_validator("email")` with `@classmethod` runs your function for that field. By default it runs after the type check, so `v` is already a `str`. Return the value you want stored. Raising `ValueError` turns into a `ValidationError` for that field.

```
class Contact(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def normalize(cls, v):
        v = v.strip().lower()
        if "@" not in v:
            raise ValueError("email needs @")
        return v
```

## Recap

- A field with no default is required; `str | None = None` is optional; `active: bool = True` has a default.
- Default lax mode converts safe values (`"12"` to `12`) and rejects lossy ones (`"12.5"`, `12.5`) with a `ValidationError`.
- Catch `ValidationError` per record, and store the raw row with `e.errors()` so one bad row does not stop the load.
- `@field_validator` normalizes a field by returning the value to store, and `ValueError` becomes a `ValidationError`.

## Cheat sheet

A border officer checks each form against a fixed list: a date written with dots is rewritten neatly and waved through, but an unreadable date sends the traveller to a separate desk with a note saying which box was wrong.

Validation repairs what is safe to repair and reports what is not.

Where to act: The Raw qty value list in the model.

Next step: Try each value in turn and note which ones produce an error type rather than a number.

Where to act: The ___ line inside the for loop.

Next step: Start with try:, and in its block build the model from raw using keyword unpacking.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Your except clause.

Next step: Name the exact exception class and bind it, so you can call its errors() method when recording the reject.

Optional time: about 3 minutes

Success criteria: Add a required `price: float` field on paper and list which of `"3.5"`, `"abc"` and `2` would pass, using the rules on this page, then check your list against the error types you have seen.

| Raw value for `qty: int` | Result |
| --- | --- |
| `"12"` | `12` |
| `12.0` | `12` |
| `12.5` | `int_from_float` |
| `"12.5"`, `""` | `int_parsing` |
| `None` | `int_type` |
| key absent | `missing` |

## Sources

First draft, not reviewed. Retrieved 2026-11-04. Checked by the author against these official pages; no independent reviewer has checked this page yet.

- Pydantic: Models
- Pydantic: Validators
- Pydantic: Validation errors
- Python docs: typing

## Static interaction alternatives

### predict

Prediction: a Pydantic model declares qty as int and receives the string "12". Decide what the field holds.

### explore

Results for qty: int, recorded from Pydantic 2. Accepted: "12" gives 12, " 7 " gives 7, 12.0 gives 12. Rejected: 12.5 gives int_from_float, "12.5" and the empty string give int_parsing, None gives int_type, a missing key gives missing.

### mcq

Question: choose which raw value a Pydantic int field rejects.

### terminal

Coding task: validate each raw record, collecting valid models and rejected records with their error details.

### mcq

Question: a field validator strips, lowercases and checks an email. Decide what two calls do.
