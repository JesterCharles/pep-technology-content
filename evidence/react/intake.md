# Course intake: React

Course intake for `react` (calendar technology `react`, Standard days S28-S35 and Fast Track days FT16-FT20).
This intake ships manifests, the S35/FT20 module-check blueprint and evidence only; it authors no learner artifact.
Every topic artifact is recorded absent: applicable companions with the reason "authored in the <module> module PR", inapplicable ones with their applicability reason.

## Inputs

- Curriculum snapshot: `curriculum/snapshot/pep-curriculum.json` (sha256 `9520f1fde24630604a82ecc1188726339ee02233d0274c622f4dda9c8c0204f8`) and `curriculum/snapshot/pep-calendar.json` (sha256 `634da8de5c6034e269b56347b2009fa24eb74eb9bd94f6bd8d5f65f54459ce00`), curriculum version `2026-10-01` per `curriculum/curriculum.lock.json`. Topic pointers point into `pep-curriculum.json`.
- Confirmed coverage matrix v3 (read-only, frozen): `matrix-v3.json` (sha256 `4e936d703e64dba4f7973458b57aed0e921fad0d5afecca319cf7cec7806c4cd`) and `discrepancies-v3.json` (sha256 `ba6580b06af9d94d6f4ed53cf82986cdbd3db357fee09d2b268511505b2b9c3a`): the `react` rows are the topic-string inventory and expected-artifact scope.
- Contracts: `docs/workflow.md`, `docs/html-artifact-contract.md`, `docs/lab-contract.md`, `docs/tools/validators.md` (new-course budget rule) and the approved PEP technology-content plan sections 2.3, 3, 4, 5, 6, 7.1 and 11.
- Canonical terminal foundation: the repaired course-1 Evolv package `git-linux-ai-foundations-20261007-evolv-terminal-repair`, as extracted into `components/terminal@1` (form-free direct Run-button and Enter-key dispatch). The captain confirmed it working in Evolv; that is platform success, not a captured DOM or console trace.

## Course slice

| Day | Calendar title | Day type | Snapshot pointer | Calendar rows |
|---|---|---|---|---|
| S28 | Components and props | Concept | `/tracks/1/weeks/5/days/2` | 0. Components and JSX; 1. Props; 2. Project structure; 3. Conditional display |
| S29 | State and lists | Concept | `/tracks/1/weeks/5/days/3` | 0. useState; 1. Updating state immutably; 2. Rendering lists with keys |
| S30 | Effects and custom hooks | Concept | `/tracks/1/weeks/5/days/4` | 0. Loading data with useEffect; 1. Loading and error states; 2. Custom hooks |
| S31 | Routing and rendering | Lab | `/tracks/1/weeks/6/days/0` | 0. Routing and route parameters; 1. Navigation; 2. What makes a component re-render; 3. Lifting state up |
| S32 | Forms and shared state | Lab | `/tracks/1/weeks/6/days/1` | 0. Controlled forms; 1. Accessible forms; 2. Sharing state with Context |
| S33 | CRUD screens and UI tests | Project | `/tracks/1/weeks/6/days/2` | 0. Create, edit and delete against the API; 1. Handling submission errors in forms; 2. UI tests with Testing Library: querying by role and label |
| S34 | Login and protected pages | Lab (requiredLab) | `/tracks/1/weeks/6/days/3` | 0. Login with a session cookie or JWT; 1. Protected pages and role-based screens; 2. Handling 401 and 403: redirect and sign out; 3. Turning off the dev profile |
| S35 | Web and React review and check | Review | `/tracks/1/weeks/6/days/4` | 0. JavaScript fundamentals review; 1. React review; 2. Web and React module check |
| FT16 | Components and props + State and lists | Fast | `/tracks/2/weeks/3/days/0` | 0. Components and JSX; 1. Props; 2. useState; 3. Updating state immutably; 4. Rendering lists with keys; 5. Project structure (skim); 6. Conditional display (skim) |
| FT17 | Effects and custom hooks + Routing and rendering | Fast | `/tracks/2/weeks/3/days/1` | 0. Routing and route parameters; 1. Navigation; 2. Loading data with useEffect; 3. Loading and error states; 4. Lifting state up; 5. What makes a component re-render (skim); 6. Custom hooks (skim) |
| FT18 | Forms and shared state + CRUD screens and UI tests | Fast | `/tracks/2/weeks/3/days/2` | 0. Controlled forms; 1. Create, edit and delete against the API; 2. Handling submission errors in forms; 3. Accessible forms (skim) |
| FT19 | Login and protected pages | Project implementation (source snapshot dayType: Lab, requiredLab) | `/tracks/2/weeks/3/days/3` | 0. Sharing state with Context; 1. Login with a session cookie or JWT; 2. Protected pages and role-based screens; 3. Handling 401 and 403: redirect and sign out; 4. Turning off the dev profile |
| FT20 | Web and React review and check | Fast | `/tracks/2/weeks/3/days/4` | 0. UI tests with Testing Library: querying by role and label; 1. JavaScript fundamentals review; 2. React review; 3. Web and React module check |

S35 and FT20 each carry the calendar assessment `moduleCheck` (formats MCQ and coding, pass mark 70). Both map to the one course-level blueprint `react/assessments/web-and-react-module-check`.
Fast days list their source Standard days: FT16 = S28+S29, FT17 = S30+S31, FT18 = S32+S33, FT19 = S34, FT20 = S35.

## Module map

**Second-mate grouping decision, not syllabus.** The snapshot gives `react` no module grouping or count (discrepancy `source-gap-react-modules`). This intake groups topics by calendar day sequence, two consecutive Standard days per module, so that each module is one later authoring batch of 6-7 topics. Module count is not inferred from weeks or day types. The first two modules coincide exactly with Fast days FT16 and FT17.

| # | Module | Title | Standard days | Fast days | Topics |
|---|---|---|---|---|---|
| 1 | `components-and-state` | Components and State | S28, S29 | FT16 | 7 |
| 2 | `effects-routing-and-rendering` | Effects, Routing and Rendering | S30, S31 | FT17 | 7 |
| 3 | `forms-context-and-crud` | Forms, Context and CRUD | S32, S33 | FT18 (all rows), FT19 row 0, FT20 row 0 | 6 |
| 4 | `auth-and-review` | Authentication and Review | S34, S35 | FT19 rows 1-4, FT20 rows 1-2 | 6 |

Total: 26 topics in 4 modules. Course prerequisites: `html-css-js` and `spring-boot` (course ids only, until those courses' topic ids exist).

## Topic list with relations

One canonical topic per calendar topic string. The Standard and Fast rows naming the same topic (Fast adds ` (skim)` on some rows) map to the same canonical topic, each with relation `exact`. No split or shared relation is needed: every row is one focused topic.

| # | Topic | Module | Kind | Standard pointer (day) | Fast pointer (day) | Calendar row |
|---|---|---|---|---|---|---|
| 1 | `components-and-jsx` | `components-and-state` | core | `/tracks/1/weeks/5/days/2/topics/0` (S28) | `/tracks/2/weeks/3/days/0/topics/0` (FT16) | Components and JSX |
| 2 | `props` | `components-and-state` | core | `/tracks/1/weeks/5/days/2/topics/1` (S28) | `/tracks/2/weeks/3/days/0/topics/1` (FT16) | Props |
| 3 | `project-structure` | `components-and-state` | core | `/tracks/1/weeks/5/days/2/topics/2` (S28) | `/tracks/2/weeks/3/days/0/topics/5` (FT16) | Project structure — Fast: Project structure (skim) |
| 4 | `conditional-display` | `components-and-state` | core | `/tracks/1/weeks/5/days/2/topics/3` (S28) | `/tracks/2/weeks/3/days/0/topics/6` (FT16) | Conditional display — Fast: Conditional display (skim) |
| 5 | `usestate` | `components-and-state` | core | `/tracks/1/weeks/5/days/3/topics/0` (S29) | `/tracks/2/weeks/3/days/0/topics/2` (FT16) | useState |
| 6 | `updating-state-immutably` | `components-and-state` | core | `/tracks/1/weeks/5/days/3/topics/1` (S29) | `/tracks/2/weeks/3/days/0/topics/3` (FT16) | Updating state immutably |
| 7 | `rendering-lists-with-keys` | `components-and-state` | core | `/tracks/1/weeks/5/days/3/topics/2` (S29) | `/tracks/2/weeks/3/days/0/topics/4` (FT16) | Rendering lists with keys |
| 8 | `loading-data-with-useeffect` | `effects-routing-and-rendering` | core | `/tracks/1/weeks/5/days/4/topics/0` (S30) | `/tracks/2/weeks/3/days/1/topics/2` (FT17) | Loading data with useEffect |
| 9 | `loading-and-error-states` | `effects-routing-and-rendering` | core | `/tracks/1/weeks/5/days/4/topics/1` (S30) | `/tracks/2/weeks/3/days/1/topics/3` (FT17) | Loading and error states |
| 10 | `custom-hooks` | `effects-routing-and-rendering` | core | `/tracks/1/weeks/5/days/4/topics/2` (S30) | `/tracks/2/weeks/3/days/1/topics/6` (FT17) | Custom hooks — Fast: Custom hooks (skim) |
| 11 | `routing-and-route-parameters` | `effects-routing-and-rendering` | core | `/tracks/1/weeks/6/days/0/topics/0` (S31) | `/tracks/2/weeks/3/days/1/topics/0` (FT17) | Routing and route parameters |
| 12 | `navigation` | `effects-routing-and-rendering` | core | `/tracks/1/weeks/6/days/0/topics/1` (S31) | `/tracks/2/weeks/3/days/1/topics/1` (FT17) | Navigation |
| 13 | `what-makes-a-component-re-render` | `effects-routing-and-rendering` | core | `/tracks/1/weeks/6/days/0/topics/2` (S31) | `/tracks/2/weeks/3/days/1/topics/5` (FT17) | What makes a component re-render — Fast: What makes a component re-render (skim) |
| 14 | `lifting-state-up` | `effects-routing-and-rendering` | core | `/tracks/1/weeks/6/days/0/topics/3` (S31) | `/tracks/2/weeks/3/days/1/topics/4` (FT17) | Lifting state up |
| 15 | `controlled-forms` | `forms-context-and-crud` | core | `/tracks/1/weeks/6/days/1/topics/0` (S32) | `/tracks/2/weeks/3/days/2/topics/0` (FT18) | Controlled forms |
| 16 | `accessible-forms` | `forms-context-and-crud` | core | `/tracks/1/weeks/6/days/1/topics/1` (S32) | `/tracks/2/weeks/3/days/2/topics/3` (FT18) | Accessible forms — Fast: Accessible forms (skim) |
| 17 | `sharing-state-with-context` | `forms-context-and-crud` | core | `/tracks/1/weeks/6/days/1/topics/2` (S32) | `/tracks/2/weeks/3/days/3/topics/0` (FT19) | Sharing state with Context |
| 18 | `create-edit-and-delete-against-the-api` | `forms-context-and-crud` | core | `/tracks/1/weeks/6/days/2/topics/0` (S33) | `/tracks/2/weeks/3/days/2/topics/1` (FT18) | Create, edit and delete against the API |
| 19 | `handling-submission-errors-in-forms` | `forms-context-and-crud` | core | `/tracks/1/weeks/6/days/2/topics/1` (S33) | `/tracks/2/weeks/3/days/2/topics/2` (FT18) | Handling submission errors in forms |
| 20 | `ui-tests-with-testing-library-querying-by-role-and-label` | `forms-context-and-crud` | core | `/tracks/1/weeks/6/days/2/topics/2` (S33) | `/tracks/2/weeks/3/days/4/topics/0` (FT20) | UI tests with Testing Library: querying by role and label |
| 21 | `login-with-a-session-cookie-or-jwt` | `auth-and-review` | core | `/tracks/1/weeks/6/days/3/topics/0` (S34) | `/tracks/2/weeks/3/days/3/topics/1` (FT19) | Login with a session cookie or JWT |
| 22 | `protected-pages-and-role-based-screens` | `auth-and-review` | core | `/tracks/1/weeks/6/days/3/topics/1` (S34) | `/tracks/2/weeks/3/days/3/topics/2` (FT19) | Protected pages and role-based screens |
| 23 | `handling-401-and-403-redirect-and-sign-out` | `auth-and-review` | core | `/tracks/1/weeks/6/days/3/topics/2` (S34) | `/tracks/2/weeks/3/days/3/topics/3` (FT19) | Handling 401 and 403: redirect and sign out |
| 24 | `turning-off-the-dev-profile` | `auth-and-review` | core | `/tracks/1/weeks/6/days/3/topics/3` (S34) | `/tracks/2/weeks/3/days/3/topics/4` (FT19) | Turning off the dev profile |
| 25 | `javascript-fundamentals-review` | `auth-and-review` | review | `/tracks/1/weeks/6/days/4/topics/0` (S35) | `/tracks/2/weeks/3/days/4/topics/1` (FT20) | JavaScript fundamentals review |
| 26 | `react-review` | `auth-and-review` | review | `/tracks/1/weeks/6/days/4/topics/1` (S35) | `/tracks/2/weeks/3/days/4/topics/2` (FT20) | React review |

Row accounting (matrix v3, 54 `react` topic rows):

- 52 instructional and review rows map to 26 canonical topics (24 core, 2 review), two rows each (one Standard, one Fast).
- 2 rows, S35 row 2 and FT20 row 3 "Web and React module check", map to the course blueprint, never to a learner topic.
- The three S33 rows are Standard Project-day rows (matrix `project-row`), but the Fast track teaches them as topic pages on FT18 and FT20, so they become canonical core topics. On S33 the same pages are the reference for Project 2 work; the project build itself stays on the platform.
- The two S35 review rows become `review` pages: retrieval and practice on already-taught content, with no new syllabus.
- ` (skim)` on FT16 rows 5-6, FT17 rows 5-6 and FT18 row 3 is Fast-track emphasis metadata for the later track overlay, not a separate artifact.
- No row is a `Reading:` row, so no topic is kind `reading` (plan section 2.3 counts 21 core and 0 reading for `react`; the three S33 rows it counted as review/other are core pages here, for the reason above).

### Objectives

Each topic has 2-3 observable objectives with exact ids `o1`-`o3`, recorded in its `topic.json`. Nothing is used before it is taught on either track:

- Re-render triggers (react-intake-sme-03): `what-makes-a-component-re-render` (S31/FT17) o1 names a state update and a parent re-render as two causes taught so far, without claiming the list is complete. `sharing-state-with-context` (S32/FT19) o2 adds a changed context value as a further trigger, and `react-review` o1 retrieves all three.
- Submission errors (react-edu-003): the frozen FT18 order teaches `handling-submission-errors-in-forms` (row 2) before `accessible-forms` (row 3, skim), so `accessible-forms` is not a prerequisite of the submission-errors topic. That page teaches just in time the minimum notification behaviour it needs (an error message next to its field and a form-level message), without assuming prior mastery; the later Accessible forms page consolidates labels, field associations, `aria-describedby`, `aria-invalid`, focus and live regions. The frozen rows are not reordered.
- 401 and 403 (react-intake-sme-02): `handling-401-and-403-redirect-and-sign-out` states the general HTTP meanings first (401: the request lacks valid authentication credentials; 403: the server understood the request but refuses it, which does not by itself prove the requester is authenticated), then the project API contract (401: clear client authentication state and sign in again; 403: keep the session and show not-authorized). Clearing client state is distinguished from the server ending an HttpOnly cookie session.
- fetch errors (react-intake-sme-01): `loading-and-error-states` o2 teaches that fetch does not reject merely because the server returned a non-2xx status, so `response.ok` is checked; aborted and malformed requests are handled separately.

### Prerequisites

In-course prerequisites are full `react/<module>/<topic>` references. Cross-course prerequisites name course ids only: `html-css-js` (JSX, modules, fetch and accessible HTML build on it) and `spring-boot` (the project API, JWT issuing, role-protected endpoints and the dev profile that keeps endpoints open, taught on the Spring Boot days).

## Artifact applicability

Rules: `docs/html-artifact-contract.md` section 12 and plan section 5, matched to the matrix v3 expected artifacts. Core topics require HTML, the derived Markdown and a formative GIFT practice quiz, with a curated video only when a documented search qualifies one. Review pages carry HTML and Markdown only. No topic is a `Reading:` topic or declares a print handout, so no PDF applies.

Legend: **R** required, authored in the module PR; **V** present only if a documented search qualifies a live, public, embeddable video within the topic budget, otherwise absent with the search record; **M** covered by the planned module lab; **-** not applicable, with the reason in `topic.json`.

| Topic | Kind | html | md | pdf | gift | video | lab |
|---|---|---|---|---|---|---|---|
| `components-and-state/components-and-jsx` | core | R | R | - | R | V | - |
| `components-and-state/props` | core | R | R | - | R | V | - |
| `components-and-state/project-structure` | core | R | R | - | R | V | - |
| `components-and-state/conditional-display` | core | R | R | - | R | V | - |
| `components-and-state/usestate` | core | R | R | - | R | V | - |
| `components-and-state/updating-state-immutably` | core | R | R | - | R | V | - |
| `components-and-state/rendering-lists-with-keys` | core | R | R | - | R | V | - |
| `effects-routing-and-rendering/loading-data-with-useeffect` | core | R | R | - | R | V | - |
| `effects-routing-and-rendering/loading-and-error-states` | core | R | R | - | R | V | - |
| `effects-routing-and-rendering/custom-hooks` | core | R | R | - | R | V | - |
| `effects-routing-and-rendering/routing-and-route-parameters` | core | R | R | - | R | V | M |
| `effects-routing-and-rendering/navigation` | core | R | R | - | R | V | M |
| `effects-routing-and-rendering/what-makes-a-component-re-render` | core | R | R | - | R | V | M |
| `effects-routing-and-rendering/lifting-state-up` | core | R | R | - | R | V | M |
| `forms-context-and-crud/controlled-forms` | core | R | R | - | R | V | M |
| `forms-context-and-crud/accessible-forms` | core | R | R | - | R | V | M |
| `forms-context-and-crud/sharing-state-with-context` | core | R | R | - | R | V | M |
| `forms-context-and-crud/create-edit-and-delete-against-the-api` | core | R | R | - | R | V | - |
| `forms-context-and-crud/handling-submission-errors-in-forms` | core | R | R | - | R | V | - |
| `forms-context-and-crud/ui-tests-with-testing-library-querying-by-role-and-label` | core | R | R | - | R | V | - |
| `auth-and-review/login-with-a-session-cookie-or-jwt` | core | R | R | - | R | V | M |
| `auth-and-review/protected-pages-and-role-based-screens` | core | R | R | - | R | V | M |
| `auth-and-review/handling-401-and-403-redirect-and-sign-out` | core | R | R | - | R | V | M |
| `auth-and-review/turning-off-the-dev-profile` | core | R | R | - | R | V | M |
| `auth-and-review/javascript-fundamentals-review` | review | R | R | - | - | - | - |
| `auth-and-review/react-review` | review | R | R | - | - | - | - |

The matrix's `simulator` expectation is part of each HTML page (embedded interactive practice), and its `text-alternative` expectation is `artifact.md`. Any terminal-style interaction on a page (for example `npm create vite`, `npm run dev` and `npm run build` in `project-structure`, or starting the back end with a different profile in `turning-off-the-dev-profile`) reuses `components/terminal@1` unchanged; it is not re-derived or redesigned.

## Lab plan

Labs follow `docs/lab-contract.md`: no Docker, Podman, Compose, Testcontainers or any other learner-side container engine; one language-native test command per lab; public tests only, with reference solutions and hidden tests only in uncommitted private staging. The Standard track adds coding labs through its lab overlay; the Fast track skips them and moves to direct project implementation. FT19 is presented as Project implementation, never a coding lab (discrepancy `conflict-ft19-lab-label`, resolved by the approved track model). Each lab is authored in its module PR.

| Planned lab | Standard day | Calendar requiredLab | Covers | Test command (after one-time `npm ci`) | Fast track |
|---|---|---|---|---|---|
| `react/effects-routing-and-rendering/coding-lab/` | S31 (Lab, 85-minute guided-lab block) | false | `routing-and-route-parameters`, `navigation`, `what-makes-a-component-re-render`, `lifting-state-up` | `npm test` | skipped (not required) |
| `react/forms-context-and-crud/coding-lab/` | S32 (Lab, 85-minute guided-lab block) | false | `controlled-forms`, `accessible-forms`, `sharing-state-with-context` | `npm test` | skipped (not required) |
| `react/auth-and-review/coding-lab/` | S34 (Lab, 85-minute guided-lab block) | **true** | `login-with-a-session-cookie-or-jwt`, `protected-pages-and-role-based-screens`, `handling-401-and-403-redirect-and-sign-out`, `turning-off-the-dev-profile` | `npm test` | skipped (not required) |

- **S34 carries the course's required coding lab** (calendar `requiredLab: true`): a login, protected-route and 401/403 lab. The matrix v3 also expects a Standard lab overlay on the S31 and S32 Lab days (calendar `requiredLab: false`), so those two module labs are planned as Standard Lab-day guided labs; whether the Standard overlay marks them required is for the track overlay to record against the calendar flag.
- Toolchain: Node.js 24 LTS (the repository's own engine line) with npm; the test command `npm test` runs the Node-based Vitest runner (`vitest run`) with React Testing Library and user-event in a jsdom environment. Dependency versions are pinned with a committed lockfile; the version baseline at intake is React 19.3.0, React Router 8.4.0, Vite 8.3.4, Vitest 5.0.4 (engines `^22.12.0 || ^24.0.0 || >=26.0.0`), @testing-library/react 16.3.3, @testing-library/user-event 14.6.7 and jsdom 30.1.2 (npm registry metadata in the source snapshot).
- Offline and determinism: after `npm ci`, tests run with no network. The labs never call the real Spring Boot back end: API calls go through a stubbed `fetch` with fixed fixtures, so no database, server or container is needed. No clock or locale dependence.
- Starter expectation: each starter fails named public tests with stable messages until the learner completes the steps.
- Terminal interaction (running `npm ci` and `npm test`) uses the learner's own terminal or the platform's coding-lab terminal; any in-page terminal reuses `components/terminal@1`.
- Concept-day topics (S28-S30) have no Standard lab: the page simulators give their practice and the Concept-day exercise blocks run on the platform. The S33 Project-day topics are applied in step 3 of the course project. Review pages have no lab: the Review-day "Practice without AI" block runs on the platform. The educational critic confirms each omission.
- The S33 and FT19 Project rows and the Fast Project blocks are not coding labs; they use the cumulative course project in the next section.
- `course.json` `courseLabs` and each `module.json` `moduleLabs` stay empty until a lab is authored; each topic covered by a module lab records `lab: "module:<module>"` and its `lab` artifact absent with the planned path.

## Course project: Fast increments and project-row briefs

Two captain decisions shape one planned artifact, the cumulative course project `react/coding-lab/`:

- pep-project-rows, option A: each calendar Project row (S33 Standard, FT19 Fast Project implementation) gets one reusable learner-facing project brief with outcomes, prerequisite alignment, a starter scaffold and public language-native tests.
- pep-fast-project-block, option A (inventory amendment 1): every Fast-template day has a 70-minute Project block, so this course's Fast days FT16, FT17, FT18 and FT20 each get one teach-before-apply increment of one cumulative reusable project, building toward the FT19 brief. Each increment is presented as a project increment, never a coding lab, and optional Standard extensions are not a deliverable.

Both are already-authorized inventory items, not new syllabus. One canonical artifact serves the Standard and Fast overlays and is never duplicated; no container engine in learner setup; reference solutions and hidden tests stay in uncommitted private staging only.

| Step | Kind | Fast day (Standard day) | Outcomes | Applies topics | Starter |
|---|---|---|---|---|---|
| 1 | Fast increment | FT16 (Standard: not used; S28-S29 are Concept days) | A records list screen from fixture data: components with props, a conditional empty view, add and remove items through immutable state updates, list items with stable keys | `components-and-jsx`, `props`, `project-structure`, `conditional-display`, `usestate`, `updating-state-immutably`, `rendering-lists-with-keys` | Vite React starter scaffold with fixtures and step-1 public tests |
| 2 | Fast increment | FT17 (Standard: not used; S31 has its own module lab) | Load the list through a stubbed `fetch` with loading, error and empty states; list and detail routes with a `:id` parameter and navigation; selection state lifted to a common parent; a `use...` hook for loading | `loading-data-with-useeffect`, `loading-and-error-states`, `custom-hooks`, `routing-and-route-parameters`, `navigation`, `what-makes-a-component-re-render`, `lifting-state-up` | Extends step 1; reuses the S31 module lab's fetch stub and test helpers where they cover the same skills |
| 3 | S33 project-row brief, reused as the FT18 increment | FT18 (Standard: S33 Project day) | Create, edit and delete records through the API with controlled, labelled forms, field- and form-level error messages and a disabled submit while saving | `controlled-forms`, `create-edit-and-delete-against-the-api`, `handling-submission-errors-in-forms`, `accessible-forms` | Extends step 2 (Standard S33 starts from the provided step-2 state) |
| 4 | FT19 project-row brief | FT19 (Standard: S34 module lab covers the same objectives) | Sign in with the chosen credential type, keep the user in context, guard routes and role-based screens, handle 401 and 403, and run against the secured back end | `sharing-state-with-context`, `login-with-a-session-cookie-or-jwt`, `protected-pages-and-role-based-screens`, `handling-401-and-403-redirect-and-sign-out`, `turning-off-the-dev-profile` | Extends step 3 |
| 5 | Fast increment | FT20 (Standard: not used; S33 learners write their UI tests inside step 3) | Write Testing Library tests for the project's screens that query by role and label, using `findBy` for loaded data and user-event for typing and clicking | `ui-tests-with-testing-library-querying-by-role-and-label` | Extends step 4 with test stubs |

- Location and id: one course-scope directory `react/coding-lab/` (id `react/coding-lab`, allowed on main since #10) in the lab-contract layout: `lab.json`, `README.md` with one brief per step, `starter/` (the scaffold, extended per step), public `tests/` grouped per step, `fixtures/` and `expected/`. It sits at course level because the steps span all four modules and each module directory already holds or may hold its own Standard Lab-day lab. It enters `course.json` `courseLabs` only once authored.
- One test command: `npm test` (Vitest, React Testing Library and user-event in jsdom, on Node.js 24 LTS) after a one-time `npm ci`. Each step ships its public tests with its scaffold extension, so a learner's run covers the steps reached so far; the starter fails the current step's named tests with stable messages until it is complete. API calls go through a stubbed `fetch` with fixed fixtures; no Spring Boot server, database or container is needed for the tests (step 4's run against the secured back end is a manual check in the brief, not a test dependency).
- Teach before apply: on Fast days the template runs Warm-up, Skim (topic pages) and a Try-first diagnostic (MCQ and coding) before the Project block, so each increment applies the day's topic pages after the skim and the diagnostic, which serves as the short teach-then-check step before first use; every other applied concept is taught on an earlier Fast day or in the `html-css-js` and `spring-boot` courses. Step 3 applies `accessible-forms` from the same FT18 skim. On Standard, step 3 applies S28-S32 topics taught before S33 plus the three S33 topic pages as in-build references (the Project day type has no reading block); the educational critic of the project decides whether that same-day use is acceptable.
- FT20 pacing: FT20 also carries the 45-minute module check (open pacing item above), so how step 5 and the check share FT20's 120 minutes is part of that same open item for the Fast overlay and the platform assessment owner.
- Authoring: course-scope files cannot ride a module PR (`docs/workflow.md` section 4), so `react/coding-lab/` is authored in one course-level PR after all four module PRs merge, with its own education and SME criticism.
- Topic manifests: core topics whose only practice is the page simulator on Standard record `lab: "course:react"`; topics covered by a Standard module lab keep `lab: "module:<module>"`. Every core topic's lab reason names its course-project step on the Fast track. The two review pages are not applied in a step.

## Minute budgets

Rule (`docs/tools/validators.md`, new-course budget rule): each integer topic budget is at least `ceil(max(estimator P50, modeledWorstPath))`, capped at 15 minutes; day pools are never divided into weighted shares to lower a budget; T14 sums budgets per calendar day against the day type's 120-minute block total and never compresses.

Basis at intake: no page exists, so the estimator cannot run. Each topic records planning targets: `modeledP50` 8 and `modeledWorstPath` 10 (two wrong graded attempts and wrong-first explores per interactive unit), set just above the measured course-1 range (estimator P50 4.78-7.95, worst path 6-9.35). By the rule, `budget` = ceil(max(8, 10)) = 10 and `aboutLabel` = 10 covers the worst path. The module PR replaces both modelled values with the estimator's P50 on the page bytes and the authored worst-path model, and re-derives `budget` and `aboutLabel` by the same rule.

| Day | Day type | Topics mapped | Planned budget total | Ceiling total (all at 15) | Day block total |
|---|---|---|---|---|---|
| S28 | Concept | 4 | 40 | 60 | 120 |
| S29 | Concept | 3 | 30 | 45 | 120 |
| S30 | Concept | 3 | 30 | 45 | 120 |
| S31 | Lab | 4 | 40 | 60 | 120 |
| S32 | Lab | 3 | 30 | 45 | 120 |
| S33 | Project | 3 | 30 | 45 | 120 |
| S34 | Lab | 4 | 40 | 60 | 120 |
| S35 | Review | 2 | 20 | 30 | 120 |
| FT16 | Fast | 7 | 70 | 105 | 120 |
| FT17 | Fast | 7 | 70 | 105 | 120 |
| FT18 | Fast | 4 | 40 | 60 | 120 |
| FT19 | Project implementation (source snapshot dayType: Lab) | 5 | 50 | 75 | 120 |
| FT20 | Fast | 3 | 30 | 45 | 120 |

No React day maps more than 7 topics, and 7 × 15 = 105 ≤ 120, so the honest-minimum rule cannot overflow any React day even if every page reaches the 15-minute ceiling. Fast days pack two Standard days into 120 minutes; the pages exceed the Fast day's 10-minute Skim block, which is a platform pacing matter reported, not compressed (plan section 2.4).

## S35/FT20 assessment blueprint

`react/assessments/web-and-react-module-check/blueprint.json`:

- Calendar identity copied verbatim from the snapshot S35 and FT20 `assessment` objects (identical): `kind` `moduleCheck`, `formats` `MCQ` and `coding`, `passMark` 70. `dayId` is `S35`; FT20 maps to the same blueprint. The calendar gives no weights or cut scores, so `weights` is empty.
- Objectives covered: 21 exact `react/<module>/<topic>#oN` references, a representative set across all four modules that the items can directly elicit; `objectiveFormats` maps each to MCQ or coding. `what-makes-a-component-re-render#o1` is now non-exhaustive (react-intake-sme-03), so its MCQ expectation is the two triggers taught by S31/FT17.
- **Known gap, coverage incomplete (react-edu-001, accepted and sequenced):** the check is named Web and React, but no `html-css-js` objective is listed yet; the Web half is represented only by `javascript-fundamentals-review` o1 and o2. The `html-css-js` intake lands first; this blueprint is then rebased to add a representative set of the merged `html-css-js` objective ids, mapped to the existing MCQ or coding formats within the 15-item, 2-task, 45-minute plan. No id is invented here. Until then the blueprint is not the finished Web and React coverage map. (The blueprint schema has no notes field, so this note lives here.)

  - `react/components-and-state/props#o3` (MCQ)
  - `react/components-and-state/conditional-display#o2` (MCQ)
  - `react/components-and-state/usestate#o3` (MCQ)
  - `react/components-and-state/rendering-lists-with-keys#o2` (MCQ)
  - `react/effects-routing-and-rendering/loading-data-with-useeffect#o2` (MCQ)
  - `react/effects-routing-and-rendering/loading-and-error-states#o2` (MCQ)
  - `react/effects-routing-and-rendering/what-makes-a-component-re-render#o1` (MCQ)
  - `react/forms-context-and-crud/accessible-forms#o1` (MCQ)
  - `react/forms-context-and-crud/sharing-state-with-context#o3` (MCQ)
  - `react/forms-context-and-crud/ui-tests-with-testing-library-querying-by-role-and-label#o2` (MCQ)
  - `react/auth-and-review/login-with-a-session-cookie-or-jwt#o1` (MCQ)
  - `react/auth-and-review/protected-pages-and-role-based-screens#o3` (MCQ)
  - `react/auth-and-review/handling-401-and-403-redirect-and-sign-out#o1` (MCQ)
  - `react/auth-and-review/javascript-fundamentals-review#o1` (MCQ)
  - `react/auth-and-review/javascript-fundamentals-review#o2` (MCQ)
  - `react/components-and-state/updating-state-immutably#o2` (coding)
  - `react/components-and-state/rendering-lists-with-keys#o1` (coding)
  - `react/effects-routing-and-rendering/lifting-state-up#o2` (coding)
  - `react/forms-context-and-crud/controlled-forms#o1` (coding)
  - `react/forms-context-and-crud/controlled-forms#o2` (coding)
  - `react/effects-routing-and-rendering/loading-and-error-states#o1` (coding)

- Item counts and duration, from the S35 Review-day "Module check" block (MCQ + coding assessment, 45 minutes):
  - MCQ: 15 items in about 15 minutes, about 1 minute per scenario-based item (the course-1 pace).
  - coding: 2 short React tasks in about 30 minutes, about 15 minutes each (task 1: list and state update with lifted state; task 2: controlled form with loading and error states).
  - `durationMinutes` 45 = the calendar block.
- Track scope (react-edu-002): the one-sitting, 45-minute instruction applies to S35 on the Standard track. FT20 is a Fast day with no dedicated module-check block (its blocks are Warm-up 5, Skim 10, Try-first diagnostic 15, Project 70, Timed without AI 15, Reflection 5), so the learner instruction for FT20 says only that the same check is taken that day and the platform shows when. **Open pacing item** for the Fast overlay and the platform assessment owner: which FT20 blocks the 45-minute check replaces or combines, keeping FT20 within 120 minutes. No Fast schedule is stated and no policy or second blueprint is invented.
- Allowed resources: the calendar states no AI or other resource rule for the S35 "Module check" block, so the blueprint invents none; the platform assessment owner sets and shows any rule. The coding part uses the coding environment the assessment platform provides.
- The blueprint holds no items, keys, correct answers, rubrics, scoring guides, hidden tests, reference solutions or score secrets; gates T01 and T07 check its key names.

## Official sources per topic

Every source below was fetched live on 2026-10-12; `evidence/react/source-snapshot.json` records each of the 78 URLs with retrieval time, sha256 of the fetched bytes and the topic sections used. All returned HTTP 200. Raw fetched pages are not committed. Version-specific baseline: React 19.3 (react.dev versions page), React Router 8.4.0 docs at reactrouter.com (declarative mode), Vite 8.3.4, Vitest 5.0.4, Testing Library docs, Node.js 24 LTS, Spring Boot and Spring Security reference docs (current).

Freshness: every `topic.json` records `unverified` with no `checkedAt`, because no page is authored yet; the module PR's SME critic verifies each claim against these frozen sources.

| Topic | Official sources |
|---|---|
| `components-and-jsx` | https://react.dev/learn/your-first-component<br>https://react.dev/learn/writing-markup-with-jsx<br>https://react.dev/learn/javascript-in-jsx-with-curly-braces<br>https://react.dev/versions<br>https://registry.npmjs.org/react/latest<br>https://registry.npmjs.org/react-dom/latest |
| `props` | https://react.dev/learn/passing-props-to-a-component |
| `project-structure` | https://react.dev/learn/build-a-react-app-from-scratch<br>https://vite.dev/guide/<br>https://react.dev/learn/importing-and-exporting-components<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules<br>https://registry.npmjs.org/vite/latest |
| `conditional-display` | https://react.dev/learn/conditional-rendering |
| `usestate` | https://react.dev/reference/react/useState<br>https://react.dev/learn/state-a-components-memory<br>https://react.dev/learn/state-as-a-snapshot |
| `updating-state-immutably` | https://react.dev/learn/updating-objects-in-state<br>https://react.dev/learn/updating-arrays-in-state<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax |
| `rendering-lists-with-keys` | https://react.dev/learn/rendering-lists |
| `loading-data-with-useeffect` | https://react.dev/reference/react/useEffect<br>https://react.dev/learn/synchronizing-with-effects<br>https://react.dev/learn/you-might-not-need-an-effect<br>https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch<br>https://developer.mozilla.org/en-US/docs/Web/API/AbortController |
| `loading-and-error-states` | https://react.dev/learn/reacting-to-input-with-state<br>https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch<br>https://developer.mozilla.org/en-US/docs/Web/API/Response/ok |
| `custom-hooks` | https://react.dev/learn/reusing-logic-with-custom-hooks |
| `routing-and-route-parameters` | https://reactrouter.com/start/modes<br>https://reactrouter.com/start/declarative/routing<br>https://reactrouter.com/start/declarative/url-values<br>https://reactrouter.com/api/hooks/useParams<br>https://registry.npmjs.org/react-router/latest |
| `navigation` | https://reactrouter.com/start/declarative/navigating<br>https://reactrouter.com/api/hooks/useNavigate |
| `what-makes-a-component-re-render` | https://react.dev/learn/render-and-commit<br>https://react.dev/learn/state-as-a-snapshot<br>https://react.dev/reference/react/memo |
| `lifting-state-up` | https://react.dev/learn/sharing-state-between-components |
| `controlled-forms` | https://react.dev/reference/react-dom/components/input<br>https://react.dev/reference/react-dom/components/form |
| `accessible-forms` | https://www.w3.org/WAI/tutorials/forms/labels/<br>https://www.w3.org/WAI/tutorials/forms/notifications/<br>https://www.w3.org/WAI/tutorials/forms/validation/<br>https://www.w3.org/TR/WCAG22/<br>https://html.spec.whatwg.org/multipage/forms.html |
| `sharing-state-with-context` | https://react.dev/learn/passing-data-deeply-with-context<br>https://react.dev/reference/react/useContext |
| `create-edit-and-delete-against-the-api` | https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch<br>https://developer.mozilla.org/en-US/docs/Web/API/RequestInit<br>https://www.rfc-editor.org/rfc/rfc9110.html<br>https://react.dev/learn/updating-arrays-in-state |
| `handling-submission-errors-in-forms` | https://developer.mozilla.org/en-US/docs/Web/API/Response/ok<br>https://www.rfc-editor.org/rfc/rfc9110.html<br>https://www.w3.org/WAI/tutorials/forms/notifications/<br>https://www.w3.org/WAI/tutorials/forms/validation/ |
| `ui-tests-with-testing-library-querying-by-role-and-label` | https://testing-library.com/docs/react-testing-library/intro/<br>https://testing-library.com/docs/queries/about/<br>https://testing-library.com/docs/queries/byrole/<br>https://testing-library.com/docs/queries/bylabeltext/<br>https://testing-library.com/docs/user-event/intro<br>https://vitest.dev/guide/<br>https://vitest.dev/guide/environment<br>https://registry.npmjs.org/@testing-library/react/latest<br>https://registry.npmjs.org/@testing-library/user-event/latest<br>https://registry.npmjs.org/vitest/latest<br>https://registry.npmjs.org/jsdom/latest |
| `login-with-a-session-cookie-or-jwt` | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies<br>https://www.rfc-editor.org/rfc/rfc6265.html<br>https://www.rfc-editor.org/rfc/rfc7519.html<br>https://www.rfc-editor.org/rfc/rfc8725.html<br>https://www.rfc-editor.org/rfc/rfc9110.html<br>https://developer.mozilla.org/en-US/docs/Web/API/RequestInit<br>https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html<br>https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html |
| `protected-pages-and-role-based-screens` | https://reactrouter.com/api/components/Navigate<br>https://reactrouter.com/start/declarative/routing<br>https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html |
| `handling-401-and-403-redirect-and-sign-out` | https://www.rfc-editor.org/rfc/rfc9110.html<br>https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/401<br>https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403<br>https://reactrouter.com/api/hooks/useNavigate |
| `turning-off-the-dev-profile` | https://docs.spring.io/spring-boot/reference/features/profiles.html<br>https://docs.spring.io/spring-security/reference/servlet/authorization/authorize-http-requests.html<br>https://vite.dev/guide/env-and-mode |
| `javascript-fundamentals-review` | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function<br>https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules |
| `react-review` | https://react.dev/learn/updating-arrays-in-state<br>https://react.dev/learn/rendering-lists<br>https://react.dev/reference/react/useEffect<br>https://developer.mozilla.org/en-US/docs/Web/API/Response/ok<br>https://react.dev/versions |
| lab plan | https://nodejs.org/api/test.html<br>https://nodejs.org/en/about/previous-releases<br>https://docs.npmjs.com/cli/v11/commands/npm-ci<br>https://vitest.dev/guide/<br>https://vitest.dev/guide/environment<br>https://registry.npmjs.org/vitest/latest |

Source gaps (unreachable at intake, recorded rather than replaced by an invented source):

- `https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html` returned HTTP 404 on 2026-10-12. It was a candidate supplementary source for `login-with-a-session-cookie-or-jwt`; RFC 7519, RFC 8725 and the OWASP HTML5 Security Cheat Sheet (Storage APIs) cover the topic, so no replacement was added.

Calendar references for the `react` technology: [react.dev: Learn React](https://react.dev/learn), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

## Discrepancy closure

- `source-gap-react-modules` (category A, sequenced to this intake): closed by the second-mate grouping decision in Module map, subject to intake criticism and merge approval.
- `source-gap-react-official-evidence` (category A, sequenced to this intake): closed by the live first-party source freeze with hashes in `evidence/react/source-snapshot.json`.
- `conflict-ft19-lab-label` (category A, resolved): applied as recorded; the snapshot is unchanged and FT19 carries no coding lab.
- Category-B production omissions for `react` (missing pages, quizzes, simulators and text alternatives) stay production backlog for the module PRs.

## Intake criticism

Fresh independent educational and technology-SME critics reviewed the first intake commit (blueprint sha256 `49daaabb24dd18b313eb78aad5c80cd7379cab7d6ce46e522a1e2e3fa2e4afcb`, plus every manifest and this file). Their reports and the non-author reconciliation are committed verbatim as `intake-critic-education.json`, `intake-critic-sme.json` and `intake-reconciliation.json`; the reconciliation adds only `file` and `fixedInSha256` for each applied decision. Outcome: 7 findings, all accepted, applied in one correction loop together with the captain's project-row and Fast project-block decisions:

- react-edu-001 (high): accepted and sequenced; recorded as a known gap above, closed after the `html-css-js` intake merges.
- react-edu-002 (medium): blueprint instructions scoped to S35; FT20 pacing recorded as open.
- react-edu-003 (medium): `accessible-forms` removed as a prerequisite of `handling-submission-errors-in-forms`; just-in-time notification teaching recorded.
- react-edu-004 (low): FT19 relabelled Project implementation (source snapshot dayType: Lab) in the day tables.
- react-intake-sme-01, -02, -03 (medium): objective wording corrected in `loading-and-error-states`, `handling-401-and-403-redirect-and-sign-out`, `what-makes-a-component-re-render`, `sharing-state-with-context` and `react-review`.

The high finding stays open for gate T25 until a same-role recheck resolves it after the sequenced `html-css-js` ids are added.
