# Routing and route parameters

## Objectives

- Configure client-side routes with React Router, including a layout route that renders child routes through Outlet
- Define a dynamic segment such as /items/:id and read its value with useParams
- Add a catch-all route that renders a not-found page for unknown paths

## Teaching

A single-page app shows different screens at different URLs without loading a new page from the server. Predict this case before any teaching.

React Router maps URLs to components. In its declarative mode, wrap the app in `<BrowserRouter>` and describe routes with `<Routes>` and `<Route>`.

- Layout routes render shared UI and show the child through `<Outlet />`.
- Dynamic segments such as `items/:id` match any value. `useParams()` reads it, and the value is always a string.
- A `path="*"` catch-all matches anything unmatched, which is how you show a not-found page.

Nest child routes inside a parent route. The parent's component must contain `<Outlet />`, or its children have nowhere to appear:

```
<Route path="/" element={<Shell />}>
  <Route index element={<Start />} />
  <Route path="users/:name" element={<User />} />
</Route>
```

An `index` route is the default child at the parent's own URL. A child's path is relative, so it has no leading slash. Read the value in the child: `const { name } = useParams();`

Two details cause most route bugs. A parent with children must render an `Outlet`, or the children have nowhere to appear. And params are strings, so `id === 42` is false when `id` is `"42"`; convert first with `Number(id)`.

## Recap

React Router maps URLs to components with `Routes` and `Route`. A layout route shows shared UI and renders its child through `Outlet`. A dynamic segment such as `items/:id` is read with `useParams`, and its value is always a string. A `path="*"` route catches anything unmatched, which is how you render a not-found page.

## Cheat sheet

Static version: a route with path / renders Layout, and a nested route products/:sku renders Product. The URL is /products/42. Decide what renders and where, then compare with Activity 2.

Where to act: The URL field.

Next step: Try /items/42 first and read the rendered boxes. Then make up a path that the route table cannot match.

Without JavaScript the matcher cannot run. On paper, given the table of /, /items, /items/:id and *, say what renders at /, /items/42 and /nope, and write the value of useParams() at /items/42.

Where to act: The `Layout` component.

Next step: It needs one new element after the nav, the same one named in the teaching text.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: Inside the parent `Route`, and in `Item`.

Next step: Two routes are missing; copy the shape of the items route. Then use the Hook in Item to get the value out of the URL.

Without JavaScript the editor cannot run. Starter: Layout has no Outlet, the routes cover only the index and items, and Item shows a placeholder. On paper, add what is missing so /, /items/42 and /nope all render correctly. Compare with the Shell example. Only Routes, Route, Outlet and useParams are supported when scripted.

Static version: Product reads id from useParams and compares it with === to numeric product ids, then shows Not found. Decide why, using what you know about the type of a URL param.

```
import { BrowserRouter, Routes, Route, Outlet, useParams } from 'react-router';

<Route path="/" element={<Frame />}>     // parent renders <Outlet />
  <Route index element={<Start />} />
  <Route path="people/:slug" element={<Person />} />
  <Route path="*" element={<Missing />} />
</Route>

const { slug } = useParams();  // always a string
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- reactrouter.com/api/hooks/useParams: Summary; Examples
- reactrouter.com/start/declarative/routing: Configuring Routes; Nested Routes; Layout Routes; Dynamic Segments; Splats
- reactrouter.com/start/declarative/url-values: Route Params
- reactrouter.com/start/modes: Declarative; API + Mode Availability Table
- registry.npmjs.org/react-router/latest: version 8.4.0 (npm registry metadata)

## Static interaction alternatives

### predict

Static version: a route with path / renders Layout, and a nested route products/:sku renders Product. The URL is /products/42. Decide what renders and where, then compare with Activity 2.

### explore

Without JavaScript the matcher cannot run. On paper, given the table of /, /items, /items/:id and *, say what renders at /, /items/42 and /nope, and write the value of useParams() at /items/42.

### terminal

Without JavaScript the editor cannot run. Starter: Layout has no Outlet, the routes cover only the index and items, and Item shows a placeholder. On paper, add what is missing so /, /items/42 and /nope all render correctly. Compare with the Shell example. Only Routes, Route, Outlet and useParams are supported when scripted.

### mcq

Static version: Product reads id from useParams and compares it with === to numeric product ids, then shows Not found. Decide why, using what you know about the type of a URL param.
