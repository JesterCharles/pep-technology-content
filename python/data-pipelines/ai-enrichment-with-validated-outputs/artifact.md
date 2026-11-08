# AI enrichment with validated outputs

## Objectives

- Explain why model output is untrusted input, and design an enrichment step that requests JSON matching a declared schema
- Validate each model response against a Pydantic model and send invalid or failed responses to a retry or reject path instead of loading them
- Test the enrichment step offline with a fake model client that returns fixed valid and invalid responses

## Teaching

### Model output is untrusted input

Treat a model response like data from a stranger: it can be malformed, incomplete, or well-formed and wrong. Declare the shape you want as a Pydantic model and ask for JSON matching `Enrichment.model_json_schema()`.

Provider structured-output features make the shape more reliable, but documented cases such as refusals and cut-off output can still miss the schema. No schema can tell whether a value is true. So validate every response, and give failures a bounded retry or a reject path.

### A bounded loop around validation

The enrichment step calls the model, validates the text, and returns on the first valid result. A `for` loop with `range` bounds the attempts. `model_validate_json` raises `ValidationError` for invalid JSON as well as for a wrong shape, so one `except` covers both.

After the loop, return `None` so the caller can send the record to the reject path. A non-validation exception, such as a network failure, should get its own handling rather than being treated as a bad answer.

### A fake client makes tests offline and repeatable

Do not call a real model in tests: it costs money, needs a network and gives different answers each time. Pass the client as a parameter, and in tests use a small fake that returns fixed responses in order.

```
class FakeClient:
    def __init__(self, responses):
        self.responses = iter(responses)

    def complete(self, prompt):
        return next(self.responses)

def test_retry_then_valid():
    client = FakeClient(["not json", GOOD_JSON])
    assert enrich_one(client, "tag this") is not None
```

## Recap

- Model output is untrusted input. Declare the shape with a Pydantic model and ask for JSON matching its schema.
- Validate every response with `model_validate_json`. Bound the retries, then send failures to a reject path with the error.
- A schema checks shape, not truth, so review or sample the results for meaning.
- Pass the client in as a parameter so a fake with fixed responses can test the step offline.

## Cheat sheet

A translator returns your letter with a neat form attached. You still check the form is complete before filing it, and if it stays incomplete after one more request, you put the letter in a tray for a person rather than filing a blank.

Check before filing, retry a limited number of times, then set aside for a person.

Where to act: The Fake response list in the model.

Next step: Run each response once and note which ones reach load, then look closely at the one that loads with a poor value.

Where to act: The ___ line inside the for loop.

Next step: Get the text from the client first, then open a try block for the validation.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Your except clause.

Next step: Decide which single exception class means a bad answer, and what the loop should do next, which needs no statement beyond a pass-through.

Optional time: about 3 minutes

Success criteria: Write on paper a second test proving an always-invalid client makes `enrich_one` return `None`, and say how many responses that fake needs for `attempts=2`.

```
schema = Enrichment.model_json_schema()   # ask for this shape
Enrichment.model_validate_json(text)      # raises ValidationError
# Bound the attempts; on the limit, record a reject and load nothing.
```

## Sources

First draft, not reviewed. Retrieved 2026-11-04. Checked by the author against these official pages; no independent reviewer has checked this page yet.

- Pydantic: JSON Schema
- Pydantic: Models
- Claude docs: Structured outputs
- OpenAI docs: Structured outputs
- pytest: Get started

## Static interaction alternatives

### predict

Prediction: a model response with a non-numeric confidence value is validated with Pydantic. Decide what happens.

### explore

Model with fixed fake responses. Valid JSON loads. Invalid JSON, a missing field and a wrong type fail validation and are retried up to the limit, then rejected. A category not on the allowed list is rejected when the field is a Literal. A well-formed but wrong category passes validation, showing that a schema cannot prove truth.

### mcq

Question: choose what the pipeline does when a response still fails validation after the retry limit.

### terminal

Coding task: write a bounded retry loop that validates each model response and returns None after the limit.

### mcq

Question: decide what passing an offline test with a fake model client proves.
