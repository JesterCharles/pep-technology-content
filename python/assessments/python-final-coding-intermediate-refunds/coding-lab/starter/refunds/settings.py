"""Provided: settings for the Spring Boot payments service, read from environment variables. Do not change."""

import os
from dataclasses import dataclass


@dataclass
class Settings:
    base_url: str
    token: str
    timeout_seconds: float = 2.0


def get_settings():
    """Return an object with base_url, token and timeout_seconds."""
    return Settings(
        base_url=os.environ["PAYMENTS_BASE_URL"],
        token=os.environ["PAYMENTS_TOKEN"],
        timeout_seconds=float(os.environ.get("PAYMENTS_TIMEOUT_SECONDS", "2.0")),
    )
