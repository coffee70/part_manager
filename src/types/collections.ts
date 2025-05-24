import { ObjectId } from "mongodb"
import { ChevronDownIcon, ChevronsDownIcon, ChevronsUpIcon, ChevronUpIcon, CircleMinusIcon, LucideIcon } from 'lucide-react'
import { Route } from "@/components/route_builder/list_view/types";

export const contexts = ['models', 'routers', 'users'] as const;

export type Context = typeof contexts[number];

export const fieldtypes = ['text', 'number', 'date', 'time', 'paragraph', 'select', 'key_value'] as const;

export type FieldType = typeof fieldtypes[number];

export const priorities = ['Highest', 'High', 'Medium', 'Low', 'Lowest'] as const;

export type Priority = typeof priorities[number];

export const stepTypes = ['To-do', 'In-progress', 'Done'] as const;

export type StepType = typeof stepTypes[number];

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

export const sortKeys = ['updatedAt', 'priority', 'number'] as const;

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
    [key: string]: string | string[] | KVValue | undefined;
}

export type KVValue = {
    [key: string]: string | undefined;
}

export type Section = {
    _id: string;
    modelId?: string;
    routerId?: string;
    name: string;
}

export type SectionDoc = {
    _id: ObjectId;
    modelId?: string;
    routerId?: string;
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
    keys?: string[];
}

export type FieldDoc = {
    _id: ObjectId;
    sectionId: string;
    type: FieldType;
    name: string;
    description: string;
    options?: string[];
    multiple?: boolean;
    creative?: boolean;
    default?: string;
    keys?: string[];
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
        contextId: string;
        instanceId: string;
    }[];
};

export type RouteFieldDoc = {
    route_fields: {
        _id: ObjectId;
        name: string;
        fields: FieldDoc[];
    }[];
}

export type RouteField = {
    route_fields: {
        _id: string;
        name: string;
        fields: Field[];
    }[];
}

export interface ContextImpl {
    _id: string;
    name: string;
    color: string;
}

export type ModelDoc = {
    _id: ObjectId;
    name: string;
    attachable: boolean;
    linkable: boolean;
    commentable: boolean;
    priority: boolean;
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
    priority: boolean;
    color: string;
    route?: Route;
}

export type RouterDoc = {
    _id: ObjectId;
    name: string;
    attachable: boolean;
    linkable: boolean;
    commentable: boolean;
    color: string;
    updatedAt: Date;
    updatedBy: string;
}

export type Router = {
    _id: string;
    name: string;
    attachable: boolean;
    linkable: boolean;
    commentable: boolean;
    color: string;
}

export type InstanceDoc = {
    _id: ObjectId;
    number: string;
    priority: Priority;
    notes: string;
    route?: Route;
    updatedAt: Date;
    updatedById: string;
}
& Valuable
& CommentableDoc
& AttachableDoc
& LinkableDoc
& RouteFieldDoc

export type Instance = {
    _id: string;
    number: string;
    priority: Priority;
    notes: string;
    stepId?: string;
    updatedAt: Date;
    updatedById: string;
}
& Valuable
& RouteField

// Utility function to get entries with preserved key types
// this ensures the keys for links are typed as SectionCollection and not string
// as the Object.entries function would return
export function typedEntries<T extends {}>(obj: T): [keyof T, T[keyof T]][] {
    return Object.entries(obj) as [keyof T, T[keyof T]][];
}

export const roles = ['admin', 'user'] as const;

export type Role = typeof roles[number]

export type Create<T> = Omit<T, '_id' | 'updatedAt' | 'updatedBy'>;

export type Doc<T> = Omit<T, '_id'> & { _id: string };

export type NextServerSearchParams = { [key: string]: string | string[] | undefined }

export type ServerActionState = {
    success: true;
} | {
    success: false;
    error: string;
}