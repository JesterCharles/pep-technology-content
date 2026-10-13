# Shared components

`components/<name>/` holds the version 1 reference fragments for the learner interface. Each directory has
`component.html`, `component.css`, `component.js` and `component.json`. The metadata records the authoritative
course-1 source page, its SHA-256, exact source line ranges, the three module variants, and why that variant was
selected.

These are reference fragments, not runtime dependencies. A standalone learner page copies only the fragments
it needs. Page-specific data and behavior stay outside the marked blocks.

## Embed a fragment

Use HTML comments around HTML and block comments around CSS or JavaScript:

```html
<!-- pep:component progress@1 html -->
...exact component.html bytes...
<!-- /pep:component progress html -->
```

```css
/* pep:component progress@1 css */
...exact component.css bytes...
/* /pep:component progress css */
```

```js
/* pep:component progress@1 js */
...exact component.js bytes...
/* /pep:component progress js */
```

The opening marker carries the version. The closing marker repeats the name and fragment kind. Preserve the
fragment's final newline before the closing marker. Add the same version to the topic manifest under `authoring/catalog/<course>/<module>/<topic>/topic.json`:

```json
{
  "components": {
    "progress": "1"
  }
}
```

A declaration requires at least one marked fragment. Every marker requires a declaration. A page with no
markers and an empty `components` object is valid.

## Check drift

Run:

```sh
npm run check -- --only T24
```

T24 compares every marked block byte-for-byte with the named fragment, rejects unknown or duplicate blocks,
and verifies marker versions against both `component.json` and the joined catalog `topic.json`.

The terminal reference comes from the Linux Evolv terminal repair. It intentionally uses direct click and
Enter dispatch, not form submission, so it works in `sandbox="allow-scripts"` without `allow-forms`.
