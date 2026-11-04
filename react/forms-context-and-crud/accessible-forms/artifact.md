# Accessible forms

## Objectives

- Give every form control a programmatically associated visible label, using htmlFor and id or a wrapping label
- Indicate required fields and connect each error message to its field with aria-describedby and aria-invalid
- Make form-level errors or success perceivable to screen-reader users by moving focus or using a live region

## Teaching

A form works only if everyone can tell what each field is for. Predict this common case before any teaching.

Every control needs a visible label that is programmatically associated with it. Then screen readers announce it, and clicking the label focuses the field. There are two ways:

```
<label htmlFor="email">Email</label>
<input id="email" />

<label>Email <input /></label>
```

`htmlFor` must match the input's `id` exactly. In JSX, the attribute is `htmlFor`, not `for`.

Show required fields in the visible label text, and add the `required` attribute. When a field has an error, connect the message to its field:

- `aria-invalid="true"` marks the field as being in error.
- `aria-describedby` points at the id of the message, so it is announced with the field.

Add both only when there is an error, because `aria-describedby` must point at an element that exists.

After submitting, a screen reader user must learn the outcome. Text that silently appears elsewhere goes unnoticed. Two reliable patterns:

- Live region: keep an element with `role="status"` (or `role="alert"` for urgent problems) on the page, and put the message in it. It gets announced without moving focus.
- Move focus: send keyboard focus to an error summary, using a ref and `tabIndex={-1}`.

Use one, and make sure the message itself is clear.

Three connections make a form accessible: label to field, error to field, and result to the user. Check each one whenever you build or review a form, and test with the keyboard as well.

## Recap

Every control needs a visible label, associated through `htmlFor` and `id` or by wrapping. Placeholders are hints, not labels. Mark required fields in the visible text and with `required`, and connect each error to its field with `aria-invalid` and `aria-describedby`, added only when an error exists. For a form-level result, use a live region or move focus to a summary, so people using screen readers hear it.

## Cheat sheet

Static version: an email input has a placeholder and no label. Think about what remains visible after typing and what a screen reader announces. Compare with Activity 2.

Where to act: The Markup list and the "Associated label" line.

Next step: Try each option and read the line. Look at what the id and htmlFor say in the mismatched one.

Without JavaScript the inspector cannot run. On paper, for a placeholder only, a label whose htmlFor does not match the input id, a matching pair, and a wrapping label, say whether the field has an associated label.

Where to act: The `label` and the `input`.

Next step: Give the input an id and point the label at it, using the JSX attribute name. Add the required attribute too.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The attributes of the input, and the error paragraph.

Next step: Give the paragraph an id. Each aria attribute needs a value only when error has text, so a conditional expression fits, and undefined leaves the attribute out.

Without JavaScript the editor cannot run. Starter: a label with no association, an input, and an always-present error paragraph. On paper, add htmlFor and id, required, and error wiring that appears only when error has text. Check against the list in the teaching text.

Where to act: The Pattern list and the Screen reader hears panel.

Next step: Submit once with each. A pattern passes when the panel reports the words of the error rather than silence.

Without JavaScript the lab cannot run. On paper, say what a screen reader user hears after a failed submit when you add a paragraph, when you update an existing live region, and when you move focus to an error summary.

Static version: compare four password fields: a full set of label, invalid and description links; an unassociated label; a placeholder instead of a label; and a description link with a mismatched id. Choose using the three connections.

```
<label htmlFor="phone">Phone (required)</label>
<input id="phone" required
  aria-invalid={problem ? 'true' : undefined}
  aria-describedby={problem ? 'phone-help' : undefined} />
{problem && <p id="phone-help">{problem}</p>}
<div role="status">{message}</div>
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- html.spec.whatwg.org/multipage/forms.html: The label element
- www.w3.org/TR/WCAG22/: 1.3.1 Info and Relationships; 3.3.1 Error Identification; 3.3.2 Labels or Instructions; 4.1.3 Status Messages
- www.w3.org/WAI/tutorials/forms/labels/: Associating labels explicitly; Associating labels implicitly
- www.w3.org/WAI/tutorials/forms/notifications/: Overall feedback; In-line feedback
- www.w3.org/WAI/tutorials/forms/validation/: Validating required input

## Static interaction alternatives

### predict

Static version: an email input has a placeholder and no label. Think about what remains visible after typing and what a screen reader announces. Compare with Activity 2.

### explore

Without JavaScript the inspector cannot run. On paper, for a placeholder only, a label whose htmlFor does not match the input id, a matching pair, and a wrapping label, say whether the field has an associated label.

### terminal

Without JavaScript the editor cannot run. Starter: a label with no association, an input, and an always-present error paragraph. On paper, add htmlFor and id, required, and error wiring that appears only when error has text. Check against the list in the teaching text.

### explore

Without JavaScript the lab cannot run. On paper, say what a screen reader user hears after a failed submit when you add a paragraph, when you update an existing live region, and when you move focus to an error summary.

### mcq

Static version: compare four password fields: a full set of label, invalid and description links; an unassociated label; a placeholder instead of a label; and a description link with a mismatched id. Choose using the three connections.
