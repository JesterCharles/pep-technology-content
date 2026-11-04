# Lifting state up

## Objectives

- Move state that two components need into their closest common parent and pass it down as props
- Pass an event handler prop so a child can ask the parent to change its state
- Keep a single source of truth by removing state that can be computed from props or other state

## Teaching

Sometimes two components must stay in step with each other. Predict what this code does before any teaching.

When two components must stay in sync, lift the state up: remove it from both, keep it in their closest common parent, and pass it down as props.

The parent becomes the single owner. Each child receives what to show, and calls a function prop to ask for a change:

```
<Panel isActive={active === 0} onShow={() => setActive(0)} />
```

A child cannot change its parent's state directly. The parent passes an event handler prop, and the child calls it.

```
function Row({ selected, onSelect }) {
  return <button onClick={onSelect}>{selected ? 'Chosen' : 'Choose'}</button>;
}
```

Name these props `onSomething` by convention. Remember to pass the function itself to `onClick`, so it runs on click rather than during render.

Keep a single source of truth for each piece of data. If a value can be computed from props or other state, do not store it. Calculate it during render instead.

Storing a copy means two values can disagree, and you must remember to update both. Calculating means it can never be out of date.

## Recap

When components must stay in sync, move the state to their closest common parent and pass it down as props. The parent also passes an event handler prop, so a child can ask it to change the state. Keep a single source of truth: if a value can be computed from props or other state, calculate it during render instead of storing a copy.

## Cheat sheet

Static version: two Panel components each hold their own open state. Show is clicked on each in turn. Decide what is on screen, then compare with Activity 2.

Two siblings each keep their own note of who has the car, and the notes soon disagree. A single note on the fridge, kept by a parent, ends the arguments.

One owner above both means one answer they can both read.

Where to act: The Design list.

Next step: Switching design resets the lab. Try opening each panel under both, and look at the Owner line to see who holds the value.

Without JavaScript the lab cannot run. On paper, trace opening Hours and then Returns under two designs: each panel holding its own flag, and a parent holding one active index. Say what shows at the end of each.

Where to act: The parameters and first line of `Panel`.

Next step: Remove the state, and read two new props instead, one telling it whether it is open, and one to call for a change.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The `Accordion` return.

Next step: Add one state value to Accordion, and for each Panel work out a true or false from it and a function that sets it to that panel's index.

Without JavaScript the editor cannot run. Starter: Panel holds its own open state, and Accordion has no state. On paper, move the state into Accordion as an active index starting at 0, and pass isActive and onShow to each Panel. Compare with the Row example.

Static version: a cart stores both items and a total in state. Compare computing the total during render, syncing with an Effect, moving it to another component, and merging the two. Choose using the single source of truth rule.

```
function Parent() {
  const [active, setActive] = useState(0);
  return <Row selected={active === 1} onSelect={() => setActive(1)} />;
}

const total = items.reduce((sum, i) => sum + i.price, 0); // computed
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- react.dev/learn/sharing-state-between-components: Lifting state up by example; A single source of truth for each state

## Static interaction alternatives

### predict

Static version: two Panel components each hold their own open state. Show is clicked on each in turn. Decide what is on screen, then compare with Activity 2.

### explore

Without JavaScript the lab cannot run. On paper, trace opening Hours and then Returns under two designs: each panel holding its own flag, and a parent holding one active index. Say what shows at the end of each.

### terminal

Without JavaScript the editor cannot run. Starter: Panel holds its own open state, and Accordion has no state. On paper, move the state into Accordion as an active index starting at 0, and pass isActive and onShow to each Panel. Compare with the Row example.

### mcq

Static version: a cart stores both items and a total in state. Compare computing the total during render, syncing with an Effect, moving it to another component, and merging the two. Choose using the single source of truth rule.
