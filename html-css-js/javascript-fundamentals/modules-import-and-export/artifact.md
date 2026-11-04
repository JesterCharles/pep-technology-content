# Modules: import and export

## Objectives

- Export named and default values from a module file
- Import named and default exports with the matching syntax
- Explain why a browser page needs script type="module" to use import

## Teaching

Modules are files that share values on purpose. Take a guess at what happens when an import does not match an export.

```
// cart.js
export default function total(items) { return items.length; }

// main.js
import { total } from "./cart.js";
console.log(total([1, 2]));
```

Each file with `import` or `export` is a module with its own top-level scope: its names are private unless exported.

```
export const LIMIT = 5;           // named
export function clamp(n) { ... }   // named
export default function main() {}  // the one default
```

A module can have many named exports but only one default. Named exports keep their name at the import site, unless you rename them; a default can be imported under any name.

Match the import form to the export.

```
import anyName from "./a.js";          // default
import { exact } from "./a.js";         // named
import { exact as other } from "./a.js"; // renamed
import anyName, { exact } from "./a.js"; // both
```

In a browser, the path needs its `./` and usually its `.js` extension. Bundlers like Vite are more forgiving, but the browser itself is not.

A browser treats a plain `script` tag as a classic script, where `import` is a syntax error. Add `type="module"` to load it as a module. Module scripts are deferred, run in strict mode and have their own scope.

Module scripts are fetched with CORS rules, so opening the page straight from `file://` fails in most browsers. Use a local server, such as the Vite dev server you will set up soon.

Node.js has its own switch: a `.mjs` file, or `"type": "module"` in `package.json`.

A teammate publishes this module, and you need both of its values in `app.js`.

```
// limits.js
export const MAX = 10;
export default function clamp(n) { return Math.min(n, MAX); }
```

## Recap

Modules keep names private unless exported. Named exports are imported in braces with their exact name, or renamed with `as`; a default is imported without braces under any name. Browsers need `type="module"` and a real origin, and Node.js needs `.mjs` or `"type": "module"`.

## Cheat sheet

What happens when main.js loads?

- It fails with a SyntaxError: the module does not provide an export named `total`: correct. Braces ask for a named export, and `cart.js` only has a default one. The module fails to link, so nothing in `main.js` runs.
- It prints `2`: not correct. That needs an import without braces, because the export is a default one.
- It prints `undefined`: not correct. A missing named import is a link-time error, not an undefined value.
- It throws a TypeError when `total` is called: not correct. It fails earlier than that. Imports are checked before any code in the module runs.

Where to act: The start of each declaration in `prices.js`.

Next step: Compare how `main.js` imports each name: names in braces need one form of export, and the name outside braces needs the other.

const TAX_RATE = 0.2; function addTax(amount) { return amount * (1 + TAX_RATE); } function formatPrice(amount) { return "$" + amount.toFixed(2); }

import formatPrice, { TAX_RATE, addTax } from "./prices.js"; console.log(TAX_RATE); console.log(formatPrice(addTax(10)));

Add the named export keyword before TAX_RATE and addTax, and add both export and default before formatPrice. main.js then prints 0.2 and $12.00.

Where to act: The first import line.

Next step: The name after `import` can be anything for a default export, but it must not have braces.

Another hint Another hint, 2 of 2 for Activity 3

Where to act: The second import line.

Next step: Name the real export first, then use `as` to give it the local name used on line 4.

import { slugify } from "./text.js"; import { MAX } from "./text.js"; console.log(slugify("Hello World")); console.log(LIMIT);

export const MAX_LENGTH = 40; export default function makeSlug(text) { return text.toLowerCase().replace(" ", "-"); }

A default import has no braces and takes any local name. A renamed import names the real export, then as, then the local name. The output is hello-world then 40.

Where to act: The two lists at the top of the model.

Next step: Change one list at a time, so you can tell which setting caused the change.

A classic script fails on import with a syntax error whether from file or a server. A module script from file is blocked by CORS. A module script from a local server loads and runs.

Which line imports both values correctly?

- `import clamp, { MAX } from "./limits.js";`: correct. The default comes first with no braces, and named exports go in braces.
- `import { clamp, MAX } from "./limits.js";`: not correct. There is no named export called `clamp`; it is the default.
- `import clamp, MAX from "./limits.js";`: not correct. A named export needs braces. This is a syntax error.
- `const { clamp, MAX } = import "./limits.js";`: not correct. That is not valid syntax. Static imports use the `import ... from` form.

```
export const A = 1;
export default function main() {}
import main, { A as Alpha } from "./file.js";
import * as all from "./file.js";
```

## Sources

- MDN: JavaScript modules, retrieved 2026-11-04
- MDN: import, retrieved 2026-11-04
- Node.js: ECMAScript modules, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What happens when main.js loads?

- It fails with a SyntaxError: the module does not provide an export named `total`: correct. Braces ask for a named export, and `cart.js` only has a default one. The module fails to link, so nothing in `main.js` runs.
- It prints `2`: not correct. That needs an import without braces, because the export is a default one.
- It prints `undefined`: not correct. A missing named import is a link-time error, not an undefined value.
- It throws a TypeError when `total` is called: not correct. It fails earlier than that. Imports are checked before any code in the module runs.

### terminal

### Static alternative

Add the named export keyword before TAX_RATE and addTax, and add both export and default before formatPrice. main.js then prints 0.2 and $12.00.

### terminal

### Static alternative

A default import has no braces and takes any local name. A renamed import names the real export, then as, then the local name. The output is hello-world then 40.

### explore

### Static alternative

A classic script fails on import with a syntax error whether from file or a server. A module script from file is blocked by CORS. A module script from a local server loads and runs.

### mcq

### Static alternative

Which line imports both values correctly?

- `import clamp, { MAX } from "./limits.js";`: correct. The default comes first with no braces, and named exports go in braces.
- `import { clamp, MAX } from "./limits.js";`: not correct. There is no named export called `clamp`; it is the default.
- `import clamp, MAX from "./limits.js";`: not correct. A named export needs braces. This is a syntax error.
- `const { clamp, MAX } = import "./limits.js";`: not correct. That is not valid syntax. Static imports use the `import ... from` form.
