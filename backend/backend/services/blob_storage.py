import hashlib
from dataclasses import dataclass, field
from mimetypes import guess_type
from pathlib import Path

import aioboto3
from aiobotocore.client import AioBaseClient

from backend.utils.config import AppConfig
from backend.utils.loggable import Loggable


@dataclass(slots=True)
class R2Storage(Loggable):
    cfg: AppConfig
    _client: AioBaseClient | None = field(default=None, init=False, repr=False)

    async def _client_async(self) -> AioBaseClient:
        if self._client is None:
            session = aioboto3.Session()
            self._client = await session.client(
                "s3",
                aws_access_key_id=self.cfg.r2_access_key,
                aws_secret_access_key=self.cfg.r2_secret_key,
                endpoint_url=self.cfg.r2_endpoint_url,
                region_name="auto",
            ).__aenter__()
        return self._client

    async def upload(
        self,
        file_path: Path,
        key_prefix: str,
        filename: str | None = None,
    ) -> str:
        """
        Upload *file_path* to `<key_prefix>/<filename>` (filename defaults to
        file_path.name). Returns the public URL.
        """
        client = await self._client_async()
        filename = filename or file_path.name

        # on dev, prepend "dev/"
        if self.cfg.app_env == "dev":
            key_prefix = f"dev/{key_prefix.lstrip('/')}"

        if not self.cfg.r2_bucket or not self.cfg.r2_public_base_url:
            raise ValueError("R2 is not configured")

        remote_key = f"{key_prefix.rstrip('/')}/{filename}"

        # Compute checksum
        digest = self.sha256(file_path)

        await client.put_object(
            Bucket=self.cfg.r2_bucket,
            Key=remote_key,
            Body=file_path.read_bytes(),
            ContentType=guess_type(filename)[0] or "application/octet-stream",
            ACL="public-read",
            Metadata={"sha256": digest},
        )

        image_url = f"{self.cfg.r2_public_base_url.rstrip('/')}/{remote_key}"
        self.log().info(f"Uploaded {file_path} to {image_url}")
        return image_url

    @staticmethod
    def sha256(path: Path) -> str:
        """Return the hex-encoded SHA-256 checksum of *path*."""
        h = hashlib.sha256()
        with path.open("rb") as fp:
            for chunk in iter(lambda: fp.read(1 << 20), b""):
                h.update(chunk)
        return h.hexdigest()

    async def close(self):
        if self._client:
            await self._client.__aexit__(None, None, None)
