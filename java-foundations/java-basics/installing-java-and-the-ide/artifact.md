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

### Now install on your own computer

Now do it for real, on your coding lab computer.

macOS

1. Open the Eclipse Temurin releases page (linked under Sources). Choose macOS, your chip (aarch64 for Apple silicon, x64 for Intel) and JDK 25 - LTS, then download the `.pkg` file.
2. Open the `.pkg` file. Select Continue, accept the license, then Install. The JDK goes into `/Library/Java/JavaVirtualMachines/`.
3. Download the Maven binary `.tar.gz` archive from the Apache Maven download page; this assumes your browser saved it in `~/Downloads`. In a terminal, run these three lines, with your Maven version in place of `<version>` each time:
   ```
   mkdir -p ~/tools
   tar -xzf ~/Downloads/apache-maven-<version>-bin.tar.gz -C ~/tools
   echo 'export PATH="$HOME/tools/apache-maven-<version>/bin:$PATH"' >> ~/.zshrc
   ```
   The first makes the folder, the second extracts Maven into it, and the third adds Maven's `bin` folder to `PATH` in `~/.zshrc`.
4. Open a new Terminal window and run the three checks below. If `java -version` shows an older Java, add `export JAVA_HOME=$(/usr/libexec/java_home -v 25)` to `~/.zshrc` and open a new window.

Linux (Debian, Ubuntu, Fedora or RHEL)

1. Open a terminal and run the commands for your system. Type your password when `sudo` asks (nothing shows as you type). Answer `y` to the package install confirmation and to the key import prompt that names Adoptium. Stop and ask for help if you see any other prompt.
   Debian or Ubuntu:
   ```
   sudo apt install -y wget apt-transport-https gpg
   wget -qO - https://packages.adoptium.net/artifactory/api/gpg/key/public | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/adoptium.gpg > /dev/null
   echo "deb https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | sudo tee /etc/apt/sources.list.d/adoptium.list
   sudo apt update
   sudo apt install temurin-25-jdk
   ```
   Fedora or RHEL:
   ```
   sudo tee /etc/yum.repos.d/adoptium.repo > /dev/null <<EOF
   [Adoptium]
   name=Adoptium
   baseurl=https://packages.adoptium.net/artifactory/rpm/$(. /etc/os-release; echo $ID)/\$releasever/\$basearch
   enabled=1
   gpgcheck=1
   gpgkey=https://packages.adoptium.net/artifactory/api/gpg/key/public
   EOF
   sudo dnf install temurin-25-jdk
   ```
   It is done when the prompt returns with no error.
2. Download the Maven binary `.tar.gz` from the Apache Maven download page into `~/Downloads`. Run these lines, with your Maven version in place of `<version>`:
   ```
   mkdir -p ~/tools
   tar -xzf ~/Downloads/apache-maven-<version>-bin.tar.gz -C ~/tools
   echo 'export PATH="$HOME/tools/apache-maven-<version>/bin:$PATH"' >> ~/.bashrc
   ```
   Expect no output; it is done when the prompt returns with no error.
3. Open a new terminal and run the three checks below. If either Java check shows an older version, run these and type the number of the `temurin-25` line. Debian or Ubuntu:
   ```
   sudo update-alternatives --config java
   sudo update-alternatives --config javac
   ```
   Fedora or RHEL:
   ```
   sudo alternatives --config java
   sudo alternatives --config javac
   ```

Windows

1. Open the Eclipse Temurin releases page, choose Windows, x64 and JDK 25 - LTS, and download the `.msi` file. Alternatively, run `winget install EclipseAdoptium.Temurin.25.JDK` in a terminal.
2. Open the `.msi` file and accept the license. On the Custom Setup screen, keep the feature that adds Temurin to `PATH` and also turn on the feature that sets `JAVA_HOME`, then select Install.
3. Download the Maven binary `.zip` archive and extract it into a folder such as `C:\tools`. Open System Properties | Environment Variables, edit `Path`, and add the `bin` folder inside the Maven folder.
4. Open a new Command Prompt or PowerShell window and run the three checks below.

You are ready when, in a new terminal, all three checks show 25. Your numbers may differ:

```
java -version
  openjdk version "25.0.x" ...
javac -version
  javac 25.0.x
mvn -v
  Apache Maven 3.9 or later ...
  Java version: 25.0.x ...
```

Last, install IntelliJ IDEA with the JetBrains installation guide, open the coding lab's `starter/pom.xml` as a project, and set JDK 25 as the project SDK. It is set when File | Project Structure | Project shows 25.

Next topic: Running a first program

## Cheat sheet

|  |  |
| --- | --- |
| `java -version` | which Java runs, and its version |
| `javac -version` | is the compiler there? |
| `mvn -v` | Maven version and the Java it uses |
| `which java` | the folder the shell found it in (macOS, Linux) |
| `export PATH="/opt/jdk-25/bin:$PATH"` | put a folder first for this terminal session |
| File \| Project Structure \| Project | set the project SDK in IntelliJ IDEA |

The `export` line lasts for the current terminal only; add it to your shell's startup file (for example `~/.bashrc` or `~/.zshrc`) to keep it. On Windows, the JDK and Maven installers or System Properties | Environment Variables set `PATH` and `JAVA_HOME`, and the checks above work the same in a new Command Prompt. Version numbers on your machine will differ from this practice terminal.

## Sources

Checked against these live official sources on 2026-10-13.

- Oracle Java SE Support Roadmap
- OpenJDK: JDK 25
- JDK 25 Installation Guide: overview
- Eclipse Temurin releases
- Adoptium: Installation overview (winget)
- Adoptium: macOS PKG installer packages
- Adoptium: Linux installer packages
- Adoptium: Windows MSI installer packages
- JDK 25 Installation Guide: macOS (default JDK, java_home)
- Dev.java: Getting started with Java (JDK, JRE and PATH)
- Apache Maven: Installing Apache Maven
- Apache Maven: Download
- IntelliJ IDEA: Install IntelliJ IDEA
- IntelliJ IDEA: Maven (open an existing Maven project)
- IntelliJ IDEA: SDKs (project SDK)
- Dev.java: Building a Java application in IntelliJ IDEA
- Dev.java: Building a Java application in VS Code

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
