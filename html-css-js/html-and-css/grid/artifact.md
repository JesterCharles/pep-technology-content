# Grid

## Objectives

- Define columns and rows with grid-template-columns, the fr unit, repeat() and minmax()
- Place items into named areas with grid-template-areas
- Choose Grid or Flexbox for a described layout and justify the choice

## Teaching

### Start with a guess

A grid container is 600px wide with no gap:

```
.page { display: grid; grid-template-columns: 200px 1fr 2fr; }
```

Practice prediction, not scored.

### Columns as a track list

`display: grid` makes a container a grid. `grid-template-columns` lists one size per column; children fill the cells in order, row by row.

- `fr` is a share of the leftover space after fixed tracks: `1fr 2fr` splits it one third and two thirds.
- `repeat(3, 1fr)` is shorthand for `1fr 1fr 1fr`.
- `minmax(90px, 1fr)` means at least 90px, at most one share.
- `repeat(auto-fill, minmax(90px, 1fr))` fits as many columns of at least 90px as the width allows.

### Name the areas

`grid-template-areas` draws the layout as text: one quoted string per row, one name per cell. A name repeated in neighbouring cells spans them; `.` leaves a cell empty.

```
grid-template-areas: "head head" "side main";
```

Each child then takes its place with `grid-area: head;`. Every named area must be one filled rectangle; an L-shape or a split area makes the browser reject the whole declaration.

### Grid or Flexbox?

- Flexbox is one-dimensional: a single row or column of items, often sized by their content, such as a toolbar, a row of tags or nav links.
- Grid is two-dimensional: rows and columns that line up with each other, such as a page shell, a gallery or a form with aligned labels and fields.

Ask: must things line up in both directions? Then Grid. Is it one line of items? Then Flexbox. Many pages use both: Grid for the shell, Flexbox inside a header.

### Apply it to a new layout

A shop shows product cards that must line up in rows and columns, as many per row as fit, each card at least 200px wide.

## Model

A grid has rows and columns that line up in both directions; Flexbox has one line. Every grid here is a real element laid out by this browser.

One dimension and two dimensionsLeft: Flexbox, one row of three boxes of different widths with an arrow along the row. Right: Grid, a two by three grid of equal cells with arrows along both the rows and the columns. Flexbox: one line Grid: rows and columns

1

2

3

4

5

6

header

side

main

footer

## Recap

- `grid-template-columns` lists column sizes; `fr` shares the leftover space after fixed tracks.
- `repeat()` shortens a list; `minmax(min, max)` sets a range; `repeat(auto-fill, minmax(…))` fits as many columns as the width allows.
- `grid-template-areas` names rectangular areas; children use `grid-area`.
- Choose Grid when items must line up in two dimensions, Flexbox for one line of items.

Next topic: Responsive, mobile-first layout

## Cheat sheet

|  |  |
| --- | --- |
| `display: grid` | make a grid container |
| `grid-template-columns: 200px 1fr` | fixed sidebar, flexible main |
| `repeat(3, 1fr)` | three equal columns |
| `repeat(auto-fill, minmax(200px, 1fr))` | as many 200px-plus columns as fit |
| `grid-template-areas: "head head" "side main"` | named rectangular areas |
| `grid-area: main` | place a child in an area |
| `gap: 16px` | space between rows and columns |

## Sources

Checked against these live sources on 2026-10-14. Every grid in the practice is laid out and measured by this browser.

- MDN: Basic concepts of grid layout
- W3C: CSS Grid Layout Module Level 2

## Static interaction alternatives

### predict

Prediction (practice, not scored): a 600px grid has grid-template-columns 200px 1fr 2fr and no gap. How wide is the third column? Options: about 267px (correct: leftover 400px splits into thirds, 2fr takes two thirds); 400px (that is the whole leftover); 200px (fr is not a pixel unit); 300px (splits the full 600px into 3 shares).

### explore

Track builder on a real 300px grid with six cells. Goal 1, three equal columns: repeat(3, 1fr) or 1fr 1fr 1fr, each 100px. Goal 2, a 100px sidebar column and a main column taking the rest: 100px 1fr, giving 100px and 200px. Goal 3, as many columns of at least 90px as fit: repeat(auto-fill, minmax(90px, 1fr)), which gives 3 columns of 100px at 300px and 2 columns of 100px at 200px. repeat(3, 90px) stays three fixed columns at any width.

### explore

Area map for a page shell in a real grid with columns 100px 1fr. Worked answer: grid-template-areas: "header header" "side main" "footer footer". Each child has grid-area set to its name. An L-shaped or split area, such as header in the top-left cell and the bottom-right cell, makes the browser reject the declaration.

### drag

Grid or Flexbox sorter. Worked answer: a page shell with header, sidebar, main and footer is Grid, because the regions line up in rows and columns; a row of tags of different widths that wraps is Flexbox, one line of content-sized items; a photo gallery whose photos line up in rows and columns is Grid; a nav bar with links on the left and a button on the right is Flexbox, a single row; a form whose labels line up in one column and fields in another is Grid, because both columns must align across rows.

### mcq

Apply question: product cards must line up in rows and columns, as many per row as fit, each at least 200px. Options: Grid with repeat(auto-fill, minmax(200px, 1fr)), because the cards align in two dimensions (correct); Flexbox with justify-content space-between, because the cards form a row (cards would not line up in columns, and the last row spreads out); Grid with grid-template-columns 200px, because Grid is for cards (that is one fixed column); Flexbox with flex-direction column, because cards stack (a single column, not as many as fit).
