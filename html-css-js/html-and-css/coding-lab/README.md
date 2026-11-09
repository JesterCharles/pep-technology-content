# HTML and CSS lab: Trail Guides

Standard track, S21 Lab day: about 90 minutes. Fast Track skips this lab; Fast learners practise the same rules in the course project, and can use this lab as optional remediation.

## Goal

Turn the Trail Guides page in `starter/` into a responsive, mobile-first layout, then repair its sign-up corner: semantic structure, labelled inputs, built-in validation and accessible controls. You decide which rule or element produces each outcome below. When you finish, the page works from a 400px phone to a wide desktop screen with no sideways scrolling, and the sign-up form is one a browser, a keyboard and a screen reader all understand.

This lab practises these topics: Flexbox; Grid; Responsive, mobile-first layout (tasks 1 to 6); Semantic HTML page structure; Forms and HTML5 validation; Accessibility basics (tasks 7 to 10). Read those topic pages first; each task names the page section that teaches what it needs.

## What the tests check, and what they do not

- Tasks 1 to 3 read `starter/index.html` and `starter/styles.css` and check that each outcome is set up with the layout tool named in the task.
- Tasks 4 and 5 also open your page in the pinned headless Chromium at the breakpoint boundaries and at the documented 700px and 1100px checks. They measure the card columns and page regions, so valid custom-property indirection is welcome when it produces the required layout.
- Task 6 measures the page at 400px: it must not scroll sideways, and the hero picture must stay inside its box. Hiding the overflow does not count; the test measures the content with nothing hidden.
- Tasks 7 to 10 inspect the rendered sign-up corner in the same pinned Chromium: the element and heading structure, whether the browser itself associates each label with its input, what `checkValidity` blocks and accepts, and whether the submit control takes keyboard focus.
- The tests do not assess colours and spacing. Section "Check it in a browser" lists what to inspect yourself.

## Prerequisites

- Node.js 22.12 or later, with npm 10 or later (npm comes with Node.js). Check both in a terminal:

  ```sh
  node --version
  npm --version
  ```

  Expected: `v22.12.0` or higher, and `10.0.0` or higher.
- About 200 MB of free disk space for the test browser, and a network connection for the one-time setup.
- A text editor and a desktop browser (Chrome, Edge, Firefox or Safari).
- No Docker or other container engine is used.

## Setup

1. Open a terminal in this folder, `coding-lab/`, the folder that holds this README.
2. Go into `starter/` and install the test browser once:

   ```sh
   cd starter
   npm ci
   cd ..
   ```

   `npm ci` installs the pinned test tool (Playwright 1.55.1) from `starter/package-lock.json` and downloads a headless Chromium into `starter/node_modules/`. Nothing is installed outside this lab folder. Expect it to finish with a line such as `added 3 packages`.
3. Back in `coding-lab/`, run the tests once before you change anything:

   ```sh
   node --test --test-reporter=spec
   ```

   All eleven tests fail, and each message names the outcome that is still missing. This is the expected start.

## Tasks

Work only in `starter/index.html` and `starter/styles.css`. Everything else is the lab's fixed support and stays as shipped: `starter/badge.svg`, the starter's package files, the tests in `tests/` and `expected/on-completion.txt`. A task counts as done only when the shipped tests for it pass exactly as shipped. Each `TODO` comment in `styles.css` marks where a layout task starts, and the `Tasks 7 to 10` comment in `index.html` marks the sign-up corner. After each task, run `node --test --test-reporter=spec` again from `coding-lab/`: the test for that task changes from `✖` to `✔`. If you are stuck, open the hints one at a time; none of them gives the full rule.

### Task 1: phones use their own width

- **Where:** `starter/index.html`, inside `<head>`, where the `Task 1` comment is.
- **Outcome:** a phone lays the page out at its own screen width and starts at normal zoom, instead of at about 980px shrunk to fit.
- **Done when:** `task 1: a phone lays the page out at its own width, at normal zoom` passes.
- **Hint 1:** this is a `meta` element, not CSS. Topic page: Responsive, mobile-first layout, step 3.
- **Hint 2:** its `name` is `viewport`, and its `content` sets two things: the layout width and the starting scale.

### Task 2: the header's two ends

- **Where:** `starter/styles.css`, the `.site-header` rule.
- **Outcome:** the site name sits at the left end of the header and the nav at the right end, both centred vertically.
- **Done when:** `task 2: the site name and the nav sit at opposite ends of the header, centred vertically` passes.
- **Hint 1:** the header's two children form one row along one axis. Topic page: Flexbox, steps 2 and 3.
- **Hint 2:** you need three declarations: one that turns the header into a flex container, one for the main axis and one for the cross axis.

### Task 3: nav links in a row

- **Where:** `starter/styles.css`, the `.site-nav ul` rule.
- **Outcome:** the three nav links sit side by side, with a fixed space between neighbours.
- **Done when:** `task 3: the nav links sit side by side with space between them` passes.
- **Hint 1:** the list becomes a flex container; its items stay in source order.
- **Hint 2:** the space between neighbours, never at the outer edges, comes from one property that takes a length. Topic page: Flexbox, step 3.

### Task 4: mobile-first cards

- **Where:** `starter/styles.css`, the `.cards` rule and the media query under it.
- **Outcome:** on a phone-width screen the trail cards are one column; from 600px wide they are two equal columns. The CSS is written mobile-first.
- **Done when:** `task 4: the trail cards are one column on phones and two columns from 600px` passes.
- **Hint 1:** the starter is desktop-first: its base layout is the wide one, and a query takes it back for narrow screens. Turn that around. Topic page: Responsive, mobile-first layout, step 2.
- **Hint 2:** the base rule describes one column of tracks; a query that matches 600px and wider describes two equal tracks. Remove any query that targets narrower screens.

### Task 5: the page regions from 1000px

- **Where:** `starter/styles.css`, after the task 4 query, and the four region rules.
- **Outcome:** from 1000px wide, the header spans the top, the trails (`main`) and the gear checklist (`aside`) sit side by side, and the footer spans the bottom. Below 1000px the regions stay stacked.
- **Done when:** `task 5: from 1000px, the header and footer span the page and the gear checklist sits beside the trails` passes, and so does `task 4 and 5: the stylesheet is mobile-first, adding wider-screen rules from small to large`.
- **Hint 1:** name each region's area on `.site-header`, `.site-main`, `.site-aside` and `.site-footer`, using the names `header`, `main`, `aside` and `footer`. Topic page: Grid, step 3.
- **Hint 2:** inside a query for 1000px and wider, `.page` becomes a grid with two columns and a three-row area map. Write this query after the 600px one.

### Task 6: no sideways scrolling at 400px

- **Where:** `starter/styles.css`, the `.page` rule, and a new rule for the hero picture.
- **Outcome:** at 400px wide the page fits the screen without scrolling sideways, and the hero picture shrinks to stay inside its box, with nothing hidden.
- **Done when:** `task 6: at 400px wide the page does not scroll sideways, and the hero picture stays inside its box` passes.
- **Hint 1:** two things are wider than a phone: a fixed page width and a picture drawn at its natural 800px. Topic page: Responsive, mobile-first layout, step 4.
- **Hint 2:** let the page be narrower than its widest size instead of fixed, and give the picture an upper limit relative to its container that keeps its proportions.

### Task 7: the sign-up corner joins the page structure

- **Where:** `starter/index.html`, the sign-up corner below the trail cards.
- **Outcome:** the sign-up corner is a standalone page region with its own heading: its wrapper is the matching semantic element (keep `class="signup"` and the form inside it), and its heading continues the page outline from the `h1` without skipping levels.
- **Done when:** `task 7: the sign-up corner is a section whose heading fits the page outline` passes.
- **Hint 1:** a region with its own heading that stands on its own is one specific semantic element, not a `div`. Topic page: Semantic HTML page structure, step 2.
- **Hint 2:** the page's outline is `h1` then one level deeper; the pasted-in heading jumped two levels too far.

### Task 8: labels the browser understands

- **Where:** `starter/index.html`, the three fields in the sign-up form.
- **Outcome:** each input's loose text becomes a visible label element that the browser programmatically associates with that input, so clicking the label focuses the field and a screen reader announces it.
- **Done when:** `task 8: every sign-up input has a label the browser connects to it` passes.
- **Hint 1:** looking labelled is not being labelled: the association is made in markup, not by nearness. Topic page: Forms and HTML5 validation, step 1.
- **Hint 2:** a `label` points at an input's `id` with one attribute; each input already has its `id`.

### Task 9: the browser blocks an invalid sign-up

- **Where:** `starter/index.html`, the same three inputs.
- **Outcome:** an empty name, an empty or malformed email, or a group size outside 1 to 6 is blocked by the browser itself before anything is sent: name required; email required with the address-checking type; group size required with its stated bounds.
- **Done when:** `task 9: the browser blocks an empty or invalid sign-up before it is sent` passes.
- **Hint 1:** these are attributes on the inputs, no JavaScript involved. Topic page: Forms and HTML5 validation, steps 2 and 3.
- **Hint 2:** the group size already has `type="number"`; it still needs `required` and its two bounds. Remember the topic page's caution: the server must validate again even when the browser blocks bad input first.

### Task 10: a real button and a described badge

- **Where:** `starter/index.html`, the badge image and the fake button.
- **Outcome:** the badge image carries alt text that says what it shows, and the "Request a spot" control is a native submit button that takes keyboard focus, instead of a `div` with a `button` role.
- **Done when:** `task 10: the badge has alt text and the submit control is a real button` passes.
- **Hint 1:** when a native element gives the behavior, prefer it over ARIA on a generic one: the native button is focusable and announceable with no extra attributes. Topic page: Accessibility basics, step 2.
- **Hint 2:** inside a form, give the button its explicit `type`. Then press Tab through the page: the button now takes focus, which the `div` never did.

## How to test

From `coding-lab/`, run the one test command:

```sh
node --test --test-reporter=spec
```

While you work, failing tests show `✖` and a message naming the missing outcome. Tasks 4 to 10 open the test browser, so the command takes a few seconds. When every task is done, all eleven show `✔`.

## Expected output

When you are finished, the output matches `expected/on-completion.txt`, apart from the timings, which differ on every run (shown there as `<ms>`):

```text
✔ task 1: a phone lays the page out at its own width, at normal zoom (<ms>ms)
✔ task 2: the site name and the nav sit at opposite ends of the header, centred vertically (<ms>ms)
✔ task 3: the nav links sit side by side with space between them (<ms>ms)
✔ task 4: the trail cards are one column on phones and two columns from 600px (<ms>ms)
✔ task 5: from 1000px, the header and footer span the page and the gear checklist sits beside the trails (<ms>ms)
✔ task 4 and 5: the stylesheet is mobile-first, adding wider-screen rules from small to large (<ms>ms)
✔ task 6: at 400px wide the page does not scroll sideways, and the hero picture stays inside its box (<ms>ms)
✔ task 7: the sign-up corner is a section whose heading fits the page outline (<ms>ms)
✔ task 8: every sign-up input has a label the browser connects to it (<ms>ms)
✔ task 9: the browser blocks an empty or invalid sign-up before it is sent (<ms>ms)
✔ task 10: the badge has alt text and the submit control is a real button (<ms>ms)
ℹ tests 11
ℹ pass 11
ℹ fail 0
```

## Check it in a browser

Open `starter/index.html` in your browser (double-click it, or drag it onto a browser window), then open the developer tools and turn on device mode (responsive design mode in Firefox and Safari).

- At 400px wide: the cards are in one column, and the page does not scroll sideways.
- At 700px wide: the cards are in two columns.
- At 1100px wide: the gear checklist sits to the right of the trails, and the header and footer span the full width.
- At every width: the site name and nav are at opposite ends of the header, and the nav links are in one row.
- In the sign-up corner: clicking each label focuses its input; pressing Tab reaches every field and the button; submitting with an empty or wrong field shows the browser's own message bubble at the first invalid input.

## Offline note

Only setup needs the network, once, to download the pinned test tool and its browser. After that, the tests run fully offline: the page uses no web fonts, images or scripts from elsewhere, and the test blocks any network request.

## Cleanup

Delete `starter/node_modules/` to remove the test tool and its browser; the tests create nothing else. To start your work again from scratch, copy `starter/index.html` and `starter/styles.css` back from a fresh copy of this lab.

## Troubleshooting

- `node: command not found`, or a version below 22.12: install Node.js 22.12 or later from nodejs.org, then open a new terminal.
- `The test browser is not installed yet`: run `npm ci` inside `starter/` (Setup, step 2), then run the tests again from `coding-lab/`.
- `npm ci` fails while downloading: check your network connection and run it again; it resumes from a clean install.
- No tests run, or `Could not find`: run the test command from the `coding-lab/` folder, the one that holds this README.
- A test still fails after your change: read its message, then the task's hints. Check that the selector is spelled as in the starter (for example `.site-nav ul`) and that wider layouts begin at the stated breakpoint.
- Task 6 still says the page scrolls sideways: look for anything with a fixed width wider than 400px in the base styles, including the picture.
- Task 8 still finds no label: the `for` attribute must match the input's `id` exactly, and the label needs visible text.
- Task 9 accepts bad input: check each attribute is on the input element itself, spelled as the browser expects (`required`, `type`, `min`, `max`).
- The page looks unstyled in the browser: keep `<link rel="stylesheet" href="styles.css">` in `index.html` and keep both files in `starter/`.
