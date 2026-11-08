# Python review

## Objectives

- Retrieve and apply Python syntax, collections, mutability, exceptions and pytest on mixed practice tasks without new material
- Trace a small extract, validate, load and serve flow end to end and locate where a described defect (aliasing, missing validation or missing timeout) would surface

## Teaching

### Cues from earlier pages

Catch the narrowest exception you can handle, and let the rest propagate. In pytest, a plain `assert` reports both sides when it fails, and `pytest.raises` checks that an exception is raised inside its block.

### One flow, five stages

The course built one flow: extract with generators, validate with Pydantic, load with upserts, serve with FastAPI, and call Spring Boot with httpx. A defect often surfaces later than where it was written, so ask which stage should have caught it.

### Cue: one object, many names

A default value is evaluated once, when `def` runs, and a list default is then shared across calls. The usual fix defaults to `None` and creates a new list inside the function.

## Recap

- Passing a list shares one object. A mutable default is shared across calls too.
- An exception caught inside a function never reaches a caller or `pytest.raises`.
- A record moves through extract, validate, load, serve, and an API may call upstream. Locate a defect by the stage that should have caught it.
- Missing validation belongs to validate, and a missing timeout belongs to the outbound call, even if each first surfaces elsewhere.

## Cheat sheet

Where to act: The Trace output in the model.

Next step: Start from the missing validation defect, and look at the first stage where bad data could have been refused.

Where to act: The def line of add_record.

Next step: Choose a default that is not a mutable object.

Another hint Another hint, 2 of 2 for Activity 4

Where to act: The first line inside add_record.

Next step: Test for that default, and only then make a new list.

Optional time: about 5 minutes

Success criteria: Pick the page where you missed a question, and rewrite its core rule from memory in two sentences before checking it.

| Symptom | Likely stage | Revisit |
| --- | --- | --- |
| Rows change together | Extract or shared object | Mutability and aliasing |
| Bad values reach a table | Validate | Cleaning and validating records |
| Duplicates after a rerun | Load | Staging table upserts |
| Empty second pass | Extract | Generators |
| Requests hang or give 500 | Call upstream | Calling Spring Boot |

## Sources

First draft, not reviewed. Retrieved 2026-11-04. Checked by the author against these official pages; no independent reviewer has checked this page yet.

- Python FAQ: Why are default values shared between objects?
- Python reference: Function definitions
- pytest: Assertions
- Python tutorial: Errors and exceptions
- FastAPI: Response model
- httpx: Timeouts

## Static interaction alternatives

### predict

Retrieval: a function appends to a list parameter and returns it. Decide what the caller sees.

### mcq

Retrieval: a function catches ValueError and a test expects it to be raised. Decide what pytest reports.

### explore

Model of the flow extract, validate, load, serve, call. A shared list reused across records belongs to extract or validate code and shows as rows changing together. A missing validation lets a bad value load, and it surfaces at serve as a response-model error or wrong data. A missing timeout belongs to the outbound call and surfaces as requests failing with a 500 or hanging.

### mcq

Trace: bad values reach a staging table and cause errors at the serving stage. Decide which stage should have refused them.

### terminal

Coding task: fix a function whose list default is shared across calls.
