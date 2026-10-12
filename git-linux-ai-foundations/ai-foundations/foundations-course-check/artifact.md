# Foundations course check

## Objectives

- Retrieve shell path and permission rules to make a script runnable
- Keep a secrets file out of Git with .gitignore
- Tell a verified result from an assistant's claim

## Teaching

### Warm up from memory

This check covers the shell, Git and AI topics of the course. Every scenario is a benign simulation in the fictional home folder /home/ana; nothing runs on your computer. The warm-up is never marked wrong.

### Shell: make a script runnable

ls -l shows permissions for owner, group and others: r read, w write, x execute. Numeric modes add read 4, write 2 and execute 1 per group: 7 is rwx, 6 is rw-, 4 is r--. Running ./start.sh needs x.

### Git: keep secrets out of commits

Keep secrets such as a token in a .env file and read them as environment variables, never in code. List .env in .gitignore, one pattern per line, before your first commit: Git then leaves that untracked file out of git add. Ignoring a file Git already tracks does not remove it from history.

### AI: claims versus evidence

An assistant's answer is a proposal, and its summary is a set of claims. A verified result is one you checked yourself: you read the diff line by line and ran the acceptance criteria with the expected output.

## Model

One local project, three lenses (simulated)

### Shell

pwd/tmpstart.sh-rw-r--r--

### Git

.gitignore(empty)untracked.env (holds a token)

### AI change

claim“Tested, works.”evidencenone yet

## Recap

- Relative paths start where you are; a script needs x to run, as in chmod 744.
- List .env in .gitignore before the first commit; a later delete leaves secrets in history.
- An assistant's summary is claims; your own run against the acceptance criteria is evidence.
- Redact secrets before they reach a prompt, and check every proposal before it is merged.

Next: this was the final AI Foundations topic. Return to the course page.

## Cheat sheet

|  |  |
| --- | --- |
| chmod 744 file | owner rwx; group and others read only |
| .gitignore line .env | Git skips the untracked file .env |
| # .env / !.env | a comment / re-include, not ignore |
| Verified result | your run matched the acceptance criterion |

## Sources

Claims on this page were checked against the live official pages below on 6 October 2026 (UTC). Links open outside this lesson.

- cd: relative paths start from PWD; on error the working directory remains unchanged. POSIX.1-2024 (IEEE Std 1003.1-2024), the standard behind sh; GNU Bash and coreutils manuals could not be reached on 6 October 2026, so Bash- or GNU-specific details are not separately verified.
- chmod: octal modes set permission bits absolutely (0400 read, 0200 write, 0100 execute for the owner). POSIX.1-2024.
- ls: -l permission characters r, w, x. POSIX.1-2024.
- gitignore: comments (#), negation (!), untracked files only, tracked files unaffected. Git manual, last updated in 2.55.0; unchanged in 2.56.0.
- git-stash: -u, --include-untracked. Git manual, last updated in 2.56.0.
- Best practices for using GitHub Copilot: Check Copilot's work. Supports checking a proposal with your own run.

Scenarios are benign simulations in a fictional home folder; nothing runs on your computer.

## Static interaction alternatives

### predict

Retrieval from memory (not scored). You are in /tmp and run cd projects/pep. Result: an error, because a relative path is read from where you are and /tmp has no projects folder, so you stay put. It does not jump to /home/ana/projects/pep (that needs ~/projects/pep or the absolute path), it is not read from the root (only paths starting with / are), and cd never touches Git branches.

### mcq

Shell check with a confidence rating. ls -l shows -rw-r--r-- for start.sh and ./start.sh says Permission denied. chmod 744 start.sh lets the owner run it while group and others only read: 7 is rwx for the owner and each 4 is read-only. 644 is the mode that already failed; 777 also lets group and others write and run; 444 removes write and still adds no execute. Retry as ls -l output: -rwxr--r-- (mode 744).

### mcq

Git check with a confidence rating. git status shows .env as untracked and it holds a token. Before the first commit, add .env to .gitignore, so git add . will not pick it up. git stash is not a lasting rule about commits; committing then deleting leaves the token in history; a separate branch is still history that can be pushed or merged. Retry as the file itself: the .gitignore line is .env.

### mcq

AI check with a confidence rating. An assistant changes start.sh and says tested, works; the criterion is that with PORT=5000 it prints Using port 5000. A verified result is your own run with PORT=5000 showing Using port 5000. The summary saying it was tested, the assistant saying it is sure, and clean-looking code are all claims, not evidence. Retry as a claims ledger: the evidence is your run printing Using port 5000, not the summary's sentences or how fast the answer arrived.
