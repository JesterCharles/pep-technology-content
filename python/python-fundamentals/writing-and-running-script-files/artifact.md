# Writing and running script files

## Objectives

- Write a .py script and run it from the terminal with python (or py on Windows), then read its exit status
- Guard top-level code with if \_\_name\_\_ == "\_\_main\_\_": so the same file can be imported and run
- Read command-line arguments with sys.argv and exit with a non-zero status when an argument is missing

## Teaching

### Start with a guess

Practice prediction, not scored. A Java program needs a class with `main`. Guess what a one-line Python file does, and what the shell's `echo $?` reports afterwards.

### Run a script, pass arguments, read the status

A script is a `.py` file run top to bottom: `python3 summary.py general` (Windows: `py summary.py general`).

Words after the file name arrive in `sys.argv`, a list of strings: `sys.argv[0]` is the script name and `sys.argv[1]` the first argument. Check its length before reading an argument.

`sys.exit(2)` ends the script with exit status 2; finishing normally means 0. Non-zero tells the shell or a CI job that something failed. Read it with `echo $?` in bash, or `$LASTEXITCODE` in PowerShell.

### The __name__ guard

Every module has a `__name__`. When you run a file directly it is `"__main__"`; when another file imports it, it is the module's own name, such as `"greet"`.

So `if __name__ == "__main__":` marks code that should run only when the file is the program, not when it is imported, for example by a test. Without the guard, importing the file runs that code too.

### Put it together

Wrap the work in `main(argv)` and return a status: `0` when it worked, or a non-zero number such as `2` when an argument is missing. Print that usage message to the error stream: `print("usage: ...", file=sys.stderr)`.

At top level, the guard runs `main` and hands its status to the shell: `if __name__ == "__main__":` followed by the indented `sys.exit(main(sys.argv))`. Importing the file then only defines `main`.

### Arguments are a list of strings

`sys.argv` holds every word the shell passed, starting with the script name, and every item is a string: `python3 add.py 2 3` gives `['add.py', '2', '3']`, so convert with `int(sys.argv[1])` when you need a number.

The interpreter name, `python3`, is not included.

## Model

Sam's script files. The terminal is a simulation; outputs and exit statuses match real Python 3.

hello.py

```
print("hi")
```

```
$ python3 hello.py
$ echo $?
```

summary.py

```
import sys


def main(argv):
    if len(argv) < 2:
        print("usage: python summary.py SESSION", file=sys.stderr)
        return 2
    print("Summary for session:", argv[1])
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
```

- **sys.argv on the last run**: no run yet
- **Last exit status**: none yet

greet.py

```
print("__name__ is", __name__)

def main():
    print("running main")

# choose a version
```

| How the file starts | `__name__` | What happens |
| --- | --- | --- |
| python3 summary.py general | "__main__" | main runs; status 0 |
| python3 summary.py | "__main__" | usage message on stderr; status 2 |
| import summary | "summary" | main is defined, not called |

```
$ python3 summary.py general extra
```

```
import sys


def main(argv):
    if len(argv) < 2:
        print("usage: python summary.py SESSION", file=sys.stderr)
        return 2
    print("Summary for session:", argv[1])
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
```

## Recap

- Run a script with `python3 file.py` (Windows: `py file.py`); it runs top to bottom.
- `sys.argv` is a list of strings: the script name, then each argument.
- `sys.exit(main(sys.argv))` turns `main`'s return value into the exit status; 0 means success, read with `echo $?`.
- `if __name__ == "__main__":` keeps run-only code from running on import.

## Cheat sheet

A recipe card ends with the line: now cook it. When you pick up the card to make dinner, that last line is exactly what you want. When a friend borrows the card only to copy the ingredients onto a shopping list, nobody wants dinner cooked as a side effect, so the card adds one condition: do the last step only if you are the person cooking from this card.

The main guard is that last condition: the file runs its main step only when it is run directly, not when another file loads it.

Optional time: about 5 minutes, in addition to the time above

Write `add.py`. Its `main(argv)` prints the sum of two whole-number arguments and returns `0`; when there are not exactly two arguments it prints a usage message to the error stream and returns `2`. The file ends with the `__name__` guard and `sys.exit(main(sys.argv))`.

Try it in any Python 3.10 or later interpreter, or trace it on paper. No answer is shown here; the success criteria tell you when you are done.

Success criteria: `python3 add.py 2 3` prints `5` and `echo $?` then prints `0`; `python3 add.py 2` prints your usage message and `echo $?` prints `2`; importing `add` from another file prints nothing.

|  |  |
| --- | --- |
| `python3 summary.py general` | run with one argument |
| `sys.argv[1]` | first argument (a string) |
| `print("...", file=sys.stderr)` | error message on stderr |
| `sys.exit(2)` | exit with status 2 |
| `echo $?` / `$LASTEXITCODE` | last exit status (bash / PowerShell) |
| `if __name__ == "__main__":` | run only as a script |

## Sources

Checked against these live official Python 3 documentation pages on 2026-10-13. The practice terminal simulates bash on Linux; every output and exit status shown was produced by running the same files with CPython 3.14.

- Python tutorial: Using the Python interpreter
- Command line and environment
- __main__: Top-level code environment
- Python tutorial: Executing modules as scripts
- Using Python on Windows

## Static interaction alternatives

### predict

Prediction (practice, not scored): hello.py contains print("hi"). python3 hello.py then echo $?. Options: hi then 0; hi then 1; nothing because there is no main method; hi then hello.py. Answer: hi, then 0. Python runs a script's top-level statements from top to bottom, no main method needed, and a script that finishes normally exits with status 0, which echo $? prints in bash.

### terminal

Terminal activity in /home/sam/shop with summary.py, which prints a usage message to stderr and returns 2 when sys.argv has fewer than 2 items, and otherwise prints Summary for session: followed by the first argument and returns 0; sys.exit(main(sys.argv)) turns the return value into the exit status. Worked example: python3 summary.py general prints Summary for session: general, and echo $? then prints 0. python3 summary.py with no argument prints usage: python summary.py SESSION, and echo $? then prints 2. On Windows, py summary.py general runs it and $LASTEXITCODE shows the status in PowerShell.

### explore

Guard activity. greet.py prints __name__ is followed by its __name__, defines main() that prints running main, then either calls main() inside if __name__ == "__main__": (with guard) or calls main() at top level (without guard). Real Python 3 output: python3 greet.py with the guard prints __name__ is __main__ then running main. python3 -c "import greet" with the guard prints only __name__ is greet: main() does not run on import. Without the guard, the import prints __name__ is greet then running main, because the top-level call runs on import.

### explore

Authoring activity: complete summary.py with an argument-count guard that prints the usage line Usage: python summary.py SESSION to stderr (python3 or py also accepted, SESSION may be written <SESSION>) and returns a non-zero result when SESSION is missing, an if __name__ == "__main__" guard and sys.exit(main(sys.argv)). Run checks only those structures in this scaffold. Expected result: missing input produces a non-zero status, direct execution calls main, and import does not.

### mcq

Apply question: python3 summary.py general extra. What is sys.argv inside summary.py? Options: ['general', 'extra'] (the script name is missing); ['summary.py', 'general', 'extra'] (correct: the script name first, then each word as a string); ['python3', 'summary.py', 'general', 'extra'] (the interpreter name is not included); 'general extra' (sys.argv is a list, not one string). Retry: sys.argv[1] is the first word after the script name; sys.argv[0] and sys.argv[-0] are both the script name, and sys.argv is the whole list.
