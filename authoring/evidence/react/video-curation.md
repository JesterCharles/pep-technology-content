# Video curation record: react

Curated and verified 2026-11-09 on branch fm/pep-video-curation-web-react. Each linked video is an optional supplemental link recorded in that topic's `video-artifact.md`, with its liveness receipt at `authoring/evidence/react/<module>/<topic>/video.json`. No video is a runtime prerequisite, nothing is embedded in or downloaded into a learner page, and no required course minutes change.

## Verification method

- Search: YouTube search result pages (titles, runtimes and channels only, used to find candidates, never as evidence), one or more queries per topic objective set.
- Verification for every selected video, read live on 2026-11-09: the YouTube watch page player data (title, channel, `lengthSeconds`, publish date, `playabilityStatus` OK, `playableInEmbed` true, not unlisted, not private), the YouTube oEmbed endpoint (HTTP 200), the chapter list, the description and the caption track (author captions where published, otherwise YouTube's automatic captions). Content fit, segment boundaries and timestamps come from chapters and captions; no video was watched end to end.
- Gate rules applied: the full runtime of every linked video is within its topic's `minutes.budget` (gate T17), and the companion front matter follows `authoring/schemas/video-artifact.frontmatter.schema.json`.
- Access limitation: during the same session YouTube began answering automated watch-page requests with a captcha redirect (HTTP 302); oEmbed stayed available. A few late alternates (listed as "captions not reviewed") were therefore judged from search metadata only and are not linked.
- Publisher bar: first-party publishers (Chrome for Developers) or established technical educators with large public followings; free, public, no account or subscription needed to watch. Paid-course plugs, sponsorships and untaught frameworks visible in a video are named in that companion's cautions.

## Module components-and-state

| Topic | Video (publisher) | Published | Full runtime | Assigned segment | Optional watch min | Days | Objective fit |
|---|---|---|---|---|---|---|---|
| components-and-jsx | [React 19 Tutorial - 4 - Components](https://www.youtube.com/watch?v=zFdDdPMyIAo) (Codevolution) | 2025-11-02 | 7:18 (438 s) | 0:00-7:18 | 7.30 | S28, FT16 | o1 covered; o2 partial/none; o3 partial/none |
| props | [React 19 Tutorial - 9 - Props Patterns](https://www.youtube.com/watch?v=pQLXUT94Hcg) (Codevolution) | 2025-11-09 | 10:13 (613 s) | 0:00-10:13 | 10.22 | S28, FT16 | o1 covered; o2 covered; o3 partial/none |
| project-structure | [React 19 Tutorial - 3 - Project Structure](https://www.youtube.com/watch?v=j_D-KWQmZt4) (Codevolution) | 2025-11-02 | 7:14 (434 s) | 0:00-7:14 | 7.23 | S28, FT16 | o1 covered; o2 partial/none; o3 partial/none |
| conditional-display | [Stop Conditional Rendering in React Without Knowing This (&& vs Ternary Operator)](https://www.youtube.com/watch?v=Rr5AqASIyxw) (ByteGrad) | 2023-07-31 | 4:05 (245 s) | 0:00-4:05 | 4.08 | S28, FT16 | o1 partial/none; o2 covered; o3 partial/none |
| usestate | [React 19 Tutorial - 18 - useState Hook](https://www.youtube.com/watch?v=akZJe9Mx-Xc) (Codevolution) | 2025-11-24 | 10:49 (649 s) | 0:00-10:49 | 10.82 | S29, FT16 | o1 covered; o2 covered; o3 partial/none |
| updating-state-immutably | [React 19 Tutorial - 24 - useState with Objects](https://www.youtube.com/watch?v=MCIfZlQlmSc) (Codevolution) | 2025-12-01 | 9:28 (568 s) | 0:00-9:28 | 9.47 | S29, FT16 | o1 covered; o2 partial/none; o3 covered |
| rendering-lists-with-keys | [React 19 Tutorial - 12 - Lists and Keys](https://www.youtube.com/watch?v=y_J0-bUoACc) (Codevolution) | 2025-11-12 | 6:20 (380 s) | 0:00-6:20 | 6.33 | S29, FT16 | o1 partial/none; o2 partial/none |

## Module effects-routing-and-rendering

| Topic | Video (publisher) | Published | Full runtime | Assigned segment | Optional watch min | Days | Objective fit |
|---|---|---|---|---|---|---|---|
| loading-data-with-useeffect | [Full React Tutorial #17 - Fetching Data with useEffect](https://www.youtube.com/watch?v=qdCHEUaFhBk) (Net Ninja) | 2021-01-08 | 7:55 (475 s) | 0:00-7:55 | 7.92 | S30, FT17 | o1 covered; o2 partial/none; o3 partial/none |
| loading-and-error-states | [Full React Tutorial #19 - Handling Fetch Errors](https://www.youtube.com/watch?v=DTBta08fXGU) (Net Ninja) | 2021-01-11 | 7:39 (459 s) | 0:00-7:39 | 7.65 | S30, FT17 | o1 covered; o2 partial/none; o3 partial/none |
| custom-hooks | [Full React Tutorial #20 - Making a Custom Hook](https://www.youtube.com/watch?v=Jl4q2cccwf0) (Net Ninja) | 2021-01-12 | 8:49 (529 s) | 0:00-8:49 | 8.82 | S30, FT17 | o1 covered; o2 partial/none; o3 partial/none |
| routing-and-route-parameters | [React Router Tutorial - 11 - URL Params](https://www.youtube.com/watch?v=4W7z_iVSmKA) (Codevolution) | 2022-01-19 | 3:24 (204 s) | 0:00-3:24 | 3.40 | S31, FT17 | o1 partial/none; o2 covered; o3 partial/none |
| navigation | [React Router 6 Tutorial #3 - Redirects & useNavigate](https://www.youtube.com/watch?v=zCgruoRUxlk) (Net Ninja) | 2022-01-25 | 7:53 (473 s) | 0:00-7:53 | 7.88 | S31, FT17 | o1 partial/none; o2 covered |
| what-makes-a-component-re-render | [Intro to re-renders - Advanced React Course, Episode1](https://www.youtube.com/watch?v=qTDnwmMF5q8) (Developer Way) | 2023-11-13 | 7:06 (426 s) | 0:00-7:06 | 7.10 | S31, FT17 | o1 covered; o2 partial/none; o3 covered |
| lifting-state-up | none linked | | | | 0 (absent) | S31, FT17 | No verified video: the 2026-11-09 search found Codevolution's React 19 "Sharing State Between Components" at 12:16, over the 11-minute budget, and Ben Awad's "Lifting State Up React.js" (2018), which uses class components; see authoring/evidence/react/video-curation.md. |

## Module forms-context-and-crud

| Topic | Video (publisher) | Published | Full runtime | Assigned segment | Optional watch min | Days | Objective fit |
|---|---|---|---|---|---|---|---|
| controlled-forms | [Full React Tutorial #27 - Controlled Inputs (forms)](https://www.youtube.com/watch?v=IkMND33x0qQ) (Net Ninja) | 2021-01-19 | 9:27 (567 s) | 0:00-9:27 | 9.45 | S32, FT18 | o1 partial/none; o2 partial/none; o3 partial/none |
| accessible-forms | [How do forms, labels and inputs work in HTML?](https://www.youtube.com/watch?v=O14Wb3N4wDQ) (freeCodeCamp Concepts) | 2025-03-05 | 2:13 (133 s) | 0:43-1:42 | 0.98 | S32, FT18 | o1 covered; o2 partial/none; o3 partial/none |
| sharing-state-with-context | [React 19 Tutorial - 34 - Context and useContext Hook](https://www.youtube.com/watch?v=BdKykWVTPtU) (Codevolution) | 2025-12-15 | 8:18 (498 s) | 0:00-8:18 | 8.30 | S32, FT19 | o1 covered; o2 partial/none; o3 partial/none |
| create-edit-and-delete-against-the-api | [Fetch API in 4 Minutes (GET, POST, PUT, DELETE / JSON)](https://www.youtube.com/watch?v=XHokFQeQ6Lk) (ByteGrad) | 2022-07-05 | 4:59 (299 s) | 3:53-4:59 | 1.10 | S33, FT18 | o1 covered; o2 partial/none; o3 partial/none |
| handling-submission-errors-in-forms | none linked | | | | 0 (absent) | S33, FT18 | No verified video: the 2026-11-09 search found only React Hook Form, Next.js and error-boundary tutorials, which teach libraries or features this course does not use, and none shows server field errors next to plain controlled inputs; see authoring/evidence/react/video-curation.md. |
| ui-tests-with-testing-library-querying-by-role-and-label | [React Testing Tutorial - 18 - getByRole](https://www.youtube.com/watch?v=Veaql3noyyo) (Codevolution) | 2022-08-29 | 10:02 (602 s) | 0:00-10:02 | 10.03 | S33, FT20 | o1 partial/none; o2 partial/none; o3 partial/none |

## Module auth-and-review

| Topic | Video (publisher) | Published | Full runtime | Assigned segment | Optional watch min | Days | Objective fit |
|---|---|---|---|---|---|---|---|
| login-with-a-session-cookie-or-jwt | [Session Vs JWT: The Differences You May Not Know!](https://www.youtube.com/watch?v=fyTxwIa-1U0) (ByteByteGo) | 2024-07-23 | 6:59 (419 s) | 0:00-6:59 | 6.98 | S34, FT19 | o1 partial/none; o2 partial/none; o3 partial/none |
| protected-pages-and-role-based-screens | [React Router in Depth #11 - Navigate Component](https://www.youtube.com/watch?v=JNWSMJshmOQ) (Net Ninja) | 2023-01-05 | 5:42 (342 s) | 0:00-5:42 | 5.70 | S34, FT19 | o1 partial/none; o2 partial/none; o3 partial/none |
| handling-401-and-403-redirect-and-sign-out | none linked | | | | 0 (absent) | S34, FT19 | No verified video: the 2026-11-09 search found no short public video that applies 401 versus 403 to client-side sign-out and redirect; the only status-code candidate was a Spring Security JWT configuration video for the back end; see authoring/evidence/react/video-curation.md. |
| turning-off-the-dev-profile | none linked | | | | 0 (absent) | S34, FT19 | No verified video: this topic's dev profile belongs to the course's own back end, and the 2026-11-09 search for Spring profile videos found none within the 10-minute budget; see authoring/evidence/react/video-curation.md. |
| javascript-fundamentals-review | none linked | | | | 0 (absent) | S35, FT20 | Not linked: a mixed review topic; its objectives repeat topics whose videos are already linked in html-css-js javascript-fundamentals, dom-tooling-and-async and fetch-and-browser-client, so a further video would duplicate them; see authoring/evidence/react/video-curation.md. |
| react-review | none linked | | | | 0 (absent) | S35, FT20 | No verified video: the only whole-course candidate, Code Bootcamp's "Every React Concept Explained in 12 Minutes", has embedding disabled (oEmbed HTTP 401 on 2026-11-09), and the topic videos already linked in this course cover its parts; see authoring/evidence/react/video-curation.md. |

## Optional watch minutes

All figures are unrounded sums of assigned segments, in minutes. They are optional supplemental time and are reported separately from the required learner path; they are not added to any topic budget, day template or track length.

- Course react: 20 topics link 20 distinct videos, 140.77 unique optional watch minutes (reused videos and overlapping segments counted once).
- Standard track, this course: 20 topics, 140.77 unique optional minutes.
- Fast track, this course: 20 topics, 140.77 unique optional minutes.
- Both tracks teach the same canonical topic pages (every topic in this course is scheduled on a Standard S day and a Fast FT day), so the Standard and Fast figures above are the same content and must not be added together.
- For a whole-track view across html-css-js and react together: Standard 285.77 and Fast 285.77 unique optional minutes, from 43 distinct videos; two videos are linked from both courses with overlapping segments, so this is less than the sum of the two course figures.

### Required learner-path timing, kept separate

- The required topic pages carry 295 budgeted minutes over 26 topics (sum of `minutes.budget`). Practice, coding labs, the project brief and assessment time are scheduled in the day templates (see `authoring/evidence/react/intake.md`) and are not timed by these figures; that overhead is unmeasured here, not zero.
- Fast Track keeps its fixed six weeks including AWS; optional videos add no Fast day and are not placed in a Fast block (the Fast day template has no video block).
- Standard Track length (43 days versus 40 days) is an open decision outside this record; these optional minutes do not resolve or change it.

### Standard Concept-day Short video block (informational)

The Standard Concept template has an 8-minute Short video block; the Lab, Practice and Project templates have no topic-video block, so optional videos on those days are always self-paced. Linked optional minutes per Standard day. The intake allocates topic videos to that block only when they fit; these companions are instead unscheduled optional links, so the last column only shows which subset could fill the block if the platform schedules one:

| Day | Day type | Topics with a video | Optional minutes | Fits a Short video block? | Largest set within 8 minutes (Concept days) |
|---|---|---|---|---|---|
| S28 | Concept | 4 | 28.83 | no: over 8 minutes, self-paced outside the block | components-and-jsx (7.30) |
| S29 | Concept | 3 | 26.62 | no: over 8 minutes, self-paced outside the block | rendering-lists-with-keys (6.33) |
| S30 | Concept | 3 | 24.38 | no: over 8 minutes, self-paced outside the block | loading-data-with-useeffect (7.92) |
| S31 | Lab | 3 | 18.38 | no block on this day type: self-paced |  |
| S32 | Lab | 3 | 18.73 | no block on this day type: self-paced |  |
| S33 | Project | 2 | 11.13 | no block on this day type: self-paced |  |
| S34 | Lab | 2 | 12.68 | no block on this day type: self-paced |  |

## Reused videos

- How do forms, labels and inputs work in HTML? (freeCodeCamp Concepts) is linked from `react/forms-context-and-crud/accessible-forms` (0:43-1:42) and from `html-css-js/html-and-css/forms-and-html5-validation` (0:00-2:13); the overlap is counted once in every union above.
- Fetch API in 4 Minutes (GET, POST, PUT, DELETE | JSON) (ByteGrad) is linked from `react/forms-context-and-crud/create-edit-and-delete-against-the-api` (3:53-4:59) and from `html-css-js/fetch-and-browser-client/calling-your-spring-boot-api-from-the-browser` (0:00-4:59); the overlap is counted once in every union above.

See `authoring/evidence/html-css-js/video-curation.md` for the companion record.

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
