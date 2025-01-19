'use client'
import { usePathname, useSearchParams } from "next/navigation";

export function useFieldURL() {
    const searchParams = useSearchParams();
    const modelId = searchParams.get('modelId');

    return { modelId };
}

export function useInstanceURL() {
    const modelId = usePathname()?.split('/').pop();
    if (!modelId) throw new Error('Model ID is required');
    const searchParams = useSearchParams();
    const instanceId = searchParams.get('id');

    return { modelId, instanceId };
}

export function useURL() {
    const modelId = usePathname()?.split('/').pop();
    return { modelId };
}