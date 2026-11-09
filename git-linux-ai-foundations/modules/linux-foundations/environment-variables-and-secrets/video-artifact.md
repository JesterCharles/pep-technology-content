---
title: What are Environment variables? [10 of 20] | Bash for Beginners
channel: Microsoft Developer
url: https://www.youtube.com/watch?v=aKghi0hI1OA
runtimeMinutes: 5.5
embeddable: true
checkedAt: 2026-10-12
covers:
  - What environment variables are, viewed with env and echo (chapter at 0:00)
  - The PATH environment variable
  - Creating new environment variables with export (chapter at 3:19)
gaps:
  - Whether it shows that an unexported variable is not seen by a child program (objective o2) is not stated in the description; unconfirmed
  - Nothing on secrets, .env files, .gitignore, or revoking and rotating a committed secret (objective o3)
cautions:
  - First-party source, the Microsoft Developer channel, part 10 of the 20-part Bash for Beginners series (published 2023-02-15)
  - Fit was judged from the video description and chapter markers; the video was not watched end to end and no transcript was read
alternates:
  - title: Introduction to secret leaks and getting started with GitHub Secret Protection (GitHub)
    url: https://www.youtube.com/watch?v=vMhDkt5JNN0
    reason: 3:11 (191 s). First-party; about mitigating leaked secrets and stopping leaks, which touches o3, but it is a GitHub product walkthrough rather than the .env / .gitignore habit
  - title: "Variable Exporting on Bash - You Suck at Programming #009 (You Suck at Programming)"
    url: https://www.youtube.com/watch?v=D0BaEYxhdUE
    reason: 1:42 (102 s). Legacy pick (2026-10-07); clearly demonstrates o1 and o2 (an unexported variable is invisible to a started script). Third-party channel, not an official source
  - title: How I hide my API keys in 2 minutes (Technophile)
    url: https://www.youtube.com/watch?v=kGH6ISIDGdQ
    reason: 2:28 (148 s). Third-party; .env plus .gitignore with JavaScript dotenv; no export
rejected:
  - title: 3.4 Hiding API Keys with Environment Variables (dotenv) and Pushing Code to GitHub (The Coding Train)
    url: https://www.youtube.com/watch?v=17UVejOw3zA
    reason: 11:51 exceeds the 6-minute budget
---

# Video: What are Environment variables?

Microsoft Developer, Bash for Beginners part 10 of 20, 5:30 (330 s), https://www.youtube.com/watch?v=aKghi0hI1OA.
Live, public and embeddable on 2026-10-12 (oEmbed HTTP 200, playability OK, playableInEmbed true, not unlisted).

## What it covers

Per its description and chapters: `env` and `echo` to view variables, the `PATH` variable, and `export` to create new environment variables.
Matches objective o1.

## Gaps against the objectives

- o2: the export-to-child-process mechanic is unconfirmed.
- o3: the secrets half (`.env`, `.gitignore`, rotation) is not covered.

## Alternates

- GitHub, "Introduction to secret leaks and getting started with GitHub Secret Protection", https://www.youtube.com/watch?v=vMhDkt5JNN0, 3:11 (191 s). First-party; about mitigating leaked secrets and stopping leaks, which touches o3, but it is a GitHub product walkthrough rather than the `.env` / `.gitignore` habit.
- You Suck at Programming, "Variable Exporting on Bash - You Suck at Programming #009", https://www.youtube.com/watch?v=D0BaEYxhdUE, 1:42 (102 s). Legacy pick (2026-10-07); clearly demonstrates o1 and o2 (an unexported variable is invisible to a started script). Third-party channel, not an official source.
- Technophile, "How I hide my API keys in 2 minutes", https://www.youtube.com/watch?v=kGH6ISIDGdQ, 2:28 (148 s). Third-party; `.env` plus `.gitignore` with JavaScript `dotenv`; no `export`.

## Rejected

- The Coding Train, "3.4 Hiding API Keys with Environment Variables (dotenv) and Pushing Code to GitHub", https://www.youtube.com/watch?v=17UVejOw3zA: 11:51 exceeds the 6-minute budget.
