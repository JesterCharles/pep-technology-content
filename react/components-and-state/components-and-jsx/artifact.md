# Components and JSX

## Objectives

- Write a function component that returns JSX and render it inside another component
- Convert an HTML snippet to valid JSX: one root element or fragment, closed tags, className and camelCase attributes
- Embed a JavaScript expression in JSX with curly braces to display a computed value

## Teaching

React user interfaces are written in JSX, a syntax that looks like HTML inside JavaScript. Before any teaching, make a prediction. You will revisit it.

A component is a JavaScript function that returns JSX, the markup for one piece of the screen. Its name must start with a capital letter: React treats `<Welcome />` as your component and `<welcome />` as an unknown HTML tag.

You use a component by writing it as a tag inside another component, and you can repeat that tag as often as you like.

```
function Hello() {
  return <p>Hello</p>;
}

function Page() {
  return <Hello />;
}
```

JSX has three rules that plain HTML does not:

- One root. Return a single element. Wrap siblings in a parent or in a fragment, `<>...</>`, which adds no element to the page.
- Close every tag. Void tags need a slash: `<br />`.
- camelCase attributes. JSX becomes JavaScript, so reserved words change: `class` is `className` and `for` is `htmlFor`. Event attributes follow the same pattern: `onclick` is `onClick`.

Curly braces open a window from JSX back into JavaScript. Anything inside them is an expression: it produces a value, and that value appears on screen.

```
const name = 'Ada';
return <p>Hi {name.toUpperCase()}</p>;
```

Braces hold expressions only, such as a variable, a calculation or a function call. Statements such as `if` or `for` do not fit inside them. Text outside braces is literal, so `<p>price</p>` shows the word price.

Everything so far fits one idea: JSX is JavaScript that describes the screen. A component is a function, its tags become function calls, and braces mix in values. That is why the rules are stricter than HTML.

## Recap

A component is a capitalized function that returns JSX, and you use it as a tag inside another component. JSX differs from HTML: one root or fragment, every tag closed, and camelCase attributes such as `className` and `htmlFor`. Curly braces embed a JavaScript expression so what appears on screen follows your data.

## Cheat sheet

Static version: the snippet returns a div with class="banner" next to an img tag with no closing slash. Decide whether it compiles, then compare your answer with the rules in Activity 3 and the recap.

A bakery writes one recipe card for its loaf, then bakes it for every shelf. The card does not change, and nobody rewrites it for each new shelf.

One definition can be used in many places on the screen.

Where to act: Above `function App()` in the editor.

Next step: Copy the shape of `Hello` from the teaching step, then change its name and what it returns.

Another hint Another hint, 2 of 2 for Activity 2

Where to act: Inside the `main` element of `App`, before the `p`.

Next step: A component is used as a capitalized, self-closing tag, so the tag has the same name as the function.

Without JavaScript the editor cannot run. Task: in App.jsx, starting from a function App that returns a main element holding one paragraph, write a function component called Welcome that returns a level-two heading reading Welcome to PEP, and render it inside main above the paragraph. Compare your code with the Hello and Page example: same shape, your own names. Supported subset when scripted: function components, JSX and props.

Where to act: The `return` statement, at the `h2` and the `div`.

Next step: Two siblings cannot sit at the top of a return, so decide what single thing can hold them.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Inside the `div`.

Next step: Go through each attribute and tag in turn and compare it with the three rules. One tag has no end, and two attribute names are HTML words.

Without JavaScript the editor cannot run. Starter: a Signup component returning an h2 next to a div with class="form-row" that holds a label with for="email" and an unclosed input. Rewrite it on paper using the three rules: one root, closed tags, camelCase attributes. Then compare with the rules, not with a finished copy.

Where to act: The paragraph inside the `return`.

Next step: The text `price * qty` needs to stop being literal text. Think about what opens that window into JavaScript.

Without JavaScript the editor cannot run. Starter: a Receipt component with price 12 and qty 3 returning a paragraph with the literal text price * qty. Rewrite the paragraph on paper so the value is computed, and predict what it shows.

Static version: compare four Badge versions: a lowercase function with class; a capitalized function with className and braces around count; one with the word count and no braces; and one with an if statement inside braces. Decide which one follows every rule from Activities 2 to 4.

```
function Card() {            // Capitalized name
  const total = 12 * 3;
  return (
    <>                       {/* one root: a fragment */}
      <h2 className="t">Sum</h2>
      <p>Total: {total}</p>  {/* expression in braces */}
      <br />                 {/* closed tag */}
    </>
  );
}
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- react.dev/learn/javascript-in-jsx-with-curly-braces: Using curly braces: A window into the JavaScript world
- react.dev/learn/writing-markup-with-jsx: Converting HTML to JSX; The Rules of JSX
- react.dev/learn/your-first-component: Components: UI building blocks; Defining a component; Using a component
- react.dev/versions: Latest version: 19.3
- registry.npmjs.org/react-dom/latest: version 19.3.0 (npm registry metadata)
- registry.npmjs.org/react/latest: version 19.3.0 (npm registry metadata)

## Static interaction alternatives

### predict

Static version: the snippet returns a div with class="banner" next to an img tag with no closing slash. Decide whether it compiles, then compare your answer with the rules in Activity 3 and the recap.

### terminal

Without JavaScript the editor cannot run. Task: in App.jsx, starting from a function App that returns a main element holding one paragraph, write a function component called Welcome that returns a level-two heading reading Welcome to PEP, and render it inside main above the paragraph. Compare your code with the Hello and Page example: same shape, your own names. Supported subset when scripted: function components, JSX and props.

### terminal

Without JavaScript the editor cannot run. Starter: a Signup component returning an h2 next to a div with class="form-row" that holds a label with for="email" and an unclosed input. Rewrite it on paper using the three rules: one root, closed tags, camelCase attributes. Then compare with the rules, not with a finished copy.

### terminal

Without JavaScript the editor cannot run. Starter: a Receipt component with price 12 and qty 3 returning a paragraph with the literal text price * qty. Rewrite the paragraph on paper so the value is computed, and predict what it shows.

### mcq

Static version: compare four Badge versions: a lowercase function with class; a capitalized function with className and braces around count; one with the word count and no braces; and one with an if statement inside braces. Decide which one follows every rule from Activities 2 to 4.
