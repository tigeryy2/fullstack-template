from datetime import datetime
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, Field, field_serializer

from backend.models.database.subscription_info_model import SubscriptionInfoModel


class BaseDataModel(BaseModel):
    """Base model for database entities"""

    pass


def get_user_uuid() -> str:
    return f"user_{uuid4().hex[:16]}"


class UserModel(BaseDataModel):
    uuid: str = Field(default_factory=get_user_uuid)
    created_date: datetime = Field(default_factory=datetime.now)

    full_name: str | None = Field(default=None)
    email: str | None = Field(default=None)

    auth_provider: Literal["google"] | None = Field(default="google")
    auth_user_id: str | None = Field(default=None)

    subscription: SubscriptionInfoModel = Field(default_factory=SubscriptionInfoModel)

    @field_serializer("created_date")
    def serialize_created_date(self, value: datetime | None) -> str | None:
        return value.isoformat() if value else None
