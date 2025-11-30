import { getOriginalImageUrl } from "@/lib/image-utils";

/**
 * Downloads a file from a URL with proper error handling and fallbacks
 */
export interface DownloadOptions {
    /** The URL to download the file from */
    url: string;
    /** Optional separate download URL if different from display URL */
    downloadUrl?: string;
    /** The filename to save as (without extension) */
    filename: string;
    /** The type of media being downloaded */
    type?: "image" | "video";
    /** Custom callback for handling download completion */
    onComplete?: () => void;
    /** Custom callback for handling download errors */
    onError?: (error: Error) => void;
}

/**
 * Downloads a media file with automatic extension detection and fallback mechanisms
 */
export async function downloadMediaFile(
    options: DownloadOptions,
): Promise<void> {
    const {
        url,
        downloadUrl,
        filename,
        type = "image",
        onComplete,
        onError,
    } = options;
    
    // TODO: Set this to your actual CDN URL
    const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn.example.com";

    try {
        // Use downloadUrl if provided, otherwise fall back to url
        let urlToDownload = getOriginalImageUrl(downloadUrl || url);

        // Prepend /cdn-proxy if the URL is from our CDN to bypass CORS (requires Next.js rewrite/proxy)
        if (urlToDownload.startsWith(CDN_URL)) {
            urlToDownload = `/cdn-proxy/${urlToDownload.replace(CDN_URL + "/", "")}`;
        }

        // Fetch the file data
        const response = await fetch(urlToDownload);
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        // Get the blob data
        const blob = await response.blob();

        // Determine file extension from content type or URL
        let extension = type === "image" ? "jpg" : "mp4"; // default

        const contentType = response.headers.get("content-type");
        if (contentType) {
            if (contentType.includes("png")) extension = "png";
            else if (contentType.includes("webp")) extension = "webp";
            else if (contentType.includes("gif")) extension = "gif";
            else if (
                contentType.includes("jpeg") ||
                contentType.includes("jpg")
            )
                extension = "jpg";
            else if (contentType.includes("mp4")) extension = "mp4";
            else if (contentType.includes("webm")) extension = "webm";
        }

        // Create blob URL and download
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${sanitizeFilename(filename)}.${extension}`;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);

        // Call completion callback if provided
        onComplete?.();
    } catch (error) {
        console.error("Download failed:", error);

        // Try fallback download method (direct link)
        try {
            const link = document.createElement("a");
            link.href = getOriginalImageUrl(downloadUrl || url);
            link.download = `${sanitizeFilename(filename)}.${type === "image" ? "jpg" : "mp4"}`;
            link.target = "_blank";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            onComplete?.();
        } catch (fallbackError) {
            console.error("Fallback download also failed:", fallbackError);
            const finalError = new Error(
                'Download failed. Please try right-clicking and selecting "Save as..."',
            );

            if (onError) {
                onError(finalError);
            } else {
                alert(finalError.message);
            }
        }
    }
}

/**
 * Sanitizes a filename by removing or replacing invalid characters
 */
export function sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9-_\s]/g, "_").replace(/\s+/g, "_");
}
