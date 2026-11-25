"""The outbound call to the Spring Boot workshop catalog: GET /workshops/{id}."""

import httpx

from signups_api.settings import Settings


class UpstreamError(Exception):
    """The workshop catalog could not answer; carries the status and detail our API returns."""

    def __init__(self, status_code, detail):
        super().__init__(detail)
        self.status_code = status_code
        self.detail = detail


def make_client(settings: Settings, transport=None) -> httpx.Client:
    """Return an httpx.Client for the workshop catalog.

    base_url from settings.spring_base_url, the header Authorization: Bearer <spring_token>,
    and timeout=httpx.Timeout(settings.spring_timeout_seconds). Pass `transport` through to
    httpx.Client so tests can plug in an httpx.MockTransport.
    """
    # TODO Task 5
    raise NotImplementedError("Task 5: write make_client")


def fetch_workshop(client: httpx.Client, workshop_id: int) -> dict:
    """GET /workshops/{workshop_id} and return the JSON body as a dict.

    Raise UpstreamError(504, "Workshop service timed out") on a timeout,
    UpstreamError(502, "Workshop service unavailable") on another transport failure such as a
    refused connection, and UpstreamError(502, "Workshop service returned <status>") for a
    non-2xx answer (raise_for_status).
    """
    # TODO Task 6
    raise NotImplementedError("Task 6: write fetch_workshop")
