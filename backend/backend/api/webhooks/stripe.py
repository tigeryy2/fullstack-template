import stripe
from fastapi import APIRouter, HTTPException, Request

from backend.services.stripe_service import StripeService
from backend.utils.config import AppConfig

router = APIRouter(tags=["webhooks"])


@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    cfg = AppConfig.from_env()
    stripe_svc = StripeService(cfg)  # noqa: F841

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, cfg.stripe_webhook_secret
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload") from e
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature") from e

    # Idempotency check could go here (see recipes)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]  # noqa: F841
        # Handle successful checkout
        pass

    elif event["type"] in [
        "customer.subscription.updated",
        "customer.subscription.deleted",
    ]:
        sub_data = event["data"]["object"]  # noqa: F841
        # Update user subscription
        # You would typically need a Repo instance here to update the DB
        # user_uuid = sub_data.get("metadata", {}).get("user_uuid")

    return {"status": "success"}
