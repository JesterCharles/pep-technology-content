# File permissions

## Objectives

- Read an ls -l permission string for owner, group and others
- Change permissions with chmod using numeric modes such as 750
- Explain why a script needs x permission to run directly as ./script.sh, but not when passed to an interpreter as bash script.sh

## Teaching

Start with a guess

Look at deploy.sh on the right, then guess. Practice prediction, not scored.

Read a permission string
  ls -l starts each line with a permission string. The first character is the type: - for a file, d for a directory.
  The next nine are three groups of rwx: the owner (ana), the group (dev), then everyone else. r is read, w is write, x is execute: run a file, or enter a directory. A - means that permission is off.

Permissions as numbers
  Each permission has a value: r = 4, w = 2, x = 1. Add the values in a group to get one digit, then write the digits for owner, group and others.
  rwx = 7, r-x = 5, r-- = 4, --- = 0. So rwxr-x--- is 750.

Apply a mode with chmod
  chmod MODE FILE changes a file's permissions, for example chmod 750 deploy.sh.
  To run a script in the current folder, type ./deploy.sh; the ./ says it is right here. Without x, the shell answers Permission denied.

Apply it to a new file
  Same rules, a file holding secrets. Decide each group's letters first, then the digits.

## Model

ls -l in Ana's fictional pep folder. The terminal is a simulation.

Permissions of deploy.sh

Who	r 4	w 2	x 1	Digit
Owner ana	r	w	-	6
Group dev	r	-	-	4
Others everyone else	r	-	-	4

String -rw-r--r-- Mode 644

## Recap

Recap
  ls -l shows the type, then three rwx groups: owner, group, others.r = 4, w = 2, x = 1; add them per group, so rwxr-x--- is 750.chmod MODE FILE applies a mode; you need r and x to run a script with ./.Give others nothing on secret files, and avoid 777.

    Cheat sheet
    ls -lshow permissionschmod 750 frwxr-x---chmod 644 frw-r--r--chmod 600 frw-------./script.shrun a script here
    chmod also has a letter form, such as chmod u+x deploy.sh; this topic practises the numeric form. A script also needs r because the shell reads it.

  Sources and review dateChecked against these live sources on 2026-10-12. Commands and messages follow GNU/Linux (bash, coreutils, grep); macOS and other systems can differ.GNU Coreutils manual: chmod invocationGNU Coreutils manual: numeric modesPOSIX.1-2024: ls long format permissionsLinux man-pages 6.19: execve(2) errors and interpreter scriptsGNU Bash 5.3 Reference Manual: command search and execution
  Next topic: Environment variables and keeping secrets out of code

## Cheat sheet

Cheat sheet
    ls -lshow permissionschmod 750 frwxr-x---chmod 644 frw-r--r--chmod 600 frw-------./script.shrun a script here
    chmod also has a letter form, such as chmod u+x deploy.sh; this topic practises the numeric form. A script also needs r because the shell reads it.

Sources and review dateChecked against these live sources on 2026-10-12. Commands and messages follow GNU/Linux (bash, coreutils, grep); macOS and other systems can differ.GNU Coreutils manual: chmod invocationGNU Coreutils manual: numeric modesPOSIX.1-2024: ls long format permissionsLinux man-pages 6.19: execve(2) errors and interpreter scriptsGNU Bash 5.3 Reference Manual: command search and execution

## Sources

Sources and review dateChecked against these live sources on 2026-10-12. Commands and messages follow GNU/Linux (bash, coreutils, grep); macOS and other systems can differ.GNU Coreutils manual: chmod invocationGNU Coreutils manual: numeric modesPOSIX.1-2024: ls long format permissionsLinux man-pages 6.19: execve(2) errors and interpreter scriptsGNU Bash 5.3 Reference Manual: command search and execution

## Static interaction alternatives

### explore

Listing activity: select the file that only its owner can read. In the ls -l listing, README.md and deploy.sh are -rw-r--r-- (everyone can read), src is drwxr-xr-x (a directory everyone can enter), and secrets.env is -rw------- (correct: read and write for the owner ana, nothing for the group dev or others).

### explore

Permission grid activity: plan mode 750 for deploy.sh. Owner: r, w and x on (4+2+1 = 7). Group: r and x on (4+1 = 5). Others: all off (0). The string becomes -rwxr-x---. The grid only plans; nothing changes until chmod applies it.

### predict

Prediction (practice, not scored): deploy.sh is -rw-r--r-- and you type ./deploy.sh. Options: Permission denied (correct: running a file directly needs x, and no one has x); it runs because you own it (owning a file does not add x); it runs because the name ends in .sh (the name does not grant permission); it asks for your password (the shell simply refuses).

### terminal

Terminal activity: give deploy.sh mode 750 with chmod, then run it. Worked example: chmod 750 deploy.sh, then ls -l shows -rwxr-x--- for deploy.sh, and ./deploy.sh now runs. bash deploy.sh would run even without x, because bash only needs to read the file.

### mcq

Apply question: secrets.env must be readable and writable by you, readable by the group and closed to others. Options: chmod 644 (others keep r); chmod 640 (correct: rw- = 6, r-- = 4, --- = 0); chmod 460 (digits go owner, group, others, so you get read only and the group gets read and write); chmod 750 (adds x, and a secrets file should not be runnable). Retry as strings: -rw-r----- is 640.
