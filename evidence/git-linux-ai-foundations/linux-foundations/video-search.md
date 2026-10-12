# Linux Foundations video search log

Checked 2026-10-12 for module `git-linux-ai-foundations/linux-foundations`.
Rule applied per topic: a first-party video (official project, vendor or university channel) if one fits the objectives within `minutes.budget`; otherwise the legacy 2026-10-07 pick if still live, public, embeddable, under budget and on-topic, marked "third-party channel, not an official source"; otherwise absent.

## Method

- Web searches (general engine) for first-party material from Red Hat, the Linux Foundation, GitHub, Microsoft Learn, Mozilla/MDN and Cloudflare.
- YouTube public search result pages (no sign-in) for queries listed below, reading video id, channel, title and length.
- Each candidate's watch page and YouTube oEmbed fetched without sign-in: oEmbed status, title, author, `lengthSeconds`, playability status, `playableInEmbed`, `isUnlisted`, publish date, view count.
- Fit judged from video descriptions and chapter markers (first-party picks) or the 2026-10-07 legacy storyboard-frame review (legacy picks). No video was watched end to end and no transcript was read.
- Receipts written by `node tools/net/check-video.mjs` to `evidence/git-linux-ai-foundations/linux-foundations/<topic>/video.json`.

## YouTube queries run

- `Bash for Beginners Part of 20 Microsoft Developer`, `Bash for Beginners 6 of 20 Listing`
- `CS50 linux commands short`, `CS50 pipes grep`, `CS50 file permissions chmod`, `localhost ports explained CS50`
- `Red Hat grep pipe command line`, `Red Hat Enterprise Linux grep pipe short`, `chmod permissions Red Hat`, `Red Hat file permissions short`
- `Linux Foundation grep command`, `Linux Foundation LFS101 video`, `MIT missing semester shell`
- `Microsoft Developer grep`, `Microsoft Developer localhost port`, `Microsoft Developer what is localhost`
- `Mozilla MDN localhost server`, `Cloudflare what is a port`, `Google for Developers localhost`
- `GitHub secret scanning push protection`, `GitHub keep secrets out of your code .env`, `environment variables secrets .env GitHub`
- `address already in use connection refused explained`
- `Ubuntu Canonical command line grep` (search page returned no parsable data)

## Outcome per topic

| Topic | Budget | Pick | Channel | Runtime | First-party |
|---|---|---|---|---|---|
| navigating-the-shell | 8 | https://www.youtube.com/watch?v=jq-it7dRpt4 | Microsoft Developer | 367 s | yes |
| pipes-and-grep | 6 | https://www.youtube.com/watch?v=lUd_rxHCiNI | TechTooniya | 169 s | no (legacy) |
| file-permissions | 7 | https://www.youtube.com/watch?v=36UZr9XQ9o4 | Boot dev | 128 s | no (legacy) |
| environment-variables-and-secrets | 6 | https://www.youtube.com/watch?v=aKghi0hI1OA | Microsoft Developer | 330 s | yes |
| localhost-and-ports | 6 | https://www.youtube.com/watch?v=WbC0TAdUNC4 | The Program One | 127 s | no (legacy) |

No topic is absent. Each topic's `video-artifact.md` lists gaps, cautions, alternates and rejected candidates.

## First-party candidates found and why rejected or chosen

- Microsoft Developer, Bash for Beginners (20 parts, 2023-02-15):
  - [5 of 20] navigate the terminal, 367 s: chosen for navigating-the-shell (pwd, cd).
  - [6 of 20] list content, 220 s: alternate for navigating-the-shell (ls).
  - [10 of 20] environment variables, 330 s: chosen for environment-variables-and-secrets (env, echo, export, PATH).
  - [11 of 20] redirection and pipelines, 590 s: rejected for pipes-and-grep, over the 6-minute budget.
  - [12 of 20] file permissions, 581 s: rejected for file-permissions, over the 7-minute budget.
- Red Hat, "Linux file permissions and chmod explained | RHEL Field Guide", 755 s: rejected, over the 7-minute budget.
- Red Hat Enterprise Linux, "Into the Terminal" episodes (35 to 68 minutes): rejected, over budget.
- GitHub, "Introduction to secret leaks and getting started with GitHub Secret Protection", 191 s: alternate for environment-variables-and-secrets (product walkthrough, touches o3 only).
- MIT Missing Semester and CS50 shell lectures and shorts (17:52 and longer): rejected, over budget.
- No first-party video on localhost and ports was found.

## Legacy picks re-verified (2026-10-12)

All five legacy picks from the 2026-10-07 curation returned oEmbed HTTP 200, playability OK, `playableInEmbed` true and not unlisted:
vBSvCwO8VuM (229 s), lUd_rxHCiNI (169 s), 36UZr9XQ9o4 (128 s), D0BaEYxhdUE (102 s), WbC0TAdUNC4 (127 s).
vBSvCwO8VuM and D0BaEYxhdUE were displaced by first-party picks and are listed as alternates.
