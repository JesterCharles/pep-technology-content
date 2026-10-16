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
The page anatomy aligns with the HTML contract: position and required minutes live in the topic bar, while course objectives live in a compact native disclosure and per-activity completion criteria stay beside the task.
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
│ Topic (h1)  Activity 2 of 4 ▰▰▱▱  [Objectives] [Restart activity]        │
│ [1 complete] [2 current] [3 locked] [4 locked]                           │
├─────────────────────────────┬────────────────────────────────────────────┤
│ READING + INSTRUCTIONS  5fr │ WORKSPACE                              7fr │
│ h2 Step heading             │ h2 Your task                               │
│ Concept (≤120 words)        │ Exact action and location                   │
│ Where this fits             │ ┌ editor · model · manipulation ─────────┐ │
│ What success looks like     │ │                                        │ │
│ [Need a hint?]              │ └────────────────────────────────────────┘ │
│ [Optional anecdote]         │ Problems | Output · status and why         │
│                             │ [Previous activity] [Next activity]         │
└─────────────────────────────┴────────────────────────────────────────────┘
```

Narrow frame (<960 px, including the ~570 px Evolv column and phones). The topic bar and navigation wrap without becoming horizontal scrollers:

```text
┌──────────────────────────────────┐
│ Topic (h1) [Objectives] [Restart]│
│ Activity 2 of 4 · step links     │
├──────────────────────────────────┤
│ h2 Step heading · concept        │
│ Where this fits · success checks │
│ Need a hint?                     │
├──────────────────────────────────┤
│ h2 Your task · workspace         │
│ Run / Reset · Problems | Output  │
│ Previous activity · Next activity│
└──────────────────────────────────┘
```

### Remove (red in the reference)

- In-page breadcrumb or course / module / topic trail, and "Topic N of M". Evolv already shows where the learner is. [R][T]
- Loose metadata rows such as "About N minutes · 4 activities · Python 3.10 or later". [R]
- A page-wide, task-like **Goals** panel. Course objectives inform the destination; they do not behave like extra completion work. [A]
- Any other page-level chrome above the activity: intro banners, version stamps, duplicate titles and kind badges. [R][T]

Nothing the learner needs to finish the activity is removed:

- The honest minutes label and activity position remain quiet text in the topic bar. [A]
- Course objectives move to a compact native **Objectives** or **What you’ll learn** disclosure in that bar. It keeps `data-pep-objectives` and one `li` per objective for companion derivation. [A]
- Observable requirements move beside their activity under **What success looks like** or **Activity checks** (`data-pep-activity-checks`). They are not labeled Goals. [A]
- A required runtime or version note becomes one sentence in the first instruction that depends on it. [A]

### Topic bar (green top band)

One compact wrapping row holds the topic `h1`, progress text and segments, the native objectives disclosure, and **Restart activity**. The objectives summary is the visible control and has a relationship to its body; native click, focus, keyboard and tap always work. Desktop hover MAY additionally open it, but must never be the only path. Escape and outside click close an enhanced disclosure, print expands it, and no JavaScript leaves ordinary `<details>` behavior. [A]

### Reading and instruction panel (green left)

The narrower region holds the step heading, complete core concept, nearby success checks and optional hint or anecdote disclosures. When the concept presents a meaningful practitioner choice, a separate **Where this fits** pattern states the authentic decision, a good-fit use and an important when-not-to-use boundary; omit it rather than manufacture context when no useful choice exists. It is practical context, not the anecdote repeated under a new heading. [A]

### Interactive workspace (purple)

The wider region opens with **Your task**, naming the exact action and where to perform it, then holds only the current activity's interaction and feedback: editor, model or manipulation; Run and Reset; Problems and Output; and status with verdict and explanation. Results appear next to the control that produced them. [R][A]

### Alignment, scrolling and activity state

- **Wide frames** (≥960 px): two columns, `minmax(0, 5fr) minmax(0, 7fr)`, top-aligned, with a 24 px gap. [R][A]
- **Narrow frames** (<960 px): one column in source order: topic bar → complete instruction → optional guidance → workspace → feedback → reversible navigation. [A]
- **Bounded scrolling.** Only the editor body and Problems/Output may scroll internally, at the maxima in [Editor workspace](#editor-workspace). [T][A]
- **One activity at a time with reversible access.** JavaScript-enhanced pages show one current activity. Completed and current timeline steps are links; future steps remain visibly locked. **Previous activity** sits beside Continue/Next. Moving either direction preserves completed work, attempts, open feedback and current inputs. [A]
- **State model.** Keep `currentActivity`, a monotonic `unlockedThrough` frontier, and each activity's live inputs, attempts, settled feedback, completion, credit, grade contribution and Continue availability separately. Navigation changes only `currentActivity`; it never issues credit. Restart restores only the current authored controls, attempts, settled UI, feedback, completion, credit, grade and Continue state; it preserves every other activity, the unlocked frontier and required time, then permits one credit on re-completion. Expose these values through the stable `data-pep-current-activity`, `data-pep-unlocked-through`, `data-pep-required-minutes`, `data-pep-attempts`, `data-pep-settled`, `data-pep-completed`, `data-pep-credit`, `data-pep-grade`, `data-pep-continue` and `data-pep-feedback` QA hooks. [A]
- **History and fallback.** Push `#activity-N` on explicit navigation and respond to Back/Forward (`popstate` or `hashchange`) without recreating activity state. Ignore a deep link beyond `unlockedThrough`. Without JavaScript, render every activity as an ordinary anchored section with a table-of-contents link and a **Back to activity N** link; do not author later sections with `hidden`. [A]
- After explicit keyboard or pointer navigation, focus the destination activity heading. Do not move focus for browser Back/Forward. Native buttons and links provide keyboard and screen-reader names; all remain 44 px touch targets. [A]

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
- Restart activity clears only the current activity without duplicate credit or loss in earlier activities.
- Previous/Next, completed/current timeline links, browser Back/Forward and the no-JavaScript anchors all reach the same activity order.
- Every control works by keyboard and touch, with no keyboard, focus or scroll trap.

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
Every enrolled page prints non-empty activity and teaching content, activity-check headings/criteria, the Objectives label/body/list, each hint label/target/step, each optional label/cue/body/time or criteria, and an actually rendered representation for every static alternative. Timeline, Previous/Next and back-link controls disappear. The print helper opens closed disclosures for `beforeprint`, remembers every exact prior state, and restores that complete state array on `afterprint`; without JavaScript, learners can open native disclosures before printing. Buttons and toggles MAY be hidden with a `pep-noprint` class, and backgrounds drop to white except status tints. [A]

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

New or re-authored pages use `<main class="pep-main" data-pep-responsive>`. The stable marker enrolls that page in the current 320/390/768, touch and zoom QA matrix; add it only when the page actually meets this contract, never as a marker-only migration. Add `data-pep-guidance-contract` only when the page also adopts objectives, reversible navigation, activity checks, applicable hint hooks and any meaningful fit guidance below; the marker and complete `qa-paths.json` `guidance` object are mandatory together. Mark the complete instruction block with `data-pep-instructions` and its following interaction with `data-pep-workspace` so reading order is deterministic.

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

### Topic bar, objectives, regions and activity checks

```html
<header class="pep-topicbar">
  <h1>Topic name</h1>
  <span class="pep-topicbar__progress">Activity 2 of 4 · about 14 min</span>
  <details class="pep-objectives" data-pep-objectives>
    <summary aria-controls="pep-objectives-body">Objectives</summary>
    <div id="pep-objectives-body"><ul><li>Explain the topic outcome.</li></ul></div>
  </details>
  <button class="pep-btn" type="button" data-pep-reset>Restart activity</button>
</header>
```

```css
.pep-topicbar {
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px;
  padding: 0 0 12px; margin: 0 0 24px; border-bottom: 1px solid var(--pep-line);
}
.pep-topicbar h1 { flex: 1 1 240px; min-width: 0; }
.pep-topicbar__progress { flex: 1 1 220px; min-width: 0; color: var(--pep-text-muted); font: 600 13px/20px var(--pep-font-sans); font-variant-numeric: tabular-nums; }
.pep-objectives { position: relative; break-inside: avoid; }
.pep-objectives > summary { display: flex; align-items: center; min-height: 44px; padding: 8px 12px; cursor: pointer; color: var(--pep-accent-text); font-weight: 600; }
.pep-objectives > div { width: min(360px, 100%); padding: 12px 16px; border: 1px solid var(--pep-line-strong); border-radius: var(--pep-radius-md); background: var(--pep-card); }
.pep-regions { display: grid; grid-template-columns: minmax(0, 1fr); gap: 24px; }
@media (min-width: 960px) { .pep-regions { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); align-items: start; } }
.pep-region { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.pep-activity-checks { padding: 12px 16px; border: 1px solid var(--pep-line); border-radius: var(--pep-radius-md); background: var(--pep-card); }
@media print { .pep-objectives > div { display: block !important; width: auto; } }
```

Native `<details>` is the required no-JavaScript fallback. If script adds hover for a fine pointer, focus and click/tap MUST still open it; Escape closes and returns focus to the summary, outside click closes, and `aria-controls` keeps the visible relationship. The print helper opens objectives before print and restores only what it opened. Restart remains a secondary 44 px button and clears only the current activity. [A]

### Where this fits

Use this pattern after the core explanation and before task instructions **only when the topic or activity presents a meaningful practitioner choice**. One topic-level decision is enough unless activities genuinely involve different choices. Omit the entire section when no useful decision exists; do not create boilerplate. Keep it separate from the optional anecdote.

```html
<section data-pep-where-fits aria-labelledby="where-fits">
  <h2 id="where-fits">Where this fits</h2>
  <p data-pep-fit-decision><strong>Decision:</strong> Name the real choice a practitioner faces.</p>
  <p data-pep-fit-good><strong>Good fit:</strong> Name the bounded situation where this concept helps.</p>
  <p data-pep-fit-boundary><strong>Choose something else when:</strong> Name one important boundary.</p>
</section>
```

The decision is authentic rather than rhetorical. The good fit describes actual scale and purpose. The boundary names a materially different tool or structure, not merely “when it is hard.” This section may use necessary domain terms, but contains no answer to the activity. It is a peer—not a descendant—of teaching, task, workspace, hints and optional content. Topic-level placement uses the nearest preceding topic teaching and following task/workspace; an activity-local instance belongs to that activity, follows its local/applicable teaching and precedes its own task. Structural QA checks direct ownership, order, non-empty fields and placement; independent education and technology-SME review judges whether the choice is meaningful, authentic and technically true. [A]

### Progressive optional hints

Put a native disclosure inside each `data-pep-task data-pep-may-stall` task; this canonical containment implements “beside the task” visually and gives QA one unambiguous local owner. Hints are optional guidance, not delayed error feedback. Multi-hint sequences are nested so a later hint does not exist in the rendered or keyboard path until its predecessor opens.

```html
<details class="pep-hint" data-pep-hint data-pep-hint-for="task-3"
         data-pep-hint-order="1" data-section-skip>
  <summary><span>Need a hint?</span><span>Hint 1 of 2 for Activity 3</span></summary>
  <div class="pep-hint__body">
    <p data-pep-hint-target><strong>Where to act:</strong> In the first placeholder in the editor.</p>
    <p data-pep-hint-step><strong>Next step:</strong> Identify the value collected on each matching pass.</p>
    <details class="pep-hint" data-pep-hint data-pep-hint-for="task-3"
             data-pep-hint-order="2" data-section-skip>
      <summary><span>Another hint</span><span>Another hint, 2 of 2 for Activity 3</span></summary>
      <div class="pep-hint__body">
        <p data-pep-hint-target><strong>Where to act:</strong> In the source part of that placeholder.</p>
        <p data-pep-hint-step><strong>Next step:</strong> Identify which collection supplies each candidate value.</p>
      </div>
    </details>
  </div>
</details>
```

Use one hint when one reasoning step is enough. Every task has a unique non-empty `id`, and every contained hint's `data-pep-hint-for` resolves to that exact task in the same activity. Multiple hints use `1..N` in source order and nest each later disclosure inside its predecessor. Visible and browser-computed summary names begin with **Need a hint?** / **Another hint**, include activity and ordinal, and remain unique even with ARIA naming attributes. Closing an ancestor makes later hints unavailable without deleting them. Each hint owns exactly one non-empty target and step; normalized clues cannot duplicate. A hint never supplies the final answer, finished expression, reference implementation, private test or exact required output. It carries no objective, interaction, progress, grade or completion hook, is excluded from required time with `data-section-skip`, and remains keyboard/touch/screen-reader operable without JavaScript. Machine checks establish structure, sequence, naming and high-confidence answer safety; independent education and SME review decides whether each clue genuinely adds reasoning help and remains semantically answer-safe. [A]

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
    <p data-pep-anecdote-story>Imagine a labeled shelf in a busy stockroom: the label stays while different parcels come and go.</p>
    <p data-pep-anecdote-map>A variable likewise keeps its name while the value it holds can change.</p>
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
      printOpened = [...document.querySelectorAll(
        'details[data-pep-optional]:not([open]), details[data-pep-objectives]:not([open]), details[data-pep-hint]:not([open])'
      )];
      printOpened.forEach(details => { details.open = true; });
    });
    addEventListener('afterprint', () => {
      printOpened.forEach(details => { details.open = false; });
      printOpened = [];
    });
  })();
</script>
```

Both disclosures are closed in authored HTML (no `open` attribute). Native `<summary>` supplies keyboard, touch and screen-reader behavior; scripts do not replace it or move focus after toggling. The print helper changes disclosure state only for printing and restores the authored state.

An anecdote contains exactly one non-empty `data-pep-anecdote-story`: a concrete everyday story, analogy or plain-language mental model. It is code-free and contains no syntax, pseudocode, API name, terminal command, exact program output, or second copy of the ordinary technical explanation. It needs no magic cue such as “imagine”; ordinary words such as “terminal” and “prints,” generic call-shaped prose and ordinary parentheticals are not code by themselves. One optional non-empty `data-pep-anecdote-map` sentence (at most 25 words) may connect the story back to the concept in plain language. Parsed QA applies one-pass canonical UTF-8 base64, percent and hex-byte decoding, then rejects high-confidence syntax, dotted API calls, explicit `sorted(...)` / `open(...)` forms, common executable command forms and exact exception/output text. Independent education and SME review—not a broad keyword heuristic—judges concreteness, usefulness, disguised technical restatement and truth. Core teaching remains complete while it is closed. A challenge extends only taught objectives and labels time as additional. Optional descendants carry no `data-interaction`, `data-confidence`, objectives, required progress or completion hook. Opening, attempting, resetting or printing them cannot change required progress, completion, grade, Continue or `pep:budget-minutes`. [A]

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
- **Timelines and process maps.** Activity steps are anchors. Completed and current anchors are operable; future anchors use `aria-disabled="true"`, are guarded in script, and are not unlocked by URL fragments. A horizontal map MAY be used only when it fits 560 px with labels at 13 px or larger. [A]

Use ordinary anchored sections first, then enhance them. The live page owns richer state than this compact navigation recipe; `renderActivity` must never recreate controls or overwrite values.

```html
<nav aria-label="Activities"><ol class="pep-steps">
  <li><a class="pep-step" href="#activity-1" data-pep-activity-link>Activity 1</a></li>
  <li><a class="pep-step" href="#activity-2" data-pep-activity-link aria-disabled="true">Activity 2</a></li>
</ol></nav>
<section id="activity-1" data-pep-activity>…</section>
<section id="activity-2" data-pep-activity>… <a href="#activity-1" data-pep-back-link>Back to activity 1</a></section>
<div class="pep-activity-actions" role="group" aria-label="Activity navigation">
  <button class="pep-btn" type="button" data-pep-previous>Previous activity</button>
  <button class="pep-btn pep-btn--primary" type="button" data-pep-next>Next activity</button>
</div>
```

```css
.pep-activity-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.pep-activity-actions .pep-btn { flex: 1 1 180px; }
@media (min-width: 481px) { .pep-activity-actions .pep-btn { flex: 0 1 auto; } }
@media print { .pep-activity-actions, nav[aria-label="Activities"] { display: none; } [data-pep-activity] { display: block !important; } }
```

```js
const state = { currentActivity: 1, unlockedThrough: 1, completed: new Set() };
function go(number, mode = 'push', moveFocus = true) {
  if (number < 1 || number > state.unlockedThrough) return;
  state.currentActivity = number; // Do not rebuild controls: their values remain in the DOM.
  document.querySelectorAll('[data-pep-activity]').forEach((section, index) => {
    section.hidden = index + 1 !== number;
  });
  document.querySelectorAll('[data-pep-activity-link]').forEach((link, index) => {
    const n = index + 1;
    if (n === number) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
    if (n > state.unlockedThrough) link.setAttribute('aria-disabled', 'true');
    else link.removeAttribute('aria-disabled');
  });
  history[mode === 'replace' ? 'replaceState' : 'pushState']({ activity: number }, '', `#activity-${number}`);
  if (moveFocus) document.querySelector(`#activity-${number} h2`)?.focus();
}
addEventListener('popstate', () => go(Number(location.hash.match(/activity-(\d+)/)?.[1]), 'replace', false));
```

A production page also binds Previous/Next and ordinary back links, guards timeline clicks, sets disabled states and reflects the stable state hooks above. Completion advances `unlockedThrough`; revisiting does not. Locked activation and every future fragment change neither current activity nor frontier; a disallowed fragment normalizes to the canonical allowed fragment. Back/Forward restores an unlocked activity without changing state or moving focus. Author QA arrays establish a nonzero attempt, meaningful inputs in at least two activities, prior completion/credit and a later unlocked current activity; they never choose the assertions. The harness preserves pre-setup authored controls and required time, checkpoints every setup action, accepts page completion only with a coherent observed activity-completion transition, and prevents later setup navigation from redefining that checkpoint. It requires the current task and directly owned check heading/criteria to stay visibly rendered at initial load, every setup boundary and every harness destination. It then activates all navigation and Restart and compares complete root/control/activity snapshots across top-level and sandbox pointer, keyboard and 320/390 touch. Before both wrong-attempt and completed Restart it changes the current controls away from their authored values; Restart must restore every current text/check/selection value exactly, clear only current state, preserve other activities, page completion, frontier and required time, and award exactly one credit after re-completion. Because state lives entirely in the standalone page and guarded storage is optional, navigation works offline and in the sandbox. [A]

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
.pep-code mark { background: var(--pep-accent-soft); color: inherit; border-radius: var(--pep-radius-sm); }
:not(pre) > code { padding: 1px 6px; border-radius: var(--pep-radius-sm); background: var(--pep-control); color: var(--pep-text-strong); }
.pep-terminal { padding: 12px 16px; background: var(--pep-sunken); color: var(--pep-text-strong); border: 1px solid var(--pep-line-strong); border-radius: var(--pep-radius-sm); font: 400 14px/20px var(--pep-font-mono); overflow-wrap: anywhere; }
.pep-terminal:focus-within { border-color: var(--pep-focus); box-shadow: 0 0 0 1px var(--pep-focus); }
.pep-terminal .prompt { color: var(--pep-accent-text); font-weight: 600; }
.pep-terminal .err { color: var(--pep-danger); }
```

- Code blocks are under 30 lines, and under 15 in a question. Wrap long lines rather than scroll sideways. [T][A]
- Syntax color is limited to three roles (keyword, string, comment). Never use green or red for anything that could read as a verdict, except `tok-str`, which never sits next to a correctness badge. [A]
- An unsupported command shows a warning callout ("Not available in this practice terminal"), not danger red; the learner did nothing wrong. [A]

### Python comprehension activity correction recipe

For Python Slicing and Comprehensions Activity 3, keep the bounded editor but replace the vague “type the loop as comprehensions” prompt with the following downstream contract. This is a correction recipe, not learner-byte content for this change.

- Put a concise **Your task** block immediately adjacent to `comprehensions.py`, before the editor in source and visual order.
- Name two edits in order: (1) replace the `result` placeholder with a **list comprehension** equivalent to the shown loop; (2) replace the `doubled` placeholder with a **set or dict comprehension** that doubles only prices over 10. Say explicitly that each `___` stands for one whole comprehension, not one number or keyword.
- Explain the shown loop before asking for the rewrite: it visits `prices`, keeps values over 10, doubles each kept value, and produces `[24, 24, 60]`; the repeated 24 is retained because the loop builds a list. This observable loop result is context, not a client-visible finished comprehension.
- Keep **Problems**, **Output**, Run, Reset code and the bounded editor visible. Problems identifies an unsupported shape or a location to fix; Output compares the learner's resulting values with the shown loop behavior. Never embed a complete expression, answer key, hidden solution, reference implementation or private test in HTML, JavaScript, static alternatives or hint copy.
- Consolidate the existing applicable **Where this fits** teaching rather than adding a duplicate: comprehensions fit a bounded iterable already in memory when the transform/filter remains clear as one expression and the whole result is needed. Consider a generator or iterator approach for large or streaming inputs. Prefer an ordinary loop for side effects, multi-step branching, per-item exception handling, early exit, or whenever it states the control flow more clearly.
- Supply nested progressive hints in this order: identify the **collected value**; identify the `for` **source**; decide whether the optional **filter** is needed; then, for the second placeholder, distinguish set uniqueness from dict key-to-value association. Each later disclosure is nested in its predecessor and cannot provide a final expression.
- Declare the task and its two targets through the answer-sensitive hooks shown below. QA inventories decoded text, attributes and comments across the whole page, no-JavaScript/templates/static alternatives, embedded JavaScript strings/escapes/literal concatenation and every QA string. It decodes canonical UTF-8 base64, percent and hex-byte forms, rejects target-associated decoders/digests, then uses CPython `tokenize` and recursive `ast` target/value pairing (including prose spans, wrappers and tuple targets). Target assignments fail anywhere; standalone comprehensions fail only on answer-bearing surfaces so unrelated teaching remains legal. This scanner does not prove semantic equivalence or opaque provenance; an independent Python SME still judges leakage.

```html
<section id="task-3" data-pep-task data-pep-may-stall data-pep-instructions
         data-pep-answer-sensitive="python-comprehension"
         data-pep-answer-targets="result doubled">
  <h2>Your task</h2>
  <ol>
    <li>In <code>result = ___</code>, replace the placeholder with one list comprehension that matches the shown loop.</li>
    <li>In <code>doubled = ___</code>, replace the placeholder with one set or dict comprehension for doubled prices over 10.</li>
  </ol>
  <p>Each <code>___</code> stands for one whole comprehension. The shown loop keeps qualifying prices, doubles them, and builds <code>[24, 24, 60]</code>.</p>
  <details class="pep-hint" data-pep-hint data-pep-hint-for="task-3" data-pep-hint-order="1" data-section-skip>
    <summary><span>Need a hint?</span><span>Hint 1 of 4 for Activity 3</span></summary>
    <div class="pep-hint__body">
      <p data-pep-hint-target><strong>Where to act:</strong> Start in the first placeholder after <code>result =</code>.</p>
      <p data-pep-hint-step><strong>Next step:</strong> Name the value the loop adds on each qualifying pass; that becomes the collected-value part.</p>
      <!-- Nest hint 2 here; nest hints 3 and 4 in the same strict sequence. -->
    </div>
  </details>
</section>
<div data-pep-workspace="code"><!-- bounded editor, then Problems and Output --></div>
```

**Semantic review boundary.** Machine checks prove structure and reject detectable completed expressions; they do not prove transfer. Education review asks whether, after only **Your task** and hint 1, a learner can state what to type and where without seeing the answer. The Python SME separately checks technical truth, representative practice, collection semantics and when-not-to-use boundaries. [A]

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
- Keep course objectives in the topic-bar native disclosure (`data-pep-objectives`) and per-activity completion criteria beside the task (`data-pep-activity-checks`).
- Put **Previous activity** beside Next/Continue; preserve activity work across both directions and browser history while keeping future steps locked.
- Put native progressive **Need a hint?** disclosures beside tasks where a learner may reasonably stall, outside required progress, grading and time.
- Include a separate **Where this fits** decision, good fit and when-not-to-use boundary when the concept presents a meaningful practitioner choice; otherwise omit it.
- Give code-writing objectives the editor workspace, not piece selectors; keep its instructions first, mobile controls visible, heights bounded and no-JavaScript reading complete.
- Keep Optional Anecdote and Challenge disclosures native, closed by default, public-safe and outside all required objective, progress, completion and time accounting. Keep anecdotes concrete, everyday and code-free.

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
- Put a breadcrumb, a "Topic N of M" line, a loose metadata row, a page-wide Goals panel, or objectives outside the topic bar.
- Rely on hover for objectives, hints or navigation.
- Use an anecdote for code, syntax, commands, output or a second technical explanation.
- Make learners assemble code from operand, operator or token radio grids when they could type it.
- Stack several activities' controls in one long enhanced workspace, lock completed steps, discard inputs during navigation, or put results away from the control that made them.
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
  .pep-card, .pep-callout, .pep-figure, .pep-table-wrap, .pep-code, .pep-optional, .pep-hint, .pep-objectives { break-inside: avoid; }
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
- **Anatomy.** The 5fr / 7fr split rounds the [R] proportions. The stacked order, bounded editor and output heights, topic-bar objectives, activity-local checks, reversible navigation and the minutes label keep required context without page-wide Goals furniture.

**Not carried over** (app or admin chrome, or print-only):

- The app top bar, breadcrumbs and sprint carousel with its orange current-item state.
- The topic rail and the assistant and "AI" badges.
- Notifications, the avatar, and role, device and theme switchers.
- The coding-lab "Preview state" dashed chips.
- Kind colors and badges.
- The guide's fixed 8.5 in print sheet with shadow, which scrolls sideways on phones.
- Its bundled `@font-face` fonts and React runtime.
