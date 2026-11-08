# Conditional display

## Objectives

- Render different JSX with if statements, the conditional (? :) operator and logical &&
- Predict when a && condition renders 0 on screen and rewrite the condition to avoid it
- Return null from a component to render nothing

## Teaching

Screens change with data: a badge appears only when there are unread messages. Predict this case before any teaching.

Because JSX is JavaScript, you choose what to show with ordinary logic.

- if before the return: `if (count === 0) return <p>Empty</p>;`
- Ternary in JSX: `{count > 0 ? <Badge /> : <p>None</p>}`
- Logical && in JSX: `{isNew && <Badge />}`

React renders nothing for `false`, `null` and `undefined`, but it does render numbers. That one fact causes the stray zero.

The fix is to make the left side of `&&` a real boolean: `{count > 0 && <Badge />}`. A comparison gives `true` or `false`, and React renders neither.

To render nothing at all from a component, return null:

```
function Warning({ show }) {
  if (!show) return null;
  return <p>Careful</p>;
}
```

The component still ran; it just produced no output.

One model covers all of this: a component returns a description, and JavaScript chooses it. `if` picks before the return, `? :` picks one of two inside JSX, `&&` adds something or nothing, and `null` means no output at all.

## Recap

Choose JSX with ordinary JavaScript: `if` before the return, a ternary for one of two, and `&&` for something or nothing. React ignores `false`, `null` and `undefined` but renders numbers, so `count && ...` can show `0`; write `count > 0 && ...` instead. A component that returns `null` renders nothing.

## Cheat sheet

Static version: Inbox returns a div containing count && a paragraph. count is 0. Decide what shows on screen, then compare with Activity 2 and the recap.

Where to act: The Decrease and Increase buttons.

Next step: Try each value and compare the && panel with what the same data shows in the other two panels.

Without JavaScript the stepper cannot run. On paper, work out each form for count 0, 1 and 2, given the if and ternary show Empty when count is 0, and the && form is count && a message. Note where the && form differs.

Where to act: The expression inside the div.

Next step: Decide what test on count produces a true or false value rather than a number.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Before the return statement.

Next step: The hidden case applies to the entire output, so handle it before any JSX is returned.

Without JavaScript the editor cannot run. Starter: Inbox returns a div containing count && a paragraph. On paper, change it so count 0 shows nothing, count 2 shows the paragraph, and hidden makes the whole component output nothing. Check against the Warning example.

Static version: an empty cart must show a message and a full cart must show a Checkout button. Compare a ternary, a bare length with &&, an if inside braces, and a comparison with &&. Decide which meets both requirements.

```
if (!user) return <Login />;          // early return
{ok ? <Done /> : <Retry />}           // one of two
{count > 0 && <Badge />}              // boolean left side
if (!show) return null;               // render nothing
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- react.dev/learn/conditional-rendering: Conditionally returning JSX; Conditionally including JSX

## Static interaction alternatives

### predict

Static version: Inbox returns a div containing count && a paragraph. count is 0. Decide what shows on screen, then compare with Activity 2 and the recap.

### slider

Without JavaScript the stepper cannot run. On paper, work out each form for count 0, 1 and 2, given the if and ternary show Empty when count is 0, and the && form is count && a message. Note where the && form differs.

### terminal

Without JavaScript the editor cannot run. Starter: Inbox returns a div containing count && a paragraph. On paper, change it so count 0 shows nothing, count 2 shows the paragraph, and hidden makes the whole component output nothing. Check against the Warning example.

### mcq

Static version: an empty cart must show a message and a full cart must show a Checkout button. Compare a ternary, a bare length with &&, an if inside braces, and a comparison with &&. Decide which meets both requirements.
