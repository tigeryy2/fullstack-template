import os
from dataclasses import dataclass, field
from typing import Literal

from dotenv import load_dotenv

from backend.utils.loggable import Loggable


@dataclass(frozen=True, slots=True)
class AppConfig(Loggable):
    # ---- Cloudflare R2 credentials & routing ----
    r2_access_key: str | None = field(default=None, repr=False)
    r2_secret_key: str | None = field(default=None, repr=False)
    r2_bucket: str | None = field(default=None, repr=False)
    r2_endpoint_url: str | None = field(default=None, repr=False)
    r2_public_base_url: str | None = field(default=None, repr=False)

    # ---- MongoDB Configuration ----
    mongo_uri: str | None = field(default=None, repr=False)

    MONGO_DB_NAME: str = "app_prod"
    MONGO_DEV_DB_NAME: str = "app_dev"
    MONGO_TEST_DB_NAME: str = "app_test"

    app_env: str = "dev"

    @classmethod
    def from_env(cls, **override):
        load_dotenv()

        def _get(key: str) -> str | None:
            """Return the environment variable or None if missing or blank."""
            val = os.getenv(key)
            return val if val not in ("", None) else None

        # Base parameters gathered from environment variables
        params: dict[str, str | None] = {
            "r2_access_key": _get("R2_ACCESS_KEY"),
            "r2_secret_key": _get("R2_SECRET_KEY"),
            "r2_bucket": _get("R2_BUCKET"),
            "r2_endpoint_url": _get("R2_ENDPOINT_URL"),
            "r2_public_base_url": _get("R2_PUBLIC_BASE_URL"),
            "mongo_uri": _get("MONGODB_URI"),
            "app_env": _get("APP_ENV") or "dev",
        }

        # Apply any explicit overrides (e.g. in tests)
        params.update(override)

        # Filter out None values to avoid passing None for optional fields
        filtered_params = {k: v for k, v in params.items() if v is not None}

        config = cls(**filtered_params)
        return config

    def get_mongo_db_name(
        self, app_env: Literal["dev", "test", "prod"] | None = None
    ) -> str:
        """Return the appropriate MongoDB database name based on environment."""
        if self.app_env is None:
            self.log().warning("APP_ENV not set")

        resolved_env = app_env or self.app_env

        if resolved_env == "test":
            return self.MONGO_TEST_DB_NAME
        if resolved_env == "prod":
            return self.MONGO_DB_NAME
        else:
            return self.MONGO_DEV_DB_NAME
