import { ObjectId } from "mongodb"
import { ChevronDownIcon, ChevronsDownIcon, ChevronsUpIcon, ChevronUpIcon, CircleMinusIcon, LucideIcon } from 'lucide-react'

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

export type PriorityInfo = {
    label: Priority;
    color: string;
    Icon: LucideIcon;
}

export const priorities: PriorityInfo[] = [
    {
        label: 'Highest',
        color: 'red',
        Icon: ChevronsUpIcon
    },
    {
        label: 'High',
        color: 'orange',
        Icon: ChevronUpIcon
    },
    {
        label: 'Normal',
        color: 'yellow',
        Icon: CircleMinusIcon
    },
    {
        label: 'Low',
        color: 'green',
        Icon: ChevronDownIcon
    },
    {
        label: 'Lowest',
        color: 'darkgreen',
        Icon: ChevronsDownIcon
    },
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

export type CommentDoc = {
    _id: ObjectId;
    userId: string;
    text: string;
    updatedAt: Date;
}

export interface Commentable {
    comments: CommentDoc[];
}

export type Role = 'admin' | 'user'

export const roles: Role[] = ['admin', 'user'];

export type Create<T> = Omit<T, '_id' | 'updatedAt'>

export type Doc<T> = Omit<T, '_id'> & { _id: string };