# Java Basics lab

## Goal

Finish six small methods in one Java file, `Basics.java`.
Each method practises one idea from the Java Basics module: a primitive type, a String method, an operator, if/else, a switch expression and a for loop.
You build and test it with the real JDK and Maven on your own computer.

## Prerequisites

You need JDK 25, Apache Maven 3.9 or later, and IntelliJ IDEA (or VS Code with Java support).
If you have not installed them yet, follow **Now install on your own computer** at the end of the topic *Installing Java and the IDE*: it has numbered steps for macOS, Linux and Windows.
Then check all three in a new terminal:

```
java -version
javac -version
mvn -v
```

- `java -version` and `javac -version` must report version 25.
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

Open the `starter` folder as a project in your IDE (choose `starter/pom.xml`, then **Open as Project**), and open `src/main/java/basics/Basics.java`.
Each task is one method with a `TODO` comment; its comment says what the method must return.
Work each result out from the method's parameters, using the idea the task names. The tests call every method with several inputs, including edge cases, and check only the results; they cannot see how you computed them, so the practice comes from writing the general code yourself.

After each task, run the one test command from the `starter` folder:

```
mvn -q -o test
```

Every failure line starts with its task number, so you can work through the tasks in any order.

### Task 1: average

1. Find the method `average(int a, int b)` and its `TODO`.
2. Replace `return 0;` with code that returns the average of `a` and `b`, keeping the fraction. Think about what integer division does, and about two very large `int` values.
3. Run the tests. While the method is wrong, you see lines such as `Task 1: average(90, 85) ==> expected: <87.5> but was: <0.0>`.
4. Done when no line starting with `Task 1` appears.

### Task 2: initials

1. Find the method `initials(String first, String last)`.
2. Return the first letter of each name, in upper case, using String methods.
3. While it is wrong, you see lines such as `Task 2: initials("Grace", "hopper") ==> expected: <GH> but was: <>`.
4. Done when no line starting with `Task 2` appears.

### Task 3: even numbers

1. Find the method `isEven(int n)`.
2. Return whether `n` is even, using the remainder operator `%`. Check your idea against negative numbers too.
3. While it is wrong, you see lines such as `Task 3: isEven(7)`.
4. Done when no line starting with `Task 3` appears.

### Task 4: grade

1. Find the method `grade(int score)`.
2. Choose the grade with an `if`, `else if` and `else` chain, using the thresholds in the method's comment. Think about which condition must come first.
3. The tests try the scores on both sides of every threshold. While a branch is wrong, you see lines such as `Task 4: grade(89) ==> expected: <B> but was: <?>`.
4. Done when no line starting with `Task 4` appears.

### Task 5: day type

1. Find the method `dayType(int day)`.
2. Return the result of a switch expression with arrow labels (`->`), covering the values in the method's comment and every other value.
3. While it is wrong, you see lines such as `Task 5: dayType(8)`.
4. Done when no line starting with `Task 5` appears.

### Task 6: countdown

1. Find the method `countdown(int n)`.
2. Build the text with a `for` loop, from `n` down to 1, with single spaces between the numbers and none at the ends. Check what your loop does when `n` is 0.
3. While it is wrong, you see lines such as `Task 6: countdown(3) ==> expected: <3 2 1> but was: <>`.
4. Done when no line starting with `Task 6` appears.

## Test

The one test command, run from the `starter` folder, is:

```
mvn -q -o test
```

- Before you start, all six tests fail, and Maven ends with `Tests run: 6, Failures: 6`.
- Each test calls its method with several inputs and lists every input that gave a wrong result.
  A passing run shows that each method returns the right results for those inputs. It does not check which Java constructs your code uses, so compare your code with each task's steps yourself.
- If your code does not compile, Maven prints `COMPILATION ERROR` with the file, then `[line,column]`, then the compiler's message.
  Fix that line and run the test again.

You can also run the program itself, which prints one line per task:

```
mvn -q -o compile
java -cp target/classes basics.Basics
```

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
