# useState

## Objectives

- Add a state variable with useState and update it from an event handler
- Explain why changing a regular local variable does not update the screen while setting state does
- Predict the rendered value after several setter calls in one event handler, and use an updater function when the next state depends on the previous one

## Teaching

Interfaces need to remember things between clicks. Predict what happens here before any teaching.

A local variable fails for two reasons: changing it does not trigger a render, and on the next render the function runs again and it starts from scratch.

State solves both. React keeps the value between renders, and calling the setter asks for a new render. Each component instance keeps its own private state.

Call `useState` at the top of a component. It returns the current value and a setter, which you name with array destructuring:

```
const [name, setName] = useState('Ada');
```

Then call the setter from an event handler, and React renders again with the new value. Pass handlers as functions: `onClick={handleClick}`, not `onClick={handleClick()}`, which would run during render.

Each render has a snapshot of its state. Inside one event handler, `score` does not change, so `setScore(score + 1)` written three times sets the same value three times.

When the next value depends on the previous one, pass an updater function. React queues it and gives each call the latest value:

```
setCount(c => c + 1);
```

Trace setters as a queue. A plain value replaces the queued result, and an updater function works from the queued result. React processes the queue during the next render, and only then does the screen change.

## Recap

A plain variable neither survives a render nor asks for one; `useState` does both. Call it at the top of a component to get a value and a setter, then call the setter from an event handler. Every render has a snapshot, so repeated `setN(n + 1)` calls use the same `n`. When the next state depends on the previous one, pass an updater such as `setN(x => x + 1)`.

## Cheat sheet

Static version: Counter declares let count = 0, adds 1 in a click handler, and displays count. Decide what shows after three clicks, then compare with Activity 2.

A waiter jots an order on a napkin and bins it at the end of each visit to the table. The kitchen ticket stays on the rail, and handing in a new ticket is what makes the kitchen act.

A variable is the napkin; state is the ticket that persists and triggers work.

Where to act: The lab log after you press Add to state.

Next step: A state update makes the whole function run again. Read the log line about what happens to the local variable when that occurs.

Without JavaScript the lab cannot run. Picture two counters: pressing Add to variable changes a local variable without rendering; pressing Add to state requests a render, which re-runs the function. On paper, trace three variable presses followed by one state press and say what each counter shows.

Where to act: The first line inside `Likes`.

Next step: Declare the state with a value and a setter, starting at 0, in the same shape as the `name` example.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The `onClick` on the button.

Next step: Give it a function that calls the setter with the current value plus one, and show the state value in the text.

Without JavaScript the editor cannot run. Starter: Likes returns a button reading Likes: 0. On paper, add a state variable starting at 0 and a click handler that adds 1 and shows the value. The practice runtime, when scripted, supports function components, useState and click events.

Where to act: The three setter calls inside `addThree`.

Next step: Each call uses the same snapshot value. Change what you pass so that each call receives the latest queued value instead of reading the snapshot.

Without JavaScript the editor cannot run. Starter: addThree calls setScore(score + 1) three times, so one click adds 1. On paper, rewrite the calls so one click adds 3 and explain why it works. The example in the teaching text shows the form.

Static version: from n = 0, a handler calls setN(n + 5), then setN(x => x + 1) twice. On paper, write down the queue and the final value, then compare with the recap.

```
const [n, setN] = useState(0);
<button onClick={() => setN(n + 1)}>{n}</button>
setN(x => x + 1);  // next depends on previous
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- react.dev/learn/state-a-components-memory: When a regular variable isn't enough; Adding a state variable; State is isolated and private
- react.dev/learn/state-as-a-snapshot: Setting state triggers renders; State over time
- react.dev/reference/react/useState: Reference; Usage; Troubleshooting

## Static interaction alternatives

### predict

Static version: Counter declares let count = 0, adds 1 in a click handler, and displays count. Decide what shows after three clicks, then compare with Activity 2.

### explore

Without JavaScript the lab cannot run. Picture two counters: pressing Add to variable changes a local variable without rendering; pressing Add to state requests a render, which re-runs the function. On paper, trace three variable presses followed by one state press and say what each counter shows.

### terminal

Without JavaScript the editor cannot run. Starter: Likes returns a button reading Likes: 0. On paper, add a state variable starting at 0 and a click handler that adds 1 and shows the value. The practice runtime, when scripted, supports function components, useState and click events.

### terminal

Without JavaScript the editor cannot run. Starter: addThree calls setScore(score + 1) three times, so one click adds 1. On paper, rewrite the calls so one click adds 3 and explain why it works. The example in the teaching text shows the form.

### mcq

Static version: from n = 0, a handler calls setN(n + 5), then setN(x => x + 1) twice. On paper, write down the queue and the final value, then compare with the recap.
