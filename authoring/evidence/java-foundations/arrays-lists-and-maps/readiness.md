# Readiness receipt: java-foundations/arrays-lists-and-maps (author checkpoint)

Author checkpoint, 2026-10-16. This is the author's own receipt, not critic or reconciliation evidence.
Independent education and Java-SME review of all four pages is still required before any PR.

Template source: root `DESIGN.md` and the shared guidance candidate `885207e034695aaf109ef0afe61fb1de50af9468` (PR 43). That candidate is not merged into this branch, and this branch changes no shared tooling.

## Pages and shared bytes

| Topic | `artifact.html` sha256 |
| --- | --- |
| declaring-and-looping-over-arrays | `8fa3facd3ec482af7251970288ec928b8757a47e4b611ef54321739c6ef514af` |
| linear-and-binary-search | `c7643ae0a8f241d990880257c360a2a9cc42bf892647fa4efc796f2f208e0d57` |
| arraylist-basics | `f8154c6311a959916e9a9091d7f2fc5dec9acc413305b715b6410e3aad4e39c4` |
| hashmap-basics | `a3ed63d5ef83c052d8e4c64b55ca9dd4d1a08b6bddf7efbf829623f89361abf4` |

Each page embeds the same three engine files, byte for byte, between `alm-engine@1` markers. Their hashes are also in the page's `alm-engine` meta tags:

- `engine.css` `5e5248ee7c2c88ff39df4f38dada8f569772a1e402a04236373ec10c2263ec44`: the DESIGN token block and the anatomy/editor recipes.
- `jmini.js` `eb082a98e7df79fda284eacaa6c6ca3ec1178f0f46dd7237b0194faba872b1d1`: the bounded Java-subset interpreter.
- `engine.js` `1ddc755c60fe93ce71c5196721d18b72857d52b3821dbf11210f124e924f0b44`: state, navigation, Restart, predict/apply, the editor shell, Objectives and print.

`page-build/build.mjs` builds the pages from `page-build/src/*` and the catalog. `build.mjs --check` exits 0, so committed pages equal a fresh build.
Each page's own bytes are its body and its `TOPIC` data: teaching, examples, checks, feedback, hints and its activity handlers.

## 1. Objectives and sources

| Topic | Objective, and the activity that serves it |
| --- | --- |
| declaring-and-looping-over-arrays | o1: A1 (predict default values) and A2 (index read/write). o2: A3 (teaching plus Where this fits) and A4 (choose the loop). o3: A2 (the out-of-bounds exception) and A3 (reverse in place). |
| linear-and-binary-search | o1: A2 (write `indexOf`). o2: A3 (binary search tracer). o3: A1 (predict ~10 checks for 1,000) and A4 (sorted input and log growth). |
| arraylist-basics | o1: A2 (list explorer) and A3 (write the operations). o3: A1 (`remove(int)`) and A3 (fix `List<int>`). o2: A4 (array or ArrayList, plus Where this fits). |
| hashmap-basics | o1: A1 (predict put/get) and A2 (map explorer). o2: A2 (`containsKey`/`getOrDefault`) and A4 (missing key without a null surprise). o3: A3 (write `countWords`). |

- Objective text equals the catalog `topic.json` text. No syllabus was invented, and no topic outside this module was edited.
- Sources were fetched live on 2026-10-16, and all 19 returned HTTP 200. Each topic's `sources.json` lists them and binds the current artifact bytes.
- The decisive claims were matched to live source text: `Arrays.binarySearch` "results are undefined" on unsorted input; `HashMap` "no guarantees as to the order"; `Map.get` returns null with no mapping; `getOrDefault` returns the default; JLS 5.1.8 unboxing null throws NullPointerException; JLS 4.5.1 type arguments are reference types; `List.remove` shifts later elements left; JLS 15.17.2 integer division rounds toward 0.
- **Unverified (listed in each `topic.json`):** the Java-SME critic has not re-verified these claims yet.
- **Unverified (listed in each `topic.json`):** every example was run on OpenJDK 17.0.12, not on JDK 25. The behaviours cited are specified the same way in the SE 25 sources.

## 2. Page anatomy and design

- Each page has one topic bar holding the h1, the progress text and segments, the native Objectives disclosure (`data-pep-objectives`) and Restart. Below it are two regions, reading/instructions and workspace (5fr/7fr at 960 px and wider, stacked below that).
- Each activity has a **Your task** block and its own `data-pep-activity-checks`.
- One code-free optional anecdote per page. One **Where this fits** per page, placed only where a real choice exists: index loop vs enhanced for; linear vs binary search; array vs ArrayList; map vs list.
- Progressive nested hints sit inside each `data-pep-may-stall` task (1 to 3 hints).
- The `data-pep-responsive data-pep-guidance-contract` markers are present.
- Colors come only from the DESIGN tokens. No fonts are loaded, and there are no shadows except the editor focus ring.

## 3. Activities and answer safety

- Each page has predict → teach and explore → teach and type code → apply, giving two genuine manipulations per page (an explorer and the typed editor).
- The apply step asks for confidence first, allows one retry in a new form, then reveals and locks. Every option is explained.
- Code tasks use the bounded `jmini` editor, which works like this:
  - It checks only the results on visible example inputs, and every expected result is shown to the learner.
  - Anything outside its subset is reported as a "Lesson check".
  - "Error" appears only where javac certainly rejects the code, for example `List<int>`: the JDK 17 javac reports "unexpected type, required: reference".
  - A run stops after 20000 steps.
  - Exception text is the JDK's real first line. Where the JVM's detail message varies by version, the explanation is shown as a separate "Simulator note".
- `page-build/jmini-differential.mjs` compares jmini with a real JDK on 10 programs, covering HashMap print order, `remove(int)` vs `remove(Object)`, AIOOBE/IOOBE messages, NPE on unboxing, CME, integer overflow and division. Result: 0 differences.
- The private-answer scan of every whole document found no completed reverse swap, linear-search body, word-count update or Scores sequence. Its scope was HTML, attributes, noscript, static alternatives and script literals.
- One answer leak was found and removed during authoring: a hashmap apply-retry option had reproduced the A3 counting line.
- Hints give reasoning steps, not finished expressions. Whether they are semantically answer-safe is for the independent reviewers to judge.
- No keys, hidden tests, rubrics, solutions, private inputs or credentials are committed. The routes used to prove completion lived only in the session scratchpad.

## 4. State, navigation and Restart

The engine keeps these as separate values: the current activity, a monotonic `unlockedThrough`, and for each activity its attempts, settled state, completion, credit, grade and Continue state. All of them are exposed through the stable `data-pep-*` hooks.

- Previous and Next sit beside each other. Completed and current timeline links and back links push `#activity-N`.
- Popstate and hashchange restore the activity without moving focus.
- Locked links and deep links past the frontier are ignored.
- Restart restores only the current activity's authored controls, starter code and explorer model. The frontier, page completion and other activities are kept.
- Code checks reflect one whole run, so checks passed by different code in separate runs cannot add up.

Smoke on 2026-10-16 (Playwright with system Chrome, scratch scripts) covered:

- The full route on every page, including a wrong first try.
- Previous then Next keeping the editor code.
- Restart on a completed activity, which cleared only its credit.
- Completion reaching `data-pep-complete="true"`.

## 5. Accessibility, responsive, offline and print

Smoked on all four pages, 2026-10-16:

- Zero console errors.
- No request other than the page itself; every other request was blocked.
- No page-level horizontal overflow at 1366×900, 320×568, 390×844 (dark), 768×1024 (light) or 844×390 (dark, touch). At 320 px this held for every activity.
- With JavaScript off, all 4 activities are visible and each code workspace shows its `noscript[data-pep-no-js]` static exercise.
- Print emulation shows all 4 activities. `beforeprint` opens every disclosure, and `afterprint` restores the exact prior closed set.
- Each page is about 138 KB, under the 512 KB cap.

**Not proven at this checkpoint:**

- Keyboard-only traversal, 200% zoom, forced colors, axe, contrast under color-vision transforms, and the touch-target sweep.
- The candidate harness's full navigation/Restart matrix in the sandbox.

These are left to the Codex module QA pass, per the firstmate instruction of 2026-10-16.

## 6. Timing, companions and evidence

- Frozen estimator P50: 8.84, 8.88, 8.46 and 8.51 minutes. Modeled worst path is P50 plus 3.0 minutes (basis in each `topic.json`).
- About-label and budget are 12 minutes per topic. T14 passes, including the F8 day total.
- Companions are not created, by firstmate instruction: `artifact.md`, `artifact.gift` and `video-artifact.md` are recorded absent with reasons. There are no PDFs (not applicable) and no labs (none planned).
- The module lock is regenerated with `pep lock`.
- Cheap gates T01–T05, T07, T08, T14, T15, T19 and T20 pass for this module.

## Hard blockers before a green module PR

1. **T18 requires `artifact.md` for an HTML topic.** It is deferred, and the module QA pass derives it with `authoring/tools/qa/md-from-html.mjs`.
2. **`qa-paths.json` (T09–T13) is not authored yet.** Under the candidate contract it also needs the `guidance` object. Main's `qa-paths.schema.json` rejects that key, so a green CI with `data-pep-guidance-contract` depends on PR 43 merging first.
3. **T25 needs independent education and Java-SME critic coverage, plus reconciliation, for all four pages.** None is authored here, by rule.
