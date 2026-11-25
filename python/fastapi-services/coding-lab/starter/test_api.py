"""Your own tests for the API (Task 8).

Run only this file from the lab folder:  python -m pytest -q starter/test_api.py
"""

import httpx
from fastapi.testclient import TestClient

from signups_api.main import app
from signups_api.repository import SignupRepository, get_repository
from signups_api.upstream import UpstreamError, fetch_workshop

client = TestClient(app)


# TODO Task 8: add the two tests the README asks for below this line.
