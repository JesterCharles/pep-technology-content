# Forms and HTML5 validation

## Objectives

- Give each visible user-input control an associated visible label, and give controls without a label an accessible name
- Apply required, type, pattern, min and max so the browser blocks invalid input before submission
- Explain why server-side validation is still required when the browser validates a form

## Teaching

### Start with a guess

A sign-up page has an email field marked `required`. The browser will not send the form while the field is empty. Practice prediction, not scored.

### Every control needs a name

Give each visible control a visible `label`. Link them by setting the label's `for` to the control's `id`, or by wrapping the control inside the label. Clicking the label then focuses the control, and screen readers read the label as its name.

- A `placeholder` is not a label: it disappears as soon as someone types.
- A `for` value that does not match any `id` links nothing.
- A control with no room for visible text, such as an icon-only button, still needs a name: add `aria-label`.

### Let the browser check the rules

- `required`: an empty value is invalid.
- `type`: `email` must look like an address; `number` must be a number.
- `min` and `max`: the lowest and highest value of a number or date. They do nothing on a text field.
- `pattern`: a regular expression the whole value must match, on text-like fields. An empty value is not checked, so add `required` too.

When a form is submitted, the browser checks every control and blocks the submission while one is invalid. This page has no real form, so the practice runs the same browser check, `checkValidity()`, on real fields.

### The server must check again

Browser validation runs on the user's computer, so it is help for honest users, not protection. Anyone can remove an attribute in the browser's developer tools, or send a request to your server without using your page at all.

So validate twice: in the browser for fast, friendly feedback, and on the server for every rule that protects your data. A rule that only the server can know, such as whether an email is already registered, lives on the server alone.

### Apply it to a new field

A booking page needs a number-of-guests field: it must be filled in, and it takes a whole number from 1 to 8. Pick the markup that makes the browser enforce all of that.

## Model

Two layers check a form: the browser first, then the server. The fields and the server log are a practice simulation; the validity results come from this browser.

1. Browser: labels, `required`, `type`, `min`, `max`, `pattern`; can be edited or skipped by the user
2. Server: every rule again, plus rules only it can know

## Recap

- Every visible control gets a visible `label`, linked by `for` and `id` or by wrapping; a placeholder is not a label.
- A control without visible text, such as an icon-only button, gets `aria-label`.
- `required`, `type`, `min`, `max` and `pattern` let the browser block invalid input before submission; `pattern` skips empty values, and `min` and `max` need a number or date type.
- Browser checks can be bypassed, so the server validates every rule again.

Next topic: Accessibility basics

## Cheat sheet

|  |  |
| --- | --- |
| `<label for="qty">` | names the control with `id="qty"` |
| `aria-label="Search"` | name for a control without visible text |
| `required` | empty is invalid |
| `type="email"` | must look like an email address |
| `type="number" min="1" max="6"` | a number from 1 to 6 |
| `pattern="[0-9]{5}"` | exactly five digits; empty skips the check |
| Server | repeats every rule; the browser check is a convenience |

## Sources

Checked against these live sources on 2026-10-13. The practice fields run this browser's own constraint validation.

- WHATWG HTML Living Standard: forms, the label element
- WHATWG HTML Living Standard: the input element (required, pattern, min and max)
- WHATWG HTML Living Standard: form control infrastructure, constraint validation
- MDN: Using HTML form validation and the Constraint Validation API
- W3C: ARIA in HTML (aria-label)

## Static interaction alternatives

### predict

Prediction (practice, not scored): someone removes required from an email field in developer tools and sends the form empty. What reaches the server? Options: a request with an empty email (correct: browser checks run on the user's computer and can be edited away); nothing, because the server reads the required attribute from the page (the server never sees the page's attributes); nothing, because the browser re-checks a hidden copy of the rules (the browser checks only the page as it is now); an error, because HTTP refuses empty values (HTTP carries whatever is sent).

### explore

Steps: 1. Where to look: The four controls described below the task, and the preview in the model. 2. What to do: Choose one fix for each control, then press Apply fixes. 3. What to expect: The preview reports each control's linked labels and name, read from this browser; the feedback names any control that still needs a different fix. 4. How to know it is done: The feedback says every control now has a name and Continue appears. Label fixer: four controls need names. Worked answer: the Full name field has only a placeholder, so add a visible label linked by for and id; the Email field's label says for=mail but the field's id is email, so fix the for value to match; the Subscribe checkbox is already wrapped in its label, so leave it; the search button shows only a magnifier icon and has no room for visible text, so add aria-label=Search. The preview reports each control's linked labels from the browser's labels property.

### explore

Steps: 1. Where to look: The two result tables in the model, one for Tickets and one for Postcode. 2. What to do: Press attribute buttons to switch them on or off, then press Check the rules. 3. What to expect: Each table row shows what this browser's own check says for that value, and whether that matches the rule. 4. How to know it is done: Every row says matches, Check the rules confirms it, and Continue appears. Rule builder: two fields, run through the browser's real checkValidity. Tickets must be filled in and be a whole number from 1 to 6: switch on type=number, required, min=1 and max=6; then the empty value, 0 and 7 are blocked and 3 and 6 are accepted. min and max do nothing without type=number. Postcode must be exactly five digits and filled in: switch on required and pattern=[0-9]{5}, and leave type=email off; then the empty value, 1234, 12a45 and 123456 are blocked and 12345 is accepted.

### drag

Steps: 1. Where to look: The check named above the three buttons; the checks appear one at a time. 2. What to do: Press Browser only, Server only or Both. 3. What to expect: A right choice adds the check to the sorted list and shows the next one; a wrong choice explains why and lets you choose again. 4. How to know it is done: The counter reads 5 of 5 sorted and Continue appears. Where-checks-run sorter. Worked answer: show a message before sending when the email field is empty runs in the browser, and the server checks again; reject a quantity of minus 3 sent with a hand-made request is the server, because that request never passed through the page; refuse an email that is already registered is the server only, because only the server knows its users; mark a field red while the user types is the browser only, because it is a display convenience; reject a postcode that is not five digits is both, because the browser helps honest users and the server protects the data.

### mcq

Apply question: a number-of-guests field must be filled in and take a whole number from 1 to 8. Which markup? Options: input type=number required min=1 max=8 (correct); input type=text required min=1 max=8 (min and max do nothing on a text field); input type=number min=1 max=8 without required (an empty value passes); input type=number required pattern=[1-8] (pattern does not apply to number fields, so 9 would pass).
