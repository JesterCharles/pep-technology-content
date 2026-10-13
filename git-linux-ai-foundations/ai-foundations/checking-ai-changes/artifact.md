# Checking AI-made changes before merging

## Objectives

- Match each claim in an assistant's summary to the diff line that supports or contradicts it
- Run acceptance-criteria checks that turn a proposal into a verified or rejected result (simulated)
- Decide approve or request changes, citing specific evidence

## Teaching

### Start with a guess

An assistant opened a change for review. Its summary says: “Prints the port the app uses. Keeps the 8080 default. All tests pass.”

The change, summary and outputs are synthetic examples. Nothing calls a real AI model or runs on your computer.

### Claims are not evidence

An AI-made change arrives as a diff plus a summary. Treat each sentence of the summary as a claim. The diff is evidence of what changed: a line can support a claim, contradict it, or show that a check was weakened, such as a deleted test.

Read every changed line, removed lines included. Removals hide the biggest surprises.

### Run the acceptance criteria

A supported claim is still unverified. Run the story's acceptance criteria and compare the output with the expected result. Only a matching run turns a proposal into a verified result.

- AC1: given `PORT=5000`, running `sh start.sh` prints `Using port 5000`.
- AC2: given no PORT, it prints `Using port 8080`.

### Decide with evidence

A review decision names its evidence: the line, the failed check, what to change. Who wrote the change does not decide it; the evidence does.

## Model

Claims beside evidence (synthetic change)

Summary claims

1. Prints the port the app uses. Not checked yet
2. Keeps the 8080 default. Not checked yet
3. All tests pass. Not checked yet

Diff

```diff
start.sh
  #!/bin/sh
- PORT="${PORT:-8080}"
+ PORT=3000
+ echo "Using port $PORT"
  echo "Starting app"
tests/test_start.sh
  run_test check_prints_port
- run_test check_default_port
```

## Recap

- Treat an assistant's summary as claims, not evidence.
- Read every changed line, especially removals and deleted tests.
- Run the acceptance criteria; only a matching run is a verified result.
- Approve or request changes by citing specific evidence, whoever wrote the change.

Next topic: Practice: Foundations course review

## Cheat sheet

|  |  |
| --- | --- |
| Supported | a diff line matches the claim; still not run |
| Contradicted | a diff line or a run shows the opposite |
| Weakened | a test or check was removed, so “passes” proves less |
| Verified | you ran the acceptance criteria and the output matched |

## Sources

Claims on this page were checked against the live official pages below on 6 October 2026 (UTC). Links open outside this lesson.

- Reviewing proposed changes in a pull request (GitHub Docs): approve or request changes. GitHub's wording; other hosts use similar review states.
- Best practices for using GitHub Copilot: Check Copilot's work; understand suggested code before you implement it. Applies to AI-made changes generally.

The change, summary and terminal runs are synthetic simulations written for this lesson, not real AI output or command execution.

## Static interaction alternatives

### predict

Prediction (not scored). An assistant's summary says all tests pass. What does it tell you? It gives claims to check against the diff and the checks. It is not enough on its own, because a summary is part of the proposal. AI summaries are not always wrong, since they are often partly right. Which model wrote it does not matter: the evidence is the same whoever wrote the change.

### explore

Match each claim to diff evidence. The diff to start.sh removes PORT="${PORT:-8080}", adds PORT=3000 and adds echo "Using port $PORT"; in tests/test_start.sh it removes run_test check_default_port. Claim 1, prints the port the app uses: supported by the added echo line, but not yet run. Claim 2, keeps the 8080 default: contradicted, because the default line is removed and PORT is now always 3000. Claim 3, all tests pass: weakened, because the default-port test was deleted.

### terminal

Run the acceptance-criteria checks in the simulated terminal. AC1: PORT=5000 sh start.sh should print Using port 5000; it prints Using port 3000, so AC1 fails. AC2: sh start.sh should print Using port 8080; it prints Using port 3000, so AC2 fails. Verified result: the change fails both acceptance criteria, even though the summary sounded complete. Any other command is reported as not available in this practice terminal.

### mcq

Graded check with a confidence rating. A new change's summary says: fixed a typo in the greeting; no behavior change. The diff fixes the typo but also removes echo "Using port $PORT", and AC1 now prints only Starting app. Decision: request changes, citing the removed port line and the failed AC1 run. Approving because the summary says typo fix trusts the claim over the diff; earlier checks covered earlier code; and rejecting only because an assistant wrote it is not evidence. Retry as a claims ledger: no behavior change is contradicted by the removed line and the failed run; the typo fix is real but is not the whole diff, and no test was deleted this time.
