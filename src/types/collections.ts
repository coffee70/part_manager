import { ObjectId } from "mongodb"
import { ChevronDownIcon, ChevronsDownIcon, ChevronsUpIcon, ChevronUpIcon, CircleMinusIcon, LucideIcon } from 'lucide-react'

export type FieldType =
    | 'text'
    | 'number'
    | 'date'
    | 'time'
    | 'paragraph'
    | 'select'

export const sectionCollections = ['customerOrders', 'shopOrders', 'parts', 'serials', 'customers'] as const;

export type SectionCollection = typeof sectionCollections[number];

export type AttachmentCollection =
    | 'customerOrders'
    | 'shopOrders'
    | 'parts'
    | 'serials'

export const priorities = ['Highest', 'High', 'Medium', 'Low', 'Lowest'] as const;

export type Priority = typeof priorities[number];

export type PriorityInfo = {
    color: string;
    Icon: LucideIcon;
}

export const priorityInfo: Record<Priority, PriorityInfo> = {
    Highest: {
        color: 'darkred',
        Icon: ChevronsUpIcon
    },
    High: {
        color: 'red',
        Icon: ChevronUpIcon
    },
    Medium: {
        color: 'orange',
        Icon: CircleMinusIcon
    },
    Low: {
        color: 'green',
        Icon: ChevronDownIcon
    },
    Lowest: {
        color: 'darkgreen',
        Icon: ChevronsDownIcon
    },
} as const;

export const sortKeys: Record<SectionCollection, readonly [string, ...string[]]> = {
    customerOrders: ['number', 'priority', 'updatedAt'] as const,
    shopOrders: ['number', 'priority', 'updatedAt'] as const,
    parts: ['number', 'updatedAt'] as const,
    serials: ['number', 'priority', 'updatedAt'] as const,
    customers: ['name', 'updatedAt'] as const,
}

export type CustomerOrder = {
    _id: string;
    customerId: string;
    number: string;
    priority: Priority;
    notes: string;
} & Valuable

export type CustomerOrderDoc = {
    _id: ObjectId;
    customerId: string;
    number: string;
    priority: Priority;
    notes: string;
    updatedAt: Date;
    updatedById: string;
}
    & Valuable
    & CommentableDoc
    & AttachableDoc

export type ShopOrder = {
    _id: string;
    number: string;
    priority: Priority;
    notes: string;
} & Valuable

export type ShopOrderDoc = {
    _id: ObjectId;
    number: string;
    priority: Priority;
    notes: string;
    updatedAt: Date;
    updatedById: string;
}
    & Valuable
    & CommentableDoc
    & AttachableDoc

export type Part = {
    _id: string;
    number: string;
    notes: string;
} & Valuable

export type PartDoc = {
    _id: ObjectId;
    number: string;
    notes: string;
    updatedAt: Date;
    updatedById: string;
}
    & Valuable
    & CommentableDoc
    & AttachableDoc

export type Serial = {
    _id: string;
    number: string;
    priority: Priority;
    notes: string;
} & Valuable

export type SerialDoc = {
    _id: ObjectId;
    number: string;
    priority: Priority;
    notes: string;
    updatedAt: Date;
    updatedById: string;
}
    & Valuable
    & CommentableDoc
    & AttachableDoc

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
    notes: string;
} & Valuable

export type CustomerDoc = {
    _id: ObjectId;
    name: string;
    notes: string;
    updatedAt: Date;
    updatedById: string;
}
& Valuable
& CommentableDoc
& AttachableDoc

export type Section = {
    _id: string;
    modelId: string;
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
}

export interface Password {
    password: string;
}

export type CommentDoc = {
    _id: ObjectId;
    userId: string;
    text: string;
    updatedAt: Date;
}

export interface CommentableDoc {
    comments: CommentDoc[];
}

export type LinkableDoc = {
    links: {
        _id: ObjectId;
        model: SectionCollection;
        modelId: string;
    }[];
};

export type ModelDoc = {
    _id: ObjectId;
    name: string;
    attachable: boolean;
    linkable: boolean;
    commentable: boolean;
    color: string;
    updatedAt: Date;
    updatedBy: string;
}

export type Model = {
    _id: string;
    name: string;
    attachable: boolean;
    linkable: boolean;
    commentable: boolean;
    color: string;
}

// Utility function to get entries with preserved key types
// this ensures the keys for links are typed as SectionCollection and not string
// as the Object.entries function would return
export function typedEntries<T extends {}>(obj: T): [keyof T, T[keyof T]][] {
    return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export type Role = 'admin' | 'user'

export const roles: Role[] = ['admin', 'user'];

export type Create<T> = Omit<T, '_id' | 'updatedAt' | 'updatedBy'>;

export type Doc<T> = Omit<T, '_id'> & { _id: string };

export type NextServerSearchParams = { [key: string]: string | string[] | undefined }