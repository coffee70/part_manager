import { DBRef, ObjectId, WithId } from "mongodb"

export type FieldType =
    | 'text'
    | 'number'
    | 'date'
    | 'time'
    | 'paragraph'
    | 'select'

export type SectionCollection =
    | 'customerOrders'
    | 'shopOrders'
    | 'parts'
    | 'serials'
    | 'customers'

export type AttachmentCollection =
    | 'customerOrders'
    | 'shopOrders'
    | 'parts'
    | 'serials'

export type CustomerOrder = {
    customerId: string;
    number: string;
    notes: string;
    fields: {
        _id: string;
        value: string;
    }[];
    updatedAt: Date;
} & Attachable

export interface Attachable {
    attachments: {
        _id: ObjectId;
        filename: string;
    }[];
}

export type Customer = {
    name: string;
}

export type Section = {
    collection: SectionCollection;
    name: string;
}

export type Field = {
    sectionId: string;
    type: FieldType;
    name: string;
    description: string;
    options?: string[];
    multiple?: boolean;
    creative?: boolean;
    default?: string;
}
