# Responsive, mobile-first layout

## Objectives

- Write base styles for a narrow screen and add min-width media queries for wider screens
- Explain what the viewport meta element changes on a mobile browser
- Adapt a layout so it has no horizontal scrolling at 400 px width

## Teaching

### Start with a guess

A page has this CSS, and its HTML includes the viewport meta element:

```
.cards { display: grid; grid-template-columns: 1fr; }
@media (min-width: 700px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}
```

Practice prediction, not scored.

### Narrow first, then add

Mobile-first CSS starts with the base styles, outside any media query, for the narrowest screen: usually one column. Then each `@media (min-width: Npx)` block adds changes for screens at least that wide.

- A `min-width` query matches at its width and everything wider.
- Write the queries from small to large: when two match, the later rule wins.
- Below the smallest breakpoint, no query matches, so only the base styles apply.

### What the viewport meta element changes

Without it, a mobile browser lays the page out as if the screen were about 980px wide, then shrinks the result to fit. Text becomes tiny, and your wide `min-width` queries match on a phone.

```
<meta name="viewport" content="width=device-width, initial-scale=1">
```

This tells the mobile browser to use the device's own width for layout, at normal zoom, so your narrow base styles apply. Desktop browsers ignore it, which is why the phone below is a drawn simulation.

### No sideways scrolling at 400px

Horizontal scrolling at 400px almost always comes from something wider than the screen:

- A fixed width such as `width: 450px`: use `width: auto`, a percentage or `max-width`.
- Media at its natural size: give images `max-width: 100%; height: auto;`.
- Long unbroken text such as a URL: add `overflow-wrap: anywhere;`.

Hiding the scrollbar with `overflow-x: hidden` is not a fix: it cuts the content off.

### Apply it to a new page

A blog shows its posts in one column on phones, two columns from 600px, and adds a sidebar column from 1000px. Pick the mobile-first CSS.

## Model

One stylesheet, many widths: base styles for the narrowest screen, then min-width queries that add columns as the screen widens.

Mobile-first breakpointsA width scale from narrow to wide. Below 600px: base styles, one column. From 600px: the first min-width query adds a second column. From 1000px: the second query adds a third column. narrow wide base: 1 ≥600px: 2 ≥1000px: 3

## Recap

- Mobile first: base styles for the narrow screen, then `min-width` media queries from small to large for wider screens.
- The viewport meta element makes a mobile browser lay the page out at the device width instead of about 980px, so the base styles apply at normal zoom.
- To avoid horizontal scrolling at 400px, remove fixed widths, give media `max-width: 100%` and let long text wrap; never just hide the overflow.

This is the last topic in the module. Next, the HTML and CSS coding lab practises layout on your own machine.

## Cheat sheet

|  |  |
| --- | --- |
| `<meta name="viewport" content="width=device-width, initial-scale=1">` | lay out at device width |
| `@media (min-width: 600px) { … }` | applies at 600px and wider |
| Order | small breakpoints first; later rules win |
| `img { max-width: 100%; height: auto; }` | media never wider than its container |
| `overflow-wrap: anywhere;` | break long words and URLs |
| Check | DevTools device mode at 400px: no sideways scroll |

## Sources

Checked against these live sources on 2026-10-14. The breakpoint frames are simulated: this page decides which @media blocks match each frame's width, then this browser lays out the cards. The overflow check uses a real 400px container measured by this browser. The phone with and without the viewport meta element is a drawn simulation, because desktop browsers ignore that element.

- MDN: Responsive web design
- CSS Working Group: CSS Viewport Module Level 1 (viewport meta element)
- W3C: Media Queries Level 4 (width, min-width)

## Static interaction alternatives

### predict

Prediction (practice, not scored): base CSS gives .cards one column; a min-width 700px media query gives three columns; the page has the viewport meta element. How many columns on a 400px phone? Options: one (correct: 400px is below 700px, so only the base styles apply); three (min-width 700px means 700px and wider, not narrower); two (nothing in the CSS gives two columns); it depends on the phone's pixel count (the viewport meta element makes layout use the device width in CSS pixels).

### explore

Steps: 1. Where to look: The three simulated frames in the model, 360px, 600px and 1000px wide, and the CSS above them. 2. What to do: Press the media-query block buttons to switch blocks on or off, or to change their order. 3. What to expect: The CSS and the frames update, and each frame's caption names its column count. 4. How to know it is done: All three goals in the list show done and Continue appears. Breakpoint builder on three simulated frames. The base rule gives .cards one column. Worked answer: switch on @media (min-width: 600px) with two columns and @media (min-width: 1000px) with three columns, in that order, and leave the max-width 1000px block off. Then the 360px frame shows 1 column, the 600px frame 2 and the 1000px frame 3. If the 1000px block comes first, the 1000px frame shows 2 columns, because both queries match and the later one wins. The max-width block gives the 360px frame two columns.

### explore

Steps: 1. Where to look: The drawn phone in the model and its caption. 2. What to do: Press the viewport meta element button to remove the element, then press it again to put it back. Choose the statement that explains the difference and press Check. 3. What to expect: The phone redraws, and its caption names the layout width and the column count. 4. How to know it is done: Check confirms your statement and Continue appears. Viewport meta simulation of a 360px-wide phone. With the viewport meta element, the page is laid out at 360px and the base one-column styles apply at normal size. Without it, the phone lays the page out at about 980px, where the 600px min-width query matches and two columns appear, then shrinks everything to fit, so the text is tiny. The correct explanation: without the element the phone lays out at about 980px and scales down; with width=device-width it lays out at its own width.

### explore

Steps: 1. Where to look: The real 400px container in the model and the measured content width under it. 2. What to do: Press fix buttons to switch fixes on or off. 3. What to expect: The measured content width updates after every press. 4. How to know it is done: The measured width is 400px or less with the overflow rule off, the feedback confirms it, and Continue appears. Overflow fixer in a real 400px container. Three things are wider than 400px: a hero picture with width 600px, a sidebar with width 450px, and a long unbroken URL. Worked answer: switch on img max-width 100% with height auto, sidebar width auto, and overflow-wrap anywhere on the URL; leave body overflow-x hidden off, because it only hides the scrollbar and cuts content off. The measured content width then drops to 400px or less.

### mcq

Apply question: one column on phones, two from 600px, three from 1000px, mobile-first. Options: a base of one column, then min-width 600px two columns, then min-width 1000px three columns (correct); a base of three columns, then max-width 999px two columns, then max-width 599px one column (works, but desktop-first); a base of one column, then min-width 1000px three columns, then min-width 600px two columns (at 1000px both match and the later two-column rule wins); a base of one column and min-width 600px two columns only (never reaches three).
