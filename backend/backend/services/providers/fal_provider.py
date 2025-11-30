import base64
import hashlib
import time
from dataclasses import dataclass, field

import aiohttp
import fal_client
from nacl.encoding import HexEncoder
from nacl.exceptions import BadSignatureError
from nacl.signing import VerifyKey

from backend.utils.config import AppConfig
from backend.utils.loggable import Loggable


@dataclass(slots=True)
class FALProvider(Loggable):
    cfg: AppConfig
    _client: aiohttp.ClientSession | None = field(default=None, init=False)

    async def _get_client(self) -> aiohttp.ClientSession:
        if self._client is None:
            self._client = aiohttp.ClientSession()
        return self._client

    async def generate(
        self, model_endpoint: str, arguments: dict, webhook_url: str | None = None
    ) -> str:
        """
        Submit a job to FAL.ai.
        """
        handler = await fal_client.submit_async(
            model_endpoint,
            arguments=arguments,
            webhook_url=webhook_url,
        )
        if handler.request_id is None:
            raise Exception("FAL handler request ID is None")

        return handler.request_id

    JWKS_URL = "https://rest.alpha.fal.ai/.well-known/jwks.json"
    JWKS_CACHE_DURATION = 24 * 60 * 60  # 24 hours in seconds
    _jwks_cache = None
    _jwks_cache_time = 0

    @classmethod
    async def fetch_jwks(cls) -> list:
        current_time = time.time()
        if (
            cls._jwks_cache is None
            or (current_time - cls._jwks_cache_time) > cls.JWKS_CACHE_DURATION
        ):
            async with (
                aiohttp.ClientSession() as session,
                session.get(cls.JWKS_URL, timeout=10) as response,
            ):
                response.raise_for_status()
                cls._jwks_cache = (await response.json()).get("keys", [])
                cls._jwks_cache_time = current_time
        return cls._jwks_cache

    @classmethod
    async def verify_webhook_signature(
        cls,
        request_id: str,
        user_id: str,
        timestamp: str,
        signature_hex: str,
        body: bytes,
    ) -> bool:
        """
        Verify the signature of a FAL webhook request.
        """
        # Validate timestamp (within ±5 minutes)
        try:
            timestamp_int = int(timestamp)
            current_time = int(time.time())
            if abs(current_time - timestamp_int) > 300:
                Loggable.log().error("Timestamp is too old or in the future.")
                return False
        except ValueError:
            Loggable.log().error("Invalid timestamp format.")
            return False

        # Construct the message to verify
        try:
            message_parts = [
                request_id,
                user_id,
                timestamp,
                hashlib.sha256(body).hexdigest(),
            ]
            if any(part is None for part in message_parts):
                Loggable.log().error("Missing required header value.")
                return False
            message_to_verify = "\n".join(message_parts).encode("utf-8")
        except Exception as e:
            Loggable.log().error(f"Error constructing message: {e}")
            return False

        # Decode signature
        try:
            signature_bytes = bytes.fromhex(signature_hex)
        except ValueError:
            Loggable.log().error("Invalid signature format (not hexadecimal).")
            return False

        # Fetch public keys
        try:
            public_keys_info = await cls.fetch_jwks()
            if not public_keys_info:
                Loggable.log().error("No public keys found in JWKS.")
                return False
        except Exception as e:
            Loggable.log().error(f"Error fetching JWKS: {e}")
            return False

        # Verify signature with each public key
        for key_info in public_keys_info:
            try:
                public_key_b64url = key_info.get("x")
                if not isinstance(public_key_b64url, str):
                    continue
                # Pad base64 if needed
                padded = public_key_b64url + "=" * (4 - len(public_key_b64url) % 4)
                public_key_bytes = base64.urlsafe_b64decode(padded)

                verify_key = VerifyKey(public_key_bytes.hex(), encoder=HexEncoder)
                verify_key.verify(message_to_verify, signature_bytes)
                return True
            except (BadSignatureError, Exception):
                # Loggable.log().error(f"Verification failed with a key: {e}")
                continue

        Loggable.log().error("Signature verification failed with all keys.")
        return False
