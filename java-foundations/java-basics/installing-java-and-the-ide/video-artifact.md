---
title: How to Install Java JDK 25 on Windows 11
channel: Amit Thinks
url: https://www.youtube.com/watch?v=Eh9-txew5r8
runtimeMinutes: 3.6
embeddable: true
checkedAt: 2026-10-13
covers:
  - Downloading the JDK 25 Windows installer from Oracle's Java downloads page (0:06 to 0:47)
  - Running the installer with the default location under C:\Program Files (0:59 to 1:50)
  - Adding the JDK 25 bin folder to the Path system environment variable (1:50 to 2:58)
  - Confirming the install with java --version in a new Command Prompt (3:04 to 3:20)
gaps:
  - Apache Maven is not installed and mvn -v is not shown; the same channel's Maven video is listed in alternates
  - The video never contrasts the JDK with a JRE and does not mention javac
  - Why the bin folder must be on the PATH is shown as a step but not explained
  - No IDE appears; opening a Maven project and selecting JDK 25 as the project SDK is not covered
cautions:
  - Third-party educator channel (Amit Thinks / Studyopedia), not a first-party Oracle or JetBrains source; published 2025-09-17
  - Windows 11 only; macOS and Linux learners must follow the page's own steps
  - Uses Oracle's JDK 25 .exe installer; the page's chosen JDK distribution takes precedence
  - Verifies with java --version; the page's objective uses java -version, which prints the same information to standard error
  - Fit was judged from the video description and its published caption track; the video was not watched end to end
alternates:
  - title: How to install Maven in Windows 11 (Updated 2025) (Amit Thinks)
    url: https://www.youtube.com/watch?v=cIneTHgkrQw
    reason: 5:51 (351 s). Same channel; extracts Apache Maven, adds its bin folder to Path, sets MAVEN_HOME and confirms with mvn --version per its captions; pairs with the chosen video for o1
  - title: JVM, JRE, and JDK - Fully Explained in 5 Minutes (Coding with John)
    url: https://www.youtube.com/watch?v=KctLuhwFEQ8
    reason: 5:28 (328 s). Covers o2's JDK versus JRE distinction and that javac ships only in the JDK; its advice to install a JRE alone predates JDK 11, after which Oracle stopped shipping a separate JRE
  - title: "IntelliJ IDEA. Helen's Take On: Project SDK, Language Level and JDKs (IntelliJ IDEA, a JetBrains IDE)"
    url: https://www.youtube.com/watch?v=W4EK_KVgfkw
    reason: 4:33 (273 s). First-party JetBrains; sets the project SDK and language level in Project Structure and downloads a JDK from the IDE (o3). Recorded in 2021 with Java 16 and an older IDE layout
rejected:
  - title: Creating your first Java application with IntelliJ IDEA (IntelliJ IDEA, a JetBrains IDE)
    url: https://www.youtube.com/watch?v=V_vXRRydnYI
    reason: first-party and current (Java 25), but 11:14 (674 s) exceeds the 10-minute budget
  - title: How to install IntelliJ IDEA 2025.3 on Windows 10/11 (64 bit) [ 2026 Update ] with Java JDK 25 (Geeky Script)
    url: https://www.youtube.com/watch?v=0g88HzeVZv0
    reason: 5:30 (330 s), but per its captions it is mostly the IDE installer and subscription screens; JDK 25 is assumed already installed and no PATH or Maven step is shown
---

# Video: How to Install Java JDK 25 on Windows 11

Amit Thinks, 3:33 (213 s), https://www.youtube.com/watch?v=Eh9-txew5r8.
Live, public and embeddable on 2026-10-13 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its captions: download the JDK 25 Windows installer from Oracle (0:06), install it (0:59), add the JDK `bin` folder to the `Path` system variable (1:50), and confirm with `java --version` (3:04).
It matches the JDK half of objective o1 and shows the PATH step behind o2.

## Gaps against the objectives

- o1: Maven is not installed and `mvn -v` is not shown.
- o2: the JDK is never contrasted with a JRE, `javac` is not mentioned, and the reason for the PATH entry is not explained.
- o3: no IDE, Maven project or project SDK appears.

## Alternates

- Amit Thinks, "How to install Maven in Windows 11 (Updated 2025)", https://www.youtube.com/watch?v=cIneTHgkrQw, 5:51 (351 s). Maven install, `Path`, `MAVEN_HOME` and `mvn --version` per its captions; pairs with the chosen video for o1.
- Coding with John, "JVM, JRE, and JDK - Fully Explained in 5 Minutes", https://www.youtube.com/watch?v=KctLuhwFEQ8, 5:28 (328 s). Covers o2; its "install the JRE" advice predates JDK 11.
- IntelliJ IDEA, a JetBrains IDE, "IntelliJ IDEA. Helen's Take On: Project SDK, Language Level and JDKs", https://www.youtube.com/watch?v=W4EK_KVgfkw, 4:33 (273 s). First-party; project SDK, language level and in-IDE JDK download (o3). Recorded with Java 16.

## Rejected

- IntelliJ IDEA, a JetBrains IDE, "Creating your first Java application with IntelliJ IDEA", https://www.youtube.com/watch?v=V_vXRRydnYI: first-party and current, but 11:14 exceeds the 10-minute budget.
- Geeky Script, "How to install IntelliJ IDEA 2025.3 on Windows 10/11 (64 bit) [ 2026 Update ] with Java JDK 25", https://www.youtube.com/watch?v=0g88HzeVZv0: 5:30, but mostly the IDE installer and subscription screens; no PATH or Maven step.
