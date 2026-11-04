# Project structure

## Objectives

- Scaffold a React project with Vite and state the role of index.html, src/main.jsx, src/App.jsx and package.json
- Move components into their own modules with default and named exports and import them correctly
- Distinguish npm run dev from npm run build by what each one produces

## Teaching

Real React projects split components across files. Predict what happens in this two-file case before any teaching.

`npm create vite@latest my-app -- --template react` scaffolds a project. Four files matter first:

- `index.html` is the page the browser loads, with an empty `<div id="root">`.
- `src/main.jsx` is the entry script: it finds that div and renders your app into it.
- `src/App.jsx` is the root component, where your own UI starts.
- `package.json` lists the dependencies and the npm scripts, such as `dev` and `build`.

A file can have one default export and many named exports, and the import must match.

```
export default function Page() {}   // default
export function Footer() {}         // named

import Page from './Page.jsx';      // no braces
import { Footer } from './Page.jsx'; // braces, same name
```

A default import can use any local name. A named import must use the exported name. Use `./` for your own files.

`npm run dev` starts a development server for coding, with hot reload: it serves your source live and writes no production files. `npm run build` creates optimized production files in `dist/`, which is what you deploy.

So dev is for working, and build is for shipping. Neither command deploys anything by itself.

Everything ties together at start-up: the browser loads `index.html`, its script runs `src/main.jsx`, that renders `App` into the root div, and `App` uses components imported from other modules. If the screen is blank, follow that chain from the top.

## Recap

A Vite project starts from `index.html`, whose script runs `src/main.jsx`, which renders `src/App.jsx` into the root div; `package.json` lists dependencies and scripts. Import form must match export form: default takes no braces and any local name; named takes braces and the exported name. `npm run dev` serves your source while you work, and `npm run build` writes production files to `dist/`.

## Cheat sheet

Static version: Header.jsx uses export function Header. App.jsx writes import Header from './Header.jsx' without braces. Decide what happens, then check against Activity 3.

Where to act: The list next to `src/main.jsx`.

Next step: Trace what happens at start-up: the browser loads one page, and something then has to connect React to the empty div in it.

Without JavaScript the explorer cannot run. On paper, match index.html, src/main.jsx, src/App.jsx and package.json to these roles: the page the browser loads, the entry script, the root component, and the list of dependencies and scripts. Check against the teaching text.

Where to act: The first import line in `src/App.jsx`.

Next step: Look at the export keyword on Header in the other file: does it say default? That decides whether braces belong.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The second import line in `src/App.jsx`.

Next step: Now do the same for Nav, and notice that this path also needs to say where your own file lives.

Without JavaScript the editor cannot run. Header.jsx has a default export Header and a named export Nav. App.jsx wrongly writes import { Header } and import Nav from 'Header.jsx'. On paper, rewrite both import lines to match the export forms. Check against the example.

Where to act: The output panel after each command.

Next step: Look for a file listing in one output and a local address in the other, and ask which one leaves files behind.

Without JavaScript the terminal cannot run. npm run dev starts a local server at a localhost address and writes no output folder; npm run build writes index.html and assets into dist/. On paper, say which one you would hand to a deployment.

Static version: a file defines function ProductCard without exporting it, and App imports it as a default. Decide on the fix, then check against the export rules in Activity 3.

```
npm create vite@latest my-app -- --template react
npm install
npm run dev     # local server, no output files
npm run build   # production files in dist/

export default function Page() {}
export function Footer() {}
import Page from './Page.jsx';
import { Footer } from './Page.jsx';
```

## Sources

First draft, not yet independently reviewed. Official sources checked 2026-11-04:

- developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules: Default exports versus named exports
- react.dev/learn/build-a-react-app-from-scratch: Step 1: Install a build tool
- react.dev/learn/importing-and-exporting-components: The root component file; Exporting and importing a component
- registry.npmjs.org/vite/latest: version 8.3.4 (npm registry metadata)
- vite.dev/guide/: Scaffolding Your First Vite Project; index.html and Project Root; Command Line Interface

## Static interaction alternatives

### predict

Static version: Header.jsx uses export function Header. App.jsx writes import Header from './Header.jsx' without braces. Decide what happens, then check against Activity 3.

### explore

Without JavaScript the explorer cannot run. On paper, match index.html, src/main.jsx, src/App.jsx and package.json to these roles: the page the browser loads, the entry script, the root component, and the list of dependencies and scripts. Check against the teaching text.

### terminal

Without JavaScript the editor cannot run. Header.jsx has a default export Header and a named export Nav. App.jsx wrongly writes import { Header } and import Nav from 'Header.jsx'. On paper, rewrite both import lines to match the export forms. Check against the example.

### explore

Without JavaScript the terminal cannot run. npm run dev starts a local server at a localhost address and writes no output folder; npm run build writes index.html and assets into dist/. On paper, say which one you would hand to a deployment.

### mcq

Static version: a file defines function ProductCard without exporting it, and App imports it as a default. Decide on the fix, then check against the export rules in Activity 3.
