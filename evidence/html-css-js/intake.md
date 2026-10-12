# Course intake: HTML, CSS & JS

Course intake for `html-css-js` (calendar technology `web`, Standard days S20-S27 and Fast Track days FT12-FT15).
This intake ships the course, module and topic manifests and evidence only; it authors no learner artifact.
Every topic artifact is recorded absent: applicable companions with the reason "authored in the <module> module PR", inapplicable ones with their applicability reason.
It closes the two sequenced category-A records of the confirmed coverage matrix v3: `source-gap-html-css-js-modules` (section Module map) and `source-gap-html-css-js-official-evidence` (section Official sources per topic).

## Inputs

- Curriculum snapshot: `curriculum/snapshot/pep-curriculum.json` (sha256 `9520f1fde24630604a82ecc1188726339ee02233d0274c622f4dda9c8c0204f8`) and `curriculum/snapshot/pep-calendar.json` (sha256 `634da8de5c6034e269b56347b2009fa24eb74eb9bd94f6bd8d5f65f54459ce00`), curriculum version `2026-10-01` per `curriculum/curriculum.lock.json`.
- Confirmed coverage matrix v3 (read-only, frozen): the 58 `html-css-js` topic rows and 12 day rows of `matrix-v3.json` are the authoritative topic-string inventory, canonical topic ids and expected-artifact scope; `discrepancies-v3.json` supplies the two category-A records closed here.
- Plan: approved PEP technology-content plan sections 2.3, 2.4, 3, 4, 5, 6, 7.1 and 11.
- Repository contracts on `main`: `docs/workflow.md`, `docs/html-artifact-contract.md`, `docs/lab-contract.md`, `docs/tools/validators.md` (new-course budget rule) and `docs/tools/components.md`.
- Terminal foundation: the repaired course-1 Evolv package `git-linux-ai-foundations-20261007-evolv-terminal-repair`, extracted on `main` as `components/terminal` version 1 (section Lab plan).

## Course slice

| Day | Calendar title | Day type | Snapshot pointer | Calendar rows |
|---|---|---|---|---|
| S20 | HTML, forms, accessibility | Concept | `/tracks/1/weeks/3/days/4` | 0. Semantic HTML page structure; 1. Forms and HTML5 validation; 2. Accessibility basics; 3. The box model |
| S21 | CSS layout | Lab | `/tracks/1/weeks/4/days/0` | 0. Flexbox; 1. Grid; 2. Responsive, mobile-first layout |
| S22 | JavaScript basics | Concept | `/tracks/1/weeks/4/days/1` | 0. JavaScript for Java developers; 1. let, const and ===; 2. Functions as values: arrow functions and callbacks; 3. Arrays and objects: map, filter, reduce |
| S23 | Modern JS | Practice | `/tracks/1/weeks/4/days/2` | 0. Destructuring and spread; 1. Modules: import and export; 2. Scope and closures |
| S24 | Tooling, DOM and events | Concept | `/tracks/1/weeks/4/days/3` | 0. Project setup with npm and Vite; 1. Selecting and changing the DOM; 2. Events and event bubbling; 3. Preventing cross-site scripting |
| S25 | Async and DevTools | Concept | `/tracks/1/weeks/4/days/4` | 0. Promises; 1. async and await; 2. The event loop; 3. Debugging with DevTools breakpoints |
| S26 | Fetch, errors and CORS | Lab | `/tracks/1/weeks/5/days/0` | 0. Fetching data; 1. Handling HTTP errors and ProblemDetail responses; 2. Fixing CORS: Spring Security config vs Vite dev proxy; 3. Reading: cookies vs localStorage, where tokens should live |
| S27 | Browser client build | Project | `/tracks/1/weeks/5/days/1` | 0. Calling your Spring Boot API from the browser; 1. Environment settings for the API address; 2. Testing a plain function with Vitest |
| FT12 | HTML, forms, accessibility | Fast (from Concept S20, skims S21) | `/tracks/2/weeks/2/days/1` | 0-3 as S20; 4. Flexbox (skim); 5. Grid (skim); 6. Responsive, mobile-first layout (skim); 7. JavaScript for Java developers; 8. let, const and === |
| FT13 | JavaScript basics + Modern JS | Fast (from Practice S22-S23) | `/tracks/2/weeks/2/days/2` | 0. Functions as values: arrow functions and callbacks; 1. Arrays and objects: map, filter, reduce; 2. Destructuring and spread; 3. Modules: import and export; 4. Scope and closures; 5. Project setup with npm and Vite |
| FT14 | Async and DevTools | Fast (from Concept S25, skims S24) | `/tracks/2/weeks/2/days/3` | 0. Promises; 1. async and await; 2. Selecting and changing the DOM; 3. Events and event bubbling; 4. Preventing cross-site scripting; 5. The event loop (skim); 6. Debugging with DevTools breakpoints (skim) |
| FT15 | Fetch, errors and CORS + Browser client build | Fast (from Project S26-S27) | `/tracks/2/weeks/2/days/4` | 0. Fetching data; 1. Handling HTTP errors and ProblemDetail responses; 2. Fixing CORS: Spring Security config vs Vite dev proxy; 3. Calling your Spring Boot API from the browser; 4. Environment settings for the API address; 5. Cookies vs localStorage: where tokens should live (skim); 6. Testing a plain function with Vitest (skim) |

Every Standard and Fast Track string at each pointer equals the curriculum snapshot string (checked by the intake generator against both snapshot files).
No day in the slice carries a calendar assessment (`assessment: null` on all twelve days), and `requiredLab` is `false` on all twelve days.

## Module map

Second-mate grouping decision, not syllabus (closes `source-gap-html-css-js-modules`).
The calendar gives no module grouping or count for `web`.
The grouping below pairs consecutive Standard days in calendar order so each module is one coherent authoring batch of 7-8 topics, inside the 4-9 batch range; it does not infer modules from weeks or day types, and it changes no topic, order or day.

| Module | Title | Standard days | Fast Track rows | Topics | Planned lab |
|---|---|---|---|---|---|
| `html-and-css` | HTML and CSS | S20, S21 | FT12 rows 0-6 | 7 | module lab (S21 overlay) |
| `javascript-fundamentals` | JavaScript Fundamentals | S22, S23 | FT12 rows 7-8; FT13 rows 0-4 | 7 | none |
| `dom-tooling-and-async` | Tooling, the DOM and Async JavaScript | S24, S25 | FT13 row 5; FT14 rows 0-6 | 8 | none |
| `fetch-and-browser-client` | Fetch and the Browser Client | S26, S27 | FT15 rows 0-6 | 7 | module lab (S26 overlay) |

Total: 29 canonical topics (25 core and 1 Reading topic from S20-S26, plus the 3 S27 Project-day rows), matching the matrix's 29 canonical topic ids.
Fast Track days cut across module boundaries (FT12, FT13); that is a property of the Fast schedule, not of the tree, and the Fast overlay will reference the same canonical topics.

## Topic list with relations

Topic ids are the matrix v3 canonical topic ids, unchanged.
Each Standard and Fast row maps to exactly one canonical topic with relation `exact`; there are no splits and no shared rows.
Fast Track wording variants (` (skim)` suffix; "Cookies vs localStorage: where tokens should live" against the Standard "Reading: cookies vs localStorage, where tokens should live") are the same canonical topic; `(skim)` is Fast overlay emphasis metadata, not a separate artifact (plan section 2.4).

S27 is a Project day. On the Standard track its three rows are project-row inputs for the browser-client build; on Fast Track FT15 the same strings are instructional topics with expected topic pages (matrix v3).
Because Standard and Fast share one canonical tree, each S27 row gets one canonical `core` topic page, mapped to both its S27 and FT15 pointers. This adds no syllabus: the page teaches exactly the row string, and the Standard Project day keeps its platform build.
No review topic is created: the slice has no review row and no module check.

| # | Topic | Kind | Calendar rows | Relation |
|---|---|---|---|---|
| 1 | `html-and-css/semantic-html-page-structure` | core | S20 row 0 "Semantic HTML page structure"<br>FT12 row 0 "Semantic HTML page structure" | exact, exact |
| 2 | `html-and-css/forms-and-html5-validation` | core | S20 row 1 "Forms and HTML5 validation"<br>FT12 row 1 "Forms and HTML5 validation" | exact, exact |
| 3 | `html-and-css/accessibility-basics` | core | S20 row 2 "Accessibility basics"<br>FT12 row 2 "Accessibility basics" | exact, exact |
| 4 | `html-and-css/the-box-model` | core | S20 row 3 "The box model"<br>FT12 row 3 "The box model" | exact, exact |
| 5 | `html-and-css/flexbox` | core | S21 row 0 "Flexbox"<br>FT12 row 4 "Flexbox (skim)" | exact, exact |
| 6 | `html-and-css/grid` | core | S21 row 1 "Grid"<br>FT12 row 5 "Grid (skim)" | exact, exact |
| 7 | `html-and-css/responsive-mobile-first-layout` | core | S21 row 2 "Responsive, mobile-first layout"<br>FT12 row 6 "Responsive, mobile-first layout (skim)" | exact, exact |
| 8 | `javascript-fundamentals/javascript-for-java-developers` | core | S22 row 0 "JavaScript for Java developers"<br>FT12 row 7 "JavaScript for Java developers" | exact, exact |
| 9 | `javascript-fundamentals/let-const-and-equals` | core | S22 row 1 "let, const and ==="<br>FT12 row 8 "let, const and ===" | exact, exact |
| 10 | `javascript-fundamentals/functions-as-values-arrow-functions-and-callbacks` | core | S22 row 2 "Functions as values: arrow functions and callbacks"<br>FT13 row 0 "Functions as values: arrow functions and callbacks" | exact, exact |
| 11 | `javascript-fundamentals/arrays-and-objects-map-filter-reduce` | core | S22 row 3 "Arrays and objects: map, filter, reduce"<br>FT13 row 1 "Arrays and objects: map, filter, reduce" | exact, exact |
| 12 | `javascript-fundamentals/destructuring-and-spread` | core | S23 row 0 "Destructuring and spread"<br>FT13 row 2 "Destructuring and spread" | exact, exact |
| 13 | `javascript-fundamentals/modules-import-and-export` | core | S23 row 1 "Modules: import and export"<br>FT13 row 3 "Modules: import and export" | exact, exact |
| 14 | `javascript-fundamentals/scope-and-closures` | core | S23 row 2 "Scope and closures"<br>FT13 row 4 "Scope and closures" | exact, exact |
| 15 | `dom-tooling-and-async/project-setup-with-npm-and-vite` | core | S24 row 0 "Project setup with npm and Vite"<br>FT13 row 5 "Project setup with npm and Vite" | exact, exact |
| 16 | `dom-tooling-and-async/selecting-and-changing-the-dom` | core | S24 row 1 "Selecting and changing the DOM"<br>FT14 row 2 "Selecting and changing the DOM" | exact, exact |
| 17 | `dom-tooling-and-async/events-and-event-bubbling` | core | S24 row 2 "Events and event bubbling"<br>FT14 row 3 "Events and event bubbling" | exact, exact |
| 18 | `dom-tooling-and-async/preventing-cross-site-scripting` | core | S24 row 3 "Preventing cross-site scripting"<br>FT14 row 4 "Preventing cross-site scripting" | exact, exact |
| 19 | `dom-tooling-and-async/promises` | core | S25 row 0 "Promises"<br>FT14 row 0 "Promises" | exact, exact |
| 20 | `dom-tooling-and-async/async-and-await` | core | S25 row 1 "async and await"<br>FT14 row 1 "async and await" | exact, exact |
| 21 | `dom-tooling-and-async/the-event-loop` | core | S25 row 2 "The event loop"<br>FT14 row 5 "The event loop (skim)" | exact, exact |
| 22 | `dom-tooling-and-async/debugging-with-devtools-breakpoints` | core | S25 row 3 "Debugging with DevTools breakpoints"<br>FT14 row 6 "Debugging with DevTools breakpoints (skim)" | exact, exact |
| 23 | `fetch-and-browser-client/fetching-data` | core | S26 row 0 "Fetching data"<br>FT15 row 0 "Fetching data" | exact, exact |
| 24 | `fetch-and-browser-client/handling-http-errors-and-problemdetail-responses` | core | S26 row 1 "Handling HTTP errors and ProblemDetail responses"<br>FT15 row 1 "Handling HTTP errors and ProblemDetail responses" | exact, exact |
| 25 | `fetch-and-browser-client/fixing-cors-spring-security-config-vs-vite-dev-proxy` | core | S26 row 2 "Fixing CORS: Spring Security config vs Vite dev proxy"<br>FT15 row 2 "Fixing CORS: Spring Security config vs Vite dev proxy" | exact, exact |
| 26 | `fetch-and-browser-client/cookies-vs-localstorage-where-tokens-should-live` | reading | S26 row 3 "Reading: cookies vs localStorage, where tokens should live"<br>FT15 row 5 "Cookies vs localStorage: where tokens should live (skim)" | exact, exact |
| 27 | `fetch-and-browser-client/calling-your-spring-boot-api-from-the-browser` | core | S27 row 0 "Calling your Spring Boot API from the browser"<br>FT15 row 3 "Calling your Spring Boot API from the browser" | exact, exact |
| 28 | `fetch-and-browser-client/environment-settings-for-the-api-address` | core | S27 row 1 "Environment settings for the API address"<br>FT15 row 4 "Environment settings for the API address" | exact, exact |
| 29 | `fetch-and-browser-client/testing-a-plain-function-with-vitest` | core | S27 row 2 "Testing a plain function with Vitest"<br>FT15 row 6 "Testing a plain function with Vitest (skim)" | exact, exact |

### Objectives and prerequisites

Each topic has 2-3 observable objectives with ids `o1`-`o3` in its `topic.json`; they are drafts for the independent critics.
Prerequisites name in-course topics by `<course>/<module>/<topic>`, course-1 topics by their existing ids, and the courses whose topic ids do not exist yet (`java-foundations`, `spring-boot`) by course id only.
`course.json` lists the course prerequisites `git-linux-ai-foundations`, `java-foundations` and `spring-boot` (S26-S27 call the learner's Spring Boot API).

| Topic | Objectives | Prerequisites |
|---|---|---|
| `semantic-html-page-structure` | o1: Choose the semantic element (header, nav, main, article, section, aside, footer) that matches each region of a page<br>o2: Arrange headings h1-h6 into an outline without skipping levels<br>o3: Replace generic div wrappers in a page with semantic elements that keep the same layout | none |
| `forms-and-html5-validation` | o1: Give each visible user-input control an associated visible label, and give controls without a label an accessible name<br>o2: Apply required, type, pattern, min and max so the browser blocks invalid input before submission<br>o3: Explain why server-side validation is still required when the browser validates a form | `html-css-js/html-and-css/semantic-html-page-structure` |
| `accessibility-basics` | o1: Identify missing alternative text, missing labels and keyboard traps in a sample page<br>o2: Choose a native HTML element over an ARIA role when both give the same behavior<br>o3: Check that every interactive control in a page can be reached and operated with the keyboard alone | `html-css-js/html-and-css/semantic-html-page-structure`<br>`html-css-js/html-and-css/forms-and-html5-validation` |
| `the-box-model` | o1: Label the content, padding, border and margin areas of a box<br>o2: Calculate an element's rendered width under box-sizing content-box and border-box<br>o3: Predict when adjacent vertical margins collapse | `html-css-js/html-and-css/semantic-html-page-structure` |
| `flexbox` | o1: Lay out items in a row or column with display: flex and flex-direction<br>o2: Distribute and align items with justify-content, align-items and gap<br>o3: Predict how flex-grow, flex-shrink and flex-basis share leftover space | `html-css-js/html-and-css/the-box-model` |
| `grid` | o1: Define columns and rows with grid-template-columns, the fr unit, repeat() and minmax()<br>o2: Place items into named areas with grid-template-areas<br>o3: Choose Grid or Flexbox for a described layout and justify the choice | `html-css-js/html-and-css/flexbox` |
| `responsive-mobile-first-layout` | o1: Write base styles for a narrow screen and add min-width media queries for wider screens<br>o2: Explain what the viewport meta element changes on a mobile browser<br>o3: Adapt a layout so it has no horizontal scrolling at 400 px width | `html-css-js/html-and-css/flexbox`<br>`html-css-js/html-and-css/grid` |
| `javascript-for-java-developers` | o1: Contrast JavaScript's dynamic typing and its Number and BigInt numeric primitives with Java's static numeric types<br>o2: Predict the result of typeof for primitive values, objects, arrays and null<br>o3: Run a JavaScript file with Node.js and read its console output | `java-foundations` |
| `let-const-and-equals` | o1: Choose const by default and let only when a variable is reassigned<br>o2: Predict that a const object's properties can still change while the binding cannot<br>o3: Predict the results of == and === comparisons across types, and use === by default | `html-css-js/javascript-fundamentals/javascript-for-java-developers` |
| `functions-as-values-arrow-functions-and-callbacks` | o1: Store a function in a variable and pass it to another function as a callback<br>o2: Rewrite a function expression as an arrow function, including the concise body form<br>o3: Predict whether a callback runs immediately or later in a given call | `html-css-js/javascript-fundamentals/let-const-and-equals` |
| `arrays-and-objects-map-filter-reduce` | o1: Create and read object literals and arrays of objects<br>o2: Transform an array of objects with map and filter without mutating the original array<br>o3: Compute a total with reduce and an explicit initial value | `html-css-js/javascript-fundamentals/functions-as-values-arrow-functions-and-callbacks` |
| `destructuring-and-spread` | o1: Extract values from arrays and objects with destructuring, including default values<br>o2: Copy and merge arrays and objects with spread syntax<br>o3: Predict that a spread copy is shallow: nested objects stay shared | `html-css-js/javascript-fundamentals/arrays-and-objects-map-filter-reduce` |
| `modules-import-and-export` | o1: Export named and default values from a module file<br>o2: Import named and default exports with the matching syntax<br>o3: Explain why a browser page needs script type="module" to use import | `html-css-js/javascript-fundamentals/functions-as-values-arrow-functions-and-callbacks` |
| `scope-and-closures` | o1: Identify which variables a function can see from its block, function and module scope<br>o2: Write a function that returns a closure keeping private state between calls<br>o3: Predict the values logged by callbacks created in a loop declared with let | `html-css-js/javascript-fundamentals/let-const-and-equals`<br>`html-css-js/javascript-fundamentals/functions-as-values-arrow-functions-and-callbacks` |
| `project-setup-with-npm-and-vite` | o1: Scaffold a Vite project with npm and start its development server on your own machine (performed as the first step of the S27 browser-client project, reused on Fast Track FT15; rehearsed in the page's practice terminal)<br>o2: Explain the roles of package.json, package-lock.json and node_modules<br>o3: Distinguish dependencies from devDependencies and choose npm install or npm ci for a situation | `html-css-js/javascript-fundamentals/modules-import-and-export`<br>`git-linux-ai-foundations/linux-foundations/navigating-the-shell`<br>`git-linux-ai-foundations/linux-foundations/localhost-and-ports` |
| `selecting-and-changing-the-dom` | o1: Select elements with querySelector and querySelectorAll<br>o2: Change text, attributes and classes, and add or remove elements<br>o3: Predict the page the DOM shows after a sequence of changes | `html-css-js/html-and-css/semantic-html-page-structure`<br>`html-css-js/javascript-fundamentals/arrays-and-objects-map-filter-reduce` |
| `events-and-event-bubbling` | o1: Attach event listeners with addEventListener<br>o2: Trace an event's bubbling path and distinguish event.target from event.currentTarget<br>o3: Use event delegation and preventDefault in a list or form handler | `html-css-js/dom-tooling-and-async/selecting-and-changing-the-dom` |
| `preventing-cross-site-scripting` | o1: Explain how untrusted text inserted with innerHTML can run script<br>o2: Render untrusted data with textContent or other safe DOM APIs instead of HTML strings<br>o3: Identify the risky sink in a code sample and rewrite it safely | `html-css-js/dom-tooling-and-async/selecting-and-changing-the-dom` |
| `promises` | o1: Describe the pending, fulfilled and rejected states of a promise<br>o2: Chain then calls and handle a rejection with catch<br>o3: Run independent promises together with Promise.all and predict how one rejection affects it | `html-css-js/javascript-fundamentals/functions-as-values-arrow-functions-and-callbacks` |
| `async-and-await` | o1: Rewrite a then chain with async and await<br>o2: Handle a rejected await with try and catch<br>o3: Predict that an async function always returns a promise | `html-css-js/dom-tooling-and-async/promises` |
| `the-event-loop` | o1: Predict the output order of synchronous code, promise callbacks and setTimeout callbacks<br>o2: Explain why a long synchronous task freezes the page | `html-css-js/dom-tooling-and-async/promises`<br>`html-css-js/dom-tooling-and-async/async-and-await` |
| `debugging-with-devtools-breakpoints` | o1: Set a line-of-code breakpoint and a conditional breakpoint on the page's buggy practice script in real Chrome or Firefox DevTools<br>o2: Predict variable values as execution steps over, into and out of a paused function<br>o3: Identify the faulty line and its fix in the page's buggy practice script by pausing, stepping and watching values in real DevTools | `html-css-js/dom-tooling-and-async/events-and-event-bubbling` |
| `fetching-data` | o1: Request JSON with fetch and await and read the parsed body<br>o2: Explain why fetch resolves on HTTP error statuses and check response.ok<br>o3: Render fetched data into the page safely | `html-css-js/dom-tooling-and-async/async-and-await`<br>`html-css-js/dom-tooling-and-async/preventing-cross-site-scripting` |
| `handling-http-errors-and-problemdetail-responses` | o1: Distinguish a network failure from an HTTP error response in fetch code<br>o2: Read the type, title, status and detail members of an application/problem+json response<br>o3: Show the learner-facing message that matches a 4xx or 5xx response | `html-css-js/fetch-and-browser-client/fetching-data`<br>`spring-boot` |
| `fixing-cors-spring-security-config-vs-vite-dev-proxy` | o1: Explain that the browser stops frontend JavaScript from reading a cross-origin response unless CORS permits it, and that only requests outside the CORS-safelisted conditions trigger a preflight<br>o2: Choose a Spring Security CORS configuration or a Vite dev-server proxy for a described setup<br>o3: Diagnose a CORS error from the browser console and network panel | `html-css-js/fetch-and-browser-client/fetching-data`<br>`html-css-js/dom-tooling-and-async/project-setup-with-npm-and-vite`<br>`spring-boot` |
| `cookies-vs-localstorage-where-tokens-should-live` | o1: Compare an HttpOnly cookie with localStorage for script access and exposure to cross-site scripting<br>o2: Explain what the Secure, HttpOnly and SameSite cookie attributes do | `html-css-js/dom-tooling-and-async/preventing-cross-site-scripting` |
| `calling-your-spring-boot-api-from-the-browser` | o1: Send GET and POST requests with a JSON body and Content-Type header to a REST API<br>o2: Map API responses, including error responses, to updates in the page | `html-css-js/fetch-and-browser-client/handling-http-errors-and-problemdetail-responses`<br>`html-css-js/fetch-and-browser-client/fixing-cors-spring-security-config-vs-vite-dev-proxy`<br>`spring-boot` |
| `environment-settings-for-the-api-address` | o1: Read the API base URL from import.meta.env with a VITE_-prefixed variable defined in a .env file<br>o2: Explain why values exposed to client code are public and must never hold secrets | `html-css-js/dom-tooling-and-async/project-setup-with-npm-and-vite` |
| `testing-a-plain-function-with-vitest` | o1: Write a Vitest test with test and expect for a pure function<br>o2: Run the test suite from npm and read a failing assertion's output<br>o3: Choose toBe or toEqual for primitive and object results | `html-css-js/dom-tooling-and-async/project-setup-with-npm-and-vite`<br>`html-css-js/javascript-fundamentals/modules-import-and-export` |

## Artifact applicability

Rules (plan section 5 and course 1): core topics require HTML, derived Markdown and a practice GIFT quiz, with a video when a suitable verified one exists; Reading topics also carry a printable PDF; absent companions record a reason.
The matrix v3 expected-artifact scope agrees: every topic expects a topic page, text alternative, embedded simulator and formative quiz, video if qualified, and `cookies-vs-localstorage-where-tokens-should-live` also expects a print handout.
The S27 rows' Standard expectation is the project row (platform build); their FT15 expectation is the topic page set below.

Legend: **R** required, authored in the module PR; **V** required when a suitable verified video exists, otherwise absent with the search record; **-** not applicable, with the reason in `topic.json`; lab column gives the planned `lab` scope.

| Topic | Kind | html | md | pdf | gift | video | lab |
|---|---|---|---|---|---|---|---|
| `html-and-css/semantic-html-page-structure` | core | R | R | - | R | V | - |
| `html-and-css/forms-and-html5-validation` | core | R | R | - | R | V | - |
| `html-and-css/accessibility-basics` | core | R | R | - | R | V | - |
| `html-and-css/the-box-model` | core | R | R | - | R | V | - |
| `html-and-css/flexbox` | core | R | R | - | R | V | module:html-and-css |
| `html-and-css/grid` | core | R | R | - | R | V | module:html-and-css |
| `html-and-css/responsive-mobile-first-layout` | core | R | R | - | R | V | module:html-and-css |
| `javascript-fundamentals/javascript-for-java-developers` | core | R | R | - | R | V | - |
| `javascript-fundamentals/let-const-and-equals` | core | R | R | - | R | V | - |
| `javascript-fundamentals/functions-as-values-arrow-functions-and-callbacks` | core | R | R | - | R | V | - |
| `javascript-fundamentals/arrays-and-objects-map-filter-reduce` | core | R | R | - | R | V | - |
| `javascript-fundamentals/destructuring-and-spread` | core | R | R | - | R | V | - |
| `javascript-fundamentals/modules-import-and-export` | core | R | R | - | R | V | - |
| `javascript-fundamentals/scope-and-closures` | core | R | R | - | R | V | - |
| `dom-tooling-and-async/project-setup-with-npm-and-vite` | core | R | R | - | R | V | - |
| `dom-tooling-and-async/selecting-and-changing-the-dom` | core | R | R | - | R | V | - |
| `dom-tooling-and-async/events-and-event-bubbling` | core | R | R | - | R | V | - |
| `dom-tooling-and-async/preventing-cross-site-scripting` | core | R | R | - | R | V | - |
| `dom-tooling-and-async/promises` | core | R | R | - | R | V | - |
| `dom-tooling-and-async/async-and-await` | core | R | R | - | R | V | - |
| `dom-tooling-and-async/the-event-loop` | core | R | R | - | R | V | - |
| `dom-tooling-and-async/debugging-with-devtools-breakpoints` | core | R | R | - | R | V | - |
| `fetch-and-browser-client/fetching-data` | core | R | R | - | R | V | module:fetch-and-browser-client |
| `fetch-and-browser-client/handling-http-errors-and-problemdetail-responses` | core | R | R | - | R | V | module:fetch-and-browser-client |
| `fetch-and-browser-client/fixing-cors-spring-security-config-vs-vite-dev-proxy` | core | R | R | - | R | V | - |
| `fetch-and-browser-client/cookies-vs-localstorage-where-tokens-should-live` | reading | R | R | R | R | V | - |
| `fetch-and-browser-client/calling-your-spring-boot-api-from-the-browser` | core | R | R | - | R | V | module:fetch-and-browser-client |
| `fetch-and-browser-client/environment-settings-for-the-api-address` | core | R | R | - | R | V | course:html-css-js |
| `fetch-and-browser-client/testing-a-plain-function-with-vitest` | core | R | R | - | R | V | course:html-css-js |

Applicability notes from reconciliation:

- `project-setup-with-npm-and-vite` (education-02): the page's practice terminal rehearses command choice; objective o1's authentic performance is the first step of the S27 browser-client project brief, used on Standard S27 and reused on Fast Track FT15.
- `debugging-with-devtools-breakpoints` (education-03): no lab; the page carries an authentic local-browser step in which the learner debugs the page's own buggy practice script in real Chrome or Firefox DevTools; the simulator and the GIFT quiz evidence o2.

## Assessment blueprint

None. No calendar day in S20-S27 or FT12-FT15 carries an assessment (`assessment: null` on all twelve days), so this course has no calendar module check.
No blueprint is invented: `course.json` `assessments` is empty and no `html-css-js/assessments/` directory exists.
The matrix v3 rule that module checks map to one course-level blueprint shared by Standard and Fast days has nothing to map here.
The S27 Project-day blocks (plan, build, timed without AI, commit and walkthrough note) and the Fast `Try-first diagnostic` and `Timed, without AI` blocks are platform activities; their items, keys and rubrics stay out of the repository.

## Lab plan

Labs belong to the Standard track's lab overlay; Fast Track skips coding labs and moves to direct project implementation, planned as the four Fast project increments in section Fast project increments (FT12-FT15).
Lab scope follows the confirmed coverage matrix: it expects a lab overlay only on the Standard Lab days S21 and S26 (reconciliation sme-03 removed the extra S23 lab the first draft planned). The S27 Project row's project brief is planned separately in section Project brief (S27).
No lab uses Docker, Podman or any learner-side container engine. Each lab has exactly one language-native test command, runs offline after a one-time `npm ci`, ships public tests only and commits no solution or hidden test (`docs/lab-contract.md`).
Planned prerequisite: Node.js 22.12 or later (`node --version`), which meets the Vite requirement (Node.js 20.19+ or 22.12+) and the Vitest requirement (Node 22.12.0 or later) recorded from the official guides on 2026-10-12, and provides the built-in `node:test` runner and global `fetch` (Node.js v22 documentation, in the source snapshot).

| Lab | Scope and day | Planned duration | Covers | Test command | Design |
|---|---|---|---|---|---|
| `html-css-js/html-and-css/coding-lab` | module; Standard S21 Lab day | 62 minutes (section Minute budgets) | `flexbox`, `grid`, `responsive-mobile-first-layout` | `node --test` | Daemon-free and browser-free: public tests read the learner-written `index.html` and `styles.css` and check stated layout rules (flex and grid declarations, `min-width` media queries, viewport meta). Rendered appearance is checked by the learner in a browser and practised in the page simulators; the lab README says so plainly. |
| `html-css-js/fetch-and-browser-client/coding-lab` | module; Standard S26 Lab day | 54 minutes (section Minute budgets) | `fetching-data`, `handling-http-errors-and-problemdetail-responses`, `calling-your-spring-boot-api-from-the-browser` | `node --test` | The learner writes an API client module; public tests start a deterministic `node:http` stub on `127.0.0.1` with an ephemeral port that returns JSON and `application/problem+json` responses, so the tests are offline and need no Spring Boot server. |

No other lab is planned:

- `javascript-fundamentals` has no lab: the matrix gives S22 and S23 no lab overlay. The pages' simulators carry the practice, and the S23 Practice-day exercise ladder is a platform activity.
- `dom-tooling-and-async` has no lab: S24 and S25 are Concept days with no calendar lab day and no matrix lab overlay; the pages' simulators carry the practice, with two authentic real-tool steps below.
- `project-setup-with-npm-and-vite` (reconciliation education-02): objective o1 (scaffold a Vite project and start its dev server on the learner's own machine) is performed for real as the first step of the S27 browser-client project brief (section Project brief (S27)), used on Standard S27 and reused unchanged on Fast Track FT15. The page's practice terminal is preparation that checks command reasoning; it is not claimed to verify scaffolding or server start.
- `debugging-with-devtools-breakpoints` (reconciliation education-03): no lab is added, because the matrix gives this topic no lab overlay. The page itself carries an authentic local-browser step: `artifact.html` contains a small buggy practice script (no extra file is needed, since a topic directory allows only the contract filenames), and the learner debugs it in real Chrome or Firefox DevTools, setting a line-of-code and a conditional breakpoint, stepping and watching values, then reports the faulty line and its fix for the page to check. The simulator prepares the workflow. Objective o1 and o3 are evidenced by that real-DevTools step; o2 (predicting values while stepping) by the simulator and the formative quiz.
- `fixing-cors-spring-security-config-vs-vite-dev-proxy`: CORS is enforced only by browsers, so no scripted test can reproduce it honestly; the page simulator and the S27 project brief, run by the learner in a browser against their real Spring Boot API, carry it.
- `environment-settings-for-the-api-address` and `testing-a-plain-function-with-vitest`: practised in the S27 project brief (`lab: course:html-css-js`), whose starter reads the API address from `import.meta.env` and whose test command is Vitest.
- S20 topics, `the-box-model` and the Reading topic: practised in the pages; S20 is a Concept day.
- The only course-level lab is the S27 project brief below; `course.json` `courseLabs` stays empty until a course-level PR authors it.

Module labs are listed in `module.json` `moduleLabs` only once authored, so the intake carries no placeholder lab directory. The educational critic confirms each `lab: none` reason.

Terminal interaction: any practice terminal in these pages (for example `npm create vite`, `npm install`, `npm run dev` in `project-setup-with-npm-and-vite`, or `npx vitest run` in `testing-a-plain-function-with-vitest`) reuses the canonical terminal foundation unchanged: the repaired course-1 Evolv package's non-form direct Run and Enter dispatch, embedded from `components/terminal` version 1.
That behavior is captain-confirmed working in Evolv (platform success, not a captured DOM or console trace); it is not re-derived or redesigned here.

## Project brief (S27)

Captain decision `pep-project-rows`, option A: each calendar Project row gets one reusable learner-facing project brief with outcomes, prerequisite alignment, a starter scaffold and public language-native tests; no containers; reference solutions and hidden tests stay out of the repository; one canonical artifact is reused by the Standard and Fast overlays, never duplicated.
These are already-authorized matrix items (the matrix's S27 project-row expectation), not new syllabus. The intake records the plan only; the files are authored later.

| Field | Plan |
|---|---|
| Artifact | `html-css-js/coding-lab`, scope `course` (a cumulative build across all four modules), following the `docs/lab-contract.md` layout: `lab.json`, `README.md` (the learner-facing brief), `starter/`, `tests/`, `fixtures/`, `expected/`. The course-level lab id is valid under `schemas/lab.schema.json` on `main` (merged "Allow course-level coding lab IDs"); this branch picks it up when it is rebased. |
| Calendar row and reuse | One canonical brief with a fixed step sequence (below). Standard S27 Project day, Build block: the 50 minutes of build steps after the topic pages (section Minute budgets), skipping the embedded teach steps. Fast Track FT15 Project block, as Fast project increment 4: the same brief with its 20 minutes of embedded teach steps plus the 50 minutes of build steps, 70 minutes in all (reconciliation 2, sme-recheck-01). Neither overlay copies it. |
| Outcomes | A Vite browser client for the learner's own Spring Boot API: it lists and creates records with `fetch`, reads the API base URL from a `VITE_`-prefixed variable through `import.meta.env`, renders API data with `textContent` rather than HTML strings, shows the `title` and `detail` of `application/problem+json` error responses, reaches the API through a Vite dev proxy or a Spring CORS configuration, and includes one learner-written Vitest test of a plain formatting function. |
| First step | In a scratch directory outside the lab, scaffold a throwaway Vite vanilla project with `npm create vite`, start its dev server and confirm the local URL: the authentic performance of `project-setup-with-npm-and-vite` o1 (reconciliation education-02). `lab.json` declares that scratch path and the cleanup step removes it. Then `npm ci` and `npm run dev` in `starter/`. |
| Starter scaffold | One `starter/` for the whole cumulative project (section Fast project increments): a Vite vanilla project with `vite`, `vitest` and `jsdom` pinned and `package-lock.json` committed; a plain base `index.html` (a heading, an empty `#records` list and a `#record-form` form with labelled `title` and `status` fields, no styles), an empty `styles.css`, `route.json` (shipped as `{"route": "standard"}`) and the `vitest.config.js` that reads it, and `src/` files with clearly marked TODOs per increment, including `src/main.js`, `src/api.js` and `src/format.js` for this brief; runnable as shipped (`npm run dev` serves the unfinished page). |
| Test command | `npm test` (runs `vitest run`), offline after the one-time `npm ci`; on the shipped `standard` route (`starter/route.json`, section Fast project increments) it runs the `scaffold` and `increment-4` suites, and `npm test -- increment-4` narrows to this brief's tests while working. Public Vitest tests run in the Node environment against a deterministic `node:http` stub on `127.0.0.1` with an ephemeral port that returns JSON and `application/problem+json` responses; no Spring Boot server, browser or container is needed for the tests. The shipped starter fails the named public tests with stable messages. |
| Checked by the learner, not by tests | The real Spring Boot API call in a browser, the CORS or proxy fix, and the page's appearance: the README lists them as manual checks with expected results, because CORS and rendering need a real browser. |
| Prerequisites | Node.js 22.12 or later; the learner's Spring Boot API from the `spring-boot` course (S1-S13 / FT1-FT8) running locally. |
| Not committed | Reference solution, hidden tests and any scoring material: uncommitted private staging only, recorded as "solved at <commit> by run <id>" (`docs/lab-contract.md` section 8). |
| Authoring | A course-level PR after the four module PRs, on a course branch editing course-level files only; it adds the lab to `course.json` `courseLabs`. |

Prerequisite alignment (every concept the brief applies, and where it is taught first):

| Applied concept | Topic | Standard | Fast |
|---|---|---|---|
| Page structure, labels, accessible controls | `semantic-html-page-structure`, `forms-and-html5-validation`, `accessibility-basics` | S20 | FT12 |
| Layout | `the-box-model`, `flexbox`, `grid`, `responsive-mobile-first-layout` | S20-S21 | FT12 |
| JavaScript language, arrays, destructuring, modules, closures | `javascript-fundamentals` topics | S22-S23 | FT12-FT13 |
| npm and Vite project setup | `project-setup-with-npm-and-vite` | S24 | FT13 |
| DOM, events, safe rendering | `selecting-and-changing-the-dom`, `events-and-event-bubbling`, `preventing-cross-site-scripting` | S24 | FT14 |
| Promises, async and await | `promises`, `async-and-await` | S25 | FT14 |
| Fetch, HTTP errors and ProblemDetail, CORS, token storage | `fetching-data`, `handling-http-errors-and-problemdetail-responses`, `fixing-cors-spring-security-config-vs-vite-dev-proxy`, `cookies-vs-localstorage-where-tokens-should-live` | S26 | FT15 (fetch, ProblemDetail and CORS: embedded teach step first) |
| Calling the Spring Boot API, API address from the environment, Vitest | the three S27-row topics | S27 (same day, page read earlier in Build) | FT15 (same day, embedded teach step first) |

Step sequence (reconciliation 2, sme-recheck-01). Each build step that applies a concept first taught on the project day is preceded by a just-in-time teach step for exactly that concept. A teach step is a short section of the brief's `README.md`: the rule, one worked snippet and the matching page section to read in full later. Teach steps are prerequisite instruction, not assessment; they do not replace or shorten the canonical topic pages, and they are marked "Fast Track: do this step; Standard: skip, taught by the page you read earlier in Build". The sizes are intake planning allowances, measured when the brief is authored.

| # | Step | Applies | Teach-first source | Fast FT15 minutes | Standard S27 minutes |
|---|---|---|---|---|---|
| 1 | Scaffold a throwaway Vite project in a scratch directory and start its dev server; then `npm ci` and `npm run dev` in `starter/` | `project-setup-with-npm-and-vite` o1 | taught FT13 / S24 | 5 | 5 |
| T2 | Teach: `VITE_` variables, `.env` and `import.meta.env`; why client-exposed values are public | `environment-settings-for-the-api-address` o1, o2 | embedded | 3 | skip |
| 2 | Set the API base URL in `.env` and read it in `src/api.js` | `environment-settings-for-the-api-address` o1, o2 | T2 | 5 | 5 |
| T3 | Teach: GET with `fetch`, `await response.json()`, rendering each record with `textContent` | `calling-your-spring-boot-api-from-the-browser` o1 (GET), o2; `fetching-data` | embedded | 4 | skip |
| 3 | List records from the API and render them safely | as T3 | T3 | 10 | 10 |
| T4 | Teach: POST with a JSON body and a `Content-Type: application/json` header | `calling-your-spring-boot-api-from-the-browser` o1 (POST) | embedded | 2 | skip |
| 4 | Create a record from the form and refresh the list | as T4 | T4 | 8 | 8 |
| T5 | Teach: `response.ok` and reading `title` and `detail` from `application/problem+json` | `handling-http-errors-and-problemdetail-responses`; `calling-your-spring-boot-api-from-the-browser` o2 | embedded | 3 | skip |
| 5 | Show API error responses in the page | as T5 | T5 | 7 | 7 |
| T6 | Teach: why the browser blocks the cross-origin read, and the two fixes (Vite dev proxy, Spring CORS configuration) | `fixing-cors-spring-security-config-vs-vite-dev-proxy` | embedded | 3 | skip |
| 6 | Reach the real API through one fix and complete the README's manual browser checks | as T6 | T6 | 7 | 7 |
| T7 | Teach: `test` and `expect`, `npm test`, reading a failing assertion, `toBe` versus `toEqual` | `testing-a-plain-function-with-vitest` o1-o3 | embedded | 5 | skip |
| 7 | Write one Vitest test for `src/format.js`, run `npm test -- increment-4` and then `npm test`, and make both pass | as T7 | T7 | 8 | 8 |
| | Total | | | 70 (teach 20 + build 50) | 50 |

Prerequisite alignment result: on Standard, the three S27 concepts are taught by their pages earlier in the same Build block, and every other applied concept is taught on an earlier day. On Fast FT15, each concept first taught that day (the three S27-row concepts and the S26-row fetch, ProblemDetail and CORS concepts the brief applies) is taught by its embedded teach step immediately before the step that applies it, inside the 70-minute Project block; FT15's full topic pages are not needed to start a step and are not claimed as FT15 time. The cookies and token-storage Reading is not applied by the brief. The calendar rows stay where they are; no syllabus changes.

## Fast project increments (FT12-FT15)

Captain decision `pep-fast-project-block`, option A (production inventory amendment 1): every Fast-template day's 70-minute Project block runs one increment of one cumulative reusable project per Fast course. These are already-authorized inventory items (4 for `html-css-js`: FT12, FT13, FT14 and FT15), not new syllabus; the calendar rows do not move. The intake records the plan only; the files are authored later.

| Field | Plan |
|---|---|
| Artifact | The course project `html-css-js/coding-lab` (section Project brief (S27)): one cumulative project, a records browser client for the learner's own Spring Boot API, built in four increments. It is the same artifact the Standard S27 Project row uses; nothing is copied per track. |
| Presentation | Fast learners meet it as "Project increment N" in their Project block, never as a coding lab. The README has one section per increment with outcomes, prerequisites, teach-then-check steps, build steps and the test command. Standard S27 uses only increment 4 (the S27 step sequence) on the `standard` route. |
| Scaffold | One `starter/` (section Project brief (S27)) holds every increment's TODO files; each increment names the files it provides and edits. The Fast learner carries their own work forward from increment to increment. The base page exists so Standard S27 can start without increments 1-3; it is scaffolding, not a solution: the authoring gate runs the increment-1 public tests against the shipped base page and requires them to fail. |
| Tests and command | Public Vitest tests in `tests/scaffold/` and `tests/increment-1/` to `tests/increment-4/`. The project has one language-native test command, `npm test` (`vitest run`), offline after the one-time `npm ci`. Route-aware test state (reconciliation 3, sme-recheck-02 and education-recheck-02): `starter/route.json` records the learner's route, and the shipped `vitest.config.js` reads it to choose which suites `npm test` runs. `{"route": "standard"}` (the shipped value) selects `scaffold` and `increment-4`; `{"route": "fast", "increment": N}` selects `scaffold` and increments 1 to N, cumulatively, and never a later increment. `tests/scaffold/` checks only the page hooks every later step relies on (the `#records` list and the `#record-form` form with its labelled `title` field); it passes on the shipped base page, and the README tells learners to keep those ids. While working, a learner runs the current increment's tests with `npm test -- increment-N` (Vitest CLI filtering, within the selected suites); before finishing an increment or the Standard brief, they run plain `npm test`, which then checks every outcome completed so far on their route. Page and DOM tests use Vitest's `jsdom` environment (per-file `@vitest-environment jsdom`); API tests use the Node environment and the deterministic `node:http` stub on `127.0.0.1`. Expected summaries, exercised for every route by the authoring gate: as shipped, `npm test` on each route fails only the named tests of the route's newest increment (scaffold tests pass); after Standard S27 it passes `scaffold` and `increment-4`; after Fast increment N it passes `scaffold` and increments 1 to N. No completed Fast work is committed as a Standard baseline. |
| Reuse of Standard material | Where the skills match, an increment reuses the Standard rules and design rather than inventing new ones: increment 1's layout checks are the S21 `html-and-css` lab's layout rules (flex and grid declarations, `min-width` media queries, viewport meta); increments 3 and 4 use the S26 `fetch-and-browser-client` lab's `node:http` stub design; increment 4 is the S27 brief unchanged. Each test file lives once, in the course project; the module labs keep their own `node --test` suites because each lab is exported self-contained. |
| Checked by the learner, not by tests | Visual layout at narrow and wide widths, keyboard use of the form, a DevTools breakpoint (increment 3) and the real API call and CORS fix (increment 4): manual checks with expected results in the README. |
| Not a deliverable | Optional Standard extensions. Reference solutions, hidden tests and scoring material stay out of the repository (`docs/lab-contract.md` section 8). |
| Setup | Node.js 22.12 or later; no container engine. Increment 4 also needs the learner's Spring Boot API running locally. |
| Authoring | The same course-level PR as the S27 brief, after the four module PRs. |

Teach-before-apply rule: every concept an increment applies is either taught on an earlier Fast day or taught by a short embedded teach-then-check step (the rule, one worked snippet, one quick check, and the page section to read in full later) immediately before the build step that first uses it. Every Fast day's topics are first taught that same day, and the full pages sit in the reported Fast overflow, so each increment carries its own teach-then-check steps inside its 70 minutes. Minutes are intake planning allowances, measured when the project is authored.

### Increment 1 (FT12): page, form and layout

Outcomes: the base page becomes a semantic, accessible, responsive page with a validated add-record form and one plain JavaScript rule function. Applies FT12 rows 0-8.

| # | Step | Applies | Minutes |
|---|---|---|---|
| T0 | Teach-then-check: run `node --version` and `npm ci`, set `starter/route.json` to `{"route": "fast", "increment": 1}`, run `npm test`, and read which named tests fail (npm itself is taught on FT13) | running the project's test command | 4 |
| T1 | Teach-then-check: landmarks, one `h1`, heading order | `semantic-html-page-structure` | 3 |
| 1 | Give the page header, main and footer landmarks and a heading outline | as T1 | 6 |
| T2 | Teach-then-check: labels, `type`, `required`, `minlength`, the constraint validation the browser gives free | `forms-and-html5-validation` | 4 |
| 2 | Turn the base form into a validated add-record form | as T2 | 8 |
| T3 | Teach-then-check: accessible names, a status region, keyboard focus order | `accessibility-basics` | 3 |
| 3 | Add a status message region and check keyboard use by hand | as T3 | 5 |
| T4 | Teach-then-check: box model, flex for one axis, grid for two, mobile-first `min-width` media queries and the viewport meta | `the-box-model`, `flexbox`, `grid`, `responsive-mobile-first-layout` | 5 |
| 4 | Lay out the page mobile-first in `styles.css` and check narrow and wide widths in a browser | as T4 | 12 |
| T5 | Teach-then-check: JavaScript for a Java developer, `let` and `const`, `===`, and how to read the provided function shells (function syntax itself is taught on FT13) | `javascript-for-java-developers`, `let-const-and-equals` | 4 |
| 5 | Complete the bodies of the provided `isValidTitle` and `normalizeTitle` shells in `src/rules.js` (reconciliation 3, education-recheck-01): the scaffold supplies each signature, a one-line purpose comment, the `export` line and the normalization operation (`title.trim()`); the learner writes only `const` bindings, `===` comparisons and the return values | as T5 | 6 |
| 6 | Run `npm test` (route `fast`, increment 1) until it passes | all | 10 |
| | Total | | 70 (teach 23 + build 47) |

### Increment 2 (FT13): records logic in a Vite project

Outcomes: the page is served by Vite, and record logic lives in pure, tested ES modules. Applies FT13 rows 0-5 and increment 1's rules.

| # | Step | Applies | Minutes |
|---|---|---|---|
| T1 | Teach-then-check: `package.json`, `package-lock.json`, `npm ci` versus `npm install`, `npm run dev` | `project-setup-with-npm-and-vite` | 4 |
| 1 | Set `route.json` to increment 2, start the Vite dev server on the project and open the page | as T1 | 4 |
| T2 | Teach-then-check: named `export` and `import` | `modules-import-and-export` | 3 |
| 2 | Import the increment-1 rules into `src/records.js` | as T2 | 4 |
| T3 | Teach-then-check: functions as values, arrow functions, callbacks, `map`, `filter`, `reduce` | `functions-as-values-arrow-functions-and-callbacks`, `arrays-and-objects-map-filter-reduce` | 5 |
| 3 | Write `visibleRecords` (filter), `titles` (map) and `countByStatus` (reduce), none of which mutates its input (`sortRecords` removed, reconciliation 3, sme-recheck-04) | as T3 | 12 |
| T4 | Teach-then-check: destructuring and spread | `destructuring-and-spread` | 3 |
| 4 | Write `withRecord` and `withoutRecord`, which return new arrays and never mutate | as T4 | 6 |
| T5 | Teach-then-check: scope and closures | `scope-and-closures` | 3 |
| 5 | Write `makeIdGenerator()`, a closure over a private counter | as T5 | 5 |
| 6 | Run `npm test -- increment-2` until it passes, then `npm test` so increments 1 and 2 pass together | all | 21 |
| | Total | | 70 (teach 18 + build 52) |

### Increment 3 (FT14): interactive page

Outcomes: the page renders records safely, adds records through a submit listener on the form and removes them through one delegated click listener on the record list, and loads its starting data asynchronously from a local fixture (no network; `fetch` is taught on FT15). Applies FT14 rows 0-4 and 6 and increments 1-2. Row 5 (the event loop, skim) is not applied.

| # | Step | Applies | Minutes |
|---|---|---|---|
| T1 | Teach-then-check: `querySelector`, `createElement`, `textContent` | `selecting-and-changing-the-dom` | 4 |
| 1 | Set `route.json` to increment 3; write `renderRecords(listElement, records)` in `src/render.js`, giving each record a delete button carrying its `data-id` | as T1 | 10 |
| T2 | Teach-then-check: why data never goes into `innerHTML` | `preventing-cross-site-scripting` | 3 |
| 2 | Render the fixture record whose title contains markup and confirm it shows as text | as T2 | 4 |
| T3 | Teach-then-check: `addEventListener`, `preventDefault` on a form `submit`, how a click bubbles from a button to its ancestors, and one delegated listener that reads `event.target.closest('button')` | `events-and-event-bubbling` | 4 |
| 3 | Handle `submit` with a listener on `#record-form`, and per-record delete with one delegated `click` listener on `#records` (reconciliation 3, sme-recheck-03); the scaffold DOM, the worked snippet and the public DOM tests use this same event path | as T3 | 14 |
| T4 | Teach-then-check: promises, `async` and `await`, `try` and `catch` | `promises`, `async-and-await` | 4 |
| 4 | Await the provided `loadRecords()` (a promise over a local fixture) and show loading and error states | as T4 | 10 |
| T5 | Teach-then-check: set a line-of-code breakpoint and read a value in DevTools | `debugging-with-devtools-breakpoints` (skim) | 2 |
| 5 | Pause inside `renderRecords` in real DevTools and record one value (manual check) | as T5 | 3 |
| 6 | Run `npm test -- increment-3` until it passes, then `npm test` so increments 1 to 3 pass together | all | 12 |
| | Total | | 70 (teach 17 + build 53) |

### Increment 4 (FT15): browser client for the Spring Boot API

Increment 4 is the S27 brief and its approved just-in-time step sequence (section Project brief (S27)), unchanged: 20 teach plus 50 build minutes. Fast learners set `route.json` to increment 4 in step 1, so the final `npm test` checks increments 1 to 4 together; Standard learners keep the shipped `standard` route. On Fast, steps 3 and 4 connect increment 3's renderer and form handler to `fetch` instead of writing them from scratch, so the Fast learner has slack inside the same allowance; Standard S27 learners write them in those steps.

Prerequisite alignment result: every concept applied in increments 1-4 is taught either on an earlier Fast day or by its embedded teach-then-check step immediately before first use, inside the day's 70-minute Project block. The FT12-FT15 page overflow stays reported (section Minute budgets) and no increment depends on it.

## Minute budgets

Rule: the revised new-course budget rule in `docs/tools/validators.md` (each integer topic budget at least `ceil(max(estimator P50, modeledWorstPath))`, capped at 15; no weighted day-pool shares; T14 reports overflow and never compresses budgets).
The rule needs a measured page, and no page exists yet, so the intake records a planning allowance:

- `budget` and `aboutLabel`: 10 minutes per core topic and 8 per Reading topic, set from course 1's measured range (estimator P50 4.78-7.95; worst-route labels 6-10).
- `modeledP50` and `modeledWorstPath`: 0, meaning not measured; `minutes.basis` says so in every `topic.json`.
- In the module PR the author records the frozen estimator P50, models the worst required route (two wrong graded attempts and wrong-first explores before settling), and raises `budget` and `aboutLabel` to at least `ceil(max(P50, modeledWorstPath))`. A budget is never lowered below that minimum to fit a day.

### Block allocation per day (reconciliation education-01)

Every fixed block of each day's frozen template (`pep-calendar.json` `dayTypes`) is assigned below. Each artifact is counted once: inside one named block, or as additional time when no block can hold it. "Platform" marks blocks that Evolv delivers and this repository does not author; the formative GIFT quizzes may supply warm-up and quiz items, and the topic videos are scheduled only in the Concept-day Short video block.

| Day | Template (block minutes) | Topic pages (planned) | Allocation | Total | Fit |
|---|---|---|---|---|---|
| S20, S22, S24, S25 | Concept: Warm-up 8, Reading 15, Short video 8, Worked example 12, Short exercises 20, Faded then fresh 40, Mini-quiz 7, Reflection 10 | 4 pages, 40 | Warm-up 8: platform, may draw on the topic GIFT quizzes. Reading 15 + Worked example 12 + 13 of Short exercises: the four topic pages (40), whose teach-then-do steps and simulators are the worked examples and first short exercises. Remaining 7 of Short exercises and Faded then fresh 40: platform coding practice. Short video 8: topic videos whose runtimes sum to 8 minutes or less across the day (a video that does not fit is recorded absent with the reason). Mini-quiz 7: the topic GIFT quizzes (about 30 seconds per question, 3 per topic). Reflection 10: platform. | 120 | fits |
| S21 | Lab: Warm-up 8, Lab brief 7, Guided lab 85, Redo one step without AI 10, Reflection 10 | 3 pages, 30 | Warm-up 8: platform, may draw on the GIFT quizzes. Lab brief 7 + 23 of Guided lab: the three topic pages (30) as the lab primer. Remaining 62 of Guided lab: `html-and-css/coding-lab`. Redo 10 and Reflection 10: platform. Topic videos are not scheduled on this day (the Lab template's only video is setup video inside the guided lab). | 120 | fits; lab duration 62 |
| S23 | Practice: Warm-up 10, Refresher 5, Exercise ladder 45, AI-assisted extension 10, Timed without AI 30, Quiz 10, Explain your code 10 | 3 pages, 30 | Warm-up 10: platform. Refresher 5 + 25 of Exercise ladder: the three topic pages (30), whose in-page exercises are the ladder's first rungs. Remaining 20 of Exercise ladder, AI-assisted extension 10, Timed 30 and Explain 10: platform. Quiz 10: the topic GIFT quizzes. No lab (matrix: no overlay). | 120 | fits |
| S26 | Lab: as S21 | 4 pages, 38 | Warm-up 8: platform, may draw on the GIFT quizzes. Lab brief 7 + 31 of Guided lab: the four topic pages (38). Remaining 54 of Guided lab: `fetch-and-browser-client/coding-lab`. Redo 10 and Reflection 10: platform. No topic video scheduled. | 120 | fits; lab duration 54 |
| S27 | Project: Warm-up 5, Plan the work 10, Build 80, Timed without AI 15, Commit and walkthrough note 10 | 3 pages, 30 | Warm-up 5: platform. Plan 10: platform. Build 80: the three topic pages (30), each read before the project step that applies it, plus 50 minutes of the S27 project brief (`html-css-js/coding-lab`), whose first step scaffolds a Vite project and starts its dev server (`project-setup-with-npm-and-vite` o1). Timed 15 and Commit 10: platform. No topic video scheduled. | 120 | fits; build time drops to 50 minutes, a pacing note for the reconciler |
| FT12 | Fast: Warm-up 5, Skim 10, Try-first diagnostic 15, Project 70, Timed without AI 15, Reflection 5 | 9 pages, 90 | Warm-up 5: platform. Skim 10: first 10 page minutes. Project 70: Fast project increment 1 with its embedded teach-then-check steps (section Fast project increments). Diagnostic 15, Timed 15, Reflection 5: platform (no lab). The other 80 page minutes are not claimed as FT12 time and have no block. | 200 | **overflow 80** |
| FT13 | Fast: as FT12 | 6 pages, 60 | As FT12, with Project 70: increment 2. The other 50 page minutes have no block. | 170 | **overflow 50** |
| FT14 | Fast: as FT12 | 7 pages, 70 | As FT12, with Project 70: increment 3. The other 60 page minutes have no block. | 180 | **overflow 60** |
| FT15 | Fast: as FT12 | 7 pages, 68 | As FT12, except Project 70: increment 4, which is the S27 project brief (`html-css-js/coding-lab`), one canonical brief, run with its embedded teach steps (20) before the build steps they serve (50), per the step sequence in section Project brief (S27); its first step scaffolds a Vite project and starts its dev server (`project-setup-with-npm-and-vite` o1). Warm-up 5 + Skim 10 + Diagnostic 15 + Project 70 + Timed 15 + Reflection 5 = 120 in template. The other 58 page minutes are not claimed as FT15 time and have no block. | 178 | **overflow 58** |

Standard days fit their templates with the planned allowances; if measured page budgets rise in a module PR, the lab or build share on S21, S26 and S27, or the platform exercise share on Concept and Practice days, shrinks by the same minutes, and a day whose page minutes exceed its assignable blocks is reported as overflow, never compressed.
Fast days overflow: the Fast template gives canonical pages only the 10-minute Skim block, and the ` (skim)` rows do not shorten the shared pages. No topic or block is dropped. No Fast increment depends on that overflow: each increment's embedded teach-then-check steps fit inside its 70-minute Project block. The FT12-FT15 overflow stays reported for the Fast overlay (`pep-t1-track-overlays`), not hidden, and needs an explicit Fast pacing decision outside the gate (plan section 2.4 treats Fast page totals as a platform pacing matter and escalates gross overflow).

For reference, gate T14 sums only the planned topic budgets per day against the 120-minute day total and passes: S20, S22, S24 and S25 40; S21, S23 and S27 30; S26 38; FT12 90; FT13 60; FT14 70; FT15 68.

## Official sources per topic

Closes `source-gap-html-css-js-official-evidence`.
Every source below was fetched live on 2026-10-12 (UTC) for this intake (the two Node.js v22 lab-runtime sources were added at reconciliation sme-04); `evidence/html-css-js/source-snapshot.json` records each final URL with retrieval time, the sha256 of the fetched bytes and the topic sections used.
All 90 URLs returned HTTP 200; there is no unreachable source and no recorded gap. Redirects were recorded at their final URL (for example MDN's HTML elements reference and grid guide, the npm CLI pages and the Vitest API index). Raw fetched pages are not committed.
First-party means the owning standard or vendor: WHATWG (HTML, DOM, Fetch), W3C (WCAG, ARIA, CSS modules), the CSS Working Group drafts, Ecma TC39, the IETF RFC Editor, Node.js, npm, Vite, Vitest, Spring, Chrome and Firefox DevTools, OWASP for security guidance, and MDN, the reference the calendar names for `web`.
Lab runtime (not a topic): [Node.js v22 test runner](https://nodejs.org/docs/latest-v22.x/api/test.html) and [Node.js v22 global objects, fetch](https://nodejs.org/docs/latest-v22.x/api/globals.html), fetched from Node.js v22.23.3 documentation.
Course project runtime (not a topic, added for the Fast project increments): [Vitest test environments](https://vitest.dev/guide/environment), [Vitest test filtering](https://vitest.dev/guide/filtering) and [jsdom](https://github.com/jsdom/jsdom) (MIT license), fetched 2026-10-12.
Recorded at fetch: Vite requires Node.js 20.19+ or 22.12+; Vitest requires Vite 6.4.0 or later and Node 22.12.0 or later; the ECMAScript draft fetched is ECMAScript 2027.

Freshness: every `topic.json` records `unverified` with no `checkedAt`, because no page exists. The module PR binds each page claim to `evidence/html-css-js/<module>/<topic>/sources.json` and refreshes the receipts; SME criticism re-verifies them.

| Topic | Official sources |
|---|---|
| `semantic-html-page-structure` | https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements<br>https://html.spec.whatwg.org/multipage/grouping-content.html<br>https://html.spec.whatwg.org/multipage/sections.html |
| `forms-and-html5-validation` | https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation<br>https://html.spec.whatwg.org/multipage/form-control-infrastructure.html<br>https://html.spec.whatwg.org/multipage/forms.html<br>https://html.spec.whatwg.org/multipage/input.html |
| `accessibility-basics` | https://www.w3.org/TR/WCAG22/<br>https://www.w3.org/TR/html-aria/<br>https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/ |
| `the-box-model` | https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model<br>https://www.w3.org/TR/css-box-4/<br>https://www.w3.org/TR/css-sizing-3/ |
| `flexbox` | https://www.w3.org/TR/css-align-3/<br>https://www.w3.org/TR/css-flexbox-1/ |
| `grid` | https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Basic_concepts<br>https://www.w3.org/TR/css-grid-2/ |
| `responsive-mobile-first-layout` | https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design<br>https://drafts.csswg.org/css-viewport/<br>https://www.w3.org/TR/mediaqueries-4/ |
| `javascript-for-java-developers` | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction<br>https://tc39.es/ecma262/ |
| `let-const-and-equals` | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let<br>https://tc39.es/ecma262/ |
| `functions-as-values-arrow-functions-and-callbacks` | https://developer.mozilla.org/en-US/docs/Glossary/Callback_function<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions |
| `arrays-and-objects-map-filter-reduce` | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce |
| `destructuring-and-spread` | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax |
| `modules-import-and-export` | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import<br>https://nodejs.org/api/esm.html |
| `scope-and-closures` | https://developer.mozilla.org/en-US/docs/Glossary/Scope<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures |
| `project-setup-with-npm-and-vite` | https://docs.npmjs.com/cli/v11/commands/npm-ci/<br>https://docs.npmjs.com/cli/v11/commands/npm-install/<br>https://docs.npmjs.com/cli/v11/configuring-npm/package-json/<br>https://vite.dev/guide/ |
| `selecting-and-changing-the-dom` | https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector<br>https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent<br>https://dom.spec.whatwg.org/ |
| `events-and-event-bubbling` | https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling<br>https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener<br>https://dom.spec.whatwg.org/ |
| `preventing-cross-site-scripting` | https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html<br>https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html<br>https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML<br>https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP |
| `promises` | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise |
| `async-and-await` | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function |
| `the-event-loop` | https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model<br>https://html.spec.whatwg.org/multipage/webappapis.html |
| `debugging-with-devtools-breakpoints` | https://developer.chrome.com/docs/devtools/javascript<br>https://developer.chrome.com/docs/devtools/javascript/breakpoints<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger<br>https://firefox-source-docs.mozilla.org/devtools-user/debugger/ |
| `fetching-data` | https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch<br>https://developer.mozilla.org/en-US/docs/Web/API/Response/json<br>https://fetch.spec.whatwg.org/ |
| `handling-http-errors-and-problemdetail-responses` | https://developer.mozilla.org/en-US/docs/Web/API/Response/ok<br>https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html<br>https://www.rfc-editor.org/rfc/rfc9110.html<br>https://www.rfc-editor.org/rfc/rfc9457.html |
| `fixing-cors-spring-security-config-vs-vite-dev-proxy` | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS<br>https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html<br>https://docs.spring.io/spring-security/reference/servlet/integrations/cors.html<br>https://fetch.spec.whatwg.org/<br>https://vite.dev/config/server-options |
| `cookies-vs-localstorage-where-tokens-should-live` | https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html<br>https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html<br>https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie<br>https://html.spec.whatwg.org/multipage/webstorage.html<br>https://www.rfc-editor.org/rfc/rfc6265.html |
| `calling-your-spring-boot-api-from-the-browser` | https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch<br>https://docs.spring.io/spring-framework/reference/web/webmvc-cors.html<br>https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html |
| `environment-settings-for-the-api-address` | https://vite.dev/config/server-options<br>https://vite.dev/guide/env-and-mode |
| `testing-a-plain-function-with-vitest` | https://vitest.dev/api/expect<br>https://vitest.dev/api/test<br>https://vitest.dev/guide/ |

Calendar references for `web`: [MDN: Learn web development](https://developer.mozilla.org/en-US/docs/Learn_web_development), [MDN: JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide), [Vite: getting started](https://vite.dev/guide/).

## Intake criticism

The two critic reports and the reconciliation for the first intake commit are committed unchanged as `intake-critic-education.json`, `intake-critic-sme.json` and `intake-reconciliation.json`.
Outcome: all 8 findings accepted and applied in one correction loop:

- education-01: per-day block allocation and lab durations (section Minute budgets); the Fast days are reported as overflow.
- education-02: `project-setup-with-npm-and-vite` o1 mapped to the first step of the S27 project brief, reused on Fast FT15 (section Lab plan; `topic.json` o1 and lab reason).
- education-03: `debugging-with-devtools-breakpoints` objectives rewritten around an in-page real-DevTools step, with no new lab (section Lab plan; `topic.json`).
- sme-01: `javascript-for-java-developers` o1 names the Number and BigInt numeric primitives.
- sme-02: `fixing-cors-spring-security-config-vs-vite-dev-proxy` o1 restates what CORS restricts and when a preflight happens.
- sme-03: the S23 `javascript-fundamentals` module lab is removed; its seven topics record `lab: none`.
- sme-04: the Node.js v22 test runner and global fetch documentation are added to the source snapshot.
- sme-05: `forms-and-html5-validation` o1 requires a visible label for each visible user-input control and accessible names for other controls.

Captain decision `pep-project-rows` (option A), folded into this correction loop: the S27 project brief plan (section Project brief (S27)), with `environment-settings-for-the-api-address` and `testing-a-plain-function-with-vitest` set to `lab: course:html-css-js`, and the education-02 Fast mapping moved from FT13 to FT15, where the reused brief runs.

Second reconciliation: the education recheck (`intake-critic-education-recheck.json`) raised no finding; the SME recheck (`intake-critic-sme-recheck.json`) confirmed sme-01 to sme-05 resolved and raised sme-recheck-01 (FT15 applied S27 concepts before teaching them within the fixed template). `intake-2-reconciliation.json` accepted it, and this loop applied it as the just-in-time step sequence in section Project brief (S27) and the FT15 row of section Minute budgets: one canonical brief, the frozen syllabus, FT15 within its 120-minute template, and the Fast page overflow still reported.

Follow-up loop (captain decision `pep-fast-project-block`, option A): the four Fast project increments are planned in section Fast project increments (FT12-FT15), the FT12-FT15 Project blocks in section Minute budgets now name them, and three course-project runtime sources (Vitest environments and filtering, jsdom) are added to the source snapshot. The S27 brief's starter and test command note the shared starter and the `increment-4` filter.

Third reconciliation: the focused education and SME rechecks of the Fast increments (`intake-3-critic-education-recheck.json`, `intake-3-critic-sme-recheck.json`) resolved every earlier finding and raised five new ones, all accepted in `intake-3-reconciliation.json` and applied in one loop: function shells and the normalization operation provided in increment 1 (education-recheck-01); route-aware cumulative test state through `starter/route.json`, so plain `npm test` passes on each route (education-recheck-02, sme-recheck-02); a form submit listener plus one delegated list click listener (sme-recheck-03); `sortRecords` removed (sme-recheck-04).
