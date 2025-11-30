# Stripe Integration Recipe

This recipe guides you through integrating Stripe subscriptions into your application.

## Prerequisites

1.  **Stripe Account:** Create an account at [stripe.com](https://stripe.com).
2.  **Environment Variables:**
    ```bash
    STRIPE_SECRET_KEY=sk_test_...
    STRIPE_WEBHOOK_SECRET=whsec_...
    ```

## 1. Data Models

The template includes `SubscriptionInfoModel` in `backend/models/database/subscription_info_model.py`. This model tracks:
*   Status (`active`, `canceled`, etc.)
*   Current period start/end
*   Stripe Customer and Subscription IDs

This model is embedded in the `UserModel`.

## 2. Service Layer

Use `StripeService` (`backend/services/stripe_service.py`) to:
*   Resolve Price IDs from "Lookup Keys" (recommended over hardcoding IDs).
*   Create Checkout Sessions.

## 3. Webhooks

The webhook handler is located at `backend/api/webhooks/stripe.py`.

### Setup:
1.  **Local Testing:**
    ```bash
    stripe listen --forward-to localhost:8000/webhooks/stripe
    ```
2.  **Copy Secret:** Copy the webhook signing secret to your `.env` as `STRIPE_WEBHOOK_SECRET`.

### Handling Events:
The template provides a skeleton for handling:
*   `checkout.session.completed`: Initial subscription creation.
*   `customer.subscription.updated`: Renewals, cancellations, plan changes.
*   `customer.subscription.deleted`: Expiration.

**Important:** Always rely on webhooks to update the local database status to ensure it stays in sync with Stripe.

## 4. Frontend Integration

1.  **Create Checkout:** Call your backend endpoint (e.g., `POST /billing/checkout-session`) to get a session URL.
2.  **Redirect:** Redirect the user's browser to that URL.
3.  **Portal:** Use `stripe.billing_portal.Session.create` to let users manage their own subscription.
