---
name: PEP learner artifacts
description: Visual contract for standalone PEP learner HTML pages that embed in the Evolv Learner app.
colors:
  dark-page: "#1C1F26"
  dark-card: "#252A33"
  dark-control: "#2D333E"
  dark-sunken: "#16191F"
  dark-line: "#333A48"
  dark-line-strong: "#7A8396"
  dark-text-strong: "#E7EBF1"
  dark-text: "#C3CAD6"
  dark-text-muted: "#9AA2B1"
  dark-accent-fill: "#5B3FD6"
  dark-accent-fill-hover: "#4C33BD"
  dark-on-accent-fill: "#FFFFFF"
  dark-accent: "#8B78FF"
  dark-accent-text: "#A595FF"
  dark-accent-soft: "#2E2D4D"
  dark-success: "#22E58A"
  dark-success-soft: "#254841"
  dark-danger: "#FF6B6B"
  dark-danger-soft: "#362F37"
  dark-warning: "#FFC24D"
  dark-warning-soft: "#484237"
  dark-focus: "#8B78FF"
  light-page: "#FFFFFF"
  light-card: "#F6F7F9"
  light-control: "#EEF0F3"
  light-sunken: "#F6F7F9"
  light-line: "#E4E7EC"
  light-line-strong: "#737C8A"
  light-text-strong: "#171A20"
  light-text: "#38414E"
  light-text-muted: "#5A616E"
  light-accent-fill: "#5B3FD6"
  light-accent-fill-hover: "#4C33BD"
  light-on-accent-fill: "#FFFFFF"
  light-accent: "#5B3FD6"
  light-accent-text: "#5B3FD6"
  light-accent-soft: "#F2F0FC"
  light-success: "#067647"
  light-success-soft: "#EBF4F0"
  light-danger: "#B42318"
  light-danger-soft: "#F9EDED"
  light-warning: "#B54708"
  light-warning-soft: "#F9F0EB"
  light-focus: "#5B3FD6"
typography:
  title:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "36px"
    letterSpacing: "-0.01em"
  heading:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "28px"
  subheading:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
  body:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  body-sm:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: "20px"
  caption:
    fontFamily: "Figtree, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
  code:
    fontFamily: "Source Code Pro, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  "4": "4px"
  "8": "8px"
  "12": "12px"
  "16": "16px"
  "20": "20px"
  "24": "24px"
  "32": "32px"
  "48": "48px"
components:
  button-primary:
    backgroundColor: "{colors.dark-accent-fill}"
    textColor: "{colors.dark-on-accent-fill}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.dark-accent-fill-hover}"
  card:
    backgroundColor: "{colors.dark-card}"
    rounded: "{rounded.lg}"
    padding: "24px"
  option:
    backgroundColor: "{colors.dark-page}"
    textColor: "{colors.dark-text-strong}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "48px"
  chip:
    backgroundColor: "{colors.dark-control}"
    textColor: "{colors.dark-text}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  code-block:
    backgroundColor: "{colors.dark-sunken}"
    textColor: "{colors.dark-text-strong}"
    typography: "{typography.code}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
---

# Design System: PEP learner artifacts

This file is the authoritative visual contract for every learner-facing standalone HTML page in this repository (`artifact.html` and course- or module-level learner pages).
It governs how a page looks and how its interaction is presented.
Behavior, accessibility gates, metadata and companions stay governed by [`authoring/docs/html-artifact-contract.md`](authoring/docs/html-artifact-contract.md).
The page anatomy aligns with the HTML contract: position and required minutes live in the topic bar, while objectives remain visible in a Goals list that keeps `data-pep-objectives`.
Existing pages are not restyled by this file; it applies when a page is authored or re-authored.

Keywords: **MUST** is required for new or re-authored pages, **SHOULD** is the default unless a recorded reason says otherwise, **MAY** is optional.
Provenance tags: **[T]** stated in the source's Learner token table or HTML-artifact rules; **[G]** measured from the source guide's own light document styling; **[S]** sampled from the source's Learner app screenshots (approximate, JPEG); **[R]** read from the annotated page-anatomy reference; **[A]** a learner-content adaptation made here.
The sources and every tag are explained in [Provenance](#provenance).

## Overview

**Creative North Star: "The quiet lab bench inside the Learner app."**
A PEP page sits in a content column of the Evolv Learner app, under the app's own title, kind badge and duration.
It should read as part of that app: dark graphite surfaces that layer by tone, one violet accent, Figtree-style humanist sans text, rounded but not bubbly cards, and status colors used only for meaning.
It is not a dashboard or an admin tool: a compact topic bar, a reading and instruction panel beside the real workspace, and calm feedback.

**Key characteristics**

- One topic bar, then two regions: instructions on the left, the interactive workspace on the right, stacked on narrow screens. [R][A]
- The interaction is the real task: learners who must write code write it in an editor. [R][A]
- Tonal layering (page → card → control) with 1 px lines; no shadows. [T][S]
- One accent: violet `#5B3FD6` fills, `#8B78FF` highlights. [T]
- Green, red and amber mean correct, wrong and warning, and nothing else. [T]
- A six-step type scale (12, 13, 14, 16, 20, 28 px), body at 16 px. [T]
- A 4 px spacing grid and 8 / 12 / 16 px radii. [T]
- Fluid layout that fits a ~570 px column without horizontal scrolling. [T]
- Light theme for OS light mode and print; dark values match the Learner dark theme. [A]

## Page anatomy

The annotated reference marks page material in red (remove), green (topic bar; reading and instruction panel) and purple (interactive workspace).
**Those colors are explanatory annotation only.** They are not palette: every color on a page comes from the [token reference](#token-reference), which is derived from the Evolv design-system source.

### Wireframe

Wide frame (≥960 px, usually a standalone window):

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Topic name (h1)    Activity 2 of 4 ▰▰▱▱ · about 14 min  [Restart]        │
├─────────────────────────────┬────────────────────────────────────────────┤
│ READING + INSTRUCTIONS  5fr │ WORKSPACE                              7fr │
│ h2  Step heading            │ h2  Same step, task wording                │
│ Concept (≤120 words)        │ ┌ editor · model · manipulation ─────────┐ │
│ Goals      ○ open  ✓ done   │ │                                        │ │
│ 1. Where to look            │ └────────────────────────────────────────┘ │
│ 2. What to type or choose   │ [Run] [Reset code]                         │
│ 3. What you should see      │ Problems | Output        (bounded height)  │
│ 4. How done shows           │ Status line, verdict and why               │
│ [Optional anecdote]         │ [Optional challenge, after required work]  │
└─────────────────────────────┴────────────────────────────────────────────┘
```

Narrow frame (<960 px, including the ~570 px Evolv column and phones). The topic bar wraps and never scrolls sideways:

```text
┌──────────────────────────────────┐
│ Topic name (h1)                  │
│ Activity 2 of 4 ▰▰▱▱  [Restart]  │
├──────────────────────────────────┤
│ h2 Step heading · concept        │
│ Goals · numbered steps           │
├──────────────────────────────────┤
│ h2 Task · workspace              │
│ Run / Reset · Problems | Output  │
│ Status, verdict and why          │
│ Optional disclosures, if useful  │
└──────────────────────────────────┘
```

### Remove (red in the reference)

- In-page breadcrumb or course / module / topic trail, and "Topic N of M". Evolv already shows where the learner is. [R][T]
- Loose metadata rows such as "About N minutes · 4 activities · Python 3.10 or later". [R]
- A collapsible "Objectives" disclosure as header furniture. [R]
- Any other page-level chrome above the activity: intro banners, version stamps, duplicate titles and kind badges. [R][T]

Nothing the learner needs to finish the activity is removed; it moves into the bar or the panel:

- The honest minutes label and the learner's position become the quiet text in the topic bar ("Activity 2 of 4 · about 14 min"). They are never a separate row. [A]
- A required runtime or version note becomes one sentence in the first instruction step that depends on it. [A]
- The objectives become the **Goals** checklist at the top of the reading panel. It keeps `data-pep-objectives` and one `li` per objective, so the Markdown companion still derives them, and it stays visible instead of collapsed. Goals are phrased as observable outcomes ("A `/` result that is a float"), not repeated as a separate list elsewhere. [R][A]

### Topic bar (green top band)

One compact row: the topic name as the page's only `h1` (20 px), then activity progress as segments plus text, completion indicators, and the **Restart activity** control. [R]
It is not sticky, it carries no breadcrumb or course name, and on narrow frames it wraps onto two lines. [T][A]

### Reading and instruction panel (green left)

The narrower region holds, in order: the step heading, the concept (≤120 words per teach step), the Goals checklist with per-goal open/done state, numbered steps (at most about four: where to look, what to type or choose, what you should see, how done shows), and a one-line goal summary ("1 of 3 goals still open"). [R][A]
It contains no controls that change the workspace, other than links that move focus to it.

### Interactive workspace (purple)

The wider region holds only the current activity's interaction and its own feedback: the editor, model or manipulation; Run and Reset; Problems and Output; and the status line with verdict and explanation. [R][A]
Results appear next to the control that produced them, not in the reading panel. [A]

### Alignment, scrolling and stacking

- **Wide frames** (≥960 px): two columns, `minmax(0, 5fr) minmax(0, 7fr)`, top-aligned, with a 24 px gap. [R][A] Both regions open with an `h2` naming the same step, so the instruction and its workspace read as one pair. [A]
- **Narrow frames** (<960 px): one column in the order topic bar → step heading and concept → Goals and steps → workspace → feedback → optional challenge. The steps sit directly above the workspace they describe; an optional Anecdote follows its complete core explanation. [A]
- **Bounded scrolling.** The main flow never scrolls inside itself. Only the editor body (400 px maximum; 240 px below 480 px) and the Output and Problems panel (240 px maximum; 180 px below 480 px) MAY scroll internally. Each scrollable region is keyboard-focusable and labeled, lets the user leave it at its boundaries, and is followed in reading order by the next page content. Neither panel is fixed or sticky. [T][A]
- **One activity at a time.** The workspace shows the current activity only. Finished activities collapse to their result, and later ones are not stacked below as a long scroll of extra controls. [R][A]

### Interaction matches the objective

Choose the workspace from the objective's verb. [R][A]

| Objective asks the learner to… | Workspace | Not this |
| --- | --- | --- |
| Write, fix or predict the output of code | The self-contained editor shell (Monaco-style; see [Editor workspace](#editor-workspace)). The learner types small statements, presses Run and reads Problems or Output. | Operand and operator radio builders, "pick the pieces to build the expression" selectors, drag-to-assemble code |
| Choose between genuinely discrete options (which rule applies, which output is right) | Option rows ([Assessment](#assessment-options-confidence-feedback)) with one retry and every option explained | Free text when only one of a few answers is meaningful |
| Explore a parameter's effect | A direct manipulation (slider, stepper, toggle) bound to a live model | Choosing values from radio grids and pressing Run |
| Run shell commands | The practice terminal, with honest "not available" messages | Clickable command menus |

**The Real Task Rule.** When typing a short statement is simpler and more authentic than choosing its pieces, the page MUST use the editor. Selectors are reserved for objectives that genuinely test a discrete choice. [R][A]

Execution stays honest and bounded:

- Run evaluates only the supported subset, deterministically and offline.
- Anything outside that subset produces a visible "not supported in this practice editor" problem rather than a guess.
- Reset code restores the starter.
- Restart activity clears the activity without duplicate credit.
- Every control works by keyboard, with no keyboard trap.

These rules restate the repository contract's honest-simulator, restart and accessibility requirements; they do not add behavior. [A]

## Colors

Each role is a CSS custom property; pages use the roles, never raw hex in component rules. [T]
Dark values are the Learner app's published tokens. Light values come from the source guide's own light styling where it shows a role, and from contrast-checked adaptations elsewhere.

### Primary

- **Accent fill** (`--pep-accent-fill`): primary button and selected-step backgrounds. Labels on it use **on-accent fill** (white, 6.72:1). [T] Hover/active deepens to **accent fill hover** (`#4C33BD`, the guide's link hover). [G]
- **Accent** (`--pep-accent`): non-text highlights such as progress fill, the selected-option border and the focus ring. Dark `#8B78FF` [T]; light uses the fill value, because `#8B78FF` falls under 3:1 on light cards. [A]
- **Accent text** (`--pep-accent-text`): violet text and icons such as links, chip labels and "Selected". Dark `#A595FF` (≥4.92:1 on every dark surface) is lighter than `#8B78FF` because `#8B78FF` measures only 4.27:1 on cards. [A]
- **Accent soft** (`--pep-accent-soft`): tint behind the selected step, the active chip and info callouts. [S] Exact value [A].

### Status

- **Success** (`--pep-success`), **Danger** (`--pep-danger`) and **Warning** (`--pep-warning`): dark `#22E58A` correct, `#FF6B6B` wrong, `#FFC24D` warning. [T] Light `#067647` and `#B54708` [A], with red `#B42318` from the guide's "Enforced" label. [G]
- Each has a `-soft` tint for the container behind it. Status text passes 4.5:1 on its own tint in both themes. [A]

### Neutral

- **Page** (`--pep-page`): `body` background, so the frame is seamless with the host. Dark `#1C1F26` [T], light white [G].
- **Card** (`--pep-card`): panels, question cards and callouts. Dark `#252A33` [T], light `#F6F7F9` (the guide's table header) [G].
- **Control** (`--pep-control`): chips, letter tiles, progress tracks and inputs. Dark `#2D333E` [T], light `#EEF0F3` [A].
- **Sunken** (`--pep-sunken`): code, terminal and editor wells. [A]
- **Line** (`--pep-line`): decorative dividers only (1.4:1). Dark `#333A48` [T], light `#E4E7EC` [G].
- **Line strong** (`--pep-line-strong`): any border that identifies a control or carries meaning, ≥3:1 on every surface. [A]
- **Text strong / Text / Text muted**: headings and option labels / body copy / metadata and captions. [T][G] All ≥4.5:1 on page, card and control in both themes.

**The One Voice Rule.** Violet is the only accent. Do not introduce a second brand hue, and never color content by Learner artifact kind (green reading, orange video, blue audio and so on); those badges belong to the host. [S][A]

**The Meaning-Only Rule.** Green, red and amber appear only for correct, wrong and warning states. They always come with an icon and a word, never color alone. [T][A]

## Typography

**Text font:** Figtree, falling back to `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. [T]
**Code font:** Source Code Pro, falling back to `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`. [T]

**The No-Font-File Rule.** Pages MUST NOT embed or load a font file (`@font-face`, data URI or network URL). The repository contract requires system font stacks. Naming Figtree first lets machines that have it installed match the Learner app exactly, while everyone else gets the system face at the same sizes. [A]

### Hierarchy

The only sizes are 12, 13, 14, 16, 20 and 28 px; nothing smaller than 12 px. [T] Line heights sit on the 4 px grid. [A]

| Role | Size / line | Weight | Use |
| --- | --- | --- | --- |
| Title | 28 / 36, −0.01em | 700 | A one-sentence lead claim opening a step, at most one per step. [T][G][S] |
| Heading | 20 / 28 | 700 | The topic-bar `h1`, step `h2`s in both regions, question stems. [T][S][R] |
| Subheading | 16 / 24 | 600 | `h3`, card titles, option labels that need weight. [A] |
| Body | 16 / 24 | 400 | Teaching text, option text. Max measure 68ch. [T][A] |
| Body small | 14 / 20 | 400 | Table cells, feedback detail, secondary UI. [T] |
| Label | 13 / 20 | 600 | Chips, topic-bar progress text, tab labels, legends. [T][A] |
| Caption | 12 / 16 | 400 | Figure captions, axis labels. Never for instructions. [T][G] |
| Code | 14 / 20 mono | 400 | Code blocks and terminal; inline code is 0.875em. [T][A] |

- Headings never go deeper than `h3`; use one `h1` per page. [T][A]
- Use sentence case, no trailing period on headings, and no emoji as headings or icons. [T]
- Numerals in progress, timers and tables SHOULD use `font-variant-numeric: tabular-nums`. [A]

## Layout

### Evolv embed boundaries

The page runs in a sandboxed frame inside the Learner topic page. [T]

- The host owns the artifact title, kind badge, duration, status, course navigation, topic list, assistant panel and completion. The page MUST NOT imitate any of them: no app bars, breadcrumbs, side rails, sprint carousels, avatar or role switchers, "AI" badges, or a "mark complete" control. [T][A]
- **Width.** The column can be as narrow as about 570 px on a laptop. Lay out with flex or grid that wraps; no fixed width over 560 px and no horizontal page scroll. [T] Pages MUST remain fully usable—not merely stacked—at 320, 390 and 768 CSS px, practical phone/tablet portrait and landscape sizes, and 200% zoom. Long titles, progress text, tabs and controls wrap without clipping. [A]
- **Height and scroll.** The host page scrolls, not the document. Pages MUST NOT use `position: fixed` or `sticky`, viewport-height page layouts (`100vh`, `100dvh`), or an inner scrolling region for the main flow, and MUST NOT take over window scroll. [T]
- **Size.** Inline HTML is capped at 512 KB by the platform, so keep embedded images and SVG lean. [T]
- **Seams.** The `body` background is `--pep-page`. Do not frame the whole page in an outer card, sheet, margin or drop shadow. [S][A]
- **Theme.** The frame cannot read the app's theme toggle. Follow `prefers-color-scheme`, and honor a `data-theme` override when the page offers its own toggle (see [Token reference](#token-reference)). [A]

### Grid, widths and spacing

- Spacing uses only 4, 8, 12, 16, 20, 24, 32 and 48 px. [T]
- **Page gutter:** 24 px, or 16 px at ≤480 px. [A]
- **Content max width:** 1200 px, centered. It only takes effect when the file is opened standalone on a wide screen, because inside Evolv the column is narrower. [A]
- **Reading measure:** teaching prose is capped at 68ch. [A]
- **Regions:** see [Page anatomy](#page-anatomy). Two regions sit side by side at ≥960 px viewport width (the frame's own width inside Evolv) and stack below that. [R][A]
- Every grid or flex child that holds text sets `min-width: 0`. [A]
- Option grids go to one column at ≤480 px. Topic-bar progress and steppers wrap rather than becoming horizontal scrollers; Restart activity remains a visible 44 px target. [A]
- At every width, source and visual order keep the complete instruction block immediately before its workspace. Problems and Output remain adjacent to that workspace, after Run/Reset, so reaching results does not discard context. [A]
- Mobile input layouts reserve no fixed viewport height. Text-entry controls are at least 16 px below 480 px and use `scroll-margin-block: 16px`; no fixed action bar can be covered by the virtual keyboard because fixed and sticky positioning are forbidden. [A]
- **Rhythm:** 8 px inside a group, 16 px between related blocks, 32 px between sections, and 48 px before the recap. [A]
- **Density:** one card per idea, and one workspace interaction visible per step. Data-management density (filters, bulk actions, many-column tables) does not belong in learner pages. [A]

### Print

Print always uses the light tokens; the recipe scopes dark values to `screen`. [A]
Cards, figures, tables, code blocks and optional disclosures avoid page breaks inside (`break-inside: avoid`). [G]
Optional disclosures print expanded, retaining their summary label, cue and optional-time text. The print helper below opens them for `beforeprint` and restores only those it opened on `afterprint`; without JavaScript, learners can open a native disclosure before printing. Buttons and toggles MAY be hidden with a `pep-noprint` class, and backgrounds drop to white except status tints. [A]

## Elevation & Depth

The system is flat. Depth comes from tone: page → card → control, each a step lighter in dark mode, with a 1 px line where two equal surfaces meet. [T][S]

**The No-Shadow Rule.** Learner surfaces carry no `box-shadow`. The shadow seen in the source is its print-preview sheet, not Learner UI, and is not carried over. [S][A] The focus ring is the only "raised" visual.

## Shapes

- **8 px** (`--pep-radius-sm`): buttons, inputs, letter tiles, code wells, small chips that are not pills. [T][S]
- **12 px** (`--pep-radius-md`): option rows, callouts, stepper items, table wrappers. [T][S]
- **16 px** (`--pep-radius-lg`): cards and panels. [T][S]
- **Pill** (`999px`): status and meta chips only. [S]
- Borders are 1 px. Selection, correctness and focus use 2 px. [T][A]
- Nested radii shrink inward: a 12 px row inside a 16 px card padded 16 px or more. [A]

## Components

Recipes assume the [token reference](#token-reference) is pasted first. Class names use a `pep-` prefix so they never collide with embedded `components/` fragments.

### Base, focus and motion

New or re-authored pages use `<main class="pep-main" data-pep-responsive>`. The stable marker enrolls that page in the current 320/390/768, touch and zoom QA matrix; add it only when the page actually meets this contract, never as a marker-only migration. Mark the complete instruction block with `data-pep-instructions` and its following interaction with `data-pep-workspace` so reading order is deterministic.

```css
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; max-width: 100%; overflow-x: clip; }
body {
  background: var(--pep-page);
  color: var(--pep-text);
  font: 400 16px/24px var(--pep-font-sans);
  -webkit-text-size-adjust: 100%;
}
h1, h2, h3 { color: var(--pep-text-strong); margin: 0; text-wrap: balance; }
h1, h2 { font-size: 20px; line-height: 28px; font-weight: 700; }
h3 { font-size: 16px; line-height: 24px; font-weight: 600; }
p, li { max-width: 68ch; overflow-wrap: anywhere; }
img, svg, video, canvas { max-width: 100%; height: auto; }
button, input, select, textarea, summary { font: inherit; }
a { color: var(--pep-accent-text); text-underline-offset: 3px; }
a:hover { text-decoration-thickness: 2px; }
code, kbd, samp { font-family: var(--pep-font-mono); font-size: 0.875em; }
:focus-visible { outline: 2px solid var(--pep-focus); outline-offset: 2px; }
::selection { background: var(--pep-accent-fill); color: var(--pep-on-accent-fill); }
.pep-lead { font-size: 28px; line-height: 36px; font-weight: 700; letter-spacing: -0.01em; color: var(--pep-text-strong); }
.pep-main { max-width: 1200px; margin: 0 auto; padding: 24px; min-width: 0; }
@media (max-width: 480px) {
  .pep-main { padding: 16px; }
  input, select, textarea { font-size: 16px; scroll-margin-block: 16px; }
}

/* Motion: state feedback only (color, border, opacity, small transforms). */
button, .pep-option, .pep-step { transition: background-color var(--pep-dur-1) var(--pep-ease), border-color var(--pep-dur-1) var(--pep-ease), color var(--pep-dur-1) var(--pep-ease); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0s !important; animation-iteration-count: 1 !important; transition-duration: 0s !important; scroll-behavior: auto !important; }
}
```

- The focus ring is 2 px accent and always visible on keyboard focus. Never remove an outline without replacing it. [T]
- Every tap target is at least 44 × 44 px, with at least 8 px between adjacent targets. Nothing works only on hover. [T][A]
- **Motion** lasts 120 ms for color and border and 200 ms for reveal (opacity plus ≤8 px translate), eased with `cubic-bezier(0.2, 0, 0, 1)`. Do not animate layout properties, loop decoration, or use parallax. Under reduced motion the state change still happens, instantly. [A]

### Topic bar, regions, goals and steps

```css
.pep-topicbar {
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px;
  padding: 0 0 12px; margin: 0 0 24px; border-bottom: 1px solid var(--pep-line);
}
.pep-topicbar h1 { flex: 1 1 240px; min-width: 0; }
.pep-topicbar__progress { display: flex; flex: 1 1 260px; flex-wrap: wrap; align-items: center; gap: 8px 12px; min-width: 0; font: 600 13px/20px var(--pep-font-sans); color: var(--pep-text-muted); font-variant-numeric: tabular-nums; }
.pep-topicbar__progress .pep-progress { flex: 1 1 96px; width: 96px; max-width: 160px; }
.pep-topicbar .pep-btn { flex: 0 0 auto; }

.pep-regions { display: grid; grid-template-columns: minmax(0, 1fr); gap: 24px; }
@media (min-width: 960px) { .pep-regions { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); align-items: start; } }
.pep-region { display: flex; flex-direction: column; gap: 16px; min-width: 0; }

.pep-goals { margin: 0; padding: 12px 16px; list-style: none; border: 1px solid var(--pep-line); border-radius: var(--pep-radius-md); background: var(--pep-card); }
.pep-goals > li { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; padding: 8px 0; border-top: 1px solid var(--pep-line); }
.pep-goals > li:first-child { border-top: 0; }
.pep-goals .state { font: 600 13px/20px var(--pep-font-sans); color: var(--pep-text-muted); }
.pep-goals .is-done .state { color: var(--pep-success); }
.pep-steps-list { margin: 0; padding-left: 24px; }
.pep-steps-list > li + li { margin-top: 8px; }

.pep-chip {
  display: inline-flex; align-items: center; gap: 6px; min-height: 28px; padding: 4px 12px;
  border: 1px solid var(--pep-line-strong); border-radius: var(--pep-radius-pill);
  background: var(--pep-control); color: var(--pep-text); font: 600 13px/20px var(--pep-font-sans);
}
.pep-chip--accent { background: var(--pep-accent-soft); border-color: var(--pep-accent); color: var(--pep-accent-text); }
```

- The goal state is a word ("open", "done") plus a check icon when done, never color alone. [R][A]
- Restart activity is a secondary `pep-btn` in the bar. It is never danger red, and it never asks for confirmation through a dialog. [R][A]
- Chips are informational labels inside a region ("Single choice", "Python subset"), not header metadata. A chip that acts as a control becomes a button at least 44 px tall. [S][A]

### Optional Anecdote and Challenge disclosures

These are optional authoring patterns, not required page furniture. Use at most one of each, omit them when they add no value, and keep the required explanation and practice complete when they stay closed. Their stable hooks are contract-owned; do not rename or reuse them for required content.

```html
<!-- Place after the complete core explanation. -->
<details class="pep-optional pep-optional--anecdote"
         data-pep-optional="anecdote" data-section-skip>
  <summary>
    <span>Another way to think about it</span>
    <span class="pep-optional__cue">Optional example</span>
  </summary>
  <div class="pep-optional__body">
    <p>A variable is like a labeled shelf: the label stays useful while the value on the shelf can change.</p>
  </div>
</details>

<!-- Place after required practice and feedback; it never gates Continue. -->
<details class="pep-optional pep-optional--challenge"
         data-pep-optional="challenge" data-section-skip>
  <summary>Challenge (optional)</summary>
  <div class="pep-optional__body">
    <p data-pep-optional-time><strong>Optional time:</strong> about 3 minutes</p>
    <p data-pep-success-criteria><strong>Success criteria:</strong> Change the starter so it prints both already-taught values.</p>
    <!-- A resettable starter may follow; never embed an answer or hidden solution. -->
  </div>
</details>
```

```css
.pep-optional {
  min-width: 0; border-block: 1px solid var(--pep-line); background: transparent;
  break-inside: avoid;
}
.pep-optional > summary {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  gap: 4px 12px; min-height: 44px; padding: 8px 0; cursor: pointer;
  color: var(--pep-text-strong); font-weight: 600;
}
.pep-optional > summary::marker { color: var(--pep-accent-text); }
.pep-optional__cue, [data-pep-optional-time] {
  color: var(--pep-text-muted); font: 600 13px/20px var(--pep-font-sans);
}
.pep-optional__body { padding: 4px 0 16px; }
.pep-optional__body > :first-child { margin-top: 0; }
.pep-optional__body > :last-child { margin-bottom: 0; }
@media print {
  .pep-optional > summary { list-style: none; }
  .pep-optional > summary::-webkit-details-marker { display: none; }
}
```

```html
<script>
  (() => {
    let printOpened = [];
    addEventListener('beforeprint', () => {
      printOpened = [...document.querySelectorAll('details[data-pep-optional]:not([open])')];
      printOpened.forEach(details => { details.open = true; });
    });
    addEventListener('afterprint', () => {
      printOpened.forEach(details => { details.open = false; });
      printOpened = [];
    });
  })();
</script>
```

Both disclosures are closed in authored HTML (no `open` attribute). Native `<summary>` supplies keyboard, touch and screen-reader behavior; scripts do not replace it or move focus after toggling. The print helper changes disclosure state only for printing and restores the authored state. Anecdote content is one accurate simpler explanation, analogy or example with no new prerequisite. Challenge content extends only taught objectives and labels time as additional. Optional descendants carry no `data-interaction`, `data-confidence`, objectives, required progress or completion hook. Opening, attempting, resetting or printing them cannot change required progress, completion, grade, Continue or `pep:budget-minutes`. [A]

### Cards and callouts

```css
.pep-card { background: var(--pep-card); border: 1px solid var(--pep-line); border-radius: var(--pep-radius-lg); padding: 24px; min-width: 0; }
@media (max-width: 480px) { .pep-card { padding: 16px; } }
.pep-callout {
  display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 12px; align-items: start;
  padding: 12px 16px; border: 1px solid var(--pep-line-strong); border-radius: var(--pep-radius-md);
  background: var(--pep-card); color: var(--pep-text);
}
.pep-callout > svg { width: 20px; height: 20px; margin-top: 2px; }
.pep-callout strong { color: var(--pep-text-strong); }
.pep-callout p { margin: 0; }
.pep-callout--info    { background: var(--pep-accent-soft);  border-color: var(--pep-accent);  } .pep-callout--info    > svg { color: var(--pep-accent-text); }
.pep-callout--success { background: var(--pep-success-soft); border-color: var(--pep-success); } .pep-callout--success > svg { color: var(--pep-success); }
.pep-callout--warning { background: var(--pep-warning-soft); border-color: var(--pep-warning); } .pep-callout--warning > svg { color: var(--pep-warning); }
.pep-callout--danger  { background: var(--pep-danger-soft);  border-color: var(--pep-danger);  } .pep-callout--danger  > svg { color: var(--pep-danger); }
```

- A callout starts with a bold word ("Note", "Watch out", "Correct") so its meaning survives without color. [A]
- At most one callout per teach step. Never put a card inside a card; use a line or spacing instead. [A]

### Buttons

```css
.pep-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-height: 44px; padding: 10px 20px; border-radius: var(--pep-radius-sm);
  font: 600 16px/24px var(--pep-font-sans); cursor: pointer;
  border: 1px solid var(--pep-line-strong); background: var(--pep-control); color: var(--pep-text-strong);
}
.pep-btn--primary { background: var(--pep-accent-fill); border-color: var(--pep-accent-fill); color: var(--pep-on-accent-fill); }
.pep-btn--primary:hover { background: var(--pep-accent-fill-hover); border-color: var(--pep-accent-fill-hover); }
.pep-btn--ghost { background: transparent; border-color: transparent; color: var(--pep-accent-text); }
.pep-btn:disabled, .pep-btn[aria-disabled="true"] { cursor: not-allowed; background: var(--pep-control); border-color: var(--pep-line); color: var(--pep-text-muted); }
```

Use one primary button per step ("Check", "Next step"), with secondary actions beside it. Never disable a button just to hide it; disabled text stays at text-muted contrast. [T][S][A]

### Assessment: options, confidence, feedback

The Learner quiz shows a card holding "Question 1 of 3", a type chip and a segmented progress bar, then a 20 px question and full-width option rows that each have a lettered tile. [S] PEP checks reuse that shape.

```css
.pep-options { display: grid; gap: 8px; margin: 16px 0 0; padding: 0; border: 0; min-width: 0; }
.pep-option {
  display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 12px; align-items: center;
  min-height: 48px; padding: 10px 16px; border: 1px solid var(--pep-line-strong); border-radius: var(--pep-radius-md);
  background: var(--pep-page); color: var(--pep-text-strong); cursor: pointer;
}
.pep-option__key { display: grid; place-items: center; width: 28px; height: 28px; border-radius: var(--pep-radius-sm); background: var(--pep-control); font: 600 13px/1 var(--pep-font-sans); color: var(--pep-text); }
.pep-option:hover { border-color: var(--pep-accent); }
.pep-option:has(input:checked), .pep-option[aria-pressed="true"] { border: 2px solid var(--pep-accent); background: var(--pep-accent-soft); padding: 9px 15px; }
.pep-option.is-correct { border: 2px solid var(--pep-success); background: var(--pep-success-soft); padding: 9px 15px; }
.pep-option.is-wrong   { border: 2px dashed var(--pep-danger); background: var(--pep-danger-soft); padding: 9px 15px; }
.pep-option.is-correct .pep-option__key { background: var(--pep-success); color: var(--pep-page); }
.pep-option.is-wrong   .pep-option__key { background: var(--pep-danger);  color: var(--pep-page); }
.pep-option input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.pep-option:has(input:focus-visible) { outline: 2px solid var(--pep-focus); outline-offset: 2px; }
.pep-explain { grid-column: 2; margin: 4px 0 0; font: 400 14px/20px var(--pep-font-sans); color: var(--pep-text); }
.pep-verdict { display: flex; align-items: center; gap: 8px; font-weight: 700; }
.pep-verdict--correct { color: var(--pep-success); } .pep-verdict--wrong { color: var(--pep-danger); } .pep-verdict--revealed { color: var(--pep-warning); }
```

- The correct state uses a solid border, a check icon and "Correct answer". The chosen wrong answer uses a dashed border, a cross icon and "Your answer". Locked options stay at full text contrast, never faded below 4.5:1. [T][A]
- Confidence ratings are a row of option-style buttons ("Guessing", "Fairly sure", "Certain") at least 96 px wide, with the same selected style. [A]
- Feedback sits directly under the options in a `pep-callout`. The verdict word comes first, then why each option is right or wrong. [A]

### Progress, stepper, timelines and process maps

```css
.pep-progress { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 4px; }
.pep-progress > span { height: 6px; border-radius: var(--pep-radius-pill); background: var(--pep-control); }
.pep-progress > span.is-done, .pep-progress > span.is-current { background: var(--pep-accent); }

.pep-steps { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }
.pep-step { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 6px 12px 6px 6px; border: 1px solid transparent; border-radius: var(--pep-radius-md); color: var(--pep-text-muted); font-weight: 600; }
.pep-step__n { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: var(--pep-control); color: var(--pep-text); font-size: 13px; }
.pep-step[aria-current="step"] { background: var(--pep-accent-soft); border-color: var(--pep-accent); color: var(--pep-text-strong); }
.pep-step[aria-current="step"] .pep-step__n { background: var(--pep-accent-fill); color: var(--pep-on-accent-fill); }

.pep-timeline { list-style: none; margin: 0; padding: 0; }
.pep-timeline > li { position: relative; display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 12px; padding-bottom: 16px; }
.pep-timeline > li::before { content: ""; position: absolute; left: 13px; top: 28px; bottom: 0; width: 2px; background: var(--pep-line-strong); }
.pep-timeline > li:last-child::before { display: none; }
```

- **Stepper.** Numbered pills with the current step tinted, as in the Learner reference interactive. [S] On narrow widths it wraps; it never scrolls sideways. [A]
- **Progress.** Segmented, one segment per step, with a text equivalent ("Step 2 of 5") always present. [S][A]
- **Timelines and process maps.** Use 28 px numbered nodes joined by a 2 px line-strong connector, vertical by default. A horizontal map MAY be used only when it fits 560 px with labels at 13 px or larger. [A]

### Figures, diagrams, charts and tables

Diagrams are inline SVG, never raster screenshots of diagrams. They scale to the column (`width: 100%; height: auto`) and color everything through tokens so both themes work. SVG text scales with the drawing, so labels MUST still render at 12 px or more at the narrowest required viewport of 320 px (288 px content width with the phone gutter). A 360-unit-wide `viewBox` with 16-unit labels meets that; a wider diagram stacks vertically below 480 px or uses HTML labels:

```html
<figure class="pep-figure">
  <svg viewBox="0 0 360 120" role="img" aria-labelledby="fig1-t">
    <title id="fig1-t">Key to bucket: hash, then index</title>
    <rect class="node" x="8" y="36" width="140" height="48" rx="8"/>
    <text class="label" x="78" y="66" text-anchor="middle">key</text>
    <path class="edge" d="M148 60 H212"/>
    <rect class="node is-focus" x="212" y="36" width="140" height="48" rx="8"/>
    <text class="label" x="282" y="66" text-anchor="middle">hashCode()</text>
  </svg>
  <figcaption>Each key maps to exactly one bucket index.</figcaption>
</figure>
```

```css
.pep-figure { margin: 16px 0; }
.pep-figure svg { display: block; width: 100%; height: auto; }
.pep-figure .node { fill: var(--pep-card); stroke: var(--pep-line-strong); stroke-width: 1.5; }
.pep-figure .node.is-focus { fill: var(--pep-accent-soft); stroke: var(--pep-accent); stroke-width: 2; }
.pep-figure .edge { fill: none; stroke: var(--pep-line-strong); stroke-width: 2; }
.pep-figure .label { fill: var(--pep-text-strong); font: 600 16px var(--pep-font-sans); }
.pep-figure figcaption { margin-top: 8px; font: 400 12px/16px var(--pep-font-sans); color: var(--pep-text-muted); }

.pep-table-wrap { border: 1px solid var(--pep-line); border-radius: var(--pep-radius-md); overflow: hidden; }
.pep-table { width: 100%; border-collapse: collapse; font: 400 14px/20px var(--pep-font-sans); }
.pep-table th { text-align: left; font-weight: 600; color: var(--pep-text-strong); background: var(--pep-card); border-bottom: 1px solid var(--pep-line-strong); padding: 8px 12px; }
.pep-table td { padding: 8px 12px; border-bottom: 1px solid var(--pep-line); vertical-align: top; overflow-wrap: anywhere; }
.pep-table tr:last-child td { border-bottom: 0; }
.pep-table td:first-child { font-weight: 600; color: var(--pep-text-strong); }
```

- **Tables.** Five columns or fewer. [T] The header row and the bold first column follow the guide's table style. [G] At ≤480 px a table either still fits or stacks rows into labeled blocks; it never forces page-level horizontal scroll. [A]
- **Charts.** Highlight the one series that carries the lesson in accent, and draw the rest in text-muted or line-strong. Label values and series directly, keep gridlines in line color, and never rely on hue alone. No 3D, no gradients, no decorative charts. The data is also stated in text or in a table. [A]
- **Imagery.** Raster images are a last resort. When used they are embedded, count toward the 512 KB cap, carry alt text, and sit on a transparent or dark background. White-boxed screenshots glare in the dark theme. [T]
- **Icons.** Use inline SVG line icons, 16 or 20 px, `stroke: currentColor`, 1.5 to 2 px stroke, and `aria-hidden="true"` when the adjacent text already names them. No icon fonts and no emoji as icons. [S][T][A]

### Code and terminal surfaces

```css
.pep-code {
  margin: 0; padding: 12px 16px; background: var(--pep-sunken); color: var(--pep-text-strong);
  border: 1px solid var(--pep-line); border-radius: var(--pep-radius-sm);
  font: 400 14px/20px var(--pep-font-mono); white-space: pre-wrap; overflow-wrap: anywhere; tab-size: 2;
}
.pep-code .tok-key { color: var(--pep-accent-text); }
.pep-code .tok-str { color: var(--pep-success); }
.pep-code .tok-com { color: var(--pep-text-muted); }
.pep-code mark { background: var(--pep-accent-soft); color: inherit; border-radius: 4px; }
:not(pre) > code { padding: 1px 6px; border-radius: 6px; background: var(--pep-control); color: var(--pep-text-strong); }
.pep-terminal { padding: 12px 16px; background: var(--pep-sunken); color: var(--pep-text-strong); border: 1px solid var(--pep-line-strong); border-radius: var(--pep-radius-sm); font: 400 14px/20px var(--pep-font-mono); overflow-wrap: anywhere; }
.pep-terminal:focus-within { border-color: var(--pep-focus); box-shadow: 0 0 0 1px var(--pep-focus); }
.pep-terminal .prompt { color: var(--pep-accent-text); font-weight: 600; }
.pep-terminal .err { color: var(--pep-danger); }
```

- Code blocks are under 30 lines, and under 15 in a question. Wrap long lines rather than scroll sideways. [T][A]
- Syntax color is limited to three roles (keyword, string, comment). Never use green or red for anything that could read as a verdict, except `tok-str`, which never sits next to a correctness badge. [A]
- An unsupported command shows a warning callout ("Not available in this practice terminal"), not danger red; the learner did nothing wrong. [A]

### Editor workspace

A code-writing step uses the PEP `lesson-editor` shell, the self-contained Monaco-style editor introduced with the Python fundamentals pilot. It is inlined into the page, never loaded from a CDN, and uses no Monaco runtime. [R][A]
Its anatomy, top to bottom:

1. A toolbar with the file tab, Run and Reset code.
2. The code area, with a line-number gutter.
3. Problems | Output tabs.
4. A status bar with a live summary.

This file styles that anatomy; it does not change the shell's behavior or bytes.

```css
.pep-editor { border: 1px solid var(--pep-line-strong); border-radius: var(--pep-radius-md); background: var(--pep-sunken); overflow: hidden; }
.pep-editor__bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 8px 12px; background: var(--pep-card); border-bottom: 1px solid var(--pep-line); }
.pep-editor__file { min-width: 0; overflow-wrap: anywhere; font: 400 13px/20px var(--pep-font-mono); color: var(--pep-text-strong); padding: 4px 8px; border-bottom: 2px solid var(--pep-accent); margin-inline-end: auto; }
.pep-editor__code { display: grid; grid-template-columns: auto minmax(0, 1fr); max-height: 400px; overflow: auto; overscroll-behavior: contain auto; font: 400 14px/20px var(--pep-font-mono); }
.pep-editor__gutter { padding: 12px 8px 12px 12px; text-align: right; color: var(--pep-text-muted); user-select: none; font-variant-numeric: tabular-nums; }
.pep-editor__input { margin: 0; padding: 12px; border: 0; resize: vertical; min-width: 0; min-height: 160px; max-height: 400px; scroll-margin-block: 16px; background: transparent; color: var(--pep-text-strong); font: inherit; caret-color: var(--pep-accent-text); white-space: pre; overflow-wrap: normal; tab-size: 4; }
.pep-editor__input:focus-visible { outline: 2px solid var(--pep-focus); outline-offset: -2px; }
.pep-editor__tabs { display: flex; gap: 4px; padding: 0 12px; background: var(--pep-card); border-top: 1px solid var(--pep-line); }
.pep-editor__tabs [role="tab"] { min-height: 44px; padding: 0 12px; border: 0; border-bottom: 2px solid transparent; background: none; color: var(--pep-text-muted); font: 600 13px/20px var(--pep-font-sans); }
.pep-editor__tabs [role="tab"][aria-selected="true"] { color: var(--pep-text-strong); border-bottom-color: var(--pep-accent); }
.pep-editor__panel { max-height: 240px; overflow: auto; overscroll-behavior: contain auto; padding: 12px; font: 400 14px/20px var(--pep-font-mono); color: var(--pep-text); }
.pep-editor__problem { display: block; width: 100%; min-height: 44px; text-align: left; padding: 8px; border: 0; border-radius: var(--pep-radius-sm); background: none; color: var(--pep-text); font: inherit; }
.pep-editor__problem .kind-error { color: var(--pep-danger); } .pep-editor__problem .kind-limit { color: var(--pep-warning); }
.pep-editor__status { padding: 8px 12px; background: var(--pep-control); color: var(--pep-text); font: 400 13px/20px var(--pep-font-sans); }
@media (max-width: 480px) {
  .pep-editor__bar { align-items: stretch; }
  .pep-editor__file { flex: 1 1 100%; margin-inline-end: 0; }
  .pep-editor__bar .pep-btn { flex: 1 1 calc(50% - 4px); }
  .pep-editor__secondary { display: none; }
  .pep-editor__code, .pep-editor__input { max-height: 240px; }
  .pep-editor__input { min-height: 160px; font-size: 16px; line-height: 24px; }
  .pep-editor__tabs { flex-wrap: wrap; }
  .pep-editor__tabs [role="tab"] { flex: 1 1 120px; }
  .pep-editor__panel { max-height: 180px; }
}
```

- The code area is the one place where lines do not wrap. It scrolls inside its own bounded box; the page never scrolls sideways. Boundary scrolling returns to the host page rather than trapping wheel, touch or keyboard users. [A]
- Starter code is short: 3 to 12 lines, with the learner's edit area obvious from a comment. [A]
- **Problems.** An error the real language certainly raises is danger. An unsupported construct ("limit") is warning. A hint is muted. Each problem moves the caret to its line. [A]
- **Output.** A pass, mismatch, runtime error or stop is announced in the status bar with words. Verdict color follows the [Meaning-Only Rule](#colors). [A]
- **Mobile reduction.** Below 480 px, hide only `.pep-editor__secondary` chrome such as shortcut legends or extra metadata. Keep file name, Run, Reset code, Problems, Output and status visible. Toolbar controls and tabs wrap into equal flexible rows; the code area is at most 240 px and Problems/Output at most 180 px. At 481 px and above the maxima are 400 px and 240 px. [A]
- **Virtual keyboard.** Phone editor text is 16/24 px and the input has 16 px block scroll margin. No editor action is fixed or sticky, so Run/Reset stay discoverable above the field rather than being covered by the keyboard. [A]
- **Loading and error states** use the empty and error patterns below. A `<noscript data-pep-no-js>` block inside `[data-pep-workspace="code"]` restates the task, starter, supported subset and how to compare expected results as honest plain text without exposing a graded answer. The editor is progressive enhancement of that complete reading. [A]

### Empty, error and success states

- **Empty** (nothing tried yet): a muted one-line prompt saying what to do next, inside the control's own card, with no illustration. [A]
- **Error** (input the page cannot parse): a danger callout next to the input, naming the fix ("Use a whole number from 1 to 16"). Never blame the learner, and never use a modal. [A]
- **Success** (step or page finished): a success callout followed by the next step. The final recap ends the page plainly; completion is recorded in the host, so do not add celebratory overlays or confetti. [T][A]

### Components bridge (`components/*@1`)

Embedded fragments from `components/` read the older variable names. Do not edit their copied bytes, which the drift gate checks. Alias the old names to the tokens after the token block instead:

```css
:root {
  --bg: var(--pep-page); --surface: var(--pep-card); --ink: var(--pep-text-strong); --muted: var(--pep-text-muted);
  --rule: var(--pep-line-strong); --line: var(--pep-line); --focus: var(--pep-focus);
  --teal: var(--pep-accent-text); --on-teal: var(--pep-page); --teal-soft: var(--pep-accent-soft);
  --red: var(--pep-danger); --red-soft: var(--pep-danger-soft); --amber: var(--pep-warning); --amber-soft: var(--pep-warning-soft);
  --code: var(--pep-sunken); --term: var(--pep-sunken);
  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s6: 24px; --s8: 32px;
  --sans: var(--pep-font-sans); --mono: var(--pep-font-mono);
}
```

Known `@1` gaps, accepted until a component version changes them: some fragments use 15 px text and 3–4 px radii, and they mark "correct" in the accent (with a badge and solid border) rather than green.

## Do's and Don'ts

**MUST**

- Paste the [token reference](#token-reference) and use roles, not raw hex, in every rule.
- Keep text at ≥4.5:1 and meaningful borders and icons at ≥3:1 in both themes. The tokens are pre-checked; re-check any new pairing.
- Show a visible 2 px focus ring, make targets at least 44 × 44 px, and never depend on hover.
- Respect `prefers-reduced-motion`; stay fully usable at 320, 390, 768 and 200% zoom with no horizontal page scroll; and use no fixed or sticky positioning.
- Keep the page offline and standalone: no external or embedded fonts, scripts, stylesheets, images, frameworks or runtime requests.
- Convey state with words and icons as well as color.

- Follow the [Page anatomy](#page-anatomy): one topic bar, a reading and instruction panel, and a workspace, stacking below 960 px.
- Keep every instruction needed to finish the activity, and keep objectives as the visible Goals checklist (`data-pep-objectives`).
- Give code-writing objectives the editor workspace, not piece selectors; keep its instructions first, mobile controls visible, heights bounded and no-JavaScript reading complete.
- Keep Optional Anecdote and Challenge disclosures native, closed by default, public-safe and outside all required objective, progress, completion and time accounting.

**SHOULD**

- Use one accent, one primary button per step, and one workspace interaction visible at a time.
- Use the six type sizes and the 4 px spacing scale exactly.
- Draw diagrams in inline SVG with token colors.

**MAY**

- Open a step with one 28 px lead claim (`pep-lead`).
- Offer a page-level theme toggle through `data-theme`.
- Hide pure controls in print with `pep-noprint`.

**Don't**

- Recreate Learner app chrome: top bar, breadcrumbs, sprint or topic rails, assistant buttons, "AI" badges, avatars, role or device switchers, kind badges, or completion buttons.
- Put a breadcrumb, a "Topic N of M" line, a loose metadata row, or a collapsed Objectives disclosure above the activity.
- Make learners assemble code from operand, operator or token radio grids when they could type it.
- Stack several activities' controls in one long workspace, or put results in the panel away from the control that made them.
- Reuse the reference annotation colors (red, green, purple) as UI colors.
- Carry over admin patterns: preview-state toggles, dashed debug chips, bulk-action toolbars, dense data grids, settings forms.
- Use orange or kind colors, gradients, glassmorphism, drop shadows, neon glows, or decorative motion.
- Use white-boxed screenshots, text inside images, or any text under 12 px.

## Token reference

Paste this block first in every page's `<style>`. Light values are the default and print palette; dark values apply on screen for OS dark mode or `data-theme="dark"`. Keep both dark blocks identical.

```css
:root {
  color-scheme: light dark;
  --pep-font-sans: "Figtree", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --pep-font-mono: "Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --pep-radius-sm: 8px; --pep-radius-md: 12px; --pep-radius-lg: 16px; --pep-radius-pill: 999px;
  --pep-space-4: 4px; --pep-space-8: 8px; --pep-space-12: 12px; --pep-space-16: 16px;
  --pep-space-20: 20px; --pep-space-24: 24px; --pep-space-32: 32px; --pep-space-48: 48px;
  --pep-dur-1: 120ms; --pep-dur-2: 200ms; --pep-ease: cubic-bezier(0.2, 0, 0, 1);
  /* light */
  --pep-page: #FFFFFF; --pep-card: #F6F7F9; --pep-control: #EEF0F3; --pep-sunken: #F6F7F9;
  --pep-line: #E4E7EC; --pep-line-strong: #737C8A;
  --pep-text-strong: #171A20; --pep-text: #38414E; --pep-text-muted: #5A616E;
  --pep-accent-fill: #5B3FD6; --pep-accent-fill-hover: #4C33BD; --pep-on-accent-fill: #FFFFFF;
  --pep-accent: #5B3FD6; --pep-accent-text: #5B3FD6; --pep-accent-soft: #F2F0FC;
  --pep-success: #067647; --pep-success-soft: #EBF4F0;
  --pep-danger: #B42318; --pep-danger-soft: #F9EDED;
  --pep-warning: #B54708; --pep-warning-soft: #F9F0EB;
  --pep-focus: #5B3FD6;
}
@media screen and (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --pep-page: #1C1F26; --pep-card: #252A33; --pep-control: #2D333E; --pep-sunken: #16191F;
    --pep-line: #333A48; --pep-line-strong: #7A8396;
    --pep-text-strong: #E7EBF1; --pep-text: #C3CAD6; --pep-text-muted: #9AA2B1;
    --pep-accent-fill: #5B3FD6; --pep-accent-fill-hover: #4C33BD; --pep-on-accent-fill: #FFFFFF;
    --pep-accent: #8B78FF; --pep-accent-text: #A595FF; --pep-accent-soft: #2E2D4D;
    --pep-success: #22E58A; --pep-success-soft: #254841;
    --pep-danger: #FF6B6B; --pep-danger-soft: #362F37;
    --pep-warning: #FFC24D; --pep-warning-soft: #484237;
    --pep-focus: #8B78FF;
  }
}
@media screen {
  :root[data-theme="dark"] {
    --pep-page: #1C1F26; --pep-card: #252A33; --pep-control: #2D333E; --pep-sunken: #16191F;
    --pep-line: #333A48; --pep-line-strong: #7A8396;
    --pep-text-strong: #E7EBF1; --pep-text: #C3CAD6; --pep-text-muted: #9AA2B1;
    --pep-accent-fill: #5B3FD6; --pep-accent-fill-hover: #4C33BD; --pep-on-accent-fill: #FFFFFF;
    --pep-accent: #8B78FF; --pep-accent-text: #A595FF; --pep-accent-soft: #2E2D4D;
    --pep-success: #22E58A; --pep-success-soft: #254841;
    --pep-danger: #FF6B6B; --pep-danger-soft: #362F37;
    --pep-warning: #FFC24D; --pep-warning-soft: #484237;
    --pep-focus: #8B78FF;
  }
}
@media print {
  body { background: #FFFFFF; }
  .pep-noprint { display: none !important; }
  .pep-card, .pep-callout, .pep-figure, .pep-table-wrap, .pep-code, .pep-optional { break-inside: avoid; }
  .pep-callout { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
}
```

Measured contrast (WCAG 2.x), lowest pairing per role:

| Pair | Dark | Light |
| --- | --- | --- |
| Text muted on control | 4.94 | 5.46 |
| Accent text on control | 5.04 | 5.88 |
| On-accent fill on accent fill | 6.72 | 6.72 |
| Success / danger / warning on own soft tint | 6.07 / 4.68 / 6.20 | 5.08 / 5.75 / 4.83 |
| Line strong on control (non-text, ≥3) | 3.33 | 3.69 |
| Focus on control (non-text, ≥3) | 3.76 | 5.88 |

## Provenance

**Source.** A supplied, read-only HTML design reference, "Content rules for the Learner app": an Evolv content-team guide sourced from the Learner app's API and renderer, read 2026-10-15. It was inspected as rendered in headless Chrome at 1440 × 900 and at narrow mobile width, and through its embedded CSS, fonts and six Learner-app screenshots. The source file is not committed.

**[T] Stated by the source** ("Match the Learner look" and the HTML-artifact rules):

- Figtree for text and Source Code Pro for code.
- Type sizes 12, 13, 14, 16, 20 and 28 px only, body 16 px, nothing under 12 px.
- Dark surfaces `#1C1F26` page, `#252A33` card, `#2D333E` control and `#333A48` line.
- Text `#E7EBF1` primary, `#C3CAD6` body and `#9AA2B1` secondary, at 4.5:1 or better.
- Accent `#5B3FD6` buttons and `#8B78FF` highlights; green `#22E58A` correct, red `#FF6B6B` wrong, amber `#FFC24D` warnings.
- Radii 8, 12 and 16 px; spacing 4, 8, 12, 16, 20, 24, 32 and 48 px.
- 44 × 44 px tap targets, a 2 px `#8B78FF` focus ring, and nothing hover-only.
- Inline HTML up to 512 KB, run in a sandboxed frame.
- A column of about 570 px, no fixed widths over 560 px, no horizontal scroll, no fixed-height pages, and no fixed or sticky elements.
- Self-contained, with no trackers; completion is marked in the app.
- Images use alt text and avoid white boxes; tables have five columns or fewer; code blocks stay under 30 lines (15 in questions); readings use sentence-case titles with no emoji.
- The Learner app has light and dark themes.

**[G] The guide's own light styling:**

- Ink `#171A20`, body `#38414E` and muted `#5A616E`.
- Rules `#E4E7EC` and `#D7DCE3`; table header `#F6F7F9` with bold first column.
- Link `#5B3FD6`, hover `#4C33BD`, and "Enforced" red `#B42318`.
- Heading line-height 1.15 with −0.01em tracking; body line-height 1.55.
- Figures avoid page breaks.

**[S] Learner screenshots** (923 × 540 JPEG, sampled ±3 levels):

- Page ≈ `#1B1F28`, card ≈ `#272B34`, control ≈ `#2C3441`, button ≈ `#5C3ED5` and progress fill ≈ `#8777FA`. All match [T] within JPEG error.
- Pill chips with tinted backgrounds.
- 16 px question cards and 12 px option rows with 8 px lettered tiles.
- A segmented progress bar.
- A numbered stepper whose current step is tinted.
- Line icons.
- No shadows on learner surfaces.

**[R] Annotated page-anatomy reference.** This is a supplied, read-only captain screenshot of an existing PEP topic page, annotated freehand. It is not committed, and its annotations are not reproduced.

- Red strokes cross out the breadcrumb and topic position, the minutes · activities · version row, and the "Objectives" disclosure.
- A green band frames the topic name, an activity counter with completion squares, and Restart activity.
- A green box on the left frames the step heading, the concept text, a goal checklist with open/done states, numbered steps, and a goal summary.
- A purple box on the right frames the interactive area, measured at about 42% / 58% of the width.
- The captain's note rejects the area's operand and operator radio "build the expression" selectors in favor of the Monaco-style editor.
- The red, green and purple strokes are annotation semantics only; the page's own teal colors are not adopted either.

**[A] Adaptations made here, and why:**

- **Light theme.** The source gives only dark values. Light roles reuse [G] where it shows them; light `#EEF0F3` control, `#737C8A` line strong, and `#067647` / `#B54708` status values were chosen to pass contrast on white.
- **Contrast fixes.** Accent text is `#A595FF` because `#8B78FF` measures 4.27:1 on cards. Line strong is added because `#333A48` measures 1.4:1 and cannot mark controls. The sunken well and soft tints are each computed and contrast-checked.
- **System fonts.** Font files are not embedded, because the repository contract requires system font stacks.
- **Layout and motion.** Breakpoints at 480 and 960 px, the 1200 px standalone max width, the 68ch measure, motion tokens, print scoping, the components bridge, and all recipe compositions.
- **Anatomy.** The 5fr / 7fr split rounds the [R] proportions. The stacked order, bounded editor and output heights, a visible Goals list that keeps `data-pep-objectives`, and the minutes label in the topic bar keep the contract's content (position, honest minutes, objectives) without the removed furniture.

**Not carried over** (app or admin chrome, or print-only):

- The app top bar, breadcrumbs and sprint carousel with its orange current-item state.
- The topic rail and the assistant and "AI" badges.
- Notifications, the avatar, and role, device and theme switchers.
- The coding-lab "Preview state" dashed chips.
- Kind colors and badges.
- The guide's fixed 8.5 in print sheet with shadow, which scrolls sideways on phones.
- Its bundled `@font-face` fonts and React runtime.
