import { FieldType, SectionCollection } from "@/types/collections";

export type Field = {
    _id: string;
    name: string;
    type: FieldType;
    options?: string[];
    multiple?: boolean;
    creative?: boolean;
    value?: string | string[];
}

export type Section = {
    _id: string;
    name: string;
    fields: Field[];
}