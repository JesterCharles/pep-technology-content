# Installing Java and the IDE

## Objectives

- Install a JDK 25 LTS build and Apache Maven, then confirm both with java -version and mvn -v
- Tell the JDK from a JRE and explain why javac, java and Maven must each be found on the PATH
- Open a Maven project in the IDE and select JDK 25 as its project SDK

## Teaching

### Start with a guess

Practice prediction, not scored.

### The JDK, and how the shell finds it

The JDK (Java Development Kit) holds the compiler `javac`, the launcher `java` and other tools. A JRE (runtime) could only run programs, never compile them; OpenJDK and Oracle no longer ship one, so install a full JDK 25, the current long-term support (LTS) release.

When you type a command, the shell searches the folders in `PATH` from left to right and runs the first match. To install Maven, extract its archive and add its `bin` folder to `PATH`. Maven then runs Java from `JAVA_HOME` if it is set, otherwise the `java` found on `PATH`.

### Open a Maven project in the IDE

This course uses IntelliJ IDEA; VS Code with Java support is a documented alternative.

- Open: File | Open, choose the project's `pom.xml`, then Open as Project. The IDE reads the POM and syncs the project.
- Set the JDK: File | Project Structure | Project, then pick JDK 25 in the SDK list, or Add JDK from disk and choose its home folder.

The IDE keeps its own JDK list, separate from your terminal's `PATH`.

### Apply it to a new machine

Same rules: what is in each folder, and which folder comes first.

## Model

How the shell finds a command: PATH, left to right. Ana's fictional machine; the terminal is a simulation.

PATH folders, searched in order

1. /usr/lib/jvm/java-17/bin java, javac, jshell
2. /opt/jdk-25/bin java, javac, jshell
3. /usr/bin other tools
4. /bin other tools

Last lookup

None yet.

JAVA_HOME

(not set)

## Recap

- Install a full JDK 25: it has `javac` and `java`.
- The shell runs the first match it finds in `PATH`, left to right; put the JDK's and Maven's `bin` folders there, then confirm with `java -version`, `javac -version` and `mvn -v` in a new terminal.
- In the IDE, open the project's `pom.xml` as a project and select JDK 25 as the project SDK.

### Now set up your own computer

Install on your coding lab computer by following each vendor's official guide, linked below; those pages keep their steps current. Opening them and downloading needs network access.

1. Find your architecture. macOS: Apple menu | About This Mac shows Chip on Apple silicon (choose aarch64) or Processor on Intel (choose x64). Windows: Settings | System | About, then System type: x64-based means x64, ARM-based means aarch64. Linux: `uname -m` prints `x86_64` (x64) or `aarch64`.
2. Install JDK 25. On the Eclipse Temurin releases page, choose your system, your architecture and JDK 25 - LTS. Then follow the guide for your system: macOS .pkg, Windows .msi (keep the PATH feature and also turn on the `JAVA_HOME` feature) or Linux packages (the package is `temurin-25-jdk`). Done when the installer finishes without an error.
3. Install Maven. Follow Installing Apache Maven: download the binary archive from the Maven download page, extract it, and add its `bin` folder to `PATH`.
4. Check in a new terminal. Open a new terminal window, so it reads the new `PATH`, and run the three checks below.

You are ready when all three checks show 25. Your exact numbers may differ:

```
java -version
  openjdk version "25.0.x" ...
javac -version
  javac 25.0.x
mvn -v
  Apache Maven 3.9 or later ...
  Java version: 25.0.x ...
```

If a check fails: `command not found` (Windows: `is not recognized`) means that tool's `bin` folder is not on `PATH`; repeat the guide's PATH step, then open a new terminal. An older version means another Java comes first on `PATH`, as in Activity 2: put the JDK 25 `bin` folder first, and for Maven set `JAVA_HOME` to the JDK 25 folder. If an installer shows an error, asks for an administrator password you do not have, or a check still fails after that, stop and ask your instructor rather than removing other Java versions.

Last, the IDE. Install IntelliJ IDEA with the JetBrains installation guide. Open the coding lab's `starter/pom.xml` as a project, then set JDK 25 as the project SDK, as in IntelliJ IDEA: SDKs. It is set when File | Project Structure | Project shows SDK 25.

Next topic: Running a first program

## Cheat sheet

Where to act: The command line of Ana’s practice terminal.

Next step: Run `echo $PATH` and compare its first folders with where JDK 25 and Maven live. A new `PATH` that lists their `bin` folders before `$PATH` puts them first and keeps the old folders.

Where to act: The two option groups: what to open, and the project SDK.

Next step: A Maven project is described by its `pom.xml`, so open the item that contains it. Then match the SDK to the Java version the lab needs.

|  |  |
| --- | --- |
| `java -version` | which Java runs, and its version |
| `javac -version` | is the compiler there? |
| `mvn -v` | Maven version and the Java it uses |
| `which java` | the folder the shell found it in (macOS, Linux) |
| `export PATH="/opt/jdk-25/bin:$PATH"` | put a folder first for this terminal session |
| File \| Project Structure \| Project | set the project SDK in IntelliJ IDEA |

The `export` line lasts for the current terminal only; add it to your shell's startup file (for example `~/.bashrc` or `~/.zshrc`) to keep it. On Windows, the Temurin installer and the Maven guide's PATH step set `PATH` and `JAVA_HOME`, and the checks above work the same in a new Command Prompt or PowerShell window. Version numbers on your machine will differ from this practice terminal.

## Sources

Checked against these live official sources on 2026-11-09.

- Oracle Java SE Support Roadmap
- OpenJDK: JDK 25
- JDK 25 Installation Guide: overview
- Eclipse Temurin releases
- Adoptium: macOS PKG installer packages
- Adoptium: Linux installer packages
- Adoptium: Windows MSI installer packages
- Dev.java: Getting started with Java (JDK, JRE and PATH)
- Apache Maven: Installing Apache Maven
- Apache Maven: Download
- IntelliJ IDEA: Install IntelliJ IDEA
- IntelliJ IDEA: Maven (open an existing Maven project)
- IntelliJ IDEA: SDKs (project SDK)
- Dev.java: Building a Java application in IntelliJ IDEA
- Dev.java: Building a Java application in VS Code
- Apple: Mac computers with Apple silicon (About This Mac)
- Microsoft: 32-bit and 64-bit Windows (System type)
- uname(1) manual page

The practice terminal is a simulation of bash on Linux. Its version strings and folder paths are examples; real installers choose their own folders.

## Static interaction alternatives

### predict

Prediction (practice, not scored): JDK 25 and Maven are installed, but java -version reports 17 and mvn is not found. Options: an older Java folder comes first on PATH and Maven's bin folder is not on PATH; the JDK 25 download was only a runtime; Maven runs only inside an IDE; the terminal needs JAVA_HOME and nothing else. Answer: PATH. The shell runs the first java it finds in PATH order, and it cannot run mvn until Maven's bin folder is on PATH.

### terminal

Terminal activity, worked example. which java prints /usr/lib/jvm/java-17/bin/java, because that folder comes before /opt/jdk-25/bin in PATH. Fix it for this session with export PATH="/opt/jdk-25/bin:$PATH". Now java -version prints openjdk version "25.0.4.1" and javac -version prints javac 25.0.4.1. mvn -v prints bash: mvn: command not found until you add Maven: export PATH="$HOME/tools/apache-maven-3.10.0/bin:$PATH". Then mvn -v prints Apache Maven 3.10.0 and Java version: 25.0.4.1.

### explore

IDE activity, worked example: to open the lab project, use File | Open and choose the project's pom.xml, then Open as Project; choosing only the src folder or a single .java file does not import the Maven project. Then in File | Project Structure | Project, set the SDK to 25 (/opt/jdk-25). JDK 17 is too old for a Java 25 project, and with no SDK the IDE cannot compile or highlight the code.

### mcq

Apply question: java -version reports 25, but javac is not found. Options: the java on PATH comes from a folder with no javac, so install the full JDK 25 and put its bin folder on PATH (correct); javac is now built into java, so use java to compile; Maven must be reinstalled; javac only works inside an IDE. Retry as folders: the folder holding java, javac and jshell (a JDK bin folder) is the one to put on PATH; a folder with java only cannot compile; Maven's bin holds mvn; a project folder holds pom.xml and src.
