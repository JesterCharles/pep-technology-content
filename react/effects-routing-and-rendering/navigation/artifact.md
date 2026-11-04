# Navigation

## Objectives

- Link between routes with Link and NavLink instead of a plain anchor, and explain what a full page reload loses
- Navigate from code after an event with useNavigate, including replacing the current history entry

## Teaching

Routes need links. Before any teaching, predict what this link does to a value held in React state.

Use `<Link to="/cart">` for navigation inside your app. It changes the URL and renders the new route without a full page load, so React state, scroll helpers and anything in memory survive.

`<NavLink>` is a Link that knows if it is active. Its `className` can be a function: `({ isActive }) => isActive ? 'on' : ''`. Use it for menus. Keep plain `<a>` for leaving your app.

`useNavigate()` gives you a function for navigating from code, for example after an event such as a successful save.

```
const go = useNavigate();
go('/reports');                       // pushes an entry
go('/reports', { replace: true });    // replaces this entry
```

Push adds to the history stack, so Back returns to the current page. Replace swaps the current entry, so Back skips it. Use replace when the current page should not be returned to, such as a login form after signing in.

Call `useNavigate()` at the top of the component, and call the returned function inside an event handler or Effect, not while rendering. Rendering must stay free of side effects, and navigation is one.

Use a `Link` when the user is simply moving somewhere. Use `navigate` when navigation is the result of some logic, such as a save finishing.

Sort navigation by purpose. Moving within the app: Link. Menus that show the current page: NavLink. Moving because of logic: `useNavigate`, with `replace` when the current page should not be returned to. Leaving the app: a plain anchor.

## Recap

Use `Link` for movement inside your app: it changes the URL without a full page load, so state survives. `NavLink` adds active styling for menus. A plain anchor reloads the document and loses in-memory state, so keep it for leaving your app. `useNavigate` navigates from code after an event, and `{ replace: true }` swaps the current history entry so Back skips it.

## Cheat sheet

Static version: the root component holds a cart count of 3 in state. A plain anchor to /checkout is clicked. Decide what happens to the count, then compare with Activity 2.

Walking to another room at home keeps the kettle on and the music playing. Leaving and re-entering the building means everything has been switched off and restarted.

An in-app link moves rooms; a full page load re-enters the building.

Where to act: The Document loads line and the Cart line.

Next step: Press Add to cart before each link kind. A jump in document loads tells you which one restarted the app.

Without JavaScript the mini browser cannot run. On paper: with a cart of 2, say what happens to the cart, the document load count, and the menu highlight for a plain anchor, a Link, and a NavLink.

Where to act: The two sign-in buttons and the History stack line.

Next step: Press one sign-in button, watch which entries the stack holds, then think about where Back would land.

Without JavaScript the lab cannot run. On paper, start with the stack / then /login. Write the stack after a push to /dashboard, and after a replace. For each, say where Back lands.

Where to act: The first line inside `SaveButton`.

Next step: Call the Hook to get the function, as in the teaching step of Activity 3.

Another hint Another hint, 2 of 2 for Activity 4

Where to act: Inside `save`.

Next step: Call that function with the path and the options object that means replace.

Without JavaScript the editor cannot run. Starter: SaveButton has an empty save handler. On paper, add the Hook call and a call inside save that goes to /items and replaces the current entry. Compare with the snippet in Activity 3.

Static version: a side menu must highlight the current page. Compare NavLink with isActive, plain anchors, buttons calling navigate, and Links with active state kept by hand. Choose using the four purposes in the teaching text.

```
<Link to="/cart">Cart</Link>
<NavLink to="/orders" className={({ isActive }) => isActive ? 'on' : ''}>Orders</NavLink>

const go = useNavigate();
go('/reports');                       // push an entry
go('/reports', { replace: true });    // replace this entry
go(-1);                               // back one entry
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- reactrouter.com/api/hooks/useNavigate: Summary; Signature; Examples
- reactrouter.com/start/declarative/navigating: NavLink; Link; useNavigate

## Static interaction alternatives

### predict

Static version: the root component holds a cart count of 3 in state. A plain anchor to /checkout is clicked. Decide what happens to the count, then compare with Activity 2.

### explore

Without JavaScript the mini browser cannot run. On paper: with a cart of 2, say what happens to the cart, the document load count, and the menu highlight for a plain anchor, a Link, and a NavLink.

### explore

Without JavaScript the lab cannot run. On paper, start with the stack / then /login. Write the stack after a push to /dashboard, and after a replace. For each, say where Back lands.

### terminal

Without JavaScript the editor cannot run. Starter: SaveButton has an empty save handler. On paper, add the Hook call and a call inside save that goes to /items and replaces the current entry. Compare with the snippet in Activity 3.

### mcq

Static version: a side menu must highlight the current page. Compare NavLink with isActive, plain anchors, buttons calling navigate, and Links with active state kept by hand. Choose using the four purposes in the teaching text.
