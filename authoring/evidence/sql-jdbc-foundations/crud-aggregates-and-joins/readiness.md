# Readiness receipt: crud-aggregates-and-joins (eight-page author checkpoint)

Author checkpoint only. No critic or reconciliation evidence is authored here.

## 1. Inventory

| Topic | artifact.html sha256 | State |
| --- | --- | --- |
| insert-update-and-delete | `42d701202d388f731f70b21572ece6c0330efcd289c6e543d5da6485ed6fc413` | present; preserved byte-identically |
| seeding-sample-data | `4b7b6dc9d9992e307ca77b464042be29e6ea3a4a3c924ee44833e90994bcfeff` | present; preserved byte-identically |
| filtering-and-sorting | `a515725a3c5fa719b9bcde3e044268d02f8125b2aceca70bed7a586b21a8d1ad` | present; author smoke passed |
| handling-nulls-coalesce-and-case | `92fb317a8e2b7dbede1b22945dab2358e4002646b0a319cdb6542d9b51665e34` | present; author smoke passed |
| aggregate-functions | `fbd69cb3ab20db4ceeea457b1d02d5c6b6eda6cf103eb43018d40d18e6272f41` | present; author smoke passed |
| group-by-and-having | `60330a4d7f92267f2426be3d0cd396048cdd799d769a8f7851ed7fe098d9c164` | present; author smoke passed |
| inner-and-left-joins | `743797822ef1e055a2044dba4f00bca4babdc47e416f45ede8115dbed6f0a5e8` | present; author smoke passed |
| anti-joins-and-self-joins | `d41de3b5154f790f7b96dd831163688b36185ca5b1a6fde906607de7cc51fbae` | present; author smoke passed |

The eight catalog topics and their objectives were verified against `authoring/catalog/sql-jdbc-foundations/crud-aggregates-and-joins/module.json` and each authoritative `topic.json`. HTML is the first deliverable; companion absences remain explicit in the manifests.

## 2. Template and engine

The page shell follows root `DESIGN.md` and the frozen guidance-contract lineage at candidate `885207e034695aaf109ef0afe61fb1de50af9468`. Across all eight pages, the complete style block and the embedded lesson-editor shell, bounded SQL adapter, and state/navigation controller are byte-identical. Each page retains the canonical fragment stamps:

- `shell.js` sha256 `8464aa8cd0f62e9d3306c497486159bf5dc0efd5e625947f0bd245b5c7134ef9`
- `sql-practice-adapter.js` sha256 `a47cbd40c8dd09f8d133665bb7d1fb01391d16359d643747d331d51f5829ed83`
- `sql-practice-controller.js` sha256 `2ac600a4b22b5828f64473ba3f810f35ca5fc70e67ab9dd7ea188da2925fbcfb`

Only learner body content and the page-owned `TOPIC` data/check block vary. The original two artifacts remain at their checkpoint hashes.

## 3. Source and simulator fidelity

Each new page has a `sources.json` receipt for live HTTP 200 retrievals on 2026-10-16 from current official PostgreSQL documentation. Claims map to the recorded sections for WHERE/ORDER BY, NULL/COALESCE/CASE, aggregates, GROUP BY/HAVING, joins, EXISTS and NOT IN.

The unchanged bounded adapter was previously differentially checked against PostgreSQL 18. The six new pages additionally ran their twelve intended success states through that adapter: filtering, NULL expressions, five aggregates, grouped/HAVING results, inner/left joins, a left anti-join, and a self-join all produced the expected rows. Unsupported syntax remains a visible lesson limit rather than a claim that PostgreSQL rejects it.

## 4. Direct artifact proof

Scripted Chromium loaded every new artifact from `file://` with no external requests, page errors or console errors. For each of the six new pages, direct success routes covered prediction plus confidence, both editor tasks and local criteria, apply plus confidence, whole-page completion, Previous/forward state preservation, and current-only Restart preserving earlier work. Wrong/retry and settled behavior is unchanged shared controller code already covered at the preserved checkpoint.

All eight pages passed direct 320, 390, 768 and desktop overflow checks, touch Restart, visible 44 px targets, keyboard focus, and 200% CSS zoom without horizontal overflow. The six new pages also passed light, dark and forced-colors rendering; no-JavaScript reading with all four activities and two editor alternatives visible; and print with all activities visible in the light palette. The preserved pages retain their prior direct no-JS, print, navigation, state and behavior proof.

## 5. Answer safety and bounded practice

A whole-document scan found no complete SQL statement that solves any of the twelve new editor tasks and no private key, credential, reference-solution, hidden-test or answer-key marker. Complete editor answers existed only in uncommitted scratch used for direct proof. Learner pages contain starters, visible success criteria, expected result descriptions, progressive activity-owned hints, and formative MCQ explanations. Checks grade resulting state rather than exact keystrokes.

Every page is standalone, offline and dependency-free. Each coding workspace names its supported subset, starts from fixed public sample rows, resets on every run, and reports unsupported work honestly. No learner input, state or result leaves the page.

## 6. Hard blockers and handoff

The eight-page author checkpoint has no reproduced hard artifact blocker. Delivery still requires fresh independent batched education and SQL/JDBC-SME reviews over these exact bytes, non-author reconciliation, and any required recheck after accepted corrections. T25 remains expected to fail until that independent evidence exists; no critic or reconciliation record is authored in this checkpoint.
