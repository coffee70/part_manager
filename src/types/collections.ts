import { ObjectId } from "mongodb"
import { ChevronDownIcon, ChevronsDownIcon, ChevronsUpIcon, ChevronUpIcon, CircleMinusIcon, LucideIcon } from 'lucide-react'
import { Route, RouteState } from "@/components/route_builder/list_view/types";
import { z } from "zod";

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
    kv_values?: KVValues;
}

export const KVValueSchema = z.record(z.string(), z.string());
export type KVValue = z.infer<typeof KVValueSchema>;

export const ValueSchema = z.union([
    z.string(),
    z.array(z.string()),
    z.undefined()
]);
export type Value = z.infer<typeof ValueSchema>;

export const ValuesSchema = z.record(z.string(), ValueSchema);
export type Values = z.infer<typeof ValuesSchema>;

export const KVValuesSchema = z.record(z.string(), KVValueSchema);
export type KVValues = z.infer<typeof KVValuesSchema>;

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

export const FieldSchema = z.object({
    _id: z.string(),
    sectionId: z.string().min(1, { message: 'Section ID is required.' }),
    type: z.enum(fieldtypes),
    name: z.string().min(1, { message: 'Field name is required.' }),
    description: z.string(),
    options: z.array(z.string()).optional(),
    multiple: z.boolean().optional(),
    creative: z.boolean().optional(),
    default: z.string().optional(),
    keys: z.array(z.string()).optional(),
})

export type Field = z.infer<typeof FieldSchema>;

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
    tableConfiguration?: ModelTableConfigurationDoc;
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
    tableConfiguration?: ModelTableConfiguration;
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
    tableConfiguration?: RouterTableConfigurationDoc;
}

export type Router = {
    _id: string;
    name: string;
    attachable: boolean;
    linkable: boolean;
    commentable: boolean;
    color: string;
    tableConfiguration?: RouterTableConfiguration;
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

export const InstanceSchema = z.object({
    _id: z.string(),
    number: z.string(),
    priority: z.enum(priorities).catch('Medium'),
    route: z.object({
        state: z.nativeEnum(RouteState),
        currentStep: z.object({
            id: z.string(),
            name: z.string(),
            type: z.enum(stepTypes),
        }).optional(),
    }).optional(),
    updatedAt: z.date(),
    updatedBy: z.string(),
    values: ValuesSchema,
    kv_values: KVValuesSchema,
    links: z.array(z.object({
        _id: z.string(),
        contextId: z.string(),
        instanceId: z.string(),
        number: z.string(),
    })).optional(),
})

export type Instance = z.infer<typeof InstanceSchema>;

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

export const NextServerSearchParamsSchema = z.record(z.string(), z.string().or(z.array(z.string())).or(z.undefined()));
export type NextServerSearchParams = z.infer<typeof NextServerSearchParamsSchema>;

export type ServerActionState = {
    success: true;
} | {
    success: false;
    error: string;
}

const systemColumnOptions = ["number", "step", "updatedBy", "links"] as const;

type SystemColumnOption = typeof systemColumnOptions[number];

// Model system columns include all options
type ModelSystemColumnOption = SystemColumnOption;

// Router system columns exclude "step"
const routerSystemColumnOptions = ["number", "updatedBy", "links"] as const;
type RouterSystemColumnOption = typeof routerSystemColumnOptions[number];

type SystemColumnInformation = Array<{
    type: SystemColumnOption;
    description: string;
}>

export const systemColumnInformation: SystemColumnInformation = [
    {
        type: "number",
        description: "The number of the instance."
    },
    {
        type: "step",
        description: "The current step of the instance."
    },
    {
        type: "updatedBy",
        description:
            "The timestamp and user of the most recent update to the instance."
    },
    {
        type: "links",
        description: "The linked instances to the instance."
    }
]

type LinksColumnDoc = {
    _id: ObjectId;
    column: "links";
    contextIds: Array<string>;
    maxLinksPerContext: number;
    order: number;
}

export type LinksColumn = {
    _id: string;
    column: "links";
    contextIds: Array<string>;
    maxLinksPerContext: number;
    order: number;
}

type ModelBaseSystemColumnDoc = {
    _id: ObjectId;
    column: Exclude<ModelSystemColumnOption, "links">;
    order: number;
}

export type ModelBaseSystemColumn = {
    _id: string;
    column: Exclude<ModelSystemColumnOption, "links">;
    order: number;
}

type RouterBaseSystemColumnDoc = {
    _id: ObjectId;
    column: Exclude<RouterSystemColumnOption, "links">;
    order: number;
}

export type RouterBaseSystemColumn = {
    _id: string;
    column: Exclude<RouterSystemColumnOption, "links">;
    order: number;
}

type ModelSystemColumnDoc = ModelBaseSystemColumnDoc | LinksColumnDoc

export type ModelSystemColumn = ModelBaseSystemColumn | LinksColumn

type RouterSystemColumnDoc = RouterBaseSystemColumnDoc | LinksColumnDoc

export type RouterSystemColumn = RouterBaseSystemColumn | LinksColumn

type IntrinsicFieldColumnDoc = {
    _id: ObjectId;
    fieldId: string;
    order: number;
}

export type IntrinsicFieldColumn = {
    _id: string;
    fieldId: string;
    order: number;
}

export type ModelTableConfigurationDoc = {
    systemColumns: Array<ModelSystemColumnDoc>;
    intrinsicFieldColumns: Array<IntrinsicFieldColumnDoc>;
}

export type ModelTableConfiguration = {
    systemColumns: Array<ModelSystemColumn>;
    intrinsicFieldColumns: Array<IntrinsicFieldColumn>;
}

export type RouterTableConfigurationDoc = {
    systemColumns: Array<RouterSystemColumnDoc>;
    intrinsicFieldColumns: Array<IntrinsicFieldColumnDoc>;
}

export type RouterTableConfiguration = {
    systemColumns: Array<RouterSystemColumn>;
    intrinsicFieldColumns: Array<IntrinsicFieldColumn>;
}

export const defaultModelConfiguration: ModelTableConfiguration = {
    systemColumns: [
        {
            _id: "default-number",
            column: "number",
            order: 1
        },
        {
            _id: "default-step",
            column: "step",
            order: 2
        },
        {
            _id: "default-updatedBy",
            column: "updatedBy",
            order: 3
        }
    ],
    intrinsicFieldColumns: []
}

export const defaultRouterConfiguration: RouterTableConfiguration = {
    systemColumns: [
        {
            _id: "default-router-number",
            column: "number",
            order: 1
        },
        {
            _id: "default-router-updatedBy",
            column: "updatedBy",
            order: 2
        }
    ],
    intrinsicFieldColumns: []
}

// Zod Schemas for Table Configuration Types

export const LinksColumnSchema = z.object({
    _id: z.string(),
    column: z.literal("links"),
    contextIds: z.array(z.string()),
    maxLinksPerContext: z.number(),
    order: z.number(),
});

export const ModelBaseSystemColumnSchema = z.object({
    _id: z.string(),
    column: z.enum(["number", "step", "updatedBy"]),
    order: z.number(),
});

export const RouterBaseSystemColumnSchema = z.object({
    _id: z.string(),
    column: z.enum(["number", "updatedBy"]),
    order: z.number(),
});

export const ModelSystemColumnSchema = z.union([
    ModelBaseSystemColumnSchema,
    LinksColumnSchema,
]);

export const RouterSystemColumnSchema = z.union([
    RouterBaseSystemColumnSchema,
    LinksColumnSchema,
]);

export const IntrinsicFieldColumnSchema = z.object({
    _id: z.string(),
    fieldId: z.string(),
    order: z.number(),
});

export const ModelTableConfigurationSchema = z.object({
    systemColumns: z.array(ModelSystemColumnSchema),
    intrinsicFieldColumns: z.array(IntrinsicFieldColumnSchema),
});

export const RouterTableConfigurationSchema = z.object({
    systemColumns: z.array(RouterSystemColumnSchema),
    intrinsicFieldColumns: z.array(IntrinsicFieldColumnSchema),
});