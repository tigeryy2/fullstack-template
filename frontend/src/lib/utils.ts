import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getBackendUrl = (): string => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
        return "https://api.yourdomain.com";
    } 
    
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    return "http://localhost:8000";
};
