---
title: Exiting a Python program
channel: Python Morsels
url: https://www.youtube.com/watch?v=fbqEdQP5nS8
runtimeMinutes: 5.8
embeddable: true
checkedAt: 2026-10-14
covers:
  - "A script, fixme.py, that takes a directory name on the command line and is run from the terminal (0:00 to 0:40)"
  - Checking the argument and ending the program early with sys.exit after printing an error (0:40 to 1:00)
  - "Why a plain sys.exit() looks like success to the shell: exit code 0 means success, any other code means failure, shown with && (1:00 to 2:02)"
  - "sys.exit(1) for an error, and sys.exit(\"message\"), which prints the message and exits with code 1 (1:42 to 2:23)"
  - "Exit codes 0 to 127, the || operator, and why sys.exit is used in programs while exit() is meant for the REPL (2:23 to 4:50)"
  - Raising SystemExit as an equivalent of sys.exit (4:50 to 5:45)
gaps:
  - "o1: covered for running a script and reading success or failure through && and ||; echo $? is not shown"
  - "o2: if __name__ == \"__main__\" is not covered"
  - "o3: the script's directory argument comes from the command line, but how sys.argv holds it is not explained"
cautions:
  - Educator channel (Python Morsels, by Trey Hunner), published 2026-05-01; current Python 3
  - The demonstration uses a Unix-style shell; on Windows PowerShell the exit status is read with $LASTEXITCODE
  - The description links to the channel's article and paid screencast service
  - Fit was judged from the video description, its chapters and its caption track; the video was not watched end to end
alternates:
  - title: "Accessing command line arguments in Python (Python Morsels)"
    url: https://www.youtube.com/watch?v=TOxsbFX2PJc
    reason: "3:15 (195 s), 2023. Where command-line arguments are stored and how to read sys.argv, per its chapters (o3)"
  - title: "Python Tutorial: if __name__ == '__main__' (Corey Schafer)"
    url: https://www.youtube.com/watch?v=sugvnHA7ElY
    reason: "8:43 (523 s), 2015. Running a module directly versus importing it (o2); captions not reviewed"
  - title: "Python if __name__ == '__main__': Visually Explained (Visually Explained)"
    url: https://www.youtube.com/watch?v=KZpYtNtGxSU
    reason: "6:06 (366 s), 2025. What __name__ holds and when it equals '__main__', per its chapters (o2)"
  - title: "What does if __name__ == '__main__' do in Python? (Tech With Tim)"
    url: https://www.youtube.com/watch?v=x5IbdKnvt6k
    reason: "5:08 (308 s), 2025. The guard (o2); the description promotes the presenter's paid program"
rejected:
  - title: "Run Python Scripts With Command Line Arguments Using sys.argv (Fabio Musanni)"
    url: https://www.youtube.com/watch?v=rJCl7t3IIbA
    reason: "23:33 exceeds the 12-minute topic budget"
  - title: "Python [sys] 05 Exit Codes (John Hammond)"
    url: https://www.youtube.com/watch?v=uWEiep-ksDo
    reason: "Published about 14 years ago; likely predates current Python 3 conventions, and a current, shorter video covers the same ground"
---

# Video: Exiting a Python program

Python Morsels, 5:45 (345 s), https://www.youtube.com/watch?v=fbqEdQP5nS8.
Live, public and embeddable on 2026-10-14 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its captions:

- A script, `fixme.py`, takes a directory name on the command line and is run from the terminal (0:00).
- When the directory does not exist, the script prints an error and stops early with `sys.exit` (0:40).
- A bare `sys.exit()` exits with code 0, so the shell treats the run as a success. The video shows this with `&&`, which runs the next command only after success. Code 0 means success and any other code means failure, so the script switches to `sys.exit(1)` (1:00).
- `sys.exit("message")` prints the message and exits with code 1 (2:02).
- Some programs pass a boolean so the code is always 0 or 1. Codes 0 to 127 are the well-defined range. `||` runs the next command only after a failure (2:23).
- `exit()` is meant for the interactive REPL, so programs should call `sys.exit`. Raising `SystemExit` has the same effect (4:28).

It matches objective o1 and the exit-status half of o3.

## Gaps against the objectives

- o1: covered; reading the status with `echo $?` is not shown.
- o2: the `if __name__ == "__main__":` guard is not covered.
- o3: `sys.argv` itself is not explained.

## Alternates

- Python Morsels, "Accessing command line arguments in Python", https://www.youtube.com/watch?v=TOxsbFX2PJc, 3:15 (195 s). Reading `sys.argv` (o3).
- Corey Schafer, "Python Tutorial: if __name__ == '__main__'", https://www.youtube.com/watch?v=sugvnHA7ElY, 8:43 (523 s). The main guard (o2).
- Visually Explained, "Python if __name__ == '__main__': Visually Explained", https://www.youtube.com/watch?v=KZpYtNtGxSU, 6:06 (366 s). The main guard (o2).
- Tech With Tim, "What does if __name__ == '__main__' do in Python?", https://www.youtube.com/watch?v=x5IbdKnvt6k, 5:08 (308 s). The main guard (o2).

## Rejected

- Fabio Musanni, "Run Python Scripts With Command Line Arguments Using sys.argv", https://www.youtube.com/watch?v=rJCl7t3IIbA: 23:33 exceeds the 12-minute budget.
- John Hammond, "Python [sys] 05 Exit Codes", https://www.youtube.com/watch?v=uWEiep-ksDo: about 14 years old; superseded by a current video.
