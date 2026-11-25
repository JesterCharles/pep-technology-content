"""Provided: the in-memory refund store. Do not change."""

from dataclasses import dataclass
from decimal import Decimal


@dataclass
class Refund:
    id: str
    payment_id: str
    amount: Decimal
    reason: str
    customer_email: str
    status: str = "pending"


class RefundStore:
    """Keeps refunds in memory, in the order they were added."""

    def __init__(self):
        self._refunds = {}

    def add(self, payment_id, amount, reason, customer_email):
        refund = Refund(f"R{len(self._refunds) + 1}", payment_id, Decimal(amount), reason, customer_email)
        self._refunds[refund.id] = refund
        return refund

    def get(self, refund_id):
        """Return the refund with this id, or None."""
        return self._refunds.get(refund_id)

    def list(self, payment_id=None):
        """Return every refund, or only the refunds for one payment."""
        return [r for r in self._refunds.values() if payment_id is None or r.payment_id == payment_id]

    def refunded_total(self, payment_id):
        """Return the total amount already refunded for one payment."""
        return sum((r.amount for r in self.list(payment_id)), Decimal("0"))
