import { LuciaUser } from "@/lib/auth"
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
} 
& Attachable
& Valuable

export interface Attachable {
    attachments?: {
        _id: ObjectId;
        filename: string;
    }[];
}

export interface Valuable {
    values: Values;
}

export type Values = {
    [key: string]: string | string[] | undefined;
}

export type Customer = {
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

export interface UserDoc extends LuciaUser {
    name: string;
    title: string;
    role: Role;
    password_hash: string;
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