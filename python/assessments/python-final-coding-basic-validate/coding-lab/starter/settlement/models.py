"""Provided: the Transaction model for one settlement batch. Do not change."""

from decimal import Decimal

from pydantic import BaseModel, Field, field_validator


class Transaction(BaseModel):
    """One card transaction from the nightly batch file."""

    txn_id: str
    account: str
    amount: Decimal = Field(gt=0)
    currency: str
    cardholder: str | None = None
    merchant: str | None = None
    status: str = "posted"

    @field_validator("currency")
    @classmethod
    def normalize_currency(cls, value: str) -> str:
        code = value.strip().upper()
        if len(code) != 3 or not code.isalpha():
            raise ValueError("currency must be a three-letter code")
        return code
