# Navigating files and folders in the shell

## Objectives

- Report your location with pwd and list entries with ls and ls -a
- Tell absolute, relative, home (~) and parent (..) paths apart
- Move with cd, including a folder name that contains a space

## Teaching

### Start with a guess

Practice prediction, not scored.

### Where am I, and what is here?

The filled row is your current folder, the working directory.

pwd prints it as a full path. ls lists what it holds but skips hidden names, which start with a dot. ls -a shows them too, plus . (this folder) and .. (its parent).

### Four ways a path can start

- Relative, like projects/pep: read from your current folder.
- Absolute, like /tmp: read from the root.
- ~, like ~/notes: starts at home, /home/ana here.
- ..: the parent folder, one level up.

ls plus a path lists that folder without moving you.

### Move with cd

cd plus a path moves you there; cd ~ or plain cd goes home.

Spaces split words: cd class notes passes two words and fails. Keep the name whole with cd "class notes" or cd class\ notes.

Every part of a path must be an existing folder; a failed cd prints an error and you stay put.

### Apply it somewhere new

Same rules, new starting point.

## Model

Ana's fictional folders. The terminal is a simulation.

- /
- home/
- ana/
- .profile
- class notes/
- lesson.txt
- notes/
- today.md
- projects/
- pep/
- README.md
- tmp/

Current folder

not shown yet

Last path read

1. None yet.

filled you are here outlined path read

## Recap

- pwd shows where you are; ls -a adds hidden names.
- / starts at the root, a relative path where you are, ~ at home; .. is up one.
- Quote or escape spaces; a failed cd leaves you in place.

Next topic: Pipes and grep

## Cheat sheet

|  |  |
| --- | --- |
| pwd | print the current folder |
| ls / ls -a | list entries / include hidden ones |
| ls path | list another folder without moving |
| cd path | move to a folder |
| cd .. | up one level |
| cd ~ or cd | home |
| cd "class notes" | a name with a space |

Error wording, ls ordering and quoting of spaced names vary between shells and systems; the rules above do not.

## Sources

Partly checked against these live sources on 2026-10-12. Commands and messages follow GNU/Linux (bash, coreutils, grep); macOS and other systems can differ.

- GNU Bash 5.3 Reference Manual: cd and other builtins
- GNU Bash 5.3 Reference Manual: quoting
- GNU Bash 5.3 Reference Manual: tilde expansion
- GNU Coreutils manual: ls invocation
- GNU Coreutils manual: pwd invocation

Not confirmed by these sources: the exact wording of the "too many arguments" error, GNU ls quoting a spaced name by default on a terminal, and which folder a new terminal opens in. The page labels these as varying.

## Static interaction alternatives

### predict

Prediction (practice, not scored): a new terminal opens and you type pwd. Options: /home/ana; ~; /; ana. Answer: /home/ana. A new terminal usually starts in your home folder, and pwd prints the full path from the root. ~ is a shortcut you type for home, but pwd does not print it; / is the root; pwd prints the whole path, not just the last folder name.

### terminal

Terminal activity: run pwd, then ls -a. Worked example: pwd prints /home/ana. ls -a lists every entry, including names that start with a dot: . .. .profile 'class notes' notes projects. Plain ls hides the dot entries.

### terminal

Terminal activity: from /home/ana, list the pep folder twice. Relative path, which starts where you are: ls projects/pep. Home path, which starts at your home folder: ls ~/projects/pep. Both list README.md.

### terminal

Terminal activity: make three moves in any order. Into the folder with a space: cd "class notes" or cd class\ notes (quote or escape the space; cd class notes fails because it receives two arguments). Up one level: cd .. . To /tmp with an absolute path: cd /tmp. Check where you are with pwd after each move.

### mcq

Apply question: you are in /home/ana/projects/pep. Which command takes you to /home/ana/notes? Options: cd ../notes (one .. only reaches projects, which has no notes); cd notes (pep has no notes folder); cd ../../notes (correct: climbs pep to projects to ana, then enters notes); cd /notes (a leading / starts at the root, and there is no /notes). Retry as routes: pep to projects to ana to notes is the working route.
