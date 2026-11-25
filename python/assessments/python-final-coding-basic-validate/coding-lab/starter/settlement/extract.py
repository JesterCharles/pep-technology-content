"""Extract step: read the batch file and split accepted from rejected records."""

import json

from pydantic import ValidationError

from settlement.models import Transaction


def read_jsonl(path):
    """Provided: yield one parsed dict per non-blank line of a JSON Lines file."""
    with open(path, encoding="utf-8") as handle:
        for line in handle:
            if line.strip():
                yield json.loads(line)


def validate(records):
    """Return (accepted, rejected) for an iterable of raw dicts. See the README."""
    raise NotImplementedError("write validate")
