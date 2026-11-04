# What makes a component re-render

## Objectives

- Identify a state update and a parent re-render as two causes of a re-render taught so far
- Explain that rendering calls the component function and that React then commits only the differences to the DOM
- Predict which components re-render after a parent's state changes, and describe memo as a performance optimisation rather than a correctness fix

## Teaching

Knowing when your component function runs makes bugs and performance much easier to reason about. Predict this first.

So far, two things cause a re-render:

- A state update in the component.
- Its parent re-rendering, which by default re-renders every child below it.

A render flows down the tree from the component that updated. Parents and siblings of that component are not affected.

Rendering means React calling your component function to find out what the screen should look like. It is just computing.

Committing comes next: React compares the new output with the previous output, then changes only the DOM nodes that differ. So many functions can run while very few DOM nodes change, and a re-render alone does not mean the page was rebuilt.

`memo` wraps a component so React can skip its render when its props are unchanged. It is a performance optimisation only, for when a slow component re-renders often with the same props.

Correct code must work without it. React may still re-render a memoized component, and its own state or context changes still render it. A bug that depends on render count should be fixed, not hidden with `memo`.

## Recap

A state update and a parent re-render are two causes of a re-render taught so far, and a render flows down from where the update happened. Rendering just calls your function; React then commits only the DOM differences. `memo` can skip a render when props are unchanged, but it is a performance optimisation and not a correctness fix: your code must still work if extra renders happen.

## Cheat sheet

Static version: Parent holds state and renders Child with no props. Parent's button updates the state. Decide whether Child's function runs, then compare with Activity 2.

A manager announces a change. Everyone who reports to that manager re-reads their instructions, while peers in other departments carry on.

A render flows down from the update, and not up or sideways.

Where to act: The render counts after pressing Set state in Counter.

Next step: See which counts change and which stay put. Then find where each of those components sits in the tree.

Without JavaScript the tree cannot run. On paper: App contains Header and Counter, and Counter contains Display. List which components render after a state update in Counter, and after a state update in App.

Where to act: The "Last update" panel.

Next step: It lists the function calls and the DOM changes separately. Use the one that says DOM.

Without JavaScript the lab cannot run. On paper, a list has five items and only the Count item shows changing data. After one update, say how many item functions run, and how many DOM nodes change. Explain the difference in one sentence.

Static version: a teammate uses memo to prevent a bug that appears on re-render. Compare fixing the bug, trusting memo as a guarantee, wrapping everything, and using a global variable. Choose using the teaching text.

```
// Trigger: setState in the component, or parent renders
// Render: React calls your function
// Commit: React changes only the DOM that differs

const Slow = memo(function Slow({ value }) {
  return <Chart value={value} />;
});
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- react.dev/learn/render-and-commit: Step 1: Trigger a render; Step 2: React renders your components; Step 3: React commits changes to the DOM
- react.dev/learn/state-as-a-snapshot: Setting state triggers renders
- react.dev/reference/react/memo: Reference; Usage

## Static interaction alternatives

### predict

Static version: Parent holds state and renders Child with no props. Parent's button updates the state. Decide whether Child's function runs, then compare with Activity 2.

### explore

Without JavaScript the tree cannot run. On paper: App contains Header and Counter, and Counter contains Display. List which components render after a state update in Counter, and after a state update in App.

### explore

Without JavaScript the lab cannot run. On paper, a list has five items and only the Count item shows changing data. After one update, say how many item functions run, and how many DOM nodes change. Explain the difference in one sentence.

### mcq

Static version: a teammate uses memo to prevent a bug that appears on re-render. Compare fixing the bug, trusting memo as a guarantee, wrapping everything, and using a global variable. Choose using the teaching text.
