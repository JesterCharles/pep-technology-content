"""The refunds API."""

from fastapi import Depends, FastAPI, HTTPException

from refunds.models import RefundOut, RefundRequest
from refunds.payments import PaymentNotFound, PaymentsClient, UpstreamError, UpstreamTimeout
from refunds.settings import get_settings
from refunds.store import RefundStore

app = FastAPI(title="Refunds service")

STORE = RefundStore()


def get_store():
    """Provided dependency: the refund store."""
    return STORE


def get_payments():
    """Provided dependency: a payments client for the configured service, closed after the request."""
    client = PaymentsClient(get_settings())
    try:
        yield client
    finally:
        client.close()


# TODO: POST /refunds (see the README)
