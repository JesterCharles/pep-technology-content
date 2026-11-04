# Sharing state with Context

## Objectives

- Create a context, provide a value near the top of the tree, and read it with useContext in a deeply nested component
- Combine context with state so components that read the context re-render when the provided value changes, a further re-render trigger beyond state updates and parent renders
- Choose between passing props and using context for a given piece of data, such as the signed-in user or a theme

## Teaching

Some data is needed by many components at many depths. Predict what this reader gets before any teaching.

Passing props through many layers is called prop drilling. Context lets a component read a value from far above, without the middle layers passing it.

```
const UserContext = createContext(null);

<UserContext value={user}>
  <Page />
</UserContext>

const user = useContext(UserContext);
```

`useContext` reads from the nearest provider above. Combine it with state to change the value, as a provider's value can come from `useState`. Code written before React 19 uses `<UserContext.Provider>` for the same thing.

Three steps:

1. Create it outside any component: `const Ctx = createContext(defaultValue);` 2. Provide a value around a subtree: `<Ctx value={x}>`, typically near the top. 3. Read it with `useContext(Ctx)` at any depth.

To change the value over time, keep it in state in the component that renders the provider, and pass that state as `value`. When it changes, readers re-render.

Start with props: they make data flow visible. Reach for context when many components at different depths need the same thing, and passing it through layers that do not use it hurts. Good fits include the signed-in user, the theme and the locale.

Avoid context for data used by one or two nearby components. Sometimes passing JSX as `children` removes the drilling as well.

## Recap

Context lets a component read a value from a provider above it without layers passing it along. Create it with `createContext`, provide it by rendering `<Ctx value={...}>`, and read it with `useContext`, which uses the nearest provider or else the default. Combine it with state to change the value; a changed context value re-renders the components that read it. Use props for nearby data, and context for widely needed data such as the signed-in user or theme.

## Cheat sheet

Static version: createContext is given en. Label reads it with useContext, with no provider above. Decide what it shows, then compare with Activity 2.

Passing a note along a row of desks makes every person handle it. A public announcement reaches anyone who is listening, and the people in between do nothing.

Props pass hand to hand; context reaches those who choose to listen.

Where to act: The tree after you press Change theme under Context.

Next step: Compare which boxes mention the theme, and read the render notes on each.

Without JavaScript the lab cannot run. On paper, draw App, Page, Toolbar and Button. Mark which components handle a theme value with prop drilling and with context. Then name what a changed context value re-renders.

Where to act: Above the components, and the return of `App`.

Next step: Create the context with a default, then wrap what App returns in the context as a provider, passing the state as value.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: `ThemeLabel` and `Toolbar`.

Next step: ThemeLabel gets the value from the Hook instead of a prop. Toolbar goes back to having no props at all.

Without JavaScript the editor cannot run. Starter: App passes theme through Toolbar to ThemeLabel. On paper, write the three context steps and remove the prop. Compare with the UserContext example.

Static version: a price goes from a parent to its immediate child, and someone proposes context. Compare a prop, context, a global variable, and the URL. Choose using the teaching text.

```
const LocaleContext = createContext('en');

function Root() {
  const [locale, setLocale] = useState('en');
  return (
    <LocaleContext value={locale}>
      <Page />
    </LocaleContext>
  );
}

const locale = useContext(LocaleContext);
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- react.dev/learn/passing-data-deeply-with-context: Context: an alternative to passing props; Before you use context; Use cases for context
- react.dev/reference/react/useContext: Reference; Usage

## Static interaction alternatives

### predict

Static version: createContext is given en. Label reads it with useContext, with no provider above. Decide what it shows, then compare with Activity 2.

### explore

Without JavaScript the lab cannot run. On paper, draw App, Page, Toolbar and Button. Mark which components handle a theme value with prop drilling and with context. Then name what a changed context value re-renders.

### terminal

Without JavaScript the editor cannot run. Starter: App passes theme through Toolbar to ThemeLabel. On paper, write the three context steps and remove the prop. Compare with the UserContext example.

### mcq

Static version: a price goes from a parent to its immediate child, and someone proposes context. Compare a prop, context, a global variable, and the URL. Choose using the teaching text.
