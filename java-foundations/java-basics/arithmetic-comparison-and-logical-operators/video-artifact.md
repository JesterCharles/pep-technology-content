---
title: Java Programming Tutorial 20 - Comparison and Logical Operators
channel: Caleb Curry
url: https://www.youtube.com/watch?v=avt4GQQ2z74
runtimeMinutes: 7.6
embeddable: true
checkedAt: 2026-10-13
covers:
  - The greater-than operator restricting access by age, with the result always true or false (2:38 to 3:00 and 3:45 to 4:05)
  - The comparison operators ==, !=, <, >, <= and >=, with the equals sign written after the angle bracket (2:59 to 3:45)
  - The && operator requiring both conditions, combining an age check with animal.equals("dogs") (4:07 to 4:45)
  - The || operator requiring at least one condition, and ! inverting a boolean (4:45 to 6:04)
  - Parentheses to control evaluation when && and || are mixed, and && having the higher precedence (6:06 to 6:55)
gaps:
  - Arithmetic operators, remainder (%) and compound assignment are not covered, and arithmetic precedence is not shown, so o1 is not covered
  - Short-circuit evaluation (&& and || skipping their right side) is not covered, so o3 is not covered
cautions:
  - Third-party educator channel (Caleb Curry), part 20 of a Java series, published 2018-11-28; the operators shown are unchanged in current Java
  - Opens with a sponsor segment from 0:08 to 0:58; learners can start at 0:59
  - The example also reads input with Scanner and Integer.parseInt and compares Strings with equals, which this topic does not teach
  - It advises never mixing && and || in one expression and calls the result unclear; Java's rule is defined (&& binds tighter), and the page teaches it
  - Fit was judged from its published caption track; the video was not watched end to end
alternates:
  - title: Order of Operations (Java)
    url: https://www.youtube.com/watch?v=m7MRpy4ruU4
    reason: 3:21 (201 s). First-party Oracle Learn.java series; *, / and % before + and -, each left to right, parentheses, assignment last, integer division and remainder examples per its captions (o1, except compound assignment). Unlisted on YouTube, reachable from the channel's public Learn.java playlist but not from search, and could be withdrawn without notice
  - title: Compound Arithmetic Operators (Java)
    url: https://www.youtube.com/watch?v=cGnpHINpxMA
    reason: 2:50 (170 s). First-party Learn.java series; compound assignment per its title (o1); captions not reviewed. Unlisted, same caution as above
  - title: Short Circuiting Made Easy (Java) (Cedric Sirianni)
    url: https://www.youtube.com/watch?v=ui_PM-woLsE
    reason: 4:36 (276 s). && and || skipping the right-hand operand per its captions (o3). Small independent channel
  - title: Java - Operators - W3Schools.com (w3schools.com)
    url: https://www.youtube.com/watch?v=RbjB3SIaabM
    reason: 4:48 (288 s). Public overview of arithmetic, %, compound assignment, comparison and logical operators (o1 and o2) without precedence or short-circuit; its captions say x++ returns 6 when x is 5, which is wrong for postfix increment
rejected:
  - title: Java arithmetic is easy! 🧮 (Bro Code)
    url: https://www.youtube.com/watch?v=QAD5unRlCyo
    reason: 8:22 (502 s); its PEMDAS segment says multiplication comes before division and addition before subtraction, which is wrong for Java's left-to-right precedence levels
  - title: "#9 Arithmetic Operators in Java (Telusko)"
    url: https://www.youtube.com/watch?v=flWjzwzgybI
    reason: 10:16 (616 s) exceeds the 10-minute budget
  - title: "Java Tutorial for Beginners #3 - Basic Operators (Tech With Tim)"
    url: https://www.youtube.com/watch?v=ofKz3XGv6ZQ
    reason: 12:15 (735 s) exceeds the 10-minute budget
---

# Video: Comparison and Logical Operators

Caleb Curry, Java Programming Tutorial part 20, 7:35 (455 s), https://www.youtube.com/watch?v=avt4GQQ2z74.
Live, public and embeddable on 2026-10-13 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its captions: `>` in an age check (2:38), the full set of comparison operators (2:59), `&&` (4:07), `||` and `!` (4:45), and parentheses with `&&` binding tighter than `||` (6:06).
It matches objective o2.

## Gaps against the objectives

- o1: arithmetic, `%`, compound assignment and arithmetic precedence are not covered.
- o2: covered.
- o3: short-circuit evaluation is not covered.

## Alternates

- Java, "Order of Operations", https://www.youtube.com/watch?v=m7MRpy4ruU4, 3:21 (201 s). First-party Learn.java; arithmetic precedence and remainder (o1). Unlisted.
- Java, "Compound Arithmetic Operators", https://www.youtube.com/watch?v=cGnpHINpxMA, 2:50 (170 s). First-party Learn.java; compound assignment (o1). Unlisted.
- Cedric Sirianni, "Short Circuiting Made Easy (Java)", https://www.youtube.com/watch?v=ui_PM-woLsE, 4:36 (276 s). Covers o3.
- w3schools.com, "Java - Operators - W3Schools.com", https://www.youtube.com/watch?v=RbjB3SIaabM, 4:48 (288 s). Overview of o1 and o2; misstates postfix `x++`.

## Rejected

- Bro Code, "Java arithmetic is easy!", https://www.youtube.com/watch?v=QAD5unRlCyo: its PEMDAS rule is wrong for Java.
- Telusko, "#9 Arithmetic Operators in Java", https://www.youtube.com/watch?v=flWjzwzgybI: 10:16 exceeds the 10-minute budget.
- Tech With Tim, "Java Tutorial for Beginners #3 - Basic Operators", https://www.youtube.com/watch?v=ofKz3XGv6ZQ: 12:15 exceeds the 10-minute budget.
