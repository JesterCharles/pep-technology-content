"""Your own tests for the desk (Task 10).

Run only this file from the lab folder:  python -m pytest -q starter/test_signups.py
"""

import pytest

from signups.records import parse_seats, session_status


def test_open_when_plenty_of_seats():
    assert session_status(10, 3) == "open"


# TODO Task 10: add the tests the README asks for below this line.
