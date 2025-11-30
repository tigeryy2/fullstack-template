# FAL.ai Integration

This recipe covers generating media using FAL.ai and handling asynchronous results via webhooks.

## Prerequisites

1.  **FAL Key:** Get an API key from [fal.ai](https://fal.ai).
2.  **Environment:** `FAL_KEY=...`

## 1. Submitting Jobs

Use the `fal-client` Python library or raw HTTP requests.

```python
import fal_client

async def generate_image(prompt: str, webhook_url: str):
    handler = await fal_client.submit_async(
        "fal-ai/flux/dev",
        arguments={"prompt": prompt},
        webhook_url=webhook_url
    )
    return handler.request_id
```

## 2. Webhook Handler

FAL sends a POST request to your webhook URL when generation is complete.

**File:** `backend/api/webhooks/fal.py` (Create this based on the pattern below)

```python
@router.post("/webhooks/fal")
async def fal_webhook(request: Request):
    # 1. Verify Signature (Critical for security)
    # ... use FALProvider.verify_webhook_signature ...

    # 2. Parse Payload
    data = await request.json()
    request_id = data.get("request_id")
    status = data.get("status")

    if status == "OK":
        image_url = data["payload"]["images"][0]["url"]
        # 3. Download and Save to R2
        # 4. Update Database Record
```

## 3. Client-Side Updates

Since generation is async, the frontend should poll for status updates or use a WebSocket/Server-Sent Events (SSE) if real-time updates are needed. The template's `MongoRepo` pattern allows efficient polling by `request_id`.
