# Semantic HTML page structure

## Objectives

- Choose the semantic element (header, nav, main, article, section, aside, footer) that matches each region of a page
- Arrange headings h1-h6 into an outline without skipping levels
- Replace generic div wrappers in a page with semantic elements that keep the same layout

## Teaching

### Start with a guess

Two pages look identical on screen. Page A is built only from `div` elements. Page B uses `header`, `nav`, `main` and `footer`. Practice prediction, not scored.

### Seven elements, seven jobs

- `header`: introductory content, such as the logo and site name.
- `nav`: a major block of navigation links.
- `main`: the dominant content of the page; only one visible `main` per page.
- `article`: a self-contained item that would make sense on its own, such as a post or a story.
- `section`: a thematic group of content, usually with its own heading.
- `aside`: content only tangentially related to what is around it, such as a sidebar.
- `footer`: closing information for the page or its section, such as copyright and contact links.

### Headings build an outline

The number in `h1` to `h6` is a level, not a font size; CSS decides the size.

- Give the page at least one level-1 heading, normally its title.
- Going down, move one level at a time: after an `h2` comes another `h2` or an `h3`, never an `h4`.
- Going back up, any jump is fine: an `h4` can be followed by an `h2`.

Screen reader users often move through a page by its headings, so the outline is their table of contents.

### Swap div for meaning, keep the layout

A `div` means nothing; it is a plain wrapper for styling. Replace it with the element whose job matches its content, and keep its `class` so your CSS still selects it.

Like `div`, these seven elements display as blocks by default, so the boxes stay where they were. The live layout check in the model asks this browser to confirm it.

Keep a `div` when a wrapper exists only for layout, such as two columns side by side.

### Apply it to a new page

A help centre page, new markup. Check both things you practised: the element that fits the content, and heading levels that never skip on the way down.

## Model

The page as regions and as an outline. The news and recipe pages are fictional.

A Site banner: logo and site name <div>

B Links to Home, World, Sport <div>

C Everything unique to this page <div>

D The news story <div>

E Related stories sidebar <div>

F Copyright and contact <div>

## Recap

- Choose an element by the job of its content: `header`, `nav`, `main`, `article`, `section`, `aside`, `footer`.
- Heading levels form an outline: start at level 1, never skip a level going down, jump up freely.
- Replacing a `div` with a semantic element keeps the layout, because both display as blocks; keep the class for your CSS.
- Keep `div` for wrappers that exist only for layout.

Next topic: Forms and HTML5 validation

## Cheat sheet

|  |  |
| --- | --- |
| `header` | logo, site name, intro |
| `nav` | major navigation links |
| `main` | the page's dominant content, one visible per page |
| `article` | self-contained: post, story, comment |
| `section` | themed group, usually with a heading |
| `aside` | tangential: sidebar, related links |
| `footer` | copyright, contact, related links |
| `h1`-`h6` | levels: down by one, up by any |

## Sources

Checked against these live sources on 2026-10-13.

- WHATWG HTML Living Standard: sections (article, section, nav, aside, header, footer, headings and outlines)
- WHATWG HTML Living Standard: grouping content (main, div)
- MDN: HTML elements reference
- W3C: ARIA in HTML (header, nav, main and footer landmark roles)

## Static interaction alternatives

### predict

Prediction (practice, not scored): two pages look identical; page A uses only div elements, page B uses header, nav, main and footer. What can a screen reader user do on page B only? Options: jump to the navigation or the main content by landmark (correct: these elements expose landmark roles that assistive technology lists); nothing different, identical layout means identical meaning (layout is visual, meaning comes from the element); hear class names such as nav announced as landmarks (class names carry no meaning to assistive technology); see a different visual style (the elements look the same unless CSS changes them).

### drag

Region sorter: choose the element for each region of a news page. Worked answer: A, the site banner with logo and site name, is header; B, the links to Home, World and Sport, is nav; C, everything unique to this page, is main; D, the news story, is article because it makes sense on its own; E, the related stories sidebar, is aside because it is tangential to the story; F, copyright and contact, is footer.

### explore

Heading activity: set heading levels for a news story. Worked answer: City council approves new bike lanes is h1; What changes is h2; Which streets come first and When work starts are h3 because they belong under What changes; Reactions is h2; From cyclists is h3. The starting levels jumped from h2 to h4, which skips h3.

### explore

Replace-the-div activity for a recipe page. Worked answer: div class masthead, holding the site name, becomes header; div class page, holding everything unique to the page, becomes main; div class recipe, the self-contained recipe, becomes article; div class cols, which only places the ingredients and method side by side, stays div; div class tips, a themed group headed Chef's tips, becomes section; div class legal, holding the copyright line, becomes footer. Each keeps its class, and all of these elements display as blocks by default, so the layout does not change.

### mcq

Apply question: a help centre page has the h1 Help centre, a Billing group, and two questions under Billing. Which markup is right? Options: section with h2 Billing and h3 questions (correct: a themed group with its heading one level below h1, questions one level below that); aside with h2 Billing and h3 questions (Billing is part of the main content, not tangential); section with h2 Billing and h4 questions (h2 to h4 skips level 3); nav with h2 Billing and h3 questions (nav is for major navigation links, not help content).
