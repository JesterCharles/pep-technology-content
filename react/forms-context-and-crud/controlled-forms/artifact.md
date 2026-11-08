# Controlled forms

## Objectives

- Build controlled inputs whose value comes from state and changes through onChange, for a text field, a checkbox and a select
- Handle form submission with onSubmit and event.preventDefault, reading the values from state
- Distinguish a controlled input from an uncontrolled one that uses defaultValue, and fix an input that has a value but no onChange

## Teaching

Forms are where React state meets what the user types. Predict this one before any teaching.

A controlled input gets its value from state and reports changes through `onChange`. Your state is then the single source of truth, and each keystroke goes through it.

```
<input value={name} onChange={e => setName(e.target.value)} />
```

Different controls read different properties: text fields and selects use `e.target.value`, and checkboxes use `checked` and `e.target.checked`.

For submission, put `onSubmit` on the `form` and call `event.preventDefault()`, which stops the browser from reloading the page. Then read the values from state.

```
function handleSubmit(event) {
  event.preventDefault();
  save(name);
}
<form onSubmit={handleSubmit}>...</form>
```

Use a `button` inside the form so that both clicking and pressing Enter submit it.

An uncontrolled input keeps its own value in the DOM. `defaultValue` sets only the starting text, and the browser handles the rest. You read the value later, such as on submission.

The giveaway is the prop name. `value` means controlled: you must also provide `onChange`, or `readOnly` if it should not change. `defaultValue` means uncontrolled.

## Recap

A controlled input takes its value from state and changes through `onChange`, so state is the single source of truth. Text fields and selects use `value` and `e.target.value`; checkboxes use `checked` and `e.target.checked`. Handle submission with `onSubmit` and `event.preventDefault()`, reading values from state. A `value` with no `onChange` looks frozen. `defaultValue` makes an uncontrolled input instead.

## Cheat sheet

Static version: an input has value={name} with name set to Ada and no change handler. Decide what happens when you type, then compare with Activity 2.

A secretary takes dictation: every word you say goes on the official page, and the page is what gets read back. If the secretary stops listening, your words simply do not appear.

State is the official page, and the change handler is the listening.

Where to act: The checkbox above the field.

Next step: Compare the field and the state panel as you type with it off. Then turn it on, clear the field, and type the name.

Without JavaScript the lab cannot run. On paper: an input has value={name}. Describe what happens when you type with no onChange, and with an onChange that calls setName(e.target.value).

Where to act: The checkbox and the select in the JSX.

Next step: Each needs a prop that reads state and an onChange. A checkbox reads a different property from a text field.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Inside `handleSubmit`.

Next step: Call the method that stops the default first. Then build the text from the three state values, using yes or no for the checkbox.

Without JavaScript the editor cannot run. Starter: the name field is controlled, while the checkbox and the select are not, and handleSubmit is empty. On paper, connect each control to its state and write handleSubmit using preventDefault. Check against the examples.

Static version: a field must start with the current city, be editable, and drive a live preview. Compare adding onChange, adding readOnly, switching to defaultValue, and removing value. Choose using the teaching text.

```
<input value={name} onChange={e => setName(e.target.value)} />
<input type="checkbox" checked={ok} onChange={e => setOk(e.target.checked)} />
<select value={t} onChange={e => setT(e.target.value)}>...</select>
<input defaultValue="start" />   // uncontrolled

function handleSubmit(event) { event.preventDefault(); save(name); }
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- react.dev/reference/react-dom/components/form: Usage
- react.dev/reference/react-dom/components/input: Usage (controlling an input with a state variable); Troubleshooting

## Static interaction alternatives

### predict

Static version: an input has value={name} with name set to Ada and no change handler. Decide what happens when you type, then compare with Activity 2.

### explore

Without JavaScript the lab cannot run. On paper: an input has value={name}. Describe what happens when you type with no onChange, and with an onChange that calls setName(e.target.value).

### terminal

Without JavaScript the editor cannot run. Starter: the name field is controlled, while the checkbox and the select are not, and handleSubmit is empty. On paper, connect each control to its state and write handleSubmit using preventDefault. Check against the examples.

### mcq

Static version: a field must start with the current city, be editable, and drive a live preview. Compare adding onChange, adding readOnly, switching to defaultValue, and removing value. Choose using the teaching text.
