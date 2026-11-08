# Keeping sensitive data out of prompts

## Objectives

- Identify the personal and secret fields in a record that must not be sent to an external AI service
- Minimize a record before it goes into a prompt by dropping, masking or pseudonymizing those fields
- Keep secrets and personal data out of the logs and error messages that the enrichment step writes

## Teaching

### Send the minimum the task needs

Personal data identifies a person: names, emails, phone numbers, addresses, card numbers and free text that mentions them. Secrets, such as API keys, tokens and passwords, grant access and must never be sent.

Start from the task. To tag a ticket, the model needs the message, not the sender. Three tools, in order of preference: drop the field; mask it, such as replacing an email inside free text with `[email]`; or pseudonymize it by swapping an internal key for a random token and keeping the mapping on your side, so a result can be joined back without sending the identity.

Follow your organization policy and your provider agreement on what may be sent at all.

### Logs and errors leak too

Minimizing the prompt is not enough if your logs keep the original. Log files are often copied, shared and stored for a long time. Log identifiers and counts, not records, prompts or tokens.

The same goes for exceptions: an error message built from a record copies it into every log and alert it reaches. `logger.exception` includes a traceback, so keep sensitive values out of the message text you raise.

```
logger.info("loaded batch=%s rows=%s", batch_id, row_count)
```

### Check the whole path, not just the prompt

A sensitive value can leave through the prompt, a retry, a debug print, an exception message, a saved reject record or a test fixture. Before shipping an enrichment step, follow one record through every place it is written, and keep rejects in access-controlled storage.

Use made-up data in tests and examples, and keep secrets in environment variables, never in prompts or source.

## Recap

- Identify personal fields and secrets. Free text can contain personal data too.
- Send only what the task needs: drop first, mask what remains, and pseudonymize to join results back, keeping the mapping on your side.
- Secrets are never sent. Check your organization policy and provider agreement for what may be sent at all.
- Keep logs and error messages to references, counts and error types, and follow one record through every place it is written.

## Cheat sheet

When you ask a neighbour to pick up a parcel, you hand over the collection slip. You do not hand over your passport and bank card just in case. They only need what the errand needs.

Share what the task needs, and keep everything else at home.

Where to act: The Field controls in the model.

Next step: Start by dropping every field, then add back only what tagging a ticket really needs.

Where to act: The first ___ line, in the success path.

Next step: List the two values worth keeping for later debugging, then pass them as logging arguments.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The second ___ line, under except.

Next step: Ask what str(e) might contain, then log only the exception class name along with the reference.

Optional time: about 3 minutes

Success criteria: List every place one record from your own pipeline is written, from prompt to logs to reject storage, and mark each with drop, mask, pseudonymize or keep, with a reason.

| Value | Default action |
| --- | --- |
| API key, token, password | Never send; keep in the environment |
| Email, phone, card digits | Drop, or mask in free text |
| Internal customer id | Replace with a random reference |
| Message text | Send only if needed, with personal data masked |

## Sources

First draft, not reviewed. Retrieved 2026-11-04. Checked by the author against these official pages; no independent reviewer has checked this page yet.

- OWASP GenAI: LLM02 Sensitive Information Disclosure
- Claude Code docs: Data usage
- Python docs: Logging HOWTO
- Python docs: logging

## Static interaction alternatives

### predict

Prediction: a whole record is formatted into a prompt. Decide what the external service receives.

### explore

Model: a support record has id, email, card_last4, api_token and message fields. The preview shows the prompt built from your choices and warns about any personal field or secret sent. The message also contains an email address, which masking replaces with a placeholder.

### mcq

Question: choose the minimal prompt that still allows tagging and joining the result back.

### terminal

Coding task: rewrite two log lines so they report only a reference, a category and an error type.

### mcq

Question: a minimized prompt is used, but an error path logs the record. Identify the remaining leak.
