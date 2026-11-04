# Custom hooks

## Objectives

- Extract repeated stateful logic, such as loading data, into a custom hook whose name starts with use
- Explain that each component calling a custom hook gets its own independent state
- Decide when a plain function is enough instead of a custom hook, because it calls no Hooks

## Teaching

When two components need the same stateful logic, you can pull it into a function of your own. Predict how this behaves before any teaching.

A custom Hook is a function whose name starts with `use` and which calls other Hooks. It lets you reuse stateful logic instead of repeating it.

```
function useOnlineStatus() {
  const [online, setOnline] = useState(true);
  // ...logic...
  return online;
}
```

The `use` prefix tells React and its lint rules that the Rules of Hooks apply. Each component that calls the Hook gets its own independent state.

To extract a Hook, move the repeated Hook calls and logic into a `use` function, and return what callers need. The shape of the return value is up to you: an array or an object.

```
function useCounter(start) {
  const [n, setN] = useState(start);
  function add() { setN(x => x + 1); }
  return [n, add];
}
```

Each caller can pass different arguments, so the starting value can vary.

Only make a Hook if it calls Hooks. A helper that just transforms its inputs should be a plain function: it can be called anywhere, including in conditions and loops, and needs no `use` prefix. Hooks may only be called at the top level of a component or another Hook.

## Recap

A custom Hook is a function whose name starts with `use` and which calls other Hooks, letting components reuse stateful logic. Each component that calls it gets its own independent state, so a Hook shares logic and not values. If a helper calls no Hooks, keep it a plain function.

## Cheat sheet

Static version: components A and B each call useCounter, which holds its own useState. A is clicked twice. Decide what B shows, then compare with Activity 2.

A franchise hands every branch the same operations manual. Each branch still keeps its own till and stock count, so a sale in one does not touch another.

A custom Hook shares the procedure; each component keeps its own values.

Where to act: The two counters and the "What is shared" list.

Next step: Compare the numbers after clicking. If the value were shared, could they ever differ?

Without JavaScript the lab cannot run. On paper: A and B both call useCounter. A is clicked twice, B once. Write what each shows, and say what the two components share.

Where to act: Above `function Bulb()`.

Next step: Copy the useState and the setter call into a new function, and take the initial value as a parameter.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The first line of each component.

Next step: Replace the repeated state with a call to your Hook, passing the right starting value, and destructure what it returns.

Without JavaScript the editor cannot run. Starter: Bulb and Fan each repeat a useState and a toggle. On paper, write useToggle(initial) to hold that logic and rewrite both components to call it. Compare with the useCounter example.

Static version: compare a price formatter, a data loader using useState and useEffect, a window width tracker using useState and useEffect, and a form field holder using useState. Decide which one calls no Hooks.

```
function useStepper(start = 1) {
  const [step, setStep] = useState(start);
  const next = () => setStep(s => s + 1);
  return { step, next };
}

const { step, next } = useStepper();
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- react.dev/learn/reusing-logic-with-custom-hooks: Custom Hooks: Sharing logic between components; When to use custom Hooks

## Static interaction alternatives

### predict

Static version: components A and B each call useCounter, which holds its own useState. A is clicked twice. Decide what B shows, then compare with Activity 2.

### explore

Without JavaScript the lab cannot run. On paper: A and B both call useCounter. A is clicked twice, B once. Write what each shows, and say what the two components share.

### terminal

Without JavaScript the editor cannot run. Starter: Bulb and Fan each repeat a useState and a toggle. On paper, write useToggle(initial) to hold that logic and rewrite both components to call it. Compare with the useCounter example.

### mcq

Static version: compare a price formatter, a data loader using useState and useEffect, a window width tracker using useState and useEffect, and a form field holder using useState. Decide which one calls no Hooks.
