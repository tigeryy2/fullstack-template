/**
 * Generates a URL for an image with optional transformations (Cloudflare Images compatible)
 */
export function getImageUrl(
    src: string,
    options: {
        width?: number;
        height?: number;
        quality?: number;
        format?: "webp" | "avif" | "jpeg" | "png";
    } = {},
): string {
    // TODO: Set this to your actual CDN URL
    const baseUrl = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn.example.com";

    // Avoid double-transform if already a Cloudflare Image URL
    if (src.includes("/cdn-cgi/image/")) {
        return src;
    }
    if (!src.startsWith(baseUrl)) {
        // for images not matching cdn, don't transform, return as is
        return src;
    }

    const path = src.split(baseUrl)[1]?.split("/").slice(1).join("/") || src;

    // Build the list of transformation parameters
    const paramList: string[] = [];
    paramList.push("fit=contain");
    paramList.push(`format=${options.format || "auto"}`);
    if (options.width) {
        paramList.push(`width=${options.width}`);
    }
    if (options.height) {
        paramList.push(`height=${options.height}`);
    }
    if (options.quality) {
        paramList.push(`quality=${options.quality}`);
    }

    // Join the parameters with commas
    const paramsString = paramList.join(",");

    return `${baseUrl}/cdn-cgi/image/${paramsString}/${path}`;
}

/**
 * Removes Cloudflare image transformation segments to access the original asset.
 */
export function getOriginalImageUrl(src: string): string {
    const segment = "/cdn-cgi/image/";
    if (!src || !src.includes(segment)) {
        return src;
    }

    try {
        const parsed = new URL(src);
        const [, rest] = parsed.pathname.split(segment);
        if (!rest) {
            return src;
        }
        const slashIndex = rest.indexOf("/");
        if (slashIndex === -1) {
            return src;
        }
        const assetPath = rest.slice(slashIndex + 1);
        return `${parsed.origin}/${assetPath}`;
    } catch {
        // Fallback for relative URLs or parse errors
        const [prefix, rest] = src.split(segment);
        if (!rest) return src;
        
        const slashIndex = rest.indexOf("/");
        if (slashIndex === -1) return src;
        
        const assetPath = rest.slice(slashIndex + 1);
        const normalizedPrefix = prefix.endsWith("/")
            ? prefix.slice(0, -1)
            : prefix;
        return `${normalizedPrefix}/${assetPath}`;
    }
}

/**
 * Generates a srcset string for responsive images
 */
export function generateSrcSet(
    src: string,
    widths: number[],
    options: {
        quality?: number;
        format?: "webp" | "avif" | "jpeg" | "png";
    } = {},
): string {
    return widths
        .map((width) => `${getImageUrl(src, { ...options, width })} ${width}w`)
        .join(", ");
}
