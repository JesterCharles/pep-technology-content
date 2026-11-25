"""AI enrichment with validated outputs, without sending names, emails or phone numbers (Tasks 7 and 8).

The model client has one method, complete(prompt) -> str. The tests use the offline
FakeModelClient from fake_model.py; nothing here makes a live or paid AI call.
"""

import hashlib
import json
import logging

from pydantic import BaseModel, ValidationError

from pipeline.fake_model import ModelError

logger = logging.getLogger(__name__)


def pseudonym(email):
    """Return a stable reference such as "p-1a2b3c4d5e" for an email.

    A lab shortcut: a plain hash of an email can be reversed by anyone who guesses the email
    and hashes it the same way. In production, use the page's method: swap in a random token
    and keep the mapping on your side (or a keyed hash whose key never leaves your system).
    """
    digest = hashlib.sha256(("signups-lab:" + email).encode("utf-8")).hexdigest()
    return "p-" + digest[:10]


# --- Task 7: keep personal data out of the prompt ----------------------------


def minimize_for_prompt(signup):
    """Return the new dict that may go into a prompt: only what the classification needs.

    `signup` is a sign-up dict, such as Signup.model_dump() returns; it must not change.
    """
    # TODO Task 7
    raise NotImplementedError("Task 7: write minimize_for_prompt")


# --- Task 8: ask for JSON, validate it, retry or reject ----------------------


class Enrichment(BaseModel):
    """TODO Task 8: interest and level, each limited to the values listed in README.md."""


def build_prompt(record):
    """Return the prompt for one minimized record, asking for JSON that matches Enrichment."""
    schema = json.dumps(Enrichment.model_json_schema())
    return (
        "Classify this workshop sign-up. Answer only with JSON matching this schema: "
        f"{schema}\nSign-up: {json.dumps(record, default=str)}"
    )


def enrich(client, signups, max_attempts=2):
    """Enrich each sign-up dict in `signups`; return (enriched, rejected_refs).

    enriched: one {"ref": ..., "interest": ..., "level": ...} per sign-up whose answer validated.
    rejected_refs: the refs whose every attempt failed or was invalid.
    """
    # TODO Task 8
    raise NotImplementedError("Task 8: write enrich")
