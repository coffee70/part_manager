'use client'
import { collectionToName, urlToCollection } from "@/lib/conversions";
import { usePathname, useSearchParams } from "next/navigation";

export function useURLMetadata() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const urlCollection = usePathname()?.split('/').pop();

    if (!urlCollection) {
        throw new Error('URL is malformed! There should be a collection in the URL.');
    }

    const collection = urlToCollection[urlCollection];

    const name = collectionToName[collection];

    return { id, collection, name };
}

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