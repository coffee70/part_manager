import { FieldType } from "@prisma/client";

export type Field = {
    id: number;
    name: string;
    type: FieldType;
    options?: Array<string>;
    multiple?: boolean;
    creative?: boolean;
    value?: string | Array<string>;
}

export type Section = {
    id: number;
    title: string;
    fields: Array<Field>;
}