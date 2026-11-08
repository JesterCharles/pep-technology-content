# lesson-editor, version 3

This is the authoring-time source for the embedded code editor. It has two parts:

- a language-neutral **shell**;
- one **adapter** per language.

The Python syntax pilot uses the bounded Python adapter. The functions, exceptions/logging, script-files and pytest topics use the bounded scaffold adapter for lesson-specific code-production tasks, and slicing and comprehensions uses the bounded comprehension adapter. That adapter removes comments and string bodies, rejects placeholders and malformed delimiters/indentation, and matches each completed file against its fixed lesson shape and nesting; it is not a general Python parser. Java, HTML/CSS/JS and SQL pages can copy the shell unchanged and add their own adapter.

This is not a platform or a shared runtime. Every learner page inlines its own stamped copy, so the page stays standalone (T20): it has no sibling file, font, asset or network request.

## Files

| File | Role |
| --- | --- |
| `contract.json` | Component id and version, plus the reviewed sha256 of every fragment |
| `editor-shell.css` | Shell chrome: file tab, gutter, Run/Reset, Problems and Output tabs, status bar, limits list, focus, reduced motion |
| `editor-shell.js` | `LESSON_EDITOR.mount(root, cfg)`: the keyboard model, Run and Reset, the panels, live announcements, and the loading and error states |
| `markup.mjs` | `editorHtml({...})`: the fieldset markup, with its stamp, on-page limits and `noscript` fallback |
| `python-adapter.js` | `LESSON_EDITOR_PYTHON`: Python diagnostics and the bounded Run |
| `scaffold-adapter.js` | `LESSON_EDITOR_SCAFFOLD`: bounded structural validation of the four supplied lesson scaffolds; never arbitrary Python execution |
| `comprehension-adapter.js` | `LESSON_EDITOR_COMPREHENSION`: bounded evaluation of typed list, set and dict comprehensions over the slicing exercise's `prices` |
| `fixtures.mjs` | Starters, plus the loaders for the private scaffold and comprehension fixtures (no completed answer is committed) |
| `stamp.mjs` | Wraps fragments in stamped markers (`block`) and verifies pages (`verifyPage`) |
| `rehash.mjs` | Records new fragment hashes in `contract.json` after a reviewed change |
| `drift.test.mjs` | Checks that every inlined copy in any learner page matches the source hash and version |
| `import-proof.mjs` | Evolv-like import proof; writes a receipt per page |
| `module-regressions.test.mjs` | Module regressions: no completed answer in learner source, DESIGN.md anatomy, teach-before-apply order, typed slicing production, venv requirements state and exact pytest execution |
| `comprehension-differential.mjs`, `comprehension-oracle.py` | Comprehension adapter checked against real CPython |
| `differential.mjs`, `cpython-oracle.py`, `load.mjs` | Python adapter checked against real CPython |

## Shell contract (`lesson-editor@3`)

`LESSON_EDITOR.mount(root, cfg)` takes these `cfg` fields:

| Field | Meaning |
| --- | --- |
| `adapter` | The language adapter |
| `file` | The file name shown on the tab |
| `starter` | The starting code, restored by Reset code |
| `initial` | The code to show on mount; defaults to `starter` |
| `calls` | The adapter's lesson checks, passed to `run` unchanged |
| `fallbackText` | Text shown in the error state |
| `onChange(code)` | Called on every edit |
| `onRun(report, code)` | Called after every Run |

It returns `{ set(code), run(), value() }`.

An adapter object provides these members:

- `id`, `version` and `language` (the shown name).
- `kindLabels`: `{ error, limit, hint }`.
- `check(src)` returns `{ problems: [{ line, col, kind, msg }], program }`.
  - `kind: "error"` is reserved for code the real language certainly rejects.
  - `"limit"` marks code the simulator cannot handle.
  - `"hint"` is advice and does not block Run.
- `notRun(problems)` returns `{ status: "syntax" | "limit", lines, summary }`.
- `run(program, calls)` returns `{ status: "pass" | "mismatch" | "runtime" | "stopped", lines, results, summary }`.

The shell owns everything a learner touches:

- **Run**:
  - the Run button, by mouse, or by Enter or Space on the button;
  - Ctrl+Enter or Cmd+Enter in the code.
- **Editing keys**:
  - Tab inserts four spaces and Shift+Tab outdents.
  - Escape, then Tab, leaves the code area, so there is no keyboard trap.
- **Panels**: Problems and Output are an ARIA tablist (arrow keys, Home, End).
  - Each problem is a button that moves the caret to its line.
  - A polite live region in the status bar shows and announces each Run's summary; typing is never announced.
- **States**:
  - **Loading**: the markup ships with `data-le-state="loading"` and "Loading the editor..." placeholders.
  - **Ready**: `ready` after mount.
  - **Error**: `error` if the adapter throws. Output then says so and repeats the exercise, and nothing is run.
- **No-JS fallback**: each editor page exposes an initial-route `noscript` block with the static exercise and expected results while script-controlled editor chrome remains hidden. An editor on a later, hidden step carries no second in-fieldset copy (`markup.mjs` emits one only when `fallback` is passed).
- **Reduced motion**: there are no animations; a `prefers-reduced-motion` rule guards any future additions.

### Scaffold validator (`python-scaffold@3`)

The scaffold validator accepts only the fixed line order, indentation and nesting of the four supplied exercises. It lexes just enough to remove comments and string bodies and to reject unclosed strings, unbalanced delimiters, tabs, non-four-space indentation and unreplaced `___` placeholders. Each exercise then checks its expected top-level definitions and the required statements in their intended function, handler, guard or test block. Required spellings in comments, inert strings or the wrong block do not count. In the script-files exercise, the missing-argument guard must print exactly one string literal to `sys.stderr` and return a non-zero status. The literal must be one usage line in a closed grammar: `Usage` in any letter case, a colon, the interpreter `python`, `python3` or `py`, then `summary.py` and `SESSION` or `<SESSION>`, separated by spaces, with optional spaces around the colon and at either end and no other words. The scanner keeps each literal's prefix and the line must be a text string (no prefix, or `r`, `u`, `f`, `rf` or `fr`): bytes literals (`b`, `br`, `rb`), which are valid Python but print `b'...'`, and invalid combinations such as `bf` do not count. The task text, Problems hint and static alternatives state these forms. Any other message, such as `"aa"`, a bare `"usage"`, `"error: missing SESSION argument"`, extra prose or a different script or argument name, is still valid Python and is reported only as an incomplete *Lesson check*. It never executes learner code.

The import proof reaches each editor by replaying the topic's own `qa-paths.json` success route, confirms the editor is the last activity before the apply check, then runs four public negatives built only from the page's starter (as given, empty, blanks deleted and commented out), each of which must leave the editor's `data-pep-completed`/`data-pep-credit`/`data-pep-grade` hooks at `false`/`0`/`0`. The four completed scaffolds are answer-sensitive and never committed: the remaining checks read them from an authorized uncommitted JSON file outside the repository named by `PEP_PRIVATE_SCAFFOLD_FIXTURES` (`{ "fned": ..., "exed": ..., "sced": ..., "pted": ... }`) and are skipped, with a reason, without it. With it, the proof runs six negative paths derived at run time from the private file by value-free structural mutations—comment-only, string-only, misplaced constructs (for exceptions, the `except` and `else` bodies swapped), placeholders, syntax (a block header's colon dropped) and indentation, plus, for script files, an empty, meaningless, prose, extra-prose, wrong-script and wrong-argument usage line, `b`, `br`, `rb` and `bf` prefixed usage lines, a usage line on stdout and a zero exit status—then the completed scaffold, checking single credit, the `true`/`1`/`1` activity hooks and Restart activity, and, because the public QA routes stop at this private editor, that a pass counts only while the live code still passes (an edit, **Reset code** or a failed rerun after a real pass reopens the author check, restores `false`/`0`/`0`, withdraws Continue and the activity credit, and a genuine re-pass restores exactly one credit, also over repeated cycles), and that two apply misses after a real pass settle without credit and leave the page incomplete; for script files it also checks that each other documented usage-line form earns credit, before issuing its receipt. The four scaffold pages declare `data-pep-answer-sensitive="python-scaffold"` on the adapter root and carry their fragment digests in head `<meta>` stamps, like the slicing page.

### Comprehension adapter (`python-comprehension@1`)

It reads only `prices = [4, 12, 12, 30]`, a `result` list comprehension in square brackets and a `doubled` set or dict (`key: value`) comprehension in curly braces, each with one `for` part over `prices` and at most one `if` comparison, where values and the condition use the loop name, whole numbers, `+ - * // %`, parentheses and one comparison. Everything else (other names, `/`, `**`, strings, chained or boolean conditions, finished-value lists) is a *Lesson check*. *Error* is reserved for patterns CPython certainly rejects: `key: value` inside square brackets, unbalanced brackets, `=` in a filter, leading zeros and an unexpected indent. Run evaluates both comprehensions exactly (floor division and modulo follow Python, `ZeroDivisionError: division by zero` is reported), shows list and dict values as Python prints them and a set's members in ascending order with a note, and reports `matches` or the expected value. `comprehension-differential.mjs` compares it with CPython: on 2026-10-15, seeds 1 to 5 of 4,000 generated files each (19,998 distinct files: 4,424 certain syntax errors, 12,847 lesson limits, 2,273 completed runs and 454 runtime errors) gave 0 mismatches; the same counts and 0 mismatches were reproduced on 2026-10-16 after its two filter and for-part messages were reworded so no message shows a comprehension shape.

The slicing activity is answer-sensitive. Its completed comprehensions are never committed: not in the page, its Markdown, its QA paths, `fixtures.mjs`, the import proof or the regressions. Positive checks read them from an authorized uncommitted JSON file outside the repository named by `PEP_PRIVATE_COMPREHENSION_FIXTURES` (`{ "cpedSet": ..., "cpedDict": ... }`) and are skipped, with a reason, without it. Because the answer scanner treats any digest inside a script that names the answer targets as a possible encoded answer, the slicing page stamps its fragments with `head` markers and carries their digests in `<meta name="lesson-editor-source">` and `<meta name="lesson-editor-fragment">` head tags; `stamp.mjs` verifies both forms.

### Evolv compatibility

The shell reuses the non-form mechanics of `components/terminal` (the Linux Evolv terminal repair):

- There is no `form` and no submit.
- Run and Enter dispatch through explicit `click` and `keydown` handlers.
- All controls are `type="button"`.
- There is no storage, no network and no sibling script.

As a result the page works in `sandbox="allow-scripts"` without `allow-forms` or `allow-same-origin`.

A host page that restores the editor's DOM, as this course's Restart activity does, must mount again on the new root element. Each editor-bearing topic's `TOPIC.render` does this.

## Stamping and drift

Each inlined fragment is wrapped in stamped markers:

```
/* lesson-editor@3 <fragment> sha256:<hex> */
...exact source bytes...
/* /lesson-editor <fragment> */
```

The root element carries three stamp attributes:

- `data-lesson-editor="3"`;
- `data-lesson-editor-adapter="python@1"`;
- `data-lesson-editor-source="sha256:<hex>"`, the sha256 of the lines `<fragment> <sha256>\n` for `shell.css`, `shell.js` and the adapter.

`drift.test.mjs` fails in each of these cases:

- `contract.json` is stale;
- a page's inlined bytes differ from their stamp, the source or the contract;
- versions disagree;
- a fragment is missing or duplicated.

The markup comes from `markup.mjs` per page and is not hashed. The import proof exercises it in a browser instead.

## Import proof and statuses

`import-proof.mjs` runs these steps:

1. Copies each editor-bearing `artifact.html` byte-for-byte, alone, into an empty temporary directory.
2. Checks the copy's sha256 and the stamps.
3. Loads the copy in headless Chromium with every request except the page blocked, twice:
   - directly;
   - inside an `allow-scripts`-only iframe.
4. Exercises these interactions:
   - mouse Run;
   - keyboard Run (Ctrl+Enter, and Enter on the button);
   - Tab and Shift+Tab indenting, and Escape then Tab;
   - focus order Run → Reset code → Problems tab, and arrow keys across the tabs;
   - the Problems jump-to-line;
   - Output and live-region updates;
   - Reset code and Restart activity state;
   - the loop limit.
5. Requires zero blocked requests and zero script errors.
6. Writes `authoring/evidence/<course>/<module>/<topic>/lesson-editor-import.json` with page bytes, page sha256, component stamps, browser version and every check.

Two harness notes (Playwright behaviour, not page behaviour):

- The sandbox host frame is 640px tall inside a 900px viewport, because pointer events were lost with a frame nearly as tall as the viewport.
- Clicks scroll their target into view first.

There are two separate statuses:

- **merge-ready**: the repository gates pass (`npm test`, `npm run check`, apart from the critic gate T25 before critics), and so do `drift.test.mjs` and the differential test.
- **Evolv-ready**: `import-proof.mjs` passes and the receipt's `pageSha256` equals the committed page.

## Python adapter (`python@1`): limits

The adapter is a **lesson simulator**, not a Python interpreter. The page says so in the tab badge, in the Output header and in the status bar, and lists these limits under "What this simulator can and cannot do":

- **Subset**: it reads only the following and nothing else:
  - `def` (defaults allowed; annotations are ignored);
  - `=` and augmented assignment;
  - `while`, `if`/`elif`/`else`, `return`, `pass`, `break` and `continue`;
  - calls with positional arguments;
  - `+ - * / // % **`, comparisons, `and`/`or`/`not`, and `is` with `None` or booleans;
  - int, float, str, bool and `None`;
  - `print`, `str`, `int`, `float` and `abs`.
- **Not supported**: `for`, lists, dicts, tuples, indexing, methods, keyword arguments, f-strings, imports, classes, exceptions, one-line blocks and tab indentation.
  - Each is reported as a simulator limit, never as invalid Python.
  - Python builtins outside the subset (for example `range` or `len`) are reported as limits, not as `NameError`.
- **Errors**: `Error` is used only for patterns CPython certainly rejects:
  - braces as blocks and a missing `:`;
  - `else if`;
  - `++` or `--` as a statement;
  - type declarations and typed parameters;
  - `&&`, `||` and `!`;
  - `return`, `break` or `continue` in the wrong place;
  - unterminated strings and leading-zero integers;
  - indentation errors.
  The messages are lesson wording, not CPython's exact text. A file with any `Error` is not run, matching Python's compile-before-run rule.
- **Semantics kept**:
  - `/` always gives a float, and `//` and `%` floor toward negative infinity;
  - int and float `repr`;
  - truthiness, local scope and `UnboundLocalError`;
  - the `TypeError`, `NameError`, `ZeroDivisionError` and `ValueError` messages of CPython 3.14 for the supported operations.
- **Limits**: 20,000 evaluation steps, 60 nested calls (real Python allows about 1000) and 200 output lines per run.
  - A run that reaches a limit stops and names the limit; it never pretends to be a Python error.
  - `is` between numbers or strings is refused, because its result depends on CPython's object caching.
- **Other limits**:
  - Whole numbers beyond 2^53 and complex results are refused.
  - Float formatting matches CPython for the values this exercise produces. It is not proven for every float.

Differential test: on 2026-10-14, `differential.mjs` was run against CPython 3.14.6 at mutation rates 4, 12 and 30. Across 3,312 distinct variants it checked that:

- every `Error` verdict fails CPython's `compile()`;
- every clean verdict compiles;
- every completed run prints the same output, returns the same `repr` values and raises the same exception type and message as CPython.

It found 0 mismatches.

## Commands

```
node authoring/evidence/python/python-fundamentals/lesson-editor/rehash.mjs          # after a reviewed source change
node --test authoring/evidence/python/python-fundamentals/lesson-editor/drift.test.mjs
node authoring/evidence/python/python-fundamentals/lesson-editor/differential.mjs 4000 12
node authoring/evidence/python/python-fundamentals/lesson-editor/comprehension-differential.mjs 4000 1
node authoring/evidence/python/python-fundamentals/lesson-editor/import-proof.mjs     # writes the receipts
PEP_PYTEST_PYTHON=/path/to/venv/bin/python node --test authoring/evidence/python/python-fundamentals/lesson-editor/module-regressions.test.mjs
```

## Reuse for another language

1. Copy `editor-shell.css`, `editor-shell.js` and `markup.mjs` unchanged.
2. Write `<language>-adapter.js` to the adapter contract.
3. Add the adapter to `contract.json` with `adapterId` and `adapterVersion`, then run `rehash.mjs`.
4. Inline `block("shell.css")`, `block("shell.js")` and `block("<adapter>")` into the page.
5. Mount from the page's render hook.
6. Add a differential test against the real toolchain, and an import-proof scenario for the new exercise.
