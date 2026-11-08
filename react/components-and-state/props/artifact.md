# Props

## Objectives

- Pass props from a parent component and read them in a child by destructuring, with a default value for a missing prop
- Pass JSX as children and render it inside a wrapper component
- Explain why a component must not change its own props and name the parent as the place a prop value changes

## Teaching

Components become useful when a parent can configure them. Before any teaching, predict what this code puts on screen.

Props are how a parent passes data to a child. The parent writes them like attributes, and the child receives one object. Destructuring pulls out the names it needs, and `=` sets a default for a missing prop.

```
function Badge({ name, level = 'learner' }) {
  return <p>{name} ({level})</p>;
}

<Badge name="Ada" level="mentor" />
```

String values use quotes, and anything else uses braces, such as `count={3}`.

JSX you nest inside a tag arrives in a special prop called children. That lets you build wrappers that do not need to know what they contain.

```
function Box({ children }) {
  return <div className="box">{children}</div>;
}

<Box><p>Anything here</p></Box>
```

The wrapper decides where the nested content appears by placing `{children}` in its own JSX.

Props are read-only to the component receiving them. A component should give the same output for the same props, and changing a prop object breaks that promise.

When a value must change, the parent changes it and renders the child again with a new value. The child sees a fresh set of props on its next render.

## Recap

A parent passes props like attributes, and a child reads them by destructuring its one parameter, with `=` supplying a default for a missing prop. JSX nested in a tag arrives as `children`, so wrappers can frame anything. Props are read-only to the child: when a value must change, the parent changes it and renders the child with the new value.

## Cheat sheet

Static version: Tag reads text and tone, with tone defaulting to info. App renders Tag with only text set to New. Decide what the span shows, then check your reasoning against Activity 2.

A form letter has blanks for a name and a title. The printer fills in what you hand over, and when no title is given the template says "friend" instead.

Props fill the blanks a component leaves open, and defaults cover missing ones.

Where to act: The name field and the "Pass the level prop" checkbox.

Next step: Ask which part of the output the default can already supply, and which part only the parent can supply.

Without JavaScript the playground cannot run. It lets you edit a Badge tag's name prop and turn its level prop on or off. On paper: write the Badge tag that would output Grace (learner), given level defaults to learner.

Where to act: The parameter list of `Panel`.

Next step: List the two prop names you need inside destructuring braces, and give one of them a default with an equals sign.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The `h3` and the space below it inside the section.

Next step: Both spots need a value from JavaScript, so both need braces around the prop name.

Without JavaScript the editor cannot run. Task: App renders a Panel with title Tip and a paragraph, then a Panel with only a paragraph. On paper, write Panel so that it reads title and children, defaults title to Note, and places both in its section. Compare the result with the Box example.

Static version: a Score child receives points and, on click, assigns points + 1 to its own parameter. Decide what is wrong and who should change the value. Check your reasoning against the recap.

```
function Card({ title = 'Untitled', children }) {
  return (
    <section>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

<Card title="Tip"><p>Text</p></Card>
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- react.dev/learn/passing-props-to-a-component: Passing props to a component; Specifying a default value for a prop; Passing JSX as children; How props change over time

## Static interaction alternatives

### predict

Static version: Tag reads text and tone, with tone defaulting to info. App renders Tag with only text set to New. Decide what the span shows, then check your reasoning against Activity 2.

### explore

Without JavaScript the playground cannot run. It lets you edit a Badge tag's name prop and turn its level prop on or off. On paper: write the Badge tag that would output Grace (learner), given level defaults to learner.

### terminal

Without JavaScript the editor cannot run. Task: App renders a Panel with title Tip and a paragraph, then a Panel with only a paragraph. On paper, write Panel so that it reads title and children, defaults title to Note, and places both in its section. Compare the result with the Box example.

### mcq

Static version: a Score child receives points and, on click, assigns points + 1 to its own parameter. Decide what is wrong and who should change the value. Check your reasoning against the recap.
