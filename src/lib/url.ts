export type URLSetter = (...args: any[]) => string;

export const instanceURL: URLSetter = (modelId: string, instanceId?: string | null) => {
    if (!instanceId) return `/instances/${modelId}`;
    return `/instances/${modelId}?id=${instanceId}`;
}

export const fieldURL: URLSetter = (modelId: string) => {
    if (!modelId) return `/fields`;
    return `/fields?modelId=${modelId}`;
}

export const routeURL: URLSetter = (modelId: string) => {
    if (!modelId) return `/routes`;
    return `/routes?modelId=${modelId}`;
}
