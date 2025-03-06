import { Context } from "@/types/collections"

export const sectionKeys = {
    all: (context: Context, id?: string | null) => id ? ['sections', context, id] : ['sections', context],
}

export const instanceKeys = {
    all: (context: Context, id: string | null) => ['instances', context, id],
    id: (context: Context, id: string | null, instanceId?: string | null) => [...instanceKeys.all(context, id), instanceId]
}

export const userKeys = {
    all: () => ['users'],
    id: (id?: string) => [...userKeys.all(), id],
    current: () => [...userKeys.all(), 'current']
}

export const commentKeys = {
    all: (context: Context, id: string, instanceId?: string | null) => ['comments', context, id, instanceId],
}

export const linkKeys = {
    all: (context: Context, id: string, instanceId?: string | null) => ['links', context, id, instanceId],
    one: (context: Context, id: string, linkId: string, instanceId?: string | null) => [...linkKeys.all(context, id, instanceId), linkId]
}

export const modelKeys = {
    all: () => ['models'],
    id: (id?: string | null) => id ? [...modelKeys.all(), id] : modelKeys.all(),
    attachable: (id?: string | null) => [...modelKeys.id(id), 'attachable'],
    linkable: (id?: string | null) => [...modelKeys.id(id), 'linkable'],
    commentable: (id?: string | null) => [...modelKeys.id(id), 'commentable'],
    hasPriority: (id?: string | null) => [...modelKeys.id(id), 'hasPriority'],
}

export const routerKeys = {
    all: () => ['routers'],
    id: (id?: string | null) => id ? [...routerKeys.all(), id] : routerKeys.all(),
    attachable: (id?: string | null) => [...routerKeys.id(id), 'attachable'],
    linkable: (id?: string | null) => [...routerKeys.id(id), 'linkable'],
    commentable: (id?: string | null) => [...routerKeys.id(id), 'commentable'],
}

export const contextKeys = {
    all: (context: Context) => context === "models" ? modelKeys.all() : routerKeys.all(),
    id: (context: Context, id?: string | null) => context === "models" ? modelKeys.id(id) : routerKeys.id(id),
    attachable: (context: Context, id?: string | null) => context === "models" ? modelKeys.attachable(id) : routerKeys.attachable(id),
    linkable: (context: Context, id?: string | null) => context === "models" ? modelKeys.linkable(id) : routerKeys.linkable(id),
    commentable: (context: Context, id?: string | null) => context === "models" ? modelKeys.commentable(id) : routerKeys.commentable(id),
    hasPriority: (context: Context, id?: string | null) => context === "models" ? modelKeys.hasPriority(id) : [],
}

export const attachmentKeys = {
    all: (context: Context, id: string, instanceId?: string | null) => ['attachments', context, id, instanceId],
    one: (context: Context, id: string, instanceId: string, attachmentId: string) => [...attachmentKeys.all(context, id, instanceId), attachmentId]
}

export const routeKeys = {
    id: (modelId: string | null) => ['route', modelId],
}