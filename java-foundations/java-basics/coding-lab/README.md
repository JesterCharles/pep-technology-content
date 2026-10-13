# Java Basics lab

## Goal

Finish one small Java program, `Basics.java`, so that it prints six correct lines.
Each task uses one idea from the Java Basics module: a primitive type, a String method, an operator, if/else, a switch expression and a for loop.
You build and test it with the real JDK and Maven on your own computer.

## Prerequisites

You need a JDK 25 and Apache Maven 3.9 or later, both found on your `PATH`.
The module topic *Installing Java and the IDE* walks through the install.
Check both in a new terminal:

```
java -version
mvn -v
```

- `java -version` must report version 25.
- `mvn -v` must report Apache Maven 3.9 or later, and its `Java version:` line must also say 25.
  If it shows another Java, see Troubleshooting.

This lab works the same on macOS, Linux and Windows.
On Windows, use PowerShell or Command Prompt; the commands are the same.
No Docker or other container tool is needed.

## Setup (once, needs the internet)

Open a terminal in the lab's `starter` folder, then run:

```
mvn -q dependency:go-offline
```

This downloads JUnit and the pinned Maven plugins into your local Maven repository.
It prints nothing when it succeeds.
After this step, everything else in the lab runs offline.

## Tasks

Open `starter/src/main/java/basics/Basics.java` in your IDE or editor.
Each task has a `TODO` comment inside `main`.
Replace the placeholder value with Java code that works the result out from the given variables.
Do not type the final value itself: the tests check that your code uses the idea each task names.

1. **Average.** Set `average` to the average of `scoreA` and `scoreB`, keeping the fraction.
   Watch out for integer division.
2. **Initials.** Build `initials` from the first letter of `first` and of `last`, in upper case.
3. **Even.** Set `even` to whether `n` is even. Use the remainder operator `%`.
4. **Grade.** Choose `grade` with `if`, `else if` and `else`: A for 90 or more, B for 80 or more, C for 70 or more, otherwise F.
5. **Day.** Set `dayType` with a switch expression that uses arrow labels (`->`): days 1 to 5 are `"weekday"`, 6 and 7 are `"weekend"`, anything else is `"unknown"`.
6. **Countdown.** After `Countdown:` is printed, use a `for` loop to print `" " + i` for `i` from 5 down to 1.

You can run your program at any point from the `starter` folder:

```
mvn -q -o compile
java -cp target/classes basics.Basics
```

## Test

From the `starter` folder, run the one test command:

```
mvn -q -o test
```

- Before you start, all six tests fail.
  Each failure names its task and shows the line it expected and the line your program printed, for example:
  `Task 1: the average of 90 and 85 keeps its fraction ==> expected: <Average: 87.5> but was: <Average: 0.0>`
- A task's test passes when its line is right and its code uses the idea the task names.
- If your code does not compile, Maven prints `COMPILATION ERROR` with the file, then `[line,column]`, then the compiler's message.
  Fix that line and run the test again.

## Expected output

When every task is complete, `mvn -q -o test` prints nothing and exits with status 0.
`expected/test-summary.txt` shows the full expected result, including the six lines your program prints.

## Offline note

Only the setup step uses the network.
The test command uses `-o` (offline), so it never downloads anything.
If it reports that an artifact is missing from the local repository, run the setup step once more while online.

## Cleanup

The lab writes only the `starter/target` folder (compiled classes and test reports). Delete it from the `starter` folder:

- macOS and Linux: `rm -rf target`
- Windows PowerShell: `Remove-Item -Recurse -Force target`

The JUnit and plugin downloads stay in your local Maven repository (`~/.m2/repository` by default) so later Java labs can reuse them.

## Troubleshooting

- **`mvn: command not found`, or `'mvn' is not recognized`.** Maven's `bin` folder is not on your `PATH`. Add it, then open a new terminal.
- **`mvn -v` shows a Java version other than 25.** Maven uses the JDK named by `JAVA_HOME` when it is set, otherwise the `java` on your `PATH`. Set `JAVA_HOME` to your JDK 25 folder, or unset it, then open a new terminal.
- **`release version 25 not supported`.** Maven is running on an older JDK. Fix it as in the previous item.
- **`Cannot access central in offline mode`, or a missing artifact.** The setup step has not completed. Run `mvn -q dependency:go-offline` once while online.
- **A test says "use ..." or "... instead of typing ...".** The printed line is right, but the code types the result or skips the idea the task names (`%`, an `else if` chain, a `switch` with `->`, a `for` loop). Rewrite that task so the code works the value out with that idea.
