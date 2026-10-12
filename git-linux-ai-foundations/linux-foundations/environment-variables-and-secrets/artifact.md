# Environment variables and keeping secrets out of code

## Objectives

- Set, read and export an environment variable in the shell
- Explain why an unexported variable is not seen by a program you start
- Keep a secret out of commits by reading it from an environment variable and git-ignoring the .env file before it is ever added, and revoke or rotate any secret that was committed

## Teaching

### Start with a guess

Practice prediction, not scored. ./app is a small program that prints the API_KEY it receives.

### Shell variables and exported ones

NAME=value sets a variable in your shell; no spaces around =. echo "$NAME" prints it.

A program you start gets a copy of the environment, which holds only exported variables. export NAME marks an existing variable; export NAME=value sets and exports in one step.

### Keep secrets out of code

The risk: a key typed into a source file gets committed; anyone with the repository can read it in the history, even after you delete the line.

- Code: reads API_KEY from the environment.
- Real value: in a local .env file, listed in .gitignore so git ignores it.
- Teammates: by convention, commit a .env.example with a placeholder.
- Ever committed? It counts as leaked: revoke or rotate it.

### Apply it to a new case

A teammate's script, a different secret, the same rules.

## Model

Where values live. Fictional project; the terminal and git are simulated.

Your shell

- API_KEY=demo-123shell only

Program started from it: ./app

Not run yet.

Repository: what gets committed

- app.shNot decided
echo "calling weather API with $API_KEY"
- .envNot decided
API_KEY=not-real-42
- .env.exampleNot decided
API_KEY=replace-me
- .gitignoreNot decided
.env

## Recap

- NAME=value sets a shell variable; echo "$NAME" prints it.
- Programs you start only receive exported variables: export NAME=value.
- Code reads secrets from the environment; the real values sit in a .env listed in .gitignore.
- A secret that was committed stays in history, so change it.

Next topic: Localhost and ports

## Cheat sheet

|  |  |
| --- | --- |
| NAME=value | shell variable |
| export NAME=value | passed to programs you start |
| echo "$NAME" | print a value |
| env | list exported variables |
| .gitignore with .env | git ignores the file |

A .env file is not read by the shell automatically; your tools or framework load it. .gitignore only affects files git is not already tracking.

## Sources

Partly checked against these live sources on 2026-10-12. Commands and messages follow GNU/Linux (bash, coreutils, grep); macOS and other systems can differ.

- GNU Bash 5.3 Reference Manual: shell parameters and assignment
- GNU Bash 5.3 Reference Manual: environment and export
- GNU Coreutils manual: env invocation
- Git documentation: gitignore
- GitHub Docs: removing sensitive data from a repository

The .env and .env.example files are a common convention, not a feature of bash or git; no official source defines them.

## Static interaction alternatives

### explore

Repository activity: set each file to Commit or Keep out. Commit app.sh (it reads $API_KEY and holds no value), .env.example (placeholder value replace-me, shows teammates which variables to set) and .gitignore (it lists .env). Keep out .env, which holds the real value. Add .env to .gitignore before it is ever added; .gitignore does not untrack a file git already tracks.

### predict

Prediction (practice, not scored): you type API_KEY=demo-123, then ./app. Options: app: API_KEY is not set (correct: the variable exists only in the shell; a program you start receives only exported variables); app: using API_KEY=demo-123 (would need export); the shell closes with an error (setting a variable is valid); it depends on the folder (export status, not the folder, decides).

### terminal

Terminal activity: API_KEY is set but not exported. Export it, then run ./app. Worked example: export API_KEY, then ./app prints app: using API_KEY=demo-123. echo "$API_KEY" reads the value in the shell itself.

### explore

Commit check: checking the commit confirms the decision. Correct state: app.sh, .env.example and .gitignore are committed; .env is kept out because it holds the value.

### mcq

Apply question: a teammate committed db.sh with DB_PASSWORD=hunter2 inside. The right fix: read it from the environment, keep the value in an ignored .env and change the password. Deleting the line in a new commit leaves the password in history; renaming the variable keeps the same password in code and history; adding db.sh to .gitignore does not affect a tracked file, and history keeps the password. Retry as setups: .env listed in .gitignore with db.sh reading $DB_PASSWORD is correct.
