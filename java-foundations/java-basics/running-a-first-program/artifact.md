# Running a first program

## Objectives

- Compile a source file with javac and run the resulting class with java
- Run a single source file directly with java Hello.java and say when that shortcut is enough
- Fix a program from a compiler error message by locating its file, line and cause

## Teaching

### Start with a guess

Practice prediction, not scored.

### Compile, then run

`javac Hello.java` compiles your source file into bytecode, `Hello.class`. `java Hello` then runs that class: give the class name, with no `.class` ending. The file name matches the public class inside it, and the program starts in its `main` method.

Shortcut: `java Hello.java` compiles the file in memory and runs it at once, writing no `.class` file. It is enough for trying out a small program. A real project with several files, libraries and tests uses a build tool such as Maven, which runs `javac` for you.

### Read a compiler error

An error starts with `File.java:line: error: message`. The next lines repeat that source line, and a caret `^` marks where the compiler noticed the problem.

The caret can sit just after the real mistake: a missing `;` is reported at the end of the statement that needs it. Fix the first error, compile again, and repeat; one mistake can cause several messages.

### Apply it to a new error

Same reading order: file, line, message, then the caret.

## Model

From source to output. A fictional folder; the terminal is a simulation.

Compile, then run

1. Hello.java
2. javac →
3. Hello.class
4. java →
5. output

Source-file shortcut

1. Hello.java
2. java, compiled in memory →
3. output

Files in the folder

Greet.java Hello.java

## Recap

- `javac Hello.java` writes `Hello.class`; `java Hello` runs it by class name.
- `java Hello.java` compiles in memory and runs one small program; projects use a build tool.
- Read an error as file, line, message, caret; fix the first error, then compile again.

Next topic: Primitive types and variables

## Cheat sheet

```
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

|  |  |
| --- | --- |
| `javac Hello.java` | compile; writes Hello.class |
| `java Hello` | run the compiled class |
| `java Hello.java` | compile in memory and run |
| `Greet.java:3: error: ';' expected` | file Greet.java, line 3, the message |

JDK 25 also accepts a shorter compact source file such as `void main() { IO.println("Hi"); }`. This course uses the classic class with `public static void main`, which every Java version accepts.

## Sources

Checked against these live official sources on 2026-10-13. Terminal output was checked against a real JDK 25.0.4.1 run.

- Dev.java: Getting started with Java
- Dev.java: Launching single-file source-code programs
- JEP 330: Launch Single-File Source-Code Programs
- JEP 512: Compact Source Files and Instance Main Methods
- The java command (JDK 25)
- The javac command (JDK 25)
- IntelliJ IDEA: Create your first Java application

## Static interaction alternatives

### predict

Prediction (practice, not scored): after javac Hello.java prints nothing, what is in the folder? Options: Hello.java and Hello.class; only Hello.java, because the program already ran; Hello.java and Hello.exe; Hello.java and Hello.jar. Answer: Hello.java and Hello.class. javac compiles the source into a bytecode file, Hello.class, and prints nothing when it succeeds. It does not run the program, does not make a native .exe, and does not build a .jar.

### terminal

Terminal activity, worked example. javac Hello.java prints nothing and creates Hello.class (ls now shows Greet.java Hello.class Hello.java). java Hello prints Hello, Java!. java Hello.java also prints Hello, Java! by compiling the source in memory. Common slips: java Hello.class fails with Error: Could not find or load main class Hello.class, because java wants the class name; javac Hello fails because javac needs the .java file name.

### explore

Fix activity, worked example. javac Greet.java prints: Greet.java:3: error: ';' expected, then the line System.out.println("Hi, Ana") with a caret just after its closing parenthesis, then 1 error. The file is Greet.java, the line is 3, and the cause is the missing semicolon at the end of that statement. Adding ; at the end of line 3 fixes it: javac Greet.java then prints nothing and java Greet prints Hi, Ana.

### mcq

Apply question: Score.java:4: error: cannot find symbol, symbol: variable scor. Options: line 4 uses scor, a name that was never declared (probably a typo for score) (correct); line 3 is missing a semicolon; the class must be renamed; the program crashed while running. Retry: in Score.java:4, Score.java is the file and 4 is the line; error names what kind of message follows.
