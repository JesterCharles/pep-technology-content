# Environment settings for the API address

## Objectives

- Read the API base URL from import.meta.env with a VITE\_-prefixed variable defined in a .env file
- Explain why values exposed to client code are public and must never hold secrets

## Teaching

Your project has this `.env` file and this line in `api.js`. Predict what the page sees during `npm run dev`.

```
# .env
API_URL=http://localhost:8080

// api.js
console.log(import.meta.env.API_URL);
```

Vite loads `.env` files and exposes `VITE_`-prefixed values on `import.meta.env`. The values are always strings. Restart the dev server after changing a `.env` file.

```
# .env
VITE_FEATURE_NAME=search

// code
const feature = import.meta.env.VITE_FEATURE_NAME;
```

This keeps the address out of your code, so the same code can talk to different servers.

This model is a different project. Its page calls a reports service, so its setting has its own name and address.

`npm run dev` uses `development` mode, and `npm run build` uses `production`. Vite loads `.env` and `.env.[mode]`, and a mode-specific file wins over the generic one. A `.local` variant wins over its twin, and is for values not committed.

At build time, Vite replaces `import.meta.env.VITE_*` with the literal value in the JavaScript it outputs. Anyone can read that file.

Everything sent to the browser is public. So the test for `VITE_` is not "is it in `.env`?" but "would I be happy to print this on the page?"

Secrets stay on the server, where your Spring Boot API can use them for calls made on the user's behalf. Putting a value in `.gitignore` keeps it out of Git, but not out of the bundle.

During review you find `VITE_ADMIN_TOKEN` in `.env`, read by a page that has been live for a week. A teammate suggests deleting the line and redeploying.

## Recap

Only `VITE_`-prefixed values reach client code, through `import.meta.env`. Mode-specific files win over `.env`, so one codebase can target different servers. Vite inlines the values into the bundle as literal text, so they are public. Secrets stay on the server, and an exposed secret must be rotated.

## Cheat sheet

What is logged?

- `undefined`: correct. Vite exposes only variables that start with `VITE_` to client code. This keeps other values in `.env` from leaking by accident.
- `http://localhost:8080`: not correct. That would need the `VITE_` prefix.
- A ReferenceError: not correct. Reading a missing property gives `undefined` rather than an error.
- The value, but only in production: not correct. The prefix rule applies in every mode.

Where to act: The `___` in `api.js`.

Next step: Use the object shown in the example on this page, then a dot and the exact variable name from `.env`.

API_URL=http://localhost:8080

const API_BASE = ___; export function url(path) { return API_BASE + path; }

import { url } from "./api.js"; console.log(url("/api/books"));

Rename the variable with the VITE_ prefix in .env, and read the renamed variable from import.meta.env in api.js. The output is http://localhost:8080/api/books.

Where to act: The box showing `dist/assets/index.js`.

Next step: Search the text for the key value, then ask who can download that file.

In development, VITE_REPORTS_URL is http://localhost:9090 from .env. In production, .env.production overrides it with https://reports.example.com. The build inlines values as literal strings, so a VITE_ secret is readable by anyone who downloads the JavaScript file.

Where to act: Each row's value.

Next step: Ask what an attacker could do if they read this value in your downloaded JavaScript file.

- The API base URL: Fine as VITE_. Anyone can see this in the Network panel anyway.
- A database password: Server only. A browser must never talk to your database, and this gives full access.
- A payment provider secret key: Server only. It allows charges and refunds, so only your server can hold it.
- A feature flag that shows a new menu: Fine as VITE_. It reveals only a feature name, and enforcement belongs on the server.
- A JWT signing secret: Server only. Anyone holding it could mint valid tokens.

What should you do?

- Treat it as leaked: rotate the token, move its use to the server, and remove it from the client: correct. It was public for a week, so it may already be copied. Only rotating makes the old value useless, and the server must now do that work.
- Delete the line and redeploy, which removes it: not correct. New bundles will not have it, but copies and caches of the old one remain.
- Rename it without the `VITE_` prefix, and keep the page as it is: not correct. The page would then get `undefined`, and the leaked value would still work.
- Add `.env` to `.gitignore`: not correct. That only affects Git. The value was exposed through the built JavaScript.

```
# .env.production
VITE_REPORTS_URL=https://reports.example.com

const base = import.meta.env.VITE_REPORTS_URL;
```

## Sources

- Vite: Server options, retrieved 2026-11-04
- Vite: Env variables and modes, retrieved 2026-11-04

First draft, retrieved 2026-11-04. These claims have not had independent review yet, so treat them as unverified until that review is recorded.

## Static interaction alternatives

### predict

### Static alternative

What is logged?

- `undefined`: correct. Vite exposes only variables that start with `VITE_` to client code. This keeps other values in `.env` from leaking by accident.
- `http://localhost:8080`: not correct. That would need the `VITE_` prefix.
- A ReferenceError: not correct. Reading a missing property gives `undefined` rather than an error.
- The value, but only in production: not correct. The prefix rule applies in every mode.

### terminal

### Static alternative

Rename the variable with the VITE_ prefix in .env, and read the renamed variable from import.meta.env in api.js. The output is http://localhost:8080/api/books.

### explore

### Static alternative

In development, VITE_REPORTS_URL is http://localhost:9090 from .env. In production, .env.production overrides it with https://reports.example.com. The build inlines values as literal strings, so a VITE_ secret is readable by anyone who downloads the JavaScript file.

### explore

### Static alternative

- The API base URL: Fine as VITE_. Anyone can see this in the Network panel anyway.
- A database password: Server only. A browser must never talk to your database, and this gives full access.
- A payment provider secret key: Server only. It allows charges and refunds, so only your server can hold it.
- A feature flag that shows a new menu: Fine as VITE_. It reveals only a feature name, and enforcement belongs on the server.
- A JWT signing secret: Server only. Anyone holding it could mint valid tokens.

### mcq

### Static alternative

What should you do?

- Treat it as leaked: rotate the token, move its use to the server, and remove it from the client: correct. It was public for a week, so it may already be copied. Only rotating makes the old value useless, and the server must now do that work.
- Delete the line and redeploy, which removes it: not correct. New bundles will not have it, but copies and caches of the old one remain.
- Rename it without the `VITE_` prefix, and keep the page as it is: not correct. The page would then get `undefined`, and the leaked value would still work.
- Add `.env` to `.gitignore`: not correct. That only affects Git. The value was exposed through the built JavaScript.
