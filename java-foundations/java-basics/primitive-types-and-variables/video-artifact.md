---
title: Java Tutorial - Basic data types and variables
channel: LinkedIn Learning
url: https://www.youtube.com/watch?v=sVIvhzEizEQ
runtimeMinutes: 6.5
embeddable: true
checkedAt: 2026-10-13
covers:
  - The boolean, int, double and char primitive types with everyday examples of values each can hold (0:54 to 2:11)
  - Declaring a variable with a type, a name and a value, and the compile errors when the type or semicolon is missing (2:13 to 3:12)
  - The equals sign as the assignment operator, and int, double, char and boolean variables for one student record (3:13 to 4:50)
  - Printing each variable's value with System.out.println (5:02 to 6:04)
gaps:
  - long is not shown, and the video implies boolean, int, double and char are the only primitives ("the last primitive type is a char")
  - Integer division, overflow and narrowing casts are not covered, so o2 is not covered
  - Every variable is declared and initialized in one statement; a declaration without a value, followed by a later assignment, is not shown
  - var is not mentioned
cautions:
  - Excerpt from a LinkedIn Learning course on the LinkedIn Learning YouTube channel, published 2021-02-01
  - Tell learners Java has eight primitive types; the page's own table carries long and the others
  - Fit was judged from its published caption track; the video was not watched end to end
alternates:
  - title: Casting a Primitive and Overflow (Java Tutorial) (Bill Barnum)
    url: https://www.youtube.com/watch?v=hTShKthSARE
    reason: 5:14 (314 s). AP Computer Science teacher; widening versus narrowing, a double cast to int truncates, and int-to-byte overflow wrapping to -128 per its captions (o2, except integer division)
  - title: Casting Conversions (Java)
    url: https://www.youtube.com/watch?v=IyEFW4irA6I
    reason: 3:10 (190 s). First-party Oracle Learn.java series; integer versus double division and casting to double or int (o2, except overflow). Unlisted on YouTube, reachable from the channel's public Learn.java playlist
  - title: Declaring and Initializing Primitive Variables (Java)
    url: https://www.youtube.com/watch?v=BFefykONlD0
    reason: 2:27 (147 s). First-party Learn.java series; declaration first, then assignment, traced in a variable table (o3, without var). Unlisted, in the public Learn.java playlist
rejected:
  - title: Java - Data Types - W3Schools.com (w3schools.com)
    url: https://www.youtube.com/watch?v=D3DqJrlckbs
    reason: 4:08 (248 s), but per its captions it uses float for a price and says a char can hold an emoji, both misleading for beginners
  - title: Primitives Data Types In Java - All the Primitives And What They Do (Coding with John)
    url: https://www.youtube.com/watch?v=WQ7mvQFSmYc
    reason: 10:23 (623 s) exceeds the 10-minute budget
  - title: Variables in Java ✘【12 minutes】 (Bro Code)
    url: https://www.youtube.com/watch?v=so1iUWaLmKA
    reason: 12:32 (752 s) exceeds the 10-minute budget
---

# Video: Java Tutorial - Basic data types and variables

LinkedIn Learning, 6:29 (389 s), https://www.youtube.com/watch?v=sVIvhzEizEQ.
Live, public and embeddable on 2026-10-13 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its captions: the `boolean`, `int`, `double` and `char` types (0:54), declaring a typed variable and the errors without a type or semicolon (2:13), `=` as assignment for one student record (3:13), and printing each value (5:02).
It matches most of objective o1 and the assignment half of o3.

## Gaps against the objectives

- o1: `long` is not shown, and the video implies only four primitive types exist.
- o2: integer division, overflow and narrowing casts are not covered.
- o3: declaration is never separated from assignment, and `var` is not mentioned.

## Alternates

- Bill Barnum, "Casting a Primitive and Overflow (Java Tutorial)", https://www.youtube.com/watch?v=hTShKthSARE, 5:14 (314 s). Narrowing casts, truncation and overflow (o2).
- Java, "Casting Conversions", https://www.youtube.com/watch?v=IyEFW4irA6I, 3:10 (190 s). First-party Learn.java; integer division and casts (o2). Unlisted.
- Java, "Declaring and Initializing Primitive Variables", https://www.youtube.com/watch?v=BFefykONlD0, 2:27 (147 s). First-party Learn.java; declaration then assignment (o3). Unlisted.

## Rejected

- w3schools.com, "Java - Data Types - W3Schools.com", https://www.youtube.com/watch?v=D3DqJrlckbs: uses `float` for a price and says a `char` can hold an emoji.
- Coding with John, "Primitives Data Types In Java - All the Primitives And What They Do", https://www.youtube.com/watch?v=WQ7mvQFSmYc: 10:23 exceeds the 10-minute budget.
- Bro Code, "Variables in Java ✘【12 minutes】", https://www.youtube.com/watch?v=so1iUWaLmKA: 12:32 exceeds the 10-minute budget.
