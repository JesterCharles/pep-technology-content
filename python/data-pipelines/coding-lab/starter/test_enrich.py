"""Your own offline tests for the enrichment step (Task 9).

Run only this file from the lab folder:  python -m pytest -q starter/test_enrich.py
"""

from pipeline.enrich import enrich
from pipeline.fake_model import FakeModelClient

SIGNUP = {
    "email": "ana.ruiz@example.com",
    "name": "Ana Ruiz",
    "session": "testing",
    "seats": 1,
    "phone": "555-0101",
    "comment": "I want to learn how to test my scripts",
}
VALID = '{"interest": "testing", "level": "beginner"}'


# TODO Task 9: add the two tests the README asks for below this line.
