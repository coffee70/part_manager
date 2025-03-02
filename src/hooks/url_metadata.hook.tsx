'use client'
import { isContext } from "@/lib/url";
import { usePathname, useSearchParams } from "next/navigation";

export function useAdminURL() {
    // get the context from the URL
    const path = usePathname()?.split('/');
    path.shift();
    const context = path.shift();
    if (!isContext(context)) throw new Error('URL is malformed. Not a valid context.');

    // get the model ID from the URL
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    return { context, id };
}

export function useInstanceURL() {
    // get the context from the URL
    const path = usePathname()?.split('/');
    path.shift();
    const context = path.shift();
    if (!isContext(context)) throw new Error('URL is malformed. Not a valid context.');

    // get the model ID and instance ID from the URL
    const id = usePathname()?.split('/').pop();
    if (!id) throw new Error('Model ID is required');
    const searchParams = useSearchParams();
    const instanceId = searchParams.get('id');
    
    // TODO: remove modelId from the return object
    return { context, id, instanceId, modelId: id };
}

export function useURL() {
    const path = usePathname()?.split('/');
    // remove the first empty string
    path.shift();
    const headSegment = path.shift();
    const tailSegment = usePathname()?.split('/').pop();
    return { headSegment, tailSegment };
}