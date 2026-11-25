"""Provided: request and response models for the refunds API. Do not change."""

from decimal import Decimal

from pydantic import BaseModel, Field


class RefundRequest(BaseModel):
    """The body of POST /refunds."""

    payment_id: str = Field(min_length=1)
    amount: Decimal = Field(gt=0)
    reason: str = Field(min_length=1, max_length=200)


class RefundOut(BaseModel):
    """What the API returns for one refund."""

    id: str
    payment_id: str
    amount: Decimal
    status: str
