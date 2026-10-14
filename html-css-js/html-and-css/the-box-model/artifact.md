# The box model

## Objectives

- Label the content, padding, border and margin areas of a box
- Calculate an element's rendered width under box-sizing content-box and border-box
- Predict when adjacent vertical margins collapse

## Teaching

### Start with a guess

A card has this CSS and nothing else that sets its size:

```
.card { width: 200px; padding: 20px; border: 5px solid; }
```

Practice prediction, not scored.

### Four areas, inside out

- Content: the text or image itself. `width` and `height` size it by default.
- Padding: space between the content and the border. The background shows through it.
- Border: the line around the padding.
- Margin: transparent space outside the border that pushes other boxes away. It is not part of the box's size.

### Two ways to count width

With the default `box-sizing: content-box`, `width` is the content only, so padding and border are added on top:

rendered width = width + left and right padding + left and right border

With `box-sizing: border-box`, `width` already includes padding and border; the content shrinks to fit. Margin is outside the box in both models, so it never counts.

The practice box in the model is a real element; this browser measures its width.

### When vertical margins collapse

In normal block layout, when the bottom margin of one block adjoins the top margin of its next sibling, with no border, padding or clearance between them and no new formatting context, two positive margins collapse into one the size of the larger.

- 30px below and 20px above gives a 30px gap, not 50px.
- Horizontal margins never collapse.
- Flex and grid items keep both margins: their margins do not collapse.
- Negative margins and a parent's margin meeting its child's follow other rules, not covered here.

The two blocks in the model are real paragraphs; this browser measures the gap.

### Apply it to a new layout

A design needs a sidebar that is exactly 320px wide on screen, including its padding and border. Use what you know about both box models.

## Model

One box, four areas: margin outside, then border, padding and content. The practice boxes are real elements measured by this browser.

Box model ringsFour nested rectangles. Ring 1 is the outermost transparent space, ring 2 is the line, ring 3 is the space just inside the line, ring 4 is the centre holding the text. 1 2 3 4 text

Ring 1: outermost, transparent. Ring 2: the line. Ring 3: just inside the line, background shows. Ring 4: the centre, holding the text.

content

Block A

Block B

## Recap

- A box is content, then padding, then border, then margin, from the inside out.
- content-box (the default): rendered width = width + padding + border.
- border-box: rendered width = width; padding and border fit inside it.
- Margin is never part of the rendered width.
- Adjoining positive vertical margins of sibling blocks in normal flow, with nothing between them, collapse to the larger one; horizontal margins and flex or grid item margins do not. Negative and parent-child margins follow other rules.

Next topic: Flexbox

## Cheat sheet

|  |  |
| --- | --- |
| `box-sizing: content-box` | width + 2 × padding + 2 × border |
| `box-sizing: border-box` | width is the whole box |
| Common reset | `*, *::before, *::after { box-sizing: border-box; }` |
| Collapse | 30px and 20px vertical margins between blocks: 30px gap |
| No collapse | horizontal margins; flex and grid items |

## Sources

Checked against these live sources on 2026-10-13. The measurements in the practice boxes come from this browser.

- MDN: The box model
- W3C: CSS Box Model Module Level 4
- W3C: CSS Box Sizing Module Level 3 (box-sizing)
- W3C: CSS Flexible Box Layout Module Level 1 (flex item margins)

## Static interaction alternatives

### predict

Prediction (practice, not scored): a card has width 200px, padding 20px and a 5px border. How wide is it on screen? Options: 250px (correct: with the default content-box, 200 + 20 + 20 + 5 + 5); 200px (true only with box-sizing border-box); 225px (adds padding and border once instead of on both sides); 240px (adds the padding but forgets the border).

### drag

Steps: 1. Where to look: The box drawing in the model; the current ring has a blue outline, and its description appears above the buttons. 2. What to do: Press Content, Padding, Border or Margin. 3. What to expect: A right choice outlines the next ring; a wrong choice explains why and lets you choose again. 4. How to know it is done: The counter reads 4 of 4 named and Continue appears. Ring naming: four nested rings of a box. Worked answer: ring 4, the centre holding the text, is content; ring 3, just inside the line where the background shows, is padding; ring 2, the line, is border; ring 1, the outermost transparent space, is margin.

### explore

Steps: 1. Where to look: The practice box in the model and the measured width under it. 2. What to do: Choose box-sizing with the two buttons, type a width in pixels in the width field, then press Measure or Enter. 3. What to expect: The model shows the width this browser measured, and the goal list marks each box-sizing value you have matched. 4. How to know it is done: Both goals in the list show done and Continue appears. Width builder on a real element with padding 24px and border 6px. Worked answer: with box-sizing content-box, set width to 240px, because 240 + 24 + 24 + 6 + 6 = 300; with box-sizing border-box, set width to 300px, because padding and border fit inside the width. The browser's measured width confirms 300 in both cases.

### explore

Steps: 1. Where to look: The setup described above the field; the two real blocks in the model stay hidden until you measure. 2. What to do: Type the gap you expect, in pixels, in the predicted gap field, then press Measure or Enter. 3. What to expect: The blocks appear with the gap this browser measured; a matching prediction moves you to the next setup. 4. How to know it is done: The counter reads All three setups done and Continue appears. Margin gap predictions on two real paragraphs. Setup 1: Block A margin-bottom 30px, Block B margin-top 20px, in normal block layout: the gap is 30px, because the margins collapse to the larger one. Setup 2: the same margins inside a flex column container: the gap is 50px, because flex item margins do not collapse. Setup 3: both margins 16px in block layout: the gap is 16px.

### mcq

Apply question: a sidebar with padding 20px and border 2px must be exactly 320px wide on screen. Options: box-sizing border-box with width 320px (correct: padding and border fit inside); width 320px with the default content-box (renders 364px); box-sizing border-box with width 276px (that is the content-box arithmetic; renders 276px); width 320px with margin -22px (margin moves the box, it does not change its rendered width).
