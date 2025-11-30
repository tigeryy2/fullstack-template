# Utilities & Common Patterns

## Backend

### Cloudflare R2 / S3 Storage

The template includes a pre-built service for handling file uploads to S3-compatible storage (specifically Cloudflare R2).

**File:** `backend/services/blob_storage.py`

**Configuration:**
Set the following environment variables in `.env`:
```bash
R2_ACCESS_KEY=your_access_key
R2_SECRET_KEY=your_secret_key
R2_BUCKET=your_bucket_name
R2_ENDPOINT_URL=https://<account_id>.r2.cloudflarestorage.com
R2_PUBLIC_BASE_URL=https://cdn.yourdomain.com
```

**Usage:**
```python
from backend.services.blob_storage import R2Storage
from backend.utils.config import AppConfig

@app.post("/upload")
async def upload_file(file: UploadFile):
    config = AppConfig.from_env()
    storage = R2Storage(cfg=config)
    
    # Saves to <bucket>/<prefix>/<filename>
    url = await storage.upload(
        file_path=Path("/tmp/tempfile"), 
        key_prefix="uploads",
        filename=file.filename
    )
    return {"url": url}
```

### MongoDB Repository Pattern

A generic repository pattern is provided to manage MongoDB connections and collections.

**File:** `backend/services/repository.py`

**Configuration:**
```bash
MONGODB_URI=mongodb+srv://...
APP_ENV=dev
```

**Usage:**
1. Extend `BaseMongoRepo` for your specific needs:
```python
from backend.services.repository import BaseMongoRepo

class UserRepo(BaseMongoRepo):
    def get_users_collection(self):
        return self.database.get_collection("users")
        
    async def get_user(self, uuid: str):
        return await self.get_users_collection().find_one({"uuid": uuid})
```

2. Initialize in your dependency injection or main application logic.

## Frontend

### Cloudflare Image Transformations

Utilities for generating optimized image URLs using Cloudflare Images.

**File:** `src/lib/image-utils.ts`

**Usage:**
```typescript
import { getImageUrl } from "@/lib/image-utils";

// Returns: https://cdn.domain.com/cdn-cgi/image/width=800,format=webp/path/to/image.jpg
const url = getImageUrl("https://cdn.domain.com/path/to/image.jpg", {
    width: 800,
    format: "webp"
});
```

### File Downloads

A helper to handle file downloads, including a CORS proxy workaround pattern if needed.

**File:** `src/lib/download-utils.ts`

**Usage:**
```typescript
import { downloadMediaFile } from "@/lib/download-utils";

const handleDownload = async () => {
    await downloadMediaFile({
        url: "https://cdn.domain.com/image.jpg",
        filename: "my-image",
        type: "image"
    });
};
```

### Backend URL Resolution

Helper to get the correct API URL based on the environment.

**File:** `src/lib/utils.ts`

**Usage:**
```typescript
import { getBackendUrl } from "@/lib/utils";

const apiUrl = getBackendUrl(); // Returns localhost:8000 in dev, production URL in prod
```
