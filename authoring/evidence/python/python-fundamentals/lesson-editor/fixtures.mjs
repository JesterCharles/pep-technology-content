// Authoring-side exercise data for the editor proofs and regressions. Learner pages never carry a completed answer,
// and no completed answer is committed here either. The four scaffold editors and the slicing comprehensions are
// answer-sensitive: privateScaffoldFixtures() and privateComprehensionFixtures() read the completed files from
// authorized uncommitted JSON files outside the repository, named by PEP_PRIVATE_SCAFFOLD_FIXTURES and
// PEP_PRIVATE_COMPREHENSION_FIXTURES. Proofs that need them skip, with a reason, without them; public negatives are
// built from the public starters only.
import { readFileSync } from "node:fs";
import path from "node:path";
export const NOJS_STARTERS = {
  "python-syntax-for-java-developers": 'def describe(int n) {\n    int steps = 0\n    while (n > 1) {\n        n = n / 2\n        steps++\n    if steps == 0:\n        return "tiny"\n    else if steps < 4:\n        return "small"\n    else:\n        return "large"\n',
  "functions-and-arguments": 'def describe(room, nights=1, ___, ___):\n    return room, nights, parts, fields\n\nvalues = ["A12", 2]\noptions = {"breakfast": True}\nresult = describe(___, ___)\n',
  "exceptions-and-logging": "import logging\nlogger = logging.getLogger(__name__)\n\nclass OutOfStock(Exception):\n    pass\n\ndef reserve(requested, left):\n    try:\n        if requested > left:\n            # raise the supplied exception\n            ___\n    # add except, else and finally blocks\n",
  "writing-and-running-script-files": 'import sys\n\ndef main(argv):\n    # reject a missing SESSION argument\n    ___\n    print("Summary for", argv[1])\n    return 0\n\n# call main only when this file is run\n___\n',
  "testing-with-pytest": "import pytest\nfrom seats import seats_left\n\ndef test_some_taken():\n    ___\n\ndef test_bad_input():\n    with ___:\n        seats_left(10, -1)\n\n___\ndef capacity():\n    return 10\n\n___\ndef test_left(capacity, taken, left):\n    assert seats_left(capacity, taken) == left\n",
  "slicing-and-comprehensions": "prices = [4, 12, 12, 30]\n\n# 1. The loop as one list comprehension\nresult = ___\n\n# 2. The doubled prices over 10, as a set or a dict\ndoubled = ___\n",
};

function privateJson(variable, keys) {
  const file = process.env[variable];
  if (!file) return null;
  const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../../../..");
  const absolute = path.resolve(file);
  if (!path.relative(repo, absolute).startsWith("..")) throw new Error(`${variable} must name a file outside the repository`);
  const data = JSON.parse(readFileSync(absolute, "utf8"));
  for (const key of keys) if (typeof data[key] !== "string") throw new Error(`${variable} is missing the string key ${key}`);
  return data;
}

// Shape: { "fned": "<completed file>", "exed": "...", "sced": "...", "pted": "..." }. Returns null when not provided.
export function privateScaffoldFixtures() {
  return privateJson("PEP_PRIVATE_SCAFFOLD_FIXTURES", ["fned", "exed", "sced", "pted"]);
}

// Shape: { "cpedSet": "<completed file>", "cpedDict": "<completed file>" }. Returns null when not provided.
export function privateComprehensionFixtures() {
  const file = process.env.PEP_PRIVATE_COMPREHENSION_FIXTURES;
  if (!file) return null;
  const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../../../..");
  const absolute = path.resolve(file);
  if (!path.relative(repo, absolute).startsWith("..")) throw new Error("private comprehension fixtures must live outside the repository");
  const data = JSON.parse(readFileSync(absolute, "utf8"));
  for (const key of ["cpedSet", "cpedDict"]) if (typeof data[key] !== "string") throw new Error(`private comprehension fixtures need ${key}`);
  return data;
}
