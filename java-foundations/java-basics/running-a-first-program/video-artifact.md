---
title: How to Run Java Programs With Command Prompt (cmd) and Notepad in Windows
channel: Coding with John
url: https://www.youtube.com/watch?v=uA4eQbC3JgA
runtimeMinutes: 5.7
embeddable: true
checkedAt: 2026-10-13
covers:
  - Checking the JDK from Command Prompt with java -version (1:04 to 1:25)
  - Saving source in a .java file rather than .txt (1:38 to 2:40)
  - Compiling with javac and the file name including .java, then finding the generated .class bytecode file (4:01 to 4:30)
  - A missing closing quote producing a compiler error printout, then fixing, saving and recompiling (4:35 to 4:52)
  - Running the compiled class with java and the class name, without the .java extension (4:54 to 5:14)
gaps:
  - Single-file source-code launch (java Hello.java with no javac step) is not shown, so o2 is not covered
  - The compiler error is shown only briefly; reading its file name, line number and message is not walked through
  - Uses the traditional public class with public static void main; Java 25 compact source files and instance main methods are not mentioned
cautions:
  - Third-party educator channel (Coding with John), published 2021-11-15; the javac and java steps are unchanged in JDK 25
  - Windows 11, Notepad and File Explorer only; macOS and Linux learners use a terminal and editor of their choice
  - Ends with a promotion for the presenter's paid course
  - Fit was judged from the video description and its published caption track; the video was not watched end to end
alternates:
  - title: Scripting with Java - Sip of Java (Java)
    url: https://www.youtube.com/watch?v=A3Gbeue0TUo
    reason: 1:00 (60 s). First-party Oracle; names JEP 330 single-file source-code launch (JDK 11) and shebang files per its captions, then moves to Console and file I/O; no on-screen walkthrough of java Hello.java is confirmed
  - title: Script Java Easily in 21 and Beyond - Inside Java Newscast #49 (Java)
    url: https://www.youtube.com/watch?v=P9JPUbG5npI
    reason: 7:11 (431 s). First-party Oracle; source launch and the simplified main method from the JDK 21 preview (JEP 445) and the multi-file launch draft. Preview-era syntax differs from the final Java 25 feature
rejected:
  - title: "Starting (With) Java, Made Simple - Inside Java Newscast #35 (Java)"
    url: https://www.youtube.com/watch?v=Au3z_kQd9QY
    reason: first-party, 5:36 (336 s), but it discusses a 2022 design proposal for beginner syntax, not how to compile or run a program today
  - title: Java's Hello World Is About To Change Forever (Coding with John)
    url: https://www.youtube.com/watch?v=ZibsO2doQjU
    reason: 10:22 exceeds the 10-minute budget, and it previews a pre-release feature
  - title: Creating your first Java application with IntelliJ IDEA (IntelliJ IDEA, a JetBrains IDE)
    url: https://www.youtube.com/watch?v=V_vXRRydnYI
    reason: 11:14 (674 s) exceeds the 10-minute budget; it also runs from the IDE, not javac and java
---

# Video: How to Run Java Programs With Command Prompt (cmd) and Notepad in Windows

Coding with John, 5:43 (343 s), https://www.youtube.com/watch?v=uA4eQbC3JgA.
Live, public and embeddable on 2026-10-13 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its captions: check the JDK with `java -version` (1:04), create a `.java` file (1:38), compile with `javac` and see the `.class` file (4:01), meet a compiler error from a missing quote and recompile (4:35), and run with `java` and the class name (4:54).
It matches objective o1 and touches o3.

## Gaps against the objectives

- o1: covered.
- o2: `java Hello.java` single-file launch is not shown.
- o3: the error printout appears briefly; locating the file, line and cause is not walked through.

## Alternates

- Java, "Scripting with Java - Sip of Java", https://www.youtube.com/watch?v=A3Gbeue0TUo, 1:00 (60 s). First-party; names single-file source-code launch (JEP 330); no on-screen `java Hello.java` walkthrough is confirmed.
- Java, "Script Java Easily in 21 and Beyond - Inside Java Newscast #49", https://www.youtube.com/watch?v=P9JPUbG5npI, 7:11 (431 s). First-party; source launch and the JDK 21 preview of a simpler `main`; preview syntax differs from Java 25.

## Rejected

- Java, "Starting (With) Java, Made Simple - Inside Java Newscast #35", https://www.youtube.com/watch?v=Au3z_kQd9QY: a 2022 design proposal, not a how-to.
- Coding with John, "Java's Hello World Is About To Change Forever", https://www.youtube.com/watch?v=ZibsO2doQjU: 10:22 exceeds the 10-minute budget.
- IntelliJ IDEA, a JetBrains IDE, "Creating your first Java application with IntelliJ IDEA", https://www.youtube.com/watch?v=V_vXRRydnYI: 11:14 exceeds the budget and runs from the IDE.
