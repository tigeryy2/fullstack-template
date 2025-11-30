from typing import cast

import stripe
from cachetools import TTLCache, cached

from backend.utils.config import AppConfig
from backend.utils.loggable import Loggable

# Simple in-memory cache for price lookups to avoid hitting Stripe API constantly
_PRICE_ID_CACHE: TTLCache[str, str] = TTLCache(maxsize=20, ttl=600)


class StripeService(Loggable):
    """
    Service for interacting with Stripe, handling API key injection and price lookups.
    """

    def __init__(self, cfg: AppConfig) -> None:
        self.cfg = cfg
        self._ensure_api_key()

    def _ensure_api_key(self) -> None:
        # TODO: Add stripe_secret_key to AppConfig if not present
        key = getattr(self.cfg, "stripe_secret_key", None)
        if key and stripe.api_key != key:
            stripe.api_key = key

    def get_price_id(self, lookup_key: str) -> str:
        """
        Resolve a Stripe Price ID from a lookup key.
        """
        return self._lookup_price_id_cached(lookup_key)

    @classmethod
    @cached(_PRICE_ID_CACHE)
    def _lookup_price_id_cached(cls, lookup_key: str) -> str:
        try:
            prices = cast(
                stripe.ListObject,
                stripe.Price.list(lookup_keys=[lookup_key], limit=1),
            )
            if not prices.data:
                raise ValueError(f"No Stripe price found for lookup_key='{lookup_key}'")

            return cast(str, prices.data[0].id)
        except Exception as exc:
            cls.log().error(f"Stripe price lookup error for '{lookup_key}': {exc}")
            raise

    async def create_checkout_session(
        self,
        price_id: str,
        success_url: str,
        cancel_url: str,
        customer_email: str | None = None,
        client_reference_id: str | None = None,
    ) -> str:
        """
        Create a checkout session and return the URL.
        """
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",  # or "payment"
            success_url=success_url,
            cancel_url=cancel_url,
            customer_email=customer_email,
            client_reference_id=client_reference_id,
        )
        return session.url
