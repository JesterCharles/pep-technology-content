# Video curation record: html-css-js

Curated and verified 2026-11-09 on branch fm/pep-video-curation-web-react. Each linked video is an optional supplemental link recorded in that topic's `video-artifact.md`, with its liveness receipt at `authoring/evidence/html-css-js/<module>/<topic>/video.json`. No video is a runtime prerequisite, nothing is embedded in or downloaded into a learner page, and no required course minutes change.

## Verification method

- Search: YouTube search result pages (titles, runtimes and channels only, used to find candidates, never as evidence), one or more queries per topic objective set.
- Verification for every selected video, read live on 2026-11-09: the YouTube watch page player data (title, channel, `lengthSeconds`, publish date, `playabilityStatus` OK, `playableInEmbed` true, not unlisted, not private), the YouTube oEmbed endpoint (HTTP 200), the chapter list, the description and the caption track (author captions where published, otherwise YouTube's automatic captions). Content fit, segment boundaries and timestamps come from chapters and captions; no video was watched end to end.
- Gate rules applied: the full runtime of every linked video is within its topic's `minutes.budget` (gate T17), and the companion front matter follows `authoring/schemas/video-artifact.frontmatter.schema.json`.
- Access limitation: during the same session YouTube began answering automated watch-page requests with a captcha redirect (HTTP 302); oEmbed stayed available. A few late alternates (listed as "captions not reviewed") were therefore judged from search metadata only and are not linked.
- Publisher bar: first-party publishers (Chrome for Developers) or established technical educators with large public followings; free, public, no account or subscription needed to watch. Paid-course plugs, sponsorships and untaught frameworks visible in a video are named in that companion's cautions.

## Module html-and-css

| Topic | Video (publisher) | Published | Full runtime | Assigned segment | Optional watch min | Days | Objective fit |
|---|---|---|---|---|---|---|---|
| semantic-html-page-structure | [Why headings and landmarks are so important -- A11ycasts #18](https://www.youtube.com/watch?v=vAAzdi1xuUY) (Chrome for Developers) | 2017-05-26 | 7:18 (438 s) | 0:00-7:18 | 7.30 | S20, FT12 | o1 partial/none; o2 covered; o3 partial/none |
| forms-and-html5-validation | [How do forms, labels and inputs work in HTML?](https://www.youtube.com/watch?v=O14Wb3N4wDQ) (freeCodeCamp Concepts) | 2025-03-05 | 2:13 (133 s) | 0:00-2:13 | 2.22 | S20, FT12 | o1 partial/none; o2 partial/none; o3 partial/none |
| accessibility-basics | [Just use button -- A11ycasts #05](https://www.youtube.com/watch?v=CZGqnp06DnI) (Chrome for Developers) | 2016-09-16 | 7:34 (454 s) | 0:00-7:34 | 7.57 | S20, FT12 | o1 partial/none; o2 covered; o3 partial/none |
| the-box-model | [Learn CSS Box Model In 8 Minutes](https://www.youtube.com/watch?v=rIO5326FgPE) (Web Dev Simplified) | 2019-03-16 | 8:22 (502 s) | 0:00-8:22 | 8.37 | S20, FT12 | o1 covered; o2 covered; o3 partial/none |
| flexbox | [Learn Flexbox CSS in 8 minutes](https://www.youtube.com/watch?v=phWxA89Dy94) (Slaying The Dragon) | 2022-11-14 | 8:16 (496 s) | 0:00-6:43 | 6.72 | S21, FT12 | o1 covered; o2 covered; o3 partial/none |
| grid | [Why CSS Grid feels complex, and how to keep it simple](https://www.youtube.com/watch?v=7OrtUkPgHLA) (Kevin Powell) | 2025-12-31 | 5:58 (358 s) | 0:00-5:58 | 5.97 | S21, FT12 | o1 partial/none; o2 partial/none; o3 covered |
| responsive-mobile-first-layout | [Get your media queries working with the meta viewport HTML tag](https://www.youtube.com/watch?v=SElOdK2qTpI) (Kevin Powell) | 2020-10-09 | 3:40 (220 s) | 0:00-3:40 | 3.67 | S21, FT12 | o1 partial/none; o2 covered; o3 partial/none |

## Module javascript-fundamentals

| Topic | Video (publisher) | Published | Full runtime | Assigned segment | Optional watch min | Days | Objective fit |
|---|---|---|---|---|---|---|---|
| javascript-for-java-developers | none linked | | | | 0 (absent) | S22, FT12 | No verified video meets the bar: the 2026-11-09 search's best candidate, Fireship's "JavaScript in 100 Seconds" (2:36), is a general overview whose captions cover neither typeof nor Number versus BigInt, and the other candidates were career commentary or over-broad concept sweeps; see authoring/evidence/html-css-js/video-curation.md. |
| let-const-and-equals | [Differences Between Var, Let, and Const](https://www.youtube.com/watch?v=9WIJQDvt4Us) (Web Dev Simplified) | 2018-11-10 | 8:37 (517 s) | 0:00-8:37 | 8.62 | S22, FT12 | o1 covered; o2 covered; o3 partial/none |
| functions-as-values-arrow-functions-and-callbacks | [JavaScript Callbacks Explained in 5 Minutes (Essential for asynchronous code!)](https://www.youtube.com/watch?v=kz_vwAF4NHI) (James Q Quick) | 2022-08-09 | 6:42 (402 s) | 0:00-6:42 | 6.70 | S22, FT13 | o1 covered; o2 partial/none; o3 covered |
| arrays-and-objects-map-filter-reduce | [How to use map() filter() reduce() / JavaScript Array Methods Tutorial](https://www.youtube.com/watch?v=PojpwEbOQJg) (Coding2GO) | 2024-10-05 | 11:47 (707 s) | 0:00-11:47 | 11.78 | S22, FT13 | o1 partial/none; o2 covered; o3 covered |
| destructuring-and-spread | [JS Destructuring in 100 Seconds](https://www.youtube.com/watch?v=UgEaJBz3bjY) (Fireship) | 2021-01-12 | 3:31 (211 s) | 0:00-3:31 | 3.52 | S23, FT13 | o1 covered; o2 partial/none; o3 partial/none |
| modules-import-and-export | [JavaScript ES6 Modules](https://www.youtube.com/watch?v=cRHQNNcYf6s) (Web Dev Simplified) | 2019-01-26 | 7:38 (458 s) | 0:00-7:38 | 7.63 | S23, FT13 | o1 covered; o2 covered; o3 covered |
| scope-and-closures | [Closures Explained in 100 Seconds // Tricky JavaScript Interview Prep](https://www.youtube.com/watch?v=vKJpN5FAeF4) (Fireship) | 2021-06-17 | 4:57 (297 s) | 0:00-4:57 | 4.95 | S23, FT13 | o1 covered; o2 partial/none; o3 covered |

## Module dom-tooling-and-async

| Topic | Video (publisher) | Published | Full runtime | Assigned segment | Optional watch min | Days | Objective fit |
|---|---|---|---|---|---|---|---|
| project-setup-with-npm-and-vite | [Vite in 100 Seconds](https://www.youtube.com/watch?v=KCrXgy8qtjM) (Fireship) | 2022-02-23 | 2:28 (148 s) | 0:00-2:28 | 2.47 | S24, FT13 | o1 covered; o2 partial/none; o3 partial/none |
| selecting-and-changing-the-dom | none linked | | | | 0 (absent) | S24, FT14 | No verified video meets the bar: the 2026-11-09 search's best candidate, Bro Code's "The JavaScript DOM explained in 5 minutes!" (5:01), never uses querySelector or classList per its captions, and the querySelector-specific candidates (dcode 2018, Net Ninja 2017) cover o1 only and could not be caption-checked; see authoring/evidence/html-css-js/video-curation.md. |
| events-and-event-bubbling | [Learn Event Delegation In 10 Minutes](https://www.youtube.com/watch?v=cOoP8-NPLSo) (Web Dev Simplified) | 2024-08-03 | 9:56 (596 s) | 0:00-9:56 | 9.93 | S24, FT14 | o1 covered; o2 partial/none; o3 partial/none |
| preventing-cross-site-scripting | [How To Prevent The Most Common Cross Site Scripting Attack](https://www.youtube.com/watch?v=ns1LX6mEvyM) (Web Dev Simplified) | 2018-10-11 | 4:56 (296 s) | 0:00-4:56 | 4.93 | S24, FT14 | o1 covered; o2 covered; o3 partial/none |
| promises | [JavaScript Promise in 100 Seconds](https://www.youtube.com/watch?v=RvYYCGs45L4) (Fireship) | 2020-01-31 | 1:39 (99 s) | 0:00-1:39 | 1.65 | S25, FT14 | o1 covered; o2 covered; o3 partial/none |
| async-and-await | [JavaScript Async Await](https://www.youtube.com/watch?v=V_Kr9OSfDeU) (Web Dev Simplified) | 2019-02-09 | 7:31 (451 s) | 0:00-7:31 | 7.52 | S25, FT14 | o1 covered; o2 covered; o3 partial/none |
| the-event-loop | [JavaScript Event Loop: How it Works and Why it Matters in 5 Minutes](https://www.youtube.com/watch?v=lqLSNG_79lI) (James Q Quick) | 2022-11-29 | 7:20 (440 s) | 1:18-7:20 | 6.03 | S25, FT14 | o1 partial/none; o2 covered |
| debugging-with-devtools-breakpoints | [Debugging JavaScript - Chrome DevTools 101](https://www.youtube.com/watch?v=H0XScE08hy8) (Chrome for Developers) | 2018-01-05 | 7:27 (447 s) | 0:00-7:27 | 7.45 | S25, FT14 | o1 partial/none; o2 covered; o3 covered |

## Module fetch-and-browser-client

| Topic | Video (publisher) | Published | Full runtime | Assigned segment | Optional watch min | Days | Objective fit |
|---|---|---|---|---|---|---|---|
| fetching-data | [Learn Fetch API In 6 Minutes](https://www.youtube.com/watch?v=cuEtnrL9-H0) (Web Dev Simplified) | 2019-10-15 | 6:35 (395 s) | 0:00-6:35 | 6.58 | S26, FT15 | o1 covered; o2 covered; o3 partial/none |
| handling-http-errors-and-problemdetail-responses | none linked | | | | 0 (absent) | S26, FT15 | Not linked: the 2026-11-09 search found no video on application/problem+json for a browser client (the one Problem Details candidate builds it in ASP.NET), and the fetch-resolves-on-HTTP-errors point is already in the video linked from fetching-data; see authoring/evidence/html-css-js/video-curation.md. |
| fixing-cors-spring-security-config-vs-vite-dev-proxy | [CORS in 100 Seconds](https://www.youtube.com/watch?v=4KHiSt0oLJ0) (Fireship) | 2021-03-29 | 2:31 (151 s) | 0:00-2:31 | 2.52 | S26, FT15 | o1 covered; o2 partial/none; o3 partial/none |
| cookies-vs-localstorage-where-tokens-should-live | [Does Storing JWT's In HTTP Only Cookies Stop XSS Attacks](https://www.youtube.com/watch?v=vq861XoZI9k) (Dennis Ivy) | 2021-05-27 | 5:34 (334 s) | 0:00-5:34 | 5.57 | S26, FT15 | o1 covered; o2 partial/none |
| calling-your-spring-boot-api-from-the-browser | [Fetch API in 4 Minutes (GET, POST, PUT, DELETE / JSON)](https://www.youtube.com/watch?v=XHokFQeQ6Lk) (ByteGrad) | 2022-07-05 | 4:59 (299 s) | 0:00-4:59 | 4.98 | S27, FT15 | o1 covered; o2 partial/none |
| environment-settings-for-the-api-address | none linked | | | | 0 (absent) | S27, FT15 | No verified video: the 2026-11-09 search found one short candidate, How Dev You's "Environment Variables in VITE + REACT" (1:50), whose captions configure Vite define instead of the VITE_ prefix and import.meta.env this topic teaches, and no other candidate within the 11-minute budget covers o1 or o2; see authoring/evidence/html-css-js/video-curation.md. |
| testing-a-plain-function-with-vitest | [Vitest Simplified](https://www.youtube.com/watch?v=snCLQmINqCU) (LearnVue) | 2022-02-14 | 4:54 (294 s) | 0:00-2:27 | 2.45 | S27, FT15 | o1 covered; o2 partial/none; o3 partial/none |

## Optional watch minutes

All figures are unrounded sums of assigned segments, in minutes. They are optional supplemental time and are reported separately from the required learner path; they are not added to any topic budget, day template or track length.

- Course html-css-js: 25 topics link 25 distinct videos, 147.08 unique optional watch minutes (reused videos and overlapping segments counted once).
- Standard track, this course: 25 topics, 147.08 unique optional minutes.
- Fast track, this course: 25 topics, 147.08 unique optional minutes.
- Both tracks teach the same canonical topic pages (every topic in this course is scheduled on a Standard S day and a Fast FT day), so the Standard and Fast figures above are the same content and must not be added together.
- For a whole-track view across html-css-js and react together: Standard 285.77 and Fast 285.77 unique optional minutes, from 43 distinct videos; two videos are linked from both courses with overlapping segments, so this is less than the sum of the two course figures.

### Required learner-path timing, kept separate

- The required topic pages carry 340 budgeted minutes over 29 topics (sum of `minutes.budget`). Practice, coding labs, the project brief and assessment time are scheduled in the day templates (see `authoring/evidence/html-css-js/intake.md`) and are not timed by these figures; that overhead is unmeasured here, not zero.
- Fast Track keeps its fixed six weeks including AWS; optional videos add no Fast day and are not placed in a Fast block (the Fast day template has no video block).
- Standard Track length (43 days versus 40 days) is an open decision outside this record; these optional minutes do not resolve or change it.

### Standard Concept-day Short video block (informational)

The Standard Concept template has an 8-minute Short video block; the Lab, Practice and Project templates have no topic-video block, so optional videos on those days are always self-paced. Linked optional minutes per Standard day. The intake allocates topic videos to that block only when they fit; these companions are instead unscheduled optional links, so the last column only shows which subset could fill the block if the platform schedules one:

| Day | Day type | Topics with a video | Optional minutes | Fits a Short video block? | Largest set within 8 minutes (Concept days) |
|---|---|---|---|---|---|
| S20 | Concept | 4 | 25.45 | no: over 8 minutes, self-paced outside the block | accessibility-basics (7.57) |
| S21 | Lab | 3 | 16.35 | no block on this day type: self-paced |  |
| S22 | Concept | 3 | 27.10 | no: over 8 minutes, self-paced outside the block | functions-as-values-arrow-functions-and-callbacks (6.70) |
| S23 | Practice | 3 | 16.10 | no block on this day type: self-paced |  |
| S24 | Concept | 3 | 17.33 | no: over 8 minutes, self-paced outside the block | project-setup-with-npm-and-vite, preventing-cross-site-scripting (7.40) |
| S25 | Concept | 4 | 22.65 | no: over 8 minutes, self-paced outside the block | promises, the-event-loop (7.68) |
| S26 | Lab | 3 | 14.67 | no block on this day type: self-paced |  |
| S27 | Project | 2 | 7.43 | no block on this day type: self-paced |  |

## Reused videos

- How do forms, labels and inputs work in HTML? (freeCodeCamp Concepts) is linked from `html-css-js/html-and-css/forms-and-html5-validation` (0:00-2:13) and from `react/forms-context-and-crud/accessible-forms` (0:43-1:42); the overlap is counted once in every union above.
- Fetch API in 4 Minutes (GET, POST, PUT, DELETE | JSON) (ByteGrad) is linked from `html-css-js/fetch-and-browser-client/calling-your-spring-boot-api-from-the-browser` (0:00-4:59) and from `react/forms-context-and-crud/create-edit-and-delete-against-the-api` (3:53-4:59); the overlap is counted once in every union above.

See `authoring/evidence/react/video-curation.md` for the companion record.

## Addendum: delivery disposition (2026-11-09)

Firstmate disposition received 2026-11-09T18:53Z. This addendum is a report only; no curated video data changed with it.

- Status: preserved, screened research handoff. Source branch `fm/pep-video-curation-web-react`, source commit `180b678a`, plus this report-only addendum commit. Nothing is published from this branch.
- Hold: no no-mistakes, browser checks, publication or media integration while HTML/GIFT upload-critical validation owns capacity.
- Delivery split: eventual delivery is two separate course-scoped branches, one for `html-css-js` and one for `react`, never both courses from one branch. Each carries only its own course's `video-artifact.md`, `video.json`, topic `video` status, review evidence, `video-curation.md` and regenerated locks.
- Intake timing (HTML/CSS/JavaScript scope): the `html-css-js` delivery branch reconciles the eight-minute Concept-block prose in `authoring/evidence/html-css-js/intake.md` (Concept-day row for S20, S22, S24, S25). It must say that the Short video 8 block is scheduled required time, and that linked videos are unscheduled optional supplemental links. Optional minutes never become free required time, and never change required hours or the Fast six-week timing including AWS. The `react` intake has no video-block prose to reconcile.
- Representation: no schema or T17 extension now. Where fit is established, the existing full-video link (`video-artifact.md` plus `video.json`, full runtime within the topic budget) is used, and the recommended segment is kept as evidence in the companion body and this record. A minimal representation change is scoped only if real integration proves it necessary.
- The html-and-css/the-box-model caption-only claims (padding at 1:03, margin collapse at 4:09-5:30, the narrator's border-box slip at 6:10) stay explicitly unverified and are not approved.
- Approval authority: before publication, every new video companion needs the normal authority, which is independent education and SME critics plus a non-author reconciliation bound to the current `video-artifact.md` bytes.
  - The owner-essential-QA `video-artifact.md` bindings are owner evidence only, not approval. There are 38 of them: 18 `html-css-js` topics outside html-and-css and all 20 `react` topics.
  - The visual exception and the completed 243-topic release do not authorize owner-only approval.
  - Old HTML critic bindings are not video judgments.

### Residual and decision inventory

| # | Item | State | Owner / next step |
|---|---|---|---|
| 1 | Combined branch spans two courses, 8 modules and both course records | Resolved: split into an `html-css-js` and a `react` course-scoped delivery branch | Future delivery branches; this branch stays a source handoff |
| 2 | intake.md Concept-row prose says a video that does not fit the 8-minute block is recorded absent | Resolved direction: reconcile the prose in the `html-css-js` branch so it separates scheduled required time from unscheduled optional links | `html-css-js` delivery branch |
| 3 | Segment representation (T17 checks the full runtime against the budget, and has no segment field) | Resolved: full-video link where fit is established, with the segment kept as evidence; no schema or T17 change now | Revisit only if integration proves it necessary |
| 4 | Box-model caption-only claims | Open: unverified, not approved | Re-verify against captions, or drop the claims, before approval |
| 5 | 38 companions with owner-only evidence (18 `html-css-js`, 20 `react`) | Open: need independent education and SME critics plus a non-author reconciliation | Each delivery branch, under normal authority |
| 6 | html-and-css video critic reports are stored as `video-r0-critic-<role>-recheck.json` with `of` set to the page `critic-<role>.json`, and video decisions are merged into the page `reconciliation.json` (T02 topic naming) | Open: these are video-specific judgments, but the storage form needs acceptance under normal authority at publication | `html-css-js` delivery branch |
| 7 | Browser gates T08-T13 and T18, `npm test`, no-mistakes | Not run (capacity hold); nothing claimed green, and there is no hosted CI | Each delivery branch once capacity frees |
| 8 | `video.json` receipts dated 2026-11-09 | T17 freshness is 30 days, so the receipts go stale after 2026-12-09 | Re-verify liveness before publication if later |
| 9 | 10 topics with no video (absent reasons in `topic.json`) | Recorded honestly; no video forced | None unless a fit is found later |
| 10 | Alternates marked "captions not reviewed" | Not linked; judged from search metadata only | None |
| 11 | All 8 module locks and both course locks are touched here | Each split branch regenerates its own locks; parallel branches on these modules conflict | Delivery branches, one at a time |
| 12 | Standard Track 43 versus 40 days | Unresolved, outside this work | Captain |
| 13 | Practice, lab, project and assessment overhead | Unmeasured, not zero; not timed by optional minutes | None here |
| 14 | `authoring/evidence/html-css-js/html-and-css/video-search.md` rewritten (the 2026-10-14 search marked superseded) | Belongs to the `html-css-js` scope | `html-css-js` delivery branch |
| 15 | YouTube automated access (watch-page captcha, then caption 429s) | Limitation recorded; no video watched end to end | State it honestly in any re-verification |
