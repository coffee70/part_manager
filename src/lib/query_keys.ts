import { hasPriority } from "@/server/models/has_priority"

export const sectionKeys = {
    all: (modelId?: string | null) => modelId ? ['sections', modelId] : ['sections'],
}

export const instanceKeys = {
    all: (modelId: string) => ['instances', modelId],
    id: (modelId: string, instanceId?: string | null) => [...instanceKeys.all(modelId), instanceId]
}

export const userKeys = {
    all: () => ['users'],
    id: (id?: string) => [...userKeys.all(), id],
    current: () => [...userKeys.all(), 'current']
}

export const commentKeys = {
    all: (modelId: string, instanceId?: string | null) => ['comments', modelId, instanceId],
}

export const linkKeys = {
    all: (modelId: string, instanceId?: string | null) => ['links', modelId, instanceId],
    one: (modelId: string, linkId: string, instanceId?: string | null, ) => [...linkKeys.all(modelId, instanceId), linkId]
}

export const modelKeys = {
    all: () => ['models'],
    id: (id?: string | null) => id ? [...modelKeys.all(), id] : modelKeys.all(),
    attachable: (id?: string | null) => [...modelKeys.id(id), 'attachable'],
    linkable: (id?: string | null) => [...modelKeys.id(id), 'linkable'],
    commentable: (id?: string | null) => [...modelKeys.id(id), 'commentable'],
    hasPriority: (id?: string | null) => [...modelKeys.id(id), 'hasPriority'],

}

export const attachmentKeys = {
    all: (modelId: string, instanceId?: string | null) => ['attachments', modelId, instanceId],
    one: (modelId: string, instanceId: string, attachmentId: string) => [...attachmentKeys.all(modelId, instanceId), attachmentId]
}