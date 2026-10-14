# HTML and CSS layout lab: Trail Guides

Standard track, S21 Lab day: about 62 minutes. Fast Track skips this lab; Fast learners practise the same layout rules in the course project.

## Goal

Turn the Trail Guides page in `starter/` into a responsive, mobile-first layout. You will use Flexbox for the header and the nav links, Grid for the trail cards and the page regions, `min-width` media queries for wider screens, and the viewport meta element. When you finish, the page has no sideways scrolling at 400px.

This lab practises these topics: Flexbox, Grid, and Responsive, mobile-first layout. Read those three topic pages first.

## What the tests check, and what they do not

The tests read `starter/index.html` and `starter/styles.css` and check the layout rules in this README: which properties and media queries you wrote. They do not open a browser, so they cannot see how the page looks. Section "Check it in a browser" lists what to look at yourself.

## Prerequisites

- Node.js 22.12 or later. Check it in a terminal:

  ```sh
  node --version
  ```

  Expected: `v22.12.0` or a higher version number. The tests use Node's built-in test runner, so there is nothing to install.
- A text editor and a desktop browser (Chrome, Edge, Firefox or Safari).
- No Docker or other container engine is used.

## Setup

1. Open a terminal in this folder, `coding-lab/`, the folder that holds this README.
2. Run the setup check:

   ```sh
   node --version
   ```

   You should see `v22.12.0` or later. Nothing else needs to be installed or downloaded.
3. Run the tests once before you change anything:

   ```sh
   node --test --test-reporter=spec
   ```

   All seven tests fail. Each failure message says what to add. This is the expected start.

## Tasks

Work in `starter/index.html` and `starter/styles.css`. Each `TODO` comment in `styles.css` marks where a task starts. After each task, run `node --test --test-reporter=spec` again: the test for that task changes from `✖` to `✔`.

1. **Viewport meta element.** In `starter/index.html`, replace the comment `Task 1` inside `<head>` with:

   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1">
   ```

   Done when `task 1: index.html has the viewport meta element` passes.
2. **Header with Flexbox.** In `styles.css`, in the `.site-header` rule, add `display: flex;`, `justify-content: space-between;` and `align-items: center;`. Expect the site name on the left and the nav on the right, centred vertically. Done when the `task 2` test passes.
3. **Nav links in a row.** In the `.site-nav ul` rule, add `display: flex;` and a gap, for example `gap: 16px;`. Expect the three links side by side with space between them. Done when the `task 3` test passes.
4. **Mobile-first cards.** Rewrite the cards. Change the base `.cards` rule to one column, `grid-template-columns: 1fr;`. Delete the `@media (max-width: 599px)` block. Add a new block after the base rules:

   ```css
   @media (min-width: 600px) {
     .cards { grid-template-columns: repeat(2, 1fr); }
   }
   ```

   Done when the `task 4` test passes.
5. **Page regions with Grid.** Give each region its area name in the base styles: `.site-header { grid-area: header; }`, and the same for `.site-main` (`main`), `.site-aside` (`aside`) and `.site-footer` (`footer`). Then add a second media query after the 600px one:

   ```css
   @media (min-width: 1000px) {
     .page {
       display: grid;
       grid-template-columns: 1fr 300px;
       grid-template-areas: "header header" "main aside" "footer footer";
     }
   }
   ```

   Done when `task 5` and `task 4 and 5: every media query is min-width, written from small to large` pass.
6. **No sideways scrolling at 400px.** In the `.page` rule, replace `width: 960px;` with `max-width: 1200px;`. Add a rule so the hero picture shrinks with its container: `.hero svg { max-width: 100%; height: auto; }`. Done when the `task 6` test passes.

## How to test

From this folder, run the one test command:

```sh
node --test --test-reporter=spec
```

While you work, failing tests show `✖` and a message naming what is missing. When every task is done, all seven show `✔`.

## Expected output

When you are finished, the output matches `expected/on-completion.txt`, apart from the timings, which differ on every run (shown there as `<ms>`):

```text
✔ task 1: index.html has the viewport meta element (<ms>ms)
✔ task 2: .site-header puts the name and nav at opposite ends, centred vertically (<ms>ms)
✔ task 3: .site-nav ul is a flex row with a gap (<ms>ms)
✔ task 4: .cards is one column in the base styles and two from 600px (<ms>ms)
✔ task 5: from 1000px, .page places the regions with grid-template-areas (<ms>ms)
✔ task 4 and 5: every media query is min-width, written from small to large (<ms>ms)
✔ task 6: nothing in the base styles is wider than 400px, and the hero picture shrinks to fit (<ms>ms)
ℹ tests 7
ℹ pass 7
ℹ fail 0
```

## Check it in a browser

The tests cannot see the page, so check these by hand. Open `starter/index.html` in your browser (double-click it, or drag it onto a browser window), then open the developer tools and turn on device mode (responsive design mode in Firefox and Safari).

- At 400px wide: the cards are in one column, and the page does not scroll sideways.
- At 700px wide: the cards are in two columns.
- At 1100px wide: the gear checklist sits to the right of the trails, and the header and footer span the full width.
- At every width: the site name and nav are at opposite ends of the header, and the nav links are in one row.

## Offline note

The tests and the page need no network. Node's test runner is built in, and the page uses no web fonts, images or scripts from elsewhere.

## Cleanup

The tests only read files; they create nothing. To start again from scratch, copy `starter/index.html` and `starter/styles.css` back from a fresh copy of this lab. No other cleanup is needed.

## Troubleshooting

- `node: command not found`, or a version below 22.12: install Node.js 22.12 or later from nodejs.org, then open a new terminal.
- `Could not find '...tests'` or no tests run: run the command from the `coding-lab/` folder, the one that holds this README.
- A test still fails after you made the change: read its message. The tests read the rule text, so check the selector is spelled exactly as in this README (for example `.site-nav ul`) and that the property sits in the right place (base styles or the named media query).
- `task 4 and 5` fails with `max-width`: delete the old `@media (max-width: 599px)` block from task 4.
- The page looks unstyled in the browser: keep `<link rel="stylesheet" href="styles.css">` in `index.html` and keep both files in `starter/`.
