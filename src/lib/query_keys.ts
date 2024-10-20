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