# Window functions: top N per group

## Objectives

- Compute a per-row value over a group without collapsing rows, using OVER (PARTITION BY ... ORDER BY ...)
- Return the top N rows per group by filtering ROW\_NUMBER in an outer query or CTE
- Explain how ROW\_NUMBER, RANK and DENSE\_RANK differ when rows tie

## Teaching

A table `scores(player, team, points)` holds seven rows: team red has ana 30, ben 25, cy 25 and dee 10; team blue has eli 40, fay 35 and gus 20. Predict before any explanation.

```
SELECT team, player, points,
       MAX(points) OVER (PARTITION BY team) AS team_best
FROM scores;
```

`OVER (PARTITION BY team ORDER BY points DESC)` splits the rows by team and orders each team, highest first. Ranking functions then number each row in its partition:

```
SELECT team, player, points,
       ROW_NUMBER() OVER w AS rn,
       RANK()       OVER w AS rnk,
       DENSE_RANK() OVER w AS drnk
FROM scores
WINDOW w AS (PARTITION BY team ORDER BY points DESC);
```

`ROW_NUMBER` counts 1, 2, 3 and never repeats; tied rows still get different numbers, in an order PostgreSQL does not promise. `RANK` gives tied rows the same rank and then skips; `DENSE_RANK` gives the same rank without gaps. In red, ben and cy tie on 25.

PostgreSQL computes window functions after `WHERE`, `GROUP BY` and `HAVING`. A window function therefore cannot be used in `WHERE`, and the alias `rn` does not exist there yet. To keep the top N rows per group, number the rows in one step, then filter in an outer query: a `WITH` query or a subquery in `FROM`.

A coach wants the top two of team red, and nobody who ties for a place should be left out. This query filters `RANK` instead of `ROW_NUMBER`.

## Model

The model: `GROUP BY` folds each group into one row; a window function looks across a group of related rows, its window, and writes one answer onto every row.

## Recap

- A function followed by `OVER (PARTITION BY … ORDER BY …)` computes across related rows and keeps every row.
- For ties, `ROW_NUMBER` gives unique numbers, `RANK` shares a place and leaves a gap, `DENSE_RANK` shares a place without a gap.
- Top N per group: number the rows in a `WITH` step or a subquery in `FROM`, then filter in the outer query.

Next: Indexes

## Cheat sheet

Two runners cross the line together in second place. The results board lists both as second, and the next runner is listed as fourth because three people finished ahead of her. A cloakroom attendant, though, gives every coat its own ticket number, even for two coats handed over at the same moment.

Shared places with a gap, shared places without a gap, or one unique number each: the three ways to number tied rows.

Where to act: The function name after Value:, then the red rows in points order: 30, 25, 25, 10.

Next step: For a tie, ask whether the function shares one number, and if so, whether the next number counts the rows before it or the distinct scores before it.

Where to act: The `WHERE` clause of each option.

Next step: Ask whether the row number already exists as a column when that `WHERE` runs; it only does in a query wrapped around the step that computed it.

Optional time: about 5 minutes, in addition to this topic's time.

On your own PostgreSQL database, create the seven-row `scores` table from this page. Write one query that returns, for every player, their team, their points and how far they are behind their team's best score, without collapsing any rows.

Success criteria: the result has 7 rows; ana and eli show 0 behind, ben and cy show 5, dee shows 20, fay 5 and gus 20.

|  |  |
| --- | --- |
| Per-group value | `MAX(points) OVER (PARTITION BY team)` |
| Number rows | `ROW_NUMBER() OVER (PARTITION BY team ORDER BY points DESC)` |
| Keep ties | `RANK()` or `DENSE_RANK()` |
| Top N per group | `WITH ranked AS (… AS rn …) SELECT … FROM ranked WHERE rn <= N;` |

## Sources

Claims on this page were checked against the live official PostgreSQL documentation below on 16 October 2026 (UTC). Every query result and error message was confirmed on PostgreSQL 17.5. Links open outside this lesson.

- 3.5 Window Functions: rows are not grouped into one output row; window functions run after `WHERE`, `GROUP BY` and `HAVING`, so filtering needs a sub-select.
- 9.22 Window Functions: `row_number`, `rank` and `dense_rank`.
- 4.2.8 Window Function Calls: `PARTITION BY`, `ORDER BY` and the `WINDOW` clause.
- SELECT: ORDER BY Clause: rows equal on every ordering expression come in an implementation-dependent order.
- 7.8.1 SELECT in WITH.

## Static interaction alternatives

### predict

Prediction (practice, not scored): MAX(points) OVER (PARTITION BY team) on seven score rows in two teams. Options: 2 rows, one per team (wrong: OVER keeps every row); 7 rows, each with its team's best score, 30 for red rows and 40 for blue rows (correct); 7 rows, each with 40 (wrong: PARTITION BY team computes the maximum per team); an error that player must appear in GROUP BY (wrong: that error belongs to a plain aggregate without OVER).

### drag

Sorting activity on team red ordered by points DESC (ana 30, ben 25, cy 25, dee 10). RANK() for cy is 2, because cy ties with ben in second place. DENSE_RANK() for cy is 2. RANK() for dee is 4, because three rows come before dee. DENSE_RANK() for dee is 3, because two distinct scores come before dee. ROW_NUMBER() for dee is 4, because dee is the fourth row however ben and cy are ordered.

### mcq

Apply question: top two scorers per team. Correct: WITH ranked AS (SELECT team, player, points, ROW_NUMBER() OVER (PARTITION BY team ORDER BY points DESC) AS rn FROM scores) SELECT team, player, points FROM ranked WHERE rn <= 2, returning eli and fay for blue and ana and one of ben or cy for red. Wrong: ROW_NUMBER in WHERE (ERROR: window functions are not allowed in WHERE); WHERE rn <= 2 in the same SELECT that defines rn (ERROR: column rn does not exist); ORDER BY points DESC LIMIT 2 (two rows in total, eli and fay, not two per team). Retry form: the single top scorer per team filters rn = 1 in a subquery in FROM.

### mcq

Apply question: team red (ana 30, ben 25, cy 25, dee 10) ranked with RANK() OVER (ORDER BY points DESC) and filtered rnk <= 2 returns 3 rows: ana (1), ben (2) and cy (2). Wrong: 2 rows (that is ROW_NUMBER); 4 rows (dee's rank is 4); an error (filtering a CTE column is allowed). Retry form: DENSE_RANK filtered r <= 3 returns 4 rows, because dee's dense rank is 3.
