# Flexbox

## Objectives

- Lay out items in a row or column with display: flex and flex-direction
- Distribute and align items with justify-content, align-items and gap
- Predict how flex-grow, flex-shrink and flex-basis share leftover space

## Teaching

### Start with a guess

A container is 600px wide and has `display: flex`. It holds three items, A, B and C, each with `flex-basis: 100px`. Only B has `flex-grow: 1`; A and C have `flex-grow: 0`. There is no gap or padding. Practice prediction, not scored.

### One axis at a time

`display: flex` on a container turns its direct children into flex items and lays them out along one axis, the main axis.

- `flex-direction: row` (the default): items sit side by side, in source order.
- `flex-direction: column`: items stack top to bottom.
- The cross axis runs across the main axis: vertical for a row, horizontal for a column.

Without `display: flex`, `flex-direction` does nothing.

### Distribute and align

- `justify-content` places items along the main axis: `flex-start` (default), `center`, `space-between`.
- `align-items` places items along the cross axis: `stretch` (default, items fill the height of a row), `center`, `flex-start`.
- `gap` sets a fixed space between neighbouring items, never at the outer edges.

In a row, centring horizontally is `justify-content` and centring vertically is `align-items`.

### Sharing leftover space

Each item starts at its `flex-basis`. In the simple case used here, with no padding, border, gap, margins or min and max sizes, leftover space is the container's width minus all the bases.

- With space left over, items grow in proportion to `flex-grow`; an item with `flex-grow: 0` keeps its basis.
- If the bases overflow, items shrink in proportion to `flex-shrink` (weighted by basis); `flex-shrink: 0` never shrinks.

Example: 300px container, bases 50px each, grow 1, 2 and 0: leftover 150px splits 50px and 100px, so the widths are 100px, 150px and 50px. Real layouts also account for padding, borders, gaps and margins, and min and max sizes can stop growing or shrinking.

### Apply it to a new layout

A search bar holds a text field and a Search button in a row. The field should take all spare width; the button should keep its own size.

## Model

A flex container lays its items along a main axis and aligns them on the cross axis. Every box here is a real element laid out by this browser.

Main and cross axis of a rowA container with three items in a row. A horizontal arrow labelled main axis runs left to right through the items; a vertical arrow labelled cross axis runs top to bottom. main axis cross axis

1 Home

2 Shop

3 Help

New

Sale

Hot

A

B

C

## Recap

- `display: flex` lays the children out on one main axis; `flex-direction` picks row (default) or column.
- `justify-content` works along the main axis, `align-items` across it, and `gap` spaces neighbours.
- Items start at `flex-basis`; leftover space goes out by `flex-grow`, overflow is taken back by `flex-shrink` weighted by basis. That simple sum assumes no padding, border, gap, margins or min and max sizes; real layouts account for those too.

Next topic: Grid

## Cheat sheet

|  |  |
| --- | --- |
| `display: flex` | children become flex items in a row |
| `flex-direction: column` | stack top to bottom |
| `justify-content: center` | centre on the main axis |
| `justify-content: space-between` | first and last at the edges |
| `align-items: center` | centre on the cross axis |
| `gap: 16px` | 16px between neighbours |
| `flex: 1` | grow into spare space (grow 1, shrink 1, basis 0) |
| `flex-shrink: 0` | never shrink below the basis |

## Sources

Checked against these live sources on 2026-10-14. Every layout in the practice is a real flex container laid out and measured by this browser.

- W3C: CSS Flexible Box Layout Module Level 1
- W3C: CSS Box Alignment Module Level 3 (justify-content, align-items, gap)

## Static interaction alternatives

### predict

Prediction (practice, not scored): a 600px flex container holds A, B and C, each with flex-basis 100px; only B has flex-grow 1. How wide is B? Options: 400px (correct: leftover 600 minus 300 is 300px, and all of it goes to B, the only item that grows); 200px (splits the leftover across all three, but A and C have flex-grow 0); 300px (that is the leftover alone, without B's 100px basis); 100px (B would keep its basis only with flex-grow 0).

### explore

Steps: 1. Where to look: The three cards in the model and the container CSS shown above them. 2. What to do: Press the display and flex-direction buttons below the model. 3. What to expect: The cards move as you press, and the CSS above them changes to match. 4. How to know it is done: Both goals in the list show done and Continue appears. Direction builder on three real cards. Goal 1, side by side in source order: display flex with flex-direction row. row-reverse also puts them side by side but in reverse order, so it does not meet the goal. Goal 2, stacked with flex: display flex with flex-direction column. display block also stacks them, but without flex, so flex-direction has no effect and the goal asks for flex.

### explore

Steps: 1. Where to look: The three badges in the 120px-tall box in the model. 2. What to do: Press the justify-content, align-items and gap buttons. 3. What to expect: The badges move, and the measured line under them describes their positions. 4. How to know it is done: Both goals in the list show done and Continue appears. Alignment builder on three real badges in a 120px-tall flex row. Goal 1, centred both ways: justify-content center and align-items center. align-items stretch, the default, makes the badges fill the height instead. Goal 2, packed top left with 16px between: justify-content flex-start, align-items flex-start and gap 16px. space-between pushes the badges to the edges instead of keeping 16px between them.

### explore

Steps: 1. Where to look: The 300px flex container and its CSS in the model; the items stay hidden until you measure. 2. What to do: Type the width you expect, in pixels, in the predicted width field, then press Measure or Enter. 3. What to expect: The items appear with the widths this browser measured; a matching prediction moves you to the next setup. 4. How to know it is done: The counter reads All three setups done and Continue appears. Leftover space predictions in a real 300px flex container. Setup 1: bases 50px each, flex-grow 1, 2 and 0: leftover 150px splits 50 and 100, so B is 150px. Setup 2: bases 100px each, flex-grow 1 each: no leftover, so A is 100px. Setup 3: bases 150px each, flex-shrink 1, 1 and 0: the bases overflow by 150px, C does not shrink, A and B each lose 75px, so A is 75px.

### mcq

Apply question: in a flex row, a text field should take all spare width and the Search button keep its size. Options: flex-grow 1 on the field, the button left at flex-grow 0 (correct: only the field receives leftover space); justify-content space-between on the bar (moves the button to the right edge but the field does not grow); align-items stretch on the bar (works on the cross axis, the height, not the width); flex-grow 1 on both (they would share the spare width, so the button would grow too).
