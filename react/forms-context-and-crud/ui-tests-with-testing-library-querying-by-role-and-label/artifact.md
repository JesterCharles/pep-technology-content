# UI tests with Testing Library: querying by role and label

## Objectives

- Render a component in a test with React Testing Library and find elements with getByRole by accessible name and with getByLabelText
- Choose getBy, queryBy or findBy for an element that is present, absent or appears asynchronously
- Simulate typing and clicking with user-event and assert on what the user can see

## Teaching

Tests that look at a screen the way a person does survive refactors. Predict this one before any teaching.

React Testing Library renders your component into a test DOM, and you query it the way a user finds things: by role and accessible name, or by label.

```
render(<Signup />);
screen.getByRole('button', { name: 'Join' });
screen.getByLabelText('Email');
```

Tests that use these queries keep working when class names or markup change, and they fail if the UI is not accessible. Use Vitest with a jsdom environment to run them outside a browser.

`user-event` simulates what people do: `await user.type(el, 'text')`, `await user.click(el)`. Its calls are async. Assert on what the user can see, not on state.

Choose the query by when the element is there:

- getBy when it is present now; throws if missing.
- queryBy to assert absence; returns `null`.
- findBy when it appears asynchronously; returns a promise, so `await` it.

The variant answers one question: when is it there? Present now: `getBy`. Should be absent: `queryBy`. Appears later: `findBy`, with `await`. A loading indicator that must have gone is a `queryBy`; data that arrives after a fetch is a `findBy`.

## Recap

React Testing Library renders a component, and you find elements as a user does: `getByRole` with an accessible name, and `getByLabelText` for fields. Use `getBy` for something present, `queryBy` for something absent, and `await findBy` for something that appears asynchronously. Simulate actions with `user-event`, awaiting each call, and assert on what the user can see.

## Cheat sheet

Static version: a test wraps getByRole for a Delete button in expect, with .not.toBeInTheDocument. No such button exists. Decide what happens. Compare with Activity 2.

Where to act: The Query field.

Next step: Use the two calls in the teaching example, changing the name and the label to what you see in the fixture.

Without JavaScript the playground cannot run. On paper, write a query that finds a field labeled Email, and one that finds a button named Join. Check the shape against the teaching example.

Where to act: The first two lines of the test.

Next step: Find the field by its label and type into it, then find the button by its role and name, and click it. Remember these are awaited.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: After the click.

Next step: The message arrives later, so use the query that waits. For the button that has gone, use the query that returns null rather than throwing.

Without JavaScript the editor cannot run. Write on paper the steps: find the field by label, type, find the button by role and name, click, wait for the message, and assert that the button has gone. Choose among getBy, queryBy and findBy for each. When scripted, the test runs against a real DOM fixture.

Static version: a heading appears only after a fetch completes. Compare findByRole with await, getByRole, queryByRole and querySelector. Choose using the three timing rules.

```
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();
render(<Signup />);
await user.type(screen.getByLabelText('Email'), 'a@b.c');
await user.click(screen.getByRole('button', { name: 'Join' }));
expect(await screen.findByText('Thanks')).toBeInTheDocument();
expect(screen.queryByRole('button', { name: 'Join' })).toBeNull();
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- registry.npmjs.org/@testing-library/react/latest: version 16.3.3 (npm registry metadata)
- registry.npmjs.org/@testing-library/user-event/latest: version 14.6.7 (npm registry metadata)
- registry.npmjs.org/jsdom/latest: version 30.1.2 (npm registry metadata)
- registry.npmjs.org/vitest/latest: version 5.0.4 and engines (npm registry metadata)
- testing-library.com/docs/queries/about/: Types of Queries; Priority
- testing-library.com/docs/queries/bylabeltext/: API
- testing-library.com/docs/queries/byrole/: API; Options
- testing-library.com/docs/react-testing-library/intro/: The problem; This solution
- testing-library.com/docs/user-event/intro: Writing tests with userEvent
- vitest.dev/guide/: Adding Vitest to Your Project; Writing Tests
- vitest.dev/guide/environment: Test Environment

## Static interaction alternatives

### predict

Static version: a test wraps getByRole for a Delete button in expect, with .not.toBeInTheDocument. No such button exists. Decide what happens. Compare with Activity 2.

### explore

Without JavaScript the playground cannot run. On paper, write a query that finds a field labeled Email, and one that finds a button named Join. Check the shape against the teaching example.

### terminal

Without JavaScript the editor cannot run. Write on paper the steps: find the field by label, type, find the button by role and name, click, wait for the message, and assert that the button has gone. Choose among getBy, queryBy and findBy for each. When scripted, the test runs against a real DOM fixture.

### mcq

Static version: a heading appears only after a fetch completes. Compare findByRole with await, getByRole, queryByRole and querySelector. Choose using the three timing rules.
