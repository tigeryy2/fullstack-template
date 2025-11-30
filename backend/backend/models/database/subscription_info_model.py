from datetime import datetime
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field, computed_field, field_serializer


class SubscriptionType(str, Enum):
    FREE = "free"
    PRO = "pro"


class SubscriptionInfoModel(BaseModel):
    """
    Holds all subscription-related fields.
    """

    subscription_type: SubscriptionType | None = Field(default=None)
    subscription_term: Literal["month", "year"] | None = Field(default=None)

    subscription_start_date: datetime | None = Field(default_factory=datetime.now)
    subscription_end_date: datetime | None = Field(default=None)
    subscription_is_renewing: bool = Field(default=True)

    stripe_customer_id: str | None = Field(default=None)
    stripe_subscription_id: str | None = Field(default=None)
    stripe_subscription_status: str | None = Field(default=None)

    @field_serializer("subscription_start_date", "subscription_end_date")
    def serialize_dates(self, value: datetime | None) -> str | None:
        return value.isoformat() if value else None

    @computed_field(return_type=bool)
    @property
    def subscription_is_active(self) -> bool:
        return self.stripe_subscription_status in {"active", "trialing"}
