import { ObjectId } from "mongodb"

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

export type Priority = 
    | 'Lowest'
    | 'Low'
    | 'Normal'
    | 'High'
    | 'Highest'

const priorities: Priority[] = [
    'Lowest',
    'Low',
    'Normal',
    'High',
    'Highest'
]

export type CustomerOrder = {
    customerId: string;
    number: string;
    priority: Priority;
    notes: string;
} & Valuable

export type CustomerOrderDoc = {
    _id: ObjectId;
    customerId: ObjectId;
    number: string;
    priority: Priority;
    notes: string;
}

export interface Attachable {
    attachments: {
        name: string;
        url: string;
    }[];
};

export interface AttachableDoc {
    attachments?: {
        _id: ObjectId;
        filename: string;
    }[];
};

export interface Valuable {
    values: Values;
}

export type Values = {
    [key: string]: string | string[] | undefined;
}

export type Customer = {
    _id: string;
    name: string;
}

export type CustomerDoc = {
    _id: ObjectId;
    name: string;
}

export type Section = {
    _id: string;
    collection: SectionCollection;
    name: string;
}

export type Field = {
    _id: string;
    sectionId: string;
    type: FieldType;
    name: string;
    description: string;
    options?: string[];
    multiple?: boolean;
    creative?: boolean;
    default?: string;
}

export interface UserDoc {
    _id: string;
    username: string;
    password_hash: string;
    name: string;
    title: string;
    role: Role;
}

export interface SessionDoc {
    _id: string;
    expires_at: Date;
    user_id: string;
}

export interface User {
    _id: string;
    name: string;
    username: string;
    title: string;
    role: Role;
    password: string;
}

export type Role = 'admin' | 'user'

export const roles: Role[] = ['admin', 'user'];

export type Create<T> = Omit<T, '_id'>

export type Doc<T> = Omit<T, '_id'> & { _id: string };