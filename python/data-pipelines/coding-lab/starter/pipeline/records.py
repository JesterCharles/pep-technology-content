"""Extract, validate and deduplicate sign-up records in Python (Tasks 1, 5 and 6)."""

import csv
import json
from datetime import datetime
from pathlib import Path

from pydantic import BaseModel, ValidationError, field_validator


# --- Task 1: stream records with generators ----------------------------------


def read_csv(path):
    """Yield one dict per row of the CSV file at `path`, reading the file row by row."""
    # TODO Task 1
    raise NotImplementedError("Task 1: write read_csv")


def read_jsonl(path):
    """Yield one dict per non-blank line of the JSON Lines file at `path`."""
    # TODO Task 1
    raise NotImplementedError("Task 1: write read_jsonl")


def extract(paths):
    """Yield the records of every file in `paths` (.csv or .jsonl), skipping records with a blank email."""
    # TODO Task 1
    raise NotImplementedError("Task 1: write extract")


# --- Task 5: validate records with Pydantic ----------------------------------


class Signup(BaseModel):
    """One validated sign-up. TODO Task 5: declare the fields and the email validator."""


def validate_all(rows):
    """Return (accepted, rejected): Signup models, and (row, error list) pairs for invalid rows."""
    # TODO Task 5
    raise NotImplementedError("Task 5: write validate_all")


# --- Task 6: deduplicate in Python -------------------------------------------


def latest_per_email(signups):
    """Return one sign-up per email, the one with the latest signed_up_at, ordered by email."""
    # TODO Task 6
    raise NotImplementedError("Task 6: write latest_per_email")
