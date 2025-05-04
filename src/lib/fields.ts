import { FieldType, fieldtypes } from "@/types/collections";

export type FieldFormState = {
    _id?: string;
    name: string;
    sectionId: string;
    type: FieldType;
    description: string;
    multiple?: boolean;
    creative?: boolean;
    default?: string;
    options?: string[];
    keys?: string[];
}

export const typeToLabel = (type: FieldType): string => {
    return type
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export const TYPE_LABELS = fieldtypes.map(typeToLabel);

export const labelToType = (label: string): FieldType => {
    switch (label) {
        case 'Text': return 'text';
        case 'Number': return 'number';
        case 'Date': return 'date';
        case 'Time': return 'time';
        case 'Select': return 'select';
        case 'Paragraph': return 'paragraph';
        case 'Key Value': return 'key_value';
        default: {
            throw new Error('Invalid label');
        }
    }
}