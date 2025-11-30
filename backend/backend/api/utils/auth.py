from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from google.auth.transport import requests
from google.oauth2 import id_token

from backend.models.database.user_model import UserModel
from backend.utils.config import AppConfig
from backend.utils.loggable import Loggable

security = HTTPBearer(auto_error=False)


def verify_google_token(token: str, client_id: str) -> dict:
    try:
        id_info = id_token.verify_oauth2_token(token, requests.Request(), client_id)

        return id_info

    except ValueError as e:
        Loggable.log().error(f"Token validation error: {e}")

        raise HTTPException(status_code=401, detail="Invalid token") from e


async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
) -> UserModel:
    """


    Validate the Bearer token (Google ID Token) and retrieve the user.


    """

    if not creds or creds.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    cfg = AppConfig.from_env()  # noqa: F841

    # TODO: Add google_client_id to AppConfig

    client_id = "YOUR_GOOGLE_CLIENT_ID"

    payload = verify_google_token(creds.credentials, client_id)
    google_id = payload.get("sub")

    # Here you would typically use your Repo to find the user
    # repo = BaseMongoRepo(...)
    # user = await repo.get_user(auth_user_id=google_id)

    # Mock return for template purposes
    user = UserModel(
        full_name=payload.get("name"),
        email=payload.get("email"),
        auth_user_id=google_id,
    )
    return user
