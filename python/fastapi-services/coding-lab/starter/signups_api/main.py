"""The sign-up results API.

Run it from the starter folder:  python -m uvicorn signups_api.main:app
"""

from fastapi import Depends, FastAPI, HTTPException, Query
from pydantic import BaseModel

from signups_api.repository import get_repository
from signups_api.settings import Settings
from signups_api.upstream import UpstreamError, fetch_workshop, make_client

app = FastAPI(title="Sign-up results")


# TODO Task 1: SignupIn, the request body: email, name and session (str), workshop_id (int).

# TODO Task 1: SignupOut, the response model: id, name, session, status (str), workshop_id (int) - no email.


# TODO Task 1: POST /signups -> 201 with the created sign-up (repo.add(...)).

# TODO Task 2: GET /signups/{signup_id} -> the sign-up, or 404 {"detail": "Sign-up not found"}.

# TODO Task 3: GET /sessions/{session}/signups?limit=10&offset=0 -> one page of sign-ups.


def get_settings() -> Settings:
    """Dependency: settings read from the environment for each request."""
    return Settings()


def get_workshop_client(settings: Settings = Depends(get_settings)):
    """Dependency: an httpx client for the workshop catalog, closed after the request."""
    with make_client(settings) as client:
        yield client


# TODO Task 7: GET /signups/{signup_id}/workshop -> {"signup_id": ..., "workshop": {...}}.
