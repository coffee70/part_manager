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

/**
 * Hook to extract modelId, instanceId and stepId from a routing URL
 * 
 * Parses the URL pattern: /models/instances/[modelId]/routing/[instanceId]?stepId=[stepId]
 * 
 * @returns {Object} An object containing:
 *   - modelId: The ID of the model extracted from the URL path
 *   - instanceId: The ID of the instance extracted from the URL path
 *   - stepId: The ID of the step extracted from the URL path
 * 
 * @throws {Error} If modelId or instanceId are missing or not strings
 * 
 * @example
 * const { modelId, instanceId, stepId } = useModelInstanceRoutingURL();
 * // Use these values to fetch data specific to this model instance
 */
export function useModelInstanceRoutingURL() {
    const path = usePathname()?.split("/");
    const searchParams = useSearchParams();
    const stepId = searchParams.get('stepId');

    // Remove empty first segment
    path.shift();
    
    // Extract path segments
    const modelId = path[2];
    const instanceId = path[4];

    // Validate that modelId and instanceId are present
    if (!modelId || typeof modelId !== 'string') {
        throw new Error('ModelId is required and must be a string');
    }
    
    if (!instanceId || typeof instanceId !== 'string') {
        throw new Error('InstanceId is required and must be a string');
    }
    
    return { modelId, instanceId, stepId };
}

export function useURL() {
    const path = usePathname()?.split('/');
    // remove the first empty string
    path.shift();
    const headSegment = path.shift();
    const tailSegment = usePathname()?.split('/').pop();
    return { headSegment, tailSegment };
}