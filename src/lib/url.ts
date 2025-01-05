export function instanceURL(modelId: string, instanceId?: string | null) {
    if (!instanceId) return `/instances/${modelId}`;
    return `/instances/${modelId}?id=${instanceId}`;
}