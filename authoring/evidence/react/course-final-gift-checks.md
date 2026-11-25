# React course-final MCQ: integration record

Bank: `react/assessments/react-course-final/final-mcq.gift`, byte-identical to the private candidate
`react-course-final-30.gift` (sha256 2746e65395233e1dbcf183251da28bc86b14d417a8055b61759adea98edb168e),
source `FROZEN_DELIVERY/candidates-unvalidated/course-finals/react/` of the 2026-11-19 handoff. Captain decision:
answer-bearing course-final banks may be committed (precedent `html-css-js/assessments/web-client-mcq/final-mcq.gift`).

Honest status from the candidate's handoff report (its critic JSON and run logs were not in the handoff and are not
committed here; they are not re-verified in this repository):
- 30 single-answer items, easy 8 / medium 12 / hard 10; the 30-minute length is a sizing estimate (about 78 words per
  item), never a learner-timed measurement.
- All 26 taught topics are touched; 46 of 75 objectives are decided or co-decided and 29 are untested (list below).
  Read it as breadth, not per-objective mastery evidence.
- The candidate's own checks ran against React 19.1.0, react-router 7.5.0 and Testing Library 16.2.0; the module labs pin
  react-router 7.18.5. Router-specific items were not re-run against 7.18.5 here.
- The earlier module-check MCQ bank is not in this repository (only the legacy `web-and-react-module-check` blueprint),
  so overlap with it is unverified.
- Remaining lows not applied: rcf-edu-57 (q23 key wording) and rcf-edu-50 residual (one weak q14 distractor).
- Reviews recorded in the candidate (two independent critics, non-author reconciliation, rounds r1-r6) are claimed from
  its handoff report only.

The following is the candidate's value-free coverage report.

# React 30-minute course final: coverage and duration (value-free)

Private authoring candidate. This report names item ids, topics, objectives and levels only; it holds no question text, options, feedback or keys.

## Shape

- Items: 30 single-answer MCQ, GIFT `[html]`, category `react/assessments/react-course-final`, titles `react-cf30-q01`..`q30`.
- Levels: easy 8 (q01-q08), medium 12 (q09-q20), hard 10 (q21-q30).
- Correct-answer positions: {'A': 8, 'B': 7, 'C': 7, 'D': 8}; longest repeated run 1.
- Key length rank among its four options (1 = longest): {'1': 6, '2': 12, '3': 6, '4': 6}; key strictly longest in 2 of 30.
- Topics assessed: 26 of 26. Objectives decided or co-decided: 46 of 75.

## Duration

- 30 minutes for 30 items: about 1 minute allotted per item (sizing only; no per-question timer).
- Reading load: 2360 words in all (stems, code and options; code tokens counted as words), at most 93 in one item, about 78 per item.
- Basis: at a careful 150-200 words per minute the reading takes 11-15 minutes, leaving 15-19 minutes for decisions. Code-trace items carry most of the load; no timed learner trial has been run, so 30 minutes is an estimate, not a measurement.
- Code-bearing items read slower than their word count: 20 items carry a snippet, at most 10 lines.

## Topic map

`*` = co-decided (secondary objective of a cross-topic item).

| Topic | Calendar | Items |
|---|---|---|
| components-and-state/components-and-jsx | taught, both tracks | q01 |
| components-and-state/props | taught, both tracks | q01*, q10*, q24 |
| components-and-state/project-structure | Fast skim | q02 |
| components-and-state/conditional-display | Fast skim | q03, q27* |
| components-and-state/usestate | taught, both tracks | q11 |
| components-and-state/updating-state-immutably | taught, both tracks | q24*, q26 |
| components-and-state/rendering-lists-with-keys | taught, both tracks | q04, q05 |
| effects-routing-and-rendering/loading-data-with-useeffect | taught, both tracks | q16 |
| effects-routing-and-rendering/loading-and-error-states | taught, both tracks | q09*, q15, q28* |
| effects-routing-and-rendering/custom-hooks | Fast skim | q14 |
| effects-routing-and-rendering/routing-and-route-parameters | taught, both tracks | q12, q19 |
| effects-routing-and-rendering/navigation | taught, both tracks | q30 |
| effects-routing-and-rendering/what-makes-a-component-re-render | Fast skim | q24* |
| effects-routing-and-rendering/lifting-state-up | taught, both tracks | q07, q10, q23* |
| forms-context-and-crud/controlled-forms | taught, both tracks | q13 |
| forms-context-and-crud/accessible-forms | Fast skim | q06 |
| forms-context-and-crud/sharing-state-with-context | taught, both tracks | q07*, q14*, q23, q25, q29* |
| forms-context-and-crud/create-edit-and-delete-against-the-api | taught, both tracks | q21, q23* |
| forms-context-and-crud/handling-submission-errors-in-forms | taught, both tracks | q08 |
| forms-context-and-crud/ui-tests-with-testing-library-querying-by-role-and-label | taught, both tracks | q20 |
| auth-and-review/login-with-a-session-cookie-or-jwt | taught, both tracks | q17, q22*, q29 |
| auth-and-review/protected-pages-and-role-based-screens | taught, both tracks | q22, q27, q30* |
| auth-and-review/handling-401-and-403-redirect-and-sign-out | taught, both tracks | q22*, q28* |
| auth-and-review/turning-off-the-dev-profile | taught, both tracks | q18 |
| auth-and-review/javascript-fundamentals-review | review day (S35/FT20) | q04*, q09 |
| auth-and-review/react-review | review day (S35/FT20) | q28 |

## Item map

| Item | Level | Objectives |
|---|---|---|
| q01 | easy | components-and-state/components-and-jsx#o3, components-and-state/props#o1 |
| q02 | easy | components-and-state/project-structure#o1 |
| q03 | easy | components-and-state/conditional-display#o1 |
| q04 | easy | components-and-state/rendering-lists-with-keys#o1, auth-and-review/javascript-fundamentals-review#o1 |
| q05 | easy | components-and-state/rendering-lists-with-keys#o2 |
| q06 | easy | forms-context-and-crud/accessible-forms#o1 |
| q07 | easy | effects-routing-and-rendering/lifting-state-up#o1, forms-context-and-crud/sharing-state-with-context#o3 |
| q08 | easy | forms-context-and-crud/handling-submission-errors-in-forms#o1 |
| q09 | medium | auth-and-review/javascript-fundamentals-review#o2, effects-routing-and-rendering/loading-and-error-states#o2 |
| q10 | medium | effects-routing-and-rendering/lifting-state-up#o2, components-and-state/props#o3 |
| q11 | medium | components-and-state/usestate#o3 |
| q12 | medium | effects-routing-and-rendering/routing-and-route-parameters#o1 |
| q13 | medium | forms-context-and-crud/controlled-forms#o3, forms-context-and-crud/controlled-forms#o2 |
| q14 | medium | effects-routing-and-rendering/custom-hooks#o2, forms-context-and-crud/sharing-state-with-context#o1 |
| q15 | medium | effects-routing-and-rendering/loading-and-error-states#o1, effects-routing-and-rendering/loading-and-error-states#o3 |
| q16 | medium | effects-routing-and-rendering/loading-data-with-useeffect#o3 |
| q17 | medium | auth-and-review/login-with-a-session-cookie-or-jwt#o3 |
| q18 | medium | auth-and-review/turning-off-the-dev-profile#o2 |
| q19 | medium | effects-routing-and-rendering/routing-and-route-parameters#o2 |
| q20 | medium | forms-context-and-crud/ui-tests-with-testing-library-querying-by-role-and-label#o1, forms-context-and-crud/ui-tests-with-testing-library-querying-by-role-and-label#o2 |
| q21 | hard | forms-context-and-crud/create-edit-and-delete-against-the-api#o3 |
| q22 | hard | auth-and-review/protected-pages-and-role-based-screens#o3, auth-and-review/login-with-a-session-cookie-or-jwt#o1, auth-and-review/handling-401-and-403-redirect-and-sign-out#o1 |
| q23 | hard | forms-context-and-crud/sharing-state-with-context#o1, forms-context-and-crud/create-edit-and-delete-against-the-api#o2, effects-routing-and-rendering/lifting-state-up#o3 |
| q24 | hard | components-and-state/props#o3, components-and-state/updating-state-immutably#o3, effects-routing-and-rendering/what-makes-a-component-re-render#o1 |
| q25 | hard | forms-context-and-crud/sharing-state-with-context#o1, forms-context-and-crud/sharing-state-with-context#o2 |
| q26 | hard | components-and-state/updating-state-immutably#o1, components-and-state/updating-state-immutably#o2 |
| q27 | hard | auth-and-review/protected-pages-and-role-based-screens#o2, components-and-state/conditional-display#o1 |
| q28 | hard | auth-and-review/react-review#o2, effects-routing-and-rendering/loading-and-error-states#o2, auth-and-review/handling-401-and-403-redirect-and-sign-out#o2 |
| q29 | hard | auth-and-review/login-with-a-session-cookie-or-jwt#o2, forms-context-and-crud/sharing-state-with-context#o1 |
| q30 | hard | effects-routing-and-rendering/navigation#o2, auth-and-review/protected-pages-and-role-based-screens#o1 |

## Objectives not decided by any item

Coverage counts are author-tagged and await critic review. Read the count as breadth, not as mastery evidence per objective.

- components-and-state/components-and-jsx#o1
- components-and-state/components-and-jsx#o2
- components-and-state/props#o2
- components-and-state/project-structure#o2
- components-and-state/project-structure#o3
- components-and-state/conditional-display#o2
- components-and-state/conditional-display#o3
- components-and-state/usestate#o1
- components-and-state/usestate#o2
- effects-routing-and-rendering/loading-data-with-useeffect#o1
- effects-routing-and-rendering/loading-data-with-useeffect#o2
- effects-routing-and-rendering/custom-hooks#o1
- effects-routing-and-rendering/custom-hooks#o3
- effects-routing-and-rendering/routing-and-route-parameters#o3
- effects-routing-and-rendering/navigation#o1
- effects-routing-and-rendering/what-makes-a-component-re-render#o2
- effects-routing-and-rendering/what-makes-a-component-re-render#o3
- forms-context-and-crud/controlled-forms#o1
- forms-context-and-crud/accessible-forms#o2
- forms-context-and-crud/accessible-forms#o3
- forms-context-and-crud/create-edit-and-delete-against-the-api#o1
- forms-context-and-crud/handling-submission-errors-in-forms#o2
- forms-context-and-crud/handling-submission-errors-in-forms#o3
- forms-context-and-crud/ui-tests-with-testing-library-querying-by-role-and-label#o3
- auth-and-review/handling-401-and-403-redirect-and-sign-out#o3
- auth-and-review/turning-off-the-dev-profile#o1
- auth-and-review/turning-off-the-dev-profile#o3
- auth-and-review/javascript-fundamentals-review#o3
- auth-and-review/react-review#o1

## Header update (2026-11-19, orchestrator)
Line 1 comment changed from "Private authoring candidate." to the public-answer consent note; no question byte changed. New sha256: 9c1df2012a6258f8977618eee797c438442f3662c5898df3c459ec0a8287898d (candidate 2746e653… otherwise identical).
