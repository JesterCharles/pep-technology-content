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
| `javascript-fundamentals` | JavaScript Fundamentals | S22, S23 | FT12 rows 7-8; FT13 rows 0-4 | 7 | module lab (S23 overlay) |
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
| `forms-and-html5-validation` | o1: Build a form whose every input has an associated label<br>o2: Apply required, type, pattern, min and max so the browser blocks invalid input before submission<br>o3: Explain why server-side validation is still required when the browser validates a form | `html-css-js/html-and-css/semantic-html-page-structure` |
| `accessibility-basics` | o1: Identify missing alternative text, missing labels and keyboard traps in a sample page<br>o2: Choose a native HTML element over an ARIA role when both give the same behavior<br>o3: Check that every interactive control in a page can be reached and operated with the keyboard alone | `html-css-js/html-and-css/semantic-html-page-structure`<br>`html-css-js/html-and-css/forms-and-html5-validation` |
| `the-box-model` | o1: Label the content, padding, border and margin areas of a box<br>o2: Calculate an element's rendered width under box-sizing content-box and border-box<br>o3: Predict when adjacent vertical margins collapse | `html-css-js/html-and-css/semantic-html-page-structure` |
| `flexbox` | o1: Lay out items in a row or column with display: flex and flex-direction<br>o2: Distribute and align items with justify-content, align-items and gap<br>o3: Predict how flex-grow, flex-shrink and flex-basis share leftover space | `html-css-js/html-and-css/the-box-model` |
| `grid` | o1: Define columns and rows with grid-template-columns, the fr unit, repeat() and minmax()<br>o2: Place items into named areas with grid-template-areas<br>o3: Choose Grid or Flexbox for a described layout and justify the choice | `html-css-js/html-and-css/flexbox` |
| `responsive-mobile-first-layout` | o1: Write base styles for a narrow screen and add min-width media queries for wider screens<br>o2: Explain what the viewport meta element changes on a mobile browser<br>o3: Adapt a layout so it has no horizontal scrolling at 400 px width | `html-css-js/html-and-css/flexbox`<br>`html-css-js/html-and-css/grid` |
| `javascript-for-java-developers` | o1: Contrast JavaScript's dynamic typing and single number type with Java's static types<br>o2: Predict the result of typeof for primitive values, objects, arrays and null<br>o3: Run a JavaScript file with Node.js and read its console output | `java-foundations` |
| `let-const-and-equals` | o1: Choose const by default and let only when a variable is reassigned<br>o2: Predict that a const object's properties can still change while the binding cannot<br>o3: Predict the results of == and === comparisons across types, and use === by default | `html-css-js/javascript-fundamentals/javascript-for-java-developers` |
| `functions-as-values-arrow-functions-and-callbacks` | o1: Store a function in a variable and pass it to another function as a callback<br>o2: Rewrite a function expression as an arrow function, including the concise body form<br>o3: Predict whether a callback runs immediately or later in a given call | `html-css-js/javascript-fundamentals/let-const-and-equals` |
| `arrays-and-objects-map-filter-reduce` | o1: Create and read object literals and arrays of objects<br>o2: Transform an array of objects with map and filter without mutating the original array<br>o3: Compute a total with reduce and an explicit initial value | `html-css-js/javascript-fundamentals/functions-as-values-arrow-functions-and-callbacks` |
| `destructuring-and-spread` | o1: Extract values from arrays and objects with destructuring, including default values<br>o2: Copy and merge arrays and objects with spread syntax<br>o3: Predict that a spread copy is shallow: nested objects stay shared | `html-css-js/javascript-fundamentals/arrays-and-objects-map-filter-reduce` |
| `modules-import-and-export` | o1: Export named and default values from a module file<br>o2: Import named and default exports with the matching syntax<br>o3: Explain why a browser page needs script type="module" to use import | `html-css-js/javascript-fundamentals/functions-as-values-arrow-functions-and-callbacks` |
| `scope-and-closures` | o1: Identify which variables a function can see from its block, function and module scope<br>o2: Write a function that returns a closure keeping private state between calls<br>o3: Predict the values logged by callbacks created in a loop declared with let | `html-css-js/javascript-fundamentals/let-const-and-equals`<br>`html-css-js/javascript-fundamentals/functions-as-values-arrow-functions-and-callbacks` |
| `project-setup-with-npm-and-vite` | o1: Scaffold a Vite project with npm and start its development server<br>o2: Explain the roles of package.json, package-lock.json and node_modules<br>o3: Distinguish dependencies from devDependencies and choose npm install or npm ci for a situation | `html-css-js/javascript-fundamentals/modules-import-and-export`<br>`git-linux-ai-foundations/linux-foundations/navigating-the-shell`<br>`git-linux-ai-foundations/linux-foundations/localhost-and-ports` |
| `selecting-and-changing-the-dom` | o1: Select elements with querySelector and querySelectorAll<br>o2: Change text, attributes and classes, and add or remove elements<br>o3: Predict the page the DOM shows after a sequence of changes | `html-css-js/html-and-css/semantic-html-page-structure`<br>`html-css-js/javascript-fundamentals/arrays-and-objects-map-filter-reduce` |
| `events-and-event-bubbling` | o1: Attach event listeners with addEventListener<br>o2: Trace an event's bubbling path and distinguish event.target from event.currentTarget<br>o3: Use event delegation and preventDefault in a list or form handler | `html-css-js/dom-tooling-and-async/selecting-and-changing-the-dom` |
| `preventing-cross-site-scripting` | o1: Explain how untrusted text inserted with innerHTML can run script<br>o2: Render untrusted data with textContent or other safe DOM APIs instead of HTML strings<br>o3: Identify the risky sink in a code sample and rewrite it safely | `html-css-js/dom-tooling-and-async/selecting-and-changing-the-dom` |
| `promises` | o1: Describe the pending, fulfilled and rejected states of a promise<br>o2: Chain then calls and handle a rejection with catch<br>o3: Run independent promises together with Promise.all and predict how one rejection affects it | `html-css-js/javascript-fundamentals/functions-as-values-arrow-functions-and-callbacks` |
| `async-and-await` | o1: Rewrite a then chain with async and await<br>o2: Handle a rejected await with try and catch<br>o3: Predict that an async function always returns a promise | `html-css-js/dom-tooling-and-async/promises` |
| `the-event-loop` | o1: Predict the output order of synchronous code, promise callbacks and setTimeout callbacks<br>o2: Explain why a long synchronous task freezes the page | `html-css-js/dom-tooling-and-async/promises`<br>`html-css-js/dom-tooling-and-async/async-and-await` |
| `debugging-with-devtools-breakpoints` | o1: Set line-of-code and conditional breakpoints in the DevTools Sources panel<br>o2: Step over, into and out of functions while watching variable values<br>o3: Locate the line that causes a described bug using breakpoints rather than console.log | `html-css-js/dom-tooling-and-async/events-and-event-bubbling` |
| `fetching-data` | o1: Request JSON with fetch and await and read the parsed body<br>o2: Explain why fetch resolves on HTTP error statuses and check response.ok<br>o3: Render fetched data into the page safely | `html-css-js/dom-tooling-and-async/async-and-await`<br>`html-css-js/dom-tooling-and-async/preventing-cross-site-scripting` |
| `handling-http-errors-and-problemdetail-responses` | o1: Distinguish a network failure from an HTTP error response in fetch code<br>o2: Read the type, title, status and detail members of an application/problem+json response<br>o3: Show the learner-facing message that matches a 4xx or 5xx response | `html-css-js/fetch-and-browser-client/fetching-data`<br>`spring-boot` |
| `fixing-cors-spring-security-config-vs-vite-dev-proxy` | o1: Explain why a browser blocks a cross-origin response and what a preflight request is<br>o2: Choose a Spring Security CORS configuration or a Vite dev-server proxy for a described setup<br>o3: Diagnose a CORS error from the browser console and network panel | `html-css-js/fetch-and-browser-client/fetching-data`<br>`html-css-js/dom-tooling-and-async/project-setup-with-npm-and-vite`<br>`spring-boot` |
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
| `javascript-fundamentals/javascript-for-java-developers` | core | R | R | - | R | V | module:javascript-fundamentals |
| `javascript-fundamentals/let-const-and-equals` | core | R | R | - | R | V | module:javascript-fundamentals |
| `javascript-fundamentals/functions-as-values-arrow-functions-and-callbacks` | core | R | R | - | R | V | module:javascript-fundamentals |
| `javascript-fundamentals/arrays-and-objects-map-filter-reduce` | core | R | R | - | R | V | module:javascript-fundamentals |
| `javascript-fundamentals/destructuring-and-spread` | core | R | R | - | R | V | module:javascript-fundamentals |
| `javascript-fundamentals/modules-import-and-export` | core | R | R | - | R | V | module:javascript-fundamentals |
| `javascript-fundamentals/scope-and-closures` | core | R | R | - | R | V | module:javascript-fundamentals |
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
| `fetch-and-browser-client/environment-settings-for-the-api-address` | core | R | R | - | R | V | - |
| `fetch-and-browser-client/testing-a-plain-function-with-vitest` | core | R | R | - | R | V | - |

## Assessment blueprint

None. No calendar day in S20-S27 or FT12-FT15 carries an assessment (`assessment: null` on all twelve days), so this course has no calendar module check.
No blueprint is invented: `course.json` `assessments` is empty and no `html-css-js/assessments/` directory exists.
The matrix v3 rule that module checks map to one course-level blueprint shared by Standard and Fast days has nothing to map here.
The S27 Project-day blocks (plan, build, timed without AI, commit and walkthrough note) and the Fast `Try-first diagnostic` and `Timed, without AI` blocks are platform activities; their items, keys and rubrics stay out of the repository.

## Lab plan

Labs belong to the Standard track's lab overlay; Fast Track skips coding labs and moves to direct project implementation.
No lab uses Docker, Podman or any learner-side container engine. Each lab has exactly one language-native test command, runs offline after a one-time `npm ci`, ships public tests only and commits no solution or hidden test (`docs/lab-contract.md`).
Planned prerequisite: Node.js 22.12 or later (`node --version`), which meets the Vite requirement (Node.js 20.19+ or 22.12+) and the Vitest requirement (Node 22.12.0 or later) recorded from the official guides on 2026-10-12, and provides the built-in `node:test` runner and global `fetch`.

| Lab | Scope and day | Covers | Test command | Design |
|---|---|---|---|---|
| `html-css-js/html-and-css/coding-lab` | module; Standard S21 Lab day | `flexbox`, `grid`, `responsive-mobile-first-layout` | `node --test` | Daemon-free and browser-free: public tests read the learner-written `index.html` and `styles.css` and check stated layout rules (flex and grid declarations, `min-width` media queries, viewport meta). Rendered appearance is checked by the learner in a browser and practised in the page simulators; the lab README says so plainly. |
| `html-css-js/javascript-fundamentals/coding-lab` | module; Standard S23 Practice-day exercise ladder | all 7 `javascript-fundamentals` topics | `node --test` | Exercise ladder of ES module functions (types and equality, callbacks, map/filter/reduce, destructuring and spread, import and export, closures) with public `node:test` tests; no dependencies. |
| `html-css-js/fetch-and-browser-client/coding-lab` | module; Standard S26 Lab day | `fetching-data`, `handling-http-errors-and-problemdetail-responses`, `calling-your-spring-boot-api-from-the-browser` | `node --test` | The learner writes an API client module; public tests start a deterministic `node:http` stub on `127.0.0.1` with an ephemeral port that returns JSON and `application/problem+json` responses, so the tests are offline and need no Spring Boot server. |

No other lab is planned:

- `dom-tooling-and-async` has no lab: S24 and S25 are Concept days with no calendar lab day, and DOM, events and DevTools need a browser that a `node --test` lab does not give honestly; the pages' simulators carry the practice.
- `fixing-cors-spring-security-config-vs-vite-dev-proxy`: CORS is enforced only by browsers, so the Node stub lab cannot reproduce it; the page simulator and the S27 Project build against the learner's real Spring Boot API carry it.
- `environment-settings-for-the-api-address` and `testing-a-plain-function-with-vitest`: Vite-specific build-time behavior and Vitest itself are practised in the S27 Project build (Fast: project implementation) and in the pages.
- S20 topics, `the-box-model` and the Reading topic: practised in the pages; S20 is a Concept day.
- No course lab is planned; `course.json` `courseLabs` is empty.

Module labs are listed in `module.json` `moduleLabs` only once authored, so the intake carries no placeholder lab directory. The educational critic confirms each `lab: none` reason.

Terminal interaction: any practice terminal in these pages (for example `npm create vite`, `npm install`, `npm run dev` in `project-setup-with-npm-and-vite`, or `npx vitest run` in `testing-a-plain-function-with-vitest`) reuses the canonical terminal foundation unchanged: the repaired course-1 Evolv package's non-form direct Run and Enter dispatch, embedded from `components/terminal` version 1.
That behavior is captain-confirmed working in Evolv (platform success, not a captured DOM or console trace); it is not re-derived or redesigned here.

## Minute budgets

Rule: the revised new-course budget rule in `docs/tools/validators.md` (each integer topic budget at least `ceil(max(estimator P50, modeledWorstPath))`, capped at 15; no weighted day-pool shares; T14 reports overflow and never compresses budgets).
The rule needs a measured page, and no page exists yet, so the intake records a planning allowance:

- `budget` and `aboutLabel`: 10 minutes per core topic and 8 per Reading topic, set from course 1's measured range (estimator P50 4.78-7.95; worst-route labels 6-10).
- `modeledP50` and `modeledWorstPath`: 0, meaning not measured; `minutes.basis` says so in every `topic.json`.
- In the module PR the author records the frozen estimator P50, models the worst required route (two wrong graded attempts and wrong-first explores before settling), and raises `budget` and `aboutLabel` to at least `ceil(max(P50, modeledWorstPath))`. A budget is never lowered below that minimum to fit a day.

Planned day totals against the day type's complete block total (T14 sums the budgets of present pages mapped to each day):

| Day | Day type | Topics | Planned budgets | Day total |
|---|---|---|---|---|
| S20 | Concept | 4 | 40 | 120 |
| S21 | Lab | 3 | 30 | 120 |
| S22 | Concept | 4 | 40 | 120 |
| S23 | Practice | 3 | 30 | 120 |
| S24 | Concept | 4 | 40 | 120 |
| S25 | Concept | 4 | 40 | 120 |
| S26 | Lab | 4 | 38 | 120 |
| S27 | Project | 3 | 30 | 120 |
| FT12 | Fast | 9 | 90 | 120 |
| FT13 | Fast | 6 | 60 | 120 |
| FT14 | Fast | 7 | 70 | 120 |
| FT15 | Fast | 7 | 68 | 120 |

All planned totals fit. Pacing risk: FT12 maps 9 topics, so it overflows its 120-minute total if the measured topics average more than 13.3 minutes; FT14 (7 topics) and FT15 (7 topics) overflow above an average of about 17, beyond the 15-minute cap, so they cannot overflow. An FT12 overflow at authoring needs an explicit pacing decision outside the gate (Fast pages may exceed the 10-minute skim block; plan section 2.4).

## Official sources per topic

Closes `source-gap-html-css-js-official-evidence`.
Every source below was fetched live on 2026-10-12 (UTC) for this intake; `evidence/html-css-js/source-snapshot.json` records each final URL with retrieval time, the sha256 of the fetched bytes and the topic sections used.
All 85 URLs returned HTTP 200; there is no unreachable source and no recorded gap. Redirects were recorded at their final URL (for example MDN's HTML elements reference and grid guide, the npm CLI pages and the Vitest API index). Raw fetched pages are not committed.
First-party means the owning standard or vendor: WHATWG (HTML, DOM, Fetch), W3C (WCAG, ARIA, CSS modules), the CSS Working Group drafts, Ecma TC39, the IETF RFC Editor, Node.js, npm, Vite, Vitest, Spring, Chrome and Firefox DevTools, OWASP for security guidance, and MDN, the reference the calendar names for `web`.
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

Pending. The manifests, objectives, applicability, lab plan and this intake receive fresh independent educational and technology-SME criticism, then non-author reconciliation, before any correction; the author does not approve this first output.
