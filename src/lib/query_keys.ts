import { SectionCollection } from "@/types/collections";

export const sectionKeys = {
    all: (collection: SectionCollection) => ['sections', collection],
}

export const collectionKeys = {
    all: (collection: SectionCollection) => [collection],
    id: (collection: SectionCollection, id?: string | null) => [collection, id]
}

export const userKeys = {
    all: ['users'],
    current: ['user']
}

export const commentKeys = {
    all: (collection: SectionCollection, id?: string | null) => [collection, id, 'comments']
}

export const linkKeys = {
    all: (collection: SectionCollection, id?: string | null) => [collection, id, 'links'],
    one: (collection: SectionCollection, linkId: string, id?: string | null) => [collection, id, linkId]
}