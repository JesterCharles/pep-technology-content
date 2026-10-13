# Accessibility basics

## Objectives

- Identify missing alternative text, missing labels and keyboard traps in a sample page
- Choose a native HTML element over an ARIA role when both give the same behavior
- Check that every interactive control in a page can be reached and operated with the keyboard alone

## Teaching

### Start with a guess

A team builds a Save control as `<div role="button" onclick="save()">Save</div>`. It looks and clicks like a button. Practice prediction, not scored.

### Three barriers to spot

- Missing alternative text: an image that carries information needs `alt` text saying what it shows. A purely decorative image gets `alt=""`, so screen readers skip it.
- Missing label: a form control with no linked label or other name is announced as just "edit text".
- Keyboard trap: keyboard focus moves into a part of the page and Tab, Shift+Tab or Escape cannot move it out again.

Each one blocks somebody completely: a blind user, a screen reader user, a keyboard user.

### Native element first, ARIA second

ARIA attributes such as `role="button"` change only what assistive technology is told. They add no behavior: the browser does not make the element focusable or respond to keys.

A native `<button>` brings everything at once: it is in the Tab order, Enter and Space press it, and it is announced as a button. So when a native element gives the behavior you need, use it. Keep ARIA for the gaps HTML cannot fill.

### Check with the keyboard alone

- Put the mouse away. Press Tab to move forward and Shift+Tab to move back.
- Every interactive control must be reached, in a sensible order, with a visible focus indicator.
- Every control must work from the keyboard: Enter for links and buttons, Space for buttons and checkboxes.
- Focus must never get stuck: you must be able to Tab out of every part.

A control you can click but never reach with Tab fails, even if it looks fine.

### Apply it to a new control

A new link-like control, written by hand. Pick the change that makes it reachable, operable and announced correctly with the least work.

## Model

Who each barrier blocks, and the keyboard path through a page. The audit and walk-through page is a practice simulation.

- No alt text: a screen reader user hears only "image" or a file name
- No label: a screen reader user hears "edit text" with no purpose
- Keyboard trap: a keyboard-only user cannot reach the rest of the page
- Unreachable control: a keyboard-only user cannot use it at all

Two real Save controls in this page

Save (A: button)

Save (B: div with role="button")

## Recap

- Look for three barriers: an informative image without `alt`, a control without a label, and focus that cannot leave a part of the page.
- Decorative images get `alt=""`.
- ARIA roles describe; they do not add focus or keyboard behavior. Prefer a native element that already behaves correctly.
- Test with the keyboard alone: Tab reaches every control, Enter or Space operates it, focus is visible and never trapped.

Next topic: The box model

## Cheat sheet

|  |  |
| --- | --- |
| `alt="Sales rose 20% in May"` | informative image |
| `alt=""` | decorative image, skipped |
| `<label for>` or `aria-label` | name for a control |
| `<button>` over `role="button"` | focus, keys and role for free |
| `<a href>` over `role="link"` | navigation for free |
| Tab, Shift+Tab, Enter, Space, Escape | the keyboard check |
| WCAG 2.2 | 1.1.1 non-text content, 2.1.1 keyboard, 2.1.2 no keyboard trap, 2.4.7 focus visible, 4.1.2 name, role, value |

## Sources

Checked against these live sources on 2026-10-13. The sample page in the audit and walk-through is fictional; the two Save controls in step 3 are real elements in this page.

- W3C: Web Content Accessibility Guidelines (WCAG) 2.2
- W3C: ARIA in HTML
- W3C WAI: ARIA Authoring Practices Guide, Read Me First

## Static interaction alternatives

### predict

Prediction (practice, not scored): a Save control is a div with role=button and an onclick handler. A keyboard user presses Tab and Enter. Options: Tab skips it and Enter cannot save (correct: a div is not focusable, and role=button adds no keyboard behavior); it works like a real button because of role=button (the role only changes what assistive technology is told); Tab reaches it but Enter does nothing (a div without tabindex is not even reachable); Enter saves twice (nothing is wired to keys at all).

### drag

Audit sorter for a fictional page. Worked answer: img src=sales-chart.png with no alt is missing alternative text, because the chart carries information; img src=divider.png alt=empty is no problem, because a decorative image should be skipped; an input with only a placeholder Search is a missing label; a button with the text Subscribe is no problem, because its text is its name; a date picker where Tab and Escape keep focus inside is a keyboard trap; a link around img alt=Acme Books home is no problem, because the alt text names the link.

### explore

Two real Save controls. Control A is a native button: Tab reaches it and Enter or Space presses it. Control B is a div with role=button and tabindex=0 but no key handler: Tab reaches it, yet Enter and Space fire no click, so nothing saves. The best fix is to replace B with a native button, which brings focus, keys and the button role at once; adding more ARIA does not add behavior.

### explore

Simulated keyboard walk through a fictional page with five controls in source order: a Home link, a Menu control built as a div with only a click handler, a Search field with a label, a Volume slider widget, and a Send button. Pressing Tab moves from Home to Search, skipping Menu, because the div is not focusable. From Search, Tab enters Volume, and further Tab, Shift+Tab and Escape presses keep focus there, so Send is never reached. The failing controls are Menu, unreachable, and Volume, a keyboard trap.

### mcq

Apply question: a span with class link and an onclick that goes to the pricing page. Which change fixes it best? Options: replace it with a href=/pricing (correct: a native link is focusable, opens with Enter and is announced as a link); add role=link (announced as a link but still not focusable and Enter does nothing); add tabindex=0 and role=link (reachable, but Enter still does nothing without a key handler you write yourself); add aria-label=Pricing (gives a name, which it already had from its text, and no behavior).
