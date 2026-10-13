# Pipes and grep

## Objectives

- Explain what a pipe (|) passes from one command to the next
- Filter lines with grep, including -i and -v
- Count matching lines by piping grep into wc -l

## Teaching

### Start with a guess

Read the log on the right, then guess. Practice prediction, not scored.

### Filter lines with grep, join commands with |

`grep PATTERN FILE` prints only the lines that contain the pattern. It matches exact case, so `ERROR` and `error` differ.

A pipe, `|`, sends one command's standard output (stdout) into the next command's standard input (stdin). Error messages go to standard error (stderr), which a plain `|` does not pass. In `cat app.log | grep ERROR`, `cat` prints the file and `grep` filters what flows in.

### Two useful options: -i and -v

- `-i` ignores case: `grep -i error` matches `ERROR` and `error`.
- `-v` inverts the match: it keeps the lines that do not contain the pattern.

Options go before the pattern: `grep -v INFO app.log`.

### Count with wc -l

`wc -l` counts the lines it receives. Pipe a filter into it to count matches: `grep ERROR app.log | wc -l` prints `3`.

Each extra `|` adds a stage, and the data flows left to right.

### Apply it to a new question

Same log, new goal. Think in stages: what survives the filter, and what turns lines into a number?

## Model

The pipeline, stage by stage. `app.log` is a fictional file; the terminal is a simulation.

1. ```
  app.log
  ```
  10 lines

1. 09:00 INFO server started on port 8080
2. 09:01 INFO user ana signed in
3. 09:02 WARN slow response from /orders
4. 09:03 ERROR database timeout
5. 09:04 INFO user ben signed in
6. 09:05 error retry failed for job 7
7. 09:06 ERROR database timeout
8. 09:07 WARN disk 85% full
9. 09:08 INFO user ana signed out
10. 09:09 ERROR payment service unavailable

## Recap

- `grep` keeps lines that contain a pattern; it is case-sensitive unless you add `-i`.
- `-v` keeps the lines that do not match.
- A pipe `|` sends one command's standard output into the next command's standard input, left to right; stderr is not passed.
- `wc -l` counts lines, so filter first, then count.

Next topic: File permissions

## Cheat sheet

|  |  |
| --- | --- |
| `grep PAT file` | lines containing PAT |
| `grep -i PAT` | ignore case |
| `grep -v PAT` | lines not containing PAT |
| `a \| b` | a's stdout becomes b's stdin |
| `wc -l` | count lines |

grep patterns are regular expressions; plain words like the ones here match literally.

## Sources

Checked against these live sources on 2026-10-12. Commands and messages follow GNU/Linux (bash, coreutils, grep); macOS and other systems can differ.

- GNU Bash 5.3 Reference Manual: pipelines
- GNU grep manual: introduction
- GNU grep manual: matching control, -i and -v
- GNU Coreutils manual: wc invocation

## Static interaction alternatives

### predict

Prediction (practice, not scored): what does grep error app.log print? The log has three uppercase ERROR lines and one lowercase error line. Options: one line, 09:05 error retry failed for job 7 (correct: grep matches exact case by default); all four error lines (needs -i); the number 4 (grep prints lines, counting needs wc -l); nothing at all (one line does contain lowercase error).

### terminal

Terminal activity: show only the uppercase ERROR lines using a pipe. Worked example: cat app.log | grep ERROR prints the three ERROR lines (09:03, 09:06, 09:09). cat prints the file and grep keeps only matching lines.

### terminal

Terminal activity: show every line that is not an INFO line. Worked example: grep -v INFO app.log prints the 6 WARN, ERROR and error lines. -v inverts the match.

### terminal

Terminal activity: count the error lines, whatever their case. Worked example: grep -i error app.log | wc -l prints 4. -i ignores case, and wc -l counts the lines it receives.

### mcq

Apply question: which command prints how many lines in app.log do not mention user? Options: grep user app.log | wc -l (counts the 3 lines that do mention user); grep -v user app.log (prints the 7 lines but does not count them); wc -l app.log | grep -v user (wc -l runs first and outputs one line, 10 app.log); grep -v user app.log | wc -l (correct: drop the user lines, then count the 7 that remain).
