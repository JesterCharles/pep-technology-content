/*
TASK 3. The status badge is currently defined inside ServiceCard.jsx, so no
other screen can reuse it. Move it into this module:
  - export the component as the default export, and
  - export STATUS_LABELS (the object mapping each status id to its display
    label) as a named export, because later labs reuse the labels on their own.
Then make ServiceCard.jsx import the default StatusBadge from here instead
of defining its own copy. The card needs only the component; other modules
(such as part 2's status legend) import STATUS_LABELS with braces.
*/
