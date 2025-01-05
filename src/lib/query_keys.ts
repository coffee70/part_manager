import { SectionCollection } from "@/types/collections";

export const sectionKeys = {
    all: (modelId?: string | null) => modelId ? ['sections', modelId] : ['sections'],
}

export const collectionKeys = {
    all: (collection: SectionCollection) => [collection],
    id: (collection: SectionCollection, id?: string | null) => [collection, id]
}

export const userKeys = {
    all: () => ['users'],
    id: (id?: string) => [...userKeys.all(), id],
    current: () => [...userKeys.all(), 'current']
}

export const commentKeys = {
    all: (collection: SectionCollection, id?: string | null) => [collection, id, 'comments']
}

export const linkKeys = {
    all: (collection: SectionCollection, id?: string | null) => [collection, id, 'links'],
    one: (collection: SectionCollection, linkId: string, id?: string | null) => [collection, id, linkId]
}

export const modelKeys = {
    all: () => ['models'],
    id: (id?: string | null) => id ? [...modelKeys.all(), id] : modelKeys.all()
}