"""Provided: client for the Spring Boot payments service. Do not change."""

from decimal import Decimal

import httpx


class PaymentsError(Exception):
    """The payments service could not answer the question."""


class PaymentNotFound(PaymentsError):
    """The payments service has no payment with this id."""


class UpstreamTimeout(PaymentsError):
    """The payments service did not answer in time."""


class UpstreamError(PaymentsError):
    """The payments service failed or could not be reached."""


class PaymentsClient:
    """Calls GET {base_url}/api/payments/{payment_id} with the bearer token."""

    def __init__(self, settings, transport=None):
        self.http = httpx.Client(
            base_url=settings.base_url,
            headers={"Authorization": f"Bearer {settings.token}"},
            timeout=httpx.Timeout(settings.timeout_seconds),
            transport=transport,
        )

    def get_payment(self, payment_id):
        """Return the payment as a dict whose "amount" is a Decimal, or raise one of the errors above."""
        try:
            response = self.http.get(f"/api/payments/{payment_id}")
        except httpx.TimeoutException as exc:
            raise UpstreamTimeout(payment_id) from exc
        except httpx.TransportError as exc:
            raise UpstreamError(payment_id) from exc
        if response.status_code == 404:
            raise PaymentNotFound(payment_id)
        if not response.is_success:
            raise UpstreamError(f"payments service answered {response.status_code}")
        payment = response.json()
        payment["amount"] = Decimal(str(payment["amount"]))
        return payment

    def close(self):
        self.http.close()
