'use client'
import { isContext } from "@/lib/url";
import { usePathname, useSearchParams } from "next/navigation";

export function useAdminURL() {
    // get the context from the URL
    const path = usePathname()?.split('/');
    // remove the first empty string
    path.shift();
    const context = path.shift();
    if (!isContext(context)) throw new Error('URL is malformed. Not a valid context.');

    // get the model ID from the URL
    const searchParams = useSearchParams();
    const modelId = searchParams.get('id');

    return { context, modelId };
}

export function useInstanceURL() {
    const modelId = usePathname()?.split('/').pop();
    if (!modelId) throw new Error('Model ID is required');
    const searchParams = useSearchParams();
    const instanceId = searchParams.get('id');

    return { modelId, instanceId };
}

export function useURL() {
    const path = usePathname()?.split('/');
    // remove the first empty string
    path.shift();
    const headSegment = path.shift();
    const tailSegment = usePathname()?.split('/').pop();
    return { headSegment, tailSegment };
}