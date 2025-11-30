from dataclasses import dataclass, field
from typing import Self

from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorDatabase,
)

from backend.utils.loggable import Loggable


@dataclass
class BaseMongoRepo(Loggable):
    """
    Base class for MongoDB repositories.
    """

    database_name: str | None = field(default=None)
    uri: str | None = field(default=None)

    client: AsyncIOMotorClient | None = field(default=None)
    database: AsyncIOMotorDatabase | None = field(default=None)

    @classmethod
    def from_uri(cls, uri: str, database_name: str | None = "app") -> "Self":
        return cls(uri=uri, database_name=database_name)

    @classmethod
    def from_mongo_client(
        cls, client: AsyncIOMotorClient, database_name: str | None = "app"
    ) -> "Self":
        return cls(client=client, database_name=database_name)

    def __post_init__(self):
        if self.client is None and self.uri is None:
            raise ValueError("Must provide one of client or uri")

        if self.client is None:
            self.client = AsyncIOMotorClient(self.uri)

        self.database = self.client[self.database_name]

    def close(self) -> None:
        if self.client:
            self.client.close()
