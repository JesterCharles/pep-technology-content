# Curriculum, timing, GIFT, link, and video validators

These validators back offline gates T14-T17 and T19. Network access is always explicit: `npm run check`
never performs HTTP requests.

## Assessment blueprint objectives (T01)

Every blueprint objective is an exact `<course>/<module>/<topic>#<objective-id>` reference to an objective in that
topic's `topic.json`. The optional `objectiveFormats` object maps those same references to non-empty, unique arrays
of formats declared by the blueprint. T01 checks both the topic reference and the map's keys and values.

## Curriculum snapshot (T19)

The frozen inputs are in `curriculum/snapshot/`. `pep-curriculum.json` is copied byte for byte from the
source workspace. `pep-calendar.json` is canonical JSON extracted from the calendar's single `const J = {...}`
assignment. `curriculum/curriculum.lock.json` binds source and snapshot hashes, source paths, curriculum version,
and extraction-tool version.

Re-extract when an approved curriculum update is received:

```sh
node tools/curriculum/extract-calendar.mjs /path/to/pep-calendar.html /tmp/pep-calendar.json
```

T19 compares the local source when its locked absolute path is available. On CI, where it is not available, T19
verifies the committed files against the lock and `SHA256SUMS`. It always proves that all 105 calendar topic lists
equal the simplified curriculum topic lists in order.

## Reading time (T14)

`tools/timing/estimate_reading.py` is frozen at SHA-256
`0deca96bf5e367aeae51a82abdbd4b6ce0d0289ecc9868c9eff3701016edf96f`. Do not alter its cost table to make a
page pass. T14 runs it with Python 3 on every present `artifact.html`. The recorded `modeledP50` must match the
estimator P50 within 0.01, and that P50 must fit the topic budget. The estimator P90 is informational only: it is
not the worst required path. Authors model the worst route a learner must take per interactive unit—two wrong
graded attempts and wrong-first explores before settling—and record that model and its evidence in the non-empty
`minutes.basis`. `modeledWorstPath` must be at least `modeledP50`, and the about label must cover it. T14 also
enforces the 15-minute topic ceiling and sums pages mapped to each calendar day against that day type's block total.

Run it directly while authoring:

```sh
python3 tools/timing/estimate_reading.py path/to/artifact.html
```

## Formative GIFT (T16)

Validate one topic quiz directly:

```sh
node tools/gift/validate.mjs path/to/artifact.gift course-id/module-id/topic-id
```

The validator implements the Moodle GIFT importer paths documented in `tools/gift/PROVENANCE.md`. A quiz must be
ASCII, contain no `<` or `>`, use `$CATEGORY: course/module/topic`, title every question, have exactly one `=`
correct option, and give every option `#` feedback beginning `Correct.` or `Not quite.`. Escape literal GIFT
control characters with a backslash.

## Source link receipts (T15)

Create `evidence/<course>/<module>/<topic>/sources.json` with source URLs and non-empty `sectionsUsed` arrays,
then refresh it over the network:

```sh
node tools/net/check-links.mjs course-id/module-id/topic-id
```

The command performs a GET, follows redirects, records final HTTP status, retrieval time, response SHA-256, and the
current HTML SHA-256. A failed request is written to the receipt and makes the command fail. T15 runs offline and
requires HTTP 200, current artifact bytes, and dates no older than 30 days. Example receipt shape:

```json
{
  "schemaVersion": 1,
  "reviewedSha256": "<artifact sha256>",
  "checkedAt": "2026-10-08T00:00:00.000Z",
  "sources": [
    {
      "url": "https://example.com/official-doc",
      "retrievedAt": "2026-10-08T00:00:00.000Z",
      "status": 200,
      "finalUrl": "https://example.com/official-doc",
      "sha256": "<response sha256>",
      "sectionsUsed": ["Named section"]
    }
  ]
}
```

## Video receipts (T17)

After authoring a schema-valid `video-artifact.md`, run:

```sh
node tools/net/check-video.mjs course-id/module-id/topic-id
```

The command uses the provider's JSON oEmbed endpoint to establish public availability and embeddability. It obtains
runtime from oEmbed when provided, or from YouTube's public player metadata, and writes
`evidence/<course>/<module>/<topic>/video.json`. T17 runs offline and requires a receipt bound to the current video
file, no older than 30 days, with successful oEmbed and runtime no greater than `topic.json`'s minute budget.
